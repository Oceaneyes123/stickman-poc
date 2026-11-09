"""Record local ASR word/sentence timing against a completed narration master."""

import argparse
import hashlib
import json
import math
import re
import sys
import time
import wave
from difflib import SequenceMatcher
from importlib.metadata import version
from pathlib import Path


def sha256(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def save_json(path, data):
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    temporary.replace(path)


def load_inputs(script, directory):
    manifest = json.loads((directory / "manifest.json").read_text(encoding="utf-8-sig"))
    draft = json.loads((directory / "cues.draft.json").read_text(encoding="utf-8-sig"))
    script_hash = sha256(script)
    audio_hash = sha256(directory / "narration.wav")
    if not manifest.get("complete") or not draft.get("complete"):
        raise ValueError("Narration must be complete before recording timing")
    if manifest["scriptHash"] != script_hash or draft["scriptHash"] != script_hash:
        raise ValueError(
            "Script hash changed; regenerate narration before recording timing"
        )
    if draft["sourceAudioSha256"] != audio_hash:
        raise ValueError(
            "Master audio hash changed; regenerate its paragraph manifest and draft"
        )
    parts = re.split(r"\r?\n\s*\r?\n", script.read_text(encoding="utf-8-sig").strip())
    segments = manifest["segments"]
    if len(segments) != manifest["totalParagraphs"] or len(segments) != len(parts):
        raise ValueError("Paragraph count does not match the script")
    with wave.open(str(directory / "narration.wav"), "rb") as audio:
        rate, samples = audio.getframerate(), audio.getnframes()
        if audio.getnchannels() != 1 or audio.getsampwidth() != 2:
            raise ValueError("Expected the runner's mono PCM16 master WAV")
    if rate != manifest["sampleRate"] or samples != sum(
        item["samples"] for item in segments
    ):
        raise ValueError("Master sample count does not match paragraph assembly")
    ids = set()
    for part, segment in zip(parts, segments):
        if segment["id"] in ids or not re.fullmatch(r"[A-Za-z0-9_-]+", segment["id"]):
            raise ValueError("Paragraph IDs must be unique and filename-safe")
        ids.add(segment["id"])
        if (
            " ".join(part.split()) != segment["text"]
            or not isinstance(segment["samples"], int)
            or segment["samples"] <= 0
        ):
            raise ValueError(f"Invalid paragraph metadata: {segment['id']}")
        path = (directory / segment["file"]).resolve()
        if (
            not path.is_relative_to(directory.resolve())
            or sha256(path) != segment["audioHash"]
        ):
            raise ValueError(f"Paragraph audio integrity failed: {segment['id']}")
    return manifest, rate, samples, script_hash, audio_hash


def phrase_cues(words, paragraph_id, offset_samples, rate, duration_samples):
    result, phrases, phrase = [], [], []
    previous_end = 0
    for index, word in enumerate(words, 1):
        start, end = word["start"], word["end"]
        if (
            not all(math.isfinite(value) for value in (start, end))
            or start < previous_end
            or start >= duration_samples / rate
            or end <= start
            or end > duration_samples / rate + 0.05
            or not word["text"].strip()
        ):
            raise ValueError(
                f"Invalid ASR word timing in {paragraph_id}, word {index}; inspect the saved recognition checkpoint"
            )
        previous_end = end
        item = {
            "id": f"{paragraph_id}-w{index:03}",
            "text": word["text"],
            "startMs": (offset_samples + start * rate) * 1000 / rate,
            "endMs": (offset_samples + min(end * rate, duration_samples)) * 1000 / rate,
            "probability": word.get("probability"),
        }
        result.append(item)
        phrase.append(item)
        if re.search(r"[.!?][\"')]*$", item["text"].strip()) or index == len(words):
            phrases.append(
                {
                    "id": f"{paragraph_id}-s{len(phrases) + 1:03}",
                    "text": " ".join(item["text"].strip() for item in phrase),
                    "startMs": phrase[0]["startMs"],
                    "endMs": phrase[-1]["endMs"],
                    "wordIds": [item["id"] for item in phrase],
                }
            )
            phrase = []
    if not result:
        raise ValueError(f"No timed speech detected in {paragraph_id}")
    return result, phrases


def compare_text(expected, recognized):
    def tokens(text):
        return re.findall(r"[\w']+", text.lower().replace("’", "'"))

    source, actual = tokens(expected), tokens(recognized)
    matcher = SequenceMatcher(None, source, actual, autojunk=False)
    changes = [
        {
            "kind": kind,
            "script": " ".join(source[a:b]),
            "recognized": " ".join(actual[c:d]),
        }
        for kind, a, b, c, d in matcher.get_opcodes()
        if kind != "equal"
    ]
    return {"tokenMatchRatio": matcher.ratio(), "differences": changes}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--script", type=Path, required=True)
    parser.add_argument("--audio-dir", type=Path, required=True)
    args = parser.parse_args()
    directory = args.audio_dir.resolve()
    if (directory / "run.lock").exists():
        raise ValueError(
            "Narration runner is active or its lock needs inspection; do not time a changing master"
        )
    manifest, rate, samples, script_hash, audio_hash = load_inputs(
        args.script, directory
    )
    output = directory / "timing"
    output.mkdir(exist_ok=True)
    lock = output / "run.lock"
    with lock.open("x") as stream:
        import os

        stream.write(str(os.getpid()) + "\n")
    try:
        settings = {
            "engine": "faster-whisper",
            "version": version("faster-whisper"),
            "model": "small",
            "device": "cpu",
            "computeType": "int8",
            "language": "en",
            "wordTimestamps": True,
            "vadFilter": True,
            "conditionOnPreviousText": False,
            "beamSize": 5,
        }
        from faster_whisper import WhisperModel

        model = None
        words, cues, checks = [], [], []
        offset, started, completed_seconds = 0, time.monotonic(), 0
        for index, segment in enumerate(manifest["segments"], 1):
            fingerprint = hashlib.sha256(
                json.dumps(
                    {"audioHash": segment["audioHash"], "settings": settings},
                    sort_keys=True,
                ).encode()
            ).hexdigest()
            checkpoint = output / f"{segment['id']}-{fingerprint}.json"
            print(
                f"[{index}/{len(manifest['segments'])}] {segment['file']}: {'reuse' if checkpoint.exists() else 'transcribe'}",
                flush=True,
            )
            if checkpoint.exists():
                cached = json.loads(checkpoint.read_text(encoding="utf-8"))
                if cached["fingerprint"] != fingerprint:
                    raise ValueError(
                        f"Recognition checkpoint identity mismatch: {checkpoint}"
                    )
                local_words = cached["words"]
            else:
                if model is None:
                    print(
                        "Loading cached Whisper small on CPU; no model downloads...",
                        flush=True,
                    )
                    model = WhisperModel(
                        "small",
                        device="cpu",
                        compute_type="int8",
                        local_files_only=True,
                    )
                recognized, _info = model.transcribe(
                    str(directory / segment["file"]),
                    language="en",
                    beam_size=5,
                    word_timestamps=True,
                    vad_filter=True,
                    condition_on_previous_text=False,
                    log_progress=True,
                )
                local_words = []
                for block in recognized:
                    local_words.extend(
                        {
                            "text": word.word.strip(),
                            "start": word.start,
                            "end": word.end,
                            "probability": word.probability,
                        }
                        for word in block.words or []
                    )
                    print(
                        f"  {block.end:.1f}/{segment['samples'] / rate:.1f}s recognized",
                        flush=True,
                    )
                save_json(
                    checkpoint,
                    {
                        "fingerprint": fingerprint,
                        "settings": settings,
                        "audioHash": segment["audioHash"],
                        "words": local_words,
                    },
                )
            timed, phrases = phrase_cues(
                local_words, segment["id"], offset, rate, segment["samples"]
            )
            recognized_text = " ".join(word["text"] for word in timed)
            checks.append(
                {
                    "paragraphId": segment["id"],
                    "scriptText": segment["text"],
                    "recognizedText": recognized_text,
                    **compare_text(segment["text"], recognized_text),
                }
            )
            words.extend(timed)
            cues.extend(phrases)
            offset += segment["samples"]
            completed_seconds += segment["samples"] / rate
            elapsed = time.monotonic() - started
            remaining = (
                elapsed * (samples / rate - completed_seconds) / completed_seconds
            )
            print(
                f"  {index / len(manifest['segments']):.0%} paragraphs | elapsed {elapsed:.0f}s | ETA ~{remaining:.0f}s",
                flush=True,
            )
        # Recheck after ASR so an externally replaced script/audio cannot receive stale timing.
        if load_inputs(args.script, directory) != (
            manifest,
            rate,
            samples,
            script_hash,
            audio_hash,
        ):
            raise ValueError(
                "Narration inputs changed during transcription; rerun against the finished master"
            )
        metadata = {
            "mode": "draft",
            "listeningReviewed": False,
            "timingReviewed": False,
            "scriptHash": script_hash,
            "sourceAudioSha256": audio_hash,
            "sampleRate": rate,
            "durationMs": samples * 1000 / rate,
            "settings": settings,
        }
        save_json(output / "words.draft.json", {**metadata, "words": words})
        save_json(output / "cues.draft.json", {**metadata, "cues": cues})
        save_json(
            output / "review.json",
            {
                **metadata,
                "paragraphs": checks,
                "note": "ASR sentence cues are proposals, not forced alignment. Number formatting may appear as text differences. Listen, correct cue boundaries, and review mismatches before creating an aligned CueFile.",
            },
        )
        print(
            f"Saved {len(words)} word timings and {len(cues)} draft phrase cues to {output}. Listening/alignment remain unreviewed.",
            flush=True,
        )
    finally:
        lock.unlink()


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, ImportError) as error:
        print(f"Timing failed: {error}", file=sys.stderr)
        sys.exit(1)
