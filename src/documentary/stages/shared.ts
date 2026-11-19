import type { TransitionId } from "../../transitions";
import type { AssetRegistry } from "../assets/registry";
import type { CameraRigSpec } from "../core/camera";
import type { FocusTarget } from "../core/focus";
import {
  LAYOUTS,
  getRegionEntryDirection,
  region,
  type LayoutName,
  type Rect,
} from "../core/geometry";
import type { ContainerStyle, LookId, LookTokens } from "../core/looks";
import type { MotionProfileId } from "../core/motionProfiles";
import type { SceneStageSpec } from "../core/stages";
import type { LayerSpec } from "../composer/types";
import type { CompiledDocumentaryBeat } from "../timeline";

export type CommonStageParams = {
  id: string;
  title: string;
  durationInFrames: number;
  look?: LookId;
  layout?: LayoutName;
  motionProfile?: MotionProfileId;
  container?: ContainerStyle;
  camera?: CameraRigSpec;
  focusTargets?: FocusTarget[];
  stages?: readonly SceneStageSpec[];
  beats?: CompiledDocumentaryBeat[];
  join?: TransitionId;
  joinFrames?: number;
  assetRegistry?: AssetRegistry;
  extraLayers?: LayerSpec[];
};

export function pickRegionPair(
  layout: LayoutName,
): { primary: Rect; secondary: Rect } {
  const map = LAYOUTS[layout] as Record<string, Rect>;
  if ("main" in map && "side" in map) {
    return { primary: map.side, secondary: map.main };
  }
  if ("rail" in map && "primary" in map) {
    return { primary: map.rail, secondary: map.primary };
  }
  if ("left" in map && "right" in map) {
    return { primary: map.left, secondary: map.right };
  }
  if ("header" in map && "stage" in map) {
    return { primary: map.header, secondary: map.stage };
  }
  if ("top" in map && "bottom" in map) {
    return { primary: map.top, secondary: map.bottom };
  }
  if ("presenter" in map && "graphic" in map) {
    return { primary: map.presenter, secondary: map.graphic };
  }
  if ("document" in map && "notes" in map) {
    return { primary: map.notes, secondary: map.document };
  }
  if ("headline" in map && "track" in map) {
    return { primary: map.headline, secondary: map.track };
  }
  if ("safe" in map) {
    return { primary: map.safe, secondary: map.safe };
  }
  const keys = Object.keys(map).filter((k) => k !== "full");
  return {
    primary: map[keys[0]] ?? region("single", "safe"),
    secondary: map[keys[1] ?? keys[0]] ?? region("single", "safe"),
  };
}

export function isLightOnRegion(look: LookTokens, rect: Rect): boolean {
  if (look.polarity === "light") return true;
  if (look.polarity === "split") {
    return rect.x + rect.width / 2 >= 864;
  }
  return false;
}

export function entryDirectionFor(rect: Rect) {
  return getRegionEntryDirection(rect);
}
