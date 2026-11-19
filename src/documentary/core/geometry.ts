/** Frame geometry, safe areas and named scene layouts (pure, node-testable). */
export const FRAME = { width: 1920, height: 1080 } as const;
/** Essential graphics keep at least this distance from the side edges. */
export const SIDE_SAFE = 96;
/** Recommended top/bottom clearance for essential content (player overlays). */
export const VERTICAL_SAFE = 64;

export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

export const SAFE_RECT: Rect = {
  x: SIDE_SAFE,
  y: VERTICAL_SAFE,
  width: FRAME.width - SIDE_SAFE * 2,
  height: FRAME.height - VERTICAL_SAFE * 2,
};

export const right = (r: Rect) => r.x + r.width;
export const bottom = (r: Rect) => r.y + r.height;
export const center = (r: Rect): Point => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
export const inset = (r: Rect, d: number): Rect => ({
  x: r.x + d,
  y: r.y + d,
  width: Math.max(0, r.width - d * 2),
  height: Math.max(0, r.height - d * 2),
});
export const intersects = (a: Rect, b: Rect) =>
  a.x < right(b) && right(a) > b.x && a.y < bottom(b) && bottom(a) > b.y;
export const contains = (outer: Rect, inner: Rect, tolerance = 0.5) =>
  inner.x >= outer.x - tolerance &&
  inner.y >= outer.y - tolerance &&
  right(inner) <= right(outer) + tolerance &&
  bottom(inner) <= bottom(outer) + tolerance;
export const union = (rects: Rect[]): Rect => {
  const x = Math.min(...rects.map((r) => r.x));
  const y = Math.min(...rects.map((r) => r.y));
  return {
    x,
    y,
    width: Math.max(...rects.map(right)) - x,
    height: Math.max(...rects.map(bottom)) - y,
  };
};
/** Rect after scaling about an origin and translating (layer transform). */
export const transformRect = (
  r: Rect,
  t: { x: number; y: number; scale: number; originX: number; originY: number },
): Rect => {
  const ox = r.x + r.width * t.originX;
  const oy = r.y + r.height * t.originY;
  return {
    x: ox + (r.x - ox) * t.scale + t.x,
    y: oy + (r.y - oy) * t.scale + t.y,
    width: r.width * t.scale,
    height: r.height * t.scale,
  };
};
/** Essential content must stay inside the side safe margins. */
export const withinSideSafe = (r: Rect) =>
  r.x >= SIDE_SAFE - 0.5 && right(r) <= FRAME.width - SIDE_SAFE + 0.5;

const GUTTER = 48;
const S = SAFE_RECT;
const col = (fraction: number, offset = 0): Rect => ({
  x: S.x + offset,
  y: S.y,
  width: S.width * fraction - (offset ? 0 : 0),
  height: S.height,
});

/**
 * Named compositions. Regions are inside the safe area; `full` is the whole frame
 * for backgrounds and footage that may bleed to the edge. Layouts are a starting
 * grid, not a template rotation: scenes may override any box.
 */
