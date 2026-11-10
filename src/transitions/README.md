# Transitions

`Transition` takes `id`, `start`, `end`, optional `frame`, `before` and `after` scenes (SVG nodes) and draws the join. Progress is `clamp01((frame - start) / (end - start))`, so a transition depends only on frames like every other component. Default frame is 1920×1080; pass `width`/`height` if a scene uses another viewBox.

```tsx
<Transition id="wipe" start={120} end={140} before={<ShotA />} after={<ShotB />} />
```

The ID is the editorial decision; only the mechanism is drawn. Cuts and match cuts share the `cut` mechanism on purpose — their difference is where the action sits on either side, which belongs to the scenes, not to an effect.

| Family | ID | Mechanism | Use when |
|---|---|---|---|
| Cuts | `hard-cut` | cut | New beat, or the idea continues |
| Cuts | `cut-on-action` | cut | An action carries across scenes |
| Cuts | `cut-on-look` | cut | Sam notices something |
| Cuts | `lead-cut` | cut | Sentence changes inside a scene |
| Cuts | `smash-cut` | flash-cut | Calm into a shocking number (rare) |
| Match | `match-position` | cut | Phone into account view |
| Match | `match-shape` | cut | Coin into sun, card into ledger |
| Match | `match-number` | cut | Money carries across scenes |
| Match | `object-becomes-scene` | zoom-through | Phone, laptop, notice |
| Camera | `push-in` | camera-push | Emphasis on one object |
| Camera | `pull-back` | camera-pull | Reveal the frame or the pair |
| Camera | `pan-follow` | camera-pan | Travel, handoff |
| Camera | `slide-push` | push | Sequences, comparisons |
| Reveal | `wipe` | wipe | Neutral change of topic |
| Reveal | `object-wipe` | object-wipe | Money object as the transition |
| Reveal | `iris` | iris | Punchline or end of a chapter |
| Reveal | `doorway` | doorway | Location change |
| Time and mood | `crossfade` | crossfade | Time passing, softer mood |
| Time and mood | `dip-to-color` | dip | Chapter break (yellow for a money reveal) |
| Time and mood | `calendar-flip` | calendar | Month 1 to Month 2 |
| Time and mood | `relight` | relight | “Things got worse” without new art |
| Structure | `split-open` | split | Sam vs Alex |
| Structure | `panel-freeze` | freeze | Introducing an example |
| Structure | `state-swap` | crossfade | Before/after, month to month |
| Structure | `callback-cut` | cut | Payoff of an earlier scene |

`TRANSITIONS` exports the same table as data (`id`, `family`, `use`) for planning tools and the gallery.

Duration is the caller's: a cut is one frame, a crossfade 12–20 frames, a camera move brief. Nothing here eases a cut — if a join needs easing, it is not a cut.

`TransitionGallery` plays all twenty-five for 90 frames each; `TRANSITION_GALLERY_DURATION` is the registered length. The gallery uses placeholder cards, so a still cannot prove timing: check the render, not just the stills.
