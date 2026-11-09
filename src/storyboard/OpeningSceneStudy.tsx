import { createContext, useContext, type ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { progress } from "../animation/motion";
import {
  ReferenceCharacterRig,
  type ReferenceCharacterProps,
} from "../characters/ReferenceCharacterRig";
import { referenceSkeleton } from "../characters/referenceModel";
import { limb } from "../characters/kinematics";
import { proportions } from "../characters/biomechanics";
import { C } from "../design/tokens";
import "../design/fonts";
import { calculateBudget, example, usd } from "../finance/math";
import {
  openingBaseShot,
  openingCameras,
  type OpeningShotId,
} from "./openingShots";

export type OpeningPerformance = {
  frame: number;
  absoluteFrame: number;
  markers: Record<string, number>;
};
export const OpeningPerformanceContext =
  createContext<OpeningPerformance | null>(null);
const useReveal = (id: string, duration = 15) => {
  const performance = useContext(OpeningPerformanceContext);
  return performance
    ? progress(
        performance.absoluteFrame,
        performance.markers[id] ?? 0,
        duration,
      )
    : 1;
};
const ink = C.navy;
const pale = "#E2E8F0";
const budget = calculateBudget(example);

const Label = ({
  x,
  y,
  children,
  size = 38,
  fill = ink,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  fill?: string;
  anchor?: "start" | "middle";
}) => (
  <text
    x={x}
    y={y}
    fontFamily="Inter, sans-serif"
    fontSize={size}
    fontWeight={600}
    fill={fill}
    textAnchor={anchor}
  >
    {children}
  </text>
);

const Window = ({
  x = 1190,
  y = 150,
  width = 530,
}: {
  x?: number;
  y?: number;
  width?: number;
}) => (
  <g stroke={ink} strokeWidth={5}>
    <rect x={x} y={y} width={width} height={390} rx={8} fill="#DAE8EE" />
    <path
      d={`M ${x} ${y + 275} h ${width} M ${x + width / 2} ${y} v 390`}
      fill="none"
    />
    <path
      d={`M ${x + 30} ${y + 275} v -80 h 100 v 80 M ${x + 300} ${y + 275} v -125 h 110 v 125`}
      fill="#BFCDD8"
      stroke="none"
    />
  </g>
);

const Room = ({
  old = false,
  office = false,
}: {
  old?: boolean;
  office?: boolean;
}) => (
  <g>
    <rect width={1920} height={1080} fill={C.white} />
    <path d="M 0 0 H 430 V 800 L 0 1000 Z" fill="#E8EEF4" />
    <path d="M 0 1000 L 430 800 H 1920 V 1080 H 0 Z" fill={pale} />
    <path
      d="M 430 0 V 800 L 0 1000 M 430 800 H 1920"
      stroke="#A8B7C7"
      strokeWidth={5}
      fill="none"
    />
    <path
      d="M 430 800 L 170 1080 M 770 800 L 650 1080 M 1110 800 L 1130 1080 M 1450 800 L 1610 1080 M 0 1030 H 1920 M 195 910 H 1920"
      stroke="#C3CFDB"
      strokeWidth={3}
    />
    <Window x={office ? 1100 : old ? 1270 : 1190} width={old ? 370 : 530} />
    <path
      d="M 160 900 V 300 H 390 V 900 M 195 390 H 355 M 195 480 H 355"
      fill="none"
      stroke="#BCC8D3"
      strokeWidth={6}
    />
    {!old && !office && (
      <g stroke={ink} strokeWidth={5}>
        <path
          d="M 1610 900 V 690 M 1608 750 Q 1490 650 1530 610 Q 1610 620 1610 730 M 1610 790 Q 1740 690 1720 650 Q 1640 650 1610 770"
          fill={C.teal}
        />
        <path d="M 1550 820 H 1670 L 1650 900 H 1570 Z" fill={pale} />
      </g>
    )}
  </g>
);

const Desk = ({ old = false }: { old?: boolean }) => (
  <g stroke={ink} strokeWidth={6}>
    <path
      d={`M ${old ? 800 : 900} 740 H 1540 V 775 H ${old ? 800 : 900} Z`}
      fill="#C4CFD9"
    />
    <path d={`M ${old ? 840 : 940} 775 V 940 M 1490 775 V 940`} fill="none" />
    <path d="M 1050 735 L 1010 575 H 1255 L 1290 735 Z" fill={ink} />
    <path
      d="M 1033 595 H 1237 L 1264 716 H 1065 Z"
      fill="#EAF0F5"
      stroke="none"
    />
    <path d="M 1020 740 H 1335" />
    {old && (
      <g>
        <ellipse cx={1430} cy={725} rx={65} ry={14} fill={C.white} />
        <path
          d="M 1390 712 V 650 H 1450 V 712 M 1450 665 Q 1490 660 1480 690 H 1450"
          fill={C.white}
        />
      </g>
    )}
  </g>
);

const HandProp = ({ kind }: { kind: "phone" | "notice" | "keys" }) =>
  kind === "phone" ? (
    <g stroke={ink} strokeWidth={2}>
      <rect x={-10} y={-30} width={22} height={39} rx={4} fill={ink} />
      <rect x={-7} y={-26} width={16} height={28} fill={C.white} />
      <circle cx={1} cy={5} r={1} fill={C.white} />
    </g>
  ) : kind === "notice" ? (
    <g stroke={ink} strokeWidth={2}>
      <path d="M -14 -42 H 23 V 8 H -14 Z" fill={C.white} />
      <path d="M -7 -32 H 15 M -7 -25 H 10" />
      <rect
        x={-8}
        y={-16}
        width={23}
        height={13}
        fill={C.yellow}
        stroke="none"
      />
    </g>
  ) : (
    <g stroke={ink} strokeWidth={2} fill={C.white}>
      <circle cx={0} cy={-7} r={5} />
      <path d="M 0 -2 V 12 h 5 v -3" fill="none" />
    </g>
  );

const Actor = ({
  identity = "Sam",
  x = 600,
  y = 950,
  scale = 2.3,
  prop,
  working = false,
  ...acting
}: ReferenceCharacterProps & {
  identity?: "Sam" | "Alex";
  prop?: "phone" | "notice" | "keys";
  working?: boolean;
}) => {
  const performance = useContext(OpeningPerformanceContext);
  const skeleton = referenceSkeleton({
    frame: performance ? Math.min(performance.frame, 60) : 60,
    pose: acting.pose ?? "standing",
    fromPose:
      performance && acting.pose !== "sitting"
        ? "standing"
        : (acting.pose ?? "standing"),
    gesture:
      prop && acting.pose !== "celebrating" ? "holdWallet" : acting.gesture,
    blendFrames: performance ? 24 : 1,
  });
  if (performance && working) {
    // Two short keyboard taps, then rest; retarget wrists without stretching bones.
    const tap =
      performance.frame < 54
        ? Math.sin((Math.max(0, performance.frame - 18) * Math.PI) / 9) * 2
        : 0;
    skeleton.leftArm = limb(
      skeleton.leftArm.root,
      { x: -55, y: -82 + tap },
      proportions.upperArm,
      proportions.forearm,
      -1,
    );
    skeleton.rightArm = limb(
      skeleton.rightArm.root,
      { x: 18, y: -82 - tap },
      proportions.upperArm,
      proportions.forearm,
      1,
    );
  }
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ReferenceCharacterRig
        identity={identity}
        {...acting}
        skeleton={skeleton}
        hands={prop ? { right: "fist" } : acting.hands}
      />
      {prop && (
        <g
          transform={`translate(${skeleton.rightArm.end.x},${skeleton.rightArm.end.y})`}
        >
          <HandProp kind={prop} />
        </g>
      )}
    </g>
  );
};

