# Typography and text motion

Every claim below comes from a still frame in `../evidence/frames/`. Entry and
exit animations are **not observable** from stills — this document reports what text
exists, what it does, and how long it plausibly stays (inferred from the gap between
sampled timestamps), and refuses to describe kinetic behaviour it did not see.

## 1. Text inventory, by function

| Function | Example | Channel / time | Behaviour inferred from samples |
|---|---|---|---|
| Section label, persistent | "MERCURY", "VENUS", "SATURN" centred top | Paint Explainer, every sampled frame | Present for the whole planet section (≥60 s between samples) — a chapter marker, not a sentence |
| State counter | "SUPPLIES · DAY 9" / "· DAY 30" | Beanie Survives, 140 s and 480 s | Repeats as a card, not an overlay; days advance across the video |
| Inventory readout | "Water 35 gal", "Food, rationed 16 days", jug/can icon rows with faded entries | Beanie 45 s, 140 s, 480 s | Full-screen card; icons deplete between visits |
| Measurement annotation | "about 92 bar", "1 bar", "deepest point", "center" | Paint Explainer 90–470 s | Attached to a diagram element, small, never a headline |
| Force label | "pressure" above red arrows | Paint Explainer 20 s, 150 s, 470 s | Attached to the arrow, same red |
| Equation / definition card | "MONEY = SALARY FROM A JOB" | James Jani 300 s | Full-frame, alone on the yellow field |
| Quoted source card | Fortune headline box over b-roll | How Money Works 4 s | Borrowed credibility, sits above live action |
| Choice buttons | "RIGHT" (green) / "WRONG" (red) | How Money Works 75 s | Diegetic UI inside a staged scene |
| Chapter card | "REASON #4" + claim | How Money Works 660 s | Full-frame, one per reason |
| Lower third | CBC name/role/location | How Money Works 480 s | Live-action interview furniture |
| Credits | animator names over dimmed scene | Alan Becker 445 s | End card only |

**Absent from every sampled frame:** subtitle captions burned into the picture,
animated word-by-word narration text, floating keyword stacks, and "subscribe"
overlays. The corpus's text is labels, measurements and chapter cards — never a
transcript of the voiceover.

## 2. What each channel's text is *for*

- **Paint Explainer** uses text as **units**: bar, gallons, degrees, "deepest point".
  Remove the text and the diagram loses its number, not its meaning. This is the
  cheapest and most transferable pattern.
- **Beanie Survives** uses text as **state**: day number, remaining water, remaining
  food. The card is a mini-dashboard; the story is the delta between two visits.
- **James Jani** uses text as **definition**: one equation per idea, held on a flat
  colour field. High contrast, no decoration.
- **How Money Works** uses text as **evidence and structure**: quoted headlines,
  expert lower-thirds, "REASON #4" chapter cards. This is journalistic furniture and
  is not reproducible without the underlying footage.
- **Alan Becker** uses no text at all in the sampled episode until the credits.

## 3. Typography rules implied by the evidence

Observed properties (not preferences):

1. **Uppercase for labels and chapter cards**, sentence case for measurement text.
2. **One typeface per channel**, sans-serif, no display face anywhere in the corpus.
3. **Text never overlaps a face.** In Odd1sOut, Paint Explainer and Beanie, the
   figure and the label occupy separate zones; the label sits at the frame edge or
   above the subject.
4. **Colour carries meaning**: red only for force/danger, yellow/gold for money in
   the finance set, white on dark for neutral statements.
5. **Numbers are the largest text on screen when a number matters** ("about 92 bar",
   "SUPPLIES · DAY 30", "MONEY = SALARY FROM A JOB").
6. **Text is small relative to the frame** in the explainer tier — labels occupy
   roughly 5–15% of frame width, not a banner across the middle.

## 4. What this project should do (and not do)

Adopt:

- A persistent **section label** in a fixed corner, driven by scene props (planet
  name → "REASON #4" → chapter title). One element, one position, never animated
  beyond a simple fade.
- A **measurement annotation** attached to the diagram element it describes, in the
  same colour as that element. This is what makes a chart self-explanatory without
  narration repeating the number.
- A **state card** when the story tracks a quantity over time: amount, remaining,
  delta, with an icon row that visibly depletes. Beanie's card is the model; note its
  flaw (5,000 gal drawn with the same nine jugs) and keep ours proportional or
  explicitly symbolic.
- **Definition cards** for the one or two equations a finance video needs.

Do not adopt:

- Burned-in subtitles (the repo already forbids them by default in `AGENTS.md`).
- Word-by-word kinetic typography. Nothing in the corpus uses it; it would fight the
  calm register of the brand.
- Chapter cards over blurred plates (How Money Works) — that channel's card works
  because it interrupts live-action footage. On a flat illustrated background the
  same device reads as a slide.

## 5. Verification for anything built from this

A future typography component is acceptable only if: label position is fixed across
scenes, no label overlaps a face or hand at 1080p, every number shown matches
`src/finance/math.ts`, and the text is legible at 0.5-scale preview.
