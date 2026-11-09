import assert from "node:assert/strict";
import { test } from "node:test";
import { cueAtFrame, reviewCues } from "../src/review/timing.ts";

test("review includes only the first two audio durations and clips crossing cues", () => {
  const cues = [
    { id: "a", text: "First.", startMs: 100, endMs: 200 },
    { id: "b", text: "Second.", startMs: 300, endMs: 800 },
    { id: "c", text: "Third.", startMs: 900, endMs: 1000 },
  ];
  const selected = reviewCues(cues, 700);
  assert.deepEqual(
    selected.map((cue) => cue.id),
    ["a", "b"],
  );
  assert.equal(selected[1].endMs, 700);
  assert.equal(cues[1].endMs, 800);
  assert.equal(cueAtFrame(selected, 3)?.text, "First.");
  assert.equal(cueAtFrame(selected, 6), undefined);
  assert.equal(cueAtFrame(selected, 7), undefined);
  assert.equal(cueAtFrame(selected, 21), undefined);
});

test("review rejects bad intervals and duplicate IDs instead of guessing timing", () => {
  assert.throws(() => reviewCues([], NaN), /duration/);
  assert.throws(
    () => reviewCues([{ id: "x", text: "x", startMs: 0, endMs: 0.1 }], 100),
    /one frame/,
  );
  const cue = { id: "x", text: "x", startMs: 0, endMs: 50 };
  assert.throws(
    () => reviewCues([cue, { ...cue, startMs: 60, endMs: 80 }], 100),
    /Invalid review cue/,
  );
  assert.throws(
    () => reviewCues([cue, { ...cue, id: "y", startMs: 40, endMs: 80 }], 100),
    /Invalid review cue/,
  );
});
