import type { ReactNode } from "react";
import { AbsoluteFill, Composition, registerRoot } from "remotion";
import {
  Actor,
  Desk,
  DeskAngle,
  Label,
  PayPacket,
  Phone,
  Rental,
  Room,
  Services,
} from "./OpeningSceneStudy";
import { C } from "../design/tokens";
import { example, usd } from "../finance/math";
import {
  alexAnnual,
  alexThreeMonths,
  baselineThreeMonths,
  budget,
  monthOne,
  monthOneExpenses,
  monthTwo,
  monthTwoExpenses,
  remainingShots,
  rent,
  samAnnual,
  samThreeMonths,
  services,
  transport,
  type RemainingLayout,
  type RemainingSceneId,
} from "./remainingShots";
import "../design/fonts";

const pale = "#E2E8F0";
const Paper = ({
  x = 1050,
  y = 180,
  width = 660,
  title,
  lines = [],
  color = C.yellow,
}: {
  x?: number;
  y?: number;
  width?: number;
  title: string;
  lines?: string[];
  color?: string;
}) => (
  <g transform={`translate(${x},${y})`} filter="url(#surface-shadow)">
    <rect
      width={width}
      height={125 + lines.length * 88}
      rx={12}
      fill={C.white}
      stroke={C.navy}
      strokeWidth={4}
    />
    <rect width={width} height={70} rx={10} fill={color} />
    <Label x={30} y={48} size={30}>
      {title}
    </Label>
    {lines.map((line, i) => (
      <Label key={i} x={30} y={147 + i * 88} size={line.length > 25 ? 30 : 42}>
        {line}
      </Label>
    ))}
  </g>
);
const Table = ({ children }: { children: ReactNode }) => (
  <>
    <rect width={1920} height={1080} fill={pale} />
    <rect
      x={96}
      y={100}
      width={1728}
      height={880}
      rx={36}
      fill={C.white}
      stroke={C.navy}
      strokeWidth={5}
    />
    {children}
  </>
);
const Home = ({
  children,
  old = false,
  identity = "Sam",
  expression = "thinking",
}: {
  children?: ReactNode;
  old?: boolean;
  identity?: "Sam" | "Alex";
  expression?: "thinking" | "relieved" | "worried" | "curious" | "confident";
}) => (
  <>
    <Room old={old} />
    <Actor
      identity={identity}
      x={520}
      y={970}
      scale={2.4}
      expression={expression}
      pose="thinking"
      prop="phone"
    />
    <Desk old={old} />
    {children}
  </>
);
const PhoneRows = ({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; color?: string }[];
}) => (
  <Phone>
    <Label x={1135} y={295} size={30}>
      {title}
    </Label>
    {rows.map((row, i) => (
      <g key={row.label}>
        <Label x={1140} y={365 + i * 165} size={27}>
          {row.label}
        </Label>
        <Label
          x={1140}
          y={435 + i * 165}
          size={row.value.length > 14 ? 35 : 64}
          fill={row.color ?? C.navy}
        >
          {row.value}
        </Label>
      </g>
    ))}
  </Phone>
);
const Transfer = ({
  expenses,
  amount,
  month,
  identity = "Sam",
}: {
  expenses: number;
  amount: number;
  month: string;
  identity?: "Sam" | "Alex";
}) => (
  <DeskAngle identity={identity} old={identity === "Alex"}>
    <PhoneRows
      title={month}
      rows={[
        { label: "Monthly take-home", value: usd(budget.income) },
        { label: "Illustrated expenses", value: usd(expenses) },
        { label: "Transferred to savings", value: usd(amount), color: C.teal },
      ]}
    />
  </DeskAngle>
);
const BudgetTable = ({
  expenses,
  amount,
  title,
  planned = false,
  capacity = false,
}: {
  expenses: number;
  amount: number;
  title: string;
  planned?: boolean;
  capacity?: boolean;
}) => (
  <Table>
    <Label x={155} y={205} size={43}>
      {title}
    </Label>
    <Paper
      x={155}
      y={310}
      width={470}
      title="Monthly take-home"
      lines={[usd(budget.income)]}
    />
    <Paper
      x={725}
      y={310}
      width={470}
      title="Illustrated expenses"
      lines={[usd(expenses)]}
      color={C.red}
    />
    <Paper
      x={1295}
      y={310}
      width={370}
      title={
        capacity ? "Remaining" : planned ? "Planned transfer" : "Transferred"
      }
      lines={[usd(amount)]}
      color={C.teal}
    />
    <Label x={655} y={475} size={70}>
      −
    </Label>
    <Label x={1225} y={475} size={70}>
      =
    </Label>
    <Label x={155} y={830} size={34}>
      {capacity
        ? "Capacity before upgrades; no transfer assumed"
        : planned
          ? "Planned transfer after checking the continuing commitments"
          : "Monthly take-home USD · fictional example"}
    </Label>
  </Table>
);
const RaiseTray = ({ stage = 2 }: { stage?: 1 | 2 | 3 }) => {
  const additions = [
    { label: "Rent", amount: rent },
    { label: "Transport", amount: transport },
    { label: "Services", amount: services },
  ].slice(0, stage);
  const total = additions.reduce((n, c) => n + c.amount, 0);
  let consumed = 0;
  return (
    <Table>
      <PayPacket x={155} y={180} />
      <Label x={700} y={250} size={44}>
        One {usd(example.raise)} monthly raise
      </Label>
      <rect
        x={180}
        y={470}
        width={1500}
        height={170}
        fill={C.yellow}
        stroke={C.navy}
        strokeWidth={5}
      />
      {additions.map((item, i) => {
        const x = 180 + (consumed / example.raise) * 1500;
        consumed += item.amount;
        const width = (item.amount / example.raise) * 1500;
        return (
          <g key={item.label}>
            <rect
              x={x}
              y={470}
              width={width}
              height={170}
              fill={["#FF6B6B", "#F68B83", "#F5AAA3"][i]}
              stroke={C.navy}
              strokeWidth={3}
            />
            <Label x={x + width / 2} y={535} anchor="middle" size={34}>
              {item.label}
            </Label>
            <Label x={x + width / 2} y={600} anchor="middle" size={45}>
              {usd(item.amount)}
            </Label>
          </g>
        );
      })}
      {total < example.raise && (
        <Label
          x={
            180 + ((total + (example.raise - total) / 2) / example.raise) * 1500
          }
          y={575}
          size={43}
          anchor="middle"
        >
          {usd(example.raise - total)}
        </Label>
      )}
      <path
        d="M1680 435V685"
        stroke={C.navy}
        strokeWidth={6}
        strokeDasharray="12 8"
      />
      <Label x={180} y={790} size={42}>
        {total > example.raise
          ? `${usd(total)} added costs exceed the raise by ${usd(total - example.raise)}`
          : `${usd(example.raise - total)} of the raise remains`}
      </Label>
      <Label x={180} y={885} size={30}>
        Added monthly costs only; this is not an account balance.
      </Label>
    </Table>
  );
};
const Contributions = ({ annual = false }: { annual?: boolean }) => (
  <Table>
    <Label x={155} y={195} size={42}>
      {annual
        ? "Separate twelve-month illustration"
        : "Same three months · new contributions"}
    </Label>
    {annual ? (
      <>
        <Label x={155} y={295} size={30}>
          Earlier Month 3 pattern held unchanged
        </Label>
        {[
          { name: "Sam", amount: budget.sam, total: samAnnual, y: 410 },
          { name: "Alex", amount: budget.alex, total: alexAnnual, y: 650 },
        ].map((row) => (
          <g key={row.name}>
            <Label x={155} y={row.y} size={38}>
              {row.name}
            </Label>
            {Array.from({ length: 12 }, (_, i) => (
              <g key={i}>
                <rect
                  x={330 + i * 96}
                  y={row.y - 55}
                  width={78}
                  height={84}
                  rx={5}
                  fill={row.name === "Sam" ? C.yellow : C.teal}
                />
                <Label x={369 + i * 96} y={row.y - 2} size={22} anchor="middle">
                  {i + 1}
                </Label>
              </g>
            ))}
            <Label
              x={155}
              y={row.y + 98}
              size={38}
            >{`12 × ${usd(row.amount)} = ${usd(row.total)}`}</Label>
          </g>
        ))}
        <Label x={155} y={935} size={28}>
          New contributions only · no withdrawals · unchanged assumptions
        </Label>
      </>
    ) : (
      <>
        {[
          {
            name: "Sam",
            values: [monthOne, monthTwo, budget.sam],
            total: samThreeMonths,
            y: 330,
            color: C.yellow,
          },
          {
            name: "Old pace",
            values: [budget.before, budget.before, budget.before],
            total: baselineThreeMonths,
            y: 650,
            color: pale,
          },
        ].map((row) => (
          <g key={row.name}>
            <Label x={155} y={row.y - 35} size={38}>
              {row.name}
            </Label>
            {row.values.map((value, i) => (
              <g
                key={i}
                transform={`translate(${390 + i * 360},${row.y - 80})`}
              >
                <rect
                  width={300}
                  height={170}
                  rx={6}
                  fill={row.color}
                  stroke={C.navy}
                  strokeWidth={3}
                />
                <Label x={25} y={50} size={27}>
                  Month {i + 1}
                </Label>
                <Label x={25} y={122} size={49}>
                  {usd(value)}
                </Label>
              </g>
            ))}
            <Label x={1530} y={row.y + 25} size={48}>
              {usd(row.total)}
            </Label>
          </g>
        ))}
        <Label x={155} y={900} size={30}>
          Same dates; opening balances remain unspecified.
        </Label>
      </>
    )}
  </Table>
);
const Key = ({ x, y }: { x: number; y: number }) => (
  <g
    transform={`translate(${x},${y})`}
    stroke={C.navy}
    strokeWidth={9}
    fill={C.white}
  >
    <circle r={30} />
    <path d="M0 30V120H35V90" fill="none" />
  </g>
);
const Folder = ({
  x = 1000,
  y = 440,
  title = "Recurring commitments",
  lines = [],
}: {
  x?: number;
  y?: number;
  title?: string;
  lines?: string[];
}) => (
  <g transform={`translate(${x},${y})`}>
    <path
      d="M0 70V0H230L280 70H650V420H0Z"
      fill={pale}
      stroke={C.navy}
      strokeWidth={5}
    />
    <Label x={30} y={140} size={32}>
      {title}
    </Label>
    {lines.map((line, i) => (
      <Label key={line} x={30} y={220 + i * 70} size={32}>
        {line}
      </Label>
    ))}
  </g>
);
const Calendar = ({
  x,
  y,
  label,
  repeat = false,
}: {
  x: number;
  y: number;
  label: string;
  repeat?: boolean;
}) => (
  <g transform={`translate(${x},${y})`}>
    <rect
      width={420}
      height={415}
      rx={10}
      fill={C.white}
      stroke={C.navy}
      strokeWidth={5}
    />
    <rect width={420} height={70} fill={repeat ? C.red : C.yellow} />
    <Label x={25} y={48} size={30}>
      {label}
    </Label>
    {Array.from({ length: 20 }, (_, i) => (
      <rect
        key={i}
        x={27 + (i % 5) * 77}
        y={105 + Math.floor(i / 5) * 66}
        width={55}
        height={43}
        rx={4}
        fill={i === 12 ? C.teal : pale}
      />
    ))}
    {repeat && (
      <path
        d="M125 250Q210 160 295 250 M280 215L295 250L250 250"
        fill="none"
        stroke={C.navy}
        strokeWidth={8}
      />
    )}
  </g>
);
const Dinner = ({ x = 1050, y = 600 }: { x?: number; y?: number }) => (
  <g transform={`translate(${x},${y})`}>
    <path
      d="M-80 100H610V135H-80 M-45 135V330 M575 135V330"
      fill={pale}
      stroke={C.navy}
      strokeWidth={7}
    />
    <ellipse
      cx={240}
      cy={60}
      rx={110}
      ry={40}
      fill={C.white}
      stroke={C.navy}
      strokeWidth={5}
    />
    <path
      d="M75 30V95 M55 30V50H95V30 M420 30V95"
      fill="none"
      stroke={C.navy}
      strokeWidth={6}
    />
    <path d="M480 5V90H530V5Z" fill={C.white} stroke={C.navy} strokeWidth={4} />
  </g>
);
const CarExterior = ({
  older = false,
  identity = "Sam",
}: {
  older?: boolean;
  identity?: "Sam" | "Alex";
}) => (
  <>
    <rect width={1920} height={1080} fill={C.white} />
    <path d="M0 860H1920V1080H0Z" fill={pale} />
    <path
      d="M390 740L480 525L900 480L1080 620L1450 690L1490 850H320V755Z"
      fill={older ? "#A6B4C6" : C.teal}
      stroke={C.navy}
      strokeWidth={9}
    />
    <path
      d="M540 545L880 515L1010 620H510Z"
      fill="#DBE9EF"
      stroke={C.navy}
      strokeWidth={7}
    />
    <path d="M760 535V620 M1020 655V810" stroke={C.navy} strokeWidth={5} />
    {[550, 1260].map((x) => (
      <g key={x}>
        <circle cx={x} cy={850} r={90} fill={C.navy} />
        <circle cx={x} cy={850} r={44} fill={C.white} />
      </g>
    ))}
    <Actor
      x={1620}
      identity={identity}
      y={965}
      scale={2.4}
      pose="thinking"
      expression="relieved"
      prop="keys"
    />
    <Paper
      x={200}
      y={130}
      width={720}
      title={
        older
          ? "Existing usable rental"
          : "Long-term rental · fictional difference"
      }
      lines={older ? ["Weekend route"] : [`+${usd(transport)}/month transport`]}
    />
  </>
);
const Equal = ({ limits = false }: { limits?: boolean }) => (
  <>
    <Room />
    <Actor
      x={570}
      y={970}
      scale={2.3}
      expression="curious"
      pose="thinking"
      prop="notice"
    />
    <Actor
      identity="Alex"
      x={1340}
      y={970}
      scale={2.3}
      expression="thinking"
      pose="thinking"
      prop="keys"
    />
    {!limits ? (
      <>
        <PayPacket x={390} y={100} />
        <PayPacket x={1160} y={100} />
        <Label x={960} y={985} size={36} anchor="middle">
          Same income · same starting expenses · same raise
        </Label>
      </>
    ) : (
      <>
        <rect
          x={280}
          y={150}
          width={1360}
          height={835}
          fill="none"
          stroke={C.navy}
          strokeWidth={5}
          strokeDasharray="16 10"
        />
        <Label x={960} y={205} size={36} anchor="middle">
          Same starting conditions in this example
        </Label>
        <Label x={960} y={95} size={36} anchor="middle">
          Real housing and transport needs differ
        </Label>
      </>
    )}
  </>
);
const SplitRooms = ({
  mode,
}: {
  mode: "comfort" | "three-month" | "monthly" | "benefits" | "tradeoffs";
}) => (
  <>
    <g>
      <Room />
      <Actor
        x={460}
        y={970}
        scale={1.9}
        pose="thinking"
        expression="relieved"
        prop="keys"
      />
      <g transform="translate(-30,0) scale(.6,1)">
        <Desk />
      </g>
    </g>
    <svg x={960} y={0} width={960} height={1080} viewBox="0 0 960 1080">
      <g transform="translate(-480,0)">
        <Room old />
        <Actor
          identity="Alex"
          x={960}
          y={970}
          scale={1.9}
          pose="thinking"
          expression="thinking"
          prop="keys"
        />
        <g transform="translate(500,0) scale(.6,1)">
          <Desk old />
        </g>
      </g>
    </svg>
    <path d="M960 0V1080" stroke={C.navy} strokeWidth={5} />
    <Paper
      x={135}
      y={125}
      width={680}
      title="Sam · improved workspace"
      lines={
        mode === "three-month"
          ? [
              `${usd(monthOne)} + ${usd(monthTwo)} + ${usd(budget.sam)}`,
              `${usd(samThreeMonths)} in three months`,
            ]
          : mode === "monthly"
            ? [`${usd(budget.sam)}/month · Month 3`]
            : mode === "tradeoffs"
              ? [
                  "Keep apartment and rental",
                  `Revised transfer: ${usd(monthTwo)}`,
                ]
              : ["Useful desk and newer rental"]
      }
    />
    <Paper
      x={1095}
      y={125}
      width={680}
      title="Alex · existing workspace"
      color={C.teal}
      lines={
        mode === "three-month"
          ? [
              `3 × ${usd(budget.alex)}`,
              `${usd(alexThreeMonths)} in three months`,
            ]
          : mode === "monthly"
            ? [`${usd(budget.alex)}/month · Month 3`]
            : mode === "benefits"
              ? ["Cash contributions retained"]
              : mode === "tradeoffs"
                ? [
                    `Chosen spending: +${usd(example.alexAdded)}`,
                    "Keep existing home and rental",
                  ]
                : ["Usable home and older rental"]
      }
    />
    {(mode === "three-month" || mode === "monthly") && (
      <g>
        <rect
          x={650}
          y={850}
          width={620}
          height={125}
          rx={15}
          fill={C.white}
          stroke={C.navy}
          strokeWidth={4}
        />
        <Label x={960} y={930} size={43} anchor="middle">
          Difference:{" "}
          {usd(
            mode === "three-month"
              ? alexThreeMonths - samThreeMonths
              : budget.alex - budget.sam,
          )}
        </Label>
      </g>
    )}
  </>
);

