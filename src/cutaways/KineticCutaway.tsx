import { useId } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, font } from "../design/tokens";
import {
  ChromaticSlice,
  EchoTrail,
  ElasticText,
  FlipText,
  GravityDrop,
  LightTrail,
  MagneticSnap,
  MorphStretch,
  OutlineReveal,
  PaperTear,
  RopeSwing,
  ScrambleText,
  Spotlight,
  TypeCollage,
  TypeStack,
} from "../typography/motion";
import { clamp01 } from "../typography/timing";
import {
  resolveCutawayBoardTone,
  type CutawayCollageWord,
  type CutawaySpec,
} from "./types";

const SURFACE_STYLE = {
  dark: { bg: C.navy, dot: C.white, ink: C.white, cardBg: "#1D3048", cardBorder: "#38506B" },
  light: { bg: "#EEF3F7", dot: C.navy, ink: C.navy, cardBg: C.white, cardBorder: "#CBD5E1" },
  "warm-paper": { bg: "#F4F2EB", dot: C.navy, ink: C.navy, cardBg: "#FFFDF8", cardBorder: "#D6CFC0" },
} as const;

const CutawayBackdrop: React.FC<{
  driftFrame: number;
  tone: "dark" | "light" | "warm-paper";
}> = ({ driftFrame, tone }) => {
  const uid = useId().replaceAll(":", "");
  const drift = Math.sin(driftFrame / 180) * 9;
  const palette = SURFACE_STYLE[tone];
  const isLight = tone !== "dark";

  return (
    <g aria-hidden="true">
      <defs>
        <pattern
          id={`cut-gen-bg-${uid}`}
          width="96"
          height="96"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${drift} ${drift * 0.6})`}
        >
          <circle
            cx="16"
            cy="20"
            r="1.5"
            fill={palette.dot}
            opacity={isLight ? 0.08 : 0.16}
          />
          <circle
            cx="68"
            cy="64"
            r="1.1"
            fill={palette.dot}
            opacity={isLight ? 0.07 : 0.14}
          />
          <path
            d="M32 76 h14 M70 24 h10"
            stroke={palette.dot}
            strokeWidth="1.2"
            opacity={isLight ? 0.05 : 0.1}
          />
        </pattern>
      </defs>
      <rect width="1920" height="1080" fill={palette.bg} />
      <rect width="1920" height="1080" fill={`url(#cut-gen-bg-${uid})`} />
    </g>
  );
};

const drawPath = (progress: number) => {
  const p = clamp01(progress);
  return {
    pathLength: 1,
    strokeDasharray: "1 1",
    strokeDashoffset: 1 - p,
  };
};

const KickerPill: React.FC<{
  label: string;
  frame: number;
  light: boolean;
  accent: string;
}> = ({ label, frame, light, accent }) => {
  const { fps } = useVideoConfig();
  const s = clamp01(
    spring({
      frame,
      fps,
      config: { damping: 14, stiffness: 180, mass: 0.7 },
    }),
  );
  const w = Math.max(240, Math.min(440, label.length * 16 + 72));
  const pillFill = light ? C.navy : "#1E3552";
  return (
    <g
      transform={`translate(960 220) scale(${0.82 + 0.18 * s}) translate(-960 -220)`}
      opacity={s}
    >
      <rect
        x={960 - w / 2}
        y="196"
        width={w}
        height="46"
        rx="23"
        fill={pillFill}
        stroke={accent}
        strokeWidth="2.5"
      />
      <text
        x="960"
        y="227"
        textAnchor="middle"
        fill={accent}
        fontFamily={font}
        fontSize="21"
        fontWeight={800}
        letterSpacing="2"
      >
        {label}
      </text>
    </g>
  );
};

function defaultCollageWords(
  text: string,
  accent: string,
  ink: string,
): CutawayCollageWord[] {
  const tokens = text.trim().split(/\s+/).filter(Boolean).slice(0, 5);
  if (tokens.length === 0) return [{ text: "KEY POINT", x: 540, y: 540, size: 96, color: ink }];
  const slots = [
    { x: 410, y: 465, rotate: -4, size: 84, color: ink },
    { x: 830, y: 450, rotate: 2, size: 70, color: "#64748B" },
    { x: 1120, y: 495, rotate: -5, size: 108, color: accent },
    { x: 520, y: 650, rotate: 2, size: 92, color: ink },
    { x: 1020, y: 660, rotate: -2, size: 82, color: C.teal },
  ];
  return tokens.map((word, idx) => ({
    text: word,
    ...slots[idx % slots.length],
  }));
}

