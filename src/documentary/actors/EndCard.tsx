import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, font } from "../../design/tokens";
import { clamp01, ramp } from "../core/keyframes";
import { getLook, type LookId } from "../core/looks";
import { sampleSpring } from "../core/motionProfiles";

export function DocumentaryEndCard({
  title = "THE MONEY TRAP",
  subtitle,
  tone = "dark",
  look,
  duration,
  frame: frameOverride,
}: {
  title?: string;
  subtitle?: string;
  tone?: "dark" | "light";
  look?: LookId;
  duration: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameOverride ?? current;
  const fadeIn = clamp01(ramp(frame, 0, 10, "out"));
  const fadeOut = clamp01(ramp(duration - frame, 0, 8, "out"));
  const scale = 0.92 + 0.08 * clamp01(sampleSpring(frame, { damping: 14, stiffness: 160, fps }));

  const lookTokens = look ? getLook(look) : null;
  const bg = lookTokens ? lookTokens.bg : tone === "dark" ? C.navy : "#F4F2EB";
  const fg = lookTokens ? lookTokens.ink : tone === "dark" ? C.white : C.navy;
  const sub = lookTokens ? lookTokens.inkMuted : tone === "dark" ? C.muted : "#475569";

  return (
    <AbsoluteFill
      style={{
        background: bg,
        opacity: fadeIn * fadeOut,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
        fontFamily: font,
      }}
    >
      <div
        style={{
          width: 72,
          height: 6,
          borderRadius: 3,
          background: C.yellow,
          transform: `scaleX(${scale})`,
        }}
      />
      <div
        style={{
          transform: `scale(${scale})`,
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: 6,
          color: fg,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: sub,
            letterSpacing: 0.6,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
}
