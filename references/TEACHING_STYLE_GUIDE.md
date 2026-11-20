# The Money Trap — Teaching Style Guide

**Version 1 · 2026-11-16 · Phase 4: documentation only.**

**The viewer should understand the concept even if they remember none of the numbers.**

Teach through recognizable situations, ordinary consequences and a clear explanation of what caused them. Assume an intelligent working adult with limited time, not a student waiting for a finance lecture. Read with [channel branding](CHANNEL-BRANDING.md), the [script guide](SCRIPT_GUIDE.md) and [visual style guide](VISUAL_STYLE_GUIDE.md). Media permissions and authenticity follow [media sourcing](MEDIA_SOURCING.md).

## 1. A useful progression, not a fixed formula

When it fits the question:

1. Show a familiar situation.
2. Introduce an interesting problem or contradiction.
3. Follow what happens.
4. Reveal the simple mechanism behind it.
5. Show why it matters in ordinary life.
6. Return to the original situation with a clearer understanding.

An episode may start with a documented event, a system mystery or a comparison instead. Combine or omit stages when they add no new understanding. Do not manufacture a contradiction, delay a necessary definition or force every story into six chapters. A section earns its place by changing what the viewer understands.

The narrator carries the explanation. Visuals supply context, expose a relationship or demonstrate a change. No recurring character, calculation, chart, numerical reveal or on-screen sentence is mandatory. Sam and Alex can remain fictional narrative examples without acted stickman scenes.

## 2. Teaching methods

| Method | Use when | How to make it work | Common failure |
|---|---|---|---|
| Scenario-based explanation | A decision or constraint becomes clearer through a person in a specific situation | Declare the example fictional or documented; follow a plausible choice and its consequence | Presenting one invented person as a typical customer or proof of prevalence |
| Visual analogy | A hidden relationship needs a familiar shape | State the mapping and its limit: dated cards can represent obligations occupying future weeks | Letting a metaphor imply literal mechanics or replace evidence |
| Cause-and-effect demonstration | The viewer needs to know why a state changes | Show the relevant trigger, process and consequence in order; preserve material intermediaries | Arrows and effects without a defined causal relationship |
| Comparison | One changed choice or assumption explains a difference | Hold relevant starting conditions and time periods comparable; disclose tradeoffs | Giving one side extra income, perfect foresight or omitted costs |
| Simplified process illustration | Several parties, states or steps make a system hard to follow | Include only the steps needed for the question; mark simplification and relevant exceptions | Making a simplified flow look like the universal behavior of every provider |
| Everyday example | A technical term can be grounded in ordinary experience | Show the familiar event before naming the concept | Unnecessary terminology or an example unrelated to the viewer's problem |
| Before-and-after situation | A changed state is more useful than a calculation | Keep the subject and assumptions recognizable; show what caused the difference | Two disconnected numbers or scenes with no explanation of the change |
| Hidden-system demonstration | An interface hides the process responsible for the outcome | Separate what the user sees from the supported underlying process | Guessing system behavior from an error message or fabricating internal evidence |

Choose the method for the learning need, not to satisfy a variety quota. A simple object sequence can carry a whole explanation; footage may be better for lived context. Use the visual guide's nine-field storyboard framework to turn the selected method into shots.

When an everyday object can carry the explanation, show its starting state, the action that changes it and the resulting consequence. Keep the object recognizable across those beats. Show the part of the interface that explains what the person chose or saw. Frame the resulting change so the viewer can follow it with only the necessary labels and amounts.

When visualizing evidence or modeled comparisons without arithmetic recitals or fabricated charts:
- **Translate research findings into qualitative structural schematics:** Pair a study's scope and source credit with a concrete structural visual—such as baskets clustering past a cutoff barrier, a two-row matrix contrasting which policy variable changed in each study, or a `Now vs. Later` substitution strip distinguishing an earlier planned purchase from additional consumption—rather than consecutive text-only citation cards.
- **Show derived proportional scale visually:** When a modeled example in `src/finance/math.ts` explains why an outlay rises (for example, an indivisible add-on overshooting a spending gap), render the derived proportional blocks and overhang visually rather than relying on a text-only "Higher total" badge or a narrated subtraction walkthrough.

