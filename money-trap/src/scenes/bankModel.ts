import { limb, mix, type Point } from "../characters/kinematics.ts";
import {
  proportions,
  referenceSkeleton,
  walkingSkeleton,
  distanceFoot,
} from "../characters/referenceModel.ts";

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
export type BankRig = ReturnType<typeof referenceSkeleton>;
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
  const rig = referenceSkeleton({ frame: 60 });
  const reach = proportions.thigh + proportions.shin;
  const maxHeight =
    Math.min(
      Math.sqrt(reach ** 2 - (lf.x + 11) ** 2) - lf.y,
      Math.sqrt(reach ** 2 - (rf.x - 11) ** 2) - rf.y,
    ) - 0.25;
  rig.hip = p(0, -Math.min(hipHeight, maxHeight));
  rig.shoulder = p(0, rig.hip.y - proportions.torso);
  rig.head = p(0, rig.shoulder.y - 49);
  rig.leftLeg = limb(
    p(-11, rig.hip.y),
    lf,
    proportions.thigh,
    proportions.shin,
    1,
  );
  rig.rightLeg = limb(
    p(11, rig.hip.y),
    rf,
    proportions.thigh,
    proportions.shin,
    -1,
  );
  rig.leftArm = limb(
    p(-29, rig.shoulder.y + 9),
    left,
    proportions.upperArm,
    proportions.forearm,
    1,
  );
  rig.rightArm = limb(
    p(29, rig.shoulder.y + 9),
    right,
    proportions.upperArm,
    proportions.forearm,
    -1,
  );
  rig.travel = 0;
  return rig;
}
function setHand(actor: BankActor, side: "left" | "right", target: Point) {
  const local = toLocal(actor, target);
  actor.rig[side === "left" ? "leftArm" : "rightArm"] = limb(
    actor.rig[side === "left" ? "leftArm" : "rightArm"].root,
    local,
    proportions.upperArm,
    proportions.forearm,
    side === "left" ? 1 : -1,
  );
}

// Stance positions stay fixed in world space, even while root velocity eases in/out.
export const bankFoot = distanceFoot;
export function walkingSam(
  frame: number,
  startX: number,
  endX: number,
  from: number,
  to: number,
  carrying = true,
): BankActor {
  const scale = 1.65,
    x = startX + (endX - startX) * smooth(frame, from, to);
  const distance = (x - startX) / scale;
  let lf = bankFoot(distance, 0),
    rf = bankFoot(distance, 1);
  if (frame >= to) {
    const settleFoot = (foot: Point, target: Point, start: number) => {
      const t = smooth(frame, start, start + 6);
      return {
        ...mix(foot, target, t),
        y: foot.y * (1 - t) - Math.sin(t * Math.PI) * 12,
      };
    };
    lf = settleFoot(lf, p(-20, 0), to);
    rf = settleFoot(rf, p(20, 0), to + 6);
  }
  const settle = smooth(frame, to, to + 12);
  const rig = walkingSkeleton(distance, 1 - settle, { left: lf, right: rf });
  rig.travel = 0;
  if (carrying)
    rig.rightArm = limb(rig.rightArm.root, p(54, rig.hip.y - 32), 44, 44, -1);
  return { x, y: BANK_FLOOR, scale, facing: 1, rig };
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
      : walkingSam(Math.min(frame, 90), 650, 1260, 0, 78);
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
    setHand(sam, "left", mix(resting, doorHandle, reach));
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
