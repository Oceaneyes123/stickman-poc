import { Video } from "@remotion/media";
import { Img, staticFile } from "remotion";
import { C, font } from "../../design/tokens";
import { isRemoteUrl, type AssetRegistry } from "../assets";
import {
  FRAME,
  region,
  transformRect,
  type LayoutName,
  type Rect,
} from "../core/geometry";
import { clamp01, ramp, sample } from "../core/keyframes";
import type { CompiledDocumentaryBeat } from "../timeline";
import { SceneBackdrop } from "./SceneLayout";
import type { LayerSpec, MaskShape } from "./types";

const resolveBox = (
  regionRef: string | Rect | undefined,
  layout: LayoutName,
): Rect => {
  if (!regionRef) return { x: 0, y: 0, ...FRAME };
  if (typeof regionRef === "string") return region(layout, regionRef);
  return regionRef;
};

export function resolveLayerBox(
  layer: LayerSpec,
  layout: LayoutName,
  sceneFrame: number,
  sceneDuration: number,
): { visible: boolean; opacity: number; rect: Rect; essential: boolean } {
  const from = layer.from ?? 0;
  const until = layer.until ?? sceneDuration;
  const visible = sceneFrame >= from && sceneFrame < until;
  const box = resolveBox(layer.region, layout);
  const t = layer.transform;
  const ox = t?.originX ?? 0.5;
  const oy = t?.originY ?? 0.5;
  const x = sample(t?.x, sceneFrame, 0);
  const y = sample(t?.y, sceneFrame, 0);
  const scale = sample(t?.scale, sceneFrame, 1);
  const baseOpacity = sample(t?.opacity, sceneFrame, 1);

  const span = Math.max(1, until - from);
  const enter = layer.enterFrames ?? 0;
  const exit = layer.exitFrames ?? 0;
  const inOpacity = enter > 0 ? ramp(sceneFrame, from, Math.min(enter, span / 2), "out") : 1;
  const outOpacity =
    exit > 0 ? 1 - ramp(sceneFrame, until - Math.min(exit, span / 2), Math.min(exit, span / 2), "inOut") : 1;
  const opacity = clamp01(baseOpacity * inOpacity * outOpacity);

  return {
    visible,
    opacity,
    rect: transformRect(box, { x, y, scale, originX: ox, originY: oy }),
    essential: layer.essential ?? layer.depth !== "background",
  };
}

const maskToClipPath = (mask: MaskShape | undefined): string | undefined => {
  if (!mask || mask.kind === "none") return undefined;
  if (mask.kind === "inset") {
    const r = mask.radius ? ` round ${mask.radius}px` : "";
    return `inset(${mask.top}px ${mask.right}px ${mask.bottom}px ${mask.left}px${r})`;
  }
  if (mask.kind === "circle") {
    return `circle(${mask.radiusPct}% at ${mask.cxPct ?? 50}% ${mask.cyPct ?? 50}%)`;
  }
  const r = mask.radius ? ` round ${mask.radius}px` : "";
  const top = mask.rect.y;
  const left = mask.rect.x;
  const right = Math.max(0, FRAME.width - (mask.rect.x + mask.rect.width));
  const bottom = Math.max(0, FRAME.height - (mask.rect.y + mask.rect.height));
  return `inset(${top}px ${right}px ${bottom}px ${left}px${r})`;
};

