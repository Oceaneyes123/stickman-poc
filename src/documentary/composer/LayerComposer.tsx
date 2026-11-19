import { AbsoluteFill } from "remotion";
import { C, font } from "../../design/tokens";
import type { AssetRegistry } from "../assets";
import {
  cameraLayerTransform,
  sampleCameraRig,
  type CameraRigSpec,
} from "../core/camera";
import { sampleFocusCamera, type FocusTarget } from "../core/focus";
import { FRAME, type LayoutName } from "../core/geometry";
import { getLook, type LookId } from "../core/looks";
import type { MotionProfileId } from "../core/motionProfiles";
import { resolveActiveStage, type SceneStageSpec } from "../core/stages";
import type { CompiledDocumentaryBeat } from "../timeline";
import { MediaLayer } from "./MediaLayer";
import type { LayerDepth, LayerSpec } from "./types";

const DEPTH_ORDER: Record<LayerDepth, number> = {
  background: 100,
  midground: 200,
  foreground: 300,
};

export function LayerComposer({
  sceneId,
  layout,
  layers,
  sceneFrame,
  sceneDuration,
  focusTargets = [],
  camera: cameraRig,
  stages,
  look,
  motionProfile = "editorial-crisp",
  beats = [],
  sharedState = {},
  assetRegistry,
  allowPendingAssets = false,
}: {
  sceneId: string;
  layout: LayoutName;
  layers: readonly LayerSpec[];
  sceneFrame: number;
  sceneDuration: number;
  focusTargets?: readonly FocusTarget[];
  camera?: CameraRigSpec;
  stages?: readonly SceneStageSpec[];
  look?: LookId;
  motionProfile?: MotionProfileId;
  beats?: readonly CompiledDocumentaryBeat[];
  sharedState?: Record<string, unknown>;
  assetRegistry?: AssetRegistry;
  allowPendingAssets?: boolean;
}) {
  const ordered = layers
    .map((layer, index) => ({
      layer,
      zIndex: DEPTH_ORDER[layer.depth] + (layer.zOffset ?? index),
    }))
    .sort((a, b) => a.zIndex - b.zIndex);

  const lookTokens = getLook(look ?? "midnight-blueprint");
  const stageRes = resolveActiveStage(stages, sceneFrame);
  const stageCameraRig: CameraRigSpec | undefined =
    cameraRig ??
    (stages && stages.some((s) => s.camera)
      ? {
          keyframes: stages
            .filter((s) => s.camera)
            .map((s) => ({ at: s.from, ...s.camera! })),
        }
      : undefined);

  const rigSample = sampleCameraRig(stageCameraRig, sceneFrame);
  const hasRigCamera =
    rigSample.zoom !== 1 ||
    rigSample.x !== 0 ||
    rigSample.y !== 0 ||
    rigSample.rotate !== 0;

  const focusCamera = sampleFocusCamera(focusTargets, sceneFrame, FRAME);
  const hasFocusCamera =
    focusCamera.scale !== 1 || focusCamera.tx !== 0 || focusCamera.ty !== 0;

  return (
    <AbsoluteFill
      style={{
        transformOrigin: "960px 540px",
        transform: hasFocusCamera
          ? `translate3d(${focusCamera.tx}px, ${focusCamera.ty}px, 0) scale(${focusCamera.scale})`
          : undefined,
      }}
    >
      {ordered.map(({ layer, zIndex }) => {
        const media = (
          <MediaLayer
            key={hasRigCamera ? undefined : layer.id}
            layer={layer}
            sceneId={sceneId}
            layout={layout}
            sceneFrame={sceneFrame}
            sceneDuration={sceneDuration}
            zIndex={hasRigCamera ? 0 : zIndex}
            beats={beats}
            sharedState={sharedState}
            look={lookTokens}
            motionProfile={motionProfile}
            stageIndex={stageRes.stageIndex}
            activeStageId={stageRes.activeStage?.id ?? null}
            stageFrame={stageRes.stageFrame}
            stageState={stageRes.mergedState}
            assetRegistry={assetRegistry}
            allowPendingAssets={allowPendingAssets}
          />
        );

        if (!hasRigCamera) return media;

        const pt = cameraLayerTransform(
          rigSample,
          layer.depth,
          stageCameraRig?.parallax,
        );
        return (
          <AbsoluteFill
            key={layer.id}
            style={{
              zIndex,
              pointerEvents: "none",
              transformOrigin: "960px 540px",
              transform: `translate3d(${pt.tx}px, ${pt.ty}px, 0) rotate(${pt.rotate}deg) scale(${pt.scale})`,
            }}
          >
            {media}
          </AbsoluteFill>
        );
      })}
      {focusCamera.active && focusCamera.dimOpacity > 0.01 && (
        <svg
          width={FRAME.width}
          height={FRAME.height}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 450,
            pointerEvents: "none",
          }}
        >
          <defs>
            <mask id={`focus-mask-${sceneId}-${focusCamera.active.id}`}>
              <rect width={FRAME.width} height={FRAME.height} fill="#fff" />
              <rect
                x={focusCamera.active.rect.x - 10}
                y={focusCamera.active.rect.y - 10}
                width={focusCamera.active.rect.width + 20}
                height={focusCamera.active.rect.height + 20}
                rx={16}
                fill="#000"
              />
            </mask>
          </defs>
          <rect
            width={FRAME.width}
            height={FRAME.height}
            fill={C.navy}
            opacity={focusCamera.dimOpacity}
            mask={`url(#focus-mask-${sceneId}-${focusCamera.active.id})`}
          />
          <rect
            x={focusCamera.active.rect.x - 10}
            y={focusCamera.active.rect.y - 10}
            width={focusCamera.active.rect.width + 20}
            height={focusCamera.active.rect.height + 20}
            rx={16}
            fill="none"
            stroke={focusCamera.active.color ?? C.yellow}
            strokeWidth={4}
            opacity={focusCamera.progress}
          />
          {focusCamera.active.callout && (
            <g
              transform={`translate(${focusCamera.active.rect.x},${Math.max(76, focusCamera.active.rect.y - 24)})`}
              opacity={focusCamera.progress}
            >
              <rect
                x={0}
                y={-34}
                width={Math.min(520, Math.max(220, focusCamera.active.callout.length * 14 + 32))}
                height={38}
                rx={8}
                fill={focusCamera.active.color ?? C.yellow}
              />
              <text
                x={16}
                y={-9}
                fontFamily={font}
                fontSize={22}
                fontWeight={700}
                fill={C.navy}
              >
                {focusCamera.active.callout}
              </text>
            </g>
          )}
        </svg>
      )}
    </AbsoluteFill>
  );
}
