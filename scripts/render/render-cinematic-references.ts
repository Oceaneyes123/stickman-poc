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
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  compileDirection,
  type ReferenceDirection,
} from "../../src/animation/direction.ts";
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
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
};
const { values } = parseArgs({
  options: { out: { type: "string" }, stills: { type: "boolean" } },
});
const output = resolve(
  values.out ?? "out/001-lifestyle-creep/cinematic-references-v1",
);
if (existsSync(output))
  throw new Error("Choose a new --out directory to preserve prior packets");
const source = resolve("out/001-lifestyle-creep/narration"),
  audio = join(source, "narration.wav");
const timing = json(join(source, "timing/cues.draft.json")),
  words = json(join(source, "timing/words.draft.json"));
const manifest = json(join(source, "manifest.json"));
const scriptHash = hash("videos/001-lifestyle-creep/narration.txt"),
  sourceAudioHash = hash(audio);
if (
  !manifest.complete ||
  manifest.sampleRate !== 48000 ||
  manifest.scriptHash !== scriptHash ||
  timing.scriptHash !== scriptHash ||
  words.scriptHash !== scriptHash ||
  timing.sourceAudioSha256 !== sourceAudioHash ||
  words.sourceAudioSha256 !== sourceAudioHash
)
  throw new Error("Source narration/timing provenance is stale");
for (const lock of ["run.lock", "timing/run.lock"])
  if (existsSync(join(source, lock)))
    throw new Error("Narration/timing is being regenerated");
const planPath = "videos/001-lifestyle-creep/cinematic-directions.json";
const specs = json(planPath).references as ReferenceDirection[];
if (specs.length !== 3 || new Set(specs.map((s) => s.id)).size !== 3)
  throw new Error("Expected exactly three cinematic references");
