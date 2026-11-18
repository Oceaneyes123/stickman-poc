import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { validateManifestFiles } from "../../src/documentary/assets/nodeValidator.ts";
import type { AssetManifest } from "../../src/documentary/assets/schema.ts";
import { runDocumentaryQa } from "../../src/documentary/qa.ts";
import type { DocumentaryStoryboard } from "../../src/documentary/timeline.ts";
import type { CueFile } from "../../src/timeline/types.ts";

const { values } = parseArgs({
  options: {
    out: { type: "string" },
    "stills-only": { type: "boolean" },
    skip: { type: "string" },
  },
});

const outDir = resolve(values.out ?? "out/demo-bnpl-feels-cheaper");
const stillsDir = join(outDir, "stills");
const galleryDir = join(outDir, "gallery");
mkdirSync(stillsDir, { recursive: true });
mkdirSync(galleryDir, { recursive: true });

const run = (cmd: string, args: string[]) => {
  const result = spawnSync(cmd, args, { encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed:\n${result.stderr}\n${result.stdout}`);
  }
  return result.stdout;
};

// Ensure deterministic local sample context clip exists
const sampleVideo = resolve("public/documentary/shopping-context.mp4");
if (!existsSync(sampleVideo)) {
  mkdirSync(resolve("public/documentary"), { recursive: true });
  run("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-f",
    "lavfi",
    "-i",
    "color=c=#1B304C:s=1920x1080:r=30:d=6",
    "-vf",
    "drawbox=x=0:y=0:w=1920:h=1080:color=#14243A@0.5:t=fill,drawbox=x='180+t*90':y=140:w=420:h=800:color=#24374C@0.85:t=fill,drawbox=x='740+t*60':y=220:w=460:h=680:color=#2F4865@0.75:t=fill,drawbox=x='1320-t*40':y=180:w=380:h=720:color=#F3BE58@0.12:t=fill",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-t",
    "6",
    sampleVideo,
  ]);
}

const sourceDir = resolve("videos/demo-bnpl-feels-cheaper");
const cueFile = JSON.parse(readFileSync(join(sourceDir, "cues.json"), "utf8")) as CueFile;
const storyboard = JSON.parse(
  readFileSync(join(sourceDir, "storyboard.json"), "utf8"),
) as DocumentaryStoryboard;
const manifest = JSON.parse(
  readFileSync(join(sourceDir, "asset-manifest.json"), "utf8"),
) as AssetManifest;

const { report, compiled } = runDocumentaryQa({
  cueFile,
  storyboard,
  manifest,
  mode: "delivery",
});
const fileReport = validateManifestFiles(manifest, { mode: "delivery" });
const qaCombined = {
  ...report,
  manifestFiles: fileReport,
  passed: report.passed && fileReport.valid,
};
writeFileSync(
  join(outDir, "qa-report.json"),
  JSON.stringify(qaCombined, null, 2) + "\n",
  "utf8",
);
if (!qaCombined.passed) {
  throw new Error(`Documentary QA failed; inspect ${join(outDir, "qa-report.json")}`);
}
console.log(
  `QA passed: ${compiled.scenes.length} scenes, ${compiled.durationInFrames} frames (${compiled.timingStatus})`,
);

const transcodeTvRange = (rawPath: string, finalPath: string) => {
  run("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-i",
    rawPath,
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
    "-an",
    "-movflags",
    "+faststart",
    finalPath,
  ]);
  rmSync(rawPath, { force: true });
};

const serveUrl = await bundle({
  entryPoint: resolve("src/index.ts"),
  publicDir: resolve("public"),
});
const browser = await openBrowser("chrome");

try {
  const demoComp = await selectComposition({
    serveUrl,
    id: "BnplFeelsCheaperDemo",
    puppeteerInstance: browser,
  });

  for (const scene of compiled.scenes) {
    const mid = scene.from + Math.floor(scene.durationInFrames * 0.62);
    await renderStill({
      serveUrl,
      composition: demoComp,
      puppeteerInstance: browser,
      frame: mid,
      scale: 0.5,
      output: join(stillsDir, `${scene.id.toLowerCase()}.png`),
    });
    if (scene.from > 0) {
      await renderStill({
        serveUrl,
        composition: demoComp,
        puppeteerInstance: browser,
        frame: scene.from - 1,
        scale: 0.5,
        output: join(stillsDir, `b${scene.id.slice(1)}-prev.png`),
      });
      await renderStill({
        serveUrl,
        composition: demoComp,
        puppeteerInstance: browser,
        frame: scene.from,
        scale: 0.5,
        output: join(stillsDir, `b${scene.id.slice(1)}-next.png`),
      });
    }
  }
  console.log(`Rendered ${compiled.scenes.length} scene stills + cut boundaries`);

  const galleryComp = await selectComposition({
    serveUrl,
    id: "DocumentaryGallery",
    puppeteerInstance: browser,
  });
  const panelCount = Math.round(galleryComp.durationInFrames / 90);
  for (let i = 0; i < panelCount; i++) {
    await renderStill({
      serveUrl,
      composition: galleryComp,
      puppeteerInstance: browser,
      frame: i * 90 + 54,
      scale: 0.5,
      output: join(galleryDir, `p${String(i + 1).padStart(2, "0")}.png`),
    });
  }
  console.log(`Rendered ${panelCount} gallery panel stills`);

  const mixedComp = await selectComposition({
    serveUrl,
    id: "DocumentaryMixedMediaShowcase",
    puppeteerInstance: browser,
  });
  await renderStill({
    serveUrl,
    composition: mixedComp,
    puppeteerInstance: browser,
    frame: 110,
    scale: 0.5,
    output: join(stillsDir, "mixed-showcase.png"),
  });

  if (!values["stills-only"]) {
    const rawDemo = join(outDir, "bnpl-feels-cheaper-raw.mp4");
    const finalDemo = join(outDir, "bnpl-feels-cheaper.mp4");
    await renderMedia({
      serveUrl,
      composition: demoComp,
      puppeteerInstance: browser,
      codec: "h264",
      pixelFormat: "yuv420p",
      crf: 19,
      concurrency: 4,
      outputLocation: rawDemo,
    });
    transcodeTvRange(rawDemo, finalDemo);
    console.log(`Rendered ${finalDemo}`);

    const rawGallery = join(outDir, "documentary-gallery-raw.mp4");
    const finalGallery = join(outDir, "documentary-gallery.mp4");
    await renderMedia({
      serveUrl,
      composition: galleryComp,
      puppeteerInstance: browser,
      codec: "h264",
      pixelFormat: "yuv420p",
      crf: 20,
      concurrency: 4,
      outputLocation: rawGallery,
    });
    transcodeTvRange(rawGallery, finalGallery);
    console.log(`Rendered ${finalGallery}`);

    const rawMixed = join(outDir, "mixed-media-showcase-raw.mp4");
    const finalMixed = join(outDir, "mixed-media-showcase.mp4");
    await renderMedia({
      serveUrl,
      composition: mixedComp,
      puppeteerInstance: browser,
      codec: "h264",
      pixelFormat: "yuv420p",
      crf: 20,
      concurrency: 4,
      outputLocation: rawMixed,
    });
    transcodeTvRange(rawMixed, finalMixed);
    console.log(`Rendered ${finalMixed}`);
  }
} finally {
  await browser.close({ silent: true });
}

run("python", [
  "scripts/documentary/contact-sheets.py",
  "--stills-dir",
  stillsDir,
  "--gallery-dir",
  galleryDir,
  "--out-dir",
  outDir,
]);

if (!values["stills-only"]) {
  run("python", [
    "scripts/review/qa.py",
    join(outDir, "bnpl-feels-cheaper.mp4"),
    "--frames",
    String(compiled.durationInFrames),
  ]);
  run("python", [
    "scripts/review/qa.py",
    join(outDir, "documentary-gallery.mp4"),
    "--frames",
    "1440",
  ]);
  run("python", [
    "scripts/review/qa.py",
    join(outDir, "mixed-media-showcase.mp4"),
    "--frames",
    "180",
  ]);
}
