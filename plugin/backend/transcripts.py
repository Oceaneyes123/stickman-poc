"""Validated identities and local transcript formats; no network operations."""
import html
import json
import math
import re
from urllib.parse import parse_qs, urlsplit

from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Literal

VIDEO_ID = re.compile(r"[A-Za-z0-9_-]{11}\Z")
LANGUAGE = re.compile(r"[a-z]{2,3}\Z")
MAX_TRANSCRIPT = 5 * 1024 * 1024


def video_id(value: str) -> str:
    value = value.strip()
    if VIDEO_ID.fullmatch(value):
        return value
    parsed = urlsplit(value)
    if (parsed.scheme != "https" or parsed.hostname not in
            {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"}
            or parsed.username or parsed.password or parsed.port not in (None, 443)):
        raise ValueError("Use a YouTube HTTPS watch/shorts/live URL or an 11-character video ID.")
    if parsed.hostname == "youtu.be":
        candidate = parsed.path.strip("/")
    elif parsed.path == "/watch":
        candidate = parse_qs(parsed.query).get("v", [""])[0]
    else:
        match = re.fullmatch(r"/(?:shorts|live|embed)/([\w-]+)/?", parsed.path)
        candidate = match[1] if match else ""
    if not VIDEO_ID.fullmatch(candidate):
        raise ValueError("Invalid YouTube video ID.")
    return candidate


class Options(BaseModel):
    model_config = ConfigDict(extra="forbid")
    model: Literal["tiny", "base", "small", "medium"] = "small"
    device: Literal["cpu", "cuda"] = "cpu"
    language: str | None = None
    word_timestamps: bool = False
    retain_audio: bool = False
    force_whisper: bool = False

    @field_validator("language", mode="before")
    @classmethod
    def valid_language(cls, value):
        if value in (None, "", "auto"):
            return None
        if not isinstance(value, str) or not LANGUAGE.fullmatch(value):
            raise ValueError("Use a lowercase Whisper language code, such as en or tl, or auto.")
        # Full support validation happens before decoding, using Whisper's language list.
        return value


class TranscriptRequest(Options):
    url: str = Field(min_length=1, max_length=2048)

    @field_validator("url")
    @classmethod
    def valid_url(cls, value):
        video_id(value)
        return value


class UploadOptions(Options):
    kind: Literal["audio", "transcript"]


def seconds(value: str) -> float:
    parts = value.replace(",", ".").split(":")
    if len(parts) not in (2, 3) or any(not re.fullmatch(r"\d+(?:\.\d+)?", part) for part in parts):
        raise ValueError("Invalid subtitle timestamp.")
    if any(float(part) >= 60 for part in parts[1:]):
        raise ValueError("Invalid subtitle minutes or seconds.")
    result = 0.0
    for part in parts:
        result = result * 60 + float(part)
    return result


def validate_segments(segments: list) -> list[dict]:
    if not isinstance(segments, list) or len(segments) > 100000:
        raise ValueError("Transcript must contain at most 100,000 segments.")
    result = []
    for segment in segments:
        if not isinstance(segment, dict) or not isinstance(segment.get("text"), str):
            raise ValueError("Every transcript segment needs text.")
        text = segment["text"].strip()
        if not text:
            continue
        start, end = segment.get("start"), segment.get("end")
        untimed = start is None and end is None
        if not untimed and not (isinstance(start, (int, float)) and not isinstance(start, bool)
                and isinstance(end, (int, float)) and not isinstance(end, bool)
                and math.isfinite(start) and math.isfinite(end) and 0 <= start < end):
            raise ValueError("Segment times must be finite and satisfy 0 ≤ start < end, or both be null.")
        clean = {"start": start, "end": end, "text": text}
        if "words" in segment:
            if not isinstance(segment["words"], list):
                raise ValueError("Word timestamps must be an array.")
            words = []
            for word in segment["words"]:
                if (not isinstance(word, dict) or not isinstance(word.get("word"), str)
                        or not isinstance(word.get("start"), (int, float))
                        or not isinstance(word.get("end"), (int, float))
                        or not math.isfinite(word["start"]) or not math.isfinite(word["end"])
                        or untimed or not start <= word["start"] <= word["end"] <= end + .001):
                    raise ValueError("Invalid word timestamps.")
                words.append({"start": word["start"], "end": word["end"], "word": word["word"]})
            clean["words"] = words
        result.append(clean)
    if not result:
        raise ValueError("Transcript is empty or no speech was detected.")
    return sorted(result, key=lambda item: item["start"] if item["start"] is not None else float("inf"))


def parse_subtitles(text: str, rolling: bool = False) -> list[dict]:
    segments = []
    previous_words = []
    previous_end = -1.0
    for block in re.split(r"\n\s*\n", text.replace("\r\n", "\n").lstrip("\ufeff")):
        lines = block.strip().splitlines()
        if not lines or lines[0].startswith(("NOTE", "STYLE", "REGION")):
            continue
        timing = next((i for i, line in enumerate(lines) if "-->" in line), None)
        if timing is None:
            continue
        match = re.match(r"\s*([\d:.,]+)\s+-->\s+([\d:.,]+)", lines[timing])
        if not match:
            raise ValueError("Malformed subtitle cue.")
        start, end = seconds(match[1]), seconds(match[2])
        content = html.unescape(re.sub(r"<[^>]*>", "", " ".join(lines[timing + 1:]))).strip()
        words = content.split()
        original_words = words[:]
        if rolling and start < previous_end:
            overlap = next((count for count in range(min(len(previous_words), len(words)), 0, -1)
                            if previous_words[-count:] == words[:count]), 0)
            words = words[overlap:]
            if not words and segments:
                segments[-1]["end"] = max(segments[-1]["end"], end)
        if words:
            segments.append({"start": start, "end": end, "text": " ".join(words)})
        previous_words, previous_end = original_words, end
    return validate_segments(segments)


def import_transcript(contents: bytes, suffix: str) -> list[dict]:
    if len(contents) > MAX_TRANSCRIPT:
        raise ValueError("Transcript uploads are limited to 5 MiB.")
    text = contents.decode("utf-8-sig")
    if suffix == ".json":
        document = json.loads(text)
        return validate_segments(document.get("segments") if isinstance(document, dict) else document)
    if suffix in {".vtt", ".srt"}:
        return parse_subtitles(text)
    if suffix == ".txt":
        # Plain text has no timing evidence. Never manufacture synchronization.
        return validate_segments([{"start": None, "end": None, "text": text}])
    raise ValueError("Upload a UTF-8 JSON, VTT, SRT, or TXT transcript.")


def srt_timestamp(time: float) -> str:
    milliseconds = round(time * 1000)
    return f"{milliseconds // 3600000:02}:{milliseconds // 60000 % 60:02}:{milliseconds // 1000 % 60:02},{milliseconds % 1000:03}"


def sidecars(document: dict) -> dict[str, bytes]:
    segments = validate_segments(document["segments"])
    document = {**document, "segments": segments}
    timed = [segment for segment in segments if segment["start"] is not None]
    srt = "\n\n".join(f"{i}\n{srt_timestamp(segment['start'])} --> {srt_timestamp(segment['end'])}\n{segment['text']}"
                       for i, segment in enumerate(timed, 1))
    return {
        "transcript.txt": ("\n".join(segment["text"] for segment in segments) + "\n").encode("utf-8"),
        "transcript.srt": (srt + "\n" if srt else "").encode("utf-8"),
        "transcript.json": json.dumps(document, ensure_ascii=False, indent=2, allow_nan=False).encode("utf-8"),
    }
