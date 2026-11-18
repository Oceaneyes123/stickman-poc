import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { ramp } from "../core/keyframes";

export type DebtCycleStep = {
  id: string;
  label: string;
  detail?: string;
  tone?: "money" | "cost" | "alternative";
};

export function DebtCycle({
  title,
  centerLabel,
  centerDetail,
  steps,
  activeStepIndex,
  from = 0,
  stepInterval = 18,
  width = 760,
  height = 560,
  frame: frameOverride,
}: {
  title?: string;
  centerLabel: string;
  centerDetail?: string;
  steps: readonly DebtCycleStep[];
  activeStepIndex?: number;
  from?: number;
  stepInterval?: number;
  width?: number;
  height?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const cx = width / 2;
  const cy = height / 2 + 16;
  const radiusX = width * 0.36;
  const radiusY = height * 0.35;

  const computedActive =
    activeStepIndex ??
    Math.min(steps.length - 1, Math.max(0, Math.floor((frame - from) / stepInterval)));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ fontFamily: font, overflow: "visible" }}
    >
      <defs>
        <marker
          id="cycle-arrow"
          viewBox="0 0 12 12"
          refX="9"
          refY="6"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 0 1 L 11 6 L 0 11 z" fill={C.red} />
        </marker>
      </defs>

      {title && (
        <text
          x={cx}
          y={34}
          textAnchor="middle"
          fontSize={26}
          fontWeight={800}
          fill={C.white}
        >
          {title}
        </text>
      )}

      <ellipse
        cx={cx}
        cy={cy}
        rx={radiusX}
        ry={radiusY}
        fill="none"
        stroke={C.line}
        strokeWidth={4}
        strokeDasharray="10 8"
      />

      <circle cx={cx} cy={cy} r={72} fill={C.panel} stroke={C.red} strokeWidth={3} />
      <text
        x={cx}
        y={centerDetail ? cy - 6 : cy + 8}
        textAnchor="middle"
        fontSize={22}
        fontWeight={800}
        fill={C.white}
      >
        {centerLabel}
      </text>
      {centerDetail && (
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fontSize={16}
          fill={C.muted}
        >
          {centerDetail}
        </text>
      )}

      {steps.map((step, idx) => {
        const p = ramp(frame, from + idx * stepInterval, 14, "out");
        const angle = -Math.PI / 2 + (idx / steps.length) * Math.PI * 2;
        const nextAngle = -Math.PI / 2 + ((idx + 0.65) / steps.length) * Math.PI * 2;
        const x = cx + Math.cos(angle) * radiusX;
        const y = cy + Math.sin(angle) * radiusY;
        const arcStart = {
          x: cx + Math.cos(angle + 0.25) * radiusX,
          y: cy + Math.sin(angle + 0.25) * radiusY,
        };
        const arcEnd = {
          x: cx + Math.cos(nextAngle) * radiusX,
          y: cy + Math.sin(nextAngle) * radiusY,
        };
        const isActive = idx === computedActive;
        const color =
          step.tone === "alternative"
            ? C.teal
            : step.tone === "money"
              ? C.yellow
              : C.red;

        return (
          <g key={step.id} opacity={p}>
            <path
              d={`M ${arcStart.x} ${arcStart.y} A ${radiusX} ${radiusY} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
              fill="none"
              stroke={C.red}
              strokeWidth={4}
              markerEnd="url(#cycle-arrow)"
            />
            <g transform={`translate(${x},${y}) scale(${isActive ? 1.04 : 1})`}>
              <rect
                x={-102}
                y={-38}
                width={204}
                height={76}
                rx={12}
                fill={isActive ? "#233A59" : C.navy}
                stroke={isActive ? C.yellow : color}
                strokeWidth={isActive ? 4 : 3}
              />
              <text
                x={0}
                y={step.detail ? -6 : 6}
                textAnchor="middle"
                fontSize={19}
                fontWeight={800}
                fill={C.white}
              >
                {step.label}
              </text>
              {step.detail && (
                <text
                  x={0}
                  y={20}
                  textAnchor="middle"
                  fontSize={15}
                  fill={color}
                  fontWeight={700}
                >
                  {step.detail}
                </text>
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
