import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { ramp } from "../core/keyframes";
import { SourceCitation, type DocumentAuthenticity } from "./SourceCitation";

export type ComparisonPanelDoc = {
  title: string;
  subtitle?: string;
  headlineValue: string;
  headlineLabel: string;
  lines: readonly string[];
  tone: "emphasis" | "obligation" | "alternative";
};

export type DocumentComparisonProps = {
  left: ComparisonPanelDoc;
  right: ComparisonPanelDoc;
  differenceSummary: string;
  revealDifferenceAt?: number;
  authenticity?: DocumentAuthenticity;
  source?: string;
  date?: string;
  width?: number;
  frame?: number;
};

const TONE_MAP = {
  emphasis: { border: C.yellow, header: C.navy, value: C.navy, bg: "#FEF9E7" },
  obligation: { border: C.red, header: "#7F1D1D", value: "#991B1B", bg: "#FFF1F2" },
  alternative: { border: C.teal, header: "#115E59", value: "#115E59", bg: "#F0FDFA" },
} as const;

export function DocumentComparison({
  left,
  right,
  differenceSummary,
  revealDifferenceAt = 28,
  authenticity = "fictional-illustration",
  source,
  date,
  width = 1120,
  frame: frameOverride,
}: DocumentComparisonProps) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const rightP = ramp(frame, 10, 16, "out");
  const diffP = ramp(frame, revealDifferenceAt, 18, "out");

  const renderPanel = (doc: ComparisonPanelDoc, opacity: number) => {
    const tone = TONE_MAP[doc.tone];
    return (
      <div
        style={{
          flex: 1,
          background: C.white,
          borderRadius: 14,
          border: `3px solid ${tone.border}`,
          overflow: "hidden",
          opacity,
          boxShadow: "0 16px 34px rgba(8, 16, 28, 0.22)",
        }}
      >
        <div style={{ background: tone.header, color: C.white, padding: "14px 20px" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{doc.title}</div>
          {doc.subtitle && (
            <div style={{ fontSize: 16, color: "#E2E8F0" }}>{doc.subtitle}</div>
          )}
        </div>
        <div style={{ padding: "20px 22px" }}>
          <div
            style={{
              background: tone.bg,
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#475569" }}>
              {doc.headlineLabel}
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: tone.value,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {doc.headlineValue}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {doc.lines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 19,
                  color: C.navy,
                  padding: "6px 0",
                  borderBottom: i < doc.lines.length - 1 ? "1px solid #E2E8F0" : undefined,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width, fontFamily: font, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 28 }}>
        {renderPanel(left, 1)}
        {renderPanel(right, rightP)}
      </div>
      <div
        style={{
          opacity: diffP,
          transform: `translateY(${10 * (1 - diffP)}px)`,
          background: C.navy,
          border: `2px solid ${C.yellow}`,
          borderRadius: 12,
          padding: "14px 22px",
          color: C.white,
          fontSize: 22,
          fontWeight: 750,
          textAlign: "center",
        }}
      >
        {differenceSummary}
      </div>
      {source && (
        <SourceCitation
          source={source}
          date={date}
          authenticity={authenticity}
          frame={frame}
        />
      )}
    </div>
  );
}
