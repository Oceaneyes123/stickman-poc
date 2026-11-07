import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const outputDirectory = "out/characters/hand-refinement";
mkdirSync(outputDirectory, { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
const browser = await openBrowser("chrome");
try {
  const composition = await selectComposition({
    serveUrl,
    id: "CharacterStudy",
    puppeteerInstance: browser,
  });
  for (const [name, frame] of [
    ["hero", 60],
    ["expressions", 180],
    ["poses", 300],
    ["actions", 480],
    ["anticipation", 426],
    ["pose-blend", 432],
  ] as const) {
    await renderStill({
      serveUrl,
      composition,
      puppeteerInstance: browser,
      frame,
      scale: ["hero", "expressions", "poses", "actions"].includes(name) ? 2 : 1,
      output: `${outputDirectory}/${name}.png`,
    });
    console.log(`Saved ${outputDirectory}/${name}.png`);
  }
} finally {
  await browser.close({ silent: true });
}
