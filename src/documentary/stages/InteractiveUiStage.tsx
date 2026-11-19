import type { ReactNode } from "react";
import { MotionBox } from "../core/MotionWrapper";
import type { DocumentarySceneDefinition, LayerRenderContext } from "../composer/types";
import { CursorActor } from "../actors/CursorActor";
import type { CursorWaypoint } from "../actors/cursorMath";
import {
  ContextualAnnotation,
  DocumentarySectionHeading,
  ExplanatoryCallout,
} from "../typography";
import {
  BankingAppScreen,
  CheckoutInterface,
  SubscriptionDashboard,
  type BankingAppProps,
  type CheckoutInterfaceProps,
  type SubscriptionDashboardProps,
} from "../ui";
import {
  entryDirectionFor,
  isLightOnRegion,
  pickRegionPair,
  type CommonStageParams,
} from "./shared";

export type InteractiveUiSpec =
  | { kind: "checkout"; props: Omit<CheckoutInterfaceProps, "frame" | "width"> }
  | { kind: "banking"; props: Omit<BankingAppProps, "frame" | "width"> }
  | { kind: "subscription"; props: Omit<SubscriptionDashboardProps, "frame" | "width"> }
  | { kind: "custom"; render: (ctx: LayerRenderContext) => ReactNode };

export type InteractiveUiStageParams = CommonStageParams & {
  eyebrow?: string;
  heading: string;
  annotation?: string;
  callout?: { title: string; detail?: string; at?: number };
  ui: InteractiveUiSpec;
  waypoints?: readonly CursorWaypoint[];
};

export function createInteractiveUiStage(
  params: InteractiveUiStageParams,
): DocumentarySceneDefinition {
  const layout = params.layout ?? "feature-right";
  const look = params.look ?? "warm-studio";
  const motionProfile = params.motionProfile ?? "tactile-spring";
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
                paddingTop: 52,
              }}
            >
              <DocumentarySectionHeading
                eyebrow={params.eyebrow}
                title={params.heading}
                onDark={onDark}
                from={0}
                until={layerDuration}
                width={Math.max(320, primary.width - 16)}
                frame={layerFrame}
              />
              {params.callout && (
                <ExplanatoryCallout
                  title={params.callout.title}
                  detail={params.callout.detail}
                  from={params.callout.at ?? 24}
                  width={Math.max(320, primary.width - 24)}
                  frame={layerFrame}
                />
              )}
              {params.annotation && (
                <ContextualAnnotation
                  text={params.annotation}
                  onDark={onDark}
                  from={36}
                  frame={layerFrame}
                />
              )}
            </MotionBox>
          );
        },
      },
      {
        id: `${params.id}-ui`,
        kind: "ui",
        depth: "midground",
        region: secondary,
        from: 4,
        render: (ctx) => {
          const w = Math.min(820, secondary.width - 24);
          return (
            <MotionBox
              profile={motionProfile}
              direction={entryDirectionFor(secondary)}
              from={0}
              until={ctx.layerDuration}
              frame={ctx.layerFrame}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              {params.ui.kind === "checkout" && (
                <CheckoutInterface
                  {...params.ui.props}
                  width={w}
                  frame={ctx.layerFrame}
                />
              )}
              {params.ui.kind === "banking" && (
                <BankingAppScreen
                  {...params.ui.props}
                  width={Math.min(480, w)}
                  frame={ctx.layerFrame}
                />
              )}
              {params.ui.kind === "subscription" && (
                <SubscriptionDashboard
                  {...params.ui.props}
                  width={w}
                  frame={ctx.layerFrame}
                />
              )}
              {params.ui.kind === "custom" && params.ui.render(ctx)}
            </MotionBox>
          );
        },
      },
      ...(params.waypoints && params.waypoints.length > 0
        ? [
            {
              id: `${params.id}-cursor`,
              kind: "ui" as const,
              depth: "foreground" as const,
              essential: false,
              render: ({ layerFrame }: LayerRenderContext) => (
                <CursorActor waypoints={params.waypoints!} frame={layerFrame} />
              ),
            },
          ]
        : []),
      ...(params.extraLayers ?? []),
    ],
  };
}
