"""One disposable process per job. Only the API starts this fixed worker."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import wave
from urllib.parse import parse_qs, urlsplit

from plugin.backend.transcripts import Options, import_transcript, parse_subtitles, validate_segments, video_id

MAX_SECONDS = 4 * 3600
MAX_AUDIO = 512 * 1024 * 1024
FORMATS = "wav,mp3,flac,ogg,aac,mov,mp4,m4a,3gp,3g2,mj2,matroska,webm"


def emit(phase, progress, message, **extra):
    print(json.dumps({"phase": phase, "progress": progress, "message": message, **extra}), flush=True)


class QuietLogger:
    def debug(self, _message): pass
    def warning(self, _message): pass
    def error(self, _message): pass


def caption_tracks(info, language=None):
    candidates = []
    for kind in ("subtitles", "automatic_captions"):
        for code, tracks in (info.get(kind) or {}).items():
            if code == "live_chat" or (language and code.split("-")[0] != language):
                continue
            for track in tracks:
                url = urlsplit(track.get("url", ""))
                if (track.get("ext") == "vtt" and url.scheme == "https"
                        and (url.hostname == "youtube.com" or (url.hostname or "").endswith(".youtube.com"))
                        and "tlang" not in parse_qs(url.query)):
                    candidates.append((kind, code, track))
                    break
    spoken = info.get("language", "")
    return sorted(candidates, key=lambda item: (item[0] != "subtitles", item[1].split("-")[0] != spoken,
                                              not item[1].endswith("-orig"), not item[1].startswith("en"), item[1]))


def youtube_options(folder):
    return {
        "quiet": True, "no_warnings": True, "logger": QuietLogger(), "noplaylist": True,
        "socket_timeout": 20, "retries": 2, "fragment_retries": 2,
        "extractor_retries": 1, "cachedir": False, "enable_file_urls": False,
        "outtmpl": str(folder / "audio.%(ext)s"),
        "extractor_args": {"youtube": {"skip": ["translated_subs"]}},
    }


def extract_captions(ydl, info, options):
    errors = []
    candidates = caption_tracks(info, options.language)
    attempts = [item for kind in ("subtitles", "automatic_captions") for item in [candidate for candidate in candidates if candidate[0] == kind][:3]]
    for kind, language, track in attempts:
        emit("captions", 12, f"Reading {'manual' if kind == 'subtitles' else 'automatic'} captions ({language}).")
        try:
            with ydl.urlopen(track["url"]) as response:
                content = response.read(5 * 1024 * 1024 + 1)
            if len(content) > 5 * 1024 * 1024:
                raise ValueError("Caption track exceeds 5 MiB.")
            segments = parse_subtitles(content.decode("utf-8-sig"), rolling=kind == "automatic_captions")
            return {"source": "youtube_manual" if kind == "subtitles" else "youtube_auto",
                    "model": None, "language": language, "segments": segments}, errors
        except Exception as error:
            errors.append(f"Caption track {language} failed: {str(error)[:300]}")
    return None, errors


def convert_audio(source, destination):
    executable = shutil.which("ffmpeg")
    if not executable:
        raise RuntimeError("FFmpeg is missing. Install FFmpeg and add it to PATH, then restart the backend.")
    emit("converting", 35, "Converting audio to mono 16 kHz WAV locally.")
    result = subprocess.run([
        executable, "-nostdin", "-hide_banner", "-loglevel", "error", "-y",
        "-protocol_whitelist", "file,pipe", "-format_whitelist", FORMATS,
        "-i", str(source), "-vn", "-map", "0:a:0", "-ac", "1", "-ar", "16000",
        "-c:a", "pcm_s16le", "-t", str(MAX_SECONDS + 1), str(destination),
    ], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, timeout=1800,
       creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0)
    if result.returncode:
        raise RuntimeError("FFmpeg could not decode an audio stream. Upload a valid WAV, MP3, M4A, FLAC, OGG, WebM, MP4, OPUS, or AAC file.")
    with wave.open(str(destination)) as audio:
        duration = audio.getnframes() / audio.getframerate()
    if duration <= 0 or duration > MAX_SECONDS:
        raise ValueError("Audio must be nonempty and at most four hours long. Upload a shorter segment.")
    return duration


def ensure_audio_space(folder):
    if shutil.disk_usage(folder).free < 1024 ** 3:
        raise RuntimeError("Less than 1 GiB of free disk space. Free space before downloading/transcribing audio.")


def transcribe_audio(path, options, cache):
    from faster_whisper import WhisperModel
    from faster_whisper.tokenizer import _LANGUAGE_CODES
    if options.language and options.language not in _LANGUAGE_CODES:
        raise ValueError(f"Whisper does not support language '{options.language}'. Use auto detection or a supported code.")
    ensure_audio_space(path.parent)
    duration = convert_audio(path, path.parent / "normalized.wav")
    emit("loading_model", 40, f"Loading {options.model} on {options.device}; weights download on first use, then stay cached locally.")
    model = WhisperModel(options.model, device=options.device,
                         compute_type="int8" if options.device == "cpu" else "float16",
                         cpu_threads=min(4, os.cpu_count() or 1), num_workers=1, download_root=str(cache))
    emit("transcribing", 45, "Transcribing locally with voice activity detection.")
    segments, info = model.transcribe(str(path.parent / "normalized.wav"), language=options.language,
                                      vad_filter=True, word_timestamps=options.word_timestamps, beam_size=5)
    result = []
    for segment in segments:
        item = {"start": segment.start, "end": segment.end, "text": segment.text.strip()}
        if options.word_timestamps:
            item["words"] = [{"start": word.start, "end": word.end, "word": word.word} for word in segment.words or []]
        result.append(item)
        emit("transcribing", min(95, 45 + 50 * segment.end / duration), f"Transcribed {segment.end:.1f} / {duration:.1f} seconds.")
    return {"source": "whisper", "model": options.model, "device": options.device,
            "computeType": "int8" if options.device == "cpu" else "float16", "vad": True,
            "language": info.language, "languageProbability": info.language_probability,
            "segments": validate_segments(result)}


def run(request, folder, cache):
    import yt_dlp
    options = Options.model_validate(request["options"])
    identity = video_id(request["videoId"])
    canonical = f"https://www.youtube.com/watch?v={identity}"
    warnings = []
    metadata = {"id": identity, "url": canonical}
    available = []
    if request.get("upload"):
        uploaded = folder / ("upload" + request["suffix"])
        if request["kind"] == "transcript":
            result = {"source": "manual", "model": None, "language": options.language,
                      "segments": import_transcript(uploaded.read_bytes(), request["suffix"])}
            if any(segment["start"] is None for segment in result["segments"]):
                warnings.append("Plain text has no timestamps. Frame synchronization and SRT cues are unavailable until timed subtitles are supplied.")
        else:
            result = transcribe_audio(uploaded, options, cache)
    else:
        emit("metadata", 5, "Extracting YouTube metadata and caption availability with yt-dlp.")
        info = None
        try:
            with yt_dlp.YoutubeDL(youtube_options(folder)) as ydl:
                info = ydl.extract_info(canonical, download=False)
                if not info or info.get("id") != identity or info.get("is_live"):
                    raise ValueError("A finite video matching this ID is required.")
                if (info.get("duration") or 0) > MAX_SECONDS:
                    raise ValueError("Videos longer than four hours require a shorter uploaded audio segment.")
                metadata.update({"title": info.get("title"), "channel": info.get("channel"),
                                 "duration": info.get("duration"), "uploadDate": info.get("upload_date")})
                available = [{"language": code, "source": "manual" if kind == "subtitles" else "auto"}
                             for kind, code, _track in caption_tracks(info)]
                if not options.force_whisper:
                    result, errors = extract_captions(ydl, info, options)
                    warnings.extend(errors)
                    if result:
                        return {"videoId": identity, **result, "video": metadata, "availableCaptions": available, "warnings": warnings}
        except Exception as error:
            warnings.append(f"Caption extraction unavailable: {str(error)[:500]}")
        emit("downloading", 18, "Downloading temporary audio for local Whisper transcription.", warnings=warnings)
        ensure_audio_space(folder)
        last_progress = 0
        def progress(event):
            nonlocal last_progress
            downloaded = event.get("downloaded_bytes") or 0
            total = event.get("total_bytes") or event.get("total_bytes_estimate")
            if downloaded > MAX_AUDIO:
                raise ValueError("Audio download exceeds 512 MiB. Upload a shorter audio segment.")
            if time.monotonic() - last_progress >= .25 or event.get("status") == "finished":
                emit("downloading", min(32, 18 + 14 * downloaded / total) if total else 18, f"Downloaded {downloaded / 1048576:.1f} MiB of audio.")
                last_progress = time.monotonic()
        settings = {**youtube_options(folder), "format": "bestaudio/best", "max_filesize": MAX_AUDIO,
                    "progress_hooks": [progress], "match_filter": lambda item, **_kwargs: "Live or oversized video is unsupported." if item.get("is_live") or (item.get("duration") or 0) > MAX_SECONDS else None}
        with yt_dlp.YoutubeDL(settings) as ydl:
            audio_info = ydl.extract_info(canonical, download=True)
            if not audio_info or audio_info.get("id") != identity:
                raise RuntimeError("YouTube audio is unavailable. Upload an audio file or transcript manually.")
            audio = Path(ydl.prepare_filename(audio_info)).resolve()
        if audio.parent != folder.resolve() or not audio.is_file() or audio.stat().st_size == 0:
            raise RuntimeError("No audio was downloaded. Upload an audio file or transcript manually.")
        result = transcribe_audio(audio, options, cache)
    return {"videoId": identity, **result, "video": metadata, "availableCaptions": available, "warnings": warnings}


def main():
    folder = Path(sys.argv[1]).resolve()
    request = json.loads((folder / "request.json").read_text(encoding="utf-8"))
    cache = Path(os.environ.get("FRAME_STUDY_MODEL_CACHE", str(Path(__file__).resolve().parent / ".models"))).resolve()
    try:
        document = run(request, folder, cache)
        (folder / "result.json").write_text(json.dumps(document, ensure_ascii=False, allow_nan=False), encoding="utf-8")
        emit("saving", 98, "Transcription complete; saving local transcript files.")
        return 0
    except Exception as error:
        message = str(error).replace(str(folder), "<temporary audio>")[:1200]
        if isinstance(error, MemoryError):
            message = "Insufficient RAM. Try the tiny model on CPU and close other applications."
        emit("error", 0, f"{message} Try a smaller CPU model or upload audio/a transcript manually.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
