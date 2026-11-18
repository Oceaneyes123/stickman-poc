import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { usd } from "../../finance/math";
import { ramp } from "../core/keyframes";

export type RelationshipSource = {
  id: string;
  label: string;
  sublabel?: string;
  amount: number;
  revealedAt?: number;
};

export function FinancialRelationship({
  title,
  sources,
  targetLabel,
  targetAmount,
  targetNote,
  relationMeaning = "Future obligations drawing from the same monthly balance",
  width = 1040,
  frame: frameOverride,
}: {
  title: string;
  sources: readonly RelationshipSource[];
  targetLabel: string;
  targetAmount: number;
  targetNote?: string;
  relationMeaning?: string;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const totalCommitted = sources.reduce((acc, s) => acc + s.amount, 0);
  const ratio = targetAmount > 0 ? Math.min(1, totalCommitted / targetAmount) : 0;

  return (
    <div
      style={{
        width,
        fontFamily: font,
        background: C.panel,
        border: `2px solid ${C.line}`,
        borderRadius: 16,
        padding: "22px 26px",
        color: C.white,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 17, color: C.muted, marginBottom: 18 }}>
        {relationMeaning}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.4fr 1fr",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sources.map((src, idx) => {
            const p = ramp(frame, src.revealedAt ?? idx * 10, 14, "out");
            return (
              <div
                key={src.id}
                style={{
                  opacity: p,
                  transform: `translateX(${-16 * (1 - p)}px)`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: C.navy,
                  borderLeft: `6px solid ${C.red}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 20, fontWeight: 750 }}>{src.label}</div>
                  {src.sublabel && (
                    <div style={{ fontSize: 15, color: C.muted }}>{src.sublabel}</div>
                  )}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.red }}>
                  -{usd(src.amount)}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", color: C.red }}>
          <div style={{ fontSize: 34, fontWeight: 800 }}>→</div>
          <div style={{ fontSize: 15, color: C.muted, fontWeight: 600 }}>
            Draws from
          </div>
        </div>

        <div
          style={{
            background: C.navy,
            border: `3px solid ${C.teal}`,
            borderRadius: 14,
            padding: "20px 22px",
          }}
        >
          <div style={{ fontSize: 17, color: C.muted }}>{targetLabel}</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.yellow }}>
            {usd(targetAmount)}
          </div>
          <div
            style={{
              height: 16,
              borderRadius: 8,
              background: "#263B57",
              overflow: "hidden",
              display: "flex",
              marginTop: 14,
              marginBottom: 10,
            }}
          >
            <div style={{ width: `${ratio * 100}%`, background: C.red }} />
            <div style={{ width: `${(1 - ratio) * 100}%`, background: C.teal }} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.teal }}>
            Uncommitted left: {usd(Math.max(0, targetAmount - totalCommitted))}
          </div>
          {targetNote && (
            <div style={{ fontSize: 15, color: C.muted, marginTop: 4 }}>
              {targetNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
