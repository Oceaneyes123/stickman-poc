import assert from "node:assert/strict";
import { test } from "node:test";
import { limb, type Point } from "../src/characters/kinematics.ts";
import {
  defaultAnatomy,
  jointLimits,
} from "../src/characters/jointConstraints.ts";
import {
  estimateCenterOfMass,
  floorContact,
  solveBody,
  type Skeleton,
} from "../src/characters/biomechanics.ts";
import {
  footRocker,
  gaitPhases,
  planGait,
  sampleGait,
  type FootContact,
} from "../src/characters/gait.ts";
import {
  actions,
  evaluateMotion,
  planMotion,
} from "../src/characters/motionPlanner.ts";
import { walkingSam, toWorld, bankState } from "../src/scenes/bankModel.ts";

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const parts = (r: Skeleton) => [r.leftArm, r.rightArm, r.leftLeg, r.rightLeg];
const footprint = (foot: FootContact): Point =>
  foot.contact
    ? {
        x: foot.contact.point.x - foot.contact.pivot.x,
        y: foot.contact.point.y - foot.contact.pivot.y,
      }
    : foot.point;
function checkContact(ankle: Point, foot: FootContact) {
  const pivot = foot.contact?.pivot ?? { x: 0, y: 2 };
  const expected = foot.contact?.point ?? { x: foot.point.x, y: 2 };
  const angle = (foot.angle * Math.PI) / 180;
  const at = (p: Point) => ({
    x: ankle.x + Math.cos(angle) * p.x - Math.sin(angle) * p.y,
    y: ankle.y + Math.sin(angle) * p.x + Math.cos(angle) * p.y,
  });
  assert.ok(
    distance(at(pivot), expected) < 1e-6,
    "shoe pivot remains on its world contact",
  );
  assert.ok(Math.abs(expected.y - 2) < 1e-7);
  for (const x of [-8, 10])
    assert.ok(at({ x, y: 2 }).y <= 2 + 1e-7, "sole stays above ground");
}
function checkBones(r: Skeleton) {
  assert.ok(Math.abs(distance(r.hip, r.shoulder) - 81) < 1e-7);
  parts(r).forEach((p, i) => {
    const length = i < 2 ? 44 : 56;
    assert.ok(Math.abs(distance(p.root, p.joint) - length) < 1e-7);
    assert.ok(Math.abs(distance(p.joint, p.end) - length) < 1e-7);
    assert.equal(p.limitViolation, false);
    assert.ok(
      [p.error, p.flexion, p.joint.x, p.joint.y].every(Number.isFinite),
    );
  });
  for (const leg of [r.leftLeg, r.rightLeg]) assert.ok(leg.end.y <= 1e-7);
}

test("constrained IK preserves lengths, limits and diagnostics at singular and unreachable targets", () => {
  for (const lengths of [
    [44, 44],
    [56, 42],
  ])
    for (const limits of Object.values(jointLimits))
      for (const target of [
        { x: 0, y: 0 },
        { x: 0, y: 88 },
        { x: 1000, y: -300 },
        { x: -20, y: 70 },
      ]) {
        const p = limb({ x: 0, y: 0 }, target, lengths[0], lengths[1], {
          limits,
          bend: -1,
        });
        assert.ok(Math.abs(distance(p.root, p.joint) - lengths[0]) < 1e-7);
        assert.ok(Math.abs(distance(p.joint, p.end) - lengths[1]) < 1e-7);
        assert.ok(
          p.flexion >= limits.min - 1e-7 && p.flexion <= limits.max + 1e-7,
        );
        assert.equal(p.unreachable, p.error > 1e-6);
        assert.equal(p.limitViolation, false);
      }
  const root = { x: 0, y: 0 },
    target = { x: 40, y: 60 };
  const first = limb(root, target, 44, 44, {
    limits: jointLimits.elbow,
    bend: -1,
  });
  const next = limb(root, target, 44, 44, {
    limits: jointLimits.elbow,
    previousJoint: first.joint,
  });
  assert.ok(distance(first.joint, next.joint) < 1e-7);
  const other = limb(root, target, 44, 44, {
    limits: jointLimits.elbow,
    pole: { x: -50, y: 40 },
  });
  assert.equal(other.bend, 1);
  assert.throws(() => limb(root, target, 0, 44, 1), /positive/);
  assert.throws(
    () => limb(root, target, 44, 44, { limits: { min: 50, max: 20 } }),
    /limits/,
  );
  assert.throws(() => limb(root, { x: NaN, y: 1 }, 44, 44, 1), /finite/);
});

