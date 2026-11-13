# The Money Trap — Scriptwriting Guide (v2.1)

**Purpose:** Produce clear, original, engaging, credible 10–15 minute English-language finance explainers that sound like a thoughtful person speaking, including when rendered through a local text-to-speech system.

**Format:** Faceless 16:9 stickman storytelling with a single primary narrator and occasional character dialogue. **Audience:** English-speaking working adults, approximately ages 25–50. **Genre:** money psychology, debt and bills, everyday banking, scams, and hidden consumer costs. **Brand voice:** observant, calm, curious, a little dry/witty, never condescending or guru-like.

**Default format:** A person makes a reasonable financial decision, encounters an unexpected consequence, and discovers the mechanism behind it. A fair comparison shows what a different decision or assumption would change. Start with the human situation; make the financial cause visible.

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
- **Emotional stake:** What does the character want? What gets in the way? Why care?
- **Verified mechanism:** What exactly causes the outcome?
- **End payoff:** Answer the question and identify one useful distinction or decision.
- **Reasonable motive:** Why would someone make this choice with the information and constraints they have?
- **Comparison:** What one decision or assumption changes, and what stays the same?
- **Scope:** What this example cannot establish, including who may face a different outcome.

Avoid titles that require exaggeration, fabricated certainty or promises of investment returns.

Before outlining, complete this sentence in plain language:

> In this [fictional example / documented case], [person] wants [ordinary goal], chooses [plausible action], and encounters [specific consequence] because [verified mechanism]. Changing [decision or assumption] changes [outcome], with [cost or limitation].

**Premise check:** Can the writer explain the cause without a slogan? Is there a visible action or transaction? Does the ending actually answer the opening? If any answer is no, resolve the premise before expanding the draft. A topic such as “credit cards” is not yet a story.

### Concept before calculation

The video explains **why** something happens, not how to compute it. The viewer should finish able to say the cause in one plain sentence — "every upgrade kept coming back next month" — not able to reproduce an arithmetic walkthrough.

- Name the force at work in plain words before any number appears: recurring commitments, an obligation that renews, an incentive that rewards one behaviour, a cost that hides in a monthly figure. The concept is the reveal.
- One concept per video, stated once and demonstrated by the story. If two concepts compete, one of them is the next video.
- Numbers are evidence, not curriculum. Use at most the two or three amounts that make the cause unambiguous, one time, at the reveal. Keep units and period intact.
- No worked arithmetic, no formula, no per-line table of income and expenses, no "here's the math" beat. If a value must change on screen, show the before and after states and let the difference speak.
- Arithmetic still has to be right — `src/finance/math.ts` remains the source of truth and every spoken amount agrees with it. The change is what gets narrated, not what gets verified.
- A viewer asking "how do I calculate this for myself?" is a comment, not a missing beat. Answer it in a pinned comment or a follow-up, not in the middle of the story.

**The channel rule:** every financial concept must be understandable through the animation and the story alone, even if the viewer doesn't remember a single number. Applies to scripts, storyboards and animation recommendations alike.

| Avoid | Prioritise |
|---|---|
| Detailed financial calculations | Financial psychology and behaviour |
| Repeated dollar amounts | Relatable situations |
| Formula-based explanations | Analogies and metaphors |
| Long charts and spreadsheets | Character-driven scenes |
| Step-by-step mathematical solutions | Cause-and-effect explanations |
| Excessive financial terminology | Natural conversational narration |
| Generic budgeting lessons | Discoveries and revelations |

Numbers are not banned: a brief comparison can establish a consequence, provided the viewer never has to follow a calculation to understand the story.

## 4. Story structure: character-led financial explanation

Use seven connected beats as the default scaffold. The **1,800-word allocation below is an editorial starting point**, not a measured competitor template or a minimum length. At the earlier analysis assumption of 150 wpm it would read for 12 minutes before accounting for delivery and visual pauses. Combine or shorten beats when the subject needs less explanation.

| Beat | Starting words | What must change | Possible visual evidence |
|---|---:|---|---|
| 1. Consequence-first hook | 70 | Establish a concrete contradiction or question worth answering. | A paycheck rises while the amount remaining falls. |
| 2. Situation and stakes | 180 | Establish the goal, baseline, constraints and example assumptions. | Sam's current income, illustrated bills and reason for a choice. |
| 3. Reasonable choices | 300 | Show how individually understandable choices create the outcome. | A sequence of purchases, recurring commitments or payment dates. |
| 4. Mechanism reveal | 400 | Name the cause in plain words and show it happening; the calculation stays off-screen. | One before/after state, or the same cost returning every month. |
| 5. Complication or exception | 250 | Test an obvious explanation or fix and expose its actual limit. | Change one input; show why the initial answer is incomplete. |
| 6. Alternative and payoff | 550 | Compare fairly, account for tradeoffs and answer the opening question. | Same starting conditions, changed choice, derived outcomes. |
| 7. Natural close | 50 | Leave a specific consequence or useful distinction; optionally bridge to a related video. | Return to the opening object, balance or decision in its new context. |
| **Total** | **1,800** | **Complete explanation; no runtime padding.** | |

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

