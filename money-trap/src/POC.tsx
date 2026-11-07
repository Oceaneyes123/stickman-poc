import { AbsoluteFill, Freeze, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  Camera2D,
  EnterExit,
  SceneTransition,
  TextReveal,
} from "./animation/motion";
import { C } from "./design/tokens";
import {
  BarChart,
  Expense,
  MoneyCounter,
  MoneyFlow,
  Wallet,
} from "./finance/components";
import {
  calculateBudget,
  example,
  usd,
  type BudgetExample,
} from "./finance/math";
import {
  ComparisonScene,
  DiagramScene,
  StoryScene,
  type ComparisonSide,
} from "./scenes/templates";
import generated from "./timeline/generated.json";
import type { CompiledScene, Timeline } from "./timeline/types";
export type POCProps = { data: BudgetExample };
export const timeline = generated.timeline as Timeline;

const Shot = ({
  scene,
  index,
  data,
}: {
  scene: CompiledScene;
  index: number;
  data: BudgetExample;
}) => {
  const budget = calculateBudget(data);
  const timing = (id: string) => {
    const found = timeline.events.find((e) => e.id === id);
    if (!found) throw new Error(`Missing event ${id}`);
    return { from: found.from - scene.from, duration: found.durationInFrames };
  };
  const event = (id: string) => timing(id).from;
  const shared = { title: scene.title, beat: index + 1 };
  if (index === 0)
    return (
      <StoryScene
        {...shared}
        character={scene.character ?? "Sam"}
        environment={scene.environment}
        acting={{
          pose: "celebrating",
          expression: "happy",
          actionFrom: event("paycheck"),
        }}
      >
        <TextReveal {...timing("paycheck")}>
          <div style={{ fontSize: 32, letterSpacing: 3, color: C.muted }}>
            MONTHLY TAKE-HOME RAISE
          </div>
          <div
            style={{
              fontSize: 154,
              fontWeight: 800,
              color: C.yellow,
              letterSpacing: -6,
              margin: "24px 0",
            }}
          >
            +<MoneyCounter value={data.raise} {...timing("paycheck")} />
          </div>
          <div style={{ fontSize: 39 }}>
            {usd(data.income)} <span style={{ color: C.muted }}>to</span>{" "}
            {usd(budget.income)}
          </div>
        </TextReveal>
        <div style={{ marginTop: 44, color: C.muted, fontSize: 29 }}>
          Same job. A better Monday.
        </div>
      </StoryScene>
    );
  if (index === 1)
    return (
      <StoryScene
        {...shared}
        character={scene.character ?? "Sam"}
        environment={scene.environment}
        acting={{
          pose: "standing",
          gesture: "reach",
          expression: "happy",
          actionFrom: event("rent-card"),
        }}
      >
        <div style={{ color: C.muted, fontSize: 30, marginBottom: 30 }}>
          UPGRADE 01
        </div>
        <EnterExit {...timing("rent-card")}>
          <Expense {...data.upgrades[0]} />
        </EnterExit>
        <div style={{ marginTop: 45, fontSize: 35, color: C.muted }}>
          The first recurring commitment.
        </div>
        <Wallet
          open
          amount={data.upgrades[0].amount}
          direction="out"
          {...timing("rent-card")}
        />
      </StoryScene>
    );
  if (index === 2)
    return (
      <StoryScene
        {...shared}
        character={scene.character ?? "Sam"}
        environment={scene.environment}
        acting={{
          pose: "thinking",
          expression: "confused",
          gesture: "shrug",
          actionFrom: event("subscriptions-card"),
        }}
      >
        <EnterExit {...timing("car-card")}>
          <Expense {...data.upgrades[1]} />
        </EnterExit>
        <EnterExit {...timing("subscriptions-card")} style={{ marginTop: 28 }}>
          <Expense {...data.upgrades[2]} />
        </EnterExit>
        <TextReveal
          {...timing("subscriptions-card")}
          style={{ marginTop: 44, fontSize: 34, color: C.muted }}
        >
          Small charges. Every month.
        </TextReveal>
      </StoryScene>
    );
  if (index === 3)
    return (
      <DiagramScene {...shared}>
        <div style={{ display: "flex", gap: 26 }}>
          {data.upgrades.map((item) => (
            <EnterExit key={item.label} {...timing("expense-total")}>
              <Expense {...item} />
            </EnterExit>
          ))}
        </div>
        <div style={{ position: "absolute", left: 30, top: 226, width: 720 }}>
          <BarChart
            items={[
              { label: "Raise", value: data.raise, color: C.yellow },
              { label: "Added costs", value: budget.added, color: C.red },
            ]}
            max={Math.ceil(Math.max(data.raise, budget.added) / 100) * 100}
            {...timing("expense-total")}
          />
        </div>
        <div style={{ position: "absolute", left: 990, top: 263 }}>
          <div style={{ fontSize: 31, color: C.muted }}>ADDED COSTS</div>
          <div style={{ fontSize: 102, color: C.red, fontWeight: 800 }}>
            +<MoneyCounter value={budget.added} {...timing("expense-total")} />
          </div>
          <EnterExit {...timing("raise-comparison")}>
            <div style={{ fontSize: 34, marginTop: 25 }}>
              Raise: <span style={{ color: C.yellow }}>+{usd(data.raise)}</span>
            </div>
            <div style={{ fontSize: 35, marginTop: 20, color: C.red }}>
              {usd(budget.added - data.raise)} beyond the raise
            </div>
          </EnterExit>
        </div>
      </DiagramScene>
    );
  if (index === 4) {
    const left: ComparisonSide = {
      name: "SAM / BEFORE",
      character: "Sam",
      amount: budget.before,
      detail: `${usd(data.income)} − ${usd(data.expenses)}`,
      color: C.yellow,
      ...timing("previous-remaining"),
      acting: {
        pose: "standing",
        expression: "neutral",
        gesture: "holdWallet",
      },
    };
    const right: ComparisonSide = {
      name: "SAM / AFTER",
      character: "Sam",
      amount: budget.sam,
      detail: `${usd(budget.income)} − ${usd(budget.samExpenses)}`,
      color: C.red,
      ...timing("new-remaining"),
      acting: {
        pose: "slumped",
        expression: "worried",
        gesture: "holdWallet",
        actionFrom: event("new-remaining"),
      },
    };
    return (
      <ComparisonScene
        {...shared}
        left={left}
        right={right}
        note="Remaining = income minus the illustrated expenses."
      />
    );
  }
  if (index === 5)
    return (
      <StoryScene
        {...shared}
        character={scene.character ?? "Alex"}
        environment={scene.environment}
        acting={{
          pose: "standing",
          expression: "determined",
          gesture: "nod",
          actionFrom: event("alex-remaining"),
        }}
      >
        <EnterExit {...timing("alex-upgrade")}>
          <Expense
            label="Added expenses"
            amount={data.alexAdded}
            color={C.teal}
          />
        </EnterExit>
        <EnterExit {...timing("alex-remaining")} style={{ marginTop: 32 }}>
          <div style={{ fontSize: 32, color: C.muted }}>REMAINING</div>
          <div style={{ fontSize: 116, color: C.teal, fontWeight: 800 }}>
            <MoneyCounter value={budget.alex} {...timing("alex-remaining")} />
          </div>
          <div
            style={{
              marginTop: 16,
              marginLeft: 63,
              transform: "scale(0.8)",
              transformOrigin: "left top",
            }}
          >
            <MoneyFlow
              nodes={[
                { label: "Income", amount: budget.income },
                { label: "Expenses", amount: budget.alexExpenses },
                { label: "Remaining", amount: budget.alex, color: C.teal },
              ]}
              {...timing("alex-remaining")}
            />
          </div>
        </EnterExit>
      </StoryScene>
    );
  const left: ComparisonSide = {
    name: "SAM",
    character: "Sam",
    amount: budget.sam,
    detail: `Added expenses: +${usd(budget.added)}`,
    color: C.red,
    ...timing("final-comparison"),
    acting: { pose: "slumped", expression: "sad", gesture: "holdWallet" },
  };
  const right: ComparisonSide = {
    name: "ALEX",
    character: "Alex",
    amount: budget.alex,
    detail: `Added expenses: +${usd(data.alexAdded)}`,
    color: C.teal,
    ...timing("final-comparison"),
    acting: { pose: "standing", expression: "happy", gesture: "holdWallet" },
  };
  return (
    <ComparisonScene
      {...shared}
      left={left}
      right={right}
      note="Recurring upgrades keep charging next month. Remaining is not a wealth forecast."
    />
  );
};

