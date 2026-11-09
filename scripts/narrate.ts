import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve, join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import { clearLine, cursorTo } from "node:readline";
import { request } from "node:http";

const rate = 48000;
const hash = (data: string | Buffer) =>
  createHash("sha256").update(data).digest("hex");
const json = (path: string, value: unknown) => {
  writeFileSync(`${path}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(`${path}.tmp`, path);
};

export function paragraphs(text: string): string[] {
  const parts = text
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.replace(/\s+/g, " ").trim());
  if (!parts[0]) throw new Error("Narration is empty");
  if (parts.some((part) => [...part].length > 4096)) {
    throw new Error(
      "A paragraph exceeds VoiceStudio's 4096-character limit; split it at a natural boundary",
    );
  }
  return parts;
}

function ffmpeg(args: string[], input?: Buffer): Buffer {
  const result = spawnSync("ffmpeg", ["-v", "error", "-xerror", ...args], {
    input,
    maxBuffer: 256 * 1024 * 1024,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`FFmpeg: ${result.stderr.toString()}`);
  return result.stdout;
}

function pcm(path: string): Buffer {
  const data = ffmpeg([
    "-i",
    path,
    "-f",
    "s16le",
    "-acodec",
    "pcm_s16le",
    "-ar",
    String(rate),
    "-ac",
    "1",
    "pipe:1",
  ]);
  if (!data.length || data.length % 2)
    throw new Error(`Invalid audio: ${path}`);
  let peak = 0;
  for (let i = 0; i < data.length; i += 2)
    peak = Math.max(peak, Math.abs(data.readInt16LE(i)));
  if (peak === 0) throw new Error(`Silent audio: ${path}`);
  return data;
}

type Segment = {
  id: string;
  text: string;
  key: string;
  file: string;
  cacheFile: string;
  audioHash: string;
  samples: number;
};
type Cache = {
  key: string;
  audioHash: string;
  headers: Record<string, string>;
  generationMs?: number;
  characters?: number;
};

export function narrationProgress(
  completed: number,
  total: number,
  elapsedMs: number,
  remainingMs: number | null,
): string {
  const duration = (ms: number) => {
    const seconds = Math.max(0, Math.floor(ms / 1000));
    return [
      Math.floor(seconds / 3600),
      Math.floor(seconds / 60) % 60,
      seconds % 60,
    ]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };
  const fraction = Math.max(0, Math.min(1, completed / total));
  const filled = Math.floor(fraction * 20);
  const eta =
    completed >= total
      ? "00:00:00"
      : remainingMs === null
        ? "calculating"
        : remainingMs <= 0
          ? "recalculating"
          : `~${duration(remainingMs)}`;
  const spinner =
    completed >= total ? "done" : "|/-\\"[Math.floor(elapsedMs / 1000) % 4];
  return `[${"#".repeat(filled)}${"-".repeat(20 - filled)}] ${Math.floor(fraction * 100)}% text complete ${spinner} | Elapsed ${duration(elapsedMs)} | ETA ${eta}`;
}

export function showProgress(line: () => string) {
  const render = () => {
    if (process.stdout.isTTY) {
      cursorTo(process.stdout, 0);
      clearLine(process.stdout, 0);
      process.stdout.write(line());
    } else console.log(line());
  };
  render();
  const timer = setInterval(render, process.stdout.isTTY ? 1000 : 10000);
  return () => {
    clearInterval(timer);
    render();
    if (process.stdout.isTTY) process.stdout.write("\n");
  };
}

export async function voiceRequest(
  url: URL,
  options: RequestInit,
): Promise<Response> {
  try {
    if (options.method === "POST") {
      // Node fetch has a five-minute headers timeout even with a longer abort signal.
      return await new Promise<Response>((resolveResponse, reject) => {
        const body = options.body;
        if (typeof body !== "string")
          throw new Error("Speech requests require a JSON string body");
        const req = request(
          url,
          {
            method: "POST",
            signal: options.signal ?? undefined,
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(body),
            },
          },
          (response) => {
            const chunks: Buffer[] = [];
            response.on("data", (chunk: Buffer) => chunks.push(chunk));
            response.on("error", reject);
            response.on("end", () => {
              const headers = new Headers();
              for (const [name, value] of Object.entries(response.headers)) {
                if (value !== undefined)
                  headers.set(
                    name,
                    Array.isArray(value) ? value.join(", ") : value,
                  );
              }
              resolveResponse(
                new Response(new Uint8Array(Buffer.concat(chunks)), {
                  status: response.statusCode,
                  headers,
                }),
              );
            });
          },
        );
        req.on("error", reject);
        req.end(body);
      });
    }
    return await fetch(url, options);
  } catch (error) {
    const cause = error instanceof Error ? error.cause : undefined;
    const code =
      cause && typeof cause === "object" && "code" in cause
        ? String(cause.code)
        : error instanceof Error
          ? error.message
          : String(error);
    const advice =
      options.method === "POST"
        ? "Check VoiceStudio jobs/history before retrying; the generation may still be running."
        : "Start VoiceStudio and wait for its local service to become ready, then rerun the command.";
    throw new Error(
      `VoiceStudio request failed: ${url.href} (${code}). ${advice}`,
      { cause: error },
    );
  }
}

function launchVoiceStudio() {
  if (process.platform !== "win32")
    throw new Error(
      "Automatic VoiceStudio startup requires Windows; start its local service manually.",
    );
  const env = { ...process.env };
  // Electron apps exit as Node scripts when launched from some developer hosts.
  delete env.ELECTRON_RUN_AS_NODE;
  const result = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "$ErrorActionPreference = 'Stop'; if (-not (Get-Process -Name VoiceStudio -ErrorAction SilentlyContinue)) { $exe = Join-Path $env:LOCALAPPDATA 'Programs\\VoiceStudio\\VoiceStudio.exe'; if (-not (Test-Path -LiteralPath $exe)) { throw 'VoiceStudio installation not found' }; Start-Process -FilePath $exe -WindowStyle Hidden }",
    ],
    { env, windowsHide: true, timeout: 10000 },
  );
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`Cannot start VoiceStudio: ${result.stderr.toString()}`);
}

export async function ensureVoiceStudio(
  url: URL,
  start = launchVoiceStudio,
  pause: () => Promise<unknown> = () => delay(1000),
) {
  const health = async () => {
    const response = await fetch(new URL("/health", url), {
      signal: AbortSignal.timeout(1000),
      redirect: "error",
    });
    if (!response.ok)
      throw new Error(`VoiceStudio health: HTTP ${response.status}`);
    await response.arrayBuffer();
  };
  try {
    await health();
    return;
  } catch (error) {
    const cause =
      error instanceof Error
        ? (error.cause as NodeJS.ErrnoException | undefined)
        : undefined;
    if (cause?.code !== "ECONNREFUSED") throw error;
  }
  console.log(
    "VoiceStudio service is offline. Starting the app if needed; waiting for health...",
  );
  start();
  for (let attempt = 0; attempt < 30; attempt++) {
    await pause();
    try {
      await health();
      console.log("VoiceStudio service is ready.");
      return;
    } catch {
      // Startup can briefly refuse connections or return an unhealthy status.
    }
  }
  throw new Error(
    `VoiceStudio did not become healthy at ${url.origin} within the startup window. Inspect the app's startup error before retrying.`,
  );
}

