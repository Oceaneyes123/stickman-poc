# Script and storyboard QA

Reviewed November 17, 2026, GMT+8. Status: complete researched text draft, ready for the user's script review. Not approved audio or production.

## Executed checks

- Existing script-package checker passed with exit code 0 after the final wording edits. It confirmed eight beats, eight narration blocks and identical spoken content in `script.md` and `narration.txt`.
- Final narration contains 1,462 whitespace-delimited spoken words. Beat counts are 141, 156, 225, 253, 174, 130, 196 and 187.
- The checker's speech-character scan passed. No digits, dollar/percent signs, brackets, slash notation or parenthetical directions occur in the plain narration. Its over-32-word sentence check also passed. This mechanical limit is not asserted to be a researched speech-quality rule.
- Planning arithmetic returned 9.75 minutes at an illustrative 150 words per minute. At 155 and 135 words per minute, respectively, the range is 9.43-10.83 minutes. This is an approximately ten-minute draft, not a measured ten-minute recording or a prescribed voice speed.
- The runnable assertion command in `sources.md` passed using the existing `sum` and `remaining` exports from `src/finance/math.ts`. Output was `{ before: 48, after: 54, increase: 6 }`, with threshold eligibility asserted true.
- `git diff --check` passed. No source code, render settings, package dependencies, existing episodes or narration assets were changed. `README.md` receives one package-index entry.

Reproduce the existing package check from the repository root:

```bash
python "C:/Users/Dave/AppData/Local/hermes/skills/software-development/money-trap-remotion-preview/scripts/check_script_package.py" videos/004-free-shipping
```

At the original script handoff, local-link, support-ID and package-content assertions passed for the six declared script-package files. All local Markdown links resolved, all source/support IDs were present in the ledger, every script beat had a visual note and support line, and the word-count headers matched the master. The later storyboard additions are validated separately below.

## Evidence review

Six source groups support eleven numbered claims. The 2007 and 2018 papers were downloaded from author/university sources and relevant paper passages were read. Shopify's current first-party article was directly retrieved. The 2006 and 2025 abstracts were verified through indexed publisher pages and publisher-deposited Crossref metadata after direct publisher access returned HTTP 403. The 2026 working paper was checked against the revised indexed SSRN abstract, its author's research page and a directly retrieved university seminar abstract. Full methods for those abstract-only sources were not reviewed.

The current 2026 summary restricts its spending result to continuing purchasers. The narration retains this restriction. The older and newer papers test different policy comparisons, not an identical treatment. Their existence does not establish prevalence, a universal effect or any particular customer's motives.

The zero-price experiment is explicitly separated from shipping research. Transactional bunching is not presented as a randomized finding, and a model result is called a model result. Merchant guidance demonstrates merchant advice rather than independent experimental effectiveness. Prices and shopping decisions are explicitly imaginary.

## Editorial desk review

The explanation begins with a recognizable checkout decision and resolves it by comparing complete delivered orders. Each beat adds a mechanism, evidence, retailer incentive, policy complication or meaningful constraint. The added item retains its possible value. No worked arithmetic is narrated, and no blame, invented debt, annual-loss projection, customer quotation or guaranteed saving is introduced.

A text-only speech and anti-slop pass simplified the price-gap sentence and removed an unnecessary spending metaphor. This was a desk review, not an audible read-aloud, TTS sample, audience test or creative approval. The film could be understood without remembering either example total. Short visual notes are proposals only.

## Pending or outside scope

- User's script/creative approval.
- Human read-aloud and comprehension review. Suggested prompt: "Why could removing a delivery fee make someone buy more, and when might the extra purchase still be worthwhile?" No human response has been collected.
- Full-methods appraisal of abstract-only sources, if required before publication. No unresolved factual detail has been filled with an invented finding.
- Local VoiceStudio synthesis and listening, pronunciation, measured complete WAV duration, cue alignment and hash review. TTS readiness remains pending. No finished 40-point score is assigned.
- User review of the untimed storyboard; third-party asset selection and permissions, graphics, animation, render, metadata/full decode and publishing. No assets were acquired or cleared and no visual implementation is claimed.

At the original script handoff, `npm run check` and rendering were not run because it was a text-only script task, not a code or film delivery. Existing compiler and production conventions are unchanged.

## Untimed storyboard validation, November 17, 2026

Added [storyboard.md](storyboard.md), [asset-manifest.json](asset-manifest.json), and the episode-scoped standard-library document check `storyboard-check.py`. No production component, application dependency or renderer schema was added. The original narration, script, source ledger, outline and brief are preserved.

Executed from the project root:

```bash
python videos/004-free-shipping/storyboard-check.py --self-test
python "C:/Users/Dave/AppData/Local/hermes/skills/software-development/money-trap-remotion-preview/scripts/check_script_package.py" videos/004-free-shipping
git diff --check
```

The storyboard check passed with 35 sequential shot groups, all 42 paragraphs and 1,462 spoken words covered in exact order, and 11 pending asset records. Every group has the nine documentary fields plus explicit phrase, text, motion, transition and continuity notes. Paragraph/beat identity, exact spoken excerpts, phrase anchors, claim IDs, asset-use mappings and named motion/transition exports passed. The full narration fingerprint matches `05f1786d95552a0e64d22288bd47a3c8d4e0cc3f8a04404e5253b72cad5a66bc`.

