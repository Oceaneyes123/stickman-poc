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
  bend: number,
) {
  const dx = target.x - root.x,
    dy = target.y - root.y;
  const raw = Math.hypot(dx, dy);
  const distance = Math.min(
    upper + lower - 0.001,
    Math.max(Math.abs(upper - lower) + 0.001, raw),
  );
  const direction = Math.atan2(dy, dx);
  const angle = Math.acos(
    (upper * upper + distance * distance - lower * lower) /
      (2 * upper * distance),
  );
  const joint = {
    x: root.x + Math.cos(direction + bend * angle) * upper,
    y: root.y + Math.sin(direction + bend * angle) * upper,
  };
  const end = {
    x: root.x + Math.cos(direction) * distance,
    y: root.y + Math.sin(direction) * distance,
  };
  return { root, joint, end };
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
