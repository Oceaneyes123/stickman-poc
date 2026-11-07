# Movement system audit (before implementation)

Inspected `kinematics.ts`, `referenceModel.ts`, `ReferenceCharacterRig.tsx`,
`StickmanRig.tsx`, `bankModel.ts`, `MovementReview.tsx`, their callers, tests,
and `AGENTS.md` on 2026-11-07. No CodeGraph index exists in this checkout.

- `limb()` silently clamps reach, accepts invalid lengths, has no anatomical
  limits or diagnostic error, and chooses its branch from a screen-space sign.
  The sign changes immediately when a pose/gesture name changes; interpolated
  targets cannot prevent the resulting elbow flip.
- `distanceFoot(0)` places the left foot at +21 and the right at -21, opposite
  the standing stance. Blending into this stance crosses feet before travel.
  The old gait has 50% stance, no double support, and identical sinusoidal arms.
- `walkingSam()` interpolates already planted feet into a final pose. Contacts
  slide during stopping. Negative travel does not establish a new facing.
- Sitting blends foot positions along the floor. Reaching only moves a hand;
  no center of mass, support region, pelvis adjustment, or load transfer exists.
  Independently solved limbs are not coordinated with torso or head timing.
- The review has six panels over 150 frames, no actual turning, lifting or
  sit/stand sequence, no solver diagnostics, and no original comparison.
- Existing checks prove segment lengths and selected contacts. They do not
  prove anatomical limits, start/stop continuity, balance, or arbitrary seeks.

## Implementation scope

Shared IK gets a backward-compatible constrained mode. The original production
rig retains the legacy numeric-bend path and its imports. The reference candidate
uses anatomical constraints, deterministic contact plans, segment-weighted balance,
and reusable frame-evaluated actions. Bank interactions keep their world targets.
Review, render helpers, and tests must follow the expanded review duration.
Artwork, financial math, narration, and cue timing are outside this change.

This is a projected 2D kinematic model, not a force/collision simulation. Camera
projection supplies bend preferences; screen-space knee direction alone is not
an anatomical rule. Fast walking is supported rather than claiming simulated
running with a flight phase.

## Reference choices

Ordinary walking defaults to 60% stance and 40% swing, with overlapping stance:
https://now.aapmr.org/biomechanic-of-gait-and-treatment-of-abnormal-gait-patterns/
Conservative configurable flexion limits (knees 0–145°, elbows 0–150°) are
animation defaults, not individual clinical measurements. Human ranges vary:
https://archive.cdc.gov/www_cdc_gov/ncbddd/jointrom/index.html

## Implemented architecture

`planMotion()` compiles ordered action intents into deterministic trajectories
and footstep contacts. `evaluateMotion()` samples any frame, blends free arm
motion in joint space, corrects static balance, solves constrained IK, and returns
the skeleton consumed by the existing SVG rig. Trial IK supplies segment positions
for COM estimation; final IK follows pelvis correction. No prior rendered frame,
timer, random source, global cache, or simulation history is required.

- `kinematics.ts`: backward-compatible numeric-bend solver for the original POC;
  constrained options add flexion ranges, pole/previous-joint branch preferences,
  exact segment lengths, target residuals, and unreachable/limit diagnostics.
- `jointConstraints.ts`: configurable knee/elbow limits and anatomical projection
  signs. `facing` mirrors the complete actor rather than reversing a knee rule.
- `gait.ts`: eight named phases, default 60/40 stance/swing, double support,
  smooth clearance and foot roll, fixed world contact anchors, and a quintic root
  path. Inverting root distance schedules steps so cadence follows acceleration
  and deceleration. Step length increases with speed; final steps settle both feet.
- `biomechanics.ts`: segment-weighted COM, support intervals including an optional
  seat, static pelvis correction, fixed-length torso, reach-aware pelvis height,
  FK arms and constrained limbs. Dynamic gait uses planned transfer, counter-lean,
  velocity-based forward lean and capture diagnostics instead of forcing COM
  inside static support at every frame.
