import type { Point } from "./kinematics.ts";

export type JointLimit = { min: number; max: number };
export type Bend = 1 | -1;
export type JointOptions = {
  limits?: JointLimit;
  bend?: Bend;
  pole?: Point;
  previousJoint?: Point;
};
// Flexion in degrees: zero is straight. These are conservative animation defaults.
export const jointLimits = {
  knee: { min: 0, max: 145 },
  elbow: { min: 0, max: 150 },
} as const;
export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
export const ease = (v: number) => {
  const t = clamp(v, 0, 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
export function validateLimit(limit: JointLimit) {
  if (
    ![limit.min, limit.max].every(Number.isFinite) ||
    limit.min < 0 ||
    limit.max >= 180 ||
    limit.min > limit.max
  )
    throw new Error("Joint flexion limits must satisfy 0 <= min <= max < 180");
}

export type Anatomy = {
  knee: JointLimit;
  elbow: JointLimit;
  // Signs describe the projected anatomical plane in character-local coordinates.
  // Mirroring happens at render time. A different camera supplies different poles.
  knees: readonly [Bend, Bend];
  elbows: readonly [Bend, Bend];
};
export const defaultAnatomy: Anatomy = {
  ...jointLimits,
  knees: [-1, -1],
  elbows: [-1, 1],
};
