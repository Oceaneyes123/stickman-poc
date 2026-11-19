import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { SFX_CUES } from "../src/audio/cues.ts";
import { freeShippingOpeningTimeline } from "../src/scenes/freeShippingOpeningTimeline.ts";
import { FULL_FILM_DURATION_FRAMES } from "../src/scenes/freeShippingFullTimeline.ts";
import {
  freeShippingFullSfx,
  freeShippingOpeningSfx,
} from "../src/scenes/freeShippingAudioCues.ts";

test("episode 004 ambient bed covers the full film and remains below full scale", () => {
  const metadata = JSON.parse(
    readFileSync("videos/004-free-shipping/full-cues.demo.json", "utf8"),
  ) as { audioDurationMs: number };
  const wav = readFileSync("public/free-shipping-full/ambient.wav");
  assert.equal(wav.toString("ascii", 0, 4), "RIFF");
  assert.equal(wav.toString("ascii", 8, 12), "WAVE");
  assert.equal(wav.readUInt16LE(22), 1);
  assert.equal(wav.readUInt16LE(34), 16);
  const rate = wav.readUInt32LE(24);
  assert.equal(rate, 44100);
  const start = wav.indexOf("data", 12) + 8;
  const count = wav.readUInt32LE(start - 4) / 2;
  assert.equal(count, Math.ceil(((metadata.audioDurationMs + 2000) * rate) / 1000));
  let peak = 0;
  let energy = 0;
  for (let i = 0; i < count; i++) {
    const sample = wav.readInt16LE(start + i * 2);
    peak = Math.max(peak, Math.abs(sample));
    energy += sample * sample;
  }
  assert.ok(peak > 100 && peak < 32767, `unexpected peak ${peak}`);
  assert.ok(energy > 0);
  assert.equal(wav.readInt16LE(start), 0);
});

test("episode 004 SFX cues reference valid reduced-level WAVs within film bounds", () => {
  assert.ok(freeShippingOpeningSfx.length >= 30);
  assert.ok(freeShippingFullSfx.length > freeShippingOpeningSfx.length);

  const checkList = (
    cues: typeof freeShippingFullSfx,
    totalFrames: number,
    label: string,
  ) => {
    const seen = new Set<string>();
    let prevFrame = -1;
    for (const [frame, name, volume] of cues) {
      assert.ok(name in SFX_CUES, `${label}: unknown cue ${name}`);
      assert.ok(
        existsSync(`public/sfx/${name}.wav`),
        `${label}: missing public/sfx/${name}.wav`,
      );
      assert.ok(
        volume !== undefined && volume > 0 && volume <= 0.35,
        `${label}: ${name} volume ${volume} should stay subtle under narration`,
      );
      assert.ok(
        frame >= 0 && frame < totalFrames,
        `${label}: ${name} starts out of bounds at ${frame}`,
      );
      const cueFrames = Math.ceil(SFX_CUES[name].seconds * 30);
      assert.ok(
        frame + cueFrames <= totalFrames,
        `${label}: ${name} at ${frame} (${cueFrames}f) exceeds ${totalFrames}`,
      );
      assert.ok(
        frame >= prevFrame,
        `${label}: ${name} at ${frame} is out of order (< ${prevFrame})`,
      );
      prevFrame = frame;
      const key = `${frame}:${name}`;
      assert.ok(!seen.has(key), `${label}: duplicate cue ${key}`);
      seen.add(key);
    }
  };

  checkList(
    freeShippingOpeningSfx,
    freeShippingOpeningTimeline.durationInFrames,
    "opening",
  );
  checkList(freeShippingFullSfx, FULL_FILM_DURATION_FRAMES, "full");
});

test("FreeShippingOpening and FreeShippingFullFilm mount their sound components", () => {
  const openingSrc = readFileSync("src/scenes/FreeShippingOpening.tsx", "utf8");
  const remainingSrc = readFileSync(
    "src/scenes/FreeShippingRemaining.tsx",
    "utf8",
  );
  assert.ok(openingSrc.includes("<FreeShippingOpeningSound />"));
  assert.ok(remainingSrc.includes("<FreeShippingSound />"));
});
