import { useId } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, font } from "../design/tokens";
import { clamp01, typeProgress, type TypeTiming } from "./timing";

export type StyleProps = TypeTiming & {
  x: number;
  y: number;
  size?: number;
  color?: string;
  frame?: number;
};

export const useStyle = (props: StyleProps) => {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = props.frame ?? current;
  const p = typeProgress(frame, props);
  const local = frame - props.from;
  const settle = (config: {
    damping: number;
    stiffness: number;
    mass?: number;
  }) => spring({ frame: Math.max(0, local), fps, config });
  return {
    ...p,
    frame,
    local,
    fps,
    opacity: p.in * (1 - p.out),
    settle,
    movement: clamp01(settle({ damping: 24, stiffness: 150, mass: 0.8 })),
  };
};

export function GlitchText(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 96;
  if (!p.visible) return null;
  // ponytail: sine jitter, deterministic from the frame; no random
  const burst = p.local >= 0 && p.local < 26;
  const split = burst ? 5 + 5 * Math.abs(Math.sin(p.local * 5.2)) : 0;
  const jitterX = burst ? Math.sin(p.local * 7.3) * 9 : 0;
  const jitterY = burst ? Math.sin(p.local * 11.1) * 4 : 0;
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      stroke="none"
    >
      <text x={-split} fill={C.red} opacity={0.85}>
        {props.text}
      </text>
      <text x={split} fill={C.teal} opacity={0.85}>
        {props.text}
      </text>
      <text x={jitterX} y={jitterY} fill={props.color ?? C.navy}>
        {props.text}
      </text>
    </g>
  );
}

export function ElasticText(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 96;
  if (!p.visible) return null;
  // damping stays low on purpose: the overshoot is the style
  const s = p.settle({ damping: 6, stiffness: 170, mass: 0.7 });
  return (
    <g
      transform={`translate(${props.x},${props.y}) scale(${0.3 + 0.7 * s})`}
      opacity={p.opacity * clamp01(s * 3)}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      stroke="none"
    >
      <text fill={props.color ?? C.navy}>{props.text}</text>
    </g>
  );
}

export function FlipText(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 120;
  if (!p.visible) return null;
  const s = clamp01(p.settle({ damping: 18, stiffness: 120 }));
  const flat = Math.max(0.02, Math.cos((1 - s) * (Math.PI / 2)));
  return (
    <g
      transform={`translate(${props.x},${props.y}) scale(${flat},1)`}
      opacity={p.opacity * clamp01(s * 2)}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      textAnchor="middle"
      stroke="none"
    >
      <text fill={props.color ?? C.navy}>{props.text}</text>
    </g>
  );
}

export function ZoomThrough(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 220;
  if (!p.visible) return null;
  const t = clamp01(p.local / Math.max(1, props.until - props.from));
  const fade = 1 - clamp01((t - 0.78) / 0.22);
  return (
    <g
      transform={`translate(${props.x},${props.y}) scale(${0.15 + 3.4 * t ** 3})`}
      opacity={p.in * fade}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      textAnchor="middle"
      stroke="none"
    >
      <text y={size * 0.35} fill={props.color ?? C.navy}>
        {props.text}
      </text>
    </g>
  );
}

export function PathText(props: StyleProps & { text: string; d?: string }) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  const size = props.size ?? 56;
  if (!p.visible) return null;
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      <defs>
        <path id={`${id}-path`} d={props.d ?? "M0 160 Q560 -90 1120 150"} fill="none" />
        <clipPath id={`${id}-clip`}>
          <rect x={-40} y={-160} width={1200 * p.movement} height={380} />
        </clipPath>
      </defs>
      <text
        fontFamily={font}
        fontSize={size}
        fontWeight={750}
        fill={props.color ?? C.navy}
        clipPath={`url(#${id}-clip)`}
      >
        <textPath href={`#${id}-path`}>{props.text}</textPath>
      </text>
    </g>
  );
}

