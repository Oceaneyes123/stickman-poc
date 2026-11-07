import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const progress = (frame: number, from = 0, duration = 30) =>
  interpolate(frame, [from, from + Math.max(1, duration)], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
export const settle = (frame: number, fps: number) =>
  spring({ frame, fps, config: { damping: 22, stiffness: 130, mass: 1 } });
export const EnterExit = ({
  children,
  from = 0,
  duration = 24,
  exitAt,
  style,
}: {
  children: ReactNode;
  from?: number;
  duration?: number;
  exitAt?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, duration);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, duration);
  return (
    <div
      style={{
        ...style,
        opacity: p * (1 - out),
        translate: `0px ${18 * (1 - p) - out * 12}px`,
      }}
    >
      {children}
    </div>
  );
};
export const TextReveal = ({
  children,
  from = 0,
  duration = 24,
  style,
}: {
  children: ReactNode;
  from?: number;
  duration?: number;
  style?: CSSProperties;
}) => (
  <EnterExit from={from} duration={duration} style={style}>
    {children}
  </EnterExit>
);
export const Camera2D = ({
  children,
  from = 0,
  duration = 45,
  panX = 0,
  panY = 0,
  zoom = 1,
}: {
  children: ReactNode;
  from?: number;
  duration?: number;
  panX?: number;
  panY?: number;
  zoom?: number;
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, duration);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "960px 540px",
        transform: `translate(${panX * p}px, ${panY * p}px) scale(${1 + (zoom - 1) * p})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
export const SceneTransition = ({
  children,
  previous,
  type = "cut",
}: {
  children: ReactNode;
  previous?: ReactNode;
  type?: "cut" | "wipe" | "fade";
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = progress(frame, 0, fps * 0.3);
  // Incoming scenes already cover the outgoing scene; transitions never shorten the timeline.
  return (
    <AbsoluteFill>
      {type === "wipe" && previous}
      <AbsoluteFill
        style={{
          opacity: type === "fade" ? 0.65 + p * 0.35 : 1,
          clipPath:
            type === "wipe" ? `inset(0 ${(1 - p) * 100}% 0 0)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
