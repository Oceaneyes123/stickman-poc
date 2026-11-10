import { compileTimeline, msToFrames } from "../timeline/compiler.ts";
import type { Cue, CueFile, Timeline } from "../timeline/types.ts";
import { example, calculateBudget } from "../finance/math.ts";
import {
  monthOne,
  monthTwo,
  monthOneExpenses,
  monthTwoExpenses,
  samThreeMonths,
  alexThreeMonths,
  baselineThreeMonths,
  samAnnual,
  alexAnnual,
} from "../storyboard/remainingShots.ts";

const budget = calculateBudget(example);
export const financialValues: Record<string, number> = {
  oldIncome: example.income,
  oldExpenses: example.expenses,
  raise: example.raise,
  before: budget.before,
  income: budget.income,
  capacity: budget.income - example.expenses,
  rent: example.upgrades[0].amount,
  transport: example.upgrades[1].amount,
  services: example.upgrades[2].amount,
  raiseLeft:
    example.raise - example.upgrades[0].amount - example.upgrades[1].amount,
  negativeServices: -example.upgrades[2].amount,
  monthOne,
  monthTwo,
  monthOneExpenses,
  monthTwoExpenses,
  sam: budget.sam,
  samExpenses: budget.samExpenses,
  added: budget.added,
  overrun: budget.added - example.raise,
  alex: budget.alex,
  alexExpenses: budget.alexExpenses,
  samThree: samThreeMonths,
  alexThree: alexThreeMonths,
  baselineThree: baselineThreeMonths,
  periodGap: alexThreeMonths - samThreeMonths,
  monthlyGap: budget.alex - budget.sam,
  samAnnual,
  alexAnnual,
  annualGap: alexAnnual - samAnnual,
};
export type TypeAnchor = { cueId: string; wordId?: string; edge: string };
export type TypographyBeat = {
  id: string;
  sceneId: string;
  anchor: TypeAnchor;
  mode: string;
  text: string[];
  reason: string;
  preset: string;
  position: { x: number; y: number };
  object: { x: number; y: number };
  readingHoldFrames: number;
  enterFrames: number;
  exitFrames: number;
  compositionChange: boolean;
  holdToSceneEnd?: boolean;
  persistThroughPanels?: boolean;
  listAnchors?: TypeAnchor[];
  listOffsetsFrames?: number[];
  fontSize?: number;
  color?: "navy" | "teal" | "red";
  leaderLine?: boolean;
  underlineWidth?: number;
  itemPositions?: { x: number; y: number }[];
  itemObjects?: { x: number; y: number }[];
  layout?: "attached";
  rowGap?: number;
  rotation?: { degrees: number; x: number; y: number };
  morphBefore?: string;
};
export type TypographyPlan = {
  scenes: {
    id: string;
    title: string;
    firstCue: string;
    confirmationAnchor?: TypeAnchor;
  }[];
  beats: TypographyBeat[];
  panels: {
    id: string;
    sceneId: string;
    anchor: TypeAnchor;
    phaseOffsetFrames: number;
  }[];
  gates: { sceneId: string; key: string; anchor: TypeAnchor }[];
};
export type DraftTiming = {
  mode: string;
  durationMs: number;
  cues: (Cue & { wordIds: string[] })[];
  scriptHash: string;
  sourceAudioSha256: string;
  listeningReviewed: boolean;
  timingReviewed: boolean;
};
export type WordTiming = {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
};
export type CompiledTypography = {
  timeline: Timeline;
  beats: (TypographyBeat & {
    from: number;
    until: number;
    itemFrames?: number[];
  })[];
  panels: { id: string; sceneId: string; from: number; until: number }[];
  gates: { sceneId: string; value: number; from: number }[];
  confirmations: { sceneId: string; from: number }[];
  shortHolds: string[];
  timingStatus: string;
};
export function resolveTypeAnchor(
  anchor: TypeAnchor,
  timing: DraftTiming,
  words: WordTiming[],
) {
  const cue = timing.cues.find((c) => c.id === anchor.cueId);
  if (!cue) throw new Error(`Missing typography cue ${anchor.cueId}`);
  if (anchor.edge !== "start" && anchor.edge !== "end")
    throw new Error("Invalid typography anchor edge");
  if (!anchor.wordId) return anchor.edge === "end" ? cue.endMs : cue.startMs;
  const word = words.find((w) => w.id === anchor.wordId);
  if (
    !word ||
    !cue.wordIds.includes(word.id) ||
    word.startMs < cue.startMs ||
    word.endMs > cue.endMs ||
    word.endMs <= word.startMs
  )
    throw new Error(`Invalid typography word ${anchor.wordId}`);
  return anchor.edge === "end" ? word.endMs : word.startMs;
}
export function compileTypography(
  plan: TypographyPlan,
  timing: DraftTiming,
  words: WordTiming[],
): CompiledTypography {
  const file: CueFile = {
    mode: "timing-demo",
    scriptHash: timing.scriptHash,
    cues: timing.cues,
  };
  // Draft ASR stays in review mode; compilation must never promote it to aligned.
  const timeline = compileTimeline(file, {
    fps: 30,
    demoDurationMs: timing.durationMs,
    tailMs: 0,
    events: [],
    scenes: plan.scenes.map((s, i) => ({
      id: s.id,
      title: s.title,
      template: "story",
      start: { cueId: s.firstCue },
      end:
        i + 1 < plan.scenes.length
          ? { cueId: plan.scenes[i + 1].firstCue }
          : { cueId: timing.cues.at(-1)!.id, edge: "end" },
    })),
  });
  const frame = (a: TypeAnchor) =>
    msToFrames(resolveTypeAnchor(a, timing, words), 30);
  const scene = (id: string) => {
    const s = timeline.scenes.find((s) => s.id === id);
    if (!s) throw new Error(`Unknown typography scene ${id}`);
    return s;
  };
  const ids = new Set<string>();
  for (const b of plan.beats) {
    if (ids.has(b.id)) throw new Error(`Duplicate typography beat ${b.id}`);
    ids.add(b.id);
    if (
      ![
        "VISUAL_ONLY",
        "CONTEXTUAL_LABEL",
        "ANIMATED_LIST",
        "FINANCIAL_REVEAL",
        "KINETIC_HEADLINE",
      ].includes(b.mode) ||
      !b.reason
    )
      throw new Error(`Invalid typography decision ${b.id}`);
    if (b.mode === "VISUAL_ONLY" && b.text.length)
      throw new Error("Visual-only beats cannot add text");
  }
  const panels = plan.panels.map((p) => {
    const s = scene(p.sceneId),
      from = frame(p.anchor) + p.phaseOffsetFrames;
    if (from < s.from || from >= s.from + s.durationInFrames)
      throw new Error(`Panel outside scene ${p.id}`);
    return {
      id: p.id,
      sceneId: p.sceneId,
      from,
      until: s.from + s.durationInFrames,
    };
  });
  for (let i = 0; i < panels.length - 1; i++) {
    if (panels[i + 1].from < panels[i].from)
      throw new Error(`Panels out of order ${panels[i + 1].id}`);
    if (
      panels[i + 1].sceneId === panels[i].sceneId &&
      panels[i + 1].from === panels[i].from
    )
      throw new Error(`Panel phases need explicit offsets ${panels[i + 1].id}`);
    panels[i].until = panels[i + 1].from;
  }
  const shortHolds: string[] = [];
  const beats = plan.beats.map((b) => {
    const s = scene(b.sceneId),
      from = frame(b.anchor);
    if (from < s.from || from >= s.from + s.durationInFrames)
      throw new Error(`Beat outside scene ${b.id}`);
    const next = plan.beats.find(
      (n) => n.sceneId === b.sceneId && n.text.length && frame(n.anchor) > from,
    );
    const cut = panels.find((p) => p.sceneId === b.sceneId && p.from > from);
    const itemFrames =
      b.listAnchors?.map(
        (a, i) => frame(a) + (b.listOffsetsFrames?.[i] ?? 0),
      ) ??
      (b.mode === "ANIMATED_LIST"
        ? b.text.map((_, i) => from + (b.listOffsetsFrames?.[i] ?? 0))
        : undefined);
    const lastItem = itemFrames?.length ? Math.max(...itemFrames) : from;
    const until = Math.min(
      s.from + s.durationInFrames,
      b.holdToSceneEnd
        ? Infinity
        : lastItem + b.enterFrames + b.readingHoldFrames + b.exitFrames,
      !b.holdToSceneEnd && next ? frame(next.anchor) : Infinity,
      !b.persistThroughPanels ? (cut?.from ?? Infinity) : Infinity,
    );
    if (
      b.text.length &&
      until - lastItem < b.enterFrames + b.readingHoldFrames + b.exitFrames
    )
      shortHolds.push(b.id);
    return { ...b, from, until, itemFrames };
  });
  const gates = plan.gates.map((g) => {
    if (!(g.key in financialValues))
      throw new Error(`Unknown finance key ${g.key}`);
    const s = scene(g.sceneId),
      from = frame(g.anchor);
    if (from < s.from || from >= s.from + s.durationInFrames)
      throw new Error(`Gate outside scene ${g.sceneId}`);
    return { sceneId: g.sceneId, value: financialValues[g.key], from };
  });
  return {
    timeline,
    beats,
    panels,
    gates,
    confirmations: plan.scenes
      .filter((s) => s.confirmationAnchor)
      .map((s) => {
        const from = frame(s.confirmationAnchor!),
          window = scene(s.id);
        if (from < window.from || from >= window.from + window.durationInFrames)
          throw new Error(`Confirmation outside scene ${s.id}`);
        return { sceneId: s.id, from };
      }),
    shortHolds,
    timingStatus:
      "Draft ASR; structural checks do not establish listening or exact alignment.",
  };
}
