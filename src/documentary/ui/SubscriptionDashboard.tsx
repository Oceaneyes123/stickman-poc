import { C } from "../../design/tokens";
import { sum, usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  StatusPill,
  useUiFrame,
  type UiCommonProps,
} from "./shared";

export type SubscriptionEntry = {
  id: string;
  service: string;
  renewalDay: string;
  monthlyAmount: number;
  status: "active" | "paused";
  revealAt?: number;
};

export type SubscriptionDashboardProps = UiCommonProps & {
  subscriptions: readonly SubscriptionEntry[];
  showAnnualAt?: number;
};

export function SubscriptionDashboard({
  frame: frameOverride,
  from = 0,
  variant = "desktop",
  brandName = "Northstar Ledger",
  subscriptions,
  showAnnualAt = 40,
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: SubscriptionDashboardProps) {
  const { frame, local } = useUiFrame(frameOverride, from);
  const active = subscriptions.filter((s) => s.status === "active");
  const monthlyTotal = sum(active.map((s) => s.monthlyAmount));
  const annualTotal = monthlyTotal * 12;
  const showAnnual = ramp(frame, showAnnualAt, 16, "out");

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle="Recurring Subscriptions"
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: C.navy,
          color: C.white,
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 17, color: C.muted }}>
            {active.length} active recurring plans
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.yellow }}>
            {usd(monthlyTotal)}
            <span style={{ fontSize: 19, fontWeight: 500, color: C.muted }}>
              {" "}
              / month
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right", opacity: showAnnual }}>
          <div style={{ fontSize: 16, color: C.muted }}>Annualized run rate</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.red }}>
            {usd(annualTotal)} / yr
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {subscriptions.map((sub, idx) => {
          const p = ramp(local, sub.revealAt ?? 4 + idx * 6, 12, "out");
          return (
            <div key={sub.id} style={{ opacity: p }}>
              <HighlightRow
                id={sub.id}
                highlightId={highlightId}
                isolateHighlight={isolateHighlight}
                zoomHighlight={zoomHighlight}
                frame={frame}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid #CBD5E1",
                    background: C.white,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 750 }}>
                      {sub.service}
                    </div>
                    <div style={{ fontSize: 16, color: "#475569" }}>
                      Renews {sub.renewalDay}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <StatusPill status={sub.status} frame={frame} />
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {usd(sub.monthlyAmount)}/mo
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
