# Sound effects

Thirty reusable cues, every one synthesised from scratch in `scripts/sfx/generate-sfx.ts`
(oscillators, seeded noise, filters, envelopes). No samples, no stock library, no
licence to track, no network call: `npm run sfx` rebuilds `public/sfx/*.wav`
byte-identically. Peak-normalised to -3 dBFS, mono 44.1 kHz 16-bit.

## Use it

```tsx
import { Sfx, SfxTrack, sfxEvery } from "../audio/sfx";

// one cue on the frame of the visual event
<Sequence from={120}>
  <Sfx name="cash_register" />
</Sequence>

// a beat sheet: [frame, cue, volume?]
<SfxTrack cues={[[0, "whoosh_short"], [12, "bar_thump", 0.5], [80, "ding"]]} />

// a counter ticking up while a number rolls
<SfxTrack cues={[...sfxEvery(30, 12, 4, "counter_roll", 0.45), [78, "sparkle_chime"]]} />
```

`Sfx` props: `name`, `from` (frame, default 0), `volume` (default from the
catalogue), `durationInFrames` (cut the tail when the next beat needs the space).
Cues are placed on picture frames, never on narration timestamps — compile the
timeline first, then cue against event frames.

## Catalogue

Length is the exact WAV length; level is the default mix level (`Sfx` applies it
unless overridden). `SfxGallery` in the Studio auditions all thirty in order.

### Money and finance

| Cue | Length | Level | Use |
| --- | --- | --- | --- |
| `coin_clink` | 0.45s | 0.85 | Single coin landing or tapped: small gains |
| `coin_shower` | 1.80s | 0.80 | Coins pouring: big wins and windfalls |
| `cash_register` | 1.10s | 0.90 | Ka-ching: profit or sale confirmed |
| `bill_flutter` | 0.80s | 0.70 | Paper money fanned or counted |
| `printer_whir` | 2.00s | 0.60 | Money printer: inflation, central banks |
| `wallet_zip` | 0.50s | 0.75 | Wallet or coin purse zipped shut |
| `stamp_thud` | 0.40s | 0.85 | Approved, denied or debt stamped |
| `calculator_taps` | 0.90s | 0.70 | Quick number crunching |

### Charts and data

| Cue | Length | Level | Use |
| --- | --- | --- | --- |
| `whoosh_rise` | 0.80s | 0.65 | Upward sweep under a line going up |
| `slide_whistle_down` | 1.00s | 0.70 | Falling sweep: crash, drop, bad trade |
| `counter_roll` | 0.80s | 0.60 | Rapid ticking as a number counts up |
| `bar_thump` | 0.30s | 0.60 | Soft thud as a chart bar lands |
| `marker_squeak` | 0.60s | 0.55 | Marker drawing lines and arrows |
| `ding` | 1.20s | 0.75 | Notification chime on a key stat |

### Character and comedy

| Cue | Length | Level | Use |
| --- | --- | --- | --- |
| `boing` | 0.70s | 0.75 | Bouncy hops and spring reactions |
| `pop` | 0.25s | 0.80 | Objects or text appearing |
| `squash_thud` | 0.40s | 0.80 | Stickman flattened or landing hard |
| `slide_whistle_up` | 0.90s | 0.70 | Cartoon surprise: whistle rising |
| `gulp` | 0.60s | 0.70 | Nervous swallow before a risk |
| `sad_trombone` | 2.00s | 0.70 | Wah-wah: failure or a loss punchline |
| `record_scratch` | 1.00s | 0.80 | Freeze-frame: wait, what? |
| `facepalm_slap` | 0.30s | 0.85 | Quick skin slap for a mistake |

### Transitions and emphasis

| Cue | Length | Level | Use |
| --- | --- | --- | --- |
| `whoosh_short` | 0.40s | 0.70 | Standard scene cut or object slide |
| `whoosh_long` | 1.40s | 0.70 | Bigger transitions, camera moves |
| `swish` | 0.30s | 0.65 | Quick wipe or text slide |
| `impact_boom` | 1.60s | 0.90 | Heavy emphasis on a hook or number |
| `riser` | 1.60s | 0.70 | Tension rising before a reveal |
| `glitch_zap` | 0.60s | 0.70 | Chaos, scams, hacked accounts |

### Ambience and ending

| Cue | Length | Level | Use |
| --- | --- | --- | --- |
| `clock_tick` | 6.00s | 0.35 | Soft ticking clock: pressure, deadlines |
| `sparkle_chime` | 1.50s | 0.80 | Bright resolve at the end of a win |

## Rules this keeps

- One global `Audio` node per film still holds; these are cues under it, not a second mix.
  Narration stays dry and on top — duck or lower a cue's `volume` when it collides with a voice.
- Nothing here is timed to narration. Frames only.
- Every cue is original synthesis, so there is no attribution file and no licence risk.
  Do not replace one with a downloaded recording of unknown provenance.

## Adding a cue

1. Add the entry to `SFX_CUES` in `cues.ts` (category, exact `seconds`, `volume`, `use`).
2. Add a recipe to `RECIPES` in `scripts/sfx/generate-sfx.ts` — a missing recipe is a
   type error, so the catalogue cannot drift from the renderer.
3. `npm run sfx`, then `npm test` (files, lengths, peak/RMS, no strays).
