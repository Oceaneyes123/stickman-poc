# Video 5 sound-effects plan

Plan for `WarAndWalletFullFilm`, the **7:22.233** Studio cut. The [storyboard](storyboard.md) describes the pictures. Times below are approximate navigation points. Place each effect on the visible action using the compiled shot or event frame and the indicated visual offset. Listening and phrase-boundary review are pending.

**Studio implementation.** The [cue schedule](../../src/scenes/warAndWalletSoundCues.ts) applies 91 clips using 18 local sounds, including nine new synthesized effects. Individual ticks, bid arrivals and the pump continuation account for the additional clips. The table retains the original placement and fallback notes. The cue schedule records the sounds, final offsets, initial gains and trims used in Studio. The [asset manifest](asset-manifest.json) identifies the actual WAVs and their hashes.

## Mix and asset choices

- **Main** cues form the first pass. **Extra** cues add texture where there is room under the finished narration. The picture gets the strongest accent when a price, route or decision changes. A long explanation can have several distinct sounds as its objects change.
- Reuse the same soft metallic bid cue for oil and wheat. Reuse the pump motor at the closing pump. Change the ending from a rising meter to a physical click and a receipt sound. Keep the checkout payoff dry and ordinary.
- **L**, **M** and **H** are initial Remotion linear gains of **0.06–0.10**, **0.11–0.17** and **0.18–0.24** respectively. These override the catalogue defaults. Audition with the actual narration and lower cues that obscure consonants or compete with a key line. Trim bright tails at the next action and fade long textures. Avoid stacking two foreground accents. Use a faint texture underneath a foreground cue only where they have distinct roles.
- Backticked cue IDs are original local synthesis from [the project catalogue](../../src/audio/README.md). **Custom** entries are proposed original foley or simple local synthesis. Their files, creator, hashes and rights records are pending. Use the listed local fallback if a custom cue is unavailable. Omit the row if the fallback makes the object sound implausible.
- Preserve the existing narration master. No music bed is assumed. The Ukraine homes and Somalia affordability lines have intentional space. Keep all effects locally sourced and verify their provenance in the episode manifest before release.

## B01 · 0:00–0:45 · The pump keeps running

| Approx. time | Shot and picture trigger | Sound | Mix |
| --- | --- | --- | --- |
| 0:00.00 | `pump` · Meter is already moving at frame 0 | Custom low pump motor with a short fade-in. Use `counter_roll` for the initial movement if the motor is pending. | Main L |
| 0:03.20 | `pump` · Coral overrun becomes obvious past the usual-spend line | One dry meter tick. Use a short slice of `counter_roll`. | Main M |
| 0:06.50 | `pump` · Narration draws attention to the partial gauge | Custom relay click, very short. The motor remains low underneath if used. | Extra L |
| 0:08.47 | `january` · First dated price appears | `bar_thump`, soft and short. | Main M |
| 0:15.70 | `june` · Higher rate becomes readable | `whoosh_rise`, trim to the reveal. | Main M |
| 0:20.00 | `commute` · Five workdays enter the frame | Three soft, irregular taps from `calculator_taps` as one texture. | Extra L |
| 0:21.10 | `commute` · Fuel takes up more of the paycheck strip | `swish`, then let the picture settle. | Main M |
| 0:26.30 | `invasion` · February 24 marker comes into view | Single muted `bar_thump` to locate the date. | Main L |
| 0:31.03 | `homes` · Cut to Ukraine’s homes | Leave the scene quiet through the human-stakes line. | Hold |
| 0:35.20 | `distance` · Dotted connection draws across the wide frame | Filtered `whoosh_short`, with little high end. | Extra L |
| 0:38.97 | `question` · Return to the pump | Brief pump-motor texture, then fade under the question’s opening words. Leave its final words dry. | Main L |

## B02 · 0:45–2:08 · Oil buyers compete

