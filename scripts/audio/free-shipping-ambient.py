"""Generate an original, deterministic subtle ambient bed for episode 004."""
import json
import math
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
META = ROOT / "videos/004-free-shipping/full-cues.demo.json"
OUT = ROOT / "public/free-shipping-full/ambient.wav"
RATE = 44100
TAIL_MS = 2000
DURATION = (json.loads(META.read_text(encoding="utf-8"))["audioDurationMs"] + TAIL_MS) / 1000

# Warm editorial progression: Fmaj9 -> G6 -> Am9 -> Cmaj7
CHORDS = (
    (53, 60, 64, 67, 72),
    (55, 59, 62, 64, 71),
    (45, 55, 60, 64, 71),
    (48, 55, 59, 64, 67),
)
ARP_ORDER = (1, 2, 4, 3)


def frequency(note: int) -> float:
    return 440.0 * (2.0 ** ((note - 69) / 12.0))


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    total_samples = math.ceil(DURATION * RATE)
    chunk_samples = RATE * 8

    with wave.open(str(OUT), "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(RATE)

        for start in range(0, total_samples, chunk_samples):
            count = min(chunk_samples, total_samples - start)
            t = (np.arange(count, dtype=np.float64) + start) / RATE
            chord_idx = int(start // chunk_samples)

            crossfade = np.clip((t % 8.0) / 2.5, 0.0, 1.0)
            crossfade = crossfade * crossfade * (3.0 - 2.0 * crossfade)

            pad = np.zeros(count, dtype=np.float64)
            for idx, weight in ((chord_idx - 1, 1.0 - crossfade), (chord_idx, crossfade)):
                notes = CHORDS[idx % len(CHORDS)]
                for n_idx, note in enumerate(notes):
                    f = frequency(note)
                    # Keep bass gentle and upper partials soft so speech stays clear.
                    tone_weight = 0.75 if n_idx == 0 else 1.0
                    voice = (
                        np.sin(2.0 * np.pi * f * t)
                        + 0.12 * np.sin(2.0 * np.pi * (2.0 * f) * t)
                        + 0.03 * np.sin(2.0 * np.pi * (3.0 * f) * t)
                    )
                    pad += weight * tone_weight * (voice / (len(notes) * 1.35))

            # Slow breathing swell without percussion.
            breath = 0.88 + 0.12 * np.sin(2.0 * np.pi * t / 6.0)

            # Soft felt-like pulse notes every 2 seconds.
            step_idx = np.floor(t / 2.0).astype(np.int64)
            step_age = t - step_idx * 2.0
            arp_voices = np.zeros(count, dtype=np.float64)
            current_chord = CHORDS[chord_idx % len(CHORDS)]
            for local_step in np.unique(step_idx):
                mask = step_idx == local_step
                note_choice = current_chord[ARP_ORDER[int(local_step) % len(ARP_ORDER)]] + 12
                f_note = frequency(note_choice)
                age = step_age[mask]
                env = np.minimum(age / 0.045, 1.0) * np.exp(-age * 2.1)
                arp_voices[mask] = (
                    np.sin(2.0 * np.pi * f_note * t[mask])
                    + 0.08 * np.sin(2.0 * np.pi * (2.0 * f_note) * t[mask])
                ) * env

            # Gentle mid-film engagement lift, relaxing toward the close.
            arc = np.clip((t - 45.0) / 25.0, 0.0, 1.0) * (
                1.0 - np.clip((t - (DURATION - 65.0)) / 30.0, 0.0, 1.0)
            )
            signal = (pad * breath * (0.76 + 0.10 * arc) + arp_voices * 0.026) * 0.42

            fade = np.minimum(
                np.clip(t / 3.0, 0.0, 1.0),
                np.clip((DURATION - t) / 2.5, 0.0, 1.0),
            )
            pcm = np.round(np.clip(signal * fade, -1.0, 1.0) * 32767.0).astype("<i2")
            out.writeframes(pcm.tobytes())


if __name__ == "__main__":
    main()
