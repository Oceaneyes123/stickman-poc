# Script and storytelling reverse engineering

Corpus: 26 videos with usable text across 10 channels. Punctuation matters here:
YouTube's own captions strip sentence punctuation, so sentence-level statistics are
only computed for the videos transcribed locally with faster-whisper (which restores
it). Channels whose numbers look absurd (How Money Works "mean sentence 1,472
words") are artefacts of unpunctuated captions and are marked as such — those rows
support word counts and speech rate only.

`../evidence/metrics.json` holds the raw per-video numbers; this document
interprets them.

## 1. Hooks — what is actually said in the first 15 seconds

Verbatim from captions, with the timestamp where the line begins.

| Channel / video | First line | Hook type |
|---|---|---|
| How Money Works, housing | "fewer young people than ever are going to be able to buy a house in their lifetime and at the same time homes are getting more expensive every year" (0 s) | Two facts in tension, no question yet |
| How Money Works, 9-5 | "companies are doing Mass layoffs while complaining about not being able to find enough employees" (0 s) | Contradiction in one sentence |
| How Money Works, real estate | "Okay, so why haven't home prices crashed yet? Because they kind of should be" (0 s) | Question the viewer already has |
| How Money Works, destroy the economy | "Okay. So, as a fun little hypothetical question, if you wanted to destroy the American economy, what would you do differently?" (0 s) | Hypothetical invitation |
| James Jani, money | "Let this circle represent $1,000,000" (~10 s) | Instruction attached to an image |
| James Jani, GameStop | "on the internet there's practically a community for everything but I have never seen something quite like this" (0 s) | Personal astonishment |
| James Jani, FTX | "I'm very excited to introduce you to Sam bankman freed everybody likes a story about an underdog" (0 s) | Framing a story as an underdog tale before the fall |
| Kurzgesagt, The Egg | "you were on your way home when you died" (0 s) | Second person + death, no preamble |
| Kurzgesagt, coronavirus | "In December 2019 the Chinese authorities notified the world that a virus was spreading through their communities." (0 s) | Dated fact, documentary register |
| Kurzgesagt, AI | "Hey wake up, AI is rotting your brain!" (0 s) | Alarm, second person, imperative |
| Kurzgesagt, cancer | "This is not a sad story!" (0 s) | Refusal of the expected frame |
| Swedish Investor, psychology | "Have you heard the story about Ronald Read, the janitor that had 8 million dollars in savings when he died in 2014?" (0 s) | Anomaly inside a familiar role |
| Swedish Investor, $1M | "At the age of 43, Tom retired from his 9-5 at Ford Motor through a combined effort of savings and stock market investments" (0 s) | Outcome first, person named |
| Swedish Investor, Graham | "Successful investing does not require stratospheric IQ, insider information, or luck for that matter." (0 s) | Permission/relief |
| Paint Explainer, planets | "Mercury is the closest planet to the sun, but if you think that means it's hot all the…" (0 s) | Correct a common assumption |
| Beanie Survives, 30th floor | "You live on the 30th floor. Until tonight, that was the worst thing about your flat." (0 s) | Second person + reversal |
| Odd1sOut, customers | "Hey, this is kinda like a part 2 video. I mean, you don't have to have seen the part 1 video" (0 s) | Housekeeping, low-stakes intimacy |
| Zenn, ancient humans | (first line at 0 s — see `metrics.json` hooks) | Question-form curiosity |

**Observed:** not one hook in the corpus is a greeting, a channel intro, or a
"welcome back". Every one starts mid-thought. Four of the eighteen start with the
word "you"; five open on a contradiction or a correction.

Phrase counts across all 26 transcripts (`grep` over `../evidence/*/*.json`,
2026-11-10): `"but here's the thing"` **0**, `"here's the thing"` **0**,
`"let that sink in"` **0**, `"game changer"` **0**, `"mind blowing"` **0**,
`"you won't believe"` **0**, `"in today's video"` **0**, `"smash that"` **0**,
`"at the end of the day"` **2**, `"hey guys"` **3**, `"welcome back"` **1**.
The greeting hits are not openings: two are quoted speech from people inside James
Jani's documentaries ("my name is morance"), and the MagnatesMedia one is a
mid-video transition ("hey guys, before we get to the next part of the story").

**Observed timing:** the first meaningful *payoff* — the first number, image or
answer that rewards staying — lands inside the first 25 seconds in every video where
captions exist. James Jani states "$1,000,000" by ~10 s; Beanie has the flat and the
reversal by 8 s; Paint names the planet and the danger in one sentence; How Money
Works states the contradiction by 15 s.

## 2. Sentence-level numbers (punctuated transcripts only)

| Channel | Mean sentence (words) | Questions /100 words | "you/your" /100 words |
|---|---:|---:|---:|
| Beanie Survives | 7.3 | 0.0 | **5.19** |
| Zenn | 10.9 | 0.44 | 1.44 |
| Odd1sOut | 12.0 | 1.10 | 1.66 |
| Paint Explainer | 16.5 | 0.0 | 3.81 |
| MagnatesMedia | 20.4 | 0.11 | 1.19 |
| Economics Explained | 23.6 | 0.28 | 0.46 |
| Swedish Investor | 16.1 | 0.71 | 2.62 |
| Kurzgesagt | 194.8 (unpunctuated — ignore) | 0.20 | 3.14 |
| How Money Works | 1,472 (unpunctuated — ignore) | 0.08 | 1.35 |
| James Jani | 5,147 (unpunctuated — ignore) | 0.18 | 2.83 |

**Reading:** mean sentence length sits between 7 and 24 words. Beanie's 7.3 is the
extreme: two short sentences per caption chunk, almost every one in second person
(5.19 "you" per 100 words is one every 19 words). Economics Explained at 23.6 is the
other end — longer, more subordinate clauses, third person (0.46).

**Caveat:** whisper punctuation is a model's guess; these are approximations of the
spoken sentence, not the script.

## 3. Narrative beats that recur

From the existing deep analysis in `docs/transcript-longform-analysis.md` (five How
Money Works, five CasuallyFinance, two James Jani) plus the new corpus:

1. **Contradiction first, explanation second.** HMW housing: afford less → prices
   rise. HMW 9-5: layoffs + "can't find workers". Kurzgesagt AI: "you'll only like
   half of this video."
2. **A named person before a mechanism.** Swedish Investor: Tom, Ronald Read. James
   Jani: Bezos, SBF. HMW: "my audience" and a staged family.
3. **A worked analogy before the system.** CasuallyFinance's "Let's pretend you own
   Munder Difflin" (from the existing analysis) is the clearest; HMW's balance scale
   does the same job visually.
4. **A rewind.** Several videos go back in time before returning to the present
   question — the pattern is documented per-beat with exact quotes in
   `docs/transcript-longform-analysis.md` and is not re-derived here.
5. **Return to the hook.** The housing video re-asks its opening question as a
   statement near the end; Paint returns to the planet named at the start of each
   section.
6. **One ranked list where the last item is the real answer.** HMW's "bonus fourth
   reason" is literally a fourth item added after "three reasons" — the structure is
   visible in the chapter cards.

## 4. Retention devices actually present (text evidence only)

| Device | Evidence | Frequency |
|---|---|---|
| Open question stated in the first 15 s and answered late | HMW real estate: "why haven't home prices crashed yet?" | 3 of 5 HMW videos |
| Second person | Beanie: "You live on the 30th floor" | Beanie 5.19/100w |
| Named list with a bonus item | HMW "REASON #4" card | once per video |
| Serialised cliff (day counter, next episode) | Beanie "DAY 9" → "DAY 30"; "Season 2 Trailer" | every episode |
| Explicit refusal of the obvious | Kurzgesagt "This is not a sad story!" | 1 of 5 |
| "I" narrator with personal stake | James Jani "i was raised as a catholic but…" | 4 of 5 |

**Not claimed:** that any of these improved measured retention. No retention data
exists in this corpus. These are textual invitations, not proof viewers stayed.

## 5. Anti-slop findings

The corpus contains almost none of the patterns the project's own guide bans:

- **"But here's the thing"** — searched, zero occurrences across 26 transcripts.
- **Three-part lists announced as three-part lists** — only HMW's chapter cards, and
  they are numbered on screen, not narrated as a rhetorical triplet.
- **Empty motivational statements** — none in the finance set; the one channel that
  flirts with it (theblurb, "It's boring, but it makes you rich") is the one with
  the 3,800-view uploads.
- **Forced suspense** — present in Zenn and Paint ("if you somehow survived long
  enough"), and it works there because the format is hypothetical, not financial.

**Conclusion for our scripts:** the register that wins in this corpus is a specific
claim plus a number, delivered fast, with the narrator's own uncertainty admitted
("okay, so…", "I mean…"). The AI tells the guide warns about are absent from the
successful channels, which is evidence that removing them is not a style preference.

## 6. What is missing from this analysis

- No full beat map for Economics Explained, MagnatesMedia, Paint Explainer, Odd1sOut,
  Beanie or Zenn beyond the single transcribed video each.
- No measurement of pause length, emphasis, or prosody — captions carry none.
- No audience retention, CTR, or impression data for any video.
