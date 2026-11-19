import type { ReactNode } from "react";
import type { AssetRegistry } from "../assets/registry";
import type { CameraRigSpec } from "../core/camera";
import type { ContinuityToken } from "../core/continuity";
import type { FocusTarget } from "../core/focus";
import type { LayoutName, Rect } from "../core/geometry";
import type { Track } from "../core/keyframes";
import type { LookId, LookTokens } from "../core/looks";
import type { MotionProfileId } from "../core/motionProfiles";
import type { SceneStageSpec } from "../core/stages";
import type { TextFitCheckInput } from "../core/textMetrics";
import type { CompiledDocumentaryBeat } from "../timeline";
import type { TransitionId } from "../../transitions";

export type LayerDepth = "background" | "midground" | "foreground";

export type MaskShape =
  | { kind: "none" }
  | {
      kind: "inset";
      top: number;
      right: number;
      bottom: number;
      left: number;
      radius?: number;
    }
  | { kind: "circle"; radiusPct: number; cxPct?: number; cyPct?: number }
  | { kind: "rect"; rect: Rect; radius?: number };

export type LayerTransformSpec = {
  x?: Track;
  y?: Track;
  scale?: Track;
  rotate?: Track;
  opacity?: Track;
  originX?: number;
  originY?: number;
  /** Crops inside the layer box in pixels before transform. */
  crop?: { top?: number; right?: number; bottom?: number; left?: number };
  mask?: MaskShape;
};

export type SceneBackdropPreset =
  | "editorial-navy"
  | "warm-paper"
  | "slate-board"
  | "split-board"
  | "dark-evidence";

export type SceneBackdropSpec = {
  preset?: SceneBackdropPreset;
  look?: LookId;
  accentColor?: string;
  gridLines?: boolean;
  vignette?: boolean;
};

export type LayerRenderContext = {
  sceneId: string;
  /** Frame relative to the start of the scene (0..durationInFrames-1). */
  sceneFrame: number;
  /** Frame relative to the layer's own `from` frame. */
  layerFrame: number;
  /** Duration of the parent scene in frames. */
  sceneDuration: number;
  /** Duration of this layer's active window in frames. */
  layerDuration: number;
  /** Resolved bounding box before layer transform. */
  box: Rect;
  /** Scene-level compiled beats (if running inside a compiled timeline). */
  beats: readonly CompiledDocumentaryBeat[];
  /** Shared continuity state carried across scenes. */
  sharedState: Record<string, unknown>;
  /** Active documentary Look tokens for surface-aware rendering. */
  look: LookTokens;
  /** Scene default motion profile. */
  motionProfile: MotionProfileId;
  /** Active sub-stage index (-1 when no stages are declared). */
  stageIndex: number;
  /** Active sub-stage ID, if any. */
  activeStageId: string | null;
  /** Frames elapsed since the active sub-stage started. */
  stageFrame: number;
  /** Cumulative state merged across sub-stages up to the active frame. */
  stageState: Record<string, unknown>;
};

type LayerBase = {
  id: string;
  depth: LayerDepth;
  /** Layout region name or explicit pixel Rect in 1920x1080 space. Defaults to full frame. */
  region?: string | Rect;
  /** Scene-local inclusive start frame. Defaults to 0. */
  from?: number;
  /** Scene-local exclusive end frame. Defaults to scene duration. */
  until?: number;
  enterFrames?: number;
  exitFrames?: number;
  transform?: LayerTransformSpec;
  /** Essential layers are validated against 96px side safe margins. */
  essential?: boolean;
  zOffset?: number;
  continuityToken?: ContinuityToken;
};

export type BackdropLayerSpec = LayerBase & {
  kind: "backdrop";
  backdrop: SceneBackdropSpec;
};

export type VideoLayerSpec = LayerBase & {
  kind: "video";
  assetId?: string;
  /** Relative path under `public/` when not using assetRegistry. Remote URLs are rejected. */
  src?: string;
  trimBefore?: number;
  playbackRate?: number;
  loop?: boolean;
  fit?: "cover" | "contain";
  tintOpacity?: number;
  fallbackGraphic?: ReactNode;
};

export type ImageLayerSpec = LayerBase & {
  kind: "image";
  assetId?: string;
  /** Relative path under `public/` when not using assetRegistry. Remote URLs are rejected. */
  src?: string;
  fit?: "cover" | "contain";
  alt?: string;
  fallbackGraphic?: ReactNode;
};

export type RenderableLayerKind =
  | "svg"
  | "ui"
  | "diagram"
  | "document"
  | "object"
  | "text";

export type RenderableLayerSpec = LayerBase & {
  kind: RenderableLayerKind;
  render: (ctx: LayerRenderContext) => ReactNode;
  viewBox?: string;
  textBounds?: TextFitCheckInput[];
};

export type LayerSpec =
  | BackdropLayerSpec
  | VideoLayerSpec
  | ImageLayerSpec
  | RenderableLayerSpec;

export type DocumentarySceneDefinition = {
  id: string;
  title: string;
  durationInFrames: number;
  layout: LayoutName;
  look?: LookId;
  motionProfile?: MotionProfileId;
  backdrop?: SceneBackdropSpec;
  layers: LayerSpec[];
  focusTargets?: FocusTarget[];
  camera?: CameraRigSpec;
  stages?: readonly SceneStageSpec[];
  beats?: CompiledDocumentaryBeat[];
  join?: TransitionId;
  joinFrames?: number;
  sharedState?: Record<string, unknown>;
  assetRegistry?: AssetRegistry;
  allowPendingAssets?: boolean;
  debugSafeMargins?: boolean;
};
