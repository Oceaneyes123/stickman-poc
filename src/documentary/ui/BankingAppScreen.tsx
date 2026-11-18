import { C } from "../../design/tokens";
import { remaining, usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  StatusPill,
  useUiFrame,
  type UiCommonProps,
  type UiStatus,
} from "./shared";

export type BankActivityItem = {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: UiStatus;
  nextStatus?: UiStatus;
};

export type BankingAppProps = UiCommonProps & {
  accountLabel?: string;
  initialBalance: number;
  settledBalance?: number;
  reservedUpcoming?: number;
  settledReserved?: number;
  transitionAt?: number;
  activities: readonly BankActivityItem[];
};

export function BankingAppScreen({
  frame: frameOverride,
  from = 0,
  variant = "mobile",
  brandName = "Harbor Checking",
  accountLabel = "Everyday Checking ··4108",
  initialBalance,
  settledBalance,
  reservedUpcoming = 0,
  settledReserved,
  transitionAt = 45,
  activities,
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: BankingAppProps) {
  const { frame, local } = useUiFrame(frameOverride, from);
  const t = settledBalance !== undefined ? ramp(frame, transitionAt, 20, "out") : 0;
  const balance = Math.round(
    initialBalance + ((settledBalance ?? initialBalance) - initialBalance) * t,
  );
  const reserved = Math.round(
    reservedUpcoming + ((settledReserved ?? reservedUpcoming) - reservedUpcoming) * t,
  );
  const uncommitted = Math.max(0, remaining(balance, reserved));
  const reservedRatio = balance > 0 ? Math.min(1, reserved / balance) : 0;

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle={accountLabel}
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          background: C.navy,
          color: C.white,
          borderRadius: 16,
          padding: "20px 22px",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 18, color: C.muted, marginBottom: 4 }}>
          {accountLabel}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            color: C.white,
          }}
        >
          {usd(balance)}
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            <span style={{ color: C.yellow, fontWeight: 700 }}>
              Drafts: {usd(reserved)}
            </span>
            <span style={{ color: C.teal, fontWeight: 700 }}>
              Free: {usd(uncommitted)}
            </span>
          </div>
          <div
            style={{
              height: 14,
              borderRadius: 7,
              background: C.panel,
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${reservedRatio * 100}%`,
                background: C.red,
              }}
            />
            <div
              style={{
                width: `${(1 - reservedRatio) * 100}%`,
                background: C.teal,
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 19,
          fontWeight: 750,
          color: C.navy,
          marginBottom: 12,
        }}
      >
        Recent & Upcoming Drafts
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {activities.map((item, idx) => {
          const entryOpacity = ramp(local, 4 + idx * 7, 12, "out");
          return (
            <div key={item.id} style={{ opacity: entryOpacity }}>
              <HighlightRow
                id={item.id}
                highlightId={highlightId}
                isolateHighlight={isolateHighlight}
                zoomHighlight={zoomHighlight}
                frame={frame}
                from={from + 4 + idx * 7}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid #CBD5E1",
                    background: C.white,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 17, color: "#475569" }}>
                      {item.date}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <StatusPill
                      status={item.status}
                      nextStatus={item.nextStatus}
                      transitionAt={transitionAt}
                      frame={frame}
                    />
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        fontVariantNumeric: "tabular-nums",
                        color: C.navy,
                      }}
                    >
                      -{usd(item.amount)}
                    </span>
                  </div>
                </div>
              </HighlightRow>
            </div>
          );
        })}
      </div>
    </DeviceShell>
  );
}
