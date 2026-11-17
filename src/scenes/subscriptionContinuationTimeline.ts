import cues from "../../videos/003-subscription-cancellation/continuation-cues.demo.json";
import { compileTimeline } from "../timeline/compiler";
import type { CueFile, Storyboard, StoryEvent } from "../timeline/types";

// Anchors are draft ASR timestamps; offsets need listening review.
const beats: [string, string, number?][] = [
  ["using", "continuation"], ["finished", "p003-s006"], ["ongoing", "p003-s007"],
  ["manage", "p004-s001"], ["mismatch", "p004-s002"], ["default", "p004-s003"],
  ["rental", "p004-s005"], ["subscription", "p004-s006"], ["effort", "p004-s007"],
  ["study", "p005-s001"], ["sample", "p005-s002"], ["replace", "p005-s003"],
  ["finding", "p005-s004"], ["uncertainty", "p005-s005"], ["reasons", "p005-s006"],
  ["model", "p006-s001"], ["automatic", "p006-s002"], ["choice", "p006-s003"], ["remember", "p006-s004"],
  ["retention", "p006-s006"], ["offers", "p007-s001"], ["benefits-reminder", "p007-s001", 1550], ["pause-offer", "p007-s001", 4200], ["extra-page", "p007-s002"],
  ["meeting", "p007-s002", 3200], ["unfinished", "p007-s003"], ["phone-research", "p008-s001"],
  ["phone-call", "p008-s001", 6000], ["typed-research", "p008-s001", 7400], ["research-scope", "p008-s002"], ["path-effort", "p008-s003"],
  ["constraint", "p008-s004"], ["hours", "p008-s005"], ["decision", "p009-s001"],
  ["outcomes", "p009-s001", 6500], ["complete", "p009-s001", 9600],
  ["postponed", "p009-s001", 13200], ["incentive", "p009-s001", 16400],
  ["offer-benefit", "p009-s001", 22600], ["offer-choice", "p010-s003"],
  ["clear-exit", "p010-s004"], ["dark-pattern", "p010-s005"], ["obscured", "p010-s006"],
  ["fair-confirmation", "p011-s001"], ["distinction", "p011-s002"], ["case", "p011-s003"], ["allegation", "p011-s004"],
  ["contested", "p011-s005"], ["older-route", "p012-s001"], ["settlement", "p012-s002"],
];
const anchor = ([, cueId, offsetMs]: [string, string, number?]) => ({ cueId, ...(offsetMs ? { offsetMs, reason: "Draft word timing within phrase" } : {}) });
const textBeats: [string, string, number, number, string, string][] = [
  ["manage", "p004-s001", 2500, 2200, "You have to finish.", "finish"],
  ["model", "p006-s001", 2800, 2200, "Estimates depend on assumptions.", "assumptions"],
  ["retention", "p006-s006", 3000, 2200, "The exit is smaller.", "exit"],
  ["meeting", "p007-s002", 7000, 2200, "Was it really canceled?", "canceled"],
  ["hours", "p008-s005", 1800, 2200, "Time is a constraint.", "constraint"],
  ["incentive", "p009-s001", 18800, 2200, "A delay can matter.", "delay"],
  ["offer-choice", "p010-s003", 2800, 2200, "An offer can help.", "help"],
  ["dark-pattern", "p010-s005", 3200, 2200, "Design can steer choices.", "steer"],
];
const events: StoryEvent[] = textBeats.map(([sceneId, cueId, offsetMs, durationMs, text, highlight]) => ({
  id: `text-${sceneId}`, sceneId, cueId, offsetMs, durationMs,
  reason: "Draft phrase timing for text cutaway", kind: "payoff", track: "cutaway", payload: { text, highlight },
}));
const caseActions: [string, string, string, number][] = [
  ["leave", "remember", "p006-s005", 0],
  ["screens", "older-route", "p012-s001", 3900],
  ["clicks", "older-route", "p012-s001", 5100],
  ["penalty", "settlement", "p012-s002", 3800],
  ["redress", "settlement", "p012-s002", 6000],
  ["scope", "settlement", "p012-s002", 10000],
];
events.push(...caseActions.map(([id, sceneId, cueId, offsetMs]) => ({
  id, sceneId, cueId, offsetMs, durationMs: 450, reason: "Draft word timing within phrase",
  kind: "show-expense" as const, track: id, payload: {},
})));
const board: Storyboard = {
  fps: 30, demoDurationMs: 240000, tailMs: 0, events,
  scenes: beats.map((beat, i) => ({
    id: beat[0], title: beat[0], template: "story", start: anchor(beat),
    end: i + 1 < beats.length ? anchor(beats[i + 1]) : { cueId: "p012-s002", edge: "end" },
  })),
};
export const continuationTimeline = compileTimeline(cues as CueFile, board);
