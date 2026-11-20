import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import type { TransitionId } from "../../transitions";
import { findMatchingBridges, sampleBridgeRect } from "../core/bridge";
import type { Rect } from "../core/geometry";
import { clamp01, EASINGS } from "../core/keyframes";

export type TimelineBridgeElement = {
  id: string;
  rect: Rect;
  render: (rect: Rect, progress: number) => ReactNode;
};

export type TimelineEntry = {
  id: string;
  from: number;
  durationInFrames: number;
  join?: TransitionId;
  joinFrames?: number;
  liveOverlap?: boolean;
  bridges?: readonly TimelineBridgeElement[];
  render: (sceneFrame: number, opts?: { isBridgeJoin: boolean }) => ReactNode;
};

/**
 * HTML/Mixed-Media scene join supporting the project's `TransitionId` vocabulary
 * without wrapping HTML nodes in SVG `<g>` elements. Transitions never alter the
 * compiled timeline duration.
 */
export function SceneJoin({
  id = "hard-cut",
  progress,
  before,
  after,
  accentColor = C.navy,
}: {
  id?: TransitionId;
  progress: number;
  before: ReactNode;
  after: ReactNode;
  accentColor?: string;
}) {
  const p = clamp01(progress);

  switch (id) {
    case "hard-cut":
    case "cut-on-action":
    case "cut-on-look":
    case "lead-cut":
    case "match-position":
    case "match-shape":
    case "match-number":
    case "callback-cut":
    case "state-swap":
      return <AbsoluteFill>{p < 0.5 ? before : after}</AbsoluteFill>;
    case "smash-cut":
      return (
        <AbsoluteFill>
          {p < 0.5 ? before : after}
          <AbsoluteFill
            style={{
              background: C.white,
              opacity: Math.abs(p - 0.5) < 0.12 ? 0.85 : 0,
              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      );
    case "crossfade":
    case "relight":
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ opacity: 1 - p }}>{before}</AbsoluteFill>
          <AbsoluteFill style={{ opacity: p }}>{after}</AbsoluteFill>
        </AbsoluteFill>
      );
    case "dip-to-color":
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ opacity: 1 - clamp01(p * 2) }}>{before}</AbsoluteFill>
          <AbsoluteFill style={{ opacity: clamp01((p - 0.5) * 2) }}>{after}</AbsoluteFill>
          <AbsoluteFill
            style={{
              background: accentColor,
              opacity: 1 - Math.abs(p - 0.5) * 2,
              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      );
    case "wipe":
    case "object-wipe":
      return (
        <AbsoluteFill>
          {before}
          <AbsoluteFill
            style={{
              clipPath: `inset(0 ${Math.round((1 - p) * 1000) / 10}% 0 0)`,
            }}
          >
            {after}
          </AbsoluteFill>
          {id === "object-wipe" && (
            <div
              style={{
                position: "absolute",
                top: -40,
                bottom: -40,
                left: `${p * 100}%`,
                width: 48,
                transform: "translateX(-50%) rotate(-6deg)",
                background: C.yellow,
                border: `4px solid ${C.navy}`,
                pointerEvents: "none",
              }}
            />
          )}
        </AbsoluteFill>
      );
    case "slide-push":
      return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <AbsoluteFill style={{ transform: `translate3d(${-1920 * p}px, 0, 0)` }}>
            {before}
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `translate3d(${1920 * (1 - p)}px, 0, 0)` }}>
            {after}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    case "calendar-flip":
      return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <AbsoluteFill
            style={{
              transformOrigin: "50% 0%",
              transform: `scaleY(${Math.max(0.02, 1 - p)})`,
              opacity: 1 - p * 0.5,
            }}
          >
            {before}
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              transform: `translate3d(0, ${1080 * (1 - p)}px, 0)`,
            }}
          >
            {after}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    case "push-in":
    case "pull-back":
    case "pan-follow":
    case "object-becomes-scene": {
      const scale =
        id === "push-in"
          ? 1 + 0.2 * p
          : id === "pull-back"
            ? 1.2 - 0.2 * p
            : id === "object-becomes-scene"
              ? 1 + 0.65 * p
              : 1;
      const shift = id === "pan-follow" ? -180 * p : 0;
      return (
        <AbsoluteFill
          style={{
            transformOrigin: "960px 540px",
            transform: `translate3d(${shift}px, 0, 0) scale(${scale})`,
          }}
        >
          {p < 0.6 ? before : after}
        </AbsoluteFill>
      );
    }
    case "iris":
    case "doorway":
    case "split-open":
    case "panel-freeze":
      return (
        <AbsoluteFill>
          {before}
          <AbsoluteFill
            style={{
              clipPath:
                id === "iris"
                  ? `circle(${Math.round(p * 1200)}px at 960px 540px)`
                  : `inset(0 ${Math.round((1 - p) * 50)}% 0 ${Math.round((1 - p) * 50)}%)`,
            }}
          >
            {after}
          </AbsoluteFill>
        </AbsoluteFill>
      );
  }
}