const Phone = ({ children }: { children: ReactNode }) => (
  <g filter="url(#surface-shadow)">
    <rect x={1080} y={175} width={560} height={685} rx={42} fill={ink} />
    <rect x={1100} y={198} width={520} height={635} rx={26} fill={C.white} />
    <rect x={1275} y={212} width={170} height={12} rx={6} fill={ink} />
    {children}
  </g>
);

const TransferComparison = () => {
  const opened = useReveal("open");
  const smaller = useReveal("smaller");
  return (
    <Phone>
      <Label x={1140} y={305} size={34}>
        Monthly transfers
      </Label>
      <Label x={1140} y={410} size={28}>
        Before
      </Label>
      <rect
        x={1140}
        y={440}
        width={380 * opened}
        height={28}
        rx={5}
        fill={C.yellow}
      />
      <Label x={1140} y={565} size={28}>
        Month 3
      </Label>
      <rect
        x={1140}
        y={595}
        width={(380 * budget.sam * smaller) / budget.before}
        height={28}
        rx={5}
        fill={C.yellow}
      />
      <path d="M 1140 725 H 1540" stroke={pale} strokeWidth={3} />
    </Phone>
  );
};

const PayPacket = ({
  x,
  y,
  label = `+${usd(example.raise)}/month`,
}: {
  x: number;
  y: number;
  label?: string;
}) => (
  <g transform={`translate(${x},${y})`} filter="url(#surface-shadow)">
    <rect
      width={370}
      height={205}
      rx={8}
      fill={C.yellow}
      stroke={ink}
      strokeWidth={5}
    />
    <path
      d="M 0 0 L 185 100 L 370 0"
      fill="none"
      stroke={ink}
      strokeWidth={5}
    />
    <rect x={30} y={120} width={310} height={60} fill={C.white} />
    <Label x={185} y={163} size={32} anchor="middle">
      {label}
    </Label>
  </g>
);

