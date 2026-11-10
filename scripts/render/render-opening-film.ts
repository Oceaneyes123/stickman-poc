import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  compileOpening,
  type OpeningPlan,
} from "../../src/storyboard/openingTiming.ts";
import type { Cue } from "../../src/timeline/types.ts";
const hash = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const run = (command: string, args: string[]) => {
  const result = spawnSync(command, args, {
    windowsHide: true,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command}: ${result.stderr}`);
  return result.stdout;
};
const { values } = parseArgs({ options: { out: { type: "string" } } });
const output = resolve(
  values.out ?? "out/001-lifestyle-creep/opening-animation-v1",
);
if (existsSync(output))
  throw new Error(
    "Output directory exists; choose a new --out directory to preserve prior reviews",
  );
const directory = resolve("out/001-lifestyle-creep/narration");
const timing = json(join(directory, "timing/cues.draft.json"));
const words = json(join(directory, "timing/words.draft.json"));
const manifest = json(join(directory, "manifest.json"));
const planPath = "videos/001-lifestyle-creep/opening.storyboard.json";
const plan = json(planPath) as OpeningPlan;
const scriptHash = hash("videos/001-lifestyle-creep/narration.txt");
const sourceHash = hash(join(directory, "narration.wav"));
if (
  !manifest.complete ||
  timing.scriptHash !== scriptHash ||
  words.scriptHash !== scriptHash ||
  manifest.scriptHash !== scriptHash ||
  timing.sourceAudioSha256 !== sourceHash ||
  words.sourceAudioSha256 !== sourceHash
)
  throw new Error(
    "Narration/timing provenance is stale; regenerate timing before rendering",
  );
for (const lock of ["run.lock", "timing/run.lock"])
  if (existsSync(join(directory, lock)))
    throw new Error("Narration or timing generation is running");
if (manifest.sampleRate !== 48000) throw new Error("Expected 48 kHz narration");
for (let i = 0; i < 2; i++) {
  const segment = manifest.segments[i];
  if (
    segment?.file !== `audio-${i + 1}.wav` ||
    hash(join(directory, segment.file)) !== segment.audioHash
  )
    throw new Error("Paragraph audio has changed");
}
const endCue = timing.cues.find((cue: Cue) => cue.id === plan.endCue) as
  | Cue
  | undefined;
if (!endCue) throw new Error(`Missing cutoff cue ${plan.endCue}`);
const samples = Math.round(endCue.startMs * 48);
const stage = mkdtempSync(join(tmpdir(), "opening-film-"));
if (
  dirname(stage) !== resolve(tmpdir()) ||
  !stage.startsWith(join(resolve(tmpdir()), "opening-film-"))
)
  throw new Error("Unexpected staging path");
try {
  mkdirSync(output, { recursive: true });
  const publicDir = join(stage, "public");
  mkdirSync(join(publicDir, "fonts"), { recursive: true });
  copyFileSync("public/fonts/Inter.ttf", join(publicDir, "fonts/Inter.ttf"));
  const audio = join(publicDir, "opening.wav");
  run("ffmpeg", [
    "-v",
    "error",
    "-xerror",
    "-i",
    join(directory, "audio-1.wav"),
    "-i",
    join(directory, "audio-2.wav"),
    "-filter_complex",
    `[0:a][1:a]concat=n=2:v=0:a=1,atrim=end_sample=${samples},asetpts=PTS-STARTPTS[a]`,
    "-map",
    "[a]",
    "-ar",
    "48000",
    "-ac",
    "1",
    "-c:a",
    "pcm_s16le",
    audio,
  ]);
  const probe = JSON.parse(
    run("ffprobe", [
      "-v",
      "error",
      "-show_streams",
      "-show_format",
      "-of",
      "json",
      audio,
    ]),
  );
  const durationMs = Number(probe.format.duration) * 1000;
  const audioHash = hash(audio);
  const timeline = compileOpening(
    plan,
    timing.cues,
    words.words,
    { scriptHash, audioHash },
    durationMs,
  );
  copyFileSync(audio, join(output, "opening.wav"));
  const inputProps = { timeline, plan };
  writeFileSync(
    join(output, "timeline.json"),
    JSON.stringify(inputProps, null, 2) + "\n",
  );
  const serveUrl = await bundle({
    entryPoint: resolve("src/storyboard/OpeningFilm.tsx"),
    publicDir,
    outDir: join(stage, "bundle"),
  });
  const browser = await openBrowser("chrome");
  try {
    const composition = await selectComposition({
      serveUrl,
      id: "OpeningFilm",
      inputProps,
      puppeteerInstance: browser,
    });
    console.log(
      `Rendering S01–S06: ${durationMs / 1000}s, ${composition.durationInFrames} frames`,
    );
    let last = -10;
    await renderMedia({
      serveUrl,
      composition,
      inputProps,
      puppeteerInstance: browser,
      codec: "h264",
      audioCodec: "aac",
      pixelFormat: "yuv420p",
      colorSpace: "bt709",
      outputLocation: join(output, "s01-s06.mp4"),
      imageFormat: "png",
      crf: 18,
      concurrency: 4,
      onProgress: ({ progress }) => {
        const percent = Math.floor(progress * 100);
        if (percent >= last + 10) {
          console.log(`Render ${percent}%`);
          last = percent;
        }
      },
    });
    mkdirSync(join(output, "frames"));
    for (const scene of timeline.scenes) {
      for (const [label, frame] of [
        ["start", scene.from],
        ["hold", scene.from + scene.durationInFrames - 1],
      ] as const) {
        await renderStill({
          serveUrl,
          composition,
          inputProps,
          puppeteerInstance: browser,
          frame,
          scale: 0.5,
          output: join(output, "frames", `${scene.id}-${label}.png`),
        });
      }
    }
    for (const event of timeline.events) {
      await renderStill({
        serveUrl,
        composition,
        inputProps,
        puppeteerInstance: browser,
        frame: Math.min(event.from + 15, composition.durationInFrames - 1),
        scale: 0.5,
        output: join(output, "frames", `event-${event.id}.png`),
      });
    }
  } finally {
    await browser.close({ silent: true });
  }
  const movie = join(output, "s01-s06.mp4");
  run("ffmpeg", ["-v", "error", "-xerror", "-i", movie, "-f", "null", "-"]);
  const metadata = JSON.parse(
    run("ffprobe", [
      "-v",
      "error",
      "-show_streams",
      "-show_format",
      "-of",
      "json",
      movie,
    ]),
  );
  const video = metadata.streams.find(
    (stream: { codec_type: string }) => stream.codec_type === "video",
  );
  const speech = metadata.streams.find(
    (stream: { codec_type: string }) => stream.codec_type === "audio",
  );
  if (
    !video ||
    video.codec_name !== "h264" ||
    video.width !== 1920 ||
    video.height !== 1080 ||
    video.pix_fmt !== "yuv420p" ||
    video.r_frame_rate !== "30/1" ||
    Number(video.nb_frames) !== timeline.durationInFrames ||
    speech?.codec_name !== "aac" ||
    Math.abs(
      Number(metadata.format.duration) - timeline.durationInFrames / 30,
    ) >
      1 / 30
  )
    throw new Error("Rendered media does not match the production settings");
  writeFileSync(
    join(output, "verification.json"),
    JSON.stringify(
      {
        reviewOnly: true,
        humanMotionReviewed: false,
        listeningReviewed: false,
        timingBasis:
          "Existing user-accepted draft ASR cues; source review flags preserved",
        sourceAudioSha256: sourceHash,
        audioHash,
        scriptHash,
        planHash: hash(planPath),
        cueHash: hash(join(directory, "timing/cues.draft.json")),
        wordHash: hash(join(directory, "timing/words.draft.json")),
        sourceFiles: manifest.segments
          .slice(0, 2)
          .map((s: { file: string; audioHash: string }) => ({
            file: s.file,
            audioHash: s.audioHash,
          })),
        samples,
        durationMs,
        fullDecodePassed: true,
        metadata,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`Saved ${movie}; full decode passed`);
} finally {
  rmSync(stage, { recursive: true });
}
