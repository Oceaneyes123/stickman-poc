import { useContext, type ReactNode } from "react";
import { Composition, registerRoot, staticFile } from "remotion";
import { AnimatedNumber } from "../typography";
import {
  useActorFactory,
  useObjectMotion,
  EpisodeMotionContext,
} from "./EpisodeMotionContext";
import { interactionPulse } from "./episodeMotion";
import { TypographyGallery } from "../typography/Gallery";
import {
  FinancialMotionContext,
  useFinancialMotion,
} from "../typography/context";
import {
  EpisodeReview,
  type TypographyReviewProps,
} from "../typography/EpisodeReview";
import type { CompiledTypography } from "../typography/plan";
import { ReferenceCharacterRig } from "../characters/ReferenceCharacterRig";
import {
  type ReferenceExpression,
} from "../characters/referenceModel";
import { placeHands, toWorld } from "../characters/staging";
import type { Point } from "../characters/kinematics";
import type { PerformanceActor } from "../scenes/cinematicModel";
import { Laptop, PhoneListing, Keys } from "../scenes/cinematicReferences";
import {
  NarrativeScene,
  ComparisonScene,
  SceneText,
} from "../scenes/narrative";
import {
  WritingDesk,
  Cup,
  GuestChair,
  DiningTable,
  StoryEnvironment,
} from "../scenes/cinematicEnvironment";
import { C, cinema } from "../design/tokens";
import { example, usd } from "../finance/math";
import {
  budget,
  rent,
  transport,
  services,
  monthOne,
  monthTwo,
  monthOneExpenses,
  monthTwoExpenses,
  samThreeMonths,
  alexThreeMonths,
  baselineThreeMonths,
  samAnnual,
  alexAnnual,
} from "./remainingShots";
import {
  cinematicStillShots,
  allocationParts,
  storyboardViews,
  type CinematicStillShot,
} from "./cinematicStillPlan";

const Money = ({
  x,
  y,
  value,
  size = 64,
  positive = false,
  anchor = "start",
  fill = C.navy,
}: {
  x: number;
  y: number;
  value: number;
  size?: number;
  positive?: boolean;
  anchor?: "start" | "middle";
  fill?: string;
}) => {
  const motion = useFinancialMotion(value);
  if (motion)
    return (
      <AnimatedNumber
        x={x}
        y={y}
        value={value}
        size={size}
        color={fill}
        anchor={anchor}
        positive={positive}
        frame={motion.frame}
        from={motion.from}
        until={motion.sceneUntil + 10}
        duration={18}
        mode={size >= 90 ? "odometer" : "counter"}
      />
    );
  return (
    <g stroke="none">
      <SceneText x={x} y={y} size={size} fill={fill} anchor={anchor}>
        {positive ? "+" : ""}
        {usd(value)}
      </SceneText>
    </g>
  );
};
const Actor = ({
  actor,
  keys = false,
}: {
  actor: PerformanceActor;
  keys?: boolean;
}) => (
  <>
    <ReferenceCharacterRig
      identity={actor.identity}
      x={actor.x}
      y={actor.y}
      scale={actor.scale}
      facing={actor.facing}
      skeleton={actor.rig}
      expression={actor.expression}
      hands={actor.rig.handKinds}
    />
    {keys && <Keys point={toWorld(actor, actor.rig.rightArm.end)} />}
  </>
);
const Slip = ({
  x,
  y,
  amounts = [],
  color = C.yellow,
  width = 240,
  tilt = 0,
}: {
  x: number;
  y: number;
  amounts?: number[];
  color?: string;
  width?: number;
  tilt?: number;
}) => (
  <g
    transform={`translate(${x},${y}) rotate(${tilt})`}
    filter="url(#cinema-shadow)"
  >
    <path
      d={`M0 0H${width}V${130 + amounts.length * 85}l-12 -8l-12 8l-12 -8l-12 8H0Z`}
      fill={C.white}
      stroke={C.navy}
      strokeWidth={3}
    />
    <path d={`M20 25H${width - 20}`} stroke={color} strokeWidth={7} />
    {amounts.map((value, i) => (
      <Money
        key={i}
        x={22}
        y={112 + i * 85}
        value={value}
        size={Math.min(54, (width - 35) / (usd(value).length * 0.65))}
      />
    ))}
    {!amounts.length && (
      <path
        d={`M25 75H${width - 25} M25 110H${width - 55}`}
        stroke={cinema.material.fabric}
        strokeWidth={4}
      />
    )}
  </g>
);
const Envelope = ({
  x,
  y,
  value = example.raise,
  scale = 1,
}: {
  x: number;
  y: number;
  value?: number;
  scale?: number;
}) => (
  <g
    transform={`translate(${x},${y}) scale(${scale})`}
    filter="url(#cinema-shadow)"
  >
    <rect
      width={330}
      height={160}
      rx={6}
      fill={C.yellow}
      stroke={C.navy}
      strokeWidth={4}
    />
    <path d="M0 0L165 78L330 0" stroke={C.navy} strokeWidth={4} fill="none" />
    <Money x={165} y={132} value={value} size={52} anchor="middle" />
  </g>
);
const Phone = ({
  grip,
  amount,
  comparison,
  selected = false,
  statement = false,
}: {
  grip: Point;
  amount?: number;
  comparison?: number[];
  selected?: boolean;
  statement?: boolean;
}) => {
  const animation = useObjectMotion("phone");
  const finance = useContext(FinancialMotionContext);
  const tap =
    animation && finance?.confirmationAt !== undefined
      ? Math.max(
          0,
          Math.min(1, (animation.frame - finance.confirmationAt) / 18),
        )
      : 0;
  return (
    <g
      transform={`translate(${grip.x - 25},${grip.y - 125})`}
      stroke={C.navy}
      strokeWidth={3}
    >
      <rect width={100} height={145} rx={11} fill={C.navy} />
      <rect x={7} y={9} width={86} height={119} rx={6} fill={C.white} />
      {tap > 0 && tap < 1 && (
        <circle
          cx={72}
          cy={108}
          r={5 + 20 * tap}
          fill="none"
          stroke={C.teal}
          strokeWidth={3}
          opacity={1 - tap}
        />
      )}
      <path d="M35 15H65" strokeWidth={4} />
      {amount !== undefined && (
        <Money
          x={50}
          y={83}
          size={usd(amount).length > 5 ? 22 : 29}
          value={amount}
          anchor="middle"
          fill={C.teal}
        />
      )}{" "}
      {comparison &&
        comparison.map((v, i) => (
          <Money
            key={i}
            x={50}
            y={62 + i * 42}
            size={25}
            value={v}
            anchor="middle"
          />
        ))}
      {amount === undefined &&
        !comparison &&
        !statement &&
        [0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x={17}
              y={32 + i * 29}
              width={66}
              height={23}
              rx={3}
              fill={selected && i === 0 ? C.yellow : cinema.material.fabric}
            />
            <path d={`M25 ${38 + i * 29}l12 6l-12 6Z`} fill={C.navy} />
          </g>
        ))}
      {statement && (
        <g stroke="none">
          <rect x={17} y={40} width={66} height={14} fill={C.yellow} />
          <rect
            x={17}
            y={85}
            width={(66 * budget.sam) / budget.before}
            height={14}
            fill={C.teal}
          />
        </g>
      )}
    </g>
  );
};
const Book = ({
  x = 1000,
  y = 650,
  open = true,
}: {
  x?: number;
  y?: number;
  open?: boolean;
}) => (
  <g transform={`translate(${x},${y})`} stroke={C.navy} strokeWidth={4}>
    {open ? (
      <>
        <path
          d="M-260 -155Q-135 -200 0 -145Q135 -200 260 -155V105Q135 60 0 115Q-135 60 -260 105Z"
          fill={C.white}
        />
        <path d="M0 -145V115" fill="none" />
      </>
    ) : (
      <>
        <path d="M-220 -120H220V80H-220Z" fill={cinema.material.fabric} />
        <path d="M-200 -100H210V60H-200Z" fill={C.white} />
      </>
    )}
  </g>
);
const Calendar = ({
  x = 1130,
  y = 540,
  repeat = false,
}: {
  x?: number;
  y?: number;
  repeat?: boolean;
}) => {
  const animation = useObjectMotion("calendar");
  return (
    <g
      transform={`translate(${x},${y}) rotate(${animation ? -7 * (1 - animation.p) : 0} 165 115)`}
      stroke={C.navy}
      strokeWidth={4}
    >
      <path d="M0 0H340V300H0Z" fill={C.white} />
      <path d="M0 0H340V55H0Z" fill={repeat ? C.red : C.yellow} />
      {Array.from({ length: 20 }, (_, i) => (
        <rect
          key={i}
          x={25 + (i % 5) * 60}
          y={85 + Math.floor(i / 5) * 48}
          width={38}
          height={26}
          rx={3}
          fill={i === 12 ? C.teal : cinema.material.fabric}
          stroke="none"
        />
      ))}
      {repeat && (
        <path
          d="M100 170Q170 100 240 170 M215 133L240 170H195"
          fill="none"
          strokeWidth={7}
        />
      )}
    </g>
  );
};
const Car = ({
  old = false,
  x = 960,
  y = 800,
  scale = 1,
}: {
  old?: boolean;
  x?: number;
  y?: number;
  scale?: number;
}) => {
  const animation = useObjectMotion("car");
  return (
    <g
      transform={`translate(${x - (animation ? 110 * (1 - animation.p) : 0)},${y}) scale(${scale})`}
      stroke={C.navy}
      strokeWidth={7}
    >
      <path
        d="M-450 0L-360 -190L-50 -230L130 -80L360 -40L390 100H-510V25Z"
        fill={old ? cinema.material.fabric : C.teal}
      />
      <path d="M-320 -160L-70 -195L50 -85H-360Z" fill="none" />
      <path d="M-140 -182V-85 M100 -60V80" fill="none" />
      {[-320, 210].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={100} r={72} fill={C.navy} />
          <circle cx={cx} cy={100} r={33} fill={C.white} />
        </g>
      ))}
    </g>
  );
};
const Cabin = ({ old = false }: { old?: boolean }) => {
  const makeActor = useActorFactory();
  const sam = makeActor({
    x: 790,
    y: 1370,
    scale: 3.9,
    pose: "sitting",
    expression: old ? "thinking" : "relieved",
  });
  return (
    <>
      <rect
        x={350}
        y={280}
        width={400}
        height={650}
        rx={80}
        fill={old ? "#A6B4C6" : "#71849B"}
        stroke={C.navy}
        strokeWidth={7}
      />
      <rect
        x={410}
        y={210}
        width={250}
        height={180}
        rx={45}
        fill={cinema.material.fabric}
        stroke={C.navy}
        strokeWidth={5}
      />
      <Actor actor={sam} />
      <path
        d="M180 835Q960 770 1810 835V1080H100Z"
        fill={cinema.material.foreground}
      />
      <ellipse
        cx={850}
        cy={835}
        rx={145}
        ry={100}
        stroke={C.navy}
        strokeWidth={28}
        fill="none"
      />
      <path
        d="M850 835L905 990 M720 835H980"
        stroke={C.navy}
        strokeWidth={20}
      />
    </>
  );
};
const Guitar = ({ x = 1050, y = 870 }: { x?: number; y?: number }) => (
  <g
    transform={`translate(${x},${y}) rotate(12)`}
    stroke={C.navy}
    strokeWidth={5}
  >
    <path
      d="M-40 -10C-110 -90 -150 10 -90 55C-35 90 5 45 5 10L45 -200H15Z"
      fill={cinema.material.wood}
    />
    <circle cx={-55} cy={8} r={17} fill={C.navy} />
    <path d="M-55 27L30 -195" stroke={C.white} strokeWidth={2} />
  </g>
);

