import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Sam,
  Alex,
  characterColors as K,
} from "../characters/ReferenceCharacterRig";
import { bankState, type BankActor } from "./bankModel";
import { font } from "../design/tokens";

const N = "#14243A",
  Y = "#F3BE58",
  PAPER = "#F6F2E9",
  GLASS = "#DCECF3";
export const BankActorView = ({
  actor,
  identity,
  hands,
  expression,
}: {
  actor: BankActor;
  identity: "Sam" | "Alex";
  hands?: { left?: "rest" | "open" | "fist"; right?: "rest" | "open" | "fist" };
  expression?: "happy" | "neutral" | "relieved";
}) => {
  const Character = identity === "Sam" ? Sam : Alex;
  return (
    <Character
      x={actor.x}
      y={actor.y}
      scale={actor.scale}
      facing={actor.facing}
      skeleton={actor.rig}
      hands={hands}
      expression={expression ?? "neutral"}
      backpack={identity === "Sam"}
    />
  );
};
export const Cash = ({ x, y }: { x: number; y: number }) => (
  <g
    transform={`translate(${x},${y})`}
    data-object="money"
    stroke={K.ink}
    strokeWidth={3}
    strokeLinejoin="round"
  >
    <rect x={-41} y={-18} width={88} height={44} rx={5} fill="#87C8AA" />
    <rect x={-44} y={-22} width={88} height={44} rx={5} fill="#D1FAE5" />
    <rect
      x={-37}
      y={-15}
      width={74}
      height={30}
      rx={3}
      fill="none"
      stroke="#10B981"
      strokeWidth={2}
    />
    <ellipse rx={13} ry={16} fill="#10B981" stroke="none" />
    <text
      y={9}
      textAnchor="middle"
      fill={K.paper}
      stroke="none"
      fontSize={25}
      fontWeight={750}
    >
      $
    </text>
    <path d="M -28 0 h 7 M 22 0 h 7" stroke="#10B981" strokeWidth={3} />
  </g>
);
const BankMark = ({ x, y }: { x: number; y: number }) => (
  <g
    transform={`translate(${x},${y})`}
    fill="none"
    stroke={Y}
    strokeWidth={6}
    strokeLinecap="round"
  >
    <path d="M -38 -20 L 0 -40 L 38 -20 Z M -29 -10 V 24 M 0 -10 V 24 M 29 -10 V 24 M -42 34 H 42" />
  </g>
);

