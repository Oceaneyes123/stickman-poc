# Current animation validation

## Workspace reset — 2026-11-20

Past episode scenes, storyboards and one-off previews were moved to a recoverable archive. The episode scripts, reusable components and timeline tools remain available. The default Studio entry point has no composition registrations. `npm run check` passed ESLint, TypeScript, 84 Node tests and 5 Python timing tests. Entries below record earlier production checks.

## Video 5 sound effects — 2026-11-20

`WarAndWalletFullFilm` plays 91 sound clips against the single unchanged narration WAV. The cue schedule uses compiled picture anchors and 18 local effects, including nine new original synthesized WAVs. The opening pump returns in B07 and cuts at the nozzle click. The Ukraine homes and Somalia affordability holds have no sound effects.

- Studio playback advanced with the narration and effects mounted. Ten focused sound and timeline checks passed. An independent in-memory sum of decoded narration and scheduled effects reached **−1.46 dBFS sample peak**. No video was rendered.
- ESLint and TypeScript passed. The Node suite passed 129 of 130 tests. The existing Video 3 test requires the missing `public/subscription-full/ambient.wav`.
- Continuous listening and creative mix approval remain pending.

## Video 5 full Studio cut — 2026-11-20

`WarAndWalletFullFilm` runs through the remaining Somalia narration, the Fed and borrowing sections, and the pump and grocery callback. It uses one narration node and runs for 13,267 frames at 30 fps, rounded from the 442,232.75 ms master. The first-five-minute cut remains available separately.

- Timeline tests verified the retained cut starts, uninterrupted Somalia shot across 5:00, closing shot order and duration. Studio spot checks covered the continuation, Fed dates and levers, contracts, year-end comparison, deliveries and final receipt state.
- ESLint, TypeScript and the five Python timing tests passed. The Node suite passed 127 of 128 tests. The existing subscription ambient test requires the missing `public/subscription-full/ambient.wav`.
- Continuous playback and listening-based alignment remain pending. No video render was started.

## Video 5 first five minutes — 2026-11-20

`WarAndWalletFirstFive` is a 1920×1080, 30 fps Studio preview from frame 0 through frame 8,999. It uses one copy of the finished narration and stops during B05's Somalia narration. The approved B01 pictures and cut boundaries carry over from `WarAndWalletOpening`. `WarAndWalletMechanismGallery` contains the oil bids, freight handoff and wheat bids. Production assets and open rights are recorded in the [episode manifest](../videos/005-war-and-your-wallet/asset-manifest.json).

- The focused timeline test verified the exact five-minute duration, B01 boundaries and in-shot events. Studio spot checks confirmed the opening, both bidding payoffs, freight accumulation, the Razoni timeline, the flour and freight comparison, and the final Somalia frame.
- ESLint, TypeScript and all five Python timing tests passed. The Node suite passed 126 of 127 tests. The existing subscription ambient test requires the missing `public/subscription-full/ambient.wav`.
- Picture cues retain provisional ASR timing. Continuous playback, listening alignment and final asset review are pending. No render was started.
- The 0:45–4:00 graphics pass replaced the oil-price text card with two schematic tracks and reduced copy on the bids, fuel deliveries, freight handoff, port alternatives, Razoni timeline, and flour-order comparison. Studio checks sampled the oil and wheat bids, price and supply tracks, freight payoff, ship timeline and bread comparison. ESLint, TypeScript and the focused timeline test passed with the original cut boundaries.

## Composable Anti-Template Documentary Engine (Phases 1–4) — 2026-11-19

Implemented the four-phase composable documentary motion engine without modifying existing episodes (`001`–`004`), existing galleries, or uncommitted episode-004 changes:

