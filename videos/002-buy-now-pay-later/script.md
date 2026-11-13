# The Buy Now, Pay Later Trap Nobody Notices

**Status:** Complete script draft for human review. Target 10–12 minutes, unmeasured. No audio, cue alignment, storyboard timing, animation or render is approved or produced.

**Format:** One primary narrator; Sam and Alex act without separate spoken voices. Fictional example. Hairless Sam in blue hoodie; hairless Alex in white shirt and glasses. Yellow = money, coral = cost/loss, teal = alternative. No default subtitles.

**Core concept:** Splitting a price changes the size of the decision, not the size of the cost. The instalment plan makes a purchase feel affordable at the moment of choosing, while the full obligation arrives later as fixed dates.

**Governing rule:** Every financial concept must be legible from the animation and the story alone. A viewer who remembers no number should still be able to explain the trap. Numbers here are evidence, never the explanation, and no calculation is narrated or drawn.

**Draft length:** 1,435 whitespace-separated narration words; 9.6 minutes at 150 wpm (9.3–10.6 across a 155–135 wpm range before delivery). Only measured narration establishes runtime.

**Financial basis:** [sources and assumptions](sources.md). No total, balance or formula appears on screen; the only amounts are the jacket price and its four equal instalments, which agree with each other. If a storyboard later labels dates or amounts, they must be derived through `src/finance/math.ts` rather than typed.

**Read order:** Only the marked narration blocks are spoken. Headings, support IDs and visual notes are production metadata and stay out of `narration.txt`.

## B01 — Hook: the small number at the button

**Support:** F01, F04. **Visual note:** Sam holds the jacket, price panel reading one number. The panel splits into four cards; only the first is lit and paid, the other three grey out and drift out of frame above him. The jacket stays the same size and colour throughout — nothing about the object changes when the price is divided. Concept made visible: the decision shrank, the goods did not.

<!-- NARRATION -->

Sam bought a jacket he wasn't going to buy.

Two hundred and forty dollars. He'd looked at it twice that week and put it back both times. Then the checkout page offered to split it into four payments of sixty. He paid the first one and left with it.

The jacket didn't get cheaper. It was still two hundred and forty dollars, and it was still his to pay. But somewhere between the price and the button, the size of the decision changed. He wasn't deciding whether he could afford a jacket. He was deciding whether he could afford sixty dollars.

The offer looks like a helpful little button.

<!-- /NARRATION -->

## B02 — Discovery: the counter became a lender

**Support:** F01, F02, F03. **Visual note:** A row of checkout screens — tickets, groceries, a dentist invoice, a phone. Each shows the same split-payment shape; no brand marks are shown or implied. The payment plan is arranged on the same checkout screen; do not imply that the shop itself is the lender. Then the layaway contrast: the same jacket behind a counter, waiting, with a small queue of dated tokens between customer and goods. No calendar arithmetic on screen.

<!-- NARRATION -->

The same offer appears on concert tickets. Groceries. A dentist's bill. The phone he bought last year. Same offer, roughly the same shape. Pay in four. Pay over six weeks. Pay over twelve months. Whatever fits the moment.

It isn't buried in a finance app he had to go looking for. It sits on the payment page, right next to the price, competing with the price. That's the first thing that changed. Paying for something used to require having the money, or convincing someone at a bank that you were worth the risk. Now he can arrange the payments right at checkout, without going to a bank.

There used to be a version of this where you waited. Layaway. You paid the shop a little at a time and collected the jacket when the last payment cleared. It was slow, and it had one clear advantage. The thing stayed in the shop until it was yours. The waiting was the discipline. Nobody had to teach it, because the arrangement did it for you.

This version kept the payments and dropped the waiting.

When every price can be split, you can end up looking at the installment instead of the full price.

<!-- /NARRATION -->

## B03 — Temptation: paying feels different in pieces

**Support:** F04, F05. **Visual note:** Three payments in sequence on one frame band: cash leaving a hand (weighted, the hand dips), a card tap (a thin line, no weight), then a split payment where the cost visibly travels along a timeline away from the present. Then the yardstick shot: the same jacket measured against a rent-height rule, then measured against a dinner-height rule — the object is identical, the rule changes. Then Sam browsing with the pages he used to close; the browsing is shown, the spending is not yet.

