import type { CameraKeyframe } from "./camera.ts";

export type SceneStageSpec = {
  id: string;
  from: number;
  camera?: Omit<CameraKeyframe, "at">;
  highlightId?: string;
  state?: Record<string, unknown>;
};

export type ActiveStageResolution = {
  activeStage: SceneStageSpec | null;
  stageIndex: number;
  stageFrame: number;
  mergedState: Record<string, unknown>;
};

export function resolveActiveStage(
  stages: readonly SceneStageSpec[] | undefined,
  sceneFrame: number,
): ActiveStageResolution {
  if (!stages || stages.length === 0) {
    return {
      activeStage: null,
      stageIndex: -1,
      stageFrame: sceneFrame,
      mergedState: {},
    };
  }

  const ordered = [...stages].sort((a, b) => a.from - b.from);
  let activeIndex = -1;
  const mergedState: Record<string, unknown> = {};

  for (let i = 0; i < ordered.length; i++) {
    const st = ordered[i];
    if (sceneFrame >= st.from) {
      activeIndex = i;
      if (st.state) {
        Object.assign(mergedState, st.state);
      }
    }
  }

  if (activeIndex === -1) {
    return {
      activeStage: ordered[0],
      stageIndex: 0,
      stageFrame: 0,
      mergedState: { ...(ordered[0].state ?? {}) },
    };
  }

  const activeStage = ordered[activeIndex];
  return {
    activeStage,
    stageIndex: activeIndex,
    stageFrame: Math.max(0, sceneFrame - activeStage.from),
    mergedState,
  };
}
