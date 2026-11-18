import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, font } from "../design/tokens";
import { usd } from "../finance/math";
import { FlipCard } from "../objects/motion";
import { KineticHeadline, TextMorph } from "../typography";
import { clamp01 } from "../typography/timing";
import { KineticCutaway } from "./FreeShippingCutaways";
import {
  CableOrganizerArt,
  CheckBadge,
  ChocolatePairArt,
  Cursor,
  OpeningScene,
  SvgBackdrop,
  TalkingStickmanPresenter,
  WallChargerArt,
  clampEase,
  drawStroke,
  springPop,
} from "./FreeShippingOpening";
import {
  FULL_CUTAWAYS,
  freeShippingExample,
  freeShippingFullTimeline,
  freeShippingOrder,
  type CutawayVariant,
} from "./freeShippingFullTimeline";

export const REMAINING_SCENES = freeShippingFullTimeline.scenes.slice(9);

const FreeShippingEndCard: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade =
    clampEase(frame, 10) * clampEase(duration - frame, 8);
  const scale =
    0.92 + 0.08 * clamp01(springPop(frame, fps, 0, 14, 160));
  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: font,
      }}
    >
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <SvgBackdrop driftFrame={frame} />
      </svg>
      <div
        style={{
          position: "relative",
          transform: `scale(${scale})`,
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: 6,
          color: C.white,
        }}
      >
        THE MONEY TRAP
      </div>
    </AbsoluteFill>
  );
};

const ShippingBoxArt: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect
      x="-62"
      y="-52"
      width="124"
      height="104"
      rx="14"
      fill={C.yellow}
      stroke={C.navy}
      strokeWidth="4"
    />
    <path d="M-62 -14 H62 M0 -52 V-14" stroke={C.navy} strokeWidth="4" />
    <rect x="-20" y="-14" width="40" height="22" rx="4" fill="#F8FAFC" />
  </g>
);

const ToothpasteArt: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect
      x="-42"
      y="-60"
      width="84"
      height="120"
      rx="16"
      fill={C.white}
      stroke={C.teal}
      strokeWidth="4"
    />
    <rect x="-20" y="-82" width="40" height="22" rx="6" fill={C.navy} />
    <rect x="-28" y="-22" width="56" height="44" rx="8" fill={C.teal} />
    <path d="M-16 0 H16" stroke={C.white} strokeWidth="5" strokeLinecap="round" />
  </g>
);

