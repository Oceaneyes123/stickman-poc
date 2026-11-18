import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { clamp01, ramp } from "../core/keyframes";

export type DisclosureMode = "hidden" | "badge";

export type UiCommonProps = {
  frame?: number;
  from?: number;
  variant?: "desktop" | "mobile";
  brandName?: string;
  highlightId?: string;
  isolateHighlight?: boolean;
  zoomHighlight?: boolean;
  disclosureMode?: DisclosureMode;
  disclosureLabel?: string;
  width?: number;
};

export type UiStatus =
  | "pending"
  | "completed"
  | "failed"
  | "scheduled"
  | "overdue"
  | "active"
  | "paused";

export const STATUS_COLORS: Record<
  UiStatus,
  { bg: string; fg: string; label: string }
> = {
  pending: { bg: "#FEF3C7", fg: "#92400E", label: "Pending" },
  completed: { bg: "#CCFBF1", fg: "#115E59", label: "Completed" },
  failed: { bg: "#FEE2E2", fg: "#991B1B", label: "Failed" },
  scheduled: { bg: "#E2E8F0", fg: C.navy, label: "Scheduled" },
  overdue: { bg: C.red, fg: C.navy, label: "Overdue" },
  active: { bg: C.teal, fg: C.navy, label: "Active" },
  paused: { bg: "#E2E8F0", fg: "#475569", label: "Paused" },
};

export function useUiFrame(frameOverride?: number, from = 0) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  return { frame, local: frame - from };
}

export function DeviceShell({
  variant = "desktop",
  brandName,
  subtitle,
  disclosureMode = "hidden",
  disclosureLabel = "Illustrative interface",
  width,
  style,
  children,
}: {
  variant?: "desktop" | "mobile";
  brandName: string;
  subtitle?: string;
  disclosureMode?: DisclosureMode;
  disclosureLabel?: string;
  width?: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const resolvedWidth = width ?? (variant === "mobile" ? 460 : 860);
  const isMobile = variant === "mobile";

  return (
    <div
      style={{
        width: resolvedWidth,
        background: C.white,
        color: C.navy,
        borderRadius: isMobile ? 38 : 20,
        border: isMobile ? `10px solid ${C.navy}` : `3px solid ${C.line}`,
        boxShadow: "0 20px 50px rgba(8, 16, 28, 0.28)",
        overflow: "hidden",
        fontFamily: font,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {isMobile ? (
        <div
          style={{
            background: C.navy,
            color: C.white,
            padding: "14px 24px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.4 }}>
            09:41
          </span>
          <div
            style={{
              width: 92,
              height: 18,
              borderRadius: 9,
              background: "#0B1523",
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 600, color: C.muted }}>
            {brandName}
          </span>
        </div>
      ) : (
        <div
          style={{
            background: C.navy,
            color: C.white,
            padding: "16px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", gap: 7 }}>
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 6,
                  background: C.red,
                }}
              />
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 6,
                  background: C.yellow,
                }}
              />
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 6,
                  background: C.teal,
                }}
              />
            </div>
            <span style={{ fontSize: 22, fontWeight: 750 }}>{brandName}</span>
            {subtitle && (
              <span style={{ fontSize: 18, color: C.muted }}>· {subtitle}</span>
            )}
          </div>
          {disclosureMode === "badge" && (
            <span
              style={{
                background: C.panel,
                color: C.muted,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {disclosureLabel}
            </span>
          )}
        </div>
      )}
      {isMobile && disclosureMode === "badge" && (
        <div
          style={{
            background: "#E2E8F0",
            color: "#334155",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 600,
            padding: "4px 12px",
          }}
        >
          {disclosureLabel}
        </div>
      )}
      <div style={{ padding: isMobile ? "22px 22px 26px" : "26px 28px" }}>
        {children}
      </div>
    </div>
  );
}

export function StatusPill({
  status,
  nextStatus,
  transitionAt,
  frame: frameOverride,
}: {
  status: UiStatus;
  nextStatus?: UiStatus;
  transitionAt?: number;
  frame?: number;
}) {
  const { frame } = useUiFrame(frameOverride);
  const switched =
    nextStatus !== undefined &&
    transitionAt !== undefined &&
    frame >= transitionAt;
  const active = switched ? nextStatus : status;
  const style = STATUS_COLORS[active];
  const pulse =
    switched && transitionAt !== undefined
      ? 1 + 0.08 * Math.sin(clamp01((frame - transitionAt) / 14) * Math.PI)
      : 1;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 14px",
        borderRadius: 999,
        background: style.bg,
        color: style.fg,
        fontSize: 17,
        fontWeight: 700,
        transform: `scale(${pulse})`,
        whiteSpace: "nowrap",
      }}
    >
      {style.label}
    </span>
  );
}

export function HighlightRow({
  id,
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  frame: frameOverride,
  from = 0,
  accentColor = C.yellow,
  children,
}: {
  id: string;
  highlightId?: string;
  isolateHighlight?: boolean;
  zoomHighlight?: boolean;
  frame?: number;
  from?: number;
  accentColor?: string;
  children: ReactNode;
}) {
  const { frame } = useUiFrame(frameOverride);
  const hasSelection = Boolean(highlightId);
  const isHighlighted = highlightId === id;
  const p = isHighlighted ? ramp(frame, from, 14, "out") : 0;
  const opacity = hasSelection && !isHighlighted && isolateHighlight ? 0.32 : 1;
  const scale = isHighlighted && zoomHighlight ? 1 + 0.035 * p : 1;

  return (
    <div
      style={{
        position: "relative",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "50% 50%",
        borderRadius: 12,
        boxShadow: isHighlighted
          ? `0 0 0 ${Math.round(3 * p)}px ${accentColor}`
          : undefined,
        background: isHighlighted ? "#FFFBEB" : undefined,
      }}
    >
      {children}
    </div>
  );
}
