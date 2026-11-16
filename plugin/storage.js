const core = globalThis.FrameStudy;
const PATH =
  /^(?:frames\/frame_\d{4,}\.jpg|motion\/sequence_\d{3,}\/frame_\d{3,}\.jpg)$/;
const SHEET_PATH =
  /^(?:motion\/sequence_\d{3,}\/)?contact-sheets\/sheet_\d{3,}\.(?:png|jpg)$/;

export async function rememberedDirectory(value) {
  const database = await new Promise((resolve, reject) => {
    const request = indexedDB.open("frame-study", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("settings");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(
        "settings",
        value ? "readwrite" : "readonly",
      );
      const store = transaction.objectStore("settings");
      const request = value
        ? store.put(value, "directory")
        : store.get("directory");
      transaction.oncomplete = () => resolve(value || request.result || null);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () =>
        reject(
          transaction.error || new Error("Directory setting was not saved."),
        );
    });
  } finally {
    database.close();
  }
}

export function validateMetadata(data, id) {
  if (
    data?.schemaVersion !== 1 ||
    data.video?.id !== id ||
    !Array.isArray(data.frames) ||
    !Array.isArray(data.sequences) ||
    !Array.isArray(data.sheets)
  ) {
    throw new Error(
      "Existing metadata.json is not a Frame Study record for this video. Choose another output folder; it was not overwritten.",
    );
  }
  const sequences = new Set();
  for (const sequence of data.sequences) {
    if (!/^sequence_\d{3,}$/.test(sequence.id) || sequences.has(sequence.id))
      throw new Error("Invalid sequence metadata.");
    sequences.add(sequence.id);
  }
  const paths = new Set();
  for (const frame of data.frames) {
    if (
      !PATH.test(frame.path) ||
      paths.has(frame.path) ||
      !Number.isSafeInteger(frame.number) ||
      frame.number < 1 ||
      !Number.isFinite(frame.timestamp) ||
      frame.timestamp < 0 ||
      (frame.sequence !== null && !sequences.has(frame.sequence))
    ) {
      throw new Error(
        "Invalid frame metadata. Existing files were not overwritten.",
      );
    }
    if (frame.path !== core.framePath(frame.number, frame.sequence))
      throw new Error("Frame path does not match its metadata.");
    paths.add(frame.path);
  }
  for (const sheet of data.sheets) {
    if (
      !SHEET_PATH.test(sheet.path) ||
      !Array.isArray(sheet.frames) ||
      sheet.frames.some((path) => !paths.has(path))
    )
      throw new Error("Invalid contact sheet metadata.");
  }
  if (
    data.analyses !== undefined &&
    (!Array.isArray(data.analyses) ||
      data.analyses.some(
        (analysis) =>
          !/^scene-analysis\/analysis_\d{3,}\.json$/.test(analysis.path) ||
          !Array.isArray(analysis.frames) ||
          analysis.frames.some((path) => !paths.has(path)),
      ))
  ) {
    throw new Error("Invalid scene analysis metadata.");
  }
  return data;
}

async function directory(root, parts, create) {
  let current = root;
  for (const part of parts)
    current = await current.getDirectoryHandle(part, { create });
  return current;
}

