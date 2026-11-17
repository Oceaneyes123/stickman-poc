"""Generate an original, deterministic instrumental bed for episode 003."""
import json
import math
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
META = ROOT / "videos/003-subscription-cancellation/closing-cue.demo.json"
OUT = ROOT / "public/subscription-full/ambient.wav"
RATE = 22050
DURATION = (json.loads(META.read_text(encoding="utf-8"))["audioDurationMs"] + 2000) / 1000
CHORDS = ((57, 60, 64, 69), (53, 57, 60, 65), (48, 55, 60, 64), (55, 59, 62, 67))


def frequency(note):
    return 440 * 2 ** ((note - 69) / 12)


with wave.open(str(OUT), "wb") as out:
    out.setnchannels(1)
    out.setsampwidth(2)
    out.setframerate(RATE)
    for start in range(0, math.ceil(DURATION * RATE), RATE * 8):
        count = min(RATE * 8, math.ceil(DURATION * RATE) - start)
        t = (np.arange(count, dtype=np.float64) + start) / RATE
        chord = int(start / RATE / 8)
        crossfade = np.clip((t % 8) / 2, 0, 1)
        crossfade = crossfade * crossfade * (3 - 2 * crossfade)
        signal = np.zeros(count)
        for index, weight in ((chord - 1, 1 - crossfade), (chord, crossfade)):
            notes = CHORDS[index % len(CHORDS)]
            for n, note in enumerate(notes):
                f = frequency(note - (12 if n == 0 else 0))
                signal += weight * (np.sin(2 * np.pi * f * t) + 0.16 * np.sin(2 * np.pi * f * 2 * t)) / 8
        # A slow, soft pulse and sparse upper notes add motion without percussion.
        pulse = 0.86 + 0.14 * np.sin(2 * np.pi * t / 4)
        note_start = np.floor(t / 4) * 4
        note_age = t - note_start
        pitch = frequency(CHORDS[chord % len(CHORDS)][2] + 12)
        note = np.sin(2 * np.pi * pitch * t) * np.exp(-note_age * 2.3) * np.minimum(note_age * 12, 1)
        tension = np.clip((t - 99) / 20, 0, 1) * (1 - np.clip((t - 330) / 20, 0, 1))
        signal = (signal * pulse * (0.72 + 0.12 * tension) + note * 0.025) * 0.55
        fade = np.minimum(np.clip(t / 3, 0, 1), np.clip((DURATION - t) / 2, 0, 1))
        pcm = np.round(np.clip(signal * fade, -1, 1) * 32767).astype('<i2')
        out.writeframes(pcm.tobytes())
