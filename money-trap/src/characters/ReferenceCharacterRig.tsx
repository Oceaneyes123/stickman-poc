import { useCurrentFrame } from "remotion";
import type { Gesture } from "./kinematics";
import {
  referenceSkeleton,
  handRotation,
  type ReferenceExpression,
  type ReferencePose,
} from "./referenceModel";

export const characterColors = {
  ink: "#0F172A",
  paper: "#F8FAFC",
  blue: "#3B82F6",
  blueShade: "#2563AB",
  green: "#10B981",
  gray: "#64748B",
  red: "#EF4444",
  yellow: "#FACC15",
};
export type ReferenceCharacterProps = {
  expression?: ReferenceExpression;
  pose?: ReferencePose;
  fromPose?: ReferencePose;
  gesture?: Gesture;
  x?: number;
  y?: number;
  scale?: number;
  facing?: 1 | -1;
  actionFrom?: number;
  blendFrames?: number;
  backpack?: boolean;
  skeleton?: ReturnType<typeof referenceSkeleton>;
  hands?: { left?: HandKind; right?: HandKind };
};
type FaceProps = {
  identity: "Sam" | "Alex";
  expression: ReferenceExpression;
  turn?: number;
};
const K = characterColors;

export const CharacterFace = ({
  identity,
  expression,
  turn = 0,
}: FaceProps) => {
  const happy = ["happy", "excited", "relieved"].includes(expression);
  const worried = ["worried", "stressed", "sad"].includes(expression);
  const eyeY = expression === "sad" ? 3 : expression === "shocked" ? -2 : 0;
  const gaze =
    expression === "curious" ? 3 : expression === "thinking" ? -2 : 0;
  return (
    <g
      data-part="face"
      stroke={K.ink}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={-40 + 5 * turn} cy={3} r={5} fill={K.paper} />
      <circle
        cx={40 - 5 * turn}
        cy={3}
        r={5}
        fill={K.paper}
        opacity={1 - turn}
      />
      <path
        d="M 0 -42 C 25 -42 42 -24 42 0 C 42 26 24 43 0 43 C -24 43 -42 26 -42 0 C -42 -24 -25 -42 0 -42 Z"
        fill={K.paper}
        strokeWidth={3.5}
        transform={`scale(${1 - 0.12 * turn},1)`}
      />
      <g transform={`translate(${10 * turn},0) scale(${1 - 0.3 * turn},1)`}>
        {expression === "relieved" ? (
          <g fill="none" transform="translate(0,3)">
            <path d="M -22 1 Q -16 7 -10 1 M 10 1 Q 16 7 22 1" />
          </g>
        ) : (
          <g fill={K.ink} stroke="none">
            <ellipse
              cx={-16 + gaze}
              cy={eyeY + 3}
              rx={3.2}
              ry={expression === "shocked" ? 6.5 : 5}
            />
            <ellipse
              cx={16 + gaze}
              cy={eyeY + 3}
              rx={3.2}
              ry={expression === "shocked" ? 6.5 : 5}
            />
          </g>
        )}
        <g
          data-part="eyebrows"
          fill="none"
          strokeWidth={2.5}
          transform={
            identity === "Alex" ? "translate(0,-7)" : "translate(0,-5)"
          }
        >
          {worried ? (
            <path d="M -24 -12 L -10 -17 M 10 -17 L 24 -12" />
          ) : expression === "frustrated" ? (
            <path d="M -25 -17 L -10 -12 M 10 -12 L 25 -17" />
          ) : expression === "confident" ? (
            <path d="M -24 -15 Q -17 -20 -10 -16 M 10 -18 Q 19 -23 25 -17" />
          ) : expression === "curious" ? (
            <path d="M -24 -11 L -10 -11 M 9 -19 Q 18 -24 25 -17" />
          ) : (
            <path d="M -24 -14 Q -17 -19 -10 -15 M 10 -15 Q 17 -19 24 -14" />
          )}
        </g>
        <path
          d="M 1 10 l -2 6 h 4"
          fill="none"
          strokeWidth={1.6}
          opacity={0.45}
        />
        <g
          transform={identity === "Alex" ? "translate(0,7)" : "translate(0,3)"}
        >
          {happy ? (
            <g>
              <path
                d="M -18 13 Q 0 18 18 13 Q 13 31 0 31 Q -13 31 -18 13 Z"
                fill={K.ink}
                strokeWidth={2.5}
              />
              <path
                d="M -10 25 Q 0 19 10 25 Q 0 33 -10 25 Z"
                fill={K.red}
                stroke="none"
              />
              <path
                d="M -13 15 Q 0 18 13 15 L 10 19 H -10 Z"
                fill={K.paper}
                stroke="none"
              />
            </g>
          ) : expression === "shocked" ? (
            <ellipse cx={0} cy={20} rx={8} ry={11} fill={K.ink} />
          ) : expression === "stressed" ? (
            <g>
              <path
                d="M -17 15 Q 0 9 17 15 L 16 26 Q 0 22 -16 26 Z"
                fill={K.paper}
              />
              <path d="M -9 15 V 24 M 0 13 V 23 M 9 15 V 24" strokeWidth={2} />
            </g>
          ) : expression === "worried" ? (
            <path d="M -12 23 Q -2 15 12 20" fill="none" />
          ) : expression === "sad" ? (
            <path d="M -13 26 Q 0 12 13 26" fill="none" />
          ) : expression === "frustrated" ? (
            <path d="M -12 23 Q 0 11 12 23" fill="none" />
          ) : expression === "thinking" || expression === "curious" ? (
            <path d="M -7 21 Q 4 17 13 21" fill="none" />
          ) : (
            <path d="M -13 16 Q 0 27 13 16" fill="none" />
          )}
        </g>
        {identity === "Alex" && (
          <g data-part="glasses" fill="none" strokeWidth={3}>
            <circle cx={-18} cy={1} r={13} />
            <circle cx={18} cy={1} r={13} />
            <path d="M -5 0 Q 0 -4 5 0 M -31 -1 L -40 -5 M 31 -1 L 40 -5" />
            <path
              d="M -27 -3 Q -25 -7 -22 -8 M 9 -3 Q 11 -7 14 -8"
              stroke="#A8BBC9"
              strokeWidth={1.2}
            />
          </g>
        )}
        {expression === "excited" && (
          <path
            d="M -48 -30 l -6 -9 M -55 -16 l -10 -2 M 48 -30 l 6 -9"
            stroke={K.yellow}
            strokeWidth={5}
          />
        )}
        {expression === "stressed" && (
          <path
            d="M 47 -27 Q 58 -12 47 -11 Q 39 -12 47 -27 Z"
            fill={K.yellow}
            strokeWidth={2.5}
          />
        )}
        {expression === "frustrated" && (
          <path
            d="M 46 -35 v 8 h 8 M 58 -43 v 8 h 8"
            fill="none"
            stroke={K.red}
          />
        )}
      </g>
    </g>
  );
};

