import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  interpolate,
  registerRoot,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  OpeningPerformanceContext,
  OpeningSceneStudy,
} from "./OpeningSceneStudy";
import { openingCameras } from "./openingShots";
import type { OpeningPlan } from "./openingTiming";
import type { Timeline } from "../timeline/types";
import { C } from "../design/tokens";
import { ObjectAttachedLabel } from "../typography";
export type OpeningFilmProps = { timeline: Timeline; plan: OpeningPlan };
const Shot = ({
  index,
  timeline,
  plan,
}: OpeningFilmProps & { index: number }) => {
  const frame = useCurrentFrame();
  const scene = timeline.scenes[index];
  const spec = plan.shots[index];
  const from = openingCameras[spec.cameraFrom ?? spec.shot].viewBox;
  const target = openingCameras[spec.cameraTo ?? spec.shot].viewBox;
  // A short reframe followed by a reading hold; no continuous camera drift.
  const to = spec.cameraTo
    ? target
    : [
        target[0] + target[2] * 0.018,
        target[1] + target[3] * 0.018,
        target[2] * 0.964,
        target[3] * 0.964,
      ];
  const moveFrames = Math.min(48, scene.durationInFrames - 1);
  const amount = interpolate(frame, [0, moveFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const viewBox = from.map((value, i) => value + (to[i] - value) * amount);
  const markers = Object.fromEntries(
    timeline.events.map((event) => [event.id, event.from]),
  );
  const absoluteFrame = scene.from + frame;
  return (
    <OpeningPerformanceContext.Provider
      value={{ frame, absoluteFrame, markers }}
    >
      <OpeningSceneStudy shot={spec.shot} viewBox={viewBox} />
      {scene.id === "S01-reaction" && (
        <div
          style={{
            position: "absolute",
            top: 95,
            right: 145,
            fontFamily: "Inter",
            fontWeight: 650,
            fontSize: 46,
            color: C.navy,
          }}
        >
          <svg
            width={490}
            height={80}
            style={{ display: "block", overflow: "visible" }}
          >
            <ObjectAttachedLabel
              x={0}
              y={50}
              text="Three months later"
              object={{ x: 390, y: 108 }}
              frame={frame}
              from={(markers.worry ?? scene.from) - scene.from}
              until={scene.durationInFrames}
              size={46}
              line={false}
            />
          </svg>
          <svg
            width={150}
            height={175}
            style={{ display: "block", marginLeft: "auto", marginTop: 28 }}
            viewBox="0 0 150 175"
          >
            <rect
              x={5}
              y={5}
              width={140}
              height={160}
              rx={8}
              fill={C.white}
              stroke={C.navy}
              strokeWidth={4}
            />
            <path d="M5 40H145" stroke={C.navy} strokeWidth={4} />
            <text
              x={75}
              y={132}
              textAnchor="middle"
              fontSize={80}
              fill={C.navy}
            >
              {Math.min(3, Math.floor(frame / 8) + 1)}
            </text>
            {frame < 24 && (
              <path
                d={`M5 40H145V${40 + 120 * (1 - (frame % 8) / 8)}H5Z`}
                fill={C.yellow}
                stroke={C.navy}
                strokeWidth={2}
              />
            )}
          </svg>
        </div>
      )}
    </OpeningPerformanceContext.Provider>
  );
};
export const OpeningFilm = (props: OpeningFilmProps) => (
  <AbsoluteFill style={{ background: C.white }}>
    <Audio src={staticFile("opening.wav")} />
    {props.timeline.scenes.map((scene, index) => (
      <Sequence
        key={scene.id}
        from={scene.from}
        durationInFrames={scene.durationInFrames}
      >
        <Shot {...props} index={index} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
registerRoot(() => (
  <Composition
    id="OpeningFilm"
    component={OpeningFilm}
    fps={30}
    width={1920}
    height={1080}
    durationInFrames={1}
    defaultProps={
      {
        timeline: {
          fps: 30,
          durationMs: 1,
          durationInFrames: 1,
          mode: "aligned",
          scenes: [],
          events: [],
        },
        plan: { fps: 30, tailMs: 0, endCue: "", shots: [], markers: [] },
      } as OpeningFilmProps
    }
    calculateMetadata={({ props }) => ({
      durationInFrames: props.timeline.durationInFrames,
    })}
  />
));
