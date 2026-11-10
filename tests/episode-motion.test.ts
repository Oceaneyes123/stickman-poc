import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  createEpisodeActor,
  type EpisodeMotion,
} from "../src/storyboard/episodeMotion.ts";
import { toWorld, placeHands } from "../src/characters/staging.ts";
import { referenceSkeleton } from "../src/characters/referenceModel.ts";
test("all panel actions preserve segment lengths, settle, and seek deterministically", () => {
  const plan = JSON.parse(
    readFileSync("videos/001-lifestyle-creep/typography-plan.json", "utf8"),
  );
  assert.equal(plan.panels.length, 99);
  for (const panel of plan.panels) {
    const motion: EpisodeMotion = { ...panel.motion, from: 5 };
    for (const frame of [0, 5, 15, 30, 49, 90, 150]) {
      const actor = createEpisodeActor({}, motion, frame),
        rig = actor.rig;
      for (const [limb, length] of [
        [rig.leftArm, 44],
        [rig.rightArm, 44],
        [rig.leftLeg, 56],
        [rig.rightLeg, 56],
      ] as const) {
        assert(
          Math.abs(
            Math.hypot(limb.root.x - limb.joint.x, limb.root.y - limb.joint.y) -
              length,
          ) < 1e-6,
        );
        assert(
          Math.abs(
            Math.hypot(limb.end.x - limb.joint.x, limb.end.y - limb.joint.y) -
              length,
          ) < 1e-6,
        );
      }
      assert.deepEqual(actor, createEpisodeActor({}, motion, frame));
      if (motion.kind !== "walk")
        for (const foot of [rig.leftLeg.end, rig.rightLeg.end])
          assert(Math.abs(foot.y) < 1e-6);
    }
    assert.deepEqual(
      createEpisodeActor({}, motion, 150),
      createEpisodeActor({}, motion, 300),
    );
  }
});
test("celebration changes the articulated hands and held props use the animated grip", () => {
  const motion: EpisodeMotion = {
    kind: "celebrate",
    from: 0,
    duration: 44,
    objects: [],
  };
  const first = createEpisodeActor({}, motion, 0),
    last = createEpisodeActor({}, motion, 44);
  assert(Math.abs(first.rig.rightArm.end.y - last.rig.rightArm.end.y) > 30);
  const carry = { ...motion, kind: "walk" as const };
  for (const frame of [0, 12, 24, 44, 80]) {
    const actor = createEpisodeActor({ x: 700, scale: 2.15 }, carry, frame);
    const shift = toWorld(actor, actor.rig.hip).x - 700;
    const target = { x: 820 + shift, y: 650 };
    placeHands(actor, { right: target, left: { x: 680 + shift, y: 650 } });
    const hand = toWorld(actor, actor.rig.rightArm.end);
    assert(Math.hypot(hand.x - target.x, hand.y - target.y) < 0.01);
  }
  assert.deepEqual(
    createEpisodeActor({}, null, 999).rig,
    referenceSkeleton({
      frame: 60,
      pose: "standing",
      fromPose: "standing",
      blendFrames: 1,
    }),
  );
});
