import { C } from "../../design/tokens";
import { sum, usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  useUiFrame,
  type UiCommonProps,
} from "./shared";

export type AccountBucket = {
  id: string;
  name: string;
  role: "checking" | "reserve" | "committed" | "credit";
  amount: number;
  note?: string;
};

export type AccountOverviewProps = UiCommonProps & {
  title?: string;
  accounts: readonly AccountBucket[];
  periodLabel?: string;
};

const ROLE_BAR_COLOR: Record<AccountBucket["role"], string> = {
  checking: C.teal,
  reserve: C.yellow,
  committed: C.red,
  credit: "#64748B",
};

export function AccountOverview({
  frame: frameOverride,
  from = 0,
  variant = "desktop",
  brandName = "Northstar Ledger",
  title = "Account & Obligation Overview",
  periodLabel = "Current cycle snapshot",
  accounts,
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: AccountOverviewProps) {
  const { frame, local } = useUiFrame(frameOverride, from);
  const maxVal = Math.max(1, ...accounts.map((a) => Math.abs(a.amount)));
  const cashSum = sum(
    accounts
      .filter((a) => a.role === "checking" || a.role === "reserve")
      .map((a) => a.amount),
  );
  const obligationSum = sum(
    accounts
      .filter((a) => a.role === "committed" || a.role === "credit")
      .map((a) => a.amount),
  );

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle={periodLabel}
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 19, color: "#475569", fontWeight: 600 }}>
          Cash {usd(cashSum)} · Obligations {usd(obligationSum)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {accounts.map((acc, idx) => {
          const p = ramp(local, 4 + idx * 6, 18, "out");
          const barWidth = Math.min(100, (Math.abs(acc.amount) / maxVal) * 100 * p);
          return (
            <HighlightRow
              key={acc.id}
              id={acc.id}
              highlightId={highlightId}
              isolateHighlight={isolateHighlight}
              zoomHighlight={zoomHighlight}
              frame={frame}
              from={from + 4 + idx * 6}
            >
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: "1px solid #CBD5E1",
                  background: C.white,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 750 }}>
                      {acc.name}
                    </span>
                    {acc.note && (
                      <span
                        style={{
                          fontSize: 17,
                          color: "#475569",
                          marginLeft: 10,
                        }}
                      >
                        {acc.note}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      fontVariantNumeric: "tabular-nums",
                      color: acc.role === "committed" ? "#B33535" : C.navy,
                    }}
                  >
                    {acc.role === "committed" || acc.role === "credit" ? "-" : ""}
                    {usd(Math.round(acc.amount * p))}
                  </span>
                </div>
                <div
                  style={{
                    height: 12,
                    borderRadius: 6,
                    background: "#E2E8F0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: "100%",
                      background: ROLE_BAR_COLOR[acc.role],
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>
            </HighlightRow>
          );
        })}
      </div>
    </DeviceShell>
  );
}
