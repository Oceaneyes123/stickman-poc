import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  compileDirection,
  cameraAt,
  beat,
  validateCamera,
  type ReferenceDirection,
} from "../src/animation/direction.ts";
import {
  createReferencePerformance,
  referenceMoney,
  stage,
} from "../src/scenes/cinematicModel.ts";
import { toWorld } from "../src/characters/staging.ts";
import type { Cue } from "../src/timeline/types.ts";
import type { FootContact } from "../src/characters/gait.ts";
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const refs = json("videos/001-lifestyle-creep/cinematic-directions.json")
  .references as ReferenceDirection[];
const cues = json("tests/fixtures/cinematic/cues.json") as Cue[];
const words = json("tests/fixtures/cinematic/words.json") as {
  id: string;
  startMs: number;
}[];
const compile = (r: ReferenceDirection) =>
  compileDirection(
    r,
    cues,
    words,
    { scriptHash: "fixture", audioHash: "fixture" },
    cues.find((c) => c.id === r.endCue)!.startMs -
      cues.find((c) => c.id === r.startCue)!.startMs,
  );
const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

test("directed references retain cue anchors, measured duration and bounded deterministic cameras", () => {
  for (const ref of refs) {
    const seq = compile(ref);
    assert.equal(
      seq.timeline.durationInFrames,
      Math.round(((seq.sourceEndMs - seq.sourceStartMs) * 30) / 1000),
    );
    assert.deepEqual(seq, compile(ref));
    for (const b of seq.beats) {
      assert(Number.isInteger(b.startFrame));
      assert.equal(b.endFrame - b.startFrame, b.durationFrames);
      if (b.wordId)
        assert(
          Math.abs(
            b.sourceStartMs -
              words.find((w) => w.id === b.wordId)!.startMs -
              ((b.offsetFrames ?? 0) * 1000) / 30,
          ) < 1e-6,
        );
      if (b.financial) assert(b.financial in referenceMoney);
    }
    for (let frame = 0; frame < seq.timeline.durationInFrames; frame++)
      validateCamera(cameraAt(seq, frame));
  }
});
test("direction rejects missing cues, misplaced words, overlaps, invalid targets/cameras, and excess holds", () => {
  const ref = refs[0];
  assert.throws(
    () => compile({ ...ref, startCue: "missing" }),
    /startMs|Missing cue/,
  );
  const mutate = (change: (r: ReferenceDirection) => void) => {
    const copy = structuredClone(ref);
    change(copy);
    return () => compile(copy);
  };
  assert.throws(
    mutate((r) => (r.beats[0].targets = ["missing"])),
    /Unknown target/,
  );
  assert.throws(
    mutate((r) => (r.beats[0].wordId = "p017-w020")),
    /Word outside/,
  );
  assert.throws(
    mutate((r) => (r.beats[1].offsetFrames = 0)),
    /overlap/i,
  );
  assert.throws(
    mutate((r) => (r.beats[0].holdFrames = 10000)),
    /hold exceeds/,
  );
  assert.throws(
    mutate(
      (r) => (r.beats.find((b) => b.camera)!.camera!.to = [-1, 0, 1920, 1080]),
    ),
    /bounded/,
  );
});
test("reference acting preserves constrained bone lengths, grounded feet and deterministic prop contacts", () => {
  for (const ref of refs) {
    const seq = compile(ref),
      sample = createReferencePerformance(seq);
    for (let frame = 0; frame < seq.timeline.durationInFrames; frame++) {
      const state = sample(frame);
      const actors =
        state.kind === "comparison"
          ? [state.sam.actor, state.alex.actor]
          : [state.sam];
      for (const actor of actors) {
        const rig = actor.rig;
        assert(Math.abs(distance(rig.hip, rig.shoulder) - 81) < 1e-6);
        for (const [i, part] of [
          rig.leftArm,
          rig.rightArm,
          rig.leftLeg,
          rig.rightLeg,
        ].entries()) {
          const size = i < 2 ? 44 : 56;
          assert(Math.abs(distance(part.root, part.joint) - size) < 1e-6);
          assert(Math.abs(distance(part.joint, part.end) - size) < 1e-6);
          assert(!part.limitViolation);
        }
        for (const foot of [rig.leftLeg.end, rig.rightLeg.end])
          assert(foot.y <= 1e-6);
      }
      if (state.kind === "apartment") {
        if (state.phoneAttached)
          assert(
            distance(
              toWorld(state.sam, state.sam.rig.rightArm.end),
              state.phone,
            ) < 1e-6,
          );
        if (state.entering && state.laptop.attached) {
          const left = toWorld(state.sam, state.sam.rig.leftArm.end);
          assert(
            distance(left, {
              x: state.laptop.grip.x - 140,
              y: state.laptop.grip.y,
            }) < 1e-4,
            `left laptop grip at ${frame}: ${distance(left, { x: state.laptop.grip.x - 140, y: state.laptop.grip.y })}`,
          );
        }
        if (state.entering && frame >= beat(seq, "place-laptop").endFrame)
          assert.deepEqual(state.laptop.grip, stage.laptopRest);
        if (
          state.entering &&
          frame >= beat(seq, "place-laptop").endFrame &&
          frame < beat(seq, "open-laptop").startFrame
        )
          assert(
            distance(
              toWorld(state.sam, state.sam.rig.rightArm.end),
              stage.laptopRest,
            ) < 1e-6,
            "placed laptop stays supported while the writing hand releases",
          );
        if (
          state.entering &&
          frame >= beat(seq, "open-laptop").startFrame &&
          frame <= beat(seq, "open-laptop").endFrame
        )
          assert(
            distance(toWorld(state.sam, state.sam.rig.rightArm.end), {
              x: stage.laptopRest.x,
              y: stage.laptopRest.y - 110 * state.laptop.open,
            }) < 1e-6,
            "hand follows the actual lid corner",
          );
      }
    }
    assert.deepEqual(sample(20), sample(20));
    assert.deepEqual(sample(20), createReferencePerformance(seq)(20));
  }
});

