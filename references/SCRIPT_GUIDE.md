# The Money Trap — Scriptwriting Guide (v2.2)

**Updated 2026-11-16 — Phase 3: documentary scripting; links/status synchronized through Phase 9.** This revision preserves the research, originality, financial verification and local TTS workflow. Read with [channel branding](CHANNEL-BRANDING.md), the [visual style guide](VISUAL_STYLE_GUIDE.md), [teaching guide](TEACHING_STYLE_GUIDE.md), [media-sourcing standards](MEDIA_SOURCING.md) and updated [global production rules](../AGENTS.md). Existing episode scripts and approvals are unchanged.

**Purpose:** Produce clear, original, engaging, credible 10–15 minute English-language finance explainers that sound like a thoughtful person speaking, including when rendered through a local text-to-speech system.

**Format:** Faceless 16:9 financial documentaries told by one observant primary narrator, supported by original editorial motion graphics and appropriate mixed media. **Audience:** English-speaking working adults, approximately ages 25–50. **Genre:** money psychology, debt and bills, everyday banking, scams, consumer behavior and hidden consumer costs. **Brand voice:** observant, calm, curious, a little dry/witty, never condescending or guru-like.

**Documentary direction:** Explain everyday money problems through relatable situations, ordinary decisions, consequences and simple explanations. Start with the human situation; make the financial cause understandable. A scenario, documented case or system mystery may carry the story. Use a fair comparison when it helps; no recurring character, acted scene or comparison is mandatory.

**Runtime:** 10–15 minutes is an editorial starting range, not a quota. Finish the explanation without padding or compressing speech. Measured natural narration determines the final runtime.

### What the transcript analysis contributes

This revision draws on [the local longform analysis](../docs/transcript-longform-analysis.md): five howmoneyworks scripts, five CasuallyFinance scripts and two jamesjani scripts. The following choices are adaptations for this brand, not evidence of which videos perform best.

| Influence | Evidence from the supplied transcript | Adaptation for The Money Trap |
|---|---|---|
| howmoneyworks: an understandable contradiction | “But if nobody can afford to buy a house, then how the f*** do they keep getting more expensive?” — [housing](../scripts/get_transcript/transcripts/howmoneyworks/longform/transcribed/1zjcZ661ups.txt) | Make a familiar financial puzzle the explanatory spine. Use original wording and a different story. |
| CasuallyFinance: explain incentives through a person | “Let's pretend you own Munder Difflin, the biggest paper mill in town.” — [bonds](../scripts/get_transcript/transcripts/CasuallyFinance/longform/transcribed/0ll9rEtoRrs.txt) | Put a mechanism into a concrete role, obligation or decision before expanding to the system. |
| jamesjani: make scale visible | “Let this circle represent $1 million.” — [money](../scripts/get_transcript/transcripts/jamesjani/longform/transcribed/6mRbDEtDoyA.txt) | Use a visual unit or comparison when magnitude matters. This is a one-video technique, not a demonstrated channel-wide formula. |

Borrow explanatory functions, not distinctive lines, jokes, fact sequences or character stories. Transcript sentence lengths are punctuation proxies affected by recognition errors. They do not establish a target reading level, visual-cut interval or optimal sentence length. No fixed midpoint twist, mandatory three-reason list or universal CTA follows from this sample.

## 1. Philosophy: natural writing comes before de-slopping

A good script is built from a real question and a specific story. Anti-slop editing is damage control: valuable, but it cannot rescue a weak premise. Write in this order: research → title/promise and payoff → causal outline → spoken draft → evidence and math audit → story and speech revision → anti-slop audit → TTS test → revised master.

**Trust before retention tricks.** Never invent a statistic, expert quotation, source, policy, regulatory rule, personal experience, or true event to make the story dramatic. Label hypothetical examples. Don't promise universal financial outcomes. The most interesting fact is not always a huge number; sometimes it is a surprising tradeoff.

**Write for one listener.** The audience is a working adult watching on their phone or TV. Assume intelligence, not advanced finance vocabulary. Start with what they already know, show what they don't know, and avoid explanations they don't need.