- **Phase 1 (Foundation primitives & actors):** Upgraded `src/objects/motion.tsx` primitives to wrap real SVG `children`, `items`, `layerContent`, and `pathD` while retaining `<Body>` defaults; added pure closed-form `sampleSpring` / 5 `MOTION_PROFILES` (`src/documentary/core/motionProfiles.ts`) and HTML/SVG `MotionBox`, `MotionGroup`, `StaggerGroup` (`src/documentary/core/MotionWrapper.tsx`); extracted reusable actors (`src/documentary/actors/`: `CursorActor`/`SvgCursorActor`, `DrawConnector`, `ThresholdMeter`, `ProportionalBarComparison`, `PresenterStage`, `DocumentaryEndCard`); generalized the 15 kinetic cutaways into data-driven `src/cutaways/`.
- **Phase 2 (Act Looks, spatial grammar, depth camera & bridges):** Added 7 semantic-preserving surface Looks (`src/documentary/core/looks.ts`), 7 asymmetric/borderless `LAYOUTS` + `getRegionEntryDirection` (`src/documentary/core/geometry.ts`), depth-parallax `sampleCameraRig`/`cameraLayerTransform` (`src/documentary/core/camera.ts`), cumulative `resolveActiveStage` (`src/documentary/core/stages.ts`), and `findMatchingBridges`/`sampleBridgeRect` (`src/documentary/core/bridge.ts`), wired into `src/documentary/composer/`.
- **Phase 3 (Word anchoring, auto-SFX & composable stage archetypes):** Added `wordId`/`wordEdge` anchoring and look/profile/sfx metadata to `src/documentary/timeline.ts`; added `compileDocumentarySfx` (`src/documentary/sfxCompiler.ts`); added 7 composable stage builders (`src/documentary/stages/`: `ComparisonStage`, `EvidenceHighlightStage`, `PolicyMatrixStage`, `MechanismFlowStage`, `InteractiveUiStage`, `PresenterSplitStage`, `CutawayStage`).
- **Phase 4 (Multi-axis QA, galleries & pilot):** Expanded `auditVisualVariety` in `src/documentary/qa.ts` (`repeated-polarity`, `repeated-container`, `hard-cut-run`, `static-long-scene`, `hardCutRatio`); added `CutawayGallery` (`990f`), `DynamicMotionGallery` (`1080f`), and 6-scene `DynamicShowcasePilot` (`540f`) in `src/Root.tsx`, plus regression tests in `tests/dynamic-template.test.ts`.

**Rendered preview stills & visual review (2026-11-19):**
- Rendered 12 0.5-scale stills (`out/dynamic-template-review/gallery-f045/225/315/510/865/945.png` and `pilot-f048/098/225/310/410/500.png`), visually inspected them, and fixed `evidence-desk` cell ink contrast (`surfaceInk`), `match-position` bridge ghosting/fade, scale balance beam tilt direction, and light-surface eyebrow/pill contrast.

**Verification & approval boundaries:**
- `npm run lint` (`eslint src scripts && tsc`): 0 errors, 0 warnings.
- Node test suites (`tests/dynamic-template.test.ts`, `tests/documentary.test.ts`, `tests/production.test.ts`, `tests/motion.test.ts`, `tests/typography.test.ts`, `tests/sfx.test.ts`, `tests/free-shipping-opening.test.ts`, `tests/free-shipping-full-film.test.ts`, `tests/free-shipping-audio.test.ts`), `npm run test:timing`, `npm run documentary:qa`, and `npx remotion compositions src/index.ts` passed.
- Pre-existing unrelated baseline failure untouched: `tests/subscription-audio.test.ts` fails locally due to missing `public/subscription-full/ambient.wav`.
- Human creative approval, full-motion video playback review, and audio listening approval remain separate and pending.

## P0 Documentary Production Components & BNPL Demonstration — 2026-11-18

Implemented the reusable **Premium Editorial Finance Documentary** component library under `src/documentary/` (`core`, `assets`, `timeline.ts`, `composer`, `ui`, `evidence`, `diagrams`, `objects`, `typography`, `presets`, `qa.ts`, `Gallery.tsx`, `demo/BnplFeelsCheaperDemo.tsx`) alongside additive extensions in `src/finance/math.ts` and `src/timeline/types.ts` / `validation.ts`, plus CLI QA/render scripts in `scripts/documentary/`.

