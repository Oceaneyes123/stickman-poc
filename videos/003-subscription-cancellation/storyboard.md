# Video 003 — Storyboard

**Title:** Why Is Canceling a Subscription So Hard?  
**Status:** Editorial storyboard for review; planned visuals only.  
**Script:** 1,094 narration words; SHA-256 `f46d1e9b2d36198be0ac50a8953fa3966ae863dd2f7d48bb36bc0c1b54cba366`. P01–P46 refer to one-based paragraph blocks in `narration.txt`; exact excerpts are included below. Remap after any script edit.

## Direction and timing

Offer → automatic renewal → unfinished exit → business incentive → documented case → completed cancellation. No recurring character or stickman staging. The opening develops through distinct screen states and framings rather than one stationary offer card. One dominant idea per shot; clean cuts, restrained purposeful moves and readable holds. No perpetual motion or sentence-by-sentence subtitles.

Maximum finished runtime: **10:00**, including pauses and outro. Estimated speech at 130–150 WPM: **7.29–8.42 minutes**. Reserve up to 12 seconds for the end card and use remaining headroom for necessary holds. No shot timestamps or frame cues are approved. The Daniel audition covers only three sentences and cannot time the full film. Measure full natural narration, review phrase cues and compile with `src/timeline/compiler.ts`; revise text or holds if needed, never accelerate or stretch speech.

1920×1080, 30 fps; development review at 0.5 scale and phone size. Local Inter; 96 px minimum side margins for essential graphics. Navy #14243A and white #F8FAFC form the base, yellow #F3BE58 indicates money, coral #FF6B6B cost/obligation, teal #39B8B6 alternatives. Pair color with a readable label/state. Reuse existing typography, object-motion and transition components during implementation where suitable; the graphics proposed below are not implemented components.

Follow decision 14: no fictional, illustrative or demo labels on generic scenes. Their invented status stays in this production record. Generic interfaces use no real-company branding and never stand as authentic Amazon evidence. The named case is a visually distinct, sourced section with historical and allegation qualifications.

## Evidence, assumptions and assets

- **E01:** *Selling Subscriptions*, first research row in `sources.md`. Ten-service scope; no invented chart, percentage or certainty about individual motives.
- **E02:** *Staying at the Roach Motel*, second research row. Selected news websites in four countries.
- **E03:** Amazon FTC announcement and court record in `sources.md`. Distinguish historical allegations from the 2025 settlement and current practices.
- **E04:** FTC dark-pattern report in `sources.md`.
- **A01:** Invented generic streaming offer, customer actions and cancellation screens. No real provider/customer or actual charge implied; no invented price or trial length.
- **A02:** Simplified one-time purchase versus automatic-renewal process; actual terms and payment outcomes vary.
- **A03:** Illustrative schedule constraint, not a provider's actual opening hours.
- **A04:** Generic clear retention offer; no fabricated discount amount or savings claim.
- **A05:** Generic monthly-billed annual commitment. Fees/remaining payments depend on contract terms; no provider-specific fee is shown.
- **A06:** Generic account management, confirmation and access-date behavior; actual providers differ.

G01–G20 are proposed original graphics, not finished assets. F01/F02 are pending footage candidates with original-art fallbacks; no footage has been acquired. E01–E04 support facts, not permission to reproduce website images. Document excerpts remain pending authenticity/context/reuse review. Before use, create the manual `asset-manifest.json` records defined in `references/MEDIA_SOURCING.md`, with provenance, intended use, permissions/attribution evidence and frozen local files/hashes. Pending third-party assets cannot enter delivery renders. Use the source-attributed original case card if document reproduction is unresolved.

## Shot plan

### S01 — The offer

- **Narration/story moment:** P01–P02.

> You signed up to watch one show.
>
> There was a free trial, the show looked good, and getting started took less than a minute.

- **Learning need:** Recognize why joining is useful.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original streaming interface — chosen to make the named learning need visible.
- **Primary subject:** The offer; the specific object/state is defined in the action.
- **Animation/camera:** Show one original series tile. Selecting it reveals Start free trial; cut closer to the action. No invented price or trial length.
- **Visible text:** Start free trial. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G01: original show tile, offer and player
- **Source/license requirements:** A01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The offer solves an immediate viewing need.

### S02 — The show ends

- **Narration/story moment:** P03–P03.

> A week later, you’ve finished watching. You open your account, find the subscription, and decide to cancel.

