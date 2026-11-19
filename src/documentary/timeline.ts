import type { SfxName } from "../audio/cues.ts";
import { compileTimeline, msToFrames } from "../timeline/compiler.ts";
import type {
  Anchor,
  CompiledEvent,
  CompiledScene,
  CueFile,
  Storyboard,
  StoryEvent,
} from "../timeline/types.ts";
import type { TransitionId } from "../transitions/index.tsx";
import type { ContinuityToken } from "./core/continuity.ts";
import type { LayoutName, Rect } from "./core/geometry.ts";
import type { ContainerStyle, LookId } from "./core/looks.ts";
import type { MotionProfileId } from "./core/motionProfiles.ts";
import type { TextFitCheckInput } from "./core/textMetrics.ts";

export type TimingStatus =
  | "provisional-cue-fixture"
  | "measured-draft-asr"
  | "listening-approved";

export type WordTiming = {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
};

export type SfxCueAttachment = {
  name: SfxName;
  volume?: number;
  offsetFrames?: number;
};

export type DocumentaryBeatSpec = {
  id: string;
  sceneId: string;
  cueId: string;
  wordId?: string;
  wordEdge?: "start" | "end";
  offsetMs?: number;
  durationMs: number;
  reason?: string;
  kind?: StoryEvent["kind"];
  track?: string;
  allowOverlap?: boolean;
  layerId?: string;
  sfx?: SfxCueAttachment;
  payload?: Record<string, string | number | undefined>;
};

export type DocumentaryLayerBound = {
  id: string;
  rect: Rect;
  essential?: boolean;
};

export type DocumentarySceneSpec = {
  id: string;
  title: string;
  start: Anchor;
  end: Anchor;
  layout: LayoutName;
  look?: LookId;
  container?: ContainerStyle;
  shotScale?: "wide" | "medium" | "closeup" | "cutaway" | "a-roll";
  motionProfile?: MotionProfileId;
  stageCount?: number;
  sfx?: SfxCueAttachment;
  transition?: TransitionId;
  transitionFrames?: number;
  dominantObject?: string;
  mediums?: string[];
  assetIds?: string[];
  continuityTokens?: ContinuityToken[];
  textBounds?: TextFitCheckInput[];
  layerBounds?: DocumentaryLayerBound[];
  learningGoal?: string;
  notes?: string;
};

export type DocumentaryStoryboard = {
  fps: 30;
  demoDurationMs: number;
  tailMs: number;
  timingStatus: TimingStatus;
  scenes: DocumentarySceneSpec[];
  beats: DocumentaryBeatSpec[];
};

export type CompiledDocumentaryBeat = DocumentaryBeatSpec & {
  startMs: number;
  endMs: number;
  from: number;
  durationInFrames: number;
  localFrom: number;
  localUntil: number;
};

export type CompiledDocumentaryScene = DocumentarySceneSpec &
  Pick<CompiledScene, "startMs" | "endMs" | "from" | "durationInFrames"> & {
    until: number;
    beats: CompiledDocumentaryBeat[];
  };

export type CompiledDocumentaryTimeline = {
  fps: number;
  durationMs: number;
  durationInFrames: number;
  mode: CueFile["mode"];
  timingStatus: TimingStatus;
  scenes: CompiledDocumentaryScene[];
  beats: CompiledDocumentaryBeat[];
};

/**
 * Compiles a documentary storyboard using the repository's shared timeline compiler
 * (`src/timeline/compiler.ts`), preserving millisecond cue resolution, `Math.round(ms*30/1000)`
 * endpoints, single-rounded total duration, and non-overlapping track checks.
 */
