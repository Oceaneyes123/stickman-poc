import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import {
  SFX_CUES,
  SFX_GROUPS,
  SFX_NAMES,
  sfxCuesIn,
  type SfxName,
} from "../src/audio/cues.ts";

const SR = 44100;
const DIR = "public/sfx";

/** The brief this library answers: every listed effect has a cue. */
const REQUESTED: SfxName[] = [
  // money and finance
  "coin_clink",
  "coin_shower",
  "cash_register",
  "bill_flutter",
  "printer_whir",
  "wallet_zip",
  "stamp_thud",
  "calculator_taps",
  // charts and data
  "whoosh_rise",
  "slide_whistle_down",
  "counter_roll",
  "bar_thump",
  "marker_squeak",
  "ding",
  // stickman and comedy
  "boing",
  "pop",
  "squash_thud",
  "slide_whistle_up",
  "gulp",
  "sad_trombone",
  "record_scratch",
  "facepalm_slap",
  // transitions and emphasis
  "whoosh_short",
  "whoosh_long",
  "swish",
  "impact_boom",
  "riser",
  "glitch_zap",
  // ambience and ending
  "clock_tick",
  "sparkle_chime",
];

type Wav = { rate: number; channels: number; bits: number; samples: Int16Array };

function readWav(file: string): Wav {
  const buf = readFileSync(file);
  assert.equal(buf.toString("ascii", 0, 4), "RIFF", `${file} is not RIFF`);
  assert.equal(buf.toString("ascii", 8, 12), "WAVE", `${file} is not WAVE`);
  const channels = buf.readUInt16LE(22);
  const rate = buf.readUInt32LE(24);
  const bits = buf.readUInt16LE(34);
  const dataStart = buf.indexOf("data", 12) + 8;
  const count = buf.readUInt32LE(dataStart - 4) / 2;
  const samples = new Int16Array(count);
  for (let i = 0; i < count; i++) samples[i] = buf.readInt16LE(dataStart + i * 2);
  return { rate, channels, bits, samples };
}

test("catalogue covers the requested effects once each", () => {
  assert.equal(SFX_NAMES.length, REQUESTED.length);
  for (const name of REQUESTED) {
    assert.ok(name in SFX_CUES, `missing cue: ${name}`);
  }
  assert.equal(new Set(SFX_NAMES).size, SFX_NAMES.length, "duplicate cue names");
});

test("every category has cues and a label", () => {
  const labelled = SFX_GROUPS.map((group) => group.id);
  assert.equal(new Set(labelled).size, labelled.length, "duplicate group id");
  for (const group of SFX_GROUPS) {
    assert.ok(group.label.length > 0, `${group.id} needs a label`);
    assert.ok(sfxCuesIn(group.id).length > 0, `${group.id} has no cues`);
  }
  for (const name of SFX_NAMES) {
    assert.ok(labelled.includes(SFX_CUES[name].category), `${name} has an unknown category`);
  }
});

test("default levels and lengths are sane", () => {
  for (const name of SFX_NAMES) {
    const meta = SFX_CUES[name];
    assert.ok(meta.seconds >= 0.2 && meta.seconds <= 6, `${name} length out of range`);
    assert.ok(meta.volume > 0 && meta.volume <= 1, `${name} volume out of range`);
    assert.ok(meta.use.length > 0, `${name} needs a gallery description`);
  }
});

test("every cue is rendered to public/sfx with the declared length", () => {
  for (const name of SFX_NAMES) {
    const file = `${DIR}/${name}.wav`;
    assert.ok(existsSync(file), `${file} missing: run npm run sfx`);
    const wav = readWav(file);
    assert.equal(wav.rate, SR, `${name} sample rate`);
    assert.equal(wav.channels, 1, `${name} should be mono`);
    assert.equal(wav.bits, 16, `${name} should be 16-bit`);
    const expected = Math.round(SFX_CUES[name].seconds * SR);
    assert.equal(wav.samples.length, expected, `${name} length does not match the catalogue`);
  }
});

test("rendered cues are audible, normalised and not clipped", () => {
  for (const name of SFX_NAMES) {
    const { samples } = readWav(`${DIR}/${name}.wav`);
    let peak = 0;
    let energy = 0;
    for (let i = 0; i < samples.length; i++) {
      const v = samples[i] / 32768;
      peak = Math.max(peak, Math.abs(v));
      energy += v * v;
    }
    const rms = Math.sqrt(energy / samples.length);
    assert.ok(peak > 0.5 && peak <= 0.72, `${name} peak ${peak.toFixed(2)} is silent or clipped`);
    assert.ok(rms > 0.005, `${name} is effectively silent`);
  }
});

test("the folder holds nothing the catalogue does not name", () => {
  const files = existsSync(DIR)
    ? readdirSync(DIR).filter((file) => file.endsWith(".wav"))
    : [];
  const strays = files.filter((file) => !(file.replace(".wav", "") in SFX_CUES));
  assert.deepEqual(strays, [], "remove stale WAVs or add them to the catalogue");
});
