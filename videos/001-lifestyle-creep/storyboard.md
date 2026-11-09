# Text storyboard — Why Making More Money Doesn't Make You Richer

**Status:** Storyboard approved by the user on 2026-11-09. The S01–S06 animation uses the v5 still framing and is available in `out/001-lifestyle-creep/opening-animation-v2/s01-s06.mp4`. Motion and audiovisual sync await user review; S07–S67 remain planning only.

**Narration:** [narration.txt](narration.txt), Jeremy (`f6ec71e3`) with VoxCPM2; measured master duration **12:29.813**. This board divides the 23 narration paragraphs into **67 scenes**, using sentence-level changes in action, setting, or financial explanation. Paragraph boundaries do not force scene boundaries.

**Timing:** Uses the existing phrase IDs in `out/001-lifestyle-creep/narration/timing/cues.draft.json`. The user chose to proceed with the full timing after reviewing the first two audio files. The timing JSON remains draft data; this document does not mark it aligned. Scene windows begin at the first listed cue and end at the next scene's first cue, with the final scene ending at the measured WAV endpoint. Silence holds the current composition. Displayed timestamps are navigation aids, not hardcoded animation timing.

**Reading:** Each scene pairs an exact excerpt from the narration source with a proposed visual and action. Cue ranges are inclusive. Some ASR phrases combine sentences or contain stray tokens; the narration source below stays authoritative. For example, p001-s011 (“Back.”) and p010-s008 (“price.”) receive no new spoken content or visual reveal. Word-level offsets inside combined cues can be set during animation preparation.

## Visual continuity

- Use the current reference characters: hairless, earless Sam in a blue hoodie; hairless, earless Alex in a white collared shirt and round glasses. Keep their adult proportions and identities consistent. Both act silently under the single narrator.
- Reuse Sam's cramped work corner, brighter apartment, usable older rental, newer rental, phone, lease folder, pay notice, and savings-transfer ledger. Keep props and room layouts recognizable across callbacks.
- Navy/white base, yellow money, coral costs, teal alternatives; locally bundled Inter. Show one numerical reveal at a time with at least 96 px side margins and text clear of faces and hands. Screen-text suggestions are brief labels, not subtitles or text to display all at once.
- Most transitions are clean cuts or matched views. Actions explain cause and result. Keep people grounded, objects attached to hands, camera moves restrained, and diagrams free of decorative motion.
- Amounts are fictional monthly take-home USD. Opening savings balances, full baseline expense categories, provider terms, debt, car ownership, and investment returns are unspecified. Show explicit transfers before labeling remaining money as saved. Compare new contributions rather than invented absolute account balances.

## Financial continuity reference

These values are planning checks from [math.ts](../../src/finance/math.ts) and the episode's declared assumptions. The eventual graphics must derive calculations from the finance module.

| Point in the example                              | Income | Illustrated expenses |                     Monthly savings transfer |
| ------------------------------------------------- | -----: | -------------------: | -------------------------------------------: |
| Before raise                                      | $3,000 |               $2,600 |                                         $400 |
| Raise, unchanged spending (hypothetical capacity) | $3,600 |               $2,600 | $1,000 remaining; transfer not yet specified |
| Sam, Month 1: apartment                           | $3,600 |               $2,900 |                                         $700 |
| Sam, Month 2: apartment + transport               | $3,600 |               $3,120 |                                         $480 |
| Sam, Month 3: apartment + transport + services    | $3,600 |               $3,220 |                                         $380 |
| Alex, Months 1–3                                  | $3,600 |               $2,800 |                                         $800 |
| Sam, after the added services end                 | $3,600 |               $3,120 |                                         $480 |

Sam's three-month contributions are $1,560, versus $1,200 at his old pace. Alex contributes $2,400, a three-month difference of $840. The Month 3 monthly difference is $420. The separate twelve-month illustration freezes the earlier $380/$800 pattern: $4,560/$9,600, a $5,040 difference. That illustration does not use Sam's later cancellation outcome.

## Visual-direction revision

**Title option for review:** **He Got a $600 Raise. So Why Was He Saving Less?** This is the reviewer's proposed alternative, not a change to the working title, accepted narration, or project files. It names the monthly-saving question directly without implying the example measures complete wealth.

**Approach:** Character action establishes the situation before the arithmetic confirms it. Scenes are continuous actions with setup, change, and a readable result; a new scene does not mean a new presentation slide. Retain physical documents, keys, phones, and contribution receipts so viewers can follow consequences across cuts.

- **Alex stays active:** introduce his choice process in S05/S11, then use brief silent comparisons in S14, S20, S26, S34, and S42. These foreshadow his later narrated choices without adding dialogue, new prices, or his future $800 result before S44.
- **Tension before the totals:** the opening stops on Sam's uncertain thumb; S21 crops the rent out of his attention, S22 reveals it through a pullback, and S25–S27 bring the commitments together around the same finite raise. No negative bank balance, fee, or debt is invented to heighten tension.
- **The middle remains a story:** S31–S33 reuse one dated-contribution illustration, S34 returns to the people, S35 makes the transfer physical, and S36 uses one brief generic reference-page insert. S38–S42 return to Sam's documents, dinner, calendar, and decisions rather than repeated full-screen ledgers.
- **Emotional arc through the body:** excitement uses an upright stance and quick purposeful gesture; satisfaction uses relaxed shoulders and easier movement; uncertainty uses a stopped reach and closer attention; realization brings previously separate commitments together; control uses a checked pause and decisive hand movement. The opening is a flash-forward before the story replays these choices.
- **Purposeful motion only:** each cue has one primary action, with a reaction or prop settle where useful. Use planted feet, fixed segment lengths, hand/prop contact, natural weight shifts, and reading holds. No ambient loops, perpetual motion, gratuitous transitions, camera movement during arithmetic, or motion merely to fill a long shot.
- **Cue timing stays intact:** beat references below use existing phrase IDs; landmarks such as “signs the lease” identify a future word-level offset inside a combined phrase, not a new timestamp or approved alignment. Actions must fit the current scene window; exact frame offsets and move durations are later implementation work.
- **Closing contrast:** S67 reproduces the opening framing and paused thumb, but Sam now checks the full plan and deliberately confirms it. Keep his unchanged $3,600 pay notice visible while planned $480 matches transferred $480. The payoff is a changed decision process, not another raise or a wealth promise.

Each scene includes shot composition, emotional beat, character movement, camera movement, visual transition, cue-linked animation beats, and state continuity. Screen text remains sparse, sequential emphasis rather than a subtitle track. These directions are the approved planning baseline; finished animation and audiovisual quality still require review.

## Proposed scenes

### S01 — A raise, then a smaller transfer

**Audio window:** 00:00.000–00:05.860 · **Paragraph:** `p001` · **Cue anchors:** `p001-s001–p001-s002`

**Narration**

> Sam got a six-hundred-dollar raise. Three months later, he was saving less than before.

**Shot composition:** Close-up of Sam and the pay notice; matched close-up of his face and phone three months later.

**Emotional beat:** Excitement gives way to uncertainty in the opening flash-forward.

**Character movement:** Sam straightens, raises the notice, and makes one quick celebratory step; later his thumb stops and his shoulders settle forward.

**Camera movement:** Brief push toward the raise notice; three calendar flips; match-cut on Sam’s face without a spinning transition.

**Visual transition:** Cut from the stopped thumb to the comforts that preceded this moment.

**Animation beats:**

- **`p001-s001`:** The notice arrives; Sam reads it before his celebratory gesture.
- **`p001-s002`:** Three calendar pages turn; his smile fades as he checks the transfer. Hold the question.

**State continuity:** Same hoodie, phone, and $600 raise; the second shot is Month 3. No $380 reveal or account-balance drop yet.

**On-screen text:** +$600/month; Three months later.

### S02 — What the raise bought

**Audio window:** 00:05.860–00:14.320 · **Paragraph:** `p001` · **Cue anchors:** `p001-s003–p001-s005`

**Narration**

> He had a better apartment. He drove a newer car. He could watch almost anything he wanted, provided he remembered which app had it.

**Shot composition:** Three character-led inserts: medium apartment view, car interior, and over-shoulder phone view.

**Emotional beat:** Satisfaction: each upgrade solves a recognizable irritation.

**Character movement:** Sam places his laptop on a permanent desk, settles into the newer rental seat, and chooses a program with a relaxed hand.

**Camera movement:** Static inserts connected by matching hand movements; no camera motion over the phone text.

**Visual transition:** Match the phone position into the savings-account view.

**Animation beats:**

- **`p001-s003`:** Sam has room to leave his laptop open.
- **`p001-s004`:** His posture relaxes in the newer rental.
- **`p001-s005`:** He hesitates among several entertainment tiles, then picks one.

**State continuity:** Use the later apartment layout, rental keys, and generic service tiles. These are opening flash-forward benefits, not extra purchases.

**On-screen text:** No text needed.

### S03 — The statement tells another story

**Audio window:** 00:14.320–00:25.200 · **Paragraph:** `p001` · **Cue anchors:** `p001-s006–p001-s008`

**Narration**

> From the outside, the raise looked like progress. Then he opened his savings account and checked that month's transfer. It was smaller than the transfers he made on his old salary.

**Shot composition:** Over Sam’s shoulder at the brighter-apartment desk, followed by a tighter view of his hands and phone.

**Emotional beat:** Uncertainty interrupts the satisfaction shown in S02.

**Character movement:** His free hand leaves the comfortable chair arm; he leans toward the screen and checks the two transfer entries twice.

**Camera movement:** One restrained push as his thumb stops; keep the entries legible.

**Visual transition:** Cut on his searching glance to the source of the paycheck.

**Animation beats:**

- **`p001-s006`:** Sam’s relaxed posture matches the outward improvement.
- **`p001-s007`:** He opens the transfer record; the camera moves closer.
- **`p001-s008`:** His thumb pauses between the older and newer entries; hold the puzzled reaction.

**State continuity:** Preserve the opening phone angle for S67. Entries show monthly transfer size, with the exact $380 still withheld.

**On-screen text:** Monthly savings transfer; Before; Month 3.

### S04 — Follow the money out

**Audio window:** 00:25.200–00:35.740 · **Paragraph:** `p001` · **Cue anchors:** `p001-s009–p001-s012`

**Narration**

> Sam hadn't stopped working. His employer hadn't taken the raise back. Somewhere between getting paid and paying his bills, he'd spent the entire increase, plus a little more.

**Shot composition:** Medium workplace action, then a top-down view of Sam putting the same pay packet beside his actual commitments at home.

**Emotional beat:** Curiosity: the missing improvement must be traced through ordinary decisions.

**Character movement:** Sam finishes his work, brings the packet home, and lays rent papers, rental keys, and the phone around it.

**Camera movement:** Clean cut between locations; static overhead during allocation so cause and destination stay clear.

**Visual transition:** Widen the tabletop into the equal-start introduction of Sam and Alex.

**Animation beats:**

- **`p001-s009`:** Show Sam still doing his job.
- **`p001-s010`:** The original raise notice remains unchanged beside the packet; no new event on p001-s011.
- **`p001-s012`:** The commitments surround the packet, raising the question of their combined cost.