**Specificity is a design choice.** Use a person, place, amount, decision, deadline, or consequence whenever grounded. Prefer "Sam gets a $600 raise and signs a new lease" over "People tend to experience lifestyle inflation." Use hypothetical numbers clearly identified as examples, not as facts about average consumers.

### Required documentary writing principles

1. **Relatable first.** Open with a situation the viewer recognizes: a purchase someone almost declined, a paycheck that disappears quickly, a failed payment, a temporarily frozen account or a recurring expense that becomes difficult to manage. Establish a concrete problem rather than starting with a definition or a dramatic slogan.
2. **Concepts over calculations.** Use numbers only when they materially improve understanding. Avoid detailed calculations, repeated salary comparisons, formula demonstrations, long financial-ratio explanations and spreadsheet-like narration. Every figure still needs a factual source or an explicitly hypothetical assumption and a correct calculation where applicable.
3. **Show ordinary consequences.** A postponed purchase, delayed repair or tighter month may be enough. Do not invent bankruptcy, losing a home or financial ruin to make an ordinary decision feel important. Represent people's constraints fairly rather than blaming them for difficult circumstances.
4. **Keep explanations simple.** Explain cause and effect in plain English, at the depth needed to answer the central question. Define necessary terms in context. Omit tangents and deeper philosophical interpretations added only to sound intelligent; retain qualifications that materially change the explanation.
5. **Maintain progression.** Each section introduces a meaningful event, consequence, complication, explanation or realization. Remove sections that repeat the same lesson in different words. A callback must show changed understanding, not restart the lecture.
6. **Avoid AI-shaped narration.** Apply the contextual anti-slop review in §5. Avoid excessive rhetorical questions, forced dramatic pauses, artificial contrasts, repeated three-part structures and overly poetic financial explanations. Natural uses of common phrases are allowed.
7. **Write for local TTS.** Mix short and medium sentences naturally, with conversational punctuation, clear references/pronouns, natural paragraphs and speakable numbers. Keep production instructions out of narration. Use no forced speaking-rate target; test and listen to actual generated audio before approving delivery (§7).

## 2. Research and fact ledger

Before drafting, create `sources.md` with a row per factual claim:

| Claim ID | Narrated claim | Source URL | Publication/updated date | Exact support | Status | Caveat |
|---|---|---|---|---|---|---|
| F01 | Example claim | Official source | YYYY-MM-DD | Relevant finding | verified/pending/rejected | Applies to US only |

Priority: primary government/regulator/financial institution disclosures → research papers → established professional reporting → community anecdotes (illustration only). For contentious figures or current rules, check a second source. Record jurisdiction, assumptions, currency, time horizon and whether a figure is nominal or adjusted. Never turn a model assumption into a universal fact.

For hypothetical examples, create an `assumptions` block and verify math separately; e.g. `$4,400 take-home pay - $4,220 spending = $180 unspent`, assuming a single month and no one-time expenses. Don't call fictional characters "real customers" or "actual clients".

For project stories, `src/finance/math.ts` remains the calculation source of truth. Derive displayed totals from the same assumptions used in narration. Identify monthly take-home USD, the illustrated expenses and omitted costs. **Remaining** means income minus those illustrated expenses; do not relabel it as savings, disposable income or a complete budget without modeling that claim. State debt assumptions separately, including rates, fees, payment timing and rounding when relevant. A spending story does not automatically include debt.

Competitor narration is evidence of a writing technique, not a financial source. Independently verify any factual claim you use. Do not inherit a transcript's product terms, forecasts or recognition errors.

## 3. Packaging before scripting

Make a one-page brief:

- **Viewer:** Who and what private concern? E.g. "Employed adult with a raise but no growing savings."
- **Question:** One sentence that guides the whole video. "How can a raise leave someone with less money after bills?"
- **Promise:** What will the listener understand by the end?
- **Title/thumbnail:** Specific, accurate and connected to the opening image.
- **Story engine:** Choose one: scenario, mystery, contrast, chain reaction, historical case, or financial experiment. Vary across uploads.
- **Human stake:** What does the person or viewer need? What gets in the way? Why care?
- **Verified mechanism:** What exactly causes the outcome?
- **End payoff:** Answer the question and identify one useful distinction or decision.
- **Reasonable motive:** Why would someone make this choice with the information and constraints they have?
- **Comparison, if useful:** What one decision or assumption changes, and what stays the same?
- **Scope:** What this example cannot establish, including who may face a different outcome.

