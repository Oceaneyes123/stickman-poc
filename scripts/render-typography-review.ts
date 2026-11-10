import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";
import {
  compileTypography,
  type DraftTiming,
  type TypographyPlan,
  type WordTiming,
} from "../src/typography/plan.ts";
import { parseStoryboard } from "../src/storyboard/remainingShots.ts";
import {
  cinematicStillShots,
  stillDirection,
} from "../src/storyboard/cinematicStillPlan.ts";

const { values } = parseArgs({
  options: {
    out: { type: "string" },
    full: { type: "boolean" },
    "skip-boundaries": { type: "boolean" },
  },
});
const output = resolve(
  values.out ?? "out/001-lifestyle-creep/typography-review-v1",
);
if (existsSync(output))
  throw new Error("Choose a fresh --out folder to preserve earlier reviews");
const read = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8"));
const save = (path: string, value: unknown) =>
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
const hash = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const run = (cmd: string, args: string[]) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", windowsHide: true });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${cmd}: ${r.stderr}`);
  return r.stdout;
};
const source = "videos/001-lifestyle-creep";
const audio = "out/001-lifestyle-creep/narration";
const plan = read<TypographyPlan>(`${source}/typography-plan.json`);
const timing = read<DraftTiming>(`${audio}/timing/cues.draft.json`);
const wordFile = read<{
  words: WordTiming[];
  scriptHash: string;
  sourceAudioSha256: string;
}>(`${audio}/timing/words.draft.json`);
const scriptHash = hash(`${source}/narration.txt`),
  audioHash = hash(`${audio}/narration.wav`);
if (
  timing.scriptHash !== scriptHash ||
  wordFile.scriptHash !== scriptHash ||
  timing.sourceAudioSha256 !== audioHash ||
  wordFile.sourceAudioSha256 !== audioHash
)
  throw new Error("Narration/timing provenance is stale");
for (const file of ["run.lock", "timing/run.lock"])
  if (existsSync(`${audio}/${file}`))
    throw new Error("Narration or timing is being generated");
const measured =
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
if (Math.abs(measured - timing.durationMs) > 1000 / 48000)
  throw new Error("Draft duration differs from measured WAV");
const data = compileTypography(plan, timing, wordFile.words);
if (data.shortHolds.length)
  throw new Error(
    `Typography reading holds are too short: ${data.shortHolds.join(", ")}`,
  );
const board = parseStoryboard(readFileSync(`${source}/storyboard.md`, "utf8"));
if (
  board.length !== 67 ||
  data.panels.length !== 99 ||
  data.timeline.durationInFrames !== Math.round((measured * 30) / 1000)
)
  throw new Error("Episode coverage or duration changed");
mkdirSync(join(output, "public/fonts"), { recursive: true });
mkdirSync(join(output, "images"));
mkdirSync(join(output, "boundaries"));
copyFileSync(`${audio}/narration.wav`, join(output, "public/narration.wav"));
copyFileSync("public/fonts/Inter.ttf", join(output, "public/fonts/Inter.ttf"));
save(join(output, "public/typography-review.json"), data);
save(join(output, "compiled.json"), data);
const checkpoints = new Set<number>();
for (const p of data.panels) {
  checkpoints.add(p.from);
  checkpoints.add(p.until - 1);
}
for (const b of data.beats.filter((b) => b.text.length))
  for (const f of [b.from - 1, b.from, b.from + 15, b.until - 11, b.until - 1])
    checkpoints.add(f);
for (const g of data.gates)
  for (const f of [g.from - 1, g.from, g.from + 18]) checkpoints.add(f);
const frames = [...checkpoints]
  .filter((f) => f >= 0 && f < data.timeline.durationInFrames)
  .sort((a, b) => a - b);
