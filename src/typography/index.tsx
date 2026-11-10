import { useId, type ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, font } from "../design/tokens";
import { usd } from "../finance/math";
import {
  clamp01,
  numberAt,
  rollingDigit,
  typeProgress,
  type TypeTiming,
} from "./timing";

export type TypographyProps = TypeTiming & {
  x: number;
  y: number;
  size?: number;
  color?: string;
  frame?: number;
};
const useType = (props: TypographyProps) => {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = props.frame ?? current;
  const p = typeProgress(frame, props);
  const movement = clamp01(
    spring({
      frame: Math.max(0, frame - props.from),
      fps,
      config: { damping: 24, stiffness: 150, mass: 0.8 },
    }),
  );
  return { ...p, frame, movement, opacity: p.in * (1 - p.out) };
};
const Ink = ({
  children,
  x,
  y,
  opacity = 1,
}: {
  children: ReactNode;
  x: number;
  y: number;
  opacity?: number;
}) => (
  <g
    transform={`translate(${x},${y})`}
    opacity={opacity}
    fontFamily={font}
    fill={C.navy}
    stroke="none"
  >
    {children}
  </g>
);

export function KineticHeadline(
  props: TypographyProps & {
    text: string;
    width?: number;
    unit?: "word" | "line" | "character";
    stagger?: number;
    emphasis?: string;
    origin?: { x: number; y: number };
  },
) {
  const p = useType(props);
  const size = props.size ?? 64;
  const units =
    props.unit === "character"
      ? Array.from(props.text)
      : props.unit === "line"
        ? props.text.split("\n")
        : props.text.split(" ");
  const id = useId().replaceAll(":", "");
  if (!p.visible) return null;
  return (
    <Ink
      x={props.x + ((props.origin?.x ?? props.x) - props.x) * (1 - p.movement)}
      y={props.y + ((props.origin?.y ?? props.y) - props.y) * (1 - p.movement)}
      opacity={1 - p.out}
    >
      <foreignObject width={props.width ?? 760} height={size * 4}>
        <div
          style={{
            fontFamily: font,
            fontSize: size,
            fontWeight: 750,
            lineHeight: 1.18,
            color: props.color ?? C.navy,
          }}
        >
          {units.map((unit, i) => {
            const reveal = clamp01(
              (p.frame - props.from - i * (props.stagger ?? 3)) /
                (props.enter ?? 15),
            );
            return (
              <span
                key={`${id}-${i}`}
                style={{
                  display: props.unit === "line" ? "block" : "inline-block",
                  overflow: "hidden",
                  verticalAlign: "top",
                  marginRight:
                    props.unit === "word" || !props.unit ? "0.24em" : 0,
                  whiteSpace: "pre",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    translate: `0 ${(1 - reveal) * 110}%`,
                    color: unit === props.emphasis ? C.teal : undefined,
                  }}
                >
                  {unit}
                </span>
              </span>
            );
          })}
        </div>
      </foreignObject>
    </Ink>
  );
}