**State continuity:** No lost job or reduced raise. One pay packet persists; money moves toward obligations rather than vanishing. Hold through ASR-only p001-s011.

**On-screen text:** Income; Recurring costs.

### S05 — Introduce the comparison

**Audio window:** 00:35.740–00:40.823 · **Paragraph:** `p001` · **Cue anchors:** `p001-s013`

**Narration**

> We're going to follow those decisions, then compare them with a friend who got exactly the same raise.

**Shot composition:** Equal medium two-shot of Sam and Alex, with matching pay packets and a different set of everyday props beside each.

**Emotional beat:** Curiosity about two reasonable ways to use the same opportunity.

**Character movement:** Sam looks toward the desk and rental keys he wants; Alex considers his own workspace and keys, then keeps them in hand.

**Camera movement:** Static, level framing; neither character is visually elevated over the other.

**Visual transition:** Cut to the shared starting transaction for the baseline.

**Animation beats:**

- **`p001-s013`:** Sam and Alex receive equal visual weight; their different glances open the comparison question within the same cue.

**State continuity:** Alex becomes an active comparison here. Keep future choices silent and future $800 transfers undisclosed.

**On-screen text:** Sam; Alex; Same raise.

### S06 — Establish the starting budget

**Audio window:** 00:40.823–00:50.923 · **Paragraph:** `p002` · **Cue anchors:** `p002-s001–p002-s003`

**Narration**

> Before the raise, Sam took home three thousand dollars a month. After the expenses in our example, he had four hundred left. He transferred that four hundred into savings.

**Shot composition:** Over-shoulder banking action at Sam’s original cramped table; a compact arithmetic strip sits beside the phone.

**Emotional beat:** Ordinary routine: establish what saving looked like before the raise.

**Character movement:** Sam receives pay, places the illustrated bill bundle aside, then deliberately sends the remaining money to savings.

**Camera movement:** Static while the calculation appears; move attention with his hand rather than zooming every number.

**Visual transition:** Pull back to reveal the example frame around the same action.

**Animation beats:**

- **`p002-s001`:** Pay arrives; reveal $3,000.
- **`p002-s002`:** The bill bundle takes $2,600; $400 remains.
- **`p002-s003`:** Sam taps transfer and keeps the receipt; reveal $400 transferred.

**State continuity:** $3,000 income and $2,600 expenses leave $400; only the explicit transfer makes it saved. No opening account balance.

**On-screen text:** $3,000 income; $2,600 expenses; $400 transferred.

### S07 — Define the example

**Audio window:** 00:50.923–01:02.755 · **Paragraph:** `p002` · **Cue anchors:** `p002-s004–p002-s006`

**Narration**

> This is a fictional comparison. The amounts are monthly take-home dollars, not a claim about what the average person earns or spends. We'll keep other costs unchanged so we can see what these particular choices do.

**Shot composition:** Wide view of the small baseline setup, held inside a simple fictional-example frame.

**Emotional beat:** Clarity and trust without stopping the human story.

**Character movement:** Sam files the receipt while the unchanged baseline-cost bundle stays in place.

**Camera movement:** Static; reveal only the short scope labels as their qualifications are spoken.

**Visual transition:** Cut closer to the awkward table and dishes to start the replay of his choices.

**Animation beats:**

- **`p002-s004`:** Add the fictional-example label.
- **`p002-s005`:** Clarify monthly take-home USD beside the existing receipt.
- **`p002-s006`:** Keep the original cost bundle fixed as Sam clears a space to work.

**State continuity:** Amounts remain fictional monthly take-home USD. Do not invent individual baseline bills or assume a starting savings balance.

**On-screen text:** Fictional example; Monthly take-home USD; Other costs unchanged.

### S08 — Why Sam wants an upgrade

**Audio window:** 01:02.755–01:13.655 · **Paragraph:** `p003` · **Cue anchors:** `p003-s001–p003-s003`

**Narration**

> Sam wanted more breathing room. He wanted a home where he could work without balancing his laptop beside the dishes. He wanted a car he felt comfortable driving on a weekend trip.

**Shot composition:** Medium-wide cramped table shot, then a practical view of the usable older rental and a weekend map.

**Emotional beat:** Understandable frustration, followed by hope for more breathing room.

**Character movement:** Sam shifts his laptop, nudges a dish, catches it, and rearranges the table before working; later he adjusts in the older seat.

**Camera movement:** Static enough to read the whole physical problem; a matched cut connects cramped desk space and cramped seating.

**Visual transition:** Cut from his hopeful glance to the incoming raise packet.

**Animation beats:**

- **`p003-s001`:** Sam tries to settle into the work corner.
- **`p003-s002`:** The dish and laptop interfere; he catches, clears, and resets them.
- **`p003-s003`:** He considers the weekend route from the older rental, seeking comfort rather than rescue.

**State continuity:** The old home and car are adequate. Keep contact with laptop and dishes believable; no spill damage, breakdown, or new expense.

**On-screen text:** No text needed.

### S09 — The opportunity created by the raise

**Audio window:** 01:13.655–01:25.535 · **Paragraph:** `p003` · **Cue anchors:** `p003-s004–p003-s006`

**Narration**

> The raise added six hundred dollars to his monthly take-home pay. His income became three thousand six hundred. If he kept the same expenses, he'd have one thousand dollars left each month.

**Shot composition:** Top-down of Sam opening the larger pay packet at his table; existing commitments occupy the same fixed space.

**Emotional beat:** Possibility: the raise creates visible room.

**Character movement:** Sam lays the added money beside his old pay, pays the unchanged cost bundle, and notices the larger remainder.

**Camera movement:** Static during sequential arithmetic; one small widening shows the extra space on the table.

**Visual transition:** Cut from the available remainder to his two possible uses for it.

**Animation beats:**

- **`p003-s004`:** The $600 addition joins the original pay once.
- **`p003-s005`:** Label the full $3,600 income.
- **`p003-s006`:** The unchanged bills leave $1,000 remaining; Sam pauses before deciding.

**State continuity:** $3,600 minus unchanged $2,600 leaves $1,000. This is capacity before upgrades, not a promised transfer.

**On-screen text:** $3,600 − $2,600 = $1,000 remaining.

### S10 — There is room for both choices

**Audio window:** 01:25.535–01:32.455 · **Paragraph:** `p003` · **Cue anchors:** `p003-s007–p003-s008`

**Narration**

> He didn't have to save all of it to improve his position. He could spend some of the raise and still increase his savings.

**Shot composition:** Medium Sam at the table with the raise allocation tray between his spending choices and savings destination.

**Emotional beat:** Relief: enjoying some of the raise and keeping some can coexist.

**Character movement:** He divides attention between a comfort choice and the saving goal, then leaves space for both.

**Camera movement:** Static; follow his gaze and hand rather than moving all objects at once.

**Visual transition:** Widen to the equal-start Sam–Alex view.

**Animation beats:**

- **`p003-s007`:** Sam sees that the entire raise need not go into one destination.
- **`p003-s008`:** He leaves an unnumbered portion available for saving while considering a comfort upgrade.

**State continuity:** No invented split amount here. Reuse one finite $600 raise tray throughout the later commitments.

**On-screen text:** Enjoy some; Keep some.

### S11 — Give Alex the same start

**Audio window:** 01:32.455–01:49.401 · **Paragraph:** `p003` · **Cue anchors:** `p003-s009–p003-s012`

**Narration**

> Alex, his friend, received the same increase. For this comparison, Alex starts with the same income, the same illustrated spending, and the same monthly savings transfer. Neither has a financial head start in our example. The difference comes from what each person does after the raise arrives.

**Shot composition:** Symmetrical two-shot of Sam and Alex at comparable starting workspaces, each with the same baseline props.

**Emotional beat:** Fairness and curiosity, without assigning a winner.

**Character movement:** Both receive the same raise; Sam opens a listing while Alex looks from a listing to his current desk and keys.

**Camera movement:** Level static framing; use a matched view to make equal starting conditions visible.

**Visual transition:** Follow Sam’s listing into the apartment visit while Alex stays in the established parallel world.

**Animation beats:**

- **`p003-s009`:** Alex receives the same increase.
- **`p003-s010`:** Match the starting pay, cost bundle, and transfer receipt across both sides.
- **`p003-s012`:** Sam pursues the listing; Alex continues considering what he already has.

**State continuity:** Same initial income, expenses, and $400 transfer. Withhold Alex’s future $200/$800 choices until narrated.

**On-screen text:** Same income; Same expenses; Same $600 raise.

### S12 — Find the apartment

**Audio window:** 01:49.401–02:03.741 · **Paragraph:** `p004` · **Cue anchors:** `p004-s001–p004-s003`

**Narration**

> Sam begins with the apartment. He's been browsing listings for months, and now one of them looks possible. The new place has a separate corner for his desk, decent light, and enough room to invite someone over without folding the furniture first.

**Shot composition:** Medium apartment visit with enough room to see Sam, the desk, window, and guest chair together.

**Emotional beat:** Hope becomes concrete satisfaction.

**Character movement:** Sam checks the desk corner, places the laptop, and pulls out the guest chair without folding anything away.

**Camera movement:** One short pan follows him into the usable desk space, then settles.

**Visual transition:** Cut from the benefit he touches to the additional monthly commitment.

**Animation beats:**

- **`p004-s001`:** Sam arrives to inspect the apartment.
- **`p004-s002`:** The listing becomes a real room he can examine.
- **`p004-s003`:** He uses the desk and guest chair to demonstrate the benefit before any calculation.

**State continuity:** Keep the new room’s geography for later scenes. No luxury leap, purchase of a home, or invented moving cost.

**On-screen text:** No text needed.

### S13 — Compare rent with the raise

**Audio window:** 02:03.741–02:12.661 · **Paragraph:** `p004` · **Cue anchors:** `p004-s004–p004-s006`

**Narration**

> It costs three hundred dollars more each month. Sam checks that number against his raise. Six hundred more coming in, three hundred more going out.

**Shot composition:** Over-shoulder view of the rent quote beside Sam’s original raise tray; the room remains visible beyond it.

**Emotional beat:** Careful optimism: the upgrade appears affordable on its own.

**Character movement:** Sam aligns the rent paper with the added pay, slides the $300 commitment into the tray, and checks what is left.

**Camera movement:** Static when $300 and $600 are compared; keep his face at the edge for a readable reaction.

**Visual transition:** Cut on his hand reaching for the lease to the signing view.

**Animation beats:**

- **`p004-s004`:** Show the extra $300 monthly rent only when named.
- **`p004-s005`:** Sam compares the quote with his raise.
- **`p004-s006`:** The rent commitment occupies half the raise tray; the remainder stays visible.

**State continuity:** The tray still represents the same $600 addition. Rent occupies $300 once, leaving $300 of the raise.

**On-screen text:** +$300/month rent; $600 − $300.

### S14 — Sign with room still left

**Audio window:** 02:12.661–02:17.594 · **Paragraph:** `p004` · **Cue anchors:** `p004-s007`

