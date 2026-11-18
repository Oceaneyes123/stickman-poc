import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  CUTAWAY_VARIANTS,
  FULL_CUTAWAYS,
  FULL_FILM_A_ROLL_FRAMES,
  FULL_FILM_DURATION_FRAMES,
  OPENING_CUTAWAYS,
  freeShippingFullTimeline,
} from "../src/scenes/freeShippingFullTimeline.ts";

const sha256File = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

test("full Episode 004 timeline compiles 15,205 contiguous frames across 46 scenes with valid bounds", () => {
  assert.equal(freeShippingFullTimeline.mode, "timing-demo");
  assert.equal(freeShippingFullTimeline.fps, 30);
  assert.equal(freeShippingFullTimeline.durationInFrames, 15205);
  assert.equal(FULL_FILM_DURATION_FRAMES, 15205);
  assert.equal(freeShippingFullTimeline.scenes.length, 46);
  assert.equal(freeShippingFullTimeline.events.length, 36);

  let expectedFrom = 0;
  let expectedStartMs = 0;
  for (const scene of freeShippingFullTimeline.scenes) {
    assert.equal(scene.from, expectedFrom, `gap at ${scene.id}`);
    assert.equal(scene.startMs, expectedStartMs, `ms gap at ${scene.id}`);
    assert.ok(scene.durationInFrames > 0);
    expectedFrom += scene.durationInFrames;
    expectedStartMs = scene.endMs;
  }
  assert.equal(expectedFrom, FULL_FILM_DURATION_FRAMES);

  for (const ev of freeShippingFullTimeline.events) {
    const parent = freeShippingFullTimeline.scenes.find(
      (s) => s.id === ev.sceneId,
    );
    assert.ok(parent, `missing parent scene for ${ev.id}`);
    assert.ok(ev.from >= parent.from, `${ev.id} starts before scene`);
    assert.ok(
      ev.from + ev.durationInFrames <= parent.from + parent.durationInFrames,
      `${ev.id} extends past scene`,
    );
  }
});

test("all 15 kinetic cutaways use unique variants with readable holds and opening cutaways stay inside 1,800 frames", () => {
  assert.equal(FULL_CUTAWAYS.length, 15);
  assert.equal(OPENING_CUTAWAYS.length, 3);

  const variants = FULL_CUTAWAYS.map((c) => String(c.payload.variant));
  assert.equal(new Set(variants).size, CUTAWAY_VARIANTS.length);
  for (const variant of CUTAWAY_VARIANTS) {
    assert.ok(variants.includes(variant), `missing cutaway variant ${variant}`);
  }
  for (const cutaway of FULL_CUTAWAYS) {
    assert.ok(
      cutaway.durationInFrames >= 60,
      `${cutaway.id} cutaway too short (${cutaway.durationInFrames}f)`,
    );
    assert.ok(
      String(cutaway.payload.text).trim().length > 0,
      `${cutaway.id} missing cutaway text`,
    );
  }
  for (const cutaway of OPENING_CUTAWAYS) {
    assert.ok(cutaway.from + cutaway.durationInFrames <= 1800);
  }
});

test("remaining film scenes, cutaway variants, A-roll ratio, Root registrations, and Decision 14 discipline pass", () => {
  const remainingSource = readFileSync(
    "src/scenes/FreeShippingRemaining.tsx",
    "utf8",
  );
  const cutawaysSource = readFileSync(
    "src/scenes/FreeShippingCutaways.tsx",
    "utf8",
  );
  const openingSource = readFileSync(
    "src/scenes/FreeShippingOpening.tsx",
    "utf8",
  );
  const root = readFileSync("src/Root.tsx", "utf8");

  for (const scene of freeShippingFullTimeline.scenes.slice(9)) {
    assert.ok(
      remainingSource.includes(`id === "${scene.id}"`),
      `FreeShippingRemaining.tsx missing scene branch ${scene.id}`,
    );
  }
  for (const variant of CUTAWAY_VARIANTS) {
    assert.ok(
      cutawaysSource.includes(`variant === "${variant}"`),
      `FreeShippingCutaways.tsx missing variant ${variant}`,
    );
  }

  const aRollRatio = FULL_FILM_A_ROLL_FRAMES / FULL_FILM_DURATION_FRAMES;
  assert.ok(
    aRollRatio >= 0.1 && aRollRatio <= 0.15,
    `Expected full-film A-roll ratio between 10% and 15%, got ${(aRollRatio * 100).toFixed(2)}%`,
  );

  const fullFilmSection = remainingSource.split(
    "export const FreeShippingFullFilm:",
  )[1];
  assert.equal((fullFilmSection.match(/<Audio\b/g) ?? []).length, 1);

  for (const fileSource of [openingSource, cutawaysSource, remainingSource]) {
    assert.ok(
      !/\b(fictional|illustrative|hypothetical|demo)\b/i.test(fileSource),
      "Decision 14 forbids on-screen scenario labels in FreeShipping components",
    );
  }

  for (const id of [
    "FreeShippingOpening",
    "FreeShippingFullFilm",
    "FreeShippingCutawayGallery",
    "FreeShippingRemainingGallery",
  ]) {
    assert.ok(root.includes(`id="${id}"`), `Root.tsx missing composition ${id}`);
  }
});

test("staged full narration WAV matches generated Daniel master WAV byte-for-byte", () => {
  const srcHash = sha256File(
    "out/004-free-shipping/narration-daniel/narration.wav",
  );
  const stagedHash = sha256File("public/free-shipping-full/narration.wav");
  assert.equal(stagedHash, srcHash);

  const buf = readFileSync("public/free-shipping-full/narration.wav");
  assert.equal(buf.toString("ascii", 0, 4), "RIFF");
  assert.equal(buf.toString("ascii", 8, 12), "WAVE");
  assert.equal(buf.readUInt16LE(22), 1);
  assert.equal(buf.readUInt32LE(24), 48000);
  assert.equal(buf.readUInt16LE(34), 16);
});