type HandKind = "rest" | "open" | "point" | "fist" | "wave";
const Hand = ({
  x,
  y,
  kind,
  left = false,
  angle = 0,
}: {
  x: number;
  y: number;
  kind: HandKind;
  left?: boolean;
  angle?: number;
}) => (
  <g
    transform={`translate(${x},${y}) rotate(${angle}) scale(${left ? -1 : 1},1)`}
    fill={K.paper}
    stroke={K.ink}
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {kind === "wave" || kind === "open" ? (
      <g transform="scale(0.7)" strokeWidth={3.1}>
        <path d="M -6 1 L -7 -4 Q -10 -7 -13 -11 Q -16 -15 -13 -17 Q -10 -19 -7 -14 L -5 -11 L -5 -23 Q -5 -27 -2 -27 Q 1 -27 1 -23 L 1 -14 L 2 -28 Q 2 -32 5 -32 Q 8 -32 8 -28 L 8 -14 L 9 -25 Q 9 -29 12 -28 Q 15 -28 15 -24 L 14 -12 L 16 -20 Q 17 -24 20 -22 Q 23 -21 21 -17 L 17 -5 Q 16 -1 6 1 Z" />
        <path d="M -2 -8 Q 4 -11 10 -7" fill="none" strokeWidth={1.6} />
      </g>
    ) : kind === "point" ? (
      <g>
        <path d="M -4 1 L -5 -5 Q -8 -6 -7 -10 Q -6 -12 -3 -13 L -3 -24 Q -3 -27 0 -27 Q 3 -27 3 -24 L 3 -14 Q 6 -16 8 -13 Q 11 -14 12 -10 L 11 -4 Q 10 1 4 1 Z" />
        <path d="M -4 -6 Q 1 -9 4 -6 L 2 -3" fill="none" strokeWidth={1.2} />
      </g>
    ) : kind === "fist" ? (
      <g>
        <path d="M -4 1 L -6 -3 Q -9 -4 -9 -8 Q -9 -12 -6 -13 Q -5 -17 -1 -16 Q 2 -19 5 -16 Q 9 -16 10 -12 L 10 -6 Q 10 -1 4 1 Z" />
        <path
          d="M -6 -5 Q -1 -9 3 -5 M -2 -15 v 4 M 4 -15 v 3"
          fill="none"
          strokeWidth={1.2}
        />
      </g>
    ) : (
      <g>
        <path d="M -4 1 L -5 -5 Q -8 -8 -6 -13 Q -4 -17 0 -17 Q 4 -17 6 -13 L 7 -10 Q 11 -10 10 -6 L 6 -2 L 4 1 Z" />
        <path d="M 6 -10 Q 1 -11 1 -6" fill="none" strokeWidth={1.2} />
      </g>
    )}
  </g>
);