- **Learning need:** Separate finishing the show from canceling membership.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original player and account page — chosen to make the named learning need visible.
- **Primary subject:** The show ends; the specific object/state is defined in the action.
- **Animation/camera:** The player reaches the final episode end. Cut to the same account with membership active; select Cancel membership.
- **Visible text:** Membership active; Cancel membership. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G01; G02: generic account
- **Source/license requirements:** A01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Finishing viewing does not end renewal.

### S03 — The moving exit

- **Narration/story moment:** P04–P05.

> The first page asks if you’re sure. The next reminds you what you’ll lose. Then there’s another offer, another button, and another page.
>
> At some point, you may wonder if you’ve canceled already—or if you’ve just told the website that you’re thinking about canceling.

- **Learning need:** Show intent without completion.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original cancellation interface sequence — chosen to make the named learning need visible.
- **Primary subject:** The moving exit; the specific object/state is defined in the action.
- **Animation/camera:** Within one viewport, advance through confirmation, benefits and retention offer. Show one page at a time; each action exposes another required step. No canceled status yet.
- **Visible text:** Keep membership; Continue canceling. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G02: cancellation states
- **Source/license requirements:** A01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The first cancellation action may only start the process.

### S04 — The financial question

- **Narration/story moment:** P06–P07.

> Some subscriptions are easy to end. But when leaving takes more effort than joining, that extra effort can have a financial value to the company collecting the payments.
>
> To understand why, start with what made the subscription convenient.

- **Learning need:** Connect extra effort to a possible future payment.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original process graphic — chosen to make the named learning need visible.
- **Primary subject:** The financial question; the specific object/state is defined in the action.
- **Animation/camera:** Widen from the unfinished exit to a still-active renewal instruction. Define the connection through the state, without a revenue counter or claim about every company.
- **Visible text:** Renewal active. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G03: renewal instruction
- **Source/license requirements:** A01; E01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** An unfinished exit can leave renewal active.

### S05 — One purchase ends

- **Narration/story moment:** P08–P08.

> When you rent a movie, you pay, watch it, and the transaction ends. Another movie means another purchase.

- **Learning need:** Establish a one-time baseline.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original rental receipt and player — chosen to make the named learning need visible.
- **Primary subject:** One purchase ends; the specific object/state is defined in the action.
- **Animation/camera:** One receipt leads to one viewing session and a visible endpoint. Another movie sits beyond it with a new purchase control; no universal rental-expiry claim.
- **Visible text:** One-time rental; Rent another movie. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G04: receipt and original movie tiles
- **Source/license requirements:** A02. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Another purchase needs another decision.

### S06 — Convenience across renewal

- **Narration/story moment:** P09–P09.

> An automatically renewing subscription keeps going until something changes. Your music doesn’t stop every month while you hunt for your card. The company gets a more predictable income, and you skip another checkout.

- **Learning need:** Explain the benefit of automatic renewal.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original process graphic and music-player insert — chosen to make the named learning need visible.
- **Primary subject:** Convenience across renewal; the specific object/state is defined in the action.
- **Animation/camera:** Show access continuing across a billing boundary without a new checkout. Keep one membership object identifiable; demonstrate two periods, then hold.
- **Visible text:** Automatic renewal. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G03; G05: generic music player
- **Source/license requirements:** A02. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Renewal avoids repeated checkout.

### S07 — Use changes; billing continues

- **Narration/story moment:** P10–P12.

> That arrangement can work well while you’re using the service. Then the show ends, the project finishes, or your needs change.
>
> The renewal keeps doing exactly what it was designed to do.
>
> Now you have to notice the charge, find the cancellation process, and finish it before another payment. Otherwise, the subscription can continue even though the reason you joined has disappeared.

- **Learning need:** Show the mismatch between need and renewal.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Context footage followed by original graphic — chosen to make the named learning need visible.
- **Primary subject:** Use changes; billing continues; the specific object/state is defined in the action.
- **Animation/camera:** A neutral laptop closes. Return to the finished show tile while its renewal instruction advances. Expose Manage membership as the action required to change it. No balance or invented actual charge.
- **Visible text:** Next renewal; Manage membership. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** F01: laptop-closing footage candidate; G01/G03. Original laptop illustration fallback.
- **Source/license requirements:** A01; A02. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Changed needs do not automatically change the payment instruction.

### S08 — The default

- **Narration/story moment:** P13–P14.

> This is the power of a default: what happens when you don’t make another choice.
>
> For a one-time rental, the default is that the transaction ends. For an automatically renewing subscription, the default is that it continues. The effort falls in a different place.

