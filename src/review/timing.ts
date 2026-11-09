import type { Cue } from "../timeline/types.ts";
import { msToFrames } from "../timeline/compiler.ts";

export type ReviewProps = { durationMs: number; cues: Cue[] };

export function reviewCues(cues: Cue[], durationMs: number): Cue[] {
  if (!Number.isFinite(durationMs) || durationMs <= 0)
    throw new Error("Invalid review duration");
  let end = 0;
  const ids = new Set<string>();
  for (const cue of cues) {
    if (
      !cue.id ||
      ids.has(cue.id) ||
      typeof cue.text !== "string" ||
      !cue.text.trim() ||
      !Number.isFinite(cue.startMs) ||
      !Number.isFinite(cue.endMs) ||
      cue.startMs < end ||
      cue.endMs <= cue.startMs
    )
      throw new Error(`Invalid review cue: ${cue.id}`);
    ids.add(cue.id);
    end = cue.endMs;
  }
  return cues
    .filter((cue) => cue.startMs < durationMs)
    .map((cue) => {
      const clipped = { ...cue, endMs: Math.min(cue.endMs, durationMs) };
      if (msToFrames(clipped.endMs, 30) <= msToFrames(clipped.startMs, 30))
        throw new Error(`Review cue is shorter than one frame: ${cue.id}`);
      return clipped;
    });
}

export const cueAtFrame = (cues: Cue[], frame: number) =>
  cues.find(
    (cue) =>
      frame >= msToFrames(cue.startMs, 30) && frame < msToFrames(cue.endMs, 30),
  );