const SceneArt = ({ layout }: { layout: RemainingLayout }) => {
  switch (layout) {
    case "scope":
      return (
        <Home old>
          <Paper
            title="Fictional example"
            lines={["Monthly take-home USD", "Other costs unchanged"]}
          />
        </Home>
      );
    case "cramped":
      return (
        <>
          <Room old />
          <Actor
            x={820}
            y={930}
            scale={2.5}
            pose="sitting"
            expression="worried"
          />
          <g transform="translate(-440,-15)">
            <Desk old />
          </g>
          <g transform="translate(440,700)">
            <ellipse
              rx={95}
              ry={25}
              fill={C.white}
              stroke={C.navy}
              strokeWidth={5}
            />
            <ellipse
              cy={-23}
              rx={75}
              ry={20}
              fill={C.white}
              stroke={C.navy}
              strokeWidth={5}
            />
          </g>
        </>
      );
    case "opportunity":
      return (
        <BudgetTable
          expenses={example.expenses}
          amount={budget.income - example.expenses}
          title="Before upgrades: what the raise makes possible"
          capacity
        />
      );
    case "choices":
      return (
        <Home expression="curious">
          <Paper
            x={1060}
            y={150}
            title="Enjoy some"
            lines={["Comfort choices"]}
          />
          <Paper
            x={1060}
            y={530}
            title="Keep some"
            lines={["Saving goal · amount undecided"]}
            color={C.teal}
          />
        </Home>
      );
    case "equal":
      return <Equal />;
    case "apartment":
      return (
        <>
          <Room />
          <Actor
            x={640}
            y={970}
            scale={2.6}
            pose="explaining"
            expression="relieved"
          />
          <Desk />
          <path
            d="M840 740V900H1010V740 M860 900V970 M990 900V970"
            fill={pale}
            stroke={C.navy}
            strokeWidth={7}
          />
        </>
      );
    case "rent-tray":
      return <RaiseTray stage={1} />;
    case "lease":
      return (
        <Home expression="confident">
          <Paper
            title="Lease · monthly addition"
            lines={[
              `+${usd(rent)} rent`,
              `${usd(example.raise - rent)} of the raise remains`,
              "Signature: Sam",
            ]}
            color={C.red}
          />
        </Home>
      );
    case "month-one":
      return (
        <Transfer
          expenses={monthOneExpenses}
          amount={monthOne}
          month="Month 1 · transfer receipt"
        />
      );
    case "receipts":
      return (
        <Home expression="relieved">
          <Paper
            title="Monthly contribution receipts"
            lines={[
              `Before: ${usd(budget.before)}`,
              `Month 1: ${usd(monthOne)}`,
            ]}
            color={C.teal}
          />
        </Home>
      );
    case "exclusions":
      return (
        <Table>
          <Folder
            x={180}
            y={250}
            title="Monthly rent commitment"
            lines={[`+${usd(rent)}/month`, "Recurring comparison"]}
          />
          <Paper
            x={1010}
            y={270}
            title="Outside this comparison"
            lines={["Moving costs", "Deposits", "Excluded; not assumed free"]}
            color={pale}
          />
          <path
            d="M920 200V890"
            stroke={C.navy}
            strokeWidth={4}
            strokeDasharray="15 12"
          />
        </Table>
      );
    case "dinner-room":
      return (
        <>
          <Room />
          <Actor
            x={560}
            y={970}
            scale={2.4}
            pose="standing"
            expression="relieved"
          />
          <g transform="translate(-200,194) scale(.8)">
            <Desk />
          </g>
          <Dinner x={1200} y={620} />
        </>
      );
    case "rental":
      return <CarExterior />;
    case "car-interior":
      return <Rental />;
    case "car-crop":
      return (
        <Table>
          <Paper
            x={270}
            y={220}
            width={600}
            title="Car quote · viewed alone"
            lines={[`+${usd(transport)}/month`, "Long-term rental"]}
            color={C.red}
          />
          <PayPacket x={1070} y={320} />
          <Label x={270} y={825} size={34}>
            Rent commitment is still on the table, outside this crop.
          </Label>
        </Table>
      );
    case "full-tray":
      return <RaiseTray stage={2} />;
    case "month-two":
      return (
        <Transfer
          expenses={monthTwoExpenses}
          amount={monthTwo}
          month="Month 2 · transfer receipt"
        />
      );
    case "closed-folder":
      return (
        <Table>
          <Folder
            x={190}
            y={230}
            lines={[`Rent +${usd(rent)}`, `Transport +${usd(transport)}`]}
          />
          <Paper
            x={1050}
            y={260}
            title="Savings goal"
            lines={["Amount not specified", "Check the full list"]}
            color={C.teal}
          />
          <Key x={735} y={760} />
        </Table>
      );
    case "services":
      return (
        <>
          <DeskAngle>
            <Services />
          </DeskAngle>
          <Paper
            x={110}
            y={115}
            width={700}
            title="Added services and memberships"
            lines={[`+${usd(services)}/month combined`]}
            color={C.red}
          />
        </>
      );
    case "password":
      return (
        <DeskAngle>
          <PhoneRows
            title="Evening entertainment"
            rows={[
              { label: "One service in use", value: "▶" },
              { label: "Another service", value: "Password?" },
              { label: "Memberships", value: "Still active" },
            ]}
          />
        </DeskAngle>
      );
    case "over-raise":
      return <RaiseTray stage={3} />;
    case "month-three":
      return (
        <Transfer
          expenses={budget.samExpenses}
          amount={budget.sam}
          month="Month 3 · transfer receipt"
        />
      );
    case "hook-receipts":
      return (
        <DeskAngle>
          <PhoneRows
            title="Monthly savings transfers"
            rows={[
              { label: "Before the raise", value: usd(budget.before) },
              { label: "Month 3", value: usd(budget.sam) },
              {
                label: "Monthly difference",
                value: `${usd(budget.before - budget.sam)} less`,
                color: C.red,
              },
            ]}
          />
        </DeskAngle>
      );
    case "comfort-transfer":
      return (
        <Home expression="thinking">
          <Paper
            title="Two outcomes at once"
            lines={[
              "Better daily comfort",
              `${usd(budget.sam)}/month transferred`,
            ]}
            color={C.teal}
          />
        </Home>
      );
    case "positive":
      return (
        <Table>
          <Folder
            x={180}
            y={250}
            title="New contribution · Month 3"
            lines={[`+${usd(budget.sam)} added`, "Earlier receipts retained"]}
          />
          <Paper
            x={1050}
            y={270}
            title="Still adding to savings"
            lines={["No starting balance assumed", "No money removed"]}
            color={C.teal}
          />
        </Table>
      );
    case "three-months":
      return <Contributions />;
    case "pace-total":
      return (
        <Table>
          <Paper
            x={155}
            y={200}
            width={720}
            title="Monthly pace · Month 3"
            lines={[
              `Sam: ${usd(budget.sam)}`,
              `Old pace: ${usd(budget.before)}`,
            ]}
          />
          <Paper
            x={1030}
            y={200}
            width={720}
            title="Same three-month period"
            lines={[
              `Sam: ${usd(samThreeMonths)}`,
              `Old pace: ${usd(baselineThreeMonths)}`,
            ]}
            color={C.teal}
          />
          <Label x={155} y={850} size={34}>
            A lower current pace can coexist with a higher three-month total.
          </Label>
        </Table>
      );
    case "pay-vs-keep":
      return (
        <Home expression="curious">
          <Paper
            title="Different measures"
            lines={[
              `Additional income: ${usd(example.raise)}`,
              `Month 3 transfer: ${usd(budget.sam)}`,
            ]}
          />
        </Home>
      );
    case "destination":
      return (
        <DeskAngle>
          <PhoneRows
            title="One amount · one destination"
            rows={[
              { label: "Remaining from this pay", value: usd(budget.sam) },
              { label: "Transfer complete", value: "✓", color: C.teal },
              {
                label: "Retained in savings",
                value: usd(budget.sam),
                color: C.teal,
              },
            ]}
          />
        </DeskAngle>
      );
    case "book":
      return (
        <Table>
          <path
            d="M200 240Q560 160 960 260Q1360 160 1720 240V850Q1360 770 960 870Q560 770 200 850Z"
            fill={C.white}
            stroke={C.navy}
            strokeWidth={6}
          />
          <path d="M960 260V870" stroke={C.navy} strokeWidth={4} />
          <Label x={300} y={390} size={44}>
            Assets
          </Label>
          <Label x={1090} y={390} size={44}>
            Liabilities
          </Label>
          <Label x={300} y={610} size={39}>
            Net worth = assets − liabilities
          </Label>
          <Label x={300} y={740} size={28}>
            General definition; no personal amounts assigned.
          </Label>
        </Table>
      );
    case "cash-only":
      return (
        <Home>
          <Folder
            title="This comparison: cash saved"
            lines={["Contribution receipts", `${usd(budget.sam)} · Month 3`]}
          />
        </Home>
      );
    case "combined":
      return (
        <Table>
          <PayPacket x={160} y={180} />
          <Folder
            x={750}
            y={220}
            title="Same recurring commitments"
            lines={[
              `Rent ${usd(rent)} + transport ${usd(transport)}`,
              `Services ${usd(services)}`,
              `Combined additions: ${usd(budget.added)}/month`,
            ]}
          />
          <Key x={1620} y={700} />
        </Table>
      );
    case "one-time":
      return (
        <Home expression="relieved">
          <Dinner />
          <Paper
            x={1050}
            y={100}
            title="One-time spending"
            lines={["Dinner receipt · paid once"]}
          />
        </Home>
      );
    case "recurring":
      return (
        <Table>
          <Label x={150} y={200} size={46}>
            The commitment returns each month
          </Label>
          {["Month 1", "Month 2", "Month 3"].map((month, i) => (
            <Calendar
              key={month}
              x={180 + i * 550}
              y={350}
              label={month}
              repeat
            />
          ))}
        </Table>
      );
    case "reserved":
      return <RaiseTray stage={2} />;
    case "tradeoff":
      return (
        <DeskAngle>
          <PhoneRows
            title="Before adding services"
            rows={[
              {
                label: "Complete plan first",
                value: `+${usd(services)}/month`,
              },
              {
                label: "Transfer without services",
                value: usd(monthTwo),
                color: C.teal,
              },
              {
                label: "Transfer with services",
                value: usd(budget.sam),
                color: C.red,
              },
            ]}
          />
        </DeskAngle>
      );
    case "alex-enjoys":
      return (
        <Home old identity="Alex" expression="relieved">
          <Paper
            title="Alex's chosen extra spending"
            lines={[
              `+${usd(example.alexAdded)}/month combined`,
              "Hobby and meals out",
            ]}
            color={C.teal}
          />
          <Key x={1570} y={720} />
        </Home>
      );
    case "alex-transfer":
      return (
        <Transfer
          identity="Alex"
          expenses={budget.alexExpenses}
          amount={budget.alex}
          month="Alex · transfer receipt"
        />
      );
    case "alex-split":
      return (
        <Table>
          <Label x={155} y={190} size={46}>
            {usd(budget.alex)} transferred is not all from the raise
          </Label>
          <Paper
            x={155}
            y={330}
            width={700}
            title="Savings transfer"
            lines={[
              `${usd(budget.before)} baseline`,
              `${usd(budget.alex - budget.before)} retained from raise`,
              `${usd(budget.alex)} total`,
            ]}
            color={C.teal}
          />
          <Paper
            x={1040}
            y={330}
            width={670}
            title="Extra spending"
            lines={[usd(example.alexAdded), "From the same raise"]}
          />
        </Table>
      );
    case "automation":
      return (
        <DeskAngle identity="Alex" old>
          <PhoneRows
            title="Checked plan · scheduled"
            rows={[
              { label: "Pay arrives first", value: usd(budget.income) },
              { label: "Expenses checked", value: usd(budget.alexExpenses) },
              {
                label: "Planned transfer · enabled",
                value: usd(budget.alex),
                color: C.teal,
              },
            ]}
          />
        </DeskAngle>
      );
    case "optional":
      return (
        <Home old identity="Alex" expression="thinking">
          <Paper
            title="Optional purchase · unpriced"
            lines={["Postpone", "or adjust the plan"]}
            color={C.teal}
          />
        </Home>
      );
    case "different-rooms":
      return <SplitRooms mode="comfort" />;
    case "limits":
      return <Equal limits />;
    case "period-gap":
      return <SplitRooms mode="three-month" />;
    case "monthly-gap":
      return <SplitRooms mode="monthly" />;
    case "different-benefits":
      return <SplitRooms mode="benefits" />;
    case "cancel-impulse":
      return (
        <Home expression="worried">
          <Paper
            title="Review before crossing everything out"
            lines={[
              "Apartment · useful workspace",
              "Rental · comfort",
              "Services · review each one",
            ]}
            color={C.red}
          />
        </Home>
      );
    case "list-goal":
      return (
        <Table>
          <Folder
            x={155}
            y={240}
            title="Recurring choices"
            lines={[
              `Rent addition: ${usd(rent)}`,
              `Transport addition: ${usd(transport)}`,
              `Services addition: ${usd(services)}`,
            ]}
          />
          <Paper
            x={1040}
            y={260}
            title="Saving goal"
            lines={["Amount not specified", "See what remains"]}
            color={C.teal}
          />
        </Table>
      );
    case "choose-keep":
      return (
        <Home expression="confident">
          <Paper
            title="Choose an amount to keep"
            lines={["Check the full commitments", "Review added services"]}
            color={C.teal}
          />
        </Home>
      );
    case "cancel-services":
      return (
        <Table>
          <Paper
            x={150}
            y={220}
            width={800}
            title="Added service group · cancellation confirmed"
            lines={[
              `−${usd(services)}/month next billing month`,
              "Example assumption",
              "No immediate refund",
            ]}
            color={C.teal}
          />
          <Calendar x={1190} y={320} label="Next full billing month" />
        </Table>
      );
    case "contracts-remain":
      return (
        <Table>
          <Paper
            x={180}
            y={200}
            width={650}
            title="Rent agreement · remains"
            lines={[`+${usd(rent)}/month`]}
            color={C.red}
          />
          <Paper
            x={1060}
            y={200}
            width={650}
            title="Rental agreement · remains"
            lines={[`+${usd(transport)}/month`]}
            color={C.red}
          />
          <Key x={1170} y={720} />
          <Label x={180} y={850} size={35}>
            Service cancellation does not reverse these commitments.
          </Label>
        </Table>
      );
    case "revised":
      return (
        <Transfer
          expenses={monthTwoExpenses}
          amount={monthTwo}
          month="Next payday · services ended"
        />
      );
    case "review-later":
      return (
        <Home expression="thinking">
          <Folder
            title="Review larger commitments"
            lines={[
              "When change is possible",
              "No immediate reversal",
              `Current transfer: ${usd(monthTwo)}`,
            ]}
          />
        </Home>
      );
    case "hypothetical":
      return (
        <Table>
          <Paper
            x={150}
            y={200}
            width={720}
            title="Actual current plan"
            lines={[
              `Monthly income: ${usd(budget.income)}`,
              `Transfer: ${usd(monthTwo)}`,
            ]}
          />
          <Paper
            x={1040}
            y={200}
            width={720}
            title="Separate hypothetical"
            lines={[
              "Future raise?",
              "No amount specified",
              "Check new recurring costs",
            ]}
            color={pale}
          />
          <path
            d="M960 180V880"
            stroke={C.navy}
            strokeWidth={4}
            strokeDasharray="14 10"
          />
        </Table>
      );
    case "annual":
      return <Contributions annual />;
    case "annual-gap":
      return (
        <Table>
          <rect
            x={130}
            y={140}
            width={1660}
            height={800}
            fill="none"
            stroke={C.navy}
            strokeWidth={5}
            strokeDasharray="18 12"
          />
          <Label x={200} y={245} size={40}>
            Separate twelve-month illustration
          </Label>
          <Paper
            x={210}
            y={350}
            width={620}
            title="New contributions"
            lines={[`Alex: ${usd(alexAnnual)}`, `Sam: ${usd(samAnnual)}`]}
            color={C.teal}
          />
          <Paper
            x={1030}
            y={350}
            width={640}
            title="Conditional difference"
            lines={[usd(alexAnnual - samAnnual), "Unchanged Month 3 pattern"]}
          />
          <Label x={200} y={855} size={28}>
            Continuing transfers · no withdrawals · otherwise unchanged
            assumptions
          </Label>
        </Table>
      );
    case "return-current":
      return (
        <Home expression="relieved">
          <Paper
            title="Back to Sam's current story"
            lines={[
              `Actual transfer: ${usd(monthTwo)}`,
              "Added services ended",
              "Annual illustration closed",
            ]}
            color={C.teal}
          />
        </Home>
      );
    case "chosen-tradeoff":
      return <SplitRooms mode="tradeoffs" />;
    case "same-pay":
      return (
        <BudgetTable
          expenses={monthTwoExpenses}
          amount={monthTwo}
          title="Same paycheck · clearer plan"
          planned
        />
      );
    case "earlier-current":
      return (
        <Home expression="confident">
          <Paper
            title="Same pay · changed commitments"
            lines={[
              `Earlier Month 3: ${usd(budget.sam)}/month`,
              `Current plan: ${usd(monthTwo)}/month`,
            ]}
            color={C.teal}
          />
        </Home>
      );
    case "closing":
      return (
        <>
          <DeskAngle>
            <PhoneRows
              title="Checked and confirmed"
              rows={[
                { label: "Planned transfer", value: usd(monthTwo) },
                {
                  label: "Transferred to savings",
                  value: usd(monthTwo),
                  color: C.teal,
                },
                { label: "Plan matches receipt", value: "✓", color: C.teal },
              ]}
            />
          </DeskAngle>
          <g transform="translate(820,530) scale(.45)">
            <PayPacket x={0} y={0} label={`${usd(budget.income)} pay`} />
          </g>
        </>
      );
  }
};

