import { useId, type ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../design/tokens";
import { clamp01 } from "../typography/timing";

export type TransitionId =
  | "hard-cut"
  | "cut-on-action"
  | "cut-on-look"
  | "lead-cut"
  | "smash-cut"
  | "match-position"
  | "match-shape"
  | "match-number"
  | "object-becomes-scene"
  | "push-in"
  | "pull-back"
  | "pan-follow"
  | "slide-push"
  | "wipe"
  | "object-wipe"
  | "iris"
  | "doorway"
  | "crossfade"
  | "dip-to-color"
  | "calendar-flip"
  | "relight"
  | "split-open"
  | "panel-freeze"
  | "state-swap"
  | "callback-cut";

type Mechanism =
  | "cut"
  | "flash-cut"
  | "crossfade"
  | "dip"
  | "push"
  | "wipe"
  | "object-wipe"
  | "iris"
  | "doorway"
  | "calendar"
  | "relight"
  | "split"
  | "freeze"
  | "zoom-through"
  | "camera-push"
  | "camera-pull"
  | "camera-pan";

// The ID is the editorial decision; the mechanism is the only thing drawn. Cuts and
// match cuts share the cut mechanism on purpose: their difference is where the action
// sits on either side, which belongs to the scenes, not to a transition effect.
const MECHANISM: Record<TransitionId, Mechanism> = {
  "hard-cut": "cut",
  "cut-on-action": "cut",
  "cut-on-look": "cut",
  "lead-cut": "cut",
  "smash-cut": "flash-cut",
  "match-position": "cut",
  "match-shape": "cut",
  "match-number": "cut",
  "callback-cut": "cut",
  "object-becomes-scene": "zoom-through",
  "push-in": "camera-push",
  "pull-back": "camera-pull",
  "pan-follow": "camera-pan",
  "slide-push": "push",
  wipe: "wipe",
  "object-wipe": "object-wipe",
  iris: "iris",
  doorway: "doorway",
  crossfade: "crossfade",
  "dip-to-color": "dip",
  "calendar-flip": "calendar",
  relight: "relight",
  "split-open": "split",
  "panel-freeze": "freeze",
  "state-swap": "crossfade",
};

export const TRANSITIONS: {
  id: TransitionId;
  family: string;
  use: string;
}[] = [
  { id: "hard-cut", family: "Cuts", use: "New beat, or the idea continues" },
  { id: "cut-on-action", family: "Cuts", use: "An action carries across scenes" },
  { id: "cut-on-look", family: "Cuts", use: "Sam notices something" },
  { id: "lead-cut", family: "Cuts", use: "Sentence changes inside a scene" },
  { id: "smash-cut", family: "Cuts", use: "Calm into a shocking number (rare)" },
  { id: "match-position", family: "Match", use: "Phone into account view" },
  { id: "match-shape", family: "Match", use: "Coin into sun, card into ledger" },
  { id: "match-number", family: "Match", use: "Money carries across scenes" },
  {
    id: "object-becomes-scene",
    family: "Match",
    use: "Phone, laptop, notice",
  },
  { id: "push-in", family: "Camera", use: "Emphasis on one object" },
  { id: "pull-back", family: "Camera", use: "Reveal the frame or the pair" },
  { id: "pan-follow", family: "Camera", use: "Travel, handoff" },
  { id: "slide-push", family: "Camera", use: "Sequences, comparisons" },
  { id: "wipe", family: "Reveal", use: "Neutral change of topic" },
  { id: "object-wipe", family: "Reveal", use: "Money object as the transition" },
  { id: "iris", family: "Reveal", use: "Punchline or end of a chapter" },
  { id: "doorway", family: "Reveal", use: "Location change" },
  { id: "crossfade", family: "Time and mood", use: "Time passing, softer mood" },
  {
    id: "dip-to-color",
    family: "Time and mood",
    use: "Chapter break (yellow for a money reveal)",
  },
  { id: "calendar-flip", family: "Time and mood", use: "Month 1 to Month 2" },
  { id: "relight", family: "Time and mood", use: "“Things got worse” without new art" },
  { id: "split-open", family: "Structure", use: "Sam vs Alex" },
  { id: "panel-freeze", family: "Structure", use: "Introducing an example" },
  { id: "state-swap", family: "Structure", use: "Before/after, month to month" },
  {
    id: "callback-cut",
    family: "Structure",
    use: "Payoff of an earlier scene",
  },
];

export function Transition({
  id,
  start,
  end,
  frame,
  before,
  after,
  width = 1920,
  height = 1080,
  color = C.navy,
}: {
  id: TransitionId;
  start: number;
  end: number;
  frame?: number;
  before: ReactNode;
  after: ReactNode;
  width?: number;
  height?: number;
  color?: string;
}) {
  const current = useCurrentFrame();
  const f = frame ?? current;
  const uid = useId().replaceAll(":", "");
  const p = clamp01((f - start) / Math.max(1, end - start));
  const cx = width / 2;
  const cy = height / 2;
  const mechanism = MECHANISM[id];

  switch (mechanism) {
    case "cut":
      return <>{p < 0.5 ? before : after}</>;
    case "flash-cut":
      return (
        <>
          {p < 0.5 ? before : after}
          <rect
            width={width}
            height={height}
            fill={C.white}
            opacity={Math.abs(p - 0.5) < 0.06 ? 0.8 : 0}
          />
        </>
      );
    case "crossfade":
      return (
        <>
          <g opacity={1 - p}>{before}</g>
          <g opacity={p}>{after}</g>
        </>
      );
    case "dip":
      return (
        <>
          <g opacity={1 - clamp01(p * 2)}>{before}</g>
          <g opacity={clamp01((p - 0.5) * 2)}>{after}</g>
          <rect
            width={width}
            height={height}
            fill={color}
            opacity={1 - Math.abs(p - 0.5) * 2}
          />
        </>
      );
    case "push":
      return (
        <>
          <g transform={`translate(${-width * p},0)`}>{before}</g>
          <g transform={`translate(${width * (1 - p)},0)`}>{after}</g>
        </>
      );
    case "wipe":
    case "object-wipe": {
      const edge = width * p;
      return (
        <>
          <defs>
            <linearGradient id={`${uid}-soft`} x1="0" x2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
            <mask id={`${uid}-mask`}>
              <rect x={0} y={0} width={Math.max(0, edge - 70)} height={height} fill="#fff" />
              <rect
                x={edge - 70}
                y={0}
                width={70}
                height={height}
                fill={`url(#${uid}-soft)`}
              />
            </mask>
          </defs>
          {before}
          <g mask={`url(#${uid}-mask)`}>{after}</g>
          {mechanism === "object-wipe" && (
            <g transform={`translate(${edge},${cy}) rotate(-8)`}>
              <rect
                x={-34}
                y={-height * 0.55}
                width={68}
                height={height * 1.1}
                fill={C.yellow}
                stroke={C.navy}
                strokeWidth={4}
              />
            </g>
          )}
        </>
      );
    }
    case "iris": {
      const maxR = Math.hypot(width, height) / 2;
      const closing = p < 0.5;
      const r = maxR * (closing ? 1 - p * 2 : (p - 0.5) * 2);
      return (
        <>
          <defs>
            <mask id={`${uid}-iris`}>
              <rect width={width} height={height} fill="#fff" />
              <circle cx={cx} cy={cy} r={Math.max(0.01, r)} fill="#000" />
            </mask>
          </defs>
          {closing ? before : after}
          <rect
            width={width}
            height={height}
            fill={C.navy}
            mask={`url(#${uid}-iris)`}
          />
        </>
      );
    }
    case "doorway": {
      const k = clamp01((p - 0.3) / 0.7);
      return (
        <>
          <g transform={`translate(${cx},${cy}) scale(${1 + 0.05 * p}) translate(${-cx},${-cy})`}>
            {before}
          </g>
          <g
            clipPath={`url(#${uid}-door)`}
            transform={`translate(${cx},${cy}) scale(${0.96 + 0.04 * k}) translate(${-cx},${-cy})`}
          >
            {after}
          </g>
          <defs>
            <clipPath id={`${uid}-door`}>
              <rect
                x={cx - (width * k) / 2}
                y={cy - (height * k) / 2}
                width={width * k}
                height={height * k}
              />
            </clipPath>
          </defs>
        </>
      );
    }
    case "calendar":
      return (
        <>
          <g transform={`scale(1,${Math.max(0.001, 1 - p)})`}>{before}</g>
          <g transform={`translate(0,${height * (1 - p)})`}>{after}</g>
        </>
      );
    case "relight":
      return (
        <>
          <g opacity={1 - p}>{before}</g>
          <g opacity={p}>{after}</g>
          <rect
            width={width}
            height={height}
            fill={color}
            opacity={0.32 * Math.sin(p * Math.PI)}
          />
        </>
      );
    case "split": {
      const gap = 140 * p;
      return (
        <>
          <defs>
            <clipPath id={`${uid}-left`}>
              <rect x={0} y={0} width={width / 2} height={height} />
            </clipPath>
            <clipPath id={`${uid}-right`}>
              <rect x={width / 2} y={0} width={width / 2} height={height} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${uid}-left)`}>
            <g transform={`translate(${-gap},${height * 0.25}) scale(0.5)`}>
              {before}
            </g>
          </g>
          <g clipPath={`url(#${uid}-right)`} opacity={clamp01(p * 1.8)}>
            <g transform={`translate(${width / 2 + gap},${height * 0.25}) scale(0.5)`}>
              {after}
            </g>
          </g>
        </>
      );
    }
    case "freeze": {
      const k = clamp01((p - 0.35) / 0.65);
      const sw = width * (1 - 0.62 * k);
      const sh = height * (1 - 0.62 * k);
      return (
        <>
          <g opacity={k}>{after}</g>
          <g
            transform={`translate(${width * 0.62},${height * 0.58}) scale(${1 - 0.62 * k}) translate(${-cx},${-cy})`}
          >
            {before}
          </g>
          <rect
            x={width * 0.62 - sw / 2}
            y={height * 0.58 - sh / 2}
            width={sw}
            height={sh}
            fill="none"
            stroke={C.white}
            strokeWidth={14}
            opacity={k}
          />
          <rect
            x={width * 0.62 - sw / 2}
            y={height * 0.58 - sh / 2}
            width={sw}
            height={sh}
            fill="none"
            stroke={C.navy}
            strokeWidth={5}
            opacity={k}
          />
        </>
      );
    }
    case "zoom-through": {
      const z = clamp01(p / 0.7);
      return (
        <>
          <g opacity={1 - clamp01((p - 0.45) / 0.2)}>
            <g transform={`translate(${cx},${cy}) scale(${1 + 9 * z}) translate(${-cx},${-cy})`}>
              {before}
            </g>
          </g>
          <g opacity={clamp01((p - 0.4) / 0.4)}>{after}</g>
        </>
      );
    }
    case "camera-push":
    case "camera-pull":
    case "camera-pan": {
      const zoomIn = mechanism === "camera-push";
      const scale = zoomIn ? 1 + 0.32 * p : 1.32 - 0.32 * p;
      const shift = mechanism === "camera-pan" ? -260 * p : 0;
      const moving = p < 0.62 ? before : after;
      return (
        <g transform={`translate(${cx + shift},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
          {moving}
        </g>
      );
    }
  }
}
