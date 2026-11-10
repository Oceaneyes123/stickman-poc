# Object motion

Frame-driven SVG object animations for concepts, illustrations and props. Every component takes `x`, `y` (the object centre, or its contact point where noted), `from`, `until`, optional `frame`, `size`, `color` and `shape` (`circle` | `square`), so a scene can swap the demo shape for real art.

`motion.tsx` shares `useStyle`/`StyleProps` with `../typography/motion`, so timings behave exactly like the typography components. No CSS animation, clock, random value or remote asset.

- Entrance and exit: `PopIn`, `DropBounce` (`y` is the ground line), `DrawOn` (path stroke then fill), `SlideInBlur` (blur decays with speed), `PoofExit`.
- Movement and physics: `SquashStretch` (deform from instantaneous speed), `AnticipationFollow` (wind-up, move, settle), `Pendulum` (damped swing about a pivot above the object), `SpringWobble`, `OrbitFloat` (idle hover).
- Transformation: `MorphObject` (square corner radius animates to a circle), `SplitAssemble` (clipped slices fly in), `GrowBuild` (stack builds block by block), `FlipCard` (scaleX flip, swaps shape and colour at the midpoint), `InflateDeflate`.
- Interaction: `CharacterInteraction` (a stand-in stick figure carries the prop on its hand), `ChainReaction` (domino tilt cascades through four objects), `ConveyorFlow`, `MagnetPull` (items spring into wallet slots), `ParallaxLayers` (three depth layers pan at different speeds).

The `ObjectMotionGallery` composition shows all twenty for 90 frames each; `OBJECT_GALLERY_DURATION` is the registered length. `CharacterInteraction` deliberately does not use `ReferenceCharacterRig` — it only proves a prop can ride a computed hand. Use the real rig when a scene needs a character.