export const ReferenceCharacterRig = ({
  identity = "Sam",
  expression = "neutral",
  pose = "standing",
  fromPose = "standing",
  gesture,
  x = 0,
  y = 0,
  scale = 1,
  facing = 1,
  actionFrom = 0,
  blendFrames = 24,
  backpack = false,
  skeleton,
  hands,
}: ReferenceCharacterProps & { identity?: "Sam" | "Alex" }) => {
  const frame = useCurrentFrame();
  const rig =
    skeleton ??
    referenceSkeleton({
      frame,
      pose,
      fromPose,
      gesture,
      actionFrom,
      blendFrames,
    });
  const { hip, shoulder, head, leftArm, rightArm, leftLeg, rightLeg } = rig;
  const turn = rig.turn;
  const bodyTurn = `translate(${shoulder.x},0) scale(${1 - 0.36 * turn},1) translate(${-shoulder.x},0)`;
  const sam = identity === "Sam";
  const shirt = sam ? K.blue : K.paper;
  const armPath = (part: typeof leftArm) =>
    `M ${part.root.x} ${part.root.y} Q ${part.joint.x} ${part.joint.y} ${part.joint.x} ${part.joint.y} L ${part.end.x} ${part.end.y}`;
  const legPath = (part: typeof leftLeg) =>
    `M ${part.root.x} ${part.root.y} L ${part.joint.x} ${part.joint.y} L ${part.end.x} ${part.end.y}`;
  const sleeve = (part: typeof leftArm) => (
    <g fill="none" strokeLinecap="butt" strokeLinejoin="round">
      <circle cx={part.root.x} cy={part.root.y} r={8.5} fill={K.ink} />
      <circle cx={part.root.x} cy={part.root.y} r={5.5} fill={shirt} />
      <path d={armPath(part)} stroke={K.ink} strokeWidth={17} />
      <path d={armPath(part)} stroke={shirt} strokeWidth={11} />
      <path
        d={`M ${part.end.x - (part.end.x - part.joint.x) * 0.13} ${part.end.y - (part.end.y - part.joint.y) * 0.13} L ${part.end.x} ${part.end.y}`}
        stroke={sam ? K.blueShade : "#E2E8EE"}
        strokeWidth={11}
      />
    </g>
  );
  const shrug = pose === "confused" || gesture === "shrug";
  const openRight = pose === "explaining" || shrug || gesture === "wave";
  const leftKind: HandKind =
    hands?.left ?? (pose === "celebrating" ? "fist" : shrug ? "open" : "rest");
  const rightKind: HandKind =
    hands?.right ??
    (gesture === "wave"
      ? "wave"
      : pose === "pointing" || gesture === "pointAt"
        ? "point"
        : pose === "celebrating" || gesture === "holdWallet"
          ? "fist"
          : openRight
            ? "open"
            : "rest");
  return (
    <g
      transform={`translate(${x + rig.travel * scale * facing}, ${y}) scale(${scale * facing},${scale})`}
      data-character={identity}
      data-pose={pose}
    >
      <title>
        {identity}: {expression}, {pose}
      </title>
      <ellipse cy={7} rx={47} ry={6} fill={K.ink} opacity={0.13} />
      {pose === "sitting" && (
        <path
          d="M -44 -63 H 44 M -38 -63 V 0 M 38 -63 V 0"
          fill="none"
          stroke={K.gray}
          strokeWidth={7}
        />
      )}
      {backpack && (
        <g stroke={K.ink} strokeWidth={3.5} transform={bodyTurn}>
          <path
            d={`M ${shoulder.x - 26} ${shoulder.y + 7} Q ${shoulder.x - 61} ${shoulder.y + 4} ${hip.x - 48} ${hip.y - 4} Q ${hip.x - 37} ${hip.y + 8} ${hip.x - 18} ${hip.y - 4} Z`}
            fill={K.gray}
            stroke={K.ink}
            strokeWidth={3.5}
          />
          <path
            d={`M ${hip.x - 48} ${hip.y - 41} Q ${hip.x - 39} ${hip.y - 47} ${hip.x - 27} ${hip.y - 42} L ${hip.x - 29} ${hip.y - 13} Q ${hip.x - 39} ${hip.y - 8} ${hip.x - 46} ${hip.y - 15} Z`}
            fill="#8290A2"
            strokeWidth={1.8}
          />
          <path
            d={`M ${hip.x - 44} ${hip.y - 35} h 14 m -3 0 v 5`}
            fill="none"
            strokeWidth={1.3}
          />
        </g>
      )}
      <g
        data-part="legs"
        fill="none"
        stroke={K.ink}
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={legPath(leftLeg)} opacity={1 - 0.4 * turn} />
        <path d={legPath(rightLeg)} />
        {[leftLeg, rightLeg].map((part, i) => (
          <g
            key={i}
            transform={`translate(${part.end.x},${part.end.y})`}
            strokeWidth={2}
            opacity={i === 0 ? 1 - 0.4 * turn : 1}
          >
            <path
              d="M -9 1 L -9 -3 Q -5 -7 1 -4 L 9 -2 Q 14 0 10 2 H -8 Z"
              fill={K.ink}
            />
            <path d="M -7 1 H 9" stroke="#64748B" strokeWidth={1} />
          </g>
        ))}
      </g>
      <g
        data-part="sleeves"
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="round"
      >
        {[leftArm, rightArm].map((part, index) => (
          <g key={index} opacity={index === 1 ? 1 - turn : 1}>
            {sleeve(part)}
          </g>
        ))}
      </g>
      <g
        data-part="torso"
        stroke={K.ink}
        strokeWidth={3.5}
        strokeLinejoin="round"
        transform={bodyTurn}
      >
        <path
          d={`M ${shoulder.x - 26} ${shoulder.y + 1} Q ${shoulder.x} ${shoulder.y - 13} ${shoulder.x + 26} ${shoulder.y + 1} C ${shoulder.x + 29} ${shoulder.y + 28} ${hip.x + 23} ${hip.y - 27} ${hip.x + 25} ${hip.y + 2} Q ${hip.x} ${hip.y + 7} ${hip.x - 25} ${hip.y + 2} C ${hip.x - 24} ${hip.y - 25} ${shoulder.x - 29} ${shoulder.y + 30} ${shoulder.x - 26} ${shoulder.y + 1} Z`}
          fill={shirt}
        />
        {sam ? (
          <g fill="none" strokeWidth={2.3}>
            <path
              d={`M ${shoulder.x - 20} ${shoulder.y + 1} Q ${shoulder.x - 18} ${shoulder.y - 14} ${shoulder.x} ${shoulder.y - 13} Q ${shoulder.x + 18} ${shoulder.y - 14} ${shoulder.x + 20} ${shoulder.y + 1} L ${shoulder.x + 12} ${shoulder.y + 12} L ${shoulder.x} ${shoulder.y + 8} L ${shoulder.x - 12} ${shoulder.y + 12} Z`}
              fill={K.blueShade}
            />
            <path
              d={`M ${shoulder.x - 8} ${shoulder.y + 8} v 25 M ${shoulder.x + 8} ${shoulder.y + 8} v 29`}
              stroke={K.paper}
              strokeWidth={2}
            />
            <circle
              cx={shoulder.x - 8}
              cy={shoulder.y + 33}
              r={1.3}
              fill={K.paper}
              stroke="none"
            />
            <circle
              cx={shoulder.x + 8}
              cy={shoulder.y + 37}
              r={1.3}
              fill={K.paper}
              stroke="none"
            />
            <path
              d={`M ${hip.x - 14} ${hip.y - 25} Q ${hip.x} ${hip.y - 30} ${hip.x + 14} ${hip.y - 25} L ${hip.x + 18} ${hip.y - 11} Q ${hip.x} ${hip.y - 7} ${hip.x - 18} ${hip.y - 11} Z`}
              stroke={K.blueShade}
              strokeWidth={1.8}
            />
            <path
              d={`M ${hip.x - 24} ${hip.y - 4} h 48`}
              stroke={K.blueShade}
              strokeWidth={1.8}
            />
          </g>
        ) : (
          <g fill={K.paper} strokeWidth={2.2}>
            <path
              d={`M ${shoulder.x - 18} ${shoulder.y - 3} l 18 12 -9 11 -13 -16 Z M ${shoulder.x + 18} ${shoulder.y - 3} l -18 12 9 11 13 -16 Z`}
            />
            <path
              d={`M ${shoulder.x} ${shoulder.y + 14} L ${hip.x} ${hip.y - 6}`}
              fill="none"
              stroke="#8997A6"
              strokeWidth={1.4}
            />
            {[32, 49, 66].map((offset) => (
              <circle
                key={offset}
                cx={shoulder.x + 4}
                cy={shoulder.y + offset}
                r={1.2}
                fill="#64748B"
                stroke="none"
              />
            ))}
          </g>
        )}
      </g>
      {backpack && (
        <g fill="none" strokeLinecap="round" transform={bodyTurn}>
          <path
            d={`M ${shoulder.x - 21} ${shoulder.y + 4} Q ${shoulder.x - 15} ${shoulder.y + 34} ${hip.x - 20} ${hip.y - 9}`}
            stroke={K.ink}
            strokeWidth={6}
          />
          <path
            d={`M ${shoulder.x - 21} ${shoulder.y + 4} Q ${shoulder.x - 15} ${shoulder.y + 34} ${hip.x - 20} ${hip.y - 9}`}
            stroke={K.gray}
            strokeWidth={3.5}
          />
        </g>
      )}
      {turn > 0 && <g opacity={turn}>{sleeve(rightArm)}</g>}
      <g
        data-part="head"
        transform={`translate(${head.x},${head.y}) rotate(${rig.nod})`}
      >
        <path d="M 0 37 V 49" stroke={K.ink} strokeWidth={7} />
        <CharacterFace
          identity={identity}
          expression={expression}
          turn={turn}
        />
      </g>
      {gesture === "holdWallet" && (
        <g
          transform={`translate(${rightArm.end.x - 25},${rightArm.end.y + 4})`}
          stroke={K.ink}
          strokeWidth={3}
        >
          <rect width={39} height={28} rx={5} fill="#B68448" />
          <path d="M 25 9 h 15 v 11 H 25 Z" fill={K.yellow} />
        </g>
      )}
      <Hand
        {...leftArm.end}
        kind={leftKind}
        angle={handRotation(leftArm, "left", leftKind === "open")}
        left
      />
      <Hand
        {...rightArm.end}
        kind={rightKind}
        angle={handRotation(rightArm, "right", rightKind === "open")}
      />
    </g>
  );
};
export const Sam = (props: ReferenceCharacterProps) => (
  <ReferenceCharacterRig {...props} identity="Sam" />
);
export const Alex = (props: ReferenceCharacterProps) => (
  <ReferenceCharacterRig {...props} identity="Alex" />
);
