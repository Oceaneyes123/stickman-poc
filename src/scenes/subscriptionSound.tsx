import { Audio } from "@remotion/media";
import { interpolate, staticFile } from "remotion";
import { SfxTrack, type PlacedSfx } from "../audio/sfx";
import type { Timeline } from "../timeline/types";
import { openingTimeline } from "./subscriptionOpeningTimeline";
import { continuationTimeline } from "./subscriptionContinuationTimeline";
import { endingTimeline, ENDING_START_FRAME, FILM_DURATION_FRAMES } from "./subscriptionEndingTimeline";

const scene = (timeline: Timeline, id: string, offset = 0) => {
  const item = timeline.scenes.find((entry) => entry.id === id);
  if (!item || offset >= item.durationInFrames) throw new Error(`Invalid sound scene: ${id}`);
  return item.from + offset;
};
const event = (timeline: Timeline, id: string, offset = 0) => {
  const item = timeline.events.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing sound event: ${id}`);
  return item.from + offset;
};
const later = (id: string, offset = 0) => 1800 + scene(continuationTimeline, id, offset);
const ending = (id: string, offset = 0) => ENDING_START_FRAME + scene(endingTimeline, id, offset);

// Offsets reference the visual action within each compiled scene, not speech timestamps.
export const subscriptionSfx: PlacedSfx[] = [
  [event(openingTimeline, "start", 6), "pop", 0.26],
  [event(openingTimeline, "cancel", 15), "pop", 0.24],
  [scene(openingTimeline, "opening-3", 30), "pop", 0.22],
  [scene(openingTimeline, "opening-4", 4), "swish", 0.18],
  [scene(openingTimeline, "opening-4", 54), "pop", 0.2],
  [scene(openingTimeline, "opening-5", 4), "swish", 0.18],
  [scene(openingTimeline, "opening-5", 54), "pop", 0.2],
  [event(openingTimeline, "uncertain", 4), "bar_thump", 0.14],
  [event(openingTimeline, "renewal", 8), "swish", 0.16],
  [event(openingTimeline, "convenient-return", 8), "pop", 0.18],
  [event(openingTimeline, "rent-pay", 4), "coin_clink", 0.18],
  [event(openingTimeline, "rent-watch", 4), "pop", 0.18],
  [event(openingTimeline, "rent-end", 4), "ding", 0.14],
  [event(openingTimeline, "next-renewal", 4), "clock_tick", 0.14],
  [later("finished", 12), "swish", 0.16],
  [later("ongoing", 32), "coin_clink", 0.16],
  [later("manage", 32), "pop", 0.16],
  [later("mismatch", 30), "bar_thump", 0.16],
  [later("default", 15), "clock_tick", 0.12],
  [later("rental", 32), "pop", 0.16],
  [later("subscription", 32), "swish", 0.16],
  [later("study", 12), "bill_flutter", 0.14],
  [later("sample", 32), "pop", 0.16],
  [later("replace", 20), "swish", 0.18],
  [later("finding", 16), "bar_thump", 0.16],
  [later("uncertainty", 32), "pop", 0.14],
  [later("automatic", 32), "swish", 0.16],
  [1800 + event(continuationTimeline, "leave", 6), "pop", 0.18],
  [later("retention", 16), "pop", 0.22],
  [later("benefits-reminder", 14), "swish", 0.16],
  [later("pause-offer", 12), "pop", 0.18],
  [later("meeting", 14), "swish", 0.18],
  [later("phone-call", 15), "ding", 0.1],
  [later("typed-research", 12), "calculator_taps", 0.14],
  [later("constraint", 18), "swish", 0.14],
  [later("complete", 30), "ding", 0.13],
  [later("postponed", 18), "clock_tick", 0.12],
  [later("offer-benefit", 18), "pop", 0.18],
  [later("dark-pattern", 12), "bar_thump", 0.12],
  [later("case", 15), "bill_flutter", 0.14],
  [later("allegation", 32), "pop", 0.14],
  [1800 + event(continuationTimeline, "screens", 6), "pop", 0.16],
  [1800 + event(continuationTimeline, "clicks", 6), "pop", 0.16],
  [1800 + event(continuationTimeline, "penalty", 8), "bar_thump", 0.16],
  [ending("commitment", 15), "bill_flutter", 0.14],
  [ending("billing", 30), "pop", 0.16],
  [ending("tradeoff", 30), "swish", 0.15],
  [ending("visible-terms", 30), "pop", 0.16],
  [ending("check-details", 15), "pop", 0.16],
  [ending("purchase-route", 30), "swish", 0.15],
  [ending("confirmation", 30), "ding", 0.16],
  [ending("warning", 30), "bar_thump", 0.14],
  [ending("discount", 30), "swish", 0.15],
  [ending("save-record", 15), "bill_flutter", 0.14],
  [ending("opening-callback", 16), "pop", 0.16],
  [ending("access", 30), "clock_tick", 0.12],
  [ending("exit-effort", 30), "pop", 0.16],
  [ending("choice", 30), "pop", 0.16],
  [ending("call-to-action", 12), "pop", 0.22],
  [ending("call-to-action", 80), "pop", 0.22],
];

export const SubscriptionSound: React.FC = () => <>
  <Audio src={staticFile("subscription-full/ambient.wav")} volume={(frame) => interpolate(
    frame, [0, 90, FILM_DURATION_FRAMES - 60, FILM_DURATION_FRAMES - 1],
    [0, 0.12, 0.12, 0], {extrapolateLeft:"clamp", extrapolateRight:"clamp"},
  )}/>
  <SfxTrack cues={subscriptionSfx}/>
</>;
