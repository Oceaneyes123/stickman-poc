import {
  AbsoluteFill,
  Audio,
  Composition,
  registerRoot,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { cueAtFrame, type ReviewProps } from "./timing";
import "../design/fonts";

const Utterance: React.FC<{ cues: ReviewProps["cues"] }> = ({ cues }) => {
  const cue = cueAtFrame(cues, useCurrentFrame());
  return (
    <div
      style={{
        width: 1600,
        color: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
        fontSize: 64,
        lineHeight: 1.35,
        textAlign: "center",
        overflowWrap: "break-word",
      }}
    >
      {cue?.text ?? ""}
    </div>
  );
};

const TimingReview: React.FC<ReviewProps> = ({ cues }) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#000000",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Audio src={staticFile("review.wav")} />
    <Utterance cues={cues} />
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <Composition
    id="TimingReview"
    component={TimingReview}
    fps={30}
    width={1920}
    height={1080}
    durationInFrames={30}
    defaultProps={{ durationMs: 1000, cues: [] }}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.round((props.durationMs * 30) / 1000),
    })}
  />
);

registerRoot(Root);