- **Learning need:** Make doing nothing visible.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original aligned comparison — chosen to make the named learning need visible.
- **Primary subject:** The default; the specific object/state is defined in the action.
- **Animation/camera:** Place rental and subscription in two rows with comparable starting states. With no pointer input, advance beyond viewing: rental ends and subscription renews. Name the concept after the difference appears.
- **Visible text:** No new action; Ends; Renews; Default. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G06: comparison using G03/G04
- **Source/license requirements:** A02. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The default determines what happens without action.

### S09 — An interruption in the data

- **Narration/story moment:** P15–P16.

> Researchers found a useful way to examine that difference. They studied payment-card data for ten subscription services, looking at what happened when customers’ cards were replaced. Replacements could interrupt the usual payment and require customers to take an active step to continue.
>
> Cancellation rates rose around those replacement months.

- **Learning need:** Present the study finding without invented precision.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Source-attributed research diagram — chosen to make the named learning need visible.
- **Primary subject:** An interruption in the data; the specific object/state is defined in the action.
- **Animation/camera:** Introduce the study scope, replace a payment card, interrupt the usual instruction, and expose an active renewal choice. Finish with the qualitative finding. Do not draw a chart or invent a percentage.
- **Visible text:** 10 subscription services; Card replacement; Higher cancellation around replacement. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G07: card replacement diagram; E01 citation
- **Source/license requirements:** E01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Card replacements were associated with more cancellations in the sample.

### S10 — Observation and interpretation

- **Narration/story moment:** P17–P18.

> The data doesn’t reveal every customer’s reasons. Some may have forgotten a service; others may have reconsidered its value. The researchers modeled inattention and cancellation costs, and their estimates depend on the services and assumptions they studied.
>
> But the finding shows why an automatic payment matters. Interrupt the payment, and some customers make a different choice.

- **Learning need:** Keep customer motives uncertain.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original evidence/interpretation composition — chosen to make the named learning need visible.
- **Primary subject:** Observation and interpretation; the specific object/state is defined in the action.
- **Animation/camera:** Keep the observed finding dominant. Reveal inattention and reconsidered value as possible explanations, not confirmed individual reasons. Identify model estimates, then return to the renewal choice.
- **Visible text:** Observed: more cancellations; Possible reasons; Model estimates. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G08: interpretation layout using G07
- **Source/license requirements:** E01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The data do not reveal each customer’s reason.

### S11 — Finding the way out

- **Narration/story moment:** P19–P20.

> Of course, remembering the subscription is only the first step. You still have to leave.
>
> Imagine a large button labeled “Keep membership,” with a smaller link underneath to continue canceling. You decline a discount, pass a reminder of the features you’ll lose, and reach an offer to pause instead.

- **Learning need:** Demonstrate retention steps.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original interface sequence — chosen to make the named learning need visible.
- **Primary subject:** Finding the way out; the specific object/state is defined in the action.
- **Animation/camera:** Return to the opening account design. Show a prominent keep button and a smaller but readable cancellation link. Advance through discount, benefits and pause pages; keep the route to continue visible. No authentic-brand styling.
- **Visible text:** Keep membership; Continue canceling; Pause membership. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G02: retention-page states
- **Source/license requirements:** A01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Each retention page can add effort to leaving.

### S12 — The interruption

- **Narration/story moment:** P21–P23.

> Each screen creates another moment where the process can stop.
>
> A meeting starts. You close the page. Or you think the last button completed the cancellation, when there’s another confirmation below it.
>
> If you haven’t finished, the default may carry on.

- **Learning need:** Show why completion matters.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original desktop and account states — chosen to make the named learning need visible.
- **Primary subject:** The interruption; the specific object/state is defined in the action.
- **Animation/camera:** A neutral meeting notice appears beside the unfinished page. Close the page before the final confirmation. Cut to the same membership, still active, with renewal pending.
- **Visible text:** Meeting starting; Membership active. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G09: meeting notice; G02/G03
- **Source/license requirements:** A01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Closing a cancellation page does not necessarily cancel membership.

### S13 — Documented barriers

- **Narration/story moment:** P24–P24.

> Researchers examining news subscriptions across several countries documented barriers including requirements to call a representative or type a phrase. Those examples don’t describe every service. They show how a choice can be available while still taking effort to carry out.

