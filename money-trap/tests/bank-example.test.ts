import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WALK_STRIDE,
  walkingSkeleton,
} from "../src/characters/referenceModel.ts";
import {
  BANK_TIMING,
  bankState,
  bankFoot,
  samePoint,
  toWorld,
} from "../src/scenes/bankModel.ts";

test("bank example has three scenes within exactly ten seconds", () => {
  assert.equal(BANK_TIMING.duration / BANK_TIMING.fps, 10);
  assert.equal(bankState(89).scene, "approach");
  assert.equal(bankState(90).scene, "door");
  assert.equal(bankState(149).scene, "door");
  assert.equal(bankState(150).scene, "handoff");
  for (const frame of [-1, 300, NaN, 1.5])
    assert.throws(() => bankState(frame));
});
test("all bank poses preserve bone lengths and keep feet above the floor", () => {
  for (let frame = 0; frame < 300; frame++) {
    for (const actor of [bankState(frame).sam, bankState(frame).alex]) {
      for (const [part, length] of [
        [actor.rig.leftArm, 44],
        [actor.rig.rightArm, 44],
        [actor.rig.leftLeg, 56],
        [actor.rig.rightLeg, 56],
      ] as const) {
        assert.ok(
          Math.abs(samePoint(part.root, part.joint) - length) < 1e-7,
          `${frame} upper`,
        );
        assert.ok(
          Math.abs(samePoint(part.joint, part.end) - length) < 1e-7,
          `${frame} lower`,
        );
      }
      assert.ok(actor.rig.leftLeg.end.y < 1e-7);
      assert.ok(actor.rig.rightLeg.end.y < 1e-7);
    }
  }
});
test("Sam maintains contact with the handle throughout the door opening", () => {
  for (let frame = 108; frame <= 134; frame++) {
    const state = bankState(frame);
    assert.ok(
      samePoint(
        toWorld(state.sam, state.sam.rig.leftArm.end),
        state.doorHandle,
      ) < 1e-7,
    );
  }
});
test("cash transfers once, without teleporting, between both grips", () => {
  const state = bankState(240);
  assert.ok(
    samePoint(toWorld(state.sam, state.sam.rig.rightArm.end), {
      x: state.money.x - 32,
      y: state.money.y - 17,
    }) < 1e-7,
  );
  assert.ok(
    samePoint(toWorld(state.alex, state.alex.rig.rightArm.end), {
      x: state.money.x + 32,
      y: state.money.y - 17,
    }) < 1e-7,
  );
  assert.equal(bankState(249).owner, "Sam");
  assert.equal(bankState(250).owner, "Alex");
  assert.ok(samePoint(bankState(249).money, bankState(250).money) < 1e-7);
  const end = bankState(299);
  assert.ok(
    samePoint(toWorld(end.alex, end.alex.rig.rightArm.end), {
      x: end.money.x + 32,
      y: end.money.y - 17,
    }) < 1e-7,
  );
});
test("distance-driven gait has planted feet during stance", () => {
  for (let distance = 0; distance < 400; distance++)
    for (const side of [0, 1] as const) {
      const phase = (distance / WALK_STRIDE + side * 0.5) % 1;
      if (phase >= 0.48) continue;
      const a = bankFoot(distance, side),
        b = bankFoot(distance + 1, side);
      assert.ok(Math.abs(a.x + distance - b.x - distance - 1) < 1e-7);
      assert.equal(a.y, 0);
    }
});

test("walk faces travel, bends both knees forward and swings opposing arms", () => {
  for (let distance = 0; distance < 2 * WALK_STRIDE; distance++) {
    const rig = walkingSkeleton(distance);
    assert.equal(rig.turn, 1);
    assert.equal(rig.rightLeg.root.x - rig.leftLeg.root.x, 8);
    for (const leg of [rig.leftLeg, rig.rightLeg]) {
      const cross =
        (leg.end.x - leg.root.x) * (leg.joint.y - leg.root.y) -
        (leg.end.y - leg.root.y) * (leg.joint.x - leg.root.x);
      assert.ok(cross < 0, "both knees must bend toward travel");
    }
    const a = rig.leftArm.end.x - rig.leftArm.root.x,
      b = rig.rightArm.end.x - rig.rightArm.root.x;
    assert.ok(Math.abs(a + b) < 1e-7);
  }
});
