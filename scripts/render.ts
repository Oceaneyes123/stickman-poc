import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Timeline } from "../src/timeline/types.ts";
const generated = JSON.parse(
  readFileSync("src/timeline/generated.json", "utf8"),
) as { timeline: Timeline; audioPresent: boolean };
const gallery = process.argv.includes("--gallery");
const stills = process.argv.includes("--stills");
const dev = process.argv.includes("--dev");
mkdirSync("out", { recursive: true });
console.log("Bundling local Remotion composition…");
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
const browser = await openBrowser("chrome");
try {
  const composition = await selectComposition({
    serveUrl,
    id: gallery ? "ComponentGallery" : "MoneyTrapPOC",
    puppeteerInstance: browser,
  });
  if (stills) {
    mkdirSync("out/stills", { recursive: true });
    const frames = [
      ...new Set(
        [
          0,
          ...generated.timeline.scenes.flatMap((scene) => [
            scene.from - 1,
            scene.from,
            scene.from + 1,
            scene.from +
              Math.min(180, Math.floor(scene.durationInFrames * 0.7)),
            scene.from + scene.durationInFrames - 1,
          ]),
        ].filter((frame) => frame >= 0),
      ),
    ].sort((a, b) => a - b);
    for (const frame of frames)
      await renderStill({
        serveUrl,
        composition,
        puppeteerInstance: browser,
        frame,
        output: `out/stills/poc-${String(frame).padStart(4, "0")}.png`,
        scale: 0.5,
      });
    const galleryComposition = await selectComposition({
      serveUrl,
      id: "ComponentGallery",
      puppeteerInstance: browser,
    });
    const galleryFrames = [
      0, 30, 60, 90, 150, 240, 390, 420, 450, 630, 765, 855, 945, 1045,
    ];
    for (const frame of galleryFrames)
      await renderStill({
        serveUrl,
        composition: galleryComposition,
        puppeteerInstance: browser,
        frame,
        output: `out/stills/gallery-${String(frame).padStart(4, "0")}.png`,
        scale: 0.5,
      });
    writeFileSync(
      "out/stills/manifest.json",
      JSON.stringify({ poc: frames, gallery: galleryFrames }, null, 2),
    );
    console.log(
      `Saved ${frames.length} POC boundary/key frames and ${galleryFrames.length} gallery frames.`,
    );
  } else {
    const outputLocation = gallery
      ? "out/component-gallery.mp4"
      : generated.audioPresent
        ? `out/money-trap-poc${dev ? "-dev" : ""}.mp4`
        : `out/money-trap-poc-silent-timing${dev ? "-dev" : ""}.mp4`;
    let lastProgress = -1;
    await renderMedia({
      serveUrl,
      composition,
      puppeteerInstance: browser,
      codec: "h264",
      outputLocation,
      scale: dev ? 0.5 : 1,
      crf: dev ? 26 : 18,
      pixelFormat: "yuv420p",
      colorSpace: "bt709",
      imageFormat: dev ? "jpeg" : "png",
      concurrency: 4,
      onProgress: ({ progress }) => {
        const percent = Math.floor(progress * 10) * 10;
        if (percent !== lastProgress) {
          console.log(`Render ${percent}%`);
          lastProgress = percent;
        }
      },
    });
    console.log(`Rendered ${outputLocation}`);
  }
} finally {
  await browser.close({ silent: true });
}
