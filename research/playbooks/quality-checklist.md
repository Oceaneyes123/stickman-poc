# Quality checklist

Two gates: what must be true before a render, and what must be true after. Each item
traces to a research finding or an existing repo rule — the source is named so nobody
has to guess why it is here.

## Gate 1 — before render

**Script**
- [ ] Hook is one of the eight observed shapes and names the contradiction by 0:25.
      (`scriptwriting-playbook.md` §1)
- [ ] No greeting, no channel intro, no "in today's video". (verified absent in 26
      transcripts)
- [ ] Mean sentence 11–16 words; ≥25% of sentences ≤8 words. (corpus range 7.3–23.6)
- [ ] Second person 2.0–3.5 per 100 words. (Beanie 5.19, Economics Explained 0.46)
- [ ] Zero hits on the banned phrase list. (`references/SCRIPT_GUIDE.md` + corpus
      verification)
- [ ] Every number traces to `sources.md`; every total traces to
      `src/finance/math.ts`. (repo rule)

**Storyboard**
- [ ] Every scene carries a type number 1–7; none is type 8 (borrowed artefact) or 9
      (extreme face close-up). (`storyboard-playbook.md` §1)
- [ ] Section labels appear once per section, same pixel position. (Paint Explainer)
- [ ] No two consecutive scenes share framing preset + subject position + background
      value. (`cinematography-guide.md` §5)
- [ ] Every beat has exactly one object doing the explanatory work. (all channels)
- [ ] At least one scale or comparison reveal inside the first 60 s. (every hook in
      the corpus does this)

**Animation**
- [ ] Contact shadow on every grounded figure. (pattern A1)
- [ ] No single-frame limb teleport; pose changes blend. (pattern A2)
- [ ] Cards hold ≥45 frames; two-number cards ≥75. (pattern A3)
- [ ] Every label has its object on screen for its whole life. (pattern A4)

**Audio**
- [ ] Measured WAV, no stretched speech. (repo rule)
- [ ] 165–190 wpm as measured from the WAV, not estimated. (`audio-narration.md` §4)
- [ ] One sentence per cue; no cue over ~30 words.
- [ ] A beat of silence before each section card. (inferred from the slower channels)

## Gate 2 — after render

**Technical**
- [ ] `npm run check` passes (ESLint, strict TS, tests).
- [ ] `scripts/review/qa.py` full decode, metadata 1920×1080 / 30 fps / H.264 / yuv420p.
- [ ] Contact sheet of every beat boundary inspected; no cropped hands, no label over
      a face, no figure floating.
- [ ] Scene-detection count on the render, for the record:
      `ffmpeg -i out.mp4 -filter:v "select='gt(scene,0.35)',showinfo" -an -f null -`
      — compare against the 7.5–16/min band only as a sanity check, never as a target.
      (`../channels/editing-pacing.md` §1 explains why the
      number is unreliable across art styles.)

**Editorial**
- [ ] The opening 15 s can be repeated from memory after one viewing.
- [ ] The closing statement answers the opening question.
- [ ] Every number spoken matches a number on screen, and both match
      `src/finance/math.ts`.

**Honesty**
- [ ] No claim in the video rests on a number that is not in `sources.md`.
- [ ] Hypothetical examples are labelled as examples.
- [ ] Technical verification and human creative approval are recorded separately.
      (existing repo rule)

## What this checklist deliberately does not include

- Retention or CTR targets. No retention data exists in the research corpus; setting
  a number would be invention.
- "Smoothness" or "polish" criteria. They are not inspectable. The inspectable
  substitutes are above: no teleport, contact shadow, label/object pairing, hold
  lengths.
- A shot-length quota. The measured band is 3.7–8.0 s per detected change for narrated
  videos, but a quota would force cuts the story does not need.
