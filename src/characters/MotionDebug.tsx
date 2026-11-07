import type { Skeleton } from "./biomechanics";
import type { MotionPlan } from "./motionPlanner";
import { sampleFoot } from "./gait";

export const MotionDebug = ({
  rig,
  plan,
  facing = 1,
}: {
  rig: Skeleton;
  plan?: MotionPlan;
  facing?: 1 | -1;
}) => {
  const label = (x: number) =>
    facing === -1 ? `translate(${2 * x},0) scale(-1,1)` : undefined;
  const parts = [rig.leftArm, rig.rightArm, rig.leftLeg, rig.rightLeg];
  const support = rig.balance?.support;
  return (
    <g
      fontFamily="monospace"
      fontSize={12}
      fill="#0F766E"
      strokeWidth={1}
      pointerEvents="none"
      data-debug="motion"
    >
      {plan?.clips.flatMap(
        (clip, i) =>
          clip.gaitPlan?.steps.map((step, j) => (
            <path
              key={`${i}-${j}`}
              d={Array.from({ length: 17 }, (_, k) => {
                const t = k / 16;
                const foot = sampleFoot(
                  clip.gaitPlan!,
                  step.lift + t * (step.land - step.lift),
                  step.side,
                );
                return `${k ? "L" : "M"} ${clip.origin + foot.point.x} ${foot.point.y}`;
              }).join(" ")}
              fill="none"
              stroke="#7C3AED"
              opacity={0.25}
            />
          )) ?? [],
      )}
      {support && (
        <path
          d={`M ${support.min} 9 H ${support.max}`}
          stroke="#0D9488"
          strokeWidth={4}
        />
      )}
      {parts.map((part, i) => (
        <g key={i}>
          <path
            d={`M ${part.root.x} ${part.root.y} L ${part.joint.x} ${part.joint.y} L ${part.end.x} ${part.end.y}`}
            fill="none"
            stroke={part.limitViolation ? "#DC2626" : "#0D9488"}
          />
          {[part.root, part.joint, part.end].map((p, j) => (
            <circle key={j} cx={p.x} cy={p.y} r={2.5} fill="#F59E0B" />
          ))}
          <text
            x={part.joint.x + 4}
            y={part.joint.y - 4}
            transform={label(part.joint.x + 4)}
            fill={part.limitViolation ? "#DC2626" : "#0F766E"}
          >
            {part.flexion.toFixed(0)}°{part.limitViolation ? " LIMIT" : ""}
          </text>
          <path
            d={`M ${part.end.x} ${part.end.y} L ${part.target.x} ${part.target.y}`}
            stroke="#DC2626"
          />
          {part.unreachable && (
            <g fill="#DC2626">
              <circle
                cx={part.target.x}
                cy={part.target.y}
                r={4}
                fill="none"
                stroke="#DC2626"
              />
              <text
                x={part.target.x + 5}
                y={part.target.y}
                transform={label(part.target.x + 5)}
              >
                unreachable {part.error.toFixed(1)}
              </text>
            </g>
          )}
        </g>
      ))}
      {rig.feet?.map((foot, i) => (
        <g key={i}>
          <circle
            cx={foot.contact?.point.x ?? foot.point.x}
            cy={foot.contact?.point.y ?? foot.point.y + 4}
            r={4}
            fill={foot.planted ? "#0D9488" : "#F59E0B"}
          />
          <text
            x={foot.point.x}
            y={20 + i * 14}
            textAnchor="middle"
            transform={label(foot.point.x)}
          >
            {i === 0 ? "L" : "R"}: {foot.phase}
          </text>
        </g>
      ))}
      {rig.balance && (
        <g>
          <path
            d={`M ${rig.balance.center.x} ${rig.balance.center.y} V 7`}
            stroke="#E11D48"
            strokeDasharray="3 3"
          />
          <circle
            cx={rig.balance.center.x}
            cy={rig.balance.center.y}
            r={4}
            fill="#E11D48"
          />
          <text
            x={rig.balance.center.x + 6}
            y={rig.balance.center.y}
            transform={label(rig.balance.center.x + 6)}
          >
            COM{" "}
            {rig.balance.dynamic
              ? "dynamic"
              : rig.balance.stable
                ? "stable"
                : "outside support"}
          </text>
          <path
            d={`M ${rig.hip.x} ${rig.hip.y - 8} h ${(rig.yaw ?? 1) * 25}`}
            stroke="#2563EB"
          />
          <text
            x={rig.hip.x + (rig.yaw ?? 1) * 25}
            y={rig.hip.y - 12}
            transform={label(rig.hip.x + (rig.yaw ?? 1) * 25)}
          >
            {(rig.yaw ?? 1) >= 0 ? ">" : "<"}
          </text>
        </g>
      )}
    </g>
  );
};
