import cues from "../../videos/004-free-shipping/opening-cues.demo.json" with { type: "json" };
import { calculateFreeShippingOrder, freeShippingExample } from "../finance/math.ts";
import { compileTimeline } from "../timeline/compiler.ts";
import type { CueFile, SceneSpec, Storyboard, StoryEvent } from "../timeline/types.ts";

export { freeShippingExample };
export const freeShippingOrder = calculateFreeShippingOrder();

// A-roll frame budget: Scene 1 (84 frames / 2.8s) + Scene 6 (144 frames / 4.8s) = 228 / 1,800 (12.67%)
export const A_ROLL_FIRST_SEGMENT_FRAMES = 84;
export const A_ROLL_SECOND_SEGMENT_FRAMES = 144;
export const A_ROLL_FRAMES =
  A_ROLL_FIRST_SEGMENT_FRAMES + A_ROLL_SECOND_SEGMENT_FRAMES;

const sceneSpecs: SceneSpec[] = [
  {
    id: "opening-1",
    title: "Ready to pay for the charger",
    template: "story",
    start: { cueId: "p001-s001" },
    end: { cueId: "p001-s003" },
  },
  {
    id: "opening-2",
    title: "Delivery fee appears",
    template: "story",
    start: { cueId: "p001-s003" },
    end: { cueId: "p001-s004" },
  },
  {
    id: "opening-3",
    title: "Threshold offer and unmet gap",
    template: "story",
    start: { cueId: "p001-s004" },
    end: { cueId: "p001-s005" },
  },
  {
    id: "opening-4",
    title: "Browsing and adding organizer",
    template: "story",
    start: { cueId: "p001-s005" },
    end: { cueId: "p001-s006" },
  },
  {
    id: "opening-5",
    title: "Higher total with another product",
    template: "comparison",
    start: { cueId: "p001-s006" },
    end: { cueId: "p002-s002" },
  },
  {
    id: "opening-6",
    title: "Conditional rule and qualification",
    template: "diagram",
    start: { cueId: "p002-s002" },
    end: { cueId: "p002-s005" },
  },
  {
    id: "opening-7",
    title: "What fills the gap?",
    template: "diagram",
    start: { cueId: "p002-s005" },
    end: { cueId: "p002-s006" },
  },
  {
    id: "opening-8",
    title: "Zero versus ordinary low price",
    template: "diagram",
    start: { cueId: "p002-s006" },
    end: { cueId: "p003-s002" },
  },
  {
    id: "opening-9",
    title: "Chocolate experiment setup",
    template: "documentary",
    start: { cueId: "p003-s002" },
    end: { cueId: "p003-s002", edge: "end" },
  },
];

// Offsets follow draft ASR word timestamps and require listening review.
const actions: [string, string, string, number, number, string | undefined][] = [
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
];

const events: StoryEvent[] = actions.map(
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

export const freeShippingOpeningBoard: Storyboard = {
  fps: 30,
  demoDurationMs: 60000,
  tailMs: 0,
  scenes: sceneSpecs,
  events,
};

export const freeShippingOpeningTimeline = compileTimeline(
  cues as CueFile,
  freeShippingOpeningBoard,
);
