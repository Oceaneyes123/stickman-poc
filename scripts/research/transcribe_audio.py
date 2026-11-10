#!/usr/bin/env python3
"""Local ASR fallback for videos whose captions are unavailable (IP block, disabled).

Downloads audio with yt-dlp (Python310 environment), transcribes with cached
faster-whisper small, and writes the same record shape as fetch_evidence.py so
downstream analysis cannot tell the difference -- except for the recorded
`source` field, which stays honest: "asr:faster-whisper-small".

Run with the interpreter that has faster_whisper (this repo uses `py`):

    py scripts/research/transcribe_audio.py --max-seconds 150 <video-id> ...
    py scripts/research/transcribe_audio.py --missing            # every record with caption_error
"""

import argparse
import glob
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EVID = ROOT / "research" / "evidence"
YT_PY = os.environ.get("YT_PY", sys.executable)
NODE = os.environ.get("NODE_BIN", "node")


def download_audio(video_id, max_seconds, out_dir):
    dst = Path(out_dir) / f"{video_id}.m4a"
    if dst.exists():
        return dst
    cmd = [YT_PY, "-m", "yt_dlp", "-f", "bestaudio[abr<=96]/bestaudio/best", "-x", "--audio-format", "m4a",
           "--js-runtimes", f"node:{NODE}", "--remote-components", "ejs:github",
           "-o", str(dst.with_suffix(".%(ext)s"))]
    if max_seconds:
        cmd += ["--download-sections", f"*0-{max_seconds}"]
    cmd.append(f"https://www.youtube.com/watch?v={video_id}")
    subprocess.run(cmd, capture_output=True, text=True)
    for p in Path(out_dir).glob(f"{video_id}.*"):
        if p.suffix in (".m4a", ".webm", ".opus", ".mp3"):
            return p
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video_ids", nargs="*")
    ap.add_argument("--missing", action="store_true")
    ap.add_argument("--max-seconds", type=int, default=0)
    ap.add_argument("--model", default="small")
    args = ap.parse_args()

    targets = []
    for p in sorted(glob.glob(str(EVID / "*" / "*.json"))):
        rec = json.loads(Path(p).read_text(encoding="utf-8"))
        if args.missing and rec.get("caption_error"):
            targets.append(Path(p))
        elif rec.get("video_id") in args.video_ids:
            targets.append(Path(p))

    if not targets:
        print("nothing to do")
        return 1

    from faster_whisper import WhisperModel
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    tmp = Path(tempfile.mkdtemp(prefix="asr_"))

    for path in targets:
        rec = json.loads(path.read_text(encoding="utf-8"))
        vid = rec["video_id"]
        audio = download_audio(vid, args.max_seconds, tmp)
        if not audio:
            print(f"{vid} audio download failed")
            continue
        segs, info = model.transcribe(str(audio), beam_size=1, vad_filter=True, language="en")
        data = [{"t": round(s.start, 2), "d": round(s.end - s.start, 2), "text": s.text.strip()} for s in segs]
        rec["segments"] = data
        rec["caption_error"] = None
        rec["source"] = f"asr:faster-whisper-{args.model}" + (f" (first {args.max_seconds}s)" if args.max_seconds else "")
        path.write_text(json.dumps(rec, ensure_ascii=False), encoding="utf-8")
        print(f"{vid} {len(data)} segments, {sum(len(d['text'].split()) for d in data)} words, "
              f"span {data[-1]['t'] if data else 0}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
