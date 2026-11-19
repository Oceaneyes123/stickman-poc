import { KineticCutaway } from "../../cutaways/KineticCutaway";
import { resolveCutawayBoardTone, type CutawaySpec } from "../../cutaways/types";
import type { TransitionId } from "../../transitions";
import type { DocumentarySceneDefinition } from "../composer/types";
import type { CompiledDocumentaryBeat } from "../timeline";

export function createCutawayStage(params: {
  id: string;
  title: string;
  durationInFrames: number;
  spec: CutawaySpec;
  join?: TransitionId;
  joinFrames?: number;
  beats?: CompiledDocumentaryBeat[];
}): DocumentarySceneDefinition {
  const tone = resolveCutawayBoardTone(params.spec);
  return {
    id: params.id,
    title: params.title,
    durationInFrames: params.durationInFrames,
    layout: "single",
    look:
      tone === "warm-paper"
        ? "editorial-paper"
        : tone === "light"
          ? "warm-studio"
          : "midnight-blueprint",
    motionProfile: "mechanical-snap",
    join: params.join,
    joinFrames: params.joinFrames,
    beats: params.beats,
    layers: [
      {
        id: `${params.id}-cutaway`,
        kind: "text",
        depth: "foreground",
        essential: false,
        render: ({ layerFrame }) => (
          <KineticCutaway
            spec={params.spec}
            duration={params.durationInFrames}
            frame={layerFrame}
          />
        ),
      },
    ],
  };
}
