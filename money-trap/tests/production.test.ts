import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  calculateBudget,
  debtTotal,
  example,
  remaining,
  sum,
} from "../src/finance/math.ts";
import { compileTimeline, msToFrames } from "../src/timeline/compiler.ts";
import type { CueFile, Storyboard } from "../src/timeline/types.ts";
import { limb, walkFoot } from "../src/characters/kinematics.ts";
const cues = JSON.parse(
  readFileSync("videos/001-lifestyle-creep/cues.json", "utf8"),
) as CueFile;
const board = JSON.parse(
  readFileSync("videos/001-lifestyle-creep/storyboard.json", "utf8"),
) as Storyboard;
const clone = <T>(data: T): T => structuredClone(data);
test("required hypothetical monthly arithmetic", () => {
  assert.equal(remaining(3000, 2600), 400);
  assert.equal(remaining(3600, 3220), 380);
  assert.equal(remaining(3600, 2800), 800);
  assert.equal(sum([300, 220, 100]), 620);
  assert.deepEqual(calculateBudget(example), {
    added: 620,
    income: 3600,
    before: 400,
    samExpenses: 3220,
    sam: 380,
    alexExpenses: 2800,
    alex: 800,
  });
});
test("changing dataset derives every total", () => {
  const data = { ...example, raise: 700, alexAdded: 250 };
  assert.equal(calculateBudget(data).sam, 480);
  assert.equal(calculateBudget(data).alex, 850);
  assert.throws(() => calculateBudget({ ...example, income: NaN }), /finite/);
});
test("illustrative monthly-compounding debt, validation and zero periods", () => {
  assert.equal(debtTotal(1000, 0.12, 12), 1126.83);
  assert.equal(debtTotal(1000, 0, 12), 1000);
  assert.equal(debtTotal(1000, 0.12, 0), 1000);
  assert.throws(() => debtTotal(-1, 0.12, 12), /nonnegative/);
});
test("compiler deterministic and final duration preserved with consistent rounding", () => {
  const a = compileTimeline(cues, board),
    b = compileTimeline(clone(cues), clone(board));
  assert.deepEqual(a, b);
  assert.equal(a.durationInFrames, 2340);
  assert.equal(msToFrames(1050, 30), 32);
  assert.equal(
    a.scenes.at(-1)!.from + a.scenes.at(-1)!.durationInFrames,
    a.durationInFrames,
  );
});
test("cue edits move scene boundaries and financial events together", () => {
  const updated = clone(cues);
  updated.cues.find((c) => c.id === "raise")!.endMs -= 500;
  updated.cues.find((c) => c.id === "rent")!.startMs -= 500;
  const old = compileTimeline(cues, board),
    current = compileTimeline(updated, board);
  assert.equal(current.scenes[1].from, old.scenes[1].from - 15);
  assert.equal(
    current.events.find((e) => e.id === "rent-card")!.from,
    old.events.find((e) => e.id === "rent-card")!.from - 15,
  );
});
test("aligned mode requires measured audio and retains fractional duration plus tail", () => {
  const aligned: CueFile = {
    ...cues,
    mode: "aligned",
    audioHash: "fixture-hash",
  };
  assert.throws(() => compileTimeline(aligned, board), /measured WAV/);
  assert.throws(() => compileTimeline(aligned, board, 77000), /beyond WAV/);
  const result = compileTimeline(aligned, { ...board, tailMs: 500 }, 78123.4);
  assert.equal(result.durationInFrames, Math.round((78623.4 * 30) / 1000));
  assert.equal(result.scenes.at(-1)!.endMs, 78623.4);
});
for (const name of [
  "duplicate cue",
  "duplicate scene",
  "missing cue",
  "negative duration",
  "out of bounds",
  "overlap",
  "cue overlap",
  "unexplained shift",
  "scene gap",
  "subframe event",
  "subframe scene gap",
  "duplicate event",
] as const) {
  test(`rejects ${name}`, () => {
    const c = clone(cues),
      b = clone(board);
    if (name === "duplicate cue") c.cues[1].id = c.cues[0].id;
    if (name === "duplicate scene") b.scenes[1].id = b.scenes[0].id;
    if (name === "missing cue") b.events[0].cueId = "missing";
    if (name === "negative duration") b.events[0].durationMs = -1;
    if (name === "out of bounds") b.events[0].durationMs = 99999;
    if (name === "overlap")
      b.events.push({ ...b.events[0], id: "overlapping" });
    if (name === "cue overlap") c.cues[1].startMs = 0;
    if (name === "unexplained shift") b.events[0].offsetMs = 100;
    if (name === "scene gap")
      b.scenes[1].start = { cueId: "rent", offsetMs: 100, reason: "fixture" };
    if (name === "subframe event") b.events[0].durationMs = 1;
    if (name === "subframe scene gap")
      b.scenes[1].start = {cueId: "rent", offsetMs: 0.1, reason: "fixture"};
    if (name === "duplicate event") b.events.push({...b.events[0]});
    assert.throws(() => compileTimeline(c, b), /Timeline:/);
  });
}
test("declared event offset resolves from real cue with an explicit reason", () => {
  const b = clone(board);
  b.events[0].offsetMs = 300;
  b.events[0].reason = "anticipation after phrase onset";
  assert.equal(compileTimeline(cues, b).events[0].from, 9);
});
test("IK segment lengths remain fixed even for unreachable targets", () => {
  for (const target of [
    { x: 20, y: 100 },
    { x: 0, y: 0 },
    { x: 999, y: -999 },
  ]) {
    const result = limb({ x: 0, y: 0 }, target, 78, 78, 1);
    assert.ok(Math.abs(Math.hypot(result.joint.x, result.joint.y) - 78) < 1e-8);
    assert.ok(
      Math.abs(
        Math.hypot(
          result.end.x - result.joint.x,
          result.end.y - result.joint.y,
        ) - 78,
      ) < 1e-8,
    );
  }
});
test("walk stance feet retain world position and cycle boundaries are continuous", () => {
  for (const side of [0, 1] as const) {
    for (let frame = 0; frame < 180; frame++) {
      const phase = (frame + side * 30) % 60;
      if (phase < 29)
        assert.ok(
          Math.abs(
            walkFoot(frame, side).x +
              frame * 1.2 -
              (walkFoot(frame + 1, side).x + (frame + 1) * 1.2),
          ) < 1e-8,
        );
      const a = walkFoot(frame, side),
        b = walkFoot(frame + 0.001, side);
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 0.01);
    }
  }
});
