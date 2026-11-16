# Validation — 2026-11-16

Passed:

- Version 1.1.1 guards an absent scripting API, reports whether the loaded manifest declares its permission, and offers an explicit extension reload action. A regression test reproduces the user's undefined `executeScript` failure before the fix; five connection tests pass afterward. Actual Chrome panel inspection confirmed the same reported error, but loaded permission details could not be read through the available UI control.
- Connection recovery: four focused tests cover an existing receiver, missing receiver with ordered reinjection and readiness verification, permission errors/closed tabs, and duplicate injection/stale context recovery. Browser panel tests start without a receiver and verify successful connection after automatic injection. Extension lint and all 14 extension tests pass. Not yet verified in the user's loaded Chrome profile.
- YouTube-inspired SVG icon added to the panel, with verified 16/32/48/128px PNG exports registered for Chrome. Extension lint and browser checks pass. Browser fixture MIME types now support SVG/PNG; observe-mode checks allow the documented one-frame presentation/playhead timing difference. Lint excludes the backend virtual environment.
- `node --test plugin/tests/core.test.mjs`: 10 tests, including synchronized scene-analysis JSON exports and untimed-text exclusion.
- Extension ESLint checks with `plugin/eslint.config.mjs`.
- Real headless Chrome using a generated 320×180, 30 FPS local MP4: IndexedDB directory-handle round trip; five JPEG motion samples at 5 FPS; four unique cuts with repeated frames suppressed; manual capture; observe mode without playback interruption; restoration of paused/playing state, position, and rate; stop while paused; real 1968×1344 PNG/JPEG sheet generation and JSON/filesystem writes.
- Motion sample requested times 0.25/0.45/0.65/0.85/1.05 seconds mapped to decoded presentation times 0.233333/0.433333/0.633333/0.833333/1.033333 seconds. Both are retained, without inventing exact alignment to the seek target.
- Panel connection with a mocked Chrome transport; real gallery loading, frame selection, reordering, removal/restoration, sheet generation, and full-resolution preview. No horizontal overflow at 360px and 1100px viewport widths. Wide-layout screenshot inspected.
- Repository `npm run check`: lint/typecheck, 95 Node tests, 5 Python timing tests.
- `python -m unittest plugin.backend.test_backend -q`: 13 tests for URL/settings validation, manual/auto selection, VTT/SRT/JSON/TXT, empty/failed caption fallback, forced Whisper override, CORS/header/Host enforcement, real import workers, bounded queue, running process-tree cancellation, failed-import preservation, containment, retained audio, and temporary audio cleanup.
- `python -m ruff check plugin/backend`: passed.
- Real offline local Whisper through the upload API and disposable worker: 12 seconds of existing local narration, cached `base` model, CPU/int8, auto-detected English, VAD, five segments with word timestamps, JSON/TXT/SRT output, and no temporary or retained audio afterward. Reused the existing Hugging Face cache with `HF_HUB_OFFLINE=1`; no weights or media were downloaded for this check.
- Browser transcript integration with a mocked loopback API: progress polling, forced Whisper/model settings, transcript search, timestamp-jump commands, matching gallery narration, and scene-analysis export with all five frames retaining narration.

Not yet verified manually:

- Loading the unpacked MV3 extension into the user's Chrome profile, actual YouTube DOM/stream variants, and Chrome side-panel integration. The browser fixture mocks the extension message transport and video identity; real video/canvas/filesystem behavior is tested.
- The native folder picker and renewed user-directory permission after a browser restart. Automated browser tests use an origin-private directory handle and actual IndexedDB serialization.
- Background capture under Chrome Memory Saver, ads/DRM behavior on live YouTube pages, low disk space, and very large exports.
- Human review of contact-sheet usefulness for an actual animation reference.
- Live YouTube caption/audio extraction through this backend, first-use model downloads, GPU/CUDA inference, four-hour audio, disk-full errors, and user-profile extension-to-loopback requests. Backend HTTP rules and real worker behavior are tested separately; the panel integration uses a deterministic API fixture.

No commits, pushes, deployment, or cloud processing were performed. Existing unrelated workspace edits were preserved.
