# Storyboard playbook

**Current guidance · 2026-11-16 · Phase 6.** Follow the [visual style guide](../../references/VISUAL_STYLE_GUIDE.md), [teaching guide](../../references/TEACHING_STYLE_GUIDE.md) and [media-sourcing standards](../../references/MEDIA_SOURCING.md). Select shots from the narration and learning goal, not character poses, sentence count or the presence of a number.

## Select a treatment by purpose

| Viewer need | Possible treatment | Review condition |
|---|---|---|
| Recognize an everyday situation | Relevant licensed footage/photo or original object staging | Context is relevant and does not falsely identify a fictional person or event. |
| Understand a hidden mechanism | Original process diagram or animated mock interface | Steps are supported, simplification is clear and interfaces are labeled when necessary. |
| Examine actual evidence | Authentic permitted document, chart, screenshot or excerpt | Verify source, context, rights and readable attribution; preserve material qualifications. |
| Connect several artifacts | Editorial collage with one dominant idea | Establish hierarchy and provenance; do not fabricate an apparently authentic composite. |
| Understand a constraint or comparison | Object metaphor, calendar or comparable before/after states | Disclose assumptions and tradeoffs; quantities/scales are honest if shown. |
| Feel an ordinary consequence | A relevant detail, quiet hold or contextual shot | No exaggerated disaster, forced reaction or motion quota. |

Sam and Alex may remain fictional narrative names without recurring animation. Licensed people can appear without animated counterparts. Character acting is a legacy/explicitly selected treatment, not a mandatory way to show a decision. A real close-up or over-the-shoulder shot is not prohibited because an old rig lacked geometry; any new code capability remains a separately scoped implementation.

## Required beat record