Avoid titles that require exaggeration, fabricated certainty or promises of investment returns.

Before outlining a scenario or documented case, complete this sentence in plain language:

> In this [fictional example / documented case], [person] wants [ordinary goal], chooses [plausible action], and encounters [specific consequence] because [verified mechanism]. Changing [decision or assumption] changes [outcome], with [cost or limitation].

For a system mystery, state the familiar event, the question it raises, the supported process that explains it and its ordinary consequence. Do not invent a protagonist or a comparison to fit the scenario sentence.

**Premise check:** Can the writer explain the cause without a slogan? Is there a visible action or transaction? Does the ending actually answer the opening? If any answer is no, resolve the premise before expanding the draft. A topic such as “credit cards” is not yet a story.

### Concept before calculation

The video explains **why** something happens, not how to compute it. The viewer should finish able to say the cause in one plain sentence — "every upgrade kept coming back next month" — not able to reproduce an arithmetic walkthrough.

- Name the force at work in plain words before any number appears: recurring commitments, an obligation that renews, an incentive that rewards one behaviour, a cost that hides in a monthly figure. The concept is the reveal.
- Keep one central question. Supporting concepts belong only when they are needed to answer it; omit competing tangents.
- Numbers are evidence, not curriculum. Use the minimum needed for clarity, without a fixed quota or mandatory numerical reveal. Repeat an amount only when the listener needs it to follow a later consequence. Keep units and period intact.
- No worked arithmetic, no formula, no per-line table of income and expenses, no "here's the math" beat. If a value must change on screen, show the before and after states and let the difference speak.
- Arithmetic still has to be right — `src/finance/math.ts` remains the calculation source of truth for modeled examples. Sourced factual figures retain their own evidence and scope; do not force them into the fictional budget model.
- A calculation tutorial is a separate scope. Keep the documentary focused on a concise explanation or before/after result; do not add an unsolicited arithmetic lesson.

**The channel rule:** the viewer should understand the concept through clear narration and purposeful visuals even if they remember none of the numbers. Applies to scripts, storyboards and visual recommendations alike; understanding must not depend on character acting.

| Avoid | Prioritise |
|---|---|
| Detailed financial calculations | Financial psychology and behaviour |
| Repeated dollar amounts | Relatable situations |
| Formula-based explanations | Analogies and metaphors |
| Long charts and spreadsheets | Relatable situations and purposeful visual explanations |
| Step-by-step mathematical solutions | Cause-and-effect explanations |
| Excessive financial terminology | Natural conversational narration |
| Generic budgeting lessons | Discoveries and revelations |

Numbers are not banned: a brief comparison can establish a consequence, provided the viewer never has to follow a calculation to understand the story.

## 4. Story structure: narrator-led financial documentary

The following is an optional causal scaffold, not a mandatory seven-part formula. Combine, reorder or omit beats as the central question requires. Write the complete explanation before estimating runtime; no fixed word allocation, midpoint twist or numerical reveal is required.

| Beat | What must change | Possible visual treatment |
|---|---|---|
| Familiar situation and hook | Establish a recognizable event and a question worth answering. | A checkout choice or an illustrative failed-payment notice. |
| Situation and stakes | Establish the goal, constraints and relevant assumptions. | Contextual footage, an original document or a clearly labeled recreation. |
| Decisions or process | Follow the events that create the consequence. | A purchase sequence, recurring commitment or simplified payment flow. |
| Mechanism reveal | Explain the cause in plain words. | A before/after state, returning obligation or annotated process. |
| Complication or exception | Introduce a real constraint that changes understanding. | An additional obligation or a source-backed exception. |
| Payoff and optional alternative | Answer the opening; compare fairly if useful and retain tradeoffs. | The process resolved or comparable states with a meaningful difference. |
| Natural close | Leave a specific consequence or useful distinction. | Return to the opening object or situation in its new context. |

