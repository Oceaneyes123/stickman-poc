# VoiceStudio narration

Requires Node from this project's supported versions, FFmpeg on PATH, and the
local VoiceStudio app with VoxCPM2 installed and ready. No dependencies are added.
On Windows, the runner starts the installed VoiceStudio app if its service on port
3900 refuses the connection. If the app is already running, it waits for health
without launching another copy. Startup polling takes up to about a minute.
Custom service ports require manual startup. The runner does not install models
or change app settings.

Review a representative paragraph first:

```powershell
npm run narrate -- --script videos/001-lifestyle-creep/narration.txt --out out/001-lifestyle-creep/narration --preview
```

Listen to `preview.wav`. To use a saved voice, add `--voice <profile-id>` to both
commands. This project's default is the saved **Jeremy** clone profile
(`f6ec71e3`) with VoxCPM2, replacing David at the user's request on 2026-11-08.
The source is `references/base-voice.mp3` (about 14.1 seconds), used with the
speaker's permission confirmed by the user. The profile includes its reference
transcript, English language, fixed seed `1609887649`, and empty style instructions
to retain reference-based delivery. Reference preparation records are saved under
`out/001-lifestyle-creep/jeremy-reference/`; the transcript was derived with cached
local Whisper small and compared with the matching first two narration paragraphs.
The preview is saved separately under `out/001-lifestyle-creep/jeremy-preview/`.
Jeremy's likeness, delivery, full recording, and phrase alignment require listening
review. Existing David takes are preserved but are not the current default.
After reviewing the preview,
generate all paragraphs using the same output directory:

```powershell
npm run narrate -- --script videos/001-lifestyle-creep/narration.txt --out out/001-lifestyle-creep/narration
```

Paragraphs are separated by blank lines. Each must fit the API's 4096-character
limit. Generation runs sequentially at natural speed. There is no inserted gap,
silence trimming, speech stretching, or runtime target. Listen for discontinuities
between paragraphs; adjust the text and regenerate when needed.

During synthesis, a live bar shows completed text, elapsed run time, and estimated
synthesis time remaining. The terminal refreshes every second; redirected logs
update every ten seconds. A spinner indicates the current request is still being
awaited. Percentages advance only after paragraphs finish, not from guessed model
steps. ETA uses measured milliseconds per character from completed generations
with matching text and voice settings, including saved receipts from earlier runs.
The first unmeasured request shows `calculating`; a request that exceeds its
estimate shows `recalculating`. Estimates exclude final WAV assembly and may vary
with model loading and CPU load. Old cache receipts without timing remain usable.

Paragraph outputs are named `audio-1.wav`, `audio-2.wav`, and so on in script
order. Reruns rebuild these sequential files to match the current text order.
Content-addressed paragraph WAVs and receipts in `.cache/` preserve successful generations.
Earlier cache files stored directly in the output directory remain reusable.
Rerunning reuses only audio matching the exact paragraph and voice settings, with
verified file hashes and decodable, nonzero samples. Changed paragraphs get new
files; old takes stay available. `manifest.json` records progress and provenance.
FFmpeg normalizes assembly to mono PCM16 at 48 kHz. Master offsets come from integer
sample counts, so no independently rounded segment durations accumulate drift.

`narration.wav` is the master. `cues.draft.json` contains paragraph boundaries in
samples and milliseconds, source hashes, and measured master duration. Preview
uses separate `preview.wav` and `preview-cues.draft.json` outputs. Successful runs
replace these derived outputs and sequential paragraph WAVs; cached paragraph takes remain intact. If a run
fails, any older master/draft may be stale; use only outputs from a completed run
matching the current script hash and settings in the manifest.