export function TypeStack(
  props: StyleProps & {
    lines: { text: string; size?: number; weight?: number; color?: string }[];
  },
) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const steps = props.lines.map((line, i) => ({
    line,
    size: line.size ?? props.size ?? 80,
    y: props.lines
      .slice(0, i)
      .reduce((sum, prev) => sum + (prev.size ?? props.size ?? 80) * 1.06, 0),
  }));
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      stroke="none"
    >
      {steps.map(({ line, size, y }, i) => {
        const s = clamp01(
          spring({
            frame: Math.max(0, p.local - i * 6),
            fps: p.fps,
            config: { damping: 20, stiffness: 160 },
          }),
        );
        return (
          <text
            key={i}
            x={(1 - s) * 50}
            y={y + size * 0.8 - (1 - s) * 12}
            opacity={s}
            fontSize={size}
            fontWeight={line.weight ?? 800}
            fill={line.color ?? props.color ?? C.navy}
          >
            {line.text}
          </text>
        );
      })}
    </g>
  );
}

export function TextMask(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  const size = props.size ?? 200;
  if (!p.visible) return null;
  const bands = [C.yellow, C.teal, C.red, C.navy, C.yellow, C.teal, C.red, C.navy];
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      <defs>
        <mask id={id}>
          <text fontFamily={font} fontSize={size} fontWeight={800} fill="#fff">
            {props.text}
          </text>
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        {bands.map((fill, i) => (
          <rect
            key={i}
            x={-400 + i * 270 + p.local * 2.2}
            y={-size}
            width={272}
            height={size * 1.7}
            fill={fill}
          />
        ))}
      </g>
    </g>
  );
}

export function OutlineReveal(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 96;
  if (!p.visible) return null;
  const length = props.text.length * size * 0.62;
  const draw = clamp01(p.local / 34);
  const fill = clamp01((p.local - 34) / 14);
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontSize={size}
      fontWeight={800}
    >
      <text fill={props.color ?? C.yellow} opacity={fill}>
        {props.text}
      </text>
      <text
        fill="none"
        stroke={C.navy}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - draw)}
      >
        {props.text}
      </text>
    </g>
  );
}

export function TypeCollage(
  props: StyleProps & {
    words: {
      text: string;
      x: number;
      y: number;
      rotate?: number;
      size?: number;
      color?: string;
      weight?: number;
    }[];
  },
) {
  const p = useStyle(props);
  if (!p.visible) return null;
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      {props.words.map((word, i) => {
        const s = clamp01(
          spring({
            frame: Math.max(0, p.local - i * 5),
            fps: p.fps,
            config: { damping: 16, stiffness: 170 },
          }),
        );
        return (
          <text
            key={i}
            x={word.x + (1 - s) * 40}
            y={word.y}
            opacity={s}
            fontFamily={font}
            fontSize={word.size ?? 72}
            fontWeight={word.weight ?? 800}
            fill={word.color ?? C.navy}
            transform={`rotate(${(word.rotate ?? 0) * s},${word.x},${word.y})`}
            stroke="none"
          >
            {word.text}
          </text>
        );
      })}
    </g>
  );
}

// ponytail: per-letter styles lay out on a fixed advance (size * 0.62) instead of
// measuring glyphs; fine for effects, switch to foreignObject layout if a style
// ever has to sit next to real body copy.
const advance = (size: number) => size * 0.62;