- **Learning need:** Connect the scenario to research.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Research citation and original interaction examples — chosen to make the named learning need visible.
- **Primary subject:** Documented barriers; the specific object/state is defined in the action.
- **Animation/camera:** Introduce E02, then separate inserts for a phone requirement and typed-phrase requirement. Show the study scope. These are demonstrations of categories, not screenshots of sampled sites.
- **Visible text:** Call to cancel; Type to confirm; News sites in four countries. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G10: phone control and phrase field; E02 citation
- **Source/license requirements:** E02. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Researchers found additional effort in selected news cancellation flows.

### S14 — Office hours

- **Narration/story moment:** P25–P25.

> That effort isn’t equally easy for everyone. A phone call during office hours can be difficult for someone working shifts or caring for family. “Just cancel it” assumes that deciding to leave and successfully leaving are practically the same task.

- **Learning need:** Show the practical burden fairly.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Context footage and original availability diagram — chosen to make the named learning need visible.
- **Primary subject:** Office hours; the specific object/state is defined in the action.
- **Animation/camera:** Show a phone beside neutral work equipment, then work hours overlapping phone-cancellation hours. Use undated blocks, not invented provider opening times. Hold the overlap.
- **Visible text:** Work hours; Phone cancellation hours. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** F02: work/phone footage candidate; G11: availability blocks. Original desk illustration fallback.
- **Source/license requirements:** A03. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** A phone requirement can conflict with other obligations.

### S15 — Why the company cares

- **Narration/story moment:** P26–P27.

> For the company, the two tasks can have very different outcomes.
>
> A completed cancellation ends future subscription payments. A postponed cancellation can leave the next charge in place. That gives a business a reason to pay attention to every step between the customer’s decision and the final confirmation.

- **Learning need:** Explain the incentive through outcomes.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original branching process — chosen to make the named learning need visible.
- **Primary subject:** Why the company cares; the specific object/state is defined in the action.
- **Animation/camera:** Branch from one cancellation attempt. Completion reaches confirmation and stops renewal; postponement leaves renewal active. Show a future billing marker only on the active path, without guaranteeing a successful charge.
- **Visible text:** Completed; Postponed; Renewal stops; Renewal remains active. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G12: branch diagram using G02/G03
- **Source/license requirements:** A02; conceptual inference supported by E01. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** A postponed cancellation can preserve a payment opportunity.

### S16 — The useful offer

- **Narration/story moment:** P28–P29.

> But a discount might actually help the customer. Why shouldn’t a company offer one?
>
> It can. A lower price may make a service worthwhile, and a pause may suit someone who plans to return. The issue is whether declining those offers and finishing the cancellation remains clear and straightforward.

- **Learning need:** Present the counterpoint fairly.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original retention interface — chosen to make the named learning need visible.
- **Primary subject:** The useful offer; the specific object/state is defined in the action.
- **Animation/camera:** Show a discount without an invented price or percentage. Accept offer and Continue canceling are comparably clear. Demonstrate declining and reaching confirmation directly; do not hide the exit behind the offer.
- **Visible text:** Accept offer; Continue canceling. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G13: clear retention alternative
- **Source/license requirements:** A04. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** A retention offer can help when declining is straightforward.

### S17 — Design that steers

- **Narration/story moment:** P30–P31.

> Regulators and researchers use the term dark pattern for certain designs that mislead people or steer their choices. Obscuring a cancellation option can be one example. A useful confirmation screen, by itself, isn’t evidence of deception.
>
> The distinction is what the design helps the customer do.

- **Learning need:** Distinguish useful confirmation from obstruction.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original controlled interface comparison — chosen to make the named learning need visible.
- **Primary subject:** Design that steers; the specific object/state is defined in the action.
- **Animation/camera:** Compare G13 with the earlier obscured exit using the same wording and viewport. Isolate the difference, then hold. Introduce Dark pattern without branding every confirmation deceptive.
- **Visible text:** Dark pattern; Clear exit; Obscured exit. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G06; G13/G02
- **Source/license requirements:** E04; A01/A04. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Judge what the design helps the customer do.

### S18 — The Amazon case

- **Narration/story moment:** P32–P32.

> In 2023, the United States Federal Trade Commission sued Amazon over Prime enrollment and cancellation practices. The FTC alleged that Amazon enrolled millions of consumers without informed consent and made cancellation difficult. Amazon contested the allegations, and the case was later settled.

