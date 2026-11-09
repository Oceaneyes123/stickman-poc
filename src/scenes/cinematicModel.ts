import {
  beat,
  beatProgress,
  began,
  type DirectedSequence,
} from "../animation/direction.ts";
import { floorContact, solveBody } from "../characters/biomechanics.ts";
import { ease, clamp } from "../characters/jointConstraints.ts";
import { evaluateMotion, planMotion } from "../characters/motionPlanner.ts";
import { mix, type Point } from "../characters/kinematics.ts";
import { placeHands, toWorld, type StageActor } from "../characters/staging.ts";
import type { ReferenceExpression } from "../characters/referenceModel.ts";
import { cinema } from "../design/tokens.ts";
import { example } from "../finance/math.ts";
import {
  budget,
  rent,
  transport,
  monthOne,
  monthTwo,
  samThreeMonths,
  alexThreeMonths,
} from "../storyboard/remainingShots.ts";

export const referenceMoney = {
  raise: example.raise,
  rent,
  transport,
  raiseRemainder: example.raise - rent - transport,
  samThreeMonths,
  alexThreeMonths,
  periodGap: alexThreeMonths - samThreeMonths,
  samMonthly: budget.sam,
  alexMonthly: budget.alex,
  monthlyGap: budget.alex - budget.sam,
};
export const stage = {
  floor: cinema.framing.floor,
  scale: cinema.framing.actorScale,
  phoneRest: { x: 805, y: 682 },
  phoneRead: { x: 755, y: 640 },
  laptopRest: { x: 1040, y: 690 },
  folderMouth: { x: 540, y: 675 },
  receiptHeld: { x: 500, y: 700 },
  keysRest: { x: 520, y: 700 },
} as const;
export type PerformanceActor = StageActor & {
  identity: "Sam" | "Alex";
  expression: ReferenceExpression;
};
const standing = () =>
  solveBody({
    hip: { x: 0, y: -111 },
    feet: [floorContact(-20), floorContact(20)],
  });
const actor = (
  identity: "Sam" | "Alex",
  x: number,
  scale: number = stage.scale,
): PerformanceActor => ({
  identity,
  x,
  y: stage.floor,
  scale,
  facing: 1,
  rig: standing(),
  expression: "thinking",
});
const emotion = (
  sequence: DirectedSequence,
  identity: "Sam" | "Alex",
  frame: number,
) =>
  sequence.beats
    .filter(
      (b) =>
        b.expression && b.targets.includes(identity) && b.startFrame <= frame,
    )
    .sort((a, b) => a.startFrame - b.startFrame)
    .at(-1)?.expression ?? "thinking";
const phase = (sequence: DirectedSequence, id: string, frame: number) => {
  const b = beat(sequence, id);
  return clamp((frame - b.startFrame) / (b.endFrame - b.startFrame), 0, 1);
};

export type ApartmentState = {
  kind: "apartment";
  location: "sam-old" | "sam-new";
  sam: PerformanceActor;
  phone: Point;
  phoneAttached: boolean;
  laptop: { grip: Point; open: number; attached: boolean };
  entering: boolean;
};
export type IllusionState = {
  kind: "raise-illusion";
  sam: PerformanceActor;
  quote: number;
  raise: number;
  rent: number;
  allocation: number;
  remainder: number;
};
export type ComparisonActor = {
  actor: PerformanceActor;
  filed: number;
  receipt?: { grip: Point; index: number; amount: number | null };
  keys: Point;
  keysAttached: boolean;
};
export type ComparisonState = {
  kind: "comparison";
  sam: ComparisonActor;
  alex: ComparisonActor;
  period: number;
  samTotal: number;
  alexTotal: number;
  periodGap: number;
  sameRaise: number;
  costs: number;
  monthly: number;
  samMonthly: number;
  alexMonthly: number;
  monthlyGap: number;
  benefits: number;
};
export type ReferenceState = ApartmentState | IllusionState | ComparisonState;

