import {
  referenceSkeleton,
  type ReferenceExpression,
  type ReferencePose,
} from "../characters/referenceModel.ts";
import { evaluateMotion, planMotion } from "../characters/motionPlanner.ts";
import type { PerformanceActor } from "../scenes/cinematicModel.ts";

export type EpisodeMotion = {
  kind:
    | "celebrate"
    | "notice"
    | "think"
    | "decide"
    | "relax"
    | "work"
    | "walk"
    | "sign"
    | "use"
    | "cancel"
    | "compare"
    | "allocate"
    | "calendar"
    | "transfer"
    | "scope"
    | "hobby"
    | "meal"
    | "close";
  from: number;
  duration: number;
  objects: string[];
};
export const motionProgress = (frame: number, from: number, duration = 36) => {
  const p = Math.max(0, Math.min(1, (frame - from) / duration));
  return p * p * (3 - 2 * p);
};
export const interactionPulse = (frame: number, motion: EpisodeMotion) =>
  Math.sin(Math.PI * motionProgress(frame, motion.from, motion.duration));
export function createEpisodeActor(
  options: {
    identity?: "Sam" | "Alex";
    x?: number;
    y?: number;
    scale?: number;
    pose?: ReferencePose;
    expression?: ReferenceExpression;
    carry?: boolean;
    facing?: 1 | -1;
  },
  motion: EpisodeMotion | null,
  frame: number,
): PerformanceActor {
  const {
    identity = "Sam",
    x = 650,
    y = 940,
    scale = 2.15,
    pose = "standing",
    expression = "thinking",
    carry = false,
    facing = 1,
  } = options;
  if (!motion)
    return {
      identity,
      x,
      y,
      scale,
      facing,
      expression,
      rig: referenceSkeleton({
        frame: 60,
        pose,
        fromPose: pose,
        gesture: carry ? "holdWallet" : undefined,
        blendFrames: 1,
      }),
    };
  const elapsed = Math.max(0, Math.min(motion.duration, frame - motion.from));
  const phase = motionProgress(frame, motion.from, motion.duration);
  const target: ReferencePose =
    pose !== "standing" || carry
      ? pose
      : motion.kind === "celebrate"
        ? "celebrating"
        : motion.kind === "notice"
          ? "slumped"
          : motion.kind === "decide" || motion.kind === "compare"
            ? "explaining"
            : motion.kind === "think"
              ? "thinking"
              : pose;
  let rig = referenceSkeleton({
    frame: elapsed,
    pose: target,
    fromPose: target === "sitting" && !carry ? "sitting" : "standing",
    gesture: carry ? "holdWallet" : undefined,
    blendFrames: motion.duration,
  });
  let actorX = x;
  if (motion.kind === "walk" && pose !== "sitting") {
    const distance = 70;
    const plan = planMotion([
      { action: "walking", from: 0, duration: motion.duration, distance },
      {
        action: "standing",
        from: motion.duration,
        duration: 30,
        // eslint-disable-next-line @remotion/non-pure-animation -- Motion planner frame count, not a CSS transition.
        transition: 12,
      },
    ]);
    rig = evaluateMotion(
      plan,
      Math.max(0, Math.min(motion.duration + 30, frame - motion.from)),
    );
    actorX -= distance * scale * facing;
  }
  rig.nod +=
    Math.sin(Math.PI * phase) *
    (motion.kind === "notice"
      ? 6
      : motion.kind === "relax" || motion.kind === "meal"
        ? -5
        : 3);
  return { identity, x: actorX, y, scale, facing, expression, rig };
}
