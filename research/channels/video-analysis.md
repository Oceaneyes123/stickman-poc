# Video analysis — evidence status per video

The corpus is 90 videos (18 channels × 5: three most-viewed plus the two newest).
**26 of them have usable text.** This file states exactly what evidence exists for
each, so no later document can quietly treat a title as an analysis.

Full ranked rows for all 90: [tables.md](../evidence/tables.md).
Metrics for the 26: [metrics.json](../evidence/metrics.json).

## 1. Videos with a full transcript

`captions` = YouTube's own timed captions. `asr` = locally transcribed with
faster-whisper small because YouTube blocked or disabled captions; ASR restores
punctuation but can mishear names and numbers.

| Channel | Video | Views | Words | wpm | Source |
|---|---|---:|---:|---:|---|
| How Money Works | If Nobody Can Afford A Home… | 4,000,000 | 2,351 | 203.0 | captions |
| How Money Works | The (Overdue) Collapse Of Short Term Rentals | 3,900,000 | 2,681 | 201.2 | captions |
| How Money Works | The (Overdue) Collapse of the 9-5 Job | 3,300,000 | 2,286 | 201.0 | captions |
| How Money Works | How American Real Estate Is Delaying The Inevitable | 1,600,000 | 4,036 | 196.7 | captions |
| How Money Works | If You Were TRYING To Destroy The Economy | 1,100,000 | 3,555 | 201.1 | captions |
| James Jani | The Untold Truth About Money | 19,000,000 | 3,045 | 175.1 | captions |
| James Jani | The Dark World of Megachurches | 15,000,000 | 5,495 | 170.1 | captions |
| James Jani | The Fake Genius: a $30 BILLION Fraud | 11,000,000 | 11,066 | 170.8 | captions |
| James Jani | The Cult of the Dead Stock | 2,800,000 | 11,648 | 179.4 | captions |
| James Jani | The GameStop Cult: An Untold Story | 1,400,000 | 9,858 | 171.3 | captions |
| Kurzgesagt | The Coronavirus Explained | 89,000,000 | 1,389 | 162.3 | captions |
| Kurzgesagt | What If You Detonated a Nuclear Bomb… | 36,000,000 | 915 | 151.7 | captions |
| Kurzgesagt | The Egg – A Short Story | 36,000,000 | 910 | 114.7 | captions |
| Kurzgesagt | How I Survived Late-Stage Cancer | 8,200,000 | 2,223 | 152.2 | captions |
| Kurzgesagt | You Will Only Like Half of This Video | 5,700,000 | 491 | 149.1 | captions |
| Swedish Investor | The Psychology of Money | 5,800,000 | 2,351 | 151.9 | captions |
| Swedish Investor | The Intelligent Investor's Road to $1,000,000 | 5,300,000 | 3,763 | 162.8 | captions |
| Swedish Investor | The Intelligent Investor Summary | 3,500,000 | 2,560 | 192.9 | captions |
| Swedish Investor | How to Tell When a Stock is Cheap/Expensive | 893,000 | 5,605 | 155.3 | captions |
| Swedish Investor | The Big Secret for the Small Investor | 171,000 | 2,552 | 134.7 | captions |
| Economics Explained | Why Everyone is Leaving New Zealand | 3,600,000 | 2,808 | 207.8 | asr |
| MagnatesMedia | The Secret Chinese Company That Owns Everything | 12,000,000 | 14,995 | 190.7 | asr |
| The Paint Explainer | What Dying on Every Planet Would Be Like | 13,000,000 | 1,601 | 194.0 | asr |
| TheOdd1sOut | Annoying Customers | 118,000,000 | 1,631 | 240.4 | asr |
| Beanie Survives | Zombie Outbreak: 30 Days On The 30th Floor | 2,900,000 | 1,292 | 157.8 | asr |
| Zenn | What Did Ancient Humans Do at Night? | 8,100,000 | 1,599 | 187.5 | asr |

## 2. Videos with metadata only

