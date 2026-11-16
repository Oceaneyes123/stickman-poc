(() => {
  const source = {
    id: "abcdefghijk",
    title: "Browser capture fixture",
    width: 320,
    height: 180,
    duration: 4,
    currentTime: 0,
  };
  function signal() {
    const listeners = new Set();
    return {
      addListener: (callback) => listeners.add(callback),
      emit: (message) => {
        for (const callback of listeners) callback(message);
      },
    };
  }
  globalThis.chrome = {
    scripting: {
      executeScript: async () => {
        globalThis.captureFixtureReady = true;
      },
    },
    tabs: {
      sendMessage: async () => {
        if (!globalThis.captureFixtureReady)
          throw new Error(
            "Could not establish connection. Receiving end does not exist.",
          );
        return { ready: true };
      },
      query: async () => [
        {
          id: 1,
          active: true,
          url: "https://www.youtube.com/watch?v=abcdefghijk",
          title: source.title,
        },
      ],
      connect: () => {
        const port = {
          onMessage: signal(),
          onDisconnect: signal(),
          disconnect: () => {},
        };
        port.postMessage = (message) => {
          if (message.command === "seekTo")
            globalThis.lastTranscriptSeek = message.options;
          queueMicrotask(() =>
            port.onMessage.emit({
              type: "reply",
              id: message.id,
              result: source,
            }),
          );
        };
        return port;
      },
    },
    runtime: {
      id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      getManifest: () => ({ version: "1.1.0", permissions: ["sidePanel"] }),
      reload: () => {
        globalThis.extensionReloadRequested = true;
      },
    },
  };
  const realFetch = globalThis.fetch.bind(globalThis);
  let job = null;
  const transcript = {
    videoId: source.id,
    source: "youtube_manual",
    model: null,
    language: "en",
    availableCaptions: [{ language: "en", source: "manual" }],
    segments: [
      { start: 0, end: 0.6, text: "Imagine losing your money." },
      { start: 0.6, end: 1.2, text: "Keep it local." },
    ],
  };
  globalThis.fetch = async (url, options = {}) => {
    if (!String(url).startsWith("http://127.0.0.1:8765/"))
      return realFetch(url, options);
    const path = new URL(url).pathname;
    if (path === "/api/transcript" && options.method === "POST") {
      globalThis.lastTranscriptRequest = JSON.parse(options.body);
      transcript.source = globalThis.lastTranscriptRequest.force_whisper
        ? "whisper"
        : "youtube_manual";
      transcript.model =
        transcript.source === "whisper"
          ? globalThis.lastTranscriptRequest.model
          : null;
      job = {
        id: "fixture-job",
        videoId: source.id,
        status: "queued",
        phase: "queued",
        progress: 0,
        message: "Waiting for local Whisper.",
        warnings: [],
      };
      return new Response(JSON.stringify(job));
    }
    if (path === "/api/jobs")
      return new Response(JSON.stringify(job ? [job] : []));
    if (path === "/api/jobs/fixture-job/cancel") {
      job = { ...job, status: "cancelled", message: "Cancelled." };
      return new Response(JSON.stringify(job));
    }
    if (path === "/api/jobs/fixture-job") {
      job = {
        ...job,
        status: "complete",
        progress: 100,
        message: "Transcript JSON, TXT, and SRT saved locally.",
      };
      return new Response(JSON.stringify(job));
    }
    if (path.startsWith("/api/transcript/"))
      return new Response(JSON.stringify(transcript));
    return new Response(
      JSON.stringify({ detail: "Fixture endpoint unavailable" }),
      { status: 404 },
    );
  };
})();
