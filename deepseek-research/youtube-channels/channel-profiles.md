# Channel profiles

Eighteen channels, five videos each, ranked by reported view count plus the two
newest uploads (the ranking rule is in `scripts/research/fetch_evidence.py`). The
deliberate side effect: every profile shows the gap between a channel's best-ever
video and what it publishes now.

Subscriber counts were read from each channel page in a browser session
(2026-11-10). View counts are what YouTube reported to yt-dlp at fetch time and
are rounded by the platform (e.g. "3,600,000"). Captions: "yes" means real timed
text was retrieved; where YouTube blocked or disabled them, the video was
transcribed locally with faster-whisper small and marked `asr:` in the tables.
Raw rows: [tables.md](../../research-evidence/tables.md). Anything below labelled
*inferred* is a reading of the evidence, not a measurement.

---

## Finance / explanatory storytelling

### James Jani — @JamesJani — 2.22M subs, 28 videos

| Video | Views | Length |
|---|---:|---|
| The Untold Truth About Money | 19,000,000 | 17:26 |
| The Dark World of Megachurches | 15,000,000 | 12:44 |
| The Fake Genius: a $30 BILLION Fraud | 11,000,000 | 25:13 |
| The Cult of the Dead Stock | 2,800,000 | 28:43 |
| The GameStop Cult: An Untold Story | 1,400,000 | 27:27 |

