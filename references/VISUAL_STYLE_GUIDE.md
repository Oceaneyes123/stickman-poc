# The Money Trap — Visual Style Guide

**Version 1 · 2026-11-16 · Phase 2: documentation only.**

This is the primary creative authority for future visual production under the **Premium Editorial Finance Documentary** identity. Read it with [channel branding](CHANNEL-BRANDING.md). Narration tells the story; visuals help the viewer understand a situation, mechanism or consequence. The viewer should understand the concept even if they remember none of the numbers.

This guide supersedes older character-first creative recommendations for new documentary briefs. It does not change existing episodes, their approvals, assets or historical decisions. Sam and Alex may be fictional examples without animated counterparts; real people may appear in properly licensed media. Do not imply that an identifiable stock-footage subject is an actual customer or the subject of a fictional story.

The updated [global production rules](../AGENTS.md) preserve the technical contract: local Remotion + React + strict TypeScript, matched package versions, deterministic frame-driven motion, bundled render-time assets, local tools and no paid APIs or cloud jobs. Delivery remains 1920×1080, 30 fps, H.264/yuv420p; development previews use 0.5 scale. No new component, media pipeline or episode render is implemented by this document.

## 1. Editorial motion graphics

Start with the learning goal, then choose the graphic. Every shot must explain a concept, demonstrate a process, establish context or reinforce a meaningful story moment. State that purpose in the storyboard before choosing an effect.

Reveal the relevant state, show what changes, and hold the result long enough to understand it. Use motion to connect cause and effect, direct attention or expose a relationship. If a still communicates the idea completely, it can remain still. Do not add idle motion to keep the screen busy.

| Treatment | Use it to | Design and accuracy standard |
|---|---|---|
| Animated product mockup | Connect a purchase to its offer or payment choice | Keep the product recognizable and unchanged when only its financing changes. A camera orbit or glossy surface is optional, not the explanation. |
| Banking/payment interface | Show a choice, status or movement between accounts | Use only the controls and states needed for the mechanism. Clearly identify illustrative interfaces; verify real product behavior before depicting it. Do not imply money vanished because a status changed. |
| Receipts, bills, cards, calendars and documents | Make an obligation, deadline or sequence tangible | Keep the same obligation identifiable across shots. Preserve relevant dates, units and qualifications. Distinguish price, payment, balance and amount due; show only necessary fields. |
| Finance concept diagram | Make an otherwise hidden relationship visible | Establish the entities before their connections. An arrow must mean a defined transfer, dependency or direction; do not imply a proportional magnitude unless the scale supports it. |
| Process/cause-and-effect animation | Explain how one event changes the next | Show the trigger, affected state and consequence in order. Preserve relevant intermediaries and exceptions. Label a simplified model when it could be mistaken for a complete system. |
| Chart | Explain a sourced trend, distribution or relationship | Use a chart only when the relationship needs one. Identify source, period, units, scope and meaningful uncertainty. Preserve honest scales and comparable baselines. Do not animate invented intermediate data. |
| Animated comparison | Isolate a meaningful difference | Keep starting assumptions, time period and scale comparable; label any material difference. Show the tradeoff of an alternative. Two states can explain a change without a narrated calculation. |
| Object-based metaphor | Make an abstract constraint intuitive | Define the mapping through context: dated cards can stand for obligations occupying future weeks. Do not let symbolism imply literal banking mechanics, debt, fees or losses that were not modeled. |
| Selective kinetic typography | Name a concept, emphasize a meaningful phrase or mark a section | Use short text with a clear hierarchy. Give it time to read and let it leave when its purpose ends. No routine word-by-word transcription, caption wall or new text on every sentence. |

