import cues from "../../videos/004-free-shipping/full-cues.demo.json" with { type: "json" };
import {
  calculateFreeShippingOrder,
  freeShippingExample,
} from "../finance/math.ts";
import { compileTimeline, msToFrames } from "../timeline/compiler.ts";
import type {
  CueFile,
  SceneSpec,
  Storyboard,
  StoryEvent,
} from "../timeline/types.ts";
import {
  A_ROLL_FIRST_SEGMENT_FRAMES,
  A_ROLL_SECOND_SEGMENT_FRAMES,
} from "./freeShippingOpeningTimeline.ts";

export { freeShippingExample };
export const freeShippingOrder = calculateFreeShippingOrder();

export const FULL_AUDIO_DURATION_MS = cues.audioDurationMs;
export const FULL_TAIL_MS = 2000;

export const FULL_SPEECH_WINDOWS: readonly [number, number][] = cues.cues.map(
  (cue) => [
    msToFrames(cue.startMs, 30),
    msToFrames(cue.endMs, 30),
  ],
);

export const A_ROLL_REMAINING_SCENE_IDS = new Set([
  "second-task-aroll",
  "totals-reveal-aroll",
  "merchant-side-aroll",
  "needed-item-aroll",
  "causal-summary-aroll",
]);

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

const sceneDefinitions: [
  string,
  string,
  SceneSpec["template"],
  string,
  string | "END",
][] = [
  ["opening-1", "Ready to pay for the charger", "story", "p001-s001", "p001-s003"],
  ["opening-2", "Delivery fee appears", "story", "p001-s003", "p001-s004"],
  ["opening-3", "Threshold offer and unmet gap", "story", "p001-s004", "p001-s005"],
  ["opening-4", "Browsing and adding organizer", "story", "p001-s005", "p001-s006"],
  ["opening-5", "Higher total with another product", "comparison", "p001-s006", "p002-s002"],
  ["opening-6", "Conditional rule and qualification", "diagram", "p002-s002", "p002-s005"],
  ["opening-7", "What fills the gap?", "diagram", "p002-s005", "p002-s006"],
  ["opening-8", "Zero versus ordinary low price", "diagram", "p002-s006", "p003-s002"],
  ["opening-9", "Chocolate experiment setup", "documentary", "p003-s002", "p003-s003"],
  ["choc-shift", "Equal price cut shifts choice to zero", "documentary", "p003-s003", "p003-s004"],
  ["choc-gap", "Price gap stays unchanged at zero", "diagram", "p003-s004", "p004-s001"],
  ["zero-effect", "The zero-price effect", "diagram", "p004-s001", "p004-s002"],
  ["choc-limits", "Chocolate study limits", "documentary", "p004-s002", "p004-s004"],
  ["clue-attention", "Charge elimination attracts attention", "diagram", "p004-s004", "p004-s005"],
  ["checkout-removable", "Delivery line feels removable at checkout", "story", "p004-s005", "p005-s002"],
  ["second-task-aroll", "Condition creates a second task", "story", "p005-s002", "p005-s005"],
  ["second-task-broll", "Getting the cart over the cutoff", "diagram", "p005-s005", "p006-s001"],
  ["organizer-role", "Organizer takes on a cutoff role", "diagram", "p006-s001", "p006-s002"],
  ["different-context", "Evaluated alongside the fee removed", "comparison", "p006-s002", "p006-s004"],
  ["promo-gap-wording", "Gap size and offer wording", "documentary", "p006-s004", "p007-s002"],
  ["gap-in-view", "Remaining gap kept in view", "story", "p007-s002", "p007-s004"],
  ["no-usefulness-test", "Threshold tests dollars, not usefulness", "diagram", "p007-s004", "p008-s001"],
  ["two-baskets-qualify", "Offer view versus shopper view", "comparison", "p008-s001", "p008-s004"],
  ["philippines-study", "2018 Philippine retailer threshold cluster", "documentary", "p008-s004", "p009-s001"],
  ["model-vs-observation", "Observation versus policy model", "comparison", "p009-s001", "p009-s003"],
  ["discount-vs-cutoff", "Pure discount versus spending condition", "diagram", "p009-s003", "p009-s006"],
  ["not-automatically-waste", "Extra items are not automatically useless", "diagram", "p009-s006", "p010-s002"],
  ["indivisible-overshoot", "Items do not match the exact gap", "story", "p010-s002", "p011-s002"],
  ["totals-reveal-aroll", "Two complete order totals", "comparison", "p011-s002", "p011-s004"],
  ["real-extra-outlay", "Real discount and real extra outlay", "comparison", "p011-s004", "p012-s004"],
  ["merchant-side-aroll", "Why merchants offer thresholds", "documentary", "p012-s004", "p012-s007"],
  ["delivery-still-costs", "Delivery still has a carrier cost", "diagram", "p012-s007", "p013-s003"],
  ["margin-vs-cost", "Added sales versus retail costs", "comparison", "p013-s003", "p014-s001"],
  ["study-2006-profit", "2006 shipping-policy profitability study", "documentary", "p014-s001", "p014-s005"],
  ["raising-threshold", "Threshold pushed past willingness", "diagram", "p014-s005", "p015-s002"],
  ["grocery-2026-study", "2026 grocery threshold study", "documentary", "p015-s002", "p016-s001"],
  ["two-studies-matrix", "Two studies test different policies", "comparison", "p016-s001", "p016-s004"],
  ["needed-item-aroll", "Fair counterpoint: something genuinely needed", "story", "p016-s004", "p017-s002"],
  ["earlier-not-more", "Timing shift versus extra spending", "comparison", "p017-s002", "p018-s001"],
  ["cash-and-space", "Liquidity and storage constraints", "diagram", "p018-s001", "p018-s004"],
  ["delivery-as-service", "Paid delivery as a practical service", "comparison", "p018-s004", "p019-s002"],
  ["organizer-value", "Useful and enjoyable items can be worth it", "story", "p019-s002", "p019-s005"],
  ["return-two-orders", "Complete orders side by side", "comparison", "p019-s005", "p020-s001"],
  ["willing-to-pay-test", "Would you pay the difference without the banner?", "comparison", "p020-s001", "p021-s002"],
  ["causal-summary-aroll", "Why free shipping makes you spend more", "diagram", "p021-s002", "p022-s001"],
  ["final-callback", "Back to the charger you started with", "story", "p022-s001", "END"],
];

