import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { ramp } from "../core/keyframes";

export type CauseEffectNode = {
  id: string;
  role: "Trigger" | "Mechanism" | "Consequence" | "Alternative";
  headline: string;
  detail: string;
  revealedAt?: number;
};

const ROLE_COLOR: Record<CauseEffectNode["role"], string> = {
  Trigger: C.yellow,
  Mechanism: C.white,
  Consequence: C.red,
  Alternative: C.teal,
};

export function CauseEffectSequence({
  title,
  chain,
  alternativeChain,
  width = 1120,
  frame: frameOverride,
}: {
  title?: string;
  chain: readonly CauseEffectNode[];
  alternativeChain?: readonly CauseEffectNode[];
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;

  const renderChain = (nodes: readonly CauseEffectNode[]) => (
    <div style={{ display: "flex", alignItems: "stretch", gap: 12 }}>
      {nodes.map((node, idx) => {
        const p = ramp(frame, node.revealedAt ?? idx * 14, 14, "out");
        const color = ROLE_COLOR[node.role];
        return (
          <div
            key={node.id}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: p,
              transform: `translateY(${10 * (1 - p)}px)`,
            }}
          >
            <div
              style={{
                flex: 1,
                background: C.navy,
                border: `2.5px solid ${color}`,
                borderRadius: 12,
                padding: "16px 18px",
                minHeight: 132,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  color,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {node.role}
              </div>
              <div style={{ fontSize: 21, fontWeight: 800, color: C.white }}>
                {node.headline}
              </div>
              <div style={{ fontSize: 16, color: C.muted, marginTop: 6 }}>
                {node.detail}
              </div>
            </div>
            {idx < nodes.length - 1 && (
              <div style={{ fontSize: 26, fontWeight: 800, color }}>→</div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        width,
        fontFamily: font,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {title && (
        <div style={{ fontSize: 24, fontWeight: 800, color: C.white }}>
          {title}
        </div>
      )}
      {renderChain(chain)}
      {alternativeChain && renderChain(alternativeChain)}
    </div>
  );
}
