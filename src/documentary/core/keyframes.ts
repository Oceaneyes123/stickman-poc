/**
 * Pure, frame-driven easing and keyframe sampling for documentary layers.
 * No Remotion import so it runs under `node --test`; the "out" curve matches
 * `ease` in src/animation/motion.tsx (cubic-bezier 0.22, 1, 0.36, 1).
 */
export type EasingName =
  | "linear"
  | "out"
  | "in"
  | "inOut"
  | "outBack"
  | "outCubic"
  | "hold";

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Cubic-bezier solver (same approach as CSS/Remotion): Newton then bisection. */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(t) - x;
      if (Math.abs(error) < 1e-6) return sampleY(t);
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= error / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      if (sampleX(t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

const out = bezier(0.22, 1, 0.36, 1);
const inOut = bezier(0.65, 0, 0.35, 1);
const easeIn = bezier(0.5, 0, 0.75, 0);
export const EASINGS: Record<EasingName, (t: number) => number> = {
  linear: (t) => clamp01(t),
  out: (t) => out(clamp01(t)),
  in: (t) => easeIn(clamp01(t)),
  inOut: (t) => inOut(clamp01(t)),
  outCubic: (t) => 1 - (1 - clamp01(t)) ** 3,
  outBack: (t) => {
    const x = clamp01(t);
    const c1 = 1.4;
    const c3 = c1 + 1;
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
  },
  hold: (t) => (t >= 1 ? 1 : 0),
};

/** 0→1 progress over [from, from + duration] with an easing. */
export const ramp = (
  frame: number,
  from: number,
  duration: number,
  easing: EasingName = "out",
) => EASINGS[easing]((frame - from) / Math.max(1, duration));

export type Keyframe = {
  /** Scene-local frame at which `value` is reached. */
  at: number;
  value: number;
  /** Easing used for the segment that ends at this keyframe. */
  easing?: EasingName;
};
/** A constant or a keyframed number. Keyframes must be sorted by `at`. */
export type Track = number | readonly Keyframe[];

export function validateTrack(track: Track, name = "track") {
  if (typeof track === "number") {
    if (!Number.isFinite(track)) throw new Error(`${name}: non-finite value`);
    return;
  }
  if (track.length === 0) throw new Error(`${name}: empty keyframes`);
  track.forEach((k, i) => {
    if (!Number.isFinite(k.at) || !Number.isFinite(k.value))
      throw new Error(`${name}: non-finite keyframe ${i}`);
    if (i > 0 && k.at < track[i - 1].at)
      throw new Error(`${name}: keyframes must be sorted by frame`);
  });
}

export function sample(track: Track | undefined, frame: number, fallback = 0): number {
  if (track === undefined) return fallback;
  if (typeof track === "number") return track;
  if (track.length === 0) return fallback;
  if (frame <= track[0].at) return track[0].value;
  const last = track[track.length - 1];
  if (frame >= last.at) return last.value;
  for (let i = 1; i < track.length; i++) {
    const b = track[i];
    if (frame <= b.at) {
      const a = track[i - 1];
      const span = b.at - a.at;
      if (span <= 0) return b.value;
      return lerp(a.value, b.value, EASINGS[b.easing ?? "out"]((frame - a.at) / span));
    }
  }
  return last.value;
}

/** Convenience: a two-keyframe move from `a` to `b` starting at `from`. */
export const move = (
  a: number,
  b: number,
  from: number,
  duration: number,
  easing: EasingName = "out",
): Keyframe[] => [
  { at: from, value: a },
  { at: from + Math.max(1, duration), value: b, easing },
];

/** Concatenate keyframe segments into one sorted track. */
export const chain = (...segments: Keyframe[][]): Keyframe[] =>
  segments.flat().sort((a, b) => a.at - b.at);
