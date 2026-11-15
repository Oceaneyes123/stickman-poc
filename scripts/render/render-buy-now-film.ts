import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";
import {
  BUY_NOW_PANEL,
  compileBuyNow,
  FILM_FPS,
  STAGES,
  type FilmPlan,
  type TimingFile,
  type TimingWord,
} from "../../src/storyboard/buyNowPlan.ts";

const { values } = parseArgs({
  options: {
    out: { type: "string" },
    stills: { type: "boolean" },
    full: { type: "boolean" },
    gallery: { type: "boolean" },
    "prepare-only": { type: "boolean" },
  },
});
const output = resolve(values.out ?? "out/002-buy-now-pay-later/film-v1");
if (existsSync(output))
  throw new Error("Choose a fresh --out folder to preserve earlier reviews");
const source = "videos/002-buy-now-pay-later";
const audio = "out/002-buy-now-pay-later/narration";
const read = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8"));
const save = (path: string, value: unknown) =>
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
const hash = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const run = (cmd: string, args: string[]) => {
  const result = spawnSync(cmd, args, { encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${cmd}: ${result.stderr}`);
  return result.stdout;
};
for (const file of ["run.lock", "timing/run.lock"])
  if (existsSync(`${audio}/${file}`))
    throw new Error("Narration or timing is being generated");

const plan = read<FilmPlan>(`${source}/film-plan.json`);
const timing = read<TimingFile>(`${audio}/timing/cues.draft.json`);
const wordFile = read<{ words: TimingWord[]; scriptHash: string; sourceAudioSha256: string }>(
  `${audio}/timing/words.draft.json`,
);
const scriptHash = hash(`${source}/narration.txt`);
const audioHash = hash(`${audio}/narration.wav`);
if (
  timing.scriptHash !== scriptHash ||
  wordFile.scriptHash !== scriptHash ||
  timing.sourceAudioSha256 !== audioHash ||
  wordFile.sourceAudioSha256 !== audioHash
)
  throw new Error("Narration/timing provenance is stale");
const measuredMs =
  Number(
    run("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      `${audio}/narration.wav`,
    ]),
  ) * 1000;
if (Math.abs(measuredMs - timing.durationMs) > 1000 / 48000)
  throw new Error("Draft duration differs from measured WAV");
const usedSfx = new Set<string>();
for (const scene of plan.scenes) for (const [, name] of scene.sfx ?? []) usedSfx.add(name);
const sfxLengthMs: Record<string, number> = {};
for (const name of usedSfx) {
  const file = `public/sfx/${name}.wav`;
  if (!existsSync(file)) throw new Error(`Missing library SFX ${file}`);
  sfxLengthMs[name] =
    Number(
      run("ffprobe", [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        file,
      ]),
    ) * 1000;
}
const data = compileBuyNow(plan, timing, wordFile.words, measuredMs, sfxLengthMs);
if (data.scenes.length !== 68)
  throw new Error(`Expected 68 scenes, compiled ${data.scenes.length}`);

mkdirSync(join(output, "public/fonts"), { recursive: true });
mkdirSync(join(output, "public/sfx"), { recursive: true });
mkdirSync(join(output, "images"));
cpSync("public/sfx", join(output, "public/sfx"), { recursive: true });
cpSync("public/fonts/Inter.ttf", join(output, "public/fonts/Inter.ttf"));

/**
 * One global audio bed: measured narration plus every library SFX at its
 * compiled frame, ducked under speech and limited. The composition plays this
 * single file, so the film never carries more than one Audio node.
 */
const bed = join(output, "public/film-audio.wav");
const inputs = ["-i", `${audio}/narration.wav`];
const filters = ["[0:a]aformat=channel_layouts=stereo,aresample=48000,asplit=2[nar][key]"];
const labels: string[] = [];
data.sfx.forEach((cue, index) => {
  const delay = Math.round((cue.frame * 1000) / FILM_FPS);
  inputs.push("-i", `public/sfx/${cue.name}.wav`);
  filters.push(
    `[${index + 1}:a]aformat=channel_layouts=stereo,aresample=48000,volume=${cue.volume.toFixed(3)},adelay=${delay}|${delay}[s${index}]`,
  );
  labels.push(`[s${index}]`);
});
filters.push(
  labels.length
    ? `${labels.join("")}amix=inputs=${labels.length}:normalize=0:dropout_transition=0[bus]`
    : "anullsrc=r=48000:cl=stereo[bus]",
  "[bus][key]sidechaincompress=threshold=0.03:ratio=8:attack=3:release=250[duck]",
  "[nar][duck]amix=inputs=2:normalize=0,alimiter=limit=0.95:level=false,apad[aout]",
);
run("ffmpeg", [
  "-v",
  "error",
  "-y",
  ...inputs,
  "-filter_complex",
  filters.join(";"),
  "-map",
  "[aout]",
  "-t",
  (data.durationInFrames / FILM_FPS).toFixed(3),
  "-ar",
  "48000",
  "-ac",
  "2",
  "-c:a",
  "pcm_s16le",
  bed,
]);
const bedMs = Number(
  run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    bed,
  ]),
) * 1000;
const audioManifest = {
  bed: "film-audio.wav",
  bedSha256: hash(bed),
  bedDurationMs: Math.round(bedMs * 1000) / 1000,
  fps: data.fps,
  durationInFrames: data.durationInFrames,
  narration: {
    source: `${audio}/narration.wav`,
    sha256: audioHash,
    durationMs: Math.round(measuredMs * 1000) / 1000,
  },
  mix: {
    engine: "ffmpeg filter_complex",
    sfxBus: "amix normalize=0 with per-cue adelay on compiled frames",
    ducking:
      "sidechaincompress threshold 0.03, ratio 8, attack 3ms, release 250ms keyed on narration",
    limiter: "alimiter limit 0.95",
    channels: 2,
    sampleRate: 48000,
  },
  cueCount: data.sfx.length,
  sfx: data.sfx.map((cue) => ({
    sceneId: cue.sceneId,
    frame: cue.frame,
    timeMs: Math.round((cue.frame * 1000 * 1000) / FILM_FPS) / 1000,
    name: cue.name,
    library: `public/sfx/${cue.name}.wav`,
    librarySha256: hash(`public/sfx/${cue.name}.wav`),
    sourceDurationMs: Math.round(sfxLengthMs[cue.name] * 1000) / 1000,
    gain: cue.volume,
  })),
};
save(join(output, "audio-manifest.json"), audioManifest);
save(join(output, "public/audio-manifest.json"), audioManifest);
save(join(output, "public/buy-now.json"), data);
save(join(output, "compiled.json"), data);
console.log(
  `Prepared ${data.scenes.length} scenes, ${data.texts.length} text beats, ${data.sfx.length} SFX cues, ${data.durationInFrames} frames, bed ${audioManifest.bedDurationMs}ms`,
);
if (values["prepare-only"]) process.exit(0);

const stillFrames = new Set<number>();
for (const scene of data.scenes) {
  stillFrames.add(scene.from + Math.floor(scene.durationInFrames * 0.62));
  stillFrames.add(scene.from + 2);
}
for (const beat of data.texts) stillFrames.add(Math.min(beat.until - 1, beat.from + 26));
const frames = [...stillFrames]
  .filter((frame) => frame >= 0 && frame < data.durationInFrames)
  .sort((a, b) => a - b);
const serveUrl = await bundle({
  entryPoint: resolve("src/storyboard/CinematicStoryboardStudy.tsx"),
  publicDir: join(output, "public"),
});
const browser = await openBrowser("chrome");
const inputProps = { data };
try {
  const composition = await selectComposition({
    serveUrl,
    id: "BuyNowFilm",
    inputProps,
    puppeteerInstance: browser,
  });
  if (values.stills || !values.full) {
    let done = 0;
    for (const scene of data.scenes) {
      const mid = scene.from + Math.floor(scene.durationInFrames * 0.62);
      await renderStill({
        serveUrl,
        composition,
        inputProps,
        puppeteerInstance: browser,
        frame: mid,
        scale: 0.5,
        output: join(output, `images/s${scene.id.slice(1)}.png`),
      });
      done++;
      if (done % 10 === 0) console.log(`Scene stills ${done}/68`);
    }
    for (const frame of frames) {
      if (frame < composition.durationInFrames)
        await renderStill({
          serveUrl,
          composition,
          inputProps,
          puppeteerInstance: browser,
          frame,
          scale: 0.5,
          output: join(output, `images/f${String(frame).padStart(6, "0")}.png`),
        });
    }
    // Cut review: the last frame before each cut and the first frame after it.
    for (const scene of data.scenes) {
      for (const [suffix, frame] of [
        ["prev", scene.from - 1],
        ["next", scene.from],
      ] as const) {
        if (frame < 0 || frame >= composition.durationInFrames) continue;
        await renderStill({
          serveUrl,
          composition,
          inputProps,
          puppeteerInstance: browser,
          frame,
          scale: 0.5,
          output: join(output, `images/b${scene.id.slice(1)}-${suffix}.png`),
        });
      }
    }
    save(join(output, "stills.json"), {
      scenes: data.scenes.map((scene) => ({
        id: scene.id,
        frame: scene.from + Math.floor(scene.durationInFrames * 0.62),
        from: scene.from,
        until: scene.until,
        startMs: scene.startMs,
        endMs: scene.endMs,
      })),
      textFrames: data.texts.map((beat) => ({
        sceneId: beat.sceneId,
        frame: Math.min(beat.until - 1, beat.from + 26),
        value: beat.value,
        text: beat.text,
      })),
    });
    console.log(`Rendered ${data.scenes.length} scene stills and ${frames.length} event stills`);
  }
  if (values.gallery) {
    const panels = STAGES.filter((stage) =>
      data.scenes.some((scene) => scene.stage === stage),
    );
    const gallery = await selectComposition({
      serveUrl,
      id: "BuyNowMotionGallery",
      inputProps,
      puppeteerInstance: browser,
    });
    mkdirSync(join(output, "images/gallery"));
    for (const [index, stage] of panels.entries()) {
      await renderStill({
        serveUrl,
        composition: gallery,
        inputProps,
        puppeteerInstance: browser,
        frame: index * BUY_NOW_PANEL + Math.floor(BUY_NOW_PANEL * 0.5),
        scale: 0.5,
        output: join(output, `images/gallery/p${String(index + 1).padStart(2, "0")}-${stage}.png`),
      });
    }
    save(join(output, "gallery.json"), {
      composition: "BuyNowMotionGallery",
      panelFrames: BUY_NOW_PANEL,
      durationInFrames: gallery.durationInFrames,
      panels: panels.map((stage, index) => ({
        stage,
        from: index * BUY_NOW_PANEL,
      })),
    });
    await renderMedia({
      serveUrl,
      composition: gallery,
      inputProps,
      puppeteerInstance: browser,
      codec: "h264",
      pixelFormat: "yuv420p",
      crf: 20,
      concurrency: 4,
      outputLocation: join(output, "motion-gallery.mp4"),
    });
    console.log(`Gallery: ${panels.length} panels, ${gallery.durationInFrames} frames`);
  }
  if (values.full) {
    let last = -1;
    const rendered = join(output, "film-raw.mp4");
    await renderMedia({
      serveUrl,
      composition,
      inputProps,
      puppeteerInstance: browser,
      codec: "h264",
      pixelFormat: "yuv420p",
      crf: 19,
      concurrency: 4,
      outputLocation: rendered,
      onProgress: ({ progress }) => {
        const percent = Math.floor(progress * 20) * 5;
        if (percent !== last) {
          last = percent;
          console.log(`Film render ${percent}%`);
        }
      },
    });
    const final = join(output, "buy-now-pay-later.mp4");
    run("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-i",
      rendered,
      "-vf",
      "scale=in_range=full:out_range=tv,format=yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "19",
      "-pix_fmt",
      "yuv420p",
      "-colorspace",
      "bt709",
      "-color_primaries",
      "bt709",
      "-color_trc",
      "bt709",
      "-color_range",
      "tv",
      "-c:a",
      "copy",
      "-movflags",
      "+faststart",
      final,
    ]);
    console.log(`Final film: ${final}`);
  }
} finally {
  await browser.close({ silent: true });
}
