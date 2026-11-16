# Frame Study

A local Chrome Manifest V3 extension for collecting YouTube visual references, motion studies, and synchronized narration. Frame capture stays in the browser; the optional FastAPI backend extracts captions and runs Whisper locally. No images, audio, or transcripts are sent to an external AI service.

## Install

1. Open `chrome://extensions`, enable **Developer mode**, and choose **Load unpacked**.
2. Select this `plugin` directory, which contains `manifest.json`. No build or package installation is needed.
3. Reload any YouTube tab that was already open when the extension was installed.
4. Open a YouTube video, click the extension toolbar icon, and choose **Connect video** in the side panel. Use **Available videos** to choose between tabs in this window.
5. Click **Open / change folder** and select `E:\Projects\Youtube\video-poc-codex\plugin\result`. Chrome requires a user-selected directory; an extension cannot silently choose a workspace path.

Keep the panel open while capturing. The extension remembers the directory handle in IndexedDB. After restarting Chrome, click **Grant folder access** if Chrome requires renewed permission. **Open / change folder** starts the folder picker in the remembered directory, when available; Chrome has no API here for launching Windows File Explorer.

**Connect video** checks whether the tab's capture script is ready. If an extension install/reload left the existing tab without a receiver, it injects the bundled capture scripts and reconnects without refreshing, seeking, or pausing the video. If Chrome blocks script access, allow Frame Study access to YouTube in the extension's site settings, reload the YouTube page, and connect again.

If `chrome.scripting` is unavailable, reload the extension itself: open `chrome://extensions`, click **Reload** on the **Frame Study** card, then close and reopen its panel. Reloading the YouTube page or the Extensions browser tab does not reload the extension's permissions. Version **1.1.1** reports this case explicitly and offers a **Reload extension** button.

## Capture

- **Capture current frame:** saves the currently decoded frame at the video's current resolution as JPEG.
- **Every interval:** select 1, 3, 5, or 10 seconds.
- **Scene changes:** compares 64×36 RGB samples against the last accepted frame, four times per video second. The threshold controls sensitivity; the interval acts as a minimum cooldown between saved frames. Lower it to 1 second for more frequent cuts. This is a pixel-difference heuristic, not semantic scene recognition. Gradual changes and large gestures can qualify as new compositions.
- **Motion sequence:** choose 2, 5, or 10 FPS. Each run creates a new sequence folder.
- **Range:** enter seconds, `MM:SS.mmm`, or `HH:MM:SS.mmm`. Start is inclusive and end is exclusive. Connecting initializes the start to the current playhead and the end to the video's duration.

Two processing methods are available:

**Observe playback** never seeks, pauses, or changes playback rate. Press Play in YouTube yourself. Sampling follows video time, including your playback speed. Frames are saved only as Chrome supplies them, so it cannot capture a section that has already passed. Pausing also pauses capture; **Stop** still works while paused. If you seek backwards, capture waits until the next scheduled timestamp rather than duplicating earlier samples.

**Seek range & restore** pauses the video, seeks through the selected range, waits for decoded frames, saves each frame, and restores the original position, playback rate, and playing/paused state. It temporarily interrupts playback. Use it when you need systematic coverage of an earlier range. Runs are limited to 5,000 sample positions; split longer ranges. Leave YouTube controls alone during a seek job. Chrome may block automatic resumption; the panel then asks you to press Play.

Background observation continues only while Chrome supplies video frames and the panel remains open. Hidden/minimized tabs, Memory Saver, device sleep, decoding, and disk speed can reduce the effective sampling rate. There is no browser-throttling bypass. The extension uses one-frame backpressure: it waits for the JPEG and metadata write before requesting another capture. It does not queue unbounded image data or slow normal playback to catch up. Use seek mode with a visible video tab for systematic motion sampling.

Ads stop a running capture so their frames do not enter the collection. Navigating to another video, replacing the player, closing the panel, or closing the source tab stops capture. Reconnect after navigation. Live streams, protected/DRM video, and canvas access blocked by Chrome are unsupported; the panel reports an error rather than bypassing browser restrictions.

## Local transcripts

See [backend/README.md](backend/README.md) for setup. The Transcript section displays the backend command with this extension's authorized ID. Run it locally on `127.0.0.1:8765`, then click **Get transcript**. Manual captions take priority over auto captions; unavailable, empty, or failed captions trigger local Whisper audio transcription. **Run Whisper instead** forces local speech recognition. Model (`tiny`/`base`/`small`/`medium`), CPU/int8 or NVIDIA GPU, language, word timestamps, audio retention, progress, cancellation, and manual audio/transcript uploads are available in the panel.

Transcripts save under `plugin/result/{videoId}/transcript/` as JSON, TXT, and SRT. Models download once and cache locally. Search previews text and jumps to matching timestamps. The gallery displays narration at actual captured frame times; **Export scene analysis JSON** includes it beside the selected frame paths. Untimed TXT imports remain untimed and do not fabricate synchronization. Uploaded audio must start at video time zero.

Closing the panel stops browser frame capture but backend transcript jobs continue. Reopen, reconnect the video, and use **Refresh / reconnect** to recover progress or the saved result. Backend restart resets jobs; completed transcript files remain.