export const LAYOUTS = {
  single: {
    full: { x: 0, y: 0, ...FRAME },
    safe: S,
    hero: { x: 460, y: 150, width: 1000, height: 700 },
    caption: { x: 360, y: 880, width: 1200, height: 120 },
  },
  split: {
    full: { x: 0, y: 0, ...FRAME },
    left: { ...col(0.5), width: S.width / 2 - GUTTER / 2 },
    right: { x: S.x + S.width / 2 + GUTTER / 2, y: S.y, width: S.width / 2 - GUTTER / 2, height: S.height },
  },
  "feature-left": {
    full: { x: 0, y: 0, ...FRAME },
    main: { x: S.x, y: S.y, width: S.width * 0.6 - GUTTER / 2, height: S.height },
    side: { x: S.x + S.width * 0.6 + GUTTER / 2, y: S.y, width: S.width * 0.4 - GUTTER / 2, height: S.height },
  },
  "feature-right": {
    full: { x: 0, y: 0, ...FRAME },
    side: { x: S.x, y: S.y, width: S.width * 0.4 - GUTTER / 2, height: S.height },
    main: { x: S.x + S.width * 0.4 + GUTTER / 2, y: S.y, width: S.width * 0.6 - GUTTER / 2, height: S.height },
  },
  stack: {
    full: { x: 0, y: 0, ...FRAME },
    top: { x: S.x, y: S.y, width: S.width, height: S.height * 0.42 - GUTTER / 2 },
    bottom: { x: S.x, y: S.y + S.height * 0.42 + GUTTER / 2, width: S.width, height: S.height * 0.58 - GUTTER / 2 },
  },
  inset: {
    full: { x: 0, y: 0, ...FRAME },
    inset: { x: 1100, y: 180, width: 724, height: 720 },
    note: { x: S.x, y: 760, width: 860, height: 220 },
  },
  triptych: {
    full: { x: 0, y: 0, ...FRAME },
    a: { x: S.x, y: S.y + 80, width: (S.width - GUTTER * 2) / 3, height: S.height - 160 },
    b: { x: S.x + (S.width - GUTTER * 2) / 3 + GUTTER, y: S.y + 80, width: (S.width - GUTTER * 2) / 3, height: S.height - 160 },
    c: { x: S.x + ((S.width - GUTTER * 2) / 3 + GUTTER) * 2, y: S.y + 80, width: (S.width - GUTTER * 2) / 3, height: S.height - 160 },
  },
  "document-focus": {
    full: { x: 0, y: 0, ...FRAME },
    document: { x: 300, y: S.y, width: 900, height: S.height },
    notes: { x: 1260, y: 200, width: S.x + S.width - 1260, height: 680 },
  },
  "lower-third": {
    full: { x: 0, y: 0, ...FRAME },
    stage: { x: S.x, y: S.y, width: S.width, height: 700 },
    lower: { x: S.x, y: 800, width: 1100, height: 180 },
  },
  "asymmetric-65-35": {
    full: { x: 0, y: 0, ...FRAME },
    primary: {
      x: S.x,
      y: S.y,
      width: Math.round(S.width * 0.65 - GUTTER / 2),
      height: S.height,
    },
    rail: {
      x: S.x + Math.round(S.width * 0.65 + GUTTER / 2),
      y: S.y,
      width: S.width - Math.round(S.width * 0.65 + GUTTER / 2),
      height: S.height,
    },
  },
  "asymmetric-35-65": {
    full: { x: 0, y: 0, ...FRAME },
    rail: {
      x: S.x,
      y: S.y,
      width: Math.round(S.width * 0.35 - GUTTER / 2),
      height: S.height,
    },
    primary: {
      x: S.x + Math.round(S.width * 0.35 + GUTTER / 2),
      y: S.y,
      width: S.width - Math.round(S.width * 0.35 + GUTTER / 2),
      height: S.height,
    },
  },
  "editorial-top-stage": {
    full: { x: 0, y: 0, ...FRAME },
    header: { x: S.x, y: S.y, width: S.width, height: 190 },
    stage: { x: S.x, y: S.y + 222, width: S.width, height: S.height - 222 },
  },
  "diagonal-flow": {
    full: { x: 0, y: 0, ...FRAME },
    origin: { x: S.x, y: S.y + 30, width: 520, height: 380 },
    bridge: { x: S.x + 604, y: S.y + 270, width: 520, height: 380 },
    outcome: {
      x: S.x + S.width - 520,
      y: S.y + S.height - 410,
      width: 520,
      height: 380,
    },
  },
  "rail-timeline": {
    full: { x: 0, y: 0, ...FRAME },
    headline: { x: S.x, y: S.y, width: 520, height: S.height },
    track: { x: S.x + 568, y: S.y, width: S.width - 568, height: 420 },
    detail: {
      x: S.x + 568,
      y: S.y + 460,
      width: S.width - 568,
      height: S.height - 460,
    },
  },
  "presenter-split": {
    full: { x: 0, y: 0, ...FRAME },
    presenter: { x: S.x, y: S.y, width: 720, height: S.height },
    graphic: {
      x: 896,
      y: S.y,
      width: S.x + S.width - 896,
      height: S.height,
    },
  },
  "hero-annotations": {
    full: { x: 0, y: 0, ...FRAME },
    hero: { x: 520, y: 170, width: 880, height: 560 },
    leftNote: { x: S.x, y: 240, width: 380, height: 420 },
    rightNote: { x: 1444, y: 240, width: 380, height: 420 },
    bottomNote: { x: 360, y: 790, width: 1200, height: 210 },
  },
} as const satisfies Record<string, Record<string, Rect>>;

export type LayoutName = keyof typeof LAYOUTS;
export type RegionOf<L extends LayoutName> = keyof (typeof LAYOUTS)[L] & string;

export function region(layout: LayoutName, name: string): Rect {
  const regions = LAYOUTS[layout] as Record<string, Rect>;
  const found = regions[name];
  if (!found) throw new Error(`Layout ${layout} has no region "${name}"`);
  return found;
}

export function getRegionEntryDirection(
  rect: Rect,
  frame: { width: number; height: number } = FRAME,
): "left" | "right" | "up" | "down" | "scale" {
  const cx = (rect.x + rect.width / 2) / frame.width;
  const cy = (rect.y + rect.height / 2) / frame.height;
  if (rect.width >= frame.width * 0.7 && rect.height >= frame.height * 0.7) {
    return "scale";
  }
  if (cx < 0.38 && rect.width < frame.width * 0.55) return "left";
  if (cx > 0.62 && rect.width < frame.width * 0.55) return "right";
  if (cy < 0.34) return "down";
  if (cy > 0.68) return "up";
  return rect.width >= frame.width * 0.45 && rect.height >= frame.height * 0.45
    ? "scale"
    : "up";
}
