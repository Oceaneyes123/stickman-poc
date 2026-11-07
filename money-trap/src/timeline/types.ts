export type Cue = { id: string; startMs: number; endMs: number; text: string };
export type CueFile = {
  mode: "timing-demo" | "aligned";
  scriptHash: string;
  audioHash?: string;
  cues: Cue[];
};
export type Anchor = {
  cueId: string;
  edge?: "start" | "end";
  offsetMs?: number;
  reason?: string;
};
export type SceneSpec = {
  id: string;
  template: "story" | "comparison" | "diagram";
  start: Anchor;
  end: Anchor;
  title: string;
  character?: "Sam" | "Alex";
  environment?: "office" | "apartment" | "street";
  transition?: "cut" | "wipe" | "fade";
};
export type StoryEvent = {
  id: string;
  sceneId: string;
  cueId: string;
  offsetMs: number;
  durationMs: number;
  reason?: string;
  kind:
    | "raise"
    | "show-expense"
    | "total"
    | "before-after"
    | "alternative"
    | "payoff";
  track: string;
  allowOverlap?: boolean;
  payload: Record<string, string | number>;
};
export type Storyboard = {
  fps: number;
  demoDurationMs: number;
  tailMs: number;
  scenes: SceneSpec[];
  events: StoryEvent[];
};
export type CompiledScene = SceneSpec & {
  startMs: number;
  endMs: number;
  from: number;
  durationInFrames: number;
};
export type CompiledEvent = StoryEvent & {
  startMs: number;
  endMs: number;
  from: number;
  durationInFrames: number;
};
export type Timeline = {
  fps: number;
  durationMs: number;
  durationInFrames: number;
  mode: CueFile["mode"];
  scenes: CompiledScene[];
  events: CompiledEvent[];
};
