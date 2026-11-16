import { LocalStore, rememberedDirectory } from "./storage.js";
import { renderSheet, canvasBlob } from "./sheets.js";
import { TranscriptPanel } from "./transcript.js";
import { ensureCaptureScript } from "./connection.js";

const core = globalThis.FrameStudy;
const $ = (id) => document.getElementById(id);
let root = null;
let store = null;
let source = null;
let data = null;
let port = null;
let busy = false;
let activeCapture = null;
let page = 0;
let renderVersion = 0;
let gallerySignature = "";
let sheetSignature = "";
let previewUrl = null;
const pending = new Map();
const thumbnails = new Map();
const pageSize = 60;

function status(message, error = false) {
  $("status").textContent = message;
  $("status").classList.toggle("error", error);
}
function report(error) {
  status(error.message || String(error), true);
  if (root)
    root
      .queryPermission({ mode: "readwrite" })
      .then((permission) => {
        $("grant").hidden = permission === "granted";
      })
      .catch(() => {});
}
function on(id, event, callback) {
  $(id).addEventListener(event, (...args) =>
    Promise.resolve()
      .then(() => callback(...args))
      .catch(report),
  );
}
function setBusy(value) {
  busy = value;
  for (const id of [
    "connect",
    "reloadExtension",
    "videoTabs",
    "chooseFolder",
    "grant",
    "captureSettings",
    "manual",
    "startCapture",
    "generate",
    "remove",
    "restore",
    "selectAll",
    "selectNone",
    "collection",
  ])
    $(id).disabled = value;
  $("stop").disabled = !activeCapture;
  $("gallery")
    .querySelectorAll("button, input")
    .forEach((element) => {
      element.disabled = value;
    });
}
function clearImages() {
  renderVersion++;
  for (const url of thumbnails.values()) URL.revokeObjectURL(url);
  thumbnails.clear();
  gallerySignature = "";
  sheetSignature = "";
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  $("preview").close();
}
function command(name, options) {
  if (!port) return Promise.reject(new Error("Connect a YouTube video first."));
  const id = crypto.randomUUID();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(
        new Error(
          "YouTube did not respond. Reload the video tab and reconnect.",
        ),
      );
    }, 10000);
    pending.set(id, { resolve, reject, timer });
    try {
      port.postMessage({ type: "command", id, command: name, options });
    } catch (error) {
      clearTimeout(timer);
      pending.delete(id);
      reject(error);
    }
  });
}
async function listTabs() {
  const old = $("videoTabs").value;
  const tabs = await chrome.tabs.query({
    url: ["https://www.youtube.com/*", "https://m.youtube.com/*"],
    currentWindow: true,
  });
  tabs.sort(
    (a, b) =>
      Number(b.active) - Number(a.active) ||
      (b.lastAccessed || 0) - (a.lastAccessed || 0),
  );
  $("videoTabs").replaceChildren(
    ...tabs
      .filter((tab) => core.videoId(tab.url))
      .map((tab) => {
        const option = document.createElement("option");
        option.value = tab.id;
        option.textContent = tab.title || tab.url;
        return option;
      }),
  );
  if ([...$("videoTabs").options].some((option) => option.value === old))
    $("videoTabs").value = old;
}
function collection() {
  return $("collection").value || null;
}
function visibleFrames() {
  return (data?.frames || []).filter(
    (frame) => !frame.removed && frame.sequence === collection(),
  );
}
async function openPreview(path, caption) {
  const file = await store.file(source, path);
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  $("previewImage").src = previewUrl;
  $("previewCaption").textContent = caption;
  $("preview").showModal();
}
async function thumbnail(path) {
  const key = `${source.id}/${path}`;
  if (thumbnails.has(key)) return thumbnails.get(key);
  const bitmap = await createImageBitmap(await store.file(source, path), {
    resizeWidth: 320,
    resizeQuality: "medium",
  });
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    const url = URL.createObjectURL(await canvasBlob(canvas, "image/jpeg"));
    thumbnails.set(key, url);
    return url;
  } finally {
    bitmap.close();
  }
}
async function updateFrames(change) {
  if (busy) throw new Error("Stop capture before editing the gallery.");
  if (!store || !source)
    throw new Error("Connect a video and output folder first.");
  setBusy(true);
  try {
    data = await store.mutate(source, change);
    await render();
  } finally {
    setBusy(false);
  }
}
async function render() {
  const version = ++renderVersion;
  const previousCollection = $("collection").value;
  const options = [new Option("Still frames", "")];
  for (const sequence of data?.sequences || [])
    options.push(
      new Option(
        `${sequence.id} · ${sequence.fps} FPS · ${sequence.status}`,
        sequence.id,
      ),
    );
  $("collection").replaceChildren(...options);
  if (options.some((option) => option.value === previousCollection))
    $("collection").value = previousCollection;
  const frames = visibleFrames();
  page = Math.min(page, Math.max(0, Math.ceil(frames.length / pageSize) - 1));
  const slice = frames.slice(page * pageSize, (page + 1) * pageSize);
  $("frameCount").textContent =
    `${frames.length} frames / ${frames.filter((frame) => frame.selected).length} selected`;
  $("pageNumber").textContent =
    `Page ${page + 1} / ${Math.max(1, Math.ceil(frames.length / pageSize))}`;
  $("previousPage").disabled = page === 0;
  $("nextPage").disabled = (page + 1) * pageSize >= frames.length;
  const signature = JSON.stringify([
    source?.id,
    collection(),
    page,
    slice.map((frame) => [frame.path, frame.selected]),
    busy,
  ]);
  if (signature !== gallerySignature) {
    const fragment = document.createDocumentFragment();
    for (const frame of slice) {
      const article = document.createElement("article");
      article.className = `frame${frame.selected ? " selected" : ""}`;
      const imageButton = document.createElement("button");
      imageButton.className = "image";
      imageButton.setAttribute("aria-label", `Preview frame ${frame.number}`);
      const image = document.createElement("img");
      image.className = "thumbnail";
      image.alt = `Frame ${frame.number} at ${core.timestamp(frame.timestamp)}`;
      try {
        image.src = await thumbnail(frame.path);
      } catch (error) {
        image.alt = `Image unavailable: ${error.message}`;
      }
      if (version !== renderVersion) return;
      imageButton.append(image);
      imageButton.addEventListener("click", () =>
        openPreview(frame.path, image.alt).catch(report),
      );
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = frame.selected;
      checkbox.addEventListener("change", () =>
        updateFrames((metadata) => {
          metadata.frames.find((item) => item.path === frame.path).selected =
            checkbox.checked;
        }).catch(report),
      );
      label.append(
        checkbox,
        `#${core.pad(frame.number)} ${core.timestamp(frame.timestamp)}`,
      );
      const order = document.createElement("div");
      order.className = "order";
      for (const [direction, text] of [
        [-1, "←"],
        [1, "→"],
      ]) {
        const button = document.createElement("button");
        button.textContent = text;
        button.setAttribute(
          "aria-label",
          `Move frame ${frame.number} ${direction < 0 ? "earlier" : "later"}`,
        );
        button.disabled = busy;
        button.addEventListener("click", () =>
          updateFrames((metadata) => {
            const group = metadata.frames.filter(
              (item) => !item.removed && item.sequence === frame.sequence,
            );
            const index = group.findIndex((item) => item.path === frame.path);
            const other = group[index + direction];
            if (!other) return;
            const a = metadata.frames.findIndex(
              (item) => item.path === frame.path,
            );
            const b = metadata.frames.findIndex(
              (item) => item.path === other.path,
            );
            [metadata.frames[a], metadata.frames[b]] = [
              metadata.frames[b],
              metadata.frames[a],
            ];
          }).catch(report),
        );
        order.append(button);
      }
      imageButton.disabled = busy;
      checkbox.disabled = busy;
      article.append(imageButton, label, order);
      const narration = core.narrationAt(
        transcripts.forVideo(source.id),
        frame.timestamp,
      );
      if (narration.length) {
        const paragraph = document.createElement("p");
        paragraph.className = "narration";
        paragraph.textContent = narration
          .map((segment) => segment.text)
          .join(" ");
        article.append(paragraph);
      }
      fragment.append(article);
    }
    if (!slice.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Capture frames to build this collection.";
      fragment.append(empty);
    }
    $("gallery").replaceChildren(fragment);
    gallerySignature = signature;
  }
  const sheets = (data?.sheets || []).filter(
    (sheet) => sheet.sequence === collection(),
  );
  const nextSheetSignature = JSON.stringify([
    source?.id,
    collection(),
    sheets.map((sheet) => sheet.path),
  ]);
  if (nextSheetSignature !== sheetSignature) {
    const fragment = document.createDocumentFragment();
    for (const sheet of sheets) {
      const button = document.createElement("button");
      const image = document.createElement("img");
      image.alt = `Contact sheet with ${sheet.frames.length} frames`;
      try {
        image.src = await thumbnail(sheet.path);
      } catch {
        image.alt = "Preview unavailable";
      }
      if (version !== renderVersion) return;
      button.append(image, sheet.path.split("/").pop());
      button.addEventListener("click", () =>
        openPreview(
          sheet.path,
          `${sheet.path} · ${sheet.width} × ${sheet.height}`,
        ).catch(report),
      );
      fragment.append(button);
    }
    $("sheets").replaceChildren(fragment);
    sheetSignature = nextSheetSignature;
  }
  const keep = new Set(
    [...slice, ...sheets].map((item) => `${source?.id}/${item.path}`),
  );
  for (const [key, url] of thumbnails) {
    if (!keep.has(key)) {
      URL.revokeObjectURL(url);
      thumbnails.delete(key);
    }
  }
}
async function useSource(next) {
  clearImages();
  source = next;
  data = null;
  page = 0;
  $("videoTitle").textContent = source.title;
  $("videoDetails").textContent =
    `${source.id} · ${source.width} × ${source.height} · ${source.duration === null ? "Live" : core.timestamp(source.duration)}${source.channel ? ` · ${source.channel}` : ""}`;
  $("start").value = String(Math.floor(source.currentTime * 1000) / 1000);
  $("end").value = source.duration === null ? "" : String(source.duration);
  $("collection").value = "";
  if (
    store &&
    (await root.queryPermission({ mode: "readwrite" })) === "granted"
  )
    data = await store.load(source);
  await render();
  transcripts.setSource(source).catch((error) => transcripts.error(error));
}
async function finishCapture(message) {
  const capture = activeCapture;
  activeCapture = null;
  try {
    if (capture?.sequence && store && source) {
      data = await store.mutate(source, (metadata) => {
        const sequence = metadata.sequences.find(
          (item) => item.id === capture.sequence,
        );
        sequence.status = message.error
          ? "error"
          : message.cancelled
            ? "stopped"
            : "complete";
        sequence.finishedAt = new Date().toISOString();
        if (message.error) sequence.error = message.error;
      });
    }
    status(
      message.error ||
        message.warning ||
        (message.cancelled
          ? "Capture stopped. Saved frames are in your output folder."
          : "Capture complete. Frames and metadata saved."),
      Boolean(message.error),
    );
  } finally {
    setBusy(false);
    await render();
  }
}
async function receive(message) {
  if (message.type === "reply") {
    const request = pending.get(message.id);
    if (!request) return;
    clearTimeout(request.timer);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error));
    else request.resolve(message.result);
  } else if (message.type === "frame") {
    const destination = port;
    try {
      if (!activeCapture || message.source.id !== source?.id)
        throw new Error("Capture source does not match the connected video.");
      data = await store.saveFrame(
        source,
        activeCapture.options,
        activeCapture.sequence,
        message.frame,
      );
      destination.postMessage({ type: "saved", id: message.id });
      status(
        `Saved ${data.frames.filter((frame) => !frame.removed).length} frames. Latest: ${core.timestamp(message.frame.timestamp)}`,
      );
      await render();
    } catch (error) {
      try {
        destination.postMessage({
          type: "saved",
          id: message.id,
          error: error.message,
        });
      } catch {
        /* The video tab closed. */
      }
      report(error);
    }
  } else if (message.type === "done") await finishCapture(message);
}
async function connect() {
  if (busy) return;
  setBusy(true);
  try {
    await listTabs();
    const tabId = Number($("videoTabs").value);
    if (!tabId)
      throw new Error("Open a YouTube video in this browser window first.");
    await ensureCaptureScript(tabId);
    $("reloadExtension").hidden = true;
    if (port) port.disconnect();
    port = chrome.tabs.connect(tabId, { name: "frame-study" });
    const connection = port;
    port.onMessage.addListener((message) => receive(message).catch(report));
    port.onDisconnect.addListener(() => {
      const connectionError = chrome.runtime.lastError?.message;
      if (port !== connection) return;
      const reason =
        (connectionError &&
        /Receiving end does not exist|Could not establish connection/i.test(
          connectionError,
        )
          ? "The YouTube capture script disconnected. Click Connect video to reconnect, or reload the YouTube page if needed."
          : connectionError) ||
        "Video connection closed. Reload the YouTube tab and reconnect.";
      port = null;
      for (const request of pending.values()) {
        clearTimeout(request.timer);
        request.reject(new Error(reason));
      }
      pending.clear();
      if (activeCapture) finishCapture({ error: reason }).catch(report);
      else report(new Error(reason));
    });
    await useSource(await command("info"));
    status("Video connected. Select a folder, then capture.");
  } catch (error) {
    if (error.code === "SCRIPTING_UNAVAILABLE")
      $("reloadExtension").hidden = false;
    throw error;
  } finally {
    setBusy(false);
  }
}
function optionsFor(mode, currentSource) {
  return {
    mode,
    method: $("method").value,
    interval: Number($("interval").value),
    fps: Number($("fps").value),
    threshold: Number($("threshold").value) / 100,
    start: mode === "manual" ? 0 : core.parseTime($("start").value),
    end:
      mode === "manual" || !$("end").value.trim()
        ? currentSource.duration
        : core.parseTime($("end").value),
  };
}
async function capture(mode) {
  if (busy) return;
  setBusy(true);
  try {
    if (!store)
      throw new Error("Select plugin/result as your output folder first.");
    await store.permission();
    const currentSource = await command("info");
    if (currentSource.id !== source?.id) {
      await useSource(currentSource);
      throw new Error(
        "Video changed. Range was reset; review it and start capture again.",
      );
    }
    const options = optionsFor(mode, currentSource);
    core.validateOptions(options, currentSource.duration);
    activeCapture = { options, sequence: null };
    if (mode === "motion") {
      const result = await store.startSequence(source, options);
      data = result.data;
      activeCapture.sequence = result.sequence;
      await render();
      $("collection").value = result.sequence;
    }
    $("stop").disabled = false;
    status(
      options.method === "seek"
        ? "Capturing range. Playback will be restored when finished."
        : "Watching decoded frames. Play the video; keep this panel open.",
    );
    await command("capture", options);
  } catch (error) {
    if (activeCapture) await finishCapture({ error: error.message });
    else {
      setBusy(false);
      throw error;
    }
  }
}
async function generate() {
  if (busy) return;
  if (!store || !source)
    throw new Error("Connect a video and output folder first.");
  const frames = visibleFrames().filter((frame) => frame.selected);
  if (!frames.length)
    throw new Error("Select at least one frame in this collection.");
  const grid = Number($("grid").value);
  const cellWidth = Number($("cellWidth").value);
  const sequence = collection();
  const groups = core.batches(frames, grid);
  const jpeg = $("format").value === "both";
  setBusy(true);
  try {
    for (let i = 0; i < groups.length; i++) {
      status(`Generating sheet ${i + 1} of ${groups.length}…`);
      const canvas = await renderSheet(groups[i], {
        grid,
        cellWidth,
        title: `${source.title} | ${source.id}${sequence ? ` | ${sequence}` : ""}`,
        load: (path) => store.file(source, path),
      });
      data = await store.saveSheet(
        source,
        sequence,
        await canvasBlob(canvas),
        jpeg ? await canvasBlob(canvas, "image/jpeg") : null,
        {
          grid,
          cellWidth,
          width: canvas.width,
          height: canvas.height,
          frames: groups[i].map((frame) => frame.path),
        },
      );
      canvas.width = 1;
      canvas.height = 1;
    }
    status(
      `Saved ${groups.length} PNG contact sheet${groups.length === 1 ? "" : "s"}${jpeg ? " and JPEG copies" : ""}.`,
    );
  } finally {
    setBusy(false);
    await render();
  }
}
// These handlers invoke permission-gated APIs directly within the user gesture.
$("chooseFolder").addEventListener("click", async () => {
  if (busy) return;
  try {
    const selected = await window.showDirectoryPicker({
      id: "frame-study-output",
      mode: "readwrite",
      ...(root ? { startIn: root } : {}),
    });
    await rememberedDirectory(selected);
    root = selected;
    store = new LocalStore(root);
    $("folderName").textContent = `${root.name}/<video-id>/`;
    $("grant").hidden = true;
    clearImages();
    if (source) {
      data = await store.load(source);
      await render();
    }
    status(
      "Output folder ready. Files save immediately after capture or generation.",
    );
  } catch (error) {
    if (error.name !== "AbortError") report(error);
  }
});
$("grant").addEventListener("click", async () => {
  if (!root || busy) return;
  try {
    if ((await root.requestPermission({ mode: "readwrite" })) !== "granted")
      throw new Error(
        "Folder access was not granted. Click again or choose another folder.",
      );
    $("grant").hidden = true;
    if (source) {
      data = await store.load(source);
      await render();
    }
    status("Output folder access restored.");
  } catch (error) {
    report(error);
  }
});
on("connect", "click", connect);
on("reloadExtension", "click", () => chrome.runtime.reload());
on("manual", "click", () => capture("manual"));
on("startCapture", "click", () => capture($("mode").value));
on("stop", "click", () => command("stop"));
on("generate", "click", generate);
on("collection", "change", async () => {
  page = 0;
  await render();
});
on("previousPage", "click", async () => {
  page--;
  await render();
});
on("nextPage", "click", async () => {
  page++;
  await render();
});
on("selectAll", "click", () =>
  updateFrames((metadata) =>
    metadata.frames
      .filter((frame) => !frame.removed && frame.sequence === collection())
      .forEach((frame) => {
        frame.selected = true;
      }),
  ),
);
on("selectNone", "click", () =>
  updateFrames((metadata) =>
    metadata.frames
      .filter((frame) => !frame.removed && frame.sequence === collection())
      .forEach((frame) => {
        frame.selected = false;
      }),
  ),
);
on("remove", "click", () =>
  updateFrames((metadata) =>
    metadata.frames
      .filter((frame) => frame.selected && frame.sequence === collection())
      .forEach((frame) => {
        frame.removed = true;
      }),
  ),
);
on("restore", "click", () =>
  updateFrames((metadata) =>
    metadata.frames
      .filter((frame) => frame.sequence === collection())
      .forEach((frame) => {
        frame.removed = false;
      }),
  ),
);
on("threshold", "input", () => {
  $("thresholdValue").textContent = `${$("threshold").value}%`;
});
on("closePreview", "click", () => {
  $("preview").close();
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
});

async function init() {
  root = await rememberedDirectory();
  if (root) {
    store = new LocalStore(root);
    $("folderName").textContent = `${root.name}/<video-id>/`;
    $("grant").hidden =
      (await root.queryPermission({ mode: "readwrite" })) === "granted";
  }
  await listTabs();
}
const transcripts = new TranscriptPanel({
  changed: async () => {
    gallerySignature = "";
    await render();
  },
  jump: (videoId, time) => command("seekTo", { videoId, time }),
  exportAnalysis: async () => {
    if (busy || !source || !store)
      throw new Error(
        "Connect a video and output folder, then stop capture before exporting analysis.",
      );
    const frames = visibleFrames().filter((frame) => frame.selected);
    if (!frames.length)
      throw new Error("Select at least one frame to export scene analysis.");
    return store.saveAnalysis(source, frames, transcripts.forVideo(source.id));
  },
});
init().catch(report);
