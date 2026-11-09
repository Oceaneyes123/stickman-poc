import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { cameraAt, type DirectedSequence } from "../animation/direction";
import { ReferenceCharacterRig } from "../characters/ReferenceCharacterRig";
import type { Point } from "../characters/kinematics";
import { C, cinema } from "../design/tokens";
import { usd, example } from "../finance/math";
import { monthOne, monthTwo, budget } from "../storyboard/remainingShots";
import {
  NarrativeScene,
  CloseUpScene,
  EnvironmentScene,
  ComparisonScene,
  FinancialRevealScene,
  SymbolicScene,
  SceneText,
} from "./narrative";
import {
  StoryEnvironment,
  WritingDesk,
  Cup,
  GuestChair,
} from "./cinematicEnvironment";
import {
  createReferencePerformance,
  referenceMoney,
  type PerformanceActor,
  type ApartmentState,
  type IllusionState,
  type ComparisonState,
  type ComparisonActor,
} from "./cinematicModel";

const Person = ({
  actor,
  holding = false,
}: {
  actor: PerformanceActor;
  holding?: boolean;
}) => (
  <ReferenceCharacterRig
    identity={actor.identity}
    x={actor.x}
    y={actor.y}
    scale={actor.scale}
    facing={actor.facing}
    skeleton={actor.rig}
    expression={actor.expression}
    hands={holding ? { right: "fist", left: "open" } : undefined}
  />
);
const PhoneListing = ({ grip }: { grip: Point }) => (
  <g
    transform={`translate(${grip.x - 19},${grip.y - 60})`}
    stroke={C.navy}
    strokeWidth={2.5}
  >
    <rect width={42} height={68} rx={6} fill={C.navy} />
    <rect x={4} y={5} width={34} height={54} rx={3} fill={C.white} />
    <path d="M7 13H35V37H7Z" fill={cinema.environment.glass} strokeWidth={1} />
    <path
      d="M13 37V25H30V37 M13 25H30 M23 13V25"
      fill="none"
      strokeWidth={1.2}
    />
    <path d="M8 44H32 M8 49H27" strokeWidth={1.5} />
    <circle cx={21} cy={63} r={1.5} fill={C.white} />
  </g>
);
const Laptop = ({ grip, open }: { grip: Point; open: number }) => (
  <g
    transform={`translate(${grip.x - 160},${grip.y})`}
    stroke={C.navy}
    strokeWidth={4}
    strokeLinejoin="round"
  >
    <path
      d={`M12 -10L${18 - open * 20} ${-12 - 110 * open}H${178 - open * 20}L182 -10Z`}
      fill={C.navy}
    />
    {open > 0.05 && (
      <path
        d={`M25 ${-20 - open * 90}H${162 - open * 18}L170 -18H25Z`}
        fill={cinema.environment.glass}
        stroke="none"
      />
    )}
    <path d="M-12 -10H190L180 1H0Z" fill={cinema.material.desk} />
    <path d="M70 -8H125" strokeWidth={2} />
  </g>
);
const Apartment = ({
  state,
  sequence,
  frame,
}: {
  state: ApartmentState;
  sequence: DirectedSequence;
  frame: number;
}) => {
  const view = cameraAt(sequence, frame),
    old = state.location === "sam-old";
  const scene = (
    <EnvironmentScene
      background={
        <>
          <StoryEnvironment location={state.location} />
          {!old && <GuestChair x={1540} />}
        </>
      }
      foreground={
        <>
          <WritingDesk x={old ? 750 : 820} width={old ? 560 : 650} old={old} />
          {old && (
            <>
              <Cup x={1180} y={688} />
              <g stroke={C.navy} strokeWidth={3} fill={C.white}>
                <ellipse cx={1230} cy={681} rx={60} ry={14} />
                <ellipse cx={1230} cy={668} rx={50} ry={12} />
              </g>
            </>
          )}
          <Laptop {...state.laptop} />
          {old && <PhoneListing grip={state.phone} />}
        </>
      }
    >
      <Person
        actor={state.sam}
        holding={old ? state.phoneAttached : state.laptop.attached}
      />
    </EnvironmentScene>
  );
  return old ? (
    <CloseUpScene focus={view}>{scene}</CloseUpScene>
  ) : (
    <NarrativeScene view={view}>{scene}</NarrativeScene>
  );
};