export class LocalStore {
  constructor(root) {
    this.root = root;
  }
  async permission() {
    if ((await this.root.queryPermission({ mode: "readwrite" })) !== "granted")
      throw new Error(
        "Output folder permission expired. Click “Grant folder access”.",
      );
  }
  async videoDirectory(id) {
    if (!/^[\w-]{11}$/.test(id)) throw new Error("Invalid YouTube video ID.");
    return this.root.getDirectoryHandle(id, { create: true });
  }
  async read(source) {
    const folder = await this.videoDirectory(source.id);
    let file;
    try {
      file = await folder.getFileHandle("metadata.json");
    } catch (error) {
      if (error.name !== "NotFoundError") throw error;
    }
    if (!file)
      return {
        schemaVersion: 1,
        video: source,
        createdAt: new Date().toISOString(),
        frames: [],
        sequences: [],
        sheets: [],
      };
    try {
      return validateMetadata(
        JSON.parse(await (await file.getFile()).text()),
        source.id,
      );
    } catch (error) {
      throw new Error(`Cannot read metadata.json: ${error.message}`);
    }
  }
  async write(folder, path, data, replace = false) {
    const parts = path.split("/");
    const name = parts.pop();
    if (
      parts.some((part) => !/^[\w-]+$/.test(part)) ||
      !/^[\w.-]+$/.test(name) ||
      name === ".."
    )
      throw new Error("Invalid output path.");
    const parent = await directory(folder, parts, true);
    if (!replace) {
      try {
        await parent.getFileHandle(name);
      } catch (error) {
        if (error.name === "NotFoundError")
          return this.writeNew(parent, name, data);
        throw error;
      }
      throw new Error(`File already exists: ${path}`);
    }
    return this.writeNew(parent, name, data);
  }
  async writeNew(parent, name, data) {
    const handle = await parent.getFileHandle(name, { create: true });
    const stream = await handle.createWritable();
    try {
      await stream.write(data);
      await stream.close();
    } catch (error) {
      await stream.abort().catch(() => {});
      throw error;
    }
  }
  async exists(folder, path) {
    const parts = path.split("/");
    const name = parts.pop();
    try {
      await (await directory(folder, parts, false)).getFileHandle(name);
      return true;
    } catch (error) {
      if (error.name === "NotFoundError") return false;
      throw error;
    }
  }
  async saveMetadata(folder, data) {
    data.updatedAt = new Date().toISOString();
    await this.write(
      folder,
      "metadata.json",
      JSON.stringify(data, null, 2),
      true,
    );
    return data;
  }
  async mutate(source, change) {
    return navigator.locks.request("frame-study-output", async () => {
      await this.permission();
      const data = await this.read(source);
      const folder = await this.videoDirectory(source.id);
      await change(data, folder);
      return this.saveMetadata(folder, data);
    });
  }
  async load(source) {
    return this.mutate(source, () => {});
  }
  async startSequence(source, options) {
    let sequence;
    const data = await this.mutate(source, async (metadata, folder) => {
      let number =
        Math.max(
          0,
          ...metadata.sequences.map((item) => Number(item.id.slice(9))),
        ) + 1;
      // Never reuse an orphaned sequence directory after a previous interrupted write.
      while (true) {
        sequence = `sequence_${core.pad(number, 3)}`;
        try {
          await (
            await folder.getDirectoryHandle("motion")
          ).getDirectoryHandle(sequence);
          number++;
        } catch (error) {
          if (error.name === "NotFoundError") break;
          throw error;
        }
      }
      metadata.sequences.push({
        id: sequence,
        ...options,
        startedAt: new Date().toISOString(),
        status: "incomplete",
      });
    });
    return { data, sequence };
  }
  async saveFrame(source, options, sequence, frame) {
    if (
      !frame.data?.startsWith("data:image/jpeg;base64,") ||
      !Number.isFinite(frame.timestamp) ||
      frame.timestamp < 0 ||
      !["mediaTime", "currentTime"].includes(frame.timestampSource)
    )
      throw new Error("Invalid frame received.");
    const bytes = Uint8Array.from(atob(frame.data.split(",")[1]), (character) =>
      character.charCodeAt(0),
    );
    return this.mutate(source, async (data, folder) => {
      if (
        sequence !== null &&
        !data.sequences.some((item) => item.id === sequence)
      )
        throw new Error("Motion sequence is missing.");
      let number =
        data.frames
          .filter((item) => item.sequence === sequence)
          .reduce((max, item) => Math.max(max, item.number), 0) + 1;
      while (await this.exists(folder, core.framePath(number, sequence)))
        number++;
      const path = core.framePath(number, sequence);
      await this.write(folder, path, new Blob([bytes], { type: "image/jpeg" }));
      const { data: _image, ...details } = frame;
      data.frames.push({
        ...details,
        number,
        path,
        sequence,
        mode: options.mode,
        selected: true,
        removed: false,
      });
    });
  }
  async file(source, path) {
    if (!PATH.test(path) && !SHEET_PATH.test(path))
      throw new Error("Invalid image path.");
    const parts = path.split("/");
    const name = parts.pop();
    const parent = await directory(
      await this.videoDirectory(source.id),
      parts,
      false,
    );
    return (await parent.getFileHandle(name)).getFile();
  }
  async saveSheet(source, sequence, blob, jpeg, details) {
    return this.mutate(source, async (data, folder) => {
      if (
        sequence !== null &&
        !data.sequences.some((item) => item.id === sequence)
      )
        throw new Error("Unknown motion sequence.");
      const prefix = sequence
        ? `motion/${sequence}/contact-sheets`
        : "contact-sheets";
      let number =
        data.sheets.filter((item) => item.sequence === sequence).length + 1;
      while (
        (await this.exists(
          folder,
          `${prefix}/sheet_${core.pad(number, 3)}.png`,
        )) ||
        (await this.exists(
          folder,
          `${prefix}/sheet_${core.pad(number, 3)}.jpg`,
        ))
      )
        number++;
      const path = `${prefix}/sheet_${core.pad(number, 3)}.png`;
      await this.write(folder, path, blob);
      let jpegPath = null;
      if (jpeg) {
        jpegPath = path.replace(/\.png$/, ".jpg");
        await this.write(folder, jpegPath, jpeg);
      }
      data.sheets.push({
        ...details,
        sequence,
        path,
        jpegPath,
        createdAt: new Date().toISOString(),
      });
    });
  }
  async saveAnalysis(source, frames, transcript) {
    if (transcript && transcript.videoId !== source.id)
      throw new Error("Transcript belongs to another video.");
    let savedPath;
    await this.mutate(source, async (metadata, folder) => {
      let number = (metadata.analyses || []).length + 1;
      do {
        savedPath = `scene-analysis/analysis_${core.pad(number++, 3)}.json`;
      } while (await this.exists(folder, savedPath));
      const document = {
        schemaVersion: 1,
        video: source,
        createdAt: new Date().toISOString(),
        transcript: transcript
          ? {
              source: transcript.source,
              model: transcript.model,
              language: transcript.language,
              jobId: transcript.jobId || null,
            }
          : null,
        frames: frames.map((frame) => ({
          ...frame,
          narration: core.narrationAt(transcript, frame.timestamp),
        })),
      };
      await this.write(folder, savedPath, JSON.stringify(document, null, 2));
      (metadata.analyses ||= []).push({
        path: savedPath,
        createdAt: document.createdAt,
        frames: frames.map((frame) => frame.path),
      });
    });
    return savedPath;
  }
}
