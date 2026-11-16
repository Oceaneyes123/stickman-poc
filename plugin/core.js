/* Shared by the isolated content script, panel, and dependency-free tests. */
(() => {
  const pad = (value, size = 4) => String(value).padStart(size, "0");
  function videoId(url) {
    const parsed = new URL(url);
    if (
      !["www.youtube.com", "m.youtube.com", "youtube.com"].includes(
        parsed.hostname,
      )
    )
      return null;
    const id =
      parsed.searchParams.get("v") ||
      parsed.pathname.match(/^\/(?:shorts|live|embed)\/([^/]+)/)?.[1];
    return /^[\w-]{11}$/.test(id || "") ? id : null;
  }
  function timestamp(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0)
      throw new Error("Invalid timestamp.");
    const total = Math.round(seconds * 1000);
    return `${pad(Math.floor(total / 3600000), 2)}:${pad(Math.floor(total / 60000) % 60, 2)}:${pad(Math.floor(total / 1000) % 60, 2)}.${pad(total % 1000, 3)}`;
  }
  function parseTime(value) {
    const text = String(value).trim();
    if (
      !/^\d+(?:\.\d+)?$/.test(text) &&
      !/^\d+:\d{1,2}(?::\d{1,2})?(?:\.\d+)?$/.test(text)
    ) {
      throw new Error("Use seconds or HH:MM:SS.mmm for timestamps.");
    }
    const parts = text.split(":").map(Number);
    if (parts.slice(1).some((part) => part >= 60))
      throw new Error("Minutes and seconds must be below 60.");
    const result = parts.reduce((total, part) => total * 60 + part, 0);
    if (!Number.isFinite(result)) throw new Error("Timestamp is too large.");
    return result;
  }
  function validateOptions(options, duration) {
    if (!Number.isFinite(duration) || duration <= 0)
      throw new Error(
        "Wait for a finite video to load. Live streams are unsupported.",
      );
    if (!["interval", "scene", "motion", "manual"].includes(options.mode))
      throw new Error("Invalid capture mode.");
    if (!["observe", "seek"].includes(options.method))
      throw new Error("Invalid capture method.");
    if (![1, 3, 5, 10].includes(options.interval))
      throw new Error("Invalid capture interval.");
    if (![2, 5, 10].includes(options.fps))
      throw new Error("Invalid motion sampling rate.");
    if (
      !Number.isFinite(options.threshold) ||
      options.threshold < 0.01 ||
      options.threshold > 1
    )
      throw new Error("Invalid scene threshold.");
    if (
      !Number.isFinite(options.start) ||
      !Number.isFinite(options.end) ||
      options.start < 0 ||
      options.start >= options.end ||
      options.end > duration
    ) {
      throw new Error("Range must satisfy 0 ≤ start < end ≤ video duration.");
    }
    const step =
      options.mode === "motion"
        ? 1 / options.fps
        : options.mode === "scene"
          ? 0.25
          : options.interval;
    if (
      options.method === "seek" &&
      Math.ceil((options.end - options.start) / step) > 5000
    ) {
      throw new Error(
        "Use a shorter range: at most 5,000 samples per seek job.",
      );
    }
    return step;
  }
  function difference(a, b) {
    if (!b) return 1;
    if (a.length !== b.length || a.length === 0)
      throw new Error("Scene samples must have the same nonzero size.");
    let sum = 0;
    for (let i = 0; i < a.length; i += 4) {
      sum +=
        Math.abs(a[i] - b[i]) +
        Math.abs(a[i + 1] - b[i + 1]) +
        Math.abs(a[i + 2] - b[i + 2]);
    }
    return sum / ((a.length / 4) * 3 * 255);
  }
  function batches(items, grid) {
    if (![3, 4, 5].includes(grid))
      throw new Error("Choose a 3×3, 4×4, or 5×5 grid.");
    return Array.from(
      { length: Math.ceil(items.length / (grid * grid)) },
      (_, i) => items.slice(i * grid * grid, (i + 1) * grid * grid),
    );
  }
  function framePath(number, sequence = null) {
    if (!Number.isSafeInteger(number) || number < 1)
      throw new Error("Invalid frame number.");
    if (sequence !== null && !/^sequence_\d{3,}$/.test(sequence))
      throw new Error("Invalid sequence ID.");
    return sequence
      ? `motion/${sequence}/frame_${pad(number, 3)}.jpg`
      : `frames/frame_${pad(number)}.jpg`;
  }
  function narrationAt(transcript, time) {
    return (transcript?.segments || []).filter(
      (segment) =>
        Number.isFinite(segment.start) &&
        Number.isFinite(segment.end) &&
        segment.start <= time &&
        time < segment.end,
    );
  }
  globalThis.FrameStudy = Object.freeze({
    pad,
    videoId,
    timestamp,
    parseTime,
    validateOptions,
    difference,
    batches,
    framePath,
    narrationAt,
  });
})();
