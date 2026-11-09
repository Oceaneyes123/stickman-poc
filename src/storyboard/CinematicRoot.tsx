import {
  AbsoluteFill,
  Audio,
  Composition,
  registerRoot,
  staticFile,
  type CalculateMetadataFunction,
} from "remotion";
import { CinematicReference } from "../scenes/cinematicReferences";
import type { DirectedSequence } from "../animation/direction";
export type CinematicProps = {
  referenceId: string;
  sequence: DirectedSequence | null;
};
const metadata: CalculateMetadataFunction<CinematicProps> = async ({
  props,
}) => {
  const sequence =
    props.sequence ??
    (
      (await (
        await fetch(staticFile("directions.json"))
      ).json()) as DirectedSequence[]
    ).find((sequence) => sequence.id === props.referenceId);
  if (!sequence)
    throw new Error(
      "Prepare the cinematic reference packet before opening this composition",
    );
  return {
    durationInFrames: sequence.timeline.durationInFrames,
    props: { ...props, sequence },
  };
};
const Film = ({ sequence }: CinematicProps) => {
  if (!sequence) throw new Error("Missing compiled direction");
  return (
    <AbsoluteFill>
      <Audio src={staticFile(`${sequence.id}.wav`)} />
      <CinematicReference sequence={sequence} />
    </AbsoluteFill>
  );
};
registerRoot(() => (
  <>
    {[
      ["ReferenceApartment", "apartment"],
      ["ReferenceRaiseIllusion", "raise-illusion"],
      ["ReferenceComparison", "comparison"],
    ].map(([id, referenceId]) => (
      <Composition
        key={id}
        id={id}
        component={Film}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={1}
        defaultProps={{ referenceId, sequence: null } as CinematicProps}
        calculateMetadata={metadata}
      />
    ))}
  </>
));