**Narration**

> He can cover the apartment and still have three hundred of the raise available. He signs the lease.

**Shot composition:** Medium signing shot of Sam, followed by a brief matched insert of Alex at the existing cramped desk.

**Emotional beat:** Sam commits with optimism; Alex’s different choice becomes a quiet open question.

**Character movement:** Sam checks the uncommitted amount and signs; Alex considers a similar listing, closes it, and returns to his usable workspace.

**Camera movement:** Static signing; clean match-cut between hands over paperwork. No camera move during the silent Alex insert.

**Visual transition:** Return to Sam’s signed lease for the Month 1 consequence.

**Animation beats:**

- **`p004-s007`:** Within p004-s007, show the remaining $300 on “still have”; on “signs the lease,” Sam signs. Use the phrase tail for Alex closing his listing; set exact word offsets later.

**State continuity:** Alex’s insert is silent foreshadowing of his later stated choice, not a new narrated subplot. His future saving amount remains hidden.

**On-screen text:** $300 of the raise remains.

### S15 — Month one: the transfer increases

**Audio window:** 02:17.594–02:29.354 · **Paragraph:** `p005` · **Cue anchors:** `p005-s001–p005-s003`

**Narration**

> In the first month, his illustrated expenses rise from two thousand six hundred to two thousand nine hundred dollars. With three thousand six hundred coming in, he has seven hundred left. He transfers it to savings.

**Shot composition:** Sam carries the signed rent paper to the same pay-allocation table; a concise calculation accompanies his transfer action.

**Emotional beat:** Satisfaction supported by an understandable result.

**Character movement:** He places the rent commitment with his regular bills, checks what remains, and sends it to savings.

**Camera movement:** Static arithmetic view; cut to his hand for the actual transfer rather than using floating ledger panels.

**Visual transition:** Match the new transfer receipt into the before/after comparison.

**Animation beats:**

- **`p005-s001`:** Combine baseline expenses with the rent addition: $2,900.
- **`p005-s002`:** Reveal the $700 remainder from $3,600 income.
- **`p005-s003`:** Sam taps transfer; show the $700 receipt.

**State continuity:** Month 1 expenses are $2,900; income stays $3,600; the explicit transfer is $700.

**On-screen text:** Month 1; $3,600 − $2,900 = $700.

### S16 — The apartment alone works

**Audio window:** 02:29.354–02:38.994 · **Paragraph:** `p005` · **Cue anchors:** `p005-s004–p005-s006`

**Narration**

> That's more than the four hundred he used to transfer. At this point, the change has improved his home and increased his monthly savings. The apartment alone hasn't undone the raise.

**Shot composition:** Medium Sam working comfortably, with his old and new transfer receipts beside the laptop.

**Emotional beat:** Reassurance: this decision has genuinely improved both comfort and monthly saving.

**Character movement:** He places the $700 receipt beside the old $400 one, then settles into work without clearing dishes.

**Camera movement:** Static; give the comparison a reading hold before returning attention to his relaxed body.

**Visual transition:** Cut from the rent receipt to the recurring rent date for the scope clarification.

**Animation beats:**

- **`p005-s004`:** Compare the old $400 and new $700 receipts.
- **`p005-s005`:** Sam comfortably resumes work at the permanent desk.
- **`p005-s006`:** Hold both benefits together without a warning pose or negative verdict.

**State continuity:** Both receipts are monthly contributions, not absolute balances. The apartment alone has not undone the raise.

**On-screen text:** Before: $400; Month 1: $700.

### S17 — Keep the rent illustration scoped

**Audio window:** 02:38.994–02:47.808 · **Paragraph:** `p005` · **Cue anchors:** `p005-s007–p005-s009`

**Narration**

> We're leaving moving costs and deposits outside this simple comparison. Those would also need money in a real move. For now, we're following the recurring monthly difference.

**Shot composition:** Medium Sam filing the recurring rent paper, with moving-box and deposit symbols outside the calculation boundary.

**Emotional beat:** Clear scope while staying with the character’s real move.

**Character movement:** Sam puts the lease in the monthly-commitment folder; the one-off move materials remain separate and unpriced.

**Camera movement:** Static; no looping icons or animated disclaimer wall.

**Visual transition:** Cut from the filed lease to Sam enjoying the finished room.

**Animation beats:**

- **`p005-s007`:** Place moving costs and deposits outside the recurring comparison.
- **`p005-s008`:** Hold their unpriced presence to acknowledge real cash needs.
- **`p005-s009`:** Return focus to the recurring rent paper Sam files.

**State continuity:** Moving costs and deposits are excluded, not assumed free. The folder now persists beside his future choices.

**On-screen text:** Recurring monthly comparison; Moving costs and deposits excluded.

### S18 — Let the improvement feel useful

**Audio window:** 02:47.808–02:57.388 · **Paragraph:** `p006` · **Cue anchors:** `p006-s001–p006-s004`

**Narration**

> Sam enjoys his new place. The desk stays where he puts it. He no longer clears a work meeting away before dinner. He has a good reason to feel pleased with the decision.

**Shot composition:** Wide apartment shot that lets the viewer see the permanent desk and dinner space together.

**Emotional beat:** Satisfaction shown through ease of movement rather than a smile alone.

**Character movement:** Sam finishes a meeting, leaves the laptop in place, rolls his shoulders comfortably, and moves to dinner without clearing his work.

**Camera movement:** Static composition with a short settle on the now-usable space.

**Visual transition:** Cut on his hand picking up the phone to the car listings.

**Animation beats:**

- **`p006-s001`:** Sam uses the new place naturally.
- **`p006-s003`:** He can move to dinner while the workspace stays intact.
- **`p006-s004`:** Let the relaxed posture and unhurried action register before the next decision.

**State continuity:** Same desk, laptop, lease folder, and improved room as S12–S17. Do not undo the benefit to make a moral point.

**On-screen text:** No text needed.

### S19 — A newer rental car

**Audio window:** 02:57.388–03:12.688 · **Paragraph:** `p006` · **Cue anchors:** `p006-s005–p006-s008`

**Narration**

> Then he starts looking at cars. In our example, Sam uses a long-term rental arrangement for his car. Switching to a newer one raises his monthly transport spending by two hundred and twenty dollars. That's a fictional budget difference, not an advertised deal or a loan payment.

**Shot composition:** Over-shoulder car listing, then medium rental handover beside the newer car.

**Emotional beat:** Fresh interest rather than financial panic.

**Character movement:** Sam reviews the newer rental, tests the door and seat, and reads the monthly difference on the agreement.

**Camera movement:** Clean cut into the rental setting; static during the cost label.

**Visual transition:** Match the seat action into the closer comfort demonstration.

**Animation beats:**

- **`p006-s005`:** Sam opens car listings.
- **`p006-s006`:** Show the long-term rental agreement and keys.
- **`p006-s007`:** Reveal the $220 monthly difference; p006-s008 holds the fictional-budget qualification.

**State continuity:** This is rented transport. Keep the rent folder in Sam’s established world and use no car purchase, financing, or ownership imagery.

**On-screen text:** Long-term rental; +$220/month transport; Fictional difference.

### S20 — What he likes about it

**Audio window:** 03:12.688–03:20.028 · **Paragraph:** `p006` · **Cue anchors:** `p006-s009–p006-s011`

**Narration**

> He likes the newer car. The seats are comfortable. His phone connects without an argument. He starts imagining a trip he kept putting off.

**Shot composition:** Car-interior medium shot, then brief matched insert of Alex with the older rental’s keys.

**Emotional beat:** Sam enjoys the comfort; Alex quietly weighs the same category of choice.

**Character movement:** Sam settles into the seat and connects his phone; Alex looks at a car listing, pockets his existing keys, and keeps the older rental.

**Camera movement:** Static interior for readable gestures; clean insert, then return to Sam’s route view.

**Visual transition:** Match Sam’s phone screen to the close comparison of car cost and raise.

**Animation beats:**

- **`p006-s009`:** Sam tests and likes the newer car.
- **`p006-s010`:** He settles in and connects the phone; contrast Alex retaining the older keys in a brief insert.
- **`p006-s011`:** Return to Sam imagining the postponed trip, not paying for it.

**State continuity:** Alex’s insert foreshadows the later narrated decision without a number or separate voice. Both cars remain usable rentals.

**On-screen text:** No text needed.

### S21 — A manageable number in isolation

**Audio window:** 03:20.028–03:24.271 · **Paragraph:** `p006` · **Cue anchors:** `p006-s012`

**Narration**

> Two hundred and twenty feels manageable beside the extra six hundred in his paycheck.

**Shot composition:** Tight Sam-point-of-view framing includes only the $220 car quote and $600 raise; the rent folder is physically outside the crop.

**Emotional beat:** Confidence built on an incomplete comparison.

**Character movement:** Sam taps the car quote, glances at the raise notice, and gives a small confirming nod.

**Camera movement:** Static close view that deliberately excludes the already-present rent commitment; no disappearing prop.

**Visual transition:** Continue the same tabletop shot into S22’s pullback.

**Animation beats:**

- **`p006-s012`:** On “manageable,” Sam compares $220 with $600; his hand moves toward agreement. Hold the limited field of view until the next scene.

**State continuity:** The $300 rent paper stays on the same table beyond the frame. This is Sam’s attention, not a reset of available money.

**On-screen text:** $220 compared with a $600 raise.

### S22 — Spend the same raise only once

**Audio window:** 03:24.271–03:33.131 · **Paragraph:** `p007` · **Cue anchors:** `p007-s001–p007-s002`

**Narration**

> But he's already using three hundred of that six hundred for the apartment. After the car change, only eighty dollars of the raise remains available.

**Shot composition:** Continue S21’s tabletop view, then reveal the full allocation tray, rent folder, and Sam’s body in a wider shot.

**Emotional beat:** The viewer notices the missing commitment; Sam shows the first hint of uncertainty.

**Character movement:** Sam’s confident hand stops briefly as the rent paper comes into the wider view; he brings the car quote alongside it.

**Camera movement:** One purposeful pullback reveals what was already there, then locks off for the subtraction.

**Visual transition:** Cut from the small uncommitted remainder to the Month 2 transfer action.

**Animation beats:**

- **`p007-s001`:** Pull back on “already using” to reveal rent occupying $300 of the same raise.
- **`p007-s002`:** Place the $220 car commitment beside it; reveal the $80 remainder. Let the body pause before moving on.

**State continuity:** Preserve the same table, $600 raise, $300 rent, and $220 car cost. Only $80 of the raise remains; no second raise appears.

**On-screen text:** $600 − $300 − $220 = $80.

### S23 — Month two still feels positive

**Audio window:** 03:33.131–03:55.111 · **Paragraph:** `p007` · **Cue anchors:** `p007-s003–p007-s007`

**Narration**

> In month two, his illustrated spending reaches three thousand one hundred and twenty dollars. He transfers the remaining four hundred and eighty to savings. He is still saving more each month than he did before the raise. The improvement has become smaller, but the transfer is positive, and he can pay the bills we've included. So he doesn't feel as though he's crossed a line.