test("gait exposes all eight phases, double support and stationary planted contacts", () => {
  const plan = planGait({ from: 12, to: 240, distance: 270 });
  assert.equal(plan.stance, 0.6);
  const seen = new Set<string>();
  let double = 0,
    single = 0;
  for (let frame = 0; frame <= 280; frame += 0.25) {
    const a = sampleGait(plan, frame),
      b = sampleGait(plan, frame + 0.01);
    for (const side of ["left", "right"] as const) {
      const foot = a[side];
      seen.add(foot.phase);
      assert.ok(Number.isFinite(foot.phaseProgress));
      assert.ok(foot.point.y <= 0);
      if (foot.planted && b[side].planted)
        assert.ok(distance(footprint(foot), footprint(b[side])) < 1e-8);
      if (foot.planted) checkContact(foot.point, foot);
      assert.ok(distance(foot.point, b[side].point) < 0.2);
    }
    if (frame > 45 && frame < 200) {
      if (a.doubleSupport) double++;
      else single++;
    }
  }
  assert.deepEqual(seen, new Set(gaitPhases));
  assert.ok(double > 0 && single > double);
  assert.deepEqual(sampleGait(plan, 0).left.point, { x: -20, y: 0 });
  assert.deepEqual(sampleGait(plan, 0).right.point, { x: 20, y: 0 });
  assert.deepEqual(sampleGait(plan, 280).left.point, { x: 250, y: 0 });
  assert.deepEqual(sampleGait(plan, 280).right.point, { x: 290, y: 0 });
  assert.throws(() => planGait({ from: 0, to: 1, distance: -1 }), /Invalid/);
  assert.throws(
    () => planGait({ from: 0, to: 1, distance: 1, stance: 0.2 }),
    /Invalid/,
  );
});

test("fast walking changes stride and cadence; zero distance keeps both feet still", () => {
  const slow = planGait({ from: 0, to: 240, distance: 160 });
  const fast = planGait({ from: 0, to: 240, distance: 340 });
  assert.ok(fast.stepLength > slow.stepLength);
  assert.ok(fast.steps.length > slow.steps.length);
  const idle = planGait({ from: 0, to: 90, distance: 0 });
  assert.deepEqual(sampleGait(idle, 0), sampleGait(idle, 100));
});

test("all action transitions retain bone lengths, contact targets and finite constrained joints", () => {
  for (const action of actions) {
    const plan = planMotion([{ action, from: 12, duration: 150 }]);
    for (let f = 0; f < 190; f++) {
      const r = evaluateMotion(plan, f);
      checkBones(r);
      assert.ok(
        r.leftArm.error < 1e-6 && r.rightArm.error < 1e-6,
        `${action}/${f} hand targets`,
      );
      for (const [leg, foot] of [
        [r.leftLeg, r.feet![0]],
        [r.rightLeg, r.feet![1]],
      ] as const) {
        assert.ok(leg.error < 1e-6, `${action}/${f} foot target`);
        if (foot.planted) checkContact(leg.end, foot);
      }
      if (!r.balance!.dynamic)
        assert.equal(r.balance!.stable, true, `${action}/${f} balance`);
      const before = evaluateMotion(plan, f - 0.0001);
      for (let i = 0; i < 4; i++) {
        assert.ok(
          distance(parts(r)[i].joint, parts(before)[i].joint) < 0.04,
          `${action}/${f} joint continuity`,
        );
      }
    }
  }
});

