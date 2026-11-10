import { useId } from "react";
import { spring } from "remotion";
import { C } from "../design/tokens";
import { clamp01 } from "../typography/timing";
import { useStyle, type StyleProps } from "../typography/motion";

export type ShapeKind = "circle" | "square";
export type ObjectProps = StyleProps & { shape?: ShapeKind };

const Body = ({
  kind = "circle",
  r,
  fill,
  stroke = C.navy,
  strokeWidth = 4,
  fillOpacity = 1,
}: {
  kind?: ShapeKind;
  r: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  fillOpacity?: number;
}) =>
  kind === "circle" ? (
    <circle
      r={r}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  ) : (
    <rect
      x={-r}
      y={-r}
      width={r * 2}
      height={r * 2}
      rx={r * 0.12}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );

const radius = (props: ObjectProps) => (props.size ?? 120) / 2;

export function PopIn(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const s = p.settle({ damping: 10, stiffness: 200, mass: 0.6 });
  return (
    <g
      transform={`translate(${props.x},${props.y}) scale(${0.2 + 0.8 * s})`}
      opacity={p.opacity * clamp01(s * 3)}
    >
      <Body kind={props.shape} r={radius(props)} fill={props.color ?? C.yellow} />
    </g>
  );
}

export function DropBounce(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const t = p.local / p.fps;
  const g = 3600;
  const dist = 520;
  let drop = 0.5 * g * t * t;
  let squash = 1;
  if (drop > dist) {
    const bt = t - Math.sqrt((2 * dist) / g);
    drop = dist - Math.abs(Math.sin(bt * 9)) * 140 * Math.exp(-bt * 2.6);
    squash = 1 + 0.22 * Math.exp(-bt * 5);
  }
  const sy = 1 / squash;
  return (
    <g opacity={p.opacity}>
      <ellipse
        cx={props.x}
        cy={props.y}
        rx={r * (1.1 - 0.5 * (1 - drop / dist))}
        ry={r * 0.16}
        fill={C.navy}
        opacity={0.14}
      />
      <g transform={`translate(${props.x},${props.y - r * sy - (dist - drop)}) scale(${squash},${sy})`}>
        <Body kind={props.shape} r={r} fill={props.color ?? C.yellow} />
      </g>
    </g>
  );
}

export function DrawOn(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const d =
    props.shape === "square"
      ? `M${-r} ${-r} H${r} V${r} H${-r} Z`
      : `M${r} 0 A${r} ${r} 0 1 1 ${-r} 0 A${r} ${r} 0 1 1 ${r} 0 Z`;
  const draw = clamp01(p.local / 34);
  const fill = clamp01((p.local - 30) / 16);
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      <path
        d={d}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        fill={props.color ?? C.yellow}
        fillOpacity={fill}
        stroke={C.navy}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </g>
  );
}

export function SlideInBlur(props: ObjectProps) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  if (!p.visible) return null;
  const e = 1 - (1 - clamp01(p.local / 26)) ** 3;
  const blur = 24 * (1 - e);
  return (
    <g opacity={p.opacity}>
      <defs>
        <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      <g
        filter={blur > 0.6 ? `url(#${id})` : undefined}
        transform={`translate(${props.x - 700 * (1 - e)},${props.y})`}
      >
        <Body kind={props.shape} r={radius(props)} fill={props.color ?? C.teal} />
      </g>
    </g>
  );
}

export function PoofExit(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const t = clamp01((p.local - 30) / 26);
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      <g transform={`scale(${1 - 0.85 * t})`} opacity={1 - t}>
        <Body kind={props.shape} r={r} fill={props.color ?? C.yellow} />
      </g>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + 0.4;
        const d = 30 + 170 * t;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * d}
            cy={Math.sin(a) * d * 0.8}
            r={11 * (1 - t) + 2}
            fill={i % 2 ? C.line : C.navy}
            opacity={(1 - t) * 0.8}
          />
        );
      })}
    </g>
  );
}

export function SquashStretch(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const speed = Math.cos(p.local * 0.09);
  const k = Math.abs(speed) * 0.32;
  return (
    <g opacity={p.opacity}>
      <ellipse
        cx={props.x + 320 * Math.sin(p.local * 0.09)}
        cy={props.y + radius(props) + 14}
        rx={radius(props) * 0.8}
        ry={radius(props) * 0.14}
        fill={C.navy}
        opacity={0.12}
      />
      <g
        transform={`translate(${props.x + 320 * Math.sin(p.local * 0.09)},${props.y}) scale(${1 + k},${1 - k})`}
      >
        <Body kind={props.shape} r={radius(props)} fill={props.color ?? C.teal} />
      </g>
    </g>
  );
}

export function AnticipationFollow(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const wind = -70 * Math.min(1, Math.max(0, p.local) / 12);
  const go =
    p.local <= 12
      ? 0
      : spring({
          frame: p.local - 12,
          fps: p.fps,
          config: { damping: 13, stiffness: 130 },
        });
  const stretch = 1 + 0.3 * go * (1 - clamp01(go));
  return (
    <g
      transform={`translate(${props.x + wind + 320 * go},${props.y}) scale(${stretch},${1 / stretch})`}
      opacity={p.opacity}
    >
      <Body kind={props.shape} r={radius(props)} fill={props.color ?? C.yellow} />
    </g>
  );
}