export function compileDocumentaryTimeline(
  cueFile: CueFile,
  board: DocumentaryStoryboard,
  audioDurationMs?: number,
  words?: readonly WordTiming[],
): CompiledDocumentaryTimeline {
  if (
    board.timingStatus === "listening-approved" &&
    cueFile.mode !== "aligned"
  ) {
    throw new Error(
      "Documentary timeline: provisional timing-demo cues cannot be marked listening-approved",
    );
  }

  const cueMap = new Map(cueFile.cues.map((c) => [c.id, c]));
  const wordMap = words ? new Map(words.map((w) => [w.id, w])) : null;

  const baseBoard: Storyboard = {
    fps: board.fps,
    demoDurationMs: board.demoDurationMs,
    tailMs: board.tailMs,
    scenes: board.scenes.map((scene) => ({
      id: scene.id,
      template: "documentary",
      start: scene.start,
      end: scene.end,
      title: scene.title,
    })),
    events: board.beats.map((beat) => {
      let resolvedOffsetMs = beat.offsetMs ?? 0;
      let resolvedReason = beat.reason;

      if (beat.wordId) {
        const cue = cueMap.get(beat.cueId);
        if (!cue) {
          throw new Error(`Missing cue "${beat.cueId}" in beat ${beat.id}`);
        }
        if (!wordMap) {
          throw new Error(
            `Word timings are required to resolve wordId "${beat.wordId}" in beat ${beat.id}`,
          );
        }
        const word = wordMap.get(beat.wordId);
        if (!word) {
          throw new Error(
            `Missing wordId "${beat.wordId}" in beat ${beat.id}`,
          );
        }
        if (word.startMs < cue.startMs || word.endMs > cue.endMs) {
          throw new Error(
            `Word "${beat.wordId}" (${word.startMs}..${word.endMs}ms) falls outside cue "${cue.id}" (${cue.startMs}..${cue.endMs}ms) in beat ${beat.id}`,
          );
        }
        const edgeMs = beat.wordEdge === "end" ? word.endMs : word.startMs;
        resolvedOffsetMs = edgeMs - cue.startMs + (beat.offsetMs ?? 0);
        if (!resolvedReason?.trim()) {
          resolvedReason = `Word anchor ${beat.wordId} (${beat.wordEdge ?? "start"})`;
        }
      }

      return {
        id: beat.id,
        sceneId: beat.sceneId,
        cueId: beat.cueId,
        offsetMs: resolvedOffsetMs,
        durationMs: beat.durationMs,
        reason: resolvedReason,
        kind: beat.kind ?? "show-expense",
        track: beat.track ?? "visual",
        allowOverlap: beat.allowOverlap ?? true,
        payload: Object.fromEntries(
          Object.entries(beat.payload ?? {}).filter(([, v]) => v !== undefined),
        ) as Record<string, string | number>,
      };
    }),
  };

  const compiled = compileTimeline(cueFile, baseBoard, audioDurationMs);
  const compiledById = new Map<string, CompiledScene>(
    compiled.scenes.map((s) => [s.id, s]),
  );
  const eventsById = new Map<string, CompiledEvent>(
    compiled.events.map((e) => [e.id, e]),
  );

  const beats: CompiledDocumentaryBeat[] = board.beats.map((beat) => {
    const ev = eventsById.get(beat.id)!;
    const parent = compiledById.get(beat.sceneId)!;
    return {
      ...beat,
      startMs: ev.startMs,
      endMs: ev.endMs,
      from: ev.from,
      durationInFrames: ev.durationInFrames,
      localFrom: ev.from - parent.from,
      localUntil: ev.from - parent.from + ev.durationInFrames,
    };
  });

  const scenes: CompiledDocumentaryScene[] = board.scenes.map((scene) => {
    const cs = compiledById.get(scene.id)!;
    return {
      ...scene,
      startMs: cs.startMs,
      endMs: cs.endMs,
      from: cs.from,
      until: cs.from + cs.durationInFrames,
      durationInFrames: cs.durationInFrames,
      beats: beats.filter((b) => b.sceneId === scene.id),
    };
  });

  return {
    fps: compiled.fps,
    durationMs: compiled.durationMs,
    durationInFrames: compiled.durationInFrames,
    mode: compiled.mode,
    timingStatus: board.timingStatus,
    scenes,
    beats,
  };
}

export { msToFrames };
