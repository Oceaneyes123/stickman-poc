# Current animation validation

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
`src/storyboard/BuyNowBackdrop.tsx` draws the room: wall gradient, wall bays,
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
a full `ffmpeg -f null -` decode returned no errors. Evidence stills and
`sheet-looks.png` live in that packet's `images/`.

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

Detailed entries were split out of this file on 2026-11-10. Each one is a
verbatim record of what was checked on that date, and still names the paths and
versions that existed then.

| Date | Entries | File |
|---|---|---|
| 2026-11-08 | head silhouette, narration runner, VoiceStudio startup, progress display, sequential narration files, Jeremy reference voice | [validation/2026-11-08.md](validation/2026-11-08.md) |
| 2026-11-09 | narration context grouping, audio-derived timing, two-file timing review, storyboard passes and approval, cinematic references, S01–S67 review, visual-variety overhaul, general outro | [validation/2026-11-09.md](validation/2026-11-09.md) |
| 2026-11-10 | episode movement and typography, settle pass, full render with outro, typography motion gallery | [validation/2026-11-10.md](validation/2026-11-10.md) |
