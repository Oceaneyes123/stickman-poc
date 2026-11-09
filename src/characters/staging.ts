import { solveBody, floorContact, type Skeleton } from "./biomechanics.ts";
import type { Point } from "./kinematics.ts";

export type StageActor = {
  x: number;
  y: number;
  scale: number;
  facing: 1 | -1;
  rig: Skeleton;
};
export const toWorld = (actor: StageActor, point: Point): Point => ({
  x: actor.x + point.x * actor.scale * actor.facing,
  y: actor.y + point.y * actor.scale,
});
export const toLocal = (actor: StageActor, point: Point): Point => ({
  x: (point.x - actor.x) / (actor.scale * actor.facing),
  y: (point.y - actor.y) / actor.scale,
});

export function placeHands(
  actor: StageActor,
  hands: Partial<Record<"left" | "right", Point>>,
  lean = actor.rig.shoulder.x - actor.rig.hip.x,
) {
  const rig = actor.rig;
  actor.rig = solveBody({
    hip: rig.hip,
    lean,
    turn: rig.turn,
    yaw: rig.yaw,
    nod: rig.nod,
    dynamic: rig.balance?.dynamic,
    speed: rig.balance ? (rig.balance.captureX - rig.balance.center.x) / 5 : 0,
    armBends: [rig.leftArm.bend, rig.rightArm.bend],
    feet: rig.feet ?? [
      floorContact(rig.leftLeg.end.x),
      floorContact(rig.rightLeg.end.x),
    ],
    hands: {
      left: hands.left ? toLocal(actor, hands.left) : rig.leftArm.target,
      right: hands.right ? toLocal(actor, hands.right) : rig.rightArm.target,
    },
  });
}
