import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sam, Alex } from "./characters/ReferenceCharacterRig";
import {
  planMotion,
  evaluateMotion,
  type MotionAction,
  type MotionPlan,
} from "./characters/motionPlanner";
import { legacyWalkingSkeleton } from "./characters/referenceModel";
import { bankState } from "./scenes/bankModel";
import { BankExterior, BankInterior } from "./scenes/BankExample";
import { font } from "./design/tokens";

export const MOVEMENT_DURATION = 600;
const sequence = (...actions: MotionAction[]) => planMotion(actions);
const walk = sequence({
  action: "walking",
  from: 12,
  duration: 240,
  distance: 330,
});
const slow = sequence({
  action: "walking",
  from: 12,
  duration: 270,
  distance: 165,
});
const fast = sequence({
  action: "fastWalking",
  from: 12,
  duration: 240,
  distance: 340,
});
const stopTurn = sequence(
  { action: "carry", from: 12, duration: 160, distance: 210 },
  { action: "turning", from: 180, duration: 90, yaw: -1 },
);
const sitStand = sequence(
  { action: "sitting", from: 12, duration: 110 },
  { action: "standUp", from: 140, duration: 110 },
);
const liftCarry = sequence(
  { action: "pickUp", from: 10, duration: 85 },
  { action: "carry", from: 95, duration: 70 },
  { action: "carry", from: 165, duration: 125, distance: 180 },
);
const gestures = sequence(
  { action: "wave", from: 8, duration: 82 },
  { action: "pointing", from: 90, duration: 90 },
  { action: "nod", from: 180, duration: 95 },
);
const emotions = sequence(
  { action: "celebrating", from: 10, duration: 110 },
  { action: "slumped", from: 140, duration: 130 },
);

const Panel = ({
  x,
  y,
  title,
  children,
}: {
  x: number;
  y: number;
  title: string;
  children: React.ReactNode;
}) => (
  <g transform={`translate(${x},${y})`}>
    <rect
      width={576}
      height={430}
      rx={12}
      fill="#F8FAFC"
      stroke="#CDD5DC"
      strokeWidth={2}
    />
    <text x={24} y={40} fontSize={24} fontWeight={700} fill="#14243A">
      {title}
    </text>
    <svg
      y={55}
      width={576}
      height={367}
      viewBox="0 0 576 367"
      overflow="hidden"
    >
      <path d="M 28 320.1 H 548" stroke="#CBD5E1" strokeWidth={2} />
      {children}
    </svg>
  </g>
);

const Actor = ({
  plan,
  frame,
  x = 90,
  facing = 1,
  alex = false,
  debug = false,
  object = false,
  sitting = false,
}: {
  plan: MotionPlan;
  frame: number;
  x?: number;
  facing?: 1 | -1;
  alex?: boolean;
  debug?: boolean;
  object?: boolean;
  sitting?: boolean;
}) => {
  const rig = evaluateMotion(plan, frame);
  const Character = alex ? Alex : Sam;
  return (
    <g transform={`translate(${x},318) scale(1.05)`}>
      {sitting && (
        <path
          transform="translate(-24,0)"
          d="M -35 -63 H 40 M -30 -63 V 0 M 35 -63 V 0"
          stroke="#64748B"
          strokeWidth={5}
          fill="none"
        />
      )}
      <Character
        facing={facing}
        skeleton={rig}
        debug={debug}
        motion={plan}
        hands={object ? { right: "fist" } : undefined}
      />
      {object && (
        <rect
          transform={`scale(${facing},1)`}
          x={rig.rightArm.end.x - 12}
          y={rig.rightArm.end.y}
          width={32}
          height={22}
          rx={3}
          fill="#D1FAE5"
          stroke="#14243A"
          strokeWidth={2}
        />
      )}
    </g>
  );
};

