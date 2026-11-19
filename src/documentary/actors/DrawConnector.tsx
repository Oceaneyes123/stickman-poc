import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import type { Point } from "../core/geometry";
import { clamp01, ramp, type EasingName } from "../core/keyframes";
import { buildConnectorPath, type ConnectorKind } from "./connectorMath";

export function DrawConnector({
  from: p0,
  to: p1,
  kind = "straight",
  bend = 0,
  startFrame = 0,
  durationFrames = 24,
  easing = "outCubic",
  color = C.yellow,
  strokeWidth = 5,
  dashed = false,
  arrow = true,
  label,
  labelBg = C.navy,
  labelColor = C.white,
  frame: frameOverride,
}: {
  from: Point;
  to: Point;
  kind?: ConnectorKind;
  bend?: number;
  startFrame?: number;
  durationFrames?: number;
  easing?: EasingName;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  arrow?: boolean;
  label?: string;
  labelBg?: string;
  labelColor?: string;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const progress = ramp(frame, startFrame, Math.max(1, durationFrames), easing);
  if (progress <= 0.01) return null;

  const geom = buildConnectorPath(p0, p1, kind, bend);
  const arrowOpacity = clamp01((progress - 0.72) / 0.25);
  const labelW = label ? Math.max(120, label.length * 12.5 + 32) : 0;

  return (
    <g>
      <path
        d={geom.d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={dashed ? undefined : 1}
        strokeDasharray={dashed ? "12 9" : "1 1"}
        strokeDashoffset={dashed ? undefined : 1 - progress}
        opacity={dashed ? progress : 1}
      />
      {arrow && arrowOpacity > 0.01 && (
        <polygon
          points="-16,-10 4,0 -16,10"
          fill={color}
          opacity={arrowOpacity}
          transform={`translate(${p1.x} ${p1.y}) rotate(${geom.endAngleDeg})`}
        />
      )}
      {label && (
        <g
          transform={`translate(${geom.mid.x} ${geom.mid.y})`}
          opacity={clamp01((progress - 0.25) / 0.45)}
        >
          <rect
            x={-labelW / 2}
            y={-19}
            width={labelW}
            height={38}
            rx={10}
            fill={labelBg}
            stroke={color}
            strokeWidth={2.5}
          />
          <text
            x={0}
            y={7}
            textAnchor="middle"
            fontFamily={font}
            fontSize={20}
            fontWeight={750}
            fill={labelColor}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}
