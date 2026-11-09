import type { ReactNode } from "react";
import { Composition, registerRoot } from "remotion";
import { ReferenceCharacterRig } from "../characters/ReferenceCharacterRig";
import {
  referenceSkeleton,
  type ReferenceExpression,
  type ReferencePose,
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
  baselineThreeMonths,
  samAnnual,
  alexAnnual,
} from "./remainingShots";
import {
  cinematicStillShots,
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
}) => (
  <SceneText x={x} y={y} size={size} fill={fill} anchor={anchor}>
    {positive ? "+" : ""}
    {usd(value)}
  </SceneText>
);
const makeActor = ({
  identity = "Sam",
  x = 650,
  y = 940,
  scale = 2.15,
  pose = "standing",
  expression = "thinking",
  carry = false,
}: {
  identity?: "Sam" | "Alex";
  x?: number;
  y?: number;
  scale?: number;
  pose?: ReferencePose;
  expression?: ReferenceExpression;
  carry?: boolean;
} = {}): PerformanceActor => ({
  identity,
  x,
  y,
  scale,
  facing: 1,
  expression,
  rig: referenceSkeleton({
    frame: 60,
    pose,
    fromPose: pose,
    gesture: carry ? "holdWallet" : undefined,
    blendFrames: 1,
  }),
});
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
}: {
  grip: Point;
  amount?: number;
  comparison?: number[];
  selected?: boolean;
}) => (
  <g
    transform={`translate(${grip.x - 25},${grip.y - 125})`}
    stroke={C.navy}
    strokeWidth={3}
  >
    <rect width={100} height={145} rx={11} fill={C.navy} />
    <rect x={7} y={9} width={86} height={119} rx={6} fill={C.white} />
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
  </g>
);
const Sheet = ({ children }: { children: ReactNode }) => (
  <g>
    <path
      d="M450 600L1610 540L1810 940H330Z"
      fill={cinema.material.wood}
      stroke={C.navy}
      strokeWidth={6}
    />
    <path d="M400 940V1000 M1730 940V1000" stroke={C.navy} strokeWidth={7} />
    {children}
  </g>
);
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
}) => (
  <g transform={`translate(${x},${y})`} stroke={C.navy} strokeWidth={4}>
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
}) => (
  <g
    transform={`translate(${x},${y}) scale(${scale})`}
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
const Cabin = ({ old = false }: { old?: boolean }) => {
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
  const person = makeActor({
    identity,
    x: 700,
    pose: action === "work" ? "sitting" : "standing",
    expression,
    carry: action === "phone" || action === "keep",
  });
  const grip = toWorld(person, person.rig.rightArm.end);
  if (action === "sign" || action === "list")
    placeHands(person, { right: { x: 855, y: 665 } }, 7);
  if (action === "work")
    placeHands(person, { right: { x: 780, y: 685 }, left: { x: 655, y: 685 } });
  if (action === "carry")
    placeHands(person, { right: { x: 820, y: 650 }, left: { x: 680, y: 650 } });
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
const Banking = ({
  identity = "Sam",
  amount,
  expenses,
  compare,
}: {
  identity?: "Sam" | "Alex";
  amount: number;
  expenses?: number;
  compare?: number;
}) => {
  const person = makeActor({
    identity,
    x: 690,
    carry: true,
    expression: "thinking",
  });
  const grip = toWorld(person, person.rig.rightArm.end);
  return (
    <>
      <WritingDesk x={760} y={690} width={780} old={identity === "Alex"} />
      {expenses !== undefined && (
        <Slip x={1130} y={405} amounts={[expenses]} color={C.red} tilt={4} />
      )}
      <Actor actor={person} />
      <Phone
        grip={grip}
        amount={compare === undefined ? amount : undefined}
        comparison={compare === undefined ? undefined : [compare, amount]}
      />
      <Slip x={970} y={590} amounts={[amount]} color={C.teal} />
    </>
  );
};
const Commitments = ({
  stage = 3,
  showRaise = true,
}: {
  stage?: 1 | 2 | 3;
  showRaise?: boolean;
}) => {
  const sam = makeActor({
    x: 590,
    expression: stage === 3 ? "worried" : "thinking",
  });
  placeHands(sam, { right: { x: 760, y: 650 } }, 7);
  return (
    <>
      <WritingDesk x={720} y={720} width={1030} />
      <Actor actor={sam} />
      <Slip x={800} y={520} amounts={[rent]} color={C.red} tilt={-6} />
      {stage >= 2 && (
        <>
          <Slip x={1110} y={560} amounts={[transport]} color={C.red} tilt={3} />
          <Keys point={{ x: 1400, y: 745 }} />
        </>
      )}
      {stage === 3 && <Phone grip={{ x: 1550, y: 730 }} amount={services} />}{" "}
      {showRaise && <Envelope x={790} y={820} scale={0.75} />}
    </>
  );
};
const Equal = ({
  values,
  showHobby = false,
  starting = false,
}: {
  values?: [number, number];
  showHobby?: boolean;
  starting?: boolean;
}) => (
  <ComparisonScene
    left={
      <>
        <WritingDesk x={490} y={730} width={380} old={starting} />
        <Actor
          actor={makeActor({
            x: 350,
            scale: 1.95,
            expression: "curious",
            carry: true,
          })}
        />
        {starting ? (
          <Cup x={835} y={726} />
        ) : (
          <Laptop grip={{ x: 720, y: 730 }} open={1} />
        )}
        {values && <Slip x={535} y={515} amounts={[values[0]]} />}
      </>
    }
    right={
      <>
        <WritingDesk x={490} y={730} width={380} old />
        <Actor
          actor={makeActor({
            identity: "Alex",
            x: 350,
            scale: 1.95,
            expression: "thinking",
            carry: true,
          })}
        />
        <Cup x={835} y={726} />
        {showHobby && <Guitar x={160} y={880} />}{" "}
        {values && (
          <Slip x={535} y={515} amounts={[values[1]]} color={C.teal} />
        )}
      </>
    }
  />
);

const SceneArt = ({ shot }: { shot: CinematicStillShot }) => {
  const { scene, index } = shot;
  switch (scene) {
    case "S01": {
      const sam = makeActor({
        x: 700,
        pose: index ? "thinking" : "celebrating",
        expression: index ? "worried" : "excited",
        carry: !!index,
      });
      const hand = toWorld(sam, sam.rig.rightArm.end);
      return (
        <>
          <Actor actor={sam} />
          {index ? (
            <Phone grip={hand} />
          ) : (
            <g
              transform={`translate(${hand.x - 15},${hand.y - 100}) scale(.55)`}
            >
              <Slip x={0} y={0} amounts={[example.raise]} />
            </g>
          )}
          {!index && <Envelope x={1090} y={610} />}
        </>
      );
    }
    case "S02":
      return index === 0 ? (
        <>
          <DeskAction action="carry" expression="relieved" />
          <GuestChair />
          <StoryEnvironment location="sam-new" />
        </>
      ) : index === 1 ? (
        <Cabin />
      ) : (
        <DeskAction action="phone" expression="relieved" />
      );
    case "S03": {
      const sam = makeActor({ x: 720, carry: true, expression: "worried" });
      const hand = toWorld(sam, sam.rig.rightArm.end);
      return (
        <>
          <WritingDesk />
          <Actor actor={sam} />
          <PhoneListing grip={hand} />
          <g transform="translate(1130,420)">
            <rect width={370} height={380} rx={24} fill={C.navy} />
            <rect
              x={14}
              y={18}
              width={342}
              height={340}
              rx={14}
              fill={C.white}
            />
            <rect x={45} y={95} width={270} height={25} fill={C.yellow} />
            <rect
              x={45}
              y={220}
              width={(270 * budget.sam) / budget.before}
              height={25}
              fill={C.yellow}
            />
          </g>
        </>
      );
    }
    case "S04":
      return index === 0 ? <DeskAction action="work" /> : <Commitments />;
    case "S05":
      return <Equal values={[example.raise, example.raise]} />;
    case "S06":
      return index === 0 ? (
        <DeskAction
          action="phone"
          amount={example.income}
          items={<Envelope x={1150} y={520} value={example.income} />}
        />
      ) : index === 1 ? (
        <Banking amount={budget.before} expenses={example.expenses} />
      ) : (
        <Banking amount={budget.before} />
      );
    case "S07":
      return (
        <DeskAction
          action="list"
          old
          items={
            <>
              <Slip x={1150} y={470} color={C.teal} />
              <Book x={1340} y={690} open={false} />
            </>
          }
        />
      );
    case "S08":
      return index === 0 ? (
        <DeskAction action="work" old expression="worried" />
      ) : (
        <>
          <Car old />
          <Actor
            keys
            actor={makeActor({ x: 1660, carry: true, expression: "thinking" })}
          />
        </>
      );
    case "S09":
      return (
        <>
          <DeskAction
            action="list"
            expression="curious"
            items={
              <>
                <Envelope x={1110} y={430} value={budget.income} />
                <Slip
                  x={1270}
                  y={650}
                  amounts={[example.expenses]}
                  color={C.red}
                />
              </>
            }
          />
          <Slip
            x={850}
            y={770}
            amounts={[budget.income - example.expenses]}
            color={C.teal}
          />
        </>
      );
    case "S10":
      return (
        <>
          <DeskAction action="list" expression="curious" />
          <Envelope x={1190} y={420} />
          <Keys point={{ x: 1350, y: 770 }} />
          <Slip x={1040} y={720} color={C.teal} />
        </>
      );
    case "S11":
      return <Equal starting values={[example.raise, example.raise]} />;
    case "S13":
      return (
        <>
          <Commitments stage={1} />
          <Slip
            x={1330}
            y={510}
            amounts={[example.raise - rent]}
            color={C.teal}
          />
        </>
      );
    case "S14":
      return index === 0 ? (
        <DeskAction
          action="sign"
          expression="confident"
          items={<Envelope x={1150} y={470} value={example.raise - rent} />}
        />
      ) : (
        <DeskAction
          identity="Alex"
          action="work"
          old
          items={<Slip x={1220} y={560} />}
        />
      );
    case "S15":
      return <Banking amount={monthOne} expenses={monthOneExpenses} />;
    case "S16":
      return (
        <DeskAction
          action="work"
          expression="relieved"
          items={
            <>
              <Slip x={1130} y={380} amounts={[budget.before]} width={220} />
              <Slip
                x={1400}
                y={420}
                amounts={[monthOne]}
                width={220}
                color={C.teal}
              />
            </>
          }
        />
      );
    case "S17":
      return (
        <>
          <DeskAction
            action="list"
            items={<Slip x={1190} y={420} amounts={[rent]} color={C.red} />}
          />
          <g transform="translate(1550,760)" stroke={C.navy} strokeWidth={5}>
            <path
              d="M0 0l130 -20l65 45l-130 30Z M0 0V150l65 45l130 -30V25 M65 55V195"
              fill={cinema.material.wood}
            />
          </g>
          <path
            d="M1480 580V970"
            stroke={C.navy}
            strokeDasharray="12 10"
            strokeWidth={3}
          />
        </>
      );
    case "S18":
      return (
        <>
          <DeskAction action="keep" expression="relieved" />
          <DiningTable x={1540} y={770} />
        </>
      );
    case "S19":
      return (
        <>
          <Car />
          <Actor
            keys
            actor={makeActor({ x: 1680, carry: true, expression: "relieved" })}
          />
          <Slip x={390} y={300} amounts={[transport]} color={C.red} />
        </>
      );
    case "S20":
      return index === 0 ? (
        <Cabin />
      ) : (
        <>
          <Car old />
          <Actor
            keys
            actor={makeActor({
              identity: "Alex",
              x: 1660,
              carry: true,
              expression: "thinking",
            })}
          />
        </>
      );
    case "S23":
      return (
        <Banking
          amount={monthTwo}
          expenses={monthTwoExpenses}
          compare={budget.before}
        />
      );
    case "S24":
      return (
        <>
          <DeskAction
            action="list"
            items={
              <>
                <Slip
                  x={1180}
                  y={430}
                  amounts={[rent, transport]}
                  color={C.red}
                />
                <Book x={1410} y={800} open={false} />
              </>
            }
          />
          <Slip x={880} y={770} color={C.teal} />
        </>
      );
    case "S25":
      return (
        <>
          <DeskAction action="phone" expression="relieved" />
          <Slip x={1190} y={420} amounts={[services]} color={C.red} />
          <Keys point={{ x: 1430, y: 790 }} />
        </>
      );
    case "S26":
      return index === 0 ? (
        <DeskAction action="phone" expression="curious" />
      ) : (
        <DeskAction identity="Alex" action="phone" old expression="thinking" />
      );
    case "S27":
      return (
        <>
          <Commitments />
          <Money
            x={1500}
            y={410}
            value={budget.added}
            anchor="middle"
            size={76}
          />
        </>
      );
    case "S28":
      return <Banking amount={budget.sam} expenses={budget.samExpenses} />;
    case "S29":
      return <Banking amount={budget.sam} compare={budget.before} />;
    case "S30":
      return (
        <>
          <DeskAction action="keep" expression="thinking" />
          <Slip x={1210} y={430} amounts={[budget.sam]} color={C.teal} />
          <StoryEnvironment location="sam-new" />
        </>
      );
    case "S31":
      return (
        <>
          <DeskAction action="list" items={<Book x={1330} y={660} open />} />
          <Slip x={1090} y={390} amounts={[budget.sam]} color={C.teal} />
        </>
      );
    case "S32":
      return (
        <>
          <DeskAction action="list" />
          {(index
            ? [budget.before, budget.before, budget.before]
            : [monthOne, monthTwo, budget.sam]
          ).map((amount, i) => (
            <Slip
              key={i}
              x={820 + i * 270}
              y={470 + i * 35}
              amounts={[amount]}
              width={225}
              color={index ? cinema.material.fabric : C.teal}
            />
          ))}
          <Money
            x={1250}
            y={950}
            value={index ? baselineThreeMonths : samThreeMonths}
            size={82}
            anchor="middle"
          />
        </>
      );
    case "S33":
      return (
        <>
          <DeskAction action="list" />
          {(index
            ? [samThreeMonths, baselineThreeMonths]
            : [budget.sam, budget.before]
          ).map((amount, i) => (
            <Slip
              key={i}
              x={930 + i * 345}
              y={460}
              amounts={[amount]}
              color={i ? cinema.material.fabric : C.teal}
            />
          ))}
        </>
      );
    case "S34":
      return index === 0 ? (
        <>
          <DeskAction action="list" />
          <Envelope x={1180} y={420} />
          <Slip x={970} y={710} amounts={[budget.sam]} color={C.teal} />
        </>
      ) : (
        <DeskAction
          identity="Alex"
          action="list"
          old
          items={<Book x={1280} y={690} open />}
        />
      );
    case "S35":
      return <Banking amount={budget.sam} />;
    case "S36":
      return (
        <>
          <DeskAction action="list" />
          <Book x={1240} y={650} />
          <g transform="translate(1240,600)" stroke={C.navy} strokeWidth={5}>
            <path
              d="M0 -80V60 M-140 -50H140 M-110 -50l-50 85h100Z M110 -50l-50 85h100Z"
              fill="none"
            />
          </g>
        </>
      );
    case "S37":
      return (
        <DeskAction
          action="list"
          items={
            <>
              <Book x={1390} y={690} open={false} />
              <Slip x={1010} y={430} amounts={[budget.sam]} color={C.teal} />
            </>
          }
        />
      );
    case "S38":
      return (
        <>
          <Commitments />
          <Money x={1310} y={410} value={budget.added} size={76} />
        </>
      );
    case "S39":
      return index === 0 ? (
        <>
          <Actor
            actor={makeActor({
              x: 760,
              pose: "sitting",
              expression: "relieved",
            })}
          />
          <DiningTable x={930} y={760} />
        </>
      ) : (
        <>
          <DeskAction action="list" />
          <Calendar x={1130} y={400} />
          <Slip x={850} y={665} color={C.teal} />
        </>
      );
    case "S40":
      return (
        <>
          <DeskAction action="list" />
          <Calendar x={1050} y={450} repeat={index === 1} />
          {index === 1 && <Calendar x={1300} y={520} repeat />}
          <Slip x={850} y={720} color={C.red} />
        </>
      );
    case "S41":
      return (
        <>
          <Commitments stage={2} />
          <Slip
            x={1400}
            y={450}
            amounts={[example.raise - rent - transport]}
            color={C.teal}
          />
        </>
      );
    case "S42":
      return index === 0 ? (
        <Banking amount={budget.sam} compare={monthTwo} />
      ) : (
        <DeskAction
          identity="Alex"
          action="list"
          old
          items={<Book x={1310} y={690} open />}
        />
      );
    case "S43":
      return index === 0 ? (
        <>
          <DeskAction identity="Alex" action="keep" old expression="relieved" />
          <Guitar />
          <Slip x={1220} y={410} amounts={[example.alexAdded]} color={C.teal} />
        </>
      ) : (
        <>
          <Actor
            actor={makeActor({
              identity: "Alex",
              x: 760,
              pose: "sitting",
              expression: "relieved",
            })}
          />
          <DiningTable x={930} y={760} />
          <Envelope x={1220} y={420} value={example.alexAdded} />
        </>
      );
    case "S44":
      return (
        <Banking
          identity="Alex"
          amount={budget.alex}
          expenses={budget.alexExpenses}
        />
      );
    case "S45":
      return (
        <>
          <DeskAction identity="Alex" action="list" old />
          {[budget.before, budget.alex - budget.before, example.alexAdded].map(
            (value, i) => (
              <Slip
                key={i}
                x={830 + i * 275}
                y={480 + i * 40}
                amounts={[value]}
                color={i < 2 ? C.teal : C.yellow}
                width={225}
              />
            ),
          )}
          <Money x={1100} y={410} value={budget.alex} size={78} />
        </>
      );
    case "S46":
      return (
        <>
          <Banking
            identity="Alex"
            amount={budget.alex}
            expenses={budget.alexExpenses}
          />
          <Calendar x={1320} y={560} />
        </>
      );
    case "S47":
      return (
        <DeskAction
          identity="Alex"
          action="list"
          old
          items={
            <>
              <Slip x={1210} y={500} />
              <Keys point={{ x: 1450, y: 800 }} />
            </>
          }
        />
      );
    case "S48":
      return index === 0 ? (
        <Equal showHobby />
      ) : (
        <>
          <Car old x={750} scale={0.65} />
          <Car x={1590} scale={0.65} />
          <Actor
            keys
            actor={makeActor({
              identity: "Alex",
              x: 280,
              scale: 1.8,
              carry: true,
            })}
          />
          <Actor
            keys
            actor={makeActor({
              x: 1120,
              scale: 1.8,
              carry: true,
              expression: "relieved",
            })}
          />
        </>
      );
    case "S49":
      return (
        <>
          <Actor actor={makeActor({ x: 720, expression: "thinking" })} />
          <Actor
            actor={makeActor({
              identity: "Alex",
              x: 1180,
              expression: "thinking",
            })}
          />
          <path
            d="M490 310H1430V990H490Z"
            stroke={C.navy}
            strokeWidth={3}
            strokeDasharray="12 10"
            fill="none"
          />
        </>
      );
    case "S53":
      return index === 0 ? (
        <DeskAction action="list" expression="stressed" />
      ) : (
        <>
          <DeskAction action="keep" expression="thinking" />
          <StoryEnvironment location="sam-new" />
        </>
      );
    case "S54":
      return (
        <DeskAction
          action="list"
          items={
            <>
              <Slip
                x={1130}
                y={400}
                amounts={[rent, transport, services]}
                color={C.red}
              />
              <Slip x={1440} y={610} color={C.teal} />
            </>
          }
        />
      );
    case "S55":
      return (
        <DeskAction
          action="phone"
          expression="confident"
          items={
            <>
              <Book x={1300} y={690} open />
              <Slip x={1120} y={460} color={C.teal} />
            </>
          }
        />
      );
    case "S56":
      return index === 0 ? (
        <>
          <DeskAction action="phone" />
          <Slip x={1200} y={420} amounts={[-services]} color={C.teal} />
          <path
            d="M1215 550L1380 670 M1380 550L1215 670"
            stroke={C.red}
            strokeWidth={6}
          />
        </>
      ) : (
        <>
          <DeskAction action="list" />
          <Calendar x={1140} y={410} />
          <Slip x={840} y={670} amounts={[-services]} color={C.teal} />
        </>
      );
    case "S57":
      return <Commitments stage={2} showRaise={false} />;
    case "S58":
      return <Banking amount={monthTwo} expenses={monthTwoExpenses} />;
    case "S59":
      return (
        <DeskAction
          action="keep"
          items={
            <>
              <Book x={1310} y={690} open={false} />
              <Calendar x={1100} y={410} />
            </>
          }
        />
      );
    case "S60":
      return (
        <>
          <DeskAction action="list" />
          <Envelope x={1120} y={400} value={budget.income} />
          <Slip x={1250} y={680} amounts={[monthTwo]} color={C.teal} />
          <g opacity={0.55}>
            <Slip x={1510} y={440} />
          </g>
          <path
            d="M1450 400V900"
            stroke={C.navy}
            strokeWidth={3}
            strokeDasharray="12 10"
          />
        </>
      );
    case "S61":
      return (
        <>
          <Sheet>
            {[0, 1].map((row) => (
              <g key={row}>
                {Array.from({ length: 12 }, (_, i) => (
                  <rect
                    key={i}
                    x={750 + i * 76}
                    y={650 + row * 140}
                    width={58}
                    height={70}
                    rx={4}
                    fill={row ? C.teal : C.yellow}
                    stroke={C.navy}
                    strokeWidth={2}
                  />
                ))}
                <Money
                  x={620}
                  y={705 + row * 140}
                  value={
                    index
                      ? row
                        ? alexAnnual
                        : samAnnual
                      : row
                        ? budget.alex
                        : budget.sam
                  }
                  size={52}
                  anchor="middle"
                />
              </g>
            ))}
          </Sheet>
          <Actor
            actor={makeActor({
              x: 430,
              scale: 1.8,
              pose: "explaining",
              expression: "curious",
            })}
          />
        </>
      );
    case "S62":
      return (
        <>
          <Sheet>
            <Slip x={690} y={560} amounts={[samAnnual]} width={285} />
            <Slip
              x={1100}
              y={560}
              amounts={[alexAnnual]}
              color={C.teal}
              width={285}
            />
            <Money
              x={1130}
              y={500}
              value={alexAnnual - samAnnual}
              size={84}
              anchor="middle"
            />
          </Sheet>
          <Actor
            actor={makeActor({ x: 400, scale: 1.8, pose: "explaining" })}
          />
        </>
      );
    case "S63":
      return index === 0 ? (
        <DeskAction
          action="list"
          items={<Book x={1280} y={690} open={false} />}
        />
      ) : (
        <Banking amount={monthTwo} />
      );
    case "S64":
      return <Equal values={[monthTwo, budget.alex]} showHobby />;
    case "S65":
      return (
        <>
          <DeskAction action="list" expression="confident" />
          <Envelope x={1100} y={390} value={budget.income} />
          <Slip
            x={1250}
            y={650}
            amounts={[monthTwoExpenses, monthTwo]}
            color={C.teal}
          />
        </>
      );
    case "S66":
      return index === 0 ? (
        <Banking amount={budget.sam} />
      ) : (
        <Banking amount={monthTwo} />
      );
    case "S67":
      return (
        <>
          <Banking amount={monthTwo} />
          <Envelope x={1220} y={420} value={budget.income} />
        </>
      );
    default:
      throw new Error(`No redesigned scene ${scene}`);
  }
};

export const CinematicStoryboardStudy = ({ shotId }: { shotId: string }) => {
  const shot = cinematicStillShots.find((shot) => shot.id === shotId);
  if (!shot) throw new Error(`Unknown still ${shotId}`);
  if (
    ["S05", "S11", "S64"].includes(shot.scene) ||
    (shot.scene === "S48" && shot.index === 0)
  )
    return <SceneArt shot={shot} />;
  const view =
    shot.scene === "S03" && shot.index === 1
      ? storyboardViews.hands
      : ["S35", "S44", "S58", "S67"].includes(shot.scene)
        ? storyboardViews.phone
        : ["S06", "S15", "S23", "S28", "S29", "S46"].includes(shot.scene)
          ? storyboardViews.medium
          : storyboardViews.wide;
  return (
    <NarrativeScene view={view}>
      <SceneArt shot={shot} />
    </NarrativeScene>
  );
};
registerRoot(() => (
  <Composition
    id="CinematicStoryboardStudy"
    component={CinematicStoryboardStudy}
    fps={30}
    width={1920}
    height={1080}
    durationInFrames={90}
    defaultProps={{ shotId: cinematicStillShots[0].id }}
  />
));
