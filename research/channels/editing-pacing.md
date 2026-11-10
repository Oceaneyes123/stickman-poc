# Editing, pacing and rhythm

Two things were actually measured: **detected visual changes per video** (ffmpeg
scene detection on the 480p downloads in `../evidence/frames/`) and **speech
rate from timed captions**. Everything else here is inference and is labelled as
such.

## 1. Method and its error bars

```
ffmpeg -i <file>.mp4 -filter:v "select='gt(scene,T)',showinfo" -an -f null -
```

Scene detection compares consecutive frames and reports a score; a cut, a hard
flash, a scene change or a large moving object all score. It is therefore an
*upper bound on visual change*, not a cut counter, and it is sensitive to the
threshold and to how much of the frame moves.

Threshold sensitivity, same three files, three thresholds:

| Threshold | Paint Explainer | Beanie Survives | Alan Becker |
|---|---:|---:|---:|
| 0.10 | 139 | 121 | 48 |
| 0.20 | 90 | 118 | 18 |
| 0.30 | 70 | 117 | 8 |
| 0.35 | 62 | 114 | 5 |

The Paint Explainer number doubles between 0.35 and 0.10 because its cuts are
white-background diagrams — low pixel delta. Alan Becker collapses the other way
because its cuts happen inside a continuous textured cave, where a character moving
is most of the pixel change. **Cross-channel comparison of these counts is
therefore unsafe.** What is safe is the per-channel band.

## 2. Detected visual changes, at threshold 0.35

| Channel | Video | Length | Detected | Per minute | Mean gap |
|---|---|---:|---:|---:|---:|
| James Jani | The Untold Truth About Money | 17:26 | 283 | 16.2 | 3.7 s |
| Beanie Survives | Zombie Outbreak Day 1–30 | 8:12 | 114 | 13.9 | 4.3 s |
| TheOdd1sOut | Annoying Customers | 6:47 | 90 | 13.3 | 4.5 s |
| How Money Works | If Nobody Can Afford A Home | 11:35 | 144 | 12.4 | 4.8 s |
| The Paint Explainer | What Dying on Every Planet… | 8:15 | 62 | 7.5 | 8.0 s |
| Alan Becker | Cave Spider Roller Coaster | 7:35 | 5 | 0.7 | 91 s |

The Alan Becker row is an artefact of the method (see above), not evidence that the
episode holds one shot for 91 seconds. Its threshold-0.10 count of 48 gives
6.3/min, still the lowest in the set — consistent with long continuous action
sequences, which is what the stills show.

**Band for narrated explainers: 7.5–16 detected changes per minute, mean gap 3.7–8.0 s.**
The Paint Explainer is the slowest and the calmest of the four; James Jani the
fastest, and it is the one with live-action b-roll, which scores high on any frame
difference metric.

## 3. Speech rate (measured from captions)

| Channel | wpm range across corpus | Note |
|---|---|---|
| TheOdd1sOut | 240 | comedy; fastest in the corpus |
| Economics Explained | 208 | |
| How Money Works | 197–203 | very tight band, five videos |
| The Paint Explainer | 194 | |
| MagnatesMedia | 191 | |
| Zenn | 188 | |
| James Jani | 170–179 | |
| Beanie Survives | 158 | deliberate, serialised |
| The Swedish Investor | 135–193 | widest spread; the 135 video is the outlier |
| Kurzgesagt | 115–162 | slowest; "The Egg" is 115 wpm |

Caption-span wpm includes music-only gaps and silences, so these are floors, not
delivery rates. Still, the ordering matches the listening impression: Kurzgesagt
leaves room, Odd1sOut does not.

**Actionable band for this project:** 150–200 wpm sits inside the corpus for every
finance channel. The repo's existing narration pipeline measures real WAV length, so
this band is a target for the script, not a constraint on the render.

## 4. What the pacing actually is, structurally

Inferred from the stills and transcripts together:

- **Every video alternates two speeds.** James Jani: long live-action or talking-head
  stretches, then dense graphic runs. How Money Works: 20–40 s of b-roll, then a
  single graphic or meme beat, then a chart. The average hides an oscillation.
- **Slow scenes stay engaging when something is being counted, compared or
  revealed.** Beanie's inventory cards are static frames with numbers that changed
  since the last card — the change is the event, not the motion.
- **Fast cuts feel exhausting when the information rate does not rise with them.**
  No channel in the corpus cuts fast through an unchanged idea; the fast stretches
  are always a list, a montage of consequences, or a chase.
- **The Paint Explainer holds a planet for roughly 60–90 s** and changes only the
  diagram within it — one label, one arrow, one new object. That is the cheapest
  sustainable rhythm in the corpus and the closest to this project's scene model.

## 5. Implication for this repo

`videos/001-lifestyle-creep` currently carries 67 scenes / 99 panels. At a 13-minute
target that is ~5.1 scenes per minute, below the 7.5–16 band — but a scene in this
repo can hold several beats, so the comparison is only valid against *detected
changes*, not scenes. The honest test is to run the same ffmpeg scene detection on a
rendered episode and compare the band, not to add cuts until the number matches.

Concrete rule worth adopting: **no idea changes without either a new visual object or
a changed number.** That is what all five narrated channels do, and it costs nothing
to enforce in a storyboard review.
