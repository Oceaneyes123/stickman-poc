# Cinematic reference-scene audit

Scope: S12, S21–S22, and S50–S52 only. Existing narration, cue files, financial
assumptions, character designs, and versioned packets are protected. The local
checkout's origin is `Oceaneyes123/stickman-poc`; no worktree or remote mutation.

## Phase 0 findings

Inspected AGENTS/INSTRUCTIONS, channel branding and the supplied character image,
the opening/remaining study implementations and shot data, OpeningFilm, legacy
scene templates, the reference rig and motion planner, animation helpers,
financial components/math, timeline compiler/validation, the full episode board,
scene review guides, existing tests, and animation validation notes. The current
hairless, earless rig overrides the hair shown in the original reference image.

Reviewed the existing S01–S06 encoded MP4 through sampled frames, its saved
event/boundary sheet, and the complete S07–S67 visual packet. This is an engineering
and sampled visual audit, not human playback/listening or creative approval.

| Existing view/system | Strength | Limitation / decision |
| --- | --- | --- |
| Opening reaction close-up | Expressive silhouette; phone clears face; hands retained | Keep identity/framing intent; static carry pose is not pickup choreography |
| Passenger-side rental interior | Depth, foreground occlusion, recognizable location | Effective insert; new acting should not be simulated by camera drift |
| Shoulder phone and close insert | Useful object-centered explanations | Repeated across many scenes; partial rear silhouette has no articulated hands |
| Improved apartment | Clear permanent desk/window/room corner | Person usually stands beside the desk; no actual arrival or laptop placement |
| S21/S22 allocation studies | Correct $600/$300/$220/$80 relationships | Separate overhead diagrams lose the discovery and physical continuity |
| S50–S52 split studies | Equal identities and correct time-window arithmetic | Totals live in large floating panels; characters mostly carry static keys |
| `SceneShell` / legacy templates | Consistent safe margins and readable money | Permanent title, branding, progress marks and fixed person/content columns read as slides; leave legacy callers intact |
| `Paper`, `Table`, `PhoneRows`, `BudgetTable` | Clear still-review states | Dominate RemainingSceneStudy; preserve as old studies, replace only reference-scene production paths |
| Reference rig, `planMotion`, gait, IK, `solveBody` | Fixed segments, constrained joints, planted contacts, deterministic samples | Reuse; choreograph explicit contact/ownership changes rather than unrelated limb translations |
| Timeline compiler and finance module | Absolute endpoint rounding; cue/event validation; derived totals | Extend through an adapter for typed direction beats; do not embed narration seconds in graphics |
| Existing render scripts | Local bundled browser, versioned output, metadata/decode/hash checks | Reuse render pipeline and one global narration track per reference clip |

## Implementation boundary

Build flexible layer/camera/reveal composition helpers, shared stage/prop contact
utilities, and a cue/word-driven direction adapter around the current compiler.
Use physical listings, laptops, rental quotes, the same finite raise, and dated
contribution receipts as the subjects. Keep numerical frames stable while read.

S12: phone attention/reach/lift/read, motivated location cut, grounded arrival,
two-handed laptop carry/place/release/open, satisfied reading hold.

S21–S22: one continuous desk arrangement; tight quote/raise attention, pullback
to the rent commitment, one finite allocation, then the $80 remainder and reaction.

S50–S52: equal matched rooms; dated contribution actions, period totals and $840
gap; close the period view before the Month 3 receipts/$420 gap; end on the
different real benefits without judging either character.

Stop after these reference renders for visual approval. No automatic episode-wide
regeneration, new voice generation, retiming of source audio, commit, push or publish.

## Backdrop revision during implementation

The user subsequently requested removal of all walls, windows and floor, while
retaining the foreground, and asked for a rough textured background rather than
plain white. The reference renders therefore use fixed, original SVG paper grain.
Characters, desks, chair, plant, laptop, phone, dishes, rental documents, allocation
strip and contribution receipts remain. Doors and floor/rug geometry are removed.
The texture is locked to the output canvas and uses an explicit seed; it does not
drift with the camera. Architectural environments remain available to other callers
but are disabled in the three reference sequences. Existing approved packets stay
untouched.
