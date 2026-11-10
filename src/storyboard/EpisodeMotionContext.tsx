import { createContext, useContext } from "react";
import {
  createEpisodeActor,
  motionProgress,
  type EpisodeMotion,
} from "./episodeMotion";
export const EpisodeMotionContext = createContext<{
  frame: number;
  motion: EpisodeMotion;
} | null>(null);
export function useActorFactory() {
  const current = useContext(EpisodeMotionContext);
  return (options: Parameters<typeof createEpisodeActor>[0] = {}) =>
    createEpisodeActor(options, current?.motion ?? null, current?.frame ?? 60);
}
export function useObjectMotion(target: string) {
  const current = useContext(EpisodeMotionContext);
  if (!current || !current.motion.objects.includes(target)) return null;
  return {
    ...current,
    p: motionProgress(
      current.frame,
      current.motion.from,
      current.motion.duration,
    ),
  };
}
