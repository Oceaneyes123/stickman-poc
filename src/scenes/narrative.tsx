import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import type { Rect } from "../animation/direction";
import { C, cinema, font } from "../design/tokens";
import "../design/fonts";

const PaperBackdrop = () => (
  <svg
    width={1920}
    height={1080}
    style={{ position: "absolute", inset: 0 }}
    aria-hidden="true"
  >
    <defs>
      <filter id="fixed-paper-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={0.68}
          numOctaves={3}
          seed={17}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <pattern
        id="paper-fibers"
        width={240}
        height={180}
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M13 19l31 2 M109 43l49 -1 M32 91l28 1 M169 132l37 -2 M81 163l29 1 M219 75l14 1"
          stroke={C.navy}
          strokeWidth={0.7}
          opacity={0.065}
        />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill="#F4F2EB" />
    <rect
      width={1920}
      height={1080}
      filter="url(#fixed-paper-grain)"
      opacity={0.14}
    />
    <rect width={1920} height={1080} fill="url(#paper-fibers)" />
  </svg>
);

type Layers = {
  background?: ReactNode;
  children: ReactNode;
  foreground?: ReactNode;
};
export const NarrativeScene = ({
  view = [0, 0, 1920, 1080],
  background,
  children,
  foreground,
}: Layers & { view?: Rect }) => (
  <AbsoluteFill style={{ background: C.white, fontFamily: font }}>
    <PaperBackdrop />
    <svg
      width={1920}
      height={1080}
      viewBox={view.join(" ")}
      style={{ position: "absolute", inset: 0, zIndex: 1, fontFamily: font }}
    >
      <defs>
        <filter id="cinema-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx={5}
            dy={8}
            stdDeviation={cinema.shadow.blur}
            floodColor={cinema.shadow.color}
            floodOpacity={cinema.shadow.opacity}
          />
        </filter>
      </defs>
      <g data-layer="background">{background}</g>
      <g data-layer="action">{children}</g>
      <g data-layer="foreground">{foreground}</g>
    </svg>
  </AbsoluteFill>
);
export const EnvironmentScene = ({
  background,
  children,
  foreground,
}: Layers) => (
  <g>
    {background}
    <g data-layer="people">{children}</g>
    <g data-layer="furniture">{foreground}</g>
  </g>
);
export const CloseUpScene = ({
  focus,
  ...layers
}: Layers & { focus: Rect }) => <NarrativeScene view={focus} {...layers} />;
export const FinancialRevealScene = ({
  at,
  progress,
  children,
}: {
  at: readonly [number, number];
  progress: number;
  children: ReactNode;
}) => (
  <g transform={`translate(${at[0]},${at[1]})`} opacity={progress}>
    {children}
  </g>
);
export const ComparisonScene = ({
  left,
  right,
  children,
}: {
  left: ReactNode;
  right: ReactNode;
  children?: ReactNode;
}) => (
  <NarrativeScene>
    <svg x={0} width={960} height={1080} viewBox="0 0 960 1080">
      {left}
    </svg>
    <svg x={960} width={960} height={1080} viewBox="0 0 960 1080">
      {right}
    </svg>
    <path
      d="M960 0V1080"
      stroke={C.navy}
      strokeOpacity={0.45}
      strokeWidth={3}
    />
    {children}
  </NarrativeScene>
);
export const SymbolicScene = ({
  subject,
  children,
}: {
  subject: string;
  children: ReactNode;
}) => (
  <g role="img" aria-label={subject}>
    {children}
  </g>
);

export const SceneText = ({
  x,
  y,
  size = cinema.text.label,
  children,
  fill = C.navy,
  anchor = "start",
}: {
  x: number;
  y: number;
  size?: number;
  children: ReactNode;
  fill?: string;
  anchor?: "start" | "middle" | "end";
}) => (
  <text
    x={x}
    y={y}
    fontSize={size}
    fontWeight={650}
    fill={fill}
    textAnchor={anchor}
  >
    {children}
  </text>
);
