# Quality checklist

**Current guidance · 2026-11-16 · Phase 6.** Apply the [script](../../references/SCRIPT_GUIDE.md), [visual](../../references/VISUAL_STYLE_GUIDE.md), [teaching](../../references/TEACHING_STYLE_GUIDE.md) and [media-sourcing](../../references/MEDIA_SOURCING.md) guides. This checklist defines future production review; no item is marked passed by this documentation change.

## Gate 1 — script and storyboard

**Narration and learning**

- [ ] The opening establishes a recognizable situation/question and honors the title/thumbnail promise without a fixed-second or numerical-reveal quota.
- [ ] Each section adds a meaningful event, consequence, complication or explanation; the ending answers the central question.
- [ ] The concept remains understandable without remembering numbers. The explanation avoids unnecessary math, generic lectures, patronizing language and unsupported blame.
- [ ] Anti-slop review checks meaning and cadence in context, with no automatic phrase/sentence/pronoun quota.
- [ ] Factual claims are supported in `sources.md`; hypothetical examples are labeled and assumptions/qualifications preserved. Modeled arithmetic is checked through the existing finance module.
- [ ] A comprehension review is recorded in `qa.md`, or explicitly pending. A desk read is not audience evidence or listening approval.

**Visual purpose and authenticity**

- [ ] Every beat has the visual guide's nine fields, an appropriate medium and one dominant learning purpose. No character, exact object count or scene-family rotation is mandatory.
- [ ] Original graphics, licensed footage, photos, collages, mock interfaces and permitted authentic excerpts are selected for explanation/context/evidence rather than decoration.
- [ ] Authentic evidence retains source/date/context; recreations and illustrative interfaces are labeled where confusion could arise. No fabricated screenshot, quote, headline or customer record is presented as real.
- [ ] No unrelated stock footage implies a person's financial distress, endorsement or participation in a fictional case.
- [ ] Sources and media permissions are recorded separately. Every third-party asset intended for delivery has evidence supporting its specific use, required credits and restrictions. Pending assets remain planning placeholders.
- [ ] The asset manifest records actual files/versions, original and derived provenance, verification dates and applicable disclosure decisions. It is a manual record, not an automated clearance gate.

**Readability and timing**

- [ ] Text is selective, well wrapped and readable at 0.5 scale and phone size; essential graphics respect side margins and do not cover faces or important actions.
- [ ] Graphics preserve dates, units, state continuity and honest scale. Visible/spoken amounts agree where they refer to the same value; neither must automatically repeat the other.
- [ ] Motion explains a change, and settled states have enough reading time. Static holds, clean cuts and repeated framing are allowed when purposeful.
- [ ] Narration is measured local audio with no stretched speech or forced rate; actual generated audio has been listened to, or approval remains pending.
- [ ] Phrase timing is reviewed against audio; hashes and compiled cue/event frames match the current master. Structural validation alone is not alignment/listening approval.
- [ ] Any legacy character shot also satisfies its identity, kinematic, grounding and hand/prop checks. These do not become mandatory documentary imagery.

## Gate 2 — future render and delivery

- [ ] `npm run check` passes for the final production source; record the actual command/result and scope.
- [ ] Inspect every beat and boundary, including actual motion, text wrapping, clipping, transitions, source labels and medium changes. A contact sheet alone does not prove motion quality.
- [ ] Verify the final MP4 metadata and full decode with the existing review tools: 1920×1080, 30 fps, H.264/yuv420p. Follow the actual episode's measured-audio/delivery requirements; do not infer them from a filename.
- [ ] Listen to the final assembled narration/mix for intelligibility, pronunciation, missing words, timing and unwanted audio. A waveform/hash or successful decode is not listening.
- [ ] Compare delivered media with its manifest, permissions evidence and credits. Confirm authenticity labels and required platform disclosures; no visual format guarantees monetization.
- [ ] A reviewer can explain the central cause and relevant qualification without recalling a number; record any remaining confusion.
- [ ] Record technical verification, human creative approval, comprehension review and audio listening approval separately in current QA/validation. Mark unrun or failed work explicitly; no automatic “approved” from passing tests.

## Evidence limits and stop conditions

No retention/CTR, cut-count, speech-rate, sentence-length, numerical-reveal or fixed-shot-duration target follows from the limited [research corpus](../README.md). Do not invent performance evidence. An unsupported consequential claim, misleading image, unresolved delivery-media permission, stale audio/cue relationship or failed technical check must be resolved before claiming the corresponding gate passed.

This phase does not run production checks, render episodes, clear assets or grant human approvals. Use the checklist when production is actually authorized.

## Historical checklist — superseded requirements

The original below is retained verbatim as a dated record. Its phrase bans, quotas, figure requirements and compulsory text/number duplication are **not active documentary acceptance criteria**.

<details>
<summary>Original quality checklist — historical, not production instructions</summary>

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

</details>