**Rendered outputs & verification (2026-11-18):**
- Demonstration composition `BnplFeelsCheaperDemo`: `out/demo-bnpl-feels-cheaper/bnpl-feels-cheaper.mp4` (`1920x1080`, `30 fps`, `h264`, `yuv420p`, `bt709` TV range, `1560` frames / `52.0s`, `scripts/review/qa.py` `fullDecode: passed`), scene/boundary stills under `out/demo-bnpl-feels-cheaper/stills/`, and labeled contact sheet `out/demo-bnpl-feels-cheaper/contact-sheet.jpg`.
- Documentary component gallery `DocumentaryGallery`: `out/demo-bnpl-feels-cheaper/documentary-gallery.mp4` (`1440` frames, 16 panels, `fullDecode: passed`), panel stills under `out/demo-bnpl-feels-cheaper/gallery/`, and `out/demo-bnpl-feels-cheaper/gallery-contact-sheet.jpg`.
- Mixed-media acceptance scene `DocumentaryMixedMediaShowcase`: `out/demo-bnpl-feels-cheaper/mixed-media-showcase.mp4` (`180` frames, `fullDecode: passed`) combining local `public/documentary/shopping-context.mp4`, original SVG product art, animated typography, and `CheckoutInterface`.
- Automated checks: `npm run lint` (`eslint src scripts && tsc`, 0 errors/0 warnings), `node --experimental-strip-types --test tests/documentary.test.ts tests/production.test.ts tests/buy-now.test.ts tests/typography.test.ts tests/motion.test.ts` (54/54 passing), `npm run documentary:qa` (`passed: true`, written to `out/demo-bnpl-feels-cheaper/qa-report.json`), and `python videos/004-free-shipping/storyboard-check.py --self-test` (`PASS`).

**Approval boundaries:** Technical QA (`passed`) verifies compilation, manifest hashes, safe margins, Inter text bounds, continuity tokens, and video stream integrity. Visual/creative approval (`requires human review`) and narration audio listening approval (`pending` — `videos/demo-bnpl-feels-cheaper/cues.json` is an explicit `timing-demo` fixture without generated WAV narration) remain separate.

## Documentary documentation migration — Phases 7–9 — 2026-11-16

Updated global production instructions, README/workflow/provenance entry points and the dated superseding decision. The brand, script, visual, teaching and sourcing guides and current playbooks now agree on narrator-led editorial finance documentaries. Character identity/kinematic and episode-room requirements are explicitly legacy-scoped; earlier episodes, decisions and validation entries remain historical records.

Documentation validation checks local links in maintained guides/root documents, preservation of the six original playbooks inside their historical sections, preservation of the earlier decision rows/cleanup and provenance snapshot, JSON example syntax, phase coverage, and documentation-only Git scope. `git diff --check` is the whitespace gate. The [migration audit](documentary-migration-audit.md) records the final results, remaining historical links and unverified work.

**Result:** Passed the documentation coverage, local target/heading-anchor, JSON, fence/details, preservation and Git-scope checks; `git diff --check` passed. Scanned 105 project Markdown files; all 21 changed/new documents have valid local targets. Ten deleted historical episode-001 review-output links remain in unchanged episode records and are explicitly recorded in the audit.

No production-code or existing episode/assets changed. No `npm run check`, new render, metadata/full-decode pass, synthesis, listening pass or human creative approval was performed for this documentation-only task. Earlier film verification remains as dated below; it is not renewed by these edits. Future documentary components and automatic asset-clearance tooling remain unimplemented.

## Video 002 — colour-script redesign of every scene — 2026-11-15

**Request.** Video 2 read as one pale paper room for all 68 scenes: the shared
`NarrativeScene` drew the same cream backdrop behind every stage, and the set
was navy-line art on near-whites. The brief was a colour-rich background and
scene while keeping the story intact.

**What changed.** New `src/storyboard/buyNowLook.ts` holds a six-act colour
script — teal shop (S01–S08), amber first month (S09–S18), coral obligations
(S19–S30), indigo strain (S31–S41), sienna café (S42–S52), mint resolution
(S53–S68) — each with a wall gradient, motif, floor, board, card, hairline,
wood and fabric tone. `lookForScene(scene.id)` reads the act from the
sequential scene id, so the colour script is one table rather than 68 plan
edits; `lookVars()` exposes the tints as CSS custom properties.
`src/storyboard/BuyNowBackdrop.tsx` draws video 002's rooms: wall gradient, wall bays,
one large motif (sun, arch, window, pendants, dawn sun), light pool, skirting,
floor and vignette. It sits behind the stage and never moves with the camera.

`NarrativeScene` gained optional `backdrop` and `style` props; the paper
backdrop stays the default, so video 1, the component galleries and the
cinematic reference scenes are untouched. `BuyNowStages` now wraps every stage
in its act look, adds a solid `Plate` board behind the band, columns, calendar,
account and closing stage so cream cards separate from saturated walls, centres
two- and three-column layouts on their own width, gives checkout a drop shadow,
and moves the lunch counter into the café room so a location does not switch
palette two scenes apart. `BuyNowArt` and `cinematicEnvironment` read
`--bn-card`, `--bn-line`, `--bn-quiet`, `--bn-wood` and `--bn-fabric` with the
shipped colours as fallbacks; the car cabin accepts an optional dusk tone. Card
day labels now use ink at reduced opacity instead of grey.