export function KineticCutaway({
  spec,
  duration,
  frame: frameOverride,
}: {
  spec: CutawaySpec;
  duration: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameOverride ?? current;
  const tone = resolveCutawayBoardTone(spec);
  const palette = SURFACE_STYLE[tone];
  const isLight = tone !== "dark";
  const accent = spec.accentColor ?? C.yellow;

  const fadeOutStart = Math.max(8, duration - 7);
  const fadeEnd = Math.max(fadeOutStart + 1, duration - 1);
  const opacity = interpolate(frame, [0, 6, fadeOutStart, fadeEnd], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s1 = clamp01(
    spring({ frame, fps, config: { damping: 13, stiffness: 175, mass: 0.75 } }),
  );
  const draw1 = clamp01(frame / 28);
  const draw2 = clamp01((frame - 10) / 26);

  const badge = spec.badgeText ?? (spec.kicker ? spec.kicker.toUpperCase() : "KEY TAKEAWAY");
  const pair = spec.pairLabels ?? ["Before", "After"];
  const stackLines =
    spec.lines && spec.lines.length > 0
      ? spec.lines.map((line, i) => ({
          text: line.text,
          size: line.size ?? 80,
          weight: line.weight ?? 800,
          color: line.color ?? (i === 0 ? accent : palette.ink),
        }))
      : [
          {
            text: spec.text,
            size: spec.text.length > 26 ? 68 : 82,
            weight: 800,
            color: palette.ink,
          },
        ];

  const beforeAfter = spec.beforeAfter ?? {
    before: pair[0],
    after: pair[1],
    note: spec.footnote ?? "",
  };
  const collageWords =
    spec.collageWords && spec.collageWords.length > 0
      ? [...spec.collageWords]
      : defaultCollageWords(spec.text, isLight ? C.teal : accent, palette.ink);

  const textSize = spec.text.length > 28 ? 72 : 86;

  return (
    <AbsoluteFill style={{ opacity, fontFamily: font }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        aria-label={`Kinetic cutaway: ${spec.text}`}
      >
        <CutawayBackdrop driftFrame={frame} tone={tone} />

        {spec.variant === "elastic-tag" && (
          <>
            <g transform={`translate(960 440) scale(${s1}) translate(-960 -440)`}>
              <path
                d="M720 315 H1165 L1235 395 L1165 475 H720 Z"
                fill={accent}
              />
              <circle cx="1162" cy="395" r="14" fill={C.navy} />
              <text
                x="930"
                y="412"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="40"
                fontWeight={800}
              >
                {badge}
              </text>
            </g>
            <ElasticText
              x={380}
              y={650}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              text={spec.text}
            />
            <path
              d="M620 715 H1300"
              stroke={C.teal}
              strokeWidth="6"
              strokeLinecap="round"
              {...drawPath(draw2)}
            />
          </>
        )}

        {spec.variant === "type-stack" && (
          <>
            <rect
              x="260"
              y="300"
              width="1400"
              height="490"
              rx="28"
              fill={palette.cardBg}
              stroke={palette.cardBorder}
              strokeWidth="3"
            />
            <TypeStack
              x={360}
              y={375}
              from={0}
              until={duration}
              frame={frame}
              lines={stackLines}
            />
            <rect x="360" y="655" width="960" height="24" rx="12" fill="#2A4058" />
            <rect
              x="360"
              y="655"
              width={960 * clamp01((frame - 8) / 28)}
              height="24"
              rx="12"
              fill={C.teal}
            />
            <rect
              x={1320}
              y={595 + 40 * (1 - s1)}
              width="210"
              height="84"
              rx="14"
              fill={accent}
            />
            <text
              x="1425"
              y={647 + 40 * (1 - s1)}
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="26"
              fontWeight={800}
            >
              {badge}
            </text>
          </>
        )}

        {spec.variant === "magnetic-snap" && (
          <>
            {[160, 260, 360].map((r, i) => (
              <circle
                key={r}
                cx="960"
                cy="620"
                r={r}
                fill="none"
                stroke={i === 0 ? accent : C.teal}
                strokeWidth="3.5"
                strokeDasharray="12 10"
                opacity={0.45 * clamp01(draw1 * 1.4 - i * 0.2)}
                transform={`rotate(${frame * (i % 2 === 0 ? 0.6 : -0.5)} 960 620)`}
              />
            ))}
            <MagneticSnap
              x={290}
              y={455}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              text={spec.text}
            />
            <circle cx="960" cy="680" r={64 * s1} fill={accent} />
            <text
              x="960"
              y="694"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="30"
              fontWeight={800}
              opacity={s1}
            >
              {badge}
            </text>
          </>
        )}

        {spec.variant === "outline-reveal" && (
          <>
            <rect
              x="220"
              y="300"
              width="1480"
              height="520"
              rx="32"
              fill={palette.cardBg}
              stroke={accent}
              strokeWidth="4"
            />
            <OutlineReveal
              x={330}
              y={520}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              text={spec.text}
            />
            <rect x="640" y="690" width="120" height="44" rx="8" fill="#CBD5E1" />
            <rect x="820" y="690" width="120" height="44" rx="8" fill="#CBD5E1" />
            <rect
              x="1000"
              y={734 - 110 * draw2}
              width="140"
              height={110 * draw2}
              rx="10"
              fill={accent}
              stroke={C.navy}
              strokeWidth="3"
            />
            <text
              x="1070"
              y="608"
              textAnchor="middle"
              fill={palette.ink}
              fontFamily={font}
              fontSize="26"
              fontWeight={800}
              opacity={draw2}
            >
              {badge}
            </text>
          </>
        )}

        {spec.variant === "flip-card-type" && (
          <>
            <rect
              x="340"
              y="330"
              width="480"
              height="190"
              rx="20"
              fill={isLight ? "#E2E8F0" : "#1D3048"}
              opacity={isLight ? 1 : 0.6}
            />
            <text
              x="580"
              y="438"
              textAnchor="middle"
              fill={isLight ? "#475569" : C.muted}
              fontFamily={font}
              fontSize="36"
              fontWeight={700}
            >
              {pair[0]}
            </text>
            <path
              d="M840 425 H960"
              stroke={accent}
              strokeWidth="6"
              strokeLinecap="round"
              {...drawPath(draw1)}
            />
            <rect
              x="980"
              y="330"
              width="600"
              height="190"
              rx="22"
              fill={accent}
            />
            <text
              x="1280"
              y="438"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="40"
              fontWeight={800}
            >
              {pair[1]}
            </text>
            <FlipText
              x={960}
              y={695}
              from={4}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              text={spec.text}
            />
          </>
        )}

        {spec.variant === "chromatic-slice" && (
          <>
            <rect
              x="200"
              y="300"
              width="1520"
              height="500"
              rx="30"
              fill={palette.cardBg}
              stroke={palette.cardBorder}
              strokeWidth="2.5"
            />
            <ChromaticSlice
              x={315}
              y={530}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              text={spec.text}
            />
            <rect x="540" y="620" width="360" height="76" rx="16" fill="#EEF3F7" />
            <text
              x="720"
              y="668"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="28"
              fontWeight={750}
            >
              {pair[0]}
            </text>
            <text
              x="960"
              y="670"
              textAnchor="middle"
              fill={C.teal}
              fontFamily={font}
              fontSize="44"
              fontWeight={800}
            >
              +
            </text>
            <rect
              x="1020"
              y="620"
              width="360"
              height="76"
              rx="16"
              fill="#E6F7F6"
              stroke={C.teal}
              strokeWidth="3"
            />
            <text
              x="1200"
              y="668"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="28"
              fontWeight={750}
            >
              {pair[1]}
            </text>
          </>
        )}

        {spec.variant === "scramble-flap" && (
          <>
            <rect
              x="200"
              y="310"
              width="1520"
              height="490"
              rx="30"
              fill={palette.cardBg}
              stroke={palette.cardBorder}
              strokeWidth="2.5"
            />
            <ScrambleText
              x={310}
              y={500}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              mode="flip"
              per={2}
              text={spec.text}
            />
            <rect
              x="440"
              y="605"
              width="440"
              height="96"
              rx="18"
              fill="#E6F7F6"
              stroke={C.teal}
              strokeWidth="3.5"
            />
            <text
              x="660"
              y="665"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="32"
              fontWeight={800}
            >
              {pair[0]}
            </text>
            <rect
              x="1040"
              y="605"
              width="440"
              height="96"
              rx="18"
              fill="#EEF3F7"
              stroke="#CBD5E1"
              strokeWidth="3"
            />
            <text
              x="1260"
              y="665"
              textAnchor="middle"
              fill="#475569"
              fontFamily={font}
              fontSize="32"
              fontWeight={750}
            >
              {pair[1]}
            </text>
          </>
        )}

        {spec.variant === "light-trail" && (
          <>
            <LightTrail
              x={320}
              y={470}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              text={spec.text}
            />
            <line
              x1="1080"
              y1="560"
              x2="1080"
              y2={interpolate(draw1, [0, 1], [560, 780])}
              stroke={accent}
              strokeWidth="5"
              strokeDasharray="10 8"
            />
            <text
              x="1080"
              y="815"
              textAnchor="middle"
              fill={isLight ? C.navy : accent}
              fontFamily={font}
              fontSize="24"
              fontWeight={800}
            >
              {badge}
            </text>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const gx = 1125 + (i % 4) * 56;
              const gy = 620 + Math.floor(i / 4) * 58;
              const reach = clamp01((frame - 10 - i * 2) / 18);
              return (
                <circle
                  key={i}
                  cx={interpolate(reach, [0, 1], [620, gx])}
                  cy={gy}
                  r="16"
                  fill={C.teal}
                  opacity={reach}
                />
              );
            })}
          </>
        )}

        {spec.variant === "gravity-drop" && (
          <>
            <rect
              x="200"
              y="295"
              width="1520"
              height="515"
              rx="30"
              fill={palette.cardBg}
              stroke={palette.cardBorder}
              strokeWidth="2.5"
            />
            <GravityDrop
              x={360}
              y={360}
              ground={560}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              text={spec.text}
            />
            <rect x="460" y="650" width="600" height="52" rx="12" fill="#E2E8F0" />
            <rect x="460" y="650" width="420" height="52" rx="12" fill={C.navy} />
            <rect
              x={880}
              y={650 - 34 * (1 - clamp01(draw2))}
              width={290 * clamp01(draw2)}
              height="52"
              rx="10"
              fill={accent}
              stroke={C.navy}
              strokeWidth="3"
            />
            <line
              x1="1060"
              y1="628"
              x2="1060"
              y2="726"
              stroke={C.red}
              strokeWidth="5"
              strokeDasharray="7 5"
            />
            <text
              x="1230"
              y="686"
              fill={C.red}
              fontFamily={font}
              fontSize="28"
              fontWeight={800}
              opacity={draw2}
            >
              {spec.footnote ?? badge}
            </text>
          </>
        )}

        {spec.variant === "morph-stretch" && (
          <>
            <MorphStretch
              x={510}
              y={470}
              from={8}
              until={duration}
              frame={frame}
              size={96}
              color={palette.ink}
              before={beforeAfter.before}
              after={beforeAfter.after}
            />
            <rect
              x="540"
              y="660"
              width={interpolate(draw2, [0, 1], [480, 660])}
              height="48"
              rx="14"
              fill={draw2 > 0.5 ? C.teal : C.red}
            />
            {beforeAfter.note && (
              <text
                x="1240"
                y="696"
                fill={isLight ? C.navy : accent}
                fontFamily={font}
                fontSize="34"
                fontWeight={800}
                opacity={draw2}
              >
                {beforeAfter.note}
              </text>
            )}
          </>
        )}

        {spec.variant === "paper-tear" && (
          <>
            <rect
              x="200"
              y="300"
              width="1520"
              height="500"
              rx="30"
              fill={palette.cardBg}
              stroke={palette.cardBorder}
              strokeWidth="2.5"
            />
            <PaperTear
              x={310}
              y={540}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={palette.ink}
              text={spec.text}
            />
            <g opacity={clamp01((frame - 22) / 14)}>
              <rect
                x="520"
                y="630"
                width="880"
                height="94"
                rx="18"
                fill="#FFF0F0"
                stroke={C.red}
                strokeWidth="3.5"
              />
              <text
                x="960"
                y="688"
                textAnchor="middle"
                fill={C.red}
                fontFamily={font}
                fontSize="32"
                fontWeight={800}
              >
                {spec.footnote ?? badge}
              </text>
            </g>
          </>
        )}

        {spec.variant === "echo-trail" && (
          <>
            <EchoTrail
              x={340}
              y={485}
              from={0}
              until={duration}
              frame={frame}
              size={96}
              color={palette.ink}
              text={spec.text}
            />
            <g transform={`rotate(${-10 + 18 * clamp01(draw2)} 960 690)`}>
              <line
                x1="560"
                y1="690"
                x2="1360"
                y2="690"
                stroke={palette.ink}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <rect x="580" y="610" width="210" height="72" rx="12" fill={C.teal} />
              <text
                x="685"
                y="656"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="26"
                fontWeight={800}
              >
                {pair[0]}
              </text>
              <rect x="1130" y="592" width="210" height="90" rx="12" fill={C.red} />
              <text
                x="1235"
                y="646"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="26"
                fontWeight={800}
              >
                {pair[1]}
              </text>
            </g>
            <polygon points="930,745 990,745 960,695" fill={accent} />
          </>
        )}

        {spec.variant === "rope-swing" && (
          <>
            <RopeSwing
              x={340}
              y={590}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={accent}
              text={spec.text}
            />
            <rect x="560" y="725" width="800" height="24" rx="12" fill="#2A4058" />
            <rect
              x="560"
              y="725"
              width={360 * draw2 + 120}
              height="24"
              rx="12"
              fill={C.red}
              opacity={0.85}
            />
            {spec.footnote && (
              <text
                x="960"
                y="795"
                textAnchor="middle"
                fill={isLight ? "#475569" : C.muted}
                fontFamily={font}
                fontSize="28"
                fontWeight={700}
              >
                {spec.footnote}
              </text>
            )}
          </>
        )}

        {spec.variant === "spotlight-beam" && (
          <>
            <Spotlight
              x={340}
              y={540}
              from={0}
              until={duration}
              frame={frame}
              size={textSize}
              color={accent}
              text={spec.text}
            />
            <path
              d="M1260 695 C1060 615 860 615 660 695"
              fill="none"
              stroke={C.teal}
              strokeWidth="8"
              strokeLinecap="round"
              {...drawPath(draw2)}
            />
            <path
              d="M685 668 L652 698 L694 714"
              fill="none"
              stroke={C.teal}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={clamp01((draw2 - 0.7) * 3)}
            />
            <text
              x="650"
              y="765"
              textAnchor="middle"
              fill={palette.ink}
              fontFamily={font}
              fontSize="30"
              fontWeight={750}
            >
              {pair[0]}
            </text>
            <text
              x="1270"
              y="765"
              textAnchor="middle"
              fill={isLight ? "#475569" : C.muted}
              fontFamily={font}
              fontSize="30"
              fontWeight={750}
            >
              {pair[1]}
            </text>
          </>
        )}

        {spec.variant === "type-collage" && (
          <>
            <rect
              x="220"
              y="280"
              width="1480"
              height="550"
              rx="32"
              fill={palette.cardBg}
              stroke={C.teal}
              strokeWidth="4"
            />
            <TypeCollage
              x={0}
              y={0}
              from={0}
              until={duration}
              frame={frame}
              words={collageWords}
            />
            <path
              d="M520 725 H1400"
              stroke={accent}
              strokeWidth="8"
              strokeLinecap="round"
              {...drawPath(draw2)}
            />
          </>
        )}

        {spec.kicker && (
          <KickerPill
            label={spec.kicker}
            frame={frame}
            light={isLight}
            accent={accent}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
}
