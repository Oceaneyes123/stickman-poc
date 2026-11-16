# Local transcript backend

FastAPI on `127.0.0.1:8765`, with yt-dlp captions and disposable faster-whisper workers. No YouTube API key, paid transcription service, cloud deployment, or remote inference is used. YouTube extraction needs internet access; Whisper weights need a download on first use. Cached models and uploaded audio work offline afterward.

## Start on Windows

Requires Python 3.11+ and FFmpeg on PATH. From the repository root:

```powershell
python -m venv plugin/backend/.venv
.\plugin\backend\.venv\Scripts\python.exe -m pip install -r plugin/backend/requirements.txt
ffmpeg -version
.\plugin\backend\.venv\Scripts\python.exe -m plugin.backend --extension-id YOUR_EXTENSION_ID
```

Reload the unpacked Chrome extension after updating its files. Expand **Start the local backend** in its Transcript section to see the command with its actual extension ID. The same ID is visible on `chrome://extensions`. Replace `YOUR_EXTENSION_ID` with that 32-character ID. You can instead set `FRAME_STUDY_EXTENSION_ID` in the backend environment. No wildcard origin is accepted.

If using an activated virtual environment or an existing Python environment with these dependencies, run the `python -m plugin.backend ...` command shown directly in the panel. Keep the terminal running; Ctrl+C shuts down jobs and removes temporary audio. After reloading the extension, reopen its panel and click Connect video; it restores missing capture scripts automatically. Reload the YouTube page if site permissions or navigation prevent reconnection.

Choose `plugin/result` as the extension's frame output directory. The backend always writes transcripts to this repository's `plugin/result/{videoId}/transcript`; HTTP clients cannot change that path. If you deliberately select a different frame directory, its frames and scene-analysis exports remain there while the backend transcripts stay in `plugin/result`.

## Transcription order

1. **Get transcript** extracts YouTube metadata and native VTT tracks using yt-dlp. Manual captions have priority over auto captions. A specified language filters matching native tracks; otherwise the video's language and English are preferred within each track type. Auto-translations and live chat are excluded. Up to three manual and three automatic tracks are tried. Failed or empty captions trigger audio fallback.
2. yt-dlp downloads audio into a private job directory. FFmpeg decodes it to mono, 16 kHz, PCM WAV. faster-whisper runs locally with VAD, language detection or your specified language, and optional word timestamps.
3. If both methods fail, **Transcribe uploaded audio** or **Import transcript** accepts a local file associated with the entered video ID. **Run Whisper instead** skips caption extraction even when captions exist.

