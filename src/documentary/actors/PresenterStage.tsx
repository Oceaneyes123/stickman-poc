import { spring, useCurrentFrame } from "remotion";
import {
  Alex,
  CharacterFace,
  Sam,
  characterColors,
} from "../../characters/ReferenceCharacterRig";
import {
  referenceSkeleton,
  type ReferenceExpression,
  type ReferencePose,
} from "../../characters/referenceModel";
import { clamp01 } from "../core/keyframes";

export type PresenterFraming =
  | "side-left"
  | "side-right"
  | "closeup"
  | "corner-pip"
  | "over-shoulder";

const FRAMING_PRESETS: Record<
  PresenterFraming,
  { x: number; y: number; scale: number; facing: 1 | -1; headScale: number }
> = {
  "side-left": { x: 380, y: 940, scale: 2.15, facing: 1, headScale: 1.34 },
  "side-right": { x: 1540, y: 940, scale: 2.15, facing: -1, headScale: 1.34 },
  closeup: { x: 470, y: 1290, scale: 3.1, facing: 1, headScale: 1.24 },
  "corner-pip": { x: 250, y: 1020, scale: 1.48, facing: 1, headScale: 1.38 },
  "over-shoulder": { x: 310, y: 1050, scale: 2.55, facing: 1, headScale: 1.28 },
};

export function PresenterStage({
  identity = "Sam",
  framing = "side-left",
  x: xOverride,
  y: yOverride,
  scale: scaleOverride,
  facing: facingOverride,
  localFrame: localFrameOverride,
  absoluteFrame: absoluteFrameOverride,
  fromPose = "standing",
  pose = "explaining",
  expression = "confident",
  speechWindows,
  onDark = true,
  actionFrom = 4,
  blendFrames = 22,
}: {
  identity?: "Sam" | "Alex";
  framing?: PresenterFraming;
  x?: number;
  y?: number;
  scale?: number;
  facing?: 1 | -1;
  localFrame?: number;
  absoluteFrame?: number;
  fromPose?: ReferencePose;
  pose?: ReferencePose;
  expression?: ReferenceExpression;
  speechWindows?: readonly [number, number][];
  onDark?: boolean;
  actionFrom?: number;
  blendFrames?: number;
}) {
  const current = useCurrentFrame();
  const localFrame = localFrameOverride ?? current;
  const absoluteFrame = absoluteFrameOverride ?? localFrame;
  const preset = FRAMING_PRESETS[framing];
  const x = xOverride ?? preset.x;
  const y = yOverride ?? preset.y;
  const scale = scaleOverride ?? preset.scale;
  const facing = facingOverride ?? preset.facing;

  const rig = referenceSkeleton({
    frame: localFrame,
    pose,
    fromPose,
    actionFrom,
    blendFrames,
  });

  const speaking = speechWindows
    ? speechWindows.some(
        ([start, end]) => absoluteFrame >= start && absoluteFrame <= end,
      )
    : localFrame >= 2;
  const mouthOpen = speaking
    ? clamp01(
        0.54 +
          0.32 * Math.sin(absoluteFrame * 0.72) +
          0.14 * Math.cos(absoluteFrame * 1.29),
      )
    : 0;
  const speechBob = speaking ? Math.sin(absoluteFrame * 0.42) * 2.2 : 0;
  const enterScale = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 14, stiffness: 150, mass: 0.8 },
  });
  const slideY = 36 * (1 - clamp01(enterScale));
  const mouthY = identity === "Alex" ? 26 : 22;
  const Character = identity === "Sam" ? Sam : Alex;

  return (
    <g transform={`translate(0 ${slideY})`}>
      <circle
        cx={x}
        cy={y - 210 * scale}
        r={112 * scale}
        fill={onDark ? "#1E3552" : "#DCE7F0"}
        opacity={(onDark ? 0.72 : 0.85) * clamp01(localFrame / 14)}
      />
      <ellipse
        cx={x}
        cy={y + 8}
        rx={76 * scale}
        ry={10 * scale}
        fill="#0A1422"
        opacity={onDark ? 0.35 : 0.14}
      />
      <Character
        x={x}
        y={y}
        scale={scale}
        facing={facing}
        skeleton={rig}
        expression={expression}
      />
      <g
        transform={`translate(${x + rig.travel * scale * facing}, ${y}) scale(${scale * facing}, ${scale})`}
      >
        <g
          transform={`translate(${rig.head.x}, ${rig.head.y - 6}) rotate(${rig.nod + speechBob}) scale(${preset.headScale})`}
        >
          <path
            d="M 0 34 V 48"
            stroke={characterColors.ink}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <CharacterFace
            identity={identity}
            expression={expression}
            turn={rig.turn}
            yaw={rig.yaw}
          />
          {speaking && (
            <g>
              <ellipse
                cx={0}
                cy={mouthY}
                rx={16}
                ry={9.5}
                fill={characterColors.paper}
              />
              <ellipse
                cx={0}
                cy={mouthY + 1}
                rx={6.8 + 4.4 * mouthOpen}
                ry={2.2 + 6.4 * mouthOpen}
                fill={characterColors.ink}
              />
              {mouthOpen > 0.48 && (
                <ellipse
                  cx={0}
                  cy={mouthY + 4.2}
                  rx={4.5}
                  ry={2.1}
                  fill={characterColors.red}
                />
              )}
            </g>
          )}
        </g>
      </g>
    </g>
  );
}
