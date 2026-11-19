import type { Point } from "../core/geometry.ts";

export type ConnectorKind =
  | "straight"
  | "curved"
  | "elbow-h"
  | "elbow-v"
  | "bracket";

export type ConnectorGeometry = {
  d: string;
  mid: Point;
  endAngleDeg: number;
};

export function buildConnectorPath(
  from: Point,
  to: Point,
  kind: ConnectorKind = "straight",
  bend = 0,
): ConnectorGeometry {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (kind === "straight") {
    return {
      d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
      mid: { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 },
      endAngleDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
    };
  }

  if (kind === "curved") {
    const offset = bend !== 0 ? bend : -Math.max(48, Math.abs(dx) * 0.2);
    const cx = (from.x + to.x) / 2;
    const cy = (from.y + to.y) / 2 + offset;
    return {
      d: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`,
      mid: {
        x: 0.25 * from.x + 0.5 * cx + 0.25 * to.x,
        y: 0.25 * from.y + 0.5 * cy + 0.25 * to.y,
      },
      endAngleDeg: (Math.atan2(to.y - cy, to.x - cx) * 180) / Math.PI,
    };
  }

  if (kind === "elbow-h") {
    const mx = (from.x + to.x) / 2 + bend;
    return {
      d: `M ${from.x} ${from.y} H ${mx} V ${to.y} H ${to.x}`,
      mid: { x: mx, y: (from.y + to.y) / 2 },
      endAngleDeg: to.x >= mx ? 0 : 180,
    };
  }

  if (kind === "elbow-v") {
    const my = (from.y + to.y) / 2 + bend;
    return {
      d: `M ${from.x} ${from.y} V ${my} H ${to.x} V ${to.y}`,
      mid: { x: (from.x + to.x) / 2, y: my },
      endAngleDeg: to.y >= my ? 90 : -90,
    };
  }

  // bracket
  const legY = from.y + (bend !== 0 ? bend : 44);
  return {
    d: `M ${from.x} ${from.y} V ${legY} H ${to.x} V ${to.y}`,
    mid: { x: (from.x + to.x) / 2, y: legY },
    endAngleDeg: to.y >= legY ? 90 : -90,
  };
}
