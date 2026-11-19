import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../design/tokens";
import { KineticCutaway } from "./KineticCutaway";
import type { CutawaySpec } from "./types";

export const CUTAWAY_GALLERY_ITEMS: readonly CutawaySpec[] = [
  {
    variant: "elastic-tag",
    text: "Framing changes the choice",
    kicker: "BEHAVIORAL SIGNAL",
    badgeText: "STICKER VS SPLIT",
  },
  {
    variant: "type-stack",
    text: "One condition changes the whole order",
    kicker: "MECHANISM",
    badgeText: "THRESHOLD",
    lines: [
      { text: "One condition", color: C.yellow, size: 82 },
      { text: "changes the order.", color: C.white, size: 82 },
    ],
  },
  {
    variant: "magnetic-snap",
    text: "Zero pulls attention",
    kicker: "THE ZERO EFFECT",
    badgeText: "$0",
  },
  {
    variant: "outline-reveal",
    text: "Zero beats small discounts",
    kicker: "EXPERIMENT",
    badgeText: "$0 CHOICE",
  },
  {
    variant: "flip-card-type",
    text: "Two tasks replace one",
    kicker: "CHECKOUT FLOW",
    pairLabels: ["Need item ✓", "Hit cutoff →"],
  },
  {
    variant: "chromatic-slice",
    text: "Context hides the price",
    kicker: "FRAMING",
    pairLabels: ["Base price", "Fee removed"],
  },
  {
    variant: "scramble-flap",
    text: "Dollars test threshold",
    kicker: "RULE CHECK",
    pairLabels: ["Meets cutoff ✓", "Needed at home ?"],
  },
  {
    variant: "light-trail",
    text: "Baskets bunch past cutoff",
    kicker: "DATA PATTERN",
    badgeText: "THRESHOLD",
  },
  {
    variant: "gravity-drop",
    text: "Items overshoot exact gaps",
    kicker: "CART MATH",
    footnote: "Overhang cost",
  },
  {
    variant: "morph-stretch",
    text: "Compare complete totals",
    kicker: "REAL COST",
    beforeAfter: {
      before: "BASE + FEE",
      after: "LARGER CART",
      note: "Higher total outlay",
    },
  },
  {
    variant: "paper-tear",
    text: "Costs never disappear",
    kicker: "UNIT ECONOMICS",
    footnote: "Fulfillment & margin absorb the fee",
  },
  {
    variant: "echo-trail",
    text: "Margin vs shipping cost",
    kicker: "INCENTIVE",
    pairLabels: ["Added margin", "Carrier fee"],
  },
  {
    variant: "rope-swing",
    text: "Thresholds shift demand",
    kicker: "POLICY DESIGN",
    footnote: "Higher cutoffs test willingness to pay",
  },
  {
    variant: "spotlight-beam",
    text: "Shifted earlier, not new",
    kicker: "COUNTERPOINT",
    pairLabels: ["TODAY", "NEXT MONTH"],
  },
  {
    variant: "type-collage",
    text: "Worth the real difference?",
    kicker: "DECISION TEST",
    collageWords: [
      { text: "WORTH", x: 420, y: 465, rotate: -4, size: 84, color: C.navy },
      { text: "THE", x: 810, y: 450, rotate: 2, size: 64, color: "#64748B" },
      { text: "FULL", x: 1020, y: 485, rotate: -5, size: 112, color: C.teal },
      { text: "OUTLAY?", x: 560, y: 650, rotate: 2, size: 96, color: C.navy },
    ],
  },
];

export const CUTAWAY_GALLERY_SLOT = 66;
export const CUTAWAY_GALLERY_DURATION =
  CUTAWAY_GALLERY_ITEMS.length * CUTAWAY_GALLERY_SLOT;

export function CutawayGallery() {
  return (
    <AbsoluteFill>
      {CUTAWAY_GALLERY_ITEMS.map((spec, index) => (
        <Sequence
          key={spec.variant}
          name={`${index + 1}: ${spec.variant}`}
          from={index * CUTAWAY_GALLERY_SLOT}
          durationInFrames={CUTAWAY_GALLERY_SLOT}
        >
          <KineticCutaway spec={spec} duration={CUTAWAY_GALLERY_SLOT} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
