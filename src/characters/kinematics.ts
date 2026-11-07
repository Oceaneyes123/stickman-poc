import {
  clamp,
  validateLimit,
  type Bend,
  type JointOptions,
} from "./jointConstraints.ts";
export type Point = { x: number; y: number };
export const mix = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
export function limb(
  root: Point,
  target: Point,
  upper: number,
  lower: number,
  preference: number | JointOptions,
) {
  if (
    ![root.x, root.y, target.x, target.y, upper, lower].every(
      Number.isFinite,
    ) ||
    upper <= 0 ||
    lower <= 0
  )
    throw new Error("IK points must be finite and bone lengths positive");
  const options = typeof preference === "number" ? undefined : preference;
  const limits = options?.limits ?? { min: 0, max: 179.999 };
  validateLimit(limits);
  const dx = target.x - root.x,
    dy = target.y - root.y;
  const raw = Math.hypot(dx, dy);
  const reach = (degrees: number) =>
    Math.sqrt(
      Math.max(
        0,
        upper * upper +
          lower * lower +
          2 * upper * lower * Math.cos((degrees * Math.PI) / 180),
      ),
    );
  // Keep the legacy numeric path geometrically unchanged for the production rig.
  const min = options
    ? Math.max(1e-7, reach(limits.max))
    : Math.abs(upper - lower) + 0.001;
  const max = options ? reach(limits.min) : upper + lower - 0.001;
  const distance = clamp(raw, min, max);
  const direction = raw > 1e-9 || !options ? Math.atan2(dy, dx) : Math.PI / 2;
  const angle = Math.acos(
    clamp(
      (upper * upper + distance * distance - lower * lower) /
        (2 * upper * distance),
      -1,
      1,
    ),
  );
  const pole = options?.pole ?? options?.previousJoint;
  if (pole && ![pole.x, pole.y].every(Number.isFinite))
    throw new Error("IK pole must be finite");
  const cross = pole
    ? Math.cos(direction) * (pole.y - root.y) -
      Math.sin(direction) * (pole.x - root.x)
    : 0;
  const bend =
    typeof preference === "number"
      ? preference
      : (options?.bend ?? (Math.abs(cross) > 1e-7 ? (cross > 0 ? 1 : -1) : 1));
  if (bend !== 1 && bend !== -1) throw new Error("IK bend must be 1 or -1");
  const joint = {
    x: root.x + Math.cos(direction + bend * angle) * upper,
    y: root.y + Math.sin(direction + bend * angle) * upper,
  };
  const end = {
    x: root.x + Math.cos(direction) * distance,
    y: root.y + Math.sin(direction) * distance,
  };
  const error = Math.hypot(end.x - target.x, end.y - target.y);
  const flexion =
    (Math.acos(
      clamp(
        (distance * distance - upper * upper - lower * lower) /
          (2 * upper * lower),
        -1,
        1,
      ),
    ) *
      180) /
    Math.PI;
  return {
    root,
    joint,
    end,
    target,
    error,
    unreachable: error > 1e-6,
    flexion,
    limitViolation: flexion < limits.min - 1e-6 || flexion > limits.max + 1e-6,
    bend: bend as Bend,
  };
}
export const poses = [
  "idle",
  "standing",
  "walking",
  "pointing",
  "thinking",
  "sitting",
  "celebrating",
  "slumped",
] as const;
export const expressions = [
  "neutral",
  "happy",
  "confused",
  "shocked",
  "worried",
  "sad",
  "determined",
] as const;
export const gestures = [
  "wave",
  "nod",
  "shrug",
  "reach",
  "holdWallet",
  "pointAt",
  "reactToBill",
] as const;
export type Pose = (typeof poses)[number];
export type Expression = (typeof expressions)[number];
export type Gesture = (typeof gestures)[number];
// A planted foot keeps its world x during stance. The other foot swings forward.
export function walkFoot(frame: number, side: 0 | 1): Point {
  const shifted = frame + side * 30;
  const cycle = Math.floor(shifted / 60),
    phase = shifted - cycle * 60;
  const offset = side * 36;
  const worldX =
    phase < 30
      ? cycle * 72 - offset
      : cycle * 72 -
        offset +
        (1 - Math.cos(((phase - 30) / 30) * Math.PI)) * 36;
  return {
    x: worldX - frame * 1.2,
    y: phase < 30 ? 0 : -Math.sin(((phase - 30) / 30) * Math.PI) * 23,
  };
}
