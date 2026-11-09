import { compileTimeline } from "../timeline/compiler.ts";
import type { Cue, CueFile, Storyboard } from "../timeline/types.ts";
import type { OpeningShotId } from "./openingShots.ts";
export type OpeningPlan = {
  fps: number;
  tailMs: number;
  endCue: string;
  shots: {
    id: string;
    shot: OpeningShotId;
    cue: string;
    cameraFrom?: OpeningShotId;
    cameraTo?: OpeningShotId;
  }[];
  markers: { id: string; sceneId: string; cueId: string; wordId: string }[];
};
export function compileOpening(
  plan: OpeningPlan,
  cues: Cue[],
  words: { id: string; startMs: number }[],
  provenance: { scriptHash: string; audioHash: string },
  durationMs: number,
) {
  const cue = (id: string) => {
    const found = cues.find((c) => c.id === id);
    if (!found) throw new Error(`Missing cue ${id}`);
    return found;
  };
  const end = cue(plan.endCue).startMs;
  if (Math.abs(end - durationMs) > 1000 / 48000)
    throw new Error("Opening audio must end at the next scene cue");
  const file: CueFile = {
    mode: "aligned",
    ...provenance,
    cues: cues.filter((c) => c.endMs <= durationMs),
  };
  const board: Storyboard = {
    fps: plan.fps,
    tailMs: plan.tailMs,
    demoDurationMs: durationMs,
    scenes: plan.shots.map((shot, i) => ({
      id: shot.id,
      template: "story",
      title: shot.shot,
      start: { cueId: shot.cue },
      end:
        i + 1 < plan.shots.length
          ? { cueId: plan.shots[i + 1].cue }
          : { cueId: shot.cue, edge: "end" },
    })),
    events: plan.markers.map((marker) => {
      const parent = cue(marker.cueId);
      const word = words.find((w) => w.id === marker.wordId);
      if (
        !word ||
        word.startMs < parent.startMs ||
        word.startMs >= parent.endMs
      )
        throw new Error(`Invalid word anchor ${marker.wordId}`);
      return {
        id: marker.id,
        sceneId: marker.sceneId,
        cueId: marker.cueId,
        offsetMs: word.startMs - parent.startMs,
        reason: `Word anchor ${marker.wordId}; source ASR timing retained`,
        durationMs: Math.min(200, parent.endMs - word.startMs),
        kind: "payoff",
        track: marker.id,
        payload: {},
      };
    }),
  };
  return compileTimeline(file, board, durationMs);
}
