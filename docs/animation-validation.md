# Current animation validation

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
# Head silhouette update — 2026-11-08

- Applied subtle identity-specific head asymmetry and removed both ears in
  `ReferenceCharacterRig.tsx`. All expressions share these contours; face
  features, glasses, turn projection and skeleton geometry are unchanged.
- `npm run check` passed: ESLint, TypeScript and all 50 tests.
- `npm run characters:stills` regenerated six character sheets. Inspected
  expressions, hero and action sheets: earless contours remain readable across
  all twelve expressions and the sampled walking projection.
- No new MP4 or gallery render; full-motion review and human creative approval
  remain pending. This change contains no audio.

## Narration runner — 2026-11-08

- Added `npm run narrate` with sequential VoxCPM2 generation, paragraph cache
  integrity checks, progress manifests, preview/full WAV assembly, and draft cues
  derived from integer 48 kHz sample positions. Draft cues cannot enter the
  existing timeline compiler as aligned data.
- `npm run check` passes ESLint, strict TypeScript, and all 52 tests. A local mock
  HTTP service and real FFmpeg verify preview/resume, changed-paragraph reuse,
  fractional timing, corrupt-cache rejection, dropped-text rejection, pending
  request protection, and concurrent-run protection.
- VoiceStudio's loopback service was stopped. No real speech was generated;
  actual engine/voice behavior, complete narration listening, phrase alignment,
  animation sync, and rendered audiovisual review remain unverified.

## Automatic VoiceStudio startup — 2026-11-08

- Narration now starts the installed Windows app when the service on port 3900
  refuses connections, waits for health, and checks for an existing app process
  before launching. The child environment excludes `ELECTRON_RUN_AS_NODE`, which
  otherwise caused the Electron app to exit in this developer host.
- Live startup reached a healthy service. No real synthesis was submitted.
- `npm run check` passes ESLint, strict TypeScript, and all 54 tests, including
  offline endpoint diagnostics, startup polling, launch suppression when healthy,
  and startup timeout. Listening and animation alignment remain unverified.

## Narration progress display — 2026-11-08

- Added a terminal progress bar, active-request spinner, elapsed run time, and
  approximate synthesis ETA. Completed-text percentages advance after validated
  paragraphs. Timing receipts supply milliseconds per character; requests without
  timing show `calculating`, and overruns show `recalculating`. Cached audio and
  existing receipts without timing remain supported.
- `npm run check` passes ESLint, strict TypeScript, and all 56 tests. Focused checks
  cover progress/ETA formatting, periodic updates and timer cleanup, saved timing
  receipts, and the existing resume/error paths.
- No real synthesis was submitted for this change. Real workload ETA accuracy,
  narration listening, and phrase alignment remain unverified.

## Sequential narration files — 2026-11-08

- Paragraph exports now use `audio-1.wav`, `audio-2.wav`, and subsequent script
  positions. Manifests record both the exported filename and the cache path.
  New content-addressed takes and receipts live under `.cache/`; existing
  root-level caches and pending markers remain supported.
- Focused integration checks verify sequential names, exported/cache byte equality,
  and reordered text reusing its original takes without new requests.
- The accepted David preview was reused to create `audio-1.wav`; no new synthesis
  was submitted. Its master remains 5.431354 seconds. Listening acceptance applies
  to that previously reviewed preview; full narration and sync remain pending.

## Jeremy reference voice — 2026-11-08

- Created local VoiceStudio clone profile Jeremy (`f6ec71e3`) from the original
  `references/base-voice.mp3` (14.106 seconds container duration). The user confirmed
  speaker permission; the profile attestation records `speaker_permission`.
  The original MP3 is unchanged. Local cached Whisper small supplied a transcript,
  compared with the matching opening two paragraphs of the narration source.
- Jeremy replaces David as the runner's default. The profile stores the reference
  transcript, English language, fixed seed `1609887649`, and empty style instructions.
  Project instructions and mock-service checks use the new profile.
- The first preview request hit Node fetch's five-minute headers timeout. After
  checking backend activity and preserving the pending marker, one retry used
  Node HTTP with the existing 30-minute abort signal. No dependency or VoiceStudio
  setting changed. The successful retry took about 163 seconds.
