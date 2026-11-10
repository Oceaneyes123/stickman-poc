import { Fragment, type ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { NarrativeScene } from "../scenes/narrative";
import { C, font } from "../design/tokens";
import { ObjectAttachedLabel } from "../typography";
import { Transition, TRANSITIONS, type TransitionId } from "./index";

const PANEL = 90;

const Card = ({
  title,
  bg,
  fg,
  shape = "circle",
  x = 960,
  y = 540,
  size = 240,
}: {
  title: string;
  bg: string;
  fg: string;
  shape?: "circle" | "square";
  x?: number;
  y?: number;
  size?: number;
}) => (
  <g>
    <rect width={1920} height={1080} fill={bg} />
    {shape === "circle" ? (
      <circle cx={x} cy={y} r={size / 2} fill={fg} />
    ) : (
      <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={14} fill={fg} />
    )}
    <text
      x={150}
      y={900}
      fontFamily={font}
      fontSize={76}
      fontWeight={800}
      fill={bg === C.navy ? C.white : C.navy}
    >
      {title}
    </text>
  </g>
);

const sceneA = () => <Card title="SCENE A" bg={C.navy} fg={C.yellow} />;
const sceneB = () => <Card title="SCENE B" bg={C.white} fg={C.teal} shape="square" />;

const amount = (bg: string, label: string) => (
  <g>
    <rect width={1920} height={1080} fill={bg} />
    <text
      x={960}
      y={600}
      textAnchor="middle"
      fontFamily={font}
      fontSize={220}
      fontWeight={800}
      fill={bg === C.navy ? C.yellow : C.navy}
    >
      $600
    </text>
    <text
      x={150}
      y={900}
      fontFamily={font}
      fontSize={76}
      fontWeight={800}
      fill={bg === C.navy ? C.white : C.navy}
    >
      {label}
    </text>
  </g>
);

const sceneById: Partial<Record<TransitionId, { before: ReactNode; after: ReactNode }>> = {
  "match-shape": {
    before: <Card title="COIN" bg={C.navy} fg={C.yellow} />,
    after: <Card title="SUN" bg={C.white} fg={C.yellow} />,
  },
  "match-position": {
    before: (
      <Card title="PHONE" bg={C.navy} fg={C.line} shape="square" x={620} y={520} size={420} />
    ),
    after: (
      <Card title="LEDGER" bg={C.white} fg={C.teal} shape="square" x={620} y={520} size={420} />
    ),
  },
  "match-number": {
    before: amount(C.navy, "MONTH 1"),
    after: amount(C.white, "MONTH 2"),
  },
  "state-swap": {
    before: <Card title="BEFORE" bg={C.navy} fg={C.yellow} shape="square" />,
    after: <Card title="AFTER" bg={C.navy} fg={C.teal} shape="square" />,
  },
  "callback-cut": {
    before: <Card title="SETUP, REVISITED" bg={C.navy} fg={C.yellow} />,
    after: <Card title="PAYOFF" bg={C.white} fg={C.red} />,
  },
  "object-becomes-scene": {
    before: (
      <g>
        <rect width={1920} height={1080} fill={C.navy} />
        <rect x={810} y={390} width={300} height={300} rx={18} fill={C.yellow} />
        <text x={150} y={900} fontFamily={font} fontSize={76} fontWeight={800} fill={C.white}>
          A SCREEN
        </text>
      </g>
    ),
    after: <Card title="THE ACCOUNT" bg={C.white} fg={C.teal} shape="square" />,
  },
  "cut-on-action": {
    before: (
      <g>
        <rect width={1920} height={1080} fill={C.navy} />
        <circle cx={700} cy={520} r={110} fill={C.yellow} />
        <text x={150} y={900} fontFamily={font} fontSize={76} fontWeight={800} fill={C.white}>
          WIND-UP
        </text>
      </g>
    ),
    after: (
      <g>
        <rect width={1920} height={1080} fill={C.white} />
        <circle cx={1220} cy={520} r={110} fill={C.yellow} />
        <text x={150} y={900} fontFamily={font} fontSize={76} fontWeight={800} fill={C.navy}>
          FOLLOW-THROUGH
        </text>
      </g>
    ),
  },
  "cut-on-look": {
    before: (
      <g>
        <rect width={1920} height={1080} fill={C.navy} />
        <circle cx={960} cy={520} r={120} fill={C.white} />
        <circle cx={1000} cy={520} r={34} fill={C.navy} />
        <text x={150} y={900} fontFamily={font} fontSize={76} fontWeight={800} fill={C.white}>
          A GLANCE
        </text>
      </g>
    ),
    after: <Card title="WHAT THEY SAW" bg={C.white} fg={C.yellow} shape="square" />,
  },
  "lead-cut": {
    before: <Card title="IDEA ONE" bg={C.navy} fg={C.yellow} />,
    after: <Card title="IDEA TWO" bg={C.navy} fg={C.teal} shape="square" />,
  },
};

export const TRANSITION_GALLERY_DURATION = TRANSITIONS.length * PANEL;

export function TransitionGallery() {
  const frame = useCurrentFrame();
  return (
    <NarrativeScene>
      {TRANSITIONS.map((entry, i) => {
        const from = i * PANEL;
        const until = from + PANEL;
        if (frame < from || frame >= until) return null;
        const scenes = sceneById[entry.id] ?? { before: sceneA(), after: sceneB() };
        return (
          <Fragment key={entry.id}>
            <Transition
              id={entry.id}
              start={from + 14}
              end={until - 14}
              before={scenes.before}
              after={scenes.after}
            />
            <ObjectAttachedLabel
              x={150}
              y={1010}
              object={{ x: 130, y: 1010 }}
              text={`${i + 1}. ${entry.id} · ${entry.family}`}
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