const DeskAction = ({
  identity = "Sam",
  action = "work",
  amount,
  old = false,
  expression = "thinking",
  items,
}: {
  identity?: "Sam" | "Alex";
  action?: "work" | "phone" | "sign" | "carry" | "list" | "keep";
  amount?: number;
  old?: boolean;
  expression?: ReferenceExpression;
  items?: ReactNode;
}) => {
  const makeActor = useActorFactory();
  const performance = useContext(EpisodeMotionContext);
  const pulse = performance
    ? interactionPulse(performance.frame, performance.motion)
    : 0;
  const person = makeActor({
    identity,
    x: 700,
    pose: action === "work" ? "sitting" : "standing",
    expression,
    carry: action === "phone" || action === "keep",
  });
  const grip = toWorld(person, person.rig.rightArm.end);
  if (action === "sign" || action === "list")
    placeHands(
      person,
      { right: { x: 855 + 18 * pulse, y: 665 - 5 * pulse } },
      7,
    );
  if (action === "work")
    placeHands(person, {
      right: { x: 780, y: 685 - 5 * pulse },
      left: { x: 655, y: 685 - 2 * pulse },
    });
  if (action === "carry") {
    const travel = toWorld(person, person.rig.hip).x - 700;
    placeHands(person, {
      right: { x: 820 + travel, y: 650 },
      left: { x: 680 + travel, y: 650 },
    });
  }
  const hand = toWorld(person, person.rig.rightArm.end);
  return (
    <>
      <WritingDesk
        x={action === "work" ? 640 : 730}
        y={690}
        width={action === "work" ? 880 : 790}
        old={old}
      />
      {old && (
        <>
          <Cup x={1410} y={687} />
          <ellipse
            cx={1320}
            cy={684}
            rx={75}
            ry={17}
            fill={C.white}
            stroke={C.navy}
            strokeWidth={4}
          />
        </>
      )}
      {(action === "work" || action === "keep") && (
        <Laptop
          grip={{
            x:
              action === "work"
                ? toWorld(person, person.rig.rightArm.end).x + 20
                : 1120,
            y: 690,
          }}
          open={1}
        />
      )}
      {(action === "sign" || action === "list") && (
        <>
          <Slip
            x={805}
            y={545}
            color={action === "sign" ? C.red : C.teal}
            width={240}
          />
          <path
            d="M835 658q10 12 20 0q10 -8 18 3"
            pathLength={1}
            strokeDasharray={performance ? 1 : undefined}
            strokeDashoffset={
              performance
                ? 1 -
                  Math.min(
                    1,
                    Math.max(
                      0,
                      (performance.frame - performance.motion.from) /
                        performance.motion.duration,
                    ),
                  )
                : undefined
            }
            stroke={C.navy}
            strokeWidth={3}
            fill="none"
          />
        </>
      )}
      {items}
      <Actor actor={person} />
      {action === "phone" && (
        <Phone grip={grip} amount={amount} selected={amount === undefined} />
      )}
      {action === "keep" && <Keys point={grip} />}
      {action === "carry" && (
        <rect
          x={hand.x - 175}
          y={hand.y - 85}
          width={180}
          height={85}
          rx={8}
          fill={cinema.environment.glass}
          stroke={C.navy}
          strokeWidth={5}
        />
      )}
      {(action === "sign" || action === "list") && (
        <path
          d={`M${hand.x} ${hand.y}l14 -38`}
          stroke={C.navy}
          strokeWidth={5}
        />
      )}
    </>
  );
};
const Arrow = ({
  x = 0,
  y = 0,
  width = 180,
  color = C.navy,
}: {
  x?: number;
  y?: number;
  width?: number;
  color?: string;
}) => {
  const animation = useObjectMotion("arrow");
  return (
    <path
      d={`M${x} ${y}h${width}m-30 -24l30 24l-30 24`}
      stroke={color}
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={animation ? 1 : undefined}
      strokeDashoffset={animation ? 1 - animation.p : undefined}
    />
  );
};
const Check = ({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) => {
  const motion = useContext(FinancialMotionContext);
  if (
    motion?.confirmationAt !== undefined &&
    motion.frame < motion.confirmationAt
  )
    return null;
  return (
    <path
      d="M-30 0L-5 25L45 -35"
      transform={`translate(${x},${y}) scale(${scale})`}
      stroke={C.teal}
      strokeWidth={12}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};
const CoinStack = ({
  x,
  y,
  value,
  max = budget.alex,
  color = C.yellow,
  width = 210,
}: {
  x: number;
  y: number;
  value: number;
  max?: number;
  color?: string;
  width?: number;
}) => {
  const motion = useFinancialMotion(value);
  const object = useObjectMotion("money");
  const build =
    object && (!motion || motion.from < motion.sceneFrom) ? object.p : 1;
  const height = (value / max) * 380 * (motion?.progress ?? 1) * build;
  return (
    <g opacity={motion && motion.frame < motion.from ? 0 : 1}>
      <path
        d={`M${x} ${y}h${width}v-${height}h-${width}Z`}
        fill={color}
        stroke={C.navy}
        strokeWidth={5}
      />
      <path
        d={`M${x + 15} ${y - 18}h${width - 30} M${x + 15} ${y - 40}h${width - 30}`}
        stroke={C.navy}
        strokeWidth={3}
        opacity={0.3}
      />
      <Money
        x={x + width / 2}
        y={y - height - 35}
        value={value}
        size={66}
        anchor="middle"
      />
    </g>
  );
};
const Pair = ({
  values,
  gap = false,
  annual = false,
}: {
  values: [number, number];
  gap?: boolean;
  annual?: boolean;
}) => {
  const max = annual ? alexAnnual : Math.max(...values);
  return (
    <>
      <CoinStack x={390} y={825} value={values[0]} max={max} width={330} />
      <CoinStack
        x={1190}
        y={825}
        value={values[1]}
        max={max}
        width={330}
        color={C.teal}
      />
      <path
        d="M555 870V910H1355V870"
        fill="none"
        stroke={C.navy}
        strokeWidth={5}
      />
      {gap && (
        <Money
          x={960}
          y={1000}
          anchor="middle"
          value={values[1] - values[0]}
          size={78}
        />
      )}
    </>
  );
};
const Allocation = ({
  stage = 3,
  x = 270,
  y = 590,
  width = 1320,
  total = example.raise,
  amounts = true,
}: {
  stage?: 1 | 2 | 3;
  x?: number;
  y?: number;
  width?: number;
  total?: number;
  amounts?: boolean;
}) => {
  const object = useObjectMotion("allocation");
  const finance = useContext(FinancialMotionContext);
  const parts = allocationParts(stage),
    added = parts.reduce((a, b) => a + b, 0),
    left = Math.max(0, total - added);
  let used = 0;
  return (
    <g>
      <Money
        x={x + width / 2}
        y={y - 140}
        value={total}
        size={92}
        anchor="middle"
      />
      <path
        d={`M${x} ${y - 80}v-25h${width}v25`}
        fill="none"
        stroke={C.navy}
        strokeWidth={5}
      />
      {[...parts, ...(left ? [left] : [])].map((v, i) => {
        const start = x + (used / total) * width;
        used += v;
        const w = (v / total) * width,
          cost = i < parts.length;
        return (
          <g key={i}>
            <rect
              x={start}
              y={y}
              width={
                w *
                (finance?.gates.some((g) => g.value === v)
                  ? Math.max(
                      0,
                      Math.min(
                        1,
                        (finance.frame -
                          finance.gates.find((g) => g.value === v)!.from) /
                          18,
                      ),
                    )
                  : (object?.p ?? 1))
              }
              height={135}
              fill={cost ? C.red : C.yellow}
              stroke={C.navy}
              strokeWidth={4}
            />
            {amounts && (
              <Money
                x={start + w / 2}
                y={y + 215}
                value={v}
                size={w < 150 ? 46 : 64}
                anchor="middle"
              />
            )}
          </g>
        );
      })}
      <path
        d={`M${x + width} ${y - 70}v260`}
        stroke={C.navy}
        strokeWidth={5}
        strokeDasharray="9 10"
      />
      {added > total && (
        <>
          <path
            d={`M${x + width} ${y + 300}h${((added - total) / total) * width}`}
            stroke={C.red}
            strokeWidth={12}
          />
          {amounts && (
            <Money
              x={x + width + 15}
              y={y + 380}
              value={added - total}
              size={52}
              anchor="middle"
            />
          )}
        </>
      )}
    </g>
  );
};
const Remote = ({ grip }: { grip: Point }) => (
  <g
    transform={`translate(${grip.x - 20},${grip.y - 100}) rotate(12)`}
    stroke={C.navy}
    strokeWidth={4}
  >
    <rect width={45} height={115} rx={12} fill={cinema.material.fabric} />
    <circle cx={22} cy={38} r={12} fill={C.white} />
    <path d="M12 74H32M12 90H32" />
  </g>
);
const Sofa = () => (
  <g fill={cinema.material.fabric} stroke={C.navy} strokeWidth={6}>
    <path d="M340 720V580Q340 540 390 540H1000Q1050 540 1050 590V780H340Z" />
    <path d="M320 725H1070V870H320Z" />
    <path d="M365 870V940M1030 870V940" fill="none" />
  </g>
);
const TV = ({ selected = false }: { selected?: boolean }) => {
  const animation = useObjectMotion("services");
  return (
    <g stroke={C.navy} strokeWidth={7}>
      <rect x={1240} y={380} width={470} height={300} rx={15} fill={C.navy} />
      <rect
        x={1260}
        y={400}
        width={430}
        height={255}
        rx={6}
        fill={cinema.environment.glass}
      />
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          opacity={
            animation
              ? Math.min(1, Math.max(0, (animation.p * 44 - i * 6) / 18))
              : 1
          }
        >
          <rect
            x={1295 + i * 120}
            y={470}
            width={95}
            height={115}
            rx={8}
            fill={i === 0 && selected ? C.yellow : C.white}
          />
          <path
            d={`M${1325 + i * 120} 505l35 24l-35 24Z`}
            fill={C.navy}
            stroke="none"
          />
        </g>
      ))}
      <path d="M1475 680V740M1390 740H1560" fill="none" />
    </g>
  );
};
const Entertainment = ({ locked = false }: { locked?: boolean }) => {
  const makeActor = useActorFactory();
  const sam = makeActor({
    x: 700,
    y: 1040,
    scale: 2.35,
    pose: "sitting",
    carry: true,
    expression: locked ? "frustrated" : "relieved",
  });
  return (
    <>
      <Sofa />
      <Actor actor={sam} />
      <Remote grip={toWorld(sam, sam.rig.rightArm.end)} />
      {locked ? (
        <g transform="translate(1310,430)" stroke={C.navy} strokeWidth={9}>
          <path d="M70 110V60a65 65 0 01130 0v50" fill="none" />
          <rect
            x={35}
            y={110}
            width={200}
            height={170}
            rx={20}
            fill={C.white}
          />
          <circle cx={135} cy={185} r={16} fill={C.navy} />
          <path d="M135 195V230" />
        </g>
      ) : (
        <TV selected />
      )}
    </>
  );
};
const Benefit = ({
  kind,
  x,
  y,
  scale = 1,
}: {
  kind: "desk" | "car" | "services" | "meal";
  x: number;
  y: number;
  scale?: number;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {kind === "desk" ? (
      <>
        <path
          d="M-240 0H240V22H-240Z M-210 22V300 M210 22V300"
          fill={cinema.material.wood}
          stroke={C.navy}
          strokeWidth={6}
        />
        <Laptop grip={{ x: 60, y: 0 }} open={1} />
      </>
    ) : kind === "car" ? (
      <Car x={0} y={0} scale={0.65} />
    ) : kind === "services" ? (
      <g stroke={C.navy} strokeWidth={5}>
        <rect
          x={-130}
          y={-140}
          width={260}
          height={170}
          rx={12}
          fill={C.white}
        />
        <path d="M-30 -100L60 -55L-30 -10Z" fill={C.yellow} />
        <path d="M-70 55H70M0 30V55" />
      </g>
    ) : (
      <DiningTable x={0} y={0} />
    )}
  </g>
);
const Portrait = ({
  expression = "thinking",
  amount,
  compare,
  x = 650,
  identity = "Sam",
}: {
  expression?: ReferenceExpression;
  amount?: number;
  compare?: number;
  x?: number;
  identity?: "Sam" | "Alex";
}) => {
  const makeActor = useActorFactory();
  const actor = makeActor({
    identity,
    x,
    y: 1600,
    scale: 4.7,
    pose: expression === "stressed" ? "stressed" : "standing",
    carry: amount !== undefined,
    expression,
  });
  return (
    <>
      <Actor actor={actor} />
      {amount !== undefined && (
        <Phone grip={toWorld(actor, actor.rig.rightArm.end)} amount={amount} />
      )}
      {compare !== undefined && (
        <g transform="translate(1100,390)">
          <Money x={0} y={0} value={compare} size={88} />
          <path d="M0 30H280" stroke={C.navy} strokeWidth={5} />
          <Money x={0} y={150} value={amount!} size={100} fill={C.teal} />
          <Money
            x={0}
            y={300}
            value={compare - amount!}
            size={62}
            fill={C.red}
          />
        </g>
      )}
    </>
  );
};
const Transfer = ({
  amount,
  identity = "Sam",
  shoulder = false,
  expenses,
}: {
  amount: number;
  identity?: "Sam" | "Alex";
  shoulder?: boolean;
  expenses?: number;
}) => {
  return (
    <>
      {shoulder && (
        <g
          transform={
            identity === "Alex" ? "translate(1920,0) scale(-1,1)" : undefined
          }
          stroke={C.navy}
          strokeWidth={9}
        >
          <path d="M-120 1080V850Q100 650 410 850L480 1080Z" fill="#3B82F6" />
          <path d="M145 640H265V790H145Z" fill={C.white} />
          <path
            d="M195 240C325 235 410 335 410 465C415 595 330 680 210 685C75 690 -20 600 -20 480C-25 350 65 245 195 240Z"
            fill={C.white}
          />
          <path
            d="M100 725Q200 780 315 725L340 835Q210 900 70 835Z"
            fill="#2563AB"
          />
        </g>
      )}
      <g transform={`translate(${shoulder ? 660 : 330},260) scale(3.3)`}>
        <Phone grip={{ x: 25, y: 125 }} amount={amount} />
      </g>
      <Arrow x={shoulder ? 1120 : 850} y={580} width={180} color={C.teal} />
      <CoinStack
        x={shoulder ? 1410 : 1220}
        y={790}
        value={amount}
        color={C.teal}
        width={230}
      />
      <Check x={shoulder ? 1530 : 1340} y={915} />
      {expenses !== undefined && (
        <Money
          x={1370}
          y={280}
          value={expenses}
          fill={C.red}
          size={76}
          anchor="middle"
        />
      )}
    </>
  );
};
const Contributions = ({
  values,
  color = C.yellow,
}: {
  values: number[];
  color?: string;
}) => (
  <>
    {values.map((v, i) => (
      <CoinStack
        key={i}
        x={260 + i * 340}
        y={810}
        value={v}
        width={200}
        color={color}
      />
    ))}
    <path
      d="M270 870H1130M270 850V890M1130 850V890"
      stroke={C.navy}
      strokeWidth={5}
    />
    <Money
      x={1460}
      y={590}
      value={values.reduce((a, b) => a + b, 0)}
      size={94}
      anchor="middle"
    />
    <Arrow x={1190} y={710} width={140} />
  </>
);
const Choice = ({
  identity = "Sam",
  cautious = false,
}: {
  identity?: "Sam" | "Alex";
  cautious?: boolean;
}) => {
  const makeActor = useActorFactory();
  const actor = makeActor({
    identity,
    x: 960,
    y: 970,
    scale: 2.5,
    pose: "explaining",
    expression: cautious ? "thinking" : "confident",
  });
  return (
    <>
      <Benefit
        kind={identity === "Alex" ? "car" : "desk"}
        x={380}
        y={700}
        scale={0.55}
      />
      <Actor actor={actor} />
      <path
        d="M710 620L540 520M1220 620L1390 520"
        stroke={C.navy}
        strokeWidth={5}
        fill="none"
      />
      <g stroke={C.navy} strokeWidth={6}>
        <path d="M1400 520H1690V820H1400Z" fill={C.teal} />
        <path d="M1440 500H1650" strokeWidth={14} />
      </g>
    </>
  );
};
const Rental = ({
  identity = "Sam",
  old = false,
  amount = false,
}: {
  identity?: "Sam" | "Alex";
  old?: boolean;
  amount?: boolean;
}) => {
  const makeActor = useActorFactory();
  const actor = makeActor({
    identity,
    x: 1430,
    facing: -1,
    carry: true,
    expression: old ? "thinking" : "relieved",
  });
  return (
    <>
      <Car old={old} x={730} y={790} scale={1.05} />
      <Actor actor={actor} keys />
      {amount && (
        <Money x={520} y={330} value={transport} fill={C.red} size={100} />
      )}
    </>
  );
};
const KeyInsert = ({ amount = rent }: { amount?: number }) => (
  <>
    <g transform="translate(660,610) scale(5)">
      <Keys point={{ x: 0, y: 0 }} />
    </g>
    <Money x={1060} y={600} value={amount} size={140} fill={C.red} />
  </>
);
const Recurring = ({ count = 3 }: { count?: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <g
        key={i}
        transform={`translate(${230 + i * 520},${360 + (i % 2) * 80})`}
      >
        <Calendar x={0} y={0} repeat />
        <g transform="translate(170,180) scale(2.2)">
          <Keys point={{ x: 0, y: 0 }} />
        </g>
        {i < count - 1 && <Arrow x={365} y={140} width={110} />}
      </g>
    ))}
  </>
);
const WorkBenefit = ({
  old = false,
  identity = "Sam",
  satisfied = false,
}: {
  old?: boolean;
  identity?: "Sam" | "Alex";
  satisfied?: boolean;
}) => (
  <>
    <DeskAction
      identity={identity}
      old={old}
      action="work"
      expression={satisfied ? "relieved" : "thinking"}
    />
    {!old && <StoryEnvironment location="sam-new" />}
  </>
);
const LifestyleCompare = ({
  rental = false,
  resolve = false,
}: {
  rental?: boolean;
  resolve?: boolean;
}) => (
  <ComparisonScene
    left={
      <g transform="translate(-70,80) scale(.65)">
        {rental ? <Rental /> : <WorkBenefit satisfied={resolve} />}
      </g>
    }
    right={
      <g transform="translate(-70,80) scale(.65)">
        {rental ? (
          <Rental identity="Alex" old />
        ) : (
          <WorkBenefit old identity="Alex" />
        )}
      </g>
    }
  />
);
const EqualStart = ({ full = false }: { full?: boolean }) => {
  const makeActor = useActorFactory();
  return (
    <ComparisonScene
      left={
        <>
          <Actor
            actor={makeActor({ x: 320, scale: 2.25, expression: "curious" })}
          />
          <Money
            x={570}
            y={460}
            value={full ? example.income : example.raise}
            size={75}
          />
          {full && (
            <>
              <Money
                x={570}
                y={590}
                value={example.expenses}
                size={58}
                fill={C.red}
              />
              <Money
                x={570}
                y={720}
                value={budget.before}
                size={64}
                fill={C.teal}
              />
            </>
          )}
        </>
      }
      right={
        <>
          <Actor
            actor={makeActor({
              identity: "Alex",
              x: 320,
              scale: 2.25,
              expression: "curious",
            })}
          />
          <Money
            x={570}
            y={460}
            value={full ? example.income : example.raise}
            size={75}
          />
          {full && (
            <>
              <Money
                x={570}
                y={590}
                value={example.expenses}
                size={58}
                fill={C.red}
              />
              <Money
                x={570}
                y={720}
                value={budget.before}
                size={64}
                fill={C.teal}
              />
            </>
          )}
        </>
      }
    />
  );
};
const AnnualGrid = ({ totals = false }: { totals?: boolean }) => (
  <>
    {[budget.sam, budget.alex].map((v, row) => (
      <g key={row}>
        <Money
          x={170}
          y={370 + row * 360}
          value={totals ? v * 12 : v}
          size={78}
        />
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i}>
            <rect
              x={650 + i * 85}
              y={240 + row * 360}
              width={70}
              height={230}
              fill="none"
              stroke={C.navy}
              strokeWidth={3}
            />
            <rect
              x={650 + i * 85}
              y={470 + row * 360 - (v / budget.alex) * 230}
              width={70}
              height={(v / budget.alex) * 230}
              fill={row ? C.teal : C.yellow}
              stroke={C.navy}
              strokeWidth={3}
            />
          </g>
        ))}
      </g>
    ))}
  </>
);
const Scope = ({ household = false }: { household?: boolean }) => {
  const makeActor = useActorFactory();
  return (
    <>
      <path
        d="M550 250H1410V990H550Z"
        stroke={C.navy}
        strokeDasharray="16 12"
        strokeWidth={5}
        fill="none"
      />
      <Actor actor={makeActor({ x: 770, expression: "thinking" })} />
      <Actor
        actor={makeActor({ identity: "Alex", x: 1210, expression: "thinking" })}
      />
      {household && (
        <g transform="translate(210,480)" stroke={C.navy} strokeWidth={7}>
          <path
            d="M-90 -80L0 -110L90 -80V25Q80 90 0 130Q-80 90 -90 25Z"
            fill={C.white}
          />
          <Check x={0} y={5} />
        </g>
      )}
    </>
  );
};
const SceneArt = ({ shot }: { shot: CinematicStillShot }) => {
  const makeActor = useActorFactory();
  const performance = useContext(EpisodeMotionContext);
  const pulse = performance
    ? interactionPulse(performance.frame, performance.motion)
    : 0;
  const { scene, index } = shot;
  switch (scene) {
    case "S01": {
      if (index) return <Portrait expression="worried" />;
      const actor = makeActor({
        x: 1040,
        y: 1020,
        scale: 2.9,
        pose: "celebrating",
        expression: "excited",
      });
      const hand = toWorld(actor, actor.rig.rightArm.end);
      return (
        <>
          <Actor actor={actor} />
          <g transform={`translate(${hand.x - 20},${hand.y - 135}) scale(.7)`}>
            <Slip x={0} y={0} amounts={[example.raise]} />
          </g>
        </>
      );
    }
    case "S02":
      return index === 0 ? (
        <>
          <DeskAction action="carry" expression="relieved" />
          <StoryEnvironment location="sam-new" />
          <GuestChair />
        </>
      ) : index === 1 ? (
        <Cabin />
      ) : (
        <Entertainment />
      );
    case "S03":
      return index === 0 ? (
        <Portrait expression="worried" />
      ) : (
        <>
          <g transform="translate(340,200) scale(4.5)">
            <Phone grip={{ x: 25, y: 125 }} statement />
          </g>
          <path
            d={`M1090 470h${budget.before * 1.5}v70h-${budget.before * 1.5}Z`}
            fill={C.yellow}
          />
          <path
            d={`M1090 650h${budget.sam * 1.5}v70h-${budget.sam * 1.5}Z`}
            fill={C.teal}
          />
        </>
      );
    case "S04":
      return index === 0 ? (
        <WorkBenefit old />
      ) : (
        <>
          <Benefit kind="desk" x={420} y={340} scale={0.6} />
          <Benefit kind="car" x={1050} y={300} scale={0.6} />
          <Benefit kind="services" x={1630} y={310} scale={0.8} />
          <Allocation y={660} amounts={false} />
        </>
      );
    case "S05":
      return <EqualStart />;
    case "S06":
      return index === 0 ? (
        <>
          <g transform="translate(430,430) scale(2)">
            <Envelope x={0} y={0} value={example.income} />
          </g>
          <Arrow x={1200} y={590} width={200} />
          <Check x={1510} y={590} />
        </>
      ) : index === 1 ? (
        <>
          <Money x={330} y={300} value={example.income} size={110} />
          <rect
            x={330}
            y={470}
            width={(example.expenses / example.income) * 1260}
            height={170}
            fill={C.red}
            stroke={C.navy}
            strokeWidth={5}
          />
          <rect
            x={330 + (example.expenses / example.income) * 1260}
            y={470}
            width={(budget.before / example.income) * 1260}
            height={170}
            fill={C.yellow}
            stroke={C.navy}
            strokeWidth={5}
          />
          <Money
            x={800}
            y={760}
            value={example.expenses}
            fill={C.red}
            size={80}
            anchor="middle"
          />
          <Money
            x={1530}
            y={760}
            value={budget.before}
            size={72}
            anchor="middle"
          />
        </>
      ) : (
        <Transfer amount={budget.before} />
      );
    case "S07":
      return <Scope />;
    case "S08":
      return index ? (
        <Rental old />
      ) : (
        <>
          <WorkBenefit old />
          <g transform="translate(1050,670)">
            <Cup x={0} y={0} />
            <Cup x={95} y={0} />
            <ellipse
              cx={175}
              cy={-8}
              rx={70}
              ry={18}
              fill={C.white}
              stroke={C.navy}
              strokeWidth={4}
            />
          </g>
        </>
      );
    case "S09":
      return (
        <>
          <CoinStack
            x={320}
            y={820}
            value={example.income}
            max={budget.income}
            width={300}
          />
          <CoinStack
            x={1150}
            y={820}
            value={budget.income}
            max={budget.income}
            width={300}
            color={C.teal}
          />
          <Money
            x={960}
            y={330}
            value={example.raise}
            size={85}
            anchor="middle"
          />
          <Arrow x={760} y={500} width={210} />
          <Money
            x={1310}
            y={960}
            value={budget.income - example.expenses}
            size={88}
            anchor="middle"
          />
        </>
      );
    case "S10":
      return <Choice />;
    case "S11":
      return <EqualStart full />;
    case "S12": {
      if (index === 0)
        return (
          <g transform="translate(600,170) scale(10)">
            <PhoneListing grip={{ x: 19, y: 60 }} />
          </g>
        );
      if (index === 1)
        return (
          <>
            <DeskAction action="carry" expression="curious" />
            <GuestChair />
            <StoryEnvironment location="sam-new" />
          </>
        );
      if (index === 2) {
        const actor = makeActor({ x: 780, y: 900, expression: "curious" });
        placeHands(
          actor,
          { right: { x: 930, y: 690 }, left: { x: 770, y: 690 } },
          7,
        );
        return (
          <>
            <WritingDesk x={650} y={690} width={1000} />
            <Actor actor={actor} />
            <Laptop grip={toWorld(actor, actor.rig.rightArm.end)} open={0.8} />
          </>
        );
      }
      return <WorkBenefit satisfied />;
    }
    case "S13":
      return (
        <>
          <g transform="translate(1450,310) scale(3)">
            <Keys point={{ x: 0, y: 0 }} />
          </g>
          <Allocation stage={1} y={580} />
        </>
      );
    case "S14":
      return index ? (
        <WorkBenefit old identity="Alex" />
      ) : (
        <g transform="translate(-630,-390) scale(1.9)">
          <DeskAction
            action="sign"
            expression="confident"
            items={
              <Money x={1180} y={640} value={example.raise - rent} size={62} />
            }
          />
        </g>
      );
    case "S15":
      return (
        <Transfer amount={monthOne} expenses={monthOneExpenses} shoulder />
      );
    case "S16":
      return <Pair values={[budget.before, monthOne]} />;
    case "S17":
      return (
        <>
          <g transform="translate(390,420)" stroke={C.navy} strokeWidth={7}>
            <path
              d="M0 0L180 -60L310 0L130 70Z M0 0V250L130 320L310 250V0 M130 70V320"
              fill={cinema.material.wood}
            />
          </g>
          <path
            d="M910 230V900"
            stroke={C.navy}
            strokeDasharray="18 16"
            strokeWidth={5}
          />
          <g transform="translate(1120,340)">
            <Calendar x={0} y={0} repeat />
            <Money x={165} y={480} value={rent} size={110} anchor="middle" />
          </g>
        </>
      );
    case "S18":
      return (
        <>
          <Benefit kind="desk" x={1350} y={500} />
          <Actor
            actor={makeActor({
              x: 520,
              y: 1000,
              scale: 2.45,
              pose: "sitting",
              expression: "relieved",
            })}
          />
          <DiningTable x={730} y={800} />
          <GuestChair x={1190} />
        </>
      );
    case "S19":
      return <Rental amount />;
    case "S20":
      return index ? <Rental identity="Alex" old /> : <Cabin />;
    case "S21":
      return index ? (
        <>
          <g transform="translate(0,-140)">
            <KeyInsert amount={transport} />
          </g>
          <Money x={1040} y={840} value={example.raise} size={125} />
        </>
      ) : (
        <KeyInsert amount={transport} />
      );
    case "S22":
      return index ? (
        <>
          <Portrait expression="shocked" x={450} />
          <Money
            x={1240}
            y={550}
            value={example.raise - rent - transport}
            size={180}
            anchor="middle"
          />
          <g transform="translate(1060,750) scale(.35)">
            <Allocation stage={2} x={0} y={0} amounts={false} />
          </g>
        </>
      ) : (
        <>
          <Benefit kind="desk" x={430} y={310} scale={0.6} />
          <Benefit kind="car" x={1240} y={310} scale={0.6} />
          <Allocation stage={2} />
        </>
      );
    case "S23":
      return (
        <>
          <CoinStack
            x={400}
            y={830}
            value={monthTwo}
            color={C.teal}
            width={300}
          />
          <Actor
            actor={makeActor({
              x: 1290,
              y: 1000,
              scale: 2.65,
              expression: "relieved",
            })}
          />
          <Money
            x={500}
            y={330}
            value={monthTwoExpenses}
            size={85}
            fill={C.red}
          />
        </>
      );
    case "S24":
      return (
        <>
          <Benefit kind="desk" x={420} y={380} scale={0.6} />
          <Benefit kind="car" x={1450} y={380} scale={0.6} />
          <path
            d="M420 550Q420 750 800 750M1450 550Q1450 750 1120 750"
            stroke={C.navy}
            strokeWidth={7}
            fill="none"
          />
          <Money
            x={960}
            y={870}
            value={rent + transport}
            size={130}
            anchor="middle"
          />
        </>
      );
    case "S25":
      return (
        <>
          <g transform="translate(250,340) scale(1.8)">
            <Remote grip={{ x: 0, y: 140 }} />
          </g>
          <Benefit kind="services" x={800} y={540} scale={1.2} />
          <g transform="translate(1390,380)" stroke={C.navy} strokeWidth={7}>
            <rect width={260} height={180} rx={20} fill={C.white} />
            <path d="M45 70H215M45 110H180" />
            <circle cx={65} cy={70} r={14} fill={C.yellow} />
            <circle cx={165} cy={110} r={14} fill={C.teal} />
          </g>
          <path d="M350 720H1580" stroke={C.navy} strokeWidth={5} />
          <Money x={960} y={900} value={services} size={135} anchor="middle" />
        </>
      );
    case "S26":
      return <Entertainment locked={index === 1} />;
    case "S27":
      return (
        <>
          <Money x={320} y={230} value={budget.added} size={110} fill={C.red} />
          <Allocation y={560} />
        </>
      );
    case "S28":
      return <Transfer amount={budget.sam} expenses={budget.samExpenses} />;
    case "S29":
      return (
        <Portrait
          expression="worried"
          amount={budget.sam}
          compare={budget.before}
        />
      );
    case "S30":
      return (
        <ComparisonScene
          left={
            <g transform="translate(-40,60) scale(.65)">
              <WorkBenefit satisfied />
            </g>
          }
          right={
            <>
              <CoinStack
                x={370}
                y={810}
                value={budget.sam}
                color={C.teal}
                width={220}
              />
              <Money
                x={480}
                y={960}
                value={budget.before - budget.sam}
                size={68}
                fill={C.red}
                anchor="middle"
              />
            </>
          }
        />
      );
    case "S31":
      return (
        <>
          <CoinStack
            x={740}
            y={840}
            value={budget.sam}
            color={C.teal}
            width={440}
          />
          <Arrow x={270} y={600} width={230} color={C.teal} />
          <path
            d="M1280 750Q1510 700 1630 470"
            stroke={C.teal}
            strokeWidth={9}
            fill="none"
          />
          <Check x={1640} y={390} />
        </>
      );
    case "S32":
      return (
        <Contributions
          values={
            index
              ? [budget.before, budget.before, budget.before]
              : [monthOne, monthTwo, budget.sam]
          }
          color={index ? cinema.material.fabric : C.yellow}
        />
      );
    case "S33":
      return index ? (
        <>
          {[monthOne, monthTwo, budget.sam].map((amount, i) => (
            <g key={i}>
              <Calendar x={230 + i * 520} y={300} />
              <rect
                x={250 + i * 520}
                y={465}
                width={300}
                height={90}
                fill={C.white}
              />
              <Money
                x={400 + i * 520}
                y={535}
                value={amount}
                size={65}
                anchor="middle"
              />
            </g>
          ))}
          <path
            d="M230 710V750H1610V710"
            stroke={C.navy}
            strokeWidth={5}
            fill="none"
          />
          <Money
            x={640}
            y={890}
            value={samThreeMonths}
            size={95}
            anchor="middle"
          />
          <Money
            x={1330}
            y={890}
            value={baselineThreeMonths}
            size={85}
            anchor="middle"
            fill={C.navy}
          />
        </>
      ) : (
        <>
          <Calendar x={790} y={230} repeat />
          <Money
            x={370}
            y={730}
            value={budget.before}
            size={120}
            anchor="middle"
          />
          <Arrow x={840} y={700} width={220} />
          <Money
            x={1450}
            y={730}
            value={budget.sam}
            size={120}
            anchor="middle"
            fill={C.teal}
          />
        </>
      );
    case "S34":
      return index ? (
        <>
          <Portrait expression="thinking" amount={budget.sam} x={1100} />
          <Money x={300} y={510} value={example.raise} size={125} />
        </>
      ) : (
        <>
          <Money x={350} y={300} value={budget.income} size={125} />
          <Arrow x={840} y={420} width={200} />
          <Money
            x={1330}
            y={460}
            value={budget.samExpenses}
            size={100}
            fill={C.red}
            anchor="middle"
          />
          <Money
            x={1330}
            y={800}
            value={budget.sam}
            size={125}
            fill={C.teal}
            anchor="middle"
          />
          <path d="M1110 570H1580" stroke={C.navy} strokeWidth={5} />
        </>
      );
    case "S35":
      return <Transfer amount={budget.sam} shoulder />;
    case "S36":
      return (
        <>
          <g stroke={C.navy} strokeWidth={7}>
            <path
              d="M960 310V900M680 900H1240 M470 470H1450M560 470L390 720H730Z M1360 470L1190 720H1530Z"
              fill="none"
            />
          </g>
          <g transform="translate(530,480) scale(.5)">
            <Car x={0} y={0} />
          </g>
          <g transform="translate(1300,430) scale(.75)">
            <Book x={0} y={0} open={false} />
          </g>
        </>
      );
    case "S37":
      return (
        <>
          <path
            d="M650 270H1280V920H650Z"
            fill="none"
            stroke={C.navy}
            strokeWidth={5}
            strokeDasharray="14 12"
          />
          <CoinStack
            x={800}
            y={800}
            value={budget.sam}
            color={C.teal}
            width={300}
          />
          <g opacity={0.35}>
            <Benefit kind="car" x={300} y={700} scale={0.35} />
            <Book x={1560} y={610} open={false} />
          </g>
        </>
      );
    case "S38":
      return (
        <>
          <Benefit kind="desk" x={390} y={420} scale={0.55} />
          <Benefit kind="car" x={1490} y={440} scale={0.55} />
          <Benefit kind="services" x={960} y={300} scale={0.7} />
          <Actor
            actor={makeActor({
              x: 960,
              y: 1000,
              scale: 2.1,
              pose: "confused",
              expression: "worried",
            })}
          />
          <Money x={360} y={900} value={budget.added} size={100} fill={C.red} />
          <Money
            x={1500}
            y={900}
            value={example.raise}
            size={100}
            anchor="middle"
          />
        </>
      );
    case "S39":
      return index ? (
        <>
          <g transform="translate(750,490) scale(2)">
            <DiningTable x={0} y={0} />
          </g>
          <Calendar x={250} y={250} />
          <Check x={410} y={420} scale={1.2} />
        </>
      ) : (
        <>
          <Actor
            actor={makeActor({
              x: 760,
              y: 1010,
              scale: 2.8,
              pose: "sitting",
              expression: "relieved",
            })}
          />
          <DiningTable x={1040} y={780} />
        </>
      );
    case "S40":
      return <Recurring count={index ? 3 : 1} />;
    case "S41":
      return (
        <>
          <Allocation stage={2} y={590} />
          <g transform="translate(480,290) scale(2.4)">
            <Keys point={{ x: 0, y: 0 }} />
          </g>
          <Benefit kind="car" x={1260} y={340} scale={0.5} />
        </>
      );
    case "S42":
      return index ? (
        <>
          <Pair values={[budget.sam, monthTwo]} />
          <Money
            x={960}
            y={340}
            value={services}
            size={100}
            anchor="middle"
            fill={C.red}
          />
        </>
      ) : (
        <>
          <Actor
            actor={makeActor({
              x: 650,
              y: 1000,
              scale: 3,
              pose: "thinking",
              expression: "curious",
            })}
          />
          <Benefit kind="services" x={1370} y={500} scale={1.4} />
          <Money x={1380} y={800} value={services} size={100} anchor="middle" />
        </>
      );
    case "S43": {
      if (index)
        return (
          <>
            <Actor
              actor={makeActor({
                identity: "Alex",
                x: 750,
                y: 1010,
                scale: 2.8,
                pose: "sitting",
                expression: "relieved",
              })}
            />
            <DiningTable x={1030} y={780} />
            <Money
              x={1440}
              y={350}
              value={example.alexAdded}
              size={95}
              anchor="middle"
            />
          </>
        );
      const actor = makeActor({
        identity: "Alex",
        x: 990,
        y: 1030,
        scale: 2.8,
        pose: "sitting",
        carry: true,
        expression: "happy",
      });
      placeHands(actor, {
        right: { x: 1130 + 8 * pulse, y: 690 + 12 * pulse },
        left: { x: 1210, y: 530 },
      });
      const hand = toWorld(actor, actor.rig.rightArm.end);
      const neck = toWorld(actor, actor.rig.leftArm.end);
      return (
        <>
          <Actor actor={actor} />
          <g stroke={C.navy} strokeWidth={5}>
            <ellipse
              cx={hand.x}
              cy={hand.y + 55}
              rx={80}
              ry={95}
              fill={cinema.material.wood}
            />
            <path
              d={`M${hand.x} ${hand.y}L${neck.x} ${neck.y}`}
              stroke={cinema.material.wood}
              strokeWidth={25}
            />
            <path
              d={`M${hand.x} ${hand.y + 45}L${neck.x} ${neck.y}`}
              stroke={C.navy}
              strokeWidth={3}
            />
            <circle cx={hand.x} cy={hand.y + 40} r={20} fill={C.navy} />
          </g>
          <Money x={390} y={530} value={example.alexAdded} size={105} />
        </>
      );
    }
    case "S44":
      return (
        <Transfer
          identity="Alex"
          amount={budget.alex}
          expenses={budget.alexExpenses}
        />
      );
    case "S45":
      return (
        <>
          <g transform="translate(380,0)">
            <CoinStack x={0} y={810} value={budget.before} width={250} />
            <CoinStack
              x={380}
              y={810}
              value={budget.alex - budget.before}
              width={250}
              color={C.teal}
            />
            <path
              d="M290 600H340M315 575V625"
              stroke={C.navy}
              strokeWidth={8}
            />
            <Money
              x={315}
              y={980}
              value={budget.alex}
              size={105}
              anchor="middle"
            />
          </g>
          <CoinStack
            x={1450}
            y={810}
            value={example.alexAdded}
            width={220}
            color={C.yellow}
          />
        </>
      );
    case "S46":
      return (
        <>
          <Calendar x={390} y={340} />
          <Check x={555} y={520} />
          <Arrow x={820} y={560} width={200} />
          <CoinStack
            x={1190}
            y={820}
            value={budget.alex}
            width={300}
            color={C.teal}
          />
        </>
      );
    case "S47":
      return (
        <>
          <Actor
            actor={makeActor({
              identity: "Alex",
              x: 1280,
              y: 1050,
              scale: 2.85,
              facing: -1,
              pose: "explaining",
              expression: "thinking",
            })}
          />
          <g transform="translate(600,680) scale(1.8)">
            <Guitar x={0} y={0} />
          </g>
          <path
            d="M830 360V850"
            stroke={C.navy}
            strokeWidth={5}
            strokeDasharray="14 14"
          />
        </>
      );
    case "S48":
      return <LifestyleCompare rental={index === 1} />;
    case "S49":
      return <Scope household />;
    case "S50":
      return index ? (
        <Pair values={[samThreeMonths, alexThreeMonths]} gap />
      ) : (
        <Contributions
          values={[budget.alex, budget.alex, budget.alex]}
          color={C.teal}
        />
      );
    case "S51":
      return index ? (
        <Pair values={[budget.sam, budget.alex]} gap />
      ) : (
        <>
          <Actor actor={makeActor({ x: 490, expression: "thinking" })} />
          <Actor
            actor={makeActor({
              identity: "Alex",
              x: 1430,
              expression: "thinking",
            })}
          />
          <Money
            x={490}
            y={270}
            value={example.raise}
            size={100}
            anchor="middle"
          />
          <Money
            x={1430}
            y={270}
            value={example.raise}
            size={100}
            anchor="middle"
          />
          <path
            d="M900 550H1020M900 590H1020"
            stroke={C.navy}
            strokeWidth={10}
          />
        </>
      );
    case "S52":
      return (
        <ComparisonScene
          left={
            <>
              <Actor
                actor={makeActor({
                  x: 280,
                  scale: 2.3,
                  carry: true,
                  expression: "relieved",
                })}
                keys
              />
              <WritingDesk x={430} y={690} width={430} />
              <Laptop grip={{ x: 650, y: 690 }} open={1} />
              <Car x={670} y={920} scale={0.25} />
            </>
          }
          right={
            <>
              <Actor
                actor={makeActor({
                  identity: "Alex",
                  x: 280,
                  scale: 2.3,
                  expression: index ? "relieved" : "confident",
                })}
              />
              <CoinStack
                x={560}
                y={820}
                value={budget.alex}
                width={240}
                color={C.teal}
              />
            </>
          }
        />
      );
    case "S53":
      return index ? (
        <>
          <Actor
            actor={makeActor({
              x: 510,
              y: 1050,
              scale: 2.7,
              carry: true,
              expression: "thinking",
            })}
            keys
          />
          <Benefit kind="desk" x={1270} y={640} scale={1} />
          <StoryEnvironment location="sam-new" />
        </>
      ) : (
        <Portrait expression="stressed" x={1100} />
      );
    case "S54":
      return (
        <>
          <g transform="translate(580,170) rotate(4)">
            <Slip
              x={0}
              y={0}
              width={650}
              amounts={[rent, transport, services]}
              color={C.red}
            />
          </g>
          <Money
            x={1460}
            y={780}
            value={budget.sam}
            size={100}
            anchor="middle"
          />
          <Arrow x={1320} y={560} width={150} />
        </>
      );
    case "S55":
      return <Choice cautious />;
    case "S56":
      return index ? (
        <>
          <Calendar x={350} y={350} />
          <Arrow x={810} y={550} width={180} />
          <Money
            x={1320}
            y={570}
            value={-services}
            size={150}
            anchor="middle"
          />
          <Check x={1320} y={770} />
        </>
      ) : (
        <>
          <Benefit kind="services" x={670} y={590} scale={2} />
          <path
            d="M470 330L870 650M870 330L470 650"
            stroke={C.red}
            strokeWidth={14}
          />
          <Money
            x={1360}
            y={610}
            value={-services}
            size={140}
            anchor="middle"
          />
        </>
      );
    case "S57":
      return (
        <>
          <Actor
            actor={makeActor({
              x: 920,
              y: 1030,
              scale: 2.6,
              carry: true,
              expression: "thinking",
            })}
            keys
          />
          <Benefit kind="desk" x={400} y={700} scale={0.6} />
          <Benefit kind="car" x={1490} y={760} scale={0.55} />
          <Money x={400} y={380} value={rent} size={95} anchor="middle" />
          <Money x={1470} y={380} value={transport} size={95} anchor="middle" />
        </>
      );
    case "S58":
      return (
        <>
          <CoinStack
            x={330}
            y={840}
            value={budget.sam}
            color={C.yellow}
            width={260}
          />
          <Money
            x={850}
            y={640}
            value={services}
            size={85}
            anchor="middle"
            fill={C.teal}
          />
          <Arrow x={750} y={740} width={230} color={C.teal} />
          <CoinStack
            x={1230}
            y={840}
            value={monthTwo}
            width={310}
            color={C.teal}
          />
          <Money
            x={960}
            y={270}
            value={monthTwoExpenses}
            size={90}
            anchor="middle"
            fill={C.red}
          />
        </>
      );
    case "S59":
      return (
        <>
          <Actor
            actor={makeActor({
              x: 1360,
              y: 1030,
              scale: 2.6,
              facing: -1,
              carry: true,
              expression: "confident",
            })}
            keys
          />
          <Calendar x={360} y={320} />
          <Check x={530} y={500} />
          <Benefit kind="car" x={650} y={850} scale={0.4} />
        </>
      );
    case "S60":
      return (
        <>
          <path
            d="M340 430H740V650H340Z"
            fill={C.yellow}
            stroke={C.navy}
            strokeWidth={6}
          />
          <Arrow x={810} y={540} width={210} />
          <g transform="translate(1190,390)">
            <Calendar x={0} y={0} repeat />
          </g>
          <path
            d="M1400 790Q1400 940 660 900"
            stroke={C.red}
            strokeWidth={8}
            fill="none"
          />
          <Money x={400} y={920} value={monthTwo} size={95} />
        </>
      );
    case "S61":
      return <AnnualGrid totals={index === 1} />;
    case "S62":
      return <Pair values={[samAnnual, alexAnnual]} gap annual />;
    case "S63":
      return index ? (
        <>
          <Actor
            actor={makeActor({
              x: 1250,
              y: 1030,
              scale: 2.7,
              expression: "confident",
            })}
          />
          <CoinStack
            x={400}
            y={820}
            value={monthTwo}
            width={300}
            color={C.teal}
          />
        </>
      ) : (
        <>
          <g transform="translate(960,600) scale(2.2)">
            <Book x={0} y={0} open={false} />
            {Array.from({ length: 12 }, (_, i) => (
              <rect
                key={i}
                x={-165 + i * 28}
                y={-60}
                width={20}
                height={55}
                fill={i < 6 ? C.yellow : C.teal}
                stroke={C.navy}
                strokeWidth={1}
              />
            ))}
          </g>
        </>
      );
    case "S64":
      return <Choice />;
    case "S65":
      return (
        <>
          <g transform="translate(350,90) scale(.8)">
            <WorkBenefit satisfied />
          </g>
          <Money x={290} y={250} value={budget.income} size={95} />
          <Money
            x={290}
            y={400}
            value={monthTwoExpenses}
            size={80}
            fill={C.red}
          />
          <Money x={290} y={550} value={monthTwo} size={95} fill={C.teal} />
          <Check x={400} y={720} />
        </>
      );
    case "S66":
      return index ? (
        <>
          <Actor
            actor={makeActor({
              x: 1110,
              y: 1040,
              scale: 2.8,
              expression: "confident",
              carry: true,
            })}
            keys
          />
          <CoinStack
            x={330}
            y={840}
            value={monthTwo}
            width={300}
            color={C.teal}
          />
        </>
      ) : (
        <>
          <Allocation y={560} />
          <Money x={400} y={250} value={budget.added} size={105} fill={C.red} />
        </>
      );
    case "S67":
      return (
        <>
          <Portrait expression="confident" amount={monthTwo} />
          <Money x={1380} y={480} value={monthTwo} size={150} anchor="middle" />
          <Check x={1380} y={670} scale={1.6} />
        </>
      );
    default:
      throw new Error(`No art direction for ${shot.id}`);
  }
};

