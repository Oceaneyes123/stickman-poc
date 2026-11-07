import type { Anchor, CueFile, Storyboard, Timeline } from "./types.ts";
import {
  validateTimelineInput,
  validateCompiledTimeline,
} from "./validation.ts";
export const msToFrames = (ms: number, fps: number) =>
  Math.round((ms * fps) / 1000);
export function compileTimeline(
  cueFile: CueFile,
  board: Storyboard,
  audioDurationMs?: number,
): Timeline {
  validateTimelineInput(cueFile, board, audioDurationMs);
  const cues = new Map(cueFile.cues.map((cue) => [cue.id, cue]));
  const resolve = (anchor: Anchor) => {
    const cue = cues.get(anchor.cueId)!;
    return (
      (anchor.edge === "end" ? cue.endMs : cue.startMs) + (anchor.offsetMs ?? 0)
    );
  };
  const frames = (startMs: number, endMs: number) => ({
    startMs,
    endMs,
    from: msToFrames(startMs, board.fps),
    durationInFrames:
      msToFrames(endMs, board.fps) - msToFrames(startMs, board.fps),
  });
  const durationMs =
    (cueFile.mode === "aligned" ? audioDurationMs! : board.demoDurationMs) +
    board.tailMs;
  const timeline: Timeline = {
    fps: board.fps,
    durationMs,
    durationInFrames: msToFrames(durationMs, board.fps),
    mode: cueFile.mode,
    scenes: board.scenes.map((scene) => ({
      ...scene,
      ...frames(resolve(scene.start), resolve(scene.end)),
    })),
    events: board.events.map((event) => {
      const start = cues.get(event.cueId)!.startMs + event.offsetMs;
      return { ...event, ...frames(start, start + event.durationMs) };
    }),
  };
  // The last shot holds through the WAV end and the explicitly declared visual tail.
  const last = timeline.scenes[timeline.scenes.length - 1];
  if (last.endMs < durationMs)
    Object.assign(last, frames(last.startMs, durationMs));
  validateCompiledTimeline(timeline);
  return timeline;
}
