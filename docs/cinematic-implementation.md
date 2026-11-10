# Cinematic reference implementation

Current storyboard: [S01–S67 visual variety review](../out/001-lifestyle-creep/storyboard-design-v6/review/index.html).
The original three animated reference clips remain unchanged. Earlier sections
below document their implementation; the latest still-only overhaul follows at
the end. See [the repetition audit](visual-variety-audit.md) for all 99 panels.

## Review packet

[Open all three references](../out/001-lifestyle-creep/cinematic-references-v4/index.html).
Each reference has an MP4, action/boundary contact sheet, representative-frame
sheet, compiled `direction.json`, frame index and technical verification.
The packet's `public/` directory contains the three original-audio excerpts and
the compiled direction data used by Studio.

The latest user direction replaces architecture with fixed rough paper grain.
Walls, windows, doors, floor geometry and rugs are removed from the reference
renders. Characters, furniture, phone, laptop, dishes, chair, plant, rental papers,
pay notice, allocation strip, hobby item, keys and contribution receipts remain.
The original room studies and earlier packets are preserved.

The user then requested money figures only. V4 removes all visible descriptive
type: document labels, month/period headings, names, contribution captions and
allocation captions. Currency amounts retain the same calculations, cue-driven
reveals and positions. Narration carries the context; motion and the paper
backdrop are unchanged. Review-page controls and technical metadata stay outside
the animation.

## Reference sequences

| Reference | Implemented progression | Measured audio / frames |
| --- | --- | --- |
| S12 | Notice/reach/lift/read/return phone; motivated cut; planted carry walk; two-handed laptop placement; release, lid opening, satisfied hold | 14.340 s / 430 |
| S21–S22 | Tight rental quote and original raise; continuous pullback to existing rent; allocate the same finite raise; discover $80 and react | 13.103417 s / 393 |
| S50–S52 | Matched characters and physical receipt filing; $2,400/$1,560 and $840 period gap; close period view; equal raise/commitments; explicitly separate Month 3 $800/$380 and $420 gap; return to different benefits | 36.103521 s / 1,083 |

Audio excerpts preserve the accepted Jeremy recording. Duration follows the
measured audio with the project's single absolute-endpoint rounding rule. No
speech stretching, new synthesis, musical bed, or invented financial data.

## Files and architecture

- `src/scenes/narrative.tsx`: flexible NarrativeScene, EnvironmentScene,
  CloseUpScene, FinancialRevealScene, ComparisonScene and SymbolicScene building
  blocks. Layering and camera frames replace the permanent presentation shell.
  The paper texture has a fixed seed and stays attached to the output canvas.
- `src/scenes/cinematicEnvironment.tsx`: shared desks, chair, dining props, cups,
  planter and location staging. Architectural variants remain available but are
  disabled for the current user-directed backdrop. Vehicle cabin art supports
  old/new rental staging; no new vehicle performance is claimed in these clips.
- `src/characters/staging.ts` and `src/scenes/bankModel.ts`: promoted the existing
  world/local coordinate conversion and actor type without changing bank behavior;
  added shared constrained hand targeting through the existing body solver.
- `src/animation/direction.ts`: typed scene/beat/cue/word/frame direction adapter
  around `compileTimeline`. Validates camera bounds, object targets, durations,
  overlaps and holds. Compiled beats include original-source timing provenance.
- `videos/001-lifestyle-creep/cinematic-directions.json`: 48 authored direction
  beats, kept separate from the narrative storyboard. Start frames derive from
  cue/word anchors; React components contain no narration timestamps.
- `src/scenes/cinematicModel.ts`: pure seek-safe choreography for the three
  references, using `planMotion`, gait, IK, `solveBody`, fixed bone lengths and
  explicit object ownership/contact. Money derives from the finance module and
  existing episode calculations; no second raise is allocated.
- `src/scenes/cinematicReferences.tsx` and `src/storyboard/CinematicRoot.tsx`:
  scene implementations and isolated Studio compositions. Each composition has
  one global narration node. Matched comparisons keep equal scale and framing.
- `src/design/tokens.ts`: additive environment/material/shadow/outline/type/scale
  tokens; existing palette and legacy callers retain their defaults.
- `scripts/render/render-cinematic-references.ts`, `scripts/review/cinematic-contact-sheets.py`,
  `scripts/review/verify-cinematic.py`, `package.json`, `INSTRUCTIONS.md`: local versioned
  rendering and review workflow, with audio/source, foreground and fixed-texture checks.
  The renderer checks for covered/missing foreground before starting each movie.
- `tests/cinematic.test.ts`, `tests/fixtures/cinematic/`: focused real-cue fixtures
  and tests for direction validity, deterministic samples, constrained geometry,
  planted walking contacts, laptop placement/lid grip and financial reveal order.

Reused: accepted ReferenceCharacterRig and faces, original Room artwork for the
optional architectural environment, existing gait/motion/IK/body solver, timeline
compiler and validators, finance calculations/formatting, local Inter, and local
Remotion rendering. No engine, dependency or paid service added. Legacy template
and gallery styling, original narration/timing, and unrelated videos are preserved.

## Verification and creative limits

`npm run check` passes ESLint, strict TypeScript, 72 TypeScript tests and 5 Python
timing tests. Frame checks cover every directed action and cue boundary. Renderer
metadata and complete decode checks are recorded beside each finished MP4; final
audio/source and visual inspection results are recorded in animation-validation.md.

