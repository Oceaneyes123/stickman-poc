/**
 * Auditions the whole sound-effect library: one cue per panel, in catalogue
 * order, each labelled with its group, its length and its default mix level.
 * Registered as `SfxGallery`; `SFX_GALLERY_DURATION` is the composition length.
 */
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, font } from "../design/tokens";
import { NarrativeScene } from "../scenes/narrative";
import { SFX_CUES, SFX_GROUPS, sfxCuesIn, type SfxName } from "./cues";
import { Sfx } from "./sfx";

const GAP = 26; // frames of air after each cue's tail, so nothing bleeds together

const plan = SFX_GROUPS.flatMap((group) =>
  sfxCuesIn(group.id).map((name) => ({ name, group: group.label })),
);

const cueFrames = (name: SfxName) => Math.ceil(SFX_CUES[name].seconds * 30);
const starts = plan.reduce<number[]>((acc, entry, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + cueFrames(plan[i - 1].name) + GAP);
  return acc;
}, []);

export const SFX_GALLERY_DURATION =
  starts[starts.length - 1] + cueFrames(plan[plan.length - 1].name) + GAP;

const Panel = ({ name, group, index }: { name: SfxName; group: string; index: number }) => {
  const frame = useCurrentFrame();
  const meta = SFX_CUES[name];
  const played = Math.min(1, frame / Math.max(1, cueFrames(name) - 1));
  const barWidth = 720;

  return (
    <>
      <Sfx name={name} from={0} />
      <AbsoluteFill style={{ padding: 96, fontFamily: font }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: C.teal,
            fontWeight: 700,
          }}
        >
          <span>{group}</span>
          <span style={{ color: C.muted }}>
            {index + 1} / {plan.length}
          </span>
        </div>
        <div style={{ marginTop: 40, fontSize: 108, fontWeight: 800, color: C.navy, letterSpacing: -1 }}>
          {name}
        </div>
        <div style={{ marginTop: 18, fontSize: 38, color: C.line, maxWidth: 1400 }}>
          {meta.use}
        </div>
        <div style={{ marginTop: 22, fontSize: 28, color: C.muted }}>
          {meta.seconds.toFixed(2)}s · default level {meta.volume.toFixed(2)}
        </div>
        <div style={{ marginTop: 64, width: barWidth, height: 10, background: "#DCD8CC", borderRadius: 5 }}>
          <div
            style={{
              width: barWidth * played,
              height: "100%",
              borderRadius: 5,
              background: C.navy,
            }}
          />
        </div>
      </AbsoluteFill>
    </>
  );
};

export function SfxGallery() {
  return (
    <NarrativeScene>
      {plan.map((entry, i) => (
        <Sequence
          key={entry.name}
          from={starts[i]}
          durationInFrames={cueFrames(entry.name) + GAP}
        >
          <Panel name={entry.name} group={entry.group} index={i} />
        </Sequence>
      ))}
    </NarrativeScene>
  );
}