- `npm run check` passes ESLint, strict TypeScript, and all 57 tests, including
  delayed-header speech transport, binary response handling, and abort behavior.
- `out/001-lifestyle-creep/jeremy-preview/audio-1.wav` and `preview.wav` measure
  265,516 samples at 48 kHz (5.531583 seconds). Full FFmpeg decode passes; the
  response reports CPU fallback and no dropped-text headers. Local ASR reproduces
  the opening paragraph. Jeremy's likeness and delivery require human listening;
  full narration, reviewed phrase cues, and audiovisual sync remain pending.

## Narration context grouping — 2026-11-09

- Regrouped `videos/001-lifestyle-creep/narration.txt` from 87 short paragraphs
  into 23 coherent synthesis paragraphs, retaining each calculation and its
  explanation or each decision and its immediate result in the same group.
- Whitespace-normalized comparison confirms all 2,242 words and their order are
  unchanged. Every paragraph remains below the API's 4096-character limit.
- No audio was generated. Existing previews, numbered paragraph audio, script
  hashes, and draft cues describe earlier grouping; regenerate and review the
  new recording before deriving animation timing. The Jeremy reference profile
  and its transcript remain unchanged.

## Audio-derived timing script — 2026-11-09

- Added `npm run narrate:timing` using the installed local faster-whisper small
  model on CPU/int8. It checks complete synthesis metadata and script, master,
  paragraph hashes, and sample counts. Word timestamps are offset from exact
  paragraph sample positions; ASR punctuation proposes phrase cues. This is ASR
  timing, not forced alignment or human listening evidence.
- The full 23-paragraph, 749.813-second Jeremy master produced 2,102 recognized
  word timestamps and 201 draft phrase cues in about 234 seconds. All exported
  intervals are ordered, nonoverlapping, positive, and within the master.
- The review report flags token differences in 18 paragraphs, including numeric
  formatting; these flags alone do not prove speech omissions. The source text
  is preserved alongside recognition for review. No audio or source script changed.
- A second run reused all 23 recognition checkpoints without loading Whisper,
  producing byte-identical final files. Final inputs were rechecked before export.
- ESLint, strict TypeScript, 57 existing tests, and 5 new Python timing tests pass.
  Focused checks cover fractional absolute offsets, adjacent word boundaries,
  invalid intervals, tail bounds, text differences, and source/cache integrity.
  Python formatting and lint checks also pass.
- `timing/cues.draft.json` remains `mode: "draft"` and is rejected by the existing
  timeline compiler. Listening review, corrected phrase boundaries, reviewed
  aligned cues, storyboard integration, animation, and render remain pending.

## Two-file subtitle timing review — 2026-11-09

- Added `npm run narrate:review` and an isolated Remotion review composition.
  It uses only `audio-1.wav` and `audio-2.wav`, concatenated in order, and their
  matching 19 draft utterance cues. Visuals contain centered white Inter text on
  black, with black gaps and no labels, motion, or decorative content.
- Rendered `out/001-lifestyle-creep/narration/timing-review-first-2.mp4`:
  1920×1080, H.264/yuv420p, 30 fps, 1,883 frames, 62.766667 seconds, AAC audio.
  The original two recordings total 3,012,255 samples at 48 kHz (62.7553125 s);
  the video endpoint rounds once to 30 fps. No speech was regenerated.
- Full FFmpeg decode passes. Decoded video audio compared with the concatenated
  source files has correlation 0.999959 at zero offset. Inspected a half-scale
  still and a contact sheet containing all 19 utterances plus a black-gap frame:
  text is readable and unclipped. The text deliberately reflects draft recognition,
  including any recognition errors that need listening review.
- ESLint, strict TypeScript, 59 TypeScript tests, and 5 Python timing tests pass.
  Focused tests cover cue clipping to the two-file window, half-open frame
  boundaries, blank gaps, and rejection of invalid/duplicate/subframe cues.
- Source narration, full-film compositions, timing data, and review flags remain
  unchanged. This MP4 is review material; human listening and timing corrections
  remain pending. No full-length film was rendered.

## Text storyboard — 2026-11-09

- Added `videos/001-lifestyle-creep/storyboard.md` with 67 proposed scenes across
  the 23 narration paragraphs. Sentence-level breaks follow changes in setting,
  character decisions, calculations, and financial reveals. Each scene pairs exact
  narration with cue anchors, an audio window, proposed visuals, actions, and
  sparse screen-text suggestions.
