import { useId } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, font } from "../design/tokens";
import {
  ChromaticSlice,
  ElasticText,
  EchoTrail,
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
  FULL_CUTAWAYS,
  type CutawayVariant,
} from "./freeShippingFullTimeline";

const CutawayBackdrop: React.FC<{ driftFrame: number; light?: boolean }> = ({
  driftFrame,
  light = false,
}) => {
  const uid = useId().replaceAll(":", "");
  const drift = Math.sin(driftFrame / 180) * 9;
  const dotColor = light ? C.navy : C.white;
  return (
    <g aria-hidden="true">
      <defs>
        <pattern
          id={`cut-bg-${uid}`}
          width="96"
          height="96"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${drift} ${drift * 0.6})`}
        >
          <circle
            cx="16"
            cy="20"
            r="1.5"
            fill={dotColor}
            opacity={light ? 0.08 : 0.16}
          />
          <circle
            cx="68"
            cy="64"
            r="1.1"
            fill={dotColor}
            opacity={light ? 0.07 : 0.14}
          />
          <path
            d="M32 76 h14 M70 24 h10"
            stroke={dotColor}
            strokeWidth="1.2"
            opacity={light ? 0.05 : 0.1}
          />
        </pattern>
      </defs>
      <rect width="1920" height="1080" fill={light ? "#EEF3F7" : C.navy} />
      <rect width="1920" height="1080" fill={`url(#cut-bg-${uid})`} />
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
  light?: boolean;
}> = ({ label, frame, light = false }) => {
  const { fps } = useVideoConfig();
  const s = clamp01(
    spring({
      frame,
      fps,
      config: { damping: 14, stiffness: 180, mass: 0.7 },
    }),
  );
  return (
    <g
      transform={`translate(960 220) scale(${0.8 + 0.2 * s}) translate(-960 -220)`}
      opacity={s}
    >
      <rect
        x="820"
        y="196"
        width="280"
        height="46"
        rx="23"
        fill={light ? C.navy : "#1E3552"}
        stroke={C.yellow}
        strokeWidth="2.5"
      />
      <text
        x="960"
        y="227"
        textAnchor="middle"
        fill={C.yellow}
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

export const KineticCutaway: React.FC<{
  variant: CutawayVariant;
  text: string;
  kicker: string;
  duration: number;
}> = ({ variant, text, kicker, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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

  const isLightBoard = [
    "outline-reveal",
    "chromatic-slice",
    "scramble-flap",
    "gravity-drop",
    "paper-tear",
    "type-collage",
  ].includes(variant);

  return (
    <AbsoluteFill style={{ opacity, fontFamily: font }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        aria-label={`Kinetic cutaway: ${text}`}
      >
        <CutawayBackdrop driftFrame={frame} light={isLightBoard} />

        {variant === "elastic-tag" && (
          <>
            <g transform={`translate(960 440) scale(${s1}) translate(-960 -440)`}>
              <path
                d="M740 315 H1145 L1215 395 L1145 475 H740 Z"
                fill={C.yellow}
              />
              <circle cx="1142" cy="395" r="14" fill={C.navy} />
              <text
                x="930"
                y="412"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="44"
                fontWeight={800}
              >
                FREE SHIPPING
              </text>
            </g>
            <ElasticText
              x={430}
              y={650}
              from={0}
              until={duration}
              frame={frame}
              size={84}
              color={C.white}
              text={text}
            />
            <path
              d="M620 710 H1300"
              stroke={C.teal}
              strokeWidth="6"
              strokeLinecap="round"
              {...drawPath(draw2)}
            />
          </>
        )}

        {variant === "type-stack" && (
          <>
            <rect
              x="260"
              y="300"
              width="1400"
              height="490"
              rx="28"
              fill="#1D3048"
              stroke="#38506B"
              strokeWidth="3"
            />
            <TypeStack
              x={360}
              y={370}
              from={0}
              until={duration}
              frame={frame}
              lines={[
                { text: "One condition", size: 84, weight: 800, color: C.yellow },
                { text: "changes the cart.", size: 84, weight: 800, color: C.white },
              ]}
            />
            {/* Sliding gate track */}
            <rect x="360" y="650" width="960" height="24" rx="12" fill="#2A4058" />
            <rect
              x="360"
              y="650"
              width={960 * clamp01((frame - 8) / 28)}
              height="24"
              rx="12"
              fill={C.teal}
            />
            <rect
              x={1320}
              y={590 + 40 * (1 - s1)}
              width="180"
              height="84"
              rx="14"
              fill={C.yellow}
            />
            <text
              x="1410"
              y={642 + 40 * (1 - s1)}
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="28"
              fontWeight={800}
            >
              MINIMUM
            </text>
          </>
        )}

        {variant === "magnetic-snap" && (
          <>
            {[160, 260, 360].map((r, i) => (
              <circle
                key={r}
                cx="960"
                cy="620"
                r={r}
                fill="none"
                stroke={i === 0 ? C.yellow : C.teal}
                strokeWidth="3.5"
                strokeDasharray="12 10"
                opacity={0.45 * clamp01(draw1 * 1.4 - i * 0.2)}
                transform={`rotate(${frame * (i % 2 === 0 ? 0.6 : -0.5)} 960 620)`}
              />
            ))}
            <MagneticSnap
              x={310}
              y={455}
              from={0}
              until={duration}
              frame={frame}
              size={84}
              color={C.white}
              text={text}
            />
            <circle cx="960" cy="675" r={62 * s1} fill={C.yellow} />
            <text
              x="960"
              y="697"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="58"
              fontWeight={800}
              opacity={s1}
            >
              $0
            </text>
          </>
        )}

        {variant === "outline-reveal" && (
          <>
            <rect
              x="240"
              y="300"
              width="1440"
              height="520"
              rx="32"
              fill={C.white}
              stroke={C.yellow}
              strokeWidth="4"
            />
            <OutlineReveal
              x={350}
              y={520}
              from={0}
              until={duration}
              frame={frame}
              size={98}
              color={C.navy}
              text={text}
            />
            {/* Elevated zero bar vs flat modest bars */}
            <rect x="640" y="690" width="120" height="44" rx="8" fill="#CBD5E1" />
            <rect x="820" y="690" width="120" height="44" rx="8" fill="#CBD5E1" />
            <rect
              x="1000"
              y={734 - 110 * draw2}
              width="140"
              height={110 * draw2}
              rx="10"
              fill={C.yellow}
              stroke={C.navy}
              strokeWidth="3"
            />
            <text
              x="1070"
              y="608"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="28"
              fontWeight={800}
              opacity={draw2}
            >
              $0 EFFECT
            </text>
          </>
        )}

        {variant === "flip-card-type" && (
          <>
            <rect
              x="340"
              y="330"
              width="480"
              height="190"
              rx="20"
              fill="#1D3048"
              opacity={0.45}
            />
            <text
              x="580"
              y="438"
              textAnchor="middle"
              fill={C.muted}
              fontFamily={font}
              fontSize="38"
              fontWeight={700}
            >
              Task 1: Find Charger ✓
            </text>
            <path
              d="M840 425 H960"
              stroke={C.yellow}
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
              fill={C.yellow}
            />
            <text
              x="1280"
              y="438"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="42"
              fontWeight={800}
            >
              Task 2: Hit Cutoff
            </text>
            <FlipText
              x={960}
              y={695}
              from={4}
              until={duration}
              frame={frame}
              size={84}
              color={C.white}
              text={text}
            />
          </>
        )}

        {variant === "chromatic-slice" && (
          <>
            <rect x="200" y="300" width="1520" height="500" rx="30" fill={C.white} />
            <ChromaticSlice
              x={315}
              y={530}
              from={0}
              until={duration}
              frame={frame}
              size={92}
              color={C.navy}
              text={text}
            />
            <rect
              x="560"
              y="620"
              width="340"
              height="76"
              rx="16"
              fill="#EEF3F7"
            />
            <text
              x="730"
              y="668"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="30"
              fontWeight={750}
            >
              Item price
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
              width="340"
              height="76"
              rx="16"
              fill="#E6F7F6"
              stroke={C.teal}
              strokeWidth="3"
            />
            <text
              x="1190"
              y="668"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="30"
              fontWeight={750}
            >
              Fee removed
            </text>
          </>
        )}

        {variant === "scramble-flap" && (
          <>
            <rect x="200" y="310" width="1520" height="490" rx="30" fill={C.white} />
            <ScrambleText
              x={310}
              y={500}
              from={0}
              until={duration}
              frame={frame}
              size={84}
              color={C.navy}
              mode="flip"
              per={2}
              text={text}
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
              fontSize="34"
              fontWeight={800}
            >
              Merchandise $ ✓
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
              fill="#64748B"
              fontFamily={font}
              fontSize="34"
              fontWeight={750}
            >
              Item usefulness ?
            </text>
          </>
        )}

        {variant === "light-trail" && (
          <>
            <LightTrail
              x={320}
              y={470}
              from={0}
              until={duration}
              frame={frame}
              size={88}
              text={text}
            />
            {/* Simulated order dots clustering right past cutoff line */}
            <line
              x1="1080"
              y1="560"
              x2="1080"
              y2={interpolate(draw1, [0, 1], [560, 780])}
              stroke={C.yellow}
              strokeWidth="5"
              strokeDasharray="10 8"
            />
            <text
              x="1080"
              y="815"
              textAnchor="middle"
              fill={C.yellow}
              fontFamily={font}
              fontSize="24"
              fontWeight={800}
            >
              THRESHOLD
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

        {variant === "gravity-drop" && (
          <>
            <rect x="200" y="295" width="1520" height="515" rx="30" fill={C.white} />
            <GravityDrop
              x={390}
              y={360}
              ground={560}
              from={0}
              until={duration}
              frame={frame}
              size={92}
              color={C.navy}
              text={text}
            />
            {/* Gap bar + overhanging yellow item block */}
            <rect x="460" y="650" width="600" height="52" rx="12" fill="#E2E8F0" />
            <rect x="460" y="650" width="420" height="52" rx="12" fill={C.navy} />
            <rect
              x={880}
              y={650 - 34 * (1 - clamp01(draw2))}
              width={290 * clamp01(draw2)}
              height="52"
              rx="10"
              fill={C.yellow}
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
              x="1250"
              y="686"
              fill={C.red}
              fontFamily={font}
              fontSize="28"
              fontWeight={800}
              opacity={draw2}
            >
              +$4 overhang
            </text>
          </>
        )}

        {variant === "morph-stretch" && (
          <>
            <MorphStretch
              x={510}
              y={470}
              from={8}
              until={duration}
              frame={frame}
              size={104}
              color={C.white}
              before="$48 PAID"
              after="$54 FREE"
            />
            {/* Growing order height bar below */}
            <rect
              x="540"
              y="660"
              width={interpolate(draw2, [0, 1], [520, 650])}
              height="48"
              rx="14"
              fill={draw2 > 0.5 ? C.teal : C.red}
            />
            <text
              x="1240"
              y="696"
              fill={C.yellow}
              fontFamily={font}
              fontSize="36"
              fontWeight={800}
              opacity={draw2}
            >
              +$6 outlay
            </text>
          </>
        )}

        {variant === "paper-tear" && (
          <>
            <rect x="200" y="300" width="1520" height="500" rx="30" fill={C.white} />
            <PaperTear
              x={310}
              y={540}
              from={0}
              until={duration}
              frame={frame}
              size={84}
              color={C.navy}
              text={text}
            />
            <g opacity={clamp01((frame - 22) / 14)}>
              <rect
                x="560"
                y="630"
                width="800"
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
                fontSize="34"
                fontWeight={800}
              >
                Carrier & fulfillment cost still paid
              </text>
            </g>
          </>
        )}

        {variant === "echo-trail" && (
          <>
            <EchoTrail
              x={360}
              y={485}
              from={0}
              until={duration}
              frame={frame}
              size={104}
              color={C.white}
              text={text}
            />
            {/* Tilted margin vs shipping-cost beam */}
            <g transform={`rotate(${-10 + 18 * clamp01(draw2)} 960 690)`}>
              <line
                x1="560"
                y1="690"
                x2="1360"
                y2="690"
                stroke={C.white}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <rect x="580" y="610" width="190" height="72" rx="12" fill={C.teal} />
              <text
                x="675"
                y="656"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="26"
                fontWeight={800}
              >
                Margin ↑
              </text>
              <rect x="1150" y="592" width="190" height="90" rx="12" fill={C.red} />
              <text
                x="1245"
                y="646"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="26"
                fontWeight={800}
              >
                Costs ↑
              </text>
            </g>
            <polygon points="930,745 990,745 960,695" fill={C.yellow} />
          </>
        )}

        {variant === "rope-swing" && (
          <>
            <RopeSwing
              x={340}
              y={590}
              from={0}
              until={duration}
              frame={frame}
              size={92}
              color={C.yellow}
              text={text}
            />
            <rect
              x="560"
              y="725"
              width="800"
              height="24"
              rx="12"
              fill="#2A4058"
            />
            <rect
              x="560"
              y="725"
              width="340"
              height="24"
              rx="12"
              fill={C.red}
              opacity={0.85}
            />
            <text
              x="960"
              y="795"
              textAnchor="middle"
              fill={C.muted}
              fontFamily={font}
              fontSize="28"
              fontWeight={700}
            >
              Threshold moved too high
            </text>
          </>
        )}

        {variant === "spotlight-beam" && (
          <>
            <Spotlight
              x={340}
              y={540}
              from={0}
              until={duration}
              frame={frame}
              size={94}
              color={C.yellow}
              text={text}
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
              fill={C.white}
              fontFamily={font}
              fontSize="30"
              fontWeight={750}
            >
              TODAY
            </text>
            <text
              x="1270"
              y="765"
              textAnchor="middle"
              fill={C.muted}
              fontFamily={font}
              fontSize="30"
              fontWeight={750}
            >
              NEXT WEEK
            </text>
          </>
        )}

        {variant === "type-collage" && (
          <>
            <rect
              x="220"
              y="280"
              width="1480"
              height="550"
              rx="32"
              fill={C.white}
              stroke={C.teal}
              strokeWidth="4"
            />
            <TypeCollage
              x={0}
              y={0}
              from={0}
              until={duration}
              frame={frame}
              words={[
                { text: "WORTH", x: 430, y: 465, rotate: -4, size: 84, color: C.navy },
                { text: "THE", x: 810, y: 450, rotate: 2, size: 64, color: "#64748B" },
                { text: "$6", x: 1020, y: 485, rotate: -6, size: 122, color: C.teal },
                { text: "DIFFERENCE?", x: 540, y: 650, rotate: 2, size: 96, color: C.navy },
              ]}
            />
            <path
              d="M520 725 H1400"
              stroke={C.yellow}
              strokeWidth="8"
              strokeLinecap="round"
              {...drawPath(draw2)}
            />
          </>
        )}
        <KickerPill label={kicker} frame={frame} light={isLightBoard} />
      </svg>
    </AbsoluteFill>
  );
};

export const CUTAWAY_GALLERY_SLOT = 66;
export const CUTAWAY_GALLERY_DURATION =
  FULL_CUTAWAYS.length * CUTAWAY_GALLERY_SLOT;

export const FreeShippingCutawayGallery: React.FC = () => {
  const slotDuration = CUTAWAY_GALLERY_SLOT;
  return (
    <AbsoluteFill>
      {FULL_CUTAWAYS.map((event, index) => (
        <Sequence
          key={event.id}
          name={`${index + 1}: ${String(event.payload.variant)}`}
          from={index * slotDuration}
          durationInFrames={slotDuration}
        >
          <KineticCutaway
            variant={event.payload.variant as CutawayVariant}
            text={String(event.payload.text)}
            kicker={String(event.payload.kicker)}
            duration={slotDuration}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
