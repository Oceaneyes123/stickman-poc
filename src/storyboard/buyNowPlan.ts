/**
 * Video 002 film plan: measured-narration scene boundaries, sparse text beats
 * and SFX placement. The plan JSON lives with the episode; this module only
 * compiles it and refuses stale or ambiguous timing.
 */
import type { ReferenceExpression, ReferencePose } from "../characters/referenceModel.ts";
import { payInFour } from "../finance/math.ts";
import { SFX_CUES } from "../audio/cues.ts";
import { compileTimeline } from "../timeline/compiler.ts";
import type { Cue, Storyboard, StoryEvent } from "../timeline/types.ts";

export const FILM_FPS = 30;
/** Frames each stage gets in BuyNowMotionGallery. */
export const BUY_NOW_PANEL = 90;
export const STAGES = [
  "desk",
  "checkout",
  "band",
  "columns",
  "calendar",
  "notifications",
  "account",
  "car",
  "cafe",
  "rail",
  "mirror",
  "walk",
  "wide",
  "counter",
  "closing",
] as const;
export type Stage = (typeof STAGES)[number];
export type PhoneScreen =
  | "jacket"
  | "headphones"
  | "shoes"
  | "ticket"
  | "watch"
  | "checkout"
  | "bank"
  | "notifications"
  | "reminders"
  | "return"
  | "lock"
  | "off";
export type FilmColor = "navy" | "yellow" | "coral" | "teal" | "white" | "muted";
export type FilmText = {
  text?: string;
  value?: number;
  preset?: "amount" | "label" | "heading";
  /** Amount treatment: rolling price, plain balance count, or a snap-in offer. */
  style?: "odometer" | "count" | "elastic";
  /** Amount alignment; `middle` centers the number on x, for card-sized labels. */
  anchor?: "start" | "middle";
  x: number;
  y: number;
  size?: number;
  color?: FilmColor;
  /** Scene-relative placement, used when no anchorWord is given. */
  fraction?: number;
  /** Place on the first spoken occurrence of this word inside the scene. */
  anchorWord?: string;
  enter?: number;
  hold?: number;
};
export type FilmSfx = [fraction: number, name: string, volume?: number];
export type FilmScene = {
  id: string;
  title: string;
  quote: string;
  stage: Stage;
  who?: "sam" | "alex" | "both" | "none";
  pose?: ReferencePose;
  expression?: ReferenceExpression;
  facing?: 1 | -1;
  x?: number;
  y?: number;
  scale?: number;
  screen?: PhoneScreen;
  band?: "full" | "split" | "compare" | "none";
  lit?: boolean;
  tabHistory?: number;
  columns?: number;
  cards?: number;
  calendar?: { dots?: number; extra?: number; cards?: string[]; week?: number };
  notifications?: number;
  account?: {
    reserved?: number;
    repair?: boolean;
    savings?: number;
    payday?: boolean;
    labels?: boolean;
  };
  props?: string[];
  camera?: { from: number; to: number; x?: number; y?: number };
  note?: string;
  text?: FilmText[];
  sfx?: FilmSfx[];
};
export type FilmPlan = {
  version: 1;
  fps: typeof FILM_FPS;
  tailFrames: number;
  amounts: { total: number; count: number };
  scenes: FilmScene[];
};
export type TimingWord = {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
};
export type TimingCue = {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  wordIds: string[];
};
export type TimingFile = {
  mode: string;
  durationMs: number;
  scriptHash: string;
  sourceAudioSha256: string;
  cues: TimingCue[];
};
export type CompiledFilmScene = FilmScene & {
  from: number;
  until: number;
  durationInFrames: number;
  startMs: number;
  endMs: number;
  matched: { startWord: number; endWord: number; score: number };
};
export type CompiledFilm = {
  fps: typeof FILM_FPS;
  durationInFrames: number;
  durationMs: number;
  amounts: { total: number; count: number; installment: number };
  scenes: CompiledFilmScene[];
  texts: (FilmText & { sceneId: string; from: number; until: number })[];
  sfx: { sceneId: string; frame: number; name: string; volume: number }[];
  timingStatus: string;
  /** Measured narration the frames were compiled against. */
  narration: { sha256: string; durationMs: number; cues: number; words: number };
};