- Checked all 200 source sentences and all 2,242 narration words appear once in
  order. All 201 existing phrase cues are covered once in sequence, including
  explicit holds for ASR-only stray tokens. Scene windows span the measured
  749.813-second master; narration/script/audio data remain unchanged.
- Arithmetic checks against `src/finance/math.ts` cover the baseline, $700/$480/
  $380 Sam progression, Alex's $800, $1,560/$2,400 three-month contributions,
  $840 cumulative difference, $420 monthly difference, $480 after cancellation,
  and the separately labeled $5,040 twelve-month illustration.
- Current reference character identities and financial scope are preserved.
  Formatting and whitespace checks pass. No application code changed, so app
  tests were not rerun. No scene images, animation, or render were created;
  storyboard creative review and later timeline implementation remain pending.

## Storyboard visual-direction revision — 2026-11-09

- Applied the supplied review across all 67 scenes while preserving scene IDs,
  titles, audio windows, exact narration excerpts, cue ranges, and numeric screen
  text. Each scene now has shot composition, emotional beat, character movement,
  camera movement, visual transition, cue-linked animation beats, and state
  continuity. These remain text directions, not implemented animation.
- Added silent early Alex comparisons in S14/S20/S26/S34/S42, building from his
  S05/S11 introduction without revealing his future $800 transfer before S44.
  S21–S22 use a cropped-view/pullback reveal of existing rent; S25–S27 accumulate
  commitments around the same raise. S31–S42 emphasize physical receipts,
  transfers, documents, dinner, calendar recurrence, and character decisions.
- S50–S52 keep lifestyle context beside contribution comparisons. S56–S58 show
  the service change affecting the following modeled month. S67 matches the
  opening framing and paused thumb while keeping the $3,600 paycheck unchanged
  and showing the revised $480 plan/transfer.
- Listed the supplied alternate title as an option for review; the working title
  and accepted narration are unchanged. The annual illustration remains separate
  from Sam's post-cancellation outcome, with all financial assumptions intact.
- Content checks pass: 67 scenes with all seven fields; exact 2,242-word source
  narration; 201 anchor cues in order; valid per-scene beat references; unchanged
  script/audio hashes; checked financial progression and comparison arithmetic;
  Markdown formatting and whitespace. No app code changed or app tests rerun.
- No images, animation, new audio, or render were created. Creative/retention
  improvement is a proposal requiring review, not a measured result.

## S01–S06 still layout study — 2026-11-09

- Added an isolated Remotion composition and `npm run opening:stills`, producing
  12 half-scale PNG keyframes for S01–S06. It reuses the current hairless/earless
  reference rigs, local Inter, finance calculations, and original code-authored
  scene vectors. No cloud image service, dependencies, or alternative engine used.
- Current review packet is `out/001-lifestyle-creep/s01-s06-stills-v3/`, with
  `contact-sheet.png`, individual images, and a cue-linked index. All 12 PNGs are
  distinct and 960×540. Inspected all frames; corrected phone/face collisions,
  hidden legs in the rental, and notices overlapping heads. Held props attach
  to computed wrist positions; existing rig geometry is unchanged.
- Initial renderer selection reused default props, repeating the first shot.
  The renderer now selects each composition with its own input props and rejects
  duplicate image hashes. Earlier v1/v2 development outputs are preserved; v3 is
  the packet for review. Completed versions are not overwritten on reruns.
- `npm run check` passes ESLint, strict TypeScript, 60 TypeScript tests, and
  5 Python tests. The new focused check bounds the packet to S01–S06, unique shot
  IDs, and the correct audio paragraph references.
- These are layout/state drafts, not executed cinematic blocking: camera motion,
  acted interactions, over-shoulder staging, transitions, and narration sync remain
  unimplemented. No MP4, new audio, or changes to existing narration/timing data.
  S07–S67 and unrelated character edits remain untouched.

## S01–S06 depth and camera studies — 2026-11-09

- Expanded the still packet to 16 shots with paired wide/close raise, reaction,
  apartment, and phone-comparison framings. Added room corner/floor perspective,
  physical surface shadows, foreground layers, shoulder-level phone/table setups,
  passenger-side car-interior framing, a seated workspace, and overhead bills.
  No additional rendering engine, dependency, or shared rig change was needed.