const resolveLocalSrc = (
  src: string | undefined,
  assetId: string | undefined,
  registry: AssetRegistry | undefined,
  allowPending: boolean,
): string | null => {
  if (assetId && registry) {
    const resolved = registry.resolveRenderPath(assetId, {
      allowPendingPlaceholder: allowPending,
    });
    if (!resolved) return null;
    return resolved.startsWith("data:") ? resolved : staticFile(resolved);
  }
  if (!src) return null;
  if (isRemoteUrl(src)) {
    throw new Error(`Offline documentary rendering prohibits remote URL: ${src}`);
  }
  const normalized = src.replace(/\\/g, "/").replace(/^public\//, "");
  return normalized.startsWith("data:") ? normalized : staticFile(normalized);
};

export function MediaLayer({
  layer,
  sceneId,
  layout,
  sceneFrame,
  sceneDuration,
  zIndex,
  beats = [],
  sharedState = {},
  assetRegistry,
  allowPendingAssets = false,
}: {
  layer: LayerSpec;
  sceneId: string;
  layout: LayoutName;
  sceneFrame: number;
  sceneDuration: number;
  zIndex: number;
  beats?: readonly CompiledDocumentaryBeat[];
  sharedState?: Record<string, unknown>;
  assetRegistry?: AssetRegistry;
  allowPendingAssets?: boolean;
}) {
  const from = layer.from ?? 0;
  const until = layer.until ?? sceneDuration;
  if (sceneFrame < from || sceneFrame >= until) return null;

  const box = resolveBox(layer.region, layout);
  const t = layer.transform;
  const tx = sample(t?.x, sceneFrame, 0);
  const ty = sample(t?.y, sceneFrame, 0);
  const scale = sample(t?.scale, sceneFrame, 1);
  const rotate = sample(t?.rotate, sceneFrame, 0);
  const baseOpacity = sample(t?.opacity, sceneFrame, 1);
  const span = Math.max(1, until - from);
  const enter = layer.enterFrames ?? 0;
  const exit = layer.exitFrames ?? 0;
  const inOpacity = enter > 0 ? ramp(sceneFrame, from, Math.min(enter, span / 2), "out") : 1;
  const outOpacity =
    exit > 0 ? 1 - ramp(sceneFrame, until - Math.min(exit, span / 2), Math.min(exit, span / 2), "inOut") : 1;
  const opacity = clamp01(baseOpacity * inOpacity * outOpacity);

  const ox = (t?.originX ?? 0.5) * 100;
  const oy = (t?.originY ?? 0.5) * 100;
  const crop = t?.crop;
  const cropClip = crop
    ? `inset(${crop.top ?? 0}px ${crop.right ?? 0}px ${crop.bottom ?? 0}px ${crop.left ?? 0}px)`
    : undefined;
  const maskClip = maskToClipPath(t?.mask);
  const clipPath = maskClip ?? cropClip;

  const ctx = {
    sceneId,
    sceneFrame,
    layerFrame: sceneFrame - from,
    sceneDuration,
    layerDuration: span,
    box,
    beats,
    sharedState,
  };

  let content = null;
  if (layer.kind === "backdrop") {
    content = <SceneBackdrop spec={layer.backdrop} />;
  } else if (layer.kind === "video") {
    const resolved = resolveLocalSrc(
      layer.src,
      layer.assetId,
      assetRegistry,
      allowPendingAssets,
    );
    content = resolved ? (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Video
          src={resolved}
          muted
          loop={layer.loop ?? false}
          trimBefore={layer.trimBefore}
          playbackRate={layer.playbackRate}
          objectFit={layer.fit ?? "cover"}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        {(layer.tintOpacity ?? 0) > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: C.navy,
              opacity: layer.tintOpacity,
            }}
          />
        )}
      </div>
    ) : (
      layer.fallbackGraphic ?? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#1B304C",
            border: `2px dashed ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.muted,
            fontFamily: font,
            fontSize: 24,
          }}
        >
          Pending video asset: {layer.assetId ?? layer.id}
        </div>
      )
    );
  } else if (layer.kind === "image") {
    const resolved = resolveLocalSrc(
      layer.src,
      layer.assetId,
      assetRegistry,
      allowPendingAssets,
    );
    content = resolved ? (
      <Img
        src={resolved}
        style={{
          width: "100%",
          height: "100%",
          objectFit: layer.fit ?? "cover",
        }}
      />
    ) : (
      layer.fallbackGraphic ?? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#1B304C",
            border: `2px dashed ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.muted,
            fontFamily: font,
            fontSize: 24,
          }}
        >
          Pending image asset: {layer.assetId ?? layer.id}
        </div>
      )
    );
  } else if (layer.kind === "svg") {
    content = (
      <svg
        width={box.width}
        height={box.height}
        viewBox={layer.viewBox ?? `0 0 ${box.width} ${box.height}`}
        style={{ overflow: "visible", display: "block" }}
      >
        {layer.render(ctx)}
      </svg>
    );
  } else {
    content = layer.render(ctx);
  }

  return (
    <div
      data-layer-id={layer.id}
      data-layer-depth={layer.depth}
      data-layer-kind={layer.kind}
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        zIndex,
        opacity,
        transformOrigin: `${ox}% ${oy}%`,
        transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${rotate}deg) scale(${scale})`,
        clipPath,
        overflow: clipPath || crop ? "hidden" : "visible",
        boxSizing: "border-box",
      }}
    >
      {content}
    </div>
  );
}