const InsertArt = ({ scene }: { scene: RemainingSceneId }) => {
  if (scene === "S08") return <CarExterior older />;
  if (scene === "S20") return <CarExterior older identity="Alex" />;
  if (scene === "S14")
    return (
      <Home old identity="Alex">
        <Paper
          title="Apartment listing set aside"
          lines={["Existing desk remains usable", "Keeps the current home"]}
          color={pale}
        />
      </Home>
    );
  if (scene === "S26")
    return (
      <DeskAngle identity="Alex" old>
        <PhoneRows
          title="Optional service"
          rows={[
            { label: "Before adding a commitment", value: "Pause" },
            { label: "Check the existing plan", value: "Then decide" },
          ]}
        />
      </DeskAngle>
    );
  if (scene === "S34")
    return (
      <Home old identity="Alex">
        <Folder
          title="Alex checks chosen commitments"
          lines={[
            "Current bills",
            "Current choices",
            "Retained contribution receipts",
          ]}
        />
      </Home>
    );
  if (scene === "S42")
    return (
      <Home old identity="Alex" expression="curious">
        <Paper
          title="Check the full list first"
          lines={[
            "Existing bills checked",
            "Available spending checked",
            "Then consider the optional choice",
          ]}
          color={C.teal}
        />
      </Home>
    );
  if (scene === "S43")
    return (
      <Home old identity="Alex" expression="relieved">
        <Paper
          title="One chosen monthly allowance"
          lines={[
            `${usd(example.alexAdded)} extra spending combined`,
            "Hobby and a meal out",
          ]}
          color={C.teal}
        />
        <Dinner x={1120} y={640} />
        <g transform="translate(790,770) rotate(15)">
          <path
            d="M-45 -10C-110 -90 -160 10 -95 60C-45 90 -10 60 0 25L40 -200H10Z"
            fill={C.yellow}
            stroke={C.navy}
            strokeWidth={6}
          />
          <circle cx={-60} cy={10} r={18} fill={C.navy} />
          <path d="M-60 25L25 -205" stroke={C.white} strokeWidth={3} />
        </g>
      </Home>
    );
  throw new Error(`No planned insert for ${scene}`);
};