28 videos in seven years, and the corpus is 8,000–11,600 words per video — this is
documentary-length work at a cadence of a few videos a year. **Observed:** the
money video opens on a single grey dot on a flat yellow field, then a grid of about
120 dots ("Let this circle represent $1,000,000… this is what 1 billion dollars
would look like"), i.e. the hook is a scale demonstration carried by one shape.
Visual language mixes live-action dramatisation, a chalkboard, yellow-field motion
graphics and full-frame typography ("MONEY = SALARY FROM A JOB"). **Inferred:** the
channel's authority comes from research depth and a consistent graphic signature,
not from animation craft.

### How Money Works — @HowMoneyWorks — 1.76M subs, 330 videos

| Video | Views | Length |
|---|---:|---|
| If Nobody Can Afford A Home… | 4,000,000 | 11:36 |
| The (Overdue) Collapse Of Short Term Rentals | 3,900,000 | 13:10 |
| The (Overdue) Collapse of the 9-5 Job | 3,300,000 | 11:12 |
| How American Real Estate Is Delaying The Inevitable | 1,600,000 | 18:39 |
| If You Were TRYING To Destroy The Economy | 1,100,000 | 17:05 |

**Observed:** the housing video opens with a Fortune headline card over live-action
b-roll and reaches its thesis as a spoken contradiction at ~15 s: "but if nobody can
afford to buy a house then how the [ __ ] do they keep getting more expensive?"
Visuals across one video: news screenshot, presenter b-roll, Wojak meme, staged
live-action with RIGHT/WRONG buttons, a 3D balance scale, a Trading Economics chart
screenshot, an expert interview clip with a CBC lower-third, and a "REASON #4"
typography card. **Inferred:** credibility is borrowed from real artefacts, retention
from staged metaphor and jokes. Almost none of that asset base is reproducible in a
code-only pipeline; the metaphor and chart grammar is.

### The Swedish Investor — @TheSwedishInvestor — 1.02M subs, 156 videos

| Video | Views | Length |
|---|---:|---|
| The Psychology of Money (Morgan Housel) | 5,800,000 | 16:52 |
| The Intelligent Investor's Road to $1,000,000 | 5,300,000 | 12:41 |
| The Intelligent Investor Summary (Graham) | 3,500,000 | 10:16 |
| How to Tell When a Stock is Cheap/Expensive | 893,000 | 20:20 |
| The Big Secret for the Small Investor | 171,000 | 9:12 |

**Observed:** three of five open with a named person and a number — "At the age of 43,
Tom retired from his 9-5 at Ford Motor"; "Have you heard the story about Ronald Read,
the janitor that had 8 million dollars in savings when he died in 2014?" **Inferred:**
book-summary format; the hook is a person-shaped anomaly, and the rest of the video
is the mechanism that explains it. Lowest animation ambition in the finance set.

### Economics Explained — @EconomicsExplained — 2.89M subs, 456 videos

| Video | Views | Length |
|---|---:|---|
| How the World's Richest Country Lost 90% of its GDP | 5,200,000 | — |
| Why Everyone is Leaving New Zealand | 3,600,000 | 13:33 |
| Something Terrible Is Happening in Italy | 3,200,000 | — |
| How China Is Restarting Its Economy | 804,000 | — |
| Why Argentina Wants the World's Corrupt Billionaires | 382,000 | — |

Country-as-character format. Transcript evidence for this channel is partial (see
`video-analysis.md`); claims about its script structure are limited to the videos
with captured text.

### MagnatesMedia — @MagnatesMedia — 1.86M subs, 255 videos

| Video | Views | Length |
|---|---:|---|
| The Secret Chinese Company That Owns Everything | 12,000,000 | 1:18:46 |
| Rockefeller: The World's First Billionaire | 7,700,000 | — |
| The Disturbing History of Coca-Cola | 7,600,000 | — |
| The INSANE Truth About OpenAI | 1,200,000 | — |
| The INSANE Truth About YouTube | 593,000 | — |

Feature-length business documentary (the top video is 79 minutes). **Inferred:**
chaptered narrative documentary, not explainer; the runtime alone rules it out as a
format model for a 10–15 minute slot, but its chapter pacing is worth reading for
how a long story is segmented.

---

## Animation / visual storytelling

### Kurzgesagt — @kurzgesagt — 25.8M subs, 397 videos

| Video | Views | Length |
|---|---:|---|
| The Coronavirus Explained & What You Should Do | 89,000,000 | — |
| The Egg – A Short Story | 36,000,000 | 7:56 |
| What If You Detonated a Nuclear Bomb In The Marianas Trench | 36,000,000 | — |
| How I Survived Late-Stage Cancer | 8,200,000 | — |
| You Will Only Like Half of This Video | 5,700,000 | — |

**Observed (stills):** "The Egg" runs on tonal and scale inversions — wide night
landscape with no subject (3 s), busy truck stop (12 s), extreme close-up of two eyes
filling the frame (25 s), medium figure with rim light (40 s), tiny figure in a white
void (60 s), giant cropped face versus small seated figure (80 s). **Observed
(script):** hooks are declarative, not inquisitive — "you were on your way home when
you died"; "This is not a sad story!"; "Hey wake up, AI is rotting your brain!"
**Inferred:** the house style is a per-beat illustration rebuilt from scratch, with
almost no reusable set — the highest asset cost per minute in the corpus.

### The Infographics Show — @TheInfographicsShow — 15.5M subs, 6.3K videos

| Video | Views | Length |
|---|---:|---|
| What an AI Crash Would Look Like, Day by Day | 4,900,000 | — |
| The AI bubble is about to pop… | 4,600,000 | — |
| What Lethal Radiation Does to Your Body (Hour by Hour) | 2,900,000 | — |
| Events That Will Cause the End of the World | 68,000 | — |
| Why You Don't Want to Earn $150,000 to $250,000 | 37,000 | — |

6,300 videos. **Inferred:** volume format — the "X, hour by hour / day by day"
titling is a template, and the 4.9M vs 37K spread across one channel is the clearest
evidence in the corpus that a format can be exhausted.

### TheOdd1sOut — @theodd1sout — 20.8M subs, 211 videos

| Video | Views | Length |
|---|---:|---|
| Life is Fun – Ft. Boyinaband | 185,000,000 | — |
| Annoying Customers | 118,000,000 | 6:48 |
| Tabletop Games | 109,000,000 | — |
| YouTube has Changed (me) | 4,100,000 | — |
| Why I STILL Love Comics | 1,500,000 | — |

**Observed (still, 70 s):** two characters across a counter on a pure white
background. Big rounded heads, stubby limbs ending in rounded nubs, uniform bold
black line, flat fills, dot-or-dash eyes, a straight line for a bored mouth and a
wide open mouth with red tongue for the angry one. The only set element is a brown
rectangle. **Inferred:** comedy is carried by pose contrast and face economy at
almost zero background cost — the opposite trade from Kurzgesagt.

### JaidenAnimations — @jaidenanimations — 15.3M subs, 254 videos

| Video | Views | Length |
|---|---:|---|
| I Attempted my First Pokemon Nuzlocke | 100,000,000 | — |
| I Attempted a Pokemon Platinum Nuzlocke | 67,000,000 | — |
| The best pokemon game you never played | 46,000,000 | — |
| Talking about my cat again | 8,800,000 | — |
| How I ended up Vegetarian | 6,000,000 | — |

Autobiographical animation; first-person titles. Transcript not captured for this
pass — no script claims are made here.

### Alan Becker — @alanbecker — 34.3M subs, 271 videos

| Video | Views | Length |
|---|---:|---|
| Cave Spider Roller Coaster – Animation vs. Minecraft Ep. 1 | 542,000,000 | 7:35 |
| Animation vs. Minecraft (original) | 352,000,000 | — |
| Animation vs. Minecraft Shorts Season 1 (1–14) | 284,000,000 | — |
| Creeper Clan – Animation vs. Minecraft Ep 40 | 25,000,000 | — |
| The Dark Age – Animator vs. Animation 14 | 10,000,000 | 18:49 |

**Observed (stills):** hollow circular heads with no faces, single-line limbs, thick
coloured outlines, identity by colour alone (orange, green, yellow, blue, red). Flat
vector figures against pixel-textured Minecraft blocks. Depth is layered side-view
planes — foreground cobwebs/particles, midground rails, background cave walls — with
diagonal track geometry carrying speed. **Inferred:** no dialogue, no faces, no
narration in the sampled episode; all story information is staging and movement. This
is the strongest proof in the corpus that a stick figure needs neither a face nor a
voice to hold attention, and the weakest model for a narrated finance explainer.

### The Paint Explainer — @thepaintexplainer — 2.02M subs, 169 videos

| Video | Views | Length |
|---|---:|---|
| What Dying on Every Planet Would Be Like | 13,000,000 | 8:16 |
| Worst Punishments in History | 9,100,000 | — |
| Scariest Urban Legends That Turned Out to Be True | 8,900,000 | — |
| Would the Great White Shark Dominate Every Prehistoric Ocean? | 148,000 | — |
| Worst Ways People Got Trapped | 71,000 | — |

**Observed (stills):** flat white backgrounds; black-outlined flat vector objects; a
persistent centred uppercase planet name at the top of every shot; red reserved for
force and danger (arrows labelled "pressure", thermometers, dashed measurement lines);
text used as measurement annotation ("about 92 bar", "1 bar", "deepest point"); a
tiny stick figure at 5 s to be burned by the Sun, and a cartoon astronaut at 150 s to
be crushed by pressure. **Inferred:** one measurement, one arrow and one stand-in
figure per beat. This is the closest published grammar to a code-driven stickman
explainer in the whole corpus, and the cheapest to reproduce.

### theblurb — @thedailyblurb — 119K subs, 94 videos

| Video | Views | Length |
|---|---:|---|
| If you're ambitious but lazy, please watch this video… | 4,800,000 | — |
| How to Never Run Out of Things to Say | 978,000 | — |
| How To Actually Achieve Your Goals in 2026 | 358,000 | — |
| It's boring, but it makes you unstoppable | 22,000 | — |
| It's Boring, But It Makes You Rich | 3,800 | — |

Small channel with one 4.8M outlier and single-digit-thousand uploads after it. The
corpus's clearest case of a thumbnail-and-title hit that the channel could not repeat.

### Stickman survival wave — Beanie Survives (@BeanieSurvives, 110K subs, 26 videos, created Feb 2026) and Zenn (@Zenn0009, 200K subs, 39 videos)

| Channel | Video | Views |
|---|---|---:|
| Beanie Survives | Zombie Outbreak: 30 Days Trapped On The 30th Floor | 2,900,000 |
| Beanie Survives | Zombie Outbreak: Eating Birds On A Rooftop | 1,100,000 |
| Beanie Survives | Zombie Outbreak Ep. 3: Leaving The Tower On Day 90 | 887,000 |
| Beanie Survives | Season 2 trailer (newest) | 13,000 |
| Zenn | What Did Ancient Humans Do at Night? | 8,100,000 |
| Zenn | The Calhoun Effect | 5,300,000 |
| Zenn | Why You Can't Remember Being a Baby | 1,800,000 |
| Zenn | The What-The-Hell Effect (newest) | 21,000 |

**Observed (Beanie stills):** round white head, two dot eyes, thin stick body, yellow
beanie; one apartment set relit across day/night; peephole fisheye shot; full-screen
inventory cards ("SUPPLIES · DAY 9", water jug icons fading, "Food, rationed 16 days").
**Observed (Zenn titles):** question-form explainer titles at 5–8M, then 21–30K on the
newest uploads. **Inferred:** both are the current AI-assisted stickman wave — cheap
to produce, serialised, and heavily dependent on the algorithm's first impression.

---

## Additional channels

### OverSimplified — @oversimplified — 9.69M subs, 33 videos

| Video | Views | Length |
|---|---:|---|
| WW2 – OverSimplified (Part 1) | 105,000,000 | 13:46 |
| The Cold War (Part 1) | 75,000,000 | — |
| The American Civil War (Part 1) | 72,000,000 | — |
| The Second Punic War (Part 3) | 20,000,000 | — |
| The Second Punic War (Part 2) | 21,000,000 | — |

33 videos in roughly twenty years. The three most-viewed are 105M, 75M and 72M, so
views per upload are far above every other channel here. Stick figures with round
heads, dot eyes and thick outlines acting out history with comedy. **Inferred:** the
highest views-per-video and the slowest cadence in the corpus are the same fact —
scarcity is part of the appeal.

### Sam O'Nella Academy — @samonellaacademy — 4.81M subs, 69 videos

0zMSMJZc9EA 23M · nYHDj2sB-rc 20M · MGVraepNj04 19M · _kgTL-Z9sBU 3.6M · enXnTKnTeJ8 146K.
Crude stick figures, deadpan narration, history trivia. **Inferred:** the drawing
quality is deliberately poor; the writing is the product.

### PolyMatter — @PolyMatter — 1.93M subs, 188 videos

5Wq0yv73NpY 7.6M (Zimbabwe currency crisis) · yloJi635Ya8 5.8M · Fg7jIjmLyWs 5.2M ·
Jz5L3X453Jw 210K · QEVTeJtzJFo 187K. Finance/economics with map-and-chart motion
graphics. Closest to a "pure motion-graphics finance" channel.

### Wendover Productions — @Wendoverproductions — 4.92M subs, 292 videos

b4wRdoWpw0w 10M · 5-QejUTDCWw 9.9M · b1JlYZQG3lI 7.8M · 2hx9r7JE6mg 866K ·
Fz9vY4DVCQ8 761K. Logistics explainers, map-driven. Included as a comparison for
information-graphic pacing, not as a format model.

---

## What the profiles actually show

1. **Views-per-video and cadence trade off.** OverSimplified (33 videos, ~20M avg),
   James Jani (28 videos, ~10M avg) and Sam O'Nella (69 videos) sit at the top of
   views per upload; The Infographics Show (6,300 videos) and How Money Works (330)
   trade per-video reach for volume.
2. **Every channel in the corpus has a 10–1,000× gap between its best video and its
   newest.** Zenn 8.1M → 21K, The Paint Explainer 13M → 71K, theblurb 4.8M → 3.8K,
   The Infographics Show 4.9M → 37K, How Money Works 4.0M → 1.1M. A single hit is
   not a channel; the ones that hold are the ones with a repeatable series.
3. **Stick figures do not imply low effort.** Alan Becker and OverSimplified are
   stick figures with 10–20 years of iteration behind them; the AI-wave channels
   (Beanie, Zenn) are stick figures with weeks of iteration and matching fragility.
4. **Only The Paint Explainer's grammar is reproducible in a code-only pipeline at
   its observed quality.** Kurzgesagt needs a studio; How Money Works needs licensed
   footage and interviews; Alan Becker needs a choreography team.
