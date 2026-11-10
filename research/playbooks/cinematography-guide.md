# Cinematography guide

Framing and composition rules for this pipeline, derived from the six sampled
reference videos. Evidence: `../channels/cinematography-composition.md`.

Scope note: no camera move in the corpus was measurable, so this guide defines
**framing presets and composition constraints**, not camera choreography. `AGENTS.md`
already says camera motion should be brief and restrained; nothing here contradicts it.

## 1. Framing presets

Four presets cover every beat in the corpus. Define them once, use them by name.

| Preset | Subject height in frame | Use | Notes |
|---|---|---|---|
| `wide` | ≤ 25% | Openers, time jumps, scale reveals | Layered background; figure must still be identifiable |
| `medium` | 40–55% | Default working shot for character beats | Eye-line at 45% frame height |
| `close` | 70–85% | Reaction, decision, consequence | Only one figure; background simplified to a colour field |
| `insert` | object only | A number, a receipt, a bill, a chart | No character in frame |

Not available in this pipeline: extreme close-up of a rendered face (the rig cannot
support it at reference quality) and over-the-shoulder (no shoulder geometry).

## 2. Composition rules

1. **One subject per frame.** Every sampled frame in the corpus is single-purpose.
2. **Figure off-centre, object centred.** Beanie and Kurzgesagt put the character
   left or right of centre; Paint Explainer centres the *object* and puts the label
   top-centre. Choose per scene type: character beats off-centre, diagram beats
   centred.
3. **Negative space is an instrument.** Either isolate a small subject (scale) or
   reserve a zone for an arriving label/arrow. Empty space with no job is a layout
   error.
4. **96 px side margins** (existing repo rule) and **no label crossing a face**
   (existing rule). Both are consistent with every sampled frame.
5. **Ground contact.** Any figure standing on a surface gets a contact shadow
   (pattern A1). A floating figure is a bug, not a style.
6. **Text zone.** Labels live at a frame edge or above the subject, never across the
   middle third.

## 3. Depth

Use at most two of these per scene:

- **Layered planes:** foreground element (particles are banned; use a foreground prop
  or frame edge), midground subject, background wall/skyline.
- **Occlusion:** a peephole ring, a door frame, a table edge in front of the figure.
- **Ground plane + shadow.**

Do not fake depth with blur or perspective scaling. No sampled frame in the corpus
uses depth of field.

## 4. Palette discipline

Existing brand palette stands: navy `#14243A`, white `#F8FAFC`, yellow `#F3BE58`
(money), coral `#FF6B6B` (cost/loss), teal `#39B8B6` (alternative).

Rules observed in the corpus that reinforce it:

- **One accent colour carries one meaning.** Paint Explainer's red is never
  decorative. Ours: yellow only for money, coral only for cost, teal only for the
  alternative.
- **Flat fields, not gradients,** behind diagrams and cards. The one gradient in the
  sampled corpus (Paint's Jupiter frame) is a scene background, not a card.
- **Background contrast is a scene decision.** Beanie relights one set; Kurzgesagt
  inverts tonally between shots. Pick one per section, not per shot.

## 5. Shot sequence

- Consecutive scenes must differ in **at least one** of: framing preset, subject
  position, background value (light/dark), or scene type. The existing
  `visual-variety-audit.md` composition families already enforce the coarse version of
  this; this rule is the fine-grained one.
- **Scale changes between shots, not within them.** Alan Becker's sequence works
  because each shot holds one scale; a figure that grows within a shot reads as a
  zoom, which the corpus does not use.
- **Cut on the idea boundary**, not on a beat of music. The narration cue marks the
  boundary; the compiler already places cuts on cue events.

## 6. What this guide forbids

- Camera shake, Dutch angles, whip pans — no corpus evidence, and they fight the calm
  register.
- Parallax on a push-in for its own sake. If a push-in happens, it is because a number
  or a reveal needs emphasis, at most twice per video.
- A background that changes between two shots of the same location without a lighting
  prop change.
- Any framing preset not listed in §1.

## 7. Verification

- Contact sheet of every panel in a section: label position identical, figure height
  within the preset band, no label over a face.
- `npm run storyboard:design` review pages remain the human check.
- A rendered 10-second clip per preset, inspected at 0.5 scale, before the first full
  render.
