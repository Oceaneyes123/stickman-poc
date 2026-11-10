import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseArgs } from "node:util";
import {
  cinematicStillShots,
  stillDirection,
  type StillDirection,
} from "../../src/storyboard/cinematicStillPlan.ts";
import { parseStoryboard } from "../../src/storyboard/remainingShots.ts";

const { values } = parseArgs({ options: { out: { type: "string" } } });
const output = resolve(
  values.out ?? "out/001-lifestyle-creep/storyboard-design-v6",
);
if (existsSync(output))
  throw new Error("Choose a fresh --out folder to preserve earlier packets");
const source = readFileSync("videos/001-lifestyle-creep/storyboard.md", "utf8"),
  board = parseStoryboard(source);
const narration = readFileSync(
  "videos/001-lifestyle-creep/narration.txt",
  "utf8",
).replace(/\s+/g, " ");
const hash = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const run = (command: string, args: string[]) => {
  const result = spawnSync(command, args, {
    windowsHide: true,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
};
if (board.length !== 67)
  throw new Error("Expected the complete 67-scene storyboard");
for (const scene of board)
  if (!narration.includes(scene.narration.replace(/\s+/g, " ")))
    throw new Error(`Source narration mismatch ${scene.id}`);
mkdirSync(join(output, "images"), { recursive: true });
const images = new Map<
  string,
  { file: string; description: string; design: StillDirection }[]
>();
const add = (
  scene: string,
  file: string,
  description: string,
  design: StillDirection,
) =>
  images.set(scene, [
    ...(images.get(scene) ?? []),
    { file, description, design },
  ]);
const serveUrl = await bundle({
  entryPoint: resolve("src/storyboard/CinematicStoryboardStudy.tsx"),
});
const browser = await openBrowser("chrome");
try {
  for (const [i, shot] of cinematicStillShots.entries()) {
    const inputProps = { shotId: shot.id };
    const composition = await selectComposition({
      serveUrl,
      id: "CinematicStoryboardStudy",
      inputProps,
      puppeteerInstance: browser,
    });
    const file = `images/${shot.id}.png`;
    await renderStill({
      serveUrl,
      composition,
      inputProps,
      puppeteerInstance: browser,
      frame: 60,
      scale: 0.5,
      output: join(output, file),
    });
    add(
      shot.scene,
      file,
      `${shot.phase.replaceAll("-", " ")} · ${stillDirection(shot).camera}`,
      stillDirection(shot),
    );
    console.log(`[${i + 1}/${cinematicStillShots.length}] ${shot.id}`);
  }
} finally {
  await browser.close({ silent: true });
}
const scenes = board.map((scene) => {
  const frames = images.get(scene.id);
  if (!frames?.length) throw new Error(`No design for ${scene.id}`);
  return {
    ...scene,
    origin: "Visual variety overhaul · proposed still",
    images: frames,
  };
});
writeFileSync(
  join(output, "index.json"),
  JSON.stringify(
    {
      reviewOnly: true,
      approved: false,
      videoCreated: false,
      sourceHash: createHash("sha256").update(source).digest("hex"),
      style: {
        backdrop: "fixed rough paper",
        architecture: false,
        onScreenText: "currency amounts only",
      },
      scenes,
    },
    null,
    2,
  ) + "\n",
);
run("node", [
  "--experimental-strip-types",
  "scripts/render/assemble-full-storyboard.ts",
  "--design",
  join(output, "index.json"),
  "--out",
  join(output, "review"),
]);
run("python", [
  "scripts/review/storyboard-contact-sheets.py",
  output,
  "--out",
  join(output, "contact-sheets"),
]);
writeFileSync(
  join(output, "source-hashes.json"),
  JSON.stringify(
    {
      scriptHash: hash("videos/001-lifestyle-creep/narration.txt"),
      audioHash: hash("out/001-lifestyle-creep/narration/narration.wav"),
      cueHash: hash("out/001-lifestyle-creep/narration/timing/cues.draft.json"),
      wordHash: hash(
        "out/001-lifestyle-creep/narration/timing/words.draft.json",
      ),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Saved ${scenes.length} redesigned scene reviews, ${[...images.values()].reduce((n, list) => n + list.length, 0)} stills. No video rendered. ${join(output, "review/index.html")}`,
);