- Current packet: `out/001-lifestyle-creep/s01-s06-stills-v5/`, including the
  contact sheet, 16 distinct 960×540 PNGs, and per-shot camera metadata. Earlier
  versions are preserved. All frames were inspected; the reaction camera was
  widened to retain both hands, and the steering wheel was aligned more closely
  with the driver. Monetary content and original cue references remain intact.
- `npm run check` passes ESLint, strict TypeScript, 62 TypeScript tests and
  5 Python tests. Focused checks cover camera aspect/viewport bounds, valid
  source-shot mappings, wide/close differences, packet scope, and computed hand
  bounds for the reaction close-up.
- Zoom choices are still-image framing alternatives, not animated camera moves.
  Shoulder views use a partial back silhouette; no full rear-view character
  animation is claimed. Narration, timing, S07–S67, and accepted character geometry
  remain unchanged. Camera-motion, performance, and audio-sync review are pending.

## Storyboard approval — 2026-11-09

- The user explicitly approved the storyboard. Recorded that status in the
  episode storyboard and S01–S06 visual-study guide, retaining v5 as the current
  framing reference for the first six scenes.
- No source narration, cue data, images, or animation changed. Finished motion,
  audiovisual sync, final render, and publication remain separate review steps.
- Documentation-only update; application tests were not rerun.

## S01–S06 narrated animation — 2026-11-09

- Current review: `out/001-lifestyle-creep/opening-animation-v2/s01-s06.mp4`.
  Reuses the approved v5 vector artwork and existing Jeremy recording; no new
  speech synthesis, shared character geometry change, dependency, or paid service.
  S07–S67 remain outside this render. Earlier stills and animation v1 are preserved.
- Added `npm run opening:render`, the scoped `opening.storyboard.json`, and an
  isolated Remotion film. Fourteen clean cuts cover S01–S06. Frame-driven pose
  blends, calendar pages, brief keyboard taps, shoulder lean, document entrances,
  and short camera reframes settle into holds. Budget, services, and equal-start
  shots keep a static camera. Monetary values derive from the finance module.
- Prep resolves phrase/word anchors, then uses the existing timeline compiler.
  Financial reveals follow word events; transfer completion follows “savings.”
  The ASR-only “Back.” cue gets no new action. Source draft timing/review flags
  are unchanged. `aligned` in the derived compiled timeline means frame-anchored
  playback, not independently verified listening accuracy.
- The audio excerpt is exactly 2,444,298 mono samples at 48 kHz (50.922875 s),
  ending at the S07 cue. It matches the master prefix sample-for-sample. Absolute
  endpoint rounding produces 1,528 frames (50.933333 s), without stretching audio.
  AAC audio correlates 0.99996055 with the source at zero offset; codec padding
  does not change cue placement. See `audio-verification.json` in the packet.
- `npm run check` passes ESLint, strict TypeScript, 64 TypeScript tests and
  5 Python timing tests. Focused tests cover contiguous cuts, deterministic word
  events, missing/misplaced anchors, and mismatched audio cutoffs. Final renderer
  lint/types pass. H.264/yuv420p, 1920×1080, 30 fps, 1,528 frames and AAC audio
  were asserted; the complete MP4 decodes without error.
- Inspected 37 half-scale frames spanning every cut start/end and each financial
  or reaction event. Contact sheet, compiled timeline, hashes, and media metadata
  accompany the MP4. These checks do not establish full-motion creative approval
  or listening approval; user playback review of motion, pacing and perceived sync
  remains pending. Physical performances are restrained pose/prop actions, not a
  fully articulated rear-view rig or a complete literal enactment of every gesture
  proposed in the text storyboard.

## Remaining visual storyboard, S07–S67 — 2026-11-09

- Current packet: `out/001-lifestyle-creep/s07-s67-storyboard-v2/index.html`.
  Contains 61 scene keyframes plus seven supporting inserts, all 960×540 PNGs,
  with seven contact sheets. Every scene pairs its exact approved narration with
  source cue IDs, camera/action directions, transitions, and continuity notes.
  The existing approved text board remains canonical; these images await review.
