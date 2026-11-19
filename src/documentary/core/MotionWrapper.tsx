import { Children, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  MOTION_PROFILES,
  sampleMotionProfile,
  type MotionDirection,
  type MotionProfileId,
} from "./motionProfiles";

export type MotionWrapperProps = {
  profile?: MotionProfileId;
  direction?: MotionDirection;
  from?: number;
  until?: number;
  enterFrames?: number;
  exitFrames?: number;
  shiftPx?: number;
  frame?: number;
  children: ReactNode;
};

export function MotionBox({
  profile = "editorial-crisp",
  direction = "up",
  from = 0,
  until,
  enterFrames,
  exitFrames,
  shiftPx,
  frame: frameOverride,
  style,
  className,
  children,
}: MotionWrapperProps & {
  style?: CSSProperties;
  className?: string;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameOverride ?? current;
  const m = sampleMotionProfile(profile, frame, {
    from,
    until,
    direction,
    enterFrames,
    exitFrames,
    shiftPx,
    fps,
  });

  if (!m.visible) return null;

  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: m.opacity,
        transform: `translate3d(${m.tx.toFixed(2)}px, ${m.ty.toFixed(2)}px, 0) rotate(${m.rotate.toFixed(2)}deg) scale(${m.scale.toFixed(4)})`,
      }}
    >
      {children}
    </div>
  );
}

export function MotionGroup({
  profile = "tactile-spring",
  direction = "up",
  from = 0,
  until,
  enterFrames,
  exitFrames,
  shiftPx,
  originX = 0,
  originY = 0,
  frame: frameOverride,
  children,
}: MotionWrapperProps & {
  originX?: number;
  originY?: number;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameOverride ?? current;
  const m = sampleMotionProfile(profile, frame, {
    from,
    until,
    direction,
    enterFrames,
    exitFrames,
    shiftPx,
    fps,
  });

  if (!m.visible) return null;

  const transform =
    originX === 0 && originY === 0
      ? `translate(${m.tx.toFixed(2)} ${m.ty.toFixed(2)}) rotate(${m.rotate.toFixed(2)}) scale(${m.scale.toFixed(4)})`
      : `translate(${(originX + m.tx).toFixed(2)} ${(originY + m.ty).toFixed(2)}) rotate(${m.rotate.toFixed(2)}) scale(${m.scale.toFixed(4)}) translate(${-originX} ${-originY})`;

  return (
    <g transform={transform} opacity={m.opacity}>
      {children}
    </g>
  );
}

export function StaggerGroup({
  profile = "tactile-spring",
  direction = "up",
  from = 0,
  until,
  staggerFrames,
  frame: frameOverride,
  gap = 16,
  row = false,
  style,
  children,
}: {
  profile?: MotionProfileId;
  direction?: MotionDirection;
  from?: number;
  until?: number;
  staggerFrames?: number;
  frame?: number;
  gap?: number;
  row?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const step = staggerFrames ?? MOTION_PROFILES[profile].staggerFrames;
  const items = Children.toArray(children);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: row ? "row" : "column",
        gap,
        ...style,
      }}
    >
      {items.map((child, idx) => (
        <MotionBox
          key={idx}
          profile={profile}
          direction={direction}
          from={from + idx * step}
          until={until}
          frame={frame}
        >
          {child}
        </MotionBox>
      ))}
    </div>
  );
}
