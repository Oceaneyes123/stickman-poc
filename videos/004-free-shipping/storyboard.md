# Why Free Shipping Makes You Spend More

## Untimed documentary storyboard

Episode 004. Prepared November 17, 2026, GMT+8. **Planning document, not an as-built film or a timed edit.**

This board covers **35 shot groups**, all **42 narration paragraphs**, and **1,462 spoken words** in their existing order. A group may contain related subshots; these are not mandatory final cut counts or durations. The narration and factual assumptions are unchanged.

**Narration SHA-256:** `05f1786d95552a0e64d22288bd47a3c8d4e0cc3f8a04404e5253b72cad5a66bc`

The fingerprint binds this plan to the exact bytes of `narration.txt`; it is not an audio/cue hash or listening approval. P01-P42 are document paragraph anchors, not audio takes. B01-B08 refer to [script.md](script.md). All narration below is quoted verbatim. The excerpt markers are document-check aids only, not a renderer input format.

No episode-004 narration output directory, measured WAV, manifest or cues was found at the expected project location during discovery. There are **no scene timestamps, take IDs, aligned frames or measured durations** in this board. The original approximately ten-minute target remains an estimate. Phrase anchors express intended reveal order only. Do not synthesize narration or invent offsets to make the board appear aligned.

Read with [narration](narration.txt), [script](script.md), [sources and assumptions](sources.md), [brief](brief.md), [outline](outline.md), [QA](qa.md), and the [pending asset manifest](asset-manifest.json). No episode-specific art is built and no third-party media is selected, acquired or cleared.

