# Audio and narration

**No listening was performed.** These videos were downloaded as 480p video-only
streams for frame sampling, and the ASR runs used separate audio downloads that were
deleted with their temp directory. Nothing here describes timbre, accent, mixing,
music choice, or sound design, because none of it was heard.

What is available: speech rate from timed captions, and the presence of
`[Music]` / `[Applause]` markers that the caption system emits.

## 1. Speech rate (caption span ÷ words)

| Channel | wpm | Videos |
|---|---:|---|
| TheOdd1sOut | 240.4 | 1 |
| Economics Explained | 207.8 | 1 |
| How Money Works | 200.6 | 5 |
| The Paint Explainer | 194.0 | 1 |
| MagnatesMedia | 190.7 | 1 |
| Zenn | 187.5 | 1 |
| James Jani | 173.3 | 5 |
| The Swedish Investor | 159.5 | 5 |
| Beanie Survives | 157.8 | 1 |
| Kurzgesagt | 146.0 | 5 |

Caption span includes silences and music-only stretches, so every figure is a floor.
The ordering still matches the format: comedy is fastest, documentary and serial
fiction are slowest, explainers sit at 155–210.

## 2. Music markers

`[Music]` tokens in captions: James Jani 34 across five videos (5–10 each),
Kurzgesagt 5 (all in "The Egg"), How Money Works 4 (all in one video), every other
transcript 0. This is a caption artefact, not a mix report — it only proves that
music was present and loud enough for the recogniser to tag it in those videos. It
says nothing about level, cueing, or whether music runs under speech.

## 3. What the formats imply about narration

Inferred from speech rate, sentence length (`script-reverse-engineering.md`) and
observed script text:

- **Beanie Survives** is the only channel in the corpus written almost entirely in
  second person at 7-word average sentences and 158 wpm. That combination is what
  makes a 8-minute serial feel like instructions rather than a story.
- **Kurzgesagt at 146 wpm** with 194-word "sentences" (unpunctuated caption artefact)
  is slow, clause-heavy delivery with room around it. "The Egg" is 115 wpm — the
  slowest video in the corpus, and a deliberate register for a short story.
- **TheOdd1sOut at 240 wpm** with 12-word sentences is fast, short and rhythmic; the
  comedy depends on that rate.
- **Finance explainers cluster at 170–210 wpm.** Any script written far outside that
  band will sound wrong in this genre before a single frame is rendered.

## 4. Implications for this project's local narration

The repo renders narration through local VoiceStudio (VoxCPM2, default voice
"Jeremy") and measures real WAV length; `docs/narration.md` owns the pipeline. Given
the corpus:

1. **Target 165–190 wpm** for finance explanation — inside the observed band and
   slower than the fastest explainer.
2. **Keep one sentence per cue.** Beanie's 7.3-word average and Paint's 16.5 both fit
   comfortably in a single caption chunk; a 40-word cue cannot be re-timed without
   splitting.
3. **Write the pause, do not rely on the TTS to invent it.** The corpus's slower
   channels are slower because of written pauses at section boundaries, not because
   the voice is slow. A chapter label ("REASON #4", "SUPPLIES · DAY 30") needs a
   beat of silence before it.
4. **Do not add a music bed to compensate for a flat read.** No evidence in this
   corpus supports music as a retention device; the only measurable thing music does
   here is get tagged by the captioner.
5. **Never stretch speech to hit a runtime** (already a repo rule). The corpus's
   runtimes vary from 6:47 to 79 minutes for the same genre; runtime is not a format
   requirement.

## 5. Verification available later

When narration exists, the honest checks are: measured WAV duration vs script word
count (wpm), phrase cue alignment against the audio (`npm run narrate:timing`), and
a human listen. None of those were possible for the reference channels.
