import type React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile } from "remotion";
import { SfxTrack } from "../audio/sfx";
import {
  AMBIENT_GAIN,
  freeShippingFullSfx,
  freeShippingOpeningSfx,
} from "./freeShippingAudioCues";
import { FULL_FILM_DURATION_FRAMES } from "./freeShippingFullTimeline";
import { freeShippingOpeningTimeline } from "./freeShippingOpeningTimeline";

export { freeShippingFullSfx, freeShippingOpeningSfx };

export const FreeShippingOpeningSound: React.FC = () => (
  <>
    <Audio
      src={staticFile("free-shipping-full/ambient.wav")}
      durationInFrames={freeShippingOpeningTimeline.durationInFrames}
      volume={(frame) =>
        interpolate(
          frame,
          [
            0,
            60,
            freeShippingOpeningTimeline.durationInFrames - 60,
            freeShippingOpeningTimeline.durationInFrames - 1,
          ],
          [0, AMBIENT_GAIN, AMBIENT_GAIN, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
    <SfxTrack cues={freeShippingOpeningSfx} />
  </>
);

export const FreeShippingSound: React.FC = () => (
  <>
    <Audio
      src={staticFile("free-shipping-full/ambient.wav")}
      volume={(frame) =>
        interpolate(
          frame,
          [
            0,
            90,
            FULL_FILM_DURATION_FRAMES - 60,
            FULL_FILM_DURATION_FRAMES - 1,
          ],
          [0, AMBIENT_GAIN, AMBIENT_GAIN, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
    <SfxTrack cues={freeShippingFullSfx} />
  </>
);
