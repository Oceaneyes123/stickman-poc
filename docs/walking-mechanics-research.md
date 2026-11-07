# Walking mechanics research and correction

Researched before implementation, 2026-11-07. This is animation research, not
clinical advice or a physical gait simulation.

## Findings from authoritative gait references

1. [AAPM&R: Biomechanics of Normal Gait](https://now.aapmr.org/biomechanics-normal-gait/),
   updated March 20, 2025. Stance accepts weight while the body advances over the
   foot; swing advances the opposite limb. Ordinary walking is approximately
   60% stance and 40% swing, with two brief periods of double support. Foot
   progression involves heel, ankle and forefoot rockers.
2. [Jacquelin Perry, MD: Normal Gait, AAOS Atlas of Limb Prosthetics](https://www.oandplibrary.org/alp/chap13-01.asp).
   Approximate knee landmarks are 0–5 degrees flexion at contact, about 15 during
   loading, extension toward neutral through midstance, renewed flexion before
   toe-off, about 60 during early swing, then extension before the next contact.
   The swing ankle returns toward neutral to help toe clearance. The body rises
   over the stance limb and lowers during transfer between the limbs.
3. [University of Oklahoma HSC: Knee movement during gait](https://ouhsc.edu/bserdac/dthompso/web/gait/knmatics/kngait.htm)
   and [knee kinematic curves](https://ouhsc.edu/bserdac/dthompso/web/pk/kneegraf.htm).
   These distinguish loading flexion, stance extension, and pre-swing/early-swing
   flexion. A supporting knee should not remain rigid throughout its stance.
   The curves cite Winter's published gait measurements; they are references,
   not animation data copied into this project.

The requested contrast is correct for the main single-support interval: the
support leg is nearly extended while the opposite knee flexes to advance the
foot. Locking every planted knee straight, including loading and toe-off, would
remove normal weight acceptance and limb recovery. Walking also briefly has
both feet on the ground; it is not a strict planted/swing binary at every frame.

## Problems measured in this implementation

The 240-frame baseline is saved in `out/walking-research/before.json`.
Representative single-support samples have stance knees around 29–44 degrees,
while the swing knee reaches roughly 60–65. Thus both legs look bent, even
though contact and fixed-length tests pass.

- Fixed pelvis heights of 104–108 shorten a pair of 56-unit bones too much for
  a near-straight support knee. Correct height depends on ankle position,
  horizontal hip-to-ankle separation and desired flexion, not a universal bob.
- The one-unit IK reach margin alone forces a visible knee bend near extension.
  The solver already handles exact extension numerically; this is a pose error.
- Shoe rotation around a stationary ankle does not model heel/toe ground contact.
  A rolling foot needs a fixed contact point and a moving ankle above it.
- A symmetric ankle arc does not explicitly coordinate the supporting knee,
  foot rocker and landing preparation. New checks must distinguish stance from
  swing instead of proving only lengths and floor contact.
- The last two walking steps previously targeted the final standing position
  before deceleration was finished. This could force an airborne leg to full
  reach and lower the pelvis, bending the supporting knee. Recovery steps now
  follow the root deceleration and include time to settle the final heel strike.

## Correction design

Use a smooth, phase-based knee-extension guide for the supporting leg. Derive
pelvis height from its ankle target and the fixed-length two-bone reach implied
by that guide. During double support, blend by loading contribution and retain
the reach bounds of both legs. Blend the correction in and out at starts/stops.

Use the original shoe art with heel, flat-sole and forefoot contact pivots. Keep
each active ground contact fixed, while deriving ankle position from the shoe
rotation. The ankle is allowed to move during a rocker; that is different from
sliding a planted foot. Swing starts from the toe-off ankle pose and ends at the
heel-contact pose with continuous position and rotation.

Verify near-straight midstance knees, greater swing-knee flexion, toe clearance,
contact-pivot stability, fixed segment lengths, start/stop continuity, mirrored
walking and arbitrary frame seeks. Render large walking examples and review
encoded frames, not just solver output. Preserve the original production rig.

## Implemented verification

- The phase-filtered 220-unit baseline had stance flexion averaging 33.9 degrees
  (29.7–39.6). After correction the same evaluation window averages 5.1 degrees
  (4.0–11.7). Filters select single support with the other leg in the middle of
  its swing; sample counts differ because the corrected stopping plan changes
  the contact schedule. These are implementation measurements, not clinical norms.
  Raw poses and filters' results: `out/walking-research/before.json`, `after.json`,
  and `measurements.json`.
- New checks cover slow, ordinary and faster travel, both support legs,
  support/swing flexion contrast, loading and push-off flexion, heel/toe pivot
  stability, sole clearance, toe-off/heel-strike continuity and final recovery.
  Existing world-contact checks now verify the shoe footprint and actual rotated
  contact instead of incorrectly requiring the ankle itself to stay stationary.
- `npm run check` passes timing compilation, ESLint, strict TypeScript and all
  46 tests, including the original production and bank interaction regressions.
- The bank approach previously held its old frame-90 pose before the new recovery
  could finish. It now samples the planner through its settled state. A regression
  requires both feet flat from frame 98 through the door sequence and verifies
  that the short interior walk reaches its requested endpoint on frame 196.
- `WalkingMechanics` provides a large ten-second review in both directions with
  measured phase/angle labels. `MovementReview` uses the corrected model as well.
  Initial, midswing, terminal-swing, support, transfer and stop frames were
  visually inspected. Debug paths now sample the same ankle trajectory as the rig.

Outputs: `out/walking-mechanics.mp4` and `out/movement-review-walking-fixed.mp4`.
Both exports are 1920x1080, 30 fps, H.264/yuv420p, with successful full decodes.
The focused walk is 300 frames / 10 seconds; the full review is 600 / 20 seconds.
Encoded frames 40, 60, 80 and 260 of the focused walk were inspected, along with
the debug midstance/midswing view. These show near extension, swing flexion,
landing preparation and the final weight transfer in both travel directions.
The previous `out/movement-review-polished.mp4` remains available for comparison.
Normal-speed human approval remains separate from these automated checks.