Draft cues deliberately use `mode: "draft"`, which the timeline compiler rejects.
They are not phrase timestamps or approved listening evidence. Review the complete
master, place phrase cues at the actual spoken words, and create separate aligned
`CueFile` data with the reviewed script/audio hashes. Use cue IDs and documented
offsets in the storyboard, then compile with `src/timeline/compiler.ts`, measured
WAV duration, and a declared tail. At 30 fps, round each absolute endpoint with
`Math.round(ms * 30 / 1000)`; do not sum rounded segment lengths. Animation should
use one global Audio node. Replacing speech invalidates the previous alignment.

## Interrupted runs

The runner never retries synthesis automatically. A `.pending.json` marker means
the request may still be running or its audio failed validation. Inspect VoiceStudio
jobs/history and the saved `.response.json` headers before retrying. Only after
confirming the original job stopped, remove the corresponding pending marker and
any untracked `.wav.tmp` file. Preserve recoverable audio before rerunning. A
`run.lock` prevents concurrent runs; after a crash, remove it only after confirming
the recorded process and backend job are no longer running. Never remove a lock
belonging to a live runner. Corrupt completed cache files stop the run; use a new
output directory to preserve evidence.

Speech requests use Node's HTTP client with an explicit 30-minute abort signal,
so CPU generation can exceed the five-minute headers limit imposed by Node fetch.
VoiceStudio can still enforce its own generation budget. A client timeout does
not establish that the backend job stopped; inspect the service before retrying.

Routing and dropped-text headers are saved per generation. A valid nonzero WAV
still may contain missing or incorrect words; automated checks do not replace
full listening. The runner checks API/engine availability before its first new
request; successful inference remains the proof of model readiness.

## Record timing from the finished master

```powershell
npm run narrate:timing -- --script videos/001-lifestyle-creep/narration.txt --audio-dir out/001-lifestyle-creep/narration
```

`scripts/time_narration.py` requires Python 3.11+, `faster-whisper`, and the cached
Whisper `small` model. No model is installed or downloaded. It checks complete
synthesis metadata, script/master/paragraph hashes, paragraph count, and total
sample count before transcription and again before writing the final results.

Each paragraph is recognized with word timestamps on CPU/int8. Its measured
integer sample offset is added to local word times; paragraph durations are never
independently rounded into frames. ASR punctuation defines proposed sentence cues.
This is recognition-based timing, not forced alignment to the supplied script.
The source script remains authoritative and is never rewritten from recognition.

Outputs live in `timing/`: `words.draft.json`, `cues.draft.json`, and `review.json`.
The report preserves both script and recognized text with token-level differences,
including harmless number-format differences. Recognition checkpoints allow resume
without repeating completed paragraphs. Invalid word intervals stop the run and
identify the saved checkpoint for inspection instead of silently inventing times.
Tiny ASR tail overshoots up to 50 ms are clamped to the paragraph's real endpoint.

All final outputs carry the script/audio hashes, recognition settings, and false
listening/timing review flags. Both automatic cue files retain `mode: "draft"`;
neither is accepted by the timeline compiler. Review phrase times against the
master, create separate aligned cue data with verified hashes, then reference
those cue IDs from storyboard events. No animation or render is started here.

Run focused checks with `npm run test:timing`. They use standard-library fixtures
and do not load Whisper. `npm run check` includes these tests.

## Plain timing-review video

```powershell
npm run narrate:review -- --audio-dir out/001-lifestyle-creep/narration
```

`scripts/render-timing-review.ts` renders a separate Remotion composition using
only `audio-1.wav` and `audio-2.wav`. FFmpeg concatenates those two recordings;
no speech is regenerated. Matching phrase cues appear as white text on black,
with blank gaps. Source and timing hashes are verified before rendering. The
video ends at the rounded frame corresponding to the two files' sample duration.
It contains one Audio node and uses absolute cue endpoint rounding at 30 fps.

Outputs are `timing-review-first-2.mp4`, a half-scale `.png`, and a provenance
`.json` beside the narration. Existing film compositions remain unchanged.
The review is deliberately limited to two files and does not change approval or
alignment flags. Correct the draft cues after listening, then rerender to inspect
the corrections. Keep the source script authoritative when ASR text differs.