**Shot composition:** Medium Sam completing the Month 2 transfer, with a short $480 receipt comparison against the earlier $400.

**Emotional beat:** Mixed relief: he can still pay the illustrated bills and save more than before.

**Character movement:** Sam checks the complete bill bundle, sends the remainder, and releases his breath while setting the receipt down.

**Camera movement:** Static during the transaction; a closer hand insert makes the transfer concrete.

**Visual transition:** Cut from the receipt to Sam considering the car’s separate cost again.

**Animation beats:**

- **`p007-s003`:** Show total expenses reaching $3,120.
- **`p007-s004`:** Sam sends $480 into savings.
- **`p007-s005`:** Compare with his original $400, then hold his relief through p007-s006–p007-s007.

**State continuity:** Income remains $3,600; expenses are $3,120; transfer is $480. Keep the smaller $80 raise remainder distinct from total saving.

**On-screen text:** Month 2; $3,120 expenses; $480 transferred; Before: $400.

### S24 — Separate checks hide the combined result

**Audio window:** 03:55.111–04:05.453 · **Paragraph:** `p007` · **Cue anchors:** `p007-s008–p007-s009`

**Narration**

> When Sam thinks about the car, he thinks about whether he can cover its extra cost. He doesn't sit down and decide whether the apartment and the car together leave enough for the savings goal he had in mind.

**Shot composition:** Over Sam’s shoulder: car quote in foreground, full commitment folder and saving-goal note visible behind his hand.

**Emotional beat:** Uncertainty that he has not yet turned into a full-budget question.

**Character movement:** He checks the separate quote, almost reaches for the goal note, then leaves the full folder closed.

**Camera movement:** Static; a paused reach and change in gaze carry the thought.

**Visual transition:** Cut on the phone being lifted into the services scene.

**Animation beats:**

- **`p007-s008`:** Sam checks whether the separate car cost fits.
- **`p007-s009`:** Keep the combined folder within reach but unopened as he moves toward another choice.

**State continuity:** Rent and transport remain committed. Do not invent a savings target amount.

**On-screen text:** Apartment + transport; Savings goal.

### S25 — Small services become one monthly cost

**Audio window:** 04:05.453–04:19.553 · **Paragraph:** `p008` · **Cue anchors:** `p008-s001–p008-s003`

**Narration**

> The last hundred dollars arrives in smaller pieces. Sam adds some entertainment services, upgrades a membership, and keeps a couple of subscriptions he meant to review. Together, those choices add one hundred dollars to his monthly spending.

**Shot composition:** Medium Sam using his phone beside the fixed raise tray; three service tiles gather beside his arm.

**Emotional beat:** Easy enjoyment while commitments quietly consume the same limited space.

**Character movement:** He accepts a service, upgrades a membership, and leaves another active; each relaxed phone gesture leaves a commitment behind.

**Camera movement:** Static; introduce one tile at a time and keep the shrinking remainder visible.

**Visual transition:** Cut into the evening use and password action.

**Animation beats:**

- **`p008-s001`:** Begin with small everyday decisions.
- **`p008-s002`:** Each phone action adds one service tile beside the existing commitments.
- **`p008-s003`:** Group them at $100/month; their combined space presses beyond the raise.

**State continuity:** Keep rent $300 and transport $220 in the same $600 tray. No invented prices for individual services.

**On-screen text:** +$100/month services and memberships.

### S26 — Some are used, some are forgotten

**Audio window:** 04:19.553–04:27.381 · **Paragraph:** `p008` · **Cue anchors:** `p008-s004–p008-s005`

**Narration**

> He uses some of them often. Others are there because canceling requires finding a password, and he has more interesting plans for his evening.

**Shot composition:** Medium evening view of Sam, then a brief matched insert of Alex considering an optional service.

**Emotional beat:** Sam’s enjoyment becomes avoidance; Alex remains an active comparison.

**Character movement:** Sam uses one service, pauses at a password prompt, then puts the phone down; Alex pauses before adding an optional commitment.

**Camera movement:** Static paired inserts, with no camera movement across phone text.

**Visual transition:** Cut from the unattended tiles to the combined-cost reveal.

**Animation beats:**

- **`p008-s004`:** Show a service Sam actually uses.
- **`p008-s005`:** He leaves a forgotten service active; briefly contrast Alex pausing before a new commitment.

**State continuity:** Sam has canceled nothing. Alex’s silent insert reveals no future allowance or savings amount.

**On-screen text:** No text needed.

### S27 — Month three: additions pass the raise

**Audio window:** 04:27.381–04:40.641 · **Paragraph:** `p009` · **Cue anchors:** `p009-s001–p009-s005`

**Narration**

> By month three, the recurring additions total six hundred and twenty dollars. Three hundred for the apartment. Two hundred and twenty for transport. One hundred for the services and memberships. His raise was six hundred.

**Shot composition:** Wide tabletop: rent paper, rental keys, and services occupy one fixed raise tray in front of Sam.

**Emotional beat:** Realization: separate reasonable choices have become one combined cost.

**Character movement:** Sam aligns the last tile, tries to fit all commitments together, then stops and looks across the whole arrangement.

**Camera movement:** One short widening reveals the combined space; lock off before the numeric comparison.

**Visual transition:** Cut from the overfilled additions tray to the full monthly paycheck.

**Animation beats:**

- **`p009-s001`:** Reveal the spoken $620 total as Sam sees the whole list.
- **`p009-s002`:** Identify rent $300; p009-s003 and p009-s004 identify transport $220 and services $100 in sequence.
- **`p009-s005`:** Bring the unchanged $600 notice alongside; Sam’s hand stops at the excess.

**State continuity:** The tray compares added costs with a $600 raise, not a borrowing limit. Show no overdraft, fee, or negative bank balance.

**On-screen text:** $300 + $220 + $100 = $620; Raise: $600.

### S28 — Calculate and transfer the new remainder

**Audio window:** 04:40.641–04:50.481 · **Paragraph:** `p009` · **Cue anchors:** `p009-s006–p009-s008`

**Narration**

> Now his monthly spending is three thousand two hundred and twenty dollars. He earns three thousand six hundred, so three hundred and eighty remains. He transfers that amount to savings.

**Shot composition:** Over Sam’s shoulder paying from the full paycheck, followed by a close transfer-screen insert.

**Emotional beat:** Realization becomes a concrete monthly consequence.

**Character movement:** He gathers the obligations, checks the smaller remainder, and sends it to savings more slowly than before.

**Camera movement:** Static during the subtraction; keep the phone and his hand readable.

**Visual transition:** Match the phone into the opening’s transfer comparison.

**Animation beats:**

- **`p009-s006`:** Show full monthly expenses of $3,220.
- **`p009-s007`:** Reveal $380 remaining from $3,600.
- **`p009-s008`:** Sam transfers that same $380 and keeps the receipt.

**State continuity:** $3,600 income covers $3,220 expenses and leaves positive $380. No debt or account-balance claim.

**On-screen text:** $3,600 − $3,220 = $380 transferred.

### S29 — Resolve the smaller-transfer hook

**Audio window:** 04:50.481–04:58.161 · **Paragraph:** `p009` · **Cue anchors:** `p009-s009–p009-s011`

**Narration**

> Before the raise, he transferred four hundred. Now he transfers three hundred and eighty. That is the smaller transfer from the opening.

**Shot composition:** Exact phone-and-desk framing from S03, now with legible old and new transfer entries.

**Emotional beat:** The opening question resolves into a specific monthly difference.

**Character movement:** Sam checks the dates, places the old receipt beside the new one, and rests the phone with a thoughtful pause.

**Camera movement:** Match-cut into the familiar framing; hold still for the comparison.

**Visual transition:** Widen to include the useful improvements around him.

**Animation beats:**

- **`p009-s009`:** Reveal the original $400 monthly transfer.
- **`p009-s010`:** Reveal Month 3 at $380 in the matched position.
- **`p009-s011`:** Hold Sam’s recognition of the smaller transfer.

**State continuity:** $400 and $380 are monthly transfer amounts. Leave the savings balance unspecified.

**On-screen text:** Before: $400/month; Month 3: $380/month; $20 less.

### S30 — Two real outcomes on one statement

**Audio window:** 04:58.161–05:07.006 · **Paragraph:** `p009` · **Cue anchors:** `p009-s012–p009-s014`

**Narration**

> Sam has improved several parts of his daily life. He has also reduced the amount he saves each month by twenty dollars. Both results fit on the same statement.

**Shot composition:** Medium-wide Sam in the improved room, with the transfer comparison resting on the desk.

**Emotional beat:** Mixed feelings: he values the benefits and recognizes their cost.

**Character movement:** He looks from the permanent desk to the rental keys, then returns to the receipt with a seated weight shift.

**Camera movement:** Static, level view; benefits and consequence coexist without a judgmental split screen.

**Visual transition:** Cut on his hand filing the receipt into the contribution folder.

**Animation beats:**

- **`p009-s012`:** Sam acknowledges the improvements around him.
- **`p009-s013`:** Identify the $20 lower monthly saving.
- **`p009-s014`:** Hold both outcomes in the same calm composition.

**State continuity:** The $20 monthly reduction does not imply a $20 loss of accumulated wealth.

**On-screen text:** Better daily comfort; $380 monthly savings transfer.

### S31 — Savings are still increasing

**Audio window:** 05:07.006–05:15.926 · **Paragraph:** `p010` · **Cue anchors:** `p010-s001–p010-s003`

**Narration**

> Twenty dollars might seem like a small problem. And in this example, Sam is still adding to his savings. His balance hasn't collapsed.

**Shot composition:** Close view of Sam filing the Month 3 contribution receipt; keep part of his posture in view.

**Emotional beat:** Reassurance without removing the concern about monthly direction.

**Character movement:** He adds the positive receipt and opens the folder to check earlier months, rather than emptying a savings container.

**Camera movement:** Static hand-level view opening into the three-month arrangement.

**Visual transition:** The folder opening reveals the three existing receipts in S32.

**Animation beats:**

- **`p010-s001`:** Keep the $20 reduction as a monthly comparison note.
- **`p010-s002`:** Sam files the positive Month 3 transfer.
- **`p010-s003`:** The folder remains intact as he checks the full period.

**State continuity:** Show new contributions only, with no invented initial balance or collapsing savings jar.

**On-screen text:** +$380 added this month.

### S32 — Compare the three-month totals fairly

**Audio window:** 05:15.926–05:31.666 · **Paragraph:** `p010` · **Cue anchors:** `p010-s004–p010-s006`

**Narration**

> In fact, over these first three months, he saves seven hundred, then four hundred and eighty, then three hundred and eighty dollars. That's one thousand five hundred and sixty in total. At his old four-hundred-dollar pace, three months would have added one thousand two hundred.

**Shot composition:** Top-down Sam laying three dated contribution envelopes beside an old-pace comparison row.

**Emotional beat:** Attention expands from one month to a fair view of the period.

**Character movement:** He places Month 1, Month 2, and Month 3 in order, totals the contributions, and compares the old-pace row.

