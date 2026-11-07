import { useCurrentFrame } from "remotion";
import { progress } from "../animation/motion";
import { C } from "../design/tokens";
import {
  limb,
  mix,
  walkFoot,
  type Expression,
  type Gesture,
  type Point,
  type Pose,
} from "./kinematics";

export type CharacterProps = {
  expression?: Expression;
  pose?: Pose;
  fromPose?: Pose;
  gesture?: Gesture;
  x?: number;
  y?: number;
  scale?: number;
  actionFrom?: number;
  blendFrames?: number;
  facing?: 1 | -1;
};
type RigProps = CharacterProps & { identity?: "Sam" | "Alex" };
const point = (x: number, y: number): Point => ({ x, y });
function poseTargets(pose: Pose) {
  const hip = point(
    0,
    pose === "sitting"
      ? -95
      : pose === "slumped" || pose === "walking"
        ? -145
        : -152,
  );
  const lean = pose === "slumped" ? 22 : pose === "thinking" ? -8 : 0;
  const shoulder = point(lean, hip.y - Math.sqrt(98 * 98 - lean * lean));
  const left = point(-49, -128),
    right = point(49, -128);
  if (pose === "celebrating") {
    left.x = -83;
    left.y = -313;
    right.x = 83;
    right.y = -313;
  }
  if (pose === "pointing") {
    right.x = 143;
    right.y = -237;
  }
  if (pose === "thinking") {
    right.x = 17;
    right.y = -261;
  }
  if (pose === "slumped") {
    left.y = -113;
    right.y = -113;
  }
  if (pose === "sitting") {
    left.y = -81;
    right.y = -81;
  }
  return {
    hip,
    shoulder,
    left,
    right,
    lf: point(pose === "sitting" ? -62 : -27, 0),
    rf: point(pose === "sitting" ? 62 : 27, 0),
  };
}

