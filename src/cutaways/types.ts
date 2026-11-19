import type { SfxName } from "../audio/cues.ts";

export const CUTAWAY_VARIANTS = [
  "elastic-tag",
  "type-stack",
  "magnetic-snap",
  "outline-reveal",
  "flip-card-type",
  "chromatic-slice",
  "scramble-flap",
  "light-trail",
  "gravity-drop",
  "morph-stretch",
  "paper-tear",
  "echo-trail",
  "rope-swing",
  "spotlight-beam",
  "type-collage",
] as const;

export type CutawayVariant = (typeof CUTAWAY_VARIANTS)[number];

export type CutawayBoardTone = "auto" | "dark" | "light" | "warm-paper";

export type CutawayLine = {
  text: string;
  color?: string;
  size?: number;
  weight?: number;
};

export type CutawayCollageWord = {
  text: string;
  x: number;
  y: number;
  rotate?: number;
  size?: number;
  color?: string;
};

export type CutawaySpec = {
  variant: CutawayVariant;
  text: string;
  kicker?: string;
  boardTone?: CutawayBoardTone;
  accentColor?: string;
  badgeText?: string;
  lines?: readonly CutawayLine[];
  beforeAfter?: { before: string; after: string; note?: string };
  pairLabels?: readonly [string, string];
  collageWords?: readonly CutawayCollageWord[];
  footnote?: string;
  sfx?: SfxName | false;
};

const LIGHT_DEFAULT_VARIANTS = new Set<CutawayVariant>([
  "outline-reveal",
  "chromatic-slice",
  "scramble-flap",
  "gravity-drop",
  "paper-tear",
  "type-collage",
]);

export function resolveCutawayBoardTone(
  spec: Pick<CutawaySpec, "variant" | "boardTone">,
): "dark" | "light" | "warm-paper" {
  if (spec.boardTone && spec.boardTone !== "auto") {
    return spec.boardTone;
  }
  return LIGHT_DEFAULT_VARIANTS.has(spec.variant) ? "light" : "dark";
}

export function validateCutawayHold(
  spec: Pick<CutawaySpec, "text">,
  durationFrames: number,
  fps = 30,
): {
  valid: boolean;
  wordCount: number;
  requiredHoldFrames: number;
  availableFrames: number;
} {
  const words = spec.text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const requiredHoldFrames = Math.max(
    Math.round(fps * 1.1),
    18 + wordCount * 5,
  );
  return {
    valid: durationFrames >= requiredHoldFrames,
    wordCount,
    requiredHoldFrames,
    availableFrames: durationFrames,
  };
}
