import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { Alex, Sam, type CharacterProps } from "../characters/StickmanRig";
import { C, font } from "../design/tokens";
import { EnterExit, TextReveal } from "../animation/motion";
import { MoneyStack } from "../finance/components";

export const SceneShell = ({
  title,
  beat,
  children,
}: {
  title: string;
  beat: number;
  children: ReactNode;
}) => (
  <AbsoluteFill
    style={{ background: C.navy, color: C.white, fontFamily: font }}
  >
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 66,
        display: "flex",
        alignItems: "center",
        gap: 15,
      }}
    >
      <span style={{ width: 14, height: 14, background: C.yellow }} />
      <span style={{ fontSize: 25, letterSpacing: 4, fontWeight: 700 }}>
        THE MONEY TRAP
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        right: 96,
        top: 66,
        fontSize: 24,
        color: C.muted,
      }}
    >
      01 / LIFESTYLE CREEP
    </div>
    <TextReveal
      style={{
        position: "absolute",
        left: 96,
        top: 154,
        fontSize: 72,
        fontWeight: 750,
        letterSpacing: -2.5,
        lineHeight: 1.1,
        maxWidth: 1740,
      }}
    >
      {title}
    </TextReveal>
    {children}
    <div
      style={{
        position: "absolute",
        left: 96,
        bottom: 64,
        color: C.muted,
        fontSize: 24,
      }}
    >
      Hypothetical example · monthly take-home USD
    </div>
    <div
      style={{
        position: "absolute",
        right: 96,
        bottom: 68,
        display: "flex",
        gap: 8,
      }}
    >
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          style={{
            height: 5,
            width: index === beat - 1 ? 60 : 22,
            background: index === beat - 1 ? C.yellow : C.line,
          }}
        />
      ))}
    </div>
  </AbsoluteFill>
);

export const Environment = ({
  kind,
}: {
  kind: "office" | "apartment" | "street";
}) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0 }}
  >
    <path d="M 170 868 H 880" stroke={C.line} strokeWidth={3} />
    {kind === "office" ? (
      <g stroke={C.line} strokeWidth={5} fill="none">
        <rect x={190} y={345} width={170} height={225} rx={8} />
        <path d="M 275 345 V 570 M 190 455 H 360 M 660 740 H 860 M 680 740 V 866 M 845 740 V 866" />
        <rect x={696} y={608} width={132} height={88} rx={8} />
        <path d="M 762 696 V 735 M 721 735 H 801" />
        <path d="M 210 837 L 198 755 H 264 L 252 837 Z" />
        <path d="M 230 754 V 705 M 230 730 Q 185 714 201 682 Q 235 681 230 730 M 230 720 Q 270 687 272 720 Q 257 741 230 740" />
      </g>
    ) : kind === "apartment" ? (
      <g stroke={C.line} strokeWidth={5} fill="none">
        <path d="M 180 828 V 450 L 510 303 L 857 450 V 828" />
        <path d="M 660 864 V 576 H 804 V 864" />
        <circle cx={779} cy={732} r={5} fill={C.yellow} />
        <rect x={227} y={480} width={146} height={166} rx={5} />
        <path d="M 300 480 V 646 M 227 564 H 373" />
        <path d="M 182 864 H 874" />
      </g>
    ) : (
      <g stroke={C.line} strokeWidth={5} fill="none">
        <path d="M 170 590 H 857 M 170 425 H 857" strokeDasharray="12 18" />
        <path d="M 639 795 L 655 735 L 713 714 H 786 L 833 753 L 855 762 V 819 H 633 V 795 Z" />
        <circle cx={680} cy={819} r={23} fill={C.navy} />
        <circle cx={812} cy={819} r={23} fill={C.navy} />
        <path d="M 713 720 L 699 758 H 811 L 779 720" />
      </g>
    )}
  </svg>
);
export const StoryScene = ({
  title,
  beat,
  character,
  environment = "office",
  acting = {},
  children,
}: {
  title: string;
  beat: number;
  character: "Sam" | "Alex";
  environment?: "office" | "apartment" | "street";
  acting?: CharacterProps;
  children: ReactNode;
}) => {
  const Actor = character === "Sam" ? Sam : Alex;
  return (
    <SceneShell title={title} beat={beat}>
      <Environment kind={environment} />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Actor x={510} y={850} scale={1.6} {...acting} />
      </svg>
      <div style={{ position: "absolute", left: 980, top: 344, width: 810 }}>
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: 435,
          top: 900,
          fontSize: 30,
          fontWeight: 650,
          color: character === "Sam" ? C.yellow : C.teal,
        }}
      >
        {character.toUpperCase()}
      </div>
    </SceneShell>
  );
};
export type ComparisonSide = {
  name: string;
  character: "Sam" | "Alex";
  amount: number;
  detail: string;
  color: string;
  from: number;
  duration?: number;
  acting: CharacterProps;
};
export const ComparisonScene = ({
  title,
  beat,
  left,
  right,
  note,
}: {
  title: string;
  beat: number;
  left: ComparisonSide;
  right: ComparisonSide;
  note: string;
}) => (
  <SceneShell title={title} beat={beat}>
    <div
      style={{
        position: "absolute",
        left: 960,
        top: 300,
        height: 565,
        width: 2,
        background: C.line,
      }}
    />
    {[left, right].map((side, i) => {
      const Actor = side.character === "Sam" ? Sam : Alex;
      const x = 96 + 912 * i;
      return (
        <div key={side.name}>
          <div
            style={{
              position: "absolute",
              left: x + 20,
              top: 320,
              fontSize: 34,
              fontWeight: 650,
              color: side.color,
            }}
          >
            {side.name}
          </div>
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", inset: 0 }}
          >
            <Actor x={x + 160} y={850} scale={1.25} {...side.acting} />
          </svg>
          <EnterExit
            from={side.from}
            duration={side.duration}
            style={{ position: "absolute", left: x + 410, top: 422 }}
          >
            <MoneyStack
              amount={side.amount}
              maxAmount={1000}
              color={side.color}
              from={side.from}
              duration={side.duration}
            />
            <div
              style={{
                fontSize: 25,
                color: C.muted,
                width: 360,
                marginLeft: -20,
                textAlign: "center",
                marginTop: 18,
              }}
            >
              {side.detail}
            </div>
          </EnterExit>
        </div>
      );
    })}
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 913,
        fontSize: 28,
        color: C.muted,
      }}
    >
      {note}
    </div>
  </SceneShell>
);
export const DiagramScene = ({
  title,
  beat,
  children,
}: {
  title: string;
  beat: number;
  children: ReactNode;
}) => (
  <SceneShell title={title} beat={beat}>
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 96,
        top: 310,
        bottom: 160,
      }}
    >
      {children}
    </div>
  </SceneShell>
);