| Approx. time | Shot and picture trigger | Sound | Mix |
| --- | --- | --- | --- |
| 0:44.73 | `oil-market` · Barrel and 3% figure appear | Short `bar_thump` under the reveal. | Main M |
| 0:51.20 | `oil-market` · Buyers appear in succession | Two or three muted ticks aligned to the visible branch reveals. Use separate trimmed `counter_roll` slices. | Extra L |
| 0:58.00 | `oil-bidding` · Establish refineries and the two sellers | Custom hollow cargo tap, fallback `bar_thump`. | Extra L |
| 1:00.97 | `oil-bidding` · First supplier lane goes inactive | Custom gate latch, fallback quiet `stamp_thud`. | Main M |
| 1:09.65 | `oil-bidding` · Replacement tag slides along the new route | `swish` at travel start, soft `coin_clink` on the tag’s arrival as a separate beat. | Main L/M |
| 1:14.55 | `oil-bidding` · Incumbent’s tag meets the new bid | Same `coin_clink` as the first tag, quieter. | Main M |
| 1:21.45 | `oil-bidding` · Winning bid moves up | Short `whoosh_rise`, stop on the readable hold. | Main M |
| 1:25.10 | `expectations` · Cut to the schedule | Custom calendar leaf, fallback a brief `bill_flutter`. | Extra L |
| 1:29.25 | `expectations` · Bid appears while ship is still scheduled | One muted `coin_clink`. | Main M |
| 1:39.60 | `early-prices` · Oil-price track jumps | Short `whoosh_rise`. Leave the flat supply track quiet so the contrast reads. | Main M |
| 1:43.63 | `refining` · Crude barrel replaces the chart | Dull `bar_thump`. | Extra L |
| 1:48.60 | `refining` · Pump and delivery tag come in | Muted `stamp_thud` as the next delivery reaches the station. | Main M |
| 1:52.85 | `refining` · Car queue builds | Custom short tire-roll texture for the arrivals, fallback a single `swish`. | Extra L |
| 2:03.45 | `refining` · Gasoline stock marker settles low | Dry mechanical tick or shortened `bar_thump`. | Main L |

## B03 · 2:08–3:20 · Fuel, freight and wheat

| Approx. time | Shot and picture trigger | Sound | Mix |
| --- | --- | --- | --- |
| 2:08.05 | `freight` · Station branch appears before the truck | Brief pump-motor callback, faded before the truck entrance. | Extra L |
| 2:10.90 | `freight` · Diesel truck enters | Custom low tire/engine roll, fallback a short `swish`. | Main L |
| 2:14.85 | `freight` · Cost reaches the bakery | Custom soft sack set-down, fallback `bar_thump`. | Main M |
| 2:18.40 | `freight` · Loaf moves onto the shelf | Custom soft shelf contact, fallback `bar_thump` with a shorter tail. | Main M |
| 2:19.35 | `freight` · Last cost tag and shelf price settle | Short `coin_clink` as the sum reaches the tag. Hold the chain quiet after it lands. | Main M |
| 2:25.00 | `ports` · Cut from loaf to stored grain | Custom grain-sack rustle, fallback quiet `bill_flutter`. | Main L |
| 2:30.00 | `ports` · Export-share figure appears | Soft `bar_thump` with minimal tail. | Extra L |
| 2:35.67 | `ports` · Black Sea lane closes | Reuse the oil supplier latch, with a slightly deeper contact. | Main M |
| 2:44.55 | `ports` · Rail and Danube routes trace outward | Quiet wheel rhythm or one `swish` across both reveals. | Main L |
| 2:54.00 | `wheat-bidding` · Cut to mills and grain | Same soft sack rustle as before the port closure. | Extra L |
| 3:01.00 | `wheat-bidding` · Replacement tags converge | Same `coin_clink` as oil. Add up to two soft repeats on the next visible tag landings. | Main M, repeats L |
| 3:05.90 | `wheat-bidding` · Incumbent’s offer steps up | Reuse the short upward sweep from oil. | Main M |
| 3:10.75 | `march-wheat` · March rise appears | `bar_thump` on the evidence comparison. | Main M |
| 3:16.05 | `march-wheat` · Crop-pressure icon appears | Short, dry tick. | Extra L |

