import { C } from "../../design/tokens";
import { buildInstallmentSchedule, usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  useUiFrame,
  type UiCommonProps,
} from "./shared";

export type BnplOfferCardProps = UiCommonProps & {
  itemTitle: string;
  totalPrice: number;
  dates?: readonly string[];
  revealFutureAt?: number;
};

export function BnplOfferCard({
  frame: frameOverride,
  from = 0,
  variant = "mobile",
  brandName = "SplitPay · 4",
  itemTitle,
  totalPrice,
  dates = ["Today", "Week 2", "Week 4", "Week 6"],
  revealFutureAt = 24,
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: BnplOfferCardProps) {
  const { frame } = useUiFrame(frameOverride, from);
  const schedule = buildInstallmentSchedule({
    title: itemTitle,
    total: totalPrice,
    dates,
    paidCount: 1,
  });

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle="Installment Offer"
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          background: C.navy,
          color: C.white,
          borderRadius: 14,
          padding: "18px 20px",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 18, color: C.muted }}>{itemTitle}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 6,
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 800, color: C.yellow }}>
            {usd(schedule.dueToday)}{" "}
            <span style={{ fontSize: 20, fontWeight: 600, color: C.white }}>
              today
            </span>
          </div>
          <div style={{ fontSize: 20, color: C.muted }}>
            Total {usd(schedule.total)}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {schedule.items.map((item, idx) => {
          const isFuture = idx > 0;
          const p = isFuture
            ? ramp(frame, revealFutureAt + (idx - 1) * 8, 12, "out")
            : 1;
          return (
            <div key={item.index} style={{ opacity: p }}>
              <HighlightRow
                id={`p${item.index}`}
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
                    padding: "11px 14px",
                    borderRadius: 10,
                    background: isFuture ? "#FFF1F2" : "#FEF3C7",
                    border: `2px solid ${isFuture ? C.red : C.navy}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 750 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 16, color: "#475569" }}>
                      {item.date}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: C.navy,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {usd(item.amount)}
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
