import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import {
  AnimatedNumber,
  ObjectAttachedLabel,
  SectionHeading,
} from "../typography";
import { ElasticText } from "../typography/motion";
import { C } from "../design/tokens";
import { usd } from "../finance/math";
import type { CompiledFilm, FilmText } from "./buyNowPlan";
import { BuyNowFrame, closingCamera } from "./BuyNowStages";

const colors = { navy: C.navy, yellow: C.yellow, coral: C.red, teal: C.teal, white: C.white, muted: C.muted } as const;

export type BuyNowFilmProps = { data: CompiledFilm | null };

export const BuyNowFilm = ({ data }: BuyNowFilmProps) => {
  const frame = useCurrentFrame();
  if (!data) throw new Error("Prepare the Buy Now film packet before previewing");
  const scene =
    data.scenes.find((item) => frame >= item.from && frame < item.until) ??
    data.scenes.at(-1)!;
  const activeText = data.texts.filter(
    (beat) => frame >= beat.from && frame < beat.until,
  );
  // The closing scene pulls the camera; labels must ride the same transform or
  // they drift off the card they belong to. One source of truth: closingCamera.
  const local = frame - scene.from;
  const camera =
    scene.stage === "closing" ? closingCamera(local, scene.durationInFrames) : 1;
  return (
    <AbsoluteFill>
      <BuyNowFrame scene={scene} frame={Math.min(frame, scene.until - 1)} />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, zIndex: 4, fontFamily: "Inter, sans-serif" }}
      >
        <g
          transform={
            camera === 1
              ? undefined
              : `translate(960,540) scale(${camera}) translate(-960,-540)`
          }
        >
          {activeText.map((beat, i) => {
            const props = {
              x: beat.x,
              y: beat.y,
              from: beat.from,
              until: beat.until,
              enter: beat.enter ?? 14,
              exit: 10,
              frame,
              size: beat.size ?? 40,
              color: colors[beat.color ?? "navy"],
            };
            return (
              <BeatText key={`${beat.sceneId}-${i}`} beat={beat} props={props} />
            );
          })}
        </g>
      </svg>
      {/* One global audio node: narration and library SFX are premixed into
          public/film-audio.wav by scripts/render/render-buy-now-film.ts. */}
      <Audio src={staticFile("film-audio.wav")} />
    </AbsoluteFill>
  );
};

const BeatText = ({
  beat,
  props,
}: {
  beat: FilmText;
  props: {
    x: number;
    y: number;
    from: number;
    until: number;
    enter: number;
    exit: number;
    frame: number;
    size: number;
    color: string;
  };
}) => {
  if (beat.preset === "heading")
    return <SectionHeading {...props} text={beat.text ?? ""} width={300} />;
  if (beat.preset === "amount" && beat.value !== undefined) {
    // Odometer for a neutral price reveal, snap-in for the tempting installment,
    // plain count where the number is a balance rather than a claim.
    if (beat.style === "elastic")
      return <ElasticText {...props} text={usd(beat.value)} />;
    return (
      <AnimatedNumber
        {...props}
        value={beat.value}
        duration={20}
        anchor={beat.anchor}
        mode={beat.style === "count" ? "counter" : "odometer"}
      />
    );
  }
  return (
    <ObjectAttachedLabel
      {...props}
      text={beat.text ?? ""}
      object={{ x: beat.x, y: beat.y }}
      line={false}
    />
  );
};