const Services = () => {
  const performance = useContext(OpeningPerformanceContext);
  return (
    <Phone>
      <Label x={1140} y={305} size={38}>
        Tonight
      </Label>
      {[
        { y: 355, symbol: "▶", color: C.yellow },
        { y: 500, symbol: "♪", color: pale },
        { y: 645, symbol: "▶", color: pale },
      ].map(({ y, symbol, color }) => (
        <g
          key={y}
          opacity={
            performance ? progress(performance.frame, (y - 355) / 7, 18) : 1
          }
        >
          <rect
            x={1140}
            y={y}
            width={420}
            height={110}
            rx={12}
            fill={color}
            stroke={ink}
            strokeWidth={3}
          />
          <Label x={1180} y={y + 72} size={47}>
            {symbol}
          </Label>
          <path
            d={`M 1280 ${y + 42} h 220 M 1280 ${y + 67} h 150`}
            stroke={ink}
            strokeWidth={5}
          />
        </g>
      ))}
    </Phone>
  );
};

const Rental = () => (
  <g>
    <rect width={1920} height={1080} fill={C.white} />
    <path
      d="M 210 145 L 1650 105 L 1810 750 H 120 Z"
      fill="#DBE9EF"
      stroke={ink}
      strokeWidth={8}
    />
    <path d="M 1130 400 L 970 730 H 1490 L 1320 400 Z" fill="#B9C8D4" />
    <path
      d="M 1225 465 L 1210 550 M 1200 595 L 1185 720"
      stroke={C.white}
      strokeWidth={8}
    />
    <rect
      x={350}
      y={350}
      width={405}
      height={600}
      rx={85}
      fill="#71849B"
      stroke={ink}
      strokeWidth={7}
    />
    <rect
      x={405}
      y={270}
      width={290}
      height={195}
      rx={48}
      fill="#71849B"
      stroke={ink}
      strokeWidth={7}
    />
    <Actor x={800} y={1360} scale={3.9} pose="sitting" expression="relieved" />
    <path d="M 0 830 Q 920 745 1920 830 V 1080 H 0 Z" fill={ink} />
    <path
      d="M 0 864 Q 920 780 1920 864"
      fill="none"
      stroke="#64748B"
      strokeWidth={22}
    />
    <ellipse
      cx={850}
      cy={835}
      rx={150}
      ry={105}
      fill="none"
      stroke="#30445E"
      strokeWidth={42}
    />
    <path
      d="M 850 825 L 910 1010 M 725 835 H 985"
      stroke="#30445E"
      strokeWidth={25}
    />
    <path
      d="M 0 0 H 200 L 315 820 L 190 1080 H 0 Z M 1700 0 H 1920 V 1080 H 1830 L 1650 105 Z"
      fill={ink}
    />
    <g transform="translate(1435,900) rotate(-7)">
      <rect width={290} height={115} rx={6} fill={C.white} />
      <Label x={32} y={73} size={42}>
        RENTAL
      </Label>
    </g>
  </g>
);