export const MoneyTrapPOC = ({ data = example }: POCProps) => (
  <AbsoluteFill style={{ background: C.navy }}>
    {generated.audioPresent && <Audio src={staticFile("audio/poc.wav")} />}
    {timeline.scenes.map((scene, index) => (
      <Sequence
        key={scene.id}
        name={`${index + 1}. ${scene.title}`}
        from={scene.from}
        durationInFrames={scene.durationInFrames}
      >
        <SceneTransition
          type={scene.transition}
          previous={
            index > 0 && scene.transition === "wipe" ? (
              <Freeze frame={timeline.scenes[index - 1].durationInFrames - 1}>
                <Shot
                  scene={timeline.scenes[index - 1]}
                  index={index - 1}
                  data={data}
                />
              </Freeze>
            ) : undefined
          }
        >
          <Camera2D>
            <Shot scene={scene} index={index} data={data} />
          </Camera2D>
        </SceneTransition>
      </Sequence>
    ))}
    {timeline.mode === "timing-demo" && (
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 0,
          right: 0,
          textAlign: "center",
          color: C.muted,
          fontFamily: "Inter",
          fontSize: 18,
          letterSpacing: 2,
        }}
      >
        SILENT TIMING DEMO · ESTIMATED CUES · AUDIO SYNC NOT VERIFIED
      </div>
    )}
  </AbsoluteFill>
);