test("reusable sequences preserve contacts at boundaries and are seek-order independent", () => {
  const plan = planMotion([
    { action: "walking", from: 0, duration: 150, distance: 180 },
    { action: "turning", from: 160, duration: 90 },
    { action: "sitting", from: 260, duration: 90 },
    { action: "standUp", from: 360, duration: 90 },
    { action: "pickUp", from: 460, duration: 90 },
    { action: "carry", from: 550, duration: 90 },
    { action: "give", from: 640, duration: 90 },
  ]);
  const frames = [
    0, 1, 149, 150, 160, 249, 260, 349, 360, 449, 460, 549, 550, 639, 640, 729,
    800,
  ];
  const expected = frames.map((f) => evaluateMotion(plan, f));
  for (const f of [...frames].reverse())
    assert.deepEqual(evaluateMotion(plan, f), expected[frames.indexOf(f)]);
  for (const clip of plan.clips) {
    const a = evaluateMotion(plan, clip.from - 0.0001),
      b = evaluateMotion(plan, clip.from);
    for (const key of ["leftLeg", "rightLeg", "leftArm", "rightArm"] as const)
      assert.ok(
        distance(a[key].end, b[key].end) < 0.001,
        `${clip.action} boundary`,
      );
  }
  assert.throws(() => evaluateMotion(plan, NaN), /finite/);
  assert.throws(
    () =>
      planMotion([
        { action: "wave", from: 0, duration: 10 },
        { action: "nod", from: 5, duration: 10 },
      ]),
    /nonoverlapping/,
  );
});

test("static balance supports configurable masses and anatomical projection", () => {
  const singleSupport = solveBody({
    hip: { x: 0, y: -104 },
    feet: [
      floorContact(-20),
      { ...floorContact(20), point: { x: 20, y: -14 }, planted: false },
    ],
  });
  assert.equal(singleSupport.balance!.stable, true);
  assert.ok(singleSupport.hip.x < -10);
  assert.deepEqual(
    estimateCenterOfMass(singleSupport, {
      torso: 0,
      head: 1,
      upperArm: 0,
      forearm: 0,
      thigh: 0,
      shin: 0,
    }),
    singleSupport.head,
  );
  const rig = solveBody({
    hip: { x: 0, y: -105 },
    lean: 20,
    feet: [floorContact(-20), floorContact(20)],
    hands: { right: { x: 100, y: -165 } },
    anatomy: { ...defaultAnatomy, knees: [1, -1], elbow: { min: 5, max: 140 } },
  });
  checkBones(rig);
  assert.equal(rig.balance!.stable, true);
  assert.equal(rig.leftLeg.bend, 1);
  assert.equal(rig.rightLeg.bend, -1);
  assert.ok(Number.isFinite(estimateCenterOfMass(rig).x));
  assert.throws(
    () =>
      estimateCenterOfMass(rig, {
        torso: 0,
        head: 0,
        upperArm: 0,
        forearm: 0,
        thigh: 0,
        shin: 0,
      }),
    /positive/,
  );
  const impossible = planMotion([
    { action: "reach", from: 0, duration: 100, target: { x: 999, y: -200 } },
  ]);
  assert.equal(evaluateMotion(impossible, 100).rightArm.unreachable, true);
});

test("bank walking in either direction preserves world stance through starts and stops", () => {
  for (const end of [460, -260])
    for (let f = 0; f < 190; f++) {
      const a = walkingSam(f, 100, end, 12, 150, false),
        b = walkingSam(f + 0.01, 100, end, 12, 150, false);
      for (const [key, i] of [
        ["leftLeg", 0],
        ["rightLeg", 1],
      ] as const) {
        if (a.rig.feet![i].planted && b.rig.feet![i].planted)
          assert.ok(
            distance(
              toWorld(a, footprint(a.rig.feet![i])),
              toWorld(b, footprint(b.rig.feet![i])),
            ) < 1e-6,
          );
        if (a.rig.feet![i].planted)
          checkContact(a.rig[key].end, a.rig.feet![i]);
      }
      checkBones(a.rig);
    }
  for (let f = 0; f < 300; f++) {
    const s = bankState(f);
    for (const a of [s.sam, s.alex]) checkBones(a.rig);
  }
});

