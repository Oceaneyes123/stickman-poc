import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { parseStoryboard } from "../src/storyboard/remainingShots.ts";
import type { DirectedSequence } from "../src/animation/direction.ts";

const { values } = parseArgs({
  options: { out: { type: "string" }, design: { type: "string" } },
});
const output = resolve(
  values.out ?? "out/001-lifestyle-creep/full-storyboard-v1",
);
if (existsSync(output))
  throw new Error("Choose a new --out directory to preserve previous reviews");
const base = resolve("out/001-lifestyle-creep");
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const sourcePath = "videos/001-lifestyle-creep/storyboard.md";
const source = readFileSync(sourcePath, "utf8"),
  board = parseStoryboard(source);
if (
  board.length !== 67 ||
  board.some((scene, i) => scene.id !== `S${String(i + 1).padStart(2, "0")}`)
)
  throw new Error("The source must cover S01–S67 exactly once in order");
const narration = readFileSync(
  "videos/001-lifestyle-creep/narration.txt",
  "utf8",
).replace(/\s+/g, " ");
const opening = json(join(base, "s01-s06-stills-v5/index.json")) as {
  shots: { id: string; scene: string; description: string }[];
};
const remaining = json(join(base, "s07-s67-storyboard-v2/index.json")) as {
  scenes: {
    id: string;
    file: string;
    inserts: { file: string; description: string }[];
  }[];
};
const design = values.design
  ? {
      directory: dirname(resolve(values.design)),
      data: json(resolve(values.design)) as {
        scenes: {
          id: string;
          images: { file: string; description: string }[];
          origin: string;
        }[];
      },
    }
  : null;
const link = (path: string) =>
  relative(output, resolve(path)).split(sep).join("/");
