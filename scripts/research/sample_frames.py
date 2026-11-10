#!/usr/bin/env python3
"""Sample frames from a YouTube video for visual inspection.

Downloads the smallest 480p stream, then writes one contact sheet (tiled stills,
timestamp burned into each tile) per video. Evidence for composition, staging and
typography only: a contact sheet shows single frames, not motion timing.

    python sample_frames.py --out research-evidence/frames <video-id> --times 3,8,15,30,60
"""

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
YT = [sys.executable, "-m", "yt_dlp", "--js-runtimes", "node:C:/Program Files/nodejs/node.exe",
      "--remote-components", "ejs:github", "-f", "bv*[height<=480][ext=mp4]/b[height<=480]/b"]


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video_id")
    ap.add_argument("--times", default="3,10,20,35,50,70")
    ap.add_argument("--out", default=str(ROOT / "research-evidence" / "frames"))
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    mp4 = out / f"{args.video_id}.mp4"
    if not mp4.exists():
        r = run(YT + ["-o", str(mp4), f"https://www.youtube.com/watch?v={args.video_id}"], cwd=str(out))
        if not mp4.exists():
            print("download failed:", (r.stderr or "")[-400:])
            return 1

    times = [t.strip() for t in args.times.split(",") if t.strip()]
    tiles = []
    for t in times:
        p = out / f"{args.video_id}_{t}.jpg"
        if not p.exists():
            run(["ffmpeg", "-v", "error", "-ss", t, "-i", str(mp4), "-frames:v", "1",
                 "-vf", f"scale=640:-1,drawtext=text='{t}s':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6",
                 "-q:v", "3", "-y", str(p)])
        if p.exists():
            tiles.append(p)

    if not tiles:
        print("no frames extracted")
        return 1

    sheet = out / f"{args.video_id}_sheet.jpg"
    cols = 3
    rows = (len(tiles) + cols - 1) // cols
    inputs = []
    for p in tiles:
        inputs += ["-i", str(p)]
    filt = "".join(f"[{i}:v]" for i in range(len(tiles)))
    filt += f"xstack=inputs={len(tiles)}:layout=" + "|".join(
        f"{(i % cols) * 640}_{(i // cols) * 360}" for i in range(len(tiles))
    ) + f":fill=black[out]"
    r = run(["ffmpeg", "-v", "error", *inputs, "-filter_complex", filt, "-map", "[out]", "-y", str(sheet)])
    print(json.dumps({"video_id": args.video_id, "sheet": str(sheet) if sheet.exists() else None,
                      "frames": [str(p) for p in tiles], "error": (r.stderr or "")[-300:] if not sheet.exists() else None}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
