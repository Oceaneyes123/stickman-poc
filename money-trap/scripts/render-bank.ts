import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const review = process.argv.includes("--movement");
const name = review ? "movement-review" : "bank-example";
mkdirSync(`out/${name}`, { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
const browser = await openBrowser("chrome");
try {
  const composition = await selectComposition({
    serveUrl,
    id: review ? "MovementReview" : "BankExample",
    puppeteerInstance: browser,
  });
  if (process.argv.includes("--stills")) {
    for (const frame of review
      ? [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 149]
      : [
          0, 30, 65, 89, 90, 108, 120, 132, 149, 150, 180, 207, 225, 240, 249,
          250, 265, 278, 299,
        ]) {
      await renderStill({
        serveUrl,
        composition,
        puppeteerInstance: browser,
        frame,
        scale: 0.5,
        output: `out/${name}/frame-${String(frame).padStart(3, "0")}.png`,
      });
    }
    console.log(`${name} keyframes saved.`);
  } else {
    await renderMedia({
      serveUrl,
      composition,
      puppeteerInstance: browser,
      codec: "h264",
      outputLocation: `out/${name}.mp4`,
      crf: 18,
      pixelFormat: "yuv420p",
      colorSpace: "bt709",
      imageFormat: "png",
      concurrency: 4,
    });
    console.log(`Rendered out/${name}.mp4`);
  }
} finally {
  await browser.close({ silent: true });
}