// Partial rear silhouette is a staging aid; the shared front-facing rig stays unchanged.
const RearShoulder = ({ identity = "Sam" }: { identity?: "Sam" | "Alex" }) => {
  const performance = useContext(OpeningPerformanceContext);
  const lean = performance ? progress(performance.frame, 8, 30) : 0;
  return (
    <g>
      <path
        d="M 40 1080 Q 40 850 230 770 Q 400 730 570 785 Q 740 850 790 1080 Z"
        fill={identity === "Sam" ? "#3B82F6" : C.white}
        stroke={ink}
        strokeWidth={8}
      />
      <path
        d="M 360 700 H 430 V 800 H 360 Z"
        fill={C.white}
        stroke={ink}
        strokeWidth={6}
      />
      <path
        d="M 250 790 Q 400 920 560 795"
        fill="none"
        stroke={identity === "Sam" ? "#2563AB" : ink}
        strokeWidth={26}
      />
      <g
        transform={`translate(${400 + 22 * lean},${550 + 14 * lean}) scale(4)`}
      >
        <path
          d="M -1 -42 C 24 -43 40 -25 40 -1 C 41 24 25 42 2 43 C -23 44 -43 27 -43 2 C -44 -22 -26 -41 -1 -42 Z"
          fill={C.white}
          stroke={ink}
          strokeWidth={3.5}
        />
      </g>
    </g>
  );
};

const DeskAngle = ({
  children,
  old = false,
  identity = "Sam",
}: {
  children: ReactNode;
  old?: boolean;
  identity?: "Sam" | "Alex";
}) => (
  <g>
    <g opacity={0.45}>
      <Room old={old} />
    </g>
    <path
      d="M 380 1080 L 800 470 H 1730 L 1920 1080 Z"
      fill="#D8E1EB"
      stroke={ink}
      strokeWidth={7}
    />
    <path d="M 800 470 H 1730 L 1740 493 H 785 Z" fill="#A9B9CA" />
    {old && (
      <g stroke={ink} strokeWidth={5}>
        <ellipse cx={880} cy={610} rx={72} ry={22} fill={C.white} />
        <path
          d="M 835 590 V 500 H 900 V 590 M 900 518 Q 950 510 941 550 H 900"
          fill={C.white}
        />
      </g>
    )}
    <g transform="translate(200,300) scale(0.8)">{children}</g>
    <RearShoulder identity={identity} />
  </g>
);

