import { sample, type EasingName, type Keyframe } from "./keyframes.ts";

export type CameraKeyframe = {
  at: number;
  x?: number;
  y?: number;
  zoom?: number;
  rotate?: number;
  easing?: EasingName;
};

export type CameraParallax = Partial<
  Record<"background" | "midground" | "foreground", number>
>;

export type CameraRigSpec = {
  keyframes: readonly CameraKeyframe[];
  parallax?: CameraParallax;
};

export type CameraRigSample = {
  x: number;
  y: number;
  zoom: number;
  rotate: number;
};

export const DEFAULT_DEPTH_PARALLAX: Record<
  "background" | "midground" | "foreground",
  number
> = {
  background: 0.22,
  midground: 1.0,
  foreground: 1.15,
};

export function sampleCameraRig(
  rig: CameraRigSpec | undefined,
  frame: number,
): CameraRigSample {
  if (!rig || rig.keyframes.length === 0) {
    return { x: 0, y: 0, zoom: 1, rotate: 0 };
  }
  const ordered = [...rig.keyframes].sort((a, b) => a.at - b.at);
  const toTrack = (
    pick: (kf: CameraKeyframe) => number | undefined,
    fallback: number,
  ): Keyframe[] => {
    let last = fallback;
    return ordered.map((kf) => {
      const next = pick(kf);
      if (next !== undefined) last = next;
      return { at: kf.at, value: last, easing: kf.easing ?? "inOut" };
    });
  };

  const norm = (n: number) => {
    const r = Math.round(n * 1000) / 1000;
    return r === 0 ? 0 : r;
  };

  return {
    x: norm(sample(toTrack((k) => k.x, 0), frame, 0)),
    y: norm(sample(toTrack((k) => k.y, 0), frame, 0)),
    zoom: Math.max(0.25, norm(sample(toTrack((k) => k.zoom, 1), frame, 1))),
    rotate: norm(sample(toTrack((k) => k.rotate, 0), frame, 0)),
  };
}

export function cameraLayerTransform(
  rigSample: CameraRigSample,
  depth: "background" | "midground" | "foreground",
  parallax?: CameraParallax,
): { tx: number; ty: number; scale: number; rotate: number } {
  const factor = parallax?.[depth] ?? DEFAULT_DEPTH_PARALLAX[depth];
  const scale = 1 + (rigSample.zoom - 1) * factor;
  const tx = rigSample.x * factor;
  const ty = rigSample.y * factor;
  const rotate = rigSample.rotate * (depth === "background" ? factor * 0.5 : 1);
  return {
    tx: tx === 0 ? 0 : tx,
    ty: ty === 0 ? 0 : ty,
    scale,
    rotate: rotate === 0 ? 0 : rotate,
  };
}