export async function narrate(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      script: { type: "string" },
      out: { type: "string" },
      voice: { type: "string", default: "f6ec71e3" },
      url: { type: "string", default: "http://127.0.0.1:3900" },
      preview: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(
      "npm run narrate -- --script <narration.txt> --out <directory> [--voice <profile-id>] [--preview]",
    );
    return;
  }
  if (!values.script || !values.out)
    throw new Error("--script and --out are required; use --help");
  const url = new URL(values.url!);
  if (
    url.protocol !== "http:" ||
    !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("--url must be a local loopback HTTP origin");
  }
  const source = readFileSync(resolve(values.script), "utf8");
  const parts = paragraphs(source);
  const out = resolve(values.out);
  const settings = {
    model: "voxcpm2",
    voice: values.voice!,
    response_format: "wav",
    speed: 1.0,
  };
  mkdirSync(out, { recursive: true });
  // An exclusive lock also survives a crash, preventing accidental duplicate synthesis.
  const lock = join(out, "run.lock");
  writeFileSync(lock, `${process.pid}\n`, { flag: "wx" });
  try {
    const segments: Segment[] = [];
    const chunks: Buffer[] = [];
    const selected = values.preview ? parts.slice(0, 1) : parts;
    const cache = join(out, ".cache");
    mkdirSync(cache, { recursive: true });
    // Reuse existing takes from runners that stored the cache at the output root.
    const cacheDirectory = (key: string) =>
      [".json", ".wav", ".pending.json"].some((suffix) =>
        existsSync(join(out, `${key}${suffix}`)),
      )
        ? out
        : cache;
    const runStarted = performance.now();
    const totalCharacters = selected.reduce(
      (sum, text) => sum + text.length,
      0,
    );
    let completedCharacters = 0;
    let measuredMs = 0;
    let measuredCharacters = 0;
    const outstanding = new Map<string, number>();
    for (const text of selected) {
      const key = hash(JSON.stringify({ settings, text }));
      const receipt = join(cacheDirectory(key), `${key}.json`);
      if (!existsSync(receipt)) outstanding.set(key, text.length);
      else {
        const cached = JSON.parse(readFileSync(receipt, "utf8")) as Cache;
        if (
          cached.key === key &&
          Number.isFinite(cached.generationMs) &&
          cached.generationMs! > 0 &&
          cached.characters === text.length
        ) {
          measuredMs += cached.generationMs!;
          measuredCharacters += text.length;
        }
      }
    }
    let discovered = false;
    const get = async (path: string) => {
      const response = await voiceRequest(new URL(path, url), {
        signal: AbortSignal.timeout(20000),
        redirect: "error",
      });
      if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
      return response.json();
    };
    for (const [index, text] of selected.entries()) {
      const key = hash(JSON.stringify({ settings, text }));
      const file = `audio-${index + 1}.wav`;
      const directory = cacheDirectory(key);
      const wav = join(directory, `${key}.wav`);
      const receipt = join(directory, `${key}.json`);
      const pending = join(directory, `${key}.pending.json`);
      if (existsSync(pending))
        throw new Error(
          `Unresolved generation: ${pending}. Inspect VoiceStudio jobs/history before removing this marker and retrying.`,
        );
      if (existsSync(receipt)) {
        const saved = JSON.parse(readFileSync(receipt, "utf8")) as Cache;
        if (
          saved.key !== key ||
          !existsSync(wav) ||
          hash(readFileSync(wav)) !== saved.audioHash
        ) {
          throw new Error(
            `Cached audio failed integrity check: ${wav}. Preserve it and use a new output directory.`,
          );
        }
        console.log(`[${index + 1}/${selected.length}] Reusing ${file}`);
      } else {
        if (existsSync(wav))
          throw new Error(
            `Untracked audio exists: ${wav}; inspect it before retrying`,
          );
        if (!discovered) {
          if (url.port === "3900") await ensureVoiceStudio(url);
          await get("/health");
          const schema = await get("/openapi.json");
          if (!schema.paths?.["/v1/audio/speech"]?.post)
            throw new Error("VoiceStudio speech endpoint missing");
          const engines = await get("/engines/tts");
          const engine = engines.backends?.find(
            (item: { id: string }) => item.id === settings.model,
          );
          if (!engine?.available || engine.routing_status === "unavailable") {
            throw new Error(
              `VoxCPM2 unavailable: ${engine?.reason ?? "check installed model and engine readiness"}`,
            );
          }
          const profiles = await get("/profiles");
          if (settings.voice !== "default") {
            const list = Array.isArray(profiles) ? profiles : profiles.profiles;
            if (
              !list?.some(
                (profile: { id: string }) => profile.id === settings.voice,
              ) &&
              !engine.preset_voices?.includes(settings.voice)
            )
              throw new Error(
                "Voice must be an existing profile ID or supported preset",
              );
          }
          console.log(
            `Engine: voxcpm2; voice: ${settings.voice}; routing: ${engine.routing_status ?? "unknown"}`,
          );
          discovered = true;
        }
        console.log(
          `[${index + 1}/${selected.length}] Generating ${text.length} characters; waiting for VoiceStudio`,
        );
        json(pending, { settings, text, startedAt: new Date().toISOString() });
        const synthesisStarted = performance.now();
        let generated = false;
        const stopProgress = showProgress(() => {
          const activeMs = performance.now() - synthesisStarted;
          const remainingCharacters = [...outstanding.values()].reduce(
            (sum, count) => sum + count,
            0,
          );
          const perCharacter =
            measuredCharacters > 0 ? measuredMs / measuredCharacters : null;
          const remainingMs =
            perCharacter === null
              ? null
              : activeMs >= text.length * perCharacter
                ? 0
                : remainingCharacters * perCharacter - activeMs;
          return narrationProgress(
            completedCharacters + (generated ? text.length : 0),
            totalCharacters,
            performance.now() - runStarted,
            remainingMs,
          );
        });
        try {
          // No automatic retry: a disconnected client does not mean inference stopped.
          const response = await voiceRequest(
            new URL("/v1/audio/speech", url),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...settings, input: text }),
              signal: AbortSignal.timeout(30 * 60 * 1000),
              redirect: "error",
            },
          );
          const headers = Object.fromEntries(response.headers);
          json(join(directory, `${key}.response.json`), {
            status: response.status,
            headers,
          });
          if (!response.ok)
            throw new Error(
              `VoiceStudio HTTP ${response.status}: ${(await response.text()).slice(0, 2000)}`,
            );
          for (const [name, value] of Object.entries(headers)) {
            if (
              (name.includes("dropped-text") && value.trim()) ||
              (name.includes("dropped-chunks") && value !== "0")
            )
              throw new Error(`VoiceStudio omitted speech: ${name}=${value}`);
          }
          const data = Buffer.from(await response.arrayBuffer());
          const temporary = `${wav}.tmp`;
          writeFileSync(temporary, data, { flag: "wx" });
          pcm(temporary);
          renameSync(temporary, wav);
          const generationMs = performance.now() - synthesisStarted;
          json(receipt, {
            key,
            audioHash: hash(data),
            headers,
            generationMs,
            characters: text.length,
          });
          rmSync(pending);
          measuredMs += generationMs;
          measuredCharacters += text.length;
          outstanding.delete(key);
          generated = true;
        } finally {
          stopProgress();
        }
      }
      const data = pcm(wav);
      const exported = join(out, file);
      writeFileSync(`${exported}.tmp`, readFileSync(wav));
      renameSync(`${exported}.tmp`, exported);
      chunks.push(data);
      completedCharacters += text.length;
      segments.push({
        id: `p${String(index + 1).padStart(3, "0")}`,
        text,
        key,
        file,
        cacheFile: relative(out, wav),
        audioHash: hash(readFileSync(wav)),
        samples: data.length / 2,
      });
      json(join(out, "manifest.json"), {
        version: 1,
        scriptPath: resolve(values.script),
        scriptHash: hash(source),
        settings,
        sampleRate: rate,
        totalParagraphs: parts.length,
        complete: segments.length === parts.length,
        listeningReviewed: false,
        segments,
      });
    }
    console.log(
      narrationProgress(
        completedCharacters,
        totalCharacters,
        performance.now() - runStarted,
        0,
      ),
    );
    console.log("Assembling master WAV and draft cues...");
    const masterName = values.preview ? "preview.wav" : "narration.wav";
    const master = join(out, masterName);
    const data = Buffer.concat(chunks);
    const temporary = `${master}.tmp`;
    ffmpeg(
      [
        "-y",
        "-f",
        "s16le",
        "-ar",
        String(rate),
        "-ac",
        "1",
        "-i",
        "pipe:0",
        "-c:a",
        "pcm_s16le",
        "-f",
        "wav",
        temporary,
      ],
      data,
    );
    pcm(temporary);
    renameSync(temporary, master);
    let sample = 0;
    const cues = segments.map((segment) => {
      const startSample = sample;
      sample += segment.samples;
      return {
        id: segment.id,
        text: segment.text,
        startSample,
        endSample: sample,
        startMs: (startSample * 1000) / rate,
        endMs: (sample * 1000) / rate,
      };
    });
    json(
      join(out, values.preview ? "preview-cues.draft.json" : "cues.draft.json"),
      {
        mode: "draft",
        listeningReviewed: false,
        complete: segments.length === parts.length,
        scriptHash: hash(source),
        sourceAudioSha256: hash(readFileSync(master)),
        audioFile: masterName,
        sampleRate: rate,
        durationSamples: sample,
        durationMs: (sample * 1000) / rate,
        note: "Paragraph boundaries, not spoken phrase alignment. Review timestamps against this WAV before creating aligned CueFile data.",
        cues,
      },
    );
    console.log(
      `Saved ${master}: ${(data.length / 2 / rate).toFixed(3)} seconds. Listening and phrase alignment remain unreviewed.`,
    );
  } finally {
    rmSync(lock);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  narrate(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