const normalize = (word: string) =>
  word
    .toLowerCase()
    .replace(/[^a-z0-9']/g, "")
    .trim();
const wordsOf = (text: string) => text.split(/\s+/).map(normalize).filter(Boolean);

export function findQuote(
  quote: string,
  words: TimingWord[],
): { startWord: number; endWord: number; score: number } {
  const target = wordsOf(quote);
  if (!target.length) throw new Error("Empty scene quote");
  const source = words.map((word) => normalize(word.text));
  let best = { startWord: -1, endWord: -1, score: -1 };
  for (let start = 0; start < source.length; start++) {
    for (let pad = -3; pad <= 3; pad++) {
      const end = start + target.length + pad;
      if (end > source.length || end <= start) continue;
      const window = source.slice(start, end);
      // Align the quote against this window without requiring identical length.
      let hits = 0;
      let cursor = 0;
      for (const token of window) {
        const found = target.indexOf(token, cursor);
        if (found >= 0) {
          hits++;
          cursor = found + 1;
        }
      }
      const score = hits / Math.max(target.length, window.length);
      if (score > best.score) best = { startWord: start, endWord: end, score };
    }
  }
  if (best.score < 0.55 || best.startWord < 0)
    throw new Error(`Quote not found in narration (${best.score.toFixed(2)}): ${quote.slice(0, 60)}`);
  return best;
}

export function compileBuyNow(
  plan: FilmPlan,
  timing: TimingFile,
  words: TimingWord[],
  audioDurationMs: number,
  sfxLengthMs: Record<string, number> = {},
): CompiledFilm {
  if (plan.version !== 1 || plan.fps !== FILM_FPS)
    throw new Error("Unsupported film plan version or fps");
  if (Math.abs(timing.durationMs - audioDurationMs) > 1000 / 48000)
    throw new Error("Timing file does not match the measured narration");
  if (!timing.cues.length) throw new Error("Narration timing has no phrase cues");
  const amounts = payInFour(plan.amounts.total, plan.amounts.count);

  const ids = new Set<string>();
  const windows = plan.scenes.map((scene, index) => {
    if (ids.has(scene.id)) throw new Error(`Duplicate scene ${scene.id}`);
    ids.add(scene.id);
    if (!STAGES.includes(scene.stage)) throw new Error(`Unknown stage ${scene.stage}`);
    if (!scene.quote.trim()) throw new Error(`Scene ${scene.id} has no quote`);
    const matched = findQuote(scene.quote, words);
    const startMs = words[matched.startWord].startMs;
    const endMs =
      index + 1 < plan.scenes.length
        ? words[findQuote(plan.scenes[index + 1].quote, words).startWord].startMs
        : audioDurationMs;
    if (Math.round((endMs * FILM_FPS) / 1000) - Math.round((startMs * FILM_FPS) / 1000) < 24)
      throw new Error(`Scene ${scene.id} is shorter than 24 frames`);
    return { scene, matched, startMs, endMs };
  });
  if (windows[0].startMs !== 0)
    throw new Error("The measured narration must start on the first frame");

  const cues: Cue[] = timing.cues.map((cue) => ({
    id: cue.id,
    text: cue.text,
    startMs: cue.startMs,
    endMs: cue.endMs,
  }));
  const lastCue = cues[cues.length - 1];
  const cueAt = (ms: number) => {
    const cue =
      cues.find((item) => ms >= item.startMs && ms < item.endMs) ??
      cues.find((item) => item.endMs >= ms);
    if (!cue) throw new Error(`No narration cue covers ${ms.toFixed(0)}ms`);
    return cue;
  };
  const anchor = (ms: number, reason: string) => {
    const cue = cueAt(ms);
    return { cueId: cue.id, offsetMs: ms - cue.startMs, reason };
  };
  const wordStart = (anchorWord: string, startMs: number, endMs: number, fraction?: number) => {
    const token = normalize(anchorWord);
    const word = words.find(
      (item) =>
        normalize(item.text) === token &&
        item.startMs >= startMs &&
        item.startMs < endMs,
    );
    return word ? word.startMs : startMs + (fraction ?? 0.5) * (endMs - startMs);
  };

  const events: StoryEvent[] = [];
  const textBeats: { id: string; sceneId: string; beat: FilmText }[] = [];
  const sfxBeats: { id: string; sceneId: string; name: string; volume: number }[] = [];
  for (const { scene, startMs, endMs } of windows) {
    (scene.text ?? []).forEach((beat, index) => {
      if (beat.value !== undefined && beat.preset !== "amount")
        throw new Error(`Scene ${scene.id} text value needs the amount preset`);
      if (
        beat.value !== undefined &&
        beat.value !== amounts.total &&
        beat.value !== amounts.installment
      )
        throw new Error(`Scene ${scene.id} prints an undeclared amount`);
      if (beat.x < 96 || beat.y < 96 || beat.x > 1824 || beat.y > 984)
        throw new Error(`Scene ${scene.id} text starts outside the safe margins`);
      const at = beat.anchorWord
        ? wordStart(beat.anchorWord, startMs, endMs, beat.fraction)
        : startMs + (beat.fraction ?? 0.5) * (endMs - startMs);
      // Keep the full entrance + hold + exit window on screen without crossing the cut.
      const windowMs = ((beat.enter ?? 14) + (beat.hold ?? 48) + 10) * (1000 / FILM_FPS);
      const fromMs = Math.max(startMs, Math.min(at, endMs - windowMs));
      const durationMs = Math.min(windowMs, endMs - fromMs);
      if (durationMs < 300) throw new Error(`Scene ${scene.id} text window is too short`);
      const id = `text-${scene.id}-${index}`;
      events.push({
        id,
        sceneId: scene.id,
        ...anchor(fromMs, `Beat anchored on scene ${scene.id}`),
        durationMs,
        kind: "payoff",
        track: "text",
        allowOverlap: true,
        payload: { index },
      });
      textBeats.push({ id, sceneId: scene.id, beat });
    });
    (scene.sfx ?? []).forEach(([fraction, name, volume], index) => {
      if (fraction < 0 || fraction > 1)
        throw new Error(`Scene ${scene.id} has an SFX outside its window`);
      if (!(name in SFX_CUES)) throw new Error(`Scene ${scene.id} uses unknown SFX ${name}`);
      const length = sfxLengthMs[name];
      if (!Number.isFinite(length) || length <= 0)
        throw new Error(`Measured length is missing for SFX ${name}`);
      const frameMs = 1000 / FILM_FPS;
      const fromMs = Math.min(
        startMs + fraction * (endMs - startMs),
        endMs - frameMs,
      );
      const durationMs = Math.min(length, endMs - fromMs);
      if (durationMs < frameMs) throw new Error(`Scene ${scene.id} SFX ${name} has no room`);
      const id = `sfx-${scene.id}-${index}`;
      events.push({
        id,
        sceneId: scene.id,
        ...anchor(fromMs, `Library SFX ${name} placed on scene fraction ${fraction}`),
        durationMs,
        kind: "payoff",
        track: "sfx",
        allowOverlap: true,
        payload: { name },
      });
      sfxBeats.push({ id, sceneId: scene.id, name, volume: volume ?? 0.5 });
    });
  }

  const board: Storyboard = {
    fps: FILM_FPS,
    demoDurationMs: audioDurationMs,
    tailMs: (plan.tailFrames * 1000) / FILM_FPS,
    scenes: windows.map(({ scene, startMs }, index) => ({
      id: scene.id,
      template: "story",
      title: scene.title,
      start: anchor(startMs, `Quote "${scene.quote.slice(0, 48)}" starts here`),
      end:
        index + 1 < windows.length
          ? anchor(windows[index + 1].startMs, `Next scene quote starts here`)
          : { cueId: lastCue.id, edge: "end" as const },
    })),
    events,
  };
  const timeline = compileTimeline(
    {
      mode: "aligned",
      scriptHash: timing.scriptHash,
      audioHash: timing.sourceAudioSha256,
      cues,
    },
    board,
    audioDurationMs,
  );

  const scenes: CompiledFilmScene[] = windows.map(({ scene, matched }) => {
    const compiled = timeline.scenes.find((item) => item.id === scene.id)!;
    return {
      ...scene,
      startMs: compiled.startMs,
      endMs: compiled.endMs,
      from: compiled.from,
      until: compiled.from + compiled.durationInFrames,
      durationInFrames: compiled.durationInFrames,
      matched,
    };
  });
  const eventOf = (id: string) => {
    const event = timeline.events.find((item) => item.id === id);
    if (!event) throw new Error(`Timeline lost event ${id}`);
    return event;
  };
  const texts = textBeats.map(({ id, sceneId, beat }) => {
    const event = eventOf(id);
    return {
      ...beat,
      sceneId,
      from: event.from,
      until: event.from + event.durationInFrames,
    };
  });
  const sfx = sfxBeats.map(({ id, sceneId, name, volume }) => ({
    sceneId,
    frame: eventOf(id).from,
    name,
    volume,
  }));

  return {
    fps: FILM_FPS,
    durationInFrames: timeline.durationInFrames,
    durationMs: timeline.durationMs,
    amounts,
    scenes,
    texts,
    sfx,
    timingStatus:
      "Draft ASR phrase cues (faster-whisper small, CPU) over the measured master; scene and event frames come from src/timeline/compiler.ts. No human listening or hand alignment yet.",
    narration: {
      sha256: timing.sourceAudioSha256,
      durationMs: audioDurationMs,
      cues: cues.length,
      words: words.length,
    },
  };
}
