import { mix, type Point } from "../characters/kinematics.ts";
import {
  type Skeleton,
  floorContact,
  solveBody,
  offsetSkeleton,
} from "../characters/biomechanics.ts";
import { evaluateMotion, planMotion } from "../characters/motionPlanner.ts";

export const BANK_TIMING = {
  fps: 30,
  duration: 300,
  door: 90,
  interior: 150,
  handleContact: 108,
  doorOpen: 132,
  handoff: 240,
  release: 249,
  received: 278,
} as const;
export const BANK_FLOOR = 840;
export const smooth = (frame: number, from: number, to: number) => {
  const t = Math.max(0, Math.min(1, (frame - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
const p = (x: number, y: number): Point => ({ x, y });
export type BankRig = Skeleton;
export type BankActor = {
  x: number;
  y: number;
  scale: number;
  facing: 1 | -1;
  rig: BankRig;
};
export const toWorld = (actor: BankActor, point: Point): Point => ({
  x: actor.x + point.x * actor.scale * actor.facing,
  y: actor.y + point.y * actor.scale,
});
const toLocal = (actor: BankActor, point: Point): Point => ({
  x: (point.x - actor.x) / (actor.scale * actor.facing),
  y: (point.y - actor.y) / actor.scale,
});
export const samePoint = (a: Point, b: Point) =>
  Math.hypot(a.x - b.x, a.y - b.y);

function body(
  hipHeight = 111,
  lf = p(-20, 0),
  rf = p(20, 0),
  left = p(-39, -97),
  right = p(54, -143),
): BankRig {
  return solveBody({
    hip: p(0, -hipHeight),
    feet: [floorContact(lf.x), floorContact(rf.x)],
    hands: { left, right },
  });
}
function setHand(
  actor: BankActor,
  side: "left" | "right",
  target: Point,
  lift = 0,
) {
  actor.rig = solveBody({
    hip: actor.rig.hip,
    lean: actor.rig.shoulder.x - actor.rig.hip.x,
    turn: actor.rig.turn,
    armBends: [actor.rig.leftArm.bend, actor.rig.rightArm.bend],
    nod: actor.rig.nod,
    dynamic: actor.rig.balance?.dynamic,
    speed: actor.rig.balance
      ? (actor.rig.balance.captureX - actor.rig.balance.center.x) / 5
      : 0,
    shoulderLift: side === "left" ? [lift, 0] : [0, lift],
    feet: actor.rig.feet ?? [
      floorContact(actor.rig.leftLeg.end.x),
      floorContact(actor.rig.rightLeg.end.x),
    ],
    hands: {
      left: actor.rig.leftArm.target,
      right: actor.rig.rightArm.target,
      [side]: toLocal(actor, target),
    },
  });
}

export function walkingSam(
  frame: number,
  startX: number,
  endX: number,
  from: number,
  to: number,
  carrying = true,
): BankActor {
  if (![frame, startX, endX, from, to].every(Number.isFinite) || to <= from)
    throw new Error(
      "Walking path must have finite values and positive duration",
    );
  const scale = 1.65,
    facing = endX >= startX ? 1 : -1;
  const distance = Math.abs(endX - startX) / scale;
  const plan = planMotion([
    {
      action: carrying ? "carry" : "walking",
      from,
      duration: to - from + Math.min(20, (to - from) / 3),
      distance,
    },
  ]);
  const rig = evaluateMotion(plan, frame);
  const root = plan.clips[0].gaitPlan!.rootAt(frame);
  return {
    x: startX + root * scale * facing,
    y: BANK_FLOOR,
    scale,
    facing,
    rig: offsetSkeleton(rig, -root),
  };
}

export function bankState(frame: number) {
  if (!Number.isInteger(frame) || frame < 0 || frame >= BANK_TIMING.duration)
    throw new Error("Bank example frame must be an integer from 0 to 299");
  const scene = frame < 90 ? "approach" : frame < 150 ? "door" : "handoff";
  const doorProgress = smooth(frame, 108, 132);
  const angle = (doorProgress * Math.PI * 75) / 180;
  const doorHandle = p(1390 - 240 * Math.cos(angle), 565 + Math.sin(angle) * 4);
  const sam =
    scene === "handoff"
      ? walkingSam(frame, 620, 860, 150, 196)
      : walkingSam(frame, 650, 1260, 0, 78);
  const alex: BankActor = {
    x: 1170,
    y: BANK_FLOOR,
    scale: 1.65,
    facing: -1,
    rig: body(111, p(-20, 0), p(20, 0), p(-39, -97), p(39, -97)),
  };
  let money = toWorld(sam, sam.rig.rightArm.end);
  money = p(money.x + 32, money.y + 17);
  if (scene === "door") {
    const resting = toWorld(sam, sam.rig.leftArm.end);
    const reach = smooth(frame, 90, 108) * (1 - smooth(frame, 134, 144));
    // Elevate the reaching shoulder slightly as the handle passes the chest.
    setHand(sam, "left", mix(resting, doorHandle, reach), 8 * reach);
  }
  if (scene === "handoff") {
    const samRest = toWorld(sam, sam.rig.rightArm.end);
    const samContact = p(988, 591),
      alexContact = p(1052, 591);
    const give = smooth(frame, 208, 235);
    const offered = mix(samRest, samContact, give);
    const release = smooth(frame, 249, 276);
    setHand(sam, "right", mix(offered, toWorld(sam, p(39, -97)), release));
    const receive = smooth(frame, 218, 240);
    const alexRest = toWorld(alex, alex.rig.rightArm.end);
    const retract = smooth(frame, 251, 278);
    const alexHeld = toWorld(alex, p(54, -143));
    setHand(
      alex,
      "right",
      mix(mix(alexRest, alexContact, receive), alexHeld, retract),
    );
    money =
      frame <= 249
        ? p(offered.x + 32, offered.y + 17)
        : p(
            toWorld(alex, alex.rig.rightArm.end).x - 32,
            toWorld(alex, alex.rig.rightArm.end).y + 17,
          );
    alex.rig.nod =
      frame >= 260 && frame <= 290
        ? Math.sin(((frame - 260) / 30) * Math.PI * 2) * 4
        : 0;
  }
  return {
    scene,
    sam,
    alex,
    money,
    owner: frame <= 249 ? ("Sam" as const) : ("Alex" as const),
    doorProgress,
    doorHandle,
  };
}