**Camera movement:** Static during sums; retain this same illustration for S33 instead of producing another ledger.

**Visual transition:** Keep the arrangement and change only the area of attention.

**Animation beats:**

- **`p010-s004`:** Place the three dated contributions in sequence.
- **`p010-s005`:** Resolve their addition to $1,560.
- **`p010-s006`:** Place the old-pace row underneath, totaling $1,200.

**State continuity:** $700 + $480 + $380 = $1,560; the old $400 pace totals $1,200 across the same three dates.

**On-screen text:** $700 + $480 + $380 = $1,560; Old pace: $400 × 3 = $1,200.

### S33 — Separate monthly pace from accumulated saving

**Audio window:** 05:31.666–05:43.346 · **Paragraph:** `p010` · **Cue anchors:** `p010-s007–p010-s011`

**Narration**

> So the claim is precise: by the third month, his monthly saving has fallen below its old level. He hasn't saved less across the entire three months. He hasn't become poorer in every possible sense.

**Shot composition:** Remain over the same envelopes; emphasize Month 3, then the entire three-month row.

**Emotional beat:** Understanding that the two comparisons measure different things.

**Character movement:** Sam points to the final month, then opens his hand across all three contributions.

**Camera movement:** One restrained reframe from the final month to the full row, followed by a reading hold.

**Visual transition:** Cut from Sam’s open hand to the unchanged pay notice.

**Animation beats:**

- **`p010-s007`:** Direct attention to the precise claim and hold through p010-s008.
- **`p010-s009`:** Compare Month 3 $380 with the earlier $400 monthly pace.
- **`p010-s010`:** Open to the whole period: $1,560 exceeds $1,200; hold through p010-s011 without a wealth claim.

**State continuity:** Keep the same totals. Hold through ASR-only p010-s008 without inventing an event for “price.”

**On-screen text:** Monthly: $380 vs $400; Three months: $1,560 vs $1,200.

### S34 — Income and keeping money are different measures

**Audio window:** 05:43.346–05:58.006 · **Paragraph:** `p010` · **Cue anchors:** `p010-s012–p010-s015`

**Narration**

> The problem shows up in the direction he's now heading. His higher income supports higher recurring spending, while his monthly savings transfer has fallen back below where it started. The six hundred dollars in his raise tells us how much more money he receives. It doesn't tell us how much he keeps.

**Shot composition:** Medium Sam between pay notice and commitment folder; brief equal-height Alex insert at his own workspace.

**Emotional beat:** Thoughtful uncertainty about what is kept; curiosity about Alex persists.

**Character movement:** Sam carries the notice toward his commitments and looks back at his transfer record; Alex quietly checks his chosen commitments.

**Camera movement:** Static character views connected by a clean insert, without another full-screen diagram.

**Visual transition:** Follow Sam taking up the phone into the literal transfer demonstration.

**Animation beats:**

- **`p010-s012`:** Sam considers where the monthly pattern leads.
- **`p010-s013`:** Place ongoing commitments beside his smaller transfer receipt.
- **`p010-s014`:** Contrast unchanged extra pay with what is kept, finishing p010-s015 with a silent Alex check-in.

**State continuity:** Preserve Sam’s Month 3 state and the same $600 addition. Do not reveal Alex’s $800 yet.

**On-screen text:** Additional income: $600; Month 3 transfer: $380.

### S35 — Remaining becomes saving through the transfer

**Audio window:** 05:58.006–06:16.146 · **Paragraph:** `p011` · **Cue anchors:** `p011-s001–p011-s005`

**Narration**

> A bank transfer also matters here. Money remaining after the expenses we've shown is only a calculation. In this story, Sam moves that remainder into savings and leaves it there. That's why we can describe it as saving. Without that action, we could only say the money was left over in our illustration.

**Shot composition:** Over-shoulder banking action with one amount moving from available cash to savings.

**Emotional beat:** Agency: the explicit transfer makes the saving claim concrete.

**Character movement:** Sam checks the remainder, taps transfer, saves the receipt, and leaves the money retained.

**Camera movement:** Static through the transaction, without simultaneous diagram branches.

**Visual transition:** Cut from the receipt to a brief generic reference-book page.

**Animation beats:**

- **`p011-s001`:** Sam opens the transfer screen.
- **`p011-s002`:** Hold the remainder as available before it moves.
- **`p011-s003`:** Make and retain the transfer; p011-s004–p011-s005 explain that same action without a new graphic.

**State continuity:** The same $380 changes destination once. Do not count it as both spendable and already saved.

**On-screen text:** Remaining; Transferred to savings.

### S36 — Explain the wider net-worth concept

**Audio window:** 06:16.146–06:25.646 · **Paragraph:** `p011` · **Cue anchors:** `p011-s006–p011-s008`

**Narration**

> And savings are one part of a person's finances. To measure net worth, you subtract what someone owes from what they own. A salary figure alone doesn't give you that answer.

**Shot composition:** Brief over-shoulder insert of a neutral reference-book page with an unnumbered assets/liabilities relationship.

**Emotional beat:** Perspective without abandoning the character’s question.

**Character movement:** Sam turns one page, follows both sides with a finger, then looks back toward his real receipt.

**Camera movement:** Static insert; keep this explanation short within its unchanged narration window.

**Visual transition:** Cut as the book closes and the transfer record returns.

**Animation beats:**

- **`p011-s006`:** Briefly widen the topic beyond savings.
- **`p011-s007`:** Reveal only “Net worth = assets − liabilities.”
- **`p011-s008`:** Return Sam’s attention to the paycheck, which cannot alone answer that wider question.

**State continuity:** The page is generic. Assign neither character debt, car ownership, house equity, or a net-worth figure.

**On-screen text:** Net worth = assets − liabilities.

### S37 — Return to what this story measures

**Audio window:** 06:25.646–06:33.921 · **Paragraph:** `p011` · **Cue anchors:** `p011-s009–p011-s010`

**Narration**

> We're tracking cash saved here. We aren't calculating either character's complete net worth, investment returns, or the value of everything they own.

**Shot composition:** Medium Sam closing the reference book and drawing his actual commitment folder closer.

**Emotional beat:** Focus returns to decisions the viewer can observe.

**Character movement:** He sets the book aside while keeping transfer receipts visible, then opens the folder.

**Camera movement:** Static; the hand action redirects attention without another title card.

**Visual transition:** Match the opening folder to the individual commitments in S38.

**Animation beats:**

- **`p011-s009`:** Keep the transfer record as the hero object.
- **`p011-s010`:** Close the generic page and return to Sam’s real monthly choices.

**State continuity:** Keep only cash contributions in the active comparison; no invented balance sheet remains.

**On-screen text:** This comparison: cash saved.

### S38 — Several commitments share one paycheck

**Audio window:** 06:33.921–06:48.421 · **Paragraph:** `p012` · **Cue anchors:** `p012-s001–p012-s004`

**Narration**

> What we can see is that Sam assessed each upgrade against his bigger paycheck. The combined monthly cost grew past the raise. He never made one enormous purchase that explained the whole change. He made several smaller commitments, and then paid them together.

**Shot composition:** Medium-to-overhead view of Sam arranging the actual rent paper, rental agreement, and services beside one pay packet.

**Emotional beat:** Realization: separate checks hid the combined obligation.

**Character movement:** He retrieves each document, places it with the others, and flattens the set with both hands to inspect it together.

**Camera movement:** Begin with Sam; use one overhead cut and hold while he combines the documents.

**Visual transition:** Match a receipt placed down to the dinner receipt in S39.

**Animation beats:**

- **`p012-s001`:** Sam revisits the choices he checked separately.
- **`p012-s002`:** The real commitments share one space and exceed the raise.
- **`p012-s004`:** Gather them into one recurring list; add no purchase at p012-s003.

**State continuity:** Reuse $300/$220/$100 and the same $600 raise. No new enormous purchase causes the change.

**On-screen text:** Combined additions: $620/month.

### S39 — A one-time celebration

**Audio window:** 06:48.421–06:53.421 · **Paragraph:** `p012` · **Cue anchors:** `p012-s005–p012-s006`

**Narration**

> The timing matters. If Sam celebrates with one dinner, he pays for that dinner once.

**Shot composition:** Medium dinner-table view and close insert of a paid receipt filed on one calendar date.

**Emotional beat:** A simple, pleasant action makes the frequency contrast relatable.

**Character movement:** Sam finishes the meal, pays once, and files the receipt with that past date; his hand leaves the next date clear.

**Camera movement:** Static dinner shot and clean receipt insert; do not make money evaporate.

**Visual transition:** Match the one dated receipt to a recurring charge on the next page.

**Animation beats:**

- **`p012-s005`:** Move attention from total cost to payment frequency.
- **`p012-s006`:** Pay once, file the receipt on one date, and leave the following date clear.

**State continuity:** No dinner price is invented. A receipt leaving future dates means no repeat payment, not a refund.

**On-screen text:** One-time spending.

### S40 — A recurring commitment repeats

**Audio window:** 06:53.421–07:03.116 · **Paragraph:** `p012` · **Cue anchors:** `p012-s007–p012-s008`

**Narration**

> If he changes his monthly spending, he has to find room for the new amount in each following month. To compare those choices, he needs to know how often he'll pay, as well as how much.

**Shot composition:** Same calendar framing as S39, with Sam turning successive monthly pages and finding the recurring commitment again.

**Emotional beat:** Recognition that obligations can precede next month’s choices.

**Character movement:** He turns a page, encounters the charge, turns once more, then stops to read its recurrence.

**Camera movement:** Static while the pages move under his hand; no perpetual loop.

**Visual transition:** Cut from the returning charge to the already-reserved pay tray.

**Animation beats:**

- **`p012-s007`:** The same commitment returns when the next month arrives.
- **`p012-s008`:** A second page turn makes frequency visible; Sam then holds and considers it.

**State continuity:** Use the existing recurring-cost concept without new prices. Stop after a finite comparison.

**On-screen text:** Recurring monthly spending.

### S41 — The next decision starts after existing commitments

**Audio window:** 07:03.116–07:15.916 · **Paragraph:** `p013` · **Cue anchors:** `p013-s001–p013-s002`

**Narration**

> When he looks at his paycheck, the raise still looks like six hundred dollars he can use. But before he considers anything new, he's already paying the extra rent and transport costs. That leaves a different starting point for the next decision.

**Shot composition:** Sam-point-of-view of the raise notice, widened to show the rent and transport commitments already reserved.

**Emotional beat:** Awareness of the true starting point for another choice.

**Character movement:** He reaches toward the apparent $600, notices its attached commitments, and measures the smaller remainder.

**Camera movement:** One purposeful widening inside the combined first cue, then lock off.

**Visual transition:** Cut from the remainder to the optional services decision.

**Animation beats:**

- **`p013-s001`:** Within p013-s001, begin on “six hundred” and widen on “already paying” to reveal the reservations.
- **`p013-s002`:** Hold the smaller starting point as Sam pauses before deciding.

**State continuity:** $300 rent and $220 transport leave $80 of the raise, not $80 of the entire budget.