export const CinematicStoryboardStudy = ({
  shotId,
  foreground,
}: {
  shotId: string;
  foreground?: ReactNode;
}) => {
  const shot = cinematicStillShots.find((shot) => shot.id === shotId);
  if (!shot) throw new Error(`Unknown still ${shotId}`);
  if (["S05", "S11", "S30", "S48", "S52"].includes(shot.scene))
    return (
      <>
        <SceneArt shot={shot} />
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0, zIndex: 2 }}
        >
          {foreground}
        </svg>
      </>
    );
  return (
    <NarrativeScene
      foreground={foreground}
      view={
        shot.scene === "S12" && shot.index === 2
          ? storyboardViews.hands
          : storyboardViews.wide
      }
    >
      <SceneArt shot={shot} />
    </NarrativeScene>
  );
};
const TypographyEpisode = (props: TypographyReviewProps) => (
  <EpisodeReview
    {...props}
    renderArt={(shotId, foreground) => (
      <CinematicStoryboardStudy shotId={shotId} foreground={foreground} />
    )}
  />
);
registerRoot(() => (
  <>
    <Composition
      id="TypographyGallery"
      component={TypographyGallery}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={360}
    />
    <Composition
      id="CinematicStoryboardStudy"
      component={CinematicStoryboardStudy}
      fps={30}
      width={1920}
      height={1080}
      durationInFrames={90}
      defaultProps={{ shotId: cinematicStillShots[0].id }}
    />
    <Composition
      id="TypographyEpisode"
      component={TypographyEpisode}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={1}
      defaultProps={{ data: null } as TypographyReviewProps}
      calculateMetadata={async ({ props }) => {
        const data =
          props.data ??
          ((await (
            await fetch(staticFile("typography-review.json"))
          ).json()) as CompiledTypography);
        return {
          durationInFrames: data.timeline.durationInFrames,
          props: { data },
        };
      }}
    />
  </>
));
