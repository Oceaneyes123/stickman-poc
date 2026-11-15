/**
 * Review panels for the video-002 stage motion. Each panel replays one stage on
 * its own deterministic clock through the same BuyNowFrame the film renders, so
 * the gallery cannot drift from the episode. Duration comes from the compiled
 * packet (one panel per stage that actually appears).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../design/tokens";
import {
  BUY_NOW_PANEL,
  STAGES,
  type CompiledFilm,
  type CompiledFilmScene,
} from "./buyNowPlan";
import { BuyNowFrame } from "./BuyNowStages";

export type BuyNowGalleryProps = { data: CompiledFilm | null };

export const buyNowPanels = (data: CompiledFilm | null): CompiledFilmScene[] => {
  if (!data) throw new Error("BuyNowMotionGallery needs the compiled film packet");
  return STAGES.flatMap((stage) => {
    const scene = data.scenes.find((item) => item.stage === stage);
    return scene
      ? [{ ...scene, from: 0, until: BUY_NOW_PANEL, durationInFrames: BUY_NOW_PANEL }]
      : [];
  });
};

export const buyNowGalleryDuration = (data: CompiledFilm | null) =>
  buyNowPanels(data).length * BUY_NOW_PANEL;

export const BuyNowGallery = ({ data }: BuyNowGalleryProps) => {
  const frame = useCurrentFrame();
  const panels = buyNowPanels(data);
  const active = Math.min(
    panels.length - 1,
    Math.max(0, Math.floor(frame / BUY_NOW_PANEL)),
  );
  const scene = panels[active];
  const local = frame - active * BUY_NOW_PANEL;
  return (
    <AbsoluteFill>
      <BuyNowFrame scene={scene} frame={Math.min(local, BUY_NOW_PANEL - 1)} />
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: 40 }}>
        <div
          style={{
            alignSelf: "flex-start",
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            fontWeight: 750,
            color: C.navy,
            background: "rgba(248,250,252,0.88)",
            border: `2px solid ${C.navy}`,
            borderRadius: 10,
            padding: "8px 16px",
          }}
        >
          {`${String(active + 1).padStart(2, "0")}/${panels.length} · ${scene.stage} · ${scene.id} · f${local}`}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
