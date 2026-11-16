import assert from "node:assert/strict";
import { test, beforeEach, afterEach } from "node:test";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  rm,
  stat,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import "../core.js";
import { LocalStore, validateMetadata } from "../storage.js";
import { transcriptVideoId } from "../transcript.js";

const core = globalThis.FrameStudy;
const source = {
  id: "abcdefghijk",
  title: "Local fixture",
  duration: 20,
  width: 1920,
  height: 1080,
};
const options = {
  mode: "motion",
  method: "seek",
  start: 0,
  end: 2,
  fps: 5,
  interval: 1,
  threshold: 0.18,
};
const frame = {
  data: "data:image/jpeg;base64,/9j/2Q==",
  timestamp: 0.2,
  requestedTime: 0.2,
  timestampSource: "mediaTime",
  width: 1920,
  height: 1080,
};

test("parses YouTube identities and timestamps without allowing output paths", () => {
  assert.equal(
    core.videoId("https://www.youtube.com/watch?v=abcdefghijk&list=abc"),
    source.id,
  );
  assert.equal(
    core.videoId("https://m.youtube.com/shorts/abcdefghijk"),
    source.id,
  );
  assert.equal(core.videoId("https://example.com/watch?v=abcdefghijk"), null);
  assert.equal(
    core.videoId("https://www.youtube.com/watch?v=../../escape"),
    null,
  );
  assert.equal(core.parseTime("01:02:03.125"), 3723.125);
  assert.equal(core.parseTime("03:05.25"), 185.25);
  assert.equal(core.timestamp(59.9999), "00:01:00.000");
  for (const value of ["", "-1", "1:60", "abc", "0:0:0:0"])
    assert.throws(() => core.parseTime(value));
});

test("validates ranges, settings, duration, and seek sample limits", () => {
  assert.equal(core.validateOptions(options, 20), 0.2);
  for (const replacement of [
    { start: -1 },
    { end: 21 },
    { start: 2, end: 2 },
    { fps: 30 },
    { interval: 2 },
    { threshold: NaN },
    { method: "unknown" },
    { mode: "unknown" },
  ]) {
    assert.throws(() =>
      core.validateOptions({ ...options, ...replacement }, 20),
    );
  }
  assert.throws(() => core.validateOptions(options, Infinity));
  assert.throws(
    () => core.validateOptions({ ...options, end: 2000 }, 2000),
    /5,000/,
  );
});

test("scene comparison suppresses repeats and detects composition changes", () => {
  const black = new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255]);
  const white = new Uint8ClampedArray([255, 255, 255, 255, 255, 255, 255, 255]);
  assert.equal(core.difference(black, null), 1);
  assert.equal(core.difference(black, black), 0);
  assert.equal(core.difference(black, white), 1);
  assert.throws(() => core.difference(black, new Uint8Array(4)));
});

test("splits collections without dropping or reordering frames", () => {
  const items = Array.from({ length: 53 }, (_, i) => i);
  for (const grid of [3, 4, 5]) {
    const sheets = core.batches(items, grid);
    assert.deepEqual(sheets.flat(), items);
    assert.ok(sheets.every((sheet) => sheet.length <= grid * grid));
  }
  assert.deepEqual(core.batches([], 3), []);
  assert.throws(() => core.batches(items, 2));
});

// A disk-backed adapter exercises the same directory/write contract as Chrome.
class Directory {
  constructor(path) {
    this.path = path;
  }
  async queryPermission() {
    return "granted";
  }
  async getDirectoryHandle(name, { create = false } = {}) {
    const path = join(this.path, name);
    if (create) await mkdir(path, { recursive: true });
    try {
      if (!(await stat(path)).isDirectory()) throw new Error("Not a directory");
    } catch (error) {
      if (error.code === "ENOENT")
        throw new DOMException("Missing", "NotFoundError");
      throw error;
    }
    return new Directory(path);
  }
  async getFileHandle(name, { create = false } = {}) {
    const path = join(this.path, name);
    try {
      await stat(path);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      if (!create) throw new DOMException("Missing", "NotFoundError");
      await writeFile(path, "");
    }
    return {
      getFile: async () => new Blob([await readFile(path)]),
      createWritable: async () => {
        let contents;
        return {
          write: async (value) => {
            contents =
              value instanceof Blob
                ? Buffer.from(await value.arrayBuffer())
                : value;
          },
          close: async () => writeFile(path, contents),
          abort: async () => {},
        };
      },
    };
  }
}
let temporary;
let store;
let lockQueue = Promise.resolve();
Object.defineProperty(navigator, "locks", {
  value: {
    request: (_key, callback) => {
      const result = lockQueue.then(callback);
      lockQueue = result.catch(() => {});
      return result;
    },
  },
});
beforeEach(async () => {
  temporary = await mkdtemp(join(tmpdir(), "frame-study-test-"));
  store = new LocalStore(new Directory(temporary));
});
afterEach(async () => {
  await rm(temporary, { recursive: true, force: true });
});

