import { Composition } from "remotion";
import { MoneyTrapPOC, timeline } from "./POC";
import { ComponentGallery } from "./ComponentGallery";
import "./design/fonts";
import { example } from "./finance/math";
import { CharacterStudy } from "./CharacterStudy";
import { BankExample } from "./scenes/BankExample";
import { MovementReview } from "./MovementReview";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MovementReview"
        component={MovementReview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
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
        id="MoneyTrapPOC"
        component={MoneyTrapPOC}
        durationInFrames={timeline.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ data: example }}
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
