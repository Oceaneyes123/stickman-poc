import { AbsoluteFill, Sequence } from "remotion";
import { Sam, Alex } from "./characters/StickmanRig";
import { expressions, gestures, poses } from "./characters/kinematics";
import {
  Camera2D,
  EnterExit,
  SceneTransition,
  TextReveal,
} from "./animation/motion";
import {
  Bill,
  BarChart,
  DebtMeter,
  Expense,
  MoneyCounter,
  MoneyFlow,
  MoneyStack,
  Wallet,
} from "./finance/components";
import { example, calculateBudget } from "./finance/math";
import { C, font } from "./design/tokens";
import {
  ComparisonScene,
  DiagramScene,
  SceneShell,
  StoryScene,
} from "./scenes/templates";
import type { ReactNode } from "react";
const GalleryPage = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <AbsoluteFill
    style={{ background: C.navy, color: C.white, fontFamily: font }}
  >
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 52,
        fontSize: 47,
        fontWeight: 750,
      }}
    >
      {title}
    </div>
    {children}
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 40,
        color: C.muted,
        fontSize: 24,
      }}
    >
      COMPONENT GALLERY · local frame-driven motion · scrub each page to inspect
    </div>
  </AbsoluteFill>
);
export const ComponentGallery = () => {
  const budget = calculateBudget(example);
  return (
    <>
      <Sequence durationInFrames={180} name="8 poses">
        <GalleryPage title="01 / Articulated poses">
          {poses.map((pose, i) => {
            const x = 80 + (i % 4) * 450;
            const y = 135 + Math.floor(i / 4) * 390;
            return (
              <div key={pose}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 418,
                    height: 360,
                    background: C.panel,
                    borderRadius: 14,
                  }}
                />
                <svg
                  width={1920}
                  height={1080}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Sam
                    x={x + (pose === "walking" ? 115 : 210)}
                    y={y + 309}
                    scale={0.83}
                    pose={pose}
                    expression={
                      pose === "slumped"
                        ? "worried"
                        : pose === "celebrating"
                          ? "happy"
                          : "neutral"
                    }
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    left: x + 20,
                    top: y + 320,
                    fontSize: 27,
                  }}
                >
                  {pose}
                </div>
              </div>
            );
          })}
        </GalleryPage>
      </Sequence>
      <Sequence from={180} durationInFrames={180} name="7 expressions">
        <GalleryPage title="02 / Stable facial identity · Sam and Alex">
          {expressions.map((expression, i) => {
            const x = 170 + i * 255;
            return (
              <div key={expression}>
                <svg
                  width={1920}
                  height={1080}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Sam x={x} y={505} scale={0.9} expression={expression} />
                  <Alex x={x} y={895} scale={0.9} expression={expression} />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    top: 538,
                    left: x - 115,
                    width: 230,
                    textAlign: "center",
                    fontSize: 28,
                    color: C.yellow,
                  }}
                >
                  {expression}
                </div>
              </div>
            );
          })}
        </GalleryPage>
      </Sequence>
      <Sequence from={360} durationInFrames={180} name="7 gestures">
        <GalleryPage title="03 / Gestures · anticipation, action, settle">
          {gestures.map((gesture, i) => {
            const x = 80 + (i % 4) * 450;
            const y = 150 + Math.floor(i / 4) * 390;
            return (
              <div key={gesture}>
                <svg
                  width={1920}
                  height={1080}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Alex
                    x={x + 200}
                    y={y + 310}
                    scale={0.88}
                    gesture={gesture}
                    expression={
                      gesture === "reactToBill" ? "shocked" : "neutral"
                    }
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    left: x + 40,
                    top: y + 335,
                    fontSize: 28,
                  }}
                >
                  {gesture}
                </div>
              </div>
            );
          })}
        </GalleryPage>
      </Sequence>
      <Sequence from={540} durationInFrames={180} name="Finance props">
        <GalleryPage title="04 / Finance props · hypothetical USD">
          <div style={{ position: "absolute", left: 80, top: 160 }}>
            <MoneyStack amount={budget.before} />
          </div>
          <div style={{ position: "absolute", left: 450, top: 166 }}>
            <Wallet open direction="out" amount={0} />
            <div style={{ fontSize: 26 }}>Wallet / empty / outgoing</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 790,
              top: 170,
              scale: 0.83,
              transformOrigin: "left top",
            }}
          >
            <Expense {...example.upgrades[0]} />
            <div style={{ marginTop: 26, fontSize: 38, color: C.yellow }}>
              Counter <MoneyCounter value={budget.added} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1400, top: 155 }}>
            <Bill items={example.upgrades} paid />
          </div>
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 600,
              scale: 0.82,
              transformOrigin: "left top",
            }}
          >
            <DebtMeter principal={1000} annualRate={0.12} months={12} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 555,
              top: 530,
              scale: 0.9,
              transformOrigin: "left top",
            }}
          >
            <BarChart
              items={[
                { label: "Before", value: budget.before, color: C.yellow },
                { label: "After", value: budget.sam, color: C.red },
              ]}
              max={500}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 1250,
              top: 670,
              scale: 0.62,
              transformOrigin: "left top",
            }}
          >
            <MoneyFlow
              nodes={[
                { label: "Pay", amount: budget.income },
                { label: "Costs", amount: budget.samExpenses },
                { label: "Left", amount: budget.sam },
              ]}
            />
          </div>
        </GalleryPage>
      </Sequence>
      <Sequence from={720} durationInFrames={90} name="Story template">
        <StoryScene
          title="Reusable / story environment"
          beat={1}
          character="Alex"
          environment="apartment"
          acting={{ pose: "pointing", expression: "happy" }}
        >
          <Expense label="Example upgrade" amount={200} color={C.teal} />
          <Wallet open direction="in" amount={800} />
        </StoryScene>
      </Sequence>
      <Sequence from={810} durationInFrames={90} name="Comparison template">
        <ComparisonScene
          title="Reusable / comparison"
          beat={2}
          left={{
            name: "SAM",
            character: "Sam",
            amount: budget.sam,
            detail: "Illustrated remaining",
            color: C.red,
            from: 0,
            acting: { pose: "slumped", expression: "worried" },
          }}
          right={{
            name: "ALEX",
            character: "Alex",
            amount: budget.alex,
            detail: "Illustrated remaining",
            color: C.teal,
            from: 0,
            acting: { pose: "celebrating", expression: "happy" },
          }}
          note="Shared stack scale: $0 to $1,000."
        />
      </Sequence>
      <Sequence from={900} durationInFrames={90} name="Diagram template">
        <DiagramScene title="Reusable / explanatory diagram" beat={3}>
          <MoneyFlow
            nodes={[
              { label: "Income", amount: budget.income },
              { label: "Expenses", amount: budget.samExpenses },
              { label: "Remaining", amount: budget.sam },
            ]}
          />
          <div style={{ marginTop: 50 }}>
            <DebtMeter principal={1000} annualRate={0.12} months={12} />
          </div>
        </DiagramScene>
      </Sequence>
      <Sequence from={990} durationInFrames={120} name="Motion primitives">
        <SceneTransition type="wipe">
          <SceneShell title="Motion / a short, purposeful reveal" beat={4}>
            <Camera2D from={20} duration={45} panX={-12} zoom={1.015}>
              <TextReveal
                from={12}
                style={{
                  position: "absolute",
                  left: 220,
                  top: 380,
                  fontSize: 96,
                  color: C.yellow,
                }}
              >
                Leave some room.
              </TextReveal>
              <EnterExit
                from={35}
                exitAt={90}
                style={{ position: "absolute", left: 220, top: 565 }}
              >
                <Expense
                  label="A deliberate upgrade"
                  amount={200}
                  color={C.teal}
                />
              </EnterExit>
            </Camera2D>
          </SceneShell>
        </SceneTransition>
      </Sequence>
    </>
  );
};
