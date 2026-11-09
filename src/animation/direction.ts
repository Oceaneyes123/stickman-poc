import { compileTimeline } from "../timeline/compiler.ts";
import type { Cue, CueFile, Storyboard, Timeline } from "../timeline/types.ts";
import { ease } from "../characters/jointConstraints.ts";
import type { ReferenceExpression } from "../characters/referenceModel.ts";

export type Rect = readonly [number, number, number, number];
export type DirectionBeat = {
  id: string;
  sceneId: string;
  cueId: string;
  wordId?: string;
  offsetFrames?: number;
  durationFrames: number;
  holdFrames?: number;
  track: string;
  targets: string[];
  action: string;
  character?: "Sam" | "Alex";
  expression?: ReferenceExpression;
  camera?: {
    kind: "wide" | "medium" | "close" | "push" | "pullback" | "match-cut";
    from: Rect;
    to: Rect;
  };
  prop?: {
    id: string;
    interaction:
      | "look"
      | "reach"
      | "attach"
      | "lift"
      | "place"
      | "release"
      | "open"
      | "file";
  };
  financial?: string;
  next?: "hold" | "cut" | "match-cut";
};
export type ReferenceDirection = {
  id: string;
  title: string;
  startCue: string;
  endCue: string;
  objects: string[];
  scenes: { id: string; cueId: string }[];
  beats: DirectionBeat[];
};
export type CompiledBeat = DirectionBeat & {
  startFrame: number;
  endFrame: number;
  sourceStartMs: number;
};
export type DirectedSequence = {
  id: string;
  title: string;
  sourceStartMs: number;
  sourceEndMs: number;
  timeline: Timeline;
  beats: CompiledBeat[];
};
export function validateCamera(rect: readonly number[]) {
  if (
    rect.length !== 4 ||
    !rect.every(Number.isFinite) ||
    rect[0] < 0 ||
    rect[1] < 0 ||
    rect[2] <= 0 ||
    rect[3] <= 0 ||
    rect[0] + rect[2] > 1920.001 ||
    rect[1] + rect[3] > 1080.001 ||
    Math.abs(rect[2] / rect[3] - 16 / 9) > 1e-6
  )
    throw new Error("Camera must be a bounded 16:9 viewport");
}
export function compileDirection(
  spec: ReferenceDirection,
  cues: Cue[],
  words: { id: string; startMs: number }[],
  provenance: { scriptHash: string; audioHash: string },
  durationMs: number,
): DirectedSequence {
  const find = (id: string) => {
    const cue = cues.find((c) => c.id === id);
    if (!cue) throw new Error(`Missing cue ${id}`);
    return cue;
  };
  const start = find(spec.startCue).startMs,
    end = find(spec.endCue).startMs;
  if (Math.abs(end - start - durationMs) > 1000 / 48000)
    throw new Error("Direction duration does not match measured audio excerpt");
  const selected = cues.filter((c) => c.startMs >= start && c.endMs <= end);
  const file: CueFile = {
    mode: "aligned",
    ...provenance,
    cues: selected.map((c) => ({
      ...c,
      startMs: c.startMs - start,
      endMs: c.endMs - start,
    })),
  };
  const board: Storyboard = {
    fps: 30,
    tailMs: 0,
    demoDurationMs: durationMs,
    scenes: spec.scenes.map((scene, i) => ({
      id: scene.id,
      template: "story",
      title: spec.title,
      start: { cueId: scene.cueId },
      end:
        i + 1 < spec.scenes.length
          ? { cueId: spec.scenes[i + 1].cueId }
          : { cueId: selected.at(-1)!.id, edge: "end" },
    })),
    events: spec.beats.map((beat) => {
      if (
        !beat.targets.length ||
        beat.targets.some((target) => !spec.objects.includes(target))
      )
        throw new Error(`Unknown target in beat ${beat.id}`);
      if (
        !Number.isInteger(beat.durationFrames) ||
        beat.durationFrames <= 0 ||
        !Number.isInteger(beat.holdFrames ?? 0) ||
        (beat.holdFrames ?? 0) < 0 ||
        !Number.isInteger(beat.offsetFrames ?? 0)
      )
        throw new Error(`Invalid beat timing ${beat.id}`);
      if (beat.prop && !beat.targets.includes(beat.prop.id))
        throw new Error(`Prop target absent in ${beat.id}`);
      if (beat.camera) {
        validateCamera(beat.camera.from);
        validateCamera(beat.camera.to);
      }
      const cue = find(beat.cueId),
        word = beat.wordId
          ? words.find((w) => w.id === beat.wordId)
          : undefined;
      if (
        beat.wordId &&
        (!word || word.startMs < cue.startMs || word.startMs >= cue.endMs)
      )
        throw new Error(`Word outside narration cue in ${beat.id}`);
      const offsetMs =
        (word ? word.startMs - cue.startMs : 0) +
        ((beat.offsetFrames ?? 0) * 1000) / 30;
      return {
        id: beat.id,
        sceneId: beat.sceneId,
        cueId: beat.cueId,
        offsetMs,
        durationMs: (beat.durationFrames * 1000) / 30,
        reason: `Direction beat${beat.wordId ? ` at ${beat.wordId}` : ""}; authored frame offset ${beat.offsetFrames ?? 0}`,
        kind: "payoff",
        track: beat.track,
        payload: { action: beat.action },
      };
    }),
  };
  const timeline = compileTimeline(file, board, durationMs);
  const beats = spec.beats.map((beat) => {
    const event = timeline.events.find((event) => event.id === beat.id)!;
    const scene = timeline.scenes.find((scene) => scene.id === beat.sceneId)!;
    if (
      event.from + event.durationInFrames + (beat.holdFrames ?? 0) >
      scene.from + scene.durationInFrames
    )
      throw new Error(`Beat hold exceeds scene ${beat.id}`);
    return {
      ...beat,
      startFrame: event.from,
      endFrame: event.from + event.durationInFrames,
      sourceStartMs: event.startMs + start,
    };
  });
  for (const beat of beats)
    for (const next of beats) {
      if (beat.id === next.id || beat.track !== next.track) continue;
      if (
        beat.startFrame < next.startFrame &&
        beat.endFrame + (beat.holdFrames ?? 0) > next.startFrame
      )
        throw new Error(`Beat hold overlaps ${beat.id}/${next.id}`);
    }
  return {
    id: spec.id,
    title: spec.title,
    sourceStartMs: start,
    sourceEndMs: end,
    timeline,
    beats,
  };
}
export const beat = (sequence: DirectedSequence, id: string) => {
  const found = sequence.beats.find((beat) => beat.id === id);
  if (!found) throw new Error(`Missing directed beat ${id}`);
  return found;
};
export const beatProgress = (
  sequence: DirectedSequence,
  id: string,
  frame: number,
) => {
  const value = beat(sequence, id);
  return ease((frame - value.startFrame) / (value.endFrame - value.startFrame));
};
export const began = (sequence: DirectedSequence, id: string, frame: number) =>
  frame >= beat(sequence, id).startFrame;
export function cameraAt(sequence: DirectedSequence, frame: number): Rect {
  let rect: Rect = [0, 0, 1920, 1080];
  for (const value of sequence.beats
    .filter((beat) => beat.camera)
    .sort((a, b) => a.startFrame - b.startFrame)) {
    if (frame < value.startFrame) break;
    const camera = value.camera!;
    const p = beatProgress(sequence, value.id, frame);
    rect = camera.from.map(
      (n, i) => n + (camera.to[i] - n) * p,
    ) as unknown as Rect;
  }
  return rect;
}
