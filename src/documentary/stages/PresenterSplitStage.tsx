import type { ReactNode } from "react";
import type { ReferenceExpression, ReferencePose } from "../../characters/referenceModel";
import { MotionBox } from "../core/MotionWrapper";
import type { DocumentarySceneDefinition, LayerRenderContext } from "../composer/types";
import { PresenterStage, type PresenterFraming } from "../actors/PresenterStage";
import { DocumentarySectionHeading } from "../typography";
import { isLightOnRegion, pickRegionPair, type CommonStageParams } from "./shared";

export type PresenterSplitStageParams = CommonStageParams & {
  identity?: "Sam" | "Alex";
  framing?: PresenterFraming;
  fromPose?: ReferencePose;
  pose?: ReferencePose;
  expression?: ReferenceExpression;
  speechWindows?: readonly [number, number][];
  sceneFromFrame?: number;
  eyebrow?: string;
  heading?: string;
  graphic: (ctx: LayerRenderContext) => ReactNode;
};

export function createPresenterSplitStage(
  params: PresenterSplitStageParams,
): DocumentarySceneDefinition {
  const layout = params.layout ?? "presenter-split";
  const look = params.look ?? "midnight-blueprint";
  const motionProfile = params.motionProfile ?? "tactile-spring";
  const { primary, secondary } = pickRegionPair(layout);
  const framing = params.framing ?? "side-left";

  return {
    id: params.id,
    title: params.title,
    durationInFrames: params.durationInFrames,
    layout,
    look,
    motionProfile,
    camera: params.camera,
    focusTargets: params.focusTargets,
    stages: params.stages,
    beats: params.beats,
    join: params.join,
    joinFrames: params.joinFrames,
    assetRegistry: params.assetRegistry,
    layers: [
      {
        id: `${params.id}-presenter`,
        kind: "svg",
        depth: "midground",
        essential: false,
        render: ({ sceneFrame, look: tokens }) => {
          const onDark = !isLightOnRegion(tokens, primary);
          return (
            <PresenterStage
              identity={params.identity ?? "Sam"}
              framing={framing}
              localFrame={sceneFrame}
              absoluteFrame={(params.sceneFromFrame ?? 0) + sceneFrame}
              fromPose={params.fromPose ?? "standing"}
              pose={params.pose ?? "explaining"}
              expression={params.expression ?? "confident"}
              speechWindows={params.speechWindows}
              onDark={onDark}
            />
          );
        },
      },
      {
        id: `${params.id}-graphic`,
        kind: "object",
        depth: "foreground",
        region: framing === "side-right" ? primary : secondary,
        from: 6,
        render: (ctx) => {
          const targetBox = framing === "side-right" ? primary : secondary;
          const onDark = !isLightOnRegion(ctx.look, targetBox);
          return (
            <MotionBox
              profile={motionProfile}
              direction="up"
              from={0}
              until={ctx.layerDuration}
              frame={ctx.layerFrame}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 24,
                height: "100%",
              }}
            >
              {params.heading && (
                <DocumentarySectionHeading
                  eyebrow={params.eyebrow}
                  title={params.heading}
                  onDark={onDark}
                  from={0}
                  until={ctx.layerDuration}
                  width={Math.max(360, targetBox.width - 24)}
                  frame={ctx.layerFrame}
                />
              )}
              {params.graphic(ctx)}
            </MotionBox>
          );
        },
      },
      ...(params.extraLayers ?? []),
    ],
  };
}
