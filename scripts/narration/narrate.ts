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
// Liveness probe for a lock owner; a recycled pid reads as alive, which is the
// safe side (it only costs a manual lock inspection).
const alive = (pid: number) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const words = (text: string) => text.match(/\S+/g) ?? [];

// Split one paragraph into pieces small enough to stay under the time cap:
// sentences, then clauses of long sentences, then word runs of run-on clauses.
function pieces(text: string, maxChunkWords: number): string[] {
  const sentences = new Intl.Segmenter("en", { granularity: "sentence" });
  return [...sentences.segment(text)].flatMap(({ segment }) => {
    const sentence = segment.trim();
    if (words(sentence).length <= maxChunkWords) return [sentence];
    return sentence.split(/(?<=[,;:])\s+/).flatMap((clause) => {
      const list = words(clause);
      if (list.length <= maxChunkWords) return [clause];
      const runs: string[] = [];
      const size = Math.ceil(
        list.length / Math.ceil(list.length / maxChunkWords),
      );
      for (let i = 0; i < list.length; i += size)
        runs.push(list.slice(i, i + size).join(" "));
      return runs;
    });
  });
}

// Greedily repack pieces so each chunk is as full as possible without overrunning.
function chunks(
  text: string,
  minChunkWords: number,
  maxChunkWords: number,
): string[] {
  const result: string[][] = [];
  for (const piece of pieces(text, maxChunkWords)) {
    const current = result[result.length - 1];
    if (
      current &&
      words(current.join(" ")).length + words(piece).length <= maxChunkWords
    )
      current.push(piece);
    else result.push([piece]);
  }
  // Borrow whole sentences from the previous take when the ending is too short.
  const tail = result[result.length - 1];
  const previous = result[result.length - 2];
  while (previous && words(tail.join(" ")).length < minChunkWords) {
    const last = previous[previous.length - 1];
    if (
      words(previous.join(" ")).length - words(last).length < minChunkWords ||
      words(tail.join(" ")).length + words(last).length > maxChunkWords
    )
      break;
    tail.unshift(previous.pop()!);
  }
  return result.map((part) => part.join(" "));
}

export function paragraphs(text: string, wpm = 150): string[] {
  if (!Number.isFinite(wpm) || wpm < 4)
    throw new Error("--wpm must be a finite number of at least 4");
  const normalized = text
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/\s+/g, " ");
  if (!normalized) throw new Error("Narration is empty");
  // shortcut: WPM estimates exclude delivery pauses; calibrate from a reviewed take.
  const result = chunks(normalized, Math.ceil(wpm / 4), Math.floor(wpm / 2));
  if (result.some((part) => [...part].length > 4096)) {
    throw new Error(
      "A paragraph exceeds VoiceStudio's 4096-character limit; split it at a natural boundary",
    );
  }
  return result;
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