**Story untouched.** `compiled.json` (sha256 `70928242…`) and
`audio-manifest.json` (`a6e077a2…`) are byte-identical to the previous packet:
scene and event frames, text beats, SFX placement and the audio bed are
unchanged, and the bed hashes to `edc77b46…`. No narration, cue, timing or
finance edit was made.

**Verification.** `npm run check` passes ESLint, strict TypeScript, 95 Node
tests and 5 Python timing tests. Eighteen moment stills were inspected across
all six acts and every stage family that carries a plate (desk, checkout, band,
columns, calendar, notifications, account, car, café, mirror, rail, wide,
counter, walk, closing); the first pass exposed translucent boards that washed
the cards out, which is why they are now solid tinted plates. The film was
re-rendered from the final source into `out/002-buy-now-pay-later/color-v2`:
1920×1080, 30 fps, H.264 `yuv420p`, TV range, 17,784 frames, 592.811 s,
40,836,727 bytes, sha256 `811387237b239ae1b48a09375e21d41a5b272e7b55f69330048a2ceb52965663`;
a full `ffmpeg -f null -` decode returned no errors. Evidence stills are in
that packet's `images/` and `images/review/`, with `sheet-looks.png` beside them.

**Not verified.** No encoded review of the 15-stage motion gallery after the
reskin, no cut-by-cut inspection of all 68 scenes (18 stills only), no human
creative approval of the new palette, and no audio listening pass — the audio
bed is byte-identical, so audio is unchanged rather than re-approved. The
superseded `delivery/` packet is kept; its video no longer matches the source.

## Video 002 — seated-pose start correction and re-render — 2026-11-14

Reviewing the 2026-11-13 candidate, the parent found a real motion defect: every
shot's first 18 frames played a standing-to-seated blend even when the shot
declares `pose="sitting"`. `Actor` in `src/storyboard/BuyNowStages.tsx` passed
`fromPose: pose === "walking" ? "walking" : "standing"`, so seated desk
(S01/S04/S10/S13/S15), car (S31) and cafe (S43–S47) shots stood up and sat down
again at every cut.

**Fix.** `Actor` now passes `fromPose: pose`: a shot starts in the pose it
declares, and a pose change is animated only when a scene explicitly asks for
one via `actionFrom`. The legacy shared rig is untouched, and walking shots keep
their walk phase (`fromPose === "walking"` was already the behaviour). A focused
kinematic regression test was added to `tests/buy-now.test.ts`: frame 0 of a
seated shot must sit clearly lower than standing (hip.y −68 vs −111), and the
previous wiring must reproduce standing exactly on frame 0. `npm run check`
passed ESLint, strict TypeScript, 95 Node tests (94 + 1 new) and 5 Python timing
tests.

**Evidence.** `out/002-buy-now-pay-later/review-pose/sheet-pose-before-after.png`
pairs old and new frames at S01 f0/f18, S31 f6680/f6698 and S43 f9974/f9992
(old = superseded render in `delivery-r1`, new = fixed source at 0.5 scale).
The parent inspected `delivery/images/b01-next.png`, `b43-next.png` and
`b31-next.png` directly and passed first-frame seated posture in desk, cafe and
car; that review is settled.

**Re-render.** The film was re-rendered from the fixed source into a fresh
`out/002-buy-now-pay-later/delivery` packet (the 2026-11-13 packet is preserved
as `delivery-r1`). `compiled.json` and `audio-manifest.json` are byte-identical
to the previous packet, so scene/event frames, SFX placement and the audio bed
are unchanged; only actor pixels differ. 68 scenes, 18 text beats, 66 library
SFX premixed into `public/film-audio.wav` and played by exactly one `Audio`
node, 17,784 frames / 592.811 s. `buy-now-pay-later.mp4` is 1920×1080, 30 fps,
H.264 `yuv420p`, TV range, AAC, 45.6 MB; a full `ffmpeg -f null -` decode
returned no errors. Audio measures −19.2 LUFS integrated, mean −22.6 dB, true
peak −5.0 dBFS — identical to the narration master and the previous bed. The
15-panel `motion-gallery.mp4` was re-rendered (1350 frames) and transcoded to
TV-range `yuv420p` to match the film. Contact sheets were regenerated from the
new packet: `sheet-scenes-a/b.png`, `sheet-cuts-a/b.png` (all 68 post-cut first
frames), `sheet-text.png`, `sheet-gallery.png`.