## Gallery and sheets

Choose **Still frames** or a motion sequence from **Collection**. Gallery state persists in `metadata.json`.

- Click a thumbnail for its full-resolution preview.
- Select frames with checkboxes. **Select all/none** applies to the whole collection, including other pages.
- Use each frame's arrow buttons to reorder it within the collection. Gallery pages contain 60 frames.
- **Remove selected** hides frames from the gallery and future sheets. It preserves original files and prior sheets. **Restore removed** restores that collection. You can delete unwanted files manually later.
- Choose a 3×3, 4×4, or 5×5 grid and a 640, 960, or 1280 pixel cell width. Generation follows the current selected frame order and splits across as many sheets as needed.
- Every sheet saves as PNG. **PNG + JPEG** also saves a JPEG copy. Frames preserve their aspect ratio inside 16:9 cells; nothing is cropped. Source resolution limits image detail even when sheet cells are larger.
- A 5×5 sheet at 1280 pixels per cell is 6472×3976 pixels. Large exports use significant canvas memory; choose smaller cells if Chrome cannot encode one.
- Motion sheets go inside their sequence, retaining frame numbers and actual timestamps for gesture, transition, and camera studies. Reordering a motion sequence is allowed; use the timestamps to preserve chronological interpretation.

## Output

The selected directory is the root. Select `plugin/result` for this layout:

```text
plugin/result/
└── video-id/
    ├── metadata.json
    ├── frames/
    │   ├── frame_0001.jpg
    │   └── frame_0002.jpg
    ├── contact-sheets/
    │   ├── sheet_001.png
    │   └── sheet_002.png
    └── motion/
        └── sequence_001/
            ├── frame_001.jpg
            ├── frame_002.jpg
            └── contact-sheets/
                └── sheet_001.png
```

JPEG frames save at the current YouTube video element resolution with quality 0.94. Contact sheet JPEG copies use quality 0.95. Files and metadata save immediately, before the next captured frame is accepted. Reopening a video in the same output directory loads its existing collection and continues numbering. Existing image filenames are never intentionally overwritten; orphaned filenames left by an interrupted save are skipped. Extension writes are serialized across panels using the Web Locks API.

`metadata.json` contains:

- `schemaVersion`, original `video` ID, canonical URL, title, channel when available, duration, dimensions, and initial playback information.
- `frames`: file path, immutable frame number within its collection, sequence, mode, actual `timestamp` in seconds without rounding, requested sampling timestamp, timestamp source, dimensions, capture date, selection, and removal state. Array order is gallery order.
- `sequences`: sampling settings, range, method, start/end dates, and completion status. `incomplete` means a run has not been finalized, including after a panel/browser crash.
- `sheets`: image paths, dimensions, grid, creation date, and ordered source frame paths.

`timestampSource: "mediaTime"` identifies the decoded presentation time supplied by `requestVideoFrameCallback`. Seek targets can land on a nearby source frame; metadata retains both times. A paused manual capture with no known presentation callback uses `timestampSource: "currentTime"`, which is the playhead time rather than a verified presentation timestamp. Sheet labels display the saved timestamp rounded to milliseconds; JSON retains full precision. Observed frames also record `skippedSamples` for missed scheduled positions. Sampling above the source FPS cannot invent intermediate images.

File System Access commits each file separately. There is no transaction spanning a JPEG and JSON. If disk access fails or the browser closes between writes, a saved image can be absent from the metadata. The UI reports a failed save; it never acknowledges the frame as fully saved before both writes succeed. Existing malformed or unrelated `metadata.json` files cause an error and are left untouched. Keep each output video directory dedicated to this extension, and do not edit metadata externally during capture.

The extension requests side panel, scripting, YouTube host, and `127.0.0.1:8765` host access. Extension-page network connections are restricted to that local backend by Content Security Policy. Frame images are never sent to the backend; user-selected audio/transcript uploads go only to loopback. The backend contacts YouTube for extraction and the model repository for first-use weights, then processes locally. There is no remote code, analytics, cloud storage, paid API, or remote inference. YouTube itself still streams video normally.

## Verification

From the repository root:

```powershell
node --test plugin/tests/core.test.mjs
node --test plugin/tests/connection.test.mjs
node node_modules/eslint/bin/eslint.js --config plugin/eslint.config.mjs plugin
node plugin/tests/browser-check.mjs
python -m unittest plugin.backend.test_backend -q
npm run check
```

The Node suite checks ranges, scene differences, splitting, actual disk writes, reloading, numbering, selection/removal/reordering, corrupt metadata, and permission denial. The browser check uses installed Chrome and FFmpeg with a generated local video; it tests real decoding, seek and observe capture, stop, playback restoration, JPEG encoding, PNG/JPEG sheets, directory handles, IndexedDB, and responsive panel startup. It uses a fresh temporary browser profile and deletes its own fixtures afterward. `CHROME_PATH` and `FFMPEG_PATH` can override executable paths. No dependencies are installed and no external media is requested.

See [VALIDATION.md](VALIDATION.md) for the current test evidence and remaining manual checks.