## B04 · 3:20–4:25 · Wheat down, bread up

| Approx. time | Shot and picture trigger | Sound | Mix |
| --- | --- | --- | --- |
| 3:19.90 | `razoni` · Ship starts leaving Odesa | Custom low water wash or hull texture for roughly one second. Fallback short filtered `whoosh_short`. | Main L |
| 3:25.53 | `razoni` · Cut to timeline and July 22 deal | Custom paper set-down, fallback short `bill_flutter`. | Main M |
| 3:33.45 | `razoni` · World wheat arrow falls inside July | Custom filtered downward sweep, fallback reversed and trimmed `whoosh_rise` derivative. | Main M |
| 3:37.55 | `razoni` · Harvest icon enters | Dry grain rustle, with no long tail. | Extra L |
| 3:43.33 | `razoni` · July link becomes stronger before the August departure | Soft click under the highlighted link. | Extra L |
| 3:49.10 | `july-comparison` · Bread’s upward arrow becomes visible | Short `whoosh_rise`, distinct from wheat’s downward sweep. | Main M |
| 3:54.63 | `old-flour-order` · Earlier order slip appears | Custom paper slide, fallback cropped `bill_flutter`. | Main M |
| 3:59.15 | `old-flour-order` · Lock settles on the agreed charge | Custom small latch, drier and lighter than the port latch. | Main M |
| 4:04.85 | `old-flour-order` · Oven appears | Custom muffled oven switch. | Extra L |
| 4:07.70 | `next-flour-order` · Cheaper flour reveals some savings | Soft `swish`, aligned to the yellow bar growing. | Main M |
| 4:11.10 | `next-flour-order` · Freight takes part of that saving | Tight `bar_thump` as the coral section covers the bar. | Main M |
| 4:18.45 | `next-flour-order` · Shelf price and loaf come into view | Reuse the soft shelf contact. | Main L |

## B05 · 4:25–5:23 · Who can absorb it

| Approx. time | Shot and picture trigger | Sound | Mix |
| --- | --- | --- | --- |
| 4:25.00 | `shift` · Shift and bus slips appear | One small paper tap. | Extra L |
| 4:31.25 | `shift` · Smaller fill gauge settles | A brief pump-meter tick. | Main M |
| 4:33.45 | `shift` · The next fuel stop moves closer | Two subdued `clock_tick` transients. | Extra L |
| 4:36.00 | `shift` · Fuel receipt replaces the schedule | Short paper flick. | Main L |
| 4:43.05 | `shift` · Shoe moves to next month | Custom soft shoe slide and contact, fallback short `swish`. | Main M |
| 4:46.00 | `somalia` · Transition to drought context | Leave the cut and opening drought line dry. | Hold |
| 4:53.85 | `somalia` · Imported grain route arrives | Brief muted water texture, reusing the ship family. | Main L |
| 5:07.95 | `somalia` · Staple cost exceeds household budget | Let the line land without an impact. | Hold |
| 5:14.55 | `import-gap` · Imported grain fills the local shortfall | Soft grain-sack settle. | Main L |
| 5:18.00 | `import-gap` · Import cost tag rises | Short filtered upward texture. Keep the last line clear. | Extra L |

## B06 · 5:23–6:42 · Rates and loan terms

