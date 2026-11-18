import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { calculateFreeShippingOrder } from "../src/finance/math.ts";
import {
  A_ROLL_FRAMES,
  freeShippingExample,
  freeShippingOpeningTimeline,
  freeShippingOrder,
} from "../src/scenes/freeShippingOpeningTimeline.ts";

const readWavPcm = (path: string) => {
  const buf = readFileSync(path);
  assert.equal(buf.toString("ascii", 0, 4), "RIFF");
  assert.equal(buf.toString("ascii", 8, 12), "WAVE");
  const channels = buf.readUInt16LE(22);
  const sampleRate = buf.readUInt32LE(24);
  const bitsPerSample = buf.readUInt16LE(34);
  const dataMarker = buf.indexOf("data", 12);
  assert.ok(dataMarker >= 12, `${path} missing data chunk`);
  const dataBytes = buf.readUInt32LE(dataMarker + 4);
  const pcm = buf.subarray(dataMarker + 8, dataMarker + 8 + dataBytes);
  return { channels, sampleRate, bitsPerSample, pcm };
};

test("free-shipping opening timeline compiles 1,800 contiguous frames across 9 scenes and 15 events", () => {
  assert.equal(freeShippingOpeningTimeline.mode, "timing-demo");
  assert.equal(freeShippingOpeningTimeline.fps, 30);
  assert.equal(freeShippingOpeningTimeline.durationMs, 60000);
  assert.equal(freeShippingOpeningTimeline.durationInFrames, 1800);
  assert.equal(freeShippingOpeningTimeline.scenes.length, 9);
  assert.equal(freeShippingOpeningTimeline.events.length, 15);

  let expectedFrom = 0;
  let expectedStartMs = 0;
  for (const scene of freeShippingOpeningTimeline.scenes) {
    assert.equal(scene.from, expectedFrom);
    assert.equal(scene.startMs, expectedStartMs);
    assert.ok(scene.durationInFrames > 0);
    expectedFrom += scene.durationInFrames;
    expectedStartMs = scene.endMs;
  }
  assert.equal(expectedFrom, 1800);
  assert.equal(expectedStartMs, 60000);

  for (const ev of freeShippingOpeningTimeline.events) {
    const parent = freeShippingOpeningTimeline.scenes.find(
      (s) => s.id === ev.sceneId,
    );
    assert.ok(parent, `missing parent scene for ${ev.id}`);
    assert.ok(ev.from >= parent.from);
    assert.ok(
      ev.from + ev.durationInFrames <= parent.from + parent.durationInFrames,
    );
  }
});

test("free-shipping opening visuals derive proportions from calculateFreeShippingOrder()", () => {
  const expected = calculateFreeShippingOrder();
  assert.deepEqual(freeShippingOrder, expected);
  assert.equal(freeShippingOrder.beforeSubtotal, 42);
  assert.equal(freeShippingExample.threshold, 50);
  assert.equal(freeShippingOrder.subtotal, 54);
  assert.equal(freeShippingOrder.overshoot, 4);
  assert.equal(freeShippingOrder.before, 48);
  assert.equal(freeShippingOrder.after, 54);
});

test("FreeShippingOpening.tsx uses audited primitives, source credit, single Audio track, 10-15% ReferenceCharacterRig A-roll, and Decision 14 discipline", () => {
  const source = readFileSync("src/scenes/FreeShippingOpening.tsx", "utf8");
  const root = readFileSync("src/Root.tsx", "utf8");

  assert.equal((source.match(/<Audio\b/g) ?? []).length, 1);
  for (const symbol of [
    "FlipCard",
    "KineticHeadline",
    "ObjectAttachedLabel",
    "TextMorph",
    "Transition",
    "ReferenceCharacterRig",
    "TalkingStickmanPresenter",
    "Shampanier, Mazar and Ariely, 2007",
  ]) {
    assert.ok(source.includes(symbol), `missing ${symbol}`);
  }
  const aRollRatio =
    A_ROLL_FRAMES / freeShippingOpeningTimeline.durationInFrames;
  assert.ok(
    aRollRatio >= 0.1 && aRollRatio <= 0.15,
    `Expected A-roll ratio between 10% and 15%, got ${(aRollRatio * 100).toFixed(2)}%`,
  );
  assert.ok(
    !/\b(fictional|illustrative|hypothetical|demo)\b/i.test(source),
    "Decision 14 forbids on-screen scenario labels in FreeShippingOpening.tsx",
  );
  for (const id of [
    "FreeShippingOpening",
    "FreeShippingCheckoutGallery",
    "FreeShippingChocolateGallery",
  ]) {
    assert.ok(root.includes(`id="${id}"`), `Root.tsx missing ${id}`);
  }
});

test("opening narration excerpt preserves 58.15s of unstretched Daniel PCM followed by digital silence to 60.0s", () => {
  const excerpt = readWavPcm("public/free-shipping-opening/narration.wav");
  const full = readWavPcm(
    "out/004-free-shipping/narration-daniel/narration.wav",
  );

  assert.equal(excerpt.channels, 1);
  assert.equal(excerpt.sampleRate, 48000);
  assert.equal(excerpt.bitsPerSample, 16);
  assert.equal(excerpt.pcm.length, 2880000 * 2);

  const prefixBytes = 2791200 * 2;
  assert.equal(
    Buffer.compare(
      excerpt.pcm.subarray(0, prefixBytes),
      full.pcm.subarray(0, prefixBytes),
    ),
    0,
  );
  const tail = excerpt.pcm.subarray(prefixBytes);
  assert.ok(tail.every((b) => b === 0));
});
