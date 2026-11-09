import type { Rect } from "../animation/direction.ts";

export const referenceScenes = [
  "S12",
  "S21",
  "S22",
  "S50",
  "S51",
  "S52",
] as const;
const panels: Record<string, string[]> = {
  S01: ["raise", "reaction"],
  S02: ["workspace", "rental", "entertainment"],
  S03: ["check", "closer"],
  S04: ["working", "commitments"],
  S06: ["pay", "remaining", "transfer"],
  S08: ["cramped", "older-rental"],
  S14: ["sign", "alex-keeps-home"],
  S20: ["newer-seat", "alex-keeps-rental"],
  S26: ["used-service", "alex-pauses"],
  S32: ["sam-contributions", "old-pace"],
  S33: ["monthly", "three-months"],
  S34: ["sam-measures", "alex-checks"],
  S39: ["meal", "paid-once"],
  S40: ["first-month", "next-month"],
  S42: ["sam-tradeoff", "alex-checks"],
  S43: ["hobby", "meal"],
  S48: ["workspace-tradeoff", "rental-tradeoff"],
  S53: ["cancel-impulse", "keep-useful-comforts"],
  S56: ["cancel", "billing-boundary"],
  S61: ["earlier-inputs", "annual-contributions"],
  S63: ["close-illustration", "current-plan"],
  S66: ["earlier-month-three", "current-plan"],
};
export const cinematicStillShots = Array.from(
  { length: 67 },
  (_, i) => `S${String(i + 1).padStart(2, "0")}`,
)
  .filter(
    (id) => !referenceScenes.includes(id as (typeof referenceScenes)[number]),
  )
  .flatMap((scene) =>
    (panels[scene] ?? ["main"]).map((phase, index) => ({
      scene,
      phase,
      index,
      id: `${scene}-${phase}`,
    })),
  );
export type CinematicStillShot = (typeof cinematicStillShots)[number];
export const storyboardViews = {
  wide: [0, 0, 1920, 1080],
  medium: [250, 140, 1420, 798.75],
  hands: [550, 300, 1200, 675],
  phone: [550, 260, 1100, 618.75],
  table: [350, 235, 1500, 843.75],
} satisfies Record<string, Rect>;
