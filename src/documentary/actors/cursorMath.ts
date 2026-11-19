import type { PlacedSfx, SfxName } from "../../audio/cues.ts";
import { clamp01, lerp, ramp, type EasingName } from "../core/keyframes.ts";

export type CursorAction = "move" | "hover" | "click" | "recoil";

export type CursorWaypoint = {
  at: number;
  x: number;
  y: number;
  action?: CursorAction;
  easing?: EasingName;
  sfx?: SfxName | false;
};

export type CursorSample = {
  visible: boolean;
  x: number;
  y: number;
  press: number;
  ripple: number;
  activeAction: CursorAction | null;
  opacity: number;
};

export function sampleCursorWaypoints(
  waypoints: readonly CursorWaypoint[],
  frame: number,
  opts?: { travelFrames?: number; clickFrames?: number },
): CursorSample {
  if (waypoints.length === 0) {
    return {
      visible: false,
      x: 0,
      y: 0,
      press: 0,
      ripple: 0,
      activeAction: null,
      opacity: 0,
    };
  }

  const ordered = [...waypoints].sort((a, b) => a.at - b.at);
  const clickFrames = Math.max(4, opts?.clickFrames ?? 18);
  const first = ordered[0];

  if (frame < first.at - 12) {
    return {
      visible: false,
      x: first.x,
      y: first.y,
      press: 0,
      ripple: 0,
      activeAction: null,
      opacity: 0,
    };
  }

  const enterOpacity =
    first.at === 0 ? 1 : ramp(frame, Math.max(0, first.at - 10), 10, "out");

  let x = first.x;
  let y = first.y;
  const last = ordered[ordered.length - 1];

  if (frame >= last.at) {
    x = last.x;
    y = last.y;
  } else if (frame > first.at) {
    let segIdx = 0;
    for (let i = 1; i < ordered.length; i++) {
      if (frame <= ordered[i].at) {
        segIdx = i - 1;
        break;
      }
    }
    const a = ordered[segIdx];
    const b = ordered[segIdx + 1];
    const gap = Math.max(1, b.at - a.at);
    const travelSpan =
      opts?.travelFrames !== undefined
        ? Math.min(gap, Math.max(1, opts.travelFrames))
        : a.action === "click"
          ? Math.max(
              1,
              gap - Math.min(Math.round(clickFrames * 0.55), Math.floor(gap * 0.4)),
            )
          : gap;
    const moveStart = b.at - travelSpan;
    const t =
      frame <= moveStart
        ? 0
        : ramp(frame, moveStart, travelSpan, b.easing ?? "outCubic");
    x = lerp(a.x, b.x, t);
    y = lerp(a.y, b.y, t);
  }

  let press = 0;
  let ripple = 0;
  let activeAction: CursorAction | null = null;
  let recoilY = 0;

  for (let i = ordered.length - 1; i >= 0; i--) {
    const w = ordered[i];
    if (frame >= w.at && frame <= w.at + clickFrames) {
      const p = clamp01((frame - w.at) / clickFrames);
      activeAction = w.action ?? "move";
      if (w.action === "click") {
        press = Math.sin(Math.PI * clamp01(p * 1.35));
        ripple = p;
      } else if (w.action === "recoil") {
        recoilY = -14 * Math.sin(Math.PI * p);
        press = 0.35 * Math.sin(Math.PI * p);
      }
      break;
    }
  }

  return {
    visible: enterOpacity > 0.01,
    x,
    y: y + recoilY,
    press,
    ripple,
    activeAction,
    opacity: enterOpacity,
  };
}

export function collectCursorSfx(
  waypoints: readonly CursorWaypoint[],
  sceneFrom = 0,
  defaultGain = 0.2,
): PlacedSfx[] {
  const cues: PlacedSfx[] = [];
  for (const w of waypoints) {
    if (w.sfx === false) continue;
    const frame = Math.max(0, Math.round(sceneFrom + w.at));
    if (typeof w.sfx === "string") {
      cues.push([frame, w.sfx, defaultGain]);
    } else if (w.action === "click") {
      cues.push([frame, "pop", defaultGain]);
    } else if (w.action === "recoil") {
      cues.push([frame, "swish", Math.round(defaultGain * 85) / 100]);
    }
  }
  return cues;
}
