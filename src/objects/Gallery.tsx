import { Fragment, type ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { NarrativeScene } from "../scenes/narrative";
import { C } from "../design/tokens";
import { ObjectAttachedLabel } from "../typography";
import {
  AnticipationFollow,
  ChainReaction,
  CharacterInteraction,
  ConveyorFlow,
  DrawOn,
  DropBounce,
  FlipCard,
  GrowBuild,
  InflateDeflate,
  MagnetPull,
  MorphObject,
  OrbitFloat,
  ParallaxLayers,
  Pendulum,
  PoofExit,
  PopIn,
  SlideInBlur,
  SplitAssemble,
  SpringWobble,
  SquashStretch,
} from "./motion";

const PANEL = 90;

const panels: {
  label: string;
  render: (t: { from: number; until: number }) => ReactNode;
}[] = [
  {
    label: "Pop-in with overshoot",
    render: (t) => <PopIn {...t} x={960} y={540} size={200} />,
  },
  {
    label: "Drop and bounce",
    render: (t) => (
      <DropBounce {...t} x={700} y={780} size={180} shape="square" />
    ),
  },
  {
    label: "Draw-on (stroke reveal)",
    render: (t) => <DrawOn {...t} x={700} y={520} size={220} />,
  },
  {
    label: "Slide-in with motion blur",
    render: (t) => (
      <SlideInBlur {...t} x={760} y={540} size={180} shape="square" />
    ),
  },
  {
    label: "Poof / puff exit",
    render: (t) => <PoofExit {...t} x={960} y={520} size={180} />,
  },
  {
    label: "Squash and stretch",
    render: (t) => (
      <SquashStretch {...t} x={960} y={520} size={150} color={C.yellow} />
    ),
  },
  {
    label: "Anticipation and follow-through",
    render: (t) => (
      <AnticipationFollow {...t} x={520} y={560} size={160} shape="square" />
    ),
  },
  {
    label: "Pendulum / swing",
    render: (t) => (
      <Pendulum {...t} x={960} y={660} size={110} color={C.yellow} />
    ),
  },
  {
    label: "Spring / wobble",
    render: (t) => (
      <SpringWobble {...t} x={960} y={560} size={170} shape="square" />
    ),
  },
  {
    label: "Orbit / float loop",
    render: (t) => (
      <OrbitFloat {...t} x={960} y={500} size={120} color={C.teal} />
    ),
  },
  {
    label: "Morph between objects",
    render: (t) => <MorphObject {...t} x={700} y={520} size={220} />,
  },
  {
    label: "Split and assemble",
    render: (t) => (
      <SplitAssemble {...t} x={960} y={520} size={200} shape="square" />
    ),
  },
  {
    label: "Grow / build-up",
    render: (t) => (
      <GrowBuild {...t} x={960} y={820} size={62} shape="square" />
    ),
  },
  {
    label: "Flip / card turn",
    render: (t) => (
      <FlipCard {...t} x={960} y={540} size={180} shape="square" />
    ),
  },
  {
    label: "Inflate / deflate",
    render: (t) => (
      <InflateDeflate {...t} x={960} y={540} size={130} color={C.teal} />
    ),
  },
  {
    label: "Character-object interaction",
    render: (t) => (
      <CharacterInteraction {...t} x={380} y={820} size={72} shape="square" />
    ),
  },
  {
    label: "Chain reaction / domino",
    render: (t) => (
      <ChainReaction {...t} x={300} y={680} size={72} shape="square" />
    ),
  },
  {
    label: "Conveyor / flow",
    render: (t) => (
      <ConveyorFlow {...t} x={420} y={600} size={72} />
    ),
  },
  {
    label: "Magnet pull / attract",
    render: (t) => (
      <MagnetPull {...t} x={320} y={540} size={70} />
    ),
  },
  {
    label: "Camera-follow parallax",
    render: (t) => (
      <ParallaxLayers {...t} x={220} y={560} size={64} shape="square" />
    ),
  },
];

export const OBJECT_GALLERY_DURATION = panels.length * PANEL;

export function ObjectMotionGallery() {
  const frame = useCurrentFrame();
  return (
    <NarrativeScene>
      {panels.map((panel, i) => {
        const from = i * PANEL;
        const until = from + PANEL;
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
