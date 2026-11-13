import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
  readdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  ensureVoiceStudio,
  narrate,
  paragraphs,
  narrationProgress,
  showProgress,
  voiceRequest,
} from "../scripts/narration/narrate.ts";
import { compileTimeline } from "../src/timeline/compiler.ts";
import type { CueFile, Storyboard } from "../src/timeline/types.ts";

test("paragraph splitting preserves sentences and enforces the API limit", () => {
  assert.deepEqual(paragraphs("\uFEFF One sentence.\r\nAnother.\r\n\r\nTwo."), [
    "One sentence. Another. Two.",
  ]);
  assert.throws(() => paragraphs("  "), /empty/);
  assert.throws(() => paragraphs("a".repeat(4097)), /4096/);
});

test("long paragraphs split into takes short enough to keep voice quality", () => {
  const maxWords = 75; // 30 s at 150 WPM
  const long = Array.from(
    { length: 12 },
    (_, i) =>
      `This is sentence number ${i + 1} of a long paragraph that runs on.`,
  ).join(" ");
  const takes = paragraphs(long);
  assert(takes.length > 1);
  assert.equal(takes.join(" "), long);
  for (const take of takes) assert(take.split(" ").length <= maxWords);
  // Run-on text with no sentence or clause breaks still splits.
  const runOn = Array.from({ length: 120 }, (_, i) => `word${i}`).join(" ");
  const runs = paragraphs(runOn);
  assert(runs.length > 1);
  assert.equal(runs.join(" "), runOn);
  for (const run of runs) assert(run.split(" ").length <= maxWords);
});

test("grouping combines short paragraphs, balances the tail and respects speaking rate", () => {
  const sentence = (count: number, label: string) =>
    `${Array.from({ length: count }, (_, i) => `${label}${i}`).join(" ")}.`;
  const source = Array.from({ length: 10 }, (_, i) =>
    sentence(10, `S${i}w`),
  ).join("\n\n");
  const takes = paragraphs(source);
  assert.deepEqual(
    takes.map((take) => take.split(" ").length),
    [60, 40],
  );
  assert.equal(takes.join(" "), source.replace(/\s+/g, " "));
  for (const wpm of [120, 150, 180]) {
    const grouped = paragraphs(source, wpm);
    assert.equal(grouped.join(" "), takes.join(" "));
    for (const take of grouped) {
      const seconds = (take.split(" ").length * 60) / wpm;
      assert(seconds >= 15 && seconds <= 30);
    }
  }
  // A short script or indivisible sentence can legitimately leave a short take.
  assert.deepEqual(paragraphs("Only one short sentence."), [
    "Only one short sentence.",
  ]);
  assert.deepEqual(
    paragraphs(`${sentence(70, "Long")} ${sentence(10, "Short")}`).map(
      (take) => take.split(" ").length,
    ),
    [70, 10],
  );
  const quoted = 'He said, "Keep this together." Then he left.';
  assert.deepEqual(paragraphs(quoted), [quoted]);
  for (const wpm of [0, -1, NaN, Infinity])
    assert.throws(() => paragraphs(source, wpm), /--wpm/);
});

test("speech transport waits for delayed headers without fetch and honors abort", async (context) => {
  const server = createServer((req, response) => {
    if (req.url === "/hang") return;
    setTimeout(() => {
      response.setHeader("X-Test", "audio");
      response.end(wav());
    }, 30);
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  assert(address && typeof address !== "string");
  context.mock.method(globalThis, "fetch", () => {
    throw new Error("POST must not use fetch");
  });
  try {
    const url = new URL(`http://127.0.0.1:${address.port}/speech`);
    const response = await voiceRequest(url, {
      method: "POST",
      body: "{}",
      signal: AbortSignal.timeout(2000),
    });
    assert.equal(response.headers.get("X-Test"), "audio");
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), wav());
    await assert.rejects(
      voiceRequest(new URL("/hang", url), {
        method: "POST",
        body: "{}",
        signal: AbortSignal.timeout(30),
      }),
      /Check VoiceStudio jobs\/history/,
    );
  } finally {
    server.closeAllConnections();
    await new Promise<void>((done) => server.close(() => done()));
  }
});