test("single support extends its knee while the opposite knee bends through swing", () => {
  for (const travel of [165, 220, 340]) {
    const plan = planMotion([
      { action: "walking", from: 12, duration: 240, distance: travel },
    ]);
    let checked = 0,
      loading = 0,
      pushOff = 0;
    const sides = new Set<number>();
    for (let f = 45; f < 210; f += 0.5) {
      const r = evaluateMotion(plan, f),
        legs = [r.leftLeg, r.rightLeg];
      for (const side of [0, 1]) {
        const support = r.feet![side],
          swing = r.feet![1 - side];
        if (support.phase === "loading response" && legs[side].flexion > 10)
          loading++;
        if (support.phase === "pre-swing" && legs[side].flexion > 15) pushOff++;
        if (
          !support.planted ||
          swing.planted ||
          swing.phaseProgress < 0.2 ||
          swing.phaseProgress > 0.8 ||
          support.phaseProgress < 0.3 ||
          support.phaseProgress > 0.8
        )
          continue;
        assert.ok(
          legs[side].flexion <= 12,
          `${travel}/${f}: support knee must extend`,
        );
        assert.ok(
          legs[1 - side].flexion > legs[side].flexion + 20,
          `${travel}/${f}: swing knee must flex`,
        );
        assert.ok(swing.point.y < -2, "swing foot clears the floor");
        checkContact(legs[side].end, support);
        checked++;
        sides.add(side);
      }
    }
    assert.ok(checked > 100);
    assert.equal(sides.size, 2);
    assert.ok(
      loading > 0 && pushOff > 0,
      "stance still flexes during loading and push-off",
    );
  }
});

test("heel and toe rockers keep the loaded edge grounded without sole penetration", () => {
  for (const [angle, pivot] of [
    [-8, -8],
    [0, 0],
    [22, 10],
  ]) {
    const rocker = footRocker({ x: 40, y: 0 }, angle, pivot);
    checkContact(rocker.point, { ...floorContact(40), ...rocker, angle });
  }
});

test("toe-off and heel-strike trajectories stay continuous, including recovery steps", () => {
  const plan = planGait({ from: 12, to: 240, distance: 220 });
  for (const step of plan.steps)
    for (const boundary of [step.lift, step.land]) {
      const a = sampleGait(plan, boundary - 0.00001),
        b = sampleGait(plan, boundary + 0.00001);
      const side = step.side === 0 ? "left" : "right";
      assert.ok(distance(a[side].point, b[side].point) < 0.001);
      assert.ok(Math.abs(a[side].angle - b[side].angle) < 0.001);
    }
  const end = sampleGait(plan, plan.end);
  assert.ok(end.doubleSupport && end.left.angle === 0 && end.right.angle === 0);
  assert.deepEqual(end.left.point, { x: 200, y: 0 });
  assert.deepEqual(end.right.point, { x: 240, y: 0 });
  assert.deepEqual(end, sampleGait(plan, plan.end + 100));
});

test("both walking elbows point backward after mirroring and after a turn", () => {
  for (const yaw of [1, -1] as const) {
    const plan = planMotion([
      { action: "turning", from: 0, duration: 90, yaw },
      { action: "walking", from: 100, duration: 240, distance: 220 },
    ]);
    for (let f = 130; f < 310; f++) {
      const r = evaluateMotion(plan, f);
      for (const facing of [1, -1] as const)
        for (const arm of [r.leftArm, r.rightArm]) {
          const elbowScreenX = facing * arm.joint.x;
          const axisScreenX = (facing * (arm.root.x + arm.end.x)) / 2;
          const visibleDirection = facing * yaw;
          assert.ok(
            (elbowScreenX - axisScreenX) * visibleDirection < -1,
            `${yaw}/${f}/${facing}: elbow must point behind the shoulder-wrist line`,
          );
        }
    }
  }
});

