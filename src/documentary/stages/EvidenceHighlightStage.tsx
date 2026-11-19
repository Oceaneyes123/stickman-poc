import type { ReactNode } from "react";
import { C } from "../../design/tokens";
import { MotionBox } from "../core/MotionWrapper";
import type { DocumentarySceneDefinition, LayerRenderContext } from "../composer/types";
import {
  DocumentViewer,
  ReceiptViewer,
  SourceCitation,
  type DocumentViewerProps,
  type ReceiptViewerProps,
  type SourceCitationProps,
} from "../evidence";
import {
  DocumentarySectionHeading,
  ExplanatoryCallout,
} from "../typography";
import {
  entryDirectionFor,
  isLightOnRegion,
  pickRegionPair,
  type CommonStageParams,
} from "./shared";

export type EvidenceHighlightStageParams = CommonStageParams & {
  eyebrow?: string;
  heading?: string;
  citation: Omit<SourceCitationProps, "frame">;
  document?: Omit<DocumentViewerProps, "frame" | "width">;
  receipt?: Omit<ReceiptViewerProps, "frame" | "width">;
  schematic?: (ctx: LayerRenderContext) => ReactNode;
  callout?: { title: string; detail?: string; at?: number; accent?: string };
};

export function createEvidenceHighlightStage(
  params: EvidenceHighlightStageParams,
): DocumentarySceneDefinition {
  const layout = params.layout ?? "document-focus";
  const look = params.look ?? "evidence-desk";
  const motionProfile = params.motionProfile ?? "editorial-crisp";
  const { primary, secondary } = pickRegionPair(layout);

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
        id: `${params.id}-evidence`,
        kind: "document",
        depth: "midground",
        region: secondary,
        render: (ctx) => {
          const w = Math.min(secondary.width, 860);
          return (
            <MotionBox
              profile={motionProfile}
              direction={entryDirectionFor(secondary)}
              from={0}
              until={ctx.layerDuration}
              frame={ctx.layerFrame}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              {params.document && (
                <DocumentViewer
                  {...params.document}
                  width={w}
                  height={Math.min(680, secondary.height - 100)}
                  frame={ctx.layerFrame}
                />
              )}
              {params.receipt && (
                <ReceiptViewer
                  {...params.receipt}
                  width={Math.min(540, w)}
                  frame={ctx.layerFrame}
                />
              )}
              {params.schematic?.(ctx)}
              <SourceCitation {...params.citation} from={8} frame={ctx.layerFrame} />
            </MotionBox>
          );
        },
      },
      {
        id: `${params.id}-notes`,
        kind: "text",
        depth: "foreground",
        region: primary,
        from: 8,
        render: ({ layerFrame, layerDuration, look: tokens }) => {
          const onDark = !isLightOnRegion(tokens, primary);
          return (
            <MotionBox
              profile={motionProfile}
              direction={entryDirectionFor(primary)}
              from={0}
              until={layerDuration}
              frame={layerFrame}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                paddingTop: 24,
              }}
            >
              {params.heading && (
                <DocumentarySectionHeading
                  eyebrow={params.eyebrow}
                  title={params.heading}
                  onDark={onDark}
                  from={0}
                  until={layerDuration}
                  width={Math.max(300, primary.width - 12)}
                  frame={layerFrame}
                />
              )}
              {params.callout && (
                <ExplanatoryCallout
                  title={params.callout.title}
                  detail={params.callout.detail}
                  accent={params.callout.accent ?? C.teal}
                  from={params.callout.at ?? 16}
                  width={Math.max(300, primary.width - 12)}
                  frame={layerFrame}
                />
              )}
            </MotionBox>
          );
        },
      },
      ...(params.extraLayers ?? []),
    ],
  };
}
