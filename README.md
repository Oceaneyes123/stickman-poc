# The Money Trap animation toolkit

Reusable local Remotion + React + strict TypeScript tools. Current characters:
hairless Sam in a blue hoodie, Alex in a white shirt and glasses.

## Run

Use Node 24.6+ and npm from the repository root.

```powershell
npm ci
npm run dev
npm run check
npm run render
npm run stills
```

`render` and `stills` target the 20-second `MovementReview`. Studio also provides
`WalkingMechanics`, `BankExample`, `CharacterStudy` and `ComponentGallery`.
Rendering uses local assets and local Chromium, with no paid services.

| Command | Purpose |
| --- | --- |
| `npm run render:walking` | Ten-second walking review |
| `npm run walking:stills` | Walking keyframes |
| `npm run render:movement` | Full movement review |
| `npm run movement:stills -- --debug` | Motion diagnostics |
| `npm run render:bank` | Door contact and cash handoff example |
| `npm run bank:stills` | Interaction keyframes |
| `npm run characters:stills` | Identity, expression, pose and gesture sheets |
| `npm run render:gallery` | Reusable component gallery |
| `npm run build` | Local Remotion bundle |

MP4 output is 1920x1080, 30 fps, H.264/yuv420p. Review stills use half scale;
character inspection sheets use higher resolution. Generated output goes in `out/`.
The latest walking and movement MP4s remain there; obsolete previews were removed.

## Reusable files

- `src/characters/`: SVG artwork, motion planner, gait, constrained IK, balance,
  expressions, hands and debugging. See the [character guide](src/characters/README.md).
- `src/animation/`, `src/scenes/`, `src/finance/`, `src/design/`: motion helpers,
  scene templates, interactions, financial graphics, arithmetic and fonts.
  The legacy `StickmanRig.tsx` remains for shared templates and ComponentGallery.
- `src/timeline/`: pure cue/storyboard validation and compilation. Future films
  own their narration, measured audio, cue files and single global audio track.
- `tests/fixtures/timeline/`: compiler test input, not an active film.
- `scripts/`: local rendering, asset setup, inspection and transcript tools.
- `references/`: character art, channel guidance and upstream research.
- `videos/sam-atm/`: separate existing film, preserved independently.

The old MoneyTrapPOC film, its narration/story folder, generated timeline,
POC-only scripts, build bundle and superseded previews were removed.

## Verification

`npm run check` runs ESLint, strict TypeScript and all regression tests.
Inspect rendered frames after visual changes. With FFmpeg/ffprobe on PATH and
Pillow installed:

```powershell
python scripts/qa.py out/movement-review-arm-correction.mp4 --frames 600
npm run characters:stills
python scripts/character-detail-sheets.py
```

Video QA checks metadata, decodes the entire video and generates a contact sheet.
Technical checks do not replace human visual or listening approval. No aligned
narration is currently supplied.

See [production rules](AGENTS.md), [sources and licenses](SOURCES.md),
[walking research](docs/walking-mechanics-research.md), and
[current validation](docs/animation-validation.md).

## Channel research

Production-level reverse engineering of 18 channels, with raw evidence in
`research-evidence/` and playbooks in `deepseek-docs/`. Start at
[deepseek-research/README.md](deepseek-research/README.md). Regenerate the evidence with
`scripts/research/`; nothing in `deepseek-*` is hand-typed that a script can produce.

## Channel transcripts

From PowerShell, quote YouTube handles:

```powershell
cd scripts/get_transcript
python get_transcripts.py --longform "@jamesjani" "@howmoneyworks" "@CasuallyFinance"
python get_transcripts.py --short "@howmoneyworks"
```

Each channel's selected tab is ranked by reported views before taking the top five.
Use `--count N` to change that limit. Files and `ALL.txt` are saved separately in
`transcripts/<handle>/longform/` or `transcripts/<handle>/short/`. Existing downloads
are preserved. Install
`yt-dlp` and `youtube-transcript-api` with pip if needed. YouTube rate limits or
unavailable captions are recorded in `transcripts/missing.txt` and return exit code 1.

The downloader prefers one native English caption track, then another native
language, without automatically translated tracks. It paces subtitle requests and
retries HTTP 429/API blocking twice with 30s/60s backoff. A longer `Retry-After`
stops the run instead of retrying early. Persistent blocking stops further network
requests and preserves saved transcripts and any existing combined file. Wait and
rerun the same command to resume; the script cannot clear YouTube's IP block.

If captions remain blocked but audio downloads work, use local speech recognition:

```powershell
python get_transcripts.py --longform "@jamesjani" --transcribe
```

This skips caption requests entirely. It requires `faster-whisper` and a cached
`small` model, uses CPU/int8, and saves labeled recognition results separately in
`transcripts/<handle>/<mode>/transcribed/`. Audio is cached under its `_raw/`
folder for resuming. No model is downloaded automatically. To install/cache once:

```powershell
pip install faster-whisper
python -c "from faster_whisper import WhisperModel; WhisperModel('small', device='cpu', compute_type='int8')"
```

Speech recognition can mishear words, names and numbers; review the output. This
mode still requires access to channel listings and downloadable audio.

Run focused tests with `python -m unittest discover -s scripts/get_transcript`
from the repository root.