### Opening: choose one entry

The following are newly written prompts, not transcript quotations or lines to repeat across uploads:

- **Consequence:** “[Person] got [apparent improvement]. By [time], [unexpected result]. What changed?”
- **Reasonable choice:** “[Offer or decision] solved [immediate problem]. The cost appeared when [specific event].”
- **Fair comparison:** “[Two people or two versions of one person] start with [same conditions]. Change [one choice], and [outcomes diverge]. Why?”

State the actual puzzle early. Do not hide the subject behind mood or a vague “secret.” Start inside a scene or with a concrete question. No greetings, channel-name intro or subscribe request before the problem. Aim to establish the title/thumbnail promise within the first 20–30 seconds as an editorial check; measured delivery decides the timing. A branding sting must not delay that understanding.

### Middle: build a causal chain

For each beat, write four notes before prose: **incoming question / action or evidence / changed understanding / next necessary question**. Use the next-question note only where something genuinely remains unresolved. A scene can breathe after a clear answer.

Connect events with a real dependency: **choice → obligation or transaction → timing or accumulation → consequence**. If the link is only “and another thing,” explain the relationship, move the material, or remove it. Prefer “So Sam signs the lease. His next paycheck arrives…” to “But here's where things get crazy.” Do not delay a definition or basic answer just to manufacture suspense.

Keep a small question tracker in `outline.md`: **question / beat opened / beat answered**. Close the central question; remove unused teasers. A complication must introduce a real constraint, exception or changed assumption, not simply announce that the situation is worse. It need not occur at a fixed runtime percentage.

### Mechanism: show the steps before the label

1. Establish what the person has, wants and must pay or do.
2. Follow the relevant money, obligation or incentive through its steps.
3. Name the financial term when it helps organize what the viewer has just seen.
4. Show one before/after state instead of the arithmetic, with units and time period intact. Name the amount only if the cause is unclear without it.
5. Translate the result into a consequence for the person.

For every important number, know **what it measures / over what period / compared with what**. Use round hypothetical values when they clarify; retain necessary precision in sourced facts. Distinguish a balance from a payment, total price from monthly cost, and an absolute change from a percentage change. Do not stack unrelated statistics to create scale without explanation.

### Payoff: answer, compare when useful, then stop

Return to the opening question with the demonstrated cause. In a fictional comparison, hold starting income, time horizon and relevant conditions constant unless the change is explicitly part of the experiment. Show costs and remaining constraints of the alternative. Do not make Alex win through unexplained extra income, perfect foresight or omitted expenses.

Explain what the viewer should understand, not automatically what they should buy or do. A structural problem may leave the character with limited choices; do not invent an easy escape. A financial tradeoff may lack a single correct answer. Finish on the resulting decision, number or image rather than repeating the lesson in several slogans.

One optional next-video CTA is this brand's editorial choice, not a universal pattern found in the transcripts. Connect it to a real adjacent question after delivering the promised answer. Omit it when no relevant next video exists. Add a sponsor segment only when actually commissioned; its claims need verification and its words belong in a separate budget. Return explicitly to any interrupted question.

**Narrative variation:** Not every video requires Sam/Alex, not every chapter needs a cliffhanger, and not every ending needs an inspirational moral. Rotate scenario/mystery/contrast and let some moments be quiet.

Use a system mystery for payment or banking flows, a documented case for a scam, or a decision comparison for a genuine tradeoff. Preserve the central question and visible mechanism; do not force every subject into a personal mistake. A numbered list is useful only when the categories explain the question.

## 5. Anti-slop checklist: edit the structure, not just vocabulary

Flag these **in context**, not as an automatic ban list:

