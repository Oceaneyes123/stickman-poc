import { Composition } from "remotion";
import { ComponentGallery } from "./ComponentGallery";
import "./design/fonts";
import { CharacterStudy } from "./CharacterStudy";
import { BankExample } from "./scenes/BankExample";
import { MovementReview, MOVEMENT_DURATION } from "./MovementReview";
import { WalkingMechanics } from "./WalkingMechanics";
import { GeneralOutro } from "./scenes/GeneralOutro";
import { SfxGallery, SFX_GALLERY_DURATION } from "./audio/Gallery";
import { SubscriptionPreview } from "./scenes/SubscriptionPreview";
import { SubscriptionOpening, SubscriptionTextureGallery, SubscriptionCardGallery, SubscriptionRenewalGallery, SubscriptionFlowGallery } from "./scenes/SubscriptionOpening";
import { SubscriptionFiveMinutes, SubscriptionContinuationGallery } from "./scenes/SubscriptionFiveMinutes";
import { SubscriptionFullFilm, SubscriptionEndingVisuals } from "./scenes/SubscriptionFullFilm";
import { FILM_DURATION_FRAMES, ENDING_START_FRAME } from "./scenes/subscriptionEndingTimeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="SubscriptionOpening" component={SubscriptionOpening} durationInFrames={1800} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionFiveMinutes" component={SubscriptionFiveMinutes} durationInFrames={9000} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionFullFilm" component={SubscriptionFullFilm} durationInFrames={FILM_DURATION_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionEndingGallery" component={SubscriptionEndingVisuals} durationInFrames={FILM_DURATION_FRAMES-ENDING_START_FRAME} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionContinuationGallery" component={SubscriptionContinuationGallery} durationInFrames={7200} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionTextureGallery" component={SubscriptionTextureGallery} durationInFrames={360} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionCardGallery" component={SubscriptionCardGallery} durationInFrames={270} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionRenewalGallery" component={SubscriptionRenewalGallery} durationInFrames={330} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionFlowGallery" component={SubscriptionFlowGallery} durationInFrames={520} fps={30} width={1920} height={1080} />
      <Composition id="SubscriptionPreview" component={SubscriptionPreview} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Composition
        id="SfxGallery"
        component={SfxGallery}
        durationInFrames={SFX_GALLERY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GeneralOutro"
        component={GeneralOutro}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
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

