import { C, font } from "../../design/tokens";
import { ramp } from "../core/keyframes";
import { useCurrentFrame } from "remotion";

export type DocumentAuthenticity =
  | "fictional-illustration"
  | "recreated-example"
  | "authentic-excerpt";

export type SourceCitationProps = {
  source: string;
  title?: string;
  date?: string;
  scopeNote?: string;
  claimId?: string;
  authenticity?: DocumentAuthenticity;
  frame?: number;
  from?: number;
  align?: "left" | "right";
};

export function SourceCitation({
  source,
  title,
  date,
  scopeNote,
  claimId,
  authenticity = "authentic-excerpt",
  frame: frameOverride,
  from = 0,
  align = "left",
}: SourceCitationProps) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const opacity = ramp(frame, from, 14, "out");
  const isRecreated = authenticity === "recreated-example";

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: align === "right" ? "flex-end" : "flex-start",
        background: "rgba(14, 26, 43, 0.92)",
        borderLeft: align === "left" ? `4px solid ${isRecreated ? C.yellow : C.teal}` : undefined,
        borderRight: align === "right" ? `4px solid ${isRecreated ? C.yellow : C.teal}` : undefined,
        borderRadius: 8,
        padding: "10px 16px",
        color: C.white,
        fontFamily: font,
        opacity,
        maxWidth: 820,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        <span style={{ color: isRecreated ? C.yellow : C.teal }}>
          {isRecreated ? "Recreated Example" : "Source"}:
        </span>
        <span>{source}</span>
        {title && <span style={{ color: C.muted }}>· {title}</span>}
        {date && <span style={{ color: C.muted }}>({date})</span>}
        {claimId && (
          <span
            style={{
              background: C.panel,
              color: C.muted,
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 15,
            }}
          >
            {claimId}
          </span>
        )}
      </div>
      {scopeNote && (
        <div style={{ fontSize: 16, color: C.muted, marginTop: 4 }}>
          {scopeNote}
        </div>
      )}
    </div>
  );
}
