import { limb, mix, type Gesture, type Point } from "./kinematics.ts";
import { proportions, offsetSkeleton, type Skeleton } from "./biomechanics.ts";
import { evaluateMotion, planMotion, gestureAction } from "./motionPlanner.ts";
export { proportions } from "./biomechanics.ts";

export const referenceExpressions = [
  "neutral",
  "happy",
  "excited",
  "confident",
  "thinking",
  "curious",
  "worried",
  "stressed",
  "shocked",
  "sad",
  "frustrated",
  "relieved",
] as const;
export const referencePoses = [
  "standing",
  "explaining",
  "pointing",
  "thinking",
  "confused",
  "celebrating",
  "stressed",
  "sitting",
  "walking",
  "slumped",
] as const;
export type ReferenceExpression = (typeof referenceExpressions)[number];
export type ReferencePose = (typeof referencePoses)[number];
const point = (x: number, y: number): Point => ({ x, y });
export function armLayering(
  turn: number,
  yaw = 1,
): {
  front: "left" | "right";
  amount: number;
} {
  return {
    // The SVG mirrors the complete rig; depth stays in character-local space.
    front: yaw >= 0 ? "left" : "right",
    amount: Math.max(0, Math.min(1, turn)) * Math.min(1, Math.abs(yaw)),
  };
}
export function handRotation(
  arm: ReturnType<typeof limb>,
  side: "left" | "right",
  palmUp = false,
) {
  const forearm =
    (Math.atan2(arm.end.y - arm.joint.y, arm.end.x - arm.joint.x) * 180) /
    Math.PI;
  // Every hand shares the same wrist and local -Y finger direction.
  return forearm + 90 + (palmUp ? (side === "left" ? -12 : 12) : 0);
}
const blend = (t: number) => {
  const p = Math.min(1, Math.max(0, t));
  return p * p * (3 - 2 * p);
};

export const LEGACY_WALK_STRIDE = 84;
export function legacyDistanceFoot(distance: number, side: 0 | 1): Point {
  const cycles = distance / LEGACY_WALK_STRIDE + side * 0.5;
  const cycle = Math.floor(cycles),
    phase = cycles - cycle;
  const planted = (cycle + 0.25 - side * 0.5) * LEGACY_WALK_STRIDE;
  return point(
    planted + blend((phase - 0.5) * 2) * LEGACY_WALK_STRIDE - distance,
    phase < 0.5 ? 0 : -Math.sin((phase - 0.5) * Math.PI * 2) * 12,
  );
}

// Both knees bend toward travel; the narrow hips and shoulders describe a three-quarter walk.
export function legacyWalkingSkeleton(
  distance: number,
  amount = 1,
  feet?: { left: Point; right: Point },
) {
  const phase = (distance / LEGACY_WALK_STRIDE) * Math.PI * 2;
  const lf =
    feet?.left ?? mix(point(-20, 0), legacyDistanceFoot(distance, 0), amount);
  const rf =
    feet?.right ?? mix(point(20, 0), legacyDistanceFoot(distance, 1), amount);
  const hipWidth = 11 - 7 * amount;
  const reach = proportions.thigh + proportions.shin;
  const height = Math.min(
    111 - (8 + 2 * Math.sin(phase) ** 2) * amount,
    Math.sqrt(reach ** 2 - (lf.x + hipWidth) ** 2) - lf.y - 0.25,
    Math.sqrt(reach ** 2 - (rf.x - hipWidth) ** 2) - rf.y - 0.25,
  );
  const hip = point(0, -height);
  const shoulder = point(
    3 * amount,
    hip.y - Math.sqrt(proportions.torso ** 2 - (3 * amount) ** 2),
  );
  const armWidth = 29 - 17 * amount;
  const swing = Math.cos(phase) * 22 * amount;
  const leftRoot = point(shoulder.x - armWidth, shoulder.y + 9);
  const rightRoot = point(shoulder.x + armWidth, shoulder.y + 9);
  return {
    hip,
    shoulder,
    head: point(shoulder.x + 4 * amount, shoulder.y - 49),
    travel: distance,
    turn: amount,
    nod: 0,
    leftLeg: limb(point(-hipWidth, hip.y), lf, 56, 56, -1),
    rightLeg: limb(point(hipWidth, hip.y), rf, 56, 56, -1),
    leftArm: limb(
      leftRoot,
      point(leftRoot.x - swing, leftRoot.y + 83 - Math.abs(swing) * 0.18),
      44,
      44,
      -1,
    ),
    rightArm: limb(
      rightRoot,
      point(rightRoot.x + swing, rightRoot.y + 83 - Math.abs(swing) * 0.18),
      44,
      44,
      -1,
    ),
  };
}

/** Convenience presets. Choreographed scenes should compile an explicit plan once. */
export function referenceSkeleton({
  frame,
  pose = "standing",
  fromPose = "standing",
  gesture,
  actionFrom = 0,
  blendFrames = 24,
}: {
  frame: number;
  pose?: ReferencePose;
  fromPose?: ReferencePose;
  gesture?: Gesture;
  actionFrom?: number;
  blendFrames?: number;
}): Skeleton {
  if (
    ![frame, actionFrom, blendFrames].every(Number.isFinite) ||
    blendFrames <= 0
  )
    throw new Error("Rig timing must be finite; blendFrames must be positive");
  const action = gesture ? gestureAction[gesture] : pose;
  const duration = pose === "walking" ? 600 : Math.max(60, blendFrames * 3);
  const previousDuration = Math.max(60, blendFrames * 3);
  // The linter interprets an action's `transition` field as CSS. These values
  // are deterministic frame counts consumed only by the motion planner.
  /* eslint-disable @remotion/non-pure-animation */
  const plan = planMotion([
    {
      action: fromPose,
      from: actionFrom - previousDuration,
      duration: previousDuration,
      transition: blendFrames,
      ...(fromPose === "walking" ? { distance: 0 } : {}),
    },
    {
      action,
      from: actionFrom,
      duration,
      transition: blendFrames,
      ...(pose === "walking" ? { distance: 720 } : {}),
    },
  ]);
  /* eslint-enable @remotion/non-pure-animation */
  const rig = evaluateMotion(plan, Math.max(frame, actionFrom));
  // Presets translate their own root; explicit scene plans keep world-local joints.
  const travel = pose === "walking" ? rig.hip.x : 0;
  return { ...offsetSkeleton(rig, -travel), travel };
}
