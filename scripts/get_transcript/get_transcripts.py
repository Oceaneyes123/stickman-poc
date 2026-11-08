#!/usr/bin/env python3
"""
Download transcripts for each channel's top 5 most-viewed longform videos or Shorts.

Setup:
    pip install yt-dlp youtube-transcript-api

Run from this directory (quote handles in PowerShell):
    python get_transcripts.py --longform "@jamesjani" "@howmoneyworks" "@CasuallyFinance"
    python get_transcripts.py --short "@jamesjani"
    python get_transcripts.py --longform "@jamesjani" --transcribe

Options:
    --longform      Videos tab, excluding Shorts (default)
    --short         Shorts tab only; cannot combine with --longform
    --count N       videos per channel (default 5)
    --browser NAME  optional logged-in browser cookies for yt-dlp
    --transcribe    skip captions; transcribe audio with cached faster-whisper small
    name=url ...    legacy channel aliases are also accepted

All entries in the selected tab are ranked by reported view count before limiting.
Re-running skips saved transcripts by video ID. Existing downloads are preserved.
Caption downloads select one native track and wait before requesting it. HTTP 429
or API blocking gets two retries (30s, 60s), then stops the batch's network calls.
Longer Retry-After instructions stop the run without retrying early. A persistent
YouTube IP block cannot be cleared by this script; rerun later to resume.
Output: transcripts/<channel>/<longform|short>/<video-id>.txt,
        ALL.txt in the same folder, and transcripts/missing.txt for failures.
Local speech recognition uses CPU/int8 and writes under a separate transcribed/
subfolder. Audio remains in its _raw/ folder for resuming. Recognition can contain
errors and is not a copy of the creator's captions. No model is downloaded silently.
"""

import argparse
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
import re
import sys
import time
from pathlib import Path
from urllib.parse import parse_qs, urlsplit, urlunsplit

import yt_dlp

CHANNELS = {
    "zacdfilms": "https://www.youtube.com/@zackdfilms/shorts",
    "ricksclips": "https://www.youtube.com/@RicksClips3000/shorts",
}
LANGS = ["en", "en-US", "en-GB"]
OUT = Path(__file__).resolve().parent / "transcripts"


def safe(s, n=60):
    return re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_")[:n] or "video"


def channel_url(value, mode):
    """Accept a handle or legacy name=channel-url and select exactly one tab."""
    if value.startswith("@"):
        if not re.fullmatch(r"@[\w.-]+", value) or not value[1:].strip("."):
            raise ValueError(f"invalid YouTube handle: {value}")
        name, url = value[1:], f"https://www.youtube.com/{value}"
    else:
        name, separator, url = value.partition("=")
        if not separator or not name or not url:
            raise ValueError(f"expected @handle or name=YouTube-channel-URL: {value}")
        name = safe(name)
    parts = urlsplit(url)
    if parts.scheme not in ("http", "https") or parts.netloc not in (
        "youtube.com", "www.youtube.com", "m.youtube.com",
    ):
        raise ValueError(f"expected a YouTube channel URL: {url}")
    path = re.sub(r"/(videos|shorts|streams|featured)/?$", "", parts.path.rstrip("/"))
    if not re.fullmatch(r"/(?:@[\w.-]+|(?:channel|c|user)/[^/]+)", path):
        raise ValueError(f"expected a YouTube channel URL: {url}")
    tab = "shorts" if mode == "short" else "videos"
    return name, urlunsplit((parts.scheme, parts.netloc, f"{path}/{tab}", "", ""))


def list_videos(url, count, browser=None):
    # Rank the entire tab; limiting extraction first would rank only recent uploads.
    opts = {"quiet": True, "extract_flat": True, "skip_download": True}
    if browser:
        opts["cookiesfrombrowser"] = (browser,)
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
    entries = {}
    for entry in (info.get("entries") or []):
        if not entry or not entry.get("id"):
            continue
        if entry.get("live_status") in ("is_live", "is_upcoming"):
            continue
        views = entry.get("view_count")
        if not isinstance(views, (int, float)) or views < 0:
            raise RuntimeError(f"missing view count for {entry['id']}; cannot rank most-viewed videos")
        entries[entry["id"]] = entry
    ranked = sorted(entries.values(), key=lambda entry: entry["view_count"], reverse=True)
    if not ranked:
        raise RuntimeError("no videos found in the selected channel tab")
    return [(entry["id"], entry.get("title") or entry["id"]) for entry in ranked[:count]]


# ---------- fallback: youtube-transcript-api ----------
def text_via_api(vid):
    from youtube_transcript_api import NoTranscriptFound, YouTubeTranscriptApi

    api = YouTubeTranscriptApi()
    try:
        fetched = api.fetch(vid, languages=LANGS)
    except NoTranscriptFound:
        # any available language / auto-generated
        tl = api.list(vid)
        t = next(iter(tl))
        fetched = t.fetch()
    return " ".join(s.text.replace("\n", " ").strip() for s in fetched)


