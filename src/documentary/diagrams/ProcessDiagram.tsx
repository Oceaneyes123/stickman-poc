import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { usd } from "../../finance/math";
import { ramp } from "../core/keyframes";

export type ProcessStage = {
  id: string;
  stepNumber: number;
  title: string;
  subtitle?: string;
  amount?: number;
  statusLabel?: string;
  tone?: "money" | "cost" | "alternative" | "neutral";
  revealedAt?: number;
};

const TONE_BORDER = {
  money: C.yellow,
  cost: C.red,
  alternative: C.teal,
  neutral: C.line,
} as const;

export function ProcessDiagram({
  title,
  stages,
  comparisonTitle,
  comparisonStages,
  activeStageId,
  width = 1120,
  frame: frameOverride,
}: {
  title: string;
  stages: readonly ProcessStage[];
  comparisonTitle?: string;
  comparisonStages?: readonly ProcessStage[];
  activeStageId?: string;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;

  const renderRow = (rowTitle: string, items: readonly ProcessStage[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.white }}>{rowTitle}</div>
      <div style={{ display: "flex", alignItems: "stretch", gap: 12 }}>
        {items.map((stage, idx) => {
          const p = ramp(frame, stage.revealedAt ?? idx * 12, 14, "out");
          const border = TONE_BORDER[stage.tone ?? "neutral"];
          const isActive = activeStageId === stage.id;
          return (
            <div
              key={stage.id}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: p,
                transform: `translateY(${12 * (1 - p)}px)`,
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: isActive ? "#233A59" : C.panel,
                  border: `${isActive ? 3 : 2}px solid ${isActive ? C.yellow : border}`,
                  borderRadius: 14,
                  padding: "16px 18px",
                  color: C.white,
                  boxSizing: "border-box",
                  minHeight: 152,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      background: border,
                      color: C.navy,
                      fontSize: 16,
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stage.stepNumber}
                  </span>
                  {stage.statusLabel && (
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: border === C.line ? C.muted : border,
                      }}
                    >
                      {stage.statusLabel}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 21, fontWeight: 800 }}>{stage.title}</div>
                  {stage.subtitle && (
                    <div style={{ fontSize: 16, color: C.muted, marginTop: 4 }}>
                      {stage.subtitle}
                    </div>
                  )}
                </div>
                {stage.amount !== undefined && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 28,
                      fontWeight: 800,
                      color: border === C.line ? C.yellow : border,
                    }}
                  >
                    {usd(stage.amount)}
                  </div>
                )}
              </div>
              {idx < items.length - 1 && (
                <div style={{ fontSize: 26, fontWeight: 800, color: C.yellow }}>
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width,
        fontFamily: font,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {renderRow(title, stages)}
      {comparisonStages &&
        comparisonTitle &&
        renderRow(comparisonTitle, comparisonStages)}
    </div>
  );
}
