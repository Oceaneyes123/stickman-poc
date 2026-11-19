import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { C, font } from "../../design/tokens";
import { FRAME, LAYOUTS, SAFE_RECT, type LayoutName } from "../core/geometry";
import { getLook, lookCssVars, type LookId } from "../core/looks";
import type { SceneBackdropPreset, SceneBackdropSpec } from "./types";

const BACKDROP_THEMES: Record<
  SceneBackdropPreset,
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

function LookSurfacePattern({
  lookId,
  hairline,
}: {
  lookId: LookId;
  hairline: string;
}) {
  const look = getLook(lookId);
  if (look.pattern === "none") return null;

  if (look.pattern === "split-pane") {
    return (
      <svg
        width={FRAME.width}
        height={FRAME.height}
        viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <line
          x1={864}
          y1={0}
          x2={864}
          y2={FRAME.height}
          stroke={hairline}
          strokeWidth={2}
        />
      </svg>
    );
  }

  if (look.pattern === "paper-grain") {
    return (
      <svg
        width={FRAME.width}
        height={FRAME.height}
        viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={`rule-${i}`}
            x1={0}
            y1={72 * (i + 1)}
            x2={FRAME.width}
            y2={72 * (i + 1)}
            stroke={hairline}
            strokeWidth={1}
          />
        ))}
      </svg>
    );
  }

  if (look.pattern === "dot-matrix") {
    return (
      <svg
        width={FRAME.width}
        height={FRAME.height}
        viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <pattern
            id={`dot-mat-${lookId}`}
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="16" cy="16" r="1.6" fill={hairline} />
          </pattern>
        </defs>
        <rect width={FRAME.width} height={FRAME.height} fill={`url(#dot-mat-${lookId})`} />
      </svg>
    );
  }

  if (look.pattern === "diagonal-rules") {
    return (
      <svg
        width={FRAME.width}
        height={FRAME.height}
        viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <pattern
            id={`diag-${lookId}`}
            width="96"
            height="96"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(24)"
          >
            <line x1="0" y1="0" x2="0" y2="96" stroke={hairline} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={FRAME.width} height={FRAME.height} fill={`url(#diag-${lookId})`} />
      </svg>
    );
  }

  return (
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
          stroke={hairline}
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
          stroke={hairline}
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}

export function SceneBackdrop({ spec }: { spec: SceneBackdropSpec }) {
  if (spec.look) {
    const look = getLook(spec.look);
    const isSplit = look.id === "split-contrast";
    const showPattern = spec.gridLines !== false;
    const showVignette = spec.vignette ?? look.id === "evidence-desk";

    return (
      <AbsoluteFill
        style={{
          background: isSplit
            ? `linear-gradient(90deg, ${look.bg} 0%, ${look.bg} 45%, ${look.bgSecondary} 45%, ${look.bgSecondary} 100%)`
            : `radial-gradient(circle at 26% 20%, ${look.bgSecondary} 0%, ${look.bg} 74%)`,
          fontFamily: font,
        }}
      >
        {showPattern && (
          <LookSurfacePattern lookId={look.id} hairline={look.hairline} />
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
        {showVignette && (
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

  const preset = spec.preset ?? "editorial-navy";
  const theme = BACKDROP_THEMES[preset];
  const isSplit = preset === "split-board";

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
  look,
  backdrop,
  debugSafeMargins = false,
  children,
}: {
  layout: LayoutName;
  look?: LookId;
  backdrop?: SceneBackdropSpec;
  debugSafeMargins?: boolean;
  children: ReactNode;
}) {
  const regions = LAYOUTS[layout];
  const resolvedLookId = look ?? backdrop?.look;
  const cssVars = resolvedLookId
    ? (lookCssVars(getLook(resolvedLookId)) as CSSProperties)
    : undefined;
  const resolvedBackdrop =
    backdrop ?? (resolvedLookId ? { look: resolvedLookId } : undefined);

  return (
    <AbsoluteFill
      style={{
        width: FRAME.width,
        height: FRAME.height,
        overflow: "hidden",
        fontFamily: font,
        ...cssVars,
      }}
    >
      {resolvedBackdrop && (
        <SceneBackdrop
          spec={
            resolvedLookId && !resolvedBackdrop.look
              ? { ...resolvedBackdrop, look: resolvedLookId }
              : resolvedBackdrop
          }
        />
      )}
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