export function createReferencePerformance(
  sequence: DirectedSequence,
): (frame: number) => ReferenceState {
  const p = (id: string, frame: number) => beatProgress(sequence, id, frame);
  if (sequence.id === "apartment") {
    const enter = beat(sequence, "enter-room");
    const walk = planMotion([
      {
        action: "carry",
        from: enter.startFrame,
        duration: enter.endFrame - enter.startFrame,
        distance: (900 - 370) / stage.scale,
      },
    ]);
    return (frame) => {
      const entering = began(sequence, "enter-room", frame);
      const sam = actor("Sam", entering ? 370 : 650);
      sam.expression = emotion(sequence, "Sam", frame);
      if (!entering) {
        const rest = toWorld(sam, sam.rig.rightArm.end);
        let right = mix(rest, stage.phoneRest, p("reach-phone", frame));
        right = mix(right, stage.phoneRead, p("lift-phone", frame));
        right = mix(right, stage.phoneRest, p("return-phone", frame));
        right = mix(right, rest, p("release-phone", frame));
        placeHands(sam, { right }, 3 * p("look-phone", frame));
        sam.rig.nod = 3 * p("look-phone", frame) - 2 * p("return-phone", frame);
        const attached =
          began(sequence, "lift-phone", frame) &&
          !began(sequence, "release-phone", frame);
        return {
          kind: "apartment",
          location: "sam-old",
          sam,
          phone: attached
            ? toWorld(sam, sam.rig.rightArm.end)
            : stage.phoneRest,
          phoneAttached: attached,
          laptop: { grip: { x: 1110, y: 690 }, open: 0, attached: false },
          entering,
        };
      }
      sam.rig = evaluateMotion(walk, frame);
      const rightCarry = toWorld(sam, sam.rig.rightArm.end);
      const carried = mix(
        rightCarry,
        stage.laptopRest,
        p("place-laptop", frame),
      );
      const placed = frame >= beat(sequence, "place-laptop").endFrame;
      let right = carried;
      let left = { x: carried.x - 140, y: carried.y };
      const leftRest = toWorld(sam, sam.rig.leftArm.end);
      left = mix(left, leftRest, p("release-laptop", frame));
      const opening = p("open-laptop", frame);
      if (began(sequence, "open-laptop", frame))
        right = {
          x: stage.laptopRest.x,
          y: stage.laptopRest.y - 110 * opening,
        };
      const rightRest = {
        x: 900 + 54 * stage.scale,
        y: stage.floor - 97 * stage.scale,
      };
      right = mix(right, rightRest, p("settle-room", frame));
      placeHands(
        sam,
        { left, right },
        3 * p("place-laptop", frame) - 3 * p("settle-room", frame),
      );
      sam.rig.nod = 2 * p("notice-desk", frame) - 2 * p("settle-room", frame);
      const grip = placed
        ? stage.laptopRest
        : toWorld(sam, sam.rig.rightArm.end);
      return {
        kind: "apartment",
        location: "sam-new",
        sam,
        phone: stage.phoneRest,
        phoneAttached: false,
        laptop: { grip, open: opening, attached: !placed },
        entering,
      };
    };
  }
  if (sequence.id === "raise-illusion")
    return (frame) => {
      const sam = actor("Sam", 740);
      sam.expression = emotion(sequence, "Sam", frame);
      const rest = toWorld(sam, sam.rig.rightArm.end);
      let right = mix(rest, { x: 900, y: 660 }, p("tap-quote", frame));
      right = mix(right, rest, p("manageable", frame));
      right = mix(right, { x: 830, y: 660 }, p("realize-commitment", frame));
      right = mix(right, rest, p("check-whole-plan", frame));
      placeHands(
        sam,
        { right },
        -2 * p("manageable", frame) +
          8 * p("realize-commitment", frame) -
          4 * p("check-whole-plan", frame),
      );
      sam.rig.nod =
        3 * p("manageable", frame) -
        3 * p("realize-commitment", frame) +
        2 * p("check-whole-plan", frame);
      return {
        kind: "raise-illusion",
        sam,
        quote: p("quote-amount", frame),
        raise: p("raise-amount", frame),
        rent: p("rent-amount", frame),
        allocation: p("allocate-once", frame),
        remainder: p("eighty-remains", frame),
      };
    };
  if (sequence.id !== "comparison")
    throw new Error(`No reference performance for ${sequence.id}`);
  const fileActor = (
    identity: "Sam" | "Alex",
    frame: number,
  ): ComparisonActor => {
    const who = identity.toLowerCase();
    const person = actor(identity, 350, 1.95);
    person.rig = solveBody({
      hip: person.rig.hip,
      feet: person.rig.feet!,
      turn: 0.35,
      lean: 2,
      yaw: 1,
    });
    person.expression = emotion(sequence, identity, frame);
    const rest = toWorld(person, person.rig.rightArm.end);
    const files = beat(sequence, `${who}-files`);
    let right: Point = stage.receiptHeld,
      filed = 0,
      receipt: ComparisonActor["receipt"];
    if (frame >= files.startFrame && frame < files.endFrame) {
      const t = phase(sequence, files.id, frame) * 3;
      const index = Math.min(2, Math.floor(t)),
        u = t - index;
      filed = index + (u >= 0.65 ? 1 : 0);
      right =
        u < 0.65
          ? mix(stage.receiptHeld, stage.folderMouth, ease(u / 0.65))
          : mix(
              stage.folderMouth,
              index === 2 ? rest : stage.receiptHeld,
              ease((u - 0.65) / 0.35),
            );
      if (u < 0.65)
        receipt = {
          grip: right,
          index,
          amount:
            identity === "Sam"
              ? [monthOne, monthTwo, budget.sam][index]
              : budget.alex,
        };
    } else if (frame >= files.endFrame) {
      filed = 3;
      right = rest;
    } else receipt = { grip: right, index: 0, amount: null };
    const monthly = p("monthly-mode", frame),
      benefits = p("benefits-mode", frame);
    if (began(sequence, "monthly-mode", frame)) {
      right = mix(rest, stage.receiptHeld, monthly);
      right = mix(right, rest, benefits);
      if (benefits < 1)
        receipt = {
          grip: right,
          index: 2,
          amount: began(sequence, `${who}-monthly`, frame)
            ? identity === "Sam"
              ? budget.sam
              : budget.alex
            : null,
        };
    }
    if (
      began(
        sequence,
        identity === "Sam" ? "sam-checks-costs" : "alex-checks-plan",
        frame,
      ) &&
      !began(sequence, "monthly-mode", frame)
    )
      right = mix(
        rest,
        { x: 510, y: 655 },
        p(identity === "Sam" ? "sam-checks-costs" : "alex-checks-plan", frame),
      );
    let keys: Point = stage.keysRest,
      keysAttached = false;
    if (began(sequence, `${who}-benefit`, frame)) {
      const amount = p(`${who}-benefit`, frame);
      if (identity === "Sam") {
        right = mix(rest, stage.keysRest, ease(Math.min(1, amount * 2)));
        const lift = ease(Math.max(0, amount * 2 - 1));
        right = mix(right, { x: 500, y: 650 }, lift);
        keys = lift > 0 ? right : stage.keysRest;
        keysAttached = lift > 0;
      } else right = mix(rest, { x: 530, y: 660 }, amount);
      right = mix(
        right,
        identity === "Sam" ? { x: 500, y: 650 } : rest,
        p(`${who}-resolve`, frame),
      );
      receipt = undefined;
    }
    const leftRest = toWorld(person, person.rig.leftArm.end);
    const left =
      identity === "Sam"
        ? mix(
            mix(leftRest, { x: 250, y: 700 }, p("sam-benefit", frame)),
            leftRest,
            p("sam-resolve", frame),
          )
        : leftRest;
    placeHands(person, { right, left }, 3 * p(`${who}-benefit`, frame));
    if (receipt) receipt.grip = toWorld(person, person.rig.rightArm.end);
    if (keysAttached) keys = toWorld(person, person.rig.rightArm.end);
    person.rig.nod = 2 * p(`${who}-resolve`, frame);
    return { actor: person, filed, receipt, keys, keysAttached };
  };
  return (frame) => {
    const closed = p("close-period", frame),
      monthly = p("monthly-mode", frame),
      benefits = p("benefits-mode", frame);
    return {
      kind: "comparison",
      sam: fileActor("Sam", frame),
      alex: fileActor("Alex", frame),
      period: 1 - closed,
      samTotal: p("sam-period-total", frame) * (1 - closed),
      alexTotal: p("alex-period-total", frame) * (1 - closed),
      periodGap: p("period-difference", frame) * (1 - closed),
      sameRaise: p("same-raise", frame) * (1 - monthly),
      costs: p("show-costs", frame) * (1 - monthly),
      monthly: monthly * (1 - benefits),
      samMonthly: p("sam-monthly", frame) * (1 - benefits),
      alexMonthly: p("alex-monthly", frame) * (1 - benefits),
      monthlyGap: p("monthly-difference", frame) * (1 - benefits),
      benefits,
    };
  };
}
