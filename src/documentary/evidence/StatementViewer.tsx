import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import { SourceCitation, type DocumentAuthenticity } from "./SourceCitation";

export type StatementSection = {
  id: string;
  label: string;
  value: string | number;
  detail?: string;
  tone?: "neutral" | "cost" | "alternative";
};

export type StatementViewerProps = {
  institution: string;
  statementTitle: string;
  billingPeriod: string;
  authenticity: DocumentAuthenticity;
  disclosureMode?: "hidden" | "badge";
  sections: readonly StatementSection[];
  highlightId?: string;
  finePrintClause?: string;
  focusFinePrintAt?: number;
  source?: string;
  date?: string;
  width?: number;
  frame?: number;
};

export function StatementViewer({
  institution,
  statementTitle,
  billingPeriod,
  authenticity,
  disclosureMode,
  sections,
  highlightId,
  finePrintClause,
  focusFinePrintAt = 34,
  source,
  date,
  width = 760,
  frame: frameOverride,
}: StatementViewerProps) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const fineP = finePrintClause ? ramp(frame, focusFinePrintAt, 16, "out") : 0;
  const showBadge =
    disclosureMode === "badge" ||
    (disclosureMode === undefined && authenticity === "recreated-example");

  return (
    <div style={{ width, fontFamily: font, display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          background: C.white,
          color: C.navy,
          borderRadius: 14,
          border: `3px solid ${authenticity === "authentic-excerpt" ? C.teal : C.navy}`,
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(8, 16, 28, 0.25)",
        }}
      >
        <div
          style={{
            background: C.navy,
            color: C.white,
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{institution}</div>
            <div style={{ fontSize: 16, color: C.muted }}>
              {statementTitle} · {billingPeriod}
            </div>
          </div>
          {showBadge && (
            <span
              style={{
                background: C.yellow,
                color: C.navy,
                fontSize: 14,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 6,
              }}
            >
              RECREATED STATEMENT
            </span>
          )}
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {sections.map((sec) => {
            const isHi = highlightId === sec.id;
            const amountText =
              typeof sec.value === "number" ? usd(sec.value) : sec.value;
            return (
              <div
                key={sec.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: isHi ? "#FEF9E7" : "#F8FAFC",
                  border: isHi ? `2.5px solid ${C.yellow}` : "1px solid #CBD5E1",
                }}
              >
                <div>
                  <div style={{ fontSize: 20, fontWeight: 750 }}>{sec.label}</div>
                  {sec.detail && (
                    <div style={{ fontSize: 16, color: "#475569" }}>{sec.detail}</div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color:
                      sec.tone === "cost"
                        ? "#991B1B"
                        : sec.tone === "alternative"
                          ? "#115E59"
                          : C.navy,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {amountText}
                </div>
              </div>
            );
          })}

          {finePrintClause && (
            <div
              style={{
                marginTop: 8,
                padding: "14px 16px",
                borderRadius: 10,
                background: fineP > 0.2 ? "#FFF1F2" : "#F1F5F9",
                border: `2px solid ${fineP > 0.2 ? C.red : "#CBD5E1"}`,
                transform: `scale(${1 + 0.03 * fineP})`,
                transformOrigin: "50% 50%",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#991B1B",
                  marginBottom: 4,
                }}
              >
                IMPORTANT TERMS CLAUSE
              </div>
              <div style={{ fontSize: 18, lineHeight: 1.4, color: C.navy }}>
                {finePrintClause}
              </div>
            </div>
          )}
        </div>
      </div>

      {source && (
        <SourceCitation
          source={source}
          date={date}
          authenticity={authenticity}
          frame={frame}
        />
      )}
    </div>
  );
}
