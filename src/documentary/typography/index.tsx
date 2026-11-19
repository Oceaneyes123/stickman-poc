import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { usd } from "../../finance/math";
import {
  AnimatedNumber,
  AnimatedUnderline,
  ComparisonReveal,
  KineticHeadline,
} from "../../typography";
import { ramp } from "../core/keyframes";
import { wrapText } from "../core/textMetrics";

export function DocumentarySectionHeading({
  eyebrow,
  title,
  subtitle,
  from = 0,
  until = 600,
  width = 880,
  onDark = true,
  frame: frameOverride,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  from?: number;
  until?: number;
  width?: number;
  onDark?: boolean;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const fg = onDark ? C.white : C.navy;
  const sub = onDark ? C.muted : "#475569";
  const p = ramp(frame, from, 14, "out");
  const fontSize = 42;
  const lines = wrapText(title, width, fontSize, 700);
  const lineH = fontSize * 1.2;
  const svgHeight = Math.ceil(lines.length * lineH + 26);
  const underlineY = Math.round(6 + lines.length * lineH + 6);

  return (
    <div style={{ width, fontFamily: font, opacity: p }}>
      {eyebrow && (
        <div
          style={{
            display: "inline-block",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: onDark ? C.yellow : C.navy,
            background: onDark ? "transparent" : C.yellow,
            padding: onDark ? 0 : "3px 10px",
            borderRadius: onDark ? 0 : 6,
            marginBottom: 8,
          }}
        >
          {eyebrow}
        </div>
      )}
      <svg width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`}>
        <KineticHeadline
          x={0}
          y={6}
          from={from}
          until={until}
          text={lines.join("\n")}
          unit="line"
          size={fontSize}
          width={width}
          color={fg}
          frame={frame}
        />
        <AnimatedUnderline
          x={0}
          y={underlineY}
          from={from + 8}
          until={until}
          width={Math.min(420, width * 0.45)}
          frame={frame}
        />
      </svg>
      {subtitle && (
        <div style={{ fontSize: 22, color: sub, marginTop: 4 }}>{subtitle}</div>
      )}
    </div>
  );
}

export function FinancialLabelCard({
  label,
  amount,
  unitOrPeriod,
  tone = "money",
  from = 0,
  until = 600,
  width = 360,
  frame: frameOverride,
}: {
  label: string;
  amount: number;
  unitOrPeriod?: string;
  tone?: "money" | "cost" | "alternative";
  from?: number;
  until?: number;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const p = ramp(frame, from, 14, "out");
  const accent =
    tone === "cost" ? C.red : tone === "alternative" ? C.teal : C.yellow;

  return (
    <div
      style={{
        width,
        background: C.panel,
        borderLeft: `7px solid ${accent}`,
        borderRadius: 12,
        padding: "16px 20px",
        color: C.white,
        fontFamily: font,
        opacity: p,
        transform: `translateY(${10 * (1 - p)}px)`,
        boxShadow: "0 14px 30px rgba(8, 16, 28, 0.22)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>
        {label}
      </div>
      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 12 }}>
        <svg width={145} height={54} viewBox="0 0 145 54">
          <AnimatedNumber
            x={0}
            y={44}
            from={from}
            until={until}
            value={amount}
            size={48}
            color={accent}
            frame={frame}
          />
        </svg>
        {unitOrPeriod && (
          <span style={{ fontSize: 19, color: C.white, fontWeight: 600 }}>
            {unitOrPeriod}
          </span>
        )}
      </div>
    </div>
  );
}

export function ExplanatoryCallout({
  title,
  detail,
  accent = C.yellow,
  from = 0,
  width = 400,
  frame: frameOverride,
}: {
  title: string;
  detail?: string;
  accent?: string;
  from?: number;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const p = ramp(frame, from, 14, "out");

  return (
    <div
      style={{
        width,
        background: "rgba(14, 26, 43, 0.94)",
        border: `2.5px solid ${accent}`,
        borderRadius: 12,
        padding: "14px 18px",
        color: C.white,
        fontFamily: font,
        opacity: p,
        transform: `translateY(${10 * (1 - p)}px)`,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{title}</div>
      {detail && (
        <div style={{ fontSize: 18, color: C.white, marginTop: 4, lineHeight: 1.35 }}>
          {detail}
        </div>
      )}
    </div>
  );
}

export function ContextualAnnotation({
  text,
  from = 0,
  onDark = true,
  frame: frameOverride,
}: {
  text: string;
  from?: number;
  onDark?: boolean;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const p = ramp(frame, from, 14, "out");

  return (
    <div
      style={{
        display: "inline-block",
        background: onDark ? "rgba(29, 48, 72, 0.9)" : "#E2E8F0",
        color: onDark ? C.muted : "#334155",
        borderRadius: 8,
        padding: "7px 14px",
        fontSize: 18,
        fontWeight: 600,
        fontFamily: font,
        opacity: p,
      }}
    >
      {text}
    </div>
  );
}

export function SelectiveEmphasisText({
  text,
  emphasis,
  emphasisColor = C.yellow,
  color = C.white,
  size = 44,
  width = 760,
  from = 0,
  until = 600,
  frame: frameOverride,
}: {
  text: string;
  emphasis?: string;
  emphasisColor?: string;
  color?: string;
  size?: number;
  width?: number;
  from?: number;
  until?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;

  return (
    <svg width={width} height={size * 2.8} viewBox={`0 0 ${width} ${size * 2.8}`}>
      <KineticHeadline
        x={0}
        y={0}
        from={from}
        until={until}
        text={text}
        width={width}
        size={size}
        color={color}
        emphasis={emphasis}
        emphasisColor={emphasisColor}
        motion="slide"
        frame={frame}
      />
    </svg>
  );
}

export function DocumentaryComparisonNumbers({
  leftLabel,
  leftAmount,
  rightLabel,
  rightAmount,
  leftAt = 6,
  rightAt = 24,
  differenceAt = 52,
  until = 600,
  width = 620,
  frame: frameOverride,
}: {
  leftLabel: string;
  leftAmount: number;
  rightLabel: string;
  rightAmount: number;
  leftAt?: number;
  rightAt?: number;
  differenceAt?: number;
  until?: number;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  return (
    <div style={{ width, fontFamily: font }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          fontWeight: 700,
          color: C.muted,
          marginBottom: 8,
        }}
      >
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <svg width={width} height={240} viewBox={`0 0 ${width} 240`}>
        <ComparisonReveal
          x={0}
          y={68}
          from={0}
          until={until}
          left={leftAmount}
          right={rightAmount}
          leftAt={leftAt}
          rightAt={rightAt}
          differenceAt={differenceAt}
          width={width - 210}
          color={C.white}
          frame={frame}
        />
        <text x={0} y={230} fontSize={20} fill={C.muted}>
          Difference: {usd(rightAmount - leftAmount)}
        </text>
      </svg>
    </div>
  );
}
