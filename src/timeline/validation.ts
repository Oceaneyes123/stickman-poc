import type { CueFile, Storyboard, Timeline } from "./types.ts";
const assert: (condition: unknown, message: string) => asserts condition = (
  condition,
  message,
) => {
  if (!condition) throw new Error(`Timeline: ${message}`);
};
const unique = (ids: string[], name: string) =>
  assert(
    ids.every((id) => id.length > 0) && new Set(ids).size === ids.length,
    `${name} IDs must be nonempty and unique`,
  );
export function validateTimelineInput(
  file: CueFile,
  board: Storyboard,
  audioDurationMs?: number,
) {
  assert(
    file.mode === "timing-demo" || file.mode === "aligned",
    "invalid timing mode",
  );
  assert(board.fps === 30, "this production requires 30 fps");
  assert(
    Number.isFinite(board.demoDurationMs) &&
      board.demoDurationMs > 0 &&
      Number.isFinite(board.tailMs) &&
      board.tailMs >= 0,
    "invalid duration or tail",
  );
  assert(
    file.cues.length > 0 && board.scenes.length > 0,
    "cues and scenes cannot be empty",
  );
  unique(
    file.cues.map((c) => c.id),
    "cue",
  );
  unique(
    board.scenes.map((s) => s.id),
    "scene",
  );
  unique(
    board.events.map((e) => e.id),
    "event",
  );
  const ids = new Set(file.cues.map((c) => c.id));
  let previousEnd = 0;
  for (const cue of file.cues) {
    assert(
      Number.isFinite(cue.startMs) &&
        Number.isFinite(cue.endMs) &&
        cue.startMs >= previousEnd &&
        cue.endMs > cue.startMs,
      `invalid or overlapping cue ${cue.id}`,
    );
    assert(
      typeof cue.text === "string" && cue.text.trim().length > 0,
      `empty cue ${cue.id}`,
    );
    previousEnd = cue.endMs;
  }
  if (file.mode === "aligned") {
    assert(
      audioDurationMs !== undefined &&
        Number.isFinite(audioDurationMs) &&
        audioDurationMs > 0,
      "aligned cues require measured WAV duration",
    );
    assert(previousEnd <= audioDurationMs, "cue extends beyond WAV");
    assert(Boolean(file.audioHash), "aligned cues require audioHash");
  } else
    assert(
      previousEnd <= board.demoDurationMs,
      "cue extends beyond demo duration",
    );
  for (const scene of board.scenes) {
    assert(
      ["story", "comparison", "diagram"].includes(scene.template),
      `invalid template ${scene.id}`,
    );
    for (const anchor of [scene.start, scene.end]) {
      assert(
        ids.has(anchor.cueId),
        `missing cue ${anchor.cueId} in scene ${scene.id}`,
      );
      assert(
        Number.isFinite(anchor.offsetMs ?? 0),
        `invalid offset in ${scene.id}`,
      );
      assert(
        !anchor.offsetMs || Boolean(anchor.reason?.trim()),
        `shift in ${scene.id} needs a reason`,
      );
    }
  }
  for (const event of board.events) {
    assert(
      ids.has(event.cueId),
      `missing cue ${event.cueId} in event ${event.id}`,
    );
    assert(
      board.scenes.some((scene) => scene.id === event.sceneId),
      `missing scene ${event.sceneId}`,
    );
    assert(
      Number.isFinite(event.offsetMs) &&
        Number.isFinite(event.durationMs) &&
        event.durationMs > 0,
      `invalid duration/offset in ${event.id}`,
    );
    assert(
      event.offsetMs === 0 || Boolean(event.reason?.trim()),
      `shift in ${event.id} needs a reason`,
    );
    assert(Boolean(event.track), `event ${event.id} needs a track`);
  }
}
export function validateCompiledTimeline(t: Timeline) {
  let end = 0;
  let endMs = 0;
  for (const scene of t.scenes) {
    assert(scene.startMs === endMs, `millisecond gap or overlap at scene ${scene.id}`);
    assert(scene.from === end, `gap or overlap at scene ${scene.id}`);
    assert(
      scene.startMs >= 0 &&
        scene.endMs <= t.durationMs &&
        scene.durationInFrames > 0,
      `out-of-bounds scene ${scene.id}`,
    );
    end = scene.from + scene.durationInFrames;
    endMs = scene.endMs;
  }
  assert(end === t.durationInFrames, "scenes must preserve final duration");
  for (const event of t.events) {
    const scene = t.scenes.find((s) => s.id === event.sceneId)!;
    assert(
      event.startMs >= scene.startMs &&
        event.endMs <= scene.endMs &&
        event.durationInFrames > 0,
      `out-of-bounds event ${event.id}`,
    );
    assert(
      event.from >= scene.from &&
        event.from + event.durationInFrames <=
          scene.from + scene.durationInFrames,
      `rounded event outside scene ${event.id}`,
    );
    for (const other of t.events) {
      if (
        event.id >= other.id ||
        event.sceneId !== other.sceneId ||
        event.track !== other.track ||
        event.allowOverlap ||
        other.allowOverlap
      )
        continue;
      assert(
        event.endMs <= other.startMs || other.endMs <= event.startMs,
        `unintentional overlap ${event.id}/${other.id}`,
      );
    }
  }
}
