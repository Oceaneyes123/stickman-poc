import { useId } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Alex,
  CharacterFace,
  Sam,
  characterColors,
} from "../characters/ReferenceCharacterRig";
import {
  referenceSkeleton,
  type ReferenceExpression,
  type ReferencePose,
} from "../characters/referenceModel";
import { C, font } from "../design/tokens";
import { FlipCard } from "../objects/motion";
import { Transition } from "../transitions";
import {
  KineticHeadline,
  ObjectAttachedLabel,
  TextMorph,
} from "../typography";
import { clamp01 } from "../typography/timing";
import {
  KineticCutaway,
} from "./FreeShippingCutaways";
import {
  FULL_SPEECH_WINDOWS,
  OPENING_CUTAWAYS,
  type CutawayVariant,
} from "./freeShippingFullTimeline";
import {
  A_ROLL_FIRST_SEGMENT_FRAMES,
  A_ROLL_SECOND_SEGMENT_FRAMES,
  freeShippingExample,
  freeShippingOpeningTimeline,
  freeShippingOrder,
} from "./freeShippingOpeningTimeline";
import { FreeShippingOpeningSound } from "./freeShippingSound";

export {
  A_ROLL_FIRST_SEGMENT_FRAMES,
  A_ROLL_FRAMES,
  A_ROLL_SECOND_SEGMENT_FRAMES,
} from "./freeShippingOpeningTimeline";

export const clampEase = (frame: number, duration = 22) =>
  interpolate(frame, [0, Math.max(1, duration)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const springPop = (
  frame: number,
  fps: number,
  delay = 0,
  damping = 13,
  stiffness = 175,
) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping, stiffness, mass: 0.72 },
  });

export const drawStroke = (progress: number) => {
  const p = clamp01(progress);
  return {
    pathLength: 1,
    strokeDasharray: "1 1",
    strokeDashoffset: 1 - p,
  };
};

const isFrameSpeaking = (absoluteFrame: number) =>
  FULL_SPEECH_WINDOWS.some(
    ([start, end]) => absoluteFrame >= start && absoluteFrame <= end,
  );

export const SvgBackdrop: React.FC<{ driftFrame: number }> = ({
  driftFrame,
}) => {
  const uid = useId().replaceAll(":", "");
  const drift = Math.sin(driftFrame / 180) * 9;
  return (
    <g aria-hidden="true">
      <defs>
        <pattern
          id={`free-ship-bg-${uid}`}
          width="96"
          height="96"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${drift} ${drift * 0.6})`}
        >
          <circle cx="14" cy="18" r="1.5" fill={C.white} opacity="0.16" />
          <circle cx="68" cy="64" r="1.1" fill={C.white} opacity="0.14" />
          <path
            d="M32 76 h14 M70 24 h10"
            stroke={C.white}
            strokeWidth="1.2"
            opacity="0.1"
          />
        </pattern>
      </defs>
      <rect width="1920" height="1080" fill={C.navy} />
      <rect width="1920" height="1080" fill={`url(#free-ship-bg-${uid})`} />
    </g>
  );
};

export const Cursor: React.FC<{
  x: number;
  y: number;
  press?: number;
  ripple?: number;
  rippleColor?: string;
  opacity?: number;
}> = ({
  x,
  y,
  press = 0,
  ripple = 0,
  rippleColor = C.yellow,
  opacity = 1,
}) => {
  const scale = 1 - 0.16 * Math.sin(Math.PI * clamp01(press));
  const r = clamp01(ripple);
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {r > 0 && r < 1 && (
        <circle
          cx="4"
          cy="4"
          r={12 + 44 * r}
          fill="none"
          stroke={rippleColor}
          strokeWidth="5"
          opacity={(1 - r) * 0.9}
        />
      )}
      <path
        d="M0 0 L0 54 L14 41 L25 65 L35 60 L24 36 L45 36 Z"
        transform={`scale(${scale})`}
        fill={C.white}
        stroke={C.navy}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </g>
  );
};

export const TalkingStickmanPresenter: React.FC<{
  identity: "Sam" | "Alex";
  x?: number;
  y?: number;
  scale?: number;
  localFrame: number;
  absoluteFrame: number;
  fromPose: ReferencePose;
  pose: ReferencePose;
  expression: ReferenceExpression;
  actionFrom?: number;
  blendFrames?: number;
}> = ({
  identity,
  x = 390,
  y = 940,
  scale = 2.15,
  localFrame,
  absoluteFrame,
  fromPose,
  pose,
  expression,
  actionFrom = 4,
  blendFrames = 22,
}) => {
  const rig = referenceSkeleton({
    frame: localFrame,
    pose,
    fromPose,
    actionFrom,
    blendFrames,
  });
  const speaking = isFrameSpeaking(absoluteFrame);
  const mouthOpen = speaking
    ? clamp01(
        0.54 +
          0.32 * Math.sin(absoluteFrame * 0.72) +
          0.14 * Math.cos(absoluteFrame * 1.29),
      )
    : 0;
  const speechBob = speaking ? Math.sin(absoluteFrame * 0.42) * 2.2 : 0;
  const enterScale = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 14, stiffness: 150, mass: 0.8 },
  });
  const slideY = 36 * (1 - clamp01(enterScale));
  const mouthY = identity === "Alex" ? 26 : 22;
  const Character = identity === "Sam" ? Sam : Alex;

  return (
    <g transform={`translate(0 ${slideY})`}>
      <circle
        cx={x}
        cy={y - 460}
        r="240"
        fill="#1E3552"
        opacity={0.72 * clamp01(localFrame / 14)}
      />
      <ellipse
        cx={x}
        cy={y + 8}
        rx="165"
        ry="22"
        fill="#0A1422"
        opacity="0.35"
      />
      <Character
        x={x}
        y={y}
        scale={scale}
        facing={1}
        skeleton={rig}
        expression={expression}
      />
      {/* Enlarged presenter head with speech-synced mouth animation */}
      <g
        transform={`translate(${x + rig.travel * scale}, ${y}) scale(${scale})`}
      >
        <g
          transform={`translate(${rig.head.x}, ${rig.head.y - 6}) rotate(${rig.nod + speechBob}) scale(1.34)`}
        >
          <path
            d="M 0 34 V 48"
            stroke={characterColors.ink}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <CharacterFace
            identity={identity}
            expression={expression}
            turn={rig.turn}
            yaw={rig.yaw}
          />
          {speaking && (
            <g>
              <ellipse
                cx={0}
                cy={mouthY}
                rx={16}
                ry={9.5}
                fill={characterColors.paper}
              />
              <ellipse
                cx={0}
                cy={mouthY + 1}
                rx={6.8 + 4.4 * mouthOpen}
                ry={2.2 + 6.4 * mouthOpen}
                fill={characterColors.ink}
              />
              {mouthOpen > 0.48 && (
                <ellipse
                  cx={0}
                  cy={mouthY + 4.2}
                  rx={4.5}
                  ry={2.1}
                  fill={characterColors.red}
                />
              )}
            </g>
          )}
        </g>
      </g>
    </g>
  );
};

export const WallChargerArt: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
}> = ({ x = 0, y = 0, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {/* Neatly looped USB-C cable behind/beside adapter */}
    <path
      d="M42 30 C115 30, 130 -65, 84 -85 C46 -102, 20 -55, 65 -18 C105 15, 118 74, 48 86"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="11"
      strokeLinecap="round"
    />
    <path
      d="M42 30 C115 30, 130 -65, 84 -85 C46 -102, 20 -55, 65 -18 C105 15, 118 74, 48 86"
      fill="none"
      stroke="#CBD5E1"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Metallic prongs */}
    <rect x="-42" y="-114" width="16" height="38" rx="4" fill="#94A3B8" />
    <rect x="26" y="-114" width="16" height="38" rx="4" fill="#94A3B8" />
    <rect x="-42" y="-114" width="6" height="38" rx="2" fill="#CBD5E1" />
    <rect x="26" y="-114" width="6" height="38" rx="2" fill="#CBD5E1" />
    {/* Charger body */}
    <rect
      x="-74"
      y="-80"
      width="148"
      height="168"
      rx="24"
      fill={C.white}
      stroke="#CBD5E1"
      strokeWidth="4"
    />
    <rect x="-56" y="-62" width="112" height="132" rx="16" fill="#EEF3F7" />
    {/* Subtle USB-C port & indicator */}
    <rect x="-18" y="34" width="36" height="14" rx="7" fill={C.navy} />
    <circle cx="0" cy="-16" r="6" fill={C.teal} />
  </g>
);

