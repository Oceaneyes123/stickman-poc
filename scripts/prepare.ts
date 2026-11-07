import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { compileTimeline } from "../src/timeline/compiler.ts";
import type { CueFile, Storyboard } from "../src/timeline/types.ts";
const folder = "videos/001-lifestyle-creep";
const hash = (data: string | Buffer) =>
  createHash("sha256").update(data).digest("hex");
const narration = readFileSync(`${folder}/narration.txt`, "utf8");
const cues = JSON.parse(readFileSync(`${folder}/cues.json`, "utf8")) as CueFile;
const board = JSON.parse(
  readFileSync(`${folder}/storyboard.json`, "utf8"),
) as Storyboard;
if (process.argv.includes("--init") && cues.scriptHash === "pending") {
  cues.scriptHash = hash(narration);
  writeFileSync(`${folder}/cues.json`, JSON.stringify(cues, null, 2) + "\n");
}
if (cues.scriptHash !== hash(narration))
  throw new Error(
    "Narration changed. Review all phrase cues, then update scriptHash with the SHA-256 of narration.txt.",
  );
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
if (
  normalize(cues.cues.map((cue) => cue.text).join(" ")) !== normalize(narration)
)
  throw new Error("Cue text must match narration.txt in full and in order.");
const wav = "public/audio/poc.wav";
const audioPresent = existsSync(wav);
let audioDurationMs: number | undefined;
if (audioPresent) {
  const metadata = JSON.parse(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-show_format", "-show_streams", "-of", "json", wav],
      { encoding: "utf8" },
    ),
  );
  if (
    !metadata.streams.some(
      (stream: { codec_type: string }) => stream.codec_type === "audio",
    )
  )
    throw new Error("poc.wav has no audio stream");
  audioDurationMs = Number(metadata.format.duration) * 1000;
  if (cues.mode !== "aligned")
    throw new Error(
      "WAV found but cues are timing-demo estimates. Enter phrase timestamps and set mode=aligned and audioHash before rendering.",
    );
  if (cues.audioHash !== hash(readFileSync(wav)))
    throw new Error(
      "WAV changed. Review alignment and update audioHash; old cues cannot certify a new recording.",
    );
} else if (cues.mode === "aligned")
  throw new Error("Aligned cues require public/audio/poc.wav");
const timeline = compileTimeline(cues, board, audioDurationMs);
mkdirSync("src/timeline", { recursive: true });
mkdirSync("out", { recursive: true });
mkdirSync("public/audio", { recursive: true });
writeFileSync(
  "src/timeline/generated.json",
  JSON.stringify(
    {
      timeline,
      audioPresent,
      audioDurationMs: audioDurationMs ?? null,
      scriptHash: cues.scriptHash,
      audioHash: cues.audioHash ?? null,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `${timeline.mode}: ${timeline.durationInFrames} frames / ${(timeline.durationInFrames / timeline.fps).toFixed(3)}s; ${timeline.scenes.length} scenes; ${timeline.events.length} events; WAV ${audioPresent ? "present" : "absent"}`,
);