test("progress reports completed text, elapsed time, and honest ETA states", () => {
  assert.match(
    narrationProgress(0, 100, 65000, null),
    /0% text complete.*Elapsed 00:01:05.*ETA calculating/,
  );
  assert.match(
    narrationProgress(25, 100, 3661000, 125000),
    /\[#####---------------\] 25%.*Elapsed 01:01:01.*ETA ~00:02:05/,
  );
  assert.match(narrationProgress(25, 100, 0, -1), /ETA recalculating/);
  assert.match(
    narrationProgress(100, 100, 1000, null),
    /100% text complete done.*ETA 00:00:00/,
  );
});

test("progress refreshes while waiting and stops its timer on cleanup", (context) => {
  context.mock.timers.enable({ apis: ["setInterval"] });
  const messages: string[] = [];
  context.mock.method(console, "log", (line: string) => messages.push(line));
  context.mock.method(process.stdout, "write", (line: string) => {
    messages.push(String(line));
    return true;
  });
  let elapsed = 0;
  const stop = showProgress(() => `Elapsed ${elapsed}`);
  elapsed = 10;
  context.mock.timers.tick(10000);
  assert(messages.includes("Elapsed 0"));
  assert(messages.includes("Elapsed 10"));
  stop();
  const count = messages.length;
  context.mock.timers.tick(10000);
  assert.equal(messages.length, count);
});

function wav() {
  const samples = 4801;
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write("RIFF");
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(48000, 24);
  buffer.writeUInt32LE(96000, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++)
    buffer.writeInt16LE(Math.round(Math.sin(i / 10) * 3000), 44 + i * 2);
  return buffer;
}

test("startup waits after one launch and skips launch when health is already ready", async () => {
  const server = createServer((_request, response) => {
    response.setHeader("Connection", "close");
    response.end("{}");
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  assert(address && typeof address !== "string");
  const url = new URL(`http://127.0.0.1:${address.port}`);
  await new Promise<void>((done) => server.close(() => done()));
  let launches = 0;
  let ready: Promise<void> = Promise.resolve();
  const start = () => {
    launches++;
    ready = new Promise<void>((done) =>
      server.listen(address.port, "127.0.0.1", done),
    );
  };
  try {
    await ensureVoiceStudio(url, start, () => ready);
    await ensureVoiceStudio(url, start, () => ready);
    assert.equal(launches, 1);
  } finally {
    await new Promise<void>((done) => server.close(() => done()));
  }
  await assert.rejects(
    ensureVoiceStudio(
      url,
      () => {
        launches++;
      },
      async () => {},
    ),
    /did not become healthy/,
  );
  assert.equal(launches, 2);
});

test("unreachable service reports endpoint and recovery instructions without leaving a lock", async () => {
  const dir = mkdtempSync(join(tmpdir(), "narration-offline-"));
  const server = createServer();
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  assert(address && typeof address !== "string");
  await new Promise<void>((done) => server.close(() => done()));
  const script = join(dir, "script.txt");
  writeFileSync(script, "Hello.");
  try {
    await assert.rejects(
      narrate([
        "--script",
        script,
        "--out",
        join(dir, "audio"),
        "--url",
        `http://127.0.0.1:${address.port}`,
      ]),
      /\/health \(ECONNREFUSED\).*Start VoiceStudio/,
    );
    assert.throws(() => readFileSync(join(dir, "audio", "run.lock")), /ENOENT/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("runner resumes, reuses unchanged paragraphs, preserves sample timing and blocks uncertain retries", async () => {
  const dir = mkdtempSync(join(tmpdir(), "narration-test-"));
  let calls = 0;
  let drop = false;
  let interrupt = true;
  let engineReady = false;
  let healthChecks = 0;
  let startup: object = { elapsed_s: 60 };
  const server = createServer(async (request, response) => {
    response.setHeader("Content-Type", "application/json");
    if (request.url === "/health") response.end("{}");
    else if (request.url === "/startup/progress")
      response.end(JSON.stringify(startup));
    else if (request.url === "/engines/voxcpm2/health") {
      healthChecks++;
      const beforeProbe = calls;
      // Model a health ping blocked behind the abandoned synthesis lock.
      await new Promise((done) => setTimeout(done, 40));
      assert.equal(calls, beforeProbe);
      response.end(JSON.stringify({ id: "voxcpm2", ok: engineReady }));
    }
    else if (request.url === "/openapi.json")
      response.end(
        JSON.stringify({ paths: { "/v1/audio/speech": { post: {} } } }),
      );
    else if (request.url === "/engines/tts")
      response.end(
        JSON.stringify({ backends: [{ id: "voxcpm2", available: true }] }),
      );
    else if (request.url === "/profiles")
      response.end('[{"id":"f6ec71e3","name":"Jeremy"}]');
    else {
      let body = "";
      for await (const chunk of request) body += chunk;
      const input = JSON.parse(body);
      assert.equal(input.model, "voxcpm2");
      assert.equal(input.voice, "f6ec71e3");
      assert.equal(input.speed, 1);
      calls++;
      if (interrupt) {
        interrupt = false;
        process.emit("SIGINT");
      }
      response.setHeader("Content-Type", "audio/wav");
      if (drop) response.setHeader("X-OmniVoice-Dropped-Text", "missing words");
      response.end(wav());
    }
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  assert(address && typeof address !== "string");
  const script = join(dir, "script.txt");
  const out = join(dir, "audio");
  const args = [
    "--script",
    script,
    "--out",
    out,
    "--url",
    `http://127.0.0.1:${address.port}`,
  ];
  try {
    const first = `${"First paragraph context ".repeat(19)}First paragraph.`;
    const second = `${"Second paragraph context ".repeat(19)}Second paragraph.`;
    const changed = `${"Changed paragraph context ".repeat(19)}Changed paragraph.`;
    writeFileSync(script, `${first}\n\n${second}`);
    const listeners = process.listenerCount("SIGINT");
    await narrate(args);
    assert.equal(calls, 1);
    assert.equal(process.listenerCount("SIGINT"), listeners);
    assert.throws(() => readFileSync(join(out, "run.lock")), /ENOENT/);
    const interrupted = JSON.parse(
      readFileSync(join(out, "manifest.json"), "utf8"),
    );
    assert.equal(interrupted.complete, false);
    assert.equal(interrupted.segments.length, 1);
    assert(
      !readdirSync(join(out, ".cache")).some((name) =>
        name.endsWith(".pending.json"),
      ),
    );
    // A crash after writing a verified receipt must not block cache reuse.
    writeFileSync(
      join(out, ".cache", `${interrupted.segments[0].key}.pending.json`),
      "{}",
    );
    await narrate([...args, "--preview"]);
    assert.equal(readFileSync(script, "utf8"), `${first}\n\n${second}`);
    assert.equal(
      readFileSync(join(out, "narration-grouped.txt"), "utf8"),
      `${first}\n\n${second}\n`,
    );
    assert.equal(calls, 1);
    assert(
      !readdirSync(join(out, ".cache")).some((name) =>
        name.endsWith(".pending.json"),
      ),
    );
    // Legacy interrupted requests can be retried after a proven backend restart.
    const secondKey = createHash("sha256")
      .update(
        JSON.stringify({
          settings: interrupted.settings,
          text: second,
        }),
      )
      .digest("hex");
    const abandoned = join(out, ".cache", secondKey);
    const marker = JSON.stringify({ startedAt: "2000-01-01T00:00:00Z" });
    writeFileSync(`${abandoned}.pending.json`, marker);
    writeFileSync(`${abandoned}.wav.tmp`, "partial audio");
    await narrate(args);
    assert.equal(calls, 2);
    const archived = readdirSync(join(out, ".cache"));
    assert(
      archived.some((name) =>
        name.startsWith(`${secondKey}.pending.json.interrupted-`),
      ),
    );
    assert(
      archived.some((name) =>
        name.startsWith(`${secondKey}.wav.tmp.interrupted-`),
      ),
    );
    const archivedMarker = archived.find((name) =>
      name.startsWith(`${secondKey}.pending.json.interrupted-`),
    )!;
    assert.equal(
      readFileSync(join(out, ".cache", archivedMarker), "utf8"),
      marker,
    );
    await narrate(args);
    assert.equal(calls, 2);
    const draft = JSON.parse(
      readFileSync(join(out, "cues.draft.json"), "utf8"),
    );
    assert.equal(draft.durationSamples, 9602);
    assert.equal(draft.cues[1].startSample, 4801);
    assert.equal(draft.cues[1].endMs, (9602 * 1000) / 48000);
    assert.equal(draft.listeningReviewed, false);
    assert.throws(
      () => compileTimeline(draft as CueFile, {} as Storyboard),
      /invalid timing mode/,
    );
    writeFileSync(script, `${first}\n\n${changed}`);
    await narrate(args);
    assert.equal(calls, 3);
    const manifest = JSON.parse(
      readFileSync(join(out, "manifest.json"), "utf8"),
    );
    const receipt = JSON.parse(
      readFileSync(
        join(out, ".cache", `${manifest.segments[0].key}.json`),
        "utf8",
      ),
    );
    assert(receipt.generationMs > 0);
    assert.equal(receipt.characters, first.length);
    assert.deepEqual(
      manifest.segments.map((segment: { file: string }) => segment.file),
      ["audio-1.wav", "audio-2.wav"],
    );
    for (const segment of manifest.segments) {
      assert.deepEqual(
        readFileSync(join(out, segment.file)),
        readFileSync(join(out, segment.cacheFile)),
      );
    }
    writeFileSync(script, `${changed}\n\n${first}`);
    await narrate(args);
    assert.equal(calls, 3);
    const reordered = JSON.parse(
      readFileSync(join(out, "manifest.json"), "utf8"),
    );
    assert.equal(reordered.segments[0].key, manifest.segments[1].key);
    assert.equal(reordered.segments[0].file, "audio-1.wav");
    assert.deepEqual(
      readFileSync(join(out, "audio-1.wav")),
      readFileSync(join(out, reordered.segments[0].cacheFile)),
    );
    writeFileSync(join(out, manifest.segments[0].cacheFile), "corrupt");
    await assert.rejects(narrate(args), /integrity/);
    assert.equal(calls, 3);
    writeFileSync(script, "Failure paragraph.");
    drop = true;
    await assert.rejects(narrate(args), /omitted speech/);
    const afterFailure = calls;
    await assert.rejects(narrate(args), /Unresolved generation/);
    for (startup of [{}, { elapsed_s: -1 }])
      await assert.rejects(narrate(args), /Unresolved generation/);
    assert.equal(calls, afterFailure);
    assert.equal(healthChecks, 3);
    // Resume on the same backend, even when uptime is unavailable.
    engineReady = true;
    drop = false;
    await narrate(args);
    assert.equal(calls, afterFailure + 1);
    assert.equal(healthChecks, 4);
    await narrate(args);
    assert.equal(calls, afterFailure + 1);
    assert.equal(process.listenerCount("SIGINT"), listeners);
    writeFileSync(join(out, "run.lock"), "other process");
    await assert.rejects(narrate(args), /EEXIST/);
    assert.equal(readFileSync(join(out, "run.lock"), "utf8"), "other process");
  } finally {
    await new Promise<void>((done, reject) =>
      server.close((error) => (error ? reject(error) : done())),
    );
    rmSync(dir, { recursive: true, force: true });
  }
});
