import type { Rect } from "./geometry.ts";
import { EASINGS, lerp, type EasingName } from "./keyframes.ts";

export type BridgeAnchorSpec = {
  id: string;
  rect: Rect;
};

export type MatchedBridge = {
  id: string;
  fromRect: Rect;
  toRect: Rect;
};

export function sampleBridgeRect(
  fromRect: Rect,
  toRect: Rect,
  progress: number,
  easing: EasingName = "inOut",
): Rect {
  const t = EASINGS[easing](progress);
  return {
    x: lerp(fromRect.x, toRect.x, t),
    y: lerp(fromRect.y, toRect.y, t),
    width: lerp(fromRect.width, toRect.width, t),
    height: lerp(fromRect.height, toRect.height, t),
  };
}

export function findMatchingBridges(
  prev: readonly BridgeAnchorSpec[] | undefined,
  next: readonly BridgeAnchorSpec[] | undefined,
): MatchedBridge[] {
  if (!prev || !next || prev.length === 0 || next.length === 0) return [];
  const nextById = new Map(next.map((item) => [item.id, item]));
  const matches: MatchedBridge[] = [];
  for (const a of prev) {
    const b = nextById.get(a.id);
    if (b) {
      matches.push({ id: a.id, fromRect: a.rect, toRect: b.rect });
    }
  }
  return matches;
}
