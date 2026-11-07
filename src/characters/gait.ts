import { mix, type Point } from "./kinematics.ts";
import { clamp, ease } from "./jointConstraints.ts";

export const gaitPhases = [
  "initial contact",
  "loading response",
  "midstance",
  "terminal stance",
  "pre-swing",
  "initial swing",
  "midswing",
  "terminal swing",
] as const;
export type FootContact = {
  point: Point;
  planted: boolean;
  phase: (typeof gaitPhases)[number];
  phaseProgress: number;
  angle: number;
  kneeFlexion?: number;
  load?: number;
  contact?: { point: Point; pivot: Point };
};

const stanceKnee = (phase: number) => {
  const keys = [
    [0, 5],
    [0.18, 15],
    [0.5, 4],
    [0.83, 4],
    [1, 35],
  ];
  for (let i = 1; i < keys.length; i++) {
    const [from, a] = keys[i - 1],
      [to, b] = keys[i];
    if (phase <= to) return a + (b - a) * ease((phase - from) / (to - from));
  }
  return 35;
};

/** The shoe's original sole is at local y=2. Rotate around its loaded edge. */
export function footRocker(plant: Point, angle: number, pivotX: number) {
  const radians = (angle * Math.PI) / 180;
  const pivot = { x: pivotX, y: 2 };
  const contact = { x: plant.x + pivot.x, y: plant.y + pivot.y };
  return {
    point: {
      x:
        contact.x - (Math.cos(radians) * pivot.x - Math.sin(radians) * pivot.y),
      y:
        contact.y - (Math.sin(radians) * pivot.x + Math.cos(radians) * pivot.y),
    },
    contact: { point: contact, pivot },
  };
}

function plantedFoot(
  plant: Point,
  phase: number,
  angle: number,
  load: number,
): FootContact {
  const index =
    phase < 0.033
      ? 0
      : phase < 0.2
        ? 1
        : phase < 0.517
          ? 2
          : phase < 0.833
            ? 3
            : 4;
  return {
    ...footRocker(plant, angle, angle < 0 ? -8 : angle > 0 ? 10 : 0),
    angle,
    planted: true,
    phase: gaitPhases[index],
    phaseProgress: phase,
    kneeFlexion: stanceKnee(phase),
    load,
  };
}
export type Step = {
  side: 0 | 1;
  lift: number;
  land: number;
  from: Point;
  to: Point;
};
export type GaitOptions = {
  from: number;
  to: number;
  distance: number;
  fps?: number;
  stance?: number;
  stepLength?: number;
  clearance?: number;
  settleFrames?: number;
  initialFeet?: readonly [Point, Point];
};
export type GaitPlan = ReturnType<typeof planGait>;

export function planGait(options: GaitOptions) {
  const {
    from,
    to,
    distance,
    fps = 30,
    stance = 0.6,
    clearance = 14,
    settleFrames = 18,
  } = options;
  if (
    ![from, to, distance, fps, stance, clearance, settleFrames].every(
      Number.isFinite,
    ) ||
    to <= from ||
    fps <= 0 ||
    distance < 0 ||
    stance < 0.5 ||
    stance > 0.75 ||
    clearance < 0 ||
    settleFrames <= 0
  )
    throw new Error("Invalid gait timing, distance, or stance");
  const speed = distance / ((to - from) / fps);
  const stepLength = options.stepLength ?? clamp(22 + speed * 0.22, 24, 52);
  if (!Number.isFinite(stepLength) || stepLength <= 0)
    throw new Error("Step length must be positive");
  const initial = options.initialFeet ?? [
    { x: -20, y: 0 },
    { x: 20, y: 0 },
  ];
  if (
    initial.some(
      (p) => !Number.isFinite(p.x) || !Number.isFinite(p.y) || p.y !== 0,
    )
  )
    throw new Error("Initial feet must be finite floor contacts");
  const rootAt = (frame: number) =>
    distance * ease((frame - from) / (to - from));
  const velocityAt = (frame: number) => {
    const t = clamp((frame - from) / (to - from), 0, 1);
    return (distance * 30 * t * t * (1 - t) ** 2) / (to - from);
  };
  const steps: Step[] = [];
  const feet: [Point, Point] = [{ ...initial[0] }, { ...initial[1] }];
  // Step count adapts to distance; frame spacing controls cadence. Anticipation
  // precedes the first lift, and the final two recovery steps end in double support.
  const count =
    distance === 0 ? 0 : Math.max(2, Math.ceil(distance / stepLength));
  const frameAtDistance = (position: number) => {
    let low = from,
      high = to;
    for (let i = 0; i < 32; i++) {
      const mid = (low + high) / 2;
      if (rootAt(mid) < position) low = mid;
      else high = mid;
    }
    return (low + high) / 2;
  };
  const lifts = Array.from({ length: count + 1 }, (_, i) =>
    i === 0
      ? Math.min(from + 4, from + (to - from) * 0.05)
      : frameAtDistance((i * distance) / count),
  );
  for (let i = 0; i < count; i++) {
    const side = (i % 2) as 0 | 1;
    const lift = lifts[i],
      period = lifts[i + 1] - lift;
    const land = lift + period * 2 * (1 - stance);
    const landing = {
      x:
        rootAt(land) +
        Math.min((distance / count) * 0.45, velocityAt(land) * period * 0.5) +
        (side === 0 ? -4 : 4),
      y: 0,
    };
    steps.push({ side, lift, land, from: feet[side], to: landing });
    feet[side] = landing;
  }
  // Recovery belongs after deceleration. Reaching the final stance several
  // steps early forces the swing leg straight and buckles the support knee.
  for (let i = 0; count && i < 2; i++) {
    const side = ((count + i) % 2) as 0 | 1;
    const lift = to + i * settleFrames * 0.7 * 0.6;
    const landing = { x: distance + (side === 0 ? -20 : 20), y: 0 };
    steps.push({
      side,
      lift,
      land: lift + settleFrames * 0.7 * 0.4,
      from: feet[side],
      to: landing,
    });
    feet[side] = landing;
  }
  return {
    from,
    to,
    distance,
    fps,
    stance,
    clearance,
    stepLength,
    steps,
    landingFrames: settleFrames * 0.3,
    initial,
    rootAt,
    velocityAt,
    end: steps.length ? steps.at(-1)!.land + settleFrames * 0.3 : to,
  };
}

