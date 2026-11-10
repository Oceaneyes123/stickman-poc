# Typography

Frame-driven SVG components for Remotion 4.0.541. No added dependency, CSS animation, clock or remote asset. Inter comes from the existing local font bundle.

The current episode preview includes scene-driven character and object motion from `src/storyboard/episodeMotion.ts`. Text leader lines are disabled by default and removed from the episode. Labels use a spring lift and scale; headlines stagger individual words and emphasize selected terms with semantic color.

Use `--prepare-only` to create the compiled preview assets without exporting video or rendering a storyboard packet. Current preview assets are in `out/001-lifestyle-creep/movement-typography-preview-v3/public`.

All components accept `x`, `y`, `from`, `until`, optional `frame`, `size`, `color`, `enter` and `exit`. Frames use the caller's coordinate system. Pass absolute compiled frames together with an absolute `frame`, or use local frames inside a Sequence. `until` is exclusive. The default entrance is 15 frames and exit is 10 frames.

- `KineticHeadline`: `text`, `unit` (`word`, `line`, `character`), `stagger`, `width`, `emphasis`, optional illustrated `origin`, `motion` (`slide`, `pop`, `punch`, `karaoke`, `typewriter`) and `cursor` for the typewriter caret. Browser text layout wraps masked spans; no approximate glyph measurements. `slide` keeps the original masked line reveal; `karaoke` uses `stagger` as frames per spoken word; `punch` slams the `emphasis` word only.
- `AnimatedNumber`: derived `value`, optional `initial`, `duration`, `mode` (`counter`, `odometer`), `anchor` and `positive`. Rolling digits carry at the rollover and settle on the exact integer. Currency comes from the shared formatter.
- `AnimatedList`: `items` with individual `from` frames, text and optional color; adjustable row `gap`.
- `ObjectAttachedLabel`: exact `text`, current `object: {x, y}`, optional leader `line` and text `anchor`. Supply the computed object's coordinates each frame for tracking. Keep it in the same SVG viewBox as the object.
- `ComparisonReveal`: derived `left`, `right`, separate `leftAt`, `rightAt`, `differenceAt`, optional `width` and counter `duration`. Rejects a difference that starts before both counters settle.
- `AnimatedUnderline`: `width`; draws a bounded spring-driven emphasis stroke.
- `SectionHeading`: exact `text` and optional underline `width`.
- `TextMorph`: `before`, `after`, `changeAt` and optional `destination`. Crossfades and moves the shared text layout; it does not attempt font-outline interpolation.

`motion.tsx` holds the remaining text-motion styles, all frame-driven SVG: `GlitchText` (deterministic sine RGB split/jitter), `ElasticText` (low-damping overshoot), `FlipText` (scaleX flip about the anchor), `ZoomThrough` (camera fly past giant text), `PathText` (`textPath` on a declared curve with a sweeping clip), `TypeStack` (mixed-size lyric stack), `TextMask` (brand bands masked by the letterforms), `OutlineReveal` (stroke draw-on then fill), `TypeCollage` (words placed around the frame), `GravityDrop` (fall, bounce, settle on a ground line), `LiquidMelt` (wobble, sag, drip), `BalloonInflate` (inflate, lift, pop), `MagneticSnap` (scattered letters converge), `RopeSwing` (damped pendulum on a rope), `ScrambleText` (`scramble` glyph cycling, `flip` for a split-flap board), `MorphStretch`, `InkBleed` (blurred mask spreading), `PaperTear` (flaps pull apart), `Spotlight` (dark overlay with a travelling beam), `ParticleDissolve` (`assemble` reverses it), `NeonFlicker`, `LightTrail` (clip-follows-head draw-on), `ChromaticSlice`, `EchoTrail`, `SpiralVortex`, `TextTunnel`, `OrbitWords` and `MarqueeTicker`. Per-letter styles lay out on a fixed `size * 0.62` advance rather than measuring glyphs.

`TypographyGallery` shows each style for 90 frames after the three functional panels (15 motion styles, then 20 more); `TYPOGRAPHY_GALLERY_DURATION` is the registered composition length.

`plan.ts` resolves cue/word ownership and both anchor endpoints before rounding with the existing timeline compiler's `msToFrames`. Draft sources stay in `timing-demo` review mode. The compiler rejects labels whose declared reading hold cannot fit; it never stretches narration. A period or identity label can explicitly persist across panel cuts or hold to the scene end when the comparison needs it.

`FinancialMotionContext` changes only the typography review path. The v6 still composition has no context and retains its original currency-only rendering. Within the review, derived finance values gate both counters and contribution bars. A transfer check appears after the authored transfer action label, rather than treating an arithmetic remainder as saving.

Create the complete local review packet:

```powershell
node --experimental-strip-types scripts/render/render-typography-review.ts --out out/001-lifestyle-creep/typography-review-new --full
```

Use a fresh output folder. Without `--full`, the command creates all panel stills, beat/boundary stills, a narrated-scene review page, compiled direction and provenance reports. `--full` also renders the 1920×1080 H.264/yuv420p episode and verifies metadata/full decode. Stills use 0.5 scale. No narration is regenerated.

Open the prepared composition in Studio:

```powershell
npx remotion studio src/storyboard/CinematicStoryboardStudy.tsx --public-dir out/001-lifestyle-creep/typography-review-new/public
```

Choose `TypographyEpisode`. The episode preview combines v6 art with bounded panel actions, prop motion and typography. It does not replace the separately authored opening performance. Full motion, source draft timing and human listening/creative approval remain separate from technical checks.