- **Learning need:** Enter a specific historical case with attribution.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Authentic document excerpt, with original case-card fallback — chosen to make the named learning need visible.
- **Primary subject:** The Amazon case; the specific object/state is defined in the action.
- **Animation/camera:** Cut away from generic screens. Show FTC v. Amazon, 2023, and enrollment/cancellation as distinct issues. Keep FTC allegations, contested and later settled readable; do not imply an allegation is a finding.
- **Visible text:** FTC v. Amazon; US · 2023; FTC allegations; Enrollment; Cancellation; Contested; Settled. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** E03 excerpt candidate; G14: source-attributed case card fallback
- **Source/license requirements:** E03. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The named case concerns specific US allegations and a settlement.

### S19 — Four screens, six clicks

- **Narration/story moment:** P33–P33.

> An older cancellation process described in the case allegedly required four screens and six clicks, with reminders and a pause option along the way.

- **Learning need:** Explain the alleged historical route.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original source-backed schematic — chosen to make the named learning need visible.
- **Primary subject:** Four screens, six clicks; the specific object/state is defined in the action.
- **Animation/camera:** Arrange four abstract page silhouettes and six sequential interaction markers. Isolate reminder/pause alternatives. No invented exact layout, copied screenshot or guessed button wording; retain the allegation and historical qualifier.
- **Visible text:** Older process alleged in the case; 4 screens · 6 clicks; Reminder; Pause. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G15: abstract historical flow; E03 citation
- **Source/license requirements:** E03. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The older alleged process required several interactions.

### S20 — The settlement

- **Narration/story moment:** P34–P35.

> In 2025, Amazon agreed to a settlement including a one-billion-dollar civil penalty and one and a half billion dollars for consumer redress, alongside changes to its enrollment and cancellation practices.
>
> That settlement addressed both enrollment and cancellation allegations. The older process is not being described as Amazon’s current experience.

- **Learning need:** Preserve the two categories and the scope.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original sourced settlement graphic — chosen to make the named learning need visible.
- **Primary subject:** The settlement; the specific object/state is defined in the action.
- **Animation/camera:** Reveal the 2025 date, civil penalty, then consumer redress as separate categories. Keep enrollment and cancellation in scope. Do not imply these sums were cancellation fees or refunds already distributed.
- **Visible text:** 2025 settlement; $1 billion civil penalty; $1.5 billion consumer redress; Enrollment + cancellation; Historical process. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G16: settlement categories; E03 citation
- **Source/license requirements:** E03. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The settlement covered both practices and required relief and changes.

### S21 — Behind the button

- **Narration/story moment:** P36–P37.

> The case illustrates why the exit matters: a series of small decisions on a website can affect a large number of customers.
>
> Sometimes, though, the obstacle is the commitment behind the button.

- **Learning need:** Shift from interface friction to contractual commitment.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original account-to-document reveal — chosen to make the named learning need visible.
- **Primary subject:** Behind the button; the specific object/state is defined in the action.
- **Animation/camera:** Return to a neutral cancellation control. Reveal the agreement behind the account and move once toward its commitment terms. Stop when the relevant fields are visible.
- **Visible text:** Subscription terms. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G17: generic subscription agreement
- **Source/license requirements:** A05. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The commitment can affect leaving before interface design does.

### S22 — Billing and commitment

- **Narration/story moment:** P38–P39.

> A plan can charge monthly while committing you to a longer period. A monthly payment and a month-to-month contract are not necessarily the same thing. Depending on the terms, ending early could involve a fee or remaining payments.
>
> An annual commitment can come with a lower price, and a clearly explained tradeoff may suit the customer. The problem is when a condition that would affect the decision is hard to see until they try to leave.

- **Learning need:** Separate payment frequency from contract length.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original document detail and term strip — chosen to make the named learning need visible.
- **Primary subject:** Billing and commitment; the specific object/state is defined in the action.
- **Animation/camera:** Show Monthly billing and Annual commitment as separate fields. Expand the term strip, then expose possible early-exit terms without inventing a fee. Present price benefit beside commitment at equal prominence; no tiny-print gotcha.
- **Visible text:** Monthly billing; Annual commitment; Early-exit terms; Terms vary. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G17; G18: term strip
- **Source/license requirements:** A05. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** Monthly billing does not necessarily mean a monthly contract.

### S23 — Where to manage it

- **Narration/story moment:** P40–P40.

> So when you decide to cancel, check where you purchased the subscription, its renewal date, and its terms. Some subscriptions are managed through an app store rather than the service’s website.