const Commitments = () => {
  const performance = useContext(OpeningPerformanceContext);
  const enter = (delay: number) =>
    performance ? progress(performance.frame, delay, 22) : 1;
  return (
    <g>
      <rect width={1920} height={1080} fill={pale} />
      <rect
        x={120}
        y={100}
        width={1680}
        height={880}
        rx={40}
        fill={C.white}
        stroke={ink}
        strokeWidth={6}
      />
      <PayPacket x={775} y={395} />
      <g
        opacity={enter(16)}
        transform={`translate(${260 - (1 - enter(16)) * 130},220) rotate(-7)`}
      >
        <rect
          width={330}
          height={380}
          rx={9}
          fill={C.white}
          stroke={ink}
          strokeWidth={4}
        />
        <rect width={330} height={70} fill={C.red} />
        <Label x={35} y={125} size={33}>
          Rent
        </Label>
        <path
          d="M 35 185 H 285 M 35 225 H 245 M 35 265 H 270"
          stroke={pale}
          strokeWidth={12}
        />
      </g>
      <g
        opacity={enter(36)}
        transform={`translate(${1260 + (1 - enter(36)) * 130},220) rotate(6)`}
      >
        <rect
          width={315}
          height={380}
          rx={9}
          fill={C.white}
          stroke={ink}
          strokeWidth={4}
        />
        <Label x={30} y={85} size={32}>
          Car rental
        </Label>
        <circle
          cx={100}
          cy={175}
          r={34}
          fill={pale}
          stroke={ink}
          strokeWidth={5}
        />
        <path
          d="M 100 209 V 285 h 30 v -23"
          stroke={ink}
          strokeWidth={8}
          fill="none"
        />
      </g>
      <rect x={680} y={735} width={550} height={115} rx={15} fill={ink} />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={enter(56 + i * 8)}>
          <rect
            x={710 + i * 170}
            y={753}
            width={140}
            height={80}
            rx={9}
            fill={i === 0 ? C.yellow : pale}
          />
          <path d={`M ${760 + i * 170} 777 l 32 17 l -32 17 Z`} fill={ink} />
        </g>
      ))}
    </g>
  );
};

export {
  Actor,
  Desk,
  DeskAngle,
  Label,
  PayPacket,
  Phone,
  Rental,
  Room,
  Services,
};

const Baseline = ({ phase }: { phase: 0 | 1 | 2 }) => {
  const income = useReveal("income");
  const expenses = useReveal("expenses");
  const remaining = useReveal("remaining");
  const saved = useReveal("saved", 8);
  const transfer = useReveal("transfer", 35);
  const phone = (
    <Phone>
      <Label x={1140} y={315} size={32}>
        {phase === 2
          ? saved > 0
            ? "Transfer complete"
            : "Transfer to savings"
          : "Monthly take-home"}
      </Label>
      <g opacity={phase === 2 ? transfer : income}>
        <Label x={1140} y={425} size={76} fill={phase === 2 ? C.teal : ink}>
          {usd(phase === 2 ? budget.before : example.income)}
        </Label>
      </g>
      {phase === 0 && (
        <Label x={1140} y={555} size={28}>
          Before the raise
        </Label>
      )}
      {phase === 1 && (
        <>
          <g opacity={expenses}>
            <Label x={1140} y={535} size={30}>
              Expenses: {usd(example.expenses)}
            </Label>
          </g>
          <path d="M 1140 580 H 1550" stroke={pale} strokeWidth={4} />
          <g opacity={remaining}>
            <Label x={1140} y={660} size={34}>
              Remaining: {usd(budget.before)}
            </Label>
          </g>
        </>
      )}
      {phase === 2 && (
        <>
          <path
            opacity={saved}
            d="M 1150 540 l 40 40 l 100 -100"
            stroke={C.teal}
            strokeWidth={13}
            fill="none"
          />
          <Label x={1140} y={690} size={32}>
            To savings
          </Label>
        </>
      )}
    </Phone>
  );
  if (phase === 1)
    return (
      <g>
        <rect width={1920} height={1080} fill="#D8E1EB" />
        <path d="M 0 1000 H 1920" stroke="#A9B9CA" strokeWidth={20} />
        <PayPacket x={290} y={250} label={usd(example.income)} />
        <g
          transform="translate(330,610) rotate(-8)"
          filter="url(#surface-shadow)"
        >
          <rect
            x={15}
            y={15}
            width={330}
            height={300}
            fill="#BBC7D3"
            stroke={ink}
            strokeWidth={4}
          />
          <rect
            width={330}
            height={300}
            fill={C.white}
            stroke={ink}
            strokeWidth={4}
          />
          <rect width={330} height={60} fill={C.red} />
          <Label x={30} y={120} size={34}>
            Expenses
          </Label>
          <path
            d="M 30 170 H 280 M 30 215 H 260"
            stroke={pale}
            strokeWidth={10}
          />
        </g>
        <g transform="translate(80,100) rotate(4 1360 520) scale(0.95)">
          {phone}
        </g>
      </g>
    );
  return <DeskAngle old>{phone}</DeskAngle>;
};

