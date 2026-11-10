# Cinematography and composition

Evidence: `../evidence/visual-observations.md` (six sampled videos) plus the
contact sheets. Stills support framing, subject placement, depth layering and
palette. They do not support camera-move claims — no move is measurable from frames
taken tens of seconds apart. Where a move is inferred, it says so.

## 1. Framing sizes actually used

Counting the six sampled videos, four framing sizes recur and two are absent:

| Size | Where observed | What it carries |
|---|---|---|
| Wide / establishing | Kurzgesagt 3 s, 80 s; Beanie 5 s, 80 s; Alan Becker 5 s, 60 s; TheOdd1sOut (never) | Place, scale, isolation |
| Medium (figure ~1/3 frame height) | Beanie 250 s, 350 s; Paint 150 s; Kurzgesagt 40 s | The default working shot |
| Close (head and shoulders) | Beanie 20 s; Odd1sOut 70 s; James Jani 1020 s (live action) | Emotion, reaction |
| Insert / object only | Paint 20 s (planet + arrows), 380 s (planet + dashed line); HMW 300 s (chart) | A single measurement |
| Extreme close-up | Kurzgesagt 25 s (two eyes filling frame) | One beat, once per video |
| Over-the-shoulder / POV | **not observed** | — |

**Observed pattern:** the corpus almost never uses a camera move to create
interest; it cuts between framing sizes instead. The strongest single example is
Kurzgesagt's 12 s → 25 s: wide truck stop straight to an extreme close-up of eyes,
with nothing in between.

## 2. Subject placement and negative space

- **Centred subject on empty background** is the dominant composition in the
  explainer tier (Paint Explainer: every sampled frame; Odd1sOut: two figures
  centred over a counter; James Jani: a single dot centred on yellow).
- **Rule of thirds appears in the animation tier**, not the explainer tier:
  Beanie's character sits left of centre against a window wall; Kurzgesagt's 40 s
  figure sits right of centre with rim light; Alan Becker puts the group in a line
  across the lower third.
- **Negative space is used as a scale instrument.** Kurzgesagt 60 s: a tiny teal
  figure in a large white field. Paint Explainer 5 s: a huge Sun with a tiny burning
  figure at the opposite edge. In both cases the emptiness is the point, not a
  missing background.

**Rule worth copying:** empty space should be *doing* something — either isolating a
small subject (scale) or clearing a zone for a label/arrow to arrive into.

## 3. Depth

Three techniques, all cheap:

1. **Layered side-view planes** (Alan Becker). Foreground particles/cobwebs,
   midground rails and characters, background cave wall. No perspective, no 3D.
2. **Foreground occlusion** (Kurzgesagt 40 s: abstract bubbles in front of the
   figure; Beanie 20 s: the peephole ring itself).
3. **Ground plane + shadow** (Paint Explainer 150 s: the astronaut's shadow is what
   puts him on the ground; Beanie: contact shadows under the figure).

**Absent:** parallax on camera moves, rack focus, depth of field. Nothing in the
corpus requires a 3D camera.

## 4. Palette discipline

| Channel | Base | Accent rule |
|---|---|---|
| Paint Explainer | flat white | red = force/danger only; black outlines; yellow/orange for heat |
| Beanie Survives | cool blue/grey interiors | warm amber for light sources; yellow beanie as the identity anchor |
| Kurzgesagt | per-video (magenta/purple, then white, then black) | rim light in a single warm colour |
| James Jani | flat mustard yellow | black for all information |
| How Money Works | naturalistic (live action) | white card, yellow buttons, red/green labels |
| Alan Becker | Minecraft texture palette | character colour only |

**Observed rule:** every channel restricts itself to one meaning-bearing accent
colour. The Paint Explainer's red is never decorative; it always means force,
pressure or danger. This repo's palette already assigns yellow = money, coral =
cost, teal = alternative — the discipline, not the hues, is what to copy.

## 5. What is genuinely unmeasured

- Camera moves (push-in, pan, tracking). No frame pair in the corpus proves one.
- Cut points and shot durations — see `editing-pacing.md`, which measured them
  separately with scene detection and reports the method's error bars.
- Lighting direction and shadow behaviour beyond "there is a contact shadow".

Any document that claims "Kurzgesagt uses a slow push-in here" without consecutive
frames is inventing. Ours does not.
