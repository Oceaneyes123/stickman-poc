import { mix, type Gesture, type Point } from "./kinematics.ts";
import { ease, clamp, type Anatomy } from "./jointConstraints.ts";
import {
  floorContact,
  solveBody,
  type BodyIntent,
  type Skeleton,
  type Masses,
} from "./biomechanics.ts";
import {
  planGait,
  sampleGait,
  type FootContact,
  type GaitOptions,
  type GaitPlan,
} from "./gait.ts";

export const actions = [
  "standing",
  "walking",
  "fastWalking",
  "turning",
  "sitting",
  "standUp",
  "reach",
  "pointing",
  "wave",
  "nod",
  "pickUp",
  "carry",
  "give",
  "receive",
  "celebrating",
  "slumped",
  "explaining",
  "thinking",
  "confused",
  "stressed",
] as const;
export type Action = (typeof actions)[number];
export type MotionAction = {
  action: Action;
  from: number;
  duration: number;
  transition?: number;
  distance?: number;
  target?: Point;
  yaw?: number;
  gait?: Pick<GaitOptions, "stance" | "stepLength" | "clearance">;
};
type Clip = MotionAction & {
  start: BodyIntent;
  end: BodyIntent;
  origin: number;
  gaitPlan?: GaitPlan;
};
export type MotionPlan = {
  clips: Clip[];
  initial: BodyIntent;
  anatomy?: Anatomy;
  masses?: Masses;
};
const initialIntent = (): BodyIntent => ({
  hip: { x: 0, y: -111 },
  feet: [floorContact(-20), floorContact(20)],
  turn: 0,
  lean: 0,
  yaw: 1,
  nod: 0,
  speed: 0,
});
const actionPose = (
  clip: MotionAction,
  t: number,
  elapsed: number,
  start: BodyIntent,
): BodyIntent => {
  const intent: BodyIntent = {
    ...start,
    hip: { ...start.hip },
    hands: {},
    armAngles: [-11, 11],
    armBends: undefined,
    handKinds: undefined,
    nod: 0,
    speed: 0,
  };
  intent.hip.y = -111;
  intent.lean = 0;
  const right = (x: number, y: number) => {
    intent.hands = { ...intent.hands, right: { x: start.hip.x + x, y } };
  };
  switch (clip.action) {
    case "sitting":
      intent.hip.x -= 24;
      intent.hip.y = -68;
      intent.lean = 14 * (1 - t);
      intent.turn = 0.65;
      intent.seat = [intent.hip.x - 25, intent.hip.x + 25];
      break;
    case "standUp":
      if (start.seat) intent.hip.x += 24;
      intent.lean = 18 * (1 - t);
      intent.turn = 0;
      intent.seat = undefined;
      break;
    case "turning":
      intent.yaw = clip.yaw ?? -1;
      intent.turn = 1;
      intent.hands = start.hands;
      intent.handKinds = start.handKinds;
      break;
    case "slumped":
      intent.hip.y = -104;
      intent.lean = 17;
      intent.armAngles = [-5, 18];
      break;
    case "celebrating":
      intent.hip.y = -108;
      intent.hands = {
        left: { x: intent.hip.x - 63, y: -250 },
        right: { x: intent.hip.x + 70, y: -245 },
      };
      intent.handKinds = { left: "fist", right: "fist" };
      break;
    case "pickUp":
      intent.hip.x -= 12;
      intent.hip.y = -36;
      intent.lean = 30;
      right(clip.target?.x ?? 47, clip.target?.y ?? -20);
      intent.hands!.left = { x: start.hip.x - 34, y: -63 };
      intent.handKinds = { right: "open" };
      break;
    case "carry":
      right(50, -140);
      intent.lean = -3;
      intent.handKinds = { right: "fist" };
      break;
    case "reach":
    case "give":
    case "receive":
      intent.lean = 9;
      right(clip.target?.x ?? 100, clip.target?.y ?? -165);
      break;
    case "pointing":
      right(clip.target?.x ?? 76, clip.target?.y ?? -230);
      intent.lean = 3;
      intent.handKinds = { right: "point" };
      break;
    case "explaining":
      right(98, -180);
      break;
    case "thinking":
      right(8, -200);
      intent.lean = -4;
      break;
    case "confused":
      intent.hands = {
        left: { x: intent.hip.x - 90, y: -180 },
        right: { x: intent.hip.x + 90, y: -180 },
      };
      break;
    case "stressed":
      intent.hands = {
        left: { x: intent.hip.x - 45, y: -242 },
        right: { x: intent.hip.x + 45, y: -242 },
      };
      break;
    case "wave":
      intent.handKinds = { right: "wave" };
      right(
        69 +
          Math.sin(elapsed * 0.22) *
            9 *
            ease(elapsed / 12) *
            (1 - ease((elapsed - clip.duration + 20) / 20)),
        -244,
      );
      break;
    case "nod":
      intent.nod = Math.sin(Math.PI * 4 * t) * 5 * Math.sin(Math.PI * t) ** 2;
      break;
  }
  return intent;
};
function blendIntent(
  a: BodyIntent,
  b: BodyIntent,
  p: number,
  armP = p,
): BodyIntent {
  const baseA = solveBody(a),
    baseB = solveBody(b);
  const blended = {
    ...b,
    hip: mix(a.hip, b.hip, p),
    lean: (a.lean ?? 0) + ((b.lean ?? 0) - (a.lean ?? 0)) * p,
    turn: (a.turn ?? 0) + ((b.turn ?? 0) - (a.turn ?? 0)) * p,
    yaw: (a.yaw ?? 1) + ((b.yaw ?? 1) - (a.yaw ?? 1)) * p,
    nod: (a.nod ?? 0) + ((b.nod ?? 0) - (a.nod ?? 0)) * armP,
  };
  const body = solveBody({ ...blended, hands: undefined });
  const arm = (
    side: "leftArm" | "rightArm",
  ): { point: Point; bend: 1 | -1 } => {
    const start = baseA[side],
      end = baseB[side];
    const angle = Math.atan2(
      start.joint.y - start.root.y,
      start.joint.x - start.root.x,
    );
    const finish = Math.atan2(
      end.joint.y - end.root.y,
      end.joint.x - end.root.x,
    );
    const delta = Math.atan2(
      Math.sin(finish - angle),
      Math.cos(finish - angle),
    );
    const upper = angle + delta * armP;
    const signedFlexion =
      start.flexion * start.bend +
      (end.flexion * end.bend - start.flexion * start.bend) * armP;
    const lower = upper - (signedFlexion * Math.PI) / 180;
    const root = body[side].root;
    const fk = {
      x: root.x + 44 * (Math.cos(upper) + Math.cos(lower)),
      y: root.y + 44 * (Math.sin(upper) + Math.sin(lower)),
    };
    // Free motion follows joint arcs. The last part converges on the exact
    // interaction target, preserving diagnostics if that target is unreachable.
    return {
      point: mix(fk, end.target, ease((armP - 0.85) / 0.15)),
      bend: signedFlexion < 0 ? -1 : 1,
    };
  };
  const left = arm("leftArm"),
    right = arm("rightArm");
  return {
    ...blended,
    hands: { left: left.point, right: right.point },
    armBends: [left.bend, right.bend],
  };
}
function sampleClip(clip: Clip, frame: number): BodyIntent {
  const elapsed = clamp(frame - clip.from, 0, clip.duration);
  const transition = clip.transition ?? Math.min(24, clip.duration * 0.4);
  if (clip.gaitPlan) {
    const gait = sampleGait(clip.gaitPlan, frame);
    const root = clip.origin + gait.root;
    const lagged = sampleGait(clip.gaitPlan, frame - 2);
    const swing = clamp(
      (lagged.right.point.x - lagged.left.point.x) * 0.4,
      -14,
      14,
    );
    const activity =
      ease(elapsed / 12) * (1 - ease((frame - clip.gaitPlan.to) / 16));
    const trajectory: BodyIntent = {
      hip: {
        x: root + gait.weightShift,
        y: -111 + (111 - gait.pelvisHeight) * activity,
      },
      feet: [
        {
          ...gait.left,
          point: { x: clip.origin + gait.left.point.x, y: gait.left.point.y },
        },
        {
          ...gait.right,
          point: { x: clip.origin + gait.right.point.x, y: gait.right.point.y },
        },
      ],
      turn:
        ease(elapsed / transition) *
        (1 - ease((frame - clip.gaitPlan.to) / 16)),
      yaw: clip.start.yaw,
      speed: gait.speed,
      dynamic: frame < clip.gaitPlan.end,
      supportExtension: activity,
      lean: Math.min(7, gait.speed * 2) - gait.weightShift * 0.4,
      armAngles: [-3 + swing * activity, 3 - swing * activity],
      armBends: (clip.start.yaw ?? 1) >= 0 ? [1, 1] : [-1, -1],
      armFlexions: [
        18 + Math.min(12, gait.speed * 2) * activity,
        18 + (6 + Math.min(12, gait.speed * 2)) * activity,
      ],
      handKinds: clip.action === "carry" ? { right: "fist" } : undefined,
      hands:
        clip.action === "carry"
          ? { right: { x: root + 50, y: -140 } }
          : undefined,
    };
    if (elapsed >= transition + 3) return trajectory;
    const old = solveBody(clip.start),
      dx = trajectory.hip.x - clip.start.hip.x;
    const startAtRoot = {
      ...clip.start,
      dynamic: trajectory.dynamic,
      hip: { ...clip.start.hip, x: trajectory.hip.x },
      feet: trajectory.feet,
      hands: {
        left: { x: old.leftArm.target.x + dx, y: old.leftArm.target.y },
        right: { x: old.rightArm.target.x + dx, y: old.rightArm.target.y },
      },
    };
    return {
      ...blendIntent(
        startAtRoot,
        trajectory,
        ease(elapsed / transition),
        ease((elapsed - 3) / transition),
      ),
      hip: trajectory.hip,
      feet: trajectory.feet,
    };
  }
  const t = elapsed / clip.duration;
  const target = actionPose(clip, t, elapsed, clip.start);
  // Pelvis anticipates; arms and head arrive later. Contacts never interpolate.
  const p = ease(elapsed / transition),
    arms = ease((elapsed - 3) / transition);
  const intent = blendIntent(clip.start, target, p, arms);
  if (clip.action === "standUp" && clip.start.seat) {
    // Bring weight over the feet before lifting off the seat.
    intent.hip.x =
      clip.start.hip.x +
      (target.hip.x - clip.start.hip.x) * ease(elapsed / transition);
    intent.hip.y =
      clip.start.hip.y +
      (target.hip.y - clip.start.hip.y) * ease((elapsed - 8) / transition);
    intent.lean =
      18 * ease(elapsed / 8) * (1 - ease((elapsed - 8) / transition));
  }
  if (clip.action === "turning") {
    if (clip.start.hands)
      intent.hands = { ...intent.hands, ...clip.start.hands };
    // Step the feet in sequence instead of mirroring planted ankle positions.
    const stepFoot = (foot: FootContact, i: number): FootContact => {
      const u = clamp((t - (i === 0 ? 0.12 : 0.55)) / 0.28, 0, 1);
      const airborne = u > 0 && u < 1;
      return {
        ...foot,
        planted: !airborne,
        point: { x: foot.point.x, y: -8 * 64 * u ** 3 * (1 - u) ** 3 },
        phase: airborne ? "midswing" : "midstance",
        angle: 0,
        phaseProgress: u,
      };
    };
    intent.feet = [
      stepFoot(clip.start.feet[0], 0),
      stepFoot(clip.start.feet[1], 1),
    ];
    intent.dynamic = t > 0.1 && t < 0.85;
  }
  if (["celebrating", "pickUp", "standUp", "sitting"].includes(clip.action)) {
    const anticipation =
      Math.sin(Math.PI * clamp(elapsed / Math.min(12, transition), 0, 1)) ** 2;
    intent.hip.y += anticipation * 2;
    intent.lean = (intent.lean ?? 0) - anticipation * 3;
  }
  return intent;
}