export const OpeningSceneStudy = ({
  shot,
  viewBox,
}: {
  shot: OpeningShotId;
  viewBox?: readonly number[];
}) => {
  const performance = useContext(OpeningPerformanceContext);
  const raise = useReveal("raise", 10);
  const worry = useReveal("worry", 1);
  const camera = openingCameras[shot];
  const baseShot = openingBaseShot(shot);
  const reactionClose = shot === "s01-b-reaction-close";
  const raiseClose = shot === "s01-a-raise-close";
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <svg
        width={1920}
        height={1080}
        viewBox={(viewBox ?? camera.viewBox).join(" ")}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <defs>
          <filter
            id="surface-shadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx={10}
              dy={15}
              stdDeviation={12}
              floodColor={ink}
              floodOpacity={0.16}
            />
          </filter>
        </defs>
        {baseShot === "s01-a-raise" && (
          <>
            <Room office />
            <Actor
              x={610}
              y={965}
              scale={2.7}
              pose="celebrating"
              expression="excited"
              prop="notice"
            />
            {!raiseClose && (
              <g opacity={raise}>
                <Label x={1090} y={630} size={112} fill={ink}>
                  +{usd(example.raise)}
                </Label>
                <Label x={1090} y={705} size={43}>
                  per month
                </Label>
              </g>
            )}
          </>
        )}
        {baseShot === "s01-b-three-months-later" && (
          <>
            <Room />
            <Actor
              x={570}
              y={965}
              scale={2.7}
              pose="thinking"
              expression={performance && !worry ? "relieved" : "worried"}
              prop="phone"
            />
            {!reactionClose && (
              <>
                <Label x={1100} y={125} size={45}>
                  Three months later
                </Label>
                <TransferComparison />
              </>
            )}
          </>
        )}
        {baseShot === "s02-a-apartment" && (
          <>
            <Room />
            <Actor x={660} y={950} expression="relieved" pose="explaining" />
            <Desk />
            <path d="M 1590 1080 L 1685 1000 H 1920 V 1080 Z" fill={ink} />
          </>
        )}
        {baseShot === "s02-b-rental" && <Rental />}
        {baseShot === "s02-c-services" && (
          <DeskAngle>
            <Services />
          </DeskAngle>
        )}
        {baseShot === "s03-transfer-comparison" && (
          <DeskAngle>
            <TransferComparison />
          </DeskAngle>
        )}
        {baseShot === "s04-a-still-working" && (
          <>
            <Room office />
            <Actor
              x={820}
              y={930}
              scale={2.5}
              expression="neutral"
              pose="sitting"
              working
            />
            <g transform="translate(-440,-15)">
              <Desk />
            </g>
            <path d="M 1300 1080 L 1460 955 H 1920 V 1080 Z" fill={ink} />
          </>
        )}
        {baseShot === "s04-b-commitments" && <Commitments />}
        {baseShot === "s05-equal-start" && (
          <>
            <Room />
            <Actor
              x={600}
              y={950}
              scale={2.25}
              expression="curious"
              pose="thinking"
              prop="notice"
            />
            <Actor
              identity="Alex"
              x={1320}
              y={950}
              scale={2.25}
              expression="thinking"
              pose="thinking"
              prop="keys"
            />
            <PayPacket x={420} y={100} />
            <PayPacket x={1140} y={100} />
            <path d="M 0 1030 H 1920 V 1080 H 0 Z" fill={ink} />
          </>
        )}
        {baseShot === "s06-a-income" && <Baseline phase={0} />}
        {baseShot === "s06-b-remainder" && <Baseline phase={1} />}
        {baseShot === "s06-c-transfer" && <Baseline phase={2} />}
      </svg>
    </AbsoluteFill>
  );
};
