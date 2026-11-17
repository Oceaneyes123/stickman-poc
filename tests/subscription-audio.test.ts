import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("original ambient bed covers the film and remains below full scale", () => {
  const metadata = JSON.parse(readFileSync("videos/003-subscription-cancellation/closing-cue.demo.json", "utf8"));
  const wav = readFileSync("public/subscription-full/ambient.wav");
  assert.equal(wav.toString("ascii", 0, 4), "RIFF");
  assert.equal(wav.toString("ascii", 8, 12), "WAVE");
  assert.equal(wav.readUInt16LE(22), 1);
  assert.equal(wav.readUInt16LE(34), 16);
  const rate = wav.readUInt32LE(24);
  const start = wav.indexOf("data", 12) + 8;
  const count = wav.readUInt32LE(start - 4) / 2;
  assert.equal(count, Math.ceil((metadata.audioDurationMs + 2000) * rate / 1000));
  let peak = 0;
  let energy = 0;
  for (let i = 0; i < count; i++) {
    const sample = wav.readInt16LE(start + i * 2);
    peak = Math.max(peak, Math.abs(sample));
    energy += sample * sample;
  }
  assert.ok(peak > 100 && peak < 32767);
  assert.ok(energy > 0);
  assert.equal(wav.readInt16LE(start), 0);
});
