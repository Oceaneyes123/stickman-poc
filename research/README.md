# Research output

Deep production-level reverse engineering of 18 YouTube channels, converted into
playbooks for this repo. Prepared 2026-11-10.

This file is the index for `research/`. Nothing here is referenced by the render
pipeline; the film itself only reads `src/`, `videos/` and `out/`.

## Layout

```
research/
  evidence/                             raw corpus (do not hand-edit)
    index.json                          ranked videos per channel
    channel-stats.json                  subscriber counts read from channel pages
    metrics.json                        per-video words, wpm, hook windows, phrase counts
    tables.md                           generated corpus tables
    visual-observations.md              what each sampled frame showed
    frames/                             contact sheets + stills + 480p sources
    <channel>/<video-id>.json           timed captions or ASR transcript
  channels/                             the analysis
    channel-profiles.md                 18 channels, what each actually does
    video-analysis.md                   which videos have which evidence
    script-reverse-engineering.md       hooks, beats, sentence numbers
    animation-reverse-engineering.md    character construction, staging
    cinematography-composition.md       framing, placement, palette
    storyboard-patterns.md              narration mapped to real frames
    typography-motion.md                what text exists and what it is for
    editing-pacing.md                   measured cut counts and speech rate
    audio-narration.md                  speech rate only; nothing was listened to
    cross-channel-comparison.md         the matrix, and what must not be combined
    production-pipeline.md              inferred workflow, labelled as inference
    reference-index.md                  every cited video + its evidence (generated)
  playbooks/                            the reusable guidance
    scriptwriting-playbook.md
    storyboard-playbook.md
    animation-pattern-library.md
    motion-graphics-library.md
    cinematography-guide.md
    quality-checklist.md
  plans/README.md                       pointer note; no plan documents were written
```

Generation and measurement scripts stay in `scripts/research/`: `fetch_evidence.py`,
`transcribe_audio.py`, `sample_frames.py`, `metrics.py`, `report_tables.py`,
`write_reference_index.py`.

## Scope decisions

- **Sections 11 and 12 of the brief were skipped** at the user's instruction: no
  code-translation chapter and no new style bible. The repo already owns both —
  `AGENTS.md` (brand, palette, format rules) and `docs/cinematic-implementation.md`.
  `research/plans/` therefore contains only a pointer note.
- **Evidence beats coverage.** 18 channels × 5 videos were ranked, but only 26 videos
  had retrievable text (YouTube IP-blocked captions on the rest) and 6 were visually
  sampled. Every document states which is which rather than filling gaps.
- **No retention, CTR or impression data exists in this corpus**, and no claim is made
  about it.

## Honesty rules used throughout

1. Observations are separated from inference in every file.
2. A timestamp appears only if a caption segment or a sampled frame supports it.
3. Motion timing, easing, cut rate and audio were not measured; where they matter,
   the document says so and gives the method that would measure them.
4. Generated tables and the reference index are produced by scripts, not typed.

## Regenerating

```bash
python scripts/research/fetch_evidence.py --count 3 @Handle …
python scripts/research/transcribe_audio.py --missing
python scripts/research/metrics.py
python scripts/research/report_tables.py
python scripts/research/write_reference_index.py
python scripts/research/sample_frames.py <video-id> --times 5,60,300
```

Requires `yt-dlp` (2026.10.21+), `youtube-transcript-api`, `faster-whisper`, ffmpeg,
and a JS runtime for yt-dlp (`--js-runtimes node:…`).