test("walking elbow-plane changes straighten continuously and respect configured limits", () => {
  const plan = planMotion([
    { action: "walking", from: 0, duration: 240, distance: 220 },
  ]);
  let previous = evaluateMotion(plan, 0).leftArm,
    changes = 0;
  for (let step = 1; step <= 350; step++) {
    const arm = evaluateMotion(plan, step / 10).leftArm;
    assert.ok(
      distance(previous.joint, arm.joint) < 1,
      "elbow must not snap during the pole change",
    );
    if (arm.bend !== previous.bend) {
      assert.ok(
        Math.max(arm.flexion, previous.flexion) < 1,
        "plane changes pass through extension",
      );
      changes++;
    }
    previous = arm;
  }
  assert.equal(changes, 1);
  const constrained = planMotion(
    [{ action: "walking", from: 0, duration: 150 }],
    {
      anatomy: { ...defaultAnatomy, elbow: { min: 5, max: 140 } },
    },
  );
  const arm = evaluateMotion(constrained, 60).leftArm;
  assert.equal(arm.bend, defaultAnatomy.elbows[0]);
  assert.ok(arm.flexion >= 5 && arm.flexion <= 140);
});

test("walking wrists counter-swing with clearance and carrying keeps the elbow lowered", () => {
  for (const action of ["walking", "fastWalking"] as const) {
    const plan = planMotion([
      { action, from: 0, duration: 240, distance: 220 },
    ]);
    for (let frame = 30; frame < 220; frame++) {
      const r = evaluateMotion(plan, frame);
      const left = r.leftArm.end.x - r.leftArm.root.x;
      const right = r.rightArm.end.x - r.rightArm.root.x;
      assert.ok(
        Math.abs(left + right) < 1,
        `${action}/${frame} opposing swing`,
      );
      assert.ok(
        distance(r.leftArm.end, r.rightArm.end) > 12,
        `${action}/${frame} hand clearance`,
      );
    }
  }
  const carry = planMotion([
    { action: "carry", from: 0, duration: 90 },
    { action: "turning", from: 90, duration: 90 },
  ]);
  const grip = evaluateMotion(carry, 89).rightArm.end;
  for (let f = 30; f < 180; f++) {
    const r = evaluateMotion(carry, f);
    assert.ok(
      r.rightArm.joint.y > r.rightArm.root.y + 25,
      `${f} elbow below shoulder`,
    );
    assert.ok(
      distance(r.rightArm.end, grip) < 1e-6,
      `${f} carry grip during turn`,
    );
    assert.equal(r.handKinds?.right, "fist");
  }
});

test("sitting shifts back, standing loads the feet first, and pickup keeps its free hand clear", () => {
  const plan = planMotion([
    { action: "sitting", from: 0, duration: 90 },
    { action: "standUp", from: 100, duration: 90 },
  ]);
  const seated = evaluateMotion(plan, 89);
  assert.ok(seated.hip.x < -20);
  const load = evaluateMotion(plan, 107);
  assert.ok(load.shoulder.x - load.hip.x > 12);
  assert.ok(
    Math.abs(load.hip.y - seated.hip.y) < 3,
    "pelvis remains on seat during preload",
  );
  const standing = evaluateMotion(plan, 190);
  assert.ok(Math.abs(standing.hip.x) < 1e-6);
  const pickup = planMotion([{ action: "pickUp", from: 0, duration: 90 }]);
  const r = evaluateMotion(pickup, 60);
  assert.ok(r.hip.x < -10);
  assert.ok(r.leftArm.end.y < -55);
  assert.ok(distance(r.rightArm.end, { x: 47, y: -20 }) < 1e-6);
  for (const [action, kind] of [
    ["wave", "wave"],
    ["pointing", "point"],
  ] as const)
    assert.equal(
      evaluateMotion(planMotion([{ action, from: 0, duration: 90 }]), 60)
        .handKinds?.right,
      kind,
    );
});
