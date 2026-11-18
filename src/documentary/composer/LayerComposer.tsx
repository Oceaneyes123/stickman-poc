import { AbsoluteFill } from "remotion";
import { C, font } from "../../design/tokens";
import type { AssetRegistry } from "../assets";
import { sampleFocusCamera, type FocusTarget } from "../core/focus";
import { FRAME, type LayoutName } from "../core/geometry";
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

  const camera = sampleFocusCamera(focusTargets, sceneFrame, FRAME);
  const hasCamera = camera.scale !== 1 || camera.tx !== 0 || camera.ty !== 0;

  return (
    <AbsoluteFill
      style={{
        transformOrigin: "960px 540px",
        transform: hasCamera
          ? `translate3d(${camera.tx}px, ${camera.ty}px, 0) scale(${camera.scale})`
          : undefined,
      }}
    >
      {ordered.map(({ layer, zIndex }) => (
        <MediaLayer
          key={layer.id}
          layer={layer}
          sceneId={sceneId}
          layout={layout}
          sceneFrame={sceneFrame}
          sceneDuration={sceneDuration}
          zIndex={zIndex}
          beats={beats}
          sharedState={sharedState}
          assetRegistry={assetRegistry}
          allowPendingAssets={allowPendingAssets}
        />
      ))}
      {camera.active && camera.dimOpacity > 0.01 && (
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
            <mask id={`focus-mask-${sceneId}-${camera.active.id}`}>
              <rect width={FRAME.width} height={FRAME.height} fill="#fff" />
              <rect
                x={camera.active.rect.x - 10}
                y={camera.active.rect.y - 10}
                width={camera.active.rect.width + 20}
                height={camera.active.rect.height + 20}
                rx={16}
                fill="#000"
              />
            </mask>
          </defs>
          <rect
            width={FRAME.width}
            height={FRAME.height}
            fill={C.navy}
            opacity={camera.dimOpacity}
            mask={`url(#focus-mask-${sceneId}-${camera.active.id})`}
          />
          <rect
            x={camera.active.rect.x - 10}
            y={camera.active.rect.y - 10}
            width={camera.active.rect.width + 20}
            height={camera.active.rect.height + 20}
            rx={16}
            fill="none"
            stroke={camera.active.color ?? C.yellow}
            strokeWidth={4}
            opacity={camera.progress}
          />
          {camera.active.callout && (
            <g
              transform={`translate(${camera.active.rect.x},${Math.max(76, camera.active.rect.y - 24)})`}
              opacity={camera.progress}
            >
              <rect
                x={0}
                y={-34}
                width={Math.min(520, Math.max(220, camera.active.callout.length * 14 + 32))}
                height={38}
                rx={8}
                fill={camera.active.color ?? C.yellow}
              />
              <text
                x={16}
                y={-9}
                fontFamily={font}
                fontSize={22}
                fontWeight={700}
                fill={C.navy}
              >
                {camera.active.callout}
              </text>
            </g>
          )}
        </svg>
      )}
    </AbsoluteFill>
  );
}
