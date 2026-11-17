# Motion graphics library

**Current guidance · 2026-11-16 · Phase 6.** This is a creative pattern catalog, not an implementation inventory or build backlog. The [visual guide](../../references/VISUAL_STYLE_GUIDE.md) owns treatment standards; [teaching](../../references/TEACHING_STYLE_GUIDE.md) owns explanatory depth and [media sourcing](../../references/MEDIA_SOURCING.md) owns third-party provenance.

## Select graphics that explain

| Pattern | Use when | Meaningful change and review |
|---|---|---|
| Product/checkout mockup | A purchase decision or offer needs examination | Keep the product unchanged while the choice/terms change. Label illustration; show relevant full obligations. |
| Payment/banking process | A hidden step or status explains an outcome | Establish entities, then the supported relationship. Do not invent vanished money, deadlines or provider behavior. |
| Receipts, bills and calendars | Obligations or chronology matter | Keep dates/state/identity coherent. Separate schedules can share weeks without a sum or formula beat. |
| State card or before/after pair | A changed condition needs comparison | Hold relevant assumptions constant. A state can be qualitative; not every card needs a number. |
| Cause/flow arrow | Direction or dependency is otherwise unclear | State what the connection means. Quantitative length requires a supported scale; a process arrow need not encode magnitude. |
| Diagram with annotation | An object or relationship needs explanation | Use one dominant idea with necessary supporting elements. A brief legend is allowed if it helps rather than overcomplicates. |
| Selective type/section label | Naming a concept or locating a section genuinely helps | Short text and readable holds; no transcript coverage, fixed card quota or compulsory persistent label. |
| Sourced chart | A data relationship is central to the question | Verify data, scope, units and honest axes; redraw with factual attribution or clear reproduction rights for an authentic excerpt. |
| Editorial collage | The relationship between artifacts is the explanation | Preserve provenance/context and guide attention; never manufacture documentary evidence. |

An amount counter, scale reveal or quantitative comparison is optional. Numbers must be accurate and supported, but every spoken number need not appear on screen and every visible figure need not be repeated aloud. Keep the narration and graphic consistent where they address the same value. Use plain states when rolling digits add no understanding.

## Reuse versus proposed work

| Existing owning source | Confirmed reusable starting point | Limit |
|---|---|---|
| [Typography](../../src/typography/README.md) | `AnimatedNumber`, `ComparisonReveal`, `ObjectAttachedLabel`, `SectionHeading` and text-motion styles | Choose by purpose and review real wrapping/timing; a catalog is not a requirement to use effects. |
| [Object motion](../../src/objects/README.md) | Draw-on, card transforms, chain reaction, conveyor flow and other frame-driven patterns | Demo shapes need appropriate art; character interaction remains a character-specific example. |
| [Transitions](../../src/transitions/README.md) | Cuts, state swaps, reveals and camera joins | A camera mechanism does not create the content relationship that justifies a move. |
| [Episode 002 plan](../../src/storyboard/buyNowPlan.ts) and [film](../../src/storyboard/BuyNowFilm.tsx) | Episode-specific checkout/calendar/notification stages and compiled frame-driven text/audio integration | Not a general documentary compositor or verified real-provider interface. |

General chart systems, document-excerpt components, collage templates or a shared mock-interface toolkit described here are **proposed treatments**, not claims of existing reusable implementations. Check owning source and callers before future implementation. No speculative build order or new dependency is authorized by this catalog.

## Accuracy, timing and evidence

Derive modeled calculations through [finance math](../../src/finance/math.ts). Factual data retains its own episode source/claim IDs and qualifications; it need not be converted to a fictional budget. Visual counts must be proportional or explicitly symbolic. Authentic chart/document screenshots require both factual verification and a recorded media-use basis.

Timing values in the historical contracts are starting proposals, not measured competitor timings or universal holds. Use compiled cue/event frames against measured narration, then inspect readable settled states and transitions. Never stretch speech to fit an animation. Permit static holds and clean cuts; do not use particle clutter, glowing UI or idle motion to fill time.

Future review checks the exact final value/state, source support, unit/period, layout, label relationship and comprehension at phone size. Technical checks cannot prove authenticity, source permission or human understanding. [Quality review](quality-checklist.md) keeps those gates distinct.

Retained evidence: [typography analysis](../channels/typography-motion.md), [storyboard patterns](../channels/storyboard-patterns.md), [cross-channel comparison](../channels/cross-channel-comparison.md). Their old feasibility recommendations are not a ban on verified mixed media.

## Historical contracts — superseded recommendations

The original below is retained verbatim. Its prescribed timing/frequency limits, outside-chart exclusion and implied build order are **not active requirements or evidence of shipped components**.

<details>
<summary>Original motion-graphics contracts — historical, not production instructions</summary>

# Motion graphics library

The finance-specific graphics the corpus actually uses, specified for a Remotion +
SVG pipeline. Everything here is a component contract, not a sketch: what it shows,
what it must not show, and how it is verified.

Evidence for each pattern is in `../channels/` —
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

</details>
