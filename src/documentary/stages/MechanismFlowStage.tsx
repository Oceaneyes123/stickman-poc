import type { ReactNode } from "react";
import { C } from "../../design/tokens";
import { region, type Point } from "../core/geometry";
import { MotionBox } from "../core/MotionWrapper";
import type { DocumentarySceneDefinition, LayerRenderContext } from "../composer/types";
import { DrawConnector } from "../actors/DrawConnector";
import type { ConnectorKind } from "../actors/connectorMath";
import { MoneyFlow, ProcessDiagram } from "../diagrams";
import { DocumentarySectionHeading } from "../typography";
import type { CommonStageParams } from "./shared";

export type MechanismConnectorSpec = {
  id: string;
  from: Point;
  to: Point;
  kind?: ConnectorKind;
  bend?: number;
  startFrame?: number;
  label?: string;
  color?: string;
};

export type MechanismFlowStageParams = CommonStageParams & {
  eyebrow?: string;
  heading?: string;
  moneyFlow?: Omit<Parameters<typeof MoneyFlow>[0], "frame" | "width">;
  process?: Omit<Parameters<typeof ProcessDiagram>[0], "frame" | "width">;
  connectors?: readonly MechanismConnectorSpec[];
  customDiagram?: (ctx: LayerRenderContext) => ReactNode;
};

export function createMechanismFlowStage(
  params: MechanismFlowStageParams,
): DocumentarySceneDefinition {
  const layout = params.layout ?? "editorial-top-stage";
  const look = params.look ?? "midnight-blueprint";
  const motionProfile = params.motionProfile ?? "tactile-spring";
  const headerRect =
    layout === "editorial-top-stage"
      ? region("editorial-top-stage", "header")
      : { x: 96, y: 64, width: 1728, height: 150 };
  const stageRect =
    layout === "editorial-top-stage"
      ? region("editorial-top-stage", "stage")
      : { x: 96, y: 230, width: 1728, height: 760 };

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
      ...(params.heading
        ? [
            {
              id: `${params.id}-heading`,
              kind: "text" as const,
              depth: "foreground" as const,
              region: headerRect,
              render: ({ layerFrame, layerDuration, look: tokens }: LayerRenderContext) => (
                <DocumentarySectionHeading
                  eyebrow={params.eyebrow}
                  title={params.heading!}
                  onDark={tokens.polarity !== "light"}
                  from={0}
                  until={layerDuration}
                  width={Math.min(1280, headerRect.width)}
                  frame={layerFrame}
                />
              ),
            },
          ]
        : []),
      {
        id: `${params.id}-flow`,
        kind: "diagram",
        depth: "midground",
        region: stageRect,
        from: 4,
        render: (ctx) => (
          <MotionBox
            profile={motionProfile}
            direction="up"
            from={0}
            until={ctx.layerDuration}
            frame={ctx.layerFrame}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 20,
            }}
          >
            {params.moneyFlow && (
              <MoneyFlow
                {...params.moneyFlow}
                width={Math.min(1560, stageRect.width)}
                frame={ctx.layerFrame}
              />
            )}
            {params.process && (
              <ProcessDiagram
                {...params.process}
                width={Math.min(1680, stageRect.width)}
                frame={ctx.layerFrame}
              />
            )}
            {params.customDiagram?.(ctx)}
          </MotionBox>
        ),
      },
      ...(params.connectors && params.connectors.length > 0
        ? [
            {
              id: `${params.id}-connectors`,
              kind: "svg" as const,
              depth: "foreground" as const,
              essential: false,
              render: ({ layerFrame }: LayerRenderContext) => (
                <>
                  {params.connectors!.map((c, idx) => (
                    <DrawConnector
                      key={c.id}
                      from={c.from}
                      to={c.to}
                      kind={c.kind}
                      bend={c.bend}
                      startFrame={c.startFrame ?? 12 + idx * 10}
                      label={c.label}
                      color={c.color ?? C.yellow}
                      frame={layerFrame}
                    />
                  ))}
                </>
              ),
            },
          ]
        : []),
      ...(params.extraLayers ?? []),
    ],
  };
}
