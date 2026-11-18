import { FRAME, center, type Rect } from "./geometry.ts";
import { clamp01, lerp, ramp } from "./keyframes.ts";

export type FocusTarget = {
  id: string;
  rect: Rect;
  from: number;
  until: number;
  /** Target zoom multiplier (> 1 zooms in on `rect`). Defaults to 1.35. */
  zoom?: number;
  /** Backdrop dimming outside the focused region (0..0.85). Defaults to 0.45. */
  dimOpacity?: number;
  callout?: string;
  color?: string;
  enterFrames?: number;
  exitFrames?: number;
};

export type FocusCameraSample = {
  scale: number;
  tx: number;
  ty: number;
  active: FocusTarget | null;
  progress: number;
  dimOpacity: number;
};

/**
 * Deterministic focus camera that smoothly pushes in on an active `FocusTarget`
 * and returns cleanly to 1x when `until` passes.
 */
export function sampleFocusCamera(
  targets: readonly FocusTarget[],
  frame: number,
  canvas: { width: number; height: number } = FRAME,
): FocusCameraSample {
  const active = targets.find((t) => frame >= t.from && frame < t.until) ?? null;
  if (!active) {
    return { scale: 1, tx: 0, ty: 0, active: null, progress: 0, dimOpacity: 0 };
  }
  const span = Math.max(1, active.until - active.from);
  const enter = Math.min(active.enterFrames ?? 18, span * 0.45);
  const exit = Math.min(active.exitFrames ?? 14, span * 0.45);
  const pIn = ramp(frame, active.from, enter, "out");
  const pOut = ramp(frame, active.until - exit, exit, "inOut");
  const p = clamp01(pIn * (1 - pOut));
  const targetZoom = Math.max(1, active.zoom ?? 1.35);
  const scale = lerp(1, targetZoom, p);
  const c = center(active.rect);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  // Pan proportionally to (scale - 1) and clamp to scaled margin so zoom=1 never shifts off-screen.
  const panStrength = scale - 1;
  const rawTx = (cx - c.x) * panStrength;
  const rawTy = (cy - c.y) * panStrength;
  const maxPanX = (canvas.width * (scale - 1)) / 2;
  const maxPanY = (canvas.height * (scale - 1)) / 2;
  const tx = Math.max(-maxPanX, Math.min(maxPanX, rawTx));
  const ty = Math.max(-maxPanY, Math.min(maxPanY, rawTy));
  const norm = (n: number) => {
    const r = Math.round(n * 100) / 100;
    return r === 0 ? 0 : r;
  };
  return {
    scale,
    tx: norm(tx),
    ty: norm(ty),
    active,
    progress: p,
    dimOpacity: clamp01((active.dimOpacity ?? 0.45) * p),
  };
}