Human creative approval and audio listening approval remain outstanding; the
phrase timing is still draft ASR over the measured master, not a listening pass.
No narration, WAV, cue hash or financial value changed in this pass.

## Video 002 "Buy Now, Pay Later" — full film candidate — 2026-11-13

Episode 002 is produced end to end from its recorded narration: 68 scenes, 205
ASR phrase cues, 18 text beats and 66 library SFX over 17,784 frames (592.8 s).
Runtime comes from the measured narration; nothing was stretched to hit a target.

**Narration repair.** VoxCPM2 is not installed in the current VoiceStudio
runtime, so the p002 take could not be re-synthesised. That take had spoken the
script's `**` emphasis markers as "asterisk" (ASR at 6.60-7.02 s and
10.26-10.74 s). The two marker intervals were excised from `audio-2.wav` at
measured silence boundaries (6.46-7.10 s and 10.14-10.75 s, 1.250 s total,
zero-crossing snapped, 1 ms fades): no time-stretch, no re-synthesis, no engine
change. The pre-repair take survives as `audio-2.pre-marker-repair.wav` and in
`.cache`; `manifest.json` marks p002 with `repairedFrom`. ASR of the repaired
take reads the paragraph without "asterisk" (token match 0.929; the only
differences are `sixty dollars` recognised as `$60`). The master was rebuilt
(592.317 s, sha256 `7e675e1f…`) and the local timing pass re-recorded 205 draft
phrase cues against it (faster-whisper small, CPU, `mode: draft`,
`listeningReviewed: false`, `timingReviewed: false`).

**Timeline and audio architecture.** `compileBuyNow` now builds the episode
CueFile and Storyboard and returns every scene and event frame from
`src/timeline/compiler.ts` (mode `aligned`, audioHash + measured duration, reason
string on each anchored offset); the film no longer carries a private rounding
path, and graphics consume the compiled event frames. Narration and all 66 SFX
are premixed locally with ffmpeg at those compiled frames (per-cue `adelay`,
`sidechaincompress` ducking keyed on narration, `alimiter 0.95`) into
`public/film-audio.wav`, so `BuyNowFilm` renders exactly one `Audio` node.
`audio-manifest.json` records each cue's frame, gain, library path, library
sha256 and source duration. The bed measures -19.2 LUFS integrated — identical
to the narration master — with -5.0 dBFS true peak.

**Motion.** New `BuyNowMotionGallery` composition (15 panels, one per stage,
`BUY_NOW_PANEL = 90`) replays the same `BuyNowFrame` on a deterministic local
clock. Text beats vary by meaning (odometer price, plain balance count, elastic
snap-in offer, SectionHeading) using existing typography components; no new
typography component was added.

**Review rounds.** Parent inspection of contact sheets found, and this pass
fixed: S20 account bar cropped below the phone; S21/S23/S61 actor crossing the
96 px left margin; S28/S35 teal transfer arrow clipped at the right edge; S52
decision diagram over Sam's face; duplicated static band labels under the
animated $240/$60 beats in S08, S26, S48, S49; S68's $60 label detached from the
pulling closing camera and the $240 sitting inside an installment card; S38
heading colliding with the phone clock; `PaymentCard` jacket icon overlapping the
TUE band. Amount labels now ride the closing camera through the exported
`closingCamera()` helper. An S50 "clipped right yellow box" report did not
reproduce: an independent still at frame 11865 is pixel-identical to the scene
still (mean absolute difference 0.000).

**Checks.** `npm run check` passed ESLint, strict TypeScript, 94 Node tests and 5
Python timing tests. Human creative approval and audio listening approval remain
outstanding; ASR evidence is not listening.

## Interrupted narration resume — 2026-11-13

Pending takes now recover without restarting VoiceStudio. When backend uptime
does not prove a restart, recovery waits for the installed VoxCPM2 subprocess
backend's health ping, which shares its synthesis lock. Failed probes preserve
pending files; successful probes allow archival and regeneration of that take.
Completed cache receipts and graceful interruption behavior remain unchanged.

