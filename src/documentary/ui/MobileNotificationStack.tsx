import { C } from "../../design/tokens";
import { usd } from "../../finance/math";
import { ramp } from "../core/keyframes";
import {
  DeviceShell,
  HighlightRow,
  useUiFrame,
  type UiCommonProps,
} from "./shared";

export type NotificationItem = {
  id: string;
  app: string;
  title: string;
  detail: string;
  amount?: number;
  timeLabel: string;
  tone?: "info" | "warning" | "urgent";
  revealAt?: number;
};

export type MobileNotificationStackProps = UiCommonProps & {
  notifications: readonly NotificationItem[];
  timeOfDay?: string;
};

const TONE_ACCENT = {
  info: C.teal,
  warning: C.yellow,
  urgent: C.red,
} as const;

export function MobileNotificationStack({
  frame: frameOverride,
  from = 0,
  brandName = "Alerts",
  notifications,
  timeOfDay = "Tuesday, Oct 15",
  highlightId,
  isolateHighlight = false,
  zoomHighlight = false,
  disclosureMode = "hidden",
  disclosureLabel,
  width = 460,
}: MobileNotificationStackProps) {
  const { frame, local } = useUiFrame(frameOverride, from);

  return (
    <DeviceShell
      variant="mobile"
      brandName={brandName}
      disclosureMode={disclosureMode}
      disclosureLabel={disclosureLabel}
      width={width}
      style={{ background: "#E8EEF4" }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 700,
          color: "#334155",
          marginBottom: 16,
        }}
      >
        {timeOfDay}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map((note, idx) => {
          const appear = note.revealAt ?? 4 + idx * 10;
          const p = ramp(local, appear, 14, "outBack");
          const accent = TONE_ACCENT[note.tone ?? "warning"];
          return (
            <div
              key={note.id}
              style={{
                opacity: Math.min(1, Math.max(0, p)),
                transform: `translateY(${16 * (1 - p)}px)`,
              }}
            >
              <HighlightRow
                id={note.id}
                highlightId={highlightId}
                isolateHighlight={isolateHighlight}
                zoomHighlight={zoomHighlight}
                frame={frame}
                accentColor={accent}
              >
                <div
                  style={{
                    background: C.white,
                    borderRadius: 14,
                    padding: "13px 16px",
                    borderLeft: `7px solid ${accent}`,
                    boxShadow: "0 4px 12px rgba(20, 36, 58, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#64748B",
                      marginBottom: 4,
                    }}
                  >
                    <span>{note.app.toUpperCase()}</span>
                    <span>{note.timeLabel}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 10,
                    }}
                  >
                    <div style={{ fontSize: 19, fontWeight: 750, color: C.navy }}>
                      {note.title}
                    </div>
                    {note.amount !== undefined && (
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: note.tone === "urgent" ? "#991B1B" : C.navy,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {usd(note.amount)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 16, color: "#475569", marginTop: 4 }}>
                    {note.detail}
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
