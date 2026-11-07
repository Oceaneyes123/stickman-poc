import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sam, Alex } from "./characters/ReferenceCharacterRig";
import { evaluateMotion, planMotion } from "./characters/motionPlanner";
import { font } from "./design/tokens";

const walk = planMotion([
  { action: "walking", from: 12, duration: 260, distance: 240 },
]);
export const WalkingMechanics = ({ debug = false }: { debug?: boolean }) => {
  const frame = useCurrentFrame();
  const rig = evaluateMotion(walk, frame);
  return (
    <AbsoluteFill style={{ background: "#EDF0F2", fontFamily: font }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        role="img"
        aria-label="Walking mechanics: a nearly extended supporting knee and a flexing swinging knee, shown in both directions"
      >
        <text x={64} y={70} fill="#14243A" fontSize={40} fontWeight={800}>
          WALKING MECHANICS
        </text>
        <text x={64} y={117} fill="#64748B" fontSize={25}>
          Support, swing, heel contact and toe-off · 30 fps · same motion in
          both directions
        </text>
        <path
          d="M 96 824 H 1824 M 960 180 V 1020"
          stroke="#CBD5E1"
          strokeWidth={2}
        />
        <Sam
          x={200}
          y={820}
          scale={2}
          skeleton={rig}
          motion={walk}
          debug={debug}
        />
        <Alex
          x={1720}
          y={820}
          scale={2}
          facing={-1}
          skeleton={rig}
          motion={walk}
          debug={debug}
        />
        {[64, 1024].map((x, i) => (
          <g key={x} fill="#14243A" fontSize={26}>
            <text x={x} y={185} fontWeight={700}>
              {i === 0 ? "SAM · WALK RIGHT" : "ALEX · WALK LEFT"}
            </text>
            {rig.feet?.map((foot, side) => (
              <text key={side} x={x} y={930 + side * 45}>
                {side === 0 ? "Left" : "Right"} leg: {foot.phase} · knee{" "}
                {[rig.leftLeg, rig.rightLeg][side].flexion.toFixed(0)}°
              </text>
            ))}
          </g>
        ))}
        <text x={64} y={1046} fill="#64748B" fontSize={23}>
          The supporting knee extends through midstance; it bends again during
          weight transfer. Feet roll around fixed ground contacts.
        </text>
      </svg>
    </AbsoluteFill>
  );
};
