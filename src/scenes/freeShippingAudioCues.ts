import type { PlacedSfx } from "../audio/sfx.ts";
import type { Timeline } from "../timeline/types.ts";
import { freeShippingFullTimeline } from "./freeShippingFullTimeline.ts";
import { freeShippingOpeningTimeline } from "./freeShippingOpeningTimeline.ts";

export const AMBIENT_GAIN = 0.13;

const scene = (timeline: Timeline, id: string, offset = 0): number => {
  const item = timeline.scenes.find((entry) => entry.id === id);
  if (!item || offset < 0 || offset >= item.durationInFrames) {
    throw new Error(`Invalid free-shipping sound scene: ${id} (+${offset})`);
  }
  return item.from + offset;
};

const event = (timeline: Timeline, id: string, offset = 0): number => {
  const item = timeline.events.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Missing free-shipping sound event: ${id}`);
  }
  return item.from + offset;
};

// Cutaway events live in the compiled full timeline; opening-3/6/8 sit within frames 0..1799.
const cutaway = (id: string, offset = 0): number =>
  event(freeShippingFullTimeline, id, offset);

/**
 * Sound-effect placements for the 60-second opening (frames 0..1799).
 * Parameterized over `timeline` so FreeShippingOpening and FreeShippingFullFilm
 * share identical frame-accurate cues anchored to visual actions, not speech.
 */
export const buildOpeningSfx = (timeline: Timeline): PlacedSfx[] => [
  [scene(timeline, "opening-1", 2), "pop", 0.22],
  [scene(timeline, "opening-1", 8), "swish", 0.14],
  [scene(timeline, "opening-1", 74), "whoosh_short", 0.2],
  [event(timeline, "check-price", 0), "pop", 0.24],
  [event(timeline, "check-price", 3), "calculator_taps", 0.14],
  [event(timeline, "ready-pay", 0), "coin_clink", 0.18],

  [event(timeline, "fee-row", 0), "bar_thump", 0.22],
  [event(timeline, "fee-row", 4), "ding", 0.15],

  [scene(timeline, "opening-3", 4), "pop", 0.2],
  [cutaway("cut-free-hook", 0), "whoosh_short", 0.2],
  [event(timeline, "eligibility-bar", 12), "counter_roll", 0.14],

  [event(timeline, "browse-organizer", 0), "swish", 0.18],
  [event(timeline, "add-to-cart", 0), "pop", 0.26],
  [event(timeline, "add-to-cart", 4), "whoosh_rise", 0.18],
  [event(timeline, "fee-waived", 0), "ding", 0.22],

  [scene(timeline, "opening-5", 0), "whoosh_short", 0.18],
  [scene(timeline, "opening-5", 14), "bar_thump", 0.16],
  [event(timeline, "higher-total", 0), "marker_squeak", 0.15],
  [event(timeline, "extra-product", 0), "pop", 0.2],

  [scene(timeline, "opening-6", 2), "pop", 0.18],
  [scene(timeline, "opening-6", 44), "pop", 0.18],
  [scene(timeline, "opening-6", 80), "bar_thump", 0.18],
  [scene(timeline, "opening-6", 144), "swish", 0.18],
  [cutaway("cut-changed-purchase", 0), "whoosh_short", 0.2],
  [event(timeline, "good-deal-qualifier", 0), "ding", 0.16],

  [scene(timeline, "opening-7", 0), "whoosh_short", 0.18],
  [event(timeline, "gap-candidates", 0), "pop", 0.18],
  [event(timeline, "gap-candidates", 15), "pop", 0.16],

  [scene(timeline, "opening-8", 0), "pop", 0.22],
  [scene(timeline, "opening-8", 58), "swish", 0.18],
  [event(timeline, "zero-headline", 0), "impact_boom", 0.18],
  [cutaway("cut-zero-different", 0), "whoosh_short", 0.18],

  [scene(timeline, "opening-9", 0), "bill_flutter", 0.15],
  [scene(timeline, "opening-9", 28), "pop", 0.18],
  [scene(timeline, "opening-9", 46), "pop", 0.18],
  [event(timeline, "cheaper-chocolate", 0), "coin_clink", 0.16],
  [event(timeline, "expensive-chocolate", 0), "coin_clink", 0.18],
];

const buildRemainingSfx = (timeline: Timeline): PlacedSfx[] => [
  [event(timeline, "full-drop-free", 0), "sparkle_chime", 0.16],

  [scene(timeline, "choc-gap", 0), "swish", 0.16],
  [scene(timeline, "choc-gap", 28), "marker_squeak", 0.15],

  [scene(timeline, "zero-effect", 0), "pop", 0.18],
  [cutaway("cut-zero-effect", 0), "whoosh_short", 0.18],

  [scene(timeline, "choc-limits", 0), "swish", 0.16],
  [scene(timeline, "choc-limits", 28), "bar_thump", 0.18],

  [scene(timeline, "clue-attention", 28), "whoosh_rise", 0.16],

  [scene(timeline, "checkout-removable", 0), "pop", 0.16],
  [scene(timeline, "checkout-removable", 28), "swish", 0.18],

  [scene(timeline, "second-task-aroll", 0), "ding", 0.15],

  [cutaway("cut-second-task", 0), "whoosh_short", 0.18],
  [scene(timeline, "second-task-broll", 102), "counter_roll", 0.14],

  [scene(timeline, "organizer-role", 28), "marker_squeak", 0.14],

  [cutaway("cut-context-shift", 0), "whoosh_short", 0.18],
  [scene(timeline, "different-context", 75), "pop", 0.16],

  [scene(timeline, "promo-gap-wording", 0), "pop", 0.16],
  [scene(timeline, "promo-gap-wording", 28), "swish", 0.16],

  [scene(timeline, "gap-in-view", 0), "ding", 0.14],

  [scene(timeline, "no-usefulness-test", 0), "calculator_taps", 0.15],
  [cutaway("cut-only-amount", 0), "stamp_thud", 0.18],

  [scene(timeline, "two-baskets-qualify", 0), "pop", 0.16],
  [scene(timeline, "two-baskets-qualify", 60), "bar_thump", 0.14],

  [scene(timeline, "philippines-study", 0), "bill_flutter", 0.15],
  [scene(timeline, "philippines-study", 18), "whoosh_rise", 0.16],
  [cutaway("cut-clustered-orders", 0), "whoosh_short", 0.18],

  [scene(timeline, "model-vs-observation", 0), "swish", 0.16],

  [scene(timeline, "discount-vs-cutoff", 28), "pop", 0.18],

  [scene(timeline, "not-automatically-waste", 18), "swish", 0.18],
  [scene(timeline, "not-automatically-waste", 32), "pop", 0.14],

  [cutaway("cut-mismatch-gap", 0), "whoosh_short", 0.18],
  [scene(timeline, "indivisible-overshoot", 88), "bar_thump", 0.2],

  [event(timeline, "full-paid-48", 0), "coin_clink", 0.2],
  [event(timeline, "full-free-54", 0), "cash_register", 0.18],

  [cutaway("cut-six-dollar-question", 0), "whoosh_short", 0.18],
  [event(timeline, "full-extra-6", 0), "ding", 0.18],

  [scene(timeline, "merchant-side-aroll", 2), "pop", 0.16],
  [scene(timeline, "merchant-side-aroll", 30), "pop", 0.16],
  [scene(timeline, "merchant-side-aroll", 62), "pop", 0.16],

  [cutaway("cut-delivery-cost", 0), "whoosh_short", 0.18],
  [scene(timeline, "delivery-still-costs", 80), "bar_thump", 0.16],

  [scene(timeline, "margin-vs-cost", 28), "bar_thump", 0.16],
  [scene(timeline, "margin-vs-cost", 60), "bar_thump", 0.18],
  [cutaway("cut-sales-vs-profit", 0), "whoosh_short", 0.18],

  [scene(timeline, "study-2006-profit", 0), "bill_flutter", 0.15],
  [scene(timeline, "study-2006-profit", 60), "pop", 0.14],
  [scene(timeline, "study-2006-profit", 85), "pop", 0.14],
  [scene(timeline, "study-2006-profit", 110), "pop", 0.14],

  [scene(timeline, "raising-threshold", 28), "whoosh_rise", 0.16],
  [cutaway("cut-target-too-high", 0), "whoosh_short", 0.18],

  [scene(timeline, "grocery-2026-study", 0), "bill_flutter", 0.15],
  [scene(timeline, "grocery-2026-study", 28), "bar_thump", 0.16],

  [scene(timeline, "two-studies-matrix", 28), "swish", 0.16],

  [scene(timeline, "needed-item-aroll", 0), "pop", 0.18],

  [scene(timeline, "earlier-not-more", 28), "swish", 0.16],
  [cutaway("cut-earlier-not-more", 0), "whoosh_short", 0.18],

  [scene(timeline, "cash-and-space", 0), "coin_clink", 0.16],
  [scene(timeline, "cash-and-space", 28), "pop", 0.16],

  [scene(timeline, "delivery-as-service", 0), "swish", 0.16],

  [scene(timeline, "organizer-value", 0), "ding", 0.15],

  [scene(timeline, "return-two-orders", 0), "swish", 0.16],

  [cutaway("cut-worth-the-difference", 0), "whoosh_short", 0.18],
  [event(timeline, "full-strip-banner", 27), "swish", 0.16],
  [scene(timeline, "willing-to-pay-test", 348), "pop", 0.16],

  [scene(timeline, "causal-summary-aroll", 2), "pop", 0.16],
  [scene(timeline, "causal-summary-aroll", 30), "pop", 0.16],
  [scene(timeline, "causal-summary-aroll", 62), "pop", 0.16],

  [scene(timeline, "final-callback", 0), "swish", 0.14],
  [scene(timeline, "final-callback", 18), "sparkle_chime", 0.18],

  [event(timeline, "full-end-card", 0), "ding", 0.16],
];

export const freeShippingOpeningSfx: PlacedSfx[] = buildOpeningSfx(
  freeShippingOpeningTimeline,
);

export const freeShippingFullSfx: PlacedSfx[] = [
  ...buildOpeningSfx(freeShippingFullTimeline),
  ...buildRemainingSfx(freeShippingFullTimeline),
];
