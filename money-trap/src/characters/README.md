# Reference-led character rig

`ReferenceCharacterRig.tsx` follows the clothing and face direction supplied in `../../../references/character-reference.png`: Sam's blue hoodie, Alex's white collared shirt and round glasses, larger white faces, dark outlines, small hands and simple expressive silhouettes. Both characters are now hairless at the user's request. The SVG artwork is authored in TSX; the reference PNG is not embedded or traced as a raster asset.

This is a **separate character candidate**. `StickmanRig.tsx`, `POC.tsx`, existing scene templates, the original ComponentGallery and the exported film still use the original rig. Do not switch those imports until requested. Film typography, narration and timing are unchanged.

The refinement pass adds lighter outline hierarchy, softer garment shapes, hoodie cuffs/drawstrings/pocket seams, a backpack strap and pocket, quieter shirt details, thinner glasses, subtle gaze and nose marks, and distinct resting/open/pointing/fist/wave hands. Closed hands follow forearm orientation; open palms and pointing hands use deliberate presentation angles. Body proportions and the tested skeleton are unchanged. Earlier hero and expression PNGs are retained in `out/characters/` for comparison.

## Preview

Open the `CharacterStudy` composition in Remotion Studio (http://localhost:3100/CharacterStudy when using port 3100). It has four pages: identities, twelve expressions, nine pose examples, and gesture/walk checks. Scrub/play the composition to inspect blending. `npm run characters:stills` saves current character-only PNGs in `out/characters/hand-refinement/`; it never exports or overwrites an MP4. Identity, expression, pose and action sheets render at 2× resolution for close inspection. Other PNGs under `out/characters/` are previous revisions.

## Face and hand design checks

Keep both characters hairless. Alex's brows, glasses, nose and mouth occupy separate vertical bands. Review both characters' twelve expressions at close range after any glasses or facial-feature edit.

Hands use one consistent wrist anchor and local -Y finger direction across relaxed, open, fist, pointing and waving silhouettes. Open/waving gestures share the same five-digit palm drawing; shorter finger groups and round knuckles keep the style readable. `handRotation()` aligns each hand with its solved forearm, adding a mirrored 12-degree wrist bend for presenting palms. Do not mix local +Y/-Y finger directions or hardcode unrelated pose rotations. Cuffs end at the solved wrist. The wallet hangs below the closed grip rather than floating beside a thumb. Check relaxed, waving, explaining, celebrating, pointing, wallet-holding, thinking and stressed poses, including intermediate frames.

Current detailed inspection sheet: `out/characters/hand-refinement/hand-review.jpg` (eight wrist/hand contexts). Generate the crops from current renders with `python out/characters/hand-refinement/make-detail-sheets.py`. The current characters remain hairless. Geometry tests do not prove visual appeal or clearance; open and inspect the renders.

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

Each actor returns a `<g>` for use inside an SVG viewport. `x/y` anchor the floor. `actionFrom` and `blendFrames` are local frames; `fromPose` describes the prior pose. One pure `referenceSkeleton()` function computes both identities' joint positions, reusing the existing two-bone IK and planted gait. Expressions do not change body proportions. Hands and held-wallet placement use the solved wrist endpoints. Mirroring is controlled by `facing`.

The twelve expression names and ten pose names are exported from `referenceModel.ts`. Gestures reuse the original seven gesture names. The model is deterministic and tested independently of React. Frames before `actionFrom` hold the prior pose; actions then ease into their target. Walking intentionally travels in world space, so provide horizontal room.

Reference palette: outline #0F172A, face/shirt #F8FAFC, Sam blue #3B82F6, positive accent #10B981, yellow #FACC15 and warning #EF4444. These tokens apply only to this candidate; existing film tokens remain intact. The supplied reference supersedes the original tie/stripe identity for this candidate only.

Scope: front-facing 2D acting, pose blending, seven gestures, optional backpack and held wallet. Side/back turnaround, lip sync and tablet interaction are not implemented. The image's lettering is outside this character-only change. Human design and normal-speed acting approval remain pending.


`BankExample` supplies an optional solved `skeleton` and per-side `hands` silhouettes to the same rig. This allows world-space door and money contacts without changing the default pose presets or the original POC. Override skeletons must preserve the existing limb proportions; bank choreography tests check every frame.

Walking now shares `walkingSkeleton()` and distance-driven stance/swing targets between the character presets and bank choreography. The rig turns into a three-quarter view, narrows the projected hips/shoulders, bends both knees toward travel and swings the arms in opposite directions. The near sleeve draws over the torso while walking. Bank stops settle each foot before turning toward the viewer; the carrying hand stays attached to the cash.

`MovementReview` shows six simultaneous checks in one continuous five-second frame: walking right/left, carrying and stopping, door contact/release, approach and cash transfer, and wave/point/nod. Run `npm run render:movement`; output: `out/movement-review.mp4`. Run `npm run movement:stills` for keyframes. The earlier bank MP4 is retained; rerun `npm run render:bank` to export its updated walk.