**On-screen text:** $600 − $300 − $220 = $80 available from the raise.

### S42 — Show the tradeoff before the click

**Audio window:** 07:15.916–07:28.908 · **Paragraph:** `p013` · **Cue anchors:** `p013-s003–p013-s005`

**Narration**

> In month three, adding a service means either reducing another expense or reducing what he transfers to savings. In this example, he lets the transfer fall. Reading the full list together would have shown him that tradeoff before he agreed to it.

**Shot composition:** Over-shoulder full-list decision with Sam, matched to a silent Alex insert checking his own list.

**Emotional beat:** Sam sees the tradeoff late; the comparison question turns toward Alex.

**Character movement:** Sam places the $100 service group into the plan and follows the transfer consequence; Alex checks commitments before confirming an optional choice.

**Camera movement:** Static decision shots with a brief matched insert, using the unchanged pay notice as a bridge.

**Visual transition:** Carry Alex’s hand and gaze into his narrated story in S43.

**Animation beats:**

- **`p013-s003`:** The service competes with another cost or the savings transfer.
- **`p013-s004`:** Sam accepts the smaller transfer.
- **`p013-s005`:** Show the whole list before the hand confirms; finish with Alex checking his plan.

**State continuity:** Sam’s potential $480 transfer becomes $380 with the services. Reveal no new Alex amounts yet.

**On-screen text:** Services: +$100/month; Savings transfer: $480 to $380.

### S43 — Alex enjoys some of the raise

**Audio window:** 07:28.908–07:42.948 · **Paragraph:** `p014` · **Cue anchors:** `p014-s001–p014-s004`

**Narration**

> Alex also wants to enjoy the raise. He keeps his current apartment and car for this comparison, but allows himself an extra two hundred dollars a month for things he values. Some goes toward a hobby. Some makes room for meals out.

**Shot composition:** Continue with Alex in the existing apartment, then show his hobby and a meal out.

**Emotional beat:** Enjoyment and intention rather than saintly self-denial.

**Character movement:** Alex checks the allowance, uses a hobby item, and makes room for a meal while retaining his old rental keys.

**Camera movement:** Static character actions with clean inserts; no celebratory money effects.

**Visual transition:** Match the spending record to Alex’s actual paycheck transaction.

**Animation beats:**

- **`p014-s001`:** Bring the previously glimpsed Alex into the foreground.
- **`p014-s002`:** Keep his home/car and reveal the $200 allowance.
- **`p014-s003`:** Show the hobby, then p014-s004 shows the meal as part of the same allowance.

**State continuity:** First reveal the extra $200 here when narrated. Keep the existing home and rental; individual activity prices remain unspecified.

**On-screen text:** +$200/month for chosen spending.

### S44 — Calculate Alex’s transfer

**Audio window:** 07:42.948–07:58.248 · **Paragraph:** `p014` · **Cue anchors:** `p014-s005–p014-s008`

**Narration**

> He spends more than before. His illustrated expenses increase from two thousand six hundred to two thousand eight hundred dollars. With three thousand six hundred coming in, he has eight hundred left. He transfers that amount into savings each month.

**Shot composition:** Over Alex’s shoulder paying his illustrated bills, with a concise calculation beside the transfer screen.

**Emotional beat:** Confidence grounded in a plan he has checked.

**Character movement:** He places the $200 choice beside baseline costs, reviews the total, and transfers the remainder.

**Camera movement:** Static for subtraction, then a close hand insert for the transfer.

**Visual transition:** Match the $800 receipt into its two-source explanation.

**Animation beats:**

- **`p014-s005`:** Acknowledge that Alex spends more too.
- **`p014-s006`:** Combine baseline $2,600 and added $200 into $2,800.
- **`p014-s007`:** Reveal $800 remaining; p014-s008 shows the actual transfer.

**State continuity:** Same $3,600 income; $2,800 spending. Reveal the future $800 only on its narrated cue.

**On-screen text:** $3,600 − $2,800 = $800 transferred.

### S45 — Where Alex’s $800 comes from

**Audio window:** 07:58.248–08:07.071 · **Paragraph:** `p014` · **Cue anchors:** `p014-s009–p014-s011`

**Narration**

> Four hundred was his old transfer. Four hundred is the part of the raise he chooses to keep. The remaining two hundred of the raise improves his spending budget.

**Shot composition:** Close table view of Alex grouping the transfer into baseline and added-saving portions, with enjoyment still beside them.

**Emotional beat:** Clarity about what he keeps and what he chooses to enjoy.

**Character movement:** He places the original $400 first, joins $400 retained from the raise, then returns his hand to the $200 spending allowance.

**Camera movement:** Static, revealing one role at a time through his hands.

**Visual transition:** Cut from the completed plan to scheduling its transfer.

**Animation beats:**

- **`p014-s009`:** Identify the original $400 contribution.
- **`p014-s010`:** Join the $400 retained from the raise.
- **`p014-s011`:** Show the remaining $200 of the raise supporting enjoyment.

**State continuity:** The $800 includes the old $400. The raise supplies $400 saved and $200 spent, not a new $800.

**On-screen text:** $800 = $400 baseline + $400 from raise; $200 extra spending.

### S46 — Automation carries out a checked plan

**Audio window:** 08:07.071–08:19.951 · **Paragraph:** `p015` · **Cue anchors:** `p015-s001–p015-s003`

**Narration**

> Alex sets up a transfer after his pay arrives, with enough left to cover the expenses in this example. Automating it carries out a plan he's already checked. It wouldn't fix an amount he couldn't afford or bills he'd forgotten.

**Shot composition:** Medium Alex checking his actual commitments before a close insert of the scheduled-transfer setting.

**Emotional beat:** Quiet control built on preparation.

**Character movement:** Alex checks bills, confirms available spending, then enables the transfer after pay arrives; his hands settle when the plan is complete.

**Camera movement:** Static while the plan is read; one hand insert for the setting change.

**Visual transition:** Match the confirming hand to the next optional-purchase decision.

**Animation beats:**

- **`p015-s001`:** Alex checks the budget and schedules the transfer after pay.
- **`p015-s002`:** Enable the setting only after the plan is checked.
- **`p015-s003`:** Keep the real expense papers visible while the narration states the limitation.

**State continuity:** The $800 transfer follows pay and checked expenses. Automation supplies no extra money or protection against unaffordable commitments.

**On-screen text:** Pay arrives; Planned transfer: $800.

### S47 — See the effect of the next choice

**Audio window:** 08:19.951–08:35.505 · **Paragraph:** `p015` · **Cue anchors:** `p015-s004–p015-s007`

**Narration**

> Before choosing another upgrade, he checks it against the spending amount he has available. If a purchase doesn't fit, he can postpone it or change the plan and accept a smaller savings transfer. He can spend the money. He just sees the effect on his saving goal while he's making the choice.

**Shot composition:** Over-shoulder Alex considering an unpriced optional purchase beside his chosen spending allowance.

**Emotional beat:** Agency: he sees a tradeoff while there is still time to choose.

**Character movement:** He compares the purchase with the allowance, pauses, and either sets it aside or revisits his plan before confirming.

**Camera movement:** Static; a single decisive hand movement resolves the choice, without a branching graphic forest.

**Visual transition:** Cut from the retained original rental keys to Alex’s existing home/car.

**Animation beats:**

- **`p015-s004`:** Alex checks the purchase against available spending.
- **`p015-s005`:** Show postponing or revising the plan as an explicit choice.
- **`p015-s007`:** Hold his awareness of the saving consequence; p015-s006 leaves his freedom to spend intact.

**State continuity:** Alternative outcomes stay unpriced. Do not claim a new transfer amount, free purchase, or automatic ideal choice.

**On-screen text:** Postpone; Adjust the plan.

### S48 — Alex gives up comforts too

**Audio window:** 08:35.505–08:45.825 · **Paragraph:** `p016` · **Cue anchors:** `p016-s001–p016-s004`

**Narration**

> He has made a tradeoff. His apartment still has the cramped work corner. His car is still the older rental. Sam gets benefits Alex has chosen to postpone.

**Shot composition:** Matched medium views of Alex working in the cramped corner and Sam using the better workspace, then their different rental keys.

**Emotional beat:** Fairness: Alex’s extra saving has a real comfort tradeoff.

**Character movement:** Alex shifts his laptop around dishes while Sam leaves his in place; Alex uses the older rental without a heroic pose.

**Camera movement:** Static matched framing and equal camera height; neither side gets a victory angle.

**Visual transition:** Widen the comparison boundary to acknowledge different starting needs.

**Animation beats:**

- **`p016-s001`:** Introduce the tradeoff through Alex’s actual routine.
- **`p016-s002`:** His cramped work corner still requires rearranging.
- **`p016-s004`:** Match to the comforts Sam receives, with p016-s003 retaining Alex’s older rental.

**State continuity:** Both men remain dignified; Alex keeps the existing home and rented car. Show postponed benefits, not universal advice to tolerate unsafe conditions.

**On-screen text:** Different choices; Different benefits.

### S49 — State the comparison’s limits

**Audio window:** 08:45.825–08:58.909 · **Paragraph:** `p016` · **Cue anchors:** `p016-s005–p016-s007`

**Narration**

> For someone facing an unsafe home or unreliable transport, those choices could look different. We've given these characters the same starting conditions to isolate the spending decisions. Real households don't all have the same options.

**Shot composition:** Sam and Alex remain within the equal-start example frame while neutral housing-safety and transport-reliability symbols appear outside it.

**Emotional beat:** Empathy and scope, not a new fear-driven subplot.

**Character movement:** Keep the two characters calm within their established usable conditions; the outside symbols briefly show why another household’s choice could differ.

**Camera movement:** Static wide frame; keep the scope clarification readable and brief.

**Visual transition:** Return to the two real contribution folders on the same calendar.

**Animation beats:**

- **`p016-s005`:** Acknowledge needs that could change a real decision.
- **`p016-s006`:** Reassert the matched starting conditions for these characters.
- **`p016-s007`:** Clear the neutral symbols and return to the example without declaring a universally better lifestyle.

**State continuity:** No emergency, injury, repair bill, or debt is assigned to either character. Preserve the example’s adequate starting conditions.

**On-screen text:** Same starting conditions in this example; Real options differ.

### S50 — Compare new savings over three months

**Audio window:** 08:58.909–09:10.369 · **Paragraph:** `p017` · **Cue anchors:** `p017-s001–p017-s003`

**Narration**

> Over the three months, Alex saves eight hundred dollars each month, totaling two thousand four hundred. Sam saves one thousand five hundred and sixty. The difference is eight hundred and forty dollars.

**Shot composition:** Equal split-screen: Sam files his three contributions in the improved room; Alex files his in the original room.

**Emotional beat:** Curiosity resolves into a concrete difference with visible lifestyle context.

**Character movement:** Both file dated receipts by hand. Alex’s three equal contributions and Sam’s uneven contributions accumulate only as their named amounts appear.

**Camera movement:** Static shared calendar alignment; a hand-level insert can clarify each total before returning to the two people.

