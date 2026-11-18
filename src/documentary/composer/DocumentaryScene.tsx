import { useCurrentFrame } from "remotion";
import { LayerComposer } from "./LayerComposer";
import { SceneLayout } from "./SceneLayout";
import type { DocumentarySceneDefinition } from "./types";

export function DocumentaryScene({
  scene,
  frame: frameOverride,
}: {
  scene: DocumentarySceneDefinition;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const sceneFrame = frameOverride ?? current;

  return (
    <SceneLayout
      layout={scene.layout}
      backdrop={scene.backdrop}
      debugSafeMargins={scene.debugSafeMargins}
    >
      <LayerComposer
        sceneId={scene.id}
        layout={scene.layout}
        layers={scene.layers}
        sceneFrame={sceneFrame}
        sceneDuration={scene.durationInFrames}
        focusTargets={scene.focusTargets}
        beats={scene.beats}
        sharedState={scene.sharedState}
        assetRegistry={scene.assetRegistry}
        allowPendingAssets={scene.allowPendingAssets}
      />
    </SceneLayout>
  );
}
