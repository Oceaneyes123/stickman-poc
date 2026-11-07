import { limb, mix, type Gesture, type Point } from "./kinematics.ts";

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
export const proportions = {
  torso: 81,
  upperArm: 44,
  forearm: 44,
  thigh: 56,
  shin: 56,
  headRadius: 42,
} as const;
const point = (x: number, y: number): Point => ({ x, y });
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

export const WALK_STRIDE = 84;
export function distanceFoot(distance: number, side: 0 | 1): Point {
  const cycles = distance / WALK_STRIDE + side * 0.5;
  const cycle = Math.floor(cycles),
    phase = cycles - cycle;
  const planted = (cycle + 0.25 - side * 0.5) * WALK_STRIDE;
  return point(
    planted + blend((phase - 0.5) * 2) * WALK_STRIDE - distance,
    phase < 0.5 ? 0 : -Math.sin((phase - 0.5) * Math.PI * 2) * 12,
  );
}

// Both knees bend toward travel; the narrow hips and shoulders describe a three-quarter walk.
export function walkingSkeleton(
  distance: number,
  amount = 1,
  feet?: { left: Point; right: Point },
) {
  const phase = (distance / WALK_STRIDE) * Math.PI * 2;
  const lf =
    feet?.left ?? mix(point(-20, 0), distanceFoot(distance, 0), amount);
  const rf =
    feet?.right ?? mix(point(20, 0), distanceFoot(distance, 1), amount);
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

function targets(pose: ReferencePose) {
  const hip = point(
    0,
    pose === "sitting"
      ? -68
      : pose === "walking"
        ? -96
        : pose === "slumped"
          ? -104
          : -111,
  );
  const lean = pose === "slumped" ? 13 : pose === "thinking" ? -4 : 0;
  const shoulder = point(
    lean,
    hip.y - Math.sqrt(proportions.torso ** 2 - lean ** 2),
  );
  let left = point(-39, -97),
    right = point(39, -97);
  if (pose === "explaining") right = point(108, -184);
  if (pose === "pointing") right = point(76, -230);
  if (pose === "thinking") right = point(10, -197);
  if (pose === "confused") {
    left = point(-94, -184);
    right = point(94, -184);
  }
  if (pose === "celebrating") {
    left = point(-84, -252);
    right = point(84, -252);
  }
  if (pose === "stressed") {
    left = point(-45, -242);
    right = point(45, -242);
  }
  if (pose === "sitting") {
    left = point(-47, -60);
    right = point(47, -60);
  }
  if (pose === "slumped") {
    left.y = -103;
    right.y = -103;
  }
  return {
    hip,
    shoulder,
    left,
    right,
    lf: point(pose === "sitting" ? -47 : -20, 0),
    rf: point(pose === "sitting" ? 47 : 20, 0),
  };
}

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
}) {
  if (
    ![frame, actionFrom, blendFrames].every(Number.isFinite) ||
    blendFrames <= 0
  )
    throw new Error("Rig timing must be finite; blendFrames must be positive");
  const elapsed = Math.max(0, frame - actionFrom);
  const p = blend((frame - actionFrom) / blendFrames);
  if (pose === "walking") {
    return walkingSkeleton(Math.max(0, elapsed - blendFrames) * 1.2, p);
  }
  const a = targets(fromPose),
    b = targets(pose);
  const hip = mix(a.hip, b.hip, p),
    shoulder = mix(a.shoulder, b.shoulder, p);
  const left = mix(a.left, b.left, p),
    right = mix(a.right, b.right, p);
  const lf = mix(a.lf, b.lf, p),
    rf = mix(a.rf, b.rf, p);
  // Anticipation rotates the fixed-length torso; legs solve to stationary feet.
  shoulder.x -=
    Math.sin(Math.min(elapsed / 10, 1) * Math.PI) *
    (pose === "celebrating" ? 3 : 1);
  shoulder.y =
    hip.y - Math.sqrt(proportions.torso ** 2 - (shoulder.x - hip.x) ** 2);
  const g = blend((frame - actionFrom) / 22);
  if (gesture === "wave")
    Object.assign(
      right,
      mix(
        right,
        point(
          79 + Math.sin(elapsed * 0.24) * 8 * (1 - blend((elapsed - 40) / 20)),
          -246,
        ),
        g,
      ),
    );
  if (gesture === "shrug") {
    Object.assign(left, mix(left, point(-94, -184), g));
    Object.assign(right, mix(right, point(94, -184), g));
  }
  if (gesture === "reach")
    Object.assign(right, mix(right, point(110, -167), g));
  if (gesture === "pointAt")
    Object.assign(right, mix(right, point(76, -230), g));
  if (gesture === "holdWallet")
    Object.assign(right, mix(right, point(57, -139), g));
  if (gesture === "reactToBill") {
    Object.assign(left, mix(left, point(-45, -242), g));
    Object.assign(right, mix(right, point(45, -242), g));
  }
  const leftRaised =
    ["confused", "celebrating", "stressed"].includes(pose) ||
    gesture === "shrug" ||
    gesture === "reactToBill";
  const rightRaised =
    [
      "explaining",
      "pointing",
      "thinking",
      "confused",
      "celebrating",
      "stressed",
    ].includes(pose) ||
    (gesture &&
      ["wave", "shrug", "reach", "pointAt", "reactToBill"].includes(gesture));
  return {
    hip,
    shoulder,
    head: point(shoulder.x, shoulder.y - 49),
    travel: 0,
    turn: 0,
    nod:
      gesture === "nod"
        ? Math.sin((Math.min(elapsed, 45) / 45) * Math.PI * 4) * 6 * g
        : 0,
    leftArm: limb(
      point(shoulder.x - 29, shoulder.y + 9),
      left,
      proportions.upperArm,
      proportions.forearm,
      leftRaised ? -1 : 1,
    ),
    rightArm: limb(
      point(shoulder.x + 29, shoulder.y + 9),
      right,
      proportions.upperArm,
      proportions.forearm,
      rightRaised ? 1 : -1,
    ),
    leftLeg: limb(
      point(hip.x - 11, hip.y),
      lf,
      proportions.thigh,
      proportions.shin,
      1,
    ),
    rightLeg: limb(
      point(hip.x + 11, hip.y),
      rf,
      proportions.thigh,
      proportions.shin,
      -1,
    ),
  };
}
