import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const gallery = process.argv.includes("--gallery");
const walking = process.argv.includes("--walking");
const review = walking || process.argv.includes("--movement");
const debug = review && process.argv.includes("--debug");
const inputProps = review ? { debug } : {};
const name = gallery
  ? "component-gallery"
  : walking
    ? `walking-arm-correction${debug ? "-debug" : ""}`
    : review
      ? `movement-review-arm-correction${debug ? "-debug" : ""}`
      : "bank-example";
mkdirSync(`out/${name}`, { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
const browser = await openBrowser("chrome");
try {
  const composition = await selectComposition({
    serveUrl,
    id: gallery
      ? "ComponentGallery"
      : walking
        ? "WalkingMechanics"
        : review
          ? "MovementReview"
          : "BankExample",
    puppeteerInstance: browser,
    inputProps,
  });
  if (process.argv.includes("--stills")) {
    for (const frame of gallery
      ? [0, 30, 60, 90, 150, 240, 390, 420, 450, 630, 765, 855, 945, 1045]
      : walking
        ? [0, 16, 24, 40, 50, 60, 80, 100, 120, 160, 200, 252, 272, 299]
        : review
          ? [
              0, 12, 24, 36, 72, 120, 160, 180, 210, 252, 299, 310, 318, 328,
              340, 370, 395, 420, 440, 448, 456, 465, 510, 550, 599,
            ]
          : [
              0, 30, 65, 89, 90, 108, 120, 132, 149, 150, 180, 207, 225, 240,
              249, 250, 265, 278, 299,
            ]) {
      await renderStill({
        serveUrl,
        composition,
        puppeteerInstance: browser,
        frame,
        inputProps,
        scale: 0.5,
        output: `out/${name}/frame-${String(frame).padStart(3, "0")}.png`,
      });
    }
    console.log(`${name} keyframes saved.`);
  } else {
    await renderMedia({
      serveUrl,
      composition,
      inputProps,
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
