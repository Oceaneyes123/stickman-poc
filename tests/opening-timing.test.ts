import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  compileOpening,
  type OpeningPlan,
} from "../src/storyboard/openingTiming.ts";
const plan = JSON.parse(
  readFileSync("videos/001-lifestyle-creep/opening.storyboard.json", "utf8"),
) as OpeningPlan;
const ids = [...new Set([...plan.shots.map((s) => s.cue), plan.endCue])];
const cues = ids.map((id, i) => ({
  id,
  text: id,
  startMs: i * 3000,
  endMs: i * 3000 + 2500,
}));
const words = plan.markers.map((m, i) => ({
  id: m.wordId,
  startMs: cues.find((c) => c.id === m.cueId)!.startMs + 200 + i * 100,
}));
const durationMs = cues.at(-1)!.startMs;
const provenance = { scriptHash: "fixture", audioHash: "fixture" };
test("opening compiles contiguous absolute-frame cuts through S06 and preserves narration duration", () => {
  const timeline = compileOpening(plan, cues, words, provenance, durationMs);
  assert.equal(timeline.durationInFrames, Math.round((durationMs * 30) / 1000));
  assert.deepEqual(
    [...new Set(timeline.scenes.map((s) => s.id.slice(0, 3)))],
    ["S01", "S02", "S03", "S04", "S05", "S06"],
  );
  timeline.scenes.forEach((s, i) =>
    assert.equal(
      s.from,
      i === 0
        ? 0
        : timeline.scenes[i - 1].from + timeline.scenes[i - 1].durationInFrames,
    ),
  );
  assert.equal(
    timeline.events.find((e) => e.id === "saved")!.from,
    Math.round((words.find((w) => w.id === "p002-w026")!.startMs * 30) / 1000),
  );
  assert.deepEqual(
    timeline,
    compileOpening(plan, cues, words, provenance, durationMs),
  );
});
test("opening rejects missing or misplaced word anchors and a mismatched audio cutoff", () => {
  assert.throws(
    () => compileOpening(plan, cues, [], provenance, durationMs),
    /word anchor/,
  );
  assert.throws(
    () =>
      compileOpening(
        plan,
        cues,
        words.map((w) => ({ ...w, startMs: -1 })),
        provenance,
        durationMs,
      ),
    /word anchor/,
  );
  assert.throws(
    () => compileOpening(plan, cues, words, provenance, durationMs + 34),
    /audio must end/,
  );
});