`npm run check` passed ESLint, TypeScript, 91 Node tests and 5 Python timing tests.
The focused narration suite passed all 9 tests, including delayed health probes,
failed-probe blocking, recovery with invalid uptime, and completed-cache reuse.
The installed VoiceStudio 0.5.7 source and live health endpoint were inspected;
no real synthesis, physical terminal interruption, or listening review was run.
Existing episode audio and pending markers were left intact.

## Interrupted narration resume — 2026-11-12

Ctrl+C and SIGTERM now request a stop after saving the active take and manifest;
the runner releases its lock and submits no further take. Completed, verified
cache receipts remain reusable even when a crash leaves a pending marker.
Legacy pending requests recover after `/startup/progress` uptime proves that
VoiceStudio restarted after the request. Unreceipted files and markers are
archived before retrying; an unchanged backend or invalid uptime keeps recovery
blocked to avoid duplicate synthesis.

`npm run check` passed: ESLint, strict TypeScript, 91 Node tests and 5 Python
timing tests. The narration regression simulates SIGINT during a speech request,
then checks saved progress, signal-handler and lock cleanup, cached resume,
legacy-marker recovery, preserved partial files, and blocking uncertain retries.
No real VoiceStudio synthesis or physical terminal interrupt was tested;
the local service was offline during read-only health discovery. No episode audio
or existing pending marker was changed by this work.

## Narration grouping — 2026-11-12

The narration runner prepares `narration-grouped.txt` before contacting VoiceStudio,
combining adjacent sentences into estimated 15–30-second takes at 150 WPM by
default. `--wpm` adjusts grouping without changing speech speed. The source script
and existing cached takes remain intact. Whole-sentence boundaries can leave a
short take when rebalancing cannot keep both takes within range.

`npm run check` passed: ESLint, strict TypeScript, 91 Node tests and 5 Python
timing tests. Tests cover grouping, rate overrides, text preservation, prepared
script output, cache reuse, sample timing and uncertain-request safeguards.
The current lifestyle-creep narration groups into 34 takes estimated at 17.6–30
seconds with its normalized text preserved exactly. No actual VoiceStudio
synthesis, listening review, cue realignment or video render was performed.
Regenerated audio requires renewed listening and phrase-alignment review.

The accepted character direction is the hairless reference rig: blue-hoodie Sam
and white-shirt Alex with glasses. Walking arms use character-local depth,
mirrored once, and both elbows bend backward. Contact retargeting preserves the
solved elbow plane.

Before cleanup, all 50 tests, lint and strict TypeScript passed. Encoded walking
frames 40, 80 and 120 were inspected. The retained walking clip is 300 frames /
10 seconds; the retained movement review is 600 frames / 20 seconds. Both were
verified as 1920x1080, 30 fps, H.264/yuv420p, BT.709, silent, and fully decoded.

Retained exports: `out/walking-arm-correction.mp4` and
`out/movement-review-arm-correction.mp4`. Generated previews and earlier revisions
were removed during cleanup; regenerate them with the documented npm commands.
Human creative approval is separate from technical checks. No audio alignment
was assessed.

## Cleanup verification

After cleanup, ESLint, strict TypeScript and all 50 tests pass. The Remotion
bundle builds. Character sheets, relocated face/hand inspection tools and
component-gallery keyframes regenerate successfully. The reusable video QA
script verifies and fully decodes the retained 600-frame movement review;
an incorrect expected frame count is rejected.

The POC assembly, narration/story folder, generated timeline, POC preparation
and render scripts, obsolete implementation plan, build output and superseded
previews were removed. Cue and storyboard data survive only as compiler test
fixtures. Current animation code, review compositions, fonts/licenses, research,
references, transcript tools and the separate sam-atm film remain intact.
Two Studio log files remain locked by the active Studio process. No running
process was stopped to delete them. No new full-length video was rendered;
character and gallery frames were regenerated, and the existing review decoded.

## History

### 2026-11-16: subscription opening study

`SubscriptionPreview` is a 15-second Studio concept with an original,
illustrative offer and a 9.859-second David/VoxCPM2 voice take. `npm run check`
passed (95 JavaScript and 5 Python tests); the WAV decoded with FFmpeg. Studio
displayed the layout and playback started. Narration listening, creative review,
phrase alignment, full motion review and MP4 export remain unverified or pending.
The silent hold after narration is provisional, not approved episode timing.

