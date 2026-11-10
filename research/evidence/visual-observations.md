# Visual observations — sampled stills

Evidence file for the `research/channels/` documents. Everything below was read off
the contact sheets in `../evidence/frames/`, produced by
`scripts/research/sample_frames.py` (480p stream, one JPEG per timestamp, tiled with
the timestamp burned in). Raw sheets are linked per row.

**What this file can and cannot support**

- It supports claims about composition, staging, palette, character construction,
  on-screen text, and what kind of visual device carries a beat.
- It does **not** support claims about motion timing, easing, cut rate, or
  animation smoothness. A contact sheet samples single frames; two adjacent frames
  several seconds apart say nothing about interpolation, hold length, or cut points.
  Any document that needs those numbers must say they were not measured.
- 480p stills hide line weight and small text. Unreadable labels are reported as
  unreadable rather than guessed.
- Sampling is one video per channel for six channels. It is not a channel-wide
  style survey.

## Coverage

| Channel | Video | Sampled | Sheet |
|---|---|---|---|
| Kurzgesagt | The Egg – A Short Story (`h6fcK_fRYaI`) | 3, 12, 25, 40, 60, 80 s | `frames/h6fcK_fRYaI_sheet.jpg` |
| How Money Works | If Nobody Can Afford A Home… (`1zjcZ661ups`) | 4, 20, 45, 75, 150, 300, 480, 660 s | `frames/1zjcZ661ups_sheet.jpg` |
| James Jani | The Untold Truth About Money (`6mRbDEtDoyA`) | 5, 25, 60, 120, 300, 600, 900, 1020 s | `frames/6mRbDEtDoyA_sheet.jpg` |
| The Paint Explainer | What Dying on Every Planet Would Be Like (`n9HAAFBT3AA`) | 5, 20, 50, 90, 150, 260, 380, 470 s | `frames/n9HAAFBT3AA_sheet.jpg` |
| Beanie Survives | Zombie Outbreak: 30 Days On The 30th Floor (`1AF04-V4Yao`) | 5, 20, 45, 80, 140, 250, 350, 480 s | `frames/1AF04-V4Yao_sheet.jpg` |
| Alan Becker | Cave Spider Roller Coaster (`pCBP4M08ndE`) | 5, 25, 60, 100, 180, 280, 360, 445 s | `frames/pCBP4M08ndE_sheet.jpg` |
| TheOdd1sOut | Annoying Customers (`2yFCyPX3kT0`) | 4, 15, 40, 70, 140, 240, 330, 395 s | `frames/2yFCyPX3kT0_sheet.jpg` (frames not yet read — see limits) |

## Kurzgesagt — The Egg (`h6fcK_fRYaI`)

Observed:

- 3 s: very wide night landscape, layered mountain silhouettes, large empty sky. No character. The frame is a establishing shot built from 3–4 flat silhouette layers.
- 12 s: wide roadside/truck-stop scene at night; a red-lit doorway with a standing silhouette left of centre, a green truck right of centre, cones and small figures. Background density rises sharply versus 3 s.
- 25 s: extreme close-up of two eyes filling the frame on flat magenta. Background complexity collapses to near zero.
- 40 s: medium shot of a rounded purple humanoid right of centre, orange-yellow rim light on its silhouette, abstract coloured bubble clusters in the lower-left foreground.
- 60 s: wide shot, tiny teal humanoid left of centre on a white field, a pale blue cloud-creature with dot eyes floating right. Negative space dominates.
- 80 s: wide shot with a giant cropped purple face filling the upper-right and a small seated figure lower-left. Scale contrast is the subject of the frame.

Inferred (not measured): the sequence is built on deliberate tonal inversions (dark→white→black) and scale inversions (tiny subject→subject filling frame). Cut points were not measured.

## How Money Works — If Nobody Can Afford A Home (`1zjcZ661ups`)

Observed — the visual language is **not** animation-first:

- 4 s: live-action interior b-roll with a white headline card over it quoting a Fortune article about housing inventory.
- 20 s: live-action presenter b-roll in a grocery store, AJ+ watermark lower-left.
- 45 s: a Wojak meme character on a flat green grid, text printed on its hoodie.
- 75 s: staged live-action scene (man with empty pockets, woman, baby) with two large yellow buttons labelled RIGHT (green) and WRONG (red) plus a FOR SALE sign.
- 150 s: full-frame 3D-looking balance scale on dark navy — a small man on one pan, a house on the other. Pure visual metaphor, no characters from the story.
- 300 s: a Trading Economics chart screenshot (US existing home sales, cyan bars) filling the frame.
- 480 s: live-action expert interview with a CBC lower-third naming the professor and location.
- 660 s: full-frame typography card, "REASON #4" and a capitalised claim, over a blurred dark plate.

Inferred: this channel buys credibility with borrowed evidence (news cards, real charts, expert clips) and buys retention with staged metaphor and memes. A code-driven animation pipeline cannot reproduce the news/interview assets; only the metaphor, chart and typography devices transfer.