# ---------- primary: one native yt-dlp caption track ----------

def caption_track(info):
    # Prefer English, then another native language. Never request auto-translations.
    for english in (True, False):
        for kind in ("subtitles", "automatic_captions"):
            tracks = info.get(kind) or {}
            for language in sorted(tracks, key=lambda lang: (not lang.endswith("-orig"), lang)):
                if language == "live_chat" or language.startswith("en") != english:
                    continue
                for track in tracks[language]:
                    if track.get("ext") == "vtt" and "tlang" not in parse_qs(urlsplit(track.get("url", "")).query):
                        return language, track
    raise RuntimeError("no native caption track found")
def clean_vtt(text):
    lines, prev = [], ""
    for line in text.splitlines():
        line = line.strip()
        if not line or "-->" in line or line.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")):
            continue
        line = re.sub(r"<[^>]+>", "", line).strip()
        if not line or line == prev:
            continue
        lines.append(line)
        prev = line
    out = [l for i, l in enumerate(lines) if not (i + 1 < len(lines) and lines[i + 1].startswith(l))]
    return " ".join(out)


def text_via_ytdlp(vid, tmp, browser):
    opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitlesformat": "vtt",
        "extractor_args": {"youtube": {"skip": ["translated_subs"]}},
        "sleep_interval_requests": 1,
        "sleep_interval_subtitles": 5,
        "socket_timeout": 30,
        "outtmpl": str(tmp / "%(id)s.%(ext)s"),
    }
    if browser:
        opts["cookiesfrombrowser"] = (browser,)
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
        language, track = caption_track(info)
        info["requested_subtitles"] = {language: track}
        # Reuse extracted metadata; process_info writes only the selected caption.
        ydl.process_info(info)
    path = track.get("filepath")
    if not path:
        raise RuntimeError("selected caption was not downloaded")
    return clean_vtt(Path(path).read_text(encoding="utf-8", errors="ignore"))


class RateLimitedError(RuntimeError):
    """The batch must stop making requests until YouTube allows them again."""


def rate_limit_wait(error, attempt):
    from youtube_transcript_api import RequestBlocked

    blocked, retry_after, seen = False, 0, set()
    while error is not None and id(error) not in seen:
        seen.add(id(error))
        response = getattr(error, "response", None)
        status = getattr(response, "status_code", None) or getattr(error, "status", None)
        blocked |= isinstance(error, RequestBlocked) or status == 429 or bool(re.search(
            r"HTTP(?: Error)?[ :]+429\b|\b429:\s*Too Many Requests", str(error), re.IGNORECASE,
        ))
        header = getattr(response, "headers", {}).get("Retry-After")
        if header:
            try:
                seconds = float(header)
            except ValueError:
                try:
                    seconds = (parsedate_to_datetime(header) - datetime.now(timezone.utc)).total_seconds()
                except (TypeError, ValueError, OverflowError):
                    seconds = 0
            retry_after = max(retry_after, seconds)
        wrapped = getattr(error, "exc_info", None)
        error = error.__cause__ or error.__context__ or (wrapped[1] if wrapped else None)
    return max(30 * 2 ** attempt, retry_after) if blocked else None


def get_text(vid, tmp, browser):
    errs = []
    for method, fetch in (("yt-dlp", lambda: text_via_ytdlp(vid, tmp, browser)),
                          ("api", lambda: text_via_api(vid))):
        for attempt in range(3):
            try:
                text = fetch().strip()
                if not text:
                    raise RuntimeError("captions were empty")
                return text
            except Exception as e:
                message = " ".join(str(getattr(e, "cause", e)).split()) or type(e).__name__
                detail = f"{method}: {type(e).__name__}: {message}"
                delay = rate_limit_wait(e, attempt)
                if delay is None:
                    errs.append(detail)
                    break
                if attempt == 2 or delay > 60:
                    raise RateLimitedError(
                        f"YouTube blocked or rate-limited captions ({detail}). "
                        f"Stopping network requests; retry later (backoff at least {delay:g}s). "
                        "Saved transcripts will be reused."
                    ) from e
                print(f"  {method}: YouTube rate limit; retry {attempt + 1}/2 in {delay:g}s", flush=True)
                time.sleep(delay)
    raise RuntimeError(" | ".join(errs))


def load_transcriber():
    try:
        from faster_whisper import WhisperModel
    except ImportError as error:
        raise RuntimeError("--transcribe requires: pip install faster-whisper") from error
    try:
        return WhisperModel("small", device="cpu", compute_type="int8", local_files_only=True)
    except Exception as error:
        raise RuntimeError(
            "Cannot load cached faster-whisper small model. Download it once with: "
            "python -c \"from faster_whisper import WhisperModel; "
            "WhisperModel('small', device='cpu', compute_type='int8')\""
        ) from error