export function SceneTimeline({
  scenes,
  frame: frameOverride,
}: {
  scenes: readonly TimelineEntry[];
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;

  if (scenes.length === 0) return null;

  let activeIndex = scenes.findIndex(
    (s) => frame >= s.from && frame < s.from + s.durationInFrames,
  );
  if (activeIndex === -1) {
    activeIndex = frame < scenes[0].from ? 0 : scenes.length - 1;
  }

  const currentScene = scenes[activeIndex];
  const localFrame = Math.max(0, Math.min(currentScene.durationInFrames - 1, frame - currentScene.from));
  const joinFrames = currentScene.joinFrames ?? 12;
  const hasJoin =
    activeIndex > 0 &&
    currentScene.join !== undefined &&
    currentScene.join !== "hard-cut" &&
    localFrame < joinFrames;

  if (hasJoin) {
    const prevScene = scenes[activeIndex - 1];
    const progress = clamp01((localFrame + 0.5) / Math.max(1, joinFrames));
    const prevFrame = currentScene.liveOverlap
      ? Math.min(
          prevScene.durationInFrames - 1,
          Math.max(0, prevScene.durationInFrames - joinFrames + localFrame),
        )
      : prevScene.durationInFrames - 1;

    const isMatchJoin =
      currentScene.join === "match-position" ||
      currentScene.join === "match-shape" ||
      currentScene.join === "match-number";
    const matchedBridges = isMatchJoin
      ? findMatchingBridges(prevScene.bridges, currentScene.bridges)
      : [];

    if (matchedBridges.length > 0) {
      const nextBridgeById = new Map(
        (currentScene.bridges ?? []).map((b) => [b.id, b]),
      );
      const easedP = EASINGS.inOut(progress);
      const wipeLeftToRight =
        matchedBridges[0].toRect.x >= matchedBridges[0].fromRect.x;
      return (
        <AbsoluteFill>
          <AbsoluteFill>
            {prevScene.render(prevFrame, { isBridgeJoin: true })}
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              clipPath: wipeLeftToRight
                ? `inset(0 ${Math.round((1 - easedP) * 1000) / 10}% 0 0)`
                : `inset(0 0 0 ${Math.round((1 - easedP) * 1000) / 10}%)`,
            }}
          >
            {currentScene.render(localFrame, { isBridgeJoin: true })}
          </AbsoluteFill>
          <AbsoluteFill style={{ pointerEvents: "none", fontFamily: font }}>
            {matchedBridges.map((match) => {
              const bridge = nextBridgeById.get(match.id);
              if (!bridge) return null;
              const rect = sampleBridgeRect(
                match.fromRect,
                match.toRect,
                progress,
                "inOut",
              );
              return (
                <div
                  key={match.id}
                  style={{
                    position: "absolute",
                    left: rect.x,
                    top: rect.y,
                    width: rect.width,
                    height: rect.height,
                  }}
                >
                  {bridge.render(rect, progress)}
                </div>
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    return (
      <SceneJoin
        id={currentScene.join}
        progress={progress}
        before={prevScene.render(prevFrame, { isBridgeJoin: false })}
        after={currentScene.render(localFrame, { isBridgeJoin: false })}
      />
    );
  }

  return (
    <AbsoluteFill>
      {currentScene.render(localFrame, { isBridgeJoin: false })}
    </AbsoluteFill>
  );
}