Numbers must be correct even when arithmetic stays off screen. Derive illustrative calculations through [finance math](../src/finance/math.ts); keep factual figures traceable to episode sources. Retain units/time periods and keep invented scenario assumptions in production records: under [decision #14](../docs/decisions.md#14-presenting-fictional-scenarios--2026-11-16), present generic invented scenarios and interfaces naturally without on-screen "fictional," "illustrative," "hypothetical" or "demo" badges, while retaining visible source credits and scope qualifiers for cited research and authentic excerpts. "Remaining" is not automatically savings or a complete budget. A sourced chart is not required to use the fictional budget model.

Reuse the existing [typography](../src/typography/README.md), [object motion](../src/objects/README.md), [transitions](../src/transitions/README.md) and timeline tooling where they clarify a change, before defaulting to static states and `hard-cut` joins. Specifically:
- Use `ComparisonReveal` for side-by-side delivered totals or before/after amounts.
- Use `ObjectAttachedLabel` when a label tracks a product, bracket or moving cutoff marker.
- Use `GrowBuild` or `SplitAssemble` for threshold fills, indivisible add-on overshoot or stacked obligations, with proportional geometry derived from `src/finance/math.ts` so the viewer sees the physical overhang or difference rather than a words-only "Higher order total" label.
- Use `ConveyorFlow` or `ChainReaction` for fulfillment, cost handoffs or multi-step system sequences.
- Use `SectionHeading` paired with a board-tone shift or structural transition (`wipe`, `push-in`, `pull-back`, `split-open`, `match-position`) when perspective changes materially (for example, moving from the shopper's cart to a merchant's back-office ledger).

Camera joins and object transformations may already supply the needed motion. Gallery availability is not a requirement to use an effect. If a future task needs a new component, implement and review it under the project rules then; these treatment descriptions are not claims of reusable components already built.

## 2. Mixed-media documentary visuals

**70% motion graphics / 30% footage is an initial creative direction, not a mandatory ratio.** It is not a shot-count, runtime or production acceptance target. Use more or less footage according to the story; a wholly graphic sequence or a sustained documentary excerpt may be appropriate. Do not add media to meet a quota.

| Medium | Prefer it when | Conditions and limits |
|---|---|---|
| Licensed real-world footage | Place, ordinary activity or a human consequence needs real context | Select a relevant action and setting. Verify permissions for the intended use. Generic checkout footage establishes context; it does not prove a particular person's experience or a product's behavior. |
| Photography | A specific person, place, object or moment needs time for examination | A still may hold. Crop or move only to reveal relevant information; avoid automatic slow zooms. Verify source, permission and identity/context before making factual associations. |
| Original SVG illustration | An object, relationship or metaphor benefits from exact control | Keep silhouettes readable and styling coherent. Do not default to character acting. Preserve distinctions between symbolic objects and quantitative representations. |
| Editorial collage | Several artifacts need to be compared or connected | Give one element priority at a time. Preserve excerpt meaning, dates and provenance. Do not create a composite that looks like a real document or implies an unsupported association. |
| Document excerpt | Wording, a disclosed term or an authentic record is itself evidence | Verify authenticity, relevant context and permission/legal basis before inclusion. Show the source/date and legible relevant passage; retain qualifications. Redact private data and disclose editorial redactions. |
| Animated mock interface | The viewer needs a simplified decision or system demonstration | Mark it “Illustrative interface” or “Recreated example” when authenticity could be confused. Never use it as proof of real provider conduct. Real logos or recognizable branding require separate review. |
| Map/location graphic | Geography, jurisdiction or distance changes the explanation | Use a map only for a spatial question. Verify place names, boundaries, relevant dates and data; track basemap permissions. Decorative travel paths do not establish financial flows. |
| Source-backed chart/visual evidence | A factual relationship cannot be explained adequately through a scenario alone | Retain source support, definitions, scope and scale. Original redraws still require factual attribution; screenshots additionally require media-use review. |

Choose footage for lived context, an original graphic for a hidden mechanism, and an authentic artifact when the claim depends on the artifact. Combining them should clarify the relationship. For example, a brief shopping context shot can lead into a controlled checkout mockup, then a calendar demonstration. An unrelated skyline cannot explain a payment schedule.

Before placing third-party media, record its source, creator, intended use, license/permission evidence, required attribution and verification date in the episode's asset notes. Keep factual claim IDs separate from asset permission records: a fact source does not automatically clear its images. Unverified media remains a placeholder in planning and must not enter a delivery render. Follow the [media-sourcing standards and manual manifest format](MEDIA_SOURCING.md); no automated rights-checking pipeline is claimed.

Freeze approved assets locally before rendering. Do not load remote media at render time. Neither AI-generated media nor reenactments can serve as authentic documentary evidence; identify their illustrative role and review applicable disclosure requirements before use. Do not assume a medium or style guarantees monetization.

## 3. Visual hierarchy and composition

### Dominant idea and depth

Give each shot one dominant visual idea. Supporting details may coexist if they explain that idea; “one idea” does not mean exactly one physical object. Reveal competing claims in sequence.

Separate foreground, subject and background through placement, scale, occlusion, contrast and, where useful, restrained focus or lighting. A foreground element should orient or frame the subject rather than hide labels. Depth is optional; a flat diagram can be the clearest treatment. Documentary shots do not require a room, floor or character.

Use negative space to isolate a subject, support reading or reserve room for the next meaningful reveal. A quiet composition does not require an icon or texture to fill it. Each episode chooses settings, materials and supporting colors suited to its subject while keeping the channel's graphic language recognizable.

### Typography, labels and readability

- Use locally bundled Inter. Establish a primary subject or headline, secondary explanatory labels and a quieter source/context line. Do not give every element headline weight.
- Keep labels close to what they describe, with a stable relationship during movement. Prevent collisions, awkward wrapping, cropped hands/objects and labels crossing faces.
- Under [decision #15](../docs/decisions.md#15-minimal-on-screen-text--2026-11-18), keep on-screen text minimal: show only essential state changes, comparison/threshold markers or required source credits. Do not caption recognizable objects, repeat spoken sentences in boxes or stack multiple text banners in the same frame.
- Use short phrasing rather than shrinking text to fit. If a document excerpt needs extensive reading, isolate the relevant passage or split the shot.
- Keep essential graphic content at least 96 px from the side edges at 1920×1080. Background imagery may reach the frame edge. Check top/bottom clearance against the actual composition and player overlays.
- Use readable foreground/background contrast; place text on a solid light or dark board when the image underneath changes. An outline or glow is not a substitute for a legible background.
- Pair color with wording, shape or position so meaning does not depend on color alone. Do not assume white text is readable on yellow or teal.
- Inspect at 0.5 scale and at a phone-sized view. The key action, labels and necessary source/context information must remain readable; tiny footnotes cannot repair a misleading headline.

### Color meaning

| Color | Hex | Graphic role |
|---|---|---|
| Navy | `#14243A` | Brand base and structure |
| White | `#F8FAFC` | Clarity and negative space |
| Yellow | `#F3BE58` | Money/value and relevant financial emphasis |
| Coral | `#FF6B6B` | Costs, losses, obligations or warnings |
| Teal | `#39B8B6` | An alternative or considered option |

Use these meanings consistently in original graphics. Natural footage/photo colors need not be replaced by the palette. Supporting tones and episode lighting may vary without assigning conflicting meanings to key accents. Teal alone cannot certify safety or a better outcome; coral does not establish wrongdoing.

### Camera, continuity and transitions

Camera movement must reveal context, follow a relevant action or emphasize a discovery. Declare its destination and purpose before animating it. Keep moves brief and restrained; stop when the information is visible. A static frame is valid. Avoid perpetual pushes, automatic photo parallax, camera shake and decorative orbits.

Maintain object identity, state, scale relationships and chronology across cuts. A bill that has been paid must not reappear as unpaid without explanation. Keep dates consistent between interfaces, calendars and narration. When moving between footage and graphics, carry a relevant object, action, color or composition across the cut; do not imply two unrelated shots document the same event.

Default to a clean cut at a meaningful idea boundary. Use a match cut for a real visual relationship, a wipe to expose related information, or a dissolve when time/context genuinely changes. Section transitions may be quiet. A flashy join does not make unrelated footage coherent. No shot requires a transition effect or camera move.

### Documentary credibility

Distinguish documented cases, fictional scenarios, diagrams and recreations at the point where confusion could arise. Source authentic excerpts and preserve their meaning. Label hypothetical prices, terms or schedules as examples; do not present them as universal product rules. Crop/grade media without changing what it establishes. Do not invent quotes, news headlines, screenshots, customers or records to make a scene look researched.

## 4. Pacing follows the story

Do not prescribe a fixed shot length, cut interval or minimum movement count. Plan around the viewer's changing understanding, then time the action against measured narration and reviewed cue anchors.

| Story function | Pacing choice | Review question |
|---|---|---|
| Familiar situation | Establish the relevant action/context efficiently; hold if recognition needs a moment | Can the viewer recognize what is happening before the complication? |
| Escalating problem | Tighter cuts or successive reveals as distinct commitments arrive | Does each new shot add a complication rather than repeat the same warning? |
| Important mechanism | Slow down, reveal steps in order and hold the consequential state | Can the viewer explain the connection before the next idea begins? |
| Emotional consequence | Allow a quiet, ordinary detail or still hold | Is the consequence credible without dramatic embellishment? |
| Major idea change | Use a clean break, contextual shot or concise heading if needed | Is the new question or context clear without excessive signposting? |
| Payoff/callback | Return to a recognizable earlier object or situation with a meaningful changed state | Does the image resolve the opening question? |

Synchronize purposeful reveals to the phrase that makes them understandable, allowing setup and reading time where necessary. Do not expose the answer prematurely or delay a definition for artificial suspense. Not every sentence needs a new shot. Not every shot needs new text.

Use the shared [timeline compiler](../src/timeline/compiler.ts) and compiled event frames, cue IDs and documented offsets. Planning times remain provisional until measured narration and phrase review exist. Do not put guessed narration timestamps in graphics, stretch speech to fit a visual, or treat ASR/structural validation as listening approval. If an action does not fit, simplify/split the visual or revise the narration through a separately approved production pass.

### Visual progression and attention continuity

A storyboard that is factually accurate can still lose viewer attention if consecutive scenes stay static, repeat diagrams or display text-heavy citation slides. Apply these five checks without inventing numeric cut-rate quotas or fabricated drama:

1. **Confirm the premise in the opening frame and end the hook on a visual open question:** Frame 0 should establish the recognizable decision context promised by the title and thumbnail (for example, the product already staged inside its unsubmitted checkout preview) rather than holding on an isolated prop before showing the context. Close the opening beat by isolating the unresolved visual question (such as what fills an eligibility gap), not with a generic process diagram that duplicates a later mechanism beat.
2. **Sub-stage multi-paragraph shot groups:** When a single shot group spans two or more narration paragraphs (often 25–40 seconds), define distinct paragraph-anchored visual state changes (`Subshot A` for paragraph 1's action, `Subshot B` for paragraph 2's reframing or heterogeneity) rather than holding one static composition with a minor reframe.
3. **Never build a mid-video "bibliography card wall":** Refusing to invent quantitative charts must not result in consecutive flat text cards displaying only `Author, Year` and paraphrased bullet lines. Pair every research credit with a qualitative visual schematic (e.g., baskets clustering just past a cutoff line; a two-row policy matrix contrasting *Always-free vs. Cutoff* against *Lower cutoff vs. Higher cutoff*; a waived fee token dropping out of a revenue column while customer baskets respond differently) or a cleared authentic paper/figure excerpt.
4. **Reset visual texture after abstract stretches:** After several minutes of research and system diagrams, re-ground counterpoint or human-constraint beats using physical environment staging, a concrete `Now vs. Later` substitution timeline (showing a needed item shifting earlier versus an unplanned item adding consumption), or optional neutral context footage/photography with an original-art fallback.
5. **Isolate the takeaway test and hold the final bookend until the last paragraph:** When narration poses the viewer's decision test (such as evaluating an add-on as if the promotional banner were absent), visually dim or strip away the promotional interface chrome to isolate the object beside its incremental outlay bracket. In a multi-paragraph finale, keep the causal summary visually active during the penultimate paragraph and execute the quiet `callback-cut` to the opening composition only on the final paragraph so the screen does not signal an early exit.

## 5. Visual anti-patterns and practical replacements

| Before — avoid | After — purposeful treatment |
|---|---|
| Random stock clips unrelated to narration: a city skyline over an explanation of payment dates | Show the dated obligation; use a shopping-context shot only when establishing the purchase. |
| Repeated slow zooms on unrelated photos | Hold the relevant photo, or crop once to a detail the narration actually discusses. |
| Overused glowing UI, excessive gradients and unnecessary particles around a checkout button | Use hierarchy and one controlled state change so the actual choice is readable. Gradients may support a background when they serve the treatment. |
| Text appearing on every sentence | Keep the object/process visible; add only the label needed to understand the new idea. |
| Endless floating icons | Give each object a defined role and stable location; animate the relationship that changes. |
| Generic AI-generated business imagery implying an actual event | Use relevant verified footage or an explicitly illustrative original graphic. Never manufacture documentary proof. |
| Repeated identical scene templates with only the headline changed | Choose context footage, an interface insert, a calendar or an object comparison according to what each beat teaches. Reuse assets when continuity helps. |
| Pointless chart animation or a number counter for an ordinary decision | Show the decision and its consequence. Use a chart only when the data relationship matters. |
| Bankruptcy imagery, flashing red warnings or a collapsing house for a tighter month | Show the ordinary consequence supported by the scenario: a postponed repair or less flexibility. |
| Decorative arrows pointing at everything | Connect only a defined cause, transfer or sequence; remove an arrow that adds no meaning. |
| Fake documentary evidence: an invented headline or quote styled as an authentic clipping | Use a verified, permitted excerpt with attribution, or replace it with a clearly labeled scenario explanation. |
| Fabricated screenshots presented as authentic provider behavior | Label the original mockup as illustrative and verify the mechanism. Use a real screenshot only with authenticity, context and permission checks. |
| Opening on an isolated prop with no decision context, then ending the hook with a diagram repeated in a later beat | Stage the product inside its checkout/decision context from frame 0, and end the hook by isolating the unresolved visual slot or question. |
| Holding one static illustration across a two-paragraph (25–40 s) shot group | Sub-stage each paragraph with its own state change (for example, candidate filter in paragraph 1, standalone-vs-checkout evaluation split in paragraph 2). |
| Consecutive text-only bibliography cards (`Author, Year` + paraphrased text) in research sections | Pair the scoped source credit with a qualitative mechanism schematic, policy-comparison matrix or cleared authentic figure excerpt. |
| Defaulting most of an episode to `"Static/restrained state changes"` and `"hard-cut"` or using text (`"Higher order total"`) instead of derived proportional scale | Use honestly scaled blocks derived from `src/finance/math.ts` (showing threshold overhang or order differences visually) and select existing primitives (`ComparisonReveal`, `ObjectAttachedLabel`, `GrowBuild`, `ConveyorFlow`, `split-open`, `match-position`, `wipe`) where they clarify the change. |
| Settling into the final bookend hold on the penultimate paragraph | Keep the causal synthesis active during the summary paragraph and fire the `callback-cut` to the quiet opening image on the final bookend paragraph. |

These are editorial checks, not claims about algorithmic performance. A more expensive or busier image is not automatically more informative.

## 6. Shot selection framework

For every storyboard beat, answer the following before designing motion. One beat may span multiple shots; specify each treatment when its purpose or medium changes. A beat can retain an existing shot when nothing new needs showing.

| Required field | What to record |
|---|---|
| Narration or story moment | Exact excerpt or beat/cue ID; mark wording/timing provisional when unresolved. |
| What the viewer needs to understand | The single most important change in understanding. |
| Visual purpose | Explain, demonstrate, establish context or reinforce a meaningful moment; state what the image contributes. |
| Recommended medium | Choose the most informative medium and explain why it fits. |
| Primary subject | The dominant object, action, artifact, person or relationship. |
| Animation or camera action | Initial state, meaningful change, final readable state; “static hold” is valid. |
| Required assets | Identify existing reusable art, proposed new art and third-party media separately. |
| Source/license requirements | Factual claim/assumption IDs plus asset provenance, permission status and attribution needs; mark pending items. |
| Expected viewer takeaway | One plain sentence that the shot should make understandable. |

Choose in this order: learning need, visual purpose, medium, subject, composition, then motion. Do not start with “Which stickman pose?” or “Which sentence becomes text?” If the only purpose is to fill time, revise the shot. If a graphic teaches a mechanism while footage supplies context, allocate separate shots or a clear visual hierarchy rather than competing layers.

### BNPL example A — the purchase decision

| Field | Proposed treatment |
|---|---|
| Narration/story moment | “Sam bought a jacket he wasn't going to buy.” Opening situation from the [existing script](../videos/002-buy-now-pay-later/script.md); align any future treatment to the approved narration, not this example's timing. |
| Viewer needs to understand | The product stays the same while the offer changes which price receives attention. |
| Visual purpose | Demonstrate the change in the decision's framing. |
| Recommended medium | Original product illustration and labeled checkout mockup; controlled states are clearer than generic shopping footage. |
| Primary subject | One jacket and its checkout offer. |
| Animation/camera action | Establish the full price, reveal the first-payment option, and shift emphasis to that option while retaining the full obligation. Hold; no camera move required. |
| Required assets | Reuse jacket/checkout art only if suitable; an independent documentary mockup is proposed, not implemented. No third-party footage required. |
| Source/license requirements | Use episode assumption A01 for the hypothetical $240/four-$60 example and check derived values through finance math. Verify the relevant claim support in [sources.md](../videos/002-buy-now-pay-later/sources.md); label the interface illustrative. Original art needs provenance, not a stock license. |
| Expected takeaway | A smaller first payment can change the choice without lowering the full price. |

### BNPL example B — separate schedules, one month

| Field | Proposed treatment |
|---|---|
| Narration/story moment | Several individually manageable purchase schedules occupy the same future weeks. This is a proposed documentary treatment of the existing story, not a new claim about all providers. |
| Viewer needs to understand | Obligations from separate decisions compete for the same future flexibility. |
| Visual purpose | Explain the relationship between individual schedules and shared time. |
| Recommended medium | Original calendar/process illustration; a real calendar shot would obscure the controlled comparison. |
| Primary subject | Dated obligation cards from distinct purchases on one calendar. |
| Animation/camera action | Introduce one schedule, then add the others while keeping dates stable. Reveal the shared weeks and hold. Avoid a mandatory sum, chart or formula. |
| Required assets | Calendar and purchase cards, adapted from existing art if suitable. Dates beyond approved episode material remain explicit hypothetical planning assumptions. |
| Source/license requirements | Check source-ledger support for repayment structure; record any new scheduling assumptions. No authentic account screenshot is implied. Avoid suggesting every provider lacks an aggregate view. |
| Expected takeaway | Separate purchase decisions can reserve room in the same future month. |

### BNPL example C — an ordinary consequence

| Field | Proposed treatment |
|---|---|
| Narration/story moment | The fictional car repair arrives while earlier payments already have dates. |
| Viewer needs to understand | A routine expense can be harder to accommodate when future income is committed. |
| Visual purpose | Establish lived context, then reinforce the timing constraint. |
| Recommended medium | A brief licensed repair-context shot followed by an original illustrative repair estimate and the established calendar. Footage shows the ordinary situation; graphics explain the constraint. |
| Primary subject | A routine repair estimate, then the competing obligations. |
| Animation/camera action | Hold the relevant repair action; clean cut to the estimate beside occupied dates. Let the consequence settle without flashing warnings, invented debt or a disaster montage. |
| Required assets | A relevant repair clip with verified permission; original estimate/calendar art. Use original art alone if footage is unavailable or uncleared. No new amount is needed. |
| Source/license requirements | A01 is the fictional scenario basis, not proof of typical consumer outcomes. Record clip source, creator, license evidence and attribution before use. Label the estimate illustrative; the footage subject is not Sam or a documented BNPL customer. |
| Expected takeaway | The consequence in this example is reduced flexibility when an ordinary need arrives. |

These examples are future creative proposals. They neither revise episode 002 nor certify its current script/audio parity, claim verification or approvals. Existing episode status and unresolved sources remain in the [migration audit](../docs/documentary-migration-audit.md).

## 7. Review and phase boundary

Before approving a future storyboard, confirm that every beat has the required fields, one clear learning purpose and an appropriate medium. Check that the key mechanism survives removal of unnecessary text and numbers, that source/permission statuses are explicit, and that no recreation is presented as authentic evidence. Also verify visual progression before approval: frame 0 confirms the opening decision context, early beat diagrams are not duplicated later, multi-paragraph shot groups specify per-paragraph sub-staging, research beats pair source credits with qualitative schematics (or cleared authentic excerpts) instead of text-only bibliography cards, and the closing `callback-cut` bookend lands on the final paragraph.

During future production, inspect every beat and boundary, text wrapping, phone-size readability, state continuity and narration-linked reveals. Run the project's required checks, gallery review, metadata verification and full decode before delivery. Record technical results, human creative approval and audio listening approval separately in the existing validation workflow. A rendered frame alone cannot prove motion or synchronization quality.

Phase 2 created this guide; links/status are synchronized through Phase 9. The documentary [script guide](SCRIPT_GUIDE.md), [teaching guide](TEACHING_STYLE_GUIDE.md), [media-sourcing standards](MEDIA_SOURCING.md), [research playbooks](../research/README.md) and [global instructions](../AGENTS.md) now follow the new direction. Character/room requirements are scoped to legacy work; proposed documentary components remain unimplemented. See the [migration audit](../docs/documentary-migration-audit.md) for the documentation checks and remaining production limits.
