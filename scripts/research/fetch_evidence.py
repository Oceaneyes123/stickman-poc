#!/usr/bin/env python3
"""Fetch research evidence: ranked videos + timed captions, per channel.

Writes research-evidence/<channel>/<video-id>.json and a flat index.json.
Captions come from youtube-transcript-api (real snippet start times) or are
recorded as unavailable. No transcription fallback: a missing caption is
recorded, not invented.

    python fetch_evidence.py --count 5 @kurzgesagt @JamesJani
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path

import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi

OUT = Path(__file__).resolve().parents[2] / "research-evidence"
LANGS = ["en", "en-US", "en-GB"]


def safe(s, n=60):
    return re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_")[:n] or "channel"


def list_videos(handle, count):
    """Rank the whole Videos tab by reported views, then take the newest few too."""
    url = f"https://www.youtube.com/{handle}/videos"
    opts = {"quiet": True, "extract_flat": True, "skip_download": True, "playlistend": 200}
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
    entries = [e for e in (info.get("entries") or []) if e and e.get("id")]
    ranked = sorted(entries, key=lambda e: e.get("view_count") or 0, reverse=True)[:count]
    newest = entries[:2]
    seen, picked = set(), []
    for e in ranked + newest:
        if e["id"] not in seen:
            seen.add(e["id"])
            picked.append(e)
    return info.get("channel") or handle, picked


def captions(vid):
    api = YouTubeTranscriptApi()
    try:
        fetched = api.fetch(vid, languages=LANGS)
    except Exception as exc:  # disabled, blocked, no track
        return None, f"{type(exc).__name__}: {str(exc).splitlines()[0][:120]}"
    segs = [{"t": round(s.start, 2), "d": round(s.duration, 2), "text": s.text.replace("\n", " ").strip()} for s in fetched]
    return segs, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("handles", nargs="+")
    ap.add_argument("--count", type=int, default=5)
    ap.add_argument("--delay", type=float, default=3.0)
    args = ap.parse_args()

    OUT.mkdir(exist_ok=True)
    index_path = OUT / "index.json"
    index = json.loads(index_path.read_text(encoding="utf-8")) if index_path.exists() else {}

    for handle in args.handles:
        name = safe(handle.lstrip("@"))
        try:
            channel, videos = list_videos(handle, args.count)
        except Exception as exc:
            print(f"[{handle}] LIST FAILED {type(exc).__name__}: {exc}"[:200])
            index.setdefault(name, {"handle": handle, "error": f"list: {exc}"[:160]})
            continue
        cdir = OUT / name
        cdir.mkdir(exist_ok=True)
        for v in videos:
            vid = v["id"]
            path = cdir / f"{vid}.json"
            if path.exists():
                print(f"[{name}] skip {vid}")
                continue
            segs, err = captions(vid)
            rec = {
                "channel": channel,
                "handle": handle,
                "video_id": vid,
                "title": v.get("title"),
                "views": v.get("view_count"),
                "duration_s": v.get("duration"),
                "url": f"https://www.youtube.com/watch?v={vid}",
                "caption_error": err,
                "segments": segs,
            }
            path.write_text(json.dumps(rec, ensure_ascii=False), encoding="utf-8")
            words = sum(len(s["text"].split()) for s in segs) if segs else 0
            print(f"[{name}] {vid} views={v.get('view_count')} segs={len(segs or [])} words={words} {err or ''}"[:160])
            time.sleep(args.delay)
        index[name] = {"handle": handle, "channel": channel,
                       "videos": [{"id": v["id"], "title": v.get("title"), "views": v.get("view_count")} for v in videos]}
        index_path.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
