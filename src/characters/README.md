# Reference-led character rig

Both heads are hairless and earless. Their silhouettes have subtle asymmetry:
Sam has a fuller left cheek and flatter right temple; Alex has the reverse
contour with a slightly narrower lower face. Facial features and round glasses
retain their existing positions. This applies to every expression and to the
existing turn projection; the legacy rig remains unchanged.

`ReferenceCharacterRig.tsx` follows the clothing and face direction supplied in `../../references/character-reference.png`: Sam's blue hoodie, Alex's white collared shirt and round glasses, larger white faces, dark outlines, small hands and simple expressive silhouettes. Both characters are now hairless at the user's request. The SVG artwork is authored in TSX; the reference PNG is not embedded or traced as a raster asset.

This is the current character rig. `StickmanRig.tsx` remains for shared scene templates and `ComponentGallery`; those imports have not been migrated. The old POC film has been removed.

The refinement pass adds lighter outline hierarchy, softer garment shapes, hoodie cuffs/drawstrings/pocket seams, a backpack strap and pocket, quieter shirt details, thinner glasses, subtle gaze and nose marks, and distinct resting/open/pointing/fist/wave hands. Closed hands follow forearm orientation; open palms and pointing hands use deliberate presentation angles. Body proportions and the tested skeleton are unchanged.

## Preview

