const core = globalThis.FrameStudy;
const $ = (id) => document.getElementById(id);
const ACTIVE = new Set(["queued", "uploading", "running", "cancelling"]);
const API = "http://127.0.0.1:8765";

export function transcriptVideoId(value) {
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  try {
    const parsed = new URL(value);
    if (
      parsed.protocol !== "https:" ||
      parsed.username ||
      parsed.password ||
      (parsed.port && parsed.port !== "443")
    )
      return null;
    if (parsed.hostname === "youtu.be")
      return /^\/[A-Za-z0-9_-]{11}\/?$/.test(parsed.pathname)
        ? parsed.pathname.replaceAll("/", "")
        : null;
    return core.videoId(parsed.href);
  } catch {
    return null;
  }
}

export async function transcriptApi(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    mode: "cors",
    cache: "no-store",
    credentials: "omit",
    signal: AbortSignal.any([
      AbortSignal.timeout(options.body instanceof Blob ? 300000 : 15000),
      ...(options.signal ? [options.signal] : []),
    ]),
    headers: {
      "X-Frame-Study-Extension": chrome.runtime.id,
      ...options.headers,
    },
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Local backend returned HTTP ${response.status} without JSON. Check its terminal and retry.`,
    );
  }
  if (!response.ok)
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : JSON.stringify(data.detail || data),
    );
  return data;
}

export class TranscriptPanel {
  constructor({ changed, jump, exportAnalysis }) {
    this.document = null;
    this.job = null;
    this.generation = 0;
    this.timer = null;
    this.source = null;
    this.changed = changed;
    this.jump = jump;
    this.exportAnalysis = exportAnalysis;
    $("backendCommand").textContent =
      `python -m plugin.backend --extension-id ${chrome.runtime.id || "YOUR_EXTENSION_ID"}`;
    const on = (id, event, handler) =>
      $(id).addEventListener(event, () =>
        Promise.resolve()
          .then(handler)
          .catch((error) => this.error(error)),
      );
    on("extractTranscript", "click", () => this.start(false));
    on("forceWhisper", "click", () => this.start(true));
    on("cancelTranscript", "click", async () => {
      if (this.uploadAbort) {
        this.uploadAbort.abort();
        return;
      }
      if (!this.job) return;
      const job = await transcriptApi(`/api/jobs/${this.job.id}/cancel`, {
        method: "POST",
      });
      await this.updateJob(job, this.generation);
    });
    on("refreshTranscript", "click", () => this.refresh());
    on("uploadAudio", "click", () => this.upload("audio"));
    on("uploadTranscript", "click", () => this.upload("transcript"));
    on("transcriptSearch", "input", () => this.render());
    on("exportAnalysis", "click", async () => {
      const path = await this.exportAnalysis();
      this.status(
        `Saved ${path} with synchronized narration. Untimed text is not matched to frames.`,
      );
    });
  }
  status(text, error = false) {
    $("transcriptStatus").textContent = text;
    $("transcriptStatus").classList.toggle("error", error);
  }
  error(error) {
    this.status(
      error instanceof TypeError || error.name === "TimeoutError"
        ? "Local backend unavailable. Start it using the command above, check the authorized extension ID, then Refresh / reconnect."
        : error.message,
      true,
    );
  }
  busy(value) {
    for (const id of [
      "extractTranscript",
      "forceWhisper",
      "uploadAudio",
      "uploadTranscript",
      "transcriptSettings",
      "transcriptUrl",
      "refreshTranscript",
    ])
      $(id).disabled = value;
    $("cancelTranscript").disabled = !this.job || !ACTIVE.has(this.job.status);
  }
  async setSource(source) {
    this.source = source;
    this.generation++;
    clearTimeout(this.timer);
    this.job = null;
    this.document = null;
    $("transcriptUrl").value =
      source.url || `https://www.youtube.com/watch?v=${source.id}`;
    $("transcriptSearch").value = "";
    this.render();
    this.busy(false);
    await this.changed();
    await this.refresh();
  }
  target() {
    const input = $("transcriptUrl").value.trim() || this.source?.id;
    if (!input)
      throw new Error("Connect a YouTube video or enter its URL/ID first.");
    return input;
  }
  options(force = false) {
    return {
      model: $("whisperModel").value,
      device: $("whisperDevice").value,
      language: $("transcriptLanguage").value.trim().toLowerCase() || null,
      word_timestamps: $("wordTimestamps").checked,
      retain_audio: $("retainAudio").checked,
      force_whisper: force,
    };
  }
  async refresh() {
    const generation = this.generation;
    const target = this.target();
    const id = transcriptVideoId(target);
    if (!id)
      throw new Error("Use a YouTube HTTPS URL or an 11-character video ID.");
    const jobs = await transcriptApi(
      `/api/jobs?video_id=${encodeURIComponent(id)}`,
    );
    if (generation !== this.generation) return;
    const active = [...jobs].reverse().find((job) => ACTIVE.has(job.status));
    try {
      const document = await transcriptApi(`/api/transcript/${id}`);
      if (generation !== this.generation) return;
      await this.accept(document);
      this.status(
        "Loaded the saved local transcript. Search text or click a timestamp to jump.",
      );
    } catch (error) {
      if (!error.message.includes("No saved transcript")) throw error;
      if (!active)
        this.status(
          "No saved transcript. Get captions or run local Whisper; manual uploads are also available.",
        );
    }
    if (active) await this.updateJob(active, generation);
    else {
      this.job = null;
      this.busy(false);
    }
  }
  async start(force) {
    if (this.job && ACTIVE.has(this.job.status)) return;
    const generation = this.generation;
    this.busy(true);
    try {
      const job = await transcriptApi("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: this.target(), ...this.options(force) }),
      });
      if (generation === this.generation) await this.updateJob(job, generation);
    } catch (error) {
      this.busy(false);
      throw error;
    }
  }
  async upload(kind) {
    if (this.job && ACTIVE.has(this.job.status)) return;
    const file = $(kind === "audio" ? "audioUpload" : "transcriptUpload")
      .files[0];
    if (!file)
      throw new Error(
        `Select an ${kind === "audio" ? "audio" : "existing transcript"} file first.`,
      );
    const limit = kind === "audio" ? 256 * 1024 * 1024 : 5 * 1024 * 1024;
    if (!file.size || file.size > limit)
      throw new Error(
        `Upload must be nonempty and smaller than ${kind === "audio" ? "256" : "5"} MiB.`,
      );
    const target = this.target();
    const id = transcriptVideoId(target);
    if (!id) throw new Error("Use a valid YouTube URL/ID for the upload.");
    const options = this.options(true);
    const query = new URLSearchParams({
      ...options,
      language: options.language || "auto",
      kind,
    });
    const generation = this.generation;
    this.busy(true);
    this.uploadAbort = new AbortController();
    $("cancelTranscript").disabled = false;
    this.status("Sending the selected file to the local backend only…");
    try {
      const job = await transcriptApi(`/api/transcript/upload/${id}?${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Upload-Name": `upload.${file.name.split(".").pop().toLowerCase()}`,
        },
        body: file,
        signal: this.uploadAbort.signal,
      });
      if (generation === this.generation) await this.updateJob(job, generation);
    } catch (error) {
      this.busy(false);
      if (error.name === "AbortError")
        this.status(
          "Upload cancelled. Refresh to check whether a job already started.",
        );
      else throw error;
    } finally {
      this.uploadAbort = null;
    }
  }
  async updateJob(job, generation) {
    if (generation !== this.generation) return;
    this.job = job;
    $("transcriptProgress").value = Math.max(0, Math.min(100, job.progress));
    this.status(
      `${job.message}${job.warnings?.length ? ` ${job.warnings.join(" ")}` : ""}`,
      job.status === "error",
    );
    this.busy(ACTIVE.has(job.status));
    clearTimeout(this.timer);
    if (ACTIVE.has(job.status)) {
      this.timer = setTimeout(async () => {
        try {
          await this.updateJob(
            await transcriptApi(`/api/jobs/${job.id}`),
            generation,
          );
        } catch (error) {
          if (generation !== this.generation) return;
          this.busy(false);
          $("refreshTranscript").disabled = false;
          this.error(error);
        }
      }, 1000);
    } else if (job.status === "complete") {
      const document = await transcriptApi(`/api/transcript/${job.videoId}`);
      if (generation === this.generation) await this.accept(document);
    }
  }
  async accept(document) {
    if (
      !/^[\w-]{11}$/.test(document.videoId) ||
      !Array.isArray(document.segments) ||
      document.segments.some((segment) => typeof segment.text !== "string")
    )
      throw new Error("Backend returned an invalid transcript.");
    this.document = document;
    this.render();
    await this.changed();
  }
  forVideo(videoId) {
    return this.document?.videoId === videoId ? this.document : null;
  }
  render() {
    const document = this.document;
    $("transcriptSummary").textContent = document
      ? `${document.videoId} · ${document.source}${document.model ? ` / ${document.model}` : ""} · ${document.language || "unknown language"} · ${document.segments.length} segments · ${document.availableCaptions?.length || 0} caption tracks${document.warnings?.length ? ` · ${document.warnings.join(" ")}` : ""}`
      : "";
    const query = $("transcriptSearch").value.trim().toLocaleLowerCase();
    const matches = (document?.segments || []).filter(
      (segment) => !query || segment.text.toLocaleLowerCase().includes(query),
    );
    const fragment = window.document.createDocumentFragment();
    for (const segment of matches.slice(0, 200)) {
      const timed =
        Number.isFinite(segment.start) && Number.isFinite(segment.end);
      const button = window.document.createElement(timed ? "button" : "p");
      button.className = "transcript-segment";
      const time = window.document.createElement("time");
      time.textContent = timed
        ? `${core.timestamp(segment.start)} – ${core.timestamp(segment.end)}`
        : "Untimed text";
      button.append(time, segment.text);
      if (timed)
        button.addEventListener("click", () =>
          Promise.resolve(this.jump(document.videoId, segment.start)).catch(
            (error) => this.error(error),
          ),
        );
      fragment.append(button);
    }
    if (matches.length > 200) {
      const note = window.document.createElement("p");
      note.className = "hint";
      note.textContent = `${matches.length} matches. Showing the first 200; narrow your search to find later segments.`;
      fragment.append(note);
    }
    $("transcriptResults").replaceChildren(fragment);
  }
}