### Payoff: answer, compare, then stop

Return to the opening question with the demonstrated cause. In a fictional comparison, hold starting income, time horizon and relevant conditions constant unless the change is explicitly part of the experiment. Show costs and remaining constraints of the alternative. Do not make Alex win through unexplained extra income, perfect foresight or omitted expenses.

Explain what the viewer should understand, not automatically what they should buy or do. A structural problem may leave the character with limited choices; do not invent an easy escape. A financial tradeoff may lack a single correct answer. Finish on the resulting decision, number or image rather than repeating the lesson in several slogans.

One optional next-video CTA is this brand's editorial choice, not a universal pattern found in the transcripts. Connect it to a real adjacent question after delivering the promised answer. Omit it when no relevant next video exists. Add a sponsor segment only when actually commissioned; its claims need verification and its words belong in a separate budget. Return explicitly to any interrupted question.

**Narrative variation:** Not every video requires Sam/Alex, not every chapter needs a cliffhanger, and not every ending needs an inspirational moral. Rotate scenario/mystery/contrast and let some moments be quiet.

Use a system mystery for payment or banking flows, a documented case for a scam, or a decision comparison for a genuine tradeoff. Preserve the central question and visible mechanism; do not force every subject into a personal mistake. A numbered list is useful only when the categories explain the question.

## 5. Anti-slop checklist: edit the structure, not just vocabulary

Flag these **in context**, not as an automatic ban list:

- **Vague hype:** "This changes everything", "The truth is shocking", "Let that sink in."
- **Throat clearing:** "In today's world", "Let's dive in", "Here's the thing", "As we all know."
- **Artificial reversals:** endless "It's not X; it's Y" construction.
- **Metronomic cadence:** every paragraph starts with a rhetorical question, every sentence is short, every section ends with an aphorism.
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
- Aim for most sentences around 8–20 spoken words, but vary naturally. There is no hard cap.
- Break audio into meaningful paragraphs or segments (start with about 80–180 words each; tune to local engine); never split halfway through a sentence or a reveal.
- Keep voice, speed and pronunciation settings consistent across segments; allow quiet pauses at semantic boundaries during audio assembly.
- Do not assume a given voice engine supports SSML, emotion tags or `[pause]` directives; test your specific local VoiceStudio model first. Keep direction cues in metadata unless known to work.
- Generate a 45–60-second sample and **listen with eyes closed**. Mark awkward timing, emphasis, unclear references, strange number readings, and monotone chunks. Edit the words or segmentation, not just the speaking speed.

Approximate narration budget: **135–155 spoken words per minute** as a starting experiment. A 12-minute episode therefore needs roughly 1,620–1,860 spoken words *before adjusting for pauses and diagrams*. Time the actual chosen voice; it supersedes word-count formulas.

Planning durations are estimates, never aligned cues. After narration and listening review, prepare phrase cues and storyboard JSON and compile with `src/timeline/compiler.ts`; graphics use compiled event frames, cue IDs and documented offsets. Regenerated narration or WAV invalidates alignment and hashes. Do not accelerate or stretch speech to fit the outline, or put guessed narration timestamps in graphics. The film uses one global Audio node.

## 8. Visual writing for stickman animation

Every beat should identify: whose viewpoint, what changes, what viewers can see, and the finance concept being clarified. Use visual metaphors only when they clarify the mechanism. E.g. recurring bills as physical weights, a transfer as money moving through intermediary stops, a debt balance as a meter.

**Character roles:** Sam has a goal, reasons and constraints; he is neither a permanent fool nor a stand-in for every viewer. Alex can ask a useful question, test an alternative or expose an assumption. He is not an all-knowing lecturer and need not appear in every episode. Keep one primary narrator; occasional dialogue must earn its place by revealing a choice or misunderstanding. Do not add voices just to repeat the narration.

Use the reference characters' expressive faces, readable silhouettes and familiar props. Current project instructions supersede the source image: keep Sam and Alex hairless and preserve the approved blue-hoodie/white-shirt identities. Use the project palette: yellow for money, coral for costs/loss and teal for an alternative. An alternative still needs its costs explained; color alone must not imply a guarantee.

Write what changes on screen: a bill returns next month, a balance declines, or a payment reaches a labeled intermediary. A character gesturing beside unchanged text is not a mechanism demonstration. Reveal one financial relationship at a time and let the viewer see the cause; a before/after state can carry the proof without a visible calculation. Text labels support the explanation; no default subtitles or paragraph-length cards. Do not prescribe a cut every N words: the transcript study did not measure visual timing.

Don't narrate on-screen text word-for-word unless repetition helps comprehension. Avoid images that imply incorrect mechanics (money vanishing, instant financial guarantees). Add explicit labels for example assumptions and disputed interpretations.