async function recoverInterruptedTake(pending: string, wav: string, url: URL) {
  const saved = JSON.parse(readFileSync(pending, "utf8")) as {
    startedAt: string;
  };
  const startedAt = Date.parse(saved.startedAt);
  const checkedAt = Date.now();
  // A newer backend cannot still be running the abandoned request.
  const response = await voiceRequest(new URL("/startup/progress", url), {
    signal: AbortSignal.timeout(20000),
    redirect: "error",
  });
  const status = response.ok ? await response.json() : null;
  if (
    !Number.isFinite(startedAt) ||
    typeof status?.elapsed_s !== "number" ||
    !Number.isFinite(status.elapsed_s) ||
    status.elapsed_s < 0 ||
    checkedAt - status.elapsed_s * 1000 <= startedAt + 2000
  ) {
    console.log("Waiting for VoxCPM2 to finish any interrupted generation...");
    const stopProgress = showProgress(() =>
      `Recovering interrupted take | Elapsed ${Math.floor((Date.now() - checkedAt) / 1000)}s | Waiting for VoxCPM2`,
    );
    try {
      // VoxCPM2's sidecar health ping takes the same lock as synthesis.
      // Unlike /jobs or /model/status, it waits for active synthesis to finish.
      const health = await voiceRequest(new URL("/engines/voxcpm2/health", url), {
        signal: AbortSignal.timeout(30 * 60 * 1000),
        redirect: "error",
      });
      const engine = health.ok ? await health.json() : null;
      if (engine?.id !== "voxcpm2" || engine.ok !== true)
        throw new Error("VoxCPM2 health probe did not confirm readiness");
    } catch (error) {
      throw new Error(
        `Unresolved generation: ${pending}. Could not confirm VoxCPM2 is ready. Inspect VoiceStudio, then rerun the same command; completed takes will be reused.`,
        { cause: error },
      );
    } finally {
      stopProgress();
    }
  }
  const suffix = `.interrupted-${Date.now()}`;
  for (const path of [
    wav,
    `${wav}.tmp`,
    pending.replace(/\.pending\.json$/, ".response.json"),
    pending,
  ]) {
    if (existsSync(path)) renameSync(path, `${path}${suffix}`);
  }
  console.log(
    "Recovered an interrupted take; regenerating only this take.",
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
      wpm: { type: "string", default: "150" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(
      "npm run narrate -- --script <narration.txt> --out <directory> [--voice <profile-id>] [--wpm <words-per-minute>] [--preview]",
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
  const wpm = Number(values.wpm);
  const parts = paragraphs(source, wpm);
  const out = resolve(values.out);
  const settings = {
    model: "voxcpm2",
    voice: values.voice!,
    response_format: "wav",
    speed: 1.0,
  };
  mkdirSync(out, { recursive: true });
  // An exclusive lock survives a crash, so a leftover lock with a live owner
  // still blocks a duplicate run; a dead owner's lock is just debris.
  const lock = join(out, "run.lock");
  try {
    writeFileSync(lock, `${process.pid}\n`, { flag: "wx" });
  } catch (error) {
    const owner = Number(readFileSync(lock, "utf8").trim());
    if (!Number.isInteger(owner) || owner <= 0 || alive(owner)) throw error;
    console.warn(`Reclaiming stale narration lock from dead pid ${owner}.`);
    rmSync(lock);
    writeFileSync(lock, `${process.pid}\n`, { flag: "wx" });
  }
  let stopRequested = false;
  const stop = () => {
    stopRequested = true;
    console.log(
      "\nStopping after the current take is saved. Rerun the same command to resume.",
    );
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  try {
    const groupedScript = join(out, "narration-grouped.txt");
    writeFileSync(`${groupedScript}.tmp`, `${parts.join("\n\n")}\n`);
    renameSync(`${groupedScript}.tmp`, groupedScript);
    console.log(
      `Prepared ${parts.length} takes at an estimated ${wpm} WPM (15–30 seconds each; short takes may remain at sentence boundaries). Saved ${groupedScript}`,
    );
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
      if (stopRequested) return;
      const key = hash(JSON.stringify({ settings, text }));
      const file = `audio-${index + 1}.wav`;
      const directory = cacheDirectory(key);
      const wav = join(directory, `${key}.wav`);
      const receipt = join(directory, `${key}.json`);
      const pending = join(directory, `${key}.pending.json`);
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
        if (existsSync(wav) && !existsSync(pending))
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
        if (stopRequested) return;
        if (existsSync(pending))
          await recoverInterruptedTake(pending, wav, url);
        if (stopRequested) return;
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
      if (existsSync(pending)) rmSync(pending);
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
        estimatedWpm: wpm,
        sampleRate: rate,
        totalParagraphs: parts.length,
        complete: segments.length === parts.length,
        listeningReviewed: false,
        segments,
      });
      if (stopRequested) return;
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
    process.off("SIGINT", stop);
    process.off("SIGTERM", stop);
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