def text_via_audio(vid, tmp, browser, model):
    opts = {
        "quiet": True,
        "no_warnings": True,
        "format": "bestaudio",
        "socket_timeout": 30,
        "outtmpl": str(tmp / "%(id)s.%(ext)s"),
    }
    if browser:
        opts["cookiesfrombrowser"] = (browser,)
    print("  downloading audio for local speech recognition...", flush=True)
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=True)
        path = Path(ydl.prepare_filename(info))
    if not path.is_file() or path.stat().st_size == 0:
        raise RuntimeError("audio download did not produce a nonempty file")
    print("  transcribing locally: faster-whisper small, CPU/int8...", flush=True)
    segments, _ = model.transcribe(str(path), beam_size=5, vad_filter=True, log_progress=True)
    text = " ".join(segment.text.strip() for segment in segments).strip()
    if not text:
        raise RuntimeError("local speech recognition produced no text")
    return text


def main():
    # Redirected Windows output may use cp1252, which cannot encode video-title emoji.
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(errors="backslashreplace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("channels", nargs="*", help="@handle or name=YouTube-channel-URL")
    modes = ap.add_mutually_exclusive_group()
    modes.add_argument("--longform", dest="mode", action="store_const", const="longform")
    modes.add_argument("--short", dest="mode", action="store_const", const="short")
    ap.set_defaults(mode="longform")
    ap.add_argument("--browser", default=None)
    ap.add_argument("--count", type=int, default=5)
    ap.add_argument("--transcribe", action="store_true", help="use local audio transcription instead of captions")
    args = ap.parse_args()
    if args.count < 1:
        ap.error("--count must be positive")
    try:
        channels = dict(channel_url(value, args.mode) for value in (
            args.channels or [f"{name}={url}" for name, url in CHANNELS.items()]
        ))
    except ValueError as error:
        ap.error(str(error))

    OUT.mkdir(exist_ok=True)
    missing = []
    blocked = None
    transcriber = None

    for name, url in channels.items():
        print(f"\n== {name}: top {args.count} {args.mode} videos by views ({url})")
        if blocked:
            missing.append(f"{name} {url} -- not requested: {blocked}")
            print("  skipped: YouTube rate limit persists; retry later")
            continue
        folder = OUT / name / args.mode
        if args.transcribe:
            folder /= "transcribed"
        tmp = folder / "_raw"
        tmp.mkdir(parents=True, exist_ok=True)

        try:
            vids = list_videos(url, args.count, args.browser)
        except Exception as e:
            if rate_limit_wait(e, 0) is not None:
                blocked = f"YouTube blocked or rate-limited the channel listing: {e}; retry later"
            print(f"  could not list videos: {e}")
            missing.append(f"{name} {url} -- could not list videos: {e}")
            continue

        combined = []
        channel_failed = False
        for i, (vid, title) in enumerate(vids, 1):
            f = folder / f"{vid}.txt"
            video_url = f"https://www.youtube.com/shorts/{vid}" if args.mode == "short" else f"https://www.youtube.com/watch?v={vid}"
            header = f"TITLE: {title}\nURL: {video_url}\n"
            if args.transcribe:
                header += "SOURCE: local speech recognition (faster-whisper small, CPU/int8); may contain errors\n"

            if f.exists() and f.stat().st_size > 0:
                text = f.read_text(encoding="utf-8").split("\n\n", 1)[-1].strip()
                print(f"  {i:02d} {title}: already saved")
            else:
                if blocked:
                    missing.append(f"{name} {vid} {title} -- not requested: {blocked}")
                    channel_failed = True
                    continue
                try:
                    if args.transcribe:
                        if transcriber is None:
                            transcriber = load_transcriber()
                        text = text_via_audio(vid, tmp, args.browser, transcriber)
                    else:
                        text = get_text(vid, tmp, args.browser)
                except Exception as e:
                    if args.transcribe and transcriber is None:
                        print(f"  local transcription unavailable: {e}")
                        missing.append(f"{name} {vid} {title} -- local transcription unavailable: {e}")
                        (OUT / "missing.txt").write_text("\n".join(missing), encoding="utf-8")
                        return 1
                    if isinstance(e, RateLimitedError) or rate_limit_wait(e, 0) is not None:
                        blocked = str(e)
                    channel_failed = True
                    print(f"  {i:02d} {title}: FAILED ({e})")
                    missing.append(f"{name} {vid} {title} -- {e}")
                    continue
                f.write_text(f"{header}\n{text}\n", encoding="utf-8")
                print(f"  {i:02d} {title}: {len(text.split())} words")
                time.sleep(5)

            combined.append(f"##### VIDEO {i}\n{header}WORDS: {len(text.split())}\n\n{text}\n")

        combined_file = folder / "ALL.txt"
        if combined and (not channel_failed or not combined_file.exists()):
            combined_file.write_text("\n\n".join(combined), encoding="utf-8")

    (OUT / "missing.txt").write_text("\n".join(missing), encoding="utf-8")
    if missing:
        print(f"\n{len(missing)} failure(s), see {OUT / 'missing.txt'}")
        return 1
    print(f"\nDone. Transcripts saved under {OUT}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
