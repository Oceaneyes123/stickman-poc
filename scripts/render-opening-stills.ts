import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { parseArgs } from "node:util";
import {
  openingCameras,
  openingShots,
} from "../src/storyboard/openingShots.ts";

const { values } = parseArgs({ options: { out: { type: "string" } } });
const output = resolve(
  values.out ?? "out/001-lifestyle-creep/s01-s06-stills-v5",
);
if (existsSync(join(output, "index.json")))
  throw new Error(
    "Draft already exists; choose a new --out directory to preserve it",
  );
const cues = JSON.parse(
  readFileSync(
    "out/001-lifestyle-creep/narration/timing/cues.draft.json",
    "utf8",
  ),
) as { cues: { id: string }[] };
for (const shot of openingShots)
  if (!cues.cues.some((cue) => cue.id === shot.cue))
    throw new Error(`Missing source cue ${shot.cue}`);
mkdirSync(output, { recursive: true });
const serveUrl = await bundle({
  entryPoint: resolve("src/storyboard/OpeningStudyRoot.tsx"),
});
const browser = await openBrowser("chrome");
try {
  const hashes = new Set<string>();
  for (const shot of openingShots) {
    const inputProps = { shot: shot.id };
    const composition = await selectComposition({
      serveUrl,
      id: "OpeningSceneStudy",
      inputProps,
      puppeteerInstance: browser,
    });
    await renderStill({
      serveUrl,
      composition,
      inputProps,
      puppeteerInstance: browser,
      frame: 60,
      scale: 0.5,
      output: join(output, `${shot.id}.png`),
    });
    const hash = createHash("sha256")
      .update(readFileSync(join(output, `${shot.id}.png`)))
      .digest("hex");
    if (hashes.has(hash))
      throw new Error(
        `Duplicate rendered shot: ${shot.id}; inspect composition props before continuing`,
      );
    hashes.add(hash);
    console.log(`Saved ${shot.id}.png`);
  }
  writeFileSync(
    join(output, "index.json"),
    JSON.stringify(
      {
        reviewOnly: true,
        animated: false,
        width: 960,
        height: 540,
        shots: openingShots.map((shot) => ({
          ...shot,
          camera: openingCameras[shot.id],
        })),
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  await browser.close({ silent: true });
}
