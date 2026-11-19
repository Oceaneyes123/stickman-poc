import { useCurrentFrame } from "remotion";
import { C } from "../../design/tokens";
import { clamp01 } from "../core/keyframes";
import {
  sampleCursorWaypoints,
  type CursorWaypoint,
} from "./cursorMath";

export function SvgCursor({
  x,
  y,
  press = 0,
  ripple = 0,
  rippleColor = C.yellow,
  opacity = 1,
  scale = 1,
}: {
  x: number;
  y: number;
  press?: number;
  ripple?: number;
  rippleColor?: string;
  opacity?: number;
  scale?: number;
}) {
  const pressScale = 1 - 0.16 * clamp01(press);
  const r = clamp01(ripple);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      {r > 0 && r < 1 && (
        <circle
          cx={4}
          cy={4}
          r={12 + 44 * r}
          fill="none"
          stroke={rippleColor}
          strokeWidth={5}
          opacity={(1 - r) * 0.9}
        />
      )}
      <path
        d="M0 0 L0 54 L14 41 L25 65 L35 60 L24 36 L45 36 Z"
        transform={`scale(${pressScale})`}
        fill={C.white}
        stroke={C.navy}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    </g>
  );
}

export function SvgCursorActor({
  waypoints,
  travelFrames,
  clickFrames,
  rippleColor = C.yellow,
  scale = 1,
  frame: frameOverride,
}: {
  waypoints: readonly CursorWaypoint[];
  travelFrames?: number;
  clickFrames?: number;
  rippleColor?: string;
  scale?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const sample = sampleCursorWaypoints(waypoints, frame, {
    travelFrames,
    clickFrames,
  });
  if (!sample.visible) return null;
  return (
    <SvgCursor
      x={sample.x}
      y={sample.y}
      press={sample.press}
      ripple={sample.ripple}
      rippleColor={rippleColor}
      opacity={sample.opacity}
      scale={scale}
    />
  );
}

export function CursorActor(props: {
  waypoints: readonly CursorWaypoint[];
  travelFrames?: number;
  clickFrames?: number;
  rippleColor?: string;
  scale?: number;
  width?: number;
  height?: number;
  frame?: number;
}) {
  const w = props.width ?? 1920;
  const h = props.height ?? 1080;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      <SvgCursorActor {...props} />
    </svg>
  );
}