export const MovementReview = ({ debug = false }: { debug?: boolean }) => {
  const frame = useCurrentFrame(),
    secondPage = frame >= 300,
    f = frame % 300;
  const oldDistance = slow.clips[0].gaitPlan!.rootAt(f);
  const original = legacyWalkingSkeleton(oldDistance);
  // The comparison intentionally retains the old start and stop behavior.
  original.travel = oldDistance;
  return (
    <AbsoluteFill style={{ background: "#EDF0F2", fontFamily: font }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        role="img"
        aria-label="Movement review: gait comparisons, directions, speed, stop, turn, sitting, lifting, handoff, and gestures"
      >
        <text x={64} y={70} fill="#14243A" fontSize={40} fontWeight={800}>
          MOVEMENT REVIEW
        </text>
        <text x={1856} y={68} textAnchor="end" fill="#64748B" fontSize={24}>
          {secondPage ? "Actions and contacts" : "Locomotion"} ·{" "}
          {debug ? "diagnostics on" : "diagnostics off"} · 20 seconds
        </text>
        {!secondPage ? (
          <>
            <Panel x={64} y={116} title="01  Original gait · comparison">
              <Sam x={90} y={318} scale={1.05} skeleton={original} />
            </Panel>
            <Panel x={672} y={116} title="02  Contact gait · same artwork">
              <Actor plan={slow} frame={f} debug={debug} />
            </Panel>
            <Panel x={1280} y={116} title="03  Walk left · Alex">
              <Actor
                plan={walk}
                frame={f}
                x={480}
                facing={-1}
                alex
                debug={debug}
              />
            </Panel>
            <Panel x={64} y={584} title="04  Slow walking · double support">
              <Actor plan={slow} frame={f} debug={debug} />
            </Panel>
            <Panel x={672} y={584} title="05  Fast walking · longer steps">
              <Actor plan={fast} frame={f} debug={debug} />
            </Panel>
            <Panel x={1280} y={584} title="06  Carry · stop · turn">
              <Actor plan={stopTurn} frame={f} object debug={debug} />
            </Panel>
          </>
        ) : (
          <>
            <Panel x={64} y={116} title="07  Sit · shift weight · stand">
              <Actor plan={sitStand} frame={f} x={280} sitting debug={debug} />
            </Panel>
            <Panel x={672} y={116} title="08  Reach · pick up · lift · carry">
              <Actor
                plan={liftCarry}
                frame={f}
                x={110}
                object={f >= 38}
                debug={debug}
              />
              {f < 38 && (
                <rect
                  x={147.35}
                  y={297}
                  width={32}
                  height={22}
                  rx={3}
                  fill="#D1FAE5"
                  stroke="#14243A"
                />
              )}
            </Panel>
            <Panel x={1280} y={116} title="09  Approach · give · receive">
              <svg width={576} height={350} viewBox="520 330 860 560">
                <BankInterior
                  state={bankState(150 + Math.min(149, f))}
                  frame={150 + Math.min(149, f)}
                />
              </svg>
            </Panel>
            <Panel x={64} y={584} title="10  Reach · door contact · release">
              <svg width={576} height={350} viewBox="1000 310 550 570">
                <BankExterior state={bankState(90 + Math.min(59, f))} />
              </svg>
            </Panel>
            <Panel x={672} y={584} title="11  Wave · point · nod transitions">
              <Actor plan={gestures} frame={f} x={280} alex debug={debug} />
            </Panel>
            <Panel x={1280} y={584} title="12  Anticipate · celebrate · slump">
              <Actor plan={emotions} frame={f} x={280} debug={debug} />
            </Panel>
          </>
        )}
        <text x={64} y={1055} fill="#64748B" fontSize={22}>
          {debug
            ? "Teal: bones / support · yellow: joints / swing · pink: COM · red: target error · purple: foot paths"
            : "Deterministic 2D kinematics · production rig preserved · enable debug prop for contacts, balance, joint limits and targets"}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