const sceneSpecs: SceneSpec[] = sceneDefinitions.map(
  ([id, title, template, startCue, endCue]) => ({
    id,
    title,
    template,
    start: { cueId: startCue },
    end:
      endCue === "END"
        ? { cueId: "p022-s003", edge: "end" as const }
        : { cueId: endCue },
  }),
);

// Opening and remaining timeline action anchors (draft ASR offsets; require listening review)
const actionRows: [string, string, string, number, number, string | undefined][] = [
  ["check-price", "opening-1", "p001-s002", 1460, 600, "Draft word timing for 'checked'"],
  ["ready-pay", "opening-1", "p001-s002", 2920, 600, "Draft word timing for 'ready'"],
  ["fee-row", "opening-2", "p001-s003", 360, 700, "Draft word timing for 'delivery'"],
  ["eligibility-bar", "opening-3", "p001-s004", 1920, 900, "Draft word timing for 'free'"],
  ["browse-organizer", "opening-4", "p001-s005", 860, 800, "Draft word timing for 'browsing'"],
  ["add-to-cart", "opening-4", "p001-s005", 3180, 700, "Draft word timing for 'add'"],
  ["fee-waived", "opening-4", "p001-s005", 4500, 700, "Draft word timing for 'delivery'"],
  ["higher-total", "opening-5", "p001-s006", 1700, 800, "Draft word timing for 'costs'"],
  ["extra-product", "opening-5", "p002-s001", 860, 900, "Draft word timing for 'another'"],
  ["condition-rule", "opening-6", "p002-s003", 0, 900, undefined],
  ["good-deal-qualifier", "opening-6", "p002-s004", 1640, 900, "Draft word timing for 'qualifying'"],
  ["gap-candidates", "opening-7", "p002-s005", 1120, 900, "Draft word timing for 'what'"],
  ["zero-headline", "opening-8", "p003-s001", 1440, 900, "Draft word timing for 'zero'"],
  ["cheaper-chocolate", "opening-9", "p003-s002", 4740, 800, "Draft word timing for 'cheaper'"],
  ["expensive-chocolate", "opening-9", "p003-s002", 6280, 800, "Draft word timing for 'expensive'"],
  ["full-drop-free", "choc-shift", "p003-s003", 2800, 900, "Draft word timing for 'free'"],
  ["full-paid-48", "totals-reveal-aroll", "p011-s003", 2600, 900, "Draft word timing for '$48'"],
  ["full-free-54", "totals-reveal-aroll", "p011-s003", 5800, 900, "Draft word timing for '$54'"],
  ["full-extra-6", "real-extra-outlay", "p012-s001", 400, 800, "Draft word timing for 'extra'"],
  ["full-strip-banner", "willing-to-pay-test", "p020-s002", 1800, 900, "Draft word timing for 'free shipping message'"],
];

const actionEvents: StoryEvent[] = actionRows.map(
  ([id, sceneId, cueId, offsetMs, durationMs, reason]) => ({
    id,
    sceneId,
    cueId,
    offsetMs,
    durationMs,
    reason,
    kind: "show-expense",
    track: id,
    payload: {},
  }),
);