<!-- NARRATION -->

Sam didn't decide to spend more. He decided, over and over, that a small number was fine.

Paying feels different depending on how you do it. Hand over cash and you feel it go. The weight of it, the gap in your wallet. Tap a card and the feeling thins out. Split the payment and you've done something cleverer than removing the feeling. You've moved it. The pain slides from now to later, and it arrives in pieces small enough to ignore.

There's a second effect, and it's the one that actually changes the decision. When the price is one number, your brain compares it to big things. Two hundred and forty dollars. That's a chunk of rent. That's a fortnight of groceries. When the price is sixty, it compares to small things. A dinner. A tank of fuel. A t-shirt. The yardstick changes before your judgment does.

So the jacket went from "not this month" to "obviously fine" without the jacket getting any cheaper. He didn't lower his standards. He got a different tape measure.

And the button is everywhere, which means the practice gets rehearsed. Sam starts opening clothing pages he used to close. Not because he's become a different person, but because looking got cheaper. When he doesn't have to pay in full up front, buying feels easier.

<!-- /NARRATION -->

## B04 — The trap: separate schedules, one month

**Support:** F01, F04. **Visual note:** One plan is four dated cards, spaced and tidy. Then another purchase drops four more cards, then another. Each purchase keeps its own column; nothing ever joins them. Camera pulls back to reveal the columns overlap across the same weeks. Then a single friendly reminder notice, alone on screen, repeated three times with different objects — never a combined total, because none exists. Concept made visible: no shared page, shared month.

<!-- NARRATION -->

Dividing a price doesn't make it smaller. It makes the decision smaller and the obligation longer. Sam still owes the whole amount. He owes it in four appointments instead of one, and each appointment shows up whether or not he's in the mood.

One plan on its own is manageable. That's exactly why it works. Nothing about four payments of sixty is unreasonable, and that's the point. This trap isn't built out of bad decisions. It's built out of reasonable ones, stacked.

Sam never sees all of it at once. Every purchase gets its own little schedule, its own confirmation screen, its own cheerful reminder. Sam doesn't add them together. There's no page in his life that tells him how much of next month is already spoken for. He'd have to build that page himself, and he isn't doing that while he's standing at a checkout.

You can see it in the reminders, too. Each one is friendly, each one is small, each one arrives alone. If they arrived together, on one screen, with one total, the schedule would have a different name. It would be a bill.

So the payments never stacked in his head. They stacked in his calendar.

There's no villain in this story, no hidden clause, and not one fee. It just needed a lot of small, separate, completely reasonable yeses landing on the same four weeks.

<!-- /NARRATION -->

## B05 — Complication: "he'd have bought it anyway"

**Support:** F04. **Visual note:** The checkout button flickers between a "no" state and a "yes" state; the split card is what flips it. Then two versions of Sam on the same frame, shop-Sam and month-later-Sam, and the dated obligation walks from one to the other while the first one looks pleased. No shaming: both versions are drawn with the same face and posture.

<!-- NARRATION -->

You might be thinking Sam would have bought the jacket anyway.

Maybe. But look at what happened at the button. He'd already said no twice at the real price. The plan is what turned a no into a yes. It persuaded him to buy something he'd already decided against.

And you might be thinking the fix is obvious. Be disciplined. Keep a buffer. Know your limits.

The problem there is timing. These commitments are made by the version of you standing in a shop, feeling optimistic, with good intentions and a working card. They come due in a different month, when your circumstances may have changed. The obligation doesn't care which version agreed to it. It just arrives.

Discipline is a plan for the person you are right now. That's why it keeps losing to a calendar.

<!-- /NARRATION -->

## B06 — Consequence: he runs out of room, not money

**Support:** A01. **Visual note:** A repair estimate arrives as one lump block at the counter. Sam's income bar is drawn with segments already carved out and labelled only by shape, not amount; the lump cannot fit beside them. Coral spread widens as the options shrink — borrow, wait, cheap fix — shown as three narrowing frames, never as a smaller number. Savings drawn as a soft, movable cushion that gets taken first.