const RentalQuote = ({ opacity }: { opacity: number }) => (
  <g transform="translate(910,660) rotate(3)" filter="url(#cinema-shadow)">
    <path
      d="M0 0H270V190L255 202L240 190L225 202L210 190L195 202L180 190L165 202L150 190L135 202L120 190L105 202L90 190L75 202L60 190L45 202L30 190L15 202L0 190Z"
      fill={C.white}
      stroke={C.navy}
      strokeWidth={3}
    />
    <path d="M24 25H246" stroke={C.red} strokeWidth={8} />

    <g opacity={opacity}>
      <SceneText x={24} y={128} size={54}>
        +{usd(referenceMoney.transport)}
      </SceneText>
    </g>
  </g>
);
const RentAgreement = ({ opacity }: { opacity: number }) => (
  <g transform="translate(570,650) rotate(-6)" filter="url(#cinema-shadow)">
    <path d="M0 0H250V210H0Z" fill={C.white} stroke={C.navy} strokeWidth={3} />
    <path d="M0 0H250V38H0Z" fill={C.red} />

    <g opacity={opacity}>
      <SceneText x={22} y={145} size={54}>
        +{usd(referenceMoney.rent)}
      </SceneText>
    </g>
  </g>
);
const RaiseEnvelope = ({ opacity }: { opacity: number }) => (
  <g transform="translate(1260,700) rotate(-3)" filter="url(#cinema-shadow)">
    <rect
      width={330}
      height={155}
      rx={6}
      fill={C.yellow}
      stroke={C.navy}
      strokeWidth={4}
    />
    <path d="M0 0L165 83L330 0" stroke={C.navy} strokeWidth={4} fill="none" />
    <g opacity={opacity}>
      <SceneText x={165} y={128} size={51} anchor="middle">
        +{usd(referenceMoney.raise)}
      </SceneText>
    </g>
  </g>
);
const RaiseAllocation = ({ state }: { state: IllusionState }) => (
  <SymbolicScene subject="The same finite raise reserved once for rent and transport">
    <g opacity={state.allocation}>
      <rect
        x={600}
        y={885}
        width={1000}
        height={47}
        fill={C.yellow}
        stroke={C.navy}
        strokeWidth={3}
      />
      <rect
        x={600}
        y={885}
        width={(1000 * referenceMoney.rent) / referenceMoney.raise}
        height={47}
        fill={C.red}
      />
      <rect
        x={600 + (1000 * referenceMoney.rent) / referenceMoney.raise}
        y={885}
        width={(1000 * referenceMoney.transport) / referenceMoney.raise}
        height={47}
        fill="#F7A29B"
      />
      <path
        d={`M${600 + (1000 * (referenceMoney.rent + referenceMoney.transport)) / referenceMoney.raise} 878V940`}
        stroke={C.navy}
        strokeWidth={4}
      />
      <SceneText x={850} y={918} size={28} anchor="middle">
        {usd(referenceMoney.rent)}
      </SceneText>
      <SceneText x={1280} y={918} size={28} anchor="middle">
        {usd(referenceMoney.transport)}
      </SceneText>
      <g opacity={state.remainder}>
        <rect
          x={
            600 +
            (1000 * (referenceMoney.rent + referenceMoney.transport)) /
              referenceMoney.raise
          }
          y={843}
          width={(1000 * referenceMoney.raiseRemainder) / referenceMoney.raise}
          height={90}
          fill={C.yellow}
          stroke={C.navy}
          strokeWidth={3}
        />
        <SceneText x={1532} y={920} size={64} anchor="middle">
          {usd(referenceMoney.raiseRemainder)}
        </SceneText>
      </g>
    </g>
  </SymbolicScene>
);
const Illusion = ({
  state,
  sequence,
  frame,
}: {
  state: IllusionState;
  sequence: DirectedSequence;
  frame: number;
}) => (
  <NarrativeScene
    view={cameraAt(sequence, frame)}
    background={<StoryEnvironment location="sam-new" />}
    foreground={
      <>
        <path
          d="M560 660L1690 630L1840 935H470Z"
          fill={cinema.material.wood}
          stroke={C.navy}
          strokeWidth={6}
        />
        <path d="M525 935V980 M1760 935V980" stroke={C.navy} strokeWidth={8} />
        <path
          d="M585 682L1685 655"
          stroke={C.white}
          strokeOpacity={0.35}
          strokeWidth={3}
        />
        <RentAgreement opacity={state.rent} />
        <RentalQuote opacity={state.quote} />
        <RaiseEnvelope opacity={state.raise} />
        <RaiseAllocation state={state} />
      </>
    }
  >
    <Person actor={state.sam} />
  </NarrativeScene>
);