export const StickmanRig = ({
  identity = "Sam",
  expression = "neutral",
  pose = "standing",
  fromPose = "standing",
  gesture,
  x = 0,
  y = 0,
  scale = 1,
  actionFrom = 0,
  blendFrames = 24,
  facing = 1,
}: RigProps) => {
  const frame = useCurrentFrame();
  const time = Math.max(0, frame - actionFrom);
  const p = progress(frame, actionFrom, blendFrames);
  const a = poseTargets(fromPose),
    b = poseTargets(pose);
  const hip = mix(a.hip, b.hip, p),
    shoulder = mix(a.shoulder, b.shoulder, p);
  const left = mix(a.left, b.left, p),
    right = mix(a.right, b.right, p);
  const lf = mix(a.lf, b.lf, p),
    rf = mix(a.rf, b.rf, p);
  // Anticipation stays in the torso; the IK legs preserve floor contact.
  const anticipation =
    Math.sin(Math.min(time / 10, 1) * Math.PI) *
    (pose === "celebrating" ? 6 : 2);
  shoulder.x -= anticipation * 1.5;
  shoulder.y = hip.y - Math.sqrt(98 * 98 - (shoulder.x - hip.x) ** 2);
  const gest = progress(frame, actionFrom, 22);
  let nod = 0;
  if (gesture === "wave") {
    right.x +=
      (91 +
        Math.sin(time * 0.24) * 9 * (1 - progress(time, 40, 20)) -
        right.x) *
      gest;
    right.y += (-300 - right.y) * gest;
  }
  if (gesture === "nod")
    nod = Math.sin((Math.min(time, 45) / 45) * Math.PI * 4) * 7 * gest;
  if (gesture === "shrug") {
    left.x += (-91 - left.x) * gest;
    right.x += (91 - right.x) * gest;
    left.y += (-221 - left.y) * gest;
    right.y += (-221 - right.y) * gest;
  }
  if (gesture === "reach" || gesture === "pointAt") {
    right.x += (143 - right.x) * gest;
    right.y += (-222 - right.y) * gest;
  }
  if (gesture === "holdWallet") {
    right.x += (63 - right.x) * gest;
    right.y += (-171 - right.y) * gest;
  }
  if (gesture === "reactToBill") {
    left.x += (-38 - left.x) * gest;
    right.x += (38 - right.x) * gest;
    left.y += (-266 - left.y) * gest;
    right.y += (-266 - right.y) * gest;
  }
  let walkX = 0;
  if (pose === "walking") {
    // The first stride starts from a stable, planted stance; gallery allows room for travel.
    const walkingFrame = Math.max(0, time - blendFrames);
    walkX = walkingFrame * 1.2;
    Object.assign(lf, mix(lf, walkFoot(walkingFrame, 0), p));
    Object.assign(rf, mix(rf, walkFoot(walkingFrame, 1), p));
    left.x = -45 + Math.sin((walkingFrame / 60) * Math.PI * 2) * 24;
    right.x = 45 - Math.sin((walkingFrame / 60) * Math.PI * 2) * 24;
  }
  const leftRaised =
    pose === "celebrating" || gesture === "shrug" || gesture === "reactToBill";
  const rightRaised =
    ["celebrating", "thinking", "pointing"].includes(pose) ||
    (gesture &&
      ["wave", "shrug", "reach", "pointAt", "reactToBill"].includes(gesture));
  const lArm = limb(
    point(shoulder.x - 30, shoulder.y + 5),
    left,
    62,
    60,
    leftRaised ? -1 : 1,
  );
  const rArm = limb(
    point(shoulder.x + 30, shoulder.y + 5),
    right,
    62,
    60,
    rightRaised ? 1 : -1,
  );
  const lLeg = limb(point(hip.x - 14, hip.y), lf, 78, 78, 1);
  const rLeg = limb(point(hip.x + 14, hip.y), rf, 78, 78, -1);
  const head = point(shoulder.x, shoulder.y - 40);
  const accent = identity === "Sam" ? C.yellow : C.teal;
  const drawLimb = (
    part: ReturnType<typeof limb>,
    color: string,
    width = 10,
  ) => (
    <path
      d={`M ${part.root.x} ${part.root.y} L ${part.joint.x} ${part.joint.y} L ${part.end.x} ${part.end.y}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
  const brow =
    expression === "worried" || expression === "sad"
      ? -5
      : expression === "determined"
        ? 5
        : 0;
  const eyeHeight = expression === "shocked" ? 6 : 3;
  const mouth =
    expression === "happy"
      ? "M -10 9 Q 0 21 10 9"
      : expression === "sad" || expression === "worried"
        ? "M -9 16 Q 0 7 9 16"
        : expression === "confused"
          ? "M -8 14 Q 0 8 9 13"
          : expression === "determined"
            ? "M -9 12 L 9 12"
            : "M -7 13 L 7 13";
  return (
    <g
      transform={`translate(${x + walkX * scale * facing}, ${y}) scale(${scale * facing}, ${scale})`}
    >
      <ellipse cx={0} cy={9} rx={70} ry={8} fill="#080F1A" opacity={0.28} />
      {pose === "sitting" ? (
        <path
          d="M -65 -91 H 65 M -60 -91 V 0 M 60 -91 V 0"
          stroke={C.line}
          strokeWidth={12}
          fill="none"
        />
      ) : null}
      {drawLimb(lLeg, C.white, 11)}
      {drawLimb(rLeg, C.white, 11)}
      <path
        d={`M ${lLeg.end.x - 13} ${lLeg.end.y} h 25 M ${rLeg.end.x - 10} ${rLeg.end.y} h 25`}
        stroke={accent}
        strokeWidth={12}
        strokeLinecap="round"
      />
      {drawLimb(lArm, C.white)}
      {drawLimb(rArm, C.white)}
      <path
        d={`M ${shoulder.x - 29} ${shoulder.y} Q ${shoulder.x} ${shoulder.y - 12} ${shoulder.x + 29} ${shoulder.y} L ${hip.x + 19} ${hip.y + 4} L ${hip.x - 19} ${hip.y + 4} Z`}
        fill={C.panel}
        stroke={C.white}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      {identity === "Sam" ? (
        <path
          d={`M ${shoulder.x - 6} ${shoulder.y + 5} l 12 0 -3 12 6 36 -9 10 -9 -10 6 -36 Z`}
          fill={accent}
        />
      ) : (
        <path
          d={`M ${shoulder.x - 26} ${shoulder.y + 20} h 52`}
          stroke={accent}
          strokeWidth={13}
        />
      )}
      <g transform={`translate(${head.x},${head.y}) rotate(${nod})`}>
        <path d="M 0 24 V 39" stroke={C.white} strokeWidth={10} />
        <circle r={27} fill={C.white} />
        {identity === "Sam" ? (
          <path
            d="M -26 -8 Q -18 -40 9 -28 Q 28 -25 27 -5 L 12 -18 -7 -14 -19 -3 Z"
            fill={C.navy}
          />
        ) : (
          <path d="M -26 -9 Q -23 -37 7 -29 Q 27 -30 27 -8" fill={C.navy} />
        )}
        <g
          transform={`scale(${facing},1)`}
          stroke={C.navy}
          strokeWidth={2.8}
          fill={C.navy}
          strokeLinecap="round"
        >
          <ellipse cx={-10} cy={0} rx={2.5} ry={eyeHeight} />
          <ellipse cx={10} cy={0} rx={2.5} ry={eyeHeight} />
          <path
            d={`M -17 ${-10 + brow} L -5 -10 M 5 -10 L 17 ${-10 + (expression === "confused" ? -6 : brow)}`}
            fill="none"
          />
          {expression === "shocked" ? (
            <ellipse cy={13} rx={5} ry={7} fill="none" />
          ) : (
            <path d={mouth} fill="none" />
          )}
          {identity === "Alex" ? (
            <g fill="none" strokeWidth={2.5}>
              <rect x={-20} y={-6} width={17} height={13} rx={4} />
              <rect x={3} y={-6} width={17} height={13} rx={4} />
              <path d="M -3 -1 h 6" />
            </g>
          ) : null}
        </g>
      </g>
      {gesture === "holdWallet" ? (
        <g transform={`translate(${rArm.end.x - 17},${rArm.end.y - 10})`}>
          <rect
            width={45}
            height={30}
            rx={5}
            fill={accent}
            stroke={C.navy}
            strokeWidth={3}
          />
          <path d="M 25 10 h 20 v 13 h -20 Z" fill={C.navy} />
        </g>
      ) : null}
    </g>
  );
};
export const Sam = (props: CharacterProps) => (
  <StickmanRig {...props} identity="Sam" />
);
export const Alex = (props: CharacterProps) => (
  <StickmanRig {...props} identity="Alex" />
);