Open the `CharacterStudy` composition in Remotion Studio (http://localhost:3100/CharacterStudy when using port 3100). It has four pages: identities, twelve expressions, nine pose examples, and gesture/walk checks. Scrub/play the composition to inspect blending. `npm run characters:stills` saves current character-only PNGs in `out/characters/hand-refinement/`; it never exports or overwrites an MP4. Identity, expression, pose and action sheets render at 2× resolution for close inspection.

## Face and hand design checks

Keep both characters hairless. Alex's brows, glasses, nose and mouth occupy separate vertical bands. Review both characters' twelve expressions at close range after any glasses or facial-feature edit.

Hands use one consistent wrist anchor and local -Y finger direction across relaxed, open, fist, pointing and waving silhouettes. Open/waving gestures share the same five-digit palm drawing; shorter finger groups and round knuckles keep the style readable. `handRotation()` aligns each hand with its solved forearm, adding a mirrored 12-degree wrist bend for presenting palms. Do not mix local +Y/-Y finger directions or hardcode unrelated pose rotations. Cuffs end at the solved wrist. The wallet hangs below the closed grip rather than floating beside a thumb. Check relaxed, waving, explaining, celebrating, pointing, wallet-holding, thinking and stressed poses, including intermediate frames.

Walking depth is selected in character-local coordinates, then the complete SVG
is mirrored once. The screen-left arm is in front when facing right; mirroring
places it on the screen-right when facing left. Do not apply a second facing-based
swap to the local arm names. Hands follow their sleeves' depth. `armLayering()`
includes the projected turn's `yaw`; occlusion fades out at the frontal midpoint.
Frontal pose rendering is preserved when `turn` is zero.

Both free walking elbows point behind the shoulder-to-wrist line. The solver
blends signed elbow flexion through extension when changing into or out of that
plane, rather than flipping the elbow abruptly. Profiles with a positive minimum
elbow flexion retain their configured bend plane to honor that joint constraint.

Current detailed inspection sheet: `out/characters/hand-refinement/hand-review.jpg` (eight wrist/hand contexts). Generate the crops from current renders with `python scripts/character-detail-sheets.py`. The current characters remain hairless. Geometry tests do not prove visual appeal or clearance; open and inspect the renders.

```tsx
import { Sam, Alex } from "./characters/ReferenceCharacterRig";

<svg width={1920} height={1080}>
  <Sam
    expression="worried"
    pose="slumped"
    gesture="holdWallet"
    x={600}
    y={740}
    scale={1.2}
  />
  <Alex expression="confident" pose="pointing" x={1100} y={740} scale={1.2} />
</svg>;
```

Each actor returns a `<g>` for use inside an SVG viewport. `x/y` anchor the floor. `actionFrom` and `blendFrames` are local frames; `fromPose` describes the prior pose. One pure `referenceSkeleton()` function computes both identities' joint positions, using constrained two-bone IK and planned foot contacts. Expressions do not change body proportions. Hands and held-wallet placement use the solved wrist endpoints. Mirroring is controlled by `facing`.

The twelve expression names and ten pose names are exported from `referenceModel.ts`. Gestures reuse the original seven gesture names. The model is deterministic and tested independently of React. Frames before `actionFrom` hold the prior pose; actions then ease into their target. Walking intentionally travels in world space, so provide horizontal room.

Reference palette: outline #0F172A, face/shirt #F8FAFC, Sam blue #3B82F6, positive accent #10B981, yellow #FACC15 and warning #EF4444. These tokens apply only to this candidate; existing film tokens remain intact. The supplied reference supersedes the original tie/stripe identity for this candidate only.

Scope: front-facing 2D acting, pose blending, seven gestures, optional backpack and held wallet. Full 3D turnaround, lip sync and tablet interaction are not implemented. The image's lettering is outside this character-only change. Human design and normal-speed acting approval remain pending.


`BankExample` supplies an optional solved `skeleton` and per-side `hands` silhouettes to the same rig. This allows world-space door and money contacts without changing the default pose presets. Override skeletons must preserve the existing limb proportions; bank choreography tests check every frame.

## Deterministic motion system

`referenceSkeleton()` now uses `motionPlanner.ts`, `gait.ts`, `biomechanics.ts`,
and `jointConstraints.ts`. The SVG artwork and both identities are unchanged.
`legacyWalkingSkeleton()` and `legacyDistanceFoot()` exist only for comparison;
`StickmanRig.tsx` still uses the original numeric-bend IK path and gait.

For reusable choreography, compile a plan outside rendering and supply `motion`:

```tsx
const movement = planMotion([
  { action: "walking", from: 0, duration: 150, distance: 180 },
  { action: "turning", from: 160, duration: 90, yaw: -1 },
  { action: "sitting", from: 260, duration: 90 },
  { action: "standUp", from: 360, duration: 90 },
]);
<Sam motion={movement} x={400} y={840} scale={1.65} debug />;
```

Import `planMotion` / `evaluateMotion` from `./motionPlanner`. Distances and
interaction targets are in character-local SVG units, not screen pixels. Action
frames are local composition frames. Use the actor's `facing` to mirror travel;
`yaw` controls an in-place projected turn without mirroring planted feet.
Pass anatomy and segment masses as the second argument to `planMotion`.
`evaluateMotion(plan, frame)` is pure and supports arbitrary seek order.

The convenience `pose="walking"` preset is a finite 600-frame, 720-unit walk;
use an explicit plan for other travel lengths, timing, and action sequences.
Frames before `actionFrom` hold the completed `fromPose`. Contacts persist across
sequence boundaries, and final walking contacts settle before the next action.
Explicit hand targets use IK; free transitions and arm swings use FK arcs.

`MovementReview` is now 600 frames (20 seconds) with two pages and twelve panels.
It compares the original walk with contact-aware walking and includes mirrored,
slow/fast, start/stop/turn, sit/stand, lifting/carrying, door contact, handoff,
and gesture/emotion transitions. Set its `debug` prop to `true` for joints,
angles, limits, foot phases, support, COM, direction, foot paths and target errors.

- `npm run movement:stills`: clean keyframes.
- `npm run movement:stills -- --debug`: diagnostic keyframes.
- `npm run render:movement`: `out/movement-review-arm-correction.mp4`.
- `npm run render:movement -- --debug`: separate diagnostic MP4.

See
[`docs/movement-system.md`](../../docs/movement-system.md) for the pre-change
audit, limitations, validation evidence, and production migration steps.


The positioning polish pass is documented in
[`docs/movement-polish-review.md`](../../docs/movement-polish-review.md).
Superseded exports were removed; regenerate previews with the retained compositions.

## Supporting-leg extension and foot rockers

Walking now derives pelvis height from the loaded leg's phase rather than a fixed
crouched pelvis height. The supporting knee approaches extension through
midstance while the swing knee bends for clearance and extends for landing.
The knee still flexes during loading and push-off; it is not locked straight.
Foot rotation preserves the active heel or toe contact, so a planted ankle may
move during a rocker while the loaded point remains fixed on the floor.

`WalkingMechanics` shows larger Sam/Alex walks in both directions with actual
knee angles and gait-phase labels. Run `npm run walking:stills` or
`npm run render:walking` for `out/walking-arm-correction.mp4`; append `-- --debug`
for solver overlays. The full review remains available through
`npm run render:movement`.

Research, sources and verification: [walking mechanics research](../../docs/walking-mechanics-research.md).
