import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { ramp, sample, type Track } from "../core/keyframes";
import {
  EvidenceHighlight,
  type HighlightAnnotation,
  type RedactionBox,
} from "./EvidenceHighlight";
import { SourceCitation, type DocumentAuthenticity } from "./SourceCitation";

export type DocumentClause = {
  id: string;
  heading?: string;
  text: string;
  redacted?: boolean;
  highlightAt?: number;
  highlightColor?: string;
  callout?: string;
};

export type DocumentViewerProps = {
  title: string;
  subtitle?: string;
  authenticity: DocumentAuthenticity;
  disclosureMode?: "hidden" | "badge" | "citation";
  source?: string;
  date?: string;
  scopeNote?: string;
  claimId?: string;
  clauses: readonly DocumentClause[];
  activeClauseId?: string;
  scrollOffset?: Track;
  pageIndex?: number;
  totalPages?: number;
  zoomAt?: number;
  zoomScale?: number;
  annotations?: readonly HighlightAnnotation[];
  redactions?: readonly RedactionBox[];
  width?: number;
  height?: number;
  frame?: number;
};

const AUTH_META: Record<
  DocumentAuthenticity,
  { badge: string; headerBg: string; border: string; paper: string }
> = {
  "fictional-illustration": {
    badge: "ILLUSTRATIVE EXAMPLE",
    headerBg: C.navy,
    border: C.line,
    paper: C.white,
  },
  "recreated-example": {
    badge: "RECREATED DOCUMENT",
    headerBg: "#24374C",
    border: C.yellow,
    paper: "#FFFDF7",
  },
  "authentic-excerpt": {
    badge: "DOCUMENT EXCERPT",
    headerBg: "#0E1A2B",
    border: C.teal,
    paper: "#F8FAFC",
  },
};

export function DocumentViewer({
  title,
  subtitle,
  authenticity,
  disclosureMode,
  source,
  date,
  scopeNote,
  claimId,
  clauses,
  activeClauseId,
  scrollOffset = 0,
  pageIndex,
  totalPages,
  zoomAt,
  zoomScale = 1.12,
  annotations = [],
  redactions = [],
  width = 820,
  height = 680,
  frame: frameOverride,
}: DocumentViewerProps) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const meta = AUTH_META[authenticity];
  const showBadge =
    disclosureMode === "badge" ||
    (disclosureMode === undefined && authenticity !== "fictional-illustration");
  const scrollY = sample(scrollOffset, frame, 0);
  const zoomP = zoomAt !== undefined ? ramp(frame, zoomAt, 18, "out") : 0;
  const scale = 1 + (zoomScale - 1) * zoomP;

  return (
    <div
      style={{
        width,
        fontFamily: font,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          width,
          height,
          background: meta.paper,
          color: C.navy,
          borderRadius: 14,
          border: `3px solid ${meta.border}`,
          boxShadow: "0 20px 44px rgba(8, 16, 28, 0.28)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            background: meta.headerBg,
            color: C.white,
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 23, fontWeight: 800 }}>{title}</div>
            {subtitle && (
              <div style={{ fontSize: 16, color: C.muted }}>{subtitle}</div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {pageIndex !== undefined && totalPages !== undefined && (
              <span style={{ fontSize: 16, color: C.muted, fontWeight: 600 }}>
                Page {pageIndex} of {totalPages}
              </span>
            )}
            {showBadge && (
              <span
                style={{
                  background:
                    authenticity === "authentic-excerpt" ? C.teal : C.yellow,
                  color: C.navy,
                  fontSize: 14,
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                {meta.badge}
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            padding: "24px 28px",
            transformOrigin: "50% 35%",
            transform: `translateY(${-scrollY}px) scale(${scale})`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {clauses.map((clause) => {
              const isHighlighted =
                clause.id === activeClauseId &&
                frame >= (clause.highlightAt ?? 0);
              const highlightP = isHighlighted
                ? ramp(frame, clause.highlightAt ?? 0, 14, "out")
                : 0;
              const dimmed = Boolean(activeClauseId) && clause.id !== activeClauseId;
              const accent = clause.highlightColor ?? C.yellow;

              return (
                <div
                  key={clause.id}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 10,
                    background: isHighlighted ? "#FEF9E7" : "#FFFFFF",
                    border: isHighlighted
                      ? `3px solid ${accent}`
                      : "1px solid #CBD5E1",
                    opacity: dimmed ? 0.45 : 1,
                    position: "relative",
                  }}
                >
                  {clause.heading && (
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: C.navy,
                        marginBottom: 6,
                      }}
                    >
                      {clause.heading}
                    </div>
                  )}
                  {clause.redacted ? (
                    <div
                      style={{
                        display: "inline-block",
                        background: C.navy,
                        color: C.muted,
                        padding: "6px 14px",
                        borderRadius: 4,
                        fontSize: 17,
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      [REDACTED PERSONAL DATA]
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 20,
                        lineHeight: 1.45,
                        color: "#1E293B",
                      }}
                    >
                      {clause.text}
                    </div>
                  )}
                  {isHighlighted && (
                    <div
                      style={{
                        marginTop: 10,
                        height: 4,
                        width: `${100 * highlightP}%`,
                        background: accent,
                        borderRadius: 2,
                      }}
                    />
                  )}
                  {isHighlighted && clause.callout && (
                    <div
                      style={{
                        marginTop: 10,
                        display: "inline-block",
                        background: C.navy,
                        color: accent,
                        padding: "5px 12px",
                        borderRadius: 6,
                        fontSize: 16,
                        fontWeight: 750,
                        opacity: highlightP,
                      }}
                    >
                      {clause.callout}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <EvidenceHighlight
            width={width}
            height={height}
            highlights={annotations}
            redactions={redactions}
            frame={frame}
          />
        </div>
      </div>

      {source && (
        <SourceCitation
          source={source}
          date={date}
          scopeNote={scopeNote}
          claimId={claimId}
          authenticity={authenticity}
          frame={frame}
        />
      )}
    </div>
  );
}