**Visual transition:** Keep both sides for the explanation of the gap, then narrow to Month 3.

**Animation beats:**

- **`p017-s001`:** Alex files three $800 contributions, totaling $2,400.
- **`p017-s002`:** Sam files $700, $480, and $380, totaling $1,560.
- **`p017-s003`:** Reveal the $840 contribution gap while both living situations remain visible.

**State continuity:** Compare new contributions across the same three months: Alex $2,400, Sam $1,560, difference $840. Initial balances stay unknown.

**On-screen text:** Alex: $2,400; Sam: $1,560; Difference: $840.

### S51 — Explain the gap, then return to monthly pace

**Audio window:** 09:10.369–09:26.569 · **Paragraph:** `p017` · **Cue anchors:** `p017-s004–p017-s008`

**Narration**

> No investment return created that gap. Alex didn't get a bigger raise. He spent less of the additional income and transferred more to savings. By month three, their monthly transfers are four hundred and twenty dollars apart: eight hundred for Alex, three hundred and eighty for Sam.

**Shot composition:** Remain with both characters and matching raise notices; shift from their contribution folders to Month 3 transfer receipts.

**Emotional beat:** Understanding the cause without crowning a winner.

**Character movement:** Each sets outgoing commitment papers beside the same pay notice, then places the Month 3 transfer receipt in front.

**Camera movement:** Static during the changed comparison label and amounts; no racing growth bars.

**Visual transition:** Widen from the receipts to what each character values in the next shot.

**Animation beats:**

- **`p017-s004`:** Keep contributions grounded in actual transfers, with no investment-growth effect.
- **`p017-s006`:** Show how different extra spending leaves different retained amounts; p017-s005 keeps raises equal.
- **`p017-s007`:** Label Month 3 monthly difference $420; p017-s008 shows Alex $800 and Sam $380 in sequence.

**State continuity:** No investment return or bigger raise. Switch clearly from cumulative $840 to monthly $420; never compare incompatible time windows.

**On-screen text:** Month 3 monthly transfers: $800 vs $380; Difference: $420.

### S52 — They bought different benefits

**Audio window:** 09:26.569–09:35.013 · **Paragraph:** `p017` · **Cue anchors:** `p017-s009–p017-s010`

**Narration**

> Sam can point to his apartment and car. Alex can point to the extra money in his savings account. They've bought different things with the same increase.

**Shot composition:** Equal medium split-screen with Sam’s useful room and rental keys on one side, Alex’s contribution folder on the other.

**Emotional beat:** Balanced recognition that the same opportunity bought different benefits.

**Character movement:** Sam touches the desk and picks up the keys; Alex checks the retained contribution record and sets it safely aside.

**Camera movement:** Static, equal-sized compositions; use the characters’ gestures as the emphasis.

**Visual transition:** Cut from the combined view to Sam writing his own full list.

**Animation beats:**

- **`p017-s009`:** Within the combined cue, let Sam indicate comfort and Alex indicate retained contributions in turn.
- **`p017-s010`:** Hold equal dignity and the same raise as the comparison resolves.

**State continuity:** Preserve rented transport and unspecified wealth. Alex’s folder represents cash contributions, not superior personal worth or investment success.

**On-screen text:** Same raise; Different uses.

### S53 — Sam’s first reaction is to cancel everything

**Audio window:** 09:35.013–09:48.233 · **Paragraph:** `p018` · **Cue anchors:** `p018-s001–p018-s005`

**Narration**

> When Sam finally writes down the full list, his first instinct is to cancel everything. Then he looks around the apartment. He still likes it. The car is useful. Some of the services are worth paying for, too.

**Shot composition:** Medium Sam writing the complete list at the improved desk; the room remains visible beyond the papers.

**Emotional beat:** Realization briefly becomes an urge to overcorrect, then softens into reflection.

**Character movement:** His pen moves quickly toward crossing everything out; he stops, looks around, rests a hand on the useful desk, and notices the keys and a valued service.

**Camera movement:** Begin close on the urgent pen, then widen once to reveal the benefits he is about to discard.

**Visual transition:** Cut from the paused pen to deliberate inspection of the same list.

**Animation beats:**

- **`p018-s001`:** Sam writes the list and starts a broad canceling gesture.
- **`p018-s002`:** He pauses to look around.
- **`p018-s005`:** Let the desk, car, and useful services register sequentially across p018-s003–p018-s005 before his hand relaxes.

**State continuity:** Nothing is canceled yet. Rent, transport, and services remain in the Month 3 state until the later explicit service cancellation.

**On-screen text:** No text needed.

### S54 — The list makes the consequence visible

**Audio window:** 09:48.233–09:54.993 · **Paragraph:** `p018` · **Cue anchors:** `p018-s006–p018-s007`

**Narration**

> The list doesn't tell him which things he should enjoy. It shows what each choice leaves available for the goal he said mattered.

**Shot composition:** Over-shoulder view of the list beside Sam’s unnumbered saving-goal note, with Sam’s face at the edge.

**Emotional beat:** Reflection replaces a good-choice/bad-choice verdict.

**Character movement:** He follows each commitment with a finger, then moves that finger toward the space remaining for the goal.

**Camera movement:** Static; the hand connects cost and consequence without another animated ledger.

**Visual transition:** Carry the same hand into choosing what to keep.

**Animation beats:**

- **`p018-s006`:** Sam stops trying to turn the list into a moral ranking.
- **`p018-s007`:** His finger links each commitment to the space available for the goal.

**State continuity:** Do not label all comforts wrong or invent a target amount. Keep the list as a way to see available choices.

**On-screen text:** Recurring choices; Available for savings.

### S55 — Choose an amount to keep

**Audio window:** 09:54.993–10:03.407 · **Paragraph:** `p018` · **Cue anchors:** `p018-s008–p018-s009`

**Narration**

> Sam wanted the raise to give him more breathing room. To make that happen, he has to choose an amount to keep and check whether his recurring commitments leave it available.

**Shot composition:** Medium Sam seated upright at the same desk, with the goal note and complete commitment folder both within reach.

**Emotional beat:** Control begins through an intentional decision rather than denial.

**Character movement:** He straightens from the earlier slump, places the goal note beside the full list, and takes up the phone to review the services.

**Camera movement:** Static, with the posture change and measured reach carrying the turn.

**Visual transition:** Cut on the phone lift into the cancellation action.

**Animation beats:**

- **`p018-s008`:** Sam returns to his original desire for breathing room.
- **`p018-s009`:** He checks the goal against commitments and reaches for a specific change rather than canceling everything.

**State continuity:** The chosen goal remains unpriced. The actual next outcome must come from removing the existing $100 service additions.

**On-screen text:** Choose an amount; Check the commitments.

### S56 — End the added services at the billing boundary

**Audio window:** 10:03.407–10:17.427 · **Paragraph:** `p019` · **Cue anchors:** `p019-s001–p019-s003`

**Narration**

> He starts with the services. In our example, he can end the added subscriptions and memberships before their next full billing month, removing the extra hundred dollars. We aren't assuming every service has the same cancellation rules.

**Shot composition:** Close phone view anchored by Sam’s hand, then the calendar showing the next full billing boundary.

**Emotional beat:** Deliberate control with a limited, believable action.

**Character movement:** Sam reviews the added service group, confirms cancellation, and marks when the recurring addition will end.

**Camera movement:** Static for the decision; clean cut to the next modeled billing month.

**Visual transition:** Cut from the ended service group to the rent and rental agreements that remain.

**Animation beats:**

- **`p019-s001`:** Sam selects the services as the specific change.
- **`p019-s002`:** Confirm cancellation before the next full billing month; on that boundary remove the recurring $100 group.
- **`p019-s003`:** Keep the example assumption legible rather than implying every service behaves this way.

**State continuity:** Remove only the extra $100 services at the declared billing boundary. Show no immediate refund or universal cancellation rule.

**On-screen text:** Added services: −$100/month next billing month; Example assumption.

### S57 — The bigger commitments remain

**Audio window:** 10:17.427–10:26.027 · **Paragraph:** `p019` · **Cue anchors:** `p019-s004–p019-s005`

**Narration**

> His apartment and transport costs stay where they are. Canceling an app doesn't cancel a lease, and we haven't given him a free way to reverse the car arrangement.

**Shot composition:** Medium Sam reviewing the lease and car rental documents left beside the cancellation confirmation.

**Emotional beat:** Realism: control includes recognizing commitments that continue.

**Character movement:** He keeps both agreements in the active folder, checks them, and places the rental keys back in their usual position.

**Camera movement:** Static; no contracts vanish or tear themselves up.

**Visual transition:** Match the retained bill bundle into the next paycheck’s allocation.

**Animation beats:**

- **`p019-s004`:** Keep rent and transport active after the service change.
- **`p019-s005`:** Sam files the continuing agreements rather than making them disappear.

**State continuity:** Rent addition $300 and transport addition $220 persist. No free reversal, refund, loan payoff, or car ownership is introduced.

**On-screen text:** Rent addition: $300; Transport addition: $220.

### S58 — The next transfer improves

**Audio window:** 10:26.027–10:43.716 · **Paragraph:** `p019` · **Cue anchors:** `p019-s006–p019-s009`

**Narration**

> With those recurring services removed, his illustrated spending returns to three thousand one hundred and twenty dollars. Four hundred and eighty remains, which he transfers into savings. He has improved the monthly result by one hundred dollars. He's still saving less than Alex, because he's still paying for different choices.

**Shot composition:** Wide-to-hand-level next-payday action: the same income arrives, obligations are paid, and more reaches savings.

**Emotional beat:** Control becomes a modest visible improvement, not a magical reset.

**Character movement:** Sam pays the retained bills, leaves out the ended service group, and sends the larger remainder to savings with a steadier hand.

**Camera movement:** Static for the money path and calculation; let the extra retained amount reach its destination before the reaction.

**Visual transition:** Cut from the revised receipt to Sam keeping the benefits he still values.

**Animation beats:**

- **`p019-s006`:** The following modeled month has $3,120 expenses.
- **`p019-s007`:** Sam transfers the $480 remainder.
- **`p019-s008`:** Show $100 more reaching savings; p019-s009 keeps Alex’s different $800 result in perspective.

**State continuity:** $3,600 pay minus $3,120 spending leaves $480. The $100 improvement comes from reduced recurring spending, not new income.

**On-screen text:** $3,600 − $3,120 = $480; Improvement: $100/month.

### S59 — Review larger choices when change is possible

**Audio window:** 10:43.716–10:53.876 · **Paragraph:** `p020` · **Cue anchors:** `p020-s001–p020-s002`

**Narration**

> That's a useful outcome. Sam can decide whether the apartment and car are worth the difference, and review the bigger commitments when he actually has an opportunity to change them.

**Shot composition:** Medium Sam using the better desk, with rent and rental documents placed in a review folder beside a calendar.

**Emotional beat:** Grounded confidence: he can value the benefits and still review them.

**Character movement:** He keeps the workspace and keys, files the larger commitments for review, and returns to the plan without pretending they can change immediately.

