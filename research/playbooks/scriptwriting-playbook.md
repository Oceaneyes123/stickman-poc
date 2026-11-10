# Scriptwriting playbook

Delta document. `references/SCRIPT_GUIDE.md` (v2.0) already owns the full writing
process, fact ledger, beat allocation and anti-slop audit. This file adds only what
the 18-channel corpus (`../channels/`) supports, and states
the numbers behind each rule.

## 1. Hook library (each entry is evidence, not invention)

Every hook below is a verbatim opening line from the corpus with its timestamp. Use
the *shape*, never the line.

| Shape | Evidence | When to use |
|---|---|---|
| Two facts in tension | "fewer young people than ever are going to be able to buy a house in their lifetime and at the same time homes are getting more expensive every year" — How Money Works, 0 s | When the story is a contradiction in the market |
| The viewer's own question | "Okay, so why haven't home prices crashed yet? Because they kind of should be" — How Money Works, 0 s | When the audience already noticed the anomaly |
| Hypothetical invitation | "if you wanted to destroy the American economy, what would you do differently?" — How Money Works, 0 s | When the mechanism is easier to see from outside |
| Instruction attached to an image | "Let this circle represent $1,000,000" — James Jani, ~10 s | When scale is the point |
| Second person + reversal | "You live on the 30th floor. Until tonight, that was the worst thing about your flat." — Beanie Survives, 0 s | Scenario stories where the viewer is the subject |
| Correct an assumption | "Mercury is the closest planet to the sun, but if you think that means it's hot all the…" — Paint Explainer, 0 s | Explainers where the intuitive answer is wrong |
| Anomaly inside a familiar role | "the janitor that had 8 million dollars in savings when he died in 2014" — Swedish Investor, 0 s | Profile-driven money stories |
| Refuse the expected frame | "This is not a sad story!" — Kurzgesagt, 0 s | When the topic invites a tone the video won't take |

**Hard rule from the corpus:** no greeting, no channel intro, no "in today's video".
Verified across 26 transcripts: `"in today's video"` 0, `"welcome back"` 1 (quoted
speech, not an opening), `"hey guys"` 3 (two quoted, one mid-video transition).

**Timing rule:** the first payoff — a number, a named person, an image with a claim —
must land by ~25 s. Every video with captions does this.

## 2. Beat template for 10–15 minutes

Derived from the observed structures (Paint Explainer's per-section unit; HMW's
thesis → numbered reasons → bonus; Beanie's set/counter loop; James Jani's
definition cards). Times are targets at 175 wpm, not measurements of any video.

| # | Beat | Target | Must contain | Visual type |
|---|---|---|---|---|
| 1 | Contradiction | 0:00–0:25 | One sentence a viewer could repeat | Diagram or wide establishing |
| 2 | Stakes, second person | 0:25–1:15 | Why this costs *them* | Character in environment |
| 3 | The mechanism, part 1 | 1:15–4:00 | The first causal step, with a number | Diagram + measurement label |
| 4 | Worked example | 4:00–6:30 | A named person or a labelled hypothetical | Character acting |
| 5 | The turn | 6:30–8:30 | The thing that makes the simple answer wrong | Definition card or comparison |
| 6 | Consequence | 8:30–11:00 | What it means at their scale | State card with a delta |
| 7 | Return to the hook | 11:00–12:30 | The opening question answered as a statement | Same framing as beat 1 |
| 8 | One useful distinction | 12:30–13:30 | Something they can act on | Definition card |

Cut beats 4 or 6 for a 10-minute script; never cut 1, 5 or 7.

## 3. Sentence rules, with corpus numbers

Measured on the six punctuated transcripts (whisper restores punctuation; YouTube
captions do not):

| Rule | Corpus range | Target for this channel |
|---|---|---|
| Mean sentence length | 7.3 (Beanie) – 23.6 (Economics Explained) | **11–16 words** |
| Short sentences (≤8 words) | — | at least 1 in 4 |
| Speech rate | 146 (Kurzgesagt) – 240 (Odd1sOut) | **165–190 wpm** |
| Second person density | 5.19/100 words (Beanie) – 0.46 (EE) | **2.0–3.5/100 words** |
| Questions | 0.0 (Paint, Beanie) – 1.1 (Odd1sOut) | **≤0.3/100 words** |

The second-person target is the single strongest signal in the corpus: Beanie writes
one "you" every 19 words and reads as instructions; Economics Explained writes one
every 217 words and reads as a lecture.

## 4. Anti-slop, verified

Searched across all 26 transcripts: `"but here's the thing"` 0, `"here's the thing"` 0,
`"let that sink in"` 0, `"game changer"` 0, `"mind blowing"` 0, `"you won't believe"` 0,
`"smash that"` 0. The successful channels do not use the patterns the repo already
bans, which means the ban costs nothing in reach.

Keep from the existing guide: no invented statistics, no fabricated expertise, no
"most people don't know" openers, no rhetorical-question chains.

## 5. Transitions that appear in the corpus (use these instead of filler)

- **"Okay, so…"** — HMW opens sentences with it constantly; it signals a spoken
  register without empty drama.
- **"I mean…"** — Odd1sOut and James Jani use it to correct themselves mid-thought.
- **"Which means…"** — the causal hinge; Paint Explainer uses the equivalent
  visually (arrow + label) more than verbally.
- **A named number restated** — HMW and Swedish Investor both restate the key figure
  before moving on; it costs two seconds and replaces a transition sentence.

## 6. Narration-to-TTS constraints (repo-specific)

- One sentence per cue; a cue over ~30 words cannot be re-timed without splitting.
- Write the pause: a chapter card or state card needs a beat of silence before it.
- Do not stretch speech to hit a runtime (existing rule); the corpus ranges from 6:47
  to 79 minutes in the same genre.
- Target 165–190 wpm; if the measured WAV lands outside, fix the script, not the
  playback rate.

## 7. Checklist before the script is approved

- [ ] Hook is one of the eight shapes and names the contradiction in the first 25 s.
- [ ] No greeting, no channel intro, no "in today's video".
- [ ] Every beat has a visual type assigned (see `storyboard-playbook.md`).
- [ ] Numbers exist and trace to `sources.md`; totals trace to `src/finance/math.ts`.
- [ ] Mean sentence length 11–16 words; at least a quarter ≤8 words.
- [ ] Second person 2.0–3.5 per 100 words.
- [ ] Zero hits on the banned phrase list.
- [ ] Beat 7 returns to beat 1's question.