- Reuses the current hairless/earless rigs, room, desk, phone, rental interior,
  and palette. Adds scene-specific allocation trays, contribution receipts,
  contract folders, calendars, dinner/hobby props, and separate annual diagrams.
  Alex's rear staging silhouette uses his white shirt; shared rig geometry is
  unchanged. All art is local React/SVG; no generated raster service is used.
- Financial values derive from `src/finance/math.ts`. The packet distinguishes
  monthly contributions, three-month totals, the revised $480 transfer, and the
  separate unchanged-pattern annual illustration. Rental transport remains a
  rental; no debt, starting balance, individual service prices, or refund is added.
- Inspected all 68 images. Corrected crowded split-screen labels, a floating
  desk, tight phone crops, and the revised-plan capacity label in the first pass.
  Version 1 is preserved; version 2 is the review packet. Early Alex cutaways,
  the older rental, and hobby/meal insert preserve the planned story context.
- `npm run check` passes ESLint, TypeScript, 67 TypeScript tests and 5 Python
  tests; final lint/types also pass without warnings. New checks cover all 61
  scene IDs, exact source narration, required direction fields/cues, and monthly,
  cumulative, revised, and annual arithmetic. Verified every PNG decodes at the
  expected size and all 68 image hashes differ. HTML contains 61 narration pairs
  and 68 valid image links. Browser layout itself was not tested.
- `verification.json` confirms the source-board hash and unchanged source script,
  master audio, phrase cues, and word timings against the S01–S06 render packet.
  No audio, timing, existing MP4, or S01–S06 still packet was regenerated. These
  are storyboard states only; S07–S67 motion, temporal reveals, physical acting,
  and audiovisual sync remain unimplemented and unapproved.

## Cinematic reference sequences and textured backdrop — 2026-11-09

- Completed the scoped architecture audit in `docs/cinematic-audit.md`, then
  implemented S12, S21–S22 and S50–S52 only. Current review packet is
  `out/001-lifestyle-creep/cinematic-references-v3/index.html`; each sequence has a
  narrated MP4, compiled direction, frame index and contact sheets. The detailed
  file/reuse/design/limitations report is `docs/cinematic-implementation.md`.
- Added flexible layered narrative/close-up/comparison/reveal/symbolic composition
  helpers, shared stage coordinates and constrained hand targeting, and 48 typed
  cue/word-driven action/camera/prop/reveal beats around the existing compiler.
  Preserved the accepted rig, gait/IK constraints, financial calculations, source
  narration, cue IDs and sequence order. No hardcoded narration seconds in graphics.
- User revised the backdrop during implementation: remove all walls, windows and
  floor, keep foreground, use a rough texture. Final references use fixed seeded
  SVG paper grain behind all artwork. Architecture, doors and rugs are absent;
  characters, furniture, props and financial graphics remain. Existing approved
  packets and the rest of the episode were not regenerated.
- S12 implements phone reach/lift/read/return, grounded laptop-carry walking,
  two-handed desk placement, release/open and a satisfied hold. S21–S22 keeps one
  desk/raise arrangement continuous through the rent pullback and $80 reveal.
  S50–S52 files dated contributions, separates $1,560/$2,400/$840 period figures
  from $380/$800/$420 Month 3 figures, and ends with the different benefits.
- `npm run check` passes ESLint, strict TypeScript, 72 TypeScript tests and
  5 Python tests. Focused checks cover cue/word resolution, overlaps/holds, target
  validity, camera bounds, deterministic seeking, fixed segment lengths, planted
  walking contacts, stationary laptop placement and lid grip, and reveal ordering.
  Legacy bank tests pass after moving coordinate helpers into shared staging.
- All exports are 1920×1080, 30 fps, H.264/yuv420p with AAC, at 430, 393 and
  1,083 frames. All three pass complete decode. Inspected all 162 half-scale
  action/boundary samples, final encoded checks, and a legacy-gallery sample.
  Every sample retains foreground and an identical fixed-texture corner patch.
- Source excerpts contain 688,320; 628,964; and 1,732,969 samples respectively,
  and match the original master exactly. Encoded zero-offset correlations are
  0.99996319, 0.99996127 and 0.99996692. Single-endpoint frame rounding leaves
  192 unencoded apartment tail samples (4 ms; peak 6/32768); other exports include
  the entire excerpt plus codec padding. Script, master and phrase/word cue hashes
  remain unchanged. See the packet's `verification-summary.json`.
