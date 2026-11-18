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
} as const satisfies Record<string, Record<string, Rect>>;

export type LayoutName = keyof typeof LAYOUTS;
export type RegionOf<L extends LayoutName> = keyof (typeof LAYOUTS)[L] & string;

export function region(layout: LayoutName, name: string): Rect {
  const regions = LAYOUTS[layout] as Record<string, Rect>;
  const found = regions[name];
  if (!found) throw new Error(`Layout ${layout} has no region "${name}"`);
  return found;
}