- `motionPlanner.ts`: reusable standing, walking, fast walking, turning, sitting,
  standing up, reaching, pointing, waving, nodding, pickup, carrying, giving,
  receiving, celebrating, slumping and supporting acting poses. Joint arcs avoid
  interpolating free hands through the shoulder. The body anticipates; arms
  arrive later, and head gestures use bounded envelopes. A projected turn steps
  feet individually while their grounded world anchors stay fixed.
- `ReferenceCharacterRig.tsx`: optional compiled `motion` and `debug` props;
  solved wrists still anchor hands and props. Existing face/clothing/shoe paths
  and Sam/Alex identities remain. Only motion-related transforms change.
- `bankModel.ts`: uses the same planner for either travel direction and constrained
  body solving for precise interactions. Reaching elevates the shoulder slightly
  so the opening door's handle does not force elbow overflexion. Door contact
  and the cash transfer retain their existing scene timing and world targets.
- `MovementReview`: two ten-second pages, twelve panels, original/improved gait
  comparison, all requested action families, and optional diagnostic overlays.

## Limits

This is a stylized 2D kinematic approximation. There are no integrated forces,
collisions, payload masses, muscle mechanics, or true 3D joint axes. The support
region is a projected interval. The capture estimate is a visual diagnostic,
not a validated physical stability solver. Fast walking retains ground contact;
it does not simulate running flight. Turns are projected changes of orientation,
not a full front/side/back character turnaround. The head follows the small
pelvis excursion with counter-lean rather than a simulated vestibular system.

Custom unreachable targets remain visibly diagnosed and clamped; the system
does not stretch bones or silently relocate props. Constrained ranges, segment
masses and bend projection can be changed through the plan's anatomy/masses
options. Large excursions or very short timing still require authored review.
The convenience walking preset lasts 600 frames; explicit plans define other
distances and timing. A walk stops before transitioning to another action; this
version does not blend two overlapping locomotion clips or turn while running.

## Validation and migration gate

`npm run check` passes timing compilation, ESLint, strict TypeScript and all
40 tests. Coverage includes all action types, fixed lengths and limits, singular
and unreachable IK, phase coverage, double support, world contact through starts
and stops in both directions, static and single-foot balance, configured masses,
sequence boundaries, invalid input, and reverse-order frame sampling. Existing
finance/timeline, original-gait and bank handle/cash regressions remain included.

The clean review has been rendered as
`out/movement-review-biomechanics.mp4`: H.264, 1920x1080, 30 fps, yuv420p,
600 frames, 20 seconds, no audio. Full decode succeeds. Encoded contact sheets
cover both pages; representative clean and debug stills were visually inspected.
This is technical/render validation, not normal-speed human acting approval.
Original exports are retained. Narration is absent in this checkout and was not
regenerated or tested; no financial or narration source was changed.

The original production rig remains operational and unmigrated. Migration path:

1. Review the new MP4 at normal speed and approve contact, timing and acting for
   both identities. Resolve any remaining artistic notes before migration.
2. Add a geometry profile to `solveBody` for the original rig's torso 98,
   arms 62/60, and legs 78/78. Keep the reference profile 81, 44/44, 56/56.
   Add length/contact checks for both profiles; do not merely rescale one rig.
3. Give `StickmanRig.tsx` an optional solved-skeleton input, keeping its SVG art,
   identity details, legacy fallback and existing callers intact. Attach its
   wallet/props to solved wrists using the selected profile.
4. Migrate one actor in `scenes/templates.tsx` to an explicit plan. Translate
   world targets through that actor's scale/facing. Preserve existing cue frames,
   financial calculations, scene cuts and global audio unchanged.
5. Compare the ComponentGallery and every POC beat/boundary, run all checks,
   and render/decode the migrated candidate. Obtain normal-speed visual approval
   before switching remaining scene imports or removing the legacy fallback.

No production import switch, commit, push, publication, or narration render is
part of this implementation.
