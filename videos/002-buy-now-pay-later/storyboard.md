# Text storyboard — The Buy Now, Pay Later Trap Nobody Notices

**Status:** Planning draft, 2026-11-13. Nothing here is rendered, phrase-aligned, listening-approved or motion-approved. The measured narration master exists; the visual plan is new.

**Narration:** [narration.txt](narration.txt) — Jeremy (`f6ec71e3`), VoxCPM2. Measured master `out/002-buy-now-pay-later/narration/narration.wav`, **09:53.567** (593.567 s), **27 takes** (`p001`–`p027`). This board divides it into **68 scenes**. Take boundaries do not force scene boundaries; several scenes share one take.

**Source of truth:** `narration.txt` as recorded (script hash `9a6bfcc3…`, identical to `manifest.json`). `script.md` still carries the earlier 1,435-word draft and **no longer matches**: `check_script_package.py` fails, and `qa.md`'s "character-for-character identical" claim is stale. Scenes below quote the recorded narration only. Re-sync `script.md`, `outline.md`, the `sources.md` prose and `qa.md` before calling the package approved.

**Timing:** Windows are the 27 measured take boundaries in `cues.draft.json` (`mode: "draft"`). No phrase alignment exists for this episode, so a scene inside a take names its sentences (`s03–s05`) and claims **no sub-window**. Do not put these times in graphics; compiled cue IDs and documented offsets drive animation later. Every window below is a navigation aid.

**Reading:** Each scene pairs an exact excerpt with one primary action. `s` numbering restarts inside each take. Some take text contains `---` section markers and `**` emphasis markers from the script file; they are file artifacts, **not spoken words**. Strip them before any regeneration — changing take text changes cache keys and invalidates the existing master, so do it deliberately, not as cleanup.

## Visual continuity