Current authority: [visual guide](../../references/VISUAL_STYLE_GUIDE.md), [teaching guide](../../references/TEACHING_STYLE_GUIDE.md), [media sourcing](../../references/MEDIA_SOURCING.md), current [storyboard playbook](../../research/playbooks/storyboard-playbook.md), and [decision #14](../../docs/decisions.md#14-presenting-fictional-scenarios--2026-11-16). The original script brief's production exclusions describe the earlier script task; this later request adds an untimed board only.

## Episode treatment

An ordinary purchase becomes a second shopping task. The recurring charger, optional organizer and delivery row carry that change. Research inserts clarify what was actually studied; store-side graphics explain the incentive; a needed household purchase tests the counterpoint. The final comparison returns to the same original objects with the decision still open.

Use editorial product staging, cropped interfaces, short source-backed evidence inserts and purposeful process diagrams. Keep objects substantial rather than turning them into interchangeable tiny icons. There is no recurring character cast, compulsory room or footage ratio. FO01 is optional context footage with original-art fallback DG01, never a real customer case. EP01 is an optional authentic paper excerpt, never a fabricated screenshot. Neither may enter a render while pending.

### Composition, labels and camera

- Future output remains 1920x1080, 30 fps through local Remotion only. Use bundled Inter and the project palette: navy `#14243A`, white `#F8FAFC`, yellow `#F3BE58`, coral `#FF6B6B`, teal `#39B8B6`.
- Keep essential graphics inside the 96 px side margins. Plan an inner content area around x=128-1792 and y=108-972, adjusting to actual content during production. These are intentions, not inspected rendered coordinates.
- Product/interface compositions establish a substantial product on the left and a readable checkout on the right. Evidence inserts use solid light or navy boards. Product close-ups, store-side process views and the final object callback change scale because the learning need changes.
- Plan primary labels around 64-80 px, totals around 104-120 px, and short source/scope lines around 48-56 px. Split a crowded qualification rather than shrink it. Font sizes, wrapping and phone readability remain unverified until rendered at half scale and phone size.
- Use short labels, not subtitles or narration cards. Under decision #14, present the invented charger, organizer and toothpaste scenarios and generic checkout interfaces naturally without on-screen "fictional," "illustrative," "hypothetical" or "demo" badges; keep their invented status and assumptions in the production records while retaining source credits and scope qualifiers for cited research and merchant guidance. Evidence labels are paraphrases, not fabricated quotations. Avoid long paper screenshots, recognizable copied UI and paragraph-length captions.
- Yellow denotes money/value, coral a real cost/obligation, and teal an alternative. None certifies that a choice is universally good, bad, safe or affordable. No victory confetti for qualifying or failure mark for paying delivery.
- Default to a clean cut. Move briefly only to reveal a relationship, then hold. No perpetual zooms, floating icons, countdowns, particles or effect quota. Reading holds follow actual delivery, not fixed shot durations.

### Continuity contract

1. The required item is an unbranded white wall charger. The optional add-on is one charcoal cable organizer. Their silhouettes, thumbnails and identity stay fixed. Do not upgrade the charger or change the retailer or delivery service between the two A01 orders.
2. Every checkout is an **unsubmitted order preview**. No scene confirms payment, invents a receipt, deducts a bank balance or proves delivery. A parcel diagram or product-use preview is illustrative, not a later documentary event.
3. Returning to the pre-addition cart must visually restore the earlier unsubmitted state rather than making a waived fee silently reappear on a supposedly completed order.
4. Merchandise eligibility and the delivered total are different quantities. The threshold strip never includes shipping charges. B04 and B08 share exactly the same two complete orders.
5. Toothpaste is a separate qualitative A02 example. Its value assumes a needed, fairly priced item and actual offer eligibility. Clear A01's totals and numeric fill before this branch. Do not invent a toothpaste price, numeric basket or eligibility amount.
6. Keep the research settings distinct: chocolate experiment, Philippine fashion data, merchant advice, the older retailer study and the North American grocery working paper. No unrelated stock customer or fake dashboard documents their participants.

### Calculation handoff, not screen content

A01 is one fictional USD order, with tax and other fees omitted solely to isolate the mechanism. Merchandise starts at 42, shipping is 6, the merchandise threshold is 50 and the organizer is 12. Delivered totals are 48 before and 54 after; extra outlay is 6. Merchandise subtotals are 42 before and 54 after. All products are assumed eligible; there is no membership, discount, debt, interest or return model.

Derive production values through `freeShippingExample`, `calculateFreeShippingOrder`, `sum`, `remaining` and `usd` exports in [finance math](../../src/finance/math.ts), matching the runnable assertion in [sources.md](sources.md). Only the two delivered totals are planned as on-screen example amounts. Do not show a formula, hardcode contradictory values, or call the incremental outlay the organizer's shelf price.

### Motion audit and future timing

The [typography](../../src/typography/README.md), [object motion](../../src/objects/README.md) and [transition](../../src/transitions/README.md) inventories and relevant implementations were inspected. References below identify existing mechanisms, not built episode-004 scenes.

- `KineticHeadline` in `src/typography/index.tsx` supports short masked/word reveals. Let the full phrase settle and hold. No default karaoke/subtitle treatment.
- `TextMorph` in that module supports before/after text states. Labels remain attached to their correct cart state.
- `FlipCard` in `src/objects/motion.tsx` accepts `frontContent` and `backContent`, useful for a genuine delivery-state tile swap.
- Inspected `DrawOn` and `PopIn` render their own demo circle/square shapes. They are **not arbitrary connector or product wrappers**. Custom paths, product entrances and progress strips need a future implementation and gallery review; naming these exports does not implement them.
- `hard-cut`, `cut-on-action`, `match-position`, `state-swap` and `callback-cut` are existing transition IDs. `state-swap` is a crossfade. Matching and callbacks require meaningful source/destination compositions.
- Original props, illustrative checkout, eligibility fill, cost diagram and comparison compositions are proposed. New art/motion needs the required gallery review. Motion must stay deterministic and frame-driven.

Future action timing comes from measured narration and reviewed cue anchors, compiled with `src/timeline/compiler.ts`. All phrase anchors below are planned triggers, not aligned timestamps. Do not stretch speech or embed guessed narration time in graphics.

## Shot index

| Shot group | Script beat | Narration paragraphs | Visual change |
|---|---|---|---|
| V4-S01 | B01 | P01 | The purchase is almost finished |
| V4-S02 | B01 | P02 | The offer sends the shopper back |
| V4-S03 | B01 | P03 | A fee disappears, an item remains |
| V4-S04 | B01 | P04 | The decision has changed |
| V4-S05 | B02 | P05 | What makes zero worth examining |
| V4-S06 | B02 | P06, P07 | The chocolate comparison |
| V4-S07 | B02 | P08 | Keep the experiment within its limits |
| V4-S08 | B02 | P09 | The removable row |
| V4-S09 | B03 | P10 | Finished shopping gets a second task |
| V4-S10 | B03 | P11, P12 | The organizer acquires a second benefit |
| V4-S11 | B03 | P13 | Gap and wording are different factors |
| V4-S12 | B03 | P14 | The remaining gap stays in view |
| V4-S13 | B03 | P15 | Qualification is not a usefulness test |
| V4-S14 | B04 | P16 | Evidence from actual fashion orders |
| V4-S15 | B04 | P17 | Observation and model are not the same |
| V4-S16 | B04 | P18, P19 | A larger basket does not prove waste |
| V4-S17 | B04 | P20 | An available item can overshoot the gap |
| V4-S18 | B04 | P21 | Compare the delivered totals |
| V4-S19 | B04 | P22 | The extra money also buys an object |
| V4-S20 | B05 | P23 | The offer from the merchant's side |
| V4-S21 | B05 | P24 | Delivery still has a cost |
| V4-S22 | B05 | P25 | Revenue must be weighed against costs |
| V4-S23 | B05 | P26, P27 | More sales can still fail to pay off |
| V4-S24 | B06 | P28 | A higher target may be rejected |
| V4-S25 | B06 | P29, P30 | The grocery counterexample |
| V4-S26 | B06 | P31 | Two studies, different policy questions |
| V4-S27 | B07 | P32, P33 | A useful planned purchase |
| V4-S28 | B07 | P34 | Earlier buying is not necessarily more use |
| V4-S29 | B07 | P35 | Useful does not mean affordable now |
| V4-S30 | B07 | P36 | Delivery is also a service |
| V4-S31 | B07 | P37 | The organizer can still be worth having |
| V4-S32 | B08 | P38 | Return to the complete choices |
| V4-S33 | B08 | P39 | What the extra item adds to the outlay |
| V4-S34 | B08 | P40 | Keep each reasonable option open |
| V4-S35 | B08 | P41, P42 | Finish with the choice, not the badge |

## Shot records

### V4-S01 - The purchase is almost finished

**Narration or story moment:** B01 / P01. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Imagine you're ordering a replacement phone charger. You've found the one you need, checked the price, and you're ready to pay. Then a delivery charge appears.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The shopper has already solved the original product need before the shipping condition arrives.

**Visual purpose:** Establish the ordinary purchase, then isolate the new cost.

**Recommended medium:** Original product close-up matched to an illustrative checkout. Optional neutral hands footage may establish context, never document an actual customer.

**Primary subject:** Unbranded white charger at left; a large order-preview panel at right, not a full browser screenshot.

**Animation or camera action:** Start on the charger and a phone with no invented battery emergency. Cut to the same charger in the cart. Reveal the delivery row only at the final sentence, then hold. Keep the purchase unsubmitted.

**Required assets:** DG01, DG02, FO01. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The charger was the original reason to shop; the delivery fee arrives as a separate consideration.

**Phrase anchor:** Then a delivery charge appears.

**On-screen text:** Charger; Delivery fee. No prices yet.

**Motion references:** `TextMorph`

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Fix the charger silhouette and its cart thumbnail for every later return. FO01 is optional and pending; DG01 is the complete fallback.

### V4-S02 - The offer sends the shopper back

**Narration or story moment:** B01 / P02. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Above it, a message says you could get free shipping if you spent a little more. So you go back to browsing and find a cable organizer. Add it to the cart, and the delivery charge disappears.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The delivery condition creates an extra browsing action and an extra product.

**Visual purpose:** Demonstrate offer, browse, add, and fee waiver in causal order.

**Recommended medium:** Original illustrative interface with a product-detail insert; this gives control of the condition without imitating a real seller.

**Primary subject:** The cart's eligibility strip and the same charcoal cable organizer used throughout the episode.

**Animation or camera action:** Reveal the offer above the delivery row. On the browse sentence, cut to the organizer detail, then return it to the cart. Only after it is added does the delivery state change from Paid to Free. Do not animate payment or order confirmation.

**Required assets:** DG01, DG02, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Free shipping is conditional on buying additional merchandise in this example.

**Phrase anchor:** Add it to the cart

**On-screen text:** Free shipping when eligible; Add organizer; Paid changes to Free. Amounts remain suppressed.

**Motion references:** `FlipCard`

**Transition:** `cut-on-action`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Use FlipCard only for the delivery-state tile, with explicit frontContent/backContent. The organizer stays a separate product; the card is not a shipping receipt.

### V4-S03 - A fee disappears, an item remains

**Narration or story moment:** B01 / P03. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> The whole order now costs more than it did with paid shipping. But you also get another product, which can make the extra spending feel easier to justify.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** A delivery discount and a higher complete order can coexist.

**Visual purpose:** Separate the two changes instead of presenting the waiver as the whole result.

**Recommended medium:** Original before/after order preview, with product silhouettes larger than labels.

**Primary subject:** Charger-only preview beside charger-plus-organizer preview.

**Animation or camera action:** Hold the paid-delivery preview, then reveal the enlarged preview. Highlight the removed fee and added organizer in sequence, never simultaneously flashing both. Use the words Higher order total, not an invented unscaled money bar.

**Required assets:** DG01, DG02, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Removing the fee does not by itself establish the lowest order total.

**Phrase anchor:** The whole order now costs more

**On-screen text:** Paid delivery; Free delivery; Higher order total. No numeric reveal.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `state-swap`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Both previews refer to the same retailer, charger and delivery service. Keep the additional product visible so extra outlay is not misrepresented as money lost for nothing.

### V4-S04 - The decision has changed

**Narration or story moment:** B01 / P04. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> That's how free shipping can change a purchase. A condition attached to the offer gives you a reason to buy more after you've already found what you needed. It won't affect every order, and qualifying can be a good deal. The important question is what you buy to get there.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The new buying reason comes from the condition, but qualifying is not inherently a mistake.

**Visual purpose:** State the episode's causal question while preserving the counterpoint.

**Recommended medium:** Object-led process graphic rather than another checkout close-up.

**Primary subject:** A completed Find charger task, then a separate Qualify for delivery task attached to the organizer.

**Animation or camera action:** Keep the charger task complete. Introduce the second task at the spoken condition, then hold both with the organizer between them. On the final sentence, remove the task decorations and leave the organizer for evaluation. Do not draw a compulsory arrow that suggests all shoppers follow it.

**Required assets:** DG01, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The condition can change why an additional item is considered; the item's value still matters.

**Phrase anchor:** A condition attached to the offer

**On-screen text:** Find charger; Qualify for delivery. No warning stamp, scam label or verdict.

**Motion references:** `KineticHeadline`

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** This is an explanatory schematic, not measured customer intentions. Use yellow for the offer and neutral styling for the organizer, not coral to condemn the object.

### V4-S05 - What makes zero worth examining

**Narration or story moment:** B02 / P05. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> There's an obvious appeal to getting something free. But researchers have found that zero can behave differently from an ordinary low price.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The explanation is moving to narrower experimental evidence, not diagnosing a shopper's brain.

**Visual purpose:** Introduce the research question with a short visual reset.

**Recommended medium:** Original typographic insert supported by the established delivery-state tile.

**Primary subject:** The word Free at interface scale, then a source-credit line for the 2007 research.

**Animation or camera action:** Hold the delivery tile from the previous context. Cut to a restrained Free headline on navy and allow the complete phrase to settle. Reveal a small but readable study credit; do not add a brain, dopamine pulse or hypnotic effect.

**Required assets:** DG02, DG04. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Zero has been studied as a potentially distinct price, not as a universal compulsion.

**Phrase anchor:** zero can behave differently

**On-screen text:** Free; Shampanier, Mazar and Ariely, 2007. This is a source credit, not a quotation.

**Motion references:** `KineticHeadline`

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** This is a brief subject change. The chocolate objects arrive in the next group; no shipping experiment is implied.

### V4-S06 - The chocolate comparison

**Narration or story moment:** B02 / P06, P07. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> In a study published in two thousand seven, researchers offered people a choice between a cheaper chocolate and a more expensive one. When both prices fell by the same small amount, making the cheaper option free, choices shifted toward it.
>
> The gap between the two prices hadn't changed. Yet reaching zero changed how people chose. The researchers called this the zero-price effect.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The cited experiment changed both prices equally while one reached zero.

**Visual purpose:** Make the experimental comparison followable without introducing a price calculation or invented response percentages.

**Recommended medium:** Original qualitative experiment schematic, explicitly distinct from study photography or participant data.

**Primary subject:** A small chocolate and a premium chocolate, each fixed in its own position with a price-state tag.

**Animation or camera action:** Establish Low price and Higher price tags. Change both price states together under one Same reduction label; the cheaper option becomes Free. Keep both chocolates present. Emphasize the free option only when the narrator reports the aggregate choice shift. Hold the outcome without depicting every participant choosing it.

**Required assets:** DG03, DG04. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** In this experiment, reaching zero changed choices despite an unchanged gap between the two prices.

**Phrase anchor:** making the cheaper option free

**On-screen text:** Same reduction; Free; Zero-price effect. Source credit persists. No prices, participant counts or percentage charts.

**Motion references:** `TextMorph`

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The same two chocolates survive the state change. Price-state tags are qualitative, not a claim to reproduce the study's precise stimuli.

### V4-S07 - Keep the experiment within its limits

**Narration or story moment:** B02 / P08. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Those were chocolate experiments, not online shipping experiments. They don't prove that a delivery offer makes everyone overspend. They offer a useful clue about why eliminating a charge can attract attention beyond the size of the discount.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Chocolate evidence does not by itself prove a shipping effect or universal overspending.

**Visual purpose:** Prevent the preceding illustration from becoming stronger evidence than the source supports.

**Recommended medium:** Original object comparison with an explicit boundary between research setting and checkout example.

**Primary subject:** Chocolate experiment at left; the neutral shopping cart at right.

**Animation or camera action:** Hold the chocolates under their study credit. Bring the cart into a separate region with a visible dividing rule. Do not morph chocolate into a shipping box or draw a causal arrow. Let the qualification be heard before cutting back to checkout.

**Required assets:** DG02, DG03, DG04. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** This is a possible explanatory clue, not direct proof about all delivery offers.

**Phrase anchor:** not online shipping experiments

**On-screen text:** Chocolate experiment; Online checkout. No new definition paragraph.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Keep the research and checkout sides legible in the same frame. The divider expresses a scope limit, not two equivalent experiments.

### V4-S08 - The removable row

**Narration or story moment:** B02 / P09. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> At checkout, that attention has somewhere specific to go. The shipping line is a separate cost you can apparently remove. And the website has given you a way to remove it by buying something else.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The checkout offers a specific way to eliminate a separately displayed fee.

**Visual purpose:** Return from the experimental clue to the actual decision mechanism.

**Recommended medium:** Original tight interface insert.

**Primary subject:** The delivery row and the additional-item condition, with the organizer thumbnail nearby.

**Animation or camera action:** Return to the pre-addition cart state. Isolate the delivery row with whitespace. Reveal the condition above it and then the organizer link. Finish on the two related elements, not a flashing Free badge.

**Required assets:** DG01, DG02, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The fee can be removed by a merchandise decision, which gives that decision a second purpose.

**Phrase anchor:** buying something else

**On-screen text:** Delivery fee; Add an eligible item.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `callback-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The replay restores the original unsubmitted cart. It is not a later fee reappearing on an already-paid order.

### V4-S09 - Finished shopping gets a second task

**Narration or story moment:** B03 / P10. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Now the condition matters. You originally came to buy a charger. Once you'd found it, the shopping was finished. A minimum-spend offer gives you another task, getting the cart over the cutoff.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Finding the charger and meeting the offer are separate goals.

**Visual purpose:** Expose the task change in an object-based sequence.

**Recommended medium:** Original process strip with two clearly separated task states.

**Primary subject:** The charger selection and an unfinished eligibility condition.

**Animation or camera action:** Start with the charger already selected. Close the product-search area but retain the cart. At another task, open only the eligibility strip. Keep the original selection visible; do not reset the shopper to needing a charger again.

**Required assets:** DG01, DG02, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The offer can reopen a decision that was otherwise complete.

**Phrase anchor:** another task

**On-screen text:** Item selected; Offer not yet met. No generic chapter card.

**Motion references:** `TextMorph`

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The delivery service and actual product need remain unchanged. Task language is editorial interpretation, not an observed psychological mediator.

### V4-S10 - The organizer acquires a second benefit

**Narration or story moment:** B03 / P11, P12. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> In our imaginary order, you start looking for something small enough to justify adding, but large enough to qualify. The organizer becomes interesting partly because it helps with that task.
>
> It might be a perfectly good organizer. Still, you're evaluating it in a different context. Instead of simply asking whether you want it at its price, you're also considering the delivery charge it would remove.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** An item can be evaluated for its usefulness and for its effect on delivery eligibility.

**Visual purpose:** Show why an otherwise optional product becomes relevant without shaming the shopper.

**Recommended medium:** Original product-detail illustration followed by a cropped cart insert.

**Primary subject:** The charcoal organizer at large scale, then its position beside the fee condition.

**Animation or camera action:** Begin with a quiet organizer close-up that makes its ordinary function understandable. Reframe once to include the cart condition. Draw no magical discount onto the product itself; the fee changes in the delivery row only after adding it. End with item and condition both readable.

**Required assets:** DG01, DG02, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The same optional item can seem more appealing because it also helps qualify the order.

**Phrase anchor:** delivery charge it would remove

**On-screen text:** Cable organizer; Helps qualify. No retail price or claim that it is unnecessary for every person.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `match-position`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Use the same organizer design, scale relationships and thumbnail. The contextual reframe is a proposed frame-driven move, not an existing episode component.

### V4-S11 - Gap and wording are different factors

**Narration or story moment:** B03 / P13. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Research on conditional promotions suggests that the gap between a basket and its target can affect whether people keep searching. How the offer is worded matters too. Being close doesn't produce the same response under every kind of promotion.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Continued search depends on the condition and its framing; proximity alone is not a universal rule.

**Visual purpose:** Present the research qualification without inventing experimental arms or effect sizes.

**Recommended medium:** Original research schematic and source credit.

**Primary subject:** A neutral Gap marker and Offer wording tile beside the open question Keep browsing?.

**Animation or camera action:** Establish the gap and wording as separate inputs. Bring the question into view without answering it with an arrow up or down. Preserve the qualification through the end of the passage. Keep any generic offer copy distinct from the study source credit so it is never presented as reproduced experimental material.

**Required assets:** DG04, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F03. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The gap and the way the offer is framed can interact; neither guarantees a purchase.

**Phrase anchor:** How the offer is worded matters too.

**On-screen text:** Gap; Offer wording; Keep browsing?; Kulkarni and Yuan, 2025. No invented study percentages.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The source was reviewed at abstract level. Do not imply the fictional progress strip was the specific interface tested.

### V4-S12 - The remaining gap stays in view

**Narration or story moment:** B03 / P14. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> A message showing the remaining gap makes the condition easy to follow. It also keeps qualifying in view while you decide whether to buy anything else.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** A visible condition can remain salient while the shopper browses.

**Visual purpose:** Demonstrate the persistent information rather than depicting mind control.

**Recommended medium:** Original cropped product browser with a persistent eligibility strip.

**Primary subject:** Organizer detail below the same fixed condition bar.

**Animation or camera action:** Hold the strip at a stable position as the content area changes once to the organizer. Do not animate an endless scroll, countdown or progress loop. Settle on the condition and product together so the viewer can inspect their relationship.

**Required assets:** DG01, DG02, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, F06, A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Showing the gap makes the qualification easy to keep considering.

**Phrase anchor:** keeps qualifying in view

**On-screen text:** Offer not yet met. No numeric gap is needed.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The bar represents merchandise eligibility, not the delivered order total. Its geometry must derive from A01 if a proportional fill is used.

### V4-S13 - Qualification is not a usefulness test

**Narration or story moment:** B03 / P15. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Notice that the condition doesn't tell you which extra item will be worthwhile. It only tells you how much merchandise must be in the order. You might cross the line with something you needed, or with something you wouldn't otherwise choose. From the point of view of the offer, both baskets qualify. From your point of view, they can be very different purchases.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The same eligibility outcome can accompany very different value to the shopper.

**Visual purpose:** Separate the rule the store checks from the judgment the shopper needs to make.

**Recommended medium:** Original two-path product-use comparison, not a chart of customer segments.

**Primary subject:** Two hypothetical uses of the same organizer: put to work beside a cable, or left without a planned use.

**Animation or camera action:** First hold one eligible order. Then reveal two possible contexts for the extra item, one at a time. Give both the same Qualifies tag, followed by the question Will I use it?. Do not show a waste bin, red cross or invented regret scene.

**Required assets:** DG01, DG05, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, A01, A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Meeting a spending condition does not establish whether the additional product is worthwhile.

**Phrase anchor:** both baskets qualify

**On-screen text:** Qualifies on both branches; Will I use it?

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `state-swap`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** These are alternative evaluations, not two additional purchases. Keep the total order outlay identical across the branches and suppress amounts here.

### V4-S14 - Evidence from actual fashion orders

**Narration or story moment:** B04 / P16. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Actual shopping orders show why this is worth examining. In a two thousand eighteen working paper, researchers studied an online fashion retailer in the Philippines. Orders clustered just above its free-shipping threshold.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** There is observed transaction evidence, with a specific setting and working-paper status.

**Visual purpose:** Ground the threshold explanation without fabricating a data visualization.

**Recommended medium:** Original bibliographic evidence card by default. An authentic paper/figure excerpt is an optional pending replacement only after contextual and rights review.

**Primary subject:** Chen and Ngwe's 2018 working paper, one Philippine online fashion retailer.

**Animation or camera action:** Cut away from the fictional cart to a legible source card. Reveal the paraphrase Orders clustered above cutoff beneath its scope. Do not draw simulated order dots, bins or a histogram. If EP01 is cleared later, show the authentic figure and context without inventing intermediate data.

**Required assets:** DG04, EP01. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F04. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Observed orders responded around a threshold in this particular retailer's data.

**Phrase anchor:** Orders clustered just above

**On-screen text:** Chen and Ngwe, 2018 working paper; Philippine online fashion retailer; Orders clustered above cutoff. No quotation marks around the paraphrase.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** EP01 remains pending and must not enter a render. DG04 is the complete fallback. Do not mix fictional USD labels into the Philippine data.

### V4-S15 - Observation and model are not the same

**Narration or story moment:** B04 / P17. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> The pattern was consistent with customers adding items to qualify. The researchers' model also found that a minimum-spend policy could produce bigger baskets than making shipping free on every order.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The paper's observed pattern and its modeled policy comparison have different evidentiary roles.

**Visual purpose:** Make the attribution audible and visible without treating the model as a randomized result.

**Recommended medium:** Original two-stage source annotation.

**Primary subject:** Observed pattern annotation followed by Modeled comparison annotation, under the same paper credit.

**Animation or camera action:** Retain the source identity. First isolate the observed pattern. On the model phrase, replace the annotation with a qualitative comparison of No minimum and Minimum order. Use product silhouettes schematically, with no measured scale, counts or effect size. Hold the Model result label.

**Required assets:** DG04, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F04, F05. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The study's model suggests a basket-size effect, but that is not an experiment proving that every added item was unwanted.

**Phrase anchor:** The researchers' model

**On-screen text:** Observed pattern; then Modeled comparison; No minimum; Minimum order. Show these sequentially.

**Motion references:** `TextMorph`

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Do not label the modeled comparison Observed sales or depict a real customer's private reason for adding something.

### V4-S16 - A larger basket does not prove waste

**Narration or story moment:** B04 / P18, P19. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> That distinction matters. Removing the charge without a spending condition gives the shopper a discount. Attaching a cutoff can also change which products end up in the cart.
>
> The data doesn't tell us that those extra products were useless. A bigger order isn't automatically a bad purchase. But the offer can influence the size of the order as well as the cost of getting it delivered.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Changing a basket and making a bad purchase are different claims.

**Visual purpose:** Return the evidence to its proper consumer meaning.

**Recommended medium:** Original paired offer states followed by a product-use detail.

**Primary subject:** The same charger with unconditional delivery versus a conditional delivery offer; the organizer remains visible as a potentially useful object.

**Animation or camera action:** Start with a charger-only order whose shipping has no spending condition. Then show the conditional version as a separate policy comparison. Finish on the organizer beside a cable, without assigning it a usefulness verdict. Never infer waste from order size alone.

**Required assets:** DG01, DG02, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, F05, F10, A01, A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** An offer can change product selection without establishing that the resulting purchase was harmful.

**Phrase anchor:** isn't automatically a bad purchase

**On-screen text:** No spending condition; Spending condition.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `state-swap`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** This policy comparison is not A01's two-total price reveal. Do not carry the paid/free numeric totals into an unconditional-free-shipping counterfactual.

### V4-S17 - An available item can overshoot the gap

**Narration or story moment:** B04 / P20. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> And products don't come in amounts designed to match that remaining gap. In our example, the organizer takes the cart past the minimum. You're choosing an available product, with its own price. The additional purchase can be larger than the amount the message says you're short, even if reaching the cutoff was your only reason to add it.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** A product's own price may take merchandise spending beyond the exact qualification gap.

**Visual purpose:** Demonstrate overshooting as a property of the example, without a calculation tutorial.

**Recommended medium:** Original eligibility strip and indivisible product tile.

**Primary subject:** The organizer moves into the merchandise-subtotal strip and passes its eligibility marker.

**Animation or camera action:** Establish the unmet merchandise threshold. Add the entire organizer tile, not a sliced fraction sized to the gap. Let the fill end beyond the marker and hold that result. No new amount needs to appear. Derive the positions from A01's merchandise subtotals, not the paid-delivery total.

**Required assets:** DG01, DG05. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The extra product can cost more than the amount the cart was short of qualifying.

**Phrase anchor:** takes the cart past the minimum

**On-screen text:** Merchandise eligibility; Minimum. No narrated arithmetic or new numerical label.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Before subtotal is 42, threshold is 50, after subtotal is 54 in the model. These are animator inputs only. Do not use 48 as the initial merchandise subtotal.

### V4-S18 - Compare the delivered totals

**Narration or story moment:** B04 / P21. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Return to our imaginary checkout. Suppose the charger order with paid delivery totals forty-eight dollars. With the organizer added and shipping waived, the total becomes fifty-four dollars. These are invented prices, just to make the choice visible.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The total outlay is higher in the enlarged fictional order even though its shipping charge is waived.

**Visual purpose:** Provide a brief concrete comparison after the mechanism is understood.

**Recommended medium:** Original full-order comparison with two large settled totals.

**Primary subject:** Charger with paid delivery, then charger plus organizer with free delivery.

**Animation or camera action:** At the first total reveal the left order and $48. At the second total reveal the right order and $54. Keep both complete orders visible with their delivery labels and shared assumptions. Reveal totals as settled states, not rolling counters or a subtraction animation.

**Required assets:** DG01, DG02, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The relevant comparison is the full delivered order, not only the shipping line.

**Phrase anchor:** fifty-four dollars

**On-screen text:** $48 delivered; $54 delivered; Includes organizer; USD, tax and other fees omitted.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Same charger, retailer, delivery service and eligible products on both sides. Derive both totals through calculateFreeShippingOrder in src/finance/math.ts; do not imply taxes were actually waived.

### V4-S19 - The extra money also buys an object

**Narration or story moment:** B04 / P22. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> The delivery discount is real within this example. So is the extra outlay. You have a charger either way. The decision is whether the organizer is worth spending more overall.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The add-on's value must be evaluated alongside the additional outlay.

**Visual purpose:** Keep the example fair instead of presenting the difference as a pure loss.

**Recommended medium:** Original product close-up beside the established comparison.

**Primary subject:** Organizer centered between the two order previews; charger thumbnails remain identical.

**Animation or camera action:** Keep the two totals from the prior shot rather than reciting new numbers. Briefly emphasize the waived delivery row, then move attention to the organizer. End on the physical product silhouette, not a red loss stamp.

**Required assets:** DG01, DG02, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A01, A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The additional outlay is a decision about the organizer's value, not proof that the shopper received nothing.

**Phrase anchor:** worth spending more overall

**On-screen text:** No new headline. Existing totals and item labels may remain.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `match-position`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Do not change the organizer's retail price or call the order difference its shelf price. Keep both previews unsubmitted.

### V4-S20 - The offer from the merchant's side

**Narration or story moment:** B05 / P23. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> For the retailer, the extra merchandise is part of the appeal. Shopify's guidance to merchants discusses using minimum-order requirements to increase cart value while accounting for shipping costs. It also recommends telling shoppers how far they are from qualifying.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Minimum orders are an explicit merchant tactic, not evidence of an undisclosed conspiracy.

**Visual purpose:** Explain the retailer incentive using first-party guidance with correct attribution.

**Recommended medium:** Original merchant-side control schematic and a source-credit strip, not a copied Shopify dashboard.

**Primary subject:** A Minimum order setting connected to the customer-visible eligibility message.

**Animation or camera action:** Change perspective from the cart front to a neutral control diagram. Show a setting and the resulting customer message in sequence. Keep the interface unbranded and identify Shopify only in the source credit. No actual admin workflow is asserted.

**Required assets:** DG02, DG04, DG05, DG06. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F06. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Merchants are advised to use the condition to encourage larger carts while considering delivery costs.

**Phrase anchor:** Shopify's guidance

**On-screen text:** Minimum order; Cart message; Shopify merchant guidance, accessed 2026-11-17.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Merchant advice is not independent proof of effectiveness. Do not reuse recognizable dashboard branding or claim this is a real seller's configuration.

### V4-S21 - Delivery still has a cost

**Narration or story moment:** B05 / P24. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Delivery still has a cost when the checkout line says free. A merchant might absorb that cost or account for it in product pricing. There's no rule that every free-shipping order hides an inflated price.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** A waived customer charge does not remove the retailer's delivery costs.

**Visual purpose:** Separate the checkout line from the service that must still be supplied.

**Recommended medium:** Original parcel-and-fulfillment process illustration.

**Primary subject:** The customer's Free delivery row above a parcel, packing step and carrier handoff.

**Animation or camera action:** Hold the customer row at Free. Below it, reveal a simple packing-to-carrier sequence and the label Delivery cost remains. Keep the physical service visible. Do not animate a secret surcharge entering the product price; absorption and pricing are possibilities, not universal pass-through rules.

**Required assets:** DG02, DG06. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F07. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Someone still supplies delivery even when the customer has no separate fee.

**Phrase anchor:** Delivery still has a cost

**On-screen text:** Free delivery; Delivery cost remains. No invented rate, carrier logo or invoice.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The parcel is a process illustration, not proof this imaginary order has been fulfilled. Diagram connectors show sequence only, never proportional cost.

### V4-S22 - Revenue must be weighed against costs

**Narration or story moment:** B05 / P25. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> With a threshold, the store can try to bring in enough merchandise revenue to help cover delivery. Whether that works depends on what customers buy and how much the retailer makes after its costs.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Additional merchandise revenue may help cover delivery, but revenue is not profit.

**Visual purpose:** Expose the cost relationship without invented margins or a financial worksheet.

**Recommended medium:** Original nonquantitative store-side diagram.

**Primary subject:** Merchandise revenue entering a store ledger alongside separate product and delivery cost labels.

**Animation or camera action:** Bring the extra-item line into the revenue side. Reveal cost labels only after revenue is established, then hold the unresolved Net result tile. Use equal-sized labels rather than proportional bars because no cost data is modeled. Never produce a profit total.

**Required assets:** DG06. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F06, F07, F08. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The additional sale helps only to the extent that the retailer's overall cost relationship permits it.

**Phrase anchor:** help cover delivery

**On-screen text:** Merchandise revenue; Product cost; Delivery cost; Net result depends on costs. No equation.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** This is a simplified relationship, not the complete retailer accounts or a margin estimate. No money is shown leaving an actual customer's bank account.

### V4-S23 - More sales can still fail to pay off

**Narration or story moment:** B05 / P26, P27. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> More sales alone don't settle that question. A study published in two thousand six examined an online retailer's shipping-fee policies. The researchers found that free-shipping promotions could generate additional sales without being profitable in that setting.
>
> The store gives up shipping revenue, and customers don't all respond in the same way. A larger basket can help, but it doesn't guarantee that the promotion pays for itself.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The cited retailer's promotion outcomes distinguish sales from profit and differ across customers.

**Visual purpose:** Support the caution with a specific reported finding, not a universal retailer loss claim.

**Recommended medium:** Original source card followed by a restrained qualitative result pairing.

**Primary subject:** Lewis, Singh and Fay, 2006, with separate Sales and Profit outcome labels.

**Animation or camera action:** Introduce the source credit and one-retailer scope. Reveal Additional sales first, then Profit not assured. Return the delivery-cost token beside the missing shipping-fee revenue line. Do not graph a loss magnitude, simulate consumer segments or show an income statement.

**Required assets:** DG04, DG06. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F08. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** In the reported study, extra sales did not make the promotion profitable for that retailer.

**Phrase anchor:** without being profitable

**On-screen text:** Lewis, Singh and Fay, 2006; One retailer; Additional sales; Profit not assured. These are paraphrases, not quotes.

**Motion references:** `KineticHeadline`

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The source was reviewed at abstract level. Keep the qualification in the main composition; do not animate the earlier hypothetical store as the actual study retailer.

### V4-S24 - A higher target may be rejected

**Narration or story moment:** B06 / P28. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Nor can a retailer assume that raising the threshold will keep making orders bigger. At some point, customers may decide the offer isn't worth reaching.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The retailer cannot assume that moving the cutoff will force larger orders.

**Visual purpose:** Introduce the counterpoint as an open response, not a guaranteed reverse effect.

**Recommended medium:** Original qualitative eligibility schematic.

**Primary subject:** A stable example cart and an eligibility marker moving farther away.

**Animation or camera action:** Show the marker move while the cart remains stationary. Stop before the cart follows it. Hold the unfilled space and the question Continue?. This is an unscaled schematic, not a rendering of the grocery study's exact thresholds.

**Required assets:** DG05, DG07. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F09, F11. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Changing the condition does not determine the customer's response.

**Phrase anchor:** raising the threshold

**On-screen text:** Higher minimum; Continue? No countdown, lockout or invented transaction outcome.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** This is a different policy scenario, not a surprise change to A01's fixed checkout terms. Clear the charger's totals before this scene.

### V4-S25 - The grocery counterexample

**Narration or story moment:** B06 / P29, P30. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> A working paper released in twenty twenty-six examined an online grocery platform in North America. It reported that spending among continuing purchasers fell after the platform raised its free-shipping threshold.
>
> That's one working paper about one platform, not a verdict on every offer. It shows that spending doesn't rise automatically with the target. Customers may change their purchases instead of adding more to qualify.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** A current working paper reports a spending decline among continuing purchasers after a threshold increase in one platform.

**Visual purpose:** Make the counterexample and its population restriction unmistakable.

**Recommended medium:** Original source-credit card with a neutral grocery context object.

**Primary subject:** A plain grocery bag beside the 2026 working-paper credit and its restricted result.

**Animation or camera action:** Introduce North American grocery platform. Reveal Continuing purchasers before the spending finding. At fell, use a single qualitative downward direction cue beside Spending, without a numerical chart or a change in depicted item count. Keep Working paper and One platform visible through the qualification.

**Required assets:** DG04, DG07. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F09, F11. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** In this setting, raising the threshold did not increase spending among the purchasers studied.

**Phrase anchor:** among continuing purchasers

**On-screen text:** Zhou and coauthors, 2026 working paper; One North American platform; Continuing purchasers; Spending fell. No percentage or named grocer.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Do not translate lower spending into an exact number of missing products or treat this as a result for all visitors. The source was reviewed through summaries, not full methods.

### V4-S26 - Two studies, different policy questions

**Narration or story moment:** B06 / P31. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> The fashion-retailer model and the grocery study aren't testing identical policies. One compares fee structures. The other examines a changed threshold. They address different decisions, and neither supports assuming that shoppers will keep adding products whenever a store raises the target.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The fashion model and grocery study are not identical tests with interchangeable results.

**Visual purpose:** Keep the synthesis honest and clarify why the counterexample does not erase the earlier mechanism.

**Recommended medium:** Original side-by-side research comparison with one active side at a time.

**Primary subject:** Fashion retailer: fee structures. Grocery platform: a raised threshold.

**Animation or camera action:** First show the fashion paper's policy comparison, then reveal the grocery paper's different question. Finish with both settings visible under Different comparisons. No common numerical axis, combined effect estimate or causal arrow between papers.

**Required assets:** DG04, DG07. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F05, F09, F11. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Evidence of a possible incentive effect is not a rule that every higher threshold raises spending.

**Phrase anchor:** aren't testing identical policies

**On-screen text:** Fee structures; Threshold increase; Different comparisons. Retain paper years and working-paper status.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Keep 2018 and 2026 source identities separate. Do not describe two presentations of the 2026 paper as independent replications.

### V4-S27 - A useful planned purchase

**Narration or story moment:** B07 / P32, P33. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> There's also a fair objection to our charger example. What if the extra item is something you genuinely need?
>
> Suppose you were going to buy toothpaste next week, and this store sells the same one at a fair price. Adding it could replace a later purchase while removing today's delivery charge.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** An add-on can replace a genuine later need rather than create an unwanted purchase.

**Visual purpose:** Give the legitimate-use objection an understandable physical example.

**Recommended medium:** Original household-product and shopping-plan illustration.

**Primary subject:** Toothpaste on a Later purchase list, then moved to the current hypothetical order.

**Animation or camera action:** Open the household-purchase scenario. Establish toothpaste already on a later shopping list before moving it into the current order. Show the later list entry being removed, not duplicated. Keep qualification conditional; assign no toothpaste price or total.

**Required assets:** DG02, DG08. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F10, A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Adding a genuinely needed product can substitute for a later purchase and be worthwhile.

**Phrase anchor:** toothpaste next week

**On-screen text:** Next week's list; Already needed; If eligible. No calendar date, product brand, price or guaranteed saving.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Do not retain the organizer order's $54 total or its merchandise fill. Toothpaste eligibility and value are assumptions in a separate qualitative example, not a newly priced version of A01.

### V4-S28 - Earlier buying is not necessarily more use

**Narration or story moment:** B07 / P34. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> You'd spend more on this order, but that alone wouldn't prove you'd increased your spending over time. Some of the purchase would simply happen earlier. That's different from buying an organizer you won't use because it gets the cart across the line.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** A larger individual order alone does not prove a rise in long-run spending or consumption.

**Visual purpose:** Distinguish purchase timing from the amount ultimately needed.

**Recommended medium:** Original two-position planning strip, not a spending time-series chart.

**Primary subject:** One toothpaste object moving from Later to Now, then contrasted with an optional organizer lacking a planned use.

**Animation or camera action:** Move the single planned item to Now and leave its former position empty. Do not duplicate it or reveal a monthly savings total. Then briefly show the organizer in a separate branch marked No planned use, keeping the contrast specific to this scenario rather than a judgment about all organizers.

**Required assets:** DG01, DG08. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F10, A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Changing when a needed item is bought differs from adding an item that will not be used.

**Phrase anchor:** simply happen earlier

**On-screen text:** Later; Now; One planned purchase; No planned use.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** This is not evidence of unchanged measured lifetime expenditure. The point is what one order's size cannot establish on its own.

### V4-S29 - Useful does not mean affordable now

**Narration or story moment:** B07 / P35. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Even buying early has conditions. You need the money available now and somewhere to keep what you've bought. A useful household product doesn't make a larger order affordable for everyone.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Available cash and storage can constrain a sensible planned purchase.

**Visual purpose:** Respect ordinary limitations instead of recommending stockpiling to everyone.

**Recommended medium:** Original physical shelf detail followed by a present-payment question.

**Primary subject:** The same toothpaste beside limited shelf room, then a neutral Pay now decision tile.

**Animation or camera action:** Let the item approach a shelf without making it fit by magic. Cut to Pay now? while retaining the item. Leave both questions open. Do not invent an empty bank account, unpaid essential bill or a person's financial distress.

**Required assets:** DG08. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** A useful add-on still requires enough money and room at the time of purchase.

**Phrase anchor:** money available now

**On-screen text:** Room to store?; Money available now? Reveal sequentially rather than as a checklist wall.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** No income, balance, debt or shelf measurement is modeled. These are possible constraints, not a diagnosis of the viewer.

### V4-S30 - Delivery is also a service

**Narration or story moment:** B07 / P36. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> And paying for delivery may itself be reasonable. Imagine someone working shifts or living with limited mobility. Going to a physical shop might take time, transport or help they don't have readily available.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Paid delivery may be valuable when in-person shopping has real access costs.

**Visual purpose:** Make the alternative's burden visible without an easy-escape moral.

**Recommended medium:** Original service-choice illustration, with no identifiable stock subject.

**Primary subject:** Home delivery option beside a physical-shop route requiring time or assistance.

**Animation or camera action:** Start with the delivery option available. Reveal the shop route and a work-calendar constraint, then an assistance requirement as alternative possibilities. Do not assume they all affect one fictional person. Keep the delivery fee attached to a real service rather than stamping it Waste.

**Required assets:** DG06, DG08. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Avoiding a delivery charge is not automatically the practical or lower-cost choice.

**Phrase anchor:** time, transport or help

**On-screen text:** Delivery; Shop in person; Actual options differ. No travel times, transport prices or disability stereotype.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The route is a conceptual choice, not a geographic map. Neither the work calendar nor access constraints establish a documented customer's experience.

### V4-S31 - The organizer can still be worth having

**Narration or story moment:** B07 / P37. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> The comparison has to reflect the shopper's actual options. Avoiding every fee isn't always practical. Neither is treating every extra item as waste. An organizer can be enjoyable as well as useful, and that's a legitimate reason to want one.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Value includes genuine enjoyment and usefulness, not only a strict original shopping list.

**Visual purpose:** Return to the add-on without condemning the shopper or the product.

**Recommended medium:** Original desk-level product detail, a quiet hold rather than another explanatory card.

**Primary subject:** The organizer tidying the same cable beside the unbranded charger.

**Animation or camera action:** Show a plausible optional use for the organizer, then hold. Do not insert a price, savings badge or universal approval check. Let the narration establish that this is one legitimate motive, not evidence that everybody needs the item.

**Required assets:** DG01. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Choosing an add-on for real value is different from buying it solely to meet a condition.

**Phrase anchor:** legitimate reason to want one

**On-screen text:** No new headline.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `callback-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** This is a hypothetical use preview, not a claim the opening order was paid and delivered. Maintain the charger's and organizer's original appearance.

### V4-S32 - Return to the complete choices

**Narration or story moment:** B08 / P38. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> So go back to the two complete orders. One gets the charger delivered. The other gets the charger and the organizer delivered. Look at what you'd pay and what you'd receive in each case.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The final decision compares everything paid and everything received.

**Visual purpose:** Resolve the opening with an apples-to-apples view of the two orders.

**Recommended medium:** Original full-order comparison, matching the earlier numeric reveal.

**Primary subject:** Left: charger with paid delivery. Right: charger plus organizer with free delivery.

**Animation or camera action:** Return to the exact layout of V4-S18. Show each product set first, then retain the corresponding settled total. The original offer badge stays secondary. Hold both long enough for the complete choices to be compared without a new calculation.

**Required assets:** DG01, DG02, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A01. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Compare delivered purchases, not isolated fee labels.

**Phrase anchor:** two complete orders

**On-screen text:** $48 delivered; $54 delivered; Includes organizer; USD, tax and other fees omitted. No new amounts.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `callback-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Use exactly the same retailer, delivery service, product set and assumptions as V4-S18. Neither preview is a completed transaction.

### V4-S33 - What the extra item adds to the outlay

**Narration or story moment:** B08 / P39. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> The difference between those totals is what the extra item would cost you compared with the purchase you were already prepared to make. Would you willingly pay that difference for it if the free-shipping message weren't there?
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The incremental order outlay is the relevant comparison for deciding whether to add the organizer.

**Visual purpose:** Connect the complete-order comparison to the item's value without teaching subtraction.

**Recommended medium:** Original product comparison detail with a nonnumeric annotation.

**Primary subject:** The organizer and an Extra outlay bracket attached to the two existing order totals.

**Animation or camera action:** Keep both totals settled. Add a simple static bracket labeled Extra outlay, then put visual priority on the organizer. Remove only the promotional Free badge so the same full choices can be considered without the promotional emphasis. Keep delivery service labels available.

**Required assets:** DG01, DG02, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** A01, A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** The shopper can judge whether the extra product is worth the additional complete-order payment.

**Phrase anchor:** difference between those totals

**On-screen text:** Extra outlay; Worth it to me? No subtraction sign, equals sign, new dollar amount or retail-price relabeling.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `hard-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The incremental order difference is not the organizer's shelf price. Do not imply the delivery discount was false, reverse the underlying math or erase the product's possible value.

### V4-S34 - Keep each reasonable option open

**Narration or story moment:** B08 / P40. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> If you would, qualifying may be worthwhile. If you're only adding it to remove a charge, the lower total may still be the order with paid shipping. And if neither order feels worth its full price, you can reconsider the purchase itself.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** Qualifying, paying delivery or reconsidering the purchase can each be reasonable under different circumstances.

**Visual purpose:** Offer a fair decision rather than a compulsory cheapest-choice verdict.

**Recommended medium:** Original choice sequence using the existing order previews.

**Primary subject:** The enlarged order, original order and an unsubmitted cart that can be left for later.

**Animation or camera action:** Bring the enlarged order forward for the first conditional statement, then the original order for the second. At reconsider, return to the still-open cart without a completed payment. Show choices sequentially, not three equally shouting cards. No refund or guaranteed future discount is implied.

**Required assets:** DG02, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, F11, A01, A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Qualification is one option, not the objective that overrides all other considerations.

**Phrase anchor:** reconsider the purchase itself

**On-screen text:** Add the item; Pay delivery; Reconsider. Only the currently discussed choice has emphasis.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `state-swap`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** Retain the original totals where relevant; no third numerical offer is invented. Teal can identify an option but cannot certify that it is always better.

### V4-S35 - Finish with the choice, not the badge

**Narration or story moment:** B08 / P41, P42. Exact excerpt follows.

<!-- SHOT_NARRATION -->
> Free shipping can make you spend more because a spending condition gives you a new reason to keep shopping. Reaching zero on the delivery line can become more important than deciding what you want from the order.
>
> You started with a charger. You can still finish with a charger. Whether the organizer comes with it should depend on what it's worth to you, not simply on whether it makes the delivery line say free.
<!-- /SHOT_NARRATION -->

**What the viewer needs to understand:** The condition can prolong shopping, but the add-on's value remains the reason to choose it.

**Visual purpose:** Pay off the original charger image with changed understanding and a calm ending.

**Recommended medium:** Original callback from the eligibility condition to the physical product composition.

**Primary subject:** The original charger at the opening position; organizer optional beside it, not fused into the purchase.

**Animation or camera action:** Briefly reconnect the eligibility strip to the optional organizer as the mechanism is summarized. Then remove the promotional strip. On the final paragraph return to the opening charger composition, place the organizer beside it without a selection check, and hold. End without a new lesson card, forced subscribe request or a completed-order screen.

**Required assets:** DG01, DG02, DG05, DG09. All episode-specific assets are pending; see the manifest.

**Source/license requirements:** F01, F11, A01, A02. Retain source scope and assumptions from sources.md. Factual support is not reproduction permission. Original art needs provenance, and optional third-party material must not enter a delivery render until its intended-use rights are verified.

**Expected viewer takeaway:** Choose the extra product for its value rather than for qualification alone.

**Phrase anchor:** You started with a charger.

**On-screen text:** No new headline. If any product labels remain, keep them factual and never substitute a generic financial slogan.

**Motion references:** Static/restrained state changes; no special library motion required.

**Transition:** `callback-cut`. Duration and offsets remain unassigned pending measured narration.

**Continuity:** The opening objects and open decision survive to the end. The charger-only option has no shame or victory styling, and the organizer is not discarded as waste.

## Production handoff and open items

- User creative approval and human comprehension review are pending. Ask a reviewer to explain why removing a fee can increase a complete order and name an assumption that makes a needed add-on worthwhile. This desk plan does not establish audience understanding.
- All DG assets are proposed originals, not implemented or cleared files. FO01 has no selected asset/provider/license. EP01 has a known factual source but an unresolved reproduction basis. Keep these pending and use the specified original-art/source-card fallbacks if optional media cannot be cleared.
- Before any render, establish actual authorship and third-party inputs, permissions, local paths, hashes and required credits. The manual asset manifest is not consumed or rights-validated by the renderer.
- Obtain approved local VoiceStudio narration separately. Check script/manifest identity, listen to the whole master, measure its duration, then review phrase cues. Regeneration invalidates prior alignment; structural/ASR checks do not establish listening approval.
- Once timing exists, adjust shot groups or action complexity to fit natural delivery. Split dense evidence cards when needed. No guessed take IDs, durations, movement quota or stretched speech may be carried into production.
- Implement only separately approved visual work. Reuse audited motion where it fits and review new art/motion in the appropriate galleries. This document does not implement a new scene schema, mixed-media compositor or license gate.
- Rendered layout, motion, phone readability, holds and narration-linked reveals remain uninspected. A future film still requires `npm run check`, beat/boundary review, rendering, metadata verification and full decode, with human creative/listening decisions kept separate.

## Document verification

Run `python videos/004-free-shipping/storyboard-check.py` from the repository root. This episode-scoped document check verifies the narration fingerprint, exact ordered coverage, nine fields, paragraph/phrase anchors, source IDs and asset cross-references. It is not the legacy ten-field/take checker and does not certify creative quality, rights, alignment or renderer behavior. Re-run after any narration, board or manifest edit. See [qa.md](qa.md) for actual results.
