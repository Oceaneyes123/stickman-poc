# Typography

Frame-driven SVG components for Remotion 4.0.541. No added dependency, CSS animation, clock or remote asset. Inter comes from the existing local font bundle.

Labels use a spring lift and scale. Headlines can stagger individual words and emphasize selected terms with semantic color.

All components accept `x`, `y`, `from`, `until`, optional `frame`, `size`, `color`, `enter` and `exit`. Frames use the caller's coordinate system. Pass absolute compiled frames together with an absolute `frame`, or use local frames inside a Sequence. `until` is exclusive. The default entrance is 15 frames and exit is 10 frames.

- `KineticHeadline`: `text`, `unit` (`word`, `line`, `character`), `stagger`, `width`, `textAlign`, `emphasis`, optional illustrated `origin`, `motion` (`slide`, `pop`, `punch`, `karaoke`, `typewriter`) and `cursor` for the typewriter caret. Browser text layout wraps masked spans; no approximate glyph measurements. `slide` keeps the original masked line reveal; `karaoke` uses `stagger` as frames per spoken word; `punch` slams the `emphasis` word only.
- `AnimatedNumber`: derived `value`, optional `initial`, `duration`, `mode` (`counter`, `odometer`), `anchor` and `positive`. Rolling digits carry at the rollover and settle on the exact integer. Currency comes from the shared formatter.
- `AnimatedList`: `items` with individual `from` frames, text and optional color; adjustable row `gap`.
- `ObjectAttachedLabel`: exact `text`, current `object: {x, y}`, optional leader `line` and text `anchor`. Supply the computed object's coordinates each frame for tracking. Keep it in the same SVG viewBox as the object.
- `ComparisonReveal`: derived `left`, `right`, separate `leftAt`, `rightAt`, `differenceAt`, optional `width` and counter `duration`. Rejects a difference that starts before both counters settle.
- `AnimatedUnderline`: `width`; draws a bounded spring-driven emphasis stroke.
- `SectionHeading`: exact `text` and optional underline `width`.
- `TextMorph`: `before`, `after`, `changeAt` and optional `destination`. Crossfades and moves the shared text layout; it does not attempt font-outline interpolation.

`motion.tsx` holds the remaining text-motion styles, all frame-driven SVG: `GlitchText` (deterministic sine RGB split/jitter), `ElasticText` (low-damping overshoot), `FlipText` (scaleX flip about the anchor), `ZoomThrough` (camera fly past giant text), `PathText` (`textPath` on a declared curve with a sweeping clip), `TypeStack` (mixed-size lyric stack), `TextMask` (brand bands masked by the letterforms), `OutlineReveal` (stroke draw-on then fill), `TypeCollage` (words placed around the frame), `GravityDrop` (fall, bounce, settle on a ground line), `LiquidMelt` (wobble, sag, drip), `BalloonInflate` (inflate, lift, pop), `MagneticSnap` (scattered letters converge), `RopeSwing` (damped pendulum on a rope), `ScrambleText` (`scramble` glyph cycling, `flip` for a split-flap board), `MorphStretch`, `InkBleed` (blurred mask spreading), `PaperTear` (flaps pull apart), `Spotlight` (dark overlay with a travelling beam), `ParticleDissolve` (`assemble` reverses it), `NeonFlicker`, `LightTrail` (clip-follows-head draw-on), `ChromaticSlice`, `EchoTrail`, `SpiralVortex`, `TextTunnel`, `OrbitWords` and `MarqueeTicker`. Per-letter styles lay out on a fixed `size * 0.62` advance rather than measuring glyphs.

`TypographyGallery` shows each style for 90 frames after the three functional panels. Use `TYPOGRAPHY_GALLERY_DURATION` when registering it for review.

The episode 001 typography plan and review renderer are archived. The text-motion components and gallery are available for new episodes.