test("apartment walking preserves world stance contacts and the final laptop placement does not jump", () => {
  const seq = compile(refs[0]),
    sample = createReferencePerformance(seq),
    enter = beat(seq, "enter-room");
  let previous = sample(enter.startFrame);
  assert(previous.kind === "apartment");
  for (let f = enter.startFrame + 1; f <= enter.endFrame; f++) {
    const next = sample(f);
    assert(next.kind === "apartment");
    assert(previous.kind === "apartment");
    for (let side = 0; side < 2; side++) {
      const a: FootContact = previous.sam.rig.feet![side],
        b: FootContact = next.sam.rig.feet![side];
      if (a.planted && b.planted) {
        const footprint = (foot: FootContact): { x: number; y: number } =>
          foot.contact
            ? {
                x: foot.contact.point.x - foot.contact.pivot.x,
                y: foot.contact.point.y - foot.contact.pivot.y,
              }
            : foot.point;
        assert(
          distance(footprint(a), footprint(b)) < 1e-5,
          "planted foot does not skate",
        );
      }
    }
    previous = next;
  }
  const placed = beat(seq, "place-laptop").endFrame,
    old = sample(placed - 1),
    now = sample(placed);
  assert(old.kind === "apartment" && now.kind === "apartment");
  assert(
    distance(old.laptop.grip, now.laptop.grip) < 1,
    "ownership changes at the same physical point",
  );
});
test("comparison closes cumulative figures before monthly figures and never combines the time windows", () => {
  const seq = compile(refs[2]),
    sample = createReferencePerformance(seq);
  for (let f = 0; f < seq.timeline.durationInFrames; f++) {
    const state = sample(f);
    assert(state.kind === "comparison");
    assert(!(state.periodGap > 0 && state.monthlyGap > 0));
    if (f < beat(seq, "alex-period-total").startFrame)
      assert.equal(state.alexTotal, 0);
    if (f < beat(seq, "monthly-difference").startFrame)
      assert.equal(state.monthlyGap, 0);
  }
  assert.equal(referenceMoney.samThreeMonths, 1560);
  assert.equal(referenceMoney.alexThreeMonths, 2400);
  assert.equal(referenceMoney.periodGap, 840);
  assert.equal(referenceMoney.monthlyGap, 420);
  assert.equal(referenceMoney.raiseRemainder, 80);
});
