// Runs real Chrome video/canvas/filesystem checks without test dependencies.
import { createServer } from "node:http";
import { spawn, execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const plugin = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporary = await mkdtemp(join(tmpdir(), "frame-study-browser-"));
const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
let browser;
let socket;
let server;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  const fixture = join(temporary, "fixture.mp4");
  execFileSync(process.env.FFMPEG_PATH || "ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "lavfi",
    "-i",
    "color=black:s=320x180:r=30:d=1",
    "-f",
    "lavfi",
    "-i",
    "color=white:s=320x180:r=30:d=1",
    "-filter_complex",
    "[0:v][1:v]concat=n=2:v=1:a=0[v]",
    "-map",
    "[v]",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    join(temporary, "two.mp4"),
  ]);
  execFileSync(process.env.FFMPEG_PATH || "ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-stream_loop",
    "1",
    "-i",
    join(temporary, "two.mp4"),
    "-c",
    "copy",
    "-t",
    "4",
    fixture,
  ]);
  server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, "http://localhost").pathname;
      const path =
        pathname === "/fixture.mp4"
          ? fixture
          : resolve(plugin, `.${decodeURIComponent(pathname)}`);
      if (path !== fixture && !path.startsWith(plugin + sep)) {
        response.writeHead(403).end();
        return;
      }
      let contents = await readFile(path);
      if (pathname === "/panel.html") {
        // Supply only the browser API transport for a visual startup smoke check.
        contents = Buffer.from(
          contents
            .toString()
            .replace(
              '<script src="core.js">',
              '<script src="tests/panel-mock.js"></script><script src="core.js">',
            ),
        );
      }
      const type = path.endsWith(".mp4")
        ? "video/mp4"
        : path.endsWith(".svg")
          ? "image/svg+xml"
          : path.endsWith(".png")
            ? "image/png"
            : path.endsWith(".js")
              ? "text/javascript"
              : path.endsWith(".css")
                ? "text/css"
                : "text/html";
      const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      if (range) {
        const start = Number(range[1]);
        const end = range[2]
          ? Math.min(Number(range[2]), contents.length - 1)
          : contents.length - 1;
        response.writeHead(206, {
          "Content-Type": type,
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${contents.length}`,
          "Content-Length": end - start + 1,
        });
        response.end(contents.subarray(start, end + 1));
      } else {
        response.writeHead(200, {
          "Content-Type": type,
          "Accept-Ranges": "bytes",
          "Content-Length": contents.length,
        });
        response.end(contents);
      }
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = spawn(
    chromePath,
    [
      "--headless=new",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      "--autoplay-policy=no-user-gesture-required",
      "--remote-debugging-port=0",
      `--user-data-dir=${join(temporary, "profile")}`,
      "--window-size=1100,1000",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  browser.on("error", (error) => {
    console.error(error.message);
  });
  let debuggingPort;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      debuggingPort = (
        await readFile(join(temporary, "profile", "DevToolsActivePort"), "utf8")
      ).split("\n")[0];
      break;
    } catch {
      await pause(100);
    }
  }
  if (!debuggingPort)
    throw new Error(
      "Chrome did not start. Set CHROME_PATH to your Chrome executable.",
    );
  const targets = await (
    await fetch(`http://127.0.0.1:${debuggingPort}/json/list`)
  ).json();
  socket = new WebSocket(
    targets.find((target) => target.type === "page").webSocketDebuggerUrl,
  );
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let serial = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown")
      exceptions.push(message.params.exceptionDetails.text);
    const request = pending.get(message.id);
    if (request) {
      pending.delete(message.id);
      clearTimeout(request.timer);
      message.error
        ? request.reject(new Error(message.error.message))
        : request.resolve(message.result);
    }
  });
  function cdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++serial;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 55000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await cdp("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails)
      throw new Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text,
      );
    return result.result.value;
  }
  async function until(expression) {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression)) return;
      await pause(100);
    }
    throw new Error(
      `Panel condition timed out: ${expression}; ${await evaluate('document.getElementById("status").textContent')}`,
    );
  }
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp("Page.bringToFront");
  await cdp("Page.navigate", { url: `${origin}/tests/browser.html` });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate('typeof runBrowserTests === "function"')) break;
    await pause(100);
  }
  console.log(JSON.stringify(await evaluate("runBrowserTests()"), null, 2));
  await cdp("Page.navigate", { url: `${origin}/panel.html` });
  await pause(800);
  const panel = await evaluate(
    '({title: document.title, status: document.getElementById("status").textContent, folder: document.getElementById("folderName").textContent, overflow: document.documentElement.scrollWidth > innerWidth})',
  );
  if (panel.title !== "Frame Study" || panel.overflow || exceptions.length)
    throw new Error(
      `Panel smoke failed: ${JSON.stringify({ panel, exceptions })}`,
    );
  await evaluate(
    'globalThis.fixtureScripting = chrome.scripting; chrome.scripting = undefined; document.getElementById("connect").click()',
  );
  await until(
    '!document.getElementById("reloadExtension").hidden && !document.getElementById("reloadExtension").disabled',
  );
  if (
    !(await evaluate(
      'document.getElementById("status").textContent.includes("without the scripting permission")',
    ))
  )
    throw new Error(
      "Missing scripting API did not produce the correct recovery message.",
    );
  await evaluate('document.getElementById("reloadExtension").click()');
  await until("globalThis.extensionReloadRequested === true");
  await evaluate(
    'chrome.scripting = globalThis.fixtureScripting; document.getElementById("connect").click()',
  );
  await until(
    'document.getElementById("status").textContent.startsWith("Video connected")',
  );
  await evaluate(
    'document.getElementById("collection").value = "sequence_001"; document.getElementById("collection").dispatchEvent(new Event("change"))',
  );
  await until('document.querySelectorAll(".frame").length === 5');
  await until('document.querySelectorAll(".frame .narration").length === 5');
  await evaluate(
    'document.getElementById("transcriptSearch").value = "keep"; document.getElementById("transcriptSearch").dispatchEvent(new Event("input"))',
  );
  await until('document.querySelectorAll(".transcript-segment").length === 1');
  await evaluate('document.querySelector(".transcript-segment").click()');
  await until(
    'globalThis.lastTranscriptSeek?.time === .6 && globalThis.lastTranscriptSeek?.videoId === "abcdefghijk"',
  );
  await evaluate('document.getElementById("forceWhisper").click()');
  await until(
    'document.getElementById("transcriptSummary").textContent.includes("whisper / small") && !document.getElementById("extractTranscript").disabled',
  );
  if (
    !(await evaluate(
      'globalThis.lastTranscriptRequest.force_whisper && globalThis.lastTranscriptRequest.model === "small"',
    ))
  )
    throw new Error("Whisper controls did not send selected settings.");
  await evaluate('document.querySelector(".order button:last-child").click()');
  await until(
    '!document.getElementById("connect").disabled && document.querySelector(".frame label").textContent.includes("#0002")',
  );
  await evaluate('document.getElementById("selectNone").click()');
  await until(
    'document.getElementById("frameCount").textContent.endsWith("0 selected")',
  );
  await evaluate('document.querySelector(".frame input").click()');
  await until(
    'document.getElementById("frameCount").textContent.endsWith("1 selected")',
  );
  await evaluate('document.getElementById("remove").click()');
  await until('document.querySelectorAll(".frame").length === 4');
  await evaluate('document.getElementById("restore").click()');
  await until('document.querySelectorAll(".frame").length === 5');
  await evaluate('document.getElementById("selectAll").click()');
  await until(
    'document.getElementById("frameCount").textContent.endsWith("5 selected") && !document.getElementById("connect").disabled',
  );
  await evaluate(
    'document.getElementById("grid").value = "3"; document.getElementById("cellWidth").value = "640"; document.getElementById("generate").click()',
  );
  await until(
    'document.getElementById("status").textContent.startsWith("Saved 1 PNG contact sheet")',
  );
  await until('document.querySelectorAll("#sheets button").length === 2');
  await evaluate('document.querySelector(".frame .image").click()');
  await until('document.getElementById("preview").open');
  await evaluate('document.getElementById("closePreview").click()');
  await evaluate('document.getElementById("exportAnalysis").click()');
  await until(
    'document.getElementById("transcriptStatus").textContent.startsWith("Saved scene-analysis/")',
  );
  const analysisCount = await evaluate(
    '(async () => { const root = await navigator.storage.getDirectory(); const video = await root.getDirectoryHandle("abcdefghijk"); const dir = await video.getDirectoryHandle("scene-analysis"); const file = await (await dir.getFileHandle("analysis_001.json")).getFile(); return JSON.parse(await file.text()).frames.filter(frame => frame.narration.length).length; })()',
  );
  if (analysisCount !== 5)
    throw new Error("Scene analysis export lost synchronized narration.");
  if (exceptions.length)
    throw new Error(`Panel interaction exception: ${exceptions.join(", ")}`);
  console.log(
    "Panel gallery selection, reorder, remove/restore, sheet generation, and full preview: PASS",
  );
  console.log(
    "Transcript progress, model settings, search, timestamp jump, frame narration, and analysis JSON: PASS",
  );
  for (const width of [360, 1100]) {
    await cdp("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    if (await evaluate("document.documentElement.scrollWidth > innerWidth"))
      throw new Error(`Panel overflows at ${width}px`);
  }
  const screenshot = await cdp("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  if (process.env.FRAME_STUDY_SCREENSHOT)
    await writeFile(
      process.env.FRAME_STUDY_SCREENSHOT,
      Buffer.from(screenshot.data, "base64"),
    );
  console.log("Panel startup and responsive layout: PASS", panel);
} finally {
  socket?.close();
  if (browser && browser.exitCode === null) {
    browser.kill();
    await Promise.race([
      new Promise((resolve) => browser.once("exit", resolve)),
      pause(3000),
    ]);
  }
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(temporary, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 200,
  });
}
