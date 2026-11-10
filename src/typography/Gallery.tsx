import { Fragment, type ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { NarrativeScene } from "../scenes/narrative";
import { C } from "../design/tokens";
import { example, calculateBudget } from "../finance/math";
import {
  AnimatedList,
  AnimatedNumber,
  AnimatedUnderline,
  ComparisonReveal,
  KineticHeadline,
  ObjectAttachedLabel,
  SectionHeading,
  TextMorph,
} from "./index";
import {
  BalloonInflate,
  ChromaticSlice,
  EchoTrail,
  ElasticText,
  FlipText,
  GlitchText,
  GravityDrop,
  InkBleed,
  LightTrail,
  LiquidMelt,
  MagneticSnap,
  MarqueeTicker,
  MorphStretch,
  NeonFlicker,
  OrbitWords,
  OutlineReveal,
  PaperTear,
  ParticleDissolve,
  PathText,
  RopeSwing,
  ScrambleText,
  SpiralVortex,
  Spotlight,
  TextMask,
  TextTunnel,
  TypeCollage,
  TypeStack,
  ZoomThrough,
} from "./motion";
import { clamp01 } from "./timing";
const budget = calculateBudget(example);
const STYLE_START = 360;
const STYLE_FRAME = 90;

const stylePanels: {
  label: string;
  render: (t: { from: number; until: number }) => ReactNode;
}[] = [
  {
    label: "Word-by-word pop/reveal",
    render: (t) => (
      <KineticHeadline
        {...t}
        x={150}
        y={360}
        text="A raise creates room"
        unit="word"
        stagger={6}
        motion="pop"
        size={78}
        width={1500}
      />
    ),
  },
  {
    label: "Highlight-on-keyword (karaoke)",
    render: (t) => (
      <KineticHeadline
        {...t}
        x={150}
        y={380}
        text="The rent went up again"
        unit="word"
        stagger={10}
        motion="karaoke"
        size={80}
        width={1500}
      />
    ),
  },
  {
    label: "Scale and punch emphasis",
    render: (t) => (
      <KineticHeadline
        {...t}
        x={150}
        y={380}
        text="Money pauses, not vanishes"
        unit="word"
        stagger={5}
        motion="punch"
        emphasis="pauses"
        emphasisColor={C.red}
        size={78}
        width={1500}
      />
    ),
  },
  {
    label: "Slide and mask reveal",
    render: (t) => (
      <KineticHeadline
        {...t}
        x={150}
        y={380}
        text="Saved before it is spent"
        unit="line"
        size={84}
        width={1500}
      />
    ),
  },
  {
    label: "Typewriter",
    render: (t) => (
      <KineticHeadline
        {...t}
        x={150}
        y={400}
        text="Every dollar needs a job."
        unit="character"
        stagger={1}
        motion="typewriter"
        cursor
        size={68}
        width={1500}
      />
    ),
  },
  {
    label: "Stagger / cascade",
    render: (t) => (
      <KineticHeadline
        {...t}
        x={150}
        y={400}
        text="CASCADE OF WORDS"
        unit="character"
        stagger={2}
        motion="pop"
        size={96}
        width={1600}
      />
    ),
  },
  {
    label: "Shake / glitch",
    render: (t) => (
      <GlitchText {...t} x={150} y={450} text="OVERDRAFT" size={130} />
    ),
  },
  {
    label: "Bounce / elastic",
    render: (t) => (
      <ElasticText {...t} x={150} y={460} text="Save first" size={130} />
    ),
  },
  {
    label: "3D rotate / flip",
    render: (t) => (
      <FlipText {...t} x={960} y={470} text="New habit" size={140} />
    ),
  },
  {
    label: "Zoom-through / camera fly",
    render: (t) => (
      <ZoomThrough {...t} x={960} y={540} text="PAY YOURSELF" size={200} />
    ),
  },
  {
    label: "Text on path",
    render: (t) => (
      <PathText
        {...t}
        x={150}
        y={380}
        text="the money follows the plan, not the mood"
        size={56}
      />
    ),
  },
  {
    label: "Typographic stack (lyric style)",
    render: (t) => (
      <TypeStack
        {...t}
        x={150}
        y={280}
        lines={[
          { text: "Rent", size: 130, weight: 800 },
          {
            text: "was never the problem",
            size: 66,
            weight: 600,
            color: C.line,
          },
          { text: "THE HABIT WAS", size: 104, weight: 800, color: C.red },
        ]}
      />
    ),
  },
  {
    label: "Text-as-shape / mask",
    render: (t) => <TextMask {...t} x={170} y={580} text="MONEY" size={250} />,
  },
  {
    label: "Outline-to-fill / stroke draw-on",
    render: (t) => (
      <OutlineReveal
        {...t}
        x={150}
        y={540}
        text="A job for every dollar"
        size={92}
      />
    ),
  },
  {
    label: "Typography collage",
    render: (t) => (
      <TypeCollage
        {...t}
        x={0}
        y={0}
        words={[
          { text: "MONEY", x: 150, y: 300, size: 150, rotate: -6 },
          { text: "habit", x: 820, y: 250, size: 110, rotate: 4, color: C.red },
          {
            text: "SAVE",
            x: 1240,
            y: 430,
            size: 128,
            rotate: -3,
            color: C.teal,
          },
          {
            text: "noise",
            x: 220,
            y: 610,
            size: 84,
            rotate: 8,
            color: C.line,
            weight: 600,
          },
          { text: "plan", x: 700, y: 720, size: 170, rotate: -2 },
          {
            text: "SPENT",
            x: 1320,
            y: 780,
            size: 96,
            rotate: 5,
            color: C.line,
            weight: 600,
          },
        ]}
      />
    ),
  },
  {
    label: "Gravity drop and pile",
    render: (t) => (
      <GravityDrop {...t} x={150} y={240} text="COSTS STACK UP" size={92} />
    ),
  },
  {
    label: "Liquid / melt text",
    render: (t) => (
      <LiquidMelt {...t} x={150} y={400} text="SUBSCRIPTIONS" size={100} />
    ),
  },
  {
    label: "Balloon inflate",
    render: (t) => (
      <BalloonInflate {...t} x={380} y={560} text="ONE MORE" size={110} />
    ),
  },
  {
    label: "Magnetic snap",
    render: (t) => (
      <MagneticSnap {...t} x={400} y={480} text="BUDGET" size={140} />
    ),
  },
  {
    label: "Rope or string swing",
    render: (t) => (
      <RopeSwing {...t} x={460} y={580} text="HABIT" size={130} />
    ),
  },
  {
    label: "Letter scramble decode",
    render: (t) => (
      <ScrambleText {...t} x={300} y={470} text="INVEST" size={130} />
    ),
  },
  {
    label: "Morph / shape-shift",
    render: (t) => (
      <MorphStretch {...t} x={280} y={470} before="SPENDING" after="SAVING" size={110} />
    ),
  },
  {
    label: "Ink bleed / paint splash",
    render: (t) => <InkBleed {...t} x={150} y={520} text="SAVED" size={150} />,
  },
  {
    label: "Paper tear / unfold",
    render: (t) => (
      <PaperTear {...t} x={300} y={520} text="NEW PLAN" size={130} />
    ),
  },
  {
    label: "Spotlight / flashlight reveal",
    render: (t) => (
      <Spotlight {...t} x={150} y={540} text="FOUND MONEY" size={130} />
    ),
  },
  {
    label: "Particle dissolve",
    render: (t) => (
      <ParticleDissolve {...t} x={250} y={480} text="VANISHES" size={120} />
    ),
  },
  {
    label: "Neon sign flicker",
    render: (t) => (
      <NeonFlicker {...t} x={300} y={500} text="OPEN LATE" size={110} />
    ),
  },
  {
    label: "Light trail writing",
    render: (t) => (
      <LightTrail {...t} x={150} y={500} text="FOLLOW THE MONEY" size={90} />
    ),
  },
  {
    label: "Chromatic slice",
    render: (t) => (
      <ChromaticSlice {...t} x={300} y={490} text="GLITCH" size={140} />
    ),
  },
  {
    label: "Echo / trail repeat",
    render: (t) => <EchoTrail {...t} x={420} y={490} text="SPEED" size={140} />,
  },
  {
    label: "Spiral / vortex text",
    render: (t) => (
      <SpiralVortex
        {...t}
        x={960}
        y={500}
        size={52}
        words={["rent", "food", "fun", "debt", "saving"]}
        focus="PLAN"
      />
    ),
  },
  {
    label: "Text tunnel",
    render: (t) => (
      <TextTunnel {...t} x={960} y={540} text="MONEY" size={70} />
    ),
  },
  {
    label: "Grid flip board",
    render: (t) => (
      <ScrambleText {...t} x={300} y={480} text="DEPOSIT" size={120} mode="flip" per={5} />
    ),
  },
  {
    label: "Orbiting words",
    render: (t) => (
      <OrbitWords
        {...t}
        x={960}
        y={500}
        size={40}
        center="BUDGET"
        words={["rent", "food", "fun", "debt", "saving"]}
      />
    ),
  },
  {
    label: "Scrolling marquee / ticker",
    render: (t) => (
      <MarqueeTicker
        {...t}
        x={0}
        y={140}
        rows={[
          "SPEND LESS · SAVE MORE · ",
          "THE TRAP IS THE HABIT · ",
          "PAY YOURSELF FIRST · ",
        ]}
        headline="PAY YOURSELF"
      />
    ),
  },
];

export const TYPOGRAPHY_GALLERY_DURATION =
  STYLE_START + stylePanels.length * STYLE_FRAME;
export function TypographyGallery() {
  const frame = useCurrentFrame();
  const objectX = 220 + 180 * clamp01((frame - 30) / 35);
  return (
    <NarrativeScene>
      {frame < 120 && (
        <>
          <KineticHeadline
            x={150}
            y={120}
            text="A raise creates room"
            from={10}
            until={120}
            unit="word"
            size={72}
            width={1500}
          />
          <rect
            x={objectX}
            y={440}
            width={260}
            height={240}
            fill={C.yellow}
            stroke={C.navy}
            strokeWidth={4}
          />
          <AnimatedNumber
            x={objectX + 30}
            y={580}
            value={example.raise}
            from={25}
            until={120}
            mode="odometer"
            size={80}
          />
          <ObjectAttachedLabel
            x={objectX + 350}
            y={460}
            object={{ x: objectX + 260, y: 500 }}
            text="Monthly increase"
            from={30}
            until={120}
          />
          <AnimatedUnderline
            x={objectX}
            y={715}
            width={260}
            from={40}
            until={120}
          />
        </>
      )}
      {frame >= 120 && frame < 240 && (
        <>
          <SectionHeading
            x={150}
            y={110}
            text="One plan, several commitments"
            from={120}
            until={240}
            size={48}
          />
          <AnimatedList
            x={180}
            y={350}
            from={130}
            until={240}
            gap={90}
            items={example.upgrades.map((item, i) => ({
              text: item.label,
              from: 130 + i * 15,
            }))}
          />
          <ComparisonReveal
            x={870}
            y={400}
            from={130}
            until={240}
            left={budget.before}
            right={budget.alex}
            leftAt={140}
            rightAt={170}
            differenceAt={210}
            width={480}
          />
        </>
      )}
      {frame >= 240 && frame < STYLE_START && (
        <>
          <SectionHeading
            x={150}
            y={110}
            text="A calculation becomes an action"
            from={240}
            until={360}
            size={48}
          />
          <KineticHeadline
            x={180}
            y={300}
            text="KEEP"
            unit="character"
            stagger={4}
            from={250}
            until={360}
            size={84}
          />
          <TextMorph
            x={180}
            y={650}
            before="Remaining"
            after="Saved"
            changeAt={295}
            destination={{ x: 1050, y: 650 }}
            from={245}
            until={360}
            size={64}
          />
        </>
      )}
      {stylePanels.map((panel, i) => {
        const from = STYLE_START + i * STYLE_FRAME;
        const until = from + STYLE_FRAME;
        if (frame < from || frame >= until) return null;
        return (
          <Fragment key={panel.label}>
            {panel.render({ from: from + 6, until: until - 6 })}
            <ObjectAttachedLabel
              x={150}
              y={1000}
              object={{ x: 130, y: 1000 }}
              text={`${i + 1}. ${panel.label}`}
              from={from}
              until={until}
              size={30}
              color={C.line}
            />
          </Fragment>
        );
      })}
    </NarrativeScene>
  );
}