export const RemainingSceneStudy = ({
  scene,
  insert = false,
}: {
  scene: RemainingSceneId;
  insert?: boolean;
}) => {
  const shot = remainingShots.find((shot) => shot[0] === scene);
  if (!shot) throw new Error(`Unknown storyboard scene ${scene}`);
  // A still represents the scene's review state; exact reveal timing belongs to animation prep.
  const viewBox = insert
    ? "0 0 1920 1080"
    : ["month-three", "hook-receipts"].includes(shot[1])
      ? "930 390 1050 590.625"
      : shot[1] === "reserved"
        ? "100 100 1720 967.5"
        : "0 0 1920 1080";
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <svg
        width={1920}
        height={1080}
        viewBox={viewBox}
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
              dx={8}
              dy={12}
              stdDeviation={10}
              floodColor={C.navy}
              floodOpacity={0.13}
            />
          </filter>
        </defs>
        {insert ? <InsertArt scene={scene} /> : <SceneArt layout={shot[1]} />}
      </svg>
    </AbsoluteFill>
  );
};
registerRoot(() => (
  <Composition
    id="RemainingSceneStudy"
    component={RemainingSceneStudy}
    fps={30}
    width={1920}
    height={1080}
    durationInFrames={90}
    defaultProps={{ scene: "S07" as RemainingSceneId, insert: false }}
  />
));
