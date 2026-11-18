import { C } from "../../design/tokens";
import { calculateLoanBreakdown, usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  useUiFrame,
  type UiCommonProps,
} from "./shared";

export type LoanPaymentBreakdownProps = UiCommonProps & {
  loanTitle?: string;
  principal: number;
  annualRate: number;
  months: number;
  focusMonthIndex?: number;
};

export function LoanPaymentBreakdown({
  frame: frameOverride,
  from = 0,
  variant = "desktop",
  brandName = "Meridian Auto Finance",
  loanTitle = "Fixed-Term Installment Loan",
  principal,
  annualRate,
  months,
  focusMonthIndex = 0,
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: LoanPaymentBreakdownProps) {
  const { frame, local } = useUiFrame(frameOverride, from);
  const loan = calculateLoanBreakdown({ principal, annualRate, months });
  const barProgress = ramp(local, 6, 22, "out");
  const sampleMonths = [
    loan.schedule[focusMonthIndex] ?? loan.schedule[0],
    loan.schedule[Math.floor(loan.schedule.length / 2)] ?? loan.schedule[0],
    loan.schedule[loan.schedule.length - 1] ?? loan.schedule[0],
  ];

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle={loanTitle}
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>
            Monthly Payment: {usd(Math.round(loan.monthlyPayment))}
          </div>
          <div style={{ fontSize: 17, color: "#475569" }}>
            {usd(principal)} principal · {(annualRate * 100).toFixed(1)}% APR · {months} months
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, color: "#475569" }}>Total interest cost</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#B33535" }}>
            {usd(Math.round(loan.totalInterest))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            height: 28,
            borderRadius: 10,
            overflow: "hidden",
            display: "flex",
            background: "#E2E8F0",
          }}
        >
          <div
            style={{
              width: `${loan.principalShare * 100 * barProgress}%`,
              background: C.teal,
            }}
          />
          <div
            style={{
              width: `${loan.interestShare * 100 * barProgress}%`,
              background: C.red,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 17,
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          <span style={{ color: "#115E59" }}>
            Principal: {usd(principal)} ({Math.round(loan.principalShare * 100)}%)
          </span>
          <span style={{ color: "#991B1B" }}>
            Interest: {usd(Math.round(loan.totalInterest))} ({Math.round(loan.interestShare * 100)}%)
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sampleMonths.map((row, i) => (
          <HighlightRow
            key={`${row.month}-${i}`}
            id={`month-${row.month}`}
            highlightId={highlightId}
            isolateHighlight={isolateHighlight}
            zoomHighlight={zoomHighlight}
            frame={frame}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1.2fr",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1px solid #CBD5E1",
                background: C.white,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              <span>Month {row.month}</span>
              <span style={{ color: "#115E59" }}>
                Principal {usd(Math.round(row.principal))}
              </span>
              <span style={{ color: "#991B1B" }}>
                Interest {usd(Math.round(row.interest))}
              </span>
              <span style={{ textAlign: "right", color: "#475569" }}>
                Bal {usd(Math.round(row.balance))}
              </span>
            </div>
          </HighlightRow>
        ))}
      </div>
    </DeviceShell>
  );
}