test("saves frames and reloads metadata; concurrent writers never reuse numbers", async () => {
  await Promise.all([
    store.saveFrame(source, options, null, frame),
    store.saveFrame(source, options, null, { ...frame, timestamp: 0.4 }),
  ]);
  const data = await store.read(source);
  assert.deepEqual(
    data.frames.map((item) => item.path),
    ["frames/frame_0001.jpg", "frames/frame_0002.jpg"],
  );
  assert.equal(data.frames[0].timestamp, 0.2);
  assert.equal(data.frames[0].requestedTime, 0.2);
  assert.equal(data.frames[0].data, undefined);
  assert.equal((await store.file(source, data.frames[0].path)).size, 4);
  assert.ok(
    await readFile(join(temporary, source.id, "metadata.json"), "utf8"),
  );
});

test("creates distinct motion sequences and skips orphaned frame files", async () => {
  const first = await store.startSequence(source, options);
  assert.equal(first.sequence, "sequence_001");
  await store.saveFrame(source, options, first.sequence, frame);
  const second = await store.startSequence(source, options);
  assert.equal(second.sequence, "sequence_002");
  const folder = await store.videoDirectory(source.id);
  await store.write(folder, "motion/sequence_002/frame_001.jpg", "orphan");
  const data = await store.saveFrame(source, options, second.sequence, frame);
  assert.equal(data.frames[1].path, "motion/sequence_002/frame_002.jpg");
  assert.equal(
    await (
      await store.file(source, "motion/sequence_002/frame_001.jpg")
    ).text(),
    "orphan",
  );
});

test("sheet exports preserve frame order and write PNG, JPEG, and JSON immediately", async () => {
  let data = await store.saveFrame(source, options, null, frame);
  data = await store.saveSheet(
    source,
    null,
    new Blob(["png"]),
    new Blob(["jpeg"]),
    { frames: data.frames.map((item) => item.path), grid: 3 },
  );
  assert.equal(data.sheets[0].path, "contact-sheets/sheet_001.png");
  assert.equal(
    await (await store.file(source, data.sheets[0].jpegPath)).text(),
    "jpeg",
  );
  assert.deepEqual((await store.read(source)).sheets[0].frames, [
    "frames/frame_0001.jpg",
  ]);
});

test("selection, removal, and order survive reopening without deleting originals", async () => {
  await store.saveFrame(source, options, null, frame);
  await store.saveFrame(source, options, null, frame);
  await store.mutate(source, (data) => {
    data.frames.reverse();
    data.frames[0].selected = false;
    data.frames[1].removed = true;
  });
  const data = await new LocalStore(new Directory(temporary)).read(source);
  assert.equal(data.frames[0].number, 2);
  assert.equal(data.frames[0].selected, false);
  assert.equal(data.frames[1].removed, true);
  assert.equal((await store.file(source, data.frames[1].path)).size, 4);
});

test("corrupt metadata, traversal, and expired permission cannot overwrite existing files", async () => {
  const folder = await store.videoDirectory(source.id);
  await store.write(folder, "metadata.json", "{broken");
  await assert.rejects(
    store.saveFrame(source, options, null, frame),
    /Cannot read/,
  );
  assert.equal(
    await readFile(join(temporary, source.id, "metadata.json"), "utf8"),
    "{broken",
  );
  await assert.rejects(
    store.file(source, "../escape.jpg"),
    /Invalid image path/,
  );
  await assert.rejects(store.videoDirectory("../escape"), /Invalid YouTube/);
  assert.throws(() =>
    validateMetadata(
      {
        schemaVersion: 1,
        video: source,
        sequences: [],
        sheets: [],
        frames: [{ path: "../escape" }],
      },
      source.id,
    ),
  );
  store.root.queryPermission = async () => "prompt";
  await assert.rejects(store.load(source), /permission expired/);
});

test("narration matches actual frame time with exclusive ends and no invented timing", async () => {
  assert.equal(transcriptVideoId("not a URL"), null);
  assert.equal(
    transcriptVideoId("https://youtu.be/abcdefghijk?t=1"),
    source.id,
  );
  assert.equal(
    transcriptVideoId("http://youtube.com/watch?v=abcdefghijk"),
    null,
  );
  const transcript = {
    videoId: source.id,
    source: "whisper",
    model: "small",
    language: "en",
    segments: [
      { start: 0, end: 0.3, text: "First phrase" },
      { start: 0.3, end: 1, text: "Next phrase" },
      { start: null, end: null, text: "Untimed import" },
    ],
  };
  assert.deepEqual(
    core.narrationAt(transcript, 0.2).map((segment) => segment.text),
    ["First phrase"],
  );
  assert.deepEqual(
    core.narrationAt(transcript, 0.3).map((segment) => segment.text),
    ["Next phrase"],
  );
  assert.deepEqual(core.narrationAt(transcript, 1), []);
  const data = await store.saveFrame(source, options, null, frame);
  const path = await store.saveAnalysis(source, data.frames, transcript);
  const analysis = JSON.parse(
    await readFile(join(temporary, source.id, path), "utf8"),
  );
  assert.equal(analysis.frames[0].timestamp, 0.2);
  assert.equal(analysis.frames[0].narration[0].text, "First phrase");
  assert.equal(analysis.transcript.model, "small");
  await assert.rejects(
    store.saveAnalysis(source, data.frames, {
      ...transcript,
      videoId: "other-video",
    }),
    /another video/,
  );
});
