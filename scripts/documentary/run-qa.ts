import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { validateManifestFiles } from "../../src/documentary/assets/nodeValidator.ts";
import type { AssetManifest } from "../../src/documentary/assets/schema.ts";
import { runDocumentaryQa } from "../../src/documentary/qa.ts";
import type { DocumentaryStoryboard } from "../../src/documentary/timeline.ts";
import type { CueFile } from "../../src/timeline/types.ts";

const { values } = parseArgs({
  options: {
    dir: { type: "string" },
    out: { type: "string" },
    mode: { type: "string" },
  },
});

const dir = resolve(values.dir ?? "videos/demo-bnpl-feels-cheaper");
const mode = values.mode === "planning" ? "planning" : "delivery";

const cueFile = JSON.parse(readFileSync(`${dir}/cues.json`, "utf8")) as CueFile;
const storyboard = JSON.parse(
  readFileSync(`${dir}/storyboard.json`, "utf8"),
) as DocumentaryStoryboard;
const manifest = JSON.parse(
  readFileSync(`${dir}/asset-manifest.json`, "utf8"),
) as AssetManifest;

const { report } = runDocumentaryQa({
  cueFile,
  storyboard,
  manifest,
  mode,
});

const fileReport = validateManifestFiles(manifest, { mode });
const combined = {
  ...report,
  manifestFiles: fileReport,
  passed: report.passed && fileReport.valid,
};

if (values.out) {
  const outPath = resolve(values.out);
  mkdirSync(resolve(outPath, ".."), { recursive: true });
  writeFileSync(outPath, JSON.stringify(combined, null, 2) + "\n", "utf8");
}

console.log(JSON.stringify(combined, null, 2));
if (!combined.passed) {
  process.exit(1);
}