- Characters follow the current reference rig: hairless, earless Sam in the blue hoodie; hairless, earless Alex in the white collared shirt and round glasses. Adult proportions, fixed segment lengths, planted feet, contact shadows. Both act silently under one narrator; **no lip sync, no speech bubbles**.
- Backdrop stays the fixed seeded paper grain: no room walls, windows, floor or doors. Translate domestic references into props — a **peg rail** for the jacket (not a door), a **low shelf** for the shoe box (not a closet), a freestanding mirror, a couch, the writing desk, the dining table.
- Recurring props: one navy phone with a plain case; one checkout sheet; one white payment card per instalment with a navy date tab and a small object icon; Sam's stone-coloured chore jacket with navy buttons; slate over-ear headphones with a visibly kinked cable until they are replaced; off-white sneakers in a plain box with a receipt; a navy concert ticket with a coral stub; a steel watch on a navy strap; a compact car reused from episode 001's car beat.
- Palette: navy `#14243A` and white `#F8FAFC` base; yellow `#F3BE58` only for money and amounts; coral `#FF6B6B` only for a cost, a due payment or a narrowing margin; teal `#39B8B6` only for the considered alternative (Alex's order of decision, the legitimate planned expense, the closing conditions). Object colours stay neutral so they never read as a value judgement.
- One financial reveal at a time, ≥96 px side margins, nothing crossing a face or a held prop. Most cuts are clean; camera moves are short and motivated.
- The three visual devices below carry the whole argument. Do not add a fourth explanatory diagram.

## Financial continuity reference

Only two amounts exist in the recorded narration, and they agree with each other. Source: `sources.md` A01.

| Point in the example | Value | Use on screen |
|---|---:|---|
| Jacket, full price | $240 | Spoken and shown; the only large amount |
| Instalments | 4 equal payments | Spoken count; shown as four cards |
| First instalment | $60 | Spoken and shown |
| Headphones, shoes, concert ticket | unnamed | Cards carry a date tab and object icon only, never a price |
| Fees, interest, late payment | none in this example | Never drawn; the closing caveat says terms vary without inventing a fee |
| Income, account balance, savings balance | unspecified | Never drawn as a number |
| Debt, missed payment | none | Narration states this; show no overdue stamp, no red warning |

`240 / 4 = 60` is the episode's only arithmetic. Graphics must read the amounts from one declared source (a small `payInFour(total, count)` helper in `src/finance/math.ts`, checked against 4 × 60 = 240) rather than typing `240` or `60` into individual scenes. Do not draw a total, a balance or a per-line budget anywhere.

## Visual grammar

**1. The band.** The price is one horizontal band whose **length never changes**. Splitting it divides the same band into four equal segments. This is the episode's core image: the obligation keeps its length; only the pressure at the moment of paying changes. The band reappears at S08, S24, S26, S49, S50, S65 and S68 with identical length — always the same total, never shortened, never extended.

**2. Payment card columns.** Each purchase owns its own column of four dated cards. Columns are spaced, never merged, never summed, never stacked into one total. The camera reveals their overlap in time (S23) without ever drawing a combined figure — because no combined page exists.

**3. The account bar.** Sam's account is a bar with coral reserved segments and a white free remainder. No number is printed on it. Committed money is visibly spoken for before it is spent (S33–S41). Savings is a separate soft stack that can be drawn down once, explicitly (S35–S36).

**Recurring motifs:** the **waiting rail** — a thin teal bar in front of an object that retracts when the split option appears (S25, S60–S61); **tab history** — a small stack of closed visits that pays off at S55; **the lit first card** — of four cards, only the first is ever yellow-lit, because only the first is ever considered.

## Staging and reuse

- Compose from existing pieces: `Sam` / `Alex` from `src/characters/ReferenceCharacterRig.tsx`; `StoryEnvironment`, `WritingDesk`, `DiningTable`, `Cup`, `GroundShadow` from `src/scenes/cinematicEnvironment.tsx`; the `NarrativeScene` family; `KineticHeadline`, `AnimatedNumber`, `AnimatedList`, `ComparisonReveal`, `ObjectAttachedLabel` from `src/typography/index.tsx`.
- New art is limited to six items: the checkout sheet, the payment card, the payment column, the account bar, the calendar grid, the watch listing. Everything else reuses the rig, furniture and object primitives.
- Motion comes from the libraries before anything new: `SplitAssemble`, `SlideInBlur`, `MagnetPull`, `ConveyorFlow`, `FlipCard`, `PopIn`, `DrawOn` from `src/objects/motion.tsx`; `TextMorph`, `AnimatedNumber`, `ComparisonReveal` for the few text beats. Transitions: `hard-cut`, `cut-on-action`, `cut-on-look`, `match-number`, `match-shape`, `pull-back`, `calendar-flip`, `state-swap`, `split-open`, `callback-cut`.
- Panel action finishes inside roughly 60% of the shot and holds. No action completes on a cut, no ambient loops, no perpetual motion, no camera move over arithmetic.

## Proposed scenes

### S01 — The jacket he was not planning to buy

**Audio window:** take `p001` · 00:00.000–00:18.950 · s01–s02

**Narration**

> Sam bought a jacket he wasn't planning to buy. He'd been looking at it for almost a week.

**Shot composition:** Over-shoulder medium at the desk: Sam's hand holding the phone, the jacket listing centred between the 96 px margins.

**Emotional beat:** Idle curiosity, not intent.

**Character movement:** He scrolls once, stops on the jacket, and settles back. The thumb rests beside the back button without pressing it.

**Camera movement:** None. Let the still frame establish the ordinary moment.

**Visual transition:** Cut on his small exhale to the jacket alone.

**Animation beats:**

- **`s01`:** The listing arrives under his thumb; his posture is relaxed.
- **`s02`:** A faint tab-history strip appears at the sheet edge — this is not the first visit.

**State continuity:** Plant the tab-history motif now; it pays off at S55. No price visible yet.

**On-screen text:** None. The listing's own interface text stays small and unreadable; it is not an information beat.

### S02 — A nice jacket, nothing special

**Audio window:** take `p001` · 00:00.000–00:18.950 · s03–s04

**Narration**

> A nice jacket, nothing special. The kind you see online and think, "That looks good."

**Shot composition:** Matching close-up of the jacket on a plain hanger, then a slight rack focus to Sam's face.

**Emotional beat:** Mild, unremarkable attraction — the kind that usually passes.

**Character movement:** He tilts his head a little; one eyebrow lifts; no lean forward.

**Camera movement:** One short push, less than 40 px, then hold.

**Visual transition:** Cut down to the price line as he scrolls.

**Animation beats:**

- **`s03`:** The jacket reads as an ordinary garment — no glow, no spotlight, no colour shift.
- **`s04`:** Sam's expression does the "that looks good" beat; the jacket does not change.

**State continuity:** Keep the jacket's colour and cut identical to every later appearance, including the mirror shot and the return scene.

**On-screen text:** None.

### S03 — Two hundred and forty dollars

**Audio window:** take `p001` · 00:00.000–00:18.950 · s05–s06

**Narration**

> But it was two hundred and forty dollars. Every time Sam opened the page, he looked at the price, thought about it for a moment, and closed the tab.

**Shot composition:** The price band beneath the jacket, `$240` in navy on yellow; Sam's thumb enters from the lower right.

**Emotional beat:** The first small no.

**Character movement:** He reads the number, holds for a beat, then closes the tab. The hand does not linger.

**Camera movement:** Static through the read; a short pull-back as the tab collapses.

**Visual transition:** `cut-on-action` — the tab closes into the history strip.

**Animation beats:**

- **`s05`:** `$240` arrives as a drawn band (`AnimatedNumber`, single roll); the band's full length is established here and never changes.
- **`s06`:** The tab collapses to a small closed card in the history strip. Hold the empty page.

**State continuity:** This band length is the reference for every later comparison. The history strip gains its first closed card.

**On-screen text:** `$240` only.

### S04 — He liked it; he did not want to spend that

**Audio window:** take `p001`–`p002` · 00:00.000–00:43.090 · p001 s07, p002 s01

**Narration**

> He liked it. He just didn't want to spend that much on a jacket.

**Shot composition:** Two-part frame: Sam at the desk on the left, the closed tab card on the right, the jacket still faintly visible in the collapsed preview.

**Emotional beat:** A settled, reasonable decision.

**Character movement:** He puts the phone face-down, then turns it back over once and reopens the preview without scrolling to the price.

**Camera movement:** Static; the second look is the movement.

**Visual transition:** Cut on the phone turning over to Friday's checkout.

**Animation beats:**

- **`p001 s07`:** He keeps the preview; the like is genuine.
- **`p002 s01`:** The phone turns face-down and back; the decision holds.

**State continuity:** Two closed visits are now implied; do not show a third before S55.

**On-screen text:** None.

### S05 — Pay in four

**Audio window:** take `p002` · 00:18.950–00:43.090 · s02–s05

**Narration**

> Then, on Friday, he noticed something at checkout. Pay in four. Sixty dollars today. Sixty dollars sounded a lot better.

**Shot composition:** The checkout sheet fills the centre. One `$240` band. Below it, a single button. When it appears, the band divides into four equal cards; the first lights `$60`.

**Emotional beat:** The small, likable shortcut. Relief, not greed.

**Character movement:** Sam's thumb pauses above the new button. His shoulders drop a little — the decision just got lighter.

**Camera movement:** Static throughout the split. The band does the work; the camera must not decorate it.

**Visual transition:** Hold the four cards; do not cut until the last card settles.

**Animation beats:**

- **`s02`:** A second, unfamiliar button appears under the band; nothing else on the sheet changes.
- **`s03`–`s04`:** The band divides on one clean vertical motion into four equal segments. The first carries `$60` and yellow; the other three grey out and take date tabs. Combined length unchanged.
- **`s05`:** The `$60` card lifts slightly toward his thumb; his posture eases.

**State continuity:** This is the episode's concept shot. The checkout sheet, band length, card proportions and icon placement are reused at S08, S16, S49, S63 and S65.

**On-screen text:** `$240`; the button reads `Pay in four`; the lit card reads `$60`. These are diegetic interface labels, not captions — show them once, at interface scale, never repeated as narration text.

### S06 — He had sixty dollars

**Audio window:** take `p002` · 00:18.950–00:43.090 · s06–s08

**Narration**

> He'd just been paid. He had sixty dollars. So he placed the order.

**Shot composition:** A yellow pay token arrives at the account bar; the lit `$60` card sits beside it and fits. Then the order button and a single receipt card.

**Emotional beat:** Reassurance: the first payment is comfortably covered.

**Character movement:** He taps once; the receipt settles into the phone; he pockets it without checking the date tabs.

**Camera movement:** Small push to the token meeting the card, then back for the tap.

**Visual transition:** `cut-on-action` on the tap.

**Animation beats:**

- **`s06`:** The pay token lands; one coral segment reserves `$60` in the account bar.
- **`s07`:** The token covers the card exactly; no remainder is questioned.
- **`s08`:** Tap, receipt, phone down. The three grey cards are still on screen but out of his attention.

**State continuity:** First coral reservation in the account bar. The unlit cards stay behind him in S07.

**On-screen text:** `$60` on the lit card only.

### S07 — It arrived

**Audio window:** take `p002` · 00:18.950–00:43.090 · s09–s10

**Narration**

> A few days later, the jacket arrived. He tried it on, looked in the mirror, and was pretty happy with it.

**Shot composition:** A parcel on the desk; then Sam at a freestanding mirror, jacket on, sleeves checked.

**Emotional beat:** Genuine satisfaction. The jacket is good.

**Character movement:** He pulls the sleeves, turns once, checks the collar. One small nod.

**Camera movement:** Restrained push to the mirror; no slow-motion turn.

**Visual transition:** `match-shape` — the jacket's outline in the mirror becomes the same outline on its hanger at S54.

**Animation beats:**

- **`s09`:** The parcel opens; the jacket keeps its established colour.
- **`s10`:** Mirror check; the fit is right. Hold the settled pose.

**State continuity:** The jacket now exists physically; it hangs on the peg rail from S29 onward.

**On-screen text:** None.

### S08 — The purchase he had already refused

**Audio window:** take `p003` · 00:43.090–01:04.750 · s01–s03

**Narration**

> The strange part was that he probably wouldn't have bought it if he'd needed to pay the full price that day. But sixty dollars? That felt fine.

**Shot composition:** Comparison frame: the full `$240` band on top (coral edge), the four-card band directly below it (first card lit). Identical length, identical jacket above both.

**Emotional beat:** Quiet unease under the satisfaction — the first hint that the yes was bought, not earned.

**Character movement:** Sam reaches toward the full band and stops; his hand moves to the `$60` card instead.

**Camera movement:** Static. The two bands must be measurable in one frame.

**Visual transition:** `match-number` from the `$60` card to the closing line's badge.

**Animation beats:**

- **`s01`:** The full band appears with a coral edge; his hand stops above it.
- **`s02`–`s03`:** The lit `$60` card brightens; the other three stay grey. His hand completes the reach.

**State continuity:** Same jacket, same day, same checkout. This is a counterfactual, not a second purchase — do not add a second receipt.

**On-screen text:** `$240` and `$60` on their bands; no question text.

### S09 — How it started

**Audio window:** take `p003` · 00:43.090–01:04.750 · s04

**Narration**

> And that was how Sam started using Buy Now, Pay Later.

**Shot composition:** The checkout sheet folds down into a small badge on Sam's phone. Behind him, a queue of empty card slots waits in the frame's depth.

**Emotional beat:** An ordinary new habit, not a warning.

**Character movement:** He drops the phone into his pocket and leaves frame; the empty slots stay.

**Camera movement:** Pull back just enough to reveal the waiting slots.

**Visual transition:** `hard-cut` to the next week.

**Animation beats:**

- **`s04`:** The sheet folds to the badge; three faint empty columns appear behind him but are not read as a total.

**State continuity:** The badge becomes a recurring prop. Empty columns are staging only; no amounts, no count labels.

**On-screen text:** The badge carries `Pay in four` at interface scale; no series title, no lesson.

### S10 — A week later, the headphones

**Audio window:** take `p003` · 00:43.090–01:04.750 · s05–s07

**Narration**

> A week later, Sam was looking for new headphones. His old ones still worked, although one side had started cutting out whenever he moved the cable. He found a pair he liked.

**Shot composition:** Desk: the old headphones, cable kinked near the plug. Close-up of the kink flexing; one earcup silent. Then a new pair on the listing.

**Emotional beat:** A small, practical annoyance — the justification is real.

**Character movement:** He wiggles the cable; the sound drops; he sets the old pair down and picks up the phone.

**Camera movement:** Tight insert on the cable, then a clean cut wide.

**Visual transition:** `cut-on-action` from setting the old pair down.

**Animation beats:**

- **`s05`:** The week change is carried by the jacket now on the peg rail.
- **`s06`:** The cable kink flexes; the silent earcup is indicated by a small muted-speaker mark, not a caption.
- **`s07`:** The new pair appears; he likes it.

**State continuity:** Old headphones stay on the desk as a reference until they are replaced; the kink disappears after purchase.

**On-screen text:** None.

### S11 — That option again

**Audio window:** take `p004` · 01:04.750–01:29.811 · s01–s05

**Narration**

> A little expensive, but there was that option again. Four smaller payments. He remembered the jacket. That purchase had been easy. Why not?

**Shot composition:** The headphones listing with its own price band; the `Pay in four` badge appears. A glance to the jacket on the peg rail, then back.

**Emotional beat:** Recognition and permission — the memory of an easy yes doing the persuading.

**Character movement:** He looks at the jacket, then at the phone, and gives a small shrug on `Why not?`.

**Camera movement:** A short pan to the jacket and back; no push on the price.

**Visual transition:** Cut on the shrug into the purchase.

**Animation beats:**

- **`s01`–`s02`:** The price band is taller than the jacket's was — no number is shown.
- **`s03`–`s04`:** The jacket callback is a real look, not a thought bubble.
- **`s05`:** The shrug lands on the question.

**State continuity:** Do not name the headphone price. Its band length is evidence of "a little expensive", never a figure.

**On-screen text:** `Pay in four` on the badge only.

### S12 — A second column

**Audio window:** take `p004` · 01:04.750–01:29.811 · s06

**Narration**

> He bought the headphones.

**Shot composition:** The headphones' four cards slide into their own column, separate from the jacket's column.

**Emotional beat:** Momentum, barely noticed.

**Character movement:** One tap; he is already turning away.

**Camera movement:** Static; the column assembles without ceremony.

**Visual transition:** `cut-on-look` as he turns.

**Animation beats:**

- **`s06`:** Four cards, first one lit; the column keeps a clear gap from the jacket column.

**State continuity:** Two columns now exist and never touch. No combined total.

**On-screen text:** None.

### S13 — Shoes he was not shopping for

**Audio window:** take `p004` · 01:04.750–01:29.811 · s07–s10

**Narration**

> Then came a pair of shoes. He'd seen someone wearing them at work and decided to look them up. He wasn't really shopping for shoes. He was just looking.

**Shot composition:** Office beat: a cropped lower-leg silhouette in the same shoes crosses behind Sam's desk. Sam glances, then searches on his phone.

**Emotional beat:** Curiosity with no purchase intent — the honest kind.

**Character movement:** Sam turns his head, watches the shoes pass, and types a search. No lean, no decision posture.

**Camera movement:** Static wide; the passing silhouette provides the only motion.

**Visual transition:** `cut-on-look` to the listing.

**Animation beats:**

- **`s07`–`s08`:** The shoes cross frame once; Sam's eyes follow.
- **`s09`–`s10`:** The search is casual; his posture stays open.

**State continuity:** The colleague is a leg-pair silhouette, never a new full character rig. The shoes must match the later boxed pair.

**On-screen text:** None.

### S14 — On sale, and divisible

**Audio window:** take `p004`–`p005` · 01:04.750–01:54.805 · s11, p005 s01

**Narration**

> But they were on sale, and once again, he didn't have to pay the full price right away. So he bought them too.

**Shot composition:** The shoes' listing with a sale sticker on the band and the split badge below; the band divides.

**Emotional beat:** Two small permissions stacking — cheaper and smaller.

**Character movement:** He taps without checking the date tabs.

**Camera movement:** Static.

**Visual transition:** `cut-on-action` on the tap.

**Animation beats:**

- **`s11`:** The sale sticker lands; the band shortens slightly but no number appears.
- **`p005 s01`:** The four cards split; the first lights. Third column begins.

**State continuity:** The sale is a sticker, never a percentage. No discount arithmetic.

**On-screen text:** `Pay in four` only.

### S15 — The concert

**Audio window:** take `p005` · 01:29.811–01:54.805 · s02–s05

**Narration**

> A few days later, his friends invited him to a concert. The tickets were more expensive than he'd expected. Normally, he would've told them he'd think about it.

**Shot composition:** Phone message from friends; the ticket page with a tall price band; Sam's hand hovers.

**Emotional beat:** Social pull against a number he did not expect.

**Character movement:** He reads the message, opens the ticket page, and pulls his hand back on the taller band — the old habit.

**Camera movement:** Small push to the band, then hold on the hovering hand.

**Visual transition:** Cut on the hover to the instalment offer.

**Animation beats:**

- **`s02`–`s03`:** The band is visibly taller than the previous purchases; no numeral.
- **`s04`:** His hand starts to withdraw — this is the "I'll think about it" reflex.

**State continuity:** The ticket price is never named. The taller band is the only measurement.

**On-screen text:** None.

### S16 — The ticket website offered instalments

**Audio window:** take `p005` · 01:29.811–01:54.805 · s06–s07

**Narration**

> But the ticket website offered installments. That made the decision easier. He bought the ticket.

**Shot composition:** The same ticket page, now with the split badge; the tall band divides into four.

**Emotional beat:** Relief; the social decision resolves.

**Character movement:** His hand returns and taps. A small nod.

**Camera movement:** Static; no flourish.

**Visual transition:** `cut-on-action` on the tap, then `calendar-flip` into the card columns.

**Animation beats:**

- **`s06`:** The badge appears below the band; his withdrawing hand stops.
- **`s07`:** The band divides; the first card lights; the ticket lands in his phone wallet.

**State continuity:** Fourth column. Ticket icon: navy with a coral stub.

**On-screen text:** `Pay in four`; no ticket price.

### S17 — Nothing huge

**Audio window:** take `p005` · 01:29.811–01:54.805 · s08–s09

**Narration**

> And just like that, Sam had a new jacket, new headphones, new shoes, and something to look forward to next month. He hadn't made any huge purchases.

**Shot composition:** One wide frame: jacket on the peg rail, headphones on the desk, shoe box on the shelf, ticket on the phone. Sam stands among them.

**Emotional beat:** Contentment. He is not wrong that none of it was huge.

**Character movement:** He touches the jacket sleeve, then picks up the phone and looks at the ticket.

**Camera movement:** Slow pull-back to include all four objects, no more.

**Visual transition:** `pull-back` continues into the notification stack at S19? No — hold, then `hard-cut`.

**Animation beats:**

- **`s08`:** The four objects share the frame; each is distinct and readable.
- **`s09`:** He surveys them with a small, uncomplicated smile.

**State continuity:** All four objects in their established places. No piles, no clutter.

**On-screen text:** None.

### S18 — Only the first payment

**Audio window:** take `p006` · 01:54.805–02:16.116 · s01–s03

**Narration**

> At least, that's how it felt. Every time he bought something, he only needed enough money for the first payment. And he always had enough for that.

**Shot composition:** Four columns of cards behind Sam; in each, only the first card is lit. His hand touches the lit card in the nearest column.

**Emotional beat:** The logic feels airtight from where he stands.

**Character movement:** He taps each lit card in turn, lightly, like checking a pocket.

**Camera movement:** Static; the four lit cards lead the eye.

**Visual transition:** `state-swap` — the lit cards switch to due-date tabs.

**Animation beats:**

- **`s01`:** The four columns are visible together but unjoined.
- **`s02`–`s03`:** Only the first card in each column is yellow; the rest stay grey.

**State continuity:** Establishes the rule visually: the first card is the only one he ever looks at. No total anywhere.

**On-screen text:** None.

### S19 — The payment messages

**Audio window:** take `p006` · 01:54.805–02:16.116 · s04–s08

**Narration**

> The payments started showing up a few days later. First, a notification about the jacket. Then the headphones. Then another one for the shoes. Each message was pretty ordinary.

**Shot composition:** Lock screen: three notification cards arrive in sequence, each with its object icon and a date tab.

**Emotional beat:** Mild administrative noise.

**Character movement:** Sam picks up the phone, reads, and keeps moving.

**Camera movement:** Static close-up; no push per notification.

**Visual transition:** `cut-on-action` as he pockets the phone.

**Animation beats:**

- **`s04`:** The section change is a plain cut — no time-lapse.
- **`s05`–`s07`:** Three notifications, one per purchase, evenly spaced in arrival.
- **`s08`:** The stack reads as ordinary system UI, not a warning.

**State continuity:** Notification style stays consistent at S20 and S38. No amounts on notifications.

**On-screen text:** Interface text only: "Payment coming up"; object icons identify the purchase.

### S20 — Nothing alarming

**Audio window:** take `p006` · 01:54.805–02:16.116 · s09–s11

**Narration**

> A payment was coming up. Make sure there was enough money in the account. Nothing alarming.

**Shot composition:** One notification expanded; the account bar briefly behind it, still comfortably white.

**Emotional beat:** Reassurance — the messages are friendly and true.

**Character movement:** He swipes the notification away without opening the app.

**Camera movement:** None.

**Visual transition:** `hard-cut` to the day continuing.

**Animation beats:**

- **`s09`–`s10`:** The message text is legible at interface scale; the account bar's free remainder is visible.
- **`s11`:** The swipe clears the card; his face stays neutral.

**State continuity:** The account bar still has room here; it narrows later. Do not foreshadow with a warning colour.

**On-screen text:** Interface text only.

### S21 — He had agreed

**Audio window:** take `p007` · 02:16.116–02:36.976 · s01–s04

**Narration**

> Sam glanced at the notifications and carried on with his day. After all, he'd agreed to those payments. He knew they were coming. What he hadn't really thought about was how close together they'd arrive.

**Shot composition:** Workday inserts: desk, cup, phone face-up. Then the four columns seen from above, their date tabs beginning to overlap in time.

**Emotional beat:** Fair-minded confidence, then a first crack of doubt.

**Character movement:** He works, glances, keeps going. On the last line his hand slows.

**Camera movement:** Slow overhead drift across the columns — the only camera movement in the sequence.

**Visual transition:** `cut-on-look` to the calendar.

**Animation beats:**

- **`s01`–`s03`:** The notifications are acknowledged, not ignored.
- **`s04`:** The columns' date tabs align in the same weeks for the first time; his hand stops.

**State continuity:** This is the first time the columns are seen against shared time. No amounts, no total.

**On-screen text:** None.

### S22 — Tuesday, Thursday, next week, again

**Audio window:** take `p007` · 02:16.116–02:36.976 · s05–s08

**Narration**

> One payment on Tuesday. Another on Thursday. Two more the following week. And then the next round started.

**Shot composition:** Calendar grid, one week per beat. Four dated cards land on four days; a fifth pulse marks the next round.

**Emotional beat:** Density, not panic.

**Character movement:** Sam's finger follows each landing, then taps the next week.

**Camera movement:** `calendar-flip` between weeks, restrained and quick.

**Visual transition:** `calendar-flip` into the next scene's pulled-back frame.

**Animation beats:**

- **`s05`–`s06`:** Cards land on Tuesday and Thursday.
- **`s07`:** Two cards land in the same week; his finger hesitates between them.
- **`s08`:** A second round of tabs pulses faintly; do not enumerate it.

**State continuity:** Weekday labels only — no month, no date numbers, no arithmetic. Card icons match the purchases.

**On-screen text:** `TUE`, `THU`, `MON`, `THU` as small date tabs. No other calendar text.

### S23 — Checked one at a time

**Audio window:** take `p007`–`p008` · 02:16.116–02:59.546 · p007 s09, p008 s01–s02

**Narration**

> Sam had checked whether he could afford each purchase when he made it. But he hadn't looked at what all those purchases would mean together. That's the part that caught him off guard.

**Shot composition:** Four separate single-purchase checks on the left — each one passes. Then a pull-back reveals all four columns sharing the same weeks on the right.

**Emotional beat:** The realization arrives through the pull-back, not through a reaction shot.

**Character movement:** He stands still; one hand lifts, then lowers without a gesture.

**Camera movement:** The scene's one big move: a slow pull-back that doubles the frame's width.

**Visual transition:** `pull-back` ends on the shared month; `hard-cut` into the explanation.

**Animation beats:**

- **`p007 s09`:** Each purchase's own check passes cleanly — the logic was sound.
- **`p008 s01`–`s02`:** The pull-back reveals overlap; his stillness is the reaction.

**State continuity:** The columns never merge, even here. The overlap is temporal, not a sum.

**On-screen text:** None. No "but" card, no bracket total.

### S24 — The price does not disappear

**Audio window:** take `p008` · 02:36.976–02:59.546 · s03–s06

**Narration**

> When you split a purchase into installments, the full price doesn't disappear. You just pay it over time. That can be useful. Sometimes you'd rather spread out a planned expense instead of paying everything at once.

**Shot composition:** The band again, divided but identical in length. Beside it, a teal example: one known planned expense, four cards, all four dates reviewed before the first payment.

**Emotional beat:** Fairness — the mechanism is not the villain.

**Character movement:** Sam's hand passes over the honest example and does not stop; it is a demonstration, not a temptation.

**Camera movement:** Static comparison; no push.

**Visual transition:** `match-shape` from the teal cards to Sam's own columns.

**Animation beats:**

- **`s03`–`s04`:** The divided band keeps its full length; a soft measure line confirms equality without a number.
- **`s05`–`s06`:** The teal plan shows all four dates checked in advance; the distinction is planning, not splitting.

**State continuity:** Teal is reserved for the considered alternative. This example has no owner yet; do not attach it to Alex before S51.

**On-screen text:** One word, `planned`, attached to the teal plan card. No explanatory sentence.

### S25 — What he would have waited for

**Audio window:** take `p008`–`p009` · 02:36.976–03:21.738 · p008 s07–s08, p009 s01–s03

**Narration**

> But for Sam, something else was happening. He was buying things he normally would've waited to buy. A jacket he didn't really need. Headphones he could've put off replacing. Shoes he'd only started thinking about because someone at work had a pair.

**Shot composition:** The three purchases on a shelf behind the waiting rail. The split badge appears; the rail retracts; the objects come forward.

**Emotional beat:** Recognition without shame — he is not being mocked.

**Character movement:** He reaches past the rail rather than through a dramatic barrier. The gesture stays small.

**Camera movement:** None; the rail's retraction is the motion.

**Visual transition:** `cut-on-action` as the jacket comes forward.

**Animation beats:**

- **`p008 s07`–`s08`:** The rail is in front of all three objects; it is thin, not a wall.
- **`p009 s01`–`s03`:** Each object is named by its callback; the rail retracts a little further with each.

**State continuity:** Introduce the waiting rail here; it returns at S60–S61 with the opposite meaning. No prices.

**On-screen text:** None.

### S26 — Because the first payment looked easy

**Audio window:** take `p009` · 02:59.546–03:21.738 · s04–s06

**Narration**

> He wasn't buying all these things because they suddenly became cheaper. He was buying them because the first payment looked easy. And as long as that first payment was small enough, saying yes didn't feel like a big decision.

**Shot composition:** The full band and the four-card band stacked, same length. A thumb presses the lit card, not the band.

**Emotional beat:** The mechanism, stated plainly.

**Character movement:** One tap on the small card; the big band stays untouched.

**Camera movement:** Static, symmetrical.

**Visual transition:** `hard-cut` to the ordinary week.

**Animation beats:**

- **`s04`:** Nothing about the band shortens.
- **`s05`–`s06`:** The thumb lands on the lit card; the other three stay grey; the total length is unchanged.

**State continuity:** The comparison is the same one used at S08, now without the counterfactual framing.

**On-screen text:** `$240` and `$60` only.

### S27 — At first, no problem

**Audio window:** take `p009` · 02:59.546–03:21.738 · s07

**Narration**

> At first, none of this caused a problem.

**Shot composition:** A normal evening: Sam on the couch, phone down, cup on the table.

**Emotional beat:** Genuine calm before the correction.

**Character movement:** He settles back; nothing is wrong.

**Camera movement:** Static wide.

**Visual transition:** `hard-cut` into the routine.

**Animation beats:**

- **`s07`:** The frame holds long enough to feel ordinary.

**State continuity:** No visual irony here — no looming cards, no shadow.

**On-screen text:** None.

### S28 — Everything felt normal

**Audio window:** take `p010` · 03:21.738–03:43.913 · s01–s05

**Narration**

> Sam went to work. He paid his rent. He bought groceries. He went out with friends. Everything felt normal.

**Shot composition:** Three clean inserts: desk at work, rent transfer, grocery bag. Then a two-shot with friends as silhouettes at a table.

**Emotional beat:** Rhythm, not montage clutter.

**Character movement:** One action per insert; no overlapping gestures.

**Camera movement:** Static throughout; cuts carry the rhythm.

**Visual transition:** `cut-on-action` between inserts.

**Animation beats:**

- **`s01`–`s04`:** Each insert completes its action and holds briefly.
- **`s05`:** The last insert settles into stillness on "normal".

**State continuity:** Rent is paid; show the transfer explicitly, without a balance. Do not introduce new purchases.

**On-screen text:** None.

### S29 — Things he was enjoying

**Audio window:** take `p010` · 03:21.738–03:43.913 · s06–s09

**Narration**

> His new jacket was hanging beside the door. The headphones were on his desk. The shoes were still in their box because he hadn't found a reason to wear them yet. He was enjoying the things he'd bought.

**Shot composition:** Peg rail with the jacket; headphones on the desk; the shoe box on the shelf, lid closed. Sam passes through the frame.

**Emotional beat:** Pleasure, with one unused object quietly present.

**Character movement:** He touches the jacket as he passes; the box gets no look.

**Camera movement:** A single lateral drift that includes all three objects.

**Visual transition:** `cut-on-look` as he glances at the phone.

**Animation beats:**

- **`s06`–`s07`:** Jacket and headphones are in use.
- **`s08`–`s09`:** The box stays closed; he is happy with the purchases regardless.

**State continuity:** The box's position is fixed for S56–S57. No door drawn; the peg rail is the anchor.

**On-screen text:** None.

### S30 — Every few days, a payment left

**Audio window:** take `p010` · 03:21.738–03:43.913 · s10–s11

**Narration**

> And every few days, another payment came out of his account. He didn't pay much attention to it.

**Shot composition:** Account bar close-up: one coral segment fills, then another, on separate days. Sam's attention is elsewhere.

**Emotional beat:** Automatic, unexamined.

**Character movement:** He is mid-task; the phone lights up beside him and he does not pick it up.

**Camera movement:** Static macro; the fills are small.

**Visual transition:** `hard-cut` to Monday morning.

**Animation beats:**

- **`s10`:** Two reservation ticks occur on different beats, not in a pile.
- **`s11`:** The phone lights; his hand stays on the task.

**State continuity:** The account bar now carries four coral reservations, unlabelled.

**On-screen text:** None.

### S31 — The battery

**Audio window:** take `p011` · 03:43.913–04:06.833 · s01–s07

**Narration**

> Until one Monday morning. Sam was already running late for work. He got into his car, turned the key, and heard a clicking sound. He tried again. Nothing. The battery was dead. Not exactly how he wanted to start the week.

**Shot composition:** Alarm clock insert, keys grabbed, car interior. Tight on the ignition: click, click. Dashboard lights flicker and die.

**Emotional beat:** Ordinary frustration escalating to a problem.

**Character movement:** Hurried entry, two turns of the key, hands dropping to his lap. No comic exaggeration.

**Camera movement:** Quick but restrained: cut, cut, then hold on his face.

**Visual transition:** `cut-on-action` on the second failed turn.

**Animation beats:**

- **`s01`–`s03`:** Rushed morning; the car art is the established compact car.
- **`s04`–`s06`:** Two clicks, no start; a small battery mark on the dash fades.
- **`s07`:** His shoulders drop; hold.

**State continuity:** No ownership or financing claim; this is his car in this example. Repair is a battery replacement only.

**On-screen text:** None.

### S32 — A quote, not a catastrophe

**Audio window:** take `p011` · 03:43.913–04:06.833 · s08–s10

**Narration**

> He called a mechanic, arranged to have the battery replaced, and found out what it would cost. It wasn't an enormous expense. But it wasn't something he'd planned for either.

**Shot composition:** Phone call; then a single coral cost block placed on the counter beside the account bar.

**Emotional beat:** Manageable, but unplanned.

**Character movement:** He nods through the call; sets the phone down; looks at the block.

**Camera movement:** Static; the block's arrival is the event.

**Visual transition:** `cut-on-look` to the banking app.

**Animation beats:**

- **`s08`:** The call is brief; no dialogue performed.
- **`s09`–`s10`:** The block is proportionate — smaller than the jacket band, clearly real. No numeral.

**State continuity:** The repair block has no amount; it must never be totalled with the instalments.

**On-screen text:** None.

### S33 — Paycheck arrived, but

**Audio window:** take `p012` · 04:06.833–04:27.353 · s01–s05

**Narration**

> He opened his banking app. His paycheck had arrived a few days earlier. Rent was paid. Bills were covered. But several installment payments were still due before his next payday.

**Shot composition:** Banking app: a yellow pay bar arrives; rent and bill segments are already carved out; below the bar, four dated cards sit before the next payday marker.

**Emotional beat:** The first real accounting of room.

**Character movement:** His thumb scrolls the bar once, then stops on the dated cards.

**Camera movement:** Small push to the gap between the bar and the cards.

**Visual transition:** `match-position` from the bar to the repair block.

**Animation beats:**

- **`s01`–`s04`:** The pay bar arrives; rent and bills are marked as already handled.
- **`s05`:** Four upcoming cards land before the next-payday marker; his thumb stops.

**State continuity:** No balance figure. Coral reservations are already inside the bar. The next-payday marker is a thin line, not a date.

**On-screen text:** Interface labels only: `Rent`, `Bills`, `Next payday`.

### S34 — Afford it, but not comfortably

**Audio window:** take `p012` · 04:06.833–04:27.353 · s06–s09

**Narration**

> Suddenly, the money in his account didn't feel quite as available as it had the week before. He could afford the car repair. That wasn't the problem. He just couldn't pay for it as comfortably as he'd expected.

**Shot composition:** The repair block slides toward the free remainder of the bar. It fits, with little space left around it.

**Emotional beat:** Tightness, not crisis.

**Character movement:** He drags the block once, hesitates, then places it. His jaw tightens slightly.

**Camera movement:** Static; the drag is the only motion.

**Visual transition:** `cut-on-action` on the placement.

**Animation beats:**

- **`s06`:** The free remainder is visibly narrower than last week.
- **`s07`–`s08`:** The block fits; the point is that it fits badly, not that it fails.
- **`s09`:** His hand stays on the block a beat longer than needed.

**State continuity:** The block still has no number. Do not draw a negative balance or an overdraft.

**On-screen text:** None.

### S35 — From savings

**Audio window:** take `p013` · 04:27.353–04:49.755 · s01–s04

**Narration**

> So he transferred some money from his savings. Paid for the repair. And went to work. Problem solved.

**Shot composition:** A soft savings stack on a separate shelf; an explicit arrow moves one layer into the account bar, under the repair block.

**Emotional beat:** Competence. He solved it.

**Character movement:** One deliberate transfer gesture, then he collects his keys.

**Camera movement:** Follow the transfer, then settle.

**Visual transition:** `cut-on-action` as he leaves.

**Animation beats:**

- **`s01`–`s02`:** The transfer is one visible layer, not a vague glow.
- **`s03`–`s04`:** The block is covered; he leaves without looking back.

**State continuity:** Savings is drawn down once here. Show it thinner at S36 and S37; never label a balance.

**On-screen text:** Interface label `Savings` on the stack only.

### S36 — Still payments coming

**Audio window:** take `p013` · 04:27.353–04:49.755 · s05–s06

**Narration**

> Except now his savings were lower than he'd wanted. And there were still payments coming.

**Shot composition:** The savings stack, thinner, beside the account bar; the four dated cards remain below the bar.

**Emotional beat:** The solution has a residue.

**Character movement:** Sam is already at the frame's edge; he pauses, looks back at the stack.

**Camera movement:** Static; his look-back is the beat.

**Visual transition:** `hard-cut` to the evening.

**Animation beats:**

- **`s05`:** One layer is missing from the stack; no number.
- **`s06`:** The dated cards still pulse, unchanged by the transfer.

**State continuity:** The repair is paid; do not show it again as due.

**On-screen text:** None.

### S37 — Three things that were not true

**Audio window:** take `p013` · 04:27.353–04:49.755 · s07–s11

**Narration**

> That evening, Sam sat on the couch and checked his banking app. He wasn't in debt trouble. He hadn't missed a payment. He hadn't even paid any extra fees. But his account was looking a little thinner than usual.

**Shot composition:** Couch two-thirds frame; phone in hand. Three quick visual negations: no overdue stamp, no missed-payment mark, no fee slip. Then the thinner bar.

**Emotional beat:** Relief mixed with unease — nothing is wrong, and something still is.

**Character movement:** He checks, scrolls, lowers the phone to his knee.

**Camera movement:** Static; the negation inserts are cuts, not camera moves.

**Visual transition:** `state-swap` from the account bar to the reminders list.

**Animation beats:**

- **`s07`–`s10`:** Each negation is a brief, clean check — no red, no alarm.
- **`s11`:** The bar's white remainder is smaller than at S20; hold.

**State continuity:** Keep all three negations visible as absences, not as text. No debt imagery anywhere.

**On-screen text:** None.

### S38 — The reminders

**Audio window:** take `p014` · 04:49.755–05:12.320 · s01–s05

**Narration**

> He opened the payment reminders and scrolled through them. The jacket. The headphones. The shoes. The concert tickets.

**Shot composition:** A single scrollable column of reminder cards, each with an object icon and a date tab. Four distinct groups, still separate.

**Emotional beat:** Repetition becoming visible.

**Character movement:** His thumb scrolls; his head stays still.

**Camera movement:** Follow the scroll only; no push.

**Visual transition:** `cut-on-action` at the end of the scroll.

**Animation beats:**

- **`s02`–`s05`:** Each purchase is named by its icon as the card passes; no amounts.

**State continuity:** Reminder cards match the notification style from S19. Columns remain unmerged.

**On-screen text:** Interface text only; `Payment reminders` header.

### S39 — He remembered the purchases

**Audio window:** take `p014` · 04:49.755–05:12.320 · s06–s09

**Narration**

> He'd forgotten how many things he'd bought in such a short time. Not forgotten the purchases themselves. He remembered all of those. What he'd lost track of was how many payments were still waiting.

**Shot composition:** The four objects appear as small, clear icons across the top; below them, the reminder cards keep coming.

**Emotional beat:** Surprise at quantity, not at the objects.

**Character movement:** He looks up at the objects, then back down; his thumb slows.

**Camera movement:** Static; a small pull-back reveals the length of the list.

**Visual transition:** `pull-back` into the calendar.

**Animation beats:**

- **`s06`–`s08`:** He recognizes each object without hesitation.
- **`s09`:** The list's length is the reveal; his thumb stops.

**State continuity:** No new purchases; the four icons are the established objects.

**On-screen text:** None.

### S40 — Marking the dates

**Audio window:** take `p014` · 04:49.755–05:12.320 · s10–s14

**Narration**

> He opened his calendar and started marking the dates. Tuesday. Friday. Next Monday. The following Thursday.

**Shot composition:** Calendar grid; Sam's finger places four coral dots, one per weekday.

**Emotional beat:** Trying to regain control by writing it down.

**Character movement:** Four deliberate marks; his finger is steady.

**Camera movement:** Static; no flip needed within the same month.

**Visual transition:** `pull-back` to reveal further dots at S41.

**Animation beats:**

- **`s10`–`s14`:** Four dots land on `TUE`, `FRI`, `MON`, `THU`. They are the payments he knows about.

**State continuity:** Weekday labels only. The dots are coral because they are committed costs.

**On-screen text:** Weekday tabs only.

### S41 — More than he expected

**Audio window:** take `p015` · 05:12.320–05:33.716 · s01–s03

**Narration**

> There were more of them than he expected. And now, every time he looked at his account, he had to remember that some of that money was already needed for something else. It was a strange feeling.

**Shot composition:** Pull-back from the four marked dots reveals older, fainter dots already on the grid. The account bar sits beneath, its reservations visible.

**Emotional beat:** The gap between what he tracked and what exists.

**Character movement:** He leans in, then sits back. One hand rubs his jaw.

**Camera movement:** The scene's pull-back; ends wide enough to hold calendar and bar together.

**Visual transition:** `hard-cut` to lunch.

**Animation beats:**

- **`s01`:** The extra dots are already there; they were not added by him.
- **`s02`–`s03`:** His posture shifts from leaning to sitting back — the strange feeling is physical.

**State continuity:** The extra dots represent the instalments he never calendared; no count label, no total.

**On-screen text:** None.

### S42 — Careful about lunch

**Audio window:** take `p015` · 05:12.320–05:33.716 · s04–s08

**Narration**

> He had a decent job. He'd been paid on time. He hadn't bought anything wildly expensive. Yet he was suddenly being careful about buying lunch. A month earlier, he wouldn't have thought twice about it.

**Shot composition:** Lunch counter. Sam with phone in hand, looking at the app before ordering. A brief matching frame from a month earlier: same counter, no phone.

**Emotional beat:** A small, specific shrinking of freedom.

**Character movement:** He checks the app, orders anyway, and pays. The earlier version orders without looking.

**Camera movement:** Static in both frames; the match cut does the comparison.

**Visual transition:** `callback-cut` from the present to the earlier frame and back.

**Animation beats:**

- **`s04`–`s06`:** The three reassurances are carried by his bearing — decent job, on time, nothing wild.
- **`s07`–`s08`:** The phone check is the change; the earlier insert is identical minus the phone.

**State continuity:** No price on the lunch. Same counter, same posture, one prop different.

**On-screen text:** None.

### S43 — Lunch with Alex

**Audio window:** take `p016` · 05:33.716–05:58.645 · s01–s03

**Narration**

> Now he was checking his banking app before ordering. The following day, Sam was having lunch with Alex. Alex noticed Sam looking at his phone.

**Shot composition:** Dining table two-shot: Sam and Alex, cups, a shared table. Sam's phone below the table edge, lit.

**Emotional beat:** Ordinary friendship with an ordinary distraction.

**Character movement:** Alex sets down his cup; Sam glances at the phone, then back up.

**Camera movement:** Static two-shot; no push.

**Visual transition:** `cut-on-look` as Alex's eyes land on the phone.

**Animation beats:**

- **`s01`:** The app check is a habit now — quick, unthinking.
- **`s02`–`s03`:** Alex notices; Sam does not notice him noticing.

**State continuity:** Alex's white shirt and glasses per the reference rig. Same table and cups used through S50.

**On-screen text:** None.

### S44 — "Again?"

**Audio window:** take `p016` · 05:33.716–05:58.645 · s04–s07

**Narration**

> "Everything okay?" "Yeah. Just checking my account." "Again?"

**Shot composition:** Alternating medium singles across the table; the phone stays in Sam's hand.

**Emotional beat:** Friendly concern, no judgement.

**Character movement:** Alex leans in slightly; Sam shrugs and sets the phone face-down.

**Camera movement:** Static singles; cut on the question.

**Visual transition:** `cut-on-look` back to Sam's laugh.

**Animation beats:**

- **`s04`–`s06`:** Alex's question is carried by his lean and an open hand.
- **`s07`:** The word "again" lands; Sam's shrug is half a laugh.

**State continuity:** No lip sync; the narrator carries all speech.

**On-screen text:** None.

### S45 — All these payments

**Audio window:** take `p016` · 05:33.716–05:58.645 · s08–s12

**Narration**

> Sam laughed. "I've got all these payments coming out. I keep forgetting about them." "What payments?" Sam told him about the jacket, the headphones, the shoes, and the concert tickets.

**Shot composition:** Two-shot; as Sam counts on his fingers, four small object icons appear over the table between them — not a list card.

**Emotional beat:** Light, self-deprecating honesty.

**Character movement:** Sam counts: jacket, headphones, shoes, ticket. Alex listens without interrupting.

**Camera movement:** Static; the icons take the place of a push.

**Visual transition:** `cut-on-look` to Alex's reaction.

**Animation beats:**

- **`s08`–`s10`:** Sam laughs; the payments are an aside, not a confession.
- **`s12`:** Four icons appear in the air, one per finger count; no amounts.

**State continuity:** The icons are callbacks only. No new information is added to them.

**On-screen text:** None.

### S46 — "You bought all of that this month?"

**Audio window:** take `p016`–`p017` · 05:33.716–06:22.682 · p016 s13–s14, p017 s01–s04

**Narration**

> Alex looked at him. "You bought all of that this month?" "Yeah, but I didn't pay for everything at once." "I figured." Sam shrugged. "Each payment was pretty small."

**Shot composition:** Alex's single, then back to the two-shot for the shrug.

**Emotional beat:** Alex is not shocked; he is already ahead of Sam.

**Character movement:** Alex's pause; Sam's small hand gesture for "not all at once".

**Camera movement:** Static.

**Visual transition:** `cut-on-action` on Sam's shrug.

**Animation beats:**

- **`p016 s13`–`s14`:** Alex's look is steady, not accusatory.
- **`p017 s01`–`s04`:** "I figured" is the first sign Alex already knows the pattern; Sam's shrug is genuine.

**State continuity:** Keep both men at the same height and posture — neither is superior.

**On-screen text:** None.

### S47 — "That's what makes it tempting"

**Audio window:** take `p017` · 05:58.645–06:22.682 · s05–s10

**Narration**

> Alex nodded. "Yeah. That's what makes it tempting." Sam showed him the jacket on his phone. "Look. It wasn't even that expensive when I split it up."

**Shot composition:** Sam turns the phone to Alex; the jacket listing with the split card visible. Alex looks at the jacket, not the split.

**Emotional beat:** Alex's agreement is the last comfortable beat before the question.

**Character movement:** Sam holds the phone up; Alex takes it with both hands and studies the jacket.

**Camera movement:** Small push over Alex's shoulder to the jacket.

**Visual transition:** `match-shape` from the photo's jacket to the peg-rail jacket.

**Animation beats:**

- **`s05`–`s07`:** Alex nods — the temptation is not a character flaw, it is the design.
- **`s08`–`s10`:** The split is visible but Alex's eyes stay on the garment.

**State continuity:** The listing image is the same jacket, same colour, same buttons.

**On-screen text:** The listing's price and `Pay in four` at interface scale.

### S48 — The question

**Audio window:** take `p017`–`p018` · 05:58.645–06:42.436 · p017 s11–s15, p018 s01

**Narration**

> Alex looked at the picture. "Would you have bought it if you had to pay the whole amount that day?" Sam stopped for a moment. "Probably not." "Why?" "Because I didn't want to spend that much on a jacket."

**Shot composition:** Alex lowers the phone slightly; the full `$240` band appears on the table between them as the question is asked.

**Emotional beat:** The pause is the scene. Everything else is quiet.

**Character movement:** Sam's hands stop; his answer comes after a real beat. He does not look away.

**Camera movement:** None. Hold both men in one frame.

**Visual transition:** `hard-cut` on the answer, no flourish.

**Animation beats:**

- **`p017 s11`–`s13`:** The question lands; Sam's stillness is the whole reaction.
- **`p017 s14`–`s15`, `p018 s01`:** "Probably not" and "why" are small; the answer is quieter still.

**State continuity:** The `$240` band is the same length as always; it sits between them as an object.

**On-screen text:** `$240` only.

### S49 — Still the price

**Audio window:** take `p018` · 06:22.682–06:42.436 · s02–s05

**Narration**

> Alex handed the phone back. "Well, that's still how much the jacket costs." Sam knew that. Of course he knew that.

**Shot composition:** The phone returns across the table; the `$240` band and the `$60` card sit side by side.

**Emotional beat:** Being seen without being humiliated.

**Character movement:** Sam takes the phone, looks at the band, nods once.

**Camera movement:** Static.

**Visual transition:** `cut-on-action` on the nod.

**Animation beats:**

- **`s02`–`s03`:** The handoff is ordinary; Alex's statement is not a lecture.
- **`s04`–`s05`:** Sam's nod is the admission; hold it.

**State continuity:** Do not darken Sam, do not change his posture to ashamed. He is thinking.

**On-screen text:** `$240` and `$60`.

### S50 — The number he was thinking about

**Audio window:** take `p018` · 06:22.682–06:42.436 · s06–s09

**Narration**

> The price had been right there on the checkout page. But he'd been thinking about sixty dollars when he bought it. Not the whole amount. And he'd done the same thing with almost everything else.

**Shot composition:** Sam's point of view: the `$60` card in sharp focus, the other three cards and the full band softly out of focus behind it. Then the same shallow focus repeated for the headphone, shoe and ticket columns.

**Emotional beat:** Self-recognition, not self-punishment.

**Character movement:** His thumb touches the `$60` card; no one else moves.

**Camera movement:** Rack focus only; no push.

**Visual transition:** `match-shape` across the four columns in quick succession.

**Animation beats:**

- **`s06`–`s08`:** The focus reveals what he saw; the band stays present but out of focus.
- **`s09`:** Three quick matches confirm the pattern.

**State continuity:** Only the jacket has numerals. The other columns are identified by icon and focus alone.

**On-screen text:** `$60`; `$240` blurred.

### S51 — Alex's laptop

**Audio window:** take `p018`–`p019` · 06:22.682–07:02.498 · p018 s10, p019 s01–s04

**Narration**

> Alex wasn't against installment payments. He'd used them before. A while back, he'd bought a laptop for work and spread the cost over several payments. He'd already planned to buy the laptop, knew what it would cost, and had room for the payments.

**Shot composition:** Flashback insert: Alex at the same desk with a laptop listing. He reads the full band, checks his month, then splits. The whole plan is visible before the first payment.

**Emotional beat:** The same tool used with a decision already made.

**Character movement:** Alex's sequence is deliberate: read, check, split. No hesitation, no excitement.

**Camera movement:** Three static setups; cuts carry the sequence.

**Visual transition:** `cut-on-action` on the first payment.

**Animation beats:**

- **`p018 s10`–`p019 s02`:** The laptop is a planned purchase, not a discovery.
- **`p019 s03`–`s04`:** All four dates are visible before he taps; the teal plan card from S24 is his.

**State continuity:** Reuse the teal planned-expense card; now attach it to Alex. Same laptop as later shots; no brand marks.

**On-screen text:** No laptop price; `Pay in four` at interface scale only.

### S52 — Which question comes first

**Audio window:** take `p019`–`p020` · 06:42.436–07:26.561 · p019 s05–s06, p020 s01–s02

**Narration**

> But he didn't use installments to decide whether he wanted to buy something in the first place. That was the difference. Sam saw a smaller payment and started thinking that something was affordable. Alex decided whether the purchase was worth the full price before thinking about how to pay for it.

**Shot composition:** Two vertical sequences side by side, no words. Left (coral bracket): small payment → decision. Right (teal): full price → decision → payment split. Same icons, same card shapes.

**Emotional beat:** Clarity, delivered as a comparison rather than a verdict.

**Character movement:** Both men remain at the table; the sequences are diagrams between them, not thought bubbles.

**Camera movement:** Static; the comparison is the content.

**Visual transition:** `split-open` from the two sequences into the jacket close-up.

**Animation beats:**

- **`p019 s05`–`s06`:** The two orders of operations settle into place.
- **`p020 s01`–`s02`:** Sam's bracelet of cards starts with the small one; Alex's starts with the full band.

**State continuity:** No words on the diagram, no totals. Teal and coral are the only differentiators, plus sequence.

**On-screen text:** None.

### S53 — It sounded obvious

**Audio window:** take `p020` · 07:02.498–07:26.561 · s03–s07

**Narration**

> It sounded obvious when Alex explained it. But Sam realized he'd been doing it the other way around. He'd see something he liked. Decide it was too expensive. Then see the installment option and change his mind.

**Shot composition:** Sam's replay as a three-beat loop: sees the jacket, decides no, then the split badge appears and the decision flips. Same frame, same jacket.

**Emotional beat:** The retrospective click.

**Character movement:** He acts out the sequence with small gestures — a look, a closed hand, then an open one.

**Camera movement:** Static; the loop is edited, not staged with camera motion.

**Visual transition:** `state-swap` on the flip.

**Animation beats:**

- **`s03`–`s04`:** The replay is short; no slow motion.
- **`s05`–`s07`:** The badge is the only thing that changes between "no" and "yes".

**State continuity:** The jacket stays identical; the checkout sheet is the same one from S05.

**On-screen text:** None.

### S54 — The perfect example

**Audio window:** take `p020` · 07:02.498–07:26.561 · s08

**Narration**

> The jacket was the perfect example.

**Shot composition:** The jacket on the peg rail, its listing preview faintly behind it. Hold both.

**Emotional beat:** A quiet, settled recognition.

**Character movement:** None. Sam is out of frame.

**Camera movement:** None.

**Visual transition:** `cut-on-look` into the tab history.

**Animation beats:**

- **`s08`:** Hold long enough for the object to be read as the example, not as a new purchase.

**State continuity:** The jacket has not changed since S02.

**On-screen text:** None.

### S55 — Closed twice

**Audio window:** take `p021` · 07:26.561–07:49.177 · s01–s05

**Narration**

> He'd already closed that tab twice. He'd basically decided not to buy it. Then the payment option showed up, and suddenly he was happy to order it. Nothing about the jacket had changed. He just didn't have to pay for all of it that day.

**Shot composition:** The tab-history strip from S01, now with two closed cards visible. The checkout sheet reopens; the split appears; the same jacket.

**Emotional beat:** The yes was not a new preference.

**Character movement:** He taps the order without re-reading the price.

**Camera movement:** Static; the history strip and the new order share the frame.

**Visual transition:** `match-shape` from the order to the peg-rail jacket.

**Animation beats:**

- **`s01`–`s03`:** The two closed cards are the proof; no flashback needed.
- **`s04`–`s05`:** The jacket is unchanged; only the payment option is new.

**State continuity:** Payoff on the S01 plant. Do not add a third closed tab.

**On-screen text:** `Pay in four` at interface scale.

### S56 — That night

**Audio window:** take `p021`–`p022` · 07:26.561–08:09.342 · p021 s06–s09, p022 s01–s02

**Narration**

> That night, Sam looked through his purchases again. He wasn't going to return everything. He actually liked the jacket. The headphones were good. And he was looking forward to the concert. But the shoes?

**Shot composition:** Evening wide: jacket, headphones, ticket on the phone. The shoe box sits apart, lid still on.

**Emotional beat:** Contentment for three objects; a question about one.

**Character movement:** He touches the jacket, puts on the headphones briefly, then looks at the box.

**Camera movement:** Slow drift from the kept items to the box.

**Visual transition:** `cut-on-look` at the box.

**Animation beats:**

- **`p021 s06`–`s09`:** The three kept items are clearly enjoyed.
- **`p022 s01`–`s02`:** The question lands on the shoes; the box is the only unopened thing.

**State continuity:** Box has not moved since S29.

**On-screen text:** None.

### S57 — Tried on, put back

**Audio window:** take `p022` · 07:49.177–08:09.342 · s03–s08

**Narration**

> He still hadn't worn them. He pulled the box out of his closet. They looked nice. He tried them on. Walked around the room for a minute. Then put them back in the box.

**Shot composition:** Low shelf (no closet door), box out, shoes on, a short walk across the frame, shoes off, box closed.

**Emotional beat:** The shoes are fine; the purchase isn't.

**Character movement:** Real weight transfer, planted feet, a natural short walk. No comic strut.

**Camera movement:** Static wide; the walk stays inside the 96 px margins.

**Visual transition:** `cut-on-action` on the lid closing.

**Animation beats:**

- **`s03`–`s06`:** Try-on and walk; the shoes look good.
- **`s07`–`s08`:** He takes them off without ceremony and closes the box.

**State continuity:** Shoes stay in the box from here; the lid closing is the decision, not a speech.

**On-screen text:** None.

### S58 — The return

**Audio window:** take `p022` · 07:49.177–08:09.342 · s09–s11

**Narration**

> He checked whether he could still return them. He could. So he started the return.

**Shot composition:** Phone return flow, one screen; the box beside it, receipt tucked inside.

**Emotional beat:** Practical, unremarkable.

**Character movement:** Two taps; he seals the box.

**Camera movement:** Static.

**Visual transition:** `cut-on-action` on the seal.

**Animation beats:**

- **`s09`–`s10`:** The return window is open — no drama, just eligibility.
- **`s11`:** The return starts; the receipt goes in the box.

**State continuity:** No refund amount is shown; none was narrated.

**On-screen text:** Interface text only: `Return`.

### S59 — Not a dramatic change

**Audio window:** take `p022`–`p023` · 07:49.177–08:30.202 · p022 s12, p023 s01–s02

**Narration**

> It wasn't some dramatic change. He didn't delete every shopping app or promise never to buy anything again. He just realized that he'd been making purchases differently.

**Shot composition:** The phone stays on the desk, apps intact. No deleted icons, no crossed-out cards.

**Emotional beat:** Understated understanding.

**Character movement:** He sets the phone down and leaves it there.

**Camera movement:** Static; hold the intact phone.

**Visual transition:** `hard-cut` to the waiting rail.

**Animation beats:**

- **`s12`–`p023 s01`:** Explicitly show that nothing was deleted or renounced.
- **`p023 s02`:** The realization is internal; no lightbulb, no text card.

**State continuity:** Shopping apps remain; this is not a conversion story.

**On-screen text:** None.

### S60 — Before, he waited

**Audio window:** take `p023` · 08:09.342–08:30.202 · s03–s06

**Narration**

> Before, when something felt too expensive, he usually waited. Sometimes he'd come back to it later. Sometimes he'd forget about it completely. And sometimes, after a few days, he'd realize he didn't really want it.

**Shot composition:** The waiting rail in front of an object. Calendar flips: he returns later; another flip: the object fades; another: he walks away.

**Emotional beat:** Waiting as a working filter.

**Character movement:** He returns, looks, and sometimes leaves empty-handed.

**Camera movement:** Static; the calendar flips carry the time.

**Visual transition:** `calendar-flip` between the three outcomes.

**Animation beats:**

- **`s03`–`s04`:** Waiting and returning are shown as normal, not virtuous.
- **`s05`–`s06`:** Forgetting and losing interest happen without comment.

**State continuity:** Same rail motif as S25, now in its original, useful form. No text labels for the outcomes.

**On-screen text:** None.

### S61 — The wait was skipped

**Audio window:** take `p023`–`p024` · 08:09.342–08:50.556 · p023 s07, p024 s01–s03

**Narration**

> With installments, he wasn't giving himself that time anymore. The smaller payment made it easier to skip the waiting. So he'd been buying things the moment he felt like buying them. And now he had several weeks of payments to deal with.

**Shot composition:** The rail retracts the moment he reaches. Four card columns fan out into the following weeks behind him.

**Emotional beat:** The cost of immediacy, shown without moralizing.

**Character movement:** One uninterrupted reach and tap.

**Camera movement:** Small pull-back to reveal the cards behind him.

**Visual transition:** `pull-back` into the next month.

**Animation beats:**

- **`p023 s07`–`p024 s01`:** The rail retracts at the moment of desire; no pause.
- **`p024 s02`–`s03`:** The columns stretch forward in time; he does not turn around.

**State continuity:** The rail is now a mechanism of the payment option, not of his discipline. No totals.

**On-screen text:** None.

### S62 — Paying closer attention

**Audio window:** take `p024` · 08:30.202–08:50.556 · s04–s08

**Narration**

> Over the next month, Sam started paying closer attention. He checked what payments were already scheduled before buying anything new. He still used his card. Still went out with friends. Still bought things he liked.

**Shot composition:** Calendar first, shop second: he checks the marked dates, then browses. Then two quick inserts: card tap, friends at the table.

**Emotional beat:** Not restriction — sequencing.

**Character movement:** He checks, nods, then acts. No hesitation in the social beats.

**Camera movement:** Static; cuts carry the month.

**Visual transition:** `cut-on-action` from the calendar to the watch listing.

**Animation beats:**

- **`s04`–`s05`:** The calendar check comes before the shop, visibly.
- **`s06`–`s08`:** Life continues; nothing is renounced.

**State continuity:** The calendar now has both his marks and the older dots; he reads them together.

**On-screen text:** None.

### S63 — Full price first

**Audio window:** take `p025` · 08:50.556–09:15.034 · s01–s03

**Narration**

> But whenever he saw that familiar Pay in Four button, he looked at the full price first. Sometimes he still thought the purchase was worth it. Other times, he decided to wait.

**Shot composition:** A generic listing: full band on top, `Pay in four` badge below, dimmed until he finishes reading the band.

**Emotional beat:** A changed order of operations, not a ban.

**Character movement:** His eyes move along the full band first; only then does the badge brighten.

**Camera movement:** Static; the badge's dimming/brightening is the mechanic.

**Visual transition:** `match-number` from the band to the watch price.

**Animation beats:**

- **`s01`:** The badge stays dim while the full price is read.
- **`s02`–`s03`:** The outcome is genuinely open: sometimes yes, sometimes wait.

**State continuity:** This is the reversal of S52 — the same interface, a different first question.

**On-screen text:** `Pay in four` at interface scale.

### S64 — The watch

**Audio window:** take `p025` · 08:50.556–09:15.034 · s04–s08

**Narration**

> One evening, he found a watch online. He'd been looking for something similar for a while. It was a nice watch. A little expensive.

**Shot composition:** Watch listing: steel case, navy strap. A small search-history strip shows earlier, similar watches — he has been looking for a while.

**Emotional beat:** Real desire, not impulse.

**Character movement:** He scrolls slowly; tilts the phone; the watch catches the light.

**Camera movement:** Small push to the watch face, then hold.

**Visual transition:** `cut-on-action` as he scrolls to the price.

**Animation beats:**

- **`s04`–`s05`:** The search history establishes genuine prior interest.
- **`s06`–`s08`:** The watch is good; the price band is long.

**State continuity:** Do not name the watch price. Its band is tall, like the ticket's.

**On-screen text:** None on the price.

### S65 — He almost clicked

**Audio window:** take `p025`–`p026` · 08:50.556–09:31.847 · p025 s09–s10, p026 s01–s04

**Narration**

> And right below the price was the same familiar offer. Four easy payments. He almost clicked it. Then he remembered the jacket. And the headphones. And the shoes he'd returned. He looked at the full price again.

**Shot composition:** The badge, four cards, the cursor. Three small callback cards rise at the frame's edge: jacket, headphones, shoes. Then the full band again.

**Emotional beat:** The old pattern reaching for him, and the pause.

**Character movement:** His thumb moves to the button and stops. He pulls it back.

**Camera movement:** Static; the callbacks are inserts, not a montage.

**Visual transition:** `hard-cut` to the full band.

**Animation beats:**

- **`p025 s09`–`s10`:** The offer is identical to S05; the thumb gets most of the way.
- **`p026 s01`–`s03`:** The three callbacks arrive quietly, one per purchase.
- **`s04`:** His eyes return to the band; hold.

**State continuity:** The shoes callback shows the box, not the shoes on his feet. No new prices.

**On-screen text:** `Pay in four`; no watch price.

### S66 — Not today

**Audio window:** take `p026` · 09:15.034–09:31.847 · s05–s09

**Narration**

> Did he really want the watch that much? Maybe. But not today. He closed the tab. And went to make dinner.

**Shot composition:** The watch listing, then the tab closing to an empty page. Sam stands, leaves the frame.

**Emotional beat:** A decision that costs nothing and changes the month.

**Character movement:** He closes the tab, puts the phone down, and walks out. No celebration.

**Camera movement:** Static; hold the empty page.

**Visual transition:** `cut-on-action` as he leaves.

**Animation beats:**

- **`s05`–`s07`:** The answer is honest: maybe, not never.
- **`s08`–`s09`:** The tab closes; the frame stays empty long enough to register.

**State continuity:** No watch, no purchase, no receipt. The search history remains, so the desire is not erased.

**On-screen text:** None.

### S67 — Not automatically a bad thing

**Audio window:** take `p026`–`p027` · 09:15.034–09:53.567 · p026 s10, p027 s01–s03

**Narration**

> Buy Now, Pay Later isn't automatically a bad thing. If you understand the payments, can afford the full purchase, and know what's coming out of your account, it can be a convenient way to pay. Some plans don't charge interest when you pay on time. Others may have interest or fees, depending on the terms.

**Shot composition:** A teal plan card with three checks around it: the four payments read, the full band covered, the calendar dates known. Then two terms cards side by side, one with a small extra line, one without.

**Emotional beat:** Fair, calm qualification.

**Character movement:** Sam's hand performs the three checks; he is not the subject of the caveat.

**Camera movement:** Static.

**Visual transition:** `match-shape` from the teal plan to the final jacket.

**Animation beats:**

- **`s10`–`p027 s01`:** The three conditions are checked in sequence, no words.
- **`p027 s02`–`s03`:** Two terms variants differ by one line; no numbers, no rates.

**State continuity:** Teal stays the alternative, never "correct". Do not imply Sam failed all three; he failed the first two.

**On-screen text:** `Pay in four` on the plan card; `terms` as a small interface label. No interest figure.

### S68 — The small payment and the bigger purchase

**Audio window:** take `p027` · 09:31.847–09:53.567 · s04–s05

**Narration**

> The problem starts when the smaller payments make you buy things you wouldn't normally buy. Because a small payment is still part of a bigger purchase

**Shot composition:** Close on the lit `$60` card; slow pull-back reveals the full `$240` band it belongs to, then the bound jacket, then the four columns. Final frame: jacket on the peg rail, one lit card beside it, three grey.

**Emotional beat:** The quiet close. No triumph, no scolding.

**Character movement:** None. Sam is absent from the final frame.

**Camera movement:** The episode's last pull-back — slow, single, no shake.

**Visual transition:** Hold the settled frame; cut to black after the audio ends.

**Animation beats:**

- **`s04`:** The small card sits inside the band's first quarter; the rest of the band is visibly the same purchase.
- **`s05`:** The pull-back completes on the jacket and cards. Hold, no text card, no lesson.

**State continuity:** The final frame mirrors S05's four-card band and S54's jacket, unchanged. Note: the recorded narration ends mid-sentence here — see open items.

**On-screen text:** `$60` and `$240`; nothing else.

## On-screen text inventory

Typography stays selective; roughly two-thirds of these beats carry no new text. Full plan comes later.

| Beat | Text | Role |
|---|---|---|
| S03, S08, S48–S50, S65 | `$240` | The only large amount; object-attached to the band |
| S05, S09, S16, S51, S55, S63, S65, S67 | `Pay in four` | Diegetic interface label, never a caption |
| S05, S06, S26, S49, S50, S68 | `$60` | The first instalment |
| S22, S40 | `TUE`, `THU`, `MON`, `THU` | Date tabs on payment cards |
| S24, S51 | `planned` | One-word concept label on the teal plan |
| S33, S35, S58, S67 | `Rent`, `Bills`, `Next payday`, `Savings`, `Return`, `terms` | Interface labels only, at UI scale |

No title card, no captions, no subtitles, no closing lesson, no numerals on the account bar, calendar month, headphones, shoes, ticket, repair or watch.

## Open items before animation

1. **Narration and script diverged.** `narration.txt` (1,887 whitespace words, 27 takes) no longer matches `script.md` (1,435 words, nine beats). `check_script_package.py` fails. The recorded master matches `narration.txt` (`9a6bfcc3…`), so the board follows it; the text package needs re-syncing before approval.
2. **The ending is truncated.** The master and `narration.txt` end on "Because a small payment is still part of a bigger purchase" with no full stop and no closing line. Either accept that as the ending or write and record a final sentence; adding one invalidates the master, the take cache and any later cue hashes.
3. **Take text contains file markers.** `**Pay in four. Sixty dollars today. **` and `---` section separators sit inside the manifest take text. They are not spoken, but they should be removed before any regeneration, deliberately and with a fresh listening review.
4. **Quoted dialogue is new.** The narration now voices Alex's lines ("Everything okay?", "Again?", "Would you have bought it…") under one narrator. `qa.md` still claims "no invented dialogue quotes". Confirm the single-narrator dialogue is intended; the board assumes no lip sync and no speech bubbles.
5. **No phrase alignment.** Only 27 draft paragraph windows exist; `mode: "draft"` is rejected by the timeline compiler. Run `npm run narrate:timing` and review phrase timestamps before any scene-level frame plan.
6. **Listening review is false.** `manifest.json` and `cues.draft.json` both record `listeningReviewed: false`. Measured runtime implies roughly 190 words per minute; confirm pace and pronunciation by ear.
7. **Amounts need one source.** `src/finance/math.ts` has no pay-in-four helper. Add a small `payInFour(total, count)` with a `4 × 60 = 240` check before any graphic prints a number, and read `$240`/`$60` from it.
8. **Six new art pieces.** Checkout sheet, payment card, payment column, account bar, calendar grid, watch listing. Everything else should reuse the existing rig, furniture and object primitives.
9. **Episode 001's car art** is reused for the battery beat; keep it unbadged and make no ownership or financing claim.
10. **Home locations are props, not architecture.** The jacket hangs on a peg rail and the shoes come off a low shelf; no door or closet is drawn, per the paper-grain backdrop decision.

## Scene index

| Scene | Window (take) | Sentences | Beat |
|---|---|---|---|
| S01 | p001 00:00.000 | s01–s02 | The jacket he was not planning to buy |
| S02 | p001 | s03–s04 | A nice jacket, nothing special |
| S03 | p001 | s05–s06 | Two hundred and forty dollars |
| S04 | p001–p002 | s07 / s01 | He liked it; he did not want to spend that |
| S05 | p002 00:18.950 | s02–s05 | Pay in four |
| S06 | p002 | s06–s08 | He had sixty dollars |
| S07 | p002 | s09–s10 | It arrived |
| S08 | p003 00:43.090 | s01–s03 | The purchase he had already refused |
| S09 | p003 | s04 | How it started |
| S10 | p003 | s05–s07 | A week later, the headphones |
| S11 | p004 01:04.750 | s01–s05 | That option again |
| S12 | p004 | s06 | A second column |
| S13 | p004 | s07–s10 | Shoes he was not shopping for |
| S14 | p004–p005 | s11 / s01 | On sale, and divisible |
| S15 | p005 01:29.811 | s02–s05 | The concert |
| S16 | p005 | s06–s07 | The ticket website offered instalments |
| S17 | p005 | s08–s09 | Nothing huge |
| S18 | p006 01:54.805 | s01–s03 | Only the first payment |
| S19 | p006 | s04–s08 | The payment messages |
| S20 | p006 | s09–s11 | Nothing alarming |
| S21 | p007 02:16.116 | s01–s04 | He had agreed |
| S22 | p007 | s05–s08 | Tuesday, Thursday, next week, again |
| S23 | p007–p008 | s09 / s01–s02 | Checked one at a time |
| S24 | p008 02:36.976 | s03–s06 | The price does not disappear |
| S25 | p008–p009 | s07–s08 / s01–s03 | What he would have waited for |
| S26 | p009 02:59.546 | s04–s06 | Because the first payment looked easy |
| S27 | p009 | s07 | At first, no problem |
| S28 | p010 03:21.738 | s01–s05 | Everything felt normal |
| S29 | p010 | s06–s09 | Things he was enjoying |
| S30 | p010 | s10–s11 | Every few days, a payment left |
| S31 | p011 03:43.913 | s01–s07 | The battery |
| S32 | p011 | s08–s10 | A quote, not a catastrophe |
| S33 | p012 04:06.833 | s01–s05 | Paycheck arrived, but |
| S34 | p012 | s06–s09 | Afford it, but not comfortably |
| S35 | p013 04:27.353 | s01–s04 | From savings |
| S36 | p013 | s05–s06 | Still payments coming |
| S37 | p013 | s07–s11 | Three things that were not true |
| S38 | p014 04:49.755 | s01–s05 | The reminders |
| S39 | p014 | s06–s09 | He remembered the purchases |
| S40 | p014 | s10–s14 | Marking the dates |
| S41 | p015 05:12.320 | s01–s03 | More than he expected |
| S42 | p015 | s04–s08 | Careful about lunch |
| S43 | p016 05:33.716 | s01–s03 | Lunch with Alex |
| S44 | p016 | s04–s07 | "Again?" |
| S45 | p016 | s08–s12 | All these payments |
| S46 | p016–p017 | s13–s14 / s01–s04 | "You bought all of that this month?" |
| S47 | p017 05:58.645 | s05–s10 | "That's what makes it tempting" |
| S48 | p017–p018 | s11–s15 / s01 | The question |
| S49 | p018 06:22.682 | s02–s05 | Still the price |
| S50 | p018 | s06–s09 | The number he was thinking about |
| S51 | p018–p019 | s10 / s01–s04 | Alex's laptop |
| S52 | p019–p020 | s05–s06 / s01–s02 | Which question comes first |
| S53 | p020 07:02.498 | s03–s07 | It sounded obvious |
| S54 | p020 | s08 | The perfect example |
| S55 | p021 07:26.561 | s01–s05 | Closed twice |
| S56 | p021–p022 | s06–s09 / s01–s02 | That night |
| S57 | p022 07:49.177 | s03–s08 | Tried on, put back |
| S58 | p022 | s09–s11 | The return |
| S59 | p022–p023 | s12 / s01–s02 | Not a dramatic change |
| S60 | p023 08:09.342 | s03–s06 | Before, he waited |
| S61 | p023–p024 | s07 / s01–s03 | The wait was skipped |
| S62 | p024 08:30.202 | s04–s08 | Paying closer attention |
| S63 | p025 08:50.556 | s01–s03 | Full price first |
| S64 | p025 | s04–s08 | The watch |
| S65 | p025–p026 | s09–s10 / s01–s04 | He almost clicked |
| S66 | p026 09:15.034 | s05–s09 | Not today |
| S67 | p026–p027 | s10 / s01–s03 | Not automatically a bad thing |
| S68 | p027 09:31.847 | s04–s05 | The small payment and the bigger purchase |
