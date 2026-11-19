import type { ReactNode } from "react";
import { C } from "../../design/tokens";
import type { Point } from "../core/geometry";
import { MotionBox } from "../core/MotionWrapper";
import type { DocumentarySceneDefinition, LayerRenderContext } from "../composer/types";
import {
  ProportionalBarComparison,
  ThresholdMeter,
  type ComparisonBarItem,
} from "../actors";
import { DrawConnector } from "../actors/DrawConnector";
import type { ConnectorKind } from "../actors/connectorMath";
import {
  ContextualAnnotation,
  DocumentarySectionHeading,
} from "../typography";
import {
  entryDirectionFor,
  isLightOnRegion,
  pickRegionPair,
  type CommonStageParams,
} from "./shared";

export type ComparisonStageParams = CommonStageParams & {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  annotation?: string;
  barsTitle?: string;
  bars?: readonly ComparisonBarItem[];
  threshold?: {
    baseAmount: number;
    threshold: number;
    addedAmount?: number;
    baseLabel?: string;
    thresholdLabel?: string;
    addedLabel?: string;
    addAt?: number;
  };
  connector?: {
    from: Point;
    to: Point;
    kind?: ConnectorKind;
    label?: string;
    color?: string;
    startFrame?: number;
  };
  customVisual?: (ctx: LayerRenderContext) => ReactNode;
};

export function createComparisonStage(
  params: ComparisonStageParams,
): DocumentarySceneDefinition {
  const layout = params.layout ?? "asymmetric-35-65";
  const look = params.look ?? "editorial-paper";
  const motionProfile = params.motionProfile ?? "editorial-crisp";
  const { primary, secondary } = pickRegionPair(layout);
  const container = params.container ?? "borderless";

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
        id: `${params.id}-copy`,
        kind: "text",
        depth: "foreground",
        region: primary,
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
                gap: 24,
                paddingTop: 40,
              }}
            >
              <DocumentarySectionHeading
                eyebrow={params.eyebrow}
                title={params.heading}
                subtitle={params.subtitle}
                onDark={onDark}
                from={0}
                until={layerDuration}
                width={Math.max(320, primary.width - 16)}
                frame={layerFrame}
              />
              {params.annotation && (
                <ContextualAnnotation
                  text={params.annotation}
                  onDark={onDark}
                  from={18}
                  frame={layerFrame}
                />
              )}
            </MotionBox>
          );
        },
      },
      {
        id: `${params.id}-comparison`,
        kind: "diagram",
        depth: "midground",
        region: secondary,
        from: 6,
        render: (ctx) => {
          const onDark = !isLightOnRegion(ctx.look, secondary);
          const boxed = container === "card" || container === "sheet";
          const visualWidth = Math.max(420, secondary.width - (boxed ? 72 : 24));

          return (
            <MotionBox
              profile={motionProfile}
              direction={entryDirectionFor(secondary)}
              from={0}
              until={ctx.layerDuration}
              frame={ctx.layerFrame}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 28,
                padding: boxed ? "28px 36px" : "24px 8px",
                borderRadius: boxed ? 22 : 0,
                background: boxed ? ctx.look.surface : "transparent",
                border: boxed ? `2px solid ${ctx.look.hairline}` : "none",
                borderTop:
                  !boxed && secondary.y > 200
                    ? `2px solid ${ctx.look.hairline}`
                    : undefined,
                boxShadow: boxed ? ctx.look.shadow : "none",
                boxSizing: "border-box",
              }}
            >
              {params.threshold && (
                <ThresholdMeter
                  {...params.threshold}
                  onDark={boxed && ctx.look.id === "evidence-desk" ? false : onDark}
                  profile={motionProfile}
                  width={visualWidth}
                  frame={ctx.layerFrame}
                />
              )}
              {params.bars && (
                <ProportionalBarComparison
                  items={params.bars}
                  title={params.barsTitle}
                  onDark={boxed && ctx.look.id === "evidence-desk" ? false : onDark}
                  profile={motionProfile}
                  width={visualWidth}
                  frame={ctx.layerFrame}
                />
              )}
              {params.customVisual?.(ctx)}
            </MotionBox>
          );
        },
      },
      ...(params.connector
        ? [
            {
              id: `${params.id}-connector`,
              kind: "svg" as const,
              depth: "foreground" as const,
              essential: false,
              render: ({ layerFrame }: LayerRenderContext) => (
                <DrawConnector
                  from={params.connector!.from}
                  to={params.connector!.to}
                  kind={params.connector!.kind ?? "curved"}
                  label={params.connector!.label}
                  color={params.connector!.color ?? C.yellow}
                  startFrame={params.connector!.startFrame ?? 22}
                  frame={layerFrame}
                />
              ),
            },
          ]
        : []),
      ...(params.extraLayers ?? []),
    ],
  };
}
