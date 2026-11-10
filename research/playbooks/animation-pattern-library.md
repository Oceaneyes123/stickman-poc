# Animation pattern library

Patterns the corpus supports, with implementation notes for this repo. **All timings
below are design targets, not measurements** — no easing or duration was measurable
from sampled stills (see `../channels/animation-reverse-engineering.md`).
They are starting values to be tuned against a rendered preview, in the same spirit as
a calibration constant.

## P0 — patterns without which a scene reads as a slide

### A1. Contact shadow under the stand-in figure
- **Why:** in the Paint Explainer's astronaut frame the shadow is the only thing
  placing him on the ground; without it a flat figure floats.
- **Spec:** ellipse, width ≈ 0.55 × figure hip width, opacity 0.18–0.25, offset 0 from
  feet, scales with figure scale prop.
- **Component:** character layer inside every scene that draws a ground plane.
- **Acceptance:** at 0.5-scale preview the figure still reads as standing, not pasted.

### A2. Pose-to-pose with a settle, not a snap
- **Why:** stick figures read as alive when a pose change has an arrival. The corpus
  shows settled poses at every sampled timestamp; nothing reads as mid-snap.
- **Spec:** 8–14 frames to the new pose, 3–5 frame overshoot of the leading limb,
  4–8 frames settle back. Blend through the existing pose interpolation, never cut.
- **Component:** `src/characters` motion planner.
- **Acceptance:** frame-by-frame scrub shows no single-frame limb teleport.

### A3. Held frames for reveals
- **Why:** Beanie's inventory card is a static frame whose *content* changed since the
  last card. The change is the event; motion is not required.
- **Spec:** minimum hold 45 frames (1.5 s) for any card with a number the viewer must
  read; 75 frames if two numbers must be compared.
- **Acceptance:** a viewer can read the largest number twice in the hold.

### A4. Label arrives with its object, leaves with it
- **Why:** Paint Explainer's measurement labels are attached to diagram elements, not
  free-floating captions.
- **Spec:** label opacity 0→1 over 8 frames starting 2 frames after the object lands;
  exits with the object, never before.
- **Acceptance:** no frame where a label exists without its object.

## P1 — patterns that carry explanation

### B1. Scale reveal (dot → grid → figure)
- **Why:** James Jani's 5 s dot becomes a ~120-dot grid by 25 s; Kurzgesagt's tiny
  figure in a white void. Scale is the argument.
- **Spec:** start with one unit object at a readable size, then duplicate to N with a
  staggered 2-frame offset per unit, capped at 40 animated units (beyond that, swap to
  a static grid and animate only the bounding box).
- **Ceiling:** per-unit stagger is O(n) frames; for n > 40 use a mask reveal instead.

### B2. One measurement, one arrow
- **Why:** the Paint Explainer grammar. Pressure, heat and distance are all expressed
  as an arrow plus a number.
- **Spec:** arrow length proportional to magnitude, capped at 40% of frame height;
  number sits at the arrow head, same colour as the arrow; red only for cost/force.
- **Acceptance:** the arrow and the number can be understood with narration muted.

### B3. Relight the same set for time passage
- **Why:** Beanie 5 s vs 80 s — same room, cold light, candle.
- **Spec:** a `lighting` prop on the scene (`day` | `dusk` | `night` | `candle`) that
  swaps the background gradient, lamp glow and shadow opacity; geometry unchanged.
- **Acceptance:** two scenes with different lighting props are recognisably the same
  room in a side-by-side still.

### B4. Depleting row as a clock
- **Why:** Beanie's jug and can rows fade as supplies run out.
- **Spec:** icon row of fixed length; `filled` count drives opacity 1.0 → 0.25; the
  numeric label is the source of truth and must match `src/finance/math.ts`.
- **Ceiling:** icons are symbolic when the number exceeds the row length — label it
  ("×5,000 gal") rather than pretending the row is proportional.

### B5. Comparison pair at matched scale
- **Why:** HMW's balance scale and James Jani's dot grid both compare two magnitudes
  in one frame.
- **Spec:** two objects share a baseline and a scale function; animate the second
  object's growth against the first so the ratio is visible at a glance.
- **Acceptance:** the ratio is readable in a single still.

## P2 — polish

### C1. Section-label crossfade at chapter boundaries
- **Spec:** 10-frame crossfade, no slide, no scale. The corpus never animates labels
  beyond appearing.

### C2. Camera push-in on a number
- **Spec:** 1.0 → 1.06 scale over 20 frames, ease-out, ending on hold. Use at most
  twice per video; the corpus shows no evidence of frequent camera moves.

### C3. Anticipation before an object enters
- **Spec:** 3–4 frames of counter-motion on the object being pushed/pulled, then the
  travel, then 3 frames of settle. Applies to doors, drawers, hands on props.

## What this library deliberately excludes

- Per-shot bespoke illustration (Kurzgesagt tier).
- Facial acting beyond the existing expression set — the corpus's best characters use
  dot eyes and one mouth line.
- Motion blur, particles, camera shake — none were observable in the sampled corpus,
  and the repo's `AGENTS.md` already bans particle clutter.
- Walk cycles for their own sake. Beanie and Paint Explainer almost never show a walk;
  the figure is placed, not travelled.

## Verification

Each pattern lands with one runnable check:
- A1, A4, B2: still-frame assertions in the storyboard packet review (shadow present,
  label/object pairing, arrow/number colour match).
- A3: hold-length assertion against the compiled cue durations.
- B4: `src/finance/math.ts` totals vs rendered label text.
- A2: `npm run movement:stills -- --debug` scrub, no single-frame teleport.
