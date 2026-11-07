import { Composition } from "remotion";
import { ComponentGallery } from "./ComponentGallery";
import "./design/fonts";
import { CharacterStudy } from "./CharacterStudy";
import { BankExample } from "./scenes/BankExample";
import { MovementReview, MOVEMENT_DURATION } from "./MovementReview";
import { WalkingMechanics } from "./WalkingMechanics";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WalkingMechanics"
        component={WalkingMechanics}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ debug: false }}
      />
      <Composition
        id="MovementReview"
        component={MovementReview}
        durationInFrames={MOVEMENT_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ debug: false }}
      />
      <Composition
        id="BankExample"
        component={BankExample}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ComponentGallery"
        component={ComponentGallery}
        durationInFrames={1110}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CharacterStudy"
        component={CharacterStudy}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
