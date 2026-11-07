import assert from "node:assert/strict";
import { test } from "node:test";
import {
  referenceSkeleton,
  handRotation,
  referencePoses,
  proportions,
  WALK_STRIDE,
} from "../src/characters/referenceModel.ts";
import { gestures } from "../src/characters/kinematics.ts";
import { limb } from "../src/characters/kinematics.ts";

test("front-facing hands extend from the wrist in the forearm direction", () => {
  for (const target of [
    { x: 0, y: 70 },
    { x: 0, y: -70 },
    { x: 70, y: 0 },
    { x: -70, y: 0 },
  ]) {
    const arm = limb({ x: 0, y: 0 }, target, 44, 44, 1);
    const radians = (handRotation(arm, "right") * Math.PI) / 180;
    const length = Math.hypot(arm.end.x - arm.joint.x, arm.end.y - arm.joint.y);
    assert.ok(
      Math.abs(Math.sin(radians) - (arm.end.x - arm.joint.x) / length) < 1e-8,
    );
    assert.ok(
      Math.abs(-Math.cos(radians) - (arm.end.y - arm.joint.y) / length) < 1e-8,
    );
  }
});
test("palm-up wrists mirror without a 180-degree hand reversal", () => {
  const right = referenceSkeleton({ frame: 60, pose: "confused" }).rightArm;
  const left = referenceSkeleton({ frame: 60, pose: "confused" }).leftArm;
  const r = (handRotation(right, "right", true) * Math.PI) / 180;
  const l = (handRotation(left, "left", true) * Math.PI) / 180;
  assert.ok(Math.abs(Math.cos(r) - Math.cos(l)) < 1e-8);
  assert.ok(Math.abs(Math.sin(r) + Math.sin(l)) < 1e-8);
});

test("reference rig keeps torso and limb lengths for every pose and gesture", () => {
  for (const pose of referencePoses)
    for (const gesture of [undefined, ...gestures])
      for (const frame of [0, 6, 12, 24, 30, 60, 120]) {
        const rig = referenceSkeleton({ frame, pose, gesture });
        assert.ok(
          Math.abs(
            Math.hypot(rig.shoulder.x - rig.hip.x, rig.shoulder.y - rig.hip.y) -
              proportions.torso,
          ) < 1e-8,
        );
        for (const [part, upper, lower] of [
          [rig.leftArm, proportions.upperArm, proportions.forearm],
          [rig.rightArm, proportions.upperArm, proportions.forearm],
          [rig.leftLeg, proportions.thigh, proportions.shin],
          [rig.rightLeg, proportions.thigh, proportions.shin],
        ] as const) {
          assert.ok(
            Math.abs(
              Math.hypot(
                part.joint.x - part.root.x,
                part.joint.y - part.root.y,
              ) - upper,
            ) < 1e-8,
          );
          assert.ok(
            Math.abs(
              Math.hypot(part.end.x - part.joint.x, part.end.y - part.joint.y) -
                lower,
            ) < 1e-8,
          );
        }
      }
});
test("reference standing actions keep both feet on the floor during blends", () => {
  for (const pose of referencePoses.filter((p) => p !== "walking"))
    for (let frame = 0; frame <= 60; frame++) {
      const rig = referenceSkeleton({ frame, pose });
      assert.ok(Math.abs(rig.leftLeg.end.y) < 1e-8, `${pose}/${frame}/left`);
      assert.ok(Math.abs(rig.rightLeg.end.y) < 1e-8, `${pose}/${frame}/right`);
    }
});
test("reference walking retains world foot position during each stance", () => {
  for (let frame = 24; frame < 180; frame++)
    for (const [name, side] of [
      ["leftLeg", 0],
      ["rightLeg", 1],
    ] as const) {
      const phase = (((frame - 24) * 1.2) / WALK_STRIDE + side * 0.5) % 1;
      if (phase >= 0.48) continue;
      const a = referenceSkeleton({ frame, pose: "walking" }),
        b = referenceSkeleton({ frame: frame + 1, pose: "walking" });
      assert.ok(
        Math.abs(a[name].end.x + a.travel - b[name].end.x - b.travel) < 1e-8,
      );
      assert.ok(Math.abs(a[name].end.y) < 1e-8);
    }
});
test("reference animation is deterministic and rejects invalid timing", () => {
  assert.deepEqual(
    referenceSkeleton({ frame: 12, pose: "stressed", fromPose: "thinking" }),
    referenceSkeleton({ frame: 12, pose: "stressed", fromPose: "thinking" }),
  );
  assert.throws(() => referenceSkeleton({ frame: NaN }), /finite/);
  assert.throws(
    () => referenceSkeleton({ frame: 0, blendFrames: 0 }),
    /positive/,
  );
});
