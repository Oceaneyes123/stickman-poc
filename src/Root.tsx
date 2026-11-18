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
import {
  DocumentaryGallery,
  DOCUMENTARY_GALLERY_DURATION,
} from "./documentary/Gallery";
import {
  BNPL_DEMO_DURATION,
  BnplFeelsCheaperDemo,
  DocumentaryMixedMediaShowcase,
} from "./documentary/demo/BnplFeelsCheaperDemo";
import {
  CUTAWAY_GALLERY_DURATION,
  FreeShippingCutawayGallery,
} from "./scenes/FreeShippingCutaways";
import {
  FreeShippingCheckoutGallery,
  FreeShippingChocolateGallery,
  FreeShippingOpening,
} from "./scenes/FreeShippingOpening";
import {
  FreeShippingFullFilm,
  FreeShippingRemainingGallery,
  REMAINING_GALLERY_DURATION,
} from "./scenes/FreeShippingRemaining";
import { FULL_FILM_DURATION_FRAMES } from "./scenes/freeShippingFullTimeline";
import { freeShippingOpeningTimeline } from "./scenes/freeShippingOpeningTimeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BnplFeelsCheaperDemo"
        component={BnplFeelsCheaperDemo}
        durationInFrames={BNPL_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DocumentaryGallery"
        component={DocumentaryGallery}
        durationInFrames={DOCUMENTARY_GALLERY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DocumentaryMixedMediaShowcase"
        component={DocumentaryMixedMediaShowcase}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FreeShippingOpening"
        component={FreeShippingOpening}
        durationInFrames={freeShippingOpeningTimeline.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FreeShippingFullFilm"
        component={FreeShippingFullFilm}
        durationInFrames={FULL_FILM_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FreeShippingCutawayGallery"
        component={FreeShippingCutawayGallery}
        durationInFrames={CUTAWAY_GALLERY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FreeShippingRemainingGallery"
        component={FreeShippingRemainingGallery}
        durationInFrames={REMAINING_GALLERY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FreeShippingCheckoutGallery"
        component={FreeShippingCheckoutGallery}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FreeShippingChocolateGallery"
        component={FreeShippingChocolateGallery}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
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