// Fifteen unique kinetic cutaways distributed across the film
const cutawayRows: [
  string,
  string,
  string,
  number,
  number,
  CutawayVariant,
  string,
  string,
  string,
][] = [
  [
    "cut-free-hook",
    "opening-3",
    "p001-s004",
    1400,
    2100,
    "elastic-tag",
    "Spend more to save?",
    "save?",
    "THE HOOK",
  ],
  [
    "cut-changed-purchase",
    "opening-6",
    "p002-s003",
    2900,
    2200,
    "type-stack",
    "One condition changes the cart.",
    "condition",
    "MECHANISM",
  ],
  [
    "cut-zero-different",
    "opening-8",
    "p003-s001",
    2350,
    2200,
    "magnetic-snap",
    "Zero behaves differently.",
    "Zero",
    "RESEARCH",
  ],
  [
    "cut-zero-effect",
    "zero-effect",
    "p004-s001",
    500,
    2200,
    "outline-reveal",
    "The Zero-Price Effect",
    "Zero-Price",
    "2007 STUDY",
  ],
  [
    "cut-second-task",
    "second-task-broll",
    "p005-s005",
    1200,
    2200,
    "flip-card-type",
    "A Second Shopping Task",
    "Second",
    "TASK SHIFT",
  ],
  [
    "cut-context-shift",
    "different-context",
    "p006-s002",
    300,
    2100,
    "chromatic-slice",
    "New Evaluation Context",
    "Context",
    "FRAMING",
  ],
  [
    "cut-only-amount",
    "no-usefulness-test",
    "p007-s005",
    600,
    2200,
    "scramble-flap",
    "COUNTS DOLLARS ONLY",
    "DOLLARS",
    "THE RULE",
  ],
  [
    "cut-clustered-orders",
    "philippines-study",
    "p008-s006",
    400,
    2200,
    "light-trail",
    "Clustered Above Cutoff",
    "Cutoff",
    "2018 PAPER",
  ],
  [
    "cut-mismatch-gap",
    "indivisible-overshoot",
    "p010-s002",
    600,
    2200,
    "gravity-drop",
    "PRICES OVERHANG",
    "OVERHANG",
    "GAP MATH",
  ],
  [
    "cut-six-dollar-question",
    "real-extra-outlay",
    "p011-s005",
    400,
    2200,
    "morph-stretch",
    "$48 -> $54 (+$6)",
    "$54",
    "THE REALITY",
  ],
  [
    "cut-delivery-cost",
    "delivery-still-costs",
    "p012-s007",
    400,
    2200,
    "paper-tear",
    "SHIPPING STILL COSTS",
    "COSTS",
    "MERCHANT VIEW",
  ],
  [
    "cut-sales-vs-profit",
    "margin-vs-cost",
    "p013-s005",
    100,
    2100,
    "echo-trail",
    "SALES != PROFIT",
    "PROFIT",
    "UNIT ECONOMICS",
  ],
  [
    "cut-target-too-high",
    "raising-threshold",
    "p015-s001",
    400,
    2200,
    "rope-swing",
    "NOT WORTH REACHING",
    "WORTH",
    "LIMIT",
  ],
  [
    "cut-earlier-not-more",
    "earlier-not-more",
    "p017-s003",
    100,
    2100,
    "spotlight-beam",
    "EARLIER, NOT EXTRA",
    "EARLIER",
    "TIMING SHIFT",
  ],
  [
    "cut-worth-the-difference",
    "willing-to-pay-test",
    "p020-s002",
    500,
    2200,
    "type-collage",
    "WORTH THE $6 DIFFERENCE?",
    "$6",
    "THE DECISION",
  ],
];

const cutawayEvents: StoryEvent[] = cutawayRows.map(
  ([id, sceneId, cueId, offsetMs, durationMs, variant, text, highlight, kicker]) => ({
    id,
    sceneId,
    cueId,
    offsetMs,
    durationMs,
    reason: "Draft phrase timing for kinetic cutaway",
    kind: "payoff",
    track: "cutaway",
    payload: { variant, text, highlight, kicker },
  }),
);

const lastCue = cues.cues[cues.cues.length - 1];
const endCardEvent: StoryEvent = {
  id: "full-end-card",
  sceneId: "final-callback",
  cueId: lastCue.id,
  offsetMs: FULL_AUDIO_DURATION_MS - lastCue.startMs,
  durationMs: FULL_TAIL_MS,
  reason: "Begin closing channel card after narration WAV end",
  kind: "payoff",
  track: "end-card",
  payload: {},
};

export const freeShippingFullBoard: Storyboard = {
  fps: 30,
  demoDurationMs: FULL_AUDIO_DURATION_MS,
  tailMs: FULL_TAIL_MS,
  scenes: sceneSpecs,
  events: [...actionEvents, ...cutawayEvents, endCardEvent],
};

export const freeShippingFullTimeline = compileTimeline(
  cues as CueFile,
  freeShippingFullBoard,
);

export const FULL_FILM_DURATION_FRAMES =
  freeShippingFullTimeline.durationInFrames;

export const FULL_CUTAWAYS = freeShippingFullTimeline.events.filter(
  (event) => event.track === "cutaway",
);

export const OPENING_CUTAWAYS = FULL_CUTAWAYS.filter((event) =>
  event.sceneId.startsWith("opening-"),
);

export const FULL_FILM_A_ROLL_FRAMES =
  A_ROLL_FIRST_SEGMENT_FRAMES +
  A_ROLL_SECOND_SEGMENT_FRAMES +
  freeShippingFullTimeline.scenes
    .filter((scene) => A_ROLL_REMAINING_SCENE_IDS.has(scene.id))
    .reduce((sum, scene) => sum + scene.durationInFrames, 0);
