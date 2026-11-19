import type { CutawaySpec } from "../cutaways/types.ts";
import type { CueFile } from "../timeline/types.ts";
import type { TransitionId } from "../transitions/index.tsx";
import type { CursorWaypoint } from "./actors/cursorMath.ts";
import type { LayoutName } from "./core/geometry.ts";
import type { ContainerStyle, LookId } from "./core/looks.ts";
import type { MotionProfileId } from "./core/motionProfiles.ts";
import { compileDocumentarySfx } from "./sfxCompiler.ts";
import {
  compileDocumentaryTimeline,
  type DocumentarySceneSpec,
  type DocumentaryStoryboard,
} from "./timeline.ts";

export const pilotCues: CueFile = {
  mode: "timing-demo",
  scriptHash: "pilot-showcase-v1",
  cues: [
    { id: "p01", startMs: 0, endMs: 3000, text: "You start with one $42 item toward a $50 threshold." },
    { id: "p02", startMs: 3000, endMs: 6000, text: "Checkout frames the offer so an add-on wipes the fee." },
    { id: "p03", startMs: 6000, endMs: 9000, text: "That condition turns one purchase into two separate tasks." },
    { id: "p04", startMs: 9000, endMs: 12000, text: "One condition changes the whole cart." },
    { id: "p05", startMs: 12000, endMs: 15000, text: "Retailers weigh extra basket margin against shipping cost." },
    { id: "p06", startMs: 15000, endMs: 18000, text: "Compare the complete delivered total before deciding." },
  ],
};

type PilotRow = [
  id: string,
  title: string,
  cueId: string,
  layout: LayoutName,
  look: LookId,
  container: ContainerStyle,
  motionProfile: MotionProfileId,
  join: TransitionId,
  joinFrames?: number,
  stageCount?: number,
];

const PILOT_ROWS: PilotRow[] = [
  ["S01", "Threshold Gap on Editorial Paper", "p01", "asymmetric-35-65", "editorial-paper", "borderless", "tactile-spring", "hard-cut"],
  ["S02", "Checkout Interactive Split", "p02", "feature-right", "warm-studio", "card", "tactile-spring", "match-position", 16],
  ["S03", "Mechanism Two-Task Shift", "p03", "editorial-top-stage", "midnight-blueprint", "borderless", "editorial-crisp", "wipe", 12],
  ["S04", "Kinetic Punctuation Cutaway", "p04", "single", "editorial-paper", "borderless", "mechanical-snap", "hard-cut"],
  ["S05", "Policy Matrix Evidence", "p05", "editorial-top-stage", "evidence-desk", "sheet", "mechanical-snap", "slide-push", 12, 2],
  ["S06", "Split-Contrast Complete Total Takeaway", "p06", "presenter-split", "split-contrast", "borderless", "editorial-crisp", "split-open", 14],
];

const scenes: DocumentarySceneSpec[] = PILOT_ROWS.map(
  ([id, title, cueId, layout, look, container, motionProfile, join, joinFrames, stageCount]) => ({
    id,
    title,
    start: { cueId, edge: "start" },
    end: { cueId, edge: "end" },
    layout,
    look,
    container,
    motionProfile,
    // Storyboard metadata property (`transition`) is a scene-join ID, not CSS animation.
    /* eslint-disable @remotion/non-pure-animation */
    transition: join,
    /* eslint-enable @remotion/non-pure-animation */
    transitionFrames: joinFrames,
    stageCount,
  }),
);

export const pilotStoryboard: DocumentaryStoryboard = {
  fps: 30,
  demoDurationMs: 18000,
  tailMs: 0,
  timingStatus: "provisional-cue-fixture",
  scenes,
  beats: [],
};

export const compiledPilotTimeline = compileDocumentaryTimeline(
  pilotCues,
  pilotStoryboard,
);

export const DYNAMIC_SHOWCASE_PILOT_DURATION =
  compiledPilotTimeline.durationInFrames;

export const pilotWaypoints: CursorWaypoint[] = [
  { at: 12, x: 960, y: 660, action: "move" },
  { at: 36, x: 1220, y: 510, action: "click" },
  { at: 66, x: 1380, y: 420, action: "hover" },
];

export const pilotCutaway: CutawaySpec = {
  variant: "elastic-tag",
  text: "One condition changes the cart.",
  kicker: "MECHANISM",
  badgeText: "FREE THRESHOLD",
  boardTone: "warm-paper",
};

export const pilotSfxCues = compileDocumentarySfx({
  timeline: compiledPilotTimeline,
  cursorTracks: [{ sceneFrom: 90, waypoints: pilotWaypoints }],
  cutaways: [{ from: 270, spec: pilotCutaway }],
});
