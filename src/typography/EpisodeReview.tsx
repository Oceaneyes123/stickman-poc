import type { ReactNode } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import {
  AnimatedList,
  AnimatedUnderline,
  KineticHeadline,
  ObjectAttachedLabel,
  SectionHeading,
  TextMorph,
} from "./index";
import { FinancialMotionContext } from "./context";
import type { CompiledTypography } from "./plan";
import { C } from "../design/tokens";

export type TypographyReviewProps = { data: CompiledTypography | null };
function Beat({
  beat,
  frame,
}: {
  beat: CompiledTypography["beats"][number];
  frame: number;
}) {
  if (!beat.text.length || frame < beat.from || frame >= beat.until)
    return null;
  const props = {
    ...beat.position,
    from: beat.from,
    until: beat.until,
    frame,
    enter: beat.enterFrames,
    exit: beat.exitFrames,
    size: beat.fontSize ?? 36,
    color: C[beat.color ?? "navy"],
  };
  const rotation = beat.rotation;
  let content: ReactNode;
  if (beat.preset === "headline")
    content = (
      <>
        <KineticHeadline
          {...props}
          text={beat.text.join("\n")}
          origin={beat.object}
          width={1000}
          unit="line"
          stagger={5}
        />
        <AnimatedUnderline
          {...props}
          from={beat.from + 10}
          y={props.y + beat.text.length * 72}
          width={beat.underlineWidth ?? 340}
        />
      </>
    );
  else if (beat.preset === "section")
    content = (
      <SectionHeading
        {...props}
        text={beat.text[0]}
        width={beat.underlineWidth ?? 360}
      />
    );
  else if (beat.preset === "morph")
    content = (
      <TextMorph
        {...props}
        before={beat.morphBefore ?? ""}
        after={beat.text[0]}
        changeAt={beat.from}
      />
    );
  else if (beat.preset === "list" && beat.layout !== "attached")
    content = (
      <AnimatedList
        {...props}
        gap={beat.rowGap ?? 54}
        items={beat.text.map((text, i) => ({
          text,
          from: beat.itemFrames?.[i] ?? beat.from,
        }))}
      />
    );
  else
    content = (
      <>
        {beat.text.map((text, i) => (
          <ObjectAttachedLabel
            key={i}
            {...props}
            {...beat.itemPositions?.[i]}
            text={text}
            object={beat.itemObjects?.[i] ?? beat.object}
            from={
              beat.preset === "list"
                ? (beat.itemFrames?.[i] ?? beat.from)
                : beat.from
            }
            line={
              beat.leaderLine ??
              (beat.text.length === 1 || beat.layout === "attached")
            }
          />
        ))}
      </>
    );
  return (
    <g
      transform={
        rotation
          ? `rotate(${rotation.degrees} ${rotation.x} ${rotation.y})`
          : undefined
      }
    >
      {content}
    </g>
  );
}
export function EpisodeReview({
  data,
  renderArt,
}: TypographyReviewProps & {
  renderArt: (shotId: string, foreground: ReactNode) => ReactNode;
}) {
  const frame = useCurrentFrame();
  if (!data) throw new Error("Prepare the typography packet before previewing");
  const panel = data.panels.find((p) => frame >= p.from && frame < p.until);
  if (!panel) throw new Error(`No typography panel at ${frame}`);
  const scene = data.timeline.scenes.find((s) => s.id === panel.sceneId)!;
  const beats = data.beats.filter((b) => b.sceneId === panel.sceneId);
  return (
    <AbsoluteFill>
      <Audio src={staticFile("narration.wav")} />
      <FinancialMotionContext.Provider
        value={{
          frame,
          sceneFrom: scene.from,
          sceneUntil: scene.from + scene.durationInFrames,
          gates: data.gates.filter((g) => g.sceneId === scene.id),
          confirmationAt: data.confirmations.find((c) => c.sceneId === scene.id)
            ?.from,
        }}
      >
        {renderArt(
          panel.id,
          <>
            {beats.map((b) => (
              <Beat key={b.id} beat={b} frame={frame} />
            ))}
          </>,
        )}
      </FinancialMotionContext.Provider>
    </AbsoluteFill>
  );
}