Detailed entries were split out of this file on 2026-11-10. Each one is a
verbatim record of what was checked on that date, and still names the paths and
versions that existed then.

| Date | Entries | File |
|---|---|---|
| 2026-11-08 | head silhouette, narration runner, VoiceStudio startup, progress display, sequential narration files, Jeremy reference voice | [validation/2026-11-08.md](validation/2026-11-08.md) |
| 2026-11-09 | narration context grouping, audio-derived timing, two-file timing review, storyboard passes and approval, cinematic references, S01–S67 review, visual-variety overhaul, general outro | [validation/2026-11-09.md](validation/2026-11-09.md) |
| 2026-11-10 | episode movement and typography, settle pass, full render with outro, typography motion gallery | [validation/2026-11-10.md](validation/2026-11-10.md) |

- 2026-11-17, Video 003 opening: 60-second SubscriptionOpening Studio draft created with existing narration and provisional timing-demo cues. npm run check passed before the final cue-boundary edit; npm run lint passed afterward. Studio displayed frames 0, 500 and 1650. Full visual/boundary inspection, listening, cue alignment, creative approval, asset manifest and MP4 delivery verification remain pending.

- Video 003 opening illustration revision: Studio opening frame inspected. Full motion, beat/boundary and phone-size review, narration listening and cue alignment remain pending.

- Video 003 opening: added compiled draft-cue animation events; npm run check passed and Studio loaded. Timing remains unreviewed by ear; full playback and beat/boundary review remain pending.

- Video 003 opening: added three compiled draft-cue text cutaways. Studio frames 165 and 200 verified the first text and return; npm run check passed. Full playback, other cutaways and narration timing review remain pending.

- Video 003 opening: added a subtle deterministic drifting texture, including a standalone SubscriptionTextureGallery composition. The opening frame was inspected in Studio; full-motion and listening review remain pending.

- Video 003 opening: cancellation cards now cycle through the stack; SubscriptionCardGallery added. Lint passed and Studio frame 492 showed the handoff. Full playback and listening review remain pending.

- Video 003 opening: selected trial, cancellation and continue controls receive a brief scale response. Lint passed; Studio frame 451 inspected. Full playback and audio timing review remain pending.

- Video 003 opening: refined the offer, uncertain cancellation, rental and renewal motion; added SubscriptionRenewalGallery. npm run check passed and Studio frame 1660 was inspected. Full playback and listening-based cue review remain pending.

- Video 003 opening: added a join/leave visual before renewal and made the rental player appear before its label. SubscriptionFlowGallery added; npm run check passed. No computer-use review per user request; playback and narration alignment remain pending.

- 2026-11-17, Video 003 five-minute draft: SubscriptionFiveMinutes and continuation gallery registered; 43 continuation beats, 8 cutaways, one global audio track and 300-second composition. Audio prefix matched the original WAV through 299.2 seconds; remaining 0.8 seconds is silent. npm run check passed (96 Node, 5 Python), and Remotion composition discovery compiled the timeline. No computer-use inspection per user request. Beat/boundary, phone-size, motion, listening and alignment reviews, asset clearance, final render and full-decode verification remain pending.

- 2026-11-17: Video 003 1:00–1:40 redesigned with varied graphics and composition; added cue-anchored effort beat. npm run check passed (96 Node and 5 Python tests), and Remotion composition discovery succeeded. No computer-use inspection per request; playback, visual legibility and narration listening remain pending.

- 2026-11-17: Video 003 1:40–2:25 revised with varied research compositions and cue-anchored motion. npm run check passed (96 Node, 5 Python) and Remotion composition discovery succeeded. No computer-use inspection per request; playback, readability and narration listening remain pending.

- 2026-11-17: Video 003 2:25–5:00 redesigned with varied source-aware illustrations, movement and cue-anchored steps. npm run check passed (96 Node, 5 Python) and Remotion composition discovery succeeded. No computer-use inspection per request; full playback, readability and narration listening remain pending.

- 2026-11-17: Video 003 connector draw-on, varied entrances/exits and 2.2-second text cutaways added. Focused timing/return test, 97 Node tests, 5 Python tests and Remotion composition discovery passed. No computer-use review per request; full playback, phone-size and listening review remain pending.