<!-- NARRATION -->

Six weeks later, the car needs work. Not a disaster. A normal, boring, entirely predictable thing that cars do.

Sam has the money. That's not the issue. The issue is when.

The repair wants a lump, today. Meanwhile his income already has several small payments sitting on it, spread across the next few weeks. So he doesn't say no to the mechanic. He says yes to something worse. He borrows. Or he waits. Or he takes the cheapest version of the fix and hopes it holds until spring.

Most likely he does something quieter than any of those. He moves money out of savings, tells himself it's temporary, and puts the weekend back on the card. The savings go first, because savings are the only soft thing he has. The payment schedule doesn't have that problem. It has dates.

And this is the cost nobody prints on the label. Losing flexibility doesn't show up as a smaller number on a statement. It shows up as a smaller set of choices. Sam didn't run out of money. He ran out of room.

The jacket is in the closet the whole time, hanging there, doing nothing.

<!-- /NARRATION -->

## B07 — Contrast: Alex asks a different question

**Support:** A01. **Visual note:** Alex gets the identical checkout. The split card appears, and he sets it aside without rejecting the goods. One price card, unsplit, in teal. The better coat from last year hangs in his closet, worn. No superiority staging: same room, same budget baseline, same posture.

<!-- NARRATION -->

Alex gets the same offers. Same jacket, same button, same sixty dollars.

The difference isn't that Alex says no. He buys things. He bought a better coat than that jacket last year, and he's still pleased with it.

Sam asked him once how he says no. Alex's answer wasn't about willpower. He said the jacket was fine. The price wasn't. He liked the jacket but didn't want to pay that much for it.

Alex asks himself one question at the counter. Would I buy this if it were one payment?

He asks it before the price gets cut into pieces, without a budget spreadsheet or a set of rules. If the answer is yes, he buys it and it's done. If the answer is no, four payments don't get to answer for him.

You could call that discipline. It's closer to refusing to make a decision with a number that isn't the real one.

<!-- /NARRATION -->

## B08 — Payoff: the bill moved, it didn't leave

**Support:** F01, F02. **Visual note:** One hard stroke and four soft strokes of the same total length, drawn one above the other — the lengths identical, only the pressure differs. Then the counter window again, with the shop paying a small token across the sill; the clerk keeps it and the customer never sees the exchange. Then the opening jacket, now with its four payment ghosts behind it.

<!-- NARRATION -->

So what did the payment plan actually do for Sam?

It moved the bill. It didn't remove it. It turned one hard cost into four soft ones, and in that gap it bought a yes he wouldn't otherwise have given.

It doesn't need a misleading advert, secret terms, or anyone being foolish. It only needs the number at the moment of decision to be smaller than the number you'll actually pay.

And it isn't a scam. The shop offering the plan is buying a sale it might not otherwise get, and paying a fee for the privilege. Sam knows the full price, but at checkout he's focused on one payment at a time.

Paying in pieces doesn't lower the total price. It changes when you pay for it, and what you have left when you do.

<!-- /NARRATION -->

## B09 — Close: the price never changed

**Support:** none. **Visual note:** Jacket on the chair in the closet, four empty payment cards stacked beside it. Hold the settled frame; no camera move, no text card, no lesson.

<!-- NARRATION -->

The jacket was still two hundred and forty dollars. Sam met it in four pieces, and each one was small enough to say yes to.

He'll do it again next month, because the button will be there next month, and it will still be helpful.

The price never changed. The decision did.

<!-- /NARRATION -->

## Production notes

- **Nothing is calculated on screen.** No total, no sum, no rate, no table. The two amounts that do appear are the price and one instalment, and they are consistent.
- **Concept legibility test (per beat):** with every number removed, does the shot still show the trap? If a scene needs a figure to make sense, the scene is wrong, not the figure.
- **Deliberately omitted:** brand names, market statistics, late-fee percentages, credit-score effects and any claim about what most users do. The story argues from structure, not from prevalence.
- **Not claimed:** that instalment plans are always harmful, that Sam is foolish, or that Alex's approach guarantees anything. Alex differs in one question, not in income, foresight or luck.
