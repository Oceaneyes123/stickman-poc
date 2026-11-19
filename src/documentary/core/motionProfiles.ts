import type { SfxName } from "../../audio/cues.ts";
import { clamp01, ramp, type EasingName } from "./keyframes.ts";

export type MotionProfileId =
  | "editorial-crisp"
  | "tactile-spring"
  | "weighted-drop"
  | "mechanical-snap"
  | "quiet-hold";

export type MotionDirection = "up" | "down" | "left" | "right" | "none" | "scale";

export type MotionProfileSpec = {
  id: MotionProfileId;
  label: string;
  enterFrames: number;
  exitFrames: number;
  useSpring: boolean;
  stiffness: number;
  damping: number;
  mass: number;
  easing: EasingName;
  shiftPx: number;
  scaleFrom: number;
  rotateFromDeg: number;
  staggerFrames: number;
  defaultSfx?: SfxName;
};

export const MOTION_PROFILES: Record<MotionProfileId, MotionProfileSpec> = {
  "editorial-crisp": {
    id: "editorial-crisp",
    label: "Editorial Crisp",
    enterFrames: 16,
    exitFrames: 10,
    useSpring: false,
    stiffness: 180,
    damping: 26,
    mass: 0.9,
    easing: "outCubic",
    shiftPx: 26,
    scaleFrom: 0.97,
    rotateFromDeg: 0,
    staggerFrames: 5,
    defaultSfx: "swish",
  },
  "tactile-spring": {
    id: "tactile-spring",
    label: "Tactile Spring",
    enterFrames: 22,
    exitFrames: 10,
    useSpring: true,
    stiffness: 175,
    damping: 13,
    mass: 0.72,
    easing: "outBack",
    shiftPx: 38,
    scaleFrom: 0.9,
    rotateFromDeg: -1.5,
    staggerFrames: 4,
    defaultSfx: "pop",
  },
  "weighted-drop": {
    id: "weighted-drop",
    label: "Weighted Drop",
    enterFrames: 24,
    exitFrames: 12,
    useSpring: true,
    stiffness: 140,
    damping: 12,
    mass: 1.15,
    easing: "out",
    shiftPx: 68,
    scaleFrom: 0.94,
    rotateFromDeg: 0,
    staggerFrames: 6,
    defaultSfx: "bar_thump",
  },
  "mechanical-snap": {
    id: "mechanical-snap",
    label: "Mechanical Snap",
    enterFrames: 12,
    exitFrames: 8,
    useSpring: true,
    stiffness: 260,
    damping: 19,
    mass: 0.65,
    easing: "out",
    shiftPx: 18,
    scaleFrom: 0.88,
    rotateFromDeg: 0,
    staggerFrames: 3,
    defaultSfx: "pop",
  },
  "quiet-hold": {
    id: "quiet-hold",
    label: "Quiet Hold",
    enterFrames: 18,
    exitFrames: 14,
    useSpring: false,
    stiffness: 110,
    damping: 28,
    mass: 1,
    easing: "inOut",
    shiftPx: 0,
    scaleFrom: 1,
    rotateFromDeg: 0,
    staggerFrames: 8,
  },
};

export const MOTION_PROFILE_IDS = Object.keys(
  MOTION_PROFILES,
) as MotionProfileId[];

/**
 * Closed-form deterministic damped spring solver (0 -> 1) so forward and reverse
 * frame seeks produce identical results without Remotion runtime coupling.
 */
export function sampleSpring(
  localFrame: number,
  config: { stiffness: number; damping: number; mass?: number; fps?: number },
): number {
  if (!Number.isFinite(localFrame) || localFrame <= 0) return 0;
  const fps = config.fps ?? 30;
  const mass = Math.max(0.05, config.mass ?? 1);
  const k = Math.max(1, config.stiffness);
  const c = Math.max(0.1, config.damping);
  const t = localFrame / fps;
  const omega0 = Math.sqrt(k / mass);
  const zeta = c / (2 * Math.sqrt(k * mass));

  let value: number;
  if (zeta < 1 - 1e-4) {
    const root = Math.sqrt(1 - zeta * zeta);
    const omegaD = omega0 * root;
    const decay = Math.exp(-zeta * omega0 * t);
    value =
      1 -
      decay * (Math.cos(omegaD * t) + (zeta / root) * Math.sin(omegaD * t));
  } else if (zeta <= 1 + 1e-4) {
    value = 1 - Math.exp(-omega0 * t) * (1 + omega0 * t);
  } else {
    const s = Math.sqrt(zeta * zeta - 1);
    const r1 = -omega0 * (zeta - s);
    const r2 = -omega0 * (zeta + s);
    value = 1 + (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r1 - r2);
  }

  return Math.abs(1 - value) < 1e-4 && t > 1.2 ? 1 : value;
}

export type MotionSample = {
  visible: boolean;
  progress: number;
  opacity: number;
  tx: number;
  ty: number;
  scale: number;
  rotate: number;
};

export function sampleMotionProfile(
  profileId: MotionProfileId,
  frame: number,
  opts?: {
    from?: number;
    until?: number;
    direction?: MotionDirection;
    enterFrames?: number;
    exitFrames?: number;
    shiftPx?: number;
    fps?: number;
  },
): MotionSample {
  const from = opts?.from ?? 0;
  const until = opts?.until ?? 100000;
  if (frame < from || frame >= until) {
    return {
      visible: false,
      progress: 0,
      opacity: 0,
      tx: 0,
      ty: 0,
      scale: 1,
      rotate: 0,
    };
  }

  const spec = MOTION_PROFILES[profileId];
  const local = frame - from;
  const span = Math.max(1, until - from);
  const enterFrames = Math.max(
    1,
    Math.min(opts?.enterFrames ?? spec.enterFrames, span),
  );
  const exitFrames = Math.max(
    0,
    Math.min(opts?.exitFrames ?? spec.exitFrames, Math.floor(span * 0.45)),
  );
  const fps = opts?.fps ?? 30;

  const progress = spec.useSpring
    ? sampleSpring(local, {
        stiffness: spec.stiffness,
        damping: spec.damping,
        mass: spec.mass,
        fps,
      })
    : ramp(frame, from, enterFrames, spec.easing);

  const inOpacity = clamp01(
    local / Math.max(1, Math.min(8, Math.round(enterFrames * 0.55))),
  );
  const outRamp =
    exitFrames > 0 ? ramp(frame, until - exitFrames, exitFrames, "inOut") : 0;
  const opacity = clamp01(inOpacity * (1 - outRamp));

  const dir = opts?.direction ?? "up";
  const shift = opts?.shiftPx ?? spec.shiftPx;
  const rem = 1 - progress;
  const exitShift = outRamp * 14;

  let tx = 0;
  let ty = 0;
  if (dir === "left") tx = -shift * rem;
  else if (dir === "right") tx = shift * rem;
  else if (dir === "up") ty = shift * rem - exitShift;
  else if (dir === "down") ty = -shift * rem + exitShift;

  const scale =
    dir === "scale"
      ? Math.max(0.05, spec.scaleFrom * 0.88 + (1 - spec.scaleFrom * 0.88) * progress)
      : Math.max(0.05, spec.scaleFrom + (1 - spec.scaleFrom) * progress);

  const rotate = spec.rotateFromDeg * rem;

  return {
    visible: true,
    progress,
    opacity,
    tx,
    ty,
    scale,
    rotate,
  };
}
