# Positioning and movement review - 2026-11-07

Reviewed frames 36, 120, 210, 340, 395 and 510 extracted directly from
`out/movement-review-biomechanics.mp4`, rather than relying on earlier preview
PNGs. Full-resolution originals are retained in `out/movement-polish/before/`.
The existing production rig, artwork paths, financial data, narration and bank
scene cue frames remain unchanged.

## Findings and implemented corrections

| Evidence | Finding | Correction |
| --- | --- | --- |
| 36, 120, 210: walking panels | Wrists bunch near the hips, then both arms spread outward. Each arm independently followed its foot's absolute offset. | Drive opposing swing from relative foot separation with a two-frame lag. Use a bounded swing amplitude, slightly different elbow flexion, and shoulder/body projection with room for the sleeves. |
| 36, 120, 340: carry and bank panels | The carrying elbow is near shoulder height while the forearm drops to the grip. This reads as a stiff raised arm. | Use consistent elbow preferences that keep the carrying elbow below the shoulder and the forearm closer to horizontal. Centerline FK retains the resting wrist targets when the bend preference changes. |
| 210: carry/turn panel | Turning discards the holding action and lowers the hand and object. | Keep held hand targets under IK throughout the turn, including the blend. Preserve the grip silhouette. |
| 340, 395: sitting panel | The pelvis remains centered over the feet, forming two sharp zigzags; the stool is ahead of the new seated position. | Move the pelvis back 24 local units, keep the feet fixed, and align the stool with the seated hips. Project the body slightly in the seated pose. |
| 340, 395: pickup panel | The free hand hangs near the floor while the other grasps the object. | Counter-shift the pelvis back 12 local units and keep the free hand near the thigh. Keep the grasp target fixed in the original action coordinates. |
| Stand-up boundary, then 448 and 456 | Rising starts before a clear forward weight transfer. | Preload the torso over the feet for eight frames before lifting the pelvis; retain ground contacts and blend the arms independently. |
| 36, 120: planted shoes | The review's floor line is below the shoe soles; the shadow is further below the feet. | Align the line to the existing shoe geometry and move the shadow up to the contact plane. |
| Walking cycle / gait source | The pelvis lowers most during midswing instead of passing over the stance leg. | Raise the pelvis through midstance and soften it during double support, subject to reach constraints. |
| 340, 395, 510: bank panels | Frame division and rounding repeat source poses for two or five output frames. | Play bank actions at their actual 30 fps, then hold the completed action. No production timing changes. |
| 340, 395: gestures | A waving arm uses a closed resting hand. | Carry hand intent through the solved skeleton and select existing wave, point and grip artwork. Explicit per-hand caller overrides retain priority. |

The original/improved gait comparison now shares root travel so its positional
comparison is fair. This remains a stylized projected 2D kinematic rig, with the
physical-model limitations described in `movement-system.md`.

## Verification

- `npm run check`: timing compilation, ESLint, strict TypeScript, and 42 tests.
- New focused checks cover opposing swing, wrist clearance, a lowered carrying
  elbow, exact grip preservation through a turn, seated pelvis placement,
  stand-up preload, free-hand clearance during pickup, and gesture hand intent.
- Existing whole-action bone/limit/reach/contact, reverse-seek, bank handle/cash,
  financial and narration-timeline regressions remain included.
- Inspected the revised walking, carrying, seated, pickup, gesture and stand-up
  keyframes. Debug stills provide joint/contact/balance checks.
- Export: `out/movement-review-polished.mp4`; the previous review is retained.
  Encoded before/after comparisons are in `out/movement-polish/`.

Technical checks do not replace normal-speed human acting approval. No narration
was regenerated or assessed, and the original MoneyTrapPOC was not re-exported.
No commit, push, publication or production import migration was performed.