export function Pendulum(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const pivotY = props.y - 300;
  const angle = Math.sin(p.local * 0.24) * 30 * Math.exp(-p.local * 0.045);
  return (
    <g opacity={p.opacity}>
      <g transform={`rotate(${angle},${props.x},${pivotY})`}>
        <line
          x1={props.x}
          y1={pivotY}
          x2={props.x}
          y2={props.y - r}
          stroke={C.line}
          strokeWidth={3}
        />
        <g transform={`translate(${props.x},${props.y})`}>
          <Body kind={props.shape} r={r} fill={props.color ?? C.yellow} />
        </g>
      </g>
      <circle cx={props.x} cy={pivotY} r={7} fill={C.navy} />
    </g>
  );
}

export function SpringWobble(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const hit = Math.max(0, p.local - 8);
  const w = Math.sin(hit * 0.5) * Math.exp(-hit * 0.07);
  return (
    <g
      transform={`translate(${props.x},${props.y}) rotate(${4 * w}) scale(${1 + 0.24 * w},${1 - 0.24 * w})`}
      opacity={p.opacity}
    >
      <Body kind={props.shape} r={radius(props)} fill={props.color ?? C.teal} />
    </g>
  );
}

export function OrbitFloat(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const bob = Math.sin(p.local * 0.08) * 16;
  const drift = Math.cos(p.local * 0.05) * 34;
  return (
    <g opacity={p.opacity}>
      <ellipse
        cx={props.x + drift}
        cy={props.y + r + 26}
        rx={r * (0.8 + 0.15 * (bob / 16))}
        ry={r * 0.13}
        fill={C.navy}
        opacity={0.12}
      />
      <g transform={`translate(${props.x + drift},${props.y + bob})`}>
        <Body kind={props.shape} r={r} fill={props.color ?? C.yellow} />
      </g>
    </g>
  );
}

export function MorphObject(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const t = clamp01((p.local - 10) / 28);
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      <rect
        x={-r}
        y={-r}
        width={r * 2}
        height={r * 2}
        rx={r * (1 - t)}
        fill={t < 0.5 ? (props.color ?? C.yellow) : C.teal}
        stroke={C.navy}
        strokeWidth={4}
      />
    </g>
  );
}

export function SplitAssemble(props: ObjectProps) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  if (!p.visible) return null;
  const r = radius(props);
  const pieces = 4;
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      <defs>
        {Array.from({ length: pieces }, (_, i) => (
          <clipPath key={i} id={`${id}-${i}`}>
            <rect
              x={-r + (i * 2 * r) / pieces}
              y={-r}
              width={(2 * r) / pieces}
              height={2 * r}
            />
          </clipPath>
        ))}
      </defs>
      {Array.from({ length: pieces }, (_, i) => {
        const s = clamp01(
          spring({
            frame: Math.max(0, p.local - 10 - i * 3),
            fps: p.fps,
            config: { damping: 12, stiffness: 190 },
          }),
        );
        const away = (1 - s) * (i % 2 === 0 ? -320 : 320);
        return (
          <g key={i} clipPath={`url(#${id}-${i})`} transform={`translate(${away},${(1 - s) * (i % 2 === 0 ? 160 : -160)})`}>
            <Body kind={props.shape} r={r} fill={props.color ?? C.yellow} />
          </g>
        );
      })}
    </g>
  );
}

export function GrowBuild(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const step = r * 1.9;
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      {Array.from({ length: 5 }, (_, i) => {
        const s = p.local <= 10 + i * 8
          ? 0
          : clamp01(
              spring({
                frame: p.local - 10 - i * 8,
                fps: p.fps,
                config: { damping: 11, stiffness: 180 },
              }),
            );
        return (
          <g
            key={i}
            transform={`translate(0,${-i * step - r - (1 - s) * 260})`}
            opacity={clamp01(s * 3)}
          >
            <Body
              kind={props.shape}
              r={r}
              fill={[C.yellow, C.teal, C.yellow, C.red, C.teal][i]}
            />
          </g>
        );
      })}
    </g>
  );
}

export function FlipCard(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const s = clamp01(
    spring({
      frame: Math.max(0, p.local - 10),
      fps: p.fps,
      config: { damping: 16, stiffness: 110 },
    }),
  );
  const flat = Math.cos(s * Math.PI);
  const front = flat >= 0;
  return (
    <g
      transform={`translate(${props.x},${props.y}) scale(${Math.max(0.04, Math.abs(flat))},1)`}
      opacity={p.opacity}
    >
      <Body
        kind={front ? props.shape : props.shape === "circle" ? "square" : "circle"}
        r={r}
        fill={front ? (props.color ?? C.yellow) : C.teal}
      />
    </g>
  );
}

