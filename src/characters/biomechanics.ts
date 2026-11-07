import { limb, mix, type Point } from "./kinematics.ts";
import {
  clamp,
  defaultAnatomy,
  validateLimit,
  type Anatomy,
  type Bend,
} from "./jointConstraints.ts";
import type { FootContact } from "./gait.ts";

export const proportions = {
  torso: 81,
  upperArm: 44,
  forearm: 44,
  thigh: 56,
  shin: 56,
  headRadius: 42,
} as const;
export type Limb = ReturnType<typeof limb>;
export type Skeleton = {
  hip: Point;
  shoulder: Point;
  head: Point;
  travel: number;
  turn: number;
  nod: number;
  leftArm: Limb;
  rightArm: Limb;
  leftLeg: Limb;
  rightLeg: Limb;
  yaw?: number;
  feet?: readonly [FootContact, FootContact];
  balance?: Balance;
  handKinds?: { left?: HandKind; right?: HandKind };
};
export type HandKind = "rest" | "open" | "point" | "fist" | "wave";
// Relative segment masses, normalized by estimateCenterOfMass().
export const segmentMasses = {
  torso: 0.5,
  head: 0.08,
  upperArm: 0.028,
  forearm: 0.022,
  thigh: 0.1,
  shin: 0.06,
};
export type Masses = typeof segmentMasses;
export function estimateCenterOfMass(
  rig: Skeleton,
  masses: Masses = segmentMasses,
): Point {
  if (
    Object.values(masses).some((v) => !Number.isFinite(v) || v < 0) ||
    Object.values(masses).every((v) => v === 0)
  )
    throw new Error("Segment masses must be nonnegative with positive total");
  const segments: [Point, number][] = [
    [mix(rig.hip, rig.shoulder, 0.55), masses.torso],
    [rig.head, masses.head],
  ];
  for (const [part, upper, lower] of [
    [rig.leftArm, masses.upperArm, masses.forearm],
    [rig.rightArm, masses.upperArm, masses.forearm],
    [rig.leftLeg, masses.thigh, masses.shin],
    [rig.rightLeg, masses.thigh, masses.shin],
  ] as const) {
    segments.push(
      [mix(part.root, part.joint, 0.44), upper],
      [mix(part.joint, part.end, 0.43), lower],
    );
  }
  const total = segments.reduce((sum, [, mass]) => sum + mass, 0);
  return segments.reduce(
    (sum, [p, m]) => ({
      x: sum.x + (p.x * m) / total,
      y: sum.y + (p.y * m) / total,
    }),
    { x: 0, y: 0 },
  );
}
export function supportRegion(
  feet: readonly FootContact[],
  seat?: readonly [number, number],
) {
  const contacts = feet.filter((f) => f.planted).map((f) => f.point.x);
  if (seat) contacts.push(seat[0], seat[1]);
  return contacts.length
    ? { min: Math.min(...contacts) - 9, max: Math.max(...contacts) + 11 }
    : null;
}
export type Balance = {
  center: Point;
  support: ReturnType<typeof supportRegion>;
  stable: boolean;
  dynamic: boolean;
  captureX: number;
};

// FK for unconstrained arm swing; exact hand contacts use limb() instead.
export function armFK(
  root: Point,
  angle: number,
  flexion: number,
  bend: 1 | -1,
): Point {
  const a = (angle * Math.PI) / 180,
    b = a + (bend * flexion * Math.PI) / 180;
  return {
    x: root.x + Math.sin(a) * 44 + Math.sin(b) * 44,
    y: root.y + Math.cos(a) * 44 + Math.cos(b) * 44,
  };
}
export type BodyIntent = {
  hip: Point;
  lean?: number;
  turn?: number;
  yaw?: number;
  feet: readonly [FootContact, FootContact];
  hands?: { left?: Point; right?: Point };
  armAngles?: readonly [number, number];
  armFlexions?: readonly [number, number];
  armBends?: readonly [Bend, Bend];
  handKinds?: Skeleton["handKinds"];
  shoulderLift?: readonly [number, number];
  nod?: number;
  speed?: number;
  dynamic?: boolean;
  supportExtension?: number;
  seat?: readonly [number, number];
  anatomy?: Anatomy;
  masses?: Masses;
};
export const floorContact = (x: number): FootContact => ({
  point: { x, y: 0 },
  planted: true,
  phase: "midstance",
  phaseProgress: 0,
  angle: 0,
});

export function offsetSkeleton(rig: Skeleton, x: number): Skeleton {
  const point = (p: Point) => ({ x: p.x + x, y: p.y });
  const part = (p: Limb): Limb => ({
    ...p,
    root: point(p.root),
    joint: point(p.joint),
    end: point(p.end),
    target: point(p.target),
  });
  return {
    ...rig,
    hip: point(rig.hip),
    shoulder: point(rig.shoulder),
    head: point(rig.head),
    leftArm: part(rig.leftArm),
    rightArm: part(rig.rightArm),
    leftLeg: part(rig.leftLeg),
    rightLeg: part(rig.rightLeg),
    feet: rig.feet?.map((f) => ({
      ...f,
      point: point(f.point),
      contact: f.contact && { ...f.contact, point: point(f.contact.point) },
    })) as Skeleton["feet"],
    balance: rig.balance && {
      ...rig.balance,
      center: point(rig.balance.center),
      captureX: rig.balance.captureX + x,
      support: rig.balance.support && {
        min: rig.balance.support.min + x,
        max: rig.balance.support.max + x,
      },
    },
  };
}