const RemainingScene: React.FC<{
  id: string;
  title: string;
  duration: number;
  sceneFrom: number;
}> = ({ id, title, duration, sceneFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteFrame = sceneFrom + frame;

  const enterSpring = clamp01(springPop(frame, fps, 0, 14, 165));
  const step1 = clampEase(frame, 22);
  const step2 = clampEase(frame - 28, 24);
  const step3 = clampEase(frame - 60, 26);
  const midP = clampEase(frame, Math.max(40, Math.round(duration * 0.45)));
  const lateP = clampEase(
    frame - Math.round(duration * 0.48),
    Math.max(24, Math.round(duration * 0.22)),
  );

  const eventProgress = (eventId: string) => {
    const item = freeShippingFullTimeline.events.find((e) => e.id === eventId);
    if (!item) return step2;
    return clampEase(absoluteFrame - item.from, item.durationInFrames);
  };

  return (
    <AbsoluteFill style={{ fontFamily: font }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        aria-label={`Free shipping scene: ${title}`}
      >
        <SvgBackdrop driftFrame={absoluteFrame} />

        {/* 10: choc-shift */}
        {id === "choc-shift" && (
          <g opacity={enterSpring}>
            <rect x="160" y="136" width="1600" height="792" rx="28" fill={C.white} />
            <text
              x="960"
              y="222"
              textAnchor="middle"
              fill={C.navy}
              fontSize="40"
              fontWeight={750}
            >
              Same price reduction
            </text>
            <g transform={`translate(560 510) scale(${1 + 0.04 * eventProgress("full-drop-free")})`}>
              <rect
                x="-280"
                y="-205"
                width="560"
                height="430"
                rx="22"
                fill={eventProgress("full-drop-free") > 0.4 ? "#FFF8E2" : "#EEF3F7"}
                stroke={eventProgress("full-drop-free") > 0.4 ? C.yellow : "#CBD5E1"}
                strokeWidth="4.5"
              />
              <ChocolatePairArt kind="milk" x={0} y={-40} />
              <TextMorph
                from={0}
                until={duration}
                changeAt={45}
                frame={frame}
                x={-84}
                y={135}
                size={38}
                color={C.navy}
                before="Low price"
                after="FREE"
              />
            </g>
            <g transform="translate(1360 510)">
              <rect
                x="-280"
                y="-205"
                width="560"
                height="430"
                rx="22"
                fill="#EEF3F7"
                stroke="#CBD5E1"
                strokeWidth="3.5"
              />
              <ChocolatePairArt kind="truffle" x={0} y={-40} />
              <TextMorph
                from={0}
                until={duration}
                changeAt={45}
                frame={frame}
                x={-106}
                y={135}
                size={36}
                color={C.navy}
                before="Higher price"
                after="Still positive"
              />
            </g>
            {/* Shift dots rushing onto left option */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const p = clampEase(frame - 65 - i * 5, 22);
              return (
                <circle
                  key={i}
                  cx={interpolate(p, [0, 1], [1200 + i * 25, 420 + i * 52])}
                  cy={815}
                  r="13"
                  fill={C.teal}
                  opacity={p}
                />
              );
            })}
            <text
              x="960"
              y="980"
              textAnchor="middle"
              fill="#CBD5E1"
              fontSize="28"
              fontWeight={600}
            >
              Shampanier, Mazar and Ariely, 2007
            </text>
          </g>
        )}

        {/* 11: choc-gap */}
        {id === "choc-gap" && (
          <g opacity={enterSpring}>
            <rect x="160" y="136" width="1600" height="792" rx="28" fill={C.white} />
            <g transform="translate(560 440)">
              <rect
                x="-260"
                y="-170"
                width="520"
                height="340"
                rx="22"
                fill="#FFF8E2"
                stroke={C.yellow}
                strokeWidth="5"
              />
              <ChocolatePairArt kind="milk" x={0} y={-20} />
              <text
                x="0"
                y="125"
                textAnchor="middle"
                fill={C.navy}
                fontSize="42"
                fontWeight={800}
              >
                $0 · Free
              </text>
            </g>
            <g transform="translate(1360 440)">
              <rect
                x="-260"
                y="-170"
                width="520"
                height="340"
                rx="22"
                fill="#EEF3F7"
                stroke="#CBD5E1"
                strokeWidth="3.5"
              />
              <ChocolatePairArt kind="truffle" x={0} y={-20} />
              <text
                x="0"
                y="125"
                textAnchor="middle"
                fill={C.navy}
                fontSize="36"
                fontWeight={750}
              >
                Lower price
              </text>
            </g>
            <path
              d="M560 660 V735 H1360 V660"
              fill="none"
              stroke={C.navy}
              strokeWidth="6"
              strokeLinejoin="round"
              {...drawStroke(step2)}
            />
            <rect
              x="760"
              y="704"
              width="400"
              height="62"
              rx="16"
              fill={C.navy}
              opacity={step2}
            />
            <text
              x="960"
              y="745"
              textAnchor="middle"
              fill={C.yellow}
              fontSize="32"
              fontWeight={750}
              opacity={step2}
            >
              Price gap unchanged
            </text>
            <text
              x="960"
              y="980"
              textAnchor="middle"
              fill="#CBD5E1"
              fontSize="28"
              fontWeight={600}
            >
              Shampanier, Mazar and Ariely, 2007
            </text>
          </g>
        )}

        {/* 12: zero-effect */}
        {id === "zero-effect" && (
          <g opacity={enterSpring}>
            <circle
              cx="960"
              cy="490"
              r={180 + 70 * step1}
              fill="none"
              stroke={C.yellow}
              strokeWidth="4"
              opacity={0.45}
            />
            <circle cx="960" cy="490" r={160 * enterSpring} fill="#1D3048" stroke={C.yellow} strokeWidth="5" />
            <text
              x="960"
              y="525"
              textAnchor="middle"
              fill={C.yellow}
              fontSize="112"
              fontWeight={800}
            >
              $0
            </text>
            <text
              x="960"
              y="765"
              textAnchor="middle"
              fill={C.white}
              fontSize="52"
              fontWeight={750}
            >
              Zero-price effect
            </text>
            <text
              x="960"
              y="845"
              textAnchor="middle"
              fill="#CBD5E1"
              fontSize="30"
              fontWeight={600}
            >
              Shampanier, Mazar and Ariely, 2007
            </text>
          </g>
        )}

        {/* 13: choc-limits */}
        {id === "choc-limits" && (
          <g opacity={enterSpring}>
            <rect x="140" y="150" width="1640" height="750" rx="28" fill={C.white} />
            <g transform="translate(530 470)">
              <rect x="-300" y="-220" width="600" height="440" rx="22" fill="#EEF3F7" />
              <ChocolatePairArt kind="milk" x={-90} y={-20} />
              <ChocolatePairArt kind="truffle" x={95} y={-20} />
              <text
                x="0"
                y="150"
                textAnchor="middle"
                fill={C.navy}
                fontSize="34"
                fontWeight={750}
              >
                Chocolate experiment
              </text>
            </g>
            <line
              x1="960"
              y1="220"
              x2="960"
              y2={220 + 480 * step2}
              stroke={C.red}
              strokeWidth="6"
              strokeDasharray="14 10"
            />
            <circle cx="960" cy="460" r="38" fill="#FFF0F0" stroke={C.red} strokeWidth="4" />
            <text x="960" y="474" textAnchor="middle" fill={C.red} fontSize="40" fontWeight={800}>
              ≠
            </text>
            <g transform="translate(1390 470)" opacity={0.55 + 0.45 * step2}>
              <rect x="-300" y="-220" width="600" height="440" rx="22" fill="#FFF7DF" />
              <ShippingBoxArt x={0} y={-20} scale={1.15} />
              <text
                x="0"
                y="150"
                textAnchor="middle"
                fill={C.navy}
                fontSize="34"
                fontWeight={750}
              >
                Online shipping
              </text>
            </g>
            <text
              x="960"
              y="815"
              textAnchor="middle"
              fill={C.navy}
              fontSize="32"
              fontWeight={750}
              opacity={step3}
            >
              Clue about removing a fee — not universal overspending
            </text>
          </g>
        )}

        {/* 14: clue-attention */}
        {id === "clue-attention" && (
          <g opacity={enterSpring}>
            <rect x="200" y="210" width="1520" height="650" rx="28" fill="#1D3048" stroke="#38506B" strokeWidth="3" />
            <rect x="330" y="340" width="460" height="310" rx="22" fill="#2A4058" />
            <text x="560" y="460" textAnchor="middle" fill={C.muted} fontSize="34" fontWeight={700}>
              Partial discount
            </text>
            <text x="560" y="545" textAnchor="middle" fill={C.white} fontSize="64" fontWeight={800}>
              Reduced fee
            </text>
            <path
              d="M820 495 H1030"
              stroke={C.yellow}
              strokeWidth="8"
              strokeLinecap="round"
              {...drawStroke(step2)}
            />
            <g transform={`translate(1330 495) scale(${1 + 0.05 * step2})`}>
              <rect
                x="-270"
                y="-175"
                width="540"
                height="350"
                rx="24"
                fill="#14243A"
                stroke={C.yellow}
                strokeWidth="5"
              />
              <text x="0" y="-25" textAnchor="middle" fill={C.yellow} fontSize="110" fontWeight={800}>
                $0
              </text>
              <text x="0" y="75" textAnchor="middle" fill={C.white} fontSize="42" fontWeight={750}>
                Charge eliminated
              </text>
            </g>
            <text x="960" y="790" textAnchor="middle" fill={C.yellow} fontSize="34" fontWeight={750}>
              Draws attention beyond the dollar discount
            </text>
          </g>
        )}

        {/* 15: checkout-removable */}
        {id === "checkout-removable" && (
          <g opacity={enterSpring}>
            <rect x="360" y="165" width="1200" height="750" rx="28" fill={C.white} />
            <text x="430" y="245" fill={C.navy} fontSize="40" fontWeight={750}>
              Order preview
            </text>
            <rect x="430" y="300" width="1060" height="115" rx="18" fill="#EEF3F7" />
            <WallChargerArt x={505} y={358} scale={0.38} />
            <text x="590" y="372" fill={C.navy} fontSize="36" fontWeight={700}>
              Charger
            </text>
            <CheckBadge x={1415} y={358} />
            {/* Removable fee lifting out */}
            <g transform={`translate(0 ${-16 * Math.sin(Math.PI * step2)})`}>
              <rect
                x="430"
                y="465"
                width="1060"
                height="120"
                rx="18"
                fill="#FFF0F0"
                stroke={C.red}
                strokeWidth="4"
                strokeDasharray="12 8"
              />
              <text x="480" y="538" fill={C.red} fontSize="38" fontWeight={800}>
                Delivery charge · Removable line
              </text>
            </g>
            <path
              d="M960 595 V685"
              stroke={C.teal}
              strokeWidth="6"
              strokeLinecap="round"
              {...drawStroke(step2)}
            />
            <rect
              x="620"
              y="690"
              width="680"
              height="120"
              rx="20"
              fill="#FFF7DF"
              stroke={C.yellow}
              strokeWidth="4"
              opacity={step2}
            />
            <text
              x="960"
              y="764"
              textAnchor="middle"
              fill={C.navy}
              fontSize="38"
              fontWeight={800}
              opacity={step2}
            >
              Unlock by adding another item +
            </text>
          </g>
        )}

        {/* 16: second-task-aroll (Sam A-Roll) */}
        {id === "second-task-aroll" && (
          <g>
            <TalkingStickmanPresenter
              identity="Sam"
              x={390}
              y={940}
              scale={2.15}
              localFrame={frame}
              absoluteFrame={absoluteFrame}
              fromPose="standing"
              pose="explaining"
              expression="relieved"
              actionFrom={4}
              blendFrames={22}
            />
            <g transform={`translate(1260 520) scale(${enterSpring})`}>
              <rect x="-380" y="-235" width="760" height="470" rx="30" fill={C.white} />
              <WallChargerArt x={0} y={-40} scale={1.15} />
              <CheckBadge x={250} y={-125} scale={1.4} />
              <text
                x="0"
                y="135"
                textAnchor="middle"
                fill={C.navy}
                fontSize="44"
                fontWeight={800}
              >
                Original task: Finished ✓
              </text>
            </g>
          </g>
        )}

        {/* 17: second-task-broll */}
        {id === "second-task-broll" && (
          <g opacity={enterSpring}>
            <rect x="200" y="160" width="1520" height="760" rx="28" fill={C.white} />
            <rect x="280" y="235" width="1360" height="120" rx="18" fill="#EEF3F7" />
            <WallChargerArt x={360} y={295} scale={0.4} />
            <text x="440" y="308" fill="#64748B" fontSize="34" fontWeight={700}>
              Task 1 · Charger found ✓
            </text>
            <rect
              x="280"
              y="400"
              width="1360"
              height="440"
              rx="22"
              fill="#FFF7DF"
              stroke={C.yellow}
              strokeWidth="4"
            />
            <text x="340" y="476" fill={C.navy} fontSize="42" fontWeight={800}>
              Task 2 · Cross the cutoff
            </text>
            <rect x="340" y="540" width="1020" height="44" rx="22" fill="#E2E8F0" />
            <rect x="340" y="540" width={680} height="44" rx="22" fill={C.navy} />
            <rect
              x={340 + 680}
              y="540"
              width={340 * step2}
              height="44"
              rx="14"
              fill={C.teal}
            />
            <line
              x1="1360"
              y1="510"
              x2="1360"
              y2="615"
              stroke={C.navy}
              strokeWidth="5"
              strokeDasharray="8 6"
            />
            <text x="1400" y="572" fill={C.navy} fontSize="30" fontWeight={750}>
              Cutoff
            </text>
            <text x="340" y="720" fill={C.navy} fontSize="32" fontWeight={700} opacity={step2}>
              Small enough to justify · Large enough to qualify
            </text>
          </g>
        )}

        {/* 18: organizer-role */}
        {id === "organizer-role" && (
          <g opacity={enterSpring}>
            <rect x="220" y="170" width="1480" height="740" rx="28" fill={C.white} />
            <CableOrganizerArt x={960} y={355} scale={1.45} />
            <path
              d="M960 455 L600 590"
              stroke={C.navy}
              strokeWidth="5"
              {...drawStroke(step2)}
            />
            <path
              d="M960 455 L1320 590"
              stroke={C.yellow}
              strokeWidth="6"
              {...drawStroke(step2)}
            />
            <rect x="320" y="600" width="520" height="190" rx="22" fill="#EEF3F7" />
            <text x="580" y="710" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={750}>
              1. Useful item itself?
            </text>
            <rect
              x="1080"
              y="600"
              width="520"
              height="190"
              rx="22"
              fill="#FFF7DF"
              stroke={C.yellow}
              strokeWidth="4"
            />
            <text x="1340" y="710" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={750}>
              2. Clears delivery task
            </text>
          </g>
        )}

        {/* 19: different-context */}
        {id === "different-context" && (
          <g opacity={enterSpring}>
            <rect x="140" y="160" width="760" height="760" rx="28" fill={C.white} />
            <text x="520" y="255" textAnchor="middle" fill="#64748B" fontSize="34" fontWeight={750}>
              Standalone view
            </text>
            <CableOrganizerArt x={520} y={455} scale={1.2} />
            <rect x="320" y="660" width="400" height="100" rx="18" fill="#EEF3F7" />
            <text x="520" y="724" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800}>
              Want it at its price?
            </text>
            <rect
              x="1020"
              y="160"
              width="760"
              height="760"
              rx="28"
              fill={C.white}
              stroke={C.teal}
              strokeWidth="4"
            />
            <rect x="1205" y="216" width="390" height="54" rx="14" fill={C.teal} />
            <text x="1400" y="254" textAnchor="middle" fill={C.navy} fontSize="32" fontWeight={800}>
              Checkout context
            </text>
            <CableOrganizerArt x={1400} y={455} scale={1.2} />
            <rect x="1140" y="640" width="520" height="140" rx="18" fill="#E6F7F6" stroke={C.teal} strokeWidth="2.5" />
            <text x="1400" y="700" textAnchor="middle" fill={C.navy} fontSize="32" fontWeight={800}>
              Item price + Removes shipping
            </text>
            <text x="1400" y="750" textAnchor="middle" fill={C.navy} fontSize="28" fontWeight={700}>
              Two rewards bundled in mind
            </text>
          </g>
        )}

        {/* 20: promo-gap-wording */}
        {id === "promo-gap-wording" && (
          <g opacity={enterSpring}>
            <rect x="160" y="140" width="1600" height="800" rx="28" fill={C.white} />
            <text x="960" y="232" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Two factors shape the response
            </text>
            <rect x="260" y="295" width="1400" height="230" rx="22" fill="#EEF3F7" />
            <text x="320" y="365" fill={C.navy} fontSize="34" fontWeight={800}>
              1. Remaining gap size
            </text>
            <rect x="320" y="410" width="960" height="36" rx="18" fill="#CBD5E1" />
            <rect
              x="320"
              y="410"
              width={660 + 220 * Math.sin(frame * 0.04)}
              height="36"
              rx="18"
              fill={C.yellow}
            />
            <text x="1340" y="440" fill={C.navy} fontSize="28" fontWeight={750}>
              Close vs. Far
            </text>

            <rect
              x="260"
              y="575"
              width="1400"
              height="245"
              rx="22"
              fill="#FFF7DF"
              stroke={C.yellow}
              strokeWidth="3.5"
              opacity={step2}
            />
            <text x="320" y="650" fill={C.navy} fontSize="34" fontWeight={800} opacity={step2}>
              2. How the offer is worded
            </text>
            <rect x="320" y="690" width="540" height="80" rx="14" fill={C.white} opacity={step2} />
            <text x="590" y="742" textAnchor="middle" fill={C.navy} fontSize="30" fontWeight={750} opacity={step2}>
              “$8 away from Free Shipping”
            </text>
            <rect x="920" y="690" width="540" height="80" rx="14" fill={C.white} opacity={step2} />
            <text x="1190" y="742" textAnchor="middle" fill="#64748B" fontSize="30" fontWeight={700} opacity={step2}>
              vague cutoff message
            </text>
          </g>
        )}

        {/* 21: gap-in-view */}
        {id === "gap-in-view" && (
          <g opacity={enterSpring}>
            <rect x="260" y="160" width="1400" height="760" rx="28" fill={C.white} />
            {/* Sticky pinned gap banner */}
            <rect
              x="320"
              y="215"
              width="1280"
              height="120"
              rx="20"
              fill={C.yellow}
              stroke={C.navy}
              strokeWidth="4"
            />
            <text x="380" y="286" fill={C.navy} fontSize="38" fontWeight={800}>
              Almost there — keep adding to unlock Free Shipping
            </text>
            {[0, 1, 2].map((i) => {
              const xPos = 420 + i * 380 - (midP * 90);
              return (
                <g key={i} transform={`translate(${xPos} 565)`}>
                  <rect x="-140" y="-135" width="280" height="290" rx="20" fill="#EEF3F7" />
                  <CableOrganizerArt x={0} y={-20} scale={0.75} />
                  <rect x="-90" y="70" width="180" height="44" rx="12" fill={C.navy} />
                  <text x="0" y="100" textAnchor="middle" fill={C.white} fontSize="24" fontWeight={750}>
                    View item
                  </text>
                </g>
              );
            })}
            <text x="960" y="855" textAnchor="middle" fill={C.navy} fontSize="34" fontWeight={750}>
              Progress stays pinned in view while you shop
            </text>
          </g>
        )}

        {/* 22: no-usefulness-test */}
        {id === "no-usefulness-test" && (
          <g opacity={enterSpring}>
            <rect x="200" y="170" width="1520" height="740" rx="28" fill={C.white} />
            <text x="960" y="275" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              What the cutoff checks
            </text>
            <rect x="320" y="345" width="580" height="410" rx="22" fill="#E6F7F6" stroke={C.teal} strokeWidth="4" />
            <text x="610" y="455" textAnchor="middle" fill={C.navy} fontSize="38" fontWeight={800}>
              Merchandise Dollars
            </text>
            <rect x="390" y="510" width="440" height="36" rx="18" fill={C.teal} />
            <CheckBadge x={610} y={640} scale={1.9} />

            <rect x="1020" y="345" width="580" height="410" rx="22" fill="#EEF3F7" stroke="#CBD5E1" strokeWidth="3.5" />
            <text x="1310" y="455" textAnchor="middle" fill="#64748B" fontSize="38" fontWeight={800}>
              Will You Use It?
            </text>
            <text x="1310" y="645" textAnchor="middle" fill={C.red} fontSize="112" fontWeight={800}>
              ?
            </text>
          </g>
        )}

        {/* 23: two-baskets-qualify */}
        {id === "two-baskets-qualify" && (
          <g opacity={enterSpring}>
            <rect x="160" y="150" width="1600" height="780" rx="28" fill={C.white} />
            <rect x="520" y="195" width="880" height="84" rx="18" fill={C.yellow} />
            <text x="960" y="250" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800}>
              Offer rule: Both baskets qualify ✓
            </text>
            <g transform="translate(550 570)">
              <rect x="-280" y="-210" width="560" height="480" rx="22" fill="#E6F7F6" stroke={C.teal} strokeWidth="4" />
              <WallChargerArt x={-80} y={-50} scale={0.62} />
              <ToothpasteArt x={95} y={-50} scale={0.95} />
              <CheckBadge x={0} y={100} scale={1.25} />
              <text x="0" y="195" textAnchor="middle" fill={C.navy} fontSize="34" fontWeight={800}>
                Planned needed staple
              </text>
            </g>
            <g transform="translate(1370 570)">
              <rect x="-280" y="-210" width="560" height="480" rx="22" fill="#FFF0F0" stroke={C.red} strokeWidth="3.5" />
              <WallChargerArt x={-80} y={-50} scale={0.62} />
              <CableOrganizerArt x={100} y={-40} scale={0.65} />
              <text x="0" y="125" textAnchor="middle" fill={C.red} fontSize="52" fontWeight={800}>
                ≠
              </text>
              <text x="0" y="195" textAnchor="middle" fill={C.navy} fontSize="34" fontWeight={800}>
                Unplanned filler
              </text>
            </g>
          </g>
        )}

        {/* 24: philippines-study */}
        {id === "philippines-study" && (
          <g opacity={enterSpring}>
            <rect x="160" y="140" width="1600" height="750" rx="28" fill={C.white} />
            <text x="260" y="228" fill={C.navy} fontSize="40" fontWeight={800}>
              Observed order distribution · Fashion retailer
            </text>
            <line x1="260" y1="680" x2="1660" y2="680" stroke="#94A3B8" strokeWidth="4" />
            <line
              x1="920"
              y1="295"
              x2="920"
              y2="710"
              stroke={C.yellow}
              strokeWidth="6"
              strokeDasharray="10 8"
            />
            <text x="920" y="756" textAnchor="middle" fill={C.navy} fontSize="30" fontWeight={800}>
              Free-shipping threshold
            </text>
            {[
              [420, 42], [540, 68], [660, 58], [780, 48],
              [960, 310], [1035, 250], [1110, 175], [1195, 110], [1295, 80], [1410, 54],
            ].map(([bx, bh], idx) => {
              const barP = clampEase(frame - idx * 4, 24);
              const above = bx > 920;
              return (
                <rect
                  key={bx}
                  x={bx - 28}
                  y={680 - bh * barP}
                  width="56"
                  height={bh * barP}
                  rx="8"
                  fill={above ? C.teal : "#CBD5E1"}
                />
              );
            })}
            <text x="1160" y="340" fill={C.teal} fontSize="32" fontWeight={800} opacity={step3}>
              Orders cluster just above threshold
            </text>
            <text x="960" y="960" textAnchor="middle" fill="#CBD5E1" fontSize="28" fontWeight={600}>
              2018 working paper · Online fashion retailer, Philippines
            </text>
          </g>
        )}

        {/* 25: model-vs-observation */}
        {id === "model-vs-observation" && (
          <g opacity={enterSpring}>
            <rect x="140" y="150" width="780" height="720" rx="28" fill={C.white} />
            <text x="530" y="245" textAnchor="middle" fill={C.navy} fontSize="38" fontWeight={800}>
              Observed clustering
            </text>
            <line x1="250" y1="640" x2="810" y2="640" stroke="#CBD5E1" strokeWidth="4" />
            <line x1="480" y1="330" x2="480" y2="660" stroke={C.yellow} strokeWidth="5" strokeDasharray="8 6" />
            <rect x="510" y="385" width="76" height="255" rx="8" fill={C.teal} />
            <rect x="605" y="455" width="76" height="185" rx="8" fill={C.teal} />
            <text x="530" y="755" textAnchor="middle" fill="#64748B" fontSize="30" fontWeight={700}>
              Real order pattern
            </text>

            <rect x="1000" y="150" width="780" height="720" rx="28" fill={C.white} stroke={C.yellow} strokeWidth="4" />
            <text x="1390" y="245" textAnchor="middle" fill={C.navy} fontSize="38" fontWeight={800}>
              Model estimate
            </text>
            <rect x="1120" y="370" width="220" height="160" rx="18" fill="#EEF3F7" />
            <text x="1230" y="460" textAnchor="middle" fill="#64748B" fontSize="28" fontWeight={750}>
              Always free
            </text>
            <rect x="1390" y="310" width="250" height="220" rx="18" fill="#FFF7DF" stroke={C.yellow} strokeWidth="3.5" />
            <text x="1515" y="430" textAnchor="middle" fill={C.navy} fontSize="30" fontWeight={800}>
              Cutoff policy
            </text>
            <text x="1515" y="472" textAnchor="middle" fill={C.teal} fontSize="28" fontWeight={800}>
              Larger baskets ↑
            </text>
            <text x="1390" y="755" textAnchor="middle" fill="#64748B" fontSize="30" fontWeight={700}>
              Structural simulation
            </text>
            <text x="960" y="960" textAnchor="middle" fill="#CBD5E1" fontSize="28" fontWeight={600}>
              2018 working paper · Observation vs. counterfactual model
            </text>
          </g>
        )}

        {/* 26: discount-vs-cutoff */}
        {id === "discount-vs-cutoff" && (
          <g opacity={enterSpring}>
            <rect x="200" y="155" width="1520" height="750" rx="28" fill={C.white} />
            <rect x="300" y="245" width="1320" height="240" rx="22" fill="#EEF3F7" />
            <text x="360" y="325" fill={C.navy} fontSize="38" fontWeight={800}>
              1. Free on every order
            </text>
            <WallChargerArt x={460} y={420} scale={0.35} />
            <text x="560" y="428" fill="#64748B" fontSize="32" fontWeight={750}>
              Same item · Pure price discount
            </text>

            <rect
              x="300"
              y="555"
              width="1320"
              height="255"
              rx="22"
              fill="#FFF7DF"
              stroke={C.yellow}
              strokeWidth="4"
              opacity={step2}
            />
            <text x="360" y="635" fill={C.navy} fontSize="38" fontWeight={800} opacity={step2}>
              2. Minimum spend attached
            </text>
            <WallChargerArt x={460} y={735} scale={0.35} />
            <text x="530" y="748" fill={C.navy} fontSize="36" fontWeight={800}>
              +
            </text>
            <CableOrganizerArt x={625} y={735} scale={0.42} />
            <text x="770" y="745" fill={C.navy} fontSize="32" fontWeight={750} opacity={step2}>
              Changes what lands inside the cart
            </text>
          </g>
        )}

        {/* 27: not-automatically-waste */}
        {id === "not-automatically-waste" && (
          <g opacity={enterSpring}>
            <rect x="200" y="160" width="1520" height="760" rx="28" fill={C.white} />
            <FlipCard
              x={540}
              y={530}
              from={18}
              until={duration}
              frame={frame}
              frontContent={
                <g>
                  <rect x="-220" y="-170" width="440" height="340" rx="24" fill="#EEF3F7" stroke="#CBD5E1" strokeWidth="4" />
                  <text x="0" y="15" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
                    Extra items = ?
                  </text>
                </g>
              }
              backContent={
                <g>
                  <rect x="-220" y="-170" width="440" height="340" rx="24" fill="#E6F7F6" stroke={C.teal} strokeWidth="4" />
                  <CheckBadge x={0} y={-40} scale={1.5} />
                  <text x="0" y="70" textAnchor="middle" fill={C.navy} fontSize="34" fontWeight={800}>
                    Can still be useful
                  </text>
                </g>
              }
            />
            <path d="M840 530 H1020 V400 H1120" fill="none" stroke={C.navy} strokeWidth="5" {...drawStroke(step2)} />
            <path d="M840 530 H1020 V660 H1120" fill="none" stroke={C.yellow} strokeWidth="5" {...drawStroke(step2)} />
            <rect x="1140" y="325" width="460" height="145" rx="20" fill="#EEF3F7" />
            <text x="1370" y="408" textAnchor="middle" fill={C.navy} fontSize="34" fontWeight={800}>
              Shapes order size
            </text>
            <rect x="1140" y="590" width="460" height="145" rx="20" fill="#FFF7DF" stroke={C.yellow} strokeWidth="3.5" />
            <text x="1370" y="672" textAnchor="middle" fill={C.navy} fontSize="34" fontWeight={800}>
              Shapes delivery cost
            </text>
          </g>
        )}

        {/* 28: indivisible-overshoot */}
        {id === "indivisible-overshoot" && (
          <g opacity={enterSpring}>
            <rect x="160" y="150" width="1600" height="760" rx="28" fill={C.white} />
            <text x="960" y="245" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Products don&apos;t split to fit the gap
            </text>
            <rect x="310" y="430" width="1000" height="108" rx="18" fill="#E2E8F0" />
            <rect
              x="310"
              y="430"
              width={1000 * (freeShippingOrder.beforeSubtotal / freeShippingExample.threshold)}
              height="108"
              rx="18"
              fill={C.navy}
            />
            <text x="730" y="496" textAnchor="middle" fill={C.white} fontSize="34" fontWeight={800}>
              Charger ({usd(freeShippingOrder.beforeSubtotal)})
            </text>
            {/* Discrete $12 add-on dropping past $50 cutoff */}
            <g transform={`translate(0 ${-110 * (1 - step3)})`} opacity={step2}>
              <rect
                x={310 + 1000 * (freeShippingOrder.beforeSubtotal / freeShippingExample.threshold)}
                y="430"
                width={1000 * (freeShippingExample.addOn / freeShippingExample.threshold)}
                height="108"
                rx="14"
                fill={C.yellow}
                stroke={C.navy}
                strokeWidth="4"
              />
              <text
                x={
                  310 +
                  1000 *
                    ((freeShippingOrder.beforeSubtotal + freeShippingExample.addOn / 2) /
                      freeShippingExample.threshold)
                }
                y="495"
                textAnchor="middle"
                fill={C.navy}
                fontSize="30"
                fontWeight={800}
              >
                Organizer ({usd(freeShippingExample.addOn)})
              </text>
            </g>
            <line x1="1310" y1="365" x2="1310" y2="595" stroke={C.red} strokeWidth="6" strokeDasharray="10 8" />
            <text x="1310" y="345" textAnchor="middle" fill={C.red} fontSize="30" fontWeight={800}>
              {usd(freeShippingExample.threshold)} Cutoff
            </text>
            <text x="1390" y="645" fill={C.red} fontSize="34" fontWeight={800} opacity={step3}>
              +{usd(freeShippingOrder.overshoot)} past minimum ({usd(freeShippingOrder.subtotal)})
            </text>
          </g>
        )}

        {/* 29: totals-reveal-aroll (Alex A-Roll with $48 and $54) */}
        {id === "totals-reveal-aroll" && (
          <g>
            <TalkingStickmanPresenter
              identity="Alex"
              x={380}
              y={940}
              scale={2.15}
              localFrame={frame}
              absoluteFrame={absoluteFrame}
              fromPose="explaining"
              pose="pointing"
              expression="confident"
              actionFrom={8}
              blendFrames={22}
            />
            <g transform="translate(860 215)">
              <g
                transform={`scale(${0.85 + 0.15 * eventProgress("full-paid-48")})`}
                opacity={clamp01(0.35 + 0.65 * eventProgress("full-paid-48"))}
              >
                <rect width="840" height="275" rx="26" fill={C.white} stroke={C.red} strokeWidth="5" />
                <text x="64" y="95" fill={C.red} fontSize="34" fontWeight={800}>
                  Paid delivery order
                </text>
                <text x="64" y="195" fill={C.navy} fontSize="96" fontWeight={800}>
                  {usd(freeShippingOrder.before)}
                </text>
                <WallChargerArt x={710} y={138} scale={0.75} />
              </g>
              <g
                transform={`translate(0 325) scale(${0.85 + 0.15 * eventProgress("full-free-54")})`}
                opacity={clamp01(0.35 + 0.65 * eventProgress("full-free-54"))}
              >
                <rect width="840" height="275" rx="26" fill={C.white} stroke={C.teal} strokeWidth="5" />
                <rect x="56" y="48" width="490" height="58" rx="14" fill="#E6F7F6" stroke={C.teal} strokeWidth="2.5" />
                <text x="80" y="88" fill={C.navy} fontSize="32" fontWeight={800}>
                  With organizer · Free shipping
                </text>
                <text x="64" y="195" fill={C.navy} fontSize="96" fontWeight={800}>
                  {usd(freeShippingOrder.after)}
                </text>
                <WallChargerArt x={645} y={138} scale={0.58} />
                <CableOrganizerArt x={755} y={148} scale={0.55} />
              </g>
            </g>
          </g>
        )}

        {/* 30: real-extra-outlay */}
        {id === "real-extra-outlay" && (
          <g opacity={enterSpring}>
            <rect x="160" y="140" width="1600" height="780" rx="28" fill={C.white} />
            <text x="960" y="232" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Shared charger + {usd(freeShippingOrder.increase)} extra outlay
            </text>
            {/* Left $48 bar */}
            <rect x="460" y="410" width="260" height="336" rx="14" fill={C.navy} />
            <text x="590" y="590" textAnchor="middle" fill={C.white} fontSize="34" fontWeight={750}>
              Charger ({usd(freeShippingOrder.beforeSubtotal)})
            </text>
            <rect x="460" y="354" width="260" height="48" rx="10" fill={C.red} />
            <text x="590" y="388" textAnchor="middle" fill={C.navy} fontSize="26" fontWeight={800}>
              Delivery {usd(freeShippingOrder.beforeShipping)}
            </text>
            <text x="590" y="810" textAnchor="middle" fill={C.red} fontSize="54" fontWeight={800}>
              {usd(freeShippingOrder.before)}
            </text>

            {/* Level dashed line at $48 */}
            <line
              x1="720"
              y1="354"
              x2="1200"
              y2="354"
              stroke={C.navy}
              strokeWidth="4"
              strokeDasharray="10 8"
            />

            {/* Right $54 bar */}
            <rect x="1200" y="410" width="260" height="336" rx="14" fill={C.navy} />
            <text x="1330" y="590" textAnchor="middle" fill={C.white} fontSize="34" fontWeight={750}>
              Charger ({usd(freeShippingOrder.beforeSubtotal)})
            </text>
            <rect x="1200" y="306" width="260" height="96" rx="12" fill={C.yellow} />
            <text x="1330" y="365" textAnchor="middle" fill={C.navy} fontSize="30" fontWeight={800}>
              Organizer ({usd(freeShippingExample.addOn)})
            </text>
            <text x="1330" y="810" textAnchor="middle" fill={C.teal} fontSize="54" fontWeight={800}>
              {usd(freeShippingOrder.after)}
            </text>

            <g opacity={eventProgress("full-extra-6")}>
              <rect x="815" y="295" width="290" height="78" rx="16" fill="#E6F7F6" stroke={C.teal} strokeWidth="4" />
              <text x="960" y="346" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800}>
                +{usd(freeShippingOrder.increase)} net outlay
              </text>
            </g>
          </g>
        )}

        {/* 31: merchant-side-aroll (Sam A-Roll) */}
        {id === "merchant-side-aroll" && (
          <g>
            <TalkingStickmanPresenter
              identity="Sam"
              x={380}
              y={940}
              scale={2.15}
              localFrame={frame}
              absoluteFrame={absoluteFrame}
              fromPose="standing"
              pose="explaining"
              expression="curious"
              actionFrom={8}
              blendFrames={24}
            />
            <g transform="translate(830 165)">
              <rect width="900" height="710" rx="28" fill={C.white} />
              <text x="60" y="95" fill={C.navy} fontSize="42" fontWeight={800}>
                The retailer&apos;s side of the offer
              </text>
              {[
                ["1. Increase cart value", C.yellow, step1],
                ["2. Account for shipping costs", "#EEF3F7", step2],
                ["3. Show how far to qualify", "#E6F7F6", step3],
              ].map(([labelText, bg, p], idx) => (
                <g
                  key={String(labelText)}
                  transform={`translate(60 ${155 + idx * 145})`}
                  opacity={Number(p)}
                >
                  <rect width="780" height="112" rx="18" fill={String(bg)} />
                  <text x="40" y="70" fill={C.navy} fontSize="34" fontWeight={750}>
                    {String(labelText)}
                  </text>
                </g>
              ))}
              <text x="60" y="650" fill="#64748B" fontSize="26" fontWeight={650}>
                Shopify guidance for merchants
              </text>
            </g>
          </g>
        )}

        {/* 32: delivery-still-costs */}
        {id === "delivery-still-costs" && (
          <g opacity={enterSpring}>
            <rect x="160" y="155" width="1600" height="750" rx="28" fill={C.white} />
            <rect x="260" y="250" width="520" height="175" rx="20" fill="#E6F7F6" stroke={C.teal} strokeWidth="4" />
            <text x="520" y="330" textAnchor="middle" fill={C.navy} fontSize="34" fontWeight={750}>
              Checkout screen
            </text>
            <text x="520" y="385" textAnchor="middle" fill={C.teal} fontSize="42" fontWeight={800}>
              Shipping: FREE
            </text>
            <line
              x1="800"
              y1="338"
              x2={interpolate(step2, [0, 1], [800, 1080])}
              y2="338"
              stroke={C.navy}
              strokeWidth="6"
              strokeDasharray="10 8"
            />
            <g transform={`translate(${interpolate(midP, [0, 1], [1160, 1460])} 338)`}>
              <ShippingBoxArt x={0} y={0} scale={1.1} />
            </g>
            <rect x="260" y="510" width="1400" height="290" rx="22" fill="#FFF0F0" stroke={C.red} strokeWidth="3.5" />
            <text x="320" y="590" fill={C.red} fontSize="38" fontWeight={800}>
              Real fulfillment cost doesn&apos;t vanish
            </text>
            <text x="320" y="670" fill={C.navy} fontSize="32" fontWeight={700} opacity={step2}>
              • Absorbed by merchant margins
            </text>
            <text x="320" y="730" fill={C.navy} fontSize="32" fontWeight={700} opacity={step3}>
              • Or built into item pricing (not a universal rule)
            </text>
          </g>
        )}

        {/* 33: margin-vs-cost */}
        {id === "margin-vs-cost" && (
          <g opacity={enterSpring}>
            <rect x="160" y="155" width="1600" height="750" rx="28" fill={C.white} />
            <text x="960" y="245" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Added merchandise revenue vs. retail costs
            </text>
            <rect x="340" y="340" width="540" height="440" rx="22" fill="#E6F7F6" />
            <text x="610" y="425" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800}>
              Extra item margin
            </text>
            <rect
              x="490"
              y={710 - 200 * step2}
              width="240"
              height={200 * step2}
              rx="12"
              fill={C.teal}
            />
            <rect x="1040" y="340" width="540" height="440" rx="22" fill="#FFF0F0" />
            <text x="1310" y="425" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800}>
              Waived fee + fulfillment
            </text>
            <rect
              x="1190"
              y={710 - 230 * step3}
              width="240"
              height={230 * step3}
              rx="12"
              fill={C.red}
            />
            <text x="960" y="560" textAnchor="middle" fill={C.navy} fontSize="54" fontWeight={800}>
              vs.
            </text>
          </g>
        )}

        {/* 34: study-2006-profit */}
        {id === "study-2006-profit" && (
          <g opacity={enterSpring}>
            <rect x="160" y="135" width="1600" height="760" rx="28" fill={C.white} />
            <text x="260" y="220" fill={C.navy} fontSize="40" fontWeight={800}>
              2006 retailer shipping-policy study
            </text>
            <rect x="260" y="280" width="660" height="230" rx="20" fill="#FFF7DF" stroke={C.yellow} strokeWidth="3.5" />
            <text x="590" y="365" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800}>
              Higher sales volume ↑
            </text>
            <text x="590" y="425" textAnchor="middle" fill="#64748B" fontSize="30" fontWeight={700}>
              More items added to orders
            </text>

            <rect x="1000" y="280" width="660" height="230" rx="20" fill="#FFF0F0" stroke={C.red} strokeWidth="3.5" />
            <text x="1330" y="365" textAnchor="middle" fill={C.red} fontSize="36" fontWeight={800}>
              Profitability not guaranteed
            </text>
            <text x="1330" y="425" textAnchor="middle" fill="#64748B" fontSize="30" fontWeight={700}>
              Shipping fee revenue given up
            </text>

            {/* Three heterogeneous customer lanes */}
            {[
              "Already qualified (windfall fee cut)",
              "Added item just to qualify",
              "Chose not to raise basket",
            ].map((lane, idx) => (
              <g key={lane} transform={`translate(260 ${565 + idx * 96})`} opacity={clampEase(frame - 60 - idx * 25, 20)}>
                <rect width="1400" height="74" rx="14" fill="#EEF3F7" />
                <circle cx="48" cy="37" r="16" fill={idx === 1 ? C.teal : idx === 0 ? C.yellow : C.red} />
                <text x="88" y="47" fill={C.navy} fontSize="30" fontWeight={700}>
                  {lane}
                </text>
              </g>
            ))}
            <text x="960" y="965" textAnchor="middle" fill="#CBD5E1" fontSize="28" fontWeight={600}>
              2006 empirical study on online retailer shipping policies
            </text>
          </g>
        )}

        {/* 35: raising-threshold */}
        {id === "raising-threshold" && (
          <g opacity={enterSpring}>
            <rect x="180" y="175" width="1560" height="720" rx="28" fill={C.white} />
            <text x="960" y="275" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Raising the target changes the response
            </text>
            <rect x="310" y="485" width="1280" height="44" rx="22" fill="#E2E8F0" />
            <rect x="310" y="485" width="540" height="44" rx="22" fill={C.navy} />
            {/* Cutoff line sliding rightwards */}
            <line
              x1={1050 + 380 * step2}
              y1="385"
              x2={1050 + 380 * step2}
              y2="585"
              stroke={C.red}
              strokeWidth="6"
              strokeDasharray="10 8"
            />
            <text
              x={1050 + 380 * step2}
              y="365"
              textAnchor="middle"
              fill={C.red}
              fontSize="32"
              fontWeight={800}
            >
              Higher target ↑
            </text>
            <Cursor x={860} y={535} opacity={0.9} />
            <text x="960" y="725" textAnchor="middle" fill={C.navy} fontSize="34" fontWeight={750} opacity={step3}>
              Shopper stops chasing when gap feels too large
            </text>
          </g>
        )}

        {/* 36: grocery-2026-study */}
        {id === "grocery-2026-study" && (
          <g opacity={enterSpring}>
            <rect x="160" y="140" width="1600" height="750" rx="28" fill={C.white} />
            <text x="260" y="225" fill={C.navy} fontSize="40" fontWeight={800}>
              North American online grocery platform · 2026 working paper
            </text>
            <rect x="260" y="305" width="620" height="330" rx="22" fill="#FFF7DF" stroke={C.yellow} strokeWidth="4" />
            <text x="570" y="425" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Threshold raised ↑
            </text>
            <text x="570" y="505" textAnchor="middle" fill="#64748B" fontSize="32" fontWeight={700}>
              Higher minimum spend
            </text>
            <path d="M905 470 H1025" stroke={C.red} strokeWidth="8" strokeLinecap="round" {...drawStroke(step2)} />
            <rect x="1040" y="305" width="620" height="330" rx="22" fill="#FFF0F0" stroke={C.red} strokeWidth="4" />
            <text x="1350" y="425" textAnchor="middle" fill={C.red} fontSize="42" fontWeight={800}>
              Order spend fell ↓
            </text>
            <text x="1350" y="505" textAnchor="middle" fill="#64748B" fontSize="30" fontWeight={700}>
              Among continuing purchasers
            </text>
            <rect x="260" y="705" width="1400" height="115" rx="18" fill="#EEF3F7" opacity={lateP} />
            <text x="960" y="775" textAnchor="middle" fill={C.navy} fontSize="32" fontWeight={750} opacity={lateP}>
              One working paper about one platform — not a universal rule
            </text>
            <text x="960" y="965" textAnchor="middle" fill="#CBD5E1" fontSize="28" fontWeight={600}>
              2026 working paper · North American grocery platform
            </text>
          </g>
        )}

        {/* 37: two-studies-matrix */}
        {id === "two-studies-matrix" && (
          <g opacity={enterSpring}>
            <rect x="160" y="150" width="1600" height="750" rx="28" fill={C.white} />
            <text x="960" y="240" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Different studies ask different policy questions
            </text>
            <rect x="240" y="305" width="1440" height="215" rx="20" fill="#EEF3F7" />
            <text x="300" y="390" fill={C.navy} fontSize="34" fontWeight={800}>
              2018 Philippine Fashion Paper
            </text>
            <text x="300" y="455" fill={C.teal} fontSize="32" fontWeight={750}>
              Always-free shipping vs. Minimum-spend threshold
            </text>

            <rect
              x="240"
              y="565"
              width="1440"
              height="215"
              rx="20"
              fill="#FFF7DF"
              stroke={C.yellow}
              strokeWidth="3.5"
              opacity={step2}
            />
            <text x="300" y="650" fill={C.navy} fontSize="34" fontWeight={800} opacity={step2}>
              2026 Grocery Working Paper
            </text>
            <text x="300" y="715" fill={C.red} fontSize="32" fontWeight={750} opacity={step2}>
              Lower threshold vs. Raised higher threshold
            </text>
          </g>
        )}

        {/* 38: needed-item-aroll (Alex A-Roll) */}
        {id === "needed-item-aroll" && (
          <g>
            <TalkingStickmanPresenter
              identity="Alex"
              x={380}
              y={940}
              scale={2.15}
              localFrame={frame}
              absoluteFrame={absoluteFrame}
              fromPose="standing"
              pose="explaining"
              expression="happy"
              actionFrom={8}
              blendFrames={24}
            />
            <g transform={`translate(1260 520) scale(${enterSpring})`}>
              <rect x="-390" y="-250" width="780" height="500" rx="30" fill={C.white} />
              <ToothpasteArt x={0} y={-40} scale={1.3} />
              <CheckBadge x={250} y={-140} scale={1.5} />
              <text x="0" y="135" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
                Planned item · Fair price
              </text>
              <text x="0" y="190" textAnchor="middle" fill={C.teal} fontSize="30" fontWeight={750}>
                Replaces next week&apos;s trip
              </text>
            </g>
          </g>
        )}

        {/* 39: earlier-not-more */}
        {id === "earlier-not-more" && (
          <g opacity={enterSpring}>
            <rect x="160" y="150" width="1600" height="750" rx="28" fill={C.white} />
            <text x="960" y="240" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Timing shift vs. extra consumption
            </text>
            {/* Top row: Toothpaste shifts earlier */}
            <rect x="260" y="305" width="1400" height="230" rx="22" fill="#E6F7F6" stroke={C.teal} strokeWidth="3.5" />
            <text x="310" y="370" fill={C.navy} fontSize="34" fontWeight={800}>
              Planned staple (toothpaste)
            </text>
            <text x="450" y="485" textAnchor="middle" fill={C.navy} fontSize="30" fontWeight={750}>
              Today ✓
            </text>
            <text x="1350" y="485" textAnchor="middle" fill="#64748B" fontSize="30" fontWeight={700}>
              Next week
            </text>
            <path d="M1230 435 C1000 375 680 375 560 445" fill="none" stroke={C.teal} strokeWidth="6" {...drawStroke(step2)} />
            <ToothpasteArt x={interpolate(step2, [0, 1], [1350, 560])} y={445} scale={0.55} />

            {/* Bottom row: Unwanted organizer adds extra */}
            <rect x="260" y="590" width="1400" height="230" rx="22" fill="#FFF0F0" stroke={C.red} strokeWidth="3.5" opacity={step2} />
            <text x="310" y="655" fill={C.navy} fontSize="34" fontWeight={800} opacity={step2}>
              Unused organizer
            </text>
            <CableOrganizerArt x={460} y={745} scale={0.58} />
            <text x="640" y="758" fill={C.red} fontSize="32" fontWeight={800} opacity={step3}>
              Doesn&apos;t replace anything — extra spending
            </text>
          </g>
        )}

        {/* 40: cash-and-space */}
        {id === "cash-and-space" && (
          <g opacity={enterSpring}>
            <rect x="200" y="160" width="1520" height="740" rx="28" fill={C.white} />
            <text x="960" y="255" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Even buying early has real constraints
            </text>
            <rect x="300" y="330" width="600" height="390" rx="24" fill="#EEF3F7" />
            <circle cx="600" cy="465" r="76" fill={C.yellow} />
            <text x="600" y="492" textAnchor="middle" fill={C.navy} fontSize="72" fontWeight={800}>
              $
            </text>
            <text x="600" y="635" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800}>
              Cash available today
            </text>

            <rect x="1020" y="330" width="600" height="390" rx="24" fill="#EEF3F7" opacity={step2} />
            <rect x="1230" y="400" width="180" height="125" rx="16" fill={C.teal} opacity={step2} />
            <text x="1320" y="476" textAnchor="middle" fill={C.navy} fontSize="32" fontWeight={800} opacity={step2}>
              Shelf
            </text>
            <text x="1320" y="635" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800} opacity={step2}>
              Space to store it
            </text>
            <text x="960" y="820" textAnchor="middle" fill="#64748B" fontSize="32" fontWeight={700} opacity={step3}>
              Affordable flexibility differs across households
            </text>
          </g>
        )}

        {/* 41: delivery-as-service */}
        {id === "delivery-as-service" && (
          <g opacity={enterSpring}>
            <rect x="160" y="155" width="1600" height="750" rx="28" fill={C.white} />
            <text x="960" y="245" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Paying for delivery can be a practical service
            </text>
            <rect x="260" y="320" width="650" height="470" rx="22" fill="#EEF3F7" />
            <text x="585" y="410" textAnchor="middle" fill={C.navy} fontSize="38" fontWeight={800}>
              Physical store trip
            </text>
            <text x="585" y="510" textAnchor="middle" fill="#64748B" fontSize="32" fontWeight={700}>
              Shift schedules
            </text>
            <text x="585" y="585" textAnchor="middle" fill="#64748B" fontSize="32" fontWeight={700}>
              Limited mobility
            </text>
            <text x="585" y="660" textAnchor="middle" fill="#64748B" fontSize="32" fontWeight={700}>
              Transport & help needed
            </text>

            <rect x="1010" y="320" width="650" height="470" rx="22" fill="#E6F7F6" stroke={C.teal} strokeWidth="4" />
            <ShippingBoxArt x={1335} y={470} scale={1.1} />
            <CheckBadge x={1470} y={405} scale={1.35} />
            <text x="1335" y="640" textAnchor="middle" fill={C.navy} fontSize="38" fontWeight={800}>
              Delivered to your door
            </text>
            <text x="1335" y="705" textAnchor="middle" fill={C.teal} fontSize="30" fontWeight={750}>
              Real time & access value
            </text>
          </g>
        )}

        {/* 42: organizer-value */}
        {id === "organizer-value" && (
          <g opacity={enterSpring}>
            <rect x="240" y="175" width="1440" height="720" rx="28" fill={C.white} />
            <CableOrganizerArt x={960} y={465} scale={1.8} />
            <CheckBadge x={1230} y={325} scale={1.6} />
            <text x="960" y="725" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Useful &amp; enjoyable on its own
            </text>
            <text x="960" y="785" textAnchor="middle" fill="#64748B" fontSize="30" fontWeight={700}>
              Not every extra purchase is automatically waste
            </text>
          </g>
        )}

        {/* 43: return-two-orders */}
        {id === "return-two-orders" && (
          <g opacity={enterSpring}>
            <rect x="160" y="160" width="760" height="740" rx="28" fill={C.white} stroke={C.red} strokeWidth="4" />
            <text x="540" y="255" textAnchor="middle" fill={C.red} fontSize="36" fontWeight={800}>
              Order 1 · Paid delivery
            </text>
            <WallChargerArt x={540} y={465} scale={1.15} />
            <text x="540" y="705" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              {usd(freeShippingOrder.before)} · Charger
            </text>

            <rect x="1000" y="160" width="760" height="740" rx="28" fill={C.white} stroke={C.teal} strokeWidth="4" />
            <text x="1380" y="255" textAnchor="middle" fill={C.teal} fontSize="36" fontWeight={800}>
              Order 2 · Free delivery
            </text>
            <WallChargerArt x={1230} y={465} scale={0.95} />
            <CableOrganizerArt x={1515} y={485} scale={0.95} />
            <text x="1380" y="705" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              {usd(freeShippingOrder.after)} · Both items
            </text>
          </g>
        )}

        {/* 44: willing-to-pay-test */}
        {id === "willing-to-pay-test" && (
          <g opacity={enterSpring}>
            <rect x="160" y="135" width="1600" height="790" rx="28" fill={C.white} />
            {/* Promo banner visibly strips/dims away */}
            <rect
              x="260"
              y="180"
              width="1400"
              height="96"
              rx="18"
              fill={C.yellow}
              opacity={1 - 0.86 * eventProgress("full-strip-banner")}
            />
            <text
              x="960"
              y="240"
              textAnchor="middle"
              fill={C.navy}
              fontSize="34"
              fontWeight={800}
              opacity={1 - 0.86 * eventProgress("full-strip-banner")}
            >
              Free Shipping Promo Banner
            </text>
            <CableOrganizerArt x={560} y={455} scale={1.25} />
            <text x="560" y="610" textAnchor="middle" fill={C.navy} fontSize="36" fontWeight={800}>
              Cable organizer
            </text>
            <rect x="1020" y="340" width="540" height="225" rx="24" fill="#E6F7F6" stroke={C.teal} strokeWidth="4" />
            <text x="1290" y="420" textAnchor="middle" fill={C.teal} fontSize="32" fontWeight={800}>
              True extra cost
            </text>
            <text x="1290" y="510" textAnchor="middle" fill={C.navy} fontSize="96" fontWeight={800}>
              +{usd(freeShippingOrder.increase)}
            </text>
            {[
              [`Worth ${usd(freeShippingOrder.increase)} → Qualify`, C.teal],
              [`Pay ${usd(freeShippingOrder.before)} → Lower total`, C.yellow],
              ["Reconsider order itself", "#EEF3F7"],
            ].map(([opt, bg], idx) => (
              <g key={String(opt)} transform={`translate(${260 + idx * 480} 705)`} opacity={lateP}>
                <rect width="440" height="125" rx="18" fill={String(bg)} />
                <text x="220" y="75" textAnchor="middle" fill={C.navy} fontSize="29" fontWeight={800}>
                  {String(opt)}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* 45: causal-summary-aroll (Sam A-Roll) */}
        {id === "causal-summary-aroll" && (
          <g>
            <TalkingStickmanPresenter
              identity="Sam"
              x={380}
              y={940}
              scale={2.15}
              localFrame={frame}
              absoluteFrame={absoluteFrame}
              fromPose="standing"
              pose="explaining"
              expression="confident"
              actionFrom={8}
              blendFrames={22}
            />
            <g transform="translate(840 190)">
              {[
                ["1. Spending condition arrives", C.yellow, step1],
                ["2. Chasing $0 on the delivery line", "#FFF0F0", step2],
                ["3. Can crowd out what you wanted", "#E6F7F6", step3],
              ].map(([txt, col, op], idx) => (
                <g key={String(txt)} transform={`translate(0 ${idx * 205})`} opacity={Number(op)}>
                  <rect width="880" height="155" rx="22" fill={C.white} stroke={String(col)} strokeWidth="5" />
                  <text x="50" y="92" fill={C.navy} fontSize="38" fontWeight={800}>
                    {String(txt)}
                  </text>
                </g>
              ))}
            </g>
          </g>
        )}

        {/* 46: final-callback */}
        {id === "final-callback" && (
          <g opacity={enterSpring}>
            <rect x="260" y="155" width="1400" height="750" rx="28" fill={C.white} />
            <WallChargerArt x={610} y={455} scale={1.32} />
            <CheckBadge x={755} y={320} scale={1.45} />
            <text x="610" y="665" textAnchor="middle" fill={C.navy} fontSize="42" fontWeight={800}>
              Start &amp; finish with what you need
            </text>
            <g opacity={0.62}>
              <CableOrganizerArt x={1270} y={455} scale={1.15} />
              <text x="1270" y="625" textAnchor="middle" fill="#64748B" fontSize="34" fontWeight={750}>
                Organizer: optional
              </text>
            </g>
            {/* Dimmed Free badge */}
            <rect
              x="1140"
              y="695"
              width="260"
              height="68"
              rx="16"
              fill={C.yellow}
              opacity={0.32}
            />
            <text
              x="1270"
              y="740"
              textAnchor="middle"
              fill={C.navy}
              fontSize="30"
              fontWeight={800}
              opacity={0.45}
            >
              Free badge
            </text>
            <KineticHeadline
              from={18}
              until={duration}
              frame={frame}
              x={360}
              y={795}
              width={1200}
              size={44}
              text="Choose for value — not for the free badge"
              textAlign="center"
              color={C.navy}
              emphasis="value"
              emphasisColor={C.teal}
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

export const FreeShippingRemainingVisuals: React.FC = () => (
  <AbsoluteFill>
    {REMAINING_SCENES.map((scene) => (
      <Sequence
        key={scene.id}
        name={scene.title}
        from={scene.from}
        durationInFrames={scene.durationInFrames}
      >
        <RemainingScene
          id={scene.id}
          title={scene.title}
          duration={scene.durationInFrames}
          sceneFrom={scene.from}
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const FreeShippingFullFilm: React.FC = () => {
  const endCardEvent = freeShippingFullTimeline.events.find(
    (event) => event.track === "end-card",
  );
  return (
    <AbsoluteFill>
      <Audio src={staticFile("free-shipping-full/narration.wav")} />
      {freeShippingFullTimeline.scenes.slice(0, 9).map((scene, index) => (
        <Sequence
          key={scene.id}
          name={scene.title}
          from={scene.from}
          durationInFrames={scene.durationInFrames}
        >
          <OpeningScene index={index} duration={scene.durationInFrames} />
        </Sequence>
      ))}
      <FreeShippingRemainingVisuals />
      {FULL_CUTAWAYS.map((event) => (
        <Sequence
          key={event.id}
          name={event.id}
          from={event.from}
          durationInFrames={event.durationInFrames}
        >
          <KineticCutaway
            variant={event.payload.variant as CutawayVariant}
            text={String(event.payload.text)}
            kicker={String(event.payload.kicker)}
            duration={event.durationInFrames}
          />
        </Sequence>
      ))}
      {endCardEvent && (
        <Sequence
          name="The Money Trap End Card"
          from={endCardEvent.from}
          durationInFrames={endCardEvent.durationInFrames}
        >
          <FreeShippingEndCard duration={endCardEvent.durationInFrames} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

export const REMAINING_GALLERY_SLOT = 90;
export const REMAINING_GALLERY_DURATION =
  REMAINING_SCENES.length * REMAINING_GALLERY_SLOT;

export const FreeShippingRemainingGallery: React.FC = () => {
  const slotDuration = REMAINING_GALLERY_SLOT;
  return (
    <AbsoluteFill>
      {REMAINING_SCENES.map((scene, slot) => (
        <Sequence
          key={scene.id}
          name={`${slot + 1}: ${scene.id}`}
          from={slot * slotDuration}
          durationInFrames={slotDuration}
        >
          <RemainingScene
            id={scene.id}
            title={scene.title}
            duration={slotDuration}
            sceneFrom={scene.from}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
