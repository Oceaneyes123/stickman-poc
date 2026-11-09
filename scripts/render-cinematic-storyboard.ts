import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseArgs } from "node:util";
import {
  cinematicStillShots,
  referenceScenes,
} from "../src/storyboard/cinematicStillPlan.ts";
import { parseStoryboard } from "../src/storyboard/remainingShots.ts";
import type { DirectedSequence } from "../src/animation/direction.ts";

const { values } = parseArgs({ options: { out: { type: "string" } } });
const output = resolve(
  values.out ?? "out/001-lifestyle-creep/storyboard-design-v1",
);
if (existsSync(output))
  throw new Error("Choose a fresh --out folder to preserve earlier packets");
const source = readFileSync("videos/001-lifestyle-creep/storyboard.md", "utf8"),
  board = parseStoryboard(source);
const narration = readFileSync(
  "videos/001-lifestyle-creep/narration.txt",
  "utf8",
).replace(/\s+/g, " ");
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));
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
const images = new Map<string, { file: string; description: string }[]>();
const add = (scene: string, file: string, description: string) =>
  images.set(scene, [...(images.get(scene) ?? []), { file, description }]);
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
    add(shot.scene, file, shot.phase.replaceAll("-", " "));
    console.log(`[${i + 1}/${cinematicStillShots.length}] ${shot.id}`);
  }
} finally {
  await browser.close({ silent: true });
}
const referenceBeats: Record<string, { reference: string; beats: string[] }> = {
  S12: {
    reference: "apartment",
    beats: ["lift-phone", "enter-room", "open-laptop", "notice-space"],
  },
  S21: { reference: "raise-illusion", beats: ["quote-amount", "raise-amount"] },
  S22: {
    reference: "raise-illusion",
    beats: ["rent-amount", "eighty-remains"],
  },
  S50: { reference: "comparison", beats: ["alex-files", "period-difference"] },
  S51: { reference: "comparison", beats: ["same-raise", "sam-monthly"] },
  S52: { reference: "comparison", beats: ["sam-benefit", "alex-resolve"] },
};
for (const scene of referenceScenes) {
  const reference = referenceBeats[scene],
    directory = resolve(
      "out/001-lifestyle-creep/cinematic-references-v4",
      reference.reference,
    ),
    sequence = json(join(directory, "direction.json")) as DirectedSequence;
  for (const id of reference.beats) {
    const beat = sequence.beats.find(
      (beat) => beat.id === id && beat.sceneId === scene,
    );
    if (!beat) throw new Error(`Missing reference beat ${id}`);
    const file = `images/${scene}-${id}.png`;
    copyFileSync(
      join(
        directory,
        "frames",
        `${String(beat.endFrame).padStart(5, "0")}.png`,
      ),
      join(output, file),
    );
    add(scene, file, id.replaceAll("-", " "));
  }
}
const scenes = board.map((scene) => {
  const frames = images.get(scene.id);
  if (!frames?.length) throw new Error(`No design for ${scene.id}`);
  return {
    ...scene,
    origin: referenceScenes.includes(
      scene.id as (typeof referenceScenes)[number],
    )
      ? "Current cinematic reference · still frame"
      : "Redesigned cinematic storyboard · proposed still",
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
  "scripts/assemble-full-storyboard.ts",
  "--design",
  join(output, "index.json"),
  "--out",
  join(output, "review"),
]);
run("python", [
  "-c",
  `
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,math,sys
p=Path(sys.argv[1]);scenes=json.loads((p/'index.json').read_text(encoding='utf-8'))['scenes'];font=ImageFont.truetype('public/fonts/Inter.ttf',18)
for start in range(0,len(scenes),12):
 batch=scenes[start:start+12];sheet=Image.new('RGB',(1600,math.ceil(len(batch)/4)*265),'#e2e8f0');draw=ImageDraw.Draw(sheet)
 for i,scene in enumerate(batch):
  image=Image.open(p/scene['images'][0]['file']);assert image.size==(960,540);image.thumbnail((400,225));x=i%4*400;y=i//4*265;sheet.paste(image,(x,y));draw.text((x+10,y+230),scene['id']+'  '+scene['title'][:31],font=font,fill='#14243a')
 sheet.save(p/('contact-'+batch[0]['id']+'-'+batch[-1]['id']+'.png'))
`,
  output,
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
