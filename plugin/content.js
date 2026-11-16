(() => {
  if (
    globalThis.frameStudyConnectListener &&
    chrome.runtime.onConnect.hasListener(globalThis.frameStudyConnectListener)
  )
    return;
  const core = globalThis.FrameStudy;
  let owner = null;
  let job = null;
  let lastFrame = null;
  const video = () =>
    document.querySelector(
      "#movie_player video.html5-main-video, video.html5-main-video, video",
    );
  const isAd = () =>
    Boolean(
      document.querySelector(
        "#movie_player.ad-showing, #movie_player.ad-interrupting",
      ),
    );
  function info() {
    const element = video();
    const id = core.videoId(location.href);
    if (!element || !id)
      throw new Error("Open a YouTube watch page or Short and load its video.");
    if (isAd())
      throw new Error("Wait until the YouTube advertisement finishes.");
    if (element.seeking)
      throw new Error("Wait for the current seek to finish.");
    if (!element.videoWidth || element.readyState < 2)
      throw new Error("Wait for the video frame to load.");
    if (element.mediaKeys)
      throw new Error("Protected video cannot be captured.");
    return {
      id,
      url: `https://www.youtube.com/watch?v=${id}`,
      title:
        document
          .querySelector("ytd-watch-metadata h1, h1.ytd-watch-metadata")
          ?.textContent?.trim() || document.title.replace(/ - YouTube$/, ""),
      channel:
        document
          .querySelector("#owner #channel-name a, ytd-channel-name a")
          ?.textContent?.trim() || "",
      duration: Number.isFinite(element.duration) ? element.duration : null,
      width: element.videoWidth,
      height: element.videoHeight,
      currentTime: element.currentTime,
      playbackRate: element.playbackRate,
    };
  }
  function assertSource(state) {
    if (state.cancelled) throw new Error("Capture stopped.");
    if (
      core.videoId(location.href) !== state.source.id ||
      video() !== state.element
    )
      throw new Error("Video changed. Reconnect before capturing.");
    if (isAd())
      throw new Error(
        "Advertisement detected. Capture stopped to avoid saving ad frames.",
      );
    if (state.element.mediaKeys)
      throw new Error("Protected video cannot be captured.");
  }
  function snapshot(element, time, source, requestedTime = null) {
    if (element.readyState < 2 || !element.videoWidth)
      throw new Error("No decoded video frame is available.");
    const canvas = document.createElement("canvas");
    canvas.width = element.videoWidth;
    canvas.height = element.videoHeight;
    try {
      canvas.getContext("2d", { alpha: false }).drawImage(element, 0, 0);
      const data = canvas.toDataURL("image/jpeg", 0.94);
      if (
        !data.startsWith("data:image/jpeg;base64,") ||
        data.length > 48 * 1024 * 1024
      )
        throw new Error(
          "Frame is too large to transfer. Select a lower YouTube quality.",
        );
      return {
        data,
        timestamp: time,
        timestampSource: source,
        requestedTime,
        width: canvas.width,
        height: canvas.height,
        capturedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error.name === "SecurityError")
        throw new Error(
          "Chrome blocked canvas access to this video (CORS/protected media). This extension cannot bypass that restriction.",
        );
      throw error;
    }
  }
  function sceneSample(element) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 36;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    try {
      context.drawImage(element, 0, 0, 64, 36);
      return context.getImageData(0, 0, 64, 36).data;
    } catch (error) {
      if (error.name === "SecurityError")
        throw new Error(
          "Chrome blocked scene sampling for this video. Canvas access is unavailable.",
        );
      throw error;
    }
  }
  function sendFrame(port, state, frame) {
    assertSource(state);
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      const timer = setTimeout(
        () =>
          finish(
            new Error(
              "Saving timed out. Check the output folder and reconnect.",
            ),
          ),
        30000,
      );
      const onMessage = (message) => {
        if (message.type === "saved" && message.id === id)
          finish(message.error ? new Error(message.error) : null);
      };
      const finish = (error) => {
        clearTimeout(timer);
        port.onMessage.removeListener(onMessage);
        state.abortSave = null;
        if (error) reject(error);
        else resolve();
      };
      state.abortSave = () => finish(new Error("Capture stopped."));
      port.onMessage.addListener(onMessage);
      port.postMessage({
        type: "frame",
        id,
        frame,
        source: state.source,
        options: state.options,
      });
    });
  }
  function cancel(state) {
    if (!state) return;
    state.cancelled = true;
    state.abortWait?.();
    state.abortSave?.();
  }
  async function observe(port, state) {
    const element = state.element;
    let next = state.options.start;
    let previous = null;
    let lastSaved = -Infinity;
    await new Promise((resolve, reject) => {
      let callback = null;
      let handling = false;
      const finish = (error) => {
        clearInterval(guard);
        if (callback !== null) element.cancelVideoFrameCallback(callback);
        state.abortWait = null;
        if (error) reject(error);
        else resolve();
      };
      const schedule = () => {
        callback = element.requestVideoFrameCallback(onFrame);
      };
      const guard = setInterval(() => {
        try {
          assertSource(state);
          if (!handling && element.ended) finish();
        } catch (error) {
          finish(error);
        }
      }, 500);
      state.abortWait = () => finish();
      const onFrame = async (_now, metadata) => {
        handling = true;
        try {
          assertSource(state);
          const time = metadata.mediaTime;
          lastFrame = { element, time, currentTime: element.currentTime };
          if (time >= state.options.end) {
            finish();
            return;
          }
          if (
            !element.seeking &&
            time >= next - 0.000001 &&
            time >= state.options.start
          ) {
            const target = next;
            next =
              state.options.start +
              (Math.floor(
                (time - state.options.start) / state.step + 0.000001,
              ) +
                1) *
                state.step;
            let accept = true;
            if (state.options.mode === "scene") {
              const sample = sceneSample(element);
              accept =
                core.difference(sample, previous) >= state.options.threshold &&
                time - lastSaved >= state.options.interval;
              if (accept) previous = sample;
            }
            if (accept) {
              const frame = snapshot(element, time, "mediaTime", target);
              frame.skippedSamples = Math.max(
                0,
                Math.floor((time - target) / state.step + 0.000001),
              );
              await sendFrame(port, state, frame);
              lastSaved = time;
            }
          }
          handling = false;
          if (!state.cancelled) schedule();
          else finish();
        } catch (error) {
          finish(error);
        }
      };
      schedule();
    });
  }
  function seekFrame(state, target) {
    const element = state.element;
    assertSource(state);
    if (!element.seeking && Math.abs(element.currentTime - target) < 0.000001) {
      const cached =
        lastFrame?.element === element &&
        Math.abs(lastFrame.currentTime - element.currentTime) < 0.000001;
      return Promise.resolve(
        snapshot(
          element,
          cached ? lastFrame.time : element.currentTime,
          cached ? "mediaTime" : "currentTime",
          target,
        ),
      );
    }
    return new Promise((resolve, reject) => {
      let callback;
      let decodedTime = null;
      const finish = (error, frame) => {
        clearTimeout(timer);
        if (callback !== undefined) element.cancelVideoFrameCallback(callback);
        element.removeEventListener("seeked", onSeeked);
        state.abortWait = null;
        if (error) reject(error);
        else resolve(frame);
      };
      const onFrame = (_now, metadata) => {
        try {
          assertSource(state);
          decodedTime = metadata.mediaTime;
          onSeeked();
        } catch (error) {
          finish(error);
        }
      };
      // Chrome can report presentation before “seeked” restores readyState.
      // The paused pixels stay fixed; wait for both events before reading them.
      const onSeeked = () => {
        if (decodedTime === null || element.seeking || element.readyState < 2)
          return;
        try {
          assertSource(state);
          lastFrame = {
            element,
            time: decodedTime,
            currentTime: element.currentTime,
          };
          finish(null, snapshot(element, decodedTime, "mediaTime", target));
        } catch (error) {
          finish(error);
        }
      };
      const timer = setTimeout(
        () =>
          finish(
            new Error(
              "No decoded frame after seeking. Keep the video tab visible and try again.",
            ),
          ),
        15000,
      );
      state.abortWait = () => finish(new Error("Capture stopped."));
      element.addEventListener("seeked", onSeeked);
      callback = element.requestVideoFrameCallback(onFrame);
      element.currentTime = target;
    });
  }
  async function seek(port, state) {
    const element = state.element;
    const original = {
      time: element.currentTime,
      paused: element.paused,
      rate: element.playbackRate,
    };
    element.pause();
    let previous = null;
    let lastSaved = -Infinity;
    try {
      const count = Math.ceil(
        (state.options.end - state.options.start) / state.step - 1e-9,
      );
      for (let i = 0; i < count; i++) {
        const target = state.options.start + i * state.step;
        const frame = await seekFrame(state, target);
        let accept = true;
        if (state.options.mode === "scene") {
          const sample = sceneSample(element);
          accept =
            core.difference(sample, previous) >= state.options.threshold &&
            target - lastSaved >= state.options.interval;
          if (accept) previous = sample;
        }
        if (accept) {
          await sendFrame(port, state, frame);
          lastSaved = target;
        }
      }
    } finally {
      if (
        core.videoId(location.href) === state.source.id &&
        video() === element &&
        !isAd()
      ) {
        if (
          element.seeking ||
          Math.abs(element.currentTime - original.time) > 0.000001
        ) {
          await new Promise((resolve) => {
            const complete = () => {
              clearTimeout(timer);
              element.removeEventListener("seeked", complete);
              resolve();
            };
            const timer = setTimeout(() => {
              state.restoreWarning =
                "Playback position restoration timed out. Check the video before continuing.";
              complete();
            }, 10000);
            element.addEventListener("seeked", complete, { once: true });
            element.currentTime = original.time;
          });
        }
        if (
          core.videoId(location.href) !== state.source.id ||
          video() !== element ||
          isAd()
        )
          return;
        element.playbackRate = original.rate;
        if (!original.paused) {
          try {
            await element.play();
          } catch {
            state.restoreWarning =
              "Capture finished; Chrome blocked resuming playback. Press Play on YouTube.";
          }
        }
      }
    }
  }
  const onConnect = (port) => {
    if (port.name !== "frame-study") return;
    if (owner) {
      port.onMessage.addListener((message) =>
        port.postMessage({
          type: "reply",
          id: message.id,
          error: "Another Frame Study panel owns this video. Close it first.",
        }),
      );
      return;
    }
    owner = port;
    const post = (message) => {
      try {
        port.postMessage(message);
      } catch {
        /* The panel closed. */
      }
    };
    port.onDisconnect.addListener(() => {
      cancel(job);
      if (owner === port) owner = null;
    });
    port.onMessage.addListener((message) => {
      if (message.type !== "command") return;
      (async () => {
        if (message.command === "info") return info();
        if (message.command === "stop") {
          cancel(job);
          return null;
        }
        if (message.command === "seekTo") {
          if (job)
            throw new Error(
              "Stop capture before jumping to a transcript timestamp.",
            );
          const current = info();
          const target = message.options;
          if (
            target?.videoId !== current.id ||
            !Number.isFinite(target.time) ||
            target.time < 0 ||
            target.time >= current.duration
          )
            throw new Error(
              "Transcript timestamp does not match the connected video or its duration.",
            );
          video().currentTime = target.time;
          return { time: target.time };
        }
        if (message.command !== "capture") throw new Error("Unknown command.");
        if (job)
          throw new Error("A capture is already running. Stop it first.");
        const source = info();
        const options = message.options;
        const step = core.validateOptions(options, source.duration);
        const state = {
          source,
          options,
          step,
          element: video(),
          cancelled: false,
        };
        job = state;
        (async () => {
          let error = null;
          try {
            if (options.mode === "manual") {
              const element = state.element;
              const cached =
                lastFrame?.element === element &&
                Math.abs(lastFrame.currentTime - element.currentTime) <
                  0.000001 &&
                !element.seeking;
              await sendFrame(
                port,
                state,
                snapshot(
                  element,
                  cached ? lastFrame.time : element.currentTime,
                  cached ? "mediaTime" : "currentTime",
                ),
              );
            } else if (options.method === "seek") await seek(port, state);
            else await observe(port, state);
          } catch (caught) {
            if (!state.cancelled) error = caught.message;
          } finally {
            if (job === state) job = null;
            post({
              type: "done",
              error,
              cancelled: state.cancelled,
              warning: state.restoreWarning || null,
            });
          }
        })();
        return { started: true };
      })().then(
        (result) => post({ type: "reply", id: message.id, result }),
        (error) =>
          post({ type: "reply", id: message.id, error: error.message }),
      );
    });
  };
  chrome.runtime.onConnect.addListener(onConnect);
  globalThis.frameStudyConnectListener = onConnect;
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "frame-study-ping") sendResponse({ ready: true });
  });
})();