## 3. Explain at the right depth

Record these six notes in the outline for each important concept:

| Depth question | Required decision |
|---|---|
| What does the viewer already understand? | Name the familiar action or experience without assuming specialist vocabulary. |
| What is the single most important new idea? | Write one plain sentence that answers the current question. |
| What is the minimum explanation required? | Identify the causal steps and evidence needed to make that sentence understandable. |
| What can safely be omitted? | Remove side topics, repeated examples and calculations that do not change the answer. |
| What must be qualified for accuracy? | Keep jurisdiction, product terms, assumptions, exceptions and uncertainty that materially affect the takeaway. |
| How will understanding be verified? | Ask a reviewer to explain the cause or apply it to a slightly different situation without recalling amounts. |

Simplification removes unnecessary detail, not necessary truth. Put an important qualification beside the claim it limits. A tiny footnote or end disclaimer cannot fix a misleading explanation. Distinguish a sourced finding from the writer's interpretation and a hypothetical model from an observed outcome.

Numbers can establish scale, a relevant difference or a concrete obligation. Keep them correct and traceable; use the project's finance module for modeled calculations. Do not narrate a spreadsheet, repeated salary comparison, ratio lesson or formula walkthrough when the concept is understandable without one. Reviewers may check the math behind a scene even when viewers never see it.

## 4. Example teaching plans

These are editorial teaching proposals, not changes to existing episodes or personalized financial advice. New scripts must verify their particular claims and terms in `sources.md`; linked background sources do not automatically approve a future script.

### Buy Now, Pay Later

| Depth question | Example plan |
|---|---|
| Already understood | A purchase has a full price and payments must eventually be made. |
| Important new idea | Separately accepted payment schedules can compete for the same future flexibility. |
| Minimum explanation | In a labeled fictional example, follow one checkout choice, then place its obligations beside those from other purchases on a shared calendar. The full price remains understandable. |
| Safely omit | A history of credit, lender economics, market-size statistics and an arithmetic recital unless the episode's question requires them. |
| Must qualify | Plans differ. The episode's no-fee/no-interest assumptions are hypothetical, not universal; do not claim all providers lack an aggregate view or all users overspend. |
| Verify understanding | “Why can several manageable plans make the same month harder to manage even when this example has no fees?” A useful answer mentions overlapping commitments, not memorized prices. |