/** Compile once at module scope or useMemo; every frame can be sampled independently. */
export function planMotion(
  sequence: readonly MotionAction[],
  options: { anatomy?: Anatomy; masses?: Masses } = {},
): MotionPlan {
  let previous = initialIntent(),
    previousEnd = -Infinity;
  const clips: Clip[] = [];
  for (const action of sequence) {
    if (
      !actions.includes(action.action) ||
      ![action.from, action.duration, action.transition ?? 24].every(
        Number.isFinite,
      ) ||
      action.duration <= 0 ||
      (action.transition ?? 24) <= 0 ||
      action.from < previousEnd ||
      (action.distance !== undefined &&
        (!Number.isFinite(action.distance) || action.distance < 0)) ||
      (action.yaw !== undefined &&
        (!Number.isFinite(action.yaw) || Math.abs(action.yaw) > 1)) ||
      (action.target &&
        ![action.target.x, action.target.y].every(Number.isFinite))
    )
      throw new Error(
        "Motion actions require finite positive timing, ordered nonoverlapping clips, and valid targets",
      );
    const walking =
      action.action === "walking" ||
      action.action === "fastWalking" ||
      (action.action === "carry" && action.distance !== undefined);
    const origin = previous.hip.x;
    const gaitPlan = walking
      ? planGait({
          from: action.from,
          to: action.from + action.duration - Math.min(20, action.duration / 4),
          distance:
            action.distance ?? (action.action === "fastWalking" ? 240 : 120),
          settleFrames: Math.min(20, action.duration / 4),
          ...action.gait,
          initialFeet: previous.feet.map((f) => ({
            x: f.point.x - origin,
            y: f.point.y,
          })) as [Point, Point],
        })
      : undefined;
    const clip: Clip = {
      ...action,
      start: previous,
      end: previous,
      origin,
      gaitPlan,
    };
    // Finish all swing contacts before a subsequent action can start.
    if (gaitPlan && gaitPlan.end > action.from + action.duration)
      throw new Error("Walking duration must include final foot landing");
    previous = sampleClip(clip, action.from + action.duration);
    clip.end = previous;
    clips.push(clip);
    previousEnd = action.from + action.duration;
  }
  return { clips, initial: initialIntent(), ...options };
}
export function evaluateMotion(plan: MotionPlan, frame: number): Skeleton {
  if (!Number.isFinite(frame)) throw new Error("Motion frame must be finite");
  let intent = plan.initial;
  for (const clip of plan.clips) {
    if (frame < clip.from) break;
    intent =
      frame <= clip.from + clip.duration ? sampleClip(clip, frame) : clip.end;
  }
  return solveBody({ ...intent, anatomy: plan.anatomy, masses: plan.masses });
}

export const gestureAction: Record<Gesture, Action> = {
  wave: "wave",
  nod: "nod",
  shrug: "confused",
  reach: "reach",
  holdWallet: "carry",
  pointAt: "pointing",
  reactToBill: "stressed",
};