Use the [nine-field framework](../../references/VISUAL_STYLE_GUIDE.md#6-shot-selection-framework) for every beat: narration/story moment, learning need, visual purpose, recommended medium, primary subject, animation/camera action, required assets, source/license requirements and expected takeaway. Carry beat/cue IDs and any provisional duration separately. One beat may use several purposeful shots, or continue an existing shot.

Keep one dominant idea; supporting objects may coexist. Preserve object identity, dates and states across cuts. Keep labels attached to their meaning, with readable hierarchy and no text crossing faces. Negative space can support comprehension without an arriving icon. Select meaningful visual variety; no mandatory rotation of scene families, exact object count or first-minute comparison.

## Example: BNPL schedule beat

A calendar showing several fictional purchase schedules explains shared future commitments more clearly than a generic worried character. Establish one schedule, add another and hold the overlapping weeks. Keep the full obligation understandable without a mandatory total or formula. Record assumptions and factual support separately from asset rights. Optional repair footage can supply context later; it is not evidence about an actual BNPL customer.

## Review gate for a future packet

- [ ] Every beat has the nine fields and a specific learning purpose; the viewer takeaway follows from the image and narration.
- [ ] Medium choice is justified. Footage, photos, collages and evidence are allowed when source/rights checks pass; unverified media remains a labeled planning placeholder.
- [ ] Authentic material and illustrative/recreated material are distinguishable at the point of possible confusion.
- [ ] Figures are sourced or explicitly hypothetical; modeled totals are derived correctly. No numerical reveal is required.
- [ ] Text is selective, readable on mobile and clear of important subjects; dates, chronology and state transitions agree.
- [ ] Pacing follows comprehension and measured narration. Estimates are not aligned cues; human creative/listening approval is separate.

The existing `storyboard:design` 67-scene/99-panel workflow is episode-001 tooling, not a general mixed-media storyboard generator. This phase changes documentation only; do not change episode schemas or claim the new nine-field convention is renderer-enforced.

Evidence: [storyboard patterns](../channels/storyboard-patterns.md), [cinematography analysis](../channels/cinematography-composition.md). Their sampled frames inform options, not universal rules.

## Historical playbook — superseded recommendations

The original below is retained verbatim. Its allowed-type bans, number-first decisions, character defaults and quotas are **not active documentary instructions**. Original observations and source references remain historical evidence.

<details>
<summary>Original storyboard playbook — historical, not production instructions</summary>

# Storyboard playbook

Converts the observed scene grammar into decisions for this repo's storyboard
packets (`npm run storyboard:design` → 67 scenes / 99 panels). Evidence:
`../channels/storyboard-patterns.md`.

## 1. The nine scene types, and which ones we are allowed to use

| # | Type | Reference | Allowed here | Cost |
|---|---|---|---|---|
| 1 | Diagram + label | Paint Explainer | **Yes — default** | Low |
| 2 | Character in environment | Beanie, Odd1sOut | **Yes** | Medium |
| 3 | State card (amounts, deltas) | Beanie | **Yes** | Low |
| 4 | Section label | Paint Explainer | **Yes** | Trivial |
| 5 | Visual metaphor (two objects compared) | HMW balance scale | **Yes**, one per video | Medium (prop design) |
| 6 | Definition card | James Jani | **Yes**, max two per video | Trivial |
| 7 | Wide establishing | Kurzgesagt, Beanie | **Yes**, openers and time jumps | Medium |
| 8 | Borrowed artefact (news, chart screenshot, interview) | HMW | **No** — licensing | — |
| 9 | Extreme close-up of a rendered face | Kurzgesagt | **No** — needs art we don't have | — |

## 2. Decision order for any beat

1. **Is there a number?** → Diagram + label (#1) or state card (#3). The number goes
   on screen as an annotation in the same colour as the object it describes.
2. **Is there a comparison?** → Visual metaphor (#5) if the two things can be drawn
   at the same scale, otherwise two diagrams side by side.
3. **Is a person making a decision?** → Character in environment (#2), medium shot,
   figure ~1/3 of frame height, contact shadow.
4. **Is this a new section?** → Section label (#4) on the first frame of the section
   and nowhere else. Never repeat it mid-section.
5. **Is this an abstract statement with no object?** → Definition card (#6). If a
   script has more than two of these, the script is under-visualised.

## 3. Rules that came from the corpus

- **One idea per scene.** No sampled frame in any channel carries two competing
  messages. If a beat has two claims, it is two scenes.
- **Label position is fixed.** Paint Explainer's planet name is top-centre in every
  shot for eight minutes. Pick one corner for section labels and one for measurements
  and never move them.
- **The figure is a stand-in, not an actor.** In the explainer tier the character
  exists to be affected by the thing being explained (burned, crushed, priced out).
  Pose it against the object; do not choreograph it.
- **Reuse the set before drawing a new one.** Beanie's two-visit kitchen (250 s, 350 s)
  is the model: same geometry, different light, tighter framing. In this repo that is
  a lighting/framing variant of an existing scene template, not new art.
- **Empty space must be doing something** — isolating a small subject, or holding a
  zone where a label or arrow will arrive.
- **No text over faces.** Observed in every channel; already a repo rule.

## 4. Narration-to-visual mapping table (fill this per scene)

The packet already carries panel stills and narration; add these two columns so the
mapping is reviewable:

| Time | Narration cue ID | Spoken idea | Scene type (#) | Object on screen | Label / number | Purpose |
|---|---|---|---|---|---|---|

Purpose vocabulary, taken from what the corpus actually does: *name the thing*,
*show the mechanism*, *give the number*, *show the consequence*, *compare two
amounts*, *mark a section*, *pay off the hook*.

## 5. Anti-patterns this corpus demonstrates

| Anti-pattern | Where it happens | Why it fails |
|---|---|---|
| New bespoke background per beat | Kurzgesagt | Unaffordable outside a studio; also makes the viewer work to re-orient |
| Card layout reused at a different scale | Beanie's 5,000-gal card drawn with nine jugs | Breaks the card's own logic — ours must be proportional or labelled symbolic |
| Borrowed screenshots as filler | HMW | Needs licensed assets; a clone cannot reproduce them and they date instantly |
| Text banner across the middle of frame | (not observed in the corpus) | The corpus keeps text at edges or above subjects |
| Two messages in one frame | (not observed) | Every sampled frame is single-purpose |
| Repeating the section label mid-section | (not observed) | Paint holds one label per section for 60–90 s |

## 6. Review gate

A storyboard packet is ready to animate when:

- [ ] Every scene has a type number from §1, and none is type 8 or 9.
- [ ] Every number shown traces to `src/finance/math.ts` or `sources.md`.
- [ ] Section labels appear once per section, in the same position each time.
- [ ] No two consecutive scenes share the same composition family for more than 3
      panels (the existing `visual-variety-audit.md` rule, unchanged).
- [ ] Each beat has exactly one object doing the explanatory work.
- [ ] At least one comparison or scale reveal exists in the first 60 s.

</details>