export function GravityDrop(props: StyleProps & { text: string; ground?: number }) {
  const p = useStyle(props);
  const size = props.size ?? 96;
  if (!p.visible) return null;
  const ground = props.ground ?? 720;
  const step = advance(size);
  const dist = ground - props.y;
  return (
    <g opacity={p.opacity} fontFamily={font} fontWeight={800} fontSize={size}>
      <rect
        x={props.x - 20}
        y={ground}
        width={props.text.length * step + 40}
        height={5}
        fill={C.navy}
        opacity={0.3}
      />
      {Array.from(props.text).map((char, i) => {
        const t = Math.max(0, p.local - i * 3) / p.fps;
        const g = 3600;
        let y = 0.5 * g * t * t;
        let squash = 1;
        if (y > dist) {
          const bt = t - Math.sqrt((2 * dist) / g);
          y = dist - Math.abs(Math.sin(bt * 10)) * 90 * Math.exp(-bt * 3.2);
          squash = 1 + 0.1 * Math.exp(-bt * 4);
        }
        return (
          <g
            key={i}
            transform={`translate(${props.x + i * step},${props.y + Math.min(y, dist)}) scale(1,${squash})`}
          >
            <text fill={props.color ?? C.navy} stroke="none">
              {char === " " ? "\u00A0" : char}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function LiquidMelt(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 96;
  if (!p.visible) return null;
  const step = advance(size);
  const melt = clamp01((p.local - 40) / 38);
  return (
    <g opacity={p.opacity} fontFamily={font} fontWeight={800} fontSize={size}>
      {Array.from(props.text).map((char, i) => {
        const wobble = Math.sin(p.local * 0.22 + i * 0.7) * 9;
        const drip = clamp01((p.local - 46 - i) / 30);
        return (
          <g
            key={i}
            transform={`translate(${props.x + i * step},${props.y + wobble + melt * 120}) scale(1,${1 - 0.5 * melt})`}
          >
            <text fill={props.color ?? C.navy} stroke="none">
              {char === " " ? "\u00A0" : char}
            </text>
            {drip > 0 && drip < 1 && (
              <ellipse
                cx={size * 0.25}
                cy={size * 0.2 + drip * 220}
                rx={4}
                ry={7}
                fill={props.color ?? C.navy}
                opacity={0.7}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

export function BalloonInflate(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 110;
  if (!p.visible) return null;
  const inflate = p.settle({ damping: 9, stiffness: 90 });
  const pop = clamp01((p.local - 62) / 6);
  const scale = (0.35 + 0.65 * inflate) * (1 + 0.22 * pop);
  const lift = -p.local * 1.1;
  return (
    <g
      transform={`translate(${props.x},${props.y + lift}) scale(${scale})`}
      opacity={p.opacity * (1 - pop)}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      stroke="none"
    >
      <line x1={size * 1.2} y1={size * 0.2} x2={size * 1.2} y2={size * 1.6} stroke={C.line} strokeWidth={3} />
      <text fill={props.color ?? C.navy}>{props.text}</text>
      {pop > 0 &&
        Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const r = 40 + 220 * pop;
          return (
            <line
              key={i}
              x1={size * 1.2 + Math.cos(a) * r * 0.4}
              y1={-size * 0.3 + Math.sin(a) * r * 0.4}
              x2={size * 1.2 + Math.cos(a) * r}
              y2={-size * 0.3 + Math.sin(a) * r}
              stroke={C.red}
              strokeWidth={4}
            />
          );
        })}
    </g>
  );
}

export function MagneticSnap(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 110;
  if (!p.visible) return null;
  const step = advance(size);
  return (
    <g opacity={p.opacity} fontFamily={font} fontWeight={800} fontSize={size}>
      {Array.from(props.text).map((char, i) => {
        const s = clamp01(
          spring({
            frame: Math.max(0, p.local - i * 2),
            fps: p.fps,
            config: { damping: 9, stiffness: 210, mass: 0.6 },
          }),
        );
        const dx = Math.sin(i * 2.3) * 320;
        const dy = Math.cos(i * 1.7) * 200;
        return (
          <g
            key={i}
            transform={`translate(${props.x + i * step + dx * (1 - s)},${props.y + dy * (1 - s)})`}
          >
            <text fill={props.color ?? C.navy} stroke="none" opacity={0.35 + 0.65 * s}>
              {char === " " ? "\u00A0" : char}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function RopeSwing(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 120;
  if (!p.visible) return null;
  const angle = Math.sin(p.local * 0.26) * 26 * Math.exp(-p.local * 0.05);
  const pivotX = props.x + advance(size) * props.text.length * 0.5;
  const pivotY = props.y - size * 2.6;
  return (
    <g opacity={p.opacity} fontFamily={font} fontWeight={800} fontSize={size}>
      <g transform={`rotate(${angle},${pivotX},${pivotY})`}>
        <line x1={pivotX} y1={pivotY} x2={pivotX} y2={props.y - size * 0.78} stroke={C.line} strokeWidth={3} />
        <text x={props.x} y={props.y} fill={props.color ?? C.navy} stroke="none">
          {props.text}
        </text>
      </g>
    </g>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&0123456789";

export function ScrambleText(
  props: StyleProps & { text: string; mode?: "scramble" | "flip"; per?: number },
) {
  const p = useStyle(props);
  const size = props.size ?? 110;
  if (!p.visible) return null;
  const step = advance(size);
  const per = props.per ?? 3;
  const flip = props.mode === "flip";
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      stroke="none"
    >
      {Array.from(props.text).map((char, i) => {
        const resolved = p.local >= i * per + 12;
        const glyph = resolved
          ? char
          : GLYPHS[(Math.floor(p.local / 2) * 7 + i * 13) % GLYPHS.length];
        const flap = resolved ? 1 : Math.abs(Math.cos((p.local / 2) * Math.PI));
        return (
          <g key={i} transform={`translate(${i * step},0) scale(1,${flip ? Math.max(0.12, flap) : 1})`}>
            <text fill={resolved ? (props.color ?? C.navy) : C.line}>
              {glyph === " " ? "\u00A0" : glyph}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function MorphStretch(
  props: StyleProps & { before: string; after: string },
) {
  const p = useStyle(props);
  const size = props.size ?? 110;
  if (!p.visible) return null;
  const t = clamp01(p.local / 34);
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      stroke="none"
    >
      <text
        opacity={1 - t}
        transform={`scale(${1 + 0.9 * t},${1 - 0.3 * t})`}
        fill={props.color ?? C.navy}
      >
        {props.before}
      </text>
      <text
        opacity={t}
        transform={`scale(${0.45 + 0.55 * t},${0.7 + 0.3 * t})`}
        fill={C.teal}
      >
        {props.after}
      </text>
    </g>
  );
}

export function InkBleed(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  const size = props.size ?? 140;
  if (!p.visible) return null;
  const spread = clamp01(p.local / 44);
  const r = 60 + 1000 * spread;
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      <defs>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation={24} />
        </filter>
        <mask id={id}>
          <circle cx={size} cy={-size * 0.4} r={r} fill="#fff" filter={`url(#${id}-soft)`} />
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <text fontFamily={font} fontSize={size} fontWeight={800} fill={props.color ?? C.navy}>
          {props.text}
        </text>
      </g>
      <ellipse
        cx={size}
        cy={-size * 0.4}
        rx={r * 0.55}
        ry={r * 0.3}
        fill={C.navy}
        opacity={0.1 * (1 - spread)}
      />
    </g>
  );
}

export function PaperTear(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 120;
  if (!p.visible) return null;
  const t = clamp01(p.local / 26);
  const width = advance(size) * props.text.length + 160;
  const top = -size * 1.3;
  const bottom = size * 0.45;
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity}>
      <text fontFamily={font} fontSize={size} fontWeight={800} fill={props.color ?? C.navy} stroke="none">
        {props.text}
      </text>
      <g transform={`translate(0,${-size * 2 * t}) rotate(${-3 * t},${width / 2},0)`}>
        <rect x={-60} y={top} width={width} height={-top} fill="#F2F1EB" stroke={C.line} strokeWidth={2} />
      </g>
      <g transform={`translate(0,${size * 2 * t}) rotate(${3 * t},${width / 2},0)`}>
        <rect x={-60} y={0} width={width} height={bottom} fill="#F2F1EB" stroke={C.line} strokeWidth={2} />
      </g>
    </g>
  );
}

export function Spotlight(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  const size = props.size ?? 120;
  if (!p.visible) return null;
  const travel = clamp01(p.local / Math.max(1, props.until - props.from));
  const cx = props.x - 260 + travel * 1500;
  const cy = props.y - size * 0.4;
  return (
    <g opacity={p.opacity}>
      <defs>
        <radialGradient id={`${id}-beam`}>
          <stop offset="0%" stopColor="#000" />
          <stop offset="62%" stopColor="#000" />
          <stop offset="100%" stopColor="#fff" />
        </radialGradient>
        <mask id={id}>
          <rect x={-400} y={-600} width={2800} height={2200} fill="#fff" />
          <ellipse cx={cx} cy={cy} rx={470} ry={210} fill={`url(#${id}-beam)`} />
        </mask>
      </defs>
      <text
        transform={`translate(${props.x},${props.y})`}
        fontFamily={font}
        fontSize={size}
        fontWeight={800}
        fill={props.color ?? C.yellow}
        stroke="none"
      >
        {props.text}
      </text>
      <rect x={-400} y={-600} width={2800} height={2200} fill={C.navy} opacity={0.9} mask={`url(#${id})`} />
    </g>
  );
}

export function ParticleDissolve(
  props: StyleProps & { text: string; assemble?: boolean },
) {
  const p = useStyle(props);
  const size = props.size ?? 110;
  if (!p.visible) return null;
  const cols = props.text.length * 3;
  const rows = 6;
  const t = clamp01((p.local - 16) / 44);
  const k = props.assemble === true ? 1 - t : t;
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity} stroke="none">
      <text
        fontFamily={font}
        fontSize={size}
        fontWeight={800}
        fill={props.color ?? C.navy}
        opacity={props.assemble === true ? clamp01(t * 3) : 1 - t}
      >
        {props.text}
      </text>
      {Array.from({ length: rows * cols }, (_, n) => {
        const c = n % cols;
        const r = Math.floor(n / cols);
        const x = c * (advance(size) / 3) + Math.sin(c * 1.7 + r) * 220 * k;
        const y = -size * 0.78 + r * (size * 0.16) - Math.cos(r * 2.1 + c) * 240 * k;
        return (
          <rect
            key={n}
            x={x}
            y={y}
            width={3}
            height={3}
            fill={r % 2 ? C.line : C.navy}
            opacity={props.assemble === true ? 1 - k : k}
          />
        );
      })}
    </g>
  );
}

export function NeonFlicker(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  const size = props.size ?? 110;
  if (!p.visible) return null;
  const pattern = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1];
  const on = p.local < 30 ? pattern[Math.floor(p.local / 2) % pattern.length] : 1;
  const width = advance(size) * props.text.length + 100;
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity} stroke="none">
      <rect
        x={-50}
        y={-size * 1.25}
        width={width}
        height={size * 1.7}
        rx={16}
        fill={C.navy}
      />
      <g opacity={on} fontFamily={font} fontWeight={800} fontSize={size}>
        <defs>
          <filter id={id} x="-30%" y="-50%" width="160%" height="200%">
            <feGaussianBlur stdDeviation={12} />
          </filter>
        </defs>
        <text filter={`url(#${id})`} fill={C.yellow} opacity={0.95}>
          {props.text}
        </text>
        <text fill={C.white} stroke={C.yellow} strokeWidth={3} paintOrder="stroke">
          {props.text}
        </text>
      </g>
    </g>
  );
}

export function LightTrail(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  const size = props.size ?? 96;
  if (!p.visible) return null;
  const width = advance(size) * props.text.length;
  const head = width * clamp01(p.local / 40);
  return (
    <g transform={`translate(${props.x},${props.y})`} opacity={p.opacity} stroke="none">
      <defs>
        <clipPath id={id}>
          <rect x={-10} y={-size * 1.3} width={head + 10} height={size * 1.9} />
        </clipPath>
      </defs>
      <text
        clipPath={`url(#${id})`}
        fontFamily={font}
        fontSize={size}
        fontWeight={800}
        fill={C.yellow}
      >
        {props.text}
      </text>
      <line
        x1={0}
        y1={-size * 0.32}
        x2={head}
        y2={-size * 0.32}
        stroke={C.yellow}
        strokeWidth={2}
        opacity={0.35}
      />
      <g transform={`translate(${head},${-size * 0.32})`}>
        <circle r={20} fill={C.yellow} opacity={0.22} />
        <circle r={7} fill={C.white} />
      </g>
    </g>
  );
}

export function ChromaticSlice(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const id = useId().replaceAll(":", "");
  const size = props.size ?? 120;
  if (!p.visible) return null;
  const strips = 6;
  const band = (size * 1.25) / strips;
  const snap = clamp01(p.settle({ damping: 16, stiffness: 130 }));
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
    >
      <defs>
        {Array.from({ length: strips }, (_, i) => (
          <clipPath key={i} id={`${id}-${i}`}>
            <rect x={-200} y={-size * 1.05 + i * band} width={1600} height={band} />
          </clipPath>
        ))}
      </defs>
      {Array.from({ length: strips }, (_, i) => {
        const dx = Math.sin(i * 1.9 + p.local * 0.35) * 80 * (1 - snap);
        const split = 9 * (1 - snap);
        return (
          <g key={i} clipPath={`url(#${id}-${i})`} stroke="none">
            <text x={dx - split} fill={C.red} opacity={0.75}>
              {props.text}
            </text>
            <text x={dx + split} fill={C.teal} opacity={0.75}>
              {props.text}
            </text>
            <text x={dx} fill={props.color ?? C.navy}>
              {props.text}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function EchoTrail(props: StyleProps & { text: string }) {
  const p = useStyle(props);
  const size = props.size ?? 120;
  if (!p.visible) return null;
  const x = (1 - clamp01(p.local / 24)) * -420;
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
    >
      {[3, 2, 1].map((k) => (
        <text
          key={k}
          x={x - k * 88}
          fill="none"
          stroke={k === 1 ? C.teal : C.line}
          strokeWidth={2}
          opacity={0.6 / k}
        >
          {props.text}
        </text>
      ))}
      <text x={x} fill={props.color ?? C.navy} stroke="none">
        {props.text}
      </text>
    </g>
  );
}

export function SpiralVortex(
  props: StyleProps & { words: string[]; focus: string },
) {
  const p = useStyle(props);
  const size = props.size ?? 56;
  if (!p.visible) return null;
  const t = clamp01(p.local / 66);
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      textAnchor="middle"
      stroke="none"
    >
      {props.words.map((word, i) => {
        const angle = i * 1.1 + p.local * 0.11;
        const radius = (330 + i * 26) * (1 - t * 0.92);
        return (
          <text
            key={i}
            x={Math.cos(angle) * radius}
            y={Math.sin(angle) * radius * 0.62}
            fill={i === props.words.length - 1 ? C.teal : C.navy}
            opacity={1 - t * 0.75}
          >
            {word}
          </text>
        );
      })}
      <text
        y={size * 0.7}
        fontSize={size * 2.2}
        fill={props.color ?? C.navy}
        opacity={clamp01((t - 0.6) / 0.4)}
      >
        {props.focus}
      </text>
    </g>
  );
}

export function TextTunnel(
  props: StyleProps & { text: string; rings?: number },
) {
  const p = useStyle(props);
  const size = props.size ?? 64;
  if (!p.visible) return null;
  const rings = props.rings ?? 7;
  const tile = `${props.text}   ${props.text}   ${props.text}`;
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      textAnchor="middle"
      stroke="none"
    >
      {Array.from({ length: rings }, (_, i) => {
        const z = (i / rings + p.local * 0.02) % 1;
        const scale = 0.18 + z * z * 3.2;
        const fade = clamp01((1 - z) / 0.3) * clamp01(z / 0.1);
        return (
          <g key={i} transform={`scale(${scale})`} opacity={fade}>
            <text fill={i % 2 ? C.line : C.navy}>{tile}</text>
          </g>
        );
      })}
    </g>
  );
}

export function OrbitWords(
  props: StyleProps & { center: string; words: string[] },
) {
  const p = useStyle(props);
  const size = props.size ?? 42;
  if (!p.visible) return null;
  const rx = 420;
  const ry = 180;
  return (
    <g
      transform={`translate(${props.x},${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={700}
      fontSize={size}
      textAnchor="middle"
      stroke="none"
    >
      <ellipse rx={rx} ry={ry} fill="none" stroke={C.line} strokeWidth={2} opacity={0.35} />
      {props.words.map((word, i) => {
        const angle = (i / props.words.length) * Math.PI * 2 + p.local * 0.045;
        return (
          <text
            key={i}
            x={Math.cos(angle) * rx}
            y={Math.sin(angle) * ry + size * 0.35}
            fill={C.navy}
          >
            {word}
          </text>
        );
      })}
      <text y={size * 0.95} fontSize={size * 2.6} fontWeight={800} fill={C.teal}>
        {props.center}
      </text>
    </g>
  );
}

export function MarqueeTicker(
  props: StyleProps & { rows: string[]; headline: string },
) {
  const p = useStyle(props);
  if (!p.visible) return null;
  const rowHeight = 108;
  const size = 54;
  return (
    <g
      transform={`translate(0,${props.y})`}
      opacity={p.opacity}
      fontFamily={font}
      fontWeight={800}
      fontSize={size}
      stroke="none"
    >
      {props.rows.map((text, i) => {
        const tile = `${text}   ${text}   ${text}`;
        const width = tile.length * advance(size);
        const shift =
          (((p.local * 5 * (i % 2 === 0 ? 1 : -1)) % width) + width) % width;
        return (
          <g key={i} transform={`translate(${shift - width},${i * rowHeight})`}>
            <text fill={i % 2 ? C.line : C.navy} opacity={0.5}>
              {tile}
            </text>
            <text x={width} fill={i % 2 ? C.line : C.navy} opacity={0.5}>
              {tile}
            </text>
          </g>
        );
      })}
      <text
        x={960}
        y={props.rows.length * rowHeight + 30}
        textAnchor="middle"
        fontSize={112}
        fill={C.white}
        paintOrder="stroke"
        stroke={C.navy}
        strokeWidth={16}
        strokeLinejoin="round"
      >
        {props.headline}
      </text>
    </g>
  );
}