- **Learning need:** Make the practical step followable.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original account-navigation diagram — chosen to make the named learning need visible.
- **Primary subject:** Where to manage it; the specific object/state is defined in the action.
- **Animation/camera:** Present service account and app-store subscriptions as alternative routes. Follow one at a time to renewal date and terms; no real-store logo or suggestion both routes apply universally.
- **Visible text:** Purchased through service / app store; Renewal date; Terms. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G19: account-management routes
- **Source/license requirements:** A06. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The purchase route can determine where cancellation is managed.

### S24 — The completed cancellation

- **Narration/story moment:** P41–P42.

> Keep the final confirmation and check the access end date. A warning about losing benefits isn’t necessarily confirmation that cancellation is complete. A discount offer isn’t a cancellation either.
>
> That confirmation also gives you a record if a charge appears afterward and you need to contact the company or payment provider.

- **Learning need:** Distinguish final status from an intermediate offer.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original account confirmation and saved record — chosen to make the named learning need visible.
- **Primary subject:** The completed cancellation; the specific object/state is defined in the action.
- **Animation/camera:** Advance beyond the offer to Subscription canceled. Separate access-end information from cancellation status; no invented specific date required. Save the confirmation to a records folder and hold it beside a support-contact control.
- **Visible text:** Subscription canceled; Access end date; Save confirmation. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G20: final account status, record and folder
- **Source/license requirements:** A06. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** A confirmation records completion and relevant access information.

### S25 — Return to the offer

- **Narration/story moment:** P43–P44.

> The trial at the beginning offered a convenient way to watch a show. Automatic renewal kept access available. Once the show was finished, the same setting kept the payment moving unless you acted.
>
> The cancellation process determined how much effort that action required.

- **Learning need:** Pay off the opening with changed understanding.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original visual callback — chosen to make the named learning need visible.
- **Primary subject:** Return to the offer; the specific object/state is defined in the action.
- **Animation/camera:** Return to the exact opening show tile. Revisit trial access, finished viewing and active renewal in order. Follow the established exit through to confirmation. Do not add a recap text wall.
- **Visible text:** Renewal active; Subscription canceled. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G01/G03/G20
- **Source/license requirements:** A01; A02. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The useful offer and continuing payment belonged to one arrangement.

### S26 — The choice takes effect

- **Narration/story moment:** P45–P46.

> That is why canceling can be so hard. The payment continues by default, and some businesses add obstacles when a customer tries to change it.
>
> A subscription can be worth keeping. But when it no longer is, the decision to leave should be clear enough to take effect.

- **Learning need:** Resolve the central question.
- **Visual purpose:** Demonstrate the relationship or changed state in the action below; contextual footage establishes the practical setting.
- **Recommended medium:** Original simplified process and brand end card — chosen to make the named learning need visible.
- **Primary subject:** The choice takes effect; the specific object/state is defined in the action.
- **Animation/camera:** Automatic renewal continues until completed cancellation interrupts it. Hold on the final state, then cut to a restrained wordmark. End-card hold stays within the runtime reserve; no invented next-video thumbnail.
- **Visible text:** Subscription canceled; THE MONEY TRAP. Keep labels sparse and readable; these are not subtitles.
- **Required assets:** G20; local Inter and channel palette
- **Source/license requirements:** A02; A06. Apply the asset and evidence conditions above; source captions stay legible.
- **Expected takeaway:** The exit should let the customer’s decision take effect.

## Review and handoff

All 46 narration paragraphs are assigned exactly once, in script order. Each shot can include purposeful inserts; no fixed cut frequency is prescribed. Objects keep their identity and states across callbacks. Once cancellation completes, do not show renewal continuing unless a disputed charge is explicitly being explained; this draft depicts none.

Before motion: review every shot at half scale and phone size, confirm the production voice, acquire and record media, and review authentic excerpts. Full narration, listening and phrase alignment remain pending. No storyboard image, animation, new synthesis or render was produced by this planning task.

Before delivery: compile reviewed cues, inspect each beat/boundary and the full film, run required project checks and verify total duration at most 600 seconds including the end card. Technical checks do not grant creative or listening approval.

## Visual pacing reference for subsequent minutes — 2026-11-17

Use the first minute as a flexible density reference for later minutes: roughly 9 visual scenes, 14 narration-linked motion events, 8 graphic families, 3 short centered text cutaways and 18 distinct interface labels per minute, with a similar or slightly higher amount where the narration benefits. These counts describe the first-minute implementation, not mandatory quotas: a graphic family can recur, motion events can contain several movements, and text should stay short and purposeful. Let the teaching need determine each shot and hold; do not add movement or labels solely to hit a count. Review pacing, readability and narration sync in context. The first minute remains a draft, with listening and full playback review pending.
