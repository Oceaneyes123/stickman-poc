#!/usr/bin/env python3
"""
Download transcripts for each channel's top 5 most-viewed longform videos or Shorts.

Setup:
    pip install yt-dlp youtube-transcript-api

Run from this directory (quote handles in PowerShell):
    python get_transcripts.py --longform "@jamesjani" "@howmoneyworks" "@CasuallyFinance"
    python get_transcripts.py --short "@jamesjani"

Options:
    --longform      Videos tab, excluding Shorts (default)
    --short         Shorts tab only; cannot combine with --longform
    --count N       videos per channel (default 5)
    --browser NAME  optional logged-in browser cookies for yt-dlp
    name=url ...    legacy channel aliases are also accepted

All entries in the selected tab are ranked by reported view count before limiting.
Re-running skips saved transcripts by video ID. Existing downloads are preserved.
Output: transcripts/<channel>/<longform|short>/<video-id>.txt,
        ALL.txt in the same folder, and transcripts/missing.txt for failures.
"""

import argparse
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

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


# ---------- method 1: youtube-transcript-api ----------
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


# ---------- method 2: yt-dlp captions (needs cookies on many networks) ----------
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
        "writeautomaticsubtitles": True,
        "subtitleslangs": ["en.*", "en"],
        "subtitlesformat": "vtt",
        "outtmpl": str(tmp / "%(id)s.%(ext)s"),
    }
    if browser:
        opts["cookiesfrombrowser"] = (browser,)
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=True)
    vtts = sorted(tmp.glob(f"{vid}*.vtt"))
    if not vtts:
        raise RuntimeError("no captions found")
    return clean_vtt(vtts[0].read_text(encoding="utf-8", errors="ignore"))


def get_text(vid, tmp, browser):
    errs = []
    for method, fetch in (("api", lambda: text_via_api(vid)),
                          ("yt-dlp", lambda: text_via_ytdlp(vid, tmp, browser))):
        try:
            text = fetch().strip()
            if not text:
                raise RuntimeError("captions were empty")
            return text
        except Exception as e:
            message = " ".join(str(e).split()) or type(e).__name__
            errs.append(f"{method}: {message[:120]}")
    raise RuntimeError(" | ".join(errs))


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

    for name, url in channels.items():
        print(f"\n== {name}: top {args.count} {args.mode} videos by views ({url})")
        folder = OUT / name / args.mode
        tmp = folder / "_raw"
        tmp.mkdir(parents=True, exist_ok=True)

        try:
            vids = list_videos(url, args.count, args.browser)
        except Exception as e:
            print(f"  could not list videos: {e}")
            missing.append(f"{name} {url} -- could not list videos: {e}")
            continue

        combined = []
        for i, (vid, title) in enumerate(vids, 1):
            f = folder / f"{vid}.txt"
            video_url = f"https://www.youtube.com/shorts/{vid}" if args.mode == "short" else f"https://www.youtube.com/watch?v={vid}"
            header = f"TITLE: {title}\nURL: {video_url}\n"

            if f.exists() and f.stat().st_size > 0:
                text = f.read_text(encoding="utf-8").split("\n\n", 1)[-1].strip()
                print(f"  {i:02d} {title}: already saved")
            else:
                try:
                    text = get_text(vid, tmp, args.browser)
                except Exception as e:
                    print(f"  {i:02d} {title}: FAILED ({e})")
                    missing.append(f"{name} {vid} {title} -- {e}")
                    continue
                f.write_text(f"{header}\n{text}\n", encoding="utf-8")
                print(f"  {i:02d} {title}: {len(text.split())} words")
                time.sleep(2)

            combined.append(f"##### VIDEO {i}\n{header}WORDS: {len(text.split())}\n\n{text}\n")

        if combined:
            (folder / "ALL.txt").write_text("\n\n".join(combined), encoding="utf-8")

    (OUT / "missing.txt").write_text("\n".join(missing), encoding="utf-8")
    if missing:
        print(f"\n{len(missing)} failure(s), see {OUT / 'missing.txt'}")
        return 1
    print(f"\nDone. Transcripts saved under {OUT}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