Method: scenario plus a calendar demonstration. Existing episode 002 remains unchanged. For background on product variation, consult the [CFPB's BNPL overview](https://www.consumerfinance.gov/ask-cfpb/what-is-a-buy-now-pay-later-bnpl-loan-en-2119/); verify the specific terms used in a new episode.

### Lifestyle inflation

| Depth question | Example plan |
|---|---|
| Already understood | Higher pay can improve daily life; rent and subscriptions return each month. |
| Important new idea | A recurring upgrade commits part of later paychecks as well as today's. |
| Minimum explanation | In a fictional situation, show the benefit of an upgrade, its bill returning, and its effect on room for another goal. |
| Safely omit | A full household budget, repeated salary comparisons, projected investment returns and a universal saving percentage. |
| Must qualify | Housing, transport, care and other needs can make higher spending necessary. An upgrade is not automatically a mistake; remaining money is not automatically saved. |
| Verify understanding | “What changes when the extra expense repeats instead of happening once?” A useful answer identifies the future commitment and its tradeoff. |

Method: everyday example and before/after situation. Show the benefit as well as the cost. Do not diagnose real viewers or imply that stagnating savings is always caused by discretionary spending.

### Credit card minimum payments

| Depth question | Example plan |
|---|---|
| Already understood | The statement shows an amount due and a payment deadline. |
| Important new idea | Paying the required minimum is different from clearing the balance; a carried balance may continue to incur interest under the card's terms. |
| Minimum explanation | Use a labeled example statement to distinguish minimum due, remaining balance and interest. Show what remains after a payment without walking through an amortization formula. |
| Safely omit | Daily-interest arithmetic, issuer allocation rules and a long payoff table unless they answer the central question. |
| Must qualify | Check interest, grace-period and promotional terms, fees, new spending and payment timing. Do not say minimum payments never reduce principal or invent a universal payoff date. |
| Verify understanding | “Why does meeting this month's payment requirement not mean the debt is cleared?” A useful answer distinguishes the required payment from the remaining obligation. |

Method: simplified process and before/after state. The [CFPB's credit-card guidance](https://www.consumerfinance.gov/data-research/credit-card-data/know-you-owe-credit-cards/) supports explaining the distinction and the effect of paying more than the minimum. Any numerical payoff example needs its own verified assumptions and calculation.

### Failed bank transactions

| Depth question | Example plan |
|---|---|
| Already understood | A payment can show an error or an incomplete status. |
| Important new idea | A screen message alone does not establish every participant's transaction state. |
| Minimum explanation | Pick one verified transaction type and failure mode. Separate the message from the relevant authorization, processing or reversal steps that actually apply. |
| Safely omit | The entire payment network, unrelated rails and technical message codes. |
| Must qualify | Provider, payment type, jurisdiction and failure stage matter. Source any hold/reversal timing; do not promise a refund deadline or imply every error involves a hold or money loss. |
| Verify understanding | “What does this message establish, and what still needs checking?” A useful answer separates observed status from an unverified assumption. |

Method: hidden-system demonstration with an illustrative interface. This is a research plan, not a claim about a particular bank. Provider-specific documentation must support the chosen flow before scripting or drawing it.

### Financial scams

| Depth question | Example plan |
|---|---|
| Already understood | A bank may contact customers about account activity. |
| Important new idea | A convincing bank identity can be impersonated; the contact's story needs independent verification. |
| Minimum explanation | A clearly labeled recreated message requests an action. Show how the claimed authority creates pressure, then demonstrate verification through a separately obtained trusted contact route. |
| Safely omit | A checklist of every scam type, technical exploit detail and fabricated victim-loss statistics. |
| Must qualify | A logo or writing style alone neither proves nor disproves authenticity. Avoid blaming victims or promising that one check prevents every scam; recovery depends on the circumstances. |
| Verify understanding | “Why would calling the number supplied by the suspicious message fail to independently verify it?” A useful answer identifies that the same source controls both the story and the contact route. |

Method: scenario, cause-and-effect and an evidence-supported comparison. The [FTC's bank-contact guidance](https://consumer.ftc.gov/consumer-alerts/2026/01/how-handle-unexpected-calls-claim-your-money-risk) recommends verifying through contact details such as a recent statement or card, rather than those supplied by an unexpected caller. Adapt advice to the relevant jurisdiction and source it in the episode.

## 5. Respect the viewer and the people depicted

- No patronizing narration: “obviously,” “any sensible person” and similar judgments cannot substitute for an explanation.
- No generic financial lecture or moral at the end of every section. Answer the question the story raised.
- No unnecessary math or jargon used to signal expertise. Define what the audience needs and move on.
- No simplistic blame. Account for income constraints, essential costs, product design, pressure, timing and available choices when relevant.
- Do not make a fictional helper omniscient or remove the costs of their alternative. Financial tradeoffs may have no single correct answer.
- Treat hypothetical people, actual case subjects and identifiable people in media distinctly. Never imply that unrelated footage documents debt, fraud, distress or wrongdoing.

## 6. Comprehension review and phase boundary

After a script/board read, ask a human reviewer to explain the central cause in plain language and apply it to a changed example. Do not require a remembered figure, term or formula. Ask which assumption would change the outcome. If the explanation fails, identify the missing causal step or misleading image; revise that step rather than adding more statistics.

The writer's own desk check is provisional, not evidence that an audience understood. Record the review method, response, unresolved confusion and approval status in `qa.md`. Test generated narration separately: a readable script can still sound unclear. Technical render checks, human creative approval, comprehension review and listening approval remain distinct.

Phase 4 establishes teaching guidance only. Existing episodes, narration, components and historical QA are preserved. The [media-sourcing documentation](MEDIA_SOURCING.md), [research playbooks](../research/README.md) and updated [global instructions](../AGENTS.md) apply the same documentary direction. Links/status are synchronized through Phase 9; this migration grants no new production or human approval.