const publicDir = join(output, "public");
mkdirSync(join(publicDir, "fonts"), { recursive: true });
copyFileSync("public/fonts/Inter.ttf", join(publicDir, "fonts/Inter.ttf"));
const sequences = specs.map((spec) => {
  const cue = (id: string) => {
    const value = timing.cues.find((c: Cue) => c.id === id) as Cue | undefined;
    if (!value) throw new Error(`Missing source cue ${id}`);
    return value;
  };
  const startSample = Math.round(cue(spec.startCue).startMs * 48),
    endSample = Math.round(cue(spec.endCue).startMs * 48);
  const target = join(publicDir, `${spec.id}.wav`);
  run("ffmpeg", [
    "-v",
    "error",
    "-xerror",
    "-i",
    audio,
    "-af",
    `atrim=start_sample=${startSample}:end_sample=${endSample},asetpts=PTS-STARTPTS`,
    "-ar",
    "48000",
    "-ac",
    "1",
    "-c:a",
    "pcm_s16le",
    target,
  ]);
  const metadata = JSON.parse(
    run("ffprobe", ["-v", "error", "-show_streams", "-of", "json", target]),
  );
  const durationMs =
    (Number(metadata.streams[0].duration_ts) /
      Number(metadata.streams[0].sample_rate)) *
    1000;
  const sequence = compileDirection(
    spec,
    timing.cues,
    words.words,
    { scriptHash, audioHash: hash(target) },
    durationMs,
  );
  return { sequence, startSample, endSample, audioHash: hash(target) };
});
writeFileSync(
  join(publicDir, "directions.json"),
  JSON.stringify(
    sequences.map((s) => s.sequence),
    null,
    2,
  ) + "\n",
);
writeFileSync(
  join(output, "source.json"),
  JSON.stringify(
    {
      scriptHash,
      sourceAudioHash,
      planHash: hash(planPath),
      cueHash: hash(join(source, "timing/cues.draft.json")),
      wordHash: hash(join(source, "timing/words.draft.json")),
      sourceTimingReviewed: timing.timingReviewed,
      sourceListeningReviewed: timing.listeningReviewed,
      mode: "Existing user-accepted ASR cues; no source alignment or listening flag changed",
      clips: sequences.map(({ sequence, ...clip }) => ({
        id: sequence.id,
        ...clip,
      })),
    },
    null,
    2,
  ) + "\n",
);
console.log(`Prepared three narration excerpts in ${publicDir}`);
const serveUrl = await bundle({
  entryPoint: resolve("src/storyboard/CinematicRoot.tsx"),
  publicDir,
});
const browser = await openBrowser("chrome");
const compositionIds: Record<string, string> = {
  apartment: "ReferenceApartment",
  "raise-illusion": "ReferenceRaiseIllusion",
  comparison: "ReferenceComparison",
};
try {
  for (const { sequence } of sequences) {
    const directory = join(output, sequence.id);
    mkdirSync(join(directory, "frames"), { recursive: true });
    const inputProps = { referenceId: sequence.id, sequence };
    const composition = await selectComposition({
      serveUrl,
      id: compositionIds[sequence.id],
      inputProps,
      puppeteerInstance: browser,
    });
    const preview = join(directory, "preview.png");
    await renderStill({
      serveUrl,
      composition,
      inputProps,
      puppeteerInstance: browser,
      frame: 0,
      scale: 0.5,
      output: preview,
    });
    run("python", [
      "-c",
      "from PIL import Image;import sys;h=Image.open(sys.argv[1]).convert('L').histogram();assert sum(h[:120])>200,'Foreground is missing or covered by the backdrop'",
      preview,
    ]);
    if (!values.stills) {
      let last = -20;
      await renderMedia({
        serveUrl,
        composition,
        inputProps,
        puppeteerInstance: browser,
        codec: "h264",
        audioCodec: "aac",
        pixelFormat: "yuv420p",
        colorSpace: "bt709",
        imageFormat: "png",
        crf: 18,
        concurrency: 4,
        outputLocation: join(directory, `${sequence.id}.mp4`),
        onProgress: ({ progress }) => {
          const percent = Math.floor(progress * 100);
          if (percent >= last + 20) {
            last = percent;
            console.log(`${sequence.id}: ${percent}%`);
          }
        },
      });
    }
    const frames = new Set([0, sequence.timeline.durationInFrames - 1]);
    for (const beat of sequence.beats) {
      for (const frame of [
        beat.startFrame - 1,
        beat.startFrame,
        Math.round((beat.startFrame + beat.endFrame) / 2),
        beat.endFrame,
      ])
        if (frame >= 0 && frame < sequence.timeline.durationInFrames)
          frames.add(frame);
    }
    const selected = [...frames].sort((a, b) => a - b);
    for (const frame of selected)
      await renderStill({
        serveUrl,
        composition,
        inputProps,
        puppeteerInstance: browser,
        frame,
        scale: 0.5,
        output: join(
          directory,
          "frames",
          `${String(frame).padStart(5, "0")}.png`,
        ),
      });
    writeFileSync(
      join(directory, "direction.json"),
      JSON.stringify(sequence, null, 2) + "\n",
    );
    const beatLabels = selected.map((frame) => ({
      frame,
      beats: sequence.beats
        .filter((b) => frame >= b.startFrame && frame <= b.endFrame)
        .map((b) => b.id),
    }));
    writeFileSync(
      join(directory, "frame-index.json"),
      JSON.stringify(beatLabels, null, 2) + "\n",
    );
    if (!values.stills) {
      const movie = join(directory, `${sequence.id}.mp4`);
      run("ffmpeg", ["-v", "error", "-xerror", "-i", movie, "-f", "null", "-"]);
      const probe = JSON.parse(
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
      const video = probe.streams.find(
          (s: { codec_type: string }) => s.codec_type === "video",
        ),
        speech = probe.streams.find(
          (s: { codec_type: string }) => s.codec_type === "audio",
        );
      if (
        video?.codec_name !== "h264" ||
        video.width !== 1920 ||
        video.height !== 1080 ||
        video.r_frame_rate !== "30/1" ||
        video.pix_fmt !== "yuv420p" ||
        Number(video.nb_frames) !== sequence.timeline.durationInFrames ||
        speech?.codec_name !== "aac"
      )
        throw new Error(`Invalid export metadata for ${sequence.id}`);
      writeFileSync(
        join(directory, "verification.json"),
        JSON.stringify(
          {
            fullDecodePassed: true,
            creativeApproved: false,
            listeningReviewed: false,
            metadata: probe,
          },
          null,
          2,
        ) + "\n",
      );
    }
    console.log(
      `${sequence.id}: ${composition.durationInFrames} frames; ${selected.length} boundary/action samples saved`,
    );
  }
} finally {
  await browser.close({ silent: true });
}
run("python", ["scripts/review/cinematic-contact-sheets.py", output]);
writeFileSync(
  join(output, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cinematic reference review</title><style>body{margin:32px auto;padding:0 24px;max-width:1280px;background:#14243a;color:#f8fafc;font:18px/1.5 system-ui}video,img{width:100%;height:auto}article{margin:56px 0}a{color:#f3be58}h1{font-size:32px}h2{font-size:26px}</style><h1>The Money Trap · cinematic reference review</h1><p>Three reference sequences only. Existing Jeremy narration; creative and listening approval pending.</p>${sequences.map(({ sequence }) => `<article><h2>${sequence.title}</h2>${values.stills ? "" : `<video controls preload="metadata" src="${sequence.id}/${sequence.id}.mp4"></video>`}<p><a href="${sequence.id}/contact-sheet.png">Action and boundary contact sheet</a> · <a href="${sequence.id}/direction.json">Compiled direction beats</a></p><img loading="lazy" src="${sequence.id}/hero-sheet.png" alt="Representative frames from ${sequence.title}"></article>`).join("")}</html>`,
);
console.log(`Saved reference review: ${join(output, "index.html")}`);