const serveUrl = await bundle({
  entryPoint: resolve("src/storyboard/CinematicStoryboardStudy.tsx"),
  publicDir: join(output, "public"),
});
const browser = await openBrowser("chrome");
try {
  const inputProps = { data };
  const composition = await selectComposition({
    serveUrl,
    id: "TypographyEpisode",
    inputProps,
    puppeteerInstance: browser,
  });
  for (const [i, p] of data.panels.entries()) {
    const active = data.beats.filter(
      (b) =>
        b.sceneId === p.sceneId &&
        b.text.length &&
        b.from >= p.from &&
        b.from < p.until,
    );
    const last = active.at(-1);
    const lastGate = Math.max(
      p.from,
      ...data.gates
        .filter((g) => g.sceneId === p.sceneId && g.from < p.until)
        .map((g) => g.from),
    );
    const lastItem = last?.itemFrames?.at(-1) ?? last?.from ?? p.from;
    const frame = Math.min(
      p.until - 1,
      Math.max(
        p.from + 20,
        last?.mode === "ANIMATED_LIST" ? lastItem + 20 : lastGate + 18,
        last ? Math.min(last.until - 11, lastItem + 20) : p.from + 45,
      ),
    );
    await renderStill({
      serveUrl,
      composition,
      inputProps,
      puppeteerInstance: browser,
      frame,
      scale: 0.5,
      output: join(output, `images/${p.id}.png`),
    });
    if ((i + 1) % 12 === 0) console.log(`Panel stills ${i + 1}/99`);
  }
  if (!values["skip-boundaries"]) {
    for (let i = 0; i < frames.length; i += 4) {
      await Promise.all(
        frames.slice(i, i + 4).map((frame) =>
          renderStill({
            serveUrl,
            composition,
            inputProps,
            puppeteerInstance: browser,
            frame,
            scale: 0.5,
            output: join(
              output,
              `boundaries/${String(frame).padStart(5, "0")}.png`,
            ),
          }),
        ),
      );
      if (i % 80 === 0)
        console.log(
          `Beat/boundary stills ${Math.min(i + 4, frames.length)}/${frames.length}`,
        );
    }
  }
  const packet = {
    reviewOnly: true,
    approved: false,
    videoCreated: Boolean(values.full),
    style: { onScreenText: "Selective cue-linked typography; v6 art baseline" },
    scenes: board.map((s) => ({
      ...s,
      origin: "Selective typography review",
      images: cinematicStillShots
        .filter((p) => p.scene === s.id)
        .map((p) => ({
          file: `images/${p.id}.png`,
          description: p.phase,
          design: stillDirection(p),
        })),
    })),
  };
  save(join(output, "index.json"), packet);
  run("node", [
    "--experimental-strip-types",
    "scripts/assemble-full-storyboard.ts",
    "--design",
    join(output, "index.json"),
    "--out",
    join(output, "review"),
  ]);
  run("python", [
    "scripts/storyboard-contact-sheets.py",
    output,
    "--out",
    join(output, "contact-sheets"),
  ]);
  console.log(
    `Saved all 99 panel designs and ${values["skip-boundaries"] ? 0 : frames.length} beat/boundary frames`,
  );
  if (values.full) {
    let last = -1;
    await renderMedia({
      serveUrl,
      composition,
      inputProps,
      puppeteerInstance: browser,
      codec: "h264",
      pixelFormat: "yuv420p",
      crf: 20,
      concurrency: 4,
      outputLocation: join(output, "typography-episode.mp4"),
      onProgress: ({ progress }) => {
        const percent = Math.floor(progress * 20) * 5;
        if (percent !== last) {
          last = percent;
          console.log(`Episode render ${percent}%`);
        }
      },
    });
    run("ffmpeg", [
      "-v",
      "error",
      "-xerror",
      "-i",
      join(output, "typography-episode.mp4"),
      "-f",
      "null",
      "-",
    ]);
    const metadata = JSON.parse(
      run("ffprobe", [
        "-v",
        "error",
        "-show_streams",
        "-show_format",
        "-of",
        "json",
        join(output, "typography-episode.mp4"),
      ]),
    );
    const v = metadata.streams.find(
      (s: { codec_type: string }) => s.codec_type === "video",
    );
    if (
      v.codec_name !== "h264" ||
      v.pix_fmt !== "yuv420p" ||
      v.width !== 1920 ||
      v.height !== 1080 ||
      v.r_frame_rate !== "30/1" ||
      Number(v.nb_frames) !== data.timeline.durationInFrames
    )
      throw new Error("Output metadata mismatch");
    save(join(output, "media-verification.json"), {
      metadata,
      fullDecodePassed: true,
    });
  }
  save(join(output, "verification.json"), {
    reviewOnly: true,
    creativeApproved: false,
    listeningApproved: false,
    exactSyncClaimed: false,
    timingStatus: data.timingStatus,
    sourceListeningReviewed: timing.listeningReviewed,
    sourceTimingReviewed: timing.timingReviewed,
    scriptHash,
    audioHash,
    planHash: hash(`${source}/typography-plan.json`),
    cueHash: hash(`${audio}/timing/cues.draft.json`),
    wordHash: hash(`${audio}/timing/words.draft.json`),
    scenes: 67,
    panels: 99,
    beats: data.beats.length,
    visualOnly: data.beats.filter((b) => b.mode === "VISUAL_ONLY").length,
    boundaryFrames: values["skip-boundaries"] ? [] : frames,
    durationInFrames: data.timeline.durationInFrames,
    measuredAudioDurationMs: measured,
    fullMovieRendered: Boolean(values.full),
  });
  console.log(`Review ready: ${output}`);
} finally {
  await browser.close({ silent: true });
}