For production, produce a table with Beat ID / Narration segment / Action or visible change / Financial prop or diagram / Fact or assumption ID / Estimated duration. Mark all durations as provisional until measured narration and reviewed cues exist. Do **not** put stage instructions in `narration.txt`.

## 9. Script review and scoring

Score 0–5 each (40 points):

| Category | Five-point test |
|---|---|
| Premise + opening | Immediate, specific, compelling question aligned to title |
| Character + stakes | Believable decision, understandable obstacle and consequence |
| Mechanism clarity | Viewer can explain the financial cause in plain words |
| Originality + specificity | Specific scenes, genuine insight; no generic filler |
| Natural speech | Sounds good aloud; varied rhythms and real transitions |
| TTS readiness | Numbers/pronunciations/segments checked in actual engine |
| Financial integrity | Every factual claim sourced; assumptions and caveats preserved |
| Visual storytelling | Actions and diagrams add meaning rather than decorative movement |

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
  outline.md         # causal beats, word budgets, question tracker, fair comparison
  script.md          # annotated production script
  narration.txt      # TTS-ready speech only
  storyboard.md      # characters, actions, finance diagrams per beat
  qa.md              # scorecard, read-aloud notes, TTS test notes
```

For efficiency, do one research pass, one initial draft, and **targeted** editorial revisions. A high-effort rewrite is justified only if the premise, facts, or story logic are wrong.

Use the files in this order:

1. **Brief and sources:** Choose the viewer's question, identify the mechanism, verify the relevant claims and write the example assumptions. Settle the title promise and ending together; revise the promise if the evidence does not support it.
2. **Outline:** Write the opening situation and payoff first. Connect them with causal beats, proposed word budgets and the question tracker. Identify the comparison's changed input and held conditions. Do not write a full draft around an unresolved mechanism.
3. **Spoken draft:** Draft complete narration before detailed motion planning. Use short action notes to test whether the mechanism is drawable. Keep source and assumption IDs beside the relevant passages in `script.md`.
4. **Focused revision:** Check cause, evidence, arithmetic and payoff before rhythm and wording. Cut repeated explanations and unsupported tangents. If a beat adds no action, evidence, constraint or changed understanding, merge or remove it.
5. **Voice preparation:** Export `narration.txt` from the approved script. Check that it contains the same spoken content, preserves qualifiers and amounts, and excludes directions and source IDs. Test the chosen local voice and record listening findings in `qa.md`; do not mark them passed in advance.
6. **Production handoff:** Deliver the complete script, sources, assumptions, outline and storyboard notes. Distinguish provisional durations from reviewed cues. Script completion does not approve audio, motion, rendering or publishing. After measured narration, prepare and review alignment separately under the project timing rules.

**Handoff test:** Someone reading the packet should be able to identify the central question, explain the mechanism, reproduce the example arithmetic, locate the supporting claims and state the comparison's limitation. Record unresolved claims or listening issues explicitly; an editorial score does not erase them.

## 12. Evidence and background references

The v2 structural adaptation is grounded in the [local transcript analysis](../docs/transcript-longform-analysis.md), [channel branding](CHANNEL-BRANDING.md), [thumbnail board](channel-design.png), and [character reference](character-reference.png), subject to current project overrides. The study contains 12 longform scripts across three groups; their proportions, sentence statistics and observed phrases are not performance benchmarks. New hook prompts and word budgets in this guide are editorial proposals, not quotations or measured optimal values.

The links below are retained background references from v1. They were not revalidated for this revision and are not additional evidence for the local transcript findings. Their inclusion does not authorize a different voice service, rendering engine or production workflow.

Anti-slop: https://github.com/blader/humanizer ; https://github.com/theclaymethod/unslop ; https://github.com/hap-team/deslop ; https://github.com/westonhancock/unslop

Structure: https://github.com/yaxeen/storytelling-skills/blob/main/skills/long-form-youtube/SKILL.md ; https://github.com/SkillMedev/skills/blob/main/skills/youtube-script-writer/SKILL.md

Creator guidance: https://kurzgesagt.org/what-we-do ; https://support.google.com/youtube/answer/9314415 ; https://support.google.com/youtube/answer/16559650

Audio writing/TTS: https://www.poynter.org/educators-students/2017/6-tips-for-writing-broadcast-stories/ ; https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices ; https://docs.cloud.google.com/text-to-speech/docs/gemini-tts

Public transcript examples: https://pickscribe.com/v/1zjcZ661ups ; https://pickscribe.com/de/v/TJDcGv9OH4Q ; https://pickscribe.com/it/v/N3vR3PIIyQI

**Evidence limits:** The script patterns are editorial interpretations of selected examples, not causal proof of why a video performed well. Public videos generally do not disclose every writing tool used. All source links are for research; this skill's rules are original adaptations, not a verbatim copy of other creators' scripts.