export function AnimatedNumber(
  props: TypographyProps & {
    value: number;
    initial?: number;
    duration?: number;
    mode?: "counter" | "odometer";
    anchor?: "start" | "middle";
    positive?: boolean;
  },
) {
  const p = useType(props);
  const size = props.size ?? 80;
  const id = useId().replaceAll(":", "");
  if (!p.visible) return null;
  const raw = numberAt(
    p.frame,
    props.from,
    props.duration ?? 22,
    props.value,
    props.initial,
  );
  const label = `${props.positive ? "+" : ""}${usd(Math.round(raw))}`;
  if (props.mode !== "odometer")
    return (
      <Ink x={props.x} y={props.y} opacity={p.opacity}>
        <text
          fontSize={size}
          fontWeight={700}
          fill={props.color ?? C.navy}
          textAnchor={props.anchor ?? "start"}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {label}
        </text>
      </Ink>
    );
  const target = `${props.positive ? "+" : ""}${usd(props.value)}`;
  const width = target.length * size * 0.64;
  let digits = target.replace(/\D/g, "").length;
  return (
    <Ink
      x={props.x - (props.anchor === "middle" ? width / 2 : 0)}
      y={props.y}
      opacity={p.opacity}
    >
      {Array.from(target).map((char, i) => {
        const digit = /\d/.test(char);
        const power = digit ? 10 ** --digits : 1;
        const value = rollingDigit(raw, power);
        return (
          <g
            key={i}
            transform={`translate(${i * size * 0.64},0)`}
            fill={props.color ?? C.navy}
          >
            {digit ? (
              <>
                <defs>
                  <clipPath id={`${id}-${i}`}>
                    <rect
                      x={0}
                      y={-size}
                      width={size * 0.65}
                      height={size * 1.12}
                    />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${id}-${i})`}>
                  {[Math.floor(value), Math.floor(value) + 1].map((n) => (
                    <text
                      key={n}
                      y={(n - value) * size * 1.12}
                      fontSize={size}
                      fontWeight={700}
                    >
                      {n % 10}
                    </text>
                  ))}
                </g>
              </>
            ) : (
              <text fontSize={size} fontWeight={700}>
                {char}
              </text>
            )}
          </g>
        );
      })}
    </Ink>
  );
}

export function AnimatedUnderline(props: TypographyProps & { width: number }) {
  const p = useType(props);
  return p.visible ? (
    <Ink x={props.x} y={props.y} opacity={p.opacity}>
      <path
        d={`M0 0H${props.width * p.movement}`}
        stroke={props.color ?? C.teal}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </Ink>
  ) : null;
}

export function ObjectAttachedLabel(
  props: TypographyProps & {
    text: string;
    object: { x: number; y: number };
    anchor?: "start" | "middle";
    line?: boolean;
  },
) {
  const p = useType(props);
  if (!p.visible) return null;
  return (
    <g opacity={p.opacity} stroke="none" fontFamily={font}>
      {props.line !== false && (
        <path
          d={`M${props.object.x} ${props.object.y}L${props.x} ${props.y + 16}`}
          fill="none"
          stroke={props.color ?? C.navy}
          strokeWidth={2.5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p.movement}
        />
      )}
      <text
        x={props.x}
        y={props.y - 10 * (1 - p.movement)}
        textAnchor={props.anchor ?? "start"}
        fontSize={props.size ?? 36}
        fontWeight={650}
        fill={props.color ?? C.navy}
        paintOrder="stroke"
        stroke="#F4F2EB"
        strokeWidth={7}
        strokeLinejoin="round"
      >
        {props.text}
      </text>
    </g>
  );
}

export function AnimatedList(
  props: TypographyProps & {
    items: { text: string; from: number; color?: string }[];
    gap?: number;
  },
) {
  return (
    <>
      {props.items.map((item, i) => (
        <ObjectAttachedLabel
          key={i}
          {...props}
          from={item.from}
          text={item.text}
          y={props.y + i * (props.gap ?? 54)}
          color={item.color ?? props.color}
          object={{ x: props.x - 20, y: props.y + i * (props.gap ?? 54) }}
          line={false}
        />
      ))}
    </>
  );
}

export function SectionHeading(
  props: TypographyProps & { text: string; width?: number },
) {
  return (
    <>
      <KineticHeadline
        {...props}
        width={760}
        unit="line"
        size={props.size ?? 48}
      />
      <AnimatedUnderline
        {...props}
        from={props.from + 8}
        y={props.y + (props.size ?? 48) * 1.35}
        width={props.width ?? 280}
      />
    </>
  );
}

export function TextMorph(
  props: TypographyProps & {
    before: string;
    after: string;
    changeAt: number;
    destination?: { x: number; y: number };
  },
) {
  const p = useType(props);
  const change = clamp01((p.frame - props.changeAt) / (props.enter ?? 15));
  if (!p.visible) return null;
  return (
    <Ink
      x={props.x + ((props.destination?.x ?? props.x) - props.x) * change}
      y={props.y + ((props.destination?.y ?? props.y) - props.y) * change}
      opacity={p.opacity}
    >
      <g fontSize={props.size ?? 44} fontWeight={700}>
        <text opacity={1 - change} y={-12 * change}>
          {props.before}
        </text>
        <text
          opacity={change}
          y={12 * (1 - change)}
          fill={props.color ?? C.teal}
        >
          {props.after}
        </text>
      </g>
    </Ink>
  );
}

export function ComparisonReveal(
  props: TypographyProps & {
    left: number;
    right: number;
    leftAt: number;
    rightAt: number;
    differenceAt: number;
    width?: number;
    duration?: number;
  },
) {
  if (
    props.differenceAt <
    Math.max(props.leftAt, props.rightAt) + (props.duration ?? 22)
  )
    throw new Error(
      "Comparison difference must follow both established values",
    );
  return (
    <>
      <AnimatedNumber {...props} from={props.leftAt} value={props.left} />
      <AnimatedNumber
        {...props}
        x={props.x + (props.width ?? 540)}
        from={props.rightAt}
        value={props.right}
        color={C.teal}
      />
      <AnimatedNumber
        {...props}
        y={props.y + 140}
        from={props.differenceAt}
        value={props.right - props.left}
        positive
        color={C.teal}
      />
      <AnimatedUnderline
        {...props}
        from={props.differenceAt}
        y={props.y + 34}
        width={props.width ?? 540}
      />
    </>
  );
}