export function InflateDeflate(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const swell = Math.sin(clamp01(p.local / 62) * Math.PI);
  return (
    <g
      transform={`translate(${props.x},${props.y}) scale(${1 + 0.5 * swell},${1 + 0.42 * swell})`}
      opacity={p.opacity}
    >
      <Body kind={props.shape} r={radius(props)} fill={props.color ?? C.teal} />
    </g>
  );
}

// ponytail: a stand-in stick figure, not the Sam/Alex rig — this panel only has to
// prove a prop can ride a hand. Swap in ReferenceCharacterRig when a real scene needs it.
export function CharacterInteraction(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const push = clamp01((p.local - 8) / 44);
  const handX = props.x + 150 + 250 * push;
  const handY = props.y - 120;
  const lean = 8 * push;
  return (
    <g opacity={p.opacity} strokeLinecap="round">
      <g stroke={C.navy} strokeWidth={6} fill="none" transform={`rotate(${lean},${props.x},${props.y})`}>
        <circle cx={props.x} cy={props.y - 250} r={30} fill={C.white} />
        <line x1={props.x} y1={props.y - 220} x2={props.x} y2={props.y - 90} />
        <line x1={props.x} y1={props.y - 90} x2={props.x - 40} y2={props.y} />
        <line x1={props.x} y1={props.y - 90} x2={props.x + 40} y2={props.y} />
        <line x1={props.x} y1={props.y - 190} x2={handX - r} y2={handY} />
      </g>
      <g transform={`translate(${handX},${handY})`}>
        <Body kind={props.shape} r={r} fill={props.color ?? C.yellow} />
      </g>
    </g>
  );
}

export function ChainReaction(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  return (
    <g opacity={p.opacity}>
      {Array.from({ length: 4 }, (_, i) => {
        const tilt =
          clamp01(
            spring({
              frame: Math.max(0, p.local - 10 - i * 7),
              fps: p.fps,
              config: { damping: 13, stiffness: 95 },
            }),
          ) * 78;
        const cx = props.x + i * r * 2.3;
        return (
          <g key={i} transform={`rotate(${tilt},${cx - r},${props.y + r})`}>
            <g transform={`translate(${cx},${props.y})`}>
              <Body kind={props.shape} r={r} fill={i === 0 ? C.red : C.yellow} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

export function ConveyorFlow(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props) * 0.8;
  const beltY = props.y + r + 10;
  const span = 900;
  return (
    <g opacity={p.opacity}>
      <rect x={props.x - 40} y={beltY} width={span} height={12} rx={6} fill={C.line} opacity={0.5} />
      {Array.from({ length: 4 }, (_, i) => {
        const x = props.x + ((p.local * 4 + i * 240) % span);
        return (
          <g key={i} transform={`translate(${x},${props.y})`}>
            <Body
              kind={props.shape}
              r={r}
              fill={[C.yellow, C.teal, C.yellow, C.red][i]}
            />
          </g>
        );
      })}
    </g>
  );
}

export function MagnetPull(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props) * 0.4;
  const target = { x: props.x + 420, y: props.y };
  return (
    <g opacity={p.opacity}>
      <rect
        x={target.x - 90}
        y={target.y - 70}
        width={180}
        height={140}
        rx={16}
        fill="none"
        stroke={C.navy}
        strokeWidth={5}
        strokeDasharray="10 8"
      />
      {Array.from({ length: 5 }, (_, i) => {
        const s = clamp01(
          spring({
            frame: Math.max(0, p.local - 8 - i * 3),
            fps: p.fps,
            config: { damping: 12, stiffness: 150 },
          }),
        );
        const fromX = props.x + Math.cos(i * 1.9) * 300;
        const fromY = props.y + Math.sin(i * 2.4) * 220;
        const toX = target.x - 48 + (i % 3) * 48;
        const toY = target.y - 26 + Math.floor(i / 3) * 52;
        return (
          <g
            key={i}
            transform={`translate(${fromX + (toX - fromX) * s},${fromY + (toY - fromY) * s})`}
          >
            <Body kind={props.shape} r={r} fill={C.yellow} strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
}

export function ParallaxLayers(props: ObjectProps) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const r = radius(props);
  const pan = p.local * 4;
  const layers = [
    { y: props.y + 200, size: 0.6, speed: 0.4, color: C.line },
    { y: props.y + 60, size: 1, speed: 0.8, color: C.teal },
    { y: props.y - 120, size: 1.5, speed: 1.5, color: C.yellow },
  ];
  return (
    <g opacity={p.opacity}>
      {layers.map((layer, li) => (
        <g key={li}>
          {Array.from({ length: 4 }, (_, i) => {
            const x = props.x - 200 + ((i * 420 + pan * layer.speed) % 1680);
            return (
              <g
                key={i}
                transform={`translate(${x},${layer.y}) scale(${layer.size})`}
              >
                <Body
                  kind={li === 1 ? (props.shape === "circle" ? "square" : "circle") : props.shape}
                  r={r}
                  fill={layer.color}
                  strokeWidth={3}
                />
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}