- 2026-11-17: Video 003 continuation entrances/exits revised with unfolding, scaling and rotation. npm run check passed (97 Node, 5 Python), and Remotion composition discovery succeeded. No computer-use review per request; full playback, phone-size and narration listening remain pending.

- 2026-11-17: Video 003 cutaways use the existing KineticHeadline masked word reveal with centered alignment and yellow emphasis. Reading-hold checks account for word stagger; current phrases measured within 1728px. npm run check passed (97 Node, 5 Python) and Remotion composition discovery succeeded. No computer-use review per request; visual wrapping, playback and narration listening remain pending.

- 2026-11-17: Applied object-library card flip, status pop-in and draw-on, plus the transition-library state swap, to Video 003. FlipCard custom front/back artwork added without changing default gallery behavior. npm run check passed (97 Node, 5 Python), and Remotion composition discovery succeeded. No computer-use review per request; full playback, visual legibility and narration sync remain pending.

- 2026-11-17: Added Video 003 full-film and ending gallery compositions through the conclusion, with one original full WAV and a 2-second measured-audio tail. Full composition is 12,195 frames (6:46.5); handoff and endpoint focused checks passed, as did npm run check (98 Node, 5 Python) and Remotion composition discovery. Four ending text cutaway widths measured within 1728px. No computer-use review per request; full beat/boundary, motion, phone-size, narration listening and creative review, asset clearance, final render and full-decode verification remain pending.

- 2026-11-17: Added an illustrated like-and-subscribe close and a 3.954-second VoiceStudio VoxCPM2 take using the existing Daniel profile. The combined 409.06427-second WAV preserves the original PCM exactly, followed by 0.6 seconds of silence and the closing take; the 30 fps composition is 12,332 frames including a 2-second tail. Closing cue boundaries are measured but phrase timing and delivery remain unreviewed. WAV samples decoded and were nonzero; npm run check passed (98 Node, 5 Python), and Remotion composition discovery succeeded. No computer-use inspection or MP4 export; playback, narration listening, voice rights, creative approval and delivery verification remain pending.

- 2026-11-17: Added an original locally synthesized ambient bed and 34 reduced-level effects in SubscriptionFullFilm. Effects use compiled visual scene/event frames; cue and narration timing remains draft. The 411.064-second PCM bed has measured RMS -23.8 dBFS before its 0.12 playback gain; the full narration measures -18.4 dBFS RMS. These are source measurements, not a mastered loudness or mixed-peak assessment. npm run check passed (99 Node, 5 Python), and Remotion composition discovery succeeded. No computer-use inspection, mixed playback/listening review, final loudness/peak assessment, MP4 export or creative approval; rights/provenance records remain pending review.

- 2026-11-17: Increased the 34 prior sound-effect gains fourfold and added 26 more visual-action cues, for 60 total. Reused the existing synthesized effects, including calculator taps; provenance record updated. Remotion composition discovery and npm run check passed (99 Node, 5 Python). An audio-only render of frames 420–630 contained the added sound and peaked at -5.2 dBFS; this is a spot check, not a full-film mixed-peak, loudness or listening review. No computer-use review or full MP4 export.

- 2026-11-18: Aligned Episode 004's untimed storyboard (`videos/004-free-shipping/storyboard.md`), asset manifest (`videos/004-free-shipping/asset-manifest.json`), source notes (`videos/004-free-shipping/sources.md`) and document checker (`videos/004-free-shipping/storyboard-check.py`) with decision #14 so generic checkout and product scenarios omit on-screen fictional/illustrative/hypothetical badges while retaining production-record assumptions and research source credits. Added `FreeShippingExample`, `freeShippingExample` and `calculateFreeShippingOrder` to `src/finance/math.ts` with unit tests in `tests/production.test.ts`. `python videos/004-free-shipping/storyboard-check.py --self-test` and `npm run check` passed. Episode 004 narration synthesis, timing, visual implementation and creative approval remain pending.

- 2026-11-18: Generated Episode 004 draft narration timing in `out/004-free-shipping/narration-daniel/timing/`. Local Whisper small produced 1,468 word timings and 116 phrase cues from 22 takes. Verified the 504.822-second master against the take PCM, decoded the full WAV with FFmpeg, and checked the source hashes, cue intervals and word references. All five timing tests passed. The ASR report flags wording to listen for, including “suggests” at 2:13.60–2:22.08 and “say free” at 8:17.71–8:24.61. Listening review and phrase alignment remain pending.
