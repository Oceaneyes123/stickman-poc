import cues from "../../videos/003-subscription-cancellation/opening-cues.demo.json";
import { compileTimeline } from "../timeline/compiler";
import type { CueFile, Storyboard, StoryEvent } from "../timeline/types";

// Draft ASR timing is for preview only; replace after phrase listening review.
const starts = ["p001-s001", "p001-s003", "p001-s005", "p001-s006", "p001-s007", "p002-s001", "p002-s003", "p002-s005", "p003-s002"];
// Offsets follow the draft word timestamps and require listening review.
const actions: [string, number, string, number][] = [
  ["trial", 0, "p001-s002", 400],
  ["start", 0, "p001-s002", 4650],
  ["account", 1, "p001-s004", 1000],
  ["cancel", 1, "p001-s004", 2700],
  ["uncertain", 5, "p002-s001", 3300],
  ["renewal", 6, "p002-s003", 3700],
  ["convenient-return", 6, "p002-s004", 2550],
  ["rent-pay", 7, "p002-s005", 1400],
  ["rent-watch", 7, "p002-s005", 2040],
  ["rent-end", 7, "p002-s005", 3300],
  ["rent-again", 7, "p003-s001", 0],
  ["music", 8, "p003-s003", 0],
  ["next-renewal", 8, "p003-s003", 1260],
  ["no-checkout", 8, "p003-s004", 2300],
];
const events: StoryEvent[] = actions.map(([id, scene, cueId, offsetMs]) => ({
  id, sceneId: `opening-${scene + 1}`, cueId, offsetMs, durationMs: 450,
  reason: offsetMs ? "Draft word timing within spoken phrase" : undefined,
  kind: "show-expense", track: id, payload: {},
}));
const cutaways: [string, number, string, number, number, string, string][] = [
  ["getting-started", 0, "p001-s002", 2450, 2200, "Getting started was easy.", "easy"],
  ["canceled-already", 5, "p002-s001", 1050, 2200, "Canceled already?", "Canceled"],
  ["convenience", 6, "p002-s004", 100, 2200, "What made it convenient?", "convenient"],
];
events.push(...cutaways.map(([id, scene, cueId, offsetMs, durationMs, text, highlight]) => ({
  id, sceneId: `opening-${scene + 1}`, cueId, offsetMs, durationMs,
  reason: "Draft phrase timing for text cutaway", kind: "payoff" as const,
  track: "cutaway", payload: { text, highlight },
})));
const board: Storyboard = {
  fps: 30, demoDurationMs: 60000, tailMs: 0, events,
  scenes: starts.map((cueId, i) => ({
    id: `opening-${i + 1}`, title: `Opening ${i + 1}`, template: "story",
    start: { cueId },
    end: i + 1 < starts.length ? { cueId: starts[i + 1] } : { cueId: "p003-s004", edge: "end" },
  })),
};
export const openingTimeline = compileTimeline(cues as CueFile, board);