- V1 retains the earlier architectural still study. An intermediate v2 export
  exposed a CSS stacking error that covered the foreground with texture; it was
  stopped and preserved. V3 explicitly layers artwork above the texture and adds
  a foreground preflight before encoding. No approved render was overwritten.
- Source ASR/listening flags remain unchanged. Technical/sample checks do not
  establish full-speed human creative or listening approval. The reference rig
  remains front/three-quarter 2D; later signing, rear-view and vehicle acting are
  outside this reference scope. Stop for visual approval before episode-wide work.

## Money figures only — 2026-11-09

- Applied the user's text restriction to the three cinematic references. Removed
  document labels, names, month/period headings, allocation words and contribution
  captions. All 11 remaining visible text elements render currency amounts only.
  Narration still supplies the context; financial values and reveal frames are
  unchanged. The textured backdrop, foreground and choreography are preserved.
- Current packet: `out/001-lifestyle-creep/cinematic-references-v4/index.html`.
  V3 remains intact. Rerendered all three MP4s at their original 430/393/1,083
  frame counts. `npm run check` passes 72 TypeScript and 5 Python tests, lint and
  strict types. All exports pass metadata and full decode; all 162 sampled frames
  retain foreground and identical fixed-texture patches. Inspected financial
  frames extracted from the encoded movies to confirm the label removal.
- Source narration and cue hashes match; audio correlations remain 0.99996319,
  0.99996127 and 0.99996692 at zero offset. No new speech, retiming or episode-wide
  regeneration. Creative and listening approval remain pending.

## Unified S01–S67 storyboard review — 2026-11-09

- Added `npm run storyboard:all` and assembled
  `out/001-lifestyle-creep/full-storyboard-v1/index.html`: all 67 scenes and
  92 existing images, paired with exact canonical narration. Includes S01–S06
  opening studies, the remaining storyboard packet/inserts, and scene-bounded
  frames from the latest v4 references for S12/S21/S22/S50/S51/S52.
- Marks all 61 earlier-study scenes clearly, including their older text and
  architectural backgrounds. No claim that these scenes follow the current
  cinematic direction. No new animation, source-image edits, timing change or
  full-episode style extension was performed.
- Assembler asserts ordered complete scene coverage, narration matches, valid
  source beats and image files. HTML verification confirms 67 narration pairs,
  92 images, unique scene anchors, and all local image/video/review links.
  ESLint and strict TypeScript pass. No runtime scene behavior changed; existing
  animation tests were not rerun. Creative approval remains separate.

## Complete cinematic storyboard design — 2026-11-09

- Current still-only review:
  `out/001-lifestyle-creep/storyboard-design-v3/review/index.html`.
  All 67 scenes, including S01–S06, now use the current visual direction.
  Contains 85 new proposed panels for 61 scenes plus 14 unchanged frames from
  the six v4 reference scenes. No new film, narration or timing was generated.
- Reused the accepted rig, constrained hand placement, paper backdrop,
  comparison layout, furniture and reference props. Added foreground-only
  vehicle and decision props. Only currency figures appear inside images;
  narration and review notes remain outside them. No room walls, windows,
  architectural doors, floors or rugs are drawn. Vehicle glazing remains part
  of the foreground vehicle prop.
- Inspected every first-pass panel through the scene and supplemental contact
  sheets. Fixed the invisible edge-on carried laptop, loose keys, small opening
  paycheck, unequal starting conditions, repeated comparison and car/body overlap.
  Removed annual-example boundary lines crossing Sam. Inspected the changed
  final panels; the other 88 PNGs match their inspected first-pass hashes.
- `npm run check` passes lint, strict TypeScript, 74 TypeScript tests and 5 Python
  tests. New focused tests cover scene/shot coverage, camera bounds, preserved
  reference reuse, still-only rendering and currency-only typography routing.
  Export verification confirms 99 PNGs at 960×540 from 1920×1080 compositions,
  67 narration pairs, unique ordered scene IDs, valid local links, and zero
  new MP4/WAV/MP3 files. Source script/audio/cue/word hashes match v4.
  Evidence: `storyboard-design-v3/verification.json` and
  `out/storyboard-design-check.log`.