- **Vague hype:** "This changes everything", "The truth is shocking", "The shocking truth", "Let that sink in."
- **Throat clearing:** "In today's world", "In today's fast-paced world", "Let's dive in", "Here's the thing", "But here's the thing", "As we all know."
- **Unfounded special insight:** "What most people don't realize" without evidence or a specific explanatory purpose.
- **Artificial reversals:** endless "It's not X; it's Y" construction.
- **Metronomic cadence:** every paragraph starts with a rhetorical question, every sentence is short, every section ends with an aphorism.
- **Manufactured drama:** forced pauses, catastrophe language or poetic metaphors that obscure an ordinary financial cause.
- **Generic triads:** "smart, strategic and sustainable" with no added meaning.
- **Fake first-person authority:** "I've helped thousands of people" without evidence.
- **Motivational lecture:** "You need to develop a wealthy mindset" when a concrete mechanism is available.
- **Repetitive summaries:** restating the takeaway three times before introducing a new detail.
- **Unnatural symbols:** written percentages, abbreviations, parentheses, and slash constructions that a TTS narrator reads awkwardly.
- **AI-shaped false certainty:** simplifying uncertainty out of financial examples, such as implying one savings level universally changes everything.

**Edits should retain:** facts, numbers, units, qualifiers, time periods, negations, character motivations, source attribution and genuinely effective phrasing. The goal is a distinctive, grounded narrator, not a script that merely passes a phrase scanner. Avoid manufactured typos and random fillers.

## 6. Narration voice: The Money Trap

The narrator sounds like a smart friend who notices what others miss. Curious and calm, occasionally amused by ordinary financial contradictions. Never mocks people for being broke. Never acts as a financial guru. Able to say "it depends" when it really does.

**Preferred writing moves:**

- Show the decision before naming the bias: "He upgrades the car. Then the apartment. Then the subscriptions."
- Use occasional understatement: "Nothing extravagant. Just a few bills that happen to arrive every month."
- Use conversational connective tissue sparingly: "So", "Now", "Except", "Meanwhile", "Which means" when logical.
- Vary rhythm: a longer scene-setting sentence, a plain explanatory sentence, an occasional short payoff.
- Break technical explanations into steps, not glossary paragraphs.
- Address the viewer when relevant, not every sentence.
- Make the narrator's attitude observable through concrete judgments, not forced jokes.
- Use “you” to invite recognition or assign a useful hypothetical role, not to diagnose the viewer's finances or accuse them of bad choices.
- Aim wit at a contradiction, an incentive or the situation. Do not make financial distress the punchline. No joke quota or requirement to copy a reference channel's profanity.

**Disallowed practices:** fabricated personal experiences, shaming, universal return promises, unsupported numbers, unnecessary dramatic taglines, fake dialogue presented as testimony.

## 7. TTS-specific formatting

Create TWO distinct artifacts:

1. `script.md` — annotated production script with beat IDs, scene directions, source IDs, and optional performance notes.
2. `narration.txt` — spoken words only, one paragraph per semantic block, with no Markdown headings, source URLs, scene notes, or brackets that the engine might read aloud.

Before TTS generation:

- Use local VoiceStudio with explicit `voxcpm2` unless another model is requested; never silently fall back. Script approval and listening approval are separate from animation approval.
- Expand money amounts and numbers when local engine mispronounces them. E.g. narration text "four thousand four hundred dollars" instead of "$4,400" if needed; keep the numeric form in the annotated script.
- Spell out unfamiliar acronyms on first mention; prefer everyday terms over ticker symbols or account codes.
- Use punctuation to mark natural breath units. Avoid multiple semicolons and long parentheticals.
- Mix short and medium sentences naturally. Keep references and pronouns unambiguous; split a long sentence when it becomes difficult to follow aloud. No sentence-length quota.
- Break audio into meaningful paragraphs or segments (start with about 80–180 words each; tune to local engine); never split halfway through a sentence or a reveal.
- Keep voice, speed and pronunciation settings consistent across segments; allow quiet pauses at semantic boundaries during audio assembly.
- Do not put SSML, emotion tags, `[pause]` directives or other production instructions in `narration.txt`. Keep direction cues in separate metadata; do not assume a local engine supports them.
- Generate a 45–60-second sample and **listen with eyes closed**. Mark awkward timing, emphasis, unclear references, strange number readings, and monotone chunks. Edit the words or segmentation, not just the speaking speed.

There is **no forced speaking-rate target**. Write the full script, test the actual local voice and measure the generated WAV. A measured sample may inform a provisional runtime estimate, but only the complete narration establishes delivery length. Do not pad, compress or accelerate speech to reach a word-count or runtime target. Sample approval does not replace listening to the final assembled narration.

