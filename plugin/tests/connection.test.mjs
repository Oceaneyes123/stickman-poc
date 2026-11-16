import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { ensureCaptureScript } from "../connection.js";

test("missing scripting API reports a required extension reload instead of a TypeError", async () => {
  for (const permissions of [["sidePanel"], ["sidePanel", "scripting"]]) {
    globalThis.chrome = {
      tabs: {
        sendMessage: async () => {
          throw new Error("Receiving end does not exist.");
        },
      },
      runtime: { getManifest: () => ({ permissions }) },
    };
    await assert.rejects(
      ensureCaptureScript(7),
      (error) =>
        error.code === "SCRIPTING_UNAVAILABLE" &&
        error.message.includes("Reload extension") &&
        !error.message.includes("Cannot read properties"),
    );
  }
});

test("existing capture receiver connects without injecting or changing playback", async () => {
  let injected = false;
  globalThis.chrome = {
    tabs: { sendMessage: async () => ({ ready: true }) },
    scripting: {
      executeScript: async () => {
        injected = true;
      },
    },
  };
  await ensureCaptureScript(7);
  assert.equal(injected, false);
});

test("missing receiver after reload injects both scripts in order and verifies readiness", async () => {
  const calls = [];
  let ready = false;
  globalThis.chrome = {
    tabs: {
      sendMessage: async (tabId, message, options) => {
        calls.push({ tabId, message, options });
        if (!ready)
          throw new Error(
            "Could not establish connection. Receiving end does not exist.",
          );
        return { ready: true };
      },
    },
    scripting: {
      executeScript: async (options) => {
        calls.push(options);
        ready = true;
      },
    },
  };
  await ensureCaptureScript(7);
  assert.deepEqual(calls[1], {
    target: { tabId: 7, frameIds: [0] },
    files: ["core.js", "content.js"],
  });
  assert.equal(calls.length, 3);
});

test("permission failures give recovery steps and closed tabs are not reinjected", async () => {
  let attempts = 0;
  globalThis.chrome = {
    tabs: {
      sendMessage: async () => {
        throw new Error("Receiving end does not exist.");
      },
    },
    scripting: {
      executeScript: async () => {
        attempts++;
        throw new Error("Cannot access contents of the page.");
      },
    },
  };
  await assert.rejects(
    ensureCaptureScript(7),
    /Cannot access contents.*Reload the YouTube page/,
  );
  chrome.tabs.sendMessage = async () => {
    throw new Error("No tab with id: 7.");
  };
  await assert.rejects(ensureCaptureScript(7), /No tab with id/);
  assert.equal(attempts, 1);
});

test("repeated injection creates one receiver; a stale extension context can reinstall", async () => {
  function event() {
    const listeners = new Set();
    return {
      listeners,
      addListener: (listener) => listeners.add(listener),
      hasListener: (listener) => listeners.has(listener),
    };
  }
  const onConnect = event();
  const onMessage = event();
  const context = {
    FrameStudy: {},
    chrome: { runtime: { onConnect, onMessage } },
  };
  const source = await readFile(
    new URL("../content.js", import.meta.url),
    "utf8",
  );
  runInNewContext(source, context);
  runInNewContext(source, context);
  assert.equal(onConnect.listeners.size, 1);
  assert.equal(onMessage.listeners.size, 1);
  let ready;
  [...onMessage.listeners][0]({ type: "frame-study-ping" }, {}, (reply) => {
    ready = reply.ready;
  });
  assert.equal(ready, true);
  onConnect.listeners.clear();
  onMessage.listeners.clear();
  runInNewContext(source, context);
  assert.equal(onConnect.listeners.size, 1);
  assert.equal(onMessage.listeners.size, 1);
});
