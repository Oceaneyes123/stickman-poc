#!/usr/bin/env python3
"""
Download clean transcripts for the latest N Shorts (or videos) of YouTube channels.

Setup (once):
    pip install yt-dlp youtube-transcript-api

Run:
    python get_transcripts.py
    python get_transcripts.py --browser chrome     # if YouTube shows the "confirm you're not a bot" error

Options:
    --browser NAME   firefox | chrome | edge | brave  (yt-dlp fallback reads your logged-in cookies)
    --count N        videos per channel (default 10)
    name=url ...     override channels, e.g. "zac=https://www.youtube.com/@zackdfilms/shorts"

Re-running is safe: videos already saved are skipped, so you can resume after an error.

Output:
    transcripts/<channel>/01_<title>.txt   one file per video
    transcripts/<channel>/ALL.txt          everything in one file (upload this)
    transcripts/missing.txt                videos that could not be fetched
"""

import argparse
import re
import sys
import time
from pathlib import Path

import yt_dlp

CHANNELS = {
    "zacdfilms": "https://www.youtube.com/@zackdfilms/shorts",
    "ricksclips": "https://www.youtube.com/@RicksClips3000/shorts",
}
LANGS = ["en", "en-US", "en-GB"]
OUT = Path(__file__).resolve().parent / "transcripts"


def safe(s, n=60):
    return re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_")[:n] or "video"


def list_videos(url, count, browser=None):
    opts = {"quiet": True, "extract_flat": True, "playlistend": count, "skip_download": True}
    if browser:
        opts["cookiesfrombrowser"] = (browser,)
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
    out = []
    for e in (info.get("entries") or []):
        if e and e.get("id"):
            out.append((e["id"], e.get("title") or e["id"]))
    return out[:count]


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
    ap = argparse.ArgumentParser()
    ap.add_argument("channels", nargs="*", help="name=url")
    ap.add_argument("--browser", default=None)
    ap.add_argument("--count", type=int, default=10)
    args = ap.parse_args()

    channels = CHANNELS
    if args.channels:
        channels = {}
        for a in args.channels:
            n, _, u = a.partition("=")
            channels[n] = u

    OUT.mkdir(exist_ok=True)
    missing = []

    for name, url in channels.items():
        print(f"\n== {name}: {url}")
        folder = OUT / name
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
            f = folder / f"{i:02d}_{safe(title)}.txt"
            header = f"TITLE: {title}\nURL: https://www.youtube.com/shorts/{vid}\n"

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