**Camera movement:** Static composition with a brief settle after the folder is placed.

**Visual transition:** Cut to a clearly separate hypothetical additional-income example.

**Animation beats:**

- **`p020-s001`:** Let Sam register the useful improvement calmly.
- **`p020-s002`:** He schedules a future opportunity to review larger choices without implying an immediate escape from them.

**State continuity:** No invented lease expiry date, refund, or cost-free contract reversal. Current saving remains $480.

**On-screen text:** Review larger commitments when possible.

### S60 — Another raise can follow the same path

**Audio window:** 10:53.876–11:03.883 · **Paragraph:** `p020` · **Cue anchors:** `p020-s003–p020-s004`

**Narration**

> He can also see why waiting for another raise wouldn't settle the question by itself. If he assigns the next increase to another recurring cost, his savings may barely change again.

**Shot composition:** Keep Sam’s actual pay notice in the room; a small clearly marked hypothetical tray sits apart from the active plan.

**Emotional beat:** Awareness of a pattern he could repeat.

**Character movement:** Sam considers an unpriced future addition and a new recurring commitment, then pauses before automatically pairing them.

**Camera movement:** Static; separate the hypothetical spatially instead of transitioning into a false future timeline.

**Visual transition:** Close the hypothetical tray before opening the separately labeled annual illustration.

**Animation beats:**

- **`p020-s003`:** Sam considers why another raise alone would not settle the decision.
- **`p020-s004`:** An unpriced hypothetical commitment would absorb unpriced additional income; hold his pause rather than confirming it happens.

**State continuity:** No future raise amount or prediction is invented. Actual income remains $3,600 and the revised transfer remains $480.

**On-screen text:** Hypothetical next raise; No amount specified.

### S61 — Reset to a separate twelve-month illustration

**Audio window:** 11:03.883–11:20.463 · **Paragraph:** `p021` · **Cue anchors:** `p021-s001–p021-s003`

**Narration**

> For a sense of scale, take their month-three pattern and hold it unchanged for a separate twelve-month illustration. At three hundred and eighty a month, Sam would add four thousand five hundred and sixty dollars to savings. At eight hundred, Alex would add nine thousand six hundred.

**Shot composition:** Sam and Alex take their earlier Month 3 receipts into a distinctly bordered twelve-month illustration.

**Emotional beat:** Perspective: demonstrate scale without promising an outcome.

**Character movement:** Use the earlier $380 and $800 receipts as inputs; the characters align twelve contribution slots while their real current records remain outside the illustration.

**Camera movement:** Static during each multiplication; use one clear reset cut into the labeled hypothetical space.

**Visual transition:** Keep that border and both totals through the conditional difference.

**Animation beats:**

- **`p021-s001`:** Label the separate illustration before reusing the earlier Month 3 inputs.
- **`p021-s002`:** Build 12 × $380 = $4,560 for Sam.
- **`p021-s003`:** Build 12 × $800 = $9,600 for Alex.

**State continuity:** This freezes the earlier Month 3 pattern, not Sam’s later $480 plan. Results are $4,560 and $9,600 in new contributions only.

**On-screen text:** Separate illustration: unchanged Month 3 pattern; 12 × $380 = $4,560; 12 × $800 = $9,600.

### S62 — Show the conditional annual gap

**Audio window:** 11:20.463–11:28.543 · **Paragraph:** `p021` · **Cue anchors:** `p021-s004–p021-s005`

**Narration**

> That's a difference of five thousand and forty dollars, assuming the transfers continue, no money is withdrawn, and everything else stays the same.

**Shot composition:** Remain inside the same annual-illustration border with aligned totals and a short assumption strip.

**Emotional beat:** Clarity about what must stay unchanged for the comparison.

**Character movement:** The characters indicate their respective totals, then the conditional difference, without treating the values as actual balances.

**Camera movement:** Static reading hold; do not count the annual amounts upward again.

**Visual transition:** Close the border when the narration returns to the actual story.

**Animation beats:**

- **`p021-s004`:** Reveal the spoken $5,040 difference.
- **`p021-s005`:** Keep the assumptions visible and both totals fixed; do not imply a guaranteed annual result.

**State continuity:** $9,600 minus $4,560 gives $5,040 only with continuing transfers, no withdrawals, and otherwise unchanged assumptions.

**On-screen text:** $9,600 − $4,560 = $5,040; Unchanged assumptions.

### S63 — Close the illustration and return to the story

**Audio window:** 11:28.543–11:34.254 · **Paragraph:** `p021` · **Cue anchors:** `p021-s006–p021-s007`

**Narration**

> It's a comparison, not a prediction. Sam's subscription change would already alter his side of it.

**Shot composition:** Sam puts the old Month 3 illustration aside and returns to the actual post-cancellation plan at his desk.

**Emotional beat:** Perspective gives way to practical control.

**Character movement:** He closes the illustration, picks up the current $480 receipt, and sets it beside the canceled-service notice.

**Camera movement:** One clean reset cut; no visual blend that might combine the two scenarios.

**Visual transition:** Carry the current receipt into the chosen-tradeoff view.

**Animation beats:**

- **`p021-s006`:** Close the prediction-like reading of the illustration.
- **`p021-s007`:** Return to Sam’s changed service commitment and current $480 result.

**State continuity:** Clear the $5,040 hypothetical gap from the active story. Current Sam is $480, not the frozen illustration’s $380.

**On-screen text:** Illustration, not prediction; Current Sam transfer: $480.

### S64 — Make the chosen tradeoff visible

**Audio window:** 11:34.254–11:48.634 · **Paragraph:** `p022` · **Cue anchors:** `p022-s001–p022-s003`

**Narration**

> The useful question is which recurring costs someone wants to carry forward, and what those commitments leave available. A person may choose more comfort, more saving, or a mixture. Writing down the tradeoff makes the choice visible.

**Shot composition:** Matched human views of Sam and Alex at their different workspaces, each with a short chosen-commitment list.

**Emotional beat:** Intentional choice with neither character presented as the universal answer.

**Character movement:** Sam keeps the desk and keys and revises the service choice; Alex retains his chosen activities and original workspace.

**Camera movement:** Static equal-height framing; character gestures lead, with no optimization slider or moral score.

**Visual transition:** Match Sam’s planning hand to the incoming unchanged paycheck.

**Animation beats:**

- **`p022-s001`:** Each character sees what recurring choices leave available.
- **`p022-s002`:** Show real comfort and saving tradeoffs through their surroundings.
- **`p022-s003`:** Their written lists make the consequences visible before another choice.

**State continuity:** Both choices have benefits and costs. Preserve Sam’s revised $480 state and Alex’s existing plan without a new model.

**On-screen text:** Comfort; Saving; Chosen commitments.

### S65 — The same paycheck, a clearer plan

**Audio window:** 11:48.634–12:07.204 · **Paragraph:** `p022` · **Cue anchors:** `p022-s004–p022-s007`

**Narration**

> Sam's next paycheck is still three thousand six hundred dollars. The canceled services leave him with a larger savings transfer, and he knows why it changed. He can enjoy the apartment without pretending it had no effect on his savings. He can plan the next purchase using the money he has available after his existing commitments.

**Shot composition:** Same brighter apartment and pay-day framing; the unchanged $3,600 notice remains visible beside the revised plan.

**Emotional beat:** Control: Sam knows why the outcome changed.

**Character movement:** He receives the same pay, checks the continuing commitments, and pauses over a possible purchase before using the available remainder.

**Camera movement:** Static during the pay and transfer amounts; no celebratory push-in suggesting another raise.

**Visual transition:** Match the familiar props into the short cause recap.

**Animation beats:**

- **`p022-s004`:** Show the unchanged $3,600 pay notice.
- **`p022-s005`:** The ended services allow the larger $480 transfer.
- **`p022-s007`:** Sam checks a new purchase after his commitments; p022-s006 retains the apartment’s genuine benefit.

**State continuity:** Actual pay is still $3,600, expenses $3,120, and the planned transfer $480. Keep the useful apartment and rental.

**On-screen text:** $3,600 pay; $3,120 expenses; $480 planned transfer.

### S66 — Summarize the cause with familiar objects

**Audio window:** 12:07.204–12:20.164 · **Paragraph:** `p023` · **Cue anchors:** `p023-s001–p023-s003`

**Narration**

> Making more money gave Sam room to improve his finances. He used most of that room to improve his daily life. When his recurring spending grew faster than his income, the amount he saved each month fell.

**Shot composition:** Short matched inserts of the familiar pay notice, useful desk, keys, commitments, and transfer receipt; return to Sam rather than a summary slide.

**Emotional beat:** Understanding and self-awareness rather than regret.

**Character movement:** Recall the earlier confident decisions, then show the present Sam bringing the commitments together before acting.

**Camera movement:** Clean familiar cuts; no new camera language or new metaphor at the conclusion.

**Visual transition:** Match the phone position directly into the final opening-shot callback.

**Animation beats:**

- **`p023-s001`:** Recall the room the raise created.
- **`p023-s002`:** Show the comfort Sam genuinely gained.
- **`p023-s003`:** Briefly connect the earlier recurring-cost growth to the smaller transfer, then return to the current plan.

**State continuity:** Any $380 callback must be labeled earlier Month 3. End in the current $480 plan with unchanged $3,600 pay.

**On-screen text:** Earlier Month 3: $380/month; Current plan: $480/month.

### S67 — Resolve the opening at the same desk

**Audio window:** 12:20.164–12:29.813 · **Paragraph:** `p023` · **Cue anchors:** `p023-s004–p023-s005`

**Narration**

> Now, before adding another monthly payment, he checks the total he's already agreed to spend. This time, when he opens his savings account, the transfer matches the plan.

**Shot composition:** Exact opening phone-and-desk composition, with Sam’s same face angle and unchanged $3,600 pay notice visible in the background.

**Emotional beat:** Control resolves the earlier uncertainty without pretending he received another raise.

**Character movement:** His thumb pauses before a new commitment, he checks the full list, then confirms the planned transfer with a steady hand and relaxed upright posture.

**Camera movement:** Match-cut from the opening’s framing; keep the camera still through confirmation and the final reading hold.

**Visual transition:** End on the settled composition through the measured WAV endpoint; no new title card or CTA.

**Animation beats:**

- **`p023-s004`:** Mirror the earlier stopped thumb, but now Sam checks the complete commitments before deciding.
- **`p023-s005`:** Show planned $480 matching transferred $480 while the same pay notice remains. Hold his calm reaction to the audio endpoint.

**State continuity:** Pay remains $3,600. The change is his use of it: ended services, $480 planned and $480 transferred. No wealth prediction or extra income.

**On-screen text:** Planned: $480; Transferred: $480.

## Implementation after storyboard approval

The user approved this storyboard on 2026-11-09. Use the current v5 visual studies as the framing reference for the first S01–S06 animation work. Preserve the accepted narration, financial assumptions, and cue IDs. Put any implementation timing offsets in storyboard/timeline data rather than graphics. Storyboard approval does not establish finished motion, audio sync, final-render acceptance, or publication approval.
