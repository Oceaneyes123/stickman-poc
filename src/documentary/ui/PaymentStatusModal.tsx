import { C } from "../../design/tokens";
import { usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  StatusPill,
  useUiFrame,
  type UiCommonProps,
} from "./shared";

export type PaymentStatusModalProps = UiCommonProps & {
  merchant: string;
  amount: number;
  dateLabel: string;
  outcome: "completed" | "failed";
  transitionAt?: number;
  failureReason?: string;
  consequenceNote?: string;
};

export function PaymentStatusModal({
  frame: frameOverride,
  from = 0,
  variant = "mobile",
  brandName = "Harbor Pay",
  merchant,
  amount,
  dateLabel,
  outcome,
  transitionAt = 36,
  failureReason = "Available balance below scheduled draft amount",
  consequenceNote = "Triggers retry or separate fee review",
  disclosureMode = "hidden",
  disclosureLabel,
  width,
}: PaymentStatusModalProps) {
  const { frame } = useUiFrame(frameOverride, from);
  const settled = frame >= transitionAt;
  const resolveProgress = ramp(frame, transitionAt, 16, "out");
  const isSuccess = outcome === "completed";
  const accent = !settled ? C.yellow : isSuccess ? C.teal : C.red;

  return (
    <DeviceShell
      variant={variant}
      brandName={brandName}
      subtitle="Draft Status"
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "16px 8px 8px",
        }}
      >
        <svg width={96} height={96} viewBox="0 0 96 96">
          <circle
            cx={48}
            cy={48}
            r={42}
            fill={settled ? accent : "#FEF3C7"}
            stroke={C.navy}
            strokeWidth={4}
          />
          {!settled ? (
            <path
              d="M48 24 V48 L64 56"
              fill="none"
              stroke={C.navy}
              strokeWidth={5}
              strokeLinecap="round"
            />
          ) : isSuccess ? (
            <path
              d="M28 50 L42 64 L68 34"
              fill="none"
              stroke={C.navy}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - resolveProgress}
            />
          ) : (
            <path
              d="M32 32 L64 64 M64 32 L32 64"
              fill="none"
              stroke={C.navy}
              strokeWidth={6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - resolveProgress}
            />
          )}
        </svg>

        <div style={{ marginTop: 14, marginBottom: 10 }}>
          <StatusPill
            status="pending"
            nextStatus={outcome}
            transitionAt={transitionAt}
            frame={frame}
          />
        </div>

        <div style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>
          {merchant}
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: C.navy,
            fontVariantNumeric: "tabular-nums",
            margin: "6px 0",
          }}
        >
          {usd(amount)}
        </div>
        <div style={{ fontSize: 18, color: "#475569", marginBottom: 18 }}>
          {dateLabel}
        </div>

        {settled && !isSuccess && (
          <div
            style={{
              width: "100%",
              background: "#FEF2F2",
              border: `2px solid ${C.red}`,
              borderRadius: 12,
              padding: "14px 16px",
              textAlign: "left",
              opacity: resolveProgress,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: "#991B1B" }}>
              {failureReason}
            </div>
            <div style={{ fontSize: 17, color: "#7F1D1D", marginTop: 4 }}>
              {consequenceNote}
            </div>
          </div>
        )}

        {settled && isSuccess && (
          <div
            style={{
              width: "100%",
              background: "#F0FDFA",
              border: `2px solid ${C.teal}`,
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 18,
              fontWeight: 700,
              color: "#115E59",
              opacity: resolveProgress,
            }}
          >
            Scheduled draft cleared · balance updated
          </div>
        )}
      </div>
    </DeviceShell>
  );
}