| Approx. time | Shot and picture trigger | Sound | Mix |
| --- | --- | --- | --- |
| 5:22.57 | `interest-statement` · Card statement appears | Custom receipt slide, fallback cropped `bill_flutter`. | Main L |
| 5:27.20 | `interest-statement` · Interest line lengthens with no new purchase | One subdued `calculator_taps` transient on the change. | Main M |
| 5:33.60 | `interest-statement` · Fuel receipt slides alongside | Short soft paper movement. | Extra L |
| 5:37.75 | `interest-statement` · Statement date is highlighted | Single dry tick. | Main L |
| 5:39.47 | `fed-calendar` · January CPI figure appears | Small `bar_thump` on the date change. | Main M |
| 5:47.30 | `fed-calendar` · Jan 26 Fed marker becomes readable | One soft timeline tick. | Main L |
| 5:51.65 | `fed-calendar` · March hike arrow lands | Brief upward sweep on the March arrow. Let February’s invasion marker stay dry. | Main M |
| 6:00.55 | `fed-calendar` · Existing and added pressures separate | Quiet short `swish` under the two lines. | Extra L |
| 6:07.25 | `car-demand` · Financing tag rises | Faint `coin_clink` on the tag. | Main M |
| 6:13.30 | `car-demand` · Car moves from now to later | Custom tire movement, fallback `swish`. End it when the car parks. | Main M |
| 6:16.80 | `car-demand` · Fewer buyers remain | One short tick as the dots appear. | Extra L |
| 6:19.30 | `rates-and-port` · Rate gauge rises beside the closed port | Quiet upward mechanical movement. Keep the port side still and dry. | Main L |
| 6:24.13 | `loan-contracts` · Mortgage and card pages appear | Soft page settle. | Extra L |
| 6:28.25 | `loan-contracts` · Principal-and-interest lock appears | Reuse the bakery lock click. | Main M |
| 6:33.30 | `loan-contracts` · Card benchmark and interest step up | Tight rising sweep. Keep space for the words “carried over.” | Main M |

## B07 · 6:42–7:22 · Back to the pump

| Approx. time | Shot and picture trigger | Sound | Mix |
| --- | --- | --- | --- |
| 6:41.60 | `year-end` · $3.09/gal appears beside January | Soft downward texture, matching the wheat price direction cue. | Main M |
| 6:50.30 | `year-end` · Output and demand icons appear | Two restrained, closely spaced diagram taps as a single sound. | Extra L |
| 6:55.75 | `year-end` · Grocery comparison enters | Soft shelf contact to recall the loaf. | Main M |
| 7:00.70 | `different-deliveries` · Station price tag falls | Quiet short downward sweep. | Main L |
| 7:06.35 | `different-deliveries` · Flour’s tag falls | Dry tag movement, quieter than the station cue. | Extra L |
| 7:10.25 | `different-deliveries` · Bread-delivery charge stays in place | Muted `bar_thump` on the remaining freight charge. | Main M |
| 7:13.97 | `pump-callback` · Opening framing returns | Return the opening pump motor at the same texture and quieter gain. | Main L |
| 7:14.87 | `pump-callback` · Total stops below the budget line | Custom nozzle shut-off click. Cut the motor on this frame. | Main H |
| 7:18.40 | `grocery-callback` · Receipts appear beside the bag | Soft paper contact from the fuel-receipt family. | Main L |
| 7:19.55 | `grocery-callback` · Savings begin moving from the bar to the receipt | Short, soft `swish` along the transfer. | Main L |
| 7:20.73 | `grocery-callback` · Savings are gone and the receipt is marked | Brief bag set-down or low receipt stamp. Keep the last words and final hold clear. | Main H |

## First listening pass

1. Audition the main cues against the complete narration. Check the first pump click, the oil-to-wheat match, the freight handoffs, the July timeline and both final receipt states against picture.
2. Add the extras where timing and voice clarity hold up. The densest candidates to simplify are the wheat bids, the flour-order section and the closing receipts. Keep the cues that make the change easiest to hear.
3. Listen through headphones and a phone speaker. Compare the narration against the same passage with effects muted. Adjust levels and trim or remove cues that mask words, produce repetitive transients, or overstate a serious moment.
4. Confirm the cue anchors, asset versions, gains and trims after listening. The cut uses the existing [Remotion SFX playback layer](../../src/audio/sfx.tsx). Checks cover local file availability, cue bounds, quiet holds and sample clipping.