export function sampleFoot(
  plan: GaitPlan,
  frame: number,
  side: 0 | 1,
): FootContact {
  let point = plan.initial[side];
  let lastLand = -Infinity;
  for (const step of plan.steps) {
    if (step.side !== side) continue;
    if (frame < step.lift) {
      const warmup = Math.min(6, step.lift - plan.from);
      const phase = Number.isFinite(lastLand)
        ? clamp((frame - lastLand) / (step.lift - lastLand || 1), 0, 1)
        : 0.5 + 0.5 * ease((frame - step.lift + warmup) / warmup);
      const angle =
        phase < 0.2
          ? -8 * (1 - ease(phase / 0.2))
          : 22 * ease((phase - 0.55) / 0.45);
      const load = ease(phase / 0.2) * (1 - ease((phase - 0.83) / 0.17));
      return plantedFoot(point, phase, angle, load);
    }
    if (frame < step.land) {
      const u = (frame - step.lift) / (step.land - step.lift);
      const lift = 64 * u ** 3 * (1 - u) ** 3;
      const start = footRocker(step.from, 22, 10).point;
      const end = footRocker(step.to, -8, -8).point;
      const ankle = mix(start, end, ease(u));
      return {
        point: {
          ...ankle,
          y: ankle.y - plan.clearance * lift,
        },
        planted: false,
        phase: gaitPhases[u < 0.33 ? 5 : u < 0.67 ? 6 : 7],
        phaseProgress: u,
        angle: 22 * (1 - ease(u / 0.35)) - 8 * ease((u - 0.75) / 0.25),
        load: 0,
      };
    }
    point = step.to;
    lastLand = step.land;
  }
  const loading = ease((frame - lastLand) / plan.landingFrames);
  return plantedFoot(point, loading * 0.5, -8 * (1 - loading), loading);
}

export function sampleGait(plan: GaitPlan, frame: number) {
  if (!Number.isFinite(frame)) throw new Error("Gait frame must be finite");
  const left = sampleFoot(plan, frame, 0),
    right = sampleFoot(plan, frame, 1);
  const speed = plan.velocityAt(frame);
  const loading = Math.max(
    left.planted
      ? 0
      : 64 * left.phaseProgress ** 3 * (1 - left.phaseProgress) ** 3,
    right.planted
      ? 0
      : 64 * right.phaseProgress ** 3 * (1 - right.phaseProgress) ** 3,
  );
  return {
    root: plan.rootAt(frame),
    speed,
    left,
    right,
    doubleSupport: left.planted && right.planted,
    // Midstance passes over the support leg; double support absorbs the landing.
    pelvisHeight: 104 + loading * 4,
    // Lateral shift is a projected cue toward the supporting leg.
    weightShift: (left.planted ? -1 : 1) * loading * 2.5,
  };
}