export const BankExterior = ({
  state,
}: {
  state: ReturnType<typeof bankState>;
}) => {
  const a = (state.doorProgress * Math.PI * 75) / 180;
  const left = 1390 - 280 * Math.cos(a),
    inset = Math.sin(a) * 35;
  return (
    <>
      <rect width={1920} height={1080} fill={PAPER} />
      <rect y={840} width={1920} height={240} fill="#E7E2D7" />
      <path
        d="M 80 900 H 1840 M 200 840 L 110 1080 M 860 840 L 820 1080 M 1510 840 L 1600 1080"
        stroke="#D4D0C7"
        strokeWidth={3}
      />
      <g opacity={0.5} fill="#E1E4E4">
        <rect x={80} y={430} width={200} height={410} />
        <rect x={300} y={350} width={160} height={490} />
        <path d="M 480 840 V 270 H 760 V 840 Z" />
      </g>
      <rect
        x={900}
        y={238}
        width={880}
        height={602}
        rx={8}
        fill={K.paper}
        stroke={N}
        strokeWidth={6}
      />
      <path d="M 870 240 H 1810 L 1740 170 H 940 Z" fill={N} />
      <rect x={940} y={265} width={800} height={72} rx={5} fill={N} />
      <BankMark x={1020} y={304} />
      <text
        x={1365}
        y={316}
        textAnchor="middle"
        fontSize={49}
        fontWeight={800}
        fill={K.paper}
        letterSpacing={5}
      >
        COMMUNITY BANK
      </text>
      <rect x={960} y={360} width={90} height={480} fill="#E7EBED" />
      <rect x={1710} y={360} width={40} height={480} fill="#E7EBED" />
      <rect
        x={1470}
        y={380}
        width={220}
        height={370}
        rx={6}
        fill={GLASS}
        stroke={N}
        strokeWidth={5}
      />
      <defs>
        <clipPath id="bank-window">
          <rect x={1474} y={384} width={212} height={362} />
        </clipPath>
      </defs>
      <g clipPath="url(#bank-window)">
        <rect x={1470} y={380} width={220} height={370} fill="#EEF0E9" />
        <Alex x={1580} y={810} scale={1.2} expression="neutral" />
        <rect x={1470} y={690} width={220} height={100} fill={N} />
        <path
          d="M 1475 394 L 1570 394 L 1480 570 Z"
          fill="white"
          opacity={0.35}
        />
      </g>
      <rect
        x={1106}
        y={346}
        width={288}
        height={498}
        fill="#516C7A"
        stroke={N}
        strokeWidth={7}
      />
      <rect x={1112} y={353} width={274} height={484} fill="#E4E5DD" />
      <path
        d={`M ${left} ${350 + inset} L 1390 350 V 840 L ${left} ${840 - inset} Z`}
        fill={GLASS}
        stroke={N}
        strokeWidth={5}
      />
      <path
        d={`M ${left + (1390 - left) * 0.12} ${400 + inset} L ${left + (1390 - left) * 0.42} ${400 + inset} L ${left + (1390 - left) * 0.12} ${560 + inset * 0.3} Z`}
        fill="white"
        opacity={0.5}
      />
      <path
        d={`M ${state.doorHandle.x} ${state.doorHandle.y - 24} V ${state.doorHandle.y + 24}`}
        stroke={Y}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path d="M 1090 845 H 1410" stroke={N} strokeWidth={8} />
      <g fill="#319B79" stroke={N} strokeWidth={4}>
        <path d="M 1800 760 Q 1735 670 1784 632 Q 1825 664 1800 760 M 1800 745 Q 1850 655 1873 700 Q 1870 745 1800 770" />
        <path d="M 1768 755 H 1845 L 1830 840 H 1784 Z" fill="#D2B68C" />
      </g>
      <Cash {...state.money} />
      <BankActorView
        actor={state.sam}
        identity="Sam"
        hands={{
          left: state.scene === "door" ? "fist" : "rest",
          right: "fist",
        }}
        expression="happy"
      />
    </>
  );
};
export const BankInterior = ({
  state,
  frame,
}: {
  state: ReturnType<typeof bankState>;
  frame: number;
}) => (
  <>
    <rect width={1920} height={1080} fill={PAPER} />
    <rect x={0} y={0} width={1920} height={300} fill={N} />
    <rect y={295} width={1920} height={8} fill={Y} />
    <BankMark x={1280} y={172} />
    <text
      x={1450}
      y={192}
      textAnchor="middle"
      fontSize={55}
      fontWeight={800}
      fill={K.paper}
      letterSpacing={5}
    >
      BANK
    </text>
    <rect y={840} width={1920} height={240} fill="#E7E2D7" />
    <path
      d="M 90 950 H 1830 M 300 840 L 160 1080 M 920 840 L 900 1080 M 1500 840 L 1620 1080"
      stroke="#D4D0C7"
      strokeWidth={3}
    />
    <rect
      x={120}
      y={340}
      width={280}
      height={500}
      rx={5}
      fill={GLASS}
      stroke={N}
      strokeWidth={6}
    />
    <path
      d="M 360 340 V 840 M 122 390 L 230 390 L 122 610"
      stroke="#9BB4C2"
      strokeWidth={5}
      fill="none"
    />
    <rect
      x={1440}
      y={350}
      width={310}
      height={240}
      rx={6}
      fill="#E5EADB"
      stroke="#BBC7BA"
      strokeWidth={3}
    />
    <path
      d="M 1470 545 L 1520 490 L 1575 510 L 1625 450 L 1720 410"
      fill="none"
      stroke="#77A08D"
      strokeWidth={6}
    />
    <Cash {...state.money} />
    <BankActorView
      actor={state.alex}
      identity="Alex"
      hands={{ right: frame >= 240 ? "fist" : frame >= 218 ? "open" : "rest" }}
      expression={frame >= 240 ? "happy" : "neutral"}
    />
    <BankActorView
      actor={state.sam}
      identity="Sam"
      hands={{ right: frame <= 249 ? "fist" : "rest" }}
      expression={frame >= 249 ? "relieved" : "happy"}
    />
    <g stroke={N} strokeWidth={5}>
      <path d="M 1060 710 H 1730 V 900 H 1060 Z" fill={N} />
      <rect x={1040} y={690} width={710} height={30} rx={7} fill={Y} />
      <rect x={1330} y={637} width={150} height={52} rx={5} fill={K.paper} />
      <text
        x={1405}
        y={673}
        textAnchor="middle"
        fill={N}
        stroke="none"
        fontSize={30}
        fontWeight={750}
      >
        ALEX
      </text>
      <path d="M 1560 688 V 584 H 1690 V 688 M 1625 584 V 690" fill="#304D62" />
    </g>
    <g fill="#319B79" stroke={N} strokeWidth={4}>
      <path d="M 170 790 Q 105 680 150 650 Q 195 690 170 790 M 170 765 Q 225 680 245 725 Q 238 775 170 790" />
      <path d="M 134 785 H 211 L 200 870 H 148 Z" fill="#D2B68C" />
    </g>
  </>
);

export const BankExample = () => {
  const frame = useCurrentFrame();
  const state = bankState(frame);
  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: font }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        role="img"
        aria-label="Sam approaches a bank, opens the door and gives money to Alex inside"
        style={{ fontFamily: font }}
      >
        {state.scene === "handoff" ? (
          <BankInterior state={state} frame={frame} />
        ) : (
          <BankExterior state={state} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
