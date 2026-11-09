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
import { dirname, join, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { reviewCues } from "../src/review/timing.ts";

const hash = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const { values } = parseArgs({
  options: {
    "audio-dir": { type: "string" },
    out: { type: "string" },
    help: { type: "boolean" },
  },
});
if (values.help) {
  console.log(
    "npm run narrate:review -- --audio-dir <completed narration directory> [--out <review.mp4>]\nRenders only audio-1.wav and audio-2.wav, with draft utterance text.",
  );
} else {
  if (!values["audio-dir"]) throw new Error("--audio-dir is required");
  const directory = resolve(values["audio-dir"]);
  const timing = json(join(directory, "timing/cues.draft.json"));
  const manifest = json(join(directory, "manifest.json"));
  const segments = manifest.segments.slice(0, 2);
  if (
    segments.length !== 2 ||
    manifest.complete !== true ||
    timing.scriptHash !== manifest.scriptHash ||
    timing.sourceAudioSha256 !== hash(join(directory, "narration.wav"))
  )
    throw new Error(
      "Timing/manifest provenance is stale or narration is incomplete; rerun timing first",
    );
  if (
    existsSync(join(directory, "run.lock")) ||
    existsSync(join(directory, "timing/run.lock"))
  )
    throw new Error(
      "Narration or timing runner is active; wait for it to finish",
    );
  for (const [index, segment] of segments.entries()) {
    if (
      segment.file !== `audio-${index + 1}.wav` ||
      hash(join(directory, segment.file)) !== segment.audioHash ||
      !Number.isInteger(segment.samples) ||
      segment.samples <= 0
    )
      throw new Error(`Invalid paragraph audio: ${segment.file}`);
  }
  if (manifest.sampleRate !== 48000)
    throw new Error("Expected 48 kHz narration");
  const durationMs =
    ((segments[0].samples + segments[1].samples) * 1000) / manifest.sampleRate;
  const inputProps = { durationMs, cues: reviewCues(timing.cues, durationMs) };
  if (!inputProps.cues.length)
    throw new Error("No utterance cues found in the first two audio files");
  const output = resolve(
    values.out ?? join(directory, "timing-review-first-2.mp4"),
  );
  if (!output.endsWith(".mp4")) throw new Error("--out must be an MP4 path");
  mkdirSync(dirname(output), { recursive: true });
  const staging = mkdtempSync(join(tmpdir(), "timing-review-"));
  if (
    dirname(staging) !== resolve(tmpdir()) ||
    !staging.startsWith(join(resolve(tmpdir()), "timing-review-")) ||
    staging.endsWith(sep)
  )
    throw new Error("Unexpected staging directory; cleanup stopped");
  try {
    const publicDir = join(staging, "public");
    mkdirSync(join(publicDir, "fonts"), { recursive: true });
    copyFileSync(
      resolve("public/fonts/Inter.ttf"),
      join(publicDir, "fonts/Inter.ttf"),
    );
    const audio = join(publicDir, "review.wav");
    const result = spawnSync(
      "ffmpeg",
      [
        "-v",
        "error",
        "-xerror",
        "-i",
        join(directory, "audio-1.wav"),
        "-i",
        join(directory, "audio-2.wav"),
        "-filter_complex",
        "[0:a][1:a]concat=n=2:v=0:a=1[a]",
        "-map",
        "[a]",
        "-ar",
        "48000",
        "-ac",
        "1",
        "-c:a",
        "pcm_s16le",
        audio,
      ],
      { windowsHide: true },
    );
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(result.stderr.toString());
    const serveUrl = await bundle({
      entryPoint: resolve("src/review/TimingReview.tsx"),
      publicDir,
      outDir: join(staging, "bundle"),
    });
    const browser = await openBrowser("chrome");
    try {
      const composition = await selectComposition({
        serveUrl,
        id: "TimingReview",
        inputProps,
        puppeteerInstance: browser,
      });
      await renderStill({
        serveUrl,
        composition,
        inputProps,
        puppeteerInstance: browser,
        frame: Math.round((inputProps.cues[0].startMs * 30) / 1000),
        output: output.replace(/\.mp4$/, ".png"),
        scale: 0.5,
      });
      console.log(
        `Rendering first two audio files: ${(durationMs / 1000).toFixed(3)}s, ${inputProps.cues.length} utterances`,
      );
      let lastProgress = -1;
      await renderMedia({
        serveUrl,
        composition,
        inputProps,
        puppeteerInstance: browser,
        codec: "h264",
        audioCodec: "aac",
        pixelFormat: "yuv420p",
        colorSpace: "bt709",
        outputLocation: output,
        imageFormat: "png",
        crf: 18,
        concurrency: 4,
        onProgress: ({ progress }) => {
          const percent = Math.floor(progress * 100);
          if (percent >= lastProgress + 10) {
            console.log(`Render ${percent}%`);
            lastProgress = percent;
          }
        },
      });
      writeFileSync(
        output.replace(/\.mp4$/, ".json"),
        JSON.stringify(
          {
            reviewOnly: true,
            timingReviewed: false,
            sourceFiles: segments.map(
              (segment: { file: string; audioHash: string }) => ({
                file: segment.file,
                audioHash: segment.audioHash,
              }),
            ),
            timingHash: hash(join(directory, "timing/cues.draft.json")),
            durationMs,
            durationInFrames: composition.durationInFrames,
            cueCount: inputProps.cues.length,
          },
          null,
          2,
        ) + "\n",
      );
      console.log(`Saved ${output}`);
    } finally {
      await browser.close({ silent: true });
    }
  } finally {
    rmSync(staging, { recursive: true });
  }
}
