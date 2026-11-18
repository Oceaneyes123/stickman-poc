import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { sum, usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import type { DocumentAuthenticity } from "./SourceCitation";

export type ReceiptLine = {
  id: string;
  label: string;
  amount: number;
  note?: string;
};

export type ReceiptViewerProps = {
  merchant: string;
  receiptDate: string;
  items: readonly ReceiptLine[];
  dueToday?: number;
  deferredAmount?: number;
  deferredLabel?: string;
  authenticity?: DocumentAuthenticity;
  disclosureMode?: "hidden" | "badge";
  highlightId?: string;
  from?: number;
  width?: number;
  frame?: number;
};

export function ReceiptViewer({
  merchant,
  receiptDate,
  items,
  dueToday,
  deferredAmount,
  deferredLabel = "Remaining installments scheduled",
  authenticity = "fictional-illustration",
  disclosureMode = "hidden",
  highlightId,
  from = 0,
  width = 480,
  frame: frameOverride,
}: ReceiptViewerProps) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const total = sum(items.map((item) => item.amount));
  const splitReveal = ramp(frame, from + 20, 16, "out");

  return (
    <div
      style={{
        width,
        background: "#FFFDF7",
        color: C.navy,
        borderRadius: 12,
        border: `3px solid ${C.navy}`,
        boxShadow: "0 18px 36px rgba(8, 16, 28, 0.22)",
        padding: "24px 26px",
        fontFamily: font,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px dashed #94A3B8",
          paddingBottom: 14,
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{merchant}</div>
          <div style={{ fontSize: 16, color: "#475569" }}>{receiptDate}</div>
        </div>
        {(disclosureMode === "badge" || authenticity === "recreated-example") && (
          <span
            style={{
              background: C.yellow,
              color: C.navy,
              fontSize: 13,
              fontWeight: 800,
              padding: "3px 8px",
              borderRadius: 5,
            }}
          >
            RECREATED RECEIPT
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, idx) => {
          const opacity = ramp(frame, from + idx * 6, 10, "out");
          const isHi = highlightId === item.id;
          return (
            <div
              key={item.id}
              style={{
                opacity,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: isHi ? "6px 10px" : "2px 0",
                borderRadius: 6,
                background: isHi ? "#FEF3C7" : undefined,
                borderLeft: isHi ? `4px solid ${C.yellow}` : undefined,
              }}
            >
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{item.label}</div>
                {item.note && (
                  <div style={{ fontSize: 15, color: "#475569" }}>
                    {item.note}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 800,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {usd(item.amount)}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          borderTop: `2px solid ${C.navy}`,
          marginTop: 14,
          paddingTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 800 }}>Order Total</span>
        <span style={{ fontSize: 32, fontWeight: 800 }}>{usd(total)}</span>
      </div>

      {dueToday !== undefined && deferredAmount !== undefined && (
        <div
          style={{
            marginTop: 14,
            opacity: splitReveal,
            background: "#F1F5F9",
            borderRadius: 10,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              fontWeight: 750,
            }}
          >
            <span>Charged today</span>
            <span>{usd(dueToday)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              fontWeight: 750,
              color: "#991B1B",
            }}
          >
            <span>{deferredLabel}</span>
            <span>{usd(deferredAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
