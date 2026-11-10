"""Verify local reference exports and prepare paged visual-review samples."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import subprocess
import sys
import wave
import numpy as np

root = Path(sys.argv[1])
source = json.loads((root / "source.json").read_text())
results = []
with wave.open("out/001-lifestyle-creep/narration/narration.wav", "rb") as master:
    for clip in source["clips"]:
        assert clip["id"] in ("apartment", "raise-illusion", "comparison")
        directory = root / clip["id"]
        sequence = json.loads((directory / "direction.json").read_text())
        frames = json.loads((directory / "frame-index.json").read_text())
        movie = directory / (clip["id"] + ".mp4")
        with wave.open(str(root / "public" / (clip["id"] + ".wav")), "rb") as cut:
            samples = cut.getnframes()
            raw = cut.readframes(samples)
            master.setpos(clip["startSample"])
            assert raw == master.readframes(samples), "Source excerpt differs"
            original = np.frombuffer(raw, dtype="<i2").astype(float)
        encoded = subprocess.run([
            "ffmpeg", "-v", "error", "-i", str(movie), "-vn", "-ar", "48000",
            "-ac", "1", "-f", "s16le", "pipe:1"
        ], check=True, capture_output=True).stdout
        decoded = np.frombuffer(encoded, dtype="<i2").astype(float)
        common = min(len(decoded), len(original))
        correlation = float(np.corrcoef(original[:common], decoded[:common])[0, 1])
        assert correlation > .995, "Encoded audio is shifted or changed"
        missing = max(0, samples - len(decoded))
        assert missing < 1600, "Audio exceeds the one-frame rounding allowance"
        tail_peak = float(np.max(np.abs(original[common:]))) if common < len(original) else 0
        assert tail_peak < 100, "Non-silent source tail lost at the rounded endpoint"
        baseline = None
        for frame in frames:
            with Image.open(directory / "frames" / f"{frame['frame']:05}.png") as image:
                assert image.size == (960, 540)
                assert sum(image.convert("L").histogram()[:120]) > 200, "Foreground covered"
                patch = image.crop((920, 0, 960, 40)).tobytes()
                if baseline is None:
                    baseline = patch
                assert patch == baseline, "Texture changed between frames"
        with Image.open(directory / "contact-sheet.png") as sheet:
            pages = []
            for index, top in enumerate(range(0, sheet.height, 1040), 1):
                name = f"contact-page-{index}.png"
                sheet.crop((0, top, sheet.width, min(sheet.height, top + 1040))).save(directory / name)
                pages.append(name)
        target = {"apartment": "open-laptop", "raise-illusion": "eighty-remains", "comparison": "period-difference"}[clip["id"]]
        frame = next(b["endFrame"] for b in sequence["beats"] if b["id"] == target)
        subprocess.run([
            "ffmpeg", "-v", "error", "-i", str(movie), "-vf",
            f"select=eq(n\\,{frame}),scale=960:540", "-frames:v", "1", str(directory / "encoded-check.png")
        ], check=True)
        verified = json.loads((directory / "verification.json").read_text())
        media = verified["metadata"]
        assert abs(float(media["format"]["duration"]) - sequence["timeline"]["durationInFrames"] / 30) < 1 / 30
        results.append({
            "id": clip["id"], "durationInFrames": sequence["timeline"]["durationInFrames"],
            "sourceSamples": samples, "decodedSamples": len(decoded), "sourceExcerptIdentical": True,
            "aacZeroOffsetCorrelation": correlation, "sourceTailNotInDecodedSamples": missing,
            "omittedTailPeak": tail_peak, "fixedTextureVerified": True, "foregroundVisibleInEverySample": True,
            "frameSamples": len(frames), "contactPages": pages, "fullDecodePassed": verified["fullDecodePassed"]
        })
for file, key in [
    ("videos/001-lifestyle-creep/narration.txt", "scriptHash"),
    ("out/001-lifestyle-creep/narration/narration.wav", "sourceAudioHash"),
    ("out/001-lifestyle-creep/narration/timing/cues.draft.json", "cueHash"),
    ("out/001-lifestyle-creep/narration/timing/words.draft.json", "wordHash")
]:
    assert hashlib.sha256(Path(file).read_bytes()).hexdigest() == source[key]
summary = {"creativeApproved": False, "humanListeningReviewed": False, "architectureRemoved": True,
           "backdrop": "fixed seeded rough paper", "sourceScriptAudioAndCuesUnchanged": True, "references": results}
(root / "verification-summary.json").write_text(json.dumps(summary, indent=2) + "\n")
print(json.dumps(results))
