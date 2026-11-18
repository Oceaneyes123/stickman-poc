import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { usd } from "../../finance/math";
import { ramp } from "../core/keyframes";

export type FlowNode = {
  id: string;
  label: string;
  sublabel?: string;
  amount?: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  tone?: "money" | "cost" | "alternative" | "neutral";
  revealedAt?: number;
};

export type EdgeMeaning = "transfer" | "deduction" | "obligation" | "return-flow";

export type FlowEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
  meaning: EdgeMeaning;
  curveY?: number;
  revealedAt?: number;
  duration?: number;
};

const NODE_TONES = {
  money: { border: C.yellow, accent: C.yellow },
  cost: { border: C.red, accent: C.red },
  alternative: { border: C.teal, accent: C.teal },
  neutral: { border: C.line, accent: C.white },
} as const;

const EDGE_COLORS: Record<EdgeMeaning, string> = {
  transfer: C.yellow,
  deduction: C.red,
  obligation: C.red,
  "return-flow": C.teal,
};

export function MoneyFlow({
  nodes,
  edges,
  activeNodeId,
  activeEdgeId,
  width = 1120,
  height = 500,
  title,
  legend = true,
  frame: frameOverride,
}: {
  nodes: readonly FlowNode[];
  edges: readonly FlowEdge[];
  activeNodeId?: string;
  activeEdgeId?: string;
  width?: number;
  height?: number;
  title?: string;
  legend?: boolean;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ fontFamily: font, overflow: "visible" }}
    >
      <defs>
        {(Object.keys(EDGE_COLORS) as EdgeMeaning[]).map((meaning) => (
          <marker
            key={meaning}
            id={`arrow-${meaning}`}
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path d="M 0 1 L 11 6 L 0 11 z" fill={EDGE_COLORS[meaning]} />
          </marker>
        ))}
      </defs>

      {title && (
        <text x={24} y={36} fontSize={26} fontWeight={800} fill={C.white}>
          {title}
        </text>
      )}

      {edges.map((edge) => {
        const src = byId.get(edge.from);
        const dst = byId.get(edge.to);
        if (!src || !dst) return null;
        const p = ramp(frame, edge.revealedAt ?? 10, edge.duration ?? 24, "out");
        if (p <= 0.01) return null;

        const sw = src.width ?? 210;
        const dw = dst.width ?? 210;
        const sx = src.x + (dst.x >= src.x ? sw / 2 : -sw / 2);
        const sy = src.y;
        const dx = dst.x + (dst.x >= src.x ? -dw / 2 : dw / 2);
        const dy = dst.y;
        const mx = (sx + dx) / 2;
        const cy = (sy + dy) / 2 + (edge.curveY ?? 0);
        const d =
          edge.curveY !== undefined && edge.curveY !== 0
            ? `M ${sx} ${sy} Q ${mx} ${cy} ${dx} ${dy}`
            : `M ${sx} ${sy} L ${dx} ${dy}`;
        const color = EDGE_COLORS[edge.meaning];
        const isActive = activeEdgeId === edge.id;
        const dotT = p;
        const dotX = (1 - dotT) ** 2 * sx + 2 * (1 - dotT) * dotT * mx + dotT ** 2 * dx;
        const dotY = (1 - dotT) ** 2 * sy + 2 * (1 - dotT) * dotT * cy + dotT ** 2 * dy;
        const labelX = 0.25 * sx + 0.5 * mx + 0.25 * dx;
        const labelY = 0.25 * sy + 0.5 * cy + 0.25 * dy - 12;

        return (
          <g key={edge.id}>
            <path d={d} fill="none" stroke={C.line} strokeWidth={4} opacity={0.4} />
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={isActive ? 6 : 4.5}
              strokeDasharray={edge.meaning === "obligation" ? "10 6" : undefined}
              markerEnd={p > 0.85 ? `url(#arrow-${edge.meaning})` : undefined}
              opacity={p}
            />
            {p > 0.04 && p < 0.96 && (
              <circle cx={dotX} cy={dotY} r={7} fill={color} />
            )}
            {edge.label && (
              <g transform={`translate(${labelX},${labelY})`} opacity={p}>
                <rect
                  x={-Math.max(70, edge.label.length * 5.2)}
                  y={-18}
                  width={Math.max(140, edge.label.length * 10.4)}
                  height={26}
                  rx={6}
                  fill={C.navy}
                  stroke={color}
                  strokeWidth={1.5}
                />
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight={700}
                  fill={C.white}
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {nodes.map((node) => {
        const p = ramp(frame, node.revealedAt ?? 0, 14, "out");
        if (p <= 0.01) return null;
        const w = node.width ?? 210;
        const h = node.height ?? 108;
        const tone = NODE_TONES[node.tone ?? "neutral"];
        const isActive = activeNodeId === node.id;

        return (
          <g
            key={node.id}
            transform={`translate(${node.x},${node.y}) scale(${0.92 + 0.08 * p})`}
            opacity={p}
          >
            <rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              rx={14}
              fill={isActive ? "#233A59" : C.panel}
              stroke={isActive ? C.yellow : tone.border}
              strokeWidth={isActive ? 4.5 : 3}
            />
            <text
              x={0}
              y={node.amount !== undefined ? -16 : -4}
              textAnchor="middle"
              fontSize={20}
              fontWeight={750}
              fill={C.white}
            >
              {node.label}
            </text>
            {node.amount !== undefined && (
              <text
                x={0}
                y={18}
                textAnchor="middle"
                fontSize={28}
                fontWeight={800}
                fill={tone.accent}
              >
                {usd(node.amount)}
              </text>
            )}
            {node.sublabel && (
              <text
                x={0}
                y={node.amount !== undefined ? 40 : 22}
                textAnchor="middle"
                fontSize={15}
                fill={C.muted}
              >
                {node.sublabel}
              </text>
            )}
          </g>
        );
      })}

      {legend && (
        <g transform={`translate(24,${height - 22})`}>
          {(
            [
              ["transfer", "Money transfer"],
              ["obligation", "Scheduled obligation"],
              ["return-flow", "Returning / feedback flow"],
            ] as const
          ).map(([kind, text], idx) => (
            <g key={kind} transform={`translate(${idx * 250},0)`}>
              <line
                x1={0}
                y1={0}
                x2={28}
                y2={0}
                stroke={EDGE_COLORS[kind]}
                strokeWidth={4}
                strokeDasharray={kind === "obligation" ? "6 4" : undefined}
              />
              <text x={36} y={5} fontSize={16} fill={C.muted}>
                {text}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export { MoneyFlow as DocumentaryMoneyFlow };