export function solveBody(intent: BodyIntent): Skeleton {
  const anatomy = intent.anatomy ?? defaultAnatomy;
  validateLimit(anatomy.knee);
  validateLimit(anatomy.elbow);
  if (
    ![
      intent.hip.x,
      intent.hip.y,
      intent.lean ?? 0,
      intent.speed ?? 0,
      intent.turn ?? 0,
      intent.yaw ?? 1,
      intent.supportExtension ?? 0,
      ...intent.feet.flatMap((f) => [f.point.x, f.point.y]),
    ].every(Number.isFinite)
  )
    throw new Error("Body intent must contain finite points and motion values");
  const turn = intent.turn ?? 0,
    hipWidth = 11 - turn * 7;
  const yaw = intent.yaw ?? 1;
  const armWidth = (29 - turn * 5) * (0.8 + 0.2 * Math.abs(yaw));
  const hip = { ...intent.hip };
  const lean = clamp(intent.lean ?? 0, -35, 35);
  const feet = intent.feet;
  const support = supportRegion(feet, intent.seat);
  const speed = intent.speed ?? 0;
  const dynamic = intent.dynamic ?? Math.abs(speed) > 0.05;
  let rig: Skeleton;
  const build = (): Skeleton => {
    if (intent.supportExtension) {
      const supports = feet.flatMap((foot, i) => {
        if (!foot.planted || foot.kneeFlexion === undefined) return [];
        const flexion = clamp(
          foot.kneeFlexion,
          anatomy.knee.min,
          anatomy.knee.max,
        );
        const reachSquared =
          56 ** 2 * 2 + 2 * 56 ** 2 * Math.cos((flexion * Math.PI) / 180);
        const dx = foot.point.x - (hip.x + (i === 0 ? -hipWidth : hipWidth));
        return [
          {
            y: foot.point.y - Math.sqrt(Math.max(0, reachSquared - dx ** 2)),
            weight: foot.load ?? 1,
          },
        ];
      });
      const weight = supports.reduce((sum, s) => sum + s.weight, 0);
      if (weight > 1e-8) {
        const y = supports.reduce((sum, s) => sum + s.y * s.weight, 0) / weight;
        hip.y =
          intent.hip.y +
          (y - intent.hip.y) * clamp(intent.supportExtension, 0, 1);
      }
    }
    const legReach = Math.sqrt(
      56 ** 2 * 2 + 2 * 56 ** 2 * Math.cos((anatomy.knee.min * Math.PI) / 180),
    );
    const maxHipY = Math.max(
      ...feet.map((foot, i) => {
        const dx = foot.point.x - (hip.x + (i === 0 ? -hipWidth : hipWidth));
        return (
          foot.point.y -
          Math.sqrt(Math.max(0, legReach ** 2 - dx ** 2)) +
          0.0001
        );
      }),
    );
    // Raising a pelvis past reach would detach a planted ankle from the floor.
    hip.y = Math.max(hip.y, maxHipY);
    const shoulder = {
      x: hip.x + lean,
      y: hip.y - Math.sqrt(81 ** 2 - lean ** 2),
    };
    const roots = [
      {
        x: shoulder.x - armWidth,
        y: shoulder.y + 9 - (intent.shoulderLift?.[0] ?? 0),
      },
      {
        x: shoulder.x + armWidth,
        y: shoulder.y + 9 - (intent.shoulderLift?.[1] ?? 0),
      },
    ];
    const arms = roots.map((root, i) => {
      // Changing the bend plane passes through extension. A positive minimum
      // keeps the configured plane because this 2D rig cannot cross it smoothly.
      const bend =
        anatomy.elbow.min > 0
          ? anatomy.elbows[i]
          : (intent.armBends?.[i] ?? anatomy.elbows[i]);
      const flexion = clamp(
        intent.armFlexions?.[i] ?? 18,
        anatomy.elbow.min,
        anatomy.elbow.max,
      );
      return limb(
        root,
        (i === 0 ? intent.hands?.left : intent.hands?.right) ??
          armFK(
            root,
            // Swing angles describe the arm's centerline; elbow flexion is
            // distributed either side so a pole change does not move the wrist.
            (intent.armAngles?.[i] ?? (i === 0 ? -11 : 11)) -
              (bend * flexion) / 2,
            flexion,
            bend,
          ),
        44,
        44,
        { limits: anatomy.elbow, bend },
      );
    });
    const legs = feet.map((foot, i) =>
      limb(
        { x: hip.x + (i === 0 ? -hipWidth : hipWidth), y: hip.y },
        foot.point,
        56,
        56,
        { limits: anatomy.knee, bend: anatomy.knees[i] },
      ),
    );
    return {
      hip: { ...hip },
      shoulder,
      head: { x: shoulder.x - lean * 0.35, y: shoulder.y - 49 },
      leftArm: arms[0],
      rightArm: arms[1],
      leftLeg: legs[0],
      rightLeg: legs[1],
      travel: 0,
      turn,
      nod: intent.nod ?? 0,
      yaw: intent.yaw ?? 1,
      feet,
      handKinds: intent.handKinds,
    };
  };
  rig = build();
  // Kinematic weight transfer, not force integration. In motion, permit COM to
  // lead/trail support and use a velocity-based capture estimate for diagnostics.
  for (let i = 0; i < 5 && support && !dynamic; i++) {
    const center = estimateCenterOfMass(rig, intent.masses);
    const target = clamp(center.x, support.min + 2, support.max - 2);
    const correction = clamp(target - center.x, -6, 6);
    if (Math.abs(correction) < 0.001) break;
    hip.x += correction;
    rig = build();
  }
  const center = estimateCenterOfMass(rig, intent.masses);
  rig.balance = {
    center,
    support,
    dynamic,
    captureX: center.x + speed * 5,
    stable: !!support && center.x >= support.min && center.x <= support.max,
  };
  return rig;
}