Planning durations are estimates, never aligned cues. After narration and listening review, prepare phrase cues and storyboard JSON and compile with `src/timeline/compiler.ts`; graphics use compiled event frames, cue IDs and documented offsets. Regenerated narration or WAV invalidates alignment and hashes. Do not accelerate or stretch speech to fit the outline, or put guessed narration timestamps in graphics. The film uses one global Audio node.

## 8. Visual writing for documentary production

Every beat should identify what the viewer needs to understand, what changes and what the image adds to the narration. Select the medium using the [visual style guide's shot framework](VISUAL_STYLE_GUIDE.md#6-shot-selection-framework). Original graphics can explain a hidden mechanism; verified footage or photography can establish context; an authentic permitted excerpt can support an evidence-dependent claim. A metaphor must clarify the cause without implying false mechanics.

**Optional fictional examples:** Sam can have a goal, reasons and constraints without appearing as a recurring animated character. Alex can test an alternative without being an all-knowing lecturer. Neither is mandatory. Keep one primary narrator; do not invent testimony or quotations. Any occasional dialogue must earn its place and remain clearly fictional or accurately sourced.

Storyboards must not depend on stickman poses, facial reactions or character acting. Use objects, interfaces, documents, processes and relevant real-world context when they explain the beat. Do not identify an unrelated footage subject as Sam, Alex or a documented customer. Present generic invented scenarios and interfaces naturally without on-screen "fictional," "illustrative," "hypothetical" or "demo" badges ([decision #14](../docs/decisions.md#14-presenting-fictional-scenarios--2026-11-16)), while retaining visible source credits and scope qualifiers for cited research and authentic excerpts and never presenting a recreation as authentic evidence. Source claims and media permissions separately; a factual source does not automatically clear its images.

Use the project palette: yellow for money, coral for costs/loss and teal for an alternative. An alternative still needs its costs explained; color alone must not imply a guarantee. Existing character identity and kinematic instructions apply only when explicitly working on legacy character compositions; no character code or artwork changes in this migration.

Write what changes on screen: a bill returns next month, a balance declines, or a payment reaches a labeled intermediary. A character gesturing beside unchanged text is not a mechanism demonstration. Reveal one financial relationship at a time and let the viewer see the cause; a before/after state can carry the proof without a visible calculation. Text labels support the explanation; no default subtitles or paragraph-length cards. Do not prescribe a cut every N words: the transcript study did not measure visual timing.

In visual notes for an object-led beat, name the object that carries through the setup and payoff, the visible change it undergoes and the detail that needs to stay readable. If the beat starts on a screen, identify the offer, control or status the viewer needs to see, then describe what happens to the object or obligation as a result.

Apply these visual-writing checks at the script stage so storyboards keep viewer attention without violating documentary accuracy:

- **Confirm the opening context immediately and avoid duplicate diagrams:** Visual notes for the opening beat should stage the recognizable purchase or decision context right away and finish by isolating an open visual question rather than previewing the exact two-step process diagram needed in a later mechanism beat.
- **Designate qualitative schematics for research beats:** When consecutive paragraphs cite studies or merchant economics without reproducible chart data, specify a concrete qualitative mechanism visual (such as orders clustering past a cutoff line, a two-row policy comparison grid, a revenue-versus-cost flow or a candidate authentic figure excerpt) so the storyboard does not degrade into consecutive bibliography text cards.
- **Sub-stage multi-paragraph beats and isolate the final decision test:** When a beat pairs two paragraphs in one scene, describe a distinct visual action for each paragraph. At the payoff, visually strip or dim promotional framing to test the add-on against its incremental outlay, and hold the quiet bookend callback for the final spoken paragraph.

Don't narrate on-screen text word-for-word unless repetition helps comprehension. Avoid images that imply incorrect mechanics (money vanishing, instant financial guarantees). Add explicit source credits and scope qualifiers for cited research, and keep invented scenario assumptions documented in `sources.md`.

For production, carry the Beat ID and narration segment into the visual guide's nine-field framework: story moment, learning need, visual purpose, recommended medium, primary subject, action/camera, required assets, source/license requirements and expected takeaway. Include claim/assumption IDs and permission status. Record provisional durations separately until measured narration and reviewed cues exist. A static hold is valid; there is no requirement to show every sentence as text or give every beat a character pose. Do **not** put stage instructions in `narration.txt`.

## 9. Script review and scoring

Score 0–5 each (40 points):

| Category | Five-point test |
|---|---|
| Premise + opening | Immediate, specific, compelling question aligned to title |
| Situation + stakes | Recognizable situation, understandable obstacle and consequence |
| Mechanism clarity | Viewer can explain the financial cause in plain words |
| Originality + specificity | Specific scenes, genuine insight; no generic filler |
| Natural speech | Sounds good aloud; varied rhythms and real transitions |
| TTS readiness | Numbers/pronunciations/segments checked in actual engine |
| Financial integrity | Every factual claim sourced; assumptions and caveats preserved |
| Visual storytelling | Chosen media and visible changes clarify the narration rather than decorate it |

**Provisional pass: 32/40 or higher**, *and* at least 4/5 each for financial integrity, natural speech and TTS readiness. This is an internal editorial standard, not a researched YouTube predictor.

Mark TTS readiness **pending** before actual generation and listening; do not award a finished score from a text read. The score cannot override these blocking defects: unsupported consequential claims, contradictory arithmetic, an unanswered central promise, or a comparison that hides a material difference. Fix those at their source before polishing the prose.

Review in this order so wording work does not conceal a broken story:

1. **Cause:** Does each consequence follow from the stated decisions and assumptions? Can the mechanism be explained in one plain sentence?
2. **Evidence and math:** Does every factual assertion have support? Do examples, spoken amounts and displayed totals agree?
3. **Story and payoff:** Is the choice plausible? Does the alternative change what the writer says it changes? Are planted questions answered?
4. **Speech and visuals:** Can a listener follow without seeing the screen? Can the key mechanism be shown without a wall of text? Then run the anti-slop and TTS passes.

Required human checks:

1. Read the opening aloud without watching the text.
2. Ask: "Would I tell this to a friend this way?" Rewrite phrasing that sounds like an essay.
3. Play the TTS first minute and one middle section without visuals; assess clarity.
4. Cross-check all numerical examples against the ledger and calculations.
5. Ensure the first question has a real payoff and no overclaim.
6. If a sentence is already good, don't rewrite it to satisfy a scanner.

## 10. Short example — lifestyle creep

*Fictional scenario; illustrative monthly take-home USD. Spending covers only the illustrated expenses; remaining money is not a complete budget or verified saving. No debt is modeled. Duration is unmeasured. Narration version with natural, restrained cadence:*

"Sam got a six-hundred-dollar raise. Nice timing, too. His rent had gone up, and his car was starting to feel a little old.

A few months later, he checked what was left after his monthly bills. Somehow, it was less than before.

Nothing on his statement looked like a mistake. Before the raise he kept about three hundred dollars a month. After it, a hundred and eighty.

The raise didn't disappear. It was spent before it arrived — not on one big thing, but on upgrades he had promised himself for years. A better apartment. A newer car. A handful of small monthly payments.

None of those choices seemed wild on its own. The problem was that every upgrade kept coming back the following month. And Sam was already thinking about the next one."

**Editorial mechanism:** Concept first — recurring commitments absorb a raise — then two amounts as supporting evidence. No worked arithmetic, no income-and-expense recital. Understated ending, no generic motivational lecture. Don't copy a competitor's scripting phrases or unsupported numerical promises.

## 11. Files and workflow for each video

```
videos/001-topic/
  brief.md           # viewer, title, thumbnail promise, question, payoff
  sources.md         # verified facts + hypothetical assumptions
  outline.md         # causal beats, question tracker, comparison when useful
  script.md          # annotated production script
  narration.txt      # TTS-ready speech only
  storyboard.md      # learning needs, media, visible changes, assets and sources per beat
  qa.md              # scorecard, read-aloud notes, TTS test notes
```

For efficiency, do one research pass, one initial draft, and **targeted** editorial revisions. A high-effort rewrite is justified only if the premise, facts, or story logic are wrong.

Use the files in this order:

1. **Brief and sources:** Choose the viewer's question, identify the mechanism, verify the relevant claims and write the example assumptions. Settle the title promise and ending together; revise the promise if the evidence does not support it.
2. **Outline:** Write the opening situation and payoff first. Connect them with causal beats and the question tracker. If comparing, identify the changed input and held conditions. Do not write a full draft around an unresolved mechanism.
3. **Spoken draft:** Draft complete narration before detailed motion planning. Use short visual notes to test whether the mechanism can be explained with appropriate media. Keep source and assumption IDs beside the relevant passages in `script.md`.
4. **Focused revision:** Check cause, evidence, arithmetic and payoff before rhythm and wording. Cut repeated explanations and unsupported tangents. If a beat adds no action, evidence, constraint or changed understanding, merge or remove it.
5. **Voice preparation:** Export `narration.txt` from the approved script. Check that it contains the same spoken content, preserves qualifiers and amounts, and excludes directions and source IDs. Test the chosen local voice and record listening findings in `qa.md`; do not mark them passed in advance.
6. **Production handoff:** Deliver the complete script, sources, assumptions, outline and storyboard notes. Distinguish provisional durations from reviewed cues. Script completion does not approve audio, motion, rendering or publishing. After measured narration, prepare and review alignment separately under the project timing rules.

**Handoff test:** Someone reading the packet should be able to identify the central question, explain the mechanism, locate supporting claims, verify any example arithmetic and state relevant limitations. The audience does not need to reproduce calculations. Record unresolved claims, media permissions or listening issues explicitly; an editorial score does not erase them.

## 12. Evidence and background references

The v2 structural adaptation drew on the [local transcript analysis](../docs/transcript-longform-analysis.md), earlier channel branding, the [legacy thumbnail board](channel-design.png) and [legacy character reference](character-reference.png). These images remain historical references, not the default documentary treatment. The study contains 12 longform scripts across three groups; its proportions, sentence statistics and observed phrases are not performance benchmarks. Hook prompts and earlier word budgets were editorial proposals, not quotations or measured optimal values.

V2.2 follows the current [channel branding](CHANNEL-BRANDING.md) and [visual style guide](VISUAL_STYLE_GUIDE.md). It retains the research evidence while replacing character-dependent handoff instructions and fixed numerical/rate quotas. The [teaching guide](TEACHING_STYLE_GUIDE.md) now defines explanatory depth and comprehension review; [media sourcing](MEDIA_SOURCING.md) defines provenance, permissions and the manual asset manifest. Neither guide changes existing episode approvals.

The links below are retained background references from v1. They were not revalidated for this revision and are not additional evidence for the local transcript findings. Their inclusion does not authorize a different voice service, rendering engine or production workflow.

Anti-slop: https://github.com/blader/humanizer ; https://github.com/theclaymethod/unslop ; https://github.com/hap-team/deslop ; https://github.com/westonhancock/unslop

Structure: https://github.com/yaxeen/storytelling-skills/blob/main/skills/long-form-youtube/SKILL.md ; https://github.com/SkillMedev/skills/blob/main/skills/youtube-script-writer/SKILL.md

Creator guidance: https://kurzgesagt.org/what-we-do ; https://support.google.com/youtube/answer/9314415 ; https://support.google.com/youtube/answer/16559650

Audio writing/TTS: https://www.poynter.org/educators-students/2017/6-tips-for-writing-broadcast-stories/ ; https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices ; https://docs.cloud.google.com/text-to-speech/docs/gemini-tts

Public transcript examples: https://pickscribe.com/v/1zjcZ661ups ; https://pickscribe.com/de/v/TJDcGv9OH4Q ; https://pickscribe.com/it/v/N3vR3PIIyQI

**Evidence limits:** The script patterns are editorial interpretations of selected examples, not causal proof of why a video performed well. Public videos generally do not disclose every writing tool used. All source links are for research; this skill's rules are original adaptations, not a verbatim copy of other creators' scripts.
