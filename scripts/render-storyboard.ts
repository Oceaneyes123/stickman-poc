import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";
import {
  parseStoryboard,
  remainingShots,
  remainingInserts,
} from "../src/storyboard/remainingShots.ts";

const { values } = parseArgs({ options: { out: { type: "string" } } });
const output = resolve(
  values.out ?? "out/001-lifestyle-creep/s07-s67-storyboard-v1",
);
if (existsSync(output))
  throw new Error(
    "Output directory exists; choose a new --out directory to preserve reviews",
  );
const source = "videos/001-lifestyle-creep/storyboard.md";
const text = readFileSync(source, "utf8");
const board = parseStoryboard(text);
const timing = JSON.parse(
  readFileSync(
    "out/001-lifestyle-creep/narration/timing/cues.draft.json",
    "utf8",
  ),
);
const cueIds = new Set(timing.cues.map((cue: { id: string }) => cue.id));
const selected = remainingShots.map(([id, layout, angle]) => {
  const scene = board.find((scene) => scene.id === id);
  if (!scene) throw new Error(`Missing storyboard scene ${id}`);
  for (const cue of scene.cueIds)
    if (!cueIds.has(cue)) throw new Error(`Missing narration cue ${cue}`);
  const insert = remainingInserts.find(([sceneId]) => sceneId === id);
  return {
    ...scene,
    layout,
    angle,
    file: `${id}.png`,
    inserts: insert
      ? [{ file: `${id}-insert.png`, description: insert[1] }]
      : [],
  };
});
if (selected.length !== 61) throw new Error("Expected all 61 remaining scenes");
mkdirSync(output, { recursive: true });
const serveUrl = await bundle({
  entryPoint: resolve("src/storyboard/RemainingSceneStudy.tsx"),
});
const browser = await openBrowser("chrome");
try {
  const hashes = new Set<string>();
  for (const [i, scene] of selected.entries()) {
    for (const image of [
      { file: scene.file, insert: false },
      ...scene.inserts.map((insert) => ({ file: insert.file, insert: true })),
    ]) {
      const inputProps = { scene: scene.id, insert: image.insert };
      const composition = await selectComposition({
        serveUrl,
        id: "RemainingSceneStudy",
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
        output: join(output, image.file),
      });
      const hash = createHash("sha256")
        .update(readFileSync(join(output, image.file)))
        .digest("hex");
      if (hashes.has(hash))
        throw new Error(
          `Repeated scene image ${scene.id}; inspect props or intended callback framing`,
        );
      hashes.add(hash);
    }
    console.log(`[${i + 1}/${selected.length}] ${scene.id} · ${scene.title}`);
  }
} finally {
  await browser.close({ silent: true });
}
const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
writeFileSync(
  join(output, "index.json"),
  JSON.stringify(
    {
      reviewOnly: true,
      animated: false,
      approved: false,
      width: 960,
      height: 540,
      source,
      sourceHash: createHash("sha256").update(text).digest("hex"),
      scenes: selected,
    },
    null,
    2,
  ) + "\n",
);
writeFileSync(
  join(output, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Money Trap · S07–S67 visual storyboard</title><style>*{box-sizing:border-box}body{margin:0;background:#e2e8f0;color:#14243a;font:17px/1.55 system-ui,sans-serif}header{max-width:1600px;margin:auto;padding:40px 24px}h1{margin:0;font-size:32px}nav{display:flex;flex-wrap:wrap;gap:10px}nav a{color:#14243a}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,620px),1fr));gap:24px;max-width:1600px;margin:auto;padding:0 24px 48px}article{background:#f8fafc;padding:22px;border-radius:8px;break-inside:avoid}h2{font-size:22px;margin:0 0 12px}img{width:100%;height:auto;display:block;border:1px solid #a6b4c6}blockquote{margin:20px 0;padding-left:16px;border-left:4px solid #f3be58}summary{cursor:pointer;font-weight:650}.meta{font-size:14px;color:#38506b}a:focus-visible,summary:focus-visible{outline:3px solid #39b8b6;outline-offset:4px}@media print{header nav{display:none}main{display:block}article{break-after:page;max-width:100%}details{display:none}}</style><header><h1>S07–S67 · visual storyboard</h1><p>Why Making More Money Doesn't Make You Richer</p><p>61 scene keyframes plus 7 supporting inserts, paired with exact narration from the approved text board. Still-image review only; motion and cue alignment are not implemented here.</p><nav aria-label="Scenes">${selected.map((scene) => `<a href="#${scene.id}">${scene.id}</a>`).join(" ")}</nav></header><main>${selected.map((scene) => `<article id="${scene.id}"><h2>${scene.id} · ${escape(scene.title)}</h2><img src="${scene.file}" width="960" height="540" loading="lazy" alt="${escape(scene.composition)}"><p class="meta">${escape(scene.audioWindow)}<br>${escape(scene.angle)}</p><blockquote>${escape(scene.narration)}</blockquote>${scene.inserts.map((insert) => `<p class="meta">Supporting insert: ${escape(insert.description)}</p><img src="${insert.file}" width="960" height="540" loading="lazy" alt="${escape(insert.description)}">`).join("")}<details><summary>Scene direction and continuity</summary><p><b>Composition:</b> ${escape(scene.composition)}</p><p><b>Action:</b> ${escape(scene.movement)}</p><p><b>Camera:</b> ${escape(scene.camera)}</p><p><b>Transition:</b> ${escape(scene.visualTransition)}</p><p><b>Continuity:</b> ${escape(scene.continuity)}</p><p><b>Proposed screen text:</b> ${escape(scene.screenText)}</p><p class="meta">Cues: ${scene.cueIds.map(escape).join(", ")}</p></details></article>`).join("\n")}</main></html>`,
);
const sheets = spawnSync(
  "python",
  [
    "-c",
    `
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,math,sys
p=Path(sys.argv[1]);scenes=json.loads((p/'index.json').read_text(encoding='utf-8'))['scenes']
font=ImageFont.truetype('public/fonts/Inter.ttf',18)
def contact(batch,filename):
 sheet=Image.new('RGB',(1600,math.ceil(len(batch)/4)*265),'#e2e8f0');draw=ImageDraw.Draw(sheet)
 for i,scene in enumerate(batch):
  image=Image.open(p/scene['file']);image.thumbnail((400,225));x=i%4*400;y=i//4*265;sheet.paste(image,(x,y));draw.text((x+10,y+230),scene['id']+'  '+scene['title'][:31],font=font,fill='#14243a')
 sheet.save(p/filename)
for start in range(0,len(scenes),12):
 batch=scenes[start:start+12];contact(batch,'contact-'+batch[0]['id']+'-'+batch[-1]['id']+'.png')
inserts=[{'id':scene['id']+' insert','title':insert['description'],'file':insert['file']} for scene in scenes for insert in scene['inserts']]
if inserts: contact(inserts,'contact-inserts.png')
`,
    output,
  ],
  { windowsHide: true, encoding: "utf8" },
);
if (sheets.error) throw sheets.error;
if (sheets.status !== 0) throw new Error(sheets.stderr);
console.log(
  `Saved ${selected.length} scene frames and ${remainingInserts.length} supporting inserts, contact sheets, and ${join(output, "index.html")}`,
);
