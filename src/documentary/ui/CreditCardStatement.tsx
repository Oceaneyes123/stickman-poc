import { C } from "../../design/tokens";
import { compareMinimumPayment, usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  useUiFrame,
  type UiCommonProps,
} from "./shared";

export type CreditCardStatementProps = UiCommonProps & {
  cardLabel?: string;
  statementDate: string;
  dueDate: string;
  balance: number;
  annualRate: number;
  fixedAlternativePayment: number;
  revealComparisonAt?: number;
};

export function CreditCardStatement({
  frame: frameOverride,
  from = 0,
  variant = "desktop",
  brandName = "Cedar Card",
  cardLabel = "Rewards Card ··8820",
  statementDate,
  dueDate,
  balance,
  annualRate,
  fixedAlternativePayment,
  revealComparisonAt = 32,
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: CreditCardStatementProps) {
  const { frame } = useUiFrame(frameOverride, from);
  const comp = compareMinimumPayment({
    balance,
    annualRate,
    fixedAlternative: fixedAlternativePayment,
  });
  const minimumDue = Math.max(
    25,
    Math.round((balance * 0.02 + (balance * annualRate) / 12) * 100) / 100,
  );
  const warningReveal = ramp(frame, revealComparisonAt, 18, "out");

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle={cardLabel}
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <HighlightRow
          id="statement-balance"
          highlightId={highlightId}
          isolateHighlight={isolateHighlight}
          zoomHighlight={zoomHighlight}
          frame={frame}
        >
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 12,
              background: C.navy,
              color: C.white,
            }}
          >
            <div style={{ fontSize: 16, color: C.muted }}>
              Statement balance ({statementDate})
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, color: C.white }}>
              {usd(balance)}
            </div>
            <div style={{ fontSize: 16, color: C.yellow, marginTop: 4 }}>
              {Math.round(annualRate * 100)}% APR · Due {dueDate}
            </div>
          </div>
        </HighlightRow>

        <HighlightRow
          id="minimum-due"
          highlightId={highlightId}
          isolateHighlight={isolateHighlight}
          zoomHighlight={zoomHighlight}
          frame={frame}
        >
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 12,
              background: "#FEF3C7",
              border: `2px solid ${C.navy}`,
            }}
          >
            <div style={{ fontSize: 16, color: "#475569", fontWeight: 700 }}>
              Minimum payment due
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, color: C.navy }}>
              {usd(Math.round(minimumDue))}
            </div>
            <div style={{ fontSize: 16, color: "#475569", marginTop: 4 }}>
              Assumes no new charges added
            </div>
          </div>
        </HighlightRow>
      </div>

      <div
        style={{
          opacity: warningReveal,
          padding: "16px 18px",
          borderRadius: 12,
          border: `2px solid ${C.red}`,
          background: "#FFF1F2",
        }}
      >
        <div style={{ fontSize: 19, fontWeight: 800, color: "#991B1B", marginBottom: 10 }}>
          Minimum Payment Disclosure (Modeled Trajectory)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: C.white, padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#475569" }}>
              Minimum payment only
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#991B1B" }}>
              {comp.minimum.months} months · {usd(Math.round(comp.minimum.totalPaid))} total
            </div>
            <div style={{ fontSize: 16, color: "#475569" }}>
              Interest: {usd(Math.round(comp.minimum.totalInterest))}
            </div>
          </div>
          <div style={{ background: "#F0FDFA", padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#115E59" }}>
              Fixed {usd(fixedAlternativePayment)}/mo
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#115E59" }}>
              {comp.fixed.months} months · {usd(Math.round(comp.fixed.totalPaid))} total
            </div>
            <div style={{ fontSize: 16, color: "#115E59" }}>
              Interest: {usd(Math.round(comp.fixed.totalInterest))}
            </div>
          </div>
        </div>
      </div>
    </DeviceShell>
  );
}