- V1 and v2 intermediate packets and earlier approved outputs remain intact.
  The new designs are static proposals awaiting human visual approval.
  Episode-wide animation, transitions and audiovisual synchronization were not
  implemented or evaluated. Existing draft timing/listening flags are unchanged.


## Visual variety overhaul, stills only — 2026-11-09

- Reviewed all 99 v3 panels in chronological and complete-episode sheets before
  implementation. Created composition-group and recurring-prop sheets, plus
  `docs/visual-variety-audit.md` and `docs/visual-variety-panels.csv`, covering
  every panel and the repeated three-or-more-panel clusters.
- Final packet: `out/001-lifestyle-creep/storyboard-design-v6/review/index.html`.
  All 99 stills were locally rendered; 97 images differ from v3. All 67 scenes
  have current direction metadata. Existing animated references were not changed.
- Inspected all 99 final panels in nine chronological sheets and the complete
  episode sheet. Fixed inherited text stroke, miniature desk leg overlap,
  duplicate Sam at dinner, guitar hand contact, comparison scale, calendar-label
  contrast, premature opening amounts and the laptop insert crop. Rough paper,
  accepted hairless/earless identities, foreground props and currency-only text
  remain. Architecture and floor/rug surfaces are absent.
- `npm run check`: lint and strict types pass, 76 TypeScript tests pass, 5 Python
  timing tests pass. Focused coverage adds all 99 authored directions, the ten
  composition categories, a five-panel information-prop cluster guard, bounded
  current cameras, still-only/currency-only routing, and finite $600 arithmetic.
- `python scripts/verify-storyboard-design.py <packet>` passes: 67 ordered IDs,
  99 PNGs at 960x540 from 1920x1080/30 fps compositions, exact original narration,
  cue IDs and audio windows, matching script/audio/cue/word hashes, identical
  background corner pixels across all panels, valid local links and no audio/video
  files. See the packet verification.json and out/visual-variety-check.log.
- New review documents and scripts affect the isolated storyboard path. Shared
  gallery, original animation entry points, rig geometry, audio and timing were
  not modified. No film decode, motion or listening check applies to this still-only
  task. Creative approval remains pending; no commit or push was performed.

## General like-and-subscribe outro — 2026-11-09

- Added reusable `GeneralOutro` in `src/scenes/GeneralOutro.tsx` and registered it in the main Studio root. Eight seconds, 1920x1080, 30 fps. No characters or audio; no episode timeline changes.
- User revision: YouTube red (#FF0000), white and near-black. The only visible text is exactly `Thanks for watching`. Thumb-up and red play/check graphics provide the two click prompts; the subscribe prompt has no text label under the user's restriction.
- Motion: eased title and control entrances, cursor-led presses with bounded overshoot and one feedback ring each. Background arcs settle once; the final state holds still.
- `npm run check` passes lint, strict TypeScript, 76 TypeScript tests and 5 Python timing tests. Exported `out/general-outro.mp4`; ffprobe assertions verify H.264/yuv420p, 1920x1080, 30 fps, 240 frames and exactly 8 seconds. Full FFmpeg decode passes. A source assertion confirms exactly one visible SVG text node with the requested wording.
- Inspected 24 exported beat/boundary frames in `out/general-outro/review.jpg`, including entrance, both presses, cursor departure and final hold. Metadata evidence: `out/general-outro/verification.json`. Main Studio preview loads. Existing gallery/rig code is unchanged; the gallery was not re-rendered. Human creative approval remains pending. No listening check applies to this silent outro. No commit or push.

### Outro control revision — 2026-11-09

- User explicitly restored the Subscribe label. Widened the red pill to show play icon plus Subscribe, changing to a gray Subscribed confirmation after the click. Like now uses a dark rounded control and a white outline thumb that fills white when selected; it never turns red. No Like label, counts, dislike control or extra copy added.
- Repositioned the like control, cursor and feedback ring to preserve spacing beside the widened Subscribe pill. Existing eight-second timing and title remain.
- `npm run check` passes lint, strict types, 76 TypeScript tests and 5 Python tests. Re-rendered the MP4; metadata assertions and full decode pass. Inspected all 24 refreshed exported beat/boundary frames. Updated verification.json supersedes the earlier single-text restriction evidence. Creative approval remains pending; silent output, no commit or push.