All five videos for each of: The Infographics Show, JaidenAnimations, Alan Becker,
theblurb, OverSimplified, Sam O'Nella Academy, PolyMatter, Wendover Productions — plus
the remaining four videos each for Economics Explained, MagnatesMedia, The Paint
Explainer, TheOdd1sOut, Beanie Survives and Zenn.

For these, the corpus supports: title, view count, runtime, and rank within the
channel. It does **not** support any claim about script, structure, visuals or audio.
Titles are still evidence of *packaging* (see §4).

**Alan Becker exception:** the sampled episode ("Cave Spider Roller Coaster") has no
captions and no dialogue — its audio is music and effects. "No transcript" there is a
property of the video, not a data gap.

## 3. What each channel's evidence supports

| Channel | Script claims | Visual claims | Notes |
|---|---|---|---|
| How Money Works | Yes, 5 videos | Yes, 1 video sampled | Deep beat analysis already exists in `docs/transcript-longform-analysis.md` |
| James Jani | Yes, 5 videos | Yes, 1 video sampled | Same existing deep analysis |
| Kurzgesagt | Yes, 5 videos | Yes, 1 video sampled | |
| Swedish Investor | Yes, 5 videos | No | No frames sampled |
| Economics Explained | 1 video | No | |
| MagnatesMedia | 1 video (79 min) | No | |
| The Paint Explainer | 1 video | Yes | Closest grammar to our format |
| TheOdd1sOut | 1 video | 1 frame | Sheet generated, one frame read |
| Beanie Survives | 1 video | Yes | Stickman serial reference |
| Zenn | 1 video | No | AI-wave reference |
| theblurb, Infographics, OverSimplified, Sam O'Nella, PolyMatter, Wendover, Jaiden | No | No | Packaging only |

## 4. Packaging evidence (titles, available for all 90)

Titles are cheap, real evidence and they show the format families clearly:

- **Question form:** "If Nobody Can Afford A Home… Who's Going To Buy Them?", "What
  Did Ancient Humans Do at Night?", "What If You Detonated a Nuclear Bomb…", "Why
  Everyone is Leaving New Zealand", "How to Tell When a Stock is Cheap/Expensive".
- **Number as promise:** "a $30 BILLION Fraud", "30 Days Trapped On The 30th Floor",
  "Losing 90% of its GDP", "8 million dollars in savings".
- **Correct-the-assumption:** "What Dying on Every Planet Would Be Like", "You Will
  Only Like Half of This Video", "Worst Punishments in History".
- **Serial markers:** "Ep. 3", "Day 90", "Part 1", "Season 2 Trailer".
- **Curiosity with no topic:** "It's boring, but it makes you rich" (theblurb, 3,800
  views), "The What-The-Hell Effect" (Zenn, 21,000 views) — the two weakest
  performers in their channels both hide the subject.

## 5. The gap that matters more than any single video

Ranking by views and then pulling the two newest uploads produces a direct
comparison inside every channel. The "recent" column is the lowest-viewed of the two
newest captured, i.e. the freshest video with the least accumulation time:

| Channel | Best video | Recent upload | Ratio |
|---|---:|---:|---:|
| Zenn | 8,100,000 | 21,000 | 386× |
| The Paint Explainer | 13,000,000 | 71,000 | 183× |
| theblurb | 4,800,000 | 3,800 | 1,263× |
| The Infographics Show | 4,900,000 | 37,000 | 132× |
| Beanie Survives | 2,900,000 | 13,000 | 223× |
| How Money Works | 4,000,000 | 1,100,000 | 3.6× |
| James Jani | 19,000,000 | 1,400,000 | 13.6× |
| The Swedish Investor | 5,800,000 | 171,000 | 34× |
| OverSimplified | 105,000,000 | 20,000,000 | 5.3× |
| Alan Becker | 542,000,000 | 10,000,000 | 54× |

The newest upload is always the weaker number, because a new video has had less time
to accumulate views — this table is not a decline measurement. What it does show is
how much of a channel's total is carried by a handful of old videos, which is the
honest reason to study *formats* rather than *hits*.
