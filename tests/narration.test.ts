import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
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
} from "../scripts/narrate.ts";
import { compileTimeline } from "../src/timeline/compiler.ts";
import type { CueFile, Storyboard } from "../src/timeline/types.ts";

test("paragraph splitting preserves sentences and enforces the API limit", () => {
  assert.deepEqual(paragraphs("\uFEFF One sentence.\r\nAnother.\r\n\r\nTwo."), [
    "One sentence. Another.",
    "Two.",
  ]);
  assert.throws(() => paragraphs("  "), /empty/);
  assert.throws(() => paragraphs("a".repeat(4097)), /4096/);
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
  const server = createServer(async (request, response) => {
    response.setHeader("Content-Type", "application/json");
    if (request.url === "/health") response.end("{}");
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
    writeFileSync(script, "First paragraph.\n\nSecond paragraph.");
    await narrate([...args, "--preview"]);
    assert.equal(calls, 1);
    await narrate(args);
    assert.equal(calls, 2);
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
    writeFileSync(script, "First paragraph.\n\nChanged paragraph.");
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
    assert.equal(receipt.characters, "First paragraph.".length);
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
    writeFileSync(script, "Changed paragraph.\n\nFirst paragraph.");
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
    assert.equal(calls, afterFailure);
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