export const CableOrganizerArt: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
}> = ({ x = 0, y = 0, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {/* Cable passing through middle channel */}
    <path
      d="M-125 6 C-80 6, -70 -4, 0 -4 C70 -4, 80 6, 125 6"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="12"
      strokeLinecap="round"
    />
    {/* Charcoal base */}
    <rect
      x="-105"
      y="-44"
      width="210"
      height="92"
      rx="20"
      fill="#1E293B"
      stroke="#0F172A"
      strokeWidth="3"
    />
    <rect x="-95" y="-36" width="190" height="72" rx="14" fill="#334155" />
    {/* Three moulded cord channels */}
    {[-54, 0, 54].map((cx) => (
      <g key={cx} transform={`translate(${cx} 0)`}>
        <rect x="-15" y="-44" width="30" height="70" rx="12" fill="#0F172A" />
        <rect x="-10" y="-44" width="20" height="10" rx="4" fill="#475569" />
      </g>
    ))}
    {/* Center cable highlight inside slot */}
    <rect x="-7" y="-22" width="14" height="40" rx="6" fill="#CBD5E1" />
  </g>
);

export const HouseholdStapleOutline: React.FC<{ x?: number; y?: number }> = ({
  x = 0,
  y = 0,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      x="-36"
      y="-54"
      width="72"
      height="112"
      rx="14"
      fill="#E2E8F0"
      stroke="#64748B"
      strokeWidth="4"
    />
    <rect x="-18" y="-76" width="36" height="22" rx="5" fill="#94A3B8" />
    <rect x="-22" y="-14" width="44" height="34" rx="6" fill={C.teal} />
  </g>
);

export const ChocolatePairArt: React.FC<{
  kind: "milk" | "truffle";
  x: number;
  y: number;
}> = ({ kind, x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="74" rx="108" ry="18" fill="#E2E8F0" />
    {kind === "milk" ? (
      <g transform="translate(0 12)">
        <rect
          x="-58"
          y="-46"
          width="116"
          height="92"
          rx="12"
          fill="#7C543E"
          stroke="#4E342E"
          strokeWidth="4"
        />
        <rect x="-42" y="-30" width="34" height="26" rx="4" fill="#966A52" />
        <rect x="8" y="-30" width="34" height="26" rx="4" fill="#966A52" />
        <rect x="-42" y="6" width="34" height="26" rx="4" fill="#966A52" />
        <rect x="8" y="6" width="34" height="26" rx="4" fill="#966A52" />
      </g>
    ) : (
      <g transform="translate(0 -4)">
        <path
          d="M-76 18 L-58 66 H58 L76 18 Z"
          fill={C.yellow}
          stroke={C.navy}
          strokeWidth="3.5"
        />
        <circle cx="0" cy="-6" r="64" fill="#3E2723" />
        <path
          d="M-38 -24 Q-10 -50 28 -32"
          fill="none"
          stroke="#6D4C41"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
    )}
  </g>
);

export const CheckBadge: React.FC<{
  x: number;
  y: number;
  fill?: string;
  opacity?: number;
  scale?: number;
}> = ({ x, y, fill = C.teal, opacity = 1, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <circle cx="0" cy="0" r="19" fill={fill} />
    <path
      d="M-8 0 L-2 7 L9 -7"
      fill="none"
      stroke={C.navy}
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const DeliveryTile: React.FC<{ label: string; bg: string; fg: string }> = ({
  label,
  bg,
  fg,
}) => (
  <g>
    <rect x="-86" y="-27" width="172" height="54" rx="14" fill={bg} />
    <text
      x="0"
      y="9"
      textAnchor="middle"
      fill={fg}
      fontFamily={font}
      fontSize="28"
      fontWeight={750}
    >
      {label}
    </text>
  </g>
);

const CheckoutBase: React.FC<{
  chargerChecked?: number;
  priceHighlight?: number;
  readyEmphasize?: number;
  showDeliveryFee?: number;
  deliverySlideOffset?: number;
  deliveryFlash?: number;
  offerOpacity?: number;
  offerDropOffset?: number;
  cutoffDraw?: number;
  gapPulse?: number;
  fillRatio?: number;
  overshootRatio?: number;
  showOrganizerRow?: number;
  feeWaivedProgress?: number;
  localFrame: number;
  sceneDuration: number;
  feeTileStart?: number;
}> = ({
  chargerChecked = 0,
  priceHighlight = 0,
  readyEmphasize = 0,
  showDeliveryFee = 0,
  deliverySlideOffset = 0,
  deliveryFlash = 0,
  offerOpacity = 0,
  offerDropOffset = 0,
  cutoffDraw = 1,
  gapPulse = 0,
  fillRatio = freeShippingOrder.beforeSubtotal / freeShippingExample.threshold,
  overshootRatio = 0,
  showOrganizerRow = 0,
  feeWaivedProgress = 0,
  localFrame,
  sceneDuration,
  feeTileStart,
}) => {
  const barX = 852;
  const barW = 710;
  const filledW = barW * Math.min(1, Math.max(0, fillRatio));
  const overshootW = barW * Math.max(0, overshootRatio);
  const gapStartX = barX + filledW;
  const gapW = Math.max(0, barX + barW - gapStartX);
  const deliveryRowY = showOrganizerRow > 0 ? 604 : 520;
  const readyPushDown = showDeliveryFee * 12;
  const readyScale =
    1 + 0.045 * Math.sin(Math.PI * Math.min(1, Math.max(0, readyEmphasize)));
  const rowShift = 128 * offerOpacity;

  return (
    <g>
      <rect
        x="756"
        y="148"
        width="1028"
        height="764"
        rx="28"
        fill={C.white}
      />
      <text
        x="824"
        y="220"
        fill={C.navy}
        fontFamily={font}
        fontSize="40"
        fontWeight={750}
      >
        Order preview
      </text>
      <line
        x1="824"
        y1="252"
        x2="1716"
        y2="252"
        stroke="#DCE5EE"
        strokeWidth="3"
      />

      {/* Conditional free-shipping banner + proportional merchandise track */}
      {offerOpacity > 0 && (
        <g
          opacity={offerOpacity}
          transform={`translate(0 ${offerDropOffset})`}
        >
          <rect
            x="824"
            y="272"
            width="892"
            height="122"
            rx="16"
            fill="#FFF7DF"
            stroke={C.yellow}
            strokeWidth="3.5"
          />
          <text
            x={barX}
            y="314"
            fill={C.navy}
            fontFamily={font}
            fontSize="29"
            fontWeight={750}
          >
            Free shipping when eligible
          </text>
          <rect
            x={barX}
            y="340"
            width={barW}
            height="26"
            rx="13"
            fill="#E2E8F0"
          />
          <rect
            x={barX}
            y="340"
            width={filledW}
            height="26"
            rx="13"
            fill={overshootW > 0 ? C.teal : C.yellow}
          />
          {gapPulse > 0 && gapW > 4 && overshootW <= 0 && (
            <rect
              x={gapStartX}
              y="340"
              width={gapW}
              height="26"
              rx="6"
              fill={C.yellow}
              opacity={gapPulse * 0.45}
            />
          )}
          {overshootW > 0 && (
            <rect
              x={barX + barW}
              y="340"
              width={overshootW}
              height="26"
              rx="8"
              fill={C.yellow}
              stroke={C.navy}
              strokeWidth="2.5"
            />
          )}
          <line
            x1={barX + barW}
            y1="326"
            x2={barX + barW}
            y2={326 + 54 * clamp01(cutoffDraw)}
            stroke={C.navy}
            strokeWidth="4.5"
            strokeDasharray="6 5"
          />
          <text
            x={barX + barW + 14}
            y="314"
            textAnchor="start"
            fill={C.navy}
            fontFamily={font}
            fontSize="22"
            fontWeight={750}
            opacity={clamp01(cutoffDraw * 1.4)}
          >
            Minimum
          </text>
        </g>
      )}

      {/* Required Charger row */}
      <g transform={`translate(0 ${rowShift})`}>
        <rect
          x="824"
          y="286"
          width="892"
          height="98"
          rx="16"
          fill="#EEF3F7"
        />
        <WallChargerArt x={886} y={335} scale={0.34} />
        <text
          x="954"
          y="347"
          fill={C.navy}
          fontFamily={font}
          fontSize="36"
          fontWeight={700}
        >
          Charger
        </text>
        <rect
          x="1552"
          y="322"
          width="120"
          height="24"
          rx="12"
          fill={priceHighlight > 0.35 ? C.teal : "#CBD5E1"}
        />
        <CheckBadge
          x={1492}
          y={334}
          opacity={clamp01(chargerChecked * 2)}
          scale={0.4 + 0.6 * chargerChecked}
        />
      </g>

      {/* Optional Cable Organizer row */}
      {showOrganizerRow > 0 && (
        <g
          opacity={clamp01(showOrganizerRow * 1.4)}
          transform={`translate(${48 * (1 - showOrganizerRow)} 0)`}
        >
          <rect
            x="824"
            y="520"
            width="892"
            height="72"
            rx="14"
            fill="#E6F7F6"
            stroke={C.teal}
            strokeWidth="2.5"
          />
          <CableOrganizerArt x={886} y={556} scale={0.28} />
          <text
            x="954"
            y="567"
            fill={C.navy}
            fontFamily={font}
            fontSize="31"
            fontWeight={700}
          >
            Cable organizer
          </text>
          <rect
            x="1552"
            y="545"
            width="120"
            height="22"
            rx="11"
            fill={C.yellow}
          />
        </g>
      )}

      {/* Delivery fee row */}
      {showDeliveryFee > 0 && (
        <g
          opacity={clamp01(showDeliveryFee * 1.6)}
          transform={`translate(${deliverySlideOffset} ${16 * (1 - showDeliveryFee)})`}
        >
          <rect
            x="824"
            y={deliveryRowY}
            width="892"
            height="86"
            rx="16"
            fill={feeWaivedProgress > 0.5 ? "#E6F7F6" : "#FFF0F0"}
            stroke={feeWaivedProgress > 0.5 ? C.teal : C.red}
            strokeWidth={3 + 3 * deliveryFlash}
          />
          {feeTileStart !== undefined ? (
            <>
              <TextMorph
                from={0}
                until={sceneDuration}
                changeAt={feeTileStart + 8}
                frame={localFrame}
                x={854}
                y={deliveryRowY + 55}
                size={34}
                color={C.navy}
                before="Delivery fee"
                after="Free delivery"
              />
              <FlipCard
                x={1606}
                y={deliveryRowY + 43}
                from={feeTileStart}
                until={sceneDuration}
                frame={localFrame}
                frontContent={
                  <DeliveryTile label="Paid" bg={C.red} fg={C.navy} />
                }
                backContent={
                  <DeliveryTile label="Free" bg={C.teal} fg={C.navy} />
                }
              />
            </>
          ) : (
            <>
              <text
                x="854"
                y={deliveryRowY + 55}
                fill={C.red}
                fontFamily={font}
                fontSize="34"
                fontWeight={750}
              >
                Delivery fee
              </text>
              <g transform={`translate(1606 ${deliveryRowY + 43})`}>
                <DeliveryTile label="Paid" bg={C.red} fg={C.navy} />
              </g>
            </>
          )}
        </g>
      )}

      {/* Unsubmitted Ready to pay button */}
      <g
        transform={`translate(1270 ${804 + readyPushDown}) scale(${readyScale}) translate(-1270 -804)`}
      >
        <rect
          x="824"
          y="756"
          width="892"
          height="96"
          rx="16"
          fill={C.navy}
          stroke={readyEmphasize > 0.15 ? C.teal : "none"}
          strokeWidth={4}
        />
        <text
          x="1270"
          y="817"
          textAnchor="middle"
          fill={C.white}
          fontFamily={font}
          fontSize="34"
          fontWeight={750}
        >
          Ready to pay →
        </text>
      </g>
    </g>
  );
};

const PaidVsFreePreview: React.FC<{
  mode: "paid" | "free";
  x: number;
  y: number;
  revealStack: number;
  extraProductFocus?: number;
  opacity?: number;
}> = ({
  mode,
  x,
  y,
  revealStack,
  extraProductFocus = 0,
  opacity = 1,
}) => {
  const isFree = mode === "free";
  const maxBarH = 270;
  const unit = maxBarH / freeShippingOrder.after;
  const chargerH = freeShippingOrder.beforeSubtotal * unit * revealStack;
  const deliveryH = freeShippingOrder.beforeShipping * unit * revealStack;
  const organizerH = freeShippingExample.addOn * unit * revealStack;
  const baseBottom = 696;

  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <rect width="800" height="760" rx="28" fill={C.white} />
      <rect
        x="48"
        y="42"
        width="280"
        height="58"
        rx="14"
        fill={isFree ? C.teal : C.red}
      />
      <text
        x="188"
        y="81"
        textAnchor="middle"
        fill={C.navy}
        fontFamily={font}
        fontSize="32"
        fontWeight={750}
      >
        {isFree ? "Free delivery" : "Paid delivery"}
      </text>

      {/* Product silhouettes */}
      <g transform="translate(0 265)">
        <WallChargerArt
          x={isFree ? 148 : 230}
          y={0}
          scale={isFree ? 0.68 : 0.84}
        />
        {isFree && (
          <g
            transform={`translate(336 18) scale(${0.72 + 0.16 * extraProductFocus})`}
          >
            {extraProductFocus > 0.15 && (
              <circle
                cx="0"
                cy="0"
                r="142"
                fill="none"
                stroke={C.teal}
                strokeWidth="5"
                {...drawStroke(extraProductFocus)}
              />
            )}
            <CableOrganizerArt x={0} y={0} scale={1} />
          </g>
        )}
      </g>
      <text
        x="230"
        y="430"
        textAnchor="middle"
        fill={C.navy}
        fontFamily={font}
        fontSize="30"
        fontWeight={700}
      >
        {isFree ? "Charger + Organizer" : "Charger only"}
      </text>

      {/* Proportional derived order stack (numeric totals suppressed until later reveal) */}
      <g>
        <rect
          x="508"
          y={baseBottom - chargerH}
          width="196"
          height={chargerH}
          rx="10"
          fill={C.navy}
        />
        {revealStack > 0.4 && (
          <text
            x="606"
            y={baseBottom - chargerH / 2 + 10}
            textAnchor="middle"
            fill={C.white}
            fontFamily={font}
            fontSize="26"
            fontWeight={700}
            opacity={clamp01((revealStack - 0.4) * 2)}
          >
            Charger
          </text>
        )}
        {!isFree ? (
          <g>
            <rect
              x="508"
              y={baseBottom - chargerH - deliveryH - 6}
              width="196"
              height={deliveryH}
              rx="8"
              fill={C.red}
            />
            {revealStack > 0.6 && (
              <text
                x="606"
                y={baseBottom - chargerH - deliveryH - 18}
                textAnchor="middle"
                fill={C.red}
                fontFamily={font}
                fontSize="24"
                fontWeight={750}
                opacity={clamp01((revealStack - 0.6) * 2.5)}
              >
                Delivery fee
              </text>
            )}
          </g>
        ) : (
          <g>
            <rect
              x="508"
              y={baseBottom - chargerH - organizerH - 6}
              width="196"
              height={organizerH}
              rx="10"
              fill={C.yellow}
            />
            {revealStack > 0.6 && (
              <text
                x="606"
                y={baseBottom - chargerH - organizerH / 2 + 4}
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="24"
                fontWeight={750}
                opacity={clamp01((revealStack - 0.6) * 2.5)}
              >
                Organizer
              </text>
            )}
          </g>
        )}
        <line
          x1="472"
          y1={baseBottom + 8}
          x2="740"
          y2={baseBottom + 8}
          stroke="#CBD5E1"
          strokeWidth="4"
        />
      </g>
    </g>
  );
};

const GapQuestionCard: React.FC<{
  candidateIndex: number;
  slotProgress: number;
  frame: number;
  duration: number;
  showHeadline: boolean;
}> = ({ candidateIndex, slotProgress, frame, duration, showHeadline }) => {
  const slideOffset = 32 * (1 - clamp01(slotProgress * 1.4));
  const plusPulse = 1 + 0.08 * Math.sin(frame * 0.25);
  return (
    <g>
      <rect
        x="380"
        y="210"
        width="1160"
        height="660"
        rx="28"
        fill={C.white}
      />
      {showHeadline && (
        <KineticHeadline
          from={0}
          until={duration}
          frame={frame}
          x={440}
          y={272}
          width={1040}
          size={64}
          text="What fills the gap?"
          textAlign="center"
          color={C.navy}
          emphasis="What"
          emphasisColor={C.yellow}
          motion="pop"
        />
      )}
      <g transform="translate(650 565)">
        <rect
          x="-150"
          y="-145"
          width="300"
          height="290"
          rx="22"
          fill="#EEF3F7"
        />
        <WallChargerArt x={0} y={-20} scale={0.85} />
        <text
          x="0"
          y="112"
          textAnchor="middle"
          fill={C.navy}
          fontFamily={font}
          fontSize="28"
          fontWeight={700}
        >
          Charger
        </text>
      </g>
      <text
        x="945"
        y="578"
        textAnchor="middle"
        fill={C.navy}
        fontFamily={font}
        fontSize="56"
        fontWeight={750}
        transform={`translate(945 562) scale(${plusPulse}) translate(-945 -562)`}
      >
        +
      </text>
      <g transform="translate(1240 565)">
        <rect
          x="-165"
          y="-145"
          width="330"
          height="290"
          rx="22"
          fill="#FFF8E2"
          stroke={C.yellow}
          strokeWidth="5"
          strokeDasharray="14 10"
        />
        <g transform={`translate(0 ${slideOffset})`}>
          {candidateIndex === 0 && (
            <>
              <CableOrganizerArt x={0} y={-14} scale={0.95} />
              <text
                x="0"
                y="112"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="28"
                fontWeight={700}
              >
                Cable organizer
              </text>
            </>
          )}
          {candidateIndex === 1 && (
            <>
              <HouseholdStapleOutline x={0} y={-12} />
              <text
                x="0"
                y="112"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="28"
                fontWeight={700}
              >
                Household item
              </text>
            </>
          )}
          {candidateIndex === 2 && (
            <>
              <text
                x="0"
                y="16"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="110"
                fontWeight={800}
              >
                ?
              </text>
              <text
                x="0"
                y="112"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="28"
                fontWeight={700}
              >
                Worth adding?
              </text>
            </>
          )}
        </g>
      </g>
    </g>
  );
};

export const OpeningScene: React.FC<{ index: number; duration: number }> = ({
  index,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = freeShippingOpeningTimeline.scenes[index];
  const absoluteFrame = frame + scene.from;

  const ev = (id: string) =>
    freeShippingOpeningTimeline.events.find((item) => item.id === id)!;
  const action = (id: string) => {
    const item = ev(id);
    return clampEase(absoluteFrame - item.from, item.durationInFrames);
  };
  const actionSpring = (id: string, damping = 13, stiffness = 180) => {
    const item = ev(id);
    return spring({
      frame: Math.max(0, absoluteFrame - item.from),
      fps,
      config: { damping, stiffness, mass: 0.72 },
    });
  };
  const localFrom = (id: string) => Math.max(0, ev(id).from - scene.from);

  // Scene 1 split: 0..84 A-roll Sam, then slide-push into B-roll checkout
  if (index === 0) {
    const aRollCardPop = springPop(frame, fps, 2, 13, 175);
    const orbitDraw = clampEase(frame - 6, 36);
    const floatY = Math.sin(frame * 0.085) * 6;
    const tilt = Math.sin(frame * 0.07) * 2.2;

    const aRollView = (
      <g>
        <SvgBackdrop driftFrame={absoluteFrame} />
        <TalkingStickmanPresenter
          identity="Sam"
          x={390}
          y={940}
          scale={2.15}
          localFrame={frame}
          absoluteFrame={absoluteFrame}
          fromPose="standing"
          pose="explaining"
          expression="confident"
          actionFrom={4}
          blendFrames={22}
        />
        {/* Harmonious free-space graphic: replacement charger card */}
        <g transform={`translate(1260 540) translate(0 ${floatY})`}>
          <circle
            cx="0"
            cy="0"
            r="418"
            fill="none"
            stroke={C.teal}
            strokeWidth="3.5"
            strokeDasharray="14 10"
            opacity="0.55"
            transform={`rotate(${frame * 0.35})`}
          />
          <circle
            cx="0"
            cy="0"
            r="398"
            fill="none"
            stroke={C.yellow}
            strokeWidth="4"
            opacity="0.7"
            {...drawStroke(orbitDraw)}
          />
          <g transform={`scale(${aRollCardPop})`}>
            <rect
              x="-320"
              y="-220"
              width="640"
              height="440"
              rx="30"
              fill={C.white}
            />
            <rect
              x="-280"
              y="-182"
              width="206"
              height="46"
              rx="23"
              fill="#E6F7F6"
            />
            <text
              x="-177"
              y="-151"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="24"
              fontWeight={750}
            >
              Needed item
            </text>
            <g transform={`translate(0 -12) rotate(${tilt})`}>
              <WallChargerArt x={0} y={0} scale={1.34} />
            </g>
            <text
              x="0"
              y="176"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="42"
              fontWeight={750}
            >
              Replacement charger
            </text>
          </g>
        </g>
      </g>
    );

    const bLocal = Math.max(0, frame - A_ROLL_FIRST_SEGMENT_FRAMES);
    const ringProgress = clampEase(bLocal - 4, 24);
    const checkP = action("check-price");
    const checkSpring = actionSpring("check-price", 11, 210);
    const readyP = action("ready-pay");
    const checkMove = clampEase(absoluteFrame - (ev("check-price").from - 18), 18);
    const readyMove = clampEase(absoluteFrame - (ev("ready-pay").from - 16), 16);
    const cursorX =
      absoluteFrame < ev("ready-pay").from - 16
        ? interpolate(checkMove, [0, 1], [1690, 1585])
        : interpolate(readyMove, [0, 1], [1585, 1340]);
    const cursorY =
      absoluteFrame < ev("ready-pay").from - 16
        ? interpolate(checkMove, [0, 1], [620, 352])
        : interpolate(readyMove, [0, 1], [352, 815]);
    const clickRipple = clampEase(absoluteFrame - ev("check-price").from, 18);

    const bRollView = (
      <g>
        <SvgBackdrop driftFrame={absoluteFrame} />
        <rect
          x="136"
          y="148"
          width="560"
          height="764"
          rx="28"
          fill="#EEF3F7"
        />
        <circle
          cx="416"
          cy="470"
          r="210"
          fill="none"
          stroke={C.teal}
          strokeWidth="5"
          {...drawStroke(ringProgress)}
        />
        <WallChargerArt x={416} y={470} scale={1.38} />
        <text
          x="416"
          y="768"
          textAnchor="middle"
          fill={C.navy}
          fontFamily={font}
          fontSize="40"
          fontWeight={750}
        >
          Replacement charger
        </text>
        <CheckoutBase
          chargerChecked={checkSpring}
          priceHighlight={checkP}
          readyEmphasize={readyP}
          localFrame={frame}
          sceneDuration={duration}
        />
        <Cursor
          x={cursorX}
          y={cursorY}
          press={checkP}
          ripple={clickRipple}
          rippleColor={C.teal}
          opacity={clampEase(bLocal - 6, 12)}
        />
      </g>
    );

    return (
      <AbsoluteFill style={{ fontFamily: font }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          aria-label={`Free shipping opening scene 1: ${scene.title}`}
        >
          <Transition
            id="slide-push"
            start={74}
            end={92}
            frame={frame}
            before={aRollView}
            after={bRollView}
          />
        </svg>
      </AbsoluteFill>
    );
  }

  // Scene 2: Delivery charge appears with zoom-in focus, slam-in row, and cursor recoil
  if (index === 1) {
    const feeSpring = actionSpring("fee-row", 12, 220);
    const feeP = action("fee-row");
    const camScale = 1 + 0.055 * clampEase(frame, 30);
    const flash = feeP > 0 && feeP < 1 ? Math.sin(Math.PI * feeP) : 0;
    const cursorX = interpolate(feeP, [0, 1], [1340, 1210]);
    const cursorY = interpolate(feeP, [0, 1], [815, 892]);

    return (
      <AbsoluteFill style={{ fontFamily: font }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          aria-label={`Free shipping opening scene 2: ${scene.title}`}
        >
          <SvgBackdrop driftFrame={absoluteFrame} />
          <g
            transform={`translate(1160 540) scale(${camScale}) translate(-1160 -540)`}
          >
            <rect
              x="136"
              y="148"
              width="560"
              height="764"
              rx="28"
              fill="#EEF3F7"
              opacity={1 - 0.16 * feeP}
            />
            <g opacity={1 - 0.16 * feeP}>
              <WallChargerArt x={416} y={470} scale={1.38} />
              <text
                x="416"
                y="768"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="40"
                fontWeight={750}
              >
                Replacement charger
              </text>
            </g>
            <CheckoutBase
              chargerChecked={1}
              priceHighlight={1}
              showDeliveryFee={feeP}
              deliverySlideOffset={280 * (1 - feeSpring)}
              deliveryFlash={flash}
              localFrame={frame}
              sceneDuration={duration}
            />
            <ObjectAttachedLabel
              from={localFrom("fee-row") + 4}
              until={duration}
              frame={frame}
              x={1408}
              y={474}
              size={30}
              color={C.red}
              text="+ Extra charge"
              object={{ x: 1120, y: 525 }}
              line
            />
            <Cursor x={cursorX} y={cursorY} opacity={0.92} />
          </g>
        </svg>
      </AbsoluteFill>
    );
  }

  // Scene 3: Threshold offer banner drops in, bar fills to 42/50, unmet gap pulses
  if (index === 2) {
    const offerSpring = springPop(frame, fps, 4, 13, 165);
    const barFill = action("eligibility-bar");
    const camReset = 1.055 - 0.055 * clampEase(frame, 14);
    const pulse =
      barFill > 0.85 ? 0.5 + 0.5 * Math.sin((frame - 45) * 0.25) : 0;

    return (
      <AbsoluteFill style={{ fontFamily: font }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          aria-label={`Free shipping opening scene 3: ${scene.title}`}
        >
          <SvgBackdrop driftFrame={absoluteFrame} />
          <g
            transform={`translate(1160 540) scale(${camReset}) translate(-1160 -540)`}
          >
            <rect
              x="136"
              y="148"
              width="560"
              height="764"
              rx="28"
              fill="#EEF3F7"
            />
            <WallChargerArt x={416} y={470} scale={1.38} />
            <text
              x="416"
              y="768"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="40"
              fontWeight={750}
            >
              Replacement charger
            </text>
            <CheckoutBase
              chargerChecked={1}
              priceHighlight={1}
              showDeliveryFee={1}
              offerOpacity={clamp01(offerSpring)}
              offerDropOffset={-28 * (1 - offerSpring)}
              cutoffDraw={clampEase(frame - 16, 20)}
              gapPulse={pulse}
              fillRatio={
                (freeShippingOrder.beforeSubtotal /
                  freeShippingExample.threshold) *
                barFill
              }
              localFrame={frame}
              sceneDuration={duration}
            />
            <ObjectAttachedLabel
              from={localFrom("eligibility-bar") + 8}
              until={duration}
              frame={frame}
              x={1402}
              y={312}
              size={25}
              color={C.navy}
              text="Spend a little more"
              anchor="middle"
              object={{ x: 1502, y: 344 }}
              line
            />
          </g>
        </svg>
      </AbsoluteFill>
    );
  }

  // Scene 4: Browse organizer, cursor click + parabolic object arc to cart, bar overshoots, FlipCard flips Paid -> Free
  if (index === 3) {
    const browseSpring = actionSpring("browse-organizer", 13, 175);
    const browseP = action("browse-organizer");
    const addP = action("add-to-cart");
    const clickFrame = absoluteFrame - ev("add-to-cart").from;
    const cursorApproach = clampEase(
      absoluteFrame - (ev("add-to-cart").from - 24),
      24,
    );
    const cursorX = interpolate(cursorApproach, [0, 1], [680, 445]);
    const cursorY = interpolate(cursorApproach, [0, 1], [780, 745]);
    const flyT = clampEase(clickFrame, 24);
    const flyVisible = clickFrame >= 0 && flyT < 1;
    const flyX = interpolate(flyT, [0, 1], [416, 886]);
    const flyY =
      interpolate(flyT, [0, 1], [435, 556]) - Math.sin(Math.PI * flyT) * 160;
    const buttonSquash =
      clickFrame >= 0 && clickFrame <= 12
        ? 1 - 0.08 * Math.sin((Math.PI * clickFrame) / 12)
        : 1;
    const feeWaiveP = action("fee-waived");
    const waiveRing = clampEase(absoluteFrame - ev("fee-waived").from, 24);

    return (
      <AbsoluteFill style={{ fontFamily: font }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          aria-label={`Free shipping opening scene 4: ${scene.title}`}
        >
          <SvgBackdrop driftFrame={absoluteFrame} />
          <rect
            x="136"
            y="148"
            width="560"
            height="764"
            rx="28"
            fill="#EEF3F7"
          />
          <g opacity={1 - browseP}>
            <WallChargerArt x={416} y={470} scale={1.38} />
            <text
              x="416"
              y="768"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="40"
              fontWeight={750}
            >
              Replacement charger
            </text>
          </g>
          {/* Docked charger badge in top-left corner while browsing */}
          {browseP > 0.1 && (
            <g opacity={browseP} transform="translate(226 220)">
              <rect
                x="-62"
                y="-42"
                width="196"
                height="72"
                rx="14"
                fill={C.white}
                stroke={C.teal}
                strokeWidth="2.5"
              />
              <WallChargerArt x={-20} y={-6} scale={0.25} />
              <text
                x="56"
                y="2"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="22"
                fontWeight={750}
              >
                In cart ✓
              </text>
            </g>
          )}
          <g
            opacity={browseP}
            transform={`translate(0 ${38 * (1 - browseSpring)})`}
          >
            <CableOrganizerArt
              x={416}
              y={455}
              scale={1.42 * (0.85 + 0.15 * browseSpring)}
            />
            <text
              x="416"
              y="632"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="40"
              fontWeight={750}
            >
              Cable organizer
            </text>
            <g
              transform={`translate(416 747) scale(${buttonSquash}) translate(-416 -747)`}
            >
              <rect
                x="216"
                y="704"
                width="400"
                height="86"
                rx="16"
                fill={C.yellow}
              />
              <text
                x="416"
                y="760"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="34"
                fontWeight={750}
              >
                + Add organizer
              </text>
            </g>
          </g>
          <CheckoutBase
            chargerChecked={1}
            priceHighlight={1}
            showDeliveryFee={1}
            offerOpacity={1}
            fillRatio={
              (freeShippingOrder.beforeSubtotal +
                freeShippingExample.addOn * addP) /
              freeShippingExample.threshold
            }
            overshootRatio={
              (freeShippingOrder.overshoot / freeShippingExample.threshold) *
              clampEase(clickFrame - 12, 18)
            }
            showOrganizerRow={addP}
            feeWaivedProgress={feeWaiveP}
            feeTileStart={localFrom("fee-waived") - 8}
            localFrame={frame}
            sceneDuration={duration}
          />
          {/* Curved dotted guide trail + flying organizer token into cart */}
          {flyVisible && (
            <>
              <path
                d="M416 435 Q650 250 886 556"
                fill="none"
                stroke={C.yellow}
                strokeWidth="5"
                strokeDasharray="10 8"
                opacity={1 - flyT * 0.6}
              />
              <g
                transform={`translate(${flyX} ${flyY}) scale(${interpolate(flyT, [0, 1], [0.85, 0.28])})`}
              >
                <CableOrganizerArt x={0} y={0} scale={1} />
              </g>
            </>
          )}
          {/* Teal burst ring when delivery flips to Free */}
          {waiveRing > 0 && waiveRing < 1 && (
            <circle
              cx="1606"
              cy="647"
              r={46 + 74 * waiveRing}
              fill="none"
              stroke={C.teal}
              strokeWidth="6"
              opacity={(1 - waiveRing) * 0.85}
            />
          )}
          <Cursor
            x={cursorX}
            y={cursorY}
            press={clampEase(clickFrame, 12)}
            ripple={clampEase(clickFrame, 20)}
            rippleColor={C.yellow}
            opacity={browseP}
          />
        </svg>
      </AbsoluteFill>
    );
  }

  // Scene 5: Split-open comparison, bars grow upward, dashed level comparison line draws across, organizer link draws
  if (index === 4) {
    const split = clampEase(frame, 18);
    const leftX = interpolate(split, [0, 1], [560, 128]);
    const rightX = interpolate(split, [0, 1], [560, 992]);
    const stackGrow = clampEase(frame - 10, 30);
    const higherP = action("higher-total");
    const extraP = action("extra-product");
    const maxBarH = 270;
    const unit = maxBarH / freeShippingOrder.after;
    const paidTopLocalY =
      696 -
      freeShippingOrder.beforeSubtotal * unit -
      freeShippingOrder.beforeShipping * unit -
      6;
    const levelY = 168 + paidTopLocalY;

    return (
      <AbsoluteFill style={{ fontFamily: font }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          aria-label={`Free shipping opening scene 5: ${scene.title}`}
        >
          <SvgBackdrop driftFrame={absoluteFrame} />
          <PaidVsFreePreview
            mode="free"
            x={rightX}
            y={168}
            revealStack={stackGrow}
            extraProductFocus={extraP}
            opacity={clamp01(split * 1.4)}
          />
          <PaidVsFreePreview
            mode="paid"
            x={leftX}
            y={168}
            revealStack={stackGrow}
          />
          {/* Horizontal dashed baseline comparison from paid stack top across to free stack */}
          {higherP > 0 && (
            <path
              d={`M832 ${levelY} H1700`}
              fill="none"
              stroke={C.navy}
              strokeWidth="4"
              strokeDasharray="10 8"
              pathLength={1}
              strokeDashoffset={1 - higherP}
              opacity={0.75}
            />
          )}
          <ObjectAttachedLabel
            from={localFrom("higher-total")}
            until={duration}
            frame={frame}
            x={1598}
            y={496}
            size={30}
            color={C.navy}
            text="Higher order total"
            object={{ x: 1598, y: 582 }}
            anchor="middle"
            line
          />
          {/* Connector from Organizer block to Organizer object on Extra product beat */}
          {extraP > 0 && (
            <path
              d="M1500 618 Q1425 560 1330 485"
              fill="none"
              stroke={C.teal}
              strokeWidth="5"
              {...drawStroke(extraP)}
            />
          )}
          <ObjectAttachedLabel
            from={localFrom("extra-product")}
            until={duration}
            frame={frame}
            x={1328}
            y={326}
            size={28}
            color={C.navy}
            text="+ Extra product"
            object={{ x: 1328, y: 405 }}
            anchor="middle"
            line
          />
        </svg>
      </AbsoluteFill>
    );
  }

  // Scene 6: A-roll Alex presenter (0..144 frames = 4.8s) -> wipe -> B-roll branching diagram (144..348)
  if (index === 5) {
    const aRollCard1 = springPop(frame, fps, 2, 13, 175);
    const aRollConn1 = clampEase(frame - 32, 18);
    const aRollCard2 = springPop(frame, fps, 44, 13, 175);
    const aRollConn2 = clampEase(frame - 68, 20);
    const aRollCard3 = springPop(frame, fps, 80, 12, 180);

    const aRoll6 = (
      <g>
        <SvgBackdrop driftFrame={absoluteFrame} />
        <TalkingStickmanPresenter
          identity="Alex"
          x={390}
          y={940}
          scale={2.15}
          localFrame={frame}
          absoluteFrame={absoluteFrame}
          fromPose="pointing"
          pose="explaining"
          expression="curious"
          actionFrom={12}
          blendFrames={24}
        />
        {/* Free-space causal chain synced with Alex */}
        <g transform="translate(860 198)">
          <g
            transform={`translate(420 73) scale(${aRollCard1}) translate(-420 -73)`}
          >
            <rect width="840" height="146" rx="22" fill={C.white} />
            <WallChargerArt x={108} y={73} scale={0.44} />
            <text
              x="204"
              y="88"
              fill={C.navy}
              fontFamily={font}
              fontSize="38"
              fontWeight={750}
            >
              Charger found
            </text>
            <CheckBadge x={748} y={73} />
          </g>

          <path
            d="M420 146 V226"
            fill="none"
            stroke={C.yellow}
            strokeWidth="6"
            strokeLinecap="round"
            {...drawStroke(aRollConn1)}
          />

          <g
            transform={`translate(420 296) scale(${aRollCard2}) translate(-420 -70)`}
            opacity={clamp01(aRollCard2 * 2)}
          >
            <rect
              width="840"
              height="148"
              rx="22"
              fill="#FFF7DF"
              stroke={C.yellow}
              strokeWidth="4"
            />
            <text
              x="420"
              y="88"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="38"
              fontWeight={750}
            >
              Free-shipping condition
            </text>
          </g>

          <path
            d="M420 374 V456"
            fill="none"
            stroke={C.teal}
            strokeWidth="6"
            strokeLinecap="round"
            {...drawStroke(aRollConn2)}
          />
          {aRollConn2 > 0.7 && (
            <path
              d="M402 440 L420 462 L438 440"
              fill="none"
              stroke={C.teal}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={clamp01((aRollConn2 - 0.7) * 3)}
            />
          )}

          <g
            transform={`translate(420 554) scale(${aRollCard3}) translate(-420 -90)`}
            opacity={clamp01(aRollCard3 * 2)}
          >
            <rect
              width="840"
              height="182"
              rx="22"
              fill="#1D3048"
              stroke={C.teal}
              strokeWidth="4"
            />
            <CableOrganizerArt x={150} y={92} scale={0.56} />
            <text
              x="490"
              y="104"
              textAnchor="middle"
              fill={C.white}
              fontFamily={font}
              fontSize="40"
              fontWeight={750}
            >
              + Reason to buy more
            </text>
          </g>
        </g>
      </g>
    );

    const bLocal = Math.max(0, frame - A_ROLL_SECOND_SEGMENT_FRAMES);
    const topCardPop = springPop(bLocal, fps, 0, 14, 170);
    const branchDraw = clampEase(bLocal - 10, 26);
    const leftBranchScale = springPop(bLocal, fps, 22, 13, 165);
    const leftSpotlight =
      1 +
      0.03 *
        Math.sin(
          Math.PI * clampEase(bLocal - 70, 55),
        );
    const qualP = action("good-deal-qualifier");
    const qualSpring = actionSpring("good-deal-qualifier", 12, 190);

    const bRoll6 = (
      <g>
        <SvgBackdrop driftFrame={absoluteFrame} />
        <rect
          x="140"
          y="132"
          width="1640"
          height="816"
          rx="28"
          fill={C.white}
        />
        {/* Top premise bar */}
        <g transform={`translate(960 272) scale(${topCardPop}) translate(-960 -272)`}>
          <rect
            x="240"
            y="192"
            width="1440"
            height="150"
            rx="20"
            fill="#EEF3F7"
          />
          <WallChargerArt x={345} y={267} scale={0.48} />
          <text
            x="440"
            y="280"
            fill={C.navy}
            fontFamily={font}
            fontSize="38"
            fontWeight={750}
          >
            Charger found
          </text>
          <CheckBadge x={755} y={267} />
          <rect
            x="1040"
            y="224"
            width="580"
            height="86"
            rx="16"
            fill="#FFF7DF"
            stroke={C.yellow}
            strokeWidth="3.5"
          />
          <text
            x="1330"
            y="279"
            textAnchor="middle"
            fill={C.navy}
            fontFamily={font}
            fontSize="32"
            fontWeight={750}
          >
            Free-shipping condition
          </text>
        </g>

        {/* Animated branching connectors */}
        <path
          d="M960 342 V412 H584 V490"
          fill="none"
          stroke={C.navy}
          strokeWidth="5"
          strokeLinejoin="round"
          {...drawStroke(branchDraw)}
        />
        <path
          d="M960 342 V412 H1336 V490"
          fill="none"
          stroke={qualP > 0.2 ? C.teal : C.navy}
          strokeWidth="5"
          strokeLinejoin="round"
          {...drawStroke(branchDraw)}
        />

        {/* Left branch: Not every order is affected */}
        <g
          transform={`translate(584 676) scale(${leftBranchScale * leftSpotlight}) translate(-344 -186)`}
        >
          <rect
            width="688"
            height="372"
            rx="22"
            fill="#EEF3F7"
            stroke="#CBD5E1"
            strokeWidth="3"
          />
          <WallChargerArt x={344} y={145} scale={0.68} />
          <CheckBadge x={456} y={120} fill="#CBD5E1" />
          <text
            x="344"
            y="296"
            textAnchor="middle"
            fill={C.navy}
            fontFamily={font}
            fontSize="36"
            fontWeight={750}
          >
            Won&apos;t affect every order
          </text>
        </g>

        {/* Right branch: Qualifying can be a good deal */}
        <g
          transform={`translate(1336 676) scale(${0.92 + 0.08 * qualSpring}) translate(-344 -186)`}
        >
          <rect
            width="688"
            height="372"
            rx="22"
            fill="#E6F7F6"
            stroke={C.teal}
            strokeWidth={3 + 3 * qualP}
          />
          <WallChargerArt x={240} y={145} scale={0.6} />
          <text
            x="356"
            y="162"
            textAnchor="middle"
            fill={C.navy}
            fontFamily={font}
            fontSize="48"
            fontWeight={750}
          >
            +
          </text>
          <HouseholdStapleOutline x={448} y={148} />
          <CheckBadge
            x={556}
            y={120}
            opacity={clamp01(0.35 + 0.65 * qualP)}
            scale={0.7 + 0.3 * qualSpring}
          />
          <text
            x="344"
            y="296"
            textAnchor="middle"
            fill={C.navy}
            fontFamily={font}
            fontSize="36"
            fontWeight={750}
          >
            Qualifying can be a good deal
          </text>
        </g>
      </g>
    );

    return (
      <AbsoluteFill style={{ fontFamily: font }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          aria-label={`Free shipping opening scene 6: ${scene.title}`}
        >
          <Transition
            id="wipe"
            start={A_ROLL_SECOND_SEGMENT_FRAMES}
            end={A_ROLL_SECOND_SEGMENT_FRAMES + 14}
            frame={frame}
            before={aRoll6}
            after={bRoll6}
          />
        </svg>
      </AbsoluteFill>
    );
  }

  // Scene 7: Push-in to What fills the gap? cycling labeled candidate slots
  if (index === 6) {
    const gapP = action("gap-candidates");
    const candidateIndex = gapP < 0.42 ? 0 : gapP < 0.8 ? 1 : 2;
    const subProgress =
      candidateIndex === 0
        ? clamp01(gapP / 0.42)
        : candidateIndex === 1
          ? clamp01((gapP - 0.42) / 0.38)
          : clamp01((gapP - 0.8) / 0.2);

    return (
      <AbsoluteFill style={{ fontFamily: font }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          aria-label={`Free shipping opening scene 7: ${scene.title}`}
        >
          <SvgBackdrop driftFrame={absoluteFrame} />
          <Transition
            id="push-in"
            start={0}
            end={16}
            frame={frame}
            before={
              <GapQuestionCard
                candidateIndex={0}
                slotProgress={1}
                frame={frame}
                duration={duration}
                showHeadline={false}
              />
            }
            after={
              <GapQuestionCard
                candidateIndex={candidateIndex}
                slotProgress={subProgress}
                frame={frame}
                duration={duration}
                showHeadline
              />
            }
          />
        </svg>
      </AbsoluteFill>
    );
  }

  // Scene 8: Swinging FREE tag -> swap -> Zero vs Low price comparison with magnetic pull arrows & 2007 citation
  if (index === 7) {
    const tagSwing =
      Math.sin(frame * 0.24) * 26 * Math.exp(-frame * 0.045);
    const tagDrop = springPop(frame, fps, 0, 12, 160);
    const swapStart = 58;
    const swapEnd = 74;
    const bLocal = Math.max(0, frame - swapStart);
    const leftSlide = springPop(bLocal, fps, 4, 13, 165);
    const vsScale = springPop(bLocal, fps, 14, 11, 200);
    const zeroP = action("zero-headline");
    const zeroSpring = actionSpring("zero-headline", 11, 190);
    const arrowDraw = clampEase(absoluteFrame - (ev("zero-headline").from + 8), 26);

    const appealView = (
      <g>
        <SvgBackdrop driftFrame={absoluteFrame} />
        <g transform={`rotate(${tagSwing} 960 0)`}>
          <line
            x1="960"
            y1="0"
            x2="960"
            y2={360 * tagDrop}
            stroke="#CBD5E1"
            strokeWidth="5"
          />
          <circle cx="960" cy={360 * tagDrop} r="14" fill={C.navy} stroke={C.yellow} strokeWidth="5" />
          <g transform={`translate(960 ${480 * tagDrop})`}>
            <rect
              x="-240"
              y="-120"
              width="480"
              height="240"
              rx="32"
              fill={C.yellow}
            />
            <text
              x="0"
              y="38"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="118"
              fontWeight={800}
            >
              FREE
            </text>
          </g>
        </g>
      </g>
    );

    const researchLeadView = (
      <g>
        <SvgBackdrop driftFrame={absoluteFrame} />
        <g
          transform={`translate(${-80 * (1 - leftSlide)} 0)`}
          opacity={clamp01(leftSlide * 1.5)}
        >
          <rect
            x="280"
            y="340"
            width="480"
            height="250"
            rx="24"
            fill="#1D3048"
            stroke="#38506B"
            strokeWidth="3"
          />
          <text
            x="520"
            y="436"
            textAnchor="middle"
            fill={C.muted}
            fontFamily={font}
            fontSize="32"
            fontWeight={650}
          >
            Ordinary discount
          </text>
          <text
            x="520"
            y="516"
            textAnchor="middle"
            fill={C.white}
            fontFamily={font}
            fontSize="56"
            fontWeight={750}
          >
            Low price
          </text>
        </g>

        <text
          x="900"
          y="476"
          textAnchor="middle"
          fill={C.muted}
          fontFamily={font}
          fontSize="44"
          fontWeight={700}
          transform={`translate(900 462) scale(${vsScale}) translate(-900 -462)`}
        >
          vs.
        </text>

        <g
          transform={`translate(1330 460) scale(${0.86 + 0.14 * zeroSpring}) translate(-1330 -460)`}
          opacity={clamp01(0.25 + 0.75 * zeroP)}
        >
          <rect
            x="1030"
            y="320"
            width="600"
            height="290"
            rx="26"
            fill="#1D3048"
            stroke={C.yellow}
            strokeWidth={4 + 3 * Math.sin(Math.PI * zeroP)}
          />
          <KineticHeadline
            from={localFrom("zero-headline")}
            until={duration}
            frame={frame}
            x={1060}
            y={384}
            width={540}
            size={128}
            text="Free"
            textAlign="center"
            color={C.yellow}
            emphasis="Free"
            emphasisColor={C.yellow}
            motion="punch"
          />
        </g>

        {/* Attention arcs drawing toward Zero/Free */}
        {arrowDraw > 0 && (
          <>
            <path
              d="M1740 360 Q1680 390 1645 430"
              fill="none"
              stroke={C.yellow}
              strokeWidth="5"
              strokeLinecap="round"
              {...drawStroke(arrowDraw)}
            />
            <path
              d="M1644 408 L1643 432 L1667 429"
              fill="none"
              stroke={C.yellow}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={clamp01((arrowDraw - 0.7) * 3.3)}
            />
            <path
              d="M1740 560 Q1680 530 1645 490"
              fill="none"
              stroke={C.yellow}
              strokeWidth="5"
              strokeLinecap="round"
              {...drawStroke(arrowDraw)}
            />
            <path
              d="M1644 512 L1643 488 L1667 491"
              fill="none"
              stroke={C.yellow}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={clamp01((arrowDraw - 0.7) * 3.3)}
            />
          </>
        )}

        <text
          x="960"
          y="910"
          textAnchor="middle"
          fill="#CBD5E1"
          fontFamily={font}
          fontSize="30"
          fontWeight={600}
          opacity={clampEase(bLocal - 16, 20)}
        >
          Shampanier, Mazar and Ariely, 2007
        </text>
      </g>
    );

    return (
      <AbsoluteFill style={{ fontFamily: font }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          aria-label={`Free shipping opening scene 8: ${scene.title}`}
        >
          <Transition
            id="state-swap"
            start={swapStart}
            end={swapEnd}
            frame={frame}
            before={appealView}
            after={researchLeadView}
          />
        </svg>
      </AbsoluteFill>
    );
  }

  // Scene 9: 2007 chocolate choice experiment setup with card spring-ins, spotlight reveals, and Price gap bracket
  const boardSpring = springPop(frame, fps, 0, 14, 165);
  const leftCardPop = springPop(frame, fps, 28, 13, 170);
  const rightCardPop = springPop(frame, fps, 46, 13, 170);
  const isGallery = duration <= 120;
  const cheaperAt = isGallery ? 45 : localFrom("cheaper-chocolate");
  const expensiveAt = isGallery ? 75 : localFrom("expensive-chocolate");
  const cheaperP = clampEase(frame - cheaperAt, 22);
  const expensiveP = clampEase(frame - expensiveAt, 22);
  const leftSpot = 1 + 0.04 * Math.sin(Math.PI * cheaperP);
  const rightSpot = 1 + 0.04 * Math.sin(Math.PI * expensiveP);
  const bracketDraw = clampEase(frame - (expensiveAt + 10), 28);

  return (
    <AbsoluteFill style={{ fontFamily: font }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        aria-label={`Free shipping opening scene 9: ${scene.title}`}
      >
        <SvgBackdrop driftFrame={absoluteFrame} />
        <g
          transform={`translate(960 540) scale(${0.92 + 0.08 * boardSpring}) translate(-960 -540)`}
          opacity={clamp01(boardSpring * 2)}
        >
          <rect
            x="160"
            y="148"
            width="1600"
            height="714"
            rx="28"
            fill={C.white}
          />
          <KineticHeadline
            from={8}
            until={duration}
            frame={frame}
            x={260}
            y={184}
            width={1400}
            size={40}
            text="2007 chocolate choice experiment"
            textAlign="center"
            color={C.navy}
            emphasis="2007"
            emphasisColor={C.teal}
          />
          <line
            x1="460"
            y1="252"
            x2="1460"
            y2="252"
            stroke={C.teal}
            strokeWidth="4"
            {...drawStroke(clampEase(frame - 18, 28))}
          />

          {/* Left option: Cheaper chocolate */}
          <g
            transform={`translate(560 492) scale(${leftCardPop * leftSpot}) translate(0 ${44 * (1 - leftCardPop)})`}
            opacity={clamp01(leftCardPop * 1.6)}
          >
            <rect
              x="-280"
              y="-190"
              width="560"
              height="450"
              rx="22"
              fill="#EEF3F7"
              stroke={cheaperP > 0.2 ? C.yellow : "#CBD5E1"}
              strokeWidth={4 + 3 * cheaperP}
            />
            <ChocolatePairArt kind="milk" x={0} y={-24} />
            <text
              x="0"
              y="138"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="34"
              fontWeight={750}
            >
              Cheaper chocolate
            </text>
            <TextMorph
              from={0}
              until={duration}
              changeAt={cheaperAt}
              frame={frame}
              x={-84}
              y={204}
              size={34}
              color={C.navy}
              before="Option A"
              after="Low price"
            />
          </g>

          {/* Right option: More expensive chocolate */}
          <g
            transform={`translate(1360 492) scale(${rightCardPop * rightSpot}) translate(0 ${44 * (1 - rightCardPop)})`}
            opacity={clamp01(rightCardPop * 1.6)}
          >
            <rect
              x="-280"
              y="-190"
              width="560"
              height="450"
              rx="22"
              fill="#EEF3F7"
              stroke={expensiveP > 0.2 ? C.teal : "#CBD5E1"}
              strokeWidth={4 + 3 * expensiveP}
            />
            <ChocolatePairArt kind="truffle" x={0} y={-24} />
            <text
              x="0"
              y="138"
              textAnchor="middle"
              fill={C.navy}
              fontFamily={font}
              fontSize="34"
              fontWeight={750}
            >
              More expensive chocolate
            </text>
            <TextMorph
              from={0}
              until={duration}
              changeAt={expensiveAt}
              frame={frame}
              x={-106}
              y={204}
              size={34}
              color={C.navy}
              before="Option B"
              after="Higher price"
            />
          </g>

          {/* Price comparison connector drawn after both chocolates are introduced */}
          {bracketDraw > 0 && (
            <g opacity={bracketDraw}>
              <path
                d="M560 762 V796 H1360 V762"
                fill="none"
                stroke={C.navy}
                strokeWidth="4"
                strokeLinejoin="round"
                {...drawStroke(bracketDraw)}
              />
              <rect
                x="840"
                y="776"
                width="240"
                height="40"
                rx="12"
                fill={C.white}
              />
              <text
                x="960"
                y="805"
                textAnchor="middle"
                fill={C.navy}
                fontFamily={font}
                fontSize="26"
                fontWeight={750}
              >
                Choice set
              </text>
            </g>
          )}
        </g>

        <text
          x="960"
          y="956"
          textAnchor="middle"
          fill="#CBD5E1"
          fontFamily={font}
          fontSize="28"
          fontWeight={600}
          opacity={clampEase(frame - 60, 22)}
        >
          Shampanier, Mazar and Ariely, 2007
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const FreeShippingOpeningVisuals: React.FC = () => (
  <AbsoluteFill>
    {freeShippingOpeningTimeline.scenes.map((scene, index) => (
      <Sequence
        key={scene.id}
        name={scene.title}
        from={scene.from}
        durationInFrames={scene.durationInFrames}
      >
        <OpeningScene index={index} duration={scene.durationInFrames} />
      </Sequence>
    ))}
    {OPENING_CUTAWAYS.map((event) => (
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
  </AbsoluteFill>
);

export const FreeShippingOpening: React.FC = () => (
  <AbsoluteFill>
    <Audio src={staticFile("free-shipping-opening/narration.wav")} />
    <FreeShippingOpeningSound />
    <FreeShippingOpeningVisuals />
  </AbsoluteFill>
);

const GallerySlot: React.FC<{
  index: number;
  duration: number;
}> = ({ index, duration }) => <OpeningScene index={index} duration={duration} />;

export const FreeShippingCheckoutGallery: React.FC = () => (
  <AbsoluteFill>
    {[0, 2, 3, 4].map((sceneIndex, slot) => (
      <Sequence key={sceneIndex} from={slot * 90} durationInFrames={90}>
        <GallerySlot index={sceneIndex} duration={90} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const FreeShippingChocolateGallery: React.FC = () => (
  <AbsoluteFill>
    {[7, 8].map((sceneIndex, slot) => (
      <Sequence key={sceneIndex} from={slot * 120} durationInFrames={120}>
        <GallerySlot index={sceneIndex} duration={120} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
