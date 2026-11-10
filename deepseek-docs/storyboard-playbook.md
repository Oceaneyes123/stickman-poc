# Storyboard playbook

Converts the observed scene grammar into decisions for this repo's storyboard
packets (`npm run storyboard:design` → 67 scenes / 99 panels). Evidence:
`deepseek-research/youtube-channels/storyboard-patterns.md`.

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
