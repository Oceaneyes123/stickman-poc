import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import type { Rect } from "../core/geometry";
import { ramp } from "../core/keyframes";

export type HighlightAnnotation = {
  id: string;
  rect: Rect;
  mode: "underline" | "box" | "marker" | "callout";
  label?: string;
  color?: string;
  from?: number;
};

export type RedactionBox = {
  id: string;
  rect: Rect;
  label?: string;
};

export function EvidenceHighlight({
  width,
  height,
  highlights = [],
  redactions = [],
  dimOutside = false,
  frame: frameOverride,
}: {
  width: number;
  height: number;
  highlights?: readonly HighlightAnnotation[];
  redactions?: readonly RedactionBox[];
  dimOutside?: boolean;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const activeBoxes = highlights.filter((h) => frame >= (h.from ?? 0));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {dimOutside && activeBoxes.length > 0 && (
        <defs>
          <mask id="evidence-dim-mask">
            <rect width={width} height={height} fill="#fff" />
            {activeBoxes.map((h) => (
              <rect
                key={`cut-${h.id}`}
                x={h.rect.x - 6}
                y={h.rect.y - 4}
                width={h.rect.width + 12}
                height={h.rect.height + 8}
                rx={6}
                fill="#000"
              />
            ))}
          </mask>
        </defs>
      )}

      {dimOutside && activeBoxes.length > 0 && (
        <rect
          width={width}
          height={height}
          fill={C.navy}
          opacity={0.34}
          mask="url(#evidence-dim-mask)"
        />
      )}

      {redactions.map((red) => (
        <g key={red.id}>
          <rect
            x={red.rect.x}
            y={red.rect.y}
            width={red.rect.width}
            height={red.rect.height}
            rx={3}
            fill={C.navy}
          />
          {red.label && (
            <text
              x={red.rect.x + red.rect.width / 2}
              y={red.rect.y + red.rect.height / 2 + 5}
              textAnchor="middle"
              fontFamily={font}
              fontSize={13}
              fontWeight={700}
              fill={C.muted}
            >
              {red.label}
            </text>
          )}
        </g>
      ))}

      {highlights.map((h) => {
        const p = ramp(frame, h.from ?? 0, 16, "out");
        if (p <= 0.01) return null;
        const color = h.color ?? C.yellow;
        if (h.mode === "marker") {
          return (
            <rect
              key={h.id}
              x={h.rect.x}
              y={h.rect.y}
              width={h.rect.width * p}
              height={h.rect.height}
              rx={4}
              fill={color}
              opacity={0.34}
            />
          );
        }
        if (h.mode === "underline") {
          const y = h.rect.y + h.rect.height + 3;
          return (
            <g key={h.id}>
              <line
                x1={h.rect.x}
                y1={y}
                x2={h.rect.x + h.rect.width * p}
                y2={y}
                stroke={color}
                strokeWidth={5}
                strokeLinecap="round"
              />
              {h.label && (
                <g opacity={p} transform={`translate(${h.rect.x},${y + 24})`}>
                  <rect
                    x={0}
                    y={-20}
                    width={Math.max(120, h.label.length * 11 + 20)}
                    height={28}
                    rx={6}
                    fill={C.navy}
                  />
                  <text
                    x={10}
                    y={-1}
                    fontFamily={font}
                    fontSize={16}
                    fontWeight={700}
                    fill={color}
                  >
                    {h.label}
                  </text>
                </g>
              )}
            </g>
          );
        }

        const perimeter = 2 * (h.rect.width + h.rect.height);
        return (
          <g key={h.id}>
            <rect
              x={h.rect.x}
              y={h.rect.y}
              width={h.rect.width}
              height={h.rect.height}
              rx={8}
              fill={h.mode === "callout" ? color : "none"}
              fillOpacity={h.mode === "callout" ? 0.14 : 0}
              stroke={color}
              strokeWidth={4}
              strokeDasharray={perimeter}
              strokeDashoffset={perimeter * (1 - p)}
            />
            {h.label && (
              <g
                opacity={p}
                transform={`translate(${h.rect.x},${Math.max(24, h.rect.y - 10)})`}
              >
                <rect
                  x={0}
                  y={-28}
                  width={Math.max(130, h.label.length * 11 + 22)}
                  height={30}
                  rx={6}
                  fill={color}
                />
                <text
                  x={11}
                  y={-7}
                  fontFamily={font}
                  fontSize={16}
                  fontWeight={800}
                  fill={C.navy}
                >
                  {h.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