const Keys = ({ point }: { point: Point }) => (
  <g
    transform={`translate(${point.x},${point.y}) rotate(20)`}
    fill={C.white}
    stroke={C.navy}
    strokeWidth={4}
  >
    <circle r={12} />
    <path d="M0 12V53H16V42" fill="none" />
  </g>
);
const SmallReceipt = ({
  grip,
  amount,
}: {
  grip: Point;
  amount: number | null;
}) => (
  <g
    transform={`translate(${grip.x - 85},${grip.y - 100})`}
    stroke={C.navy}
    strokeWidth={2.5}
  >
    <path
      d="M0 0H96V108L84 102L72 108L60 102L48 108L36 102L24 108L12 102L0 108Z"
      fill={C.white}
    />
    <path d="M10 16H86" stroke={C.teal} strokeWidth={4} />

    {amount !== null && (
      <SceneText x={10} y={76} size={25}>
        {usd(amount)}
      </SceneText>
    )}
  </g>
);
const FolderBack = ({
  filed,
  identity,
}: {
  filed: number;
  identity: "Sam" | "Alex";
}) => (
  <g>
    <path
      d="M500 730V650H615L635 675H825V730Z"
      fill="#C8D5D9"
      stroke={C.navy}
      strokeWidth={3}
    />
    {Array.from({ length: filed }, (_, i) => (
      <SmallReceipt
        key={i}
        grip={{ x: 540, y: 675 }}
        amount={
          identity === "Sam" ? [monthOne, monthTwo, budget.sam][i] : budget.alex
        }
      />
    ))}
  </g>
);
const FolderFront = () => (
  <g>
    <path
      d="M495 700H825V738H495Z"
      fill={cinema.material.fabric}
      stroke={C.navy}
      strokeWidth={3}
    />
  </g>
);
const SummaryReceipt = ({
  progress,
  value,
}: {
  progress: number;
  value: number;
}) => (
  <FinancialRevealScene at={[540, 690]} progress={progress}>
    <g transform={`translate(0,${(1 - progress) * 30})`}>
      <path
        d="M0 -230H290V-5L275 -13L260 -5L245 -13L230 -5L215 -13L200 -5L185 -13L170 -5L155 -13L140 -5L125 -13L110 -5L95 -13L80 -5L65 -13L50 -5L35 -13L20 -5L0 -13Z"
        fill={C.white}
        stroke={C.navy}
        strokeWidth={3}
      />
      <path d="M20 -205H270" stroke={C.teal} strokeWidth={6} />

      <SceneText x={22} y={-80} size={68}>
        {usd(value)}
      </SceneText>
    </g>
  </FinancialRevealScene>
);
const ComparisonRoom = ({
  person,
  state,
  identity,
}: {
  person: ComparisonActor;
  state: ComparisonState;
  identity: "Sam" | "Alex";
}) => {
  const sam = identity === "Sam";
  const periodTotal = sam ? state.samTotal : state.alexTotal;
  const monthlyTotal = sam ? state.samMonthly : state.alexMonthly;
  return (
    <EnvironmentScene
      background={
        <>
          <StoryEnvironment location={sam ? "sam-new" : "alex-home"} compact />
          {!sam && (
            <g transform="translate(125,880)" stroke={C.navy} strokeWidth={4}>
              <path
                d="M-20 -10C-70 -70 -105 5 -65 42C-25 70 12 38 10 6L42 -170H20Z"
                fill={cinema.material.wood}
              />
              <circle cx={-40} cy={5} r={13} fill={C.navy} />
              <path d="M-40 25L31 -165" stroke={C.white} strokeWidth={2} />
              <path d="M-10 42V60H45" fill="none" />
            </g>
          )}
        </>
      }
      foreground={
        <>
          <WritingDesk x={490} y={730} width={390} old={!sam} />
          {sam && <WritingDesk x={80} y={730} width={250} />}
          {!sam && <Cup x={855} y={727} />}
          <g opacity={state.period}>
            <FolderBack filed={person.filed} identity={identity} />
          </g>
          {person.receipt && <SmallReceipt {...person.receipt} />}
          <FolderFront />
          <Keys point={person.keys} />
          <SummaryReceipt
            progress={periodTotal}
            value={
              sam
                ? referenceMoney.samThreeMonths
                : referenceMoney.alexThreeMonths
            }
          />
          <SummaryReceipt
            progress={monthlyTotal}
            value={sam ? referenceMoney.samMonthly : referenceMoney.alexMonthly}
          />
          <g opacity={state.sameRaise} transform="translate(575,610)">
            <rect
              width={255}
              height={110}
              fill={C.yellow}
              stroke={C.navy}
              strokeWidth={3}
            />
            <path
              d="M0 0L127 58L255 0"
              stroke={C.navy}
              strokeWidth={3}
              fill="none"
            />
            <SceneText x={127} y={88} size={40} anchor="middle">
              +{usd(example.raise)}
            </SceneText>
          </g>
          <g opacity={state.costs} transform="translate(545,570)">
            <path
              d="M0 0H285V148H0Z"
              fill={C.white}
              stroke={C.navy}
              strokeWidth={3}
            />
            <path d="M15 20H270" stroke={C.red} strokeWidth={5} />
          </g>
          {sam && (
            <g transform="translate(105,739) scale(.7)">
              <path d="M0 -155H230V-25H0Z" fill={C.navy} />
              <path d="M12 -143H218V-38H12Z" fill={cinema.environment.glass} />
              <path
                d="M-15 -25H245L230 -13H0Z"
                fill={cinema.material.desk}
                stroke={C.navy}
                strokeWidth={4}
              />
            </g>
          )}
        </>
      }
    >
      <Person
        actor={person.actor}
        holding={!!person.receipt || person.keysAttached}
      />
    </EnvironmentScene>
  );
};
const Comparison = ({ state }: { state: ComparisonState }) => (
  <ComparisonScene
    left={<ComparisonRoom person={state.sam} state={state} identity="Sam" />}
    right={<ComparisonRoom person={state.alex} state={state} identity="Alex" />}
  >
    <FinancialRevealScene at={[960, 180]} progress={state.periodGap}>
      <SceneText x={0} y={85} size={76} anchor="middle">
        {usd(referenceMoney.periodGap)}
      </SceneText>
    </FinancialRevealScene>
    <FinancialRevealScene at={[960, 180]} progress={state.monthlyGap}>
      <SceneText x={0} y={85} size={76} anchor="middle">
        {usd(referenceMoney.monthlyGap)}
      </SceneText>
    </FinancialRevealScene>
  </ComparisonScene>
);

export const CinematicReference = ({
  sequence,
}: {
  sequence: DirectedSequence;
}) => {
  const frame = useCurrentFrame();
  const performance = useMemo(
    () => createReferencePerformance(sequence),
    [sequence],
  );
  const state = performance(frame);
  if (state.kind === "apartment")
    return <Apartment state={state} sequence={sequence} frame={frame} />;
  if (state.kind === "raise-illusion")
    return <Illusion state={state} sequence={sequence} frame={frame} />;
  return <Comparison state={state} />;
};

export { Person, Laptop, PhoneListing, Keys };
