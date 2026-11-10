import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  numberAt,
  rollingDigit,
  typeProgress,
} from "../src/typography/timing.ts";
import {
  compileTypography,
  resolveTypeAnchor,
  type DraftTiming,
  type TypographyPlan,
} from "../src/typography/plan.ts";
import { cinematicStillShots } from "../src/storyboard/cinematicStillPlan.ts";
import { parseStoryboard } from "../src/storyboard/remainingShots.ts";
const plan = JSON.parse(
  readFileSync("videos/001-lifestyle-creep/typography-plan.json", "utf8"),
) as TypographyPlan;
test("rolling digits settle on the exact financial value and only carry at rollover", () => {
  for (const value of [480, 380, 3600, 1560, 2400, 5040, -100]) {
    for (let power = 1; power <= Math.abs(value); power *= 10)
      assert.equal(
        rollingDigit(value, power),
        Math.floor(Math.abs(value) / power) % 10,
      );
  }
  assert.equal(rollingDigit(479, 100), 4);
  assert.equal(rollingDigit(479.5, 10), 7.5);
  assert.equal(rollingDigit(499.5, 100), 4.5);
});
test("typography decisions cover every scene and all 99 baseline panels without silently restoring old labels", () => {
  const board = parseStoryboard(
    readFileSync("videos/001-lifestyle-creep/storyboard.md", "utf8"),
  );
  assert.deepEqual(
    plan.scenes.map((s) => s.id),
    board.map((s) => s.id),
  );
  assert.deepEqual(
    plan.panels.map((p) => p.id),
    cinematicStillShots.map((p) => p.id),
  );
  assert.equal(new Set(plan.beats.map((b) => b.id)).size, plan.beats.length);
  for (const s of board) {
    assert(plan.beats.some((b) => b.sceneId === s.id));
    for (const cue of s.cueIds)
      assert(
        plan.beats.some((b) => b.anchor.cueId === cue),
        cue,
      );
  }
  for (const b of plan.beats) {
    assert(b.reason);
    if (b.mode === "VISUAL_ONLY") assert.deepEqual(b.text, []);
  }
  assert(
    plan.beats.filter((b) => b.mode === "VISUAL_ONLY").length >
      plan.beats.length / 2,
  );
});
test("frame seeking is bounded, repeatable and numbers settle exactly for either direction", () => {
  const timing = { from: 20, until: 120 };
  assert.equal(typeProgress(19, timing).visible, false);
  assert.equal(typeProgress(120, timing).visible, false);
  assert.equal(typeProgress(50, timing).in, 1);
  for (const value of [380, 800, -100, 0]) {
    assert.equal(numberAt(19, 20, 18, value), 0);
    assert.equal(numberAt(38, 20, 18, value), value);
    const forward = Array.from({ length: 60 }, (_, f) =>
      numberAt(f, 20, 18, value),
    );
    for (let f = 59; f >= 0; f--)
      assert.equal(numberAt(f, 20, 18, value), forward[f]);
  }
  assert.throws(() => numberAt(0, 0, 0, 1), /Invalid/);
  assert.throws(() => typeProgress(0, { from: 10, until: 10 }), /positive/);
});
const draft: DraftTiming = {
  mode: "draft",
  durationMs: 2000,
  scriptHash: "test",
  sourceAudioSha256: "test",
  listeningReviewed: false,
  timingReviewed: false,
  cues: [
    { id: "a", startMs: 0, endMs: 1000, text: "Example", wordIds: ["a-w1"] },
    { id: "b", startMs: 1000, endMs: 1900, text: "Result", wordIds: ["b-w1"] },
  ],
};
const words = [
  { id: "a-w1", startMs: 300, endMs: 500, text: "Example" },
  { id: "b-w1", startMs: 1200, endMs: 1400, text: "Result" },
];
test("word anchors belong to their cue and draft timing never becomes aligned", () => {
  const input: TypographyPlan = {
    scenes: [
      { id: "S01", title: "First", firstCue: "a" },
      { id: "S02", title: "Second", firstCue: "b" },
    ],
    beats: [],
    panels: [
      {
        id: "one",
        sceneId: "S01",
        anchor: { cueId: "a", edge: "start" },
        phaseOffsetFrames: 0,
      },
      {
        id: "two",
        sceneId: "S02",
        anchor: { cueId: "b", edge: "start" },
        phaseOffsetFrames: 0,
      },
    ],
    gates: [
      {
        sceneId: "S02",
        key: "sam",
        anchor: { cueId: "b", wordId: "b-w1", edge: "end" },
      },
    ],
  };
  const output = compileTypography(input, draft, words);
  assert.equal(output.timeline.mode, "timing-demo");
  assert.equal(output.timeline.durationInFrames, 60);
  assert.equal(output.panels.at(-1)!.until, 60);
  assert.equal(output.gates[0].from, 42);
  const confirmation = structuredClone(input);
  confirmation.scenes[1].confirmationAnchor = {
    cueId: "b",
    wordId: "b-w1",
    edge: "end",
  };
  assert.equal(
    compileTypography(confirmation, draft, words).confirmations[0].from,
    42,
  );
  confirmation.scenes[1].confirmationAnchor = {
    cueId: "a",
    wordId: "a-w1",
    edge: "end",
  };
  assert.throws(
    () => compileTypography(confirmation, draft, words),
    /Confirmation outside scene/,
  );
  const short = {
    ...plan.beats.find((b) => b.text.length)!,
    id: "short",
    sceneId: "S01",
    anchor: { cueId: "a", wordId: "a-w1", edge: "end" },
    text: ["Read this"],
    mode: "CONTEXTUAL_LABEL",
    readingHoldFrames: 48,
    enterFrames: 15,
    exitFrames: 10,
    holdToSceneEnd: false,
    persistThroughPanels: false,
  };
  assert.deepEqual(
    compileTypography({ ...input, beats: [short] }, draft, words).shortHolds,
    ["short"],
  );
  assert.throws(
    () =>
      resolveTypeAnchor(
        { cueId: "a", wordId: "b-w1", edge: "end" },
        draft,
        words,
      ),
    /Invalid typography word/,
  );
  assert.throws(
    () =>
      compileTypography(
        { ...input, gates: [{ ...input.gates[0], key: "unknown" }] },
        draft,
        words,
      ),
    /Unknown finance/,
  );
});