CPU inference uses `int8`. Choose `tiny`, `base`, `small` (default), or `medium`. NVIDIA acceleration uses `cuda` and `float16`; compatible CTranslate2/NVIDIA runtime libraries must already be installed. Follow the [official faster-whisper GPU requirements](https://github.com/SYSTRAN/faster-whisper#gpu). GPU failures are reported; select CPU explicitly to retry.

Language may be blank/`auto`, or a supported lowercase Whisper code, such as `en`, `es`, or `tl`. This selects the spoken language, not a translation target. Unsupported Whisper languages produce an actionable job error.

Models cache under `plugin/backend/.models/`. Set `FRAME_STUDY_MODEL_CACHE` in the server's environment to reuse another local Hugging Face cache, such as `C:\Users\Dave\.cache\huggingface\hub`. This is startup configuration, never a request parameter. Set `HF_HUB_OFFLINE=1` to require existing cached weights and prevent model-network lookups; a missing model then fails with an error. Model objects are released when each worker exits, while downloaded weights remain cached.

One worker runs at a time; at most three additional jobs wait, including uploads being received. Progress during download and transcription is based on bytes or processed audio time. Model loading/downloading reports its phase without pretending to know a percentage of model-download bytes. Each worker has a six-hour execution limit. Jobs and their statuses are kept in memory (up to 64 recent records); backend restarts reset job IDs, while completed transcript files remain.

Captions can fail because of YouTube access restrictions, unavailable tracks, rate limits, or changes to yt-dlp's extractor. Audio download can fail for the same reasons. There is no bypass for private, protected, unavailable, or blocked media. Update yt-dlp in the virtual environment when appropriate. Uploaded audio/transcripts remain available as the manual recovery path.

## Outputs and timing

```text
plugin/result/{videoId}/transcript/
    transcript.json
    transcript.txt
    transcript.srt
    audio_{jobId}.wav        # only when audio retention was enabled
```

The JSON includes `videoId`, `source` (`youtube_manual`, `youtube_auto`, `whisper`, or `manual`), `model`, `language`, `segments`, original video metadata when obtainable, available native caption languages, warnings, creation date, and job ID. Whisper adds device/quantization information and optional `segments[].words`. Example:

```json
{
  "videoId": "abcdefghijk",
  "source": "whisper",
  "model": "small",
  "language": "en",
  "segments": [
    { "start": 1.25, "end": 3.85, "text": "Imagine losing your money." }
  ]
}
```

Whisper timestamps are recognition estimates, not manually verified speech alignment. Native captions retain cue boundaries. Overlapping auto-caption rollups have duplicated leading words removed; they do not gain fabricated word timestamps. TXT imports have `start: null` and `end: null`, and an empty SRT sidecar. Supply timed VTT, SRT, or JSON to synchronize those words with frames.

Uploaded audio must start at the video's time zero. A shortened clip from later in a video will otherwise have the wrong time base for matching frames. The extension matches segments using `start <= actualFrameTimestamp < end`; all overlapping matching segments are shown. Search matches transcript text; clicking a timed result seeks the connected video only when its ID matches and no capture is running.

**Export scene analysis JSON** writes `scene-analysis/analysis_001.json` beside the selected frame output, preserving current collection order, selected frame paths/numbers, original frame timestamps, matching narration segments/words, and transcript provenance. It does not send image data to the backend or an AI service.

Each successful run replaces the current transcript sidecars; copy an older transcript elsewhere if you want to keep it. Sidecars are prepared before replacement, with JSON replaced last as the authoritative record. The filesystem cannot atomically replace all three files together. If publication fails, the API reports an error and a previous JSON record remains authoritative; inspect sidecars before relying on a failed publication. Retained audio uses a unique job filename and is intentionally kept until you delete it.

Raw and normalized temporary audio are removed after success, failure, or cancellation. Retention moves only the successful normalized WAV into the transcript directory. Cancellation terminates the worker process tree, including FFmpeg/inference. A backend instance lock prevents a second instance from cleaning an active instance's work directory. Stale job directories left by a process crash are cleaned on the next startup.

## HTTP API

Every request needs `X-Frame-Study-Extension: YOUR_EXTENSION_ID`. Browser Origin, when supplied, must be exactly `chrome-extension://YOUR_EXTENSION_ID`. The extension supplies the header automatically. For CLI testing, also provide `Origin: chrome-extension://YOUR_EXTENSION_ID`.

- `GET /api/health`: local service status, fixed output directory, authorized origin, worker concurrency.
- `POST /api/transcript`: starts an asynchronous job and returns HTTP 202 with job ID/status. JSON body:

  ```json
  {
    "url": "https://www.youtube.com/watch?v=abcdefghijk",
    "model": "small",
    "device": "cpu",
    "language": null,
    "word_timestamps": false,
    "retain_audio": false,
    "force_whisper": false
  }
  ```

  `url` also accepts an 11-character video ID, `youtu.be`, Shorts, live-video, or embed URL. Only HTTPS YouTube URLs are accepted; they are normalized to a single watch URL before yt-dlp sees them.

- `GET /api/jobs?video_id={id}`: recent jobs for a video, used to reconnect a reopened panel.
- `GET /api/jobs/{jobId}`: queued/running/cancelling/complete/error/cancelled status, phase, progress, errors, and warnings.
- `POST /api/jobs/{jobId}/cancel`: stops a queued or running job. Poll until terminal status confirms cleanup.
- `GET /api/transcript/{videoId}`: the committed timestamped JSON result, or 404 if absent.
- `POST /api/transcript/upload/{videoId}?kind=audio&model=small&device=cpu`: raw binary request body, `Content-Type: application/octet-stream`, and `X-Upload-Name: upload.wav`. `kind=transcript` accepts JSON/VTT/SRT/TXT. The remaining option fields above are optional query parameters. This is not multipart form data, and original upload filenames are never used as filesystem paths.

Audio uploads are limited to 256 MiB; transcript uploads to 5 MiB. Audio download is capped at 512 MiB; decoded audio at four hours. Audio jobs require at least 1 GiB of initial disk headroom; model weights and long inputs can require more. Uploads time out after five minutes. Memory/GPU failures terminate only the job, leaving the API available. Try `tiny` on CPU if resources are insufficient.

## Local boundary

The CLI binds only `127.0.0.1:8765`, serves no arbitrary files, and exposes no shell/path/yt-dlp-option arguments. CORS permits one configured extension origin, never `*`. Host validation rejects DNS-rebinding hosts. Non-preflight requests require the extension-specific header; privileged Chrome requests that omit Origin are supported, while any supplied foreign Origin is rejected. This is browser isolation, not authentication against other native programs running under your OS account.

Subprocess arguments are fixed lists, never shell command strings. FFmpeg cannot use network protocols and is restricted to the supported media demuxers. Video IDs, settings, upload suffixes, transcript structure, timestamps, sizes, output containment, symlinks/junctions, and queue capacity are validated. The backend has no static route to temporary audio or its model cache. Private work directories use owner-only mode on POSIX and inherit the project directory's ACL on Windows. Do not grant other users write access to backend/result directories while the service is running.

## Checks

```powershell
python -m unittest plugin.backend.test_backend -q
python -m ruff check plugin/backend
```

The tests include real disposable import workers and process cancellation, plus deterministic mocked caption failure/download fallback. An additional real offline CPU/int8 Whisper run with cached `base` weights and local narration is recorded in [../VALIDATION.md](../VALIDATION.md). GPU execution and first-use model downloading remain environment-dependent manual checks.
