import { SFX_CUES, type PlacedSfx, type SfxName } from "../audio/cues.ts";
import type { CutawaySpec } from "../cutaways/types.ts";
import type { TransitionId } from "../transitions/index.tsx";
import { collectCursorSfx, type CursorWaypoint } from "./actors/cursorMath.ts";
import { MOTION_PROFILES } from "./core/motionProfiles.ts";
import type { CompiledDocumentaryTimeline } from "./timeline.ts";

export const TRANSITION_DEFAULT_SFX: Partial<
  Record<TransitionId, [SfxName, number]>
> = {
  wipe: ["whoosh_short", 0.18],
  "slide-push": ["whoosh_short", 0.18],
  "object-wipe": ["whoosh_short", 0.18],
  "push-in": ["whoosh_rise", 0.16],
  "pull-back": ["whoosh_rise", 0.16],
  "pan-follow": ["whoosh_rise", 0.16],
  "calendar-flip": ["bill_flutter", 0.16],
  "smash-cut": ["impact_boom", 0.2],
  "split-open": ["swish", 0.16],
  doorway: ["swish", 0.16],
  iris: ["whoosh_long", 0.17],
  "object-becomes-scene": ["whoosh_long", 0.17],
};

export function compileDocumentarySfx(params: {
  timeline: CompiledDocumentaryTimeline;
  cursorTracks?: readonly {
    sceneFrom: number;
    waypoints: readonly CursorWaypoint[];
    gain?: number;
  }[];
  cutaways?: readonly { from: number; spec: CutawaySpec; gain?: number }[];
  autoTransitionSfx?: boolean;
  autoBeatSfx?: boolean;
  overrides?: readonly PlacedSfx[];
  dedupeWindowFrames?: number;
  maxVolume?: number;
}): PlacedSfx[] {
  const maxFrame = Math.max(0, params.timeline.durationInFrames - 1);
  const maxVol = params.maxVolume ?? 0.35;
  const dedupeWindow = Math.max(0, params.dedupeWindowFrames ?? 3);
  const raw: PlacedSfx[] = [];
  const sceneById = new Map(params.timeline.scenes.map((s) => [s.id, s]));

  const push = (frame: number, name: SfxName, volume?: number) => {
    const clampedFrame = Math.max(0, Math.min(maxFrame, Math.round(frame)));
    const baseVol = volume ?? SFX_CUES[name].volume * 0.25;
    const clampedVol =
      Math.round(Math.min(maxVol, Math.max(0.01, baseVol)) * 1000) / 1000;
    raw.push([clampedFrame, name, clampedVol]);
  };

  for (let i = 0; i < params.timeline.scenes.length; i++) {
    const scene = params.timeline.scenes[i];
    if (scene.sfx) {
      push(
        scene.from + (scene.sfx.offsetFrames ?? 0),
        scene.sfx.name,
        scene.sfx.volume,
      );
    } else if (
      params.autoTransitionSfx !== false &&
      i > 0 &&
      scene.transition
    ) {
      const def = TRANSITION_DEFAULT_SFX[scene.transition];
      if (def) {
        push(scene.from, def[0], def[1]);
      }
    }
  }

  for (const beat of params.timeline.beats) {
    if (beat.sfx) {
      push(
        beat.from + (beat.sfx.offsetFrames ?? 0),
        beat.sfx.name,
        beat.sfx.volume,
      );
    } else if (params.autoBeatSfx) {
      const parent = sceneById.get(beat.sceneId);
      const profile = parent?.motionProfile ?? "editorial-crisp";
      const defSfx = MOTION_PROFILES[profile].defaultSfx;
      if (defSfx) {
        push(beat.from, defSfx, 0.16);
      }
    }
  }

  for (const track of params.cursorTracks ?? []) {
    for (const [f, name, vol] of collectCursorSfx(
      track.waypoints,
      track.sceneFrom,
      track.gain ?? 0.2,
    )) {
      push(f, name, vol);
    }
  }

  for (const c of params.cutaways ?? []) {
    if (c.spec.sfx === false) continue;
    const name: SfxName =
      typeof c.spec.sfx === "string" ? c.spec.sfx : "whoosh_short";
    push(c.from, name, c.gain ?? 0.18);
  }

  for (const [f, name, vol] of params.overrides ?? []) {
    push(f, name, vol);
  }

  raw.sort((a, b) => a[0] - b[0] || a[1].localeCompare(b[1]));

  const deduped: PlacedSfx[] = [];
  const lastFrameByName = new Map<SfxName, number>();
  for (const cue of raw) {
    const prev = lastFrameByName.get(cue[1]);
    if (prev !== undefined && cue[0] - prev <= dedupeWindow) {
      continue;
    }
    lastFrameByName.set(cue[1], cue[0]);
    deduped.push(cue);
  }

  return deduped;
}
