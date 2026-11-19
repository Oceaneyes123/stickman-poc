import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, font } from "../../design/tokens";
import { usd } from "../../finance/math";
import {
  sampleMotionProfile,
  type MotionProfileId,
} from "../core/motionProfiles";
import { clamp01 } from "../core/keyframes";
import {
  computeComparisonBars,
  computeThresholdBars,
  type ComparisonBarItem,
} from "./barsMath";

const TONE_FILL: Record<NonNullable<ComparisonBarItem["tone"]>, string> = {
  money: C.yellow,
  cost: C.red,
  alternative: C.teal,
  neutral: C.muted,
};

export function ThresholdMeter({
  baseAmount,
  threshold,
  addedAmount = 0,
  baseLabel = "Current cart",
  thresholdLabel = "Threshold",
  addedLabel = "Added item",
  from = 0,
  addAt = 28,
  width = 880,
  onDark = true,
  profile = "tactile-spring",
  frame: frameOverride,
}: {
  baseAmount: number;
  threshold: number;
  addedAmount?: number;
  baseLabel?: string;
  thresholdLabel?: string;
  addedLabel?: string;
  from?: number;
  addAt?: number;
  width?: number;
  onDark?: boolean;
  profile?: MotionProfileId;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameOverride ?? current;

  const enter = sampleMotionProfile(profile, frame, {
    from,
    direction: "up",
    fps,
  });
  const addSample = sampleMotionProfile(profile, frame, {
    from: addAt,
    direction: "right",
    fps,
  });

  if (!enter.visible) return null;

  const trackWidth = Math.max(240, width - 48);
  const geom = computeThresholdBars({
    baseAmount,
    threshold,
    addedAmount,
    maxWidth: trackWidth,
  });

  const baseFill = geom.baseWidth * clamp01(enter.progress);
  const addedFill = geom.addedWidth * clamp01(addSample.progress);
  const fg = onDark ? C.white : C.navy;
  const muted = onDark ? C.muted : "#475569";
  const trackBg = onDark ? "#223652" : "#DCE5EE";
  const baseColor = onDark ? C.teal : C.navy;

  return (
    <div
      style={{
        width,
        fontFamily: font,
        opacity: enter.opacity,
        transform: `translateY(${enter.ty.toFixed(2)}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontSize: 22,
          fontWeight: 700,
          color: fg,
        }}
      >
        <span>
          {baseLabel}: <strong>{usd(baseAmount)}</strong>
          {addedAmount > 0 && addSample.progress > 0.1 && (
            <span
              style={{
                background: C.yellow,
                color: C.navy,
                padding: "2px 10px",
                borderRadius: 6,
                marginLeft: 12,
                fontSize: 19,
                fontWeight: 800,
              }}
            >
              + {addedLabel}: {usd(addedAmount)}
            </span>
          )}
        </span>
        <span style={{ color: muted, fontVariantNumeric: "tabular-nums" }}>
          {thresholdLabel}: {usd(threshold)}
        </span>
      </div>

      <svg
        width={width}
        height={112}
        viewBox={`0 0 ${width} 112`}
        style={{ overflow: "visible" }}
      >
        <rect
          x={0}
          y={28}
          width={trackWidth}
          height={42}
          rx={12}
          fill={trackBg}
        />
        <rect
          x={0}
          y={28}
          width={baseFill}
          height={42}
          rx={12}
          fill={baseColor}
        />
        {addedFill > 0.5 && (
          <rect
            x={geom.baseWidth}
            y={28}
            width={addedFill}
            height={42}
            rx={8}
            fill={C.yellow}
          />
        )}
        <line
          x1={geom.thresholdX}
          y1={14}
          x2={geom.thresholdX}
          y2={84}
          stroke={C.red}
          strokeWidth={4}
          strokeDasharray="7 5"
        />
        <text
          x={geom.thresholdX}
          y={104}
          textAnchor="middle"
          fontSize={18}
          fontWeight={800}
          fill={C.red}
        >
          {usd(threshold)} cutoff
        </text>
        {geom.qualifies && geom.overhangAmount > 0 && addSample.progress > 0.45 && (
          <g opacity={clamp01((addSample.progress - 0.45) * 2)}>
            <rect
              x={geom.thresholdX + 8}
              y={-6}
              width={176}
              height={30}
              rx={8}
              fill={C.red}
            />
            <text
              x={geom.thresholdX + 96}
              y={15}
              textAnchor="middle"
              fontSize={17}
              fontWeight={800}
              fill={C.navy}
            >
              +{usd(geom.overhangAmount)} overhang
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export function ProportionalBarComparison({
  items,
  title,
  from = 0,
  width = 880,
  onDark = true,
  profile = "editorial-crisp",
  staggerFrames = 8,
  frame: frameOverride,
}: {
  items: readonly ComparisonBarItem[];
  title?: string;
  from?: number;
  width?: number;
  onDark?: boolean;
  profile?: MotionProfileId;
  staggerFrames?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameOverride ?? current;
  const maxBarWidth = Math.max(220, width - 290);
  const { bars } = computeComparisonBars(items, maxBarWidth);
  const fg = onDark ? C.white : C.navy;
  const trackBg = onDark ? "#223652" : "#DCE5EE";

  return (
    <div
      style={{
        width,
        fontFamily: font,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {title && (
        <div style={{ fontSize: 26, fontWeight: 800, color: fg }}>{title}</div>
      )}
      {bars.map((bar, idx) => {
        const m = sampleMotionProfile(profile, frame, {
          from: from + idx * staggerFrames,
          direction: "left",
          fps,
        });
        const fill =
          bar.tone && bar.tone !== "neutral"
            ? TONE_FILL[bar.tone]
            : onDark
              ? C.muted
              : "#64748B";
        return (
          <div
            key={bar.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: m.opacity,
              transform: `translateX(${m.tx.toFixed(2)}px)`,
            }}
          >
            <div
              style={{
                width: 190,
                fontSize: 21,
                fontWeight: 700,
                color: fg,
                flexShrink: 0,
              }}
            >
              {bar.label}
            </div>
            <div
              style={{
                flex: 1,
                height: 36,
                borderRadius: 10,
                background: trackBg,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: bar.width * clamp01(m.progress),
                  height: "100%",
                  borderRadius: 10,
                  background: fill,
                }}
              />
            </div>
            <div
              style={{
                width: 82,
                textAlign: "right",
                fontSize: 24,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                color: bar.tone === "cost" ? C.red : fg,
              }}
            >
              {usd(bar.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
