import cues from "../../videos/003-subscription-cancellation/ending-cues.demo.json";
import closing from "../../videos/003-subscription-cancellation/closing-cue.demo.json";
import { compileTimeline, msToFrames } from "../timeline/compiler";
import type { CueFile, Storyboard, StoryEvent } from "../timeline/types";

export const ENDING_START_MS = 299200;
export const ENDING_START_FRAME = msToFrames(ENDING_START_MS, 30);
export const ENDING_TAIL_MS = 2000;
export const FILM_DURATION_FRAMES = msToFrames(closing.audioDurationMs + ENDING_TAIL_MS, 30);
const beats: [string, string][] = [
  ["settlement-scope", "remainder-start"], ["historical", "p012-s004"],
  ["exit-matters", "p013-s001"], ["many-customers", "p013-s002"],
  ["commitment", "p013-s003"], ["billing", "p013-s004"],
  ["term-difference", "p013-s005"], ["early-exit", "p013-s006"],
  ["tradeoff", "p014-s001"], ["visible-terms", "p014-s002"],
  ["check-details", "p014-s003"], ["purchase-route", "p014-s004"],
  ["confirmation", "p015-s001"], ["warning", "p015-s002"],
  ["discount", "p015-s003"], ["save-record", "p015-s004"],
  ["opening-callback", "p015-s005"], ["access", "p015-s006"],
  ["finished-renewal", "p016-s001"], ["exit-effort", "p016-s002"],
  ["why-hard", "p016-s003"], ["default-obstacles", "p016-s004"],
  ["choice", "p016-s005"], ["completed", "p016-s006"], ["call-to-action", "closing-cta"],
];
const texts: [string, string, number, string, string][] = [
  ["term-difference", "p013-s005", 700, "Billing is not commitment.", "not"],
  ["early-exit", "p013-s006", 600, "Early-exit terms vary.", "vary"],
  ["save-record", "p015-s004", 1300, "Keep a record.", "record"],
  ["completed", "p016-s006", 900, "Make the choice effective.", "effective"],
];
const events: StoryEvent[] = texts.map(([sceneId, cueId, offsetMs, text, highlight]) => ({
  id: `ending-text-${sceneId}`, sceneId, cueId, offsetMs, durationMs: 2200,
  reason: "Draft phrase timing for text cutaway", kind: "payoff", track: "cutaway", payload: {text, highlight},
}));
const lastCue = closing.cue;
events.push({
  id: "end-card", sceneId: "call-to-action", cueId: lastCue.id,
  offsetMs: closing.audioDurationMs - ENDING_START_MS - lastCue.startMs,
  durationMs: ENDING_TAIL_MS, reason: "Begin end card after measured WAV end",
  kind: "payoff", track: "end-card", payload: {},
});
const board: Storyboard = {
  fps: 30, demoDurationMs: closing.audioDurationMs - ENDING_START_MS,
  tailMs: ENDING_TAIL_MS, events,
  scenes: beats.map(([id, cueId], index) => ({
    id, title:id, template:"story", start:{cueId},
    end: index+1<beats.length ? {cueId:beats[index+1][1]} : {cueId:"closing-cta", edge:"end"},
  })),
};
export const endingTimeline = compileTimeline({...cues, cues:[...cues.cues, closing.cue]} as CueFile, board);