## James Jani — The Untold Truth About Money (`6mRbDEtDoyA`)

Observed:

- 5 s: a single small grey dot centred on a flat mustard-yellow field. No other element.
- 25 s: a grid of roughly 120 black dots on the same yellow field — the dot becomes a unit of population.
- 60 s: live-action office dramatisation (two men, desk, window).
- 120 s: live-action close-up of a hand writing an equation in chalk.
- 300 s: full-frame typography on the same yellow: "MONEY = SALARY FROM A JOB".
- 600 s and 900 s: effectively black frames at these timestamps.
- 1020 s: creator on camera, medium close-up, holding a microphone.

Inferred: one repeated background colour (yellow) and one repeated unit shape (the dot) act as the video's visual signature across otherwise unrelated scenes. The dot-to-grid move at 5 s → 25 s is a scale explanation with no words needed.

## The Paint Explainer — What Dying on Every Planet Would Be Like (`n9HAAFBT3AA`)

Observed — this is the closest published grammar to a stickman explainer:

- Every sampled frame has a centred uppercase planet name at the top ("MERCURY", "VENUS", "JUPITER", "SATURN", "NEPTUNE"). The title is a persistent section label, not a sentence.
- Backgrounds are flat white. Ground planes are flat colour. No stars, no gradients except one blue vertical gradient at 260 s.
- Objects are black-outlined, flat-filled vector: Sun, planets, lander, thermometer, Earth as a size reference.
- Red is reserved for force/danger: red arrows labelled "pressure" (20 s, 150 s, 470 s), a red thermometer, red dashed measurement lines ("center" at 380 s, Venus–Earth distance at 90 s).
- Text is used as measurement annotation, not narration: "about 92 bar", "1 bar", "deepest point", "atmosphere".
- 5 s: a tiny black stick figure engulfed in flames beside a huge Sun — the viewer stand-in at the smallest possible scale.
- 150 s: a cartoon astronaut, helmet about one third of total height, dot eyes, open oval mouth, standing frontally on flat ground with red pressure arrows above.

Inferred: the recurring device is **"one measurement, one arrow, one stand-in figure"** per beat. The figure exists to be subjected to the environment, not to act.

## Beanie Survives — Zombie Outbreak Day 1–30 (`1AF04-V4Yao`)

Observed:

- Character: round white head with black outline, two dot eyes, tiny mouth, thin black stick body, yellow knit beanie. No hands beyond line ends.
- 5 s: wide establishing interior, character small against floor-to-ceiling windows and a city skyline, warm lamp against blue night.
- 20 s: circular fisheye/peephole framing, corridor behind, bandaged forearm visible — a close, distorted, claustrophobic shot.
- 45 s: full-screen inventory card on cream: "WATER", "Stored 45 gal", a row of nine blue jug icons, "1 jug = 5 gallons = 5 days".
- 80 s: the same living room as 5 s, relit cold/grey with a candle — same set, different time of day.
- 140 s: "SUPPLIES · DAY 9" card; water 35 gal with some jug icons faded; "Food, rationed 16 days"; "+3 gallons of rain".
- 250 s: kitchen, full-body character, cool blue-grey cabinets.
- 350 s: same kitchen, tighter, darker, candlelit.
- 480 s: "SUPPLIES · DAY 30" card; water 5,000 gal in the same nine-jug row; "Food, half rations 2 days" with most can icons faded; "A city of them below."

Inferred: the show's spine is a **repeated set plus a depleting icon row plus a day counter**. The 5,000-gal figure reuses the same nine-jug row, so the icons are symbolic, not proportional — an internal inconsistency worth not copying.

## Alan Becker — Cave Spider Roller Coaster (`pCBP4M08ndE`)

Observed:

- Characters: hollow circular heads, no faces, single-line limbs, thick coloured outlines, identity by colour only (orange, green, yellow, blue, red). No clothing, no hands.
- Environment: blocky, pixel-textured Minecraft cave — stone, cobblestone, cobwebs, planks, ladders, rails on wooden supports. Flat vector characters against textured blocks is the whole style.
- 5 s: wide, five figures walking in a line, legs split mid-stride, orange holding a map.
- 25 s: wide, group at a ledge — height reveal.
- 60 s: very wide multi-level mineshaft with a diagonal swarm of cave spiders.
- 100 s: diagonal rail filling the frame, dark shape and particles implying speed.
- 180 s: close group shot, heads and limbs overlapping, arms raised — reaction frame.
- 280 s: medium-wide action along the track with spiders.
- 360 s: wide side-view chase line.
- 445 s: credits over the dimmed cave.

Inferred: depth comes from layered side-view planes (foreground particles/cobwebs, midground rails, background walls) rather than a moving 3D camera. Speed is carried by diagonal track geometry, not by motion blur in these stills.

## Limits to repeat

- No cut-rate, shot-length, easing or hold-length numbers were measured for any channel.
- TheOdd1sOut frames were sampled but not yet read; treat that channel's visual claims as unsupported until they are.
- Audio was not analysed; narration timing below is caption-derived only.