All three v4 MP4s pass H.264/yuv420p, 1920×1080, 30 fps, expected-frame-count,
AAC and complete-decode checks. All 162 action/boundary samples were inspected,
including paged contact sheets and frames extracted from each encoded movie.
The legacy component gallery was also rendered and inspected after the shared
coordinate-helper extraction. Foreground is present in every sample; a fixed
corner patch is identical across all sampled frames, confirming stable grain.
WAV excerpts match the master sample-for-sample. Zero-offset AAC correlations are
0.999963, 0.999961 and 0.999967 respectively. The apartment's rounded endpoint
omits 192 decoded tail samples (4 ms), with a peak of 6 PCM units; the other clips
retain the full source excerpt plus AAC padding. No speech is stretched.

This is restrained flat 2D acting with the accepted front/three-quarter rig, not
a newly authored articulated rear rig. Phone, laptop and receipt interactions are
implemented; later signing and vehicle choreography remain outside these three
references. Source cue timings retain their existing ASR/listening-review status.
Technical checks do not establish human creative or listening approval.

The first texture export exposed a CSS stacking issue that covered the foreground;
that incomplete v2 packet is preserved. V3 explicitly positions artwork above the
texture and checks a foreground preview before exporting. V1 is the earlier
architectural still study, not the current review target.

## Complete storyboard design pass — 2026-11-09

The user authorized extending the style across the storyboard, including S01–S06,
without creating video. Current review:
`out/001-lifestyle-creep/storyboard-design-v3/review/index.html`.
It contains 99 still panels covering all 67 scenes; 14 frames reuse the six v4
reference scenes, and 85 new panels redesign the other 61 scenes.

Added `CinematicStoryboardStudy.tsx` and `cinematicStillPlan.ts`, reusing the
accepted rig, hand targeting, narrative paper backdrop, matched comparison,
desk/meal props and original reference laptop/phone/keys. New foreground-only
vehicles, calendars and physical money props support the story without room
architecture or explanatory type. The still entry is isolated from film entries.

`render-cinematic-storyboard.ts` calls `renderStill` only, preserves existing
packets, saves source hashes, and supplies the complete review assembler through
`--design`. `storyboard:design` is the repeatable command. The assembler retains
its earlier packet mode. Two focused tests cover complete coverage, unique shots,
camera bounds, reference reuse and the still-only/currency-only source contract.

Still inspection corrected key-to-hand contact, opening amount readability,
matching starting conditions, repeated comparison framing and foreground overlap.
The artwork uses only currency typography; narration and review notes sit outside
the images. Some financial explanations deliberately retain physical receipts.

These are static proposed compositions. Movement, transitions, performance and
audio synchronization across the redesigned episode have not been implemented
or checked. Stop for visual approval before extending animation.
No commit, push, publication or deployment was performed.


## Visual variety overhaul — 2026-11-09

Implemented the attached brief across all 67 scenes / 99 panels. Current packet:
`out/001-lifestyle-creep/storyboard-design-v6/review/index.html`. All 99 panels
were rendered locally; 97 differ from v3, while the two effective rental comfort
inserts keep their framing. Earlier approved packets and reference movies remain
intact. No shared rig geometry, finance assumptions, narration or cue data changed.

Changed the isolated `CinematicStoryboardStudy.tsx` artwork, its
`cinematicStillPlan.ts` direction data, the still renderer and review assembler,
focused tests, instructions and validation/review documents. Added
`storyboard-contact-sheets.py`, `audit-storyboard-variety.py` and
`verify-storyboard-design.py`. The audit Markdown and CSV record all 99 baseline
panels with purpose, camera, scale/position, props, shape, figure count,
similarities, severity and implemented redesign.

Reused the accepted rig, constrained hand placement, reference props, fixed paper
backdrop, existing furniture and finance calculations. Added reusable reaction,
transfer, benefit, contribution, calendar and finite-allocation compositions.
There are ten authored shot categories, selected by story purpose. The review
shows the new subject/action beneath every panel; original narrative notes remain
available. No new engine, dependency, remote asset or paid service was introduced.

The main changes replace desk slips with actual comforts, close reactions, service
controls, calendar obligations, contribution stacks and scaled money allocations.
The finite $600 allocation exposes the $620 overrun without a second raise. Monthly,
three-month and annual illustrations stay distinct. The opening retains the delayed
$380 reveal. Sam remains the subject through S26/S34/S42. Comparison actors retain
equal scale; two-handed guitar contact derives from computed wrists.

Validation: lint, strict TypeScript, 76 TypeScript tests and 5 Python timing tests
pass. The packet verifier confirms ordered IDs, exact narration/cues/audio windows,
99 valid 960x540 PNGs, fixed grain across every image, valid local review links,
unchanged narration/timing hashes and zero new audio/video files. Inspected all
99 final panels through nine chronological sheets and the complete episode sheet.

Remaining creative limits: the accepted frontal/three-quarter rig still limits
rear and extreme-angle acting; shoulder inserts use an original rear silhouette.
Some mathematical passages intentionally use stable diagrams, and repeated
allocation/reaction views serve callbacks. These are proposed static designs,
not completed episode-wide motion. Human visual approval remains pending;
animation, listening and audiovisual synchronization were not evaluated.
