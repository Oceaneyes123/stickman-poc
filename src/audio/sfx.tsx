/**
 * Playback layer for the sound-effect library in public/sfx.
 *
 *   <Sfx name="coin_clink" from={42} />
 *   <SfxTrack cues={[[42, "coin_clink", 0.9], [60, "ding"]]} />
 *
 * Place a cue on the frame of the visual event it belongs to, never on a
 * narration timestamp. Volume defaults come from the catalogue; pass one to
 * override it for a louder or quieter cut.
 */
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { SFX_CUES, type SfxName } from "./cues";

export { SFX_CUES, SFX_GROUPS, SFX_NAMES, sfxCuesIn } from "./cues";
export type { SfxCategory, SfxCueMeta, SfxName } from "./cues";

export const sfxSrc = (name: SfxName) => staticFile(`sfx/${name}.wav`);

/** [frame in the current sequence, cue name, volume override] */
export type PlacedSfx = [frame: number, name: SfxName, volume?: number];

export const Sfx = ({
  name,
  from = 0,
  volume,
  durationInFrames,
}: {
  name: SfxName;
  from?: number;
  volume?: number;
  /** cut the tail, in frames, when the next beat needs the space */
  durationInFrames?: number;
}) => (
  <Audio
    src={sfxSrc(name)}
    from={from}
    volume={volume ?? SFX_CUES[name].volume}
    durationInFrames={durationInFrames}
  />
);

export const SfxTrack = ({ cues }: { cues: PlacedSfx[] }) => (
  <>
    {cues.map(([frame, name, volume], i) => (
      <Sfx key={`${frame}-${name}-${i}`} name={name} from={frame} volume={volume} />
    ))}
  </>
);

/** Same cue repeated on a rhythm: ticking counters, coin sequences, stomps. */
export const sfxEvery = (
  from: number,
  count: number,
  step: number,
  name: SfxName,
  volume?: number,
): PlacedSfx[] =>
  Array.from({ length: count }, (_, i) => [from + i * step, name, volume] as PlacedSfx);
