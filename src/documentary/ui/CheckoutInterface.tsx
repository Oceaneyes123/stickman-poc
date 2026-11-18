import type { ReactNode } from "react";
import { C } from "../../design/tokens";
import { buildInstallmentSchedule, usd } from "../../finance/math";
import { clamp01, ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  useUiFrame,
  type UiCommonProps,
} from "./shared";

export type CheckoutInterfaceProps = UiCommonProps & {
  productName: string;
  productSubtitle?: string;
  productArt?: ReactNode;
  fullPrice: number;
  shipping?: number;
  dates?: readonly string[];
  selectBnplAt?: number;
  revealObligationsAt?: number;
  initialMethod?: "full" | "bnpl";
};

export function CheckoutInterface({
  frame: frameOverride,
  from = 0,
  variant = "desktop",
  brandName = "Mercer & Loom",
  productName,
  productSubtitle = "In stock · standard delivery included",
  productArt,
  fullPrice,
  shipping = 0,
  dates = ["Today", "Day 14", "Day 28", "Day 42"],
  selectBnplAt = 24,
  revealObligationsAt = 48,
  initialMethod = "full",
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: CheckoutInterfaceProps) {
  const { frame } = useUiFrame(frameOverride, from);
  const total = fullPrice + shipping;
  const schedule = buildInstallmentSchedule({
    title: productName,
    total,
    dates,
    paidCount: 1,
  });
  const bnplSelected = initialMethod === "bnpl" || frame >= selectBnplAt;
  const obligationsReveal = ramp(frame, revealObligationsAt, 18, "out");
  const splitPulse =
    frame >= selectBnplAt
      ? 1 + 0.03 * Math.sin(clamp01((frame - selectBnplAt) / 14) * Math.PI)
      : 1;

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle="Checkout"
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          paddingBottom: 16,
          borderBottom: "1px solid #CBD5E1",
          marginBottom: 16,
        }}
      >
        {productArt && (
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 12,
              background: "#EFF3F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {productArt}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{productName}</div>
          <div style={{ fontSize: 17, color: "#475569", marginTop: 4 }}>
            {productSubtitle}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, color: "#475569", fontWeight: 600 }}>
            Full price
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {usd(total)}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <HighlightRow
          id="pay-full"
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
              padding: "13px 16px",
              borderRadius: 12,
              border: !bnplSelected
                ? `3px solid ${C.navy}`
                : "1px solid #CBD5E1",
              background: !bnplSelected ? "#F8FAFC" : "#FFFFFF",
              opacity: bnplSelected ? 0.65 : 1,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>Pay in full today</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{usd(total)}</div>
          </div>
        </HighlightRow>

        <HighlightRow
          id="pay-bnpl"
          highlightId={highlightId}
          isolateHighlight={isolateHighlight}
          zoomHighlight={zoomHighlight}
          frame={frame}
          accentColor={C.yellow}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 16px",
              borderRadius: 12,
              border: bnplSelected
                ? `3px solid ${C.navy}`
                : "1px solid #CBD5E1",
              background: bnplSelected ? "#FEF9E7" : "#FFFFFF",
              transform: `scale(${splitPulse})`,
            }}
          >
            <div>
              <div style={{ fontSize: 21, fontWeight: 800 }}>
                Pay in 4 installments
              </div>
              <div style={{ fontSize: 16, color: "#475569" }}>
                Every 2 weeks · total still {usd(total)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: C.navy,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {usd(schedule.dueToday)} today
              </div>
            </div>
          </div>
        </HighlightRow>
      </div>

      <div
        style={{
          marginTop: 14,
          background: C.navy,
          color: C.white,
          borderRadius: 12,
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 21,
          fontWeight: 750,
        }}
      >
        <span>{bnplSelected ? `Continue · Pay ${usd(schedule.dueToday)} now` : `Pay ${usd(total)} now`}</span>
        <span style={{ color: C.yellow }}>→</span>
      </div>

      {obligationsReveal > 0.02 && (
        <div
          style={{
            marginTop: 14,
            opacity: obligationsReveal,
            transform: `translateY(${10 * (1 - obligationsReveal)}px)`,
            padding: "12px 14px",
            borderRadius: 12,
            background: "#FFF1F2",
            border: `2px solid ${C.red}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 17,
              fontWeight: 750,
              color: "#991B1B",
              marginBottom: 8,
            }}
          >
            <span>Remaining commitment after checkout</span>
            <span>{usd(schedule.futureCommitment)} scheduled</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {schedule.items.map((item) => (
              <div
                key={item.index}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: item.index === 1 ? C.yellow : C.white,
                  border: `1.5px solid ${item.index === 1 ? C.navy : C.red}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>
                  {item.date}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>
                  {usd(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DeviceShell>
  );
}
