import assert from "node:assert/strict";
import { test } from "node:test";
import { referenceSkeleton } from "../src/characters/referenceModel.ts";
import { payInFour } from "../src/finance/math.ts";
import {
  compileBuyNow,
  findQuote,
  type FilmPlan,
  type TimingFile,
  type TimingWord,
} from "../src/storyboard/buyNowPlan.ts";

test("pay in four splits the jacket price without changing the total", () => {
  const plan = payInFour(240, 4);
  assert.equal(plan.installment, 60);
  assert.equal(plan.installment * plan.count, plan.total);
  for (const [total, count] of [
    [0, 4],
    [240, 0],
    [241, 4],
    [240, 2.5],
    [Number.NaN, 4],
  ] as const)
    assert.throws(() => payInFour(total, count));
});

const words = (text: string, start = 0, step = 400): TimingWord[] =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => ({
      id: `w${index}`,
      text: word,
      startMs: start + index * step,
      endMs: start + index * step + step * 0.8,
    }));

test("a scene quote is located in the measured word stream", () => {
  const stream = words("Sam bought a jacket. He closed the tab twice.");
  const found = findQuote("Sam bought a jacket.", stream);
  assert.equal(found.startWord, 0);
  assert.ok(found.score > 0.9);
  assert.throws(() => findQuote("A completely different sentence.", stream));
});

test("compiled scenes, text and SFX stay inside measured windows", () => {
  const stream = words("One two three four. Five six seven eight. Nine ten eleven twelve.");
  const timing: TimingFile = {
    mode: "draft",
    durationMs: 4800,
    scriptHash: "test",
    sourceAudioSha256: "test",
    cues: [
      { id: "c1", text: "One two three four.", startMs: 0, endMs: 1600, wordIds: [] },
      { id: "c2", text: "Five six seven eight.", startMs: 1600, endMs: 3200, wordIds: [] },
      { id: "c3", text: "Nine ten eleven twelve.", startMs: 3200, endMs: 4800, wordIds: [] },
    ],
  };
  const plan: FilmPlan = {
    version: 1,
    fps: 30,
    tailFrames: 15,
    amounts: { total: 240, count: 4 },
    scenes: [
      {
        id: "S01",
        title: "one",
        quote: "One two three four.",
        stage: "desk",
        text: [{ value: 240, preset: "amount", x: 900, y: 400, anchorWord: "three" }],
        sfx: [[0.5, "pop", 0.4]],
      },
      {
        id: "S02",
        title: "two",
        quote: "Five six seven eight.",
        stage: "band",
        band: "split",
      },
      {
        id: "S03",
        title: "three",
        quote: "Nine ten eleven twelve.",
        stage: "rail",
      },
    ],
  };
  const data = compileBuyNow(plan, timing, stream, 4800, { pop: 600 });
  assert.equal(data.scenes.length, 3);
  assert.equal(data.amounts.installment, 60);
  assert.equal(data.durationInFrames, Math.round((4800 * 30) / 1000) + 15);
  let cursor = 0;
  for (const scene of data.scenes) {
    assert.equal(scene.from, cursor);
    assert.ok(scene.until > scene.from);
    assert.ok(scene.from >= 0);
    assert.ok(scene.until <= data.durationInFrames);
    cursor = scene.until;
  }
  assert.equal(cursor, data.durationInFrames);
  assert.equal(data.texts.length, 1);
  assert.ok(data.texts[0].from >= data.scenes[0].from);
  assert.ok(data.texts[0].until <= data.scenes[0].until);
  assert.equal(data.sfx.length, 1);
  assert.ok(data.sfx[0].frame >= data.scenes[0].from);
  assert.ok(data.sfx[0].frame < data.scenes[0].until);
  assert.throws(
    () => compileBuyNow(plan, timing, stream, 4800),
    /Measured length is missing/,
  );
  assert.throws(() =>
    compileBuyNow(
      {
        ...plan,
        scenes: [
          { ...plan.scenes[0], text: [{ value: 999, preset: "amount", x: 900, y: 400 }] },
        ],
      },
      timing,
      stream,
      4800,
    ),
  );
});

test("a seated shot starts in its declared pose instead of standing up", () => {
  // Mirrors BuyNowStage's Actor wiring: fromPose is the shot's declared pose.
  const seated = referenceSkeleton({ frame: 0, pose: "sitting", fromPose: "sitting" });
  const standing = referenceSkeleton({ frame: 0, pose: "standing", fromPose: "standing" });
  const previous = referenceSkeleton({ frame: 0, pose: "sitting", fromPose: "standing" });
  assert.ok(seated.hip.y - standing.hip.y > 30, "seated hips must sit clearly lower");
  assert.equal(previous.hip.y, standing.hip.y, "the old wiring reproduced standing on frame 0");
});
