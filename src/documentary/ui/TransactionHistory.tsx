import { C } from "../../design/tokens";
import { sum, usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  StatusPill,
  useUiFrame,
  type UiCommonProps,
  type UiStatus,
} from "./shared";

export type TransactionRow = {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  recurring?: boolean;
  status: UiStatus;
  nextStatus?: UiStatus;
  revealAt?: number;
};

export type TransactionHistoryProps = UiCommonProps & {
  title?: string;
  transactions: readonly TransactionRow[];
  transitionAt?: number;
  startingBalance?: number;
};

export function TransactionHistory({
  frame: frameOverride,
  from = 0,
  variant = "desktop",
  brandName = "Harbor Checking",
  title = "Transaction Ledger",
  transactions,
  transitionAt = 48,
  startingBalance,
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: TransactionHistoryProps) {
  const { frame, local } = useUiFrame(frameOverride, from);
  const totalOutflow = sum(transactions.map((t) => t.amount));

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle={title}
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#B33535" }}>
          Total charges: -{usd(totalOutflow)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {transactions.map((tx, idx) => {
          const appearFrame = tx.revealAt ?? 4 + idx * 8;
          const opacity = ramp(local, appearFrame, 12, "out");
          const running =
            startingBalance !== undefined
              ? startingBalance -
                sum(transactions.slice(0, idx + 1).map((t) => t.amount))
              : undefined;

          return (
            <div key={tx.id} style={{ opacity }}>
              <HighlightRow
                id={tx.id}
                highlightId={highlightId}
                isolateHighlight={isolateHighlight}
                zoomHighlight={zoomHighlight}
                frame={frame}
                from={from + appearFrame}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      variant === "mobile"
                        ? "1fr auto"
                        : running !== undefined
                          ? "2fr 1.1fr 1fr auto 1fr"
                          : "2fr 1.2fr 1fr auto",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    background: C.white,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 750 }}>
                      {tx.merchant}
                    </div>
                    <div style={{ fontSize: 16, color: "#475569" }}>
                      {tx.date}
                      {tx.recurring ? " · Recurring" : ""}
                    </div>
                  </div>
                  {variant === "desktop" && (
                    <div style={{ fontSize: 17, color: "#334155", fontWeight: 600 }}>
                      {tx.category}
                    </div>
                  )}
                  <StatusPill
                    status={tx.status}
                    nextStatus={tx.nextStatus}
                    transitionAt={transitionAt}
                    frame={frame}
                  />
                  <div
                    style={{
                      fontSize: 21,
                      fontWeight: 800,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    -{usd(tx.amount)}
                  </div>
                  {variant === "desktop" && running !== undefined && (
                    <div
                      style={{
                        fontSize: 18,
                        color: running < 100 ? "#B33535" : "#475569",
                        textAlign: "right",
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      Bal {usd(running)}
                    </div>
                  )}
                </div>
              </HighlightRow>
            </div>
          );
        })}
      </div>
    </DeviceShell>
  );
}
