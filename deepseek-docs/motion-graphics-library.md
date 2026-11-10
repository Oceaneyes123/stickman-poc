# Motion graphics library

The finance-specific graphics the corpus actually uses, specified for a Remotion +
SVG pipeline. Everything here is a component contract, not a sketch: what it shows,
what it must not show, and how it is verified.

Evidence for each pattern is in `deepseek-research/youtube-channels/` —
`typography-motion.md` (text), `storyboard-patterns.md` (narration mapping),
`cross-channel-comparison.md` (which channel does what).

## 1. Number counter

**Evidence:** James Jani's "$1,000,000 → 1 billion" scale sequence; HMW's restated
figures; Beanie's supply cards.

**Shows:** one amount changing, with the unit always visible.

| Property | Spec |
|---|---|
| Value source | `src/finance/math.ts` only — never a literal in the component |
| Formatting | `$1,234` grouped, no decimals unless the source has cents |
| Roll duration | 20–30 frames for a changed amount; instant (0 frames) when the number is a label |
| Hold | ≥45 frames after the roll completes |
| Prohibited | rolling a number that the narration does not also say |

**Acceptance:** rendered text equals the computed value for every fixture in
`tests/`; no frame shows a partially formatted number (e.g. `$1,2`).

## 2. Comparison pair

**Evidence:** HMW's balance scale (man vs house); James Jani's dot grid.

**Shows:** two magnitudes at a shared baseline and shared scale.

| Property | Spec |
|---|---|
| Scale function | one `scale(value)` used by both objects |
| Growth | second object animates from 0 to its value over 25–40 frames |
| Labels | one label per object, same position, same colour as its object |
| Prohibited | two different y-scales in one frame |

**Acceptance:** the ratio is readable from a single still with the audio off.

## 3. Flow / cause arrow

**Evidence:** Paint Explainer's red pressure arrows; the general "this causes that"
device across the explainer tier.

**Shows:** direction and magnitude of a force, cost or transfer.

| Property | Spec |
|---|---|
| Length | proportional to magnitude, capped at 40% frame height |
| Colour | coral (cost/loss) or teal (alternative) per `AGENTS.md`; never decorative |
| Head | fixed size regardless of length, so short arrows stay readable |
| Label | at the head, same colour, ≤4 words |

**Acceptance:** arrow + label understandable with narration muted.

## 4. State card (amounts over time)

**Evidence:** Beanie's "SUPPLIES · DAY 9 / DAY 30" cards with depleting icon rows.

**Shows:** a quantity, what remains, and the delta since last seen.

| Property | Spec |
|---|---|
| Layout | title row (state label), value row, icon row, delta row |
| Icon row | fixed length; `filled` count → opacity 1.0/0.25 |
| Delta | explicit ("+3 gallons of rain", "−10 gal"), never implied |
| Reuse | identical layout every time; only values and label change |
| Prohibited | symbolic rows that look proportional (Beanie's 5,000-gal flaw) — if the number exceeds the row, say "×5,000 gal" |

**Acceptance:** two cards from different points in the video differ only in values,
label and filled counts.

## 5. Diagram with annotation

**Evidence:** Paint Explainer's planet + atmosphere halo + "atmosphere" label +
thermometer; the Saturn cutaway with a "center" dashed line.

**Shows:** one object, one property of that object, one measurement.

| Property | Spec |
|---|---|
| Objects per diagram | exactly one primary object |
| Annotations | ≤3, each attached to a specific part |
| Cutaway | a mask on the object, not a second drawing |
| Prohibited | a diagram that needs a legend |

**Acceptance:** a viewer can name the object and the measurement after a 2-second look.

## 6. Definition card

**Evidence:** James Jani's "MONEY = SALARY FROM A JOB" on a flat field.

**Shows:** one equation or definition, alone.

| Property | Spec |
|---|---|
| Background | flat brand navy or paper white — no gradient, no texture |
| Content | one line, ≤12 words, uppercase for the term only |
| Duration | ≥60 frames |
| Frequency | max 2 per video |

**Acceptance:** no other element on screen while it holds.

## 7. Section label

**Evidence:** Paint Explainer's persistent planet name; HMW's "REASON #4".

**Shows:** which section the viewer is in.

| Property | Spec |
|---|---|
| Position | fixed corner (top-centre or top-left), never moves between sections |
| Entry | 10-frame crossfade, no slide/scale |
| Lifetime | the whole section; removed only at the next section |
| Prohibited | repeating the same label mid-section; animating it per beat |

**Acceptance:** a contact sheet of a whole section shows the label in the same pixel
position in every panel.

## 8. What is not in this library

- Charts imported from outside (HMW screenshots a real chart; we must draw from our
  own numbers or not show it).
- Debt/expense "explosion" or particle effects — no corpus evidence, and `AGENTS.md`
  bans particle clutter.
- Anything that renders a number not derived from `src/finance/math.ts`.

## 9. Build order (cheapest value first)

1. Section label (#7) — trivial, highest reuse.
2. Diagram + annotation (#5) — the default scene for a finance explainer.
3. Number counter (#1) + comparison pair (#2).
4. State card (#4) — only when a script tracks an amount over time.
5. Flow arrow (#3), definition card (#6).

Each ships with the acceptance check above and one fixture in `tests/`.