Five negative self-checks were rejected: a missing field, changed narration, a wrong paragraph anchor, a stale fingerprint and a missing asset record. The existing script-parity check also returned OK. The math assertion using `src/finance/math.ts` passed again: original merchandise 42, eligibility threshold 50, enlarged merchandise 54, delivered totals 48 and 54, and extra outlay 6. These are A01's fictional USD assumptions, not new narration or a screen calculation lesson.

The board was desk-reviewed for its opening/closing callback, unsubmitted-order continuity, merchandise-subtotal versus delivered-total distinction, qualitative toothpaste branch, research-setting separation and qualifications. The motion audit found that inspected `DrawOn` and `PopIn` are demo-shape components, not arbitrary product/path wrappers; the board does not claim otherwise. Custom episode artwork and motion remain proposed.

- 2026-11-18: Aligned [storyboard.md](storyboard.md), [asset-manifest.json](asset-manifest.json), [sources.md](sources.md) and `storyboard-check.py` with [decision #14](../../docs/decisions.md#14-presenting-fictional-scenarios--2026-11-16) by removing on-screen `fictional`, `illustrative` and `hypothetical` scenario badges while preserving invented-scenario records and source/scope attributions. Added `FreeShippingExample`, `freeShippingExample` and `calculateFreeShippingOrder` to `src/finance/math.ts` with regression coverage in `tests/production.test.ts` and a 6-case `--self-test` in `storyboard-check.py`.
- 2026-11-18: Updated [storyboard.md](storyboard.md) for visual progression and retention continuity: staged the charger inside the checkout preview on Frame 0 (`V4-S01`), added derived proportional blocks/overhang (`V4-S02`, `V4-S03`, `V4-S17`), turned `V4-S04` into a visual open-loop gap slot to remove duplication with `V4-S09`, added per-paragraph sub-staging on multi-paragraph shots (`V4-S06`, `V4-S10`, `V4-S16`, `V4-S23`, `V4-S25`, `V4-S27`, `V4-S35`), replaced middle-act text-only citation cards with qualitative schematics/policy matrices (`V4-S14`, `V4-S15`, `V4-S25`, `V4-S26`), expanded audited `Motion references` and transitions (`ComparisonReveal`, `ObjectAttachedLabel`, `AnimatedList`, `SectionHeading`, `GrowBuild`, `SplitAssemble`, `ConveyorFlow`, `ChainReaction`, `split-open`, `push-in`, `pull-back`, `wipe`, `slide-push`, `match-position`), stripped promotional chrome during the payoff test (`V4-S33`), and delayed the quiet bookend `callback-cut` to `P42` (`V4-S35`). Re-ran `storyboard-check.py --self-test` (`PASS`), `tests/documentary.test.ts`, `tests/production.test.ts`, and `git diff --check`.
- 2026-11-18: Built the 60-second (`1,800` frames at `30` fps) `FreeShippingOpening` composition (`src/scenes/FreeShippingOpening.tsx`, `src/scenes/freeShippingOpeningTimeline.ts`) plus `FreeShippingCheckoutGallery` and `FreeShippingChocolateGallery` registered in `src/Root.tsx`. Used the first 14 draft ASR cues (`p001-s001` through `p003-s002`, `0.0`–`57878.625` ms) from `out/004-free-shipping/narration-daniel/timing/cues.draft.json` in `videos/004-free-shipping/opening-cues.demo.json` (`mode: "timing-demo"`), and copied the exact unstretched `58.15`s PCM prefix (`2,791,200` samples at `48` kHz mono 16-bit) of `out/004-free-shipping/narration-daniel/narration.wav` padded with silence to `60.0`s (`public/free-shipping-opening/narration.wav`) so `p003-s003` is not cut mid-word. Derived checkout proportions (`42/50` fill, `54/50` overshoot, `48` vs. `54` order stacks) use `calculateFreeShippingOrder()` in `src/finance/math.ts`; no MP4 or still render was run per instruction; listening, phrase-cue, gallery and visual inspections remain pending.
- 2026-11-18: Added deterministic ambient background music (`scripts/audio/free-shipping-ambient.py` -> `public/free-shipping-full/ambient.wav`, 506.822 s at 44.1 kHz mono 16-bit PCM, -23.1 dBFS RMS / -12.07 dBFS peak before 0.13 playback gain) and picture-anchored reduced-level sound effects (`src/scenes/freeShippingAudioCues.ts`, `src/scenes/freeShippingSound.tsx`: 37 cues in `FreeShippingOpening`, 107 cues in `FreeShippingFullFilm` from `public/sfx/*.wav`). `npm run lint`, 26 Node tests (`tests/free-shipping-audio.test.ts`, `tests/free-shipping-opening.test.ts`, `tests/free-shipping-full-film.test.ts`, `tests/sfx.test.ts`, `tests/documentary.test.ts`), `npm run test:timing`, and `storyboard-check.py --self-test` pass; mixed listening review, loudness/peak check, MP4 export, and creative approval remain pending.

No episode-004 audio output directory was present at the expected location. The board therefore uses document paragraph IDs and intended phrase triggers, not fabricated audio takes, timestamps or aligned frames. Its narration fingerprint is not a cue hash. No audio listening, human comprehension, rendered readability or creative approval occurred. All media permissions and original-art provenance remain pending; optional footage and authentic paper excerpts have explicit original-art/source-card fallbacks.

This is planning-document verification only. The renderer, full application checks, gallery review, stills and video were not run. Film production still requires its normal technical and human approvals. Future timing must be derived from measured, reviewed narration rather than this untimed plan.