const image = (path: string, description: string) => {
  if (!existsSync(path)) throw new Error(`Missing storyboard image ${path}`);
  return { src: link(path), description };
};
const latest: Record<string, { reference: string; beats: string[] }> = {
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
const scenes = board.map((scene) => {
  if (!narration.includes(scene.narration.replace(/\s+/g, " ")))
    throw new Error(`Narration mismatch in ${scene.id}`);
  if (design) {
    const updated = design.data.scenes.find((item) => item.id === scene.id);
    if (!updated?.images.length)
      throw new Error(`Missing redesigned artwork ${scene.id}`);
    return {
      ...scene,
      status: updated.origin,
      latest: true,
      images: updated.images.map((item) =>
        image(join(design.directory, item.file), item.description),
      ),
      video: null,
    };
  }
  const current = latest[scene.id];
  if (current) {
    const folder = join(base, "cinematic-references-v4", current.reference);
    const sequence = json(join(folder, "direction.json")) as DirectedSequence;
    const shot = sequence.timeline.scenes.find((shot) => shot.id === scene.id);
    if (!shot) throw new Error(`Reference does not contain ${scene.id}`);
    const frames = (
      json(join(folder, "frame-index.json")) as { frame: number }[]
    ).filter(
      (item) =>
        item.frame >= shot.from &&
        item.frame < shot.from + shot.durationInFrames,
    );
    const selected = current.beats.map((id) => {
      const beat = sequence.beats.find(
        (beat) => beat.id === id && beat.sceneId === scene.id,
      );
      if (!beat) throw new Error(`Missing reference beat ${id}`);
      const nearest = frames.reduce((a, b) =>
        Math.abs(a.frame - beat.endFrame) <= Math.abs(b.frame - beat.endFrame)
          ? a
          : b,
      );
      return image(
        join(folder, "frames", `${String(nearest.frame).padStart(5, "0")}.png`),
        `${id.replaceAll("-", " ")} · frame ${nearest.frame}`,
      );
    });
    return {
      ...scene,
      status: "Latest reference · textured backdrop, money figures only",
      latest: true,
      images: selected,
      video: link(join(folder, `${current.reference}.mp4`)),
    };
  }
  const first = opening.shots.filter((shot) => shot.scene === scene.id);
  if (first.length)
    return {
      ...scene,
      status: "Earlier opening study · old labels and architecture",
      latest: false,
      images: first.map((shot) =>
        image(
          join(base, "s01-s06-stills-v5", `${shot.id}.png`),
          shot.description,
        ),
      ),
      video: null,
    };
  const earlier = remaining.scenes.find((item) => item.id === scene.id);
  if (!earlier) throw new Error(`Missing scene artwork ${scene.id}`);
  return {
    ...scene,
    status: "Earlier storyboard study · old labels and architecture",
    latest: false,
    images: [
      image(
        join(base, "s07-s67-storyboard-v2", earlier.file),
        scene.composition,
      ),
      ...earlier.inserts.map((insert) =>
        image(
          join(base, "s07-s67-storyboard-v2", insert.file),
          insert.description,
        ),
      ),
    ],
    video: null,
  };
});
const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
mkdirSync(output, { recursive: true });
writeFileSync(
  join(output, "index.json"),
  JSON.stringify(
    {
      reviewOnly: true,
      approved: false,
      assembledFromExistingPackets: true,
      designSource: values.design ?? null,
      source: sourcePath,
      sourceHash: createHash("sha256").update(source).digest("hex"),
      scenes,
    },
    null,
    2,
  ) + "\n",
);
writeFileSync(
  join(output, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Money Trap · Full storyboard S01–S67</title><style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#e2e8f0;color:#14243a;font:17px/1.55 system-ui,sans-serif}header,main{max-width:1600px;margin:auto;padding:24px}h1{font-size:32px;margin-bottom:8px}nav{display:flex;flex-wrap:wrap;gap:8px}a{color:#14243a}nav a{padding:4px 7px;border:1px solid #a6b4c6;border-radius:4px;text-decoration:none}article{background:#f8fafc;margin:0 0 32px;padding:24px;border-radius:8px;scroll-margin-top:20px}h2{font-size:25px;margin:0 0 12px}.scene{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,1fr);gap:28px}img{width:100%;height:auto;display:block}figure{margin:0 0 20px}figcaption,.meta{font-size:14px;color:#38506b}.status{padding:8px 12px;background:#e2e8f0;border-left:4px solid #a6b4c6}.latest{border-color:#39b8b6}blockquote{margin:20px 0;padding-left:16px;border-left:4px solid #f3be58}summary{cursor:pointer;font-weight:650}a:focus-visible,summary:focus-visible{outline:3px solid #39b8b6;outline-offset:4px}@media(max-width:900px){.scene{grid-template-columns:1fr}header,main{padding:16px}article{padding:16px}}@media print{nav{display:none}article{break-before:page}.scene{display:block}details{display:none}}</style><header><h1>Complete storyboard · S01–S67</h1><p>Why Making More Money Doesn't Make You Richer</p><p>${design ? "All 67 scenes use the cinematic storyboard direction: fixed rough paper, preserved foreground, no walls, windows or floor surfaces, and currency figures only. Stills only; no new video. Original narrative notes below are retained for story continuity; the displayed artwork and current style rules supersede older architectural and text suggestions." : "All 67 scenes in narration order, including the opening. Latest cinematic references replace the earlier images for S12, S21–S22 and S50–S52. Other scenes retain their earlier studies; their old labels and backgrounds have not yet been adapted."}</p>${design ? "" : `<p><a href="${link(join(base, "cinematic-references-v4/index.html"))}">Latest animated references</a> · <a href="${link(join(base, "opening-animation-v2/s01-s06.mp4"))}">Earlier S01–S06 animation</a></p>`}<nav aria-label="Jump to scene">${scenes.map((scene) => `<a href="#${scene.id}">${scene.id}</a>`).join("")}</nav></header><main>${scenes.map((scene) => `<article id="${scene.id}"><h2>${scene.id} · ${escape(scene.title)}</h2><p class="status ${scene.latest ? "latest" : ""}">${escape(scene.status)}</p><div class="scene"><div>${scene.images.map((image) => `<figure><img src="${image.src}" width="960" height="540" loading="lazy" alt="${escape(image.description)}"><figcaption>${escape(image.description)}</figcaption></figure>`).join("")}</div><div><p class="meta">${escape(scene.audioWindow)}</p><blockquote>${escape(scene.narration)}</blockquote>${scene.video ? `<p><a href="${scene.video}">Watch this reference sequence</a></p>` : ""}<details><summary>Scene direction and continuity</summary><p><b>Composition:</b> ${escape(scene.composition)}</p><p><b>Action:</b> ${escape(scene.movement)}</p><p><b>Camera:</b> ${escape(scene.camera)}</p><p><b>Transition:</b> ${escape(scene.visualTransition)}</p><p><b>Continuity:</b> ${escape(scene.continuity)}</p><p class="meta">${scene.cueIds.map(escape).join(", ")}</p></details><p><a href="#">Back to scene list</a></p></div></div></article>`).join("\n")}</main></html>`,
);
console.log(
  `Saved ${scenes.length} scenes, ${scenes.reduce((n, s) => n + s.images.length, 0)} images: ${join(output, "index.html")}`,
);
