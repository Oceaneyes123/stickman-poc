import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { C, font } from "../../design/tokens";
import { FRAME, LAYOUTS, SAFE_RECT, type LayoutName } from "../core/geometry";
import type { SceneBackdropSpec } from "./types";

const BACKDROP_THEMES: Record<
  SceneBackdropSpec["preset"],
  { bg: string; secondary: string; grid: string }
> = {
  "editorial-navy": {
    bg: C.navy,
    secondary: "#1B304C",
    grid: "rgba(248, 250, 252, 0.05)",
  },
  "warm-paper": {
    bg: "#F4F2EB",
    secondary: "#EAE6DA",
    grid: "rgba(20, 36, 58, 0.06)",
  },
  "slate-board": {
    bg: "#192A42",
    secondary: "#223754",
    grid: "rgba(166, 180, 198, 0.08)",
  },
  "split-board": {
    bg: C.navy,
    secondary: "#F4F2EB",
    grid: "rgba(248, 250, 252, 0.04)",
  },
  "dark-evidence": {
    bg: "#0E1A2B",
    secondary: "#16263D",
    grid: "rgba(57, 184, 182, 0.06)",
  },
};

export function SceneBackdrop({ spec }: { spec: SceneBackdropSpec }) {
  const theme = BACKDROP_THEMES[spec.preset];
  const isSplit = spec.preset === "split-board";

  return (
    <AbsoluteFill
      style={{
        background: isSplit
          ? `linear-gradient(90deg, ${theme.bg} 0%, ${theme.bg} 50%, ${theme.secondary} 50%, ${theme.secondary} 100%)`
          : `radial-gradient(circle at 28% 22%, ${theme.secondary} 0%, ${theme.bg} 72%)`,
        fontFamily: font,
      }}
    >
      {spec.gridLines && (
        <svg
          width={FRAME.width}
          height={FRAME.height}
          viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {Array.from({ length: 16 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={120 * (i + 1)}
              y1={0}
              x2={120 * (i + 1)}
              y2={FRAME.height}
              stroke={theme.grid}
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={120 * (i + 1)}
              x2={FRAME.width}
              y2={120 * (i + 1)}
              stroke={theme.grid}
              strokeWidth={1}
            />
          ))}
        </svg>
      )}
      {spec.accentColor && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: spec.accentColor,
          }}
        />
      )}
      {spec.vignette && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, transparent 56%, rgba(8, 16, 28, 0.36) 100%)",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
}

export function SceneLayout({
  layout,
  backdrop,
  debugSafeMargins = false,
  children,
}: {
  layout: LayoutName;
  backdrop?: SceneBackdropSpec;
  debugSafeMargins?: boolean;
  children: ReactNode;
}) {
  const regions = LAYOUTS[layout];

  return (
    <AbsoluteFill
      style={{
        width: FRAME.width,
        height: FRAME.height,
        overflow: "hidden",
        fontFamily: font,
      }}
    >
      {backdrop && <SceneBackdrop spec={backdrop} />}
      {children}
      {debugSafeMargins && (
        <svg
          width={FRAME.width}
          height={FRAME.height}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 999,
            pointerEvents: "none",
          }}
        >
          <rect
            x={SAFE_RECT.x}
            y={SAFE_RECT.y}
            width={SAFE_RECT.width}
            height={SAFE_RECT.height}
            fill="none"
            stroke={C.teal}
            strokeWidth={2}
            strokeDasharray="10 8"
          />
          {Object.entries(regions)
            .filter(([key]) => key !== "full")
            .map(([key, r]) => (
              <g key={key}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill="none"
                  stroke={C.yellow}
                  strokeWidth={1.5}
                  strokeDasharray="6 6"
                />
                <text
                  x={r.x + 8}
                  y={r.y + 22}
                  fontSize={16}
                  fill={C.yellow}
                  fontFamily={font}
                >
                  {layout}.{key}
                </text>
              </g>
            ))}
        </svg>
      )}
    </AbsoluteFill>
  );
}
