# The Money Trap â€” Remotion POC

Character update: a separate reference-led SVG rig and `CharacterStudy` preview are available. See [character instructions](src/characters/README.md) and run `npm run characters:stills` for PNG previews. The existing film, rig imports and typography are unchanged.

A reusable local SVG character and financial storytelling system. The seven-beat film explains why a fictional $600 take-home raise leaves Sam with $380 instead of $400, while Alex has $800 remaining.

**Current mode: silent timing demo, 78 seconds.** No VoiceStudio WAV was supplied. Estimated cues are labeled in both JSON and video. Audio synchronization and human creative acceptance are unverified.

## Run

Node 24.6+ (native TypeScript stripping), npm, Git, and local FFmpeg/ffprobe on PATH. Run commands inside this `money-trap/` folder:

```powershell
npm ci
npm run dev
npm run check
npm run render:dev
npm run stills
npm run render
npm run render:gallery
```

Studio opens `MoneyTrapPOC` and `ComponentGallery`. The running session uses http://localhost:3100. Run `npm run dev -- --port=3100` to request that port later. `npm run build` produces a Remotion bundle. Rendering uses bundled Chromium, downloading it once if needed. Subsequent renders use local assets and local execution; no paid services or cloud API calls. `scripts/assets.mjs` downloads Inter and its OFL license for initial asset setup only; both files are already bundled.

Full render: `out/money-trap-poc-silent-timing.mp4` while WAV is absent; `out/money-trap-poc.mp4` when aligned WAV exists. Dev render is 960Ã—540, CRF 26; delivery is 1920Ã—1080, 30 fps, H.264/yuv420p, CRF 18. Both render every timeline frame. `ComponentGallery` lasts 37 seconds with named pages in Studio.

## Reusable code

| Path                             | Responsibility                                                                    |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `src/characters/StickmanRig.tsx` | Articulated Sam/Alex, identity, 8 poses, 7 expressions, 7 gestures, pose blending |
| `src/characters/kinematics.ts`   | Pure fixed-length two-bone IK and planted-foot walk cycle                         |
| `src/finance/math.ts`            | One example dataset, totals, formatting and illustrative compounding              |
| `src/finance/components.tsx`     | MoneyStack, Wallet, Expense, Bill, DebtMeter, BarChart, MoneyFlow, MoneyCounter   |
| `src/animation/motion.tsx`       | TextReveal, EnterExit, Camera2D, SceneTransition, easing and spring helper        |
| `src/scenes/templates.tsx`       | StoryScene, ComparisonScene, DiagramScene, office/apartment/street environments   |
| `src/timeline/`                  | Cue/event types, validation and deterministic compiler; generated manifest        |
| `src/POC.tsx`                    | Seven-beat assembly and single global audio node                                  |
| `videos/001-lifestyle-creep/`    | Spoken master, annotated script, editable cues and storyboard                     |

```tsx
<Sam expression="worried" pose="slumped" gesture="holdWallet" x={600} y={740} scale={1.2} />
<Alex pose="celebrating" fromPose="standing" expression="happy" actionFrom={revealFrame} />
```

Rig components render SVG `<g>` elements: place inside an SVG viewport. `x/y` anchor the floor. `actionFrom` and `blendFrames` use local Sequence frames; no narration timestamps belong in the rig. Walking travels in world space at a declared stride speed; allow horizontal room. Pose presets keep lengths fixed. Use `fromPose` to blend between states; a scene cut may establish a new shot. The stylized feet always remain on the floor for standing/slumped/celebration, while walk stance feet stay planted.

Change amounts in `example` and every displayed budget result derives from it. Composition input props support another `BudgetExample`. The POC uses three upgrades (rent/car/subscriptions). Change characters, environment, title and scene timing in the storyboard; scene templates also support direct reuse in another film. POC-specific beat ordering and event IDs are deliberately explicit; a different story needs its own assembly, not a new rig or scene implementation. Update narration/cue text when changing narrated amounts.

Money stacks are symbolic bill stacks with height on a shared $0â€“$1,000 scale; they do not depict a literal number of bills. Bars use a zero baseline. DebtMeter is a separate no-payment monthly-compounding illustration, not part of Sam's story. Bill payment is an illustrative visual state, not a payment API.

## Add VoiceStudio narration and align manually

1. Generate `narration.txt` in local VoiceStudio, listen to it, then save `public/audio/poc.wav`. No VoiceStudio job was started for this silent demo.
2. Use a local audio editor/player to record actual phrase `startMs/endMs` in `cues.json`, preserving cue IDs. Set `mode` to `aligned`. Timestamp accuracy must come from listening, not this demo's estimates.
3. Compute SHA-256 with `Get-FileHash public/audio/poc.wav -Algorithm SHA256` and `Get-FileHash videos/001-lifestyle-creep/narration.txt -Algorithm SHA256`; put lowercase hashes in `audioHash` and `scriptHash`. Cue text must match the entire spoken master, in order.
4. Retime scene anchors/events in `storyboard.json` as needed. Every nonzero offset requires a reason. Add/shorten events when a recorded phrase is shorter than the demo. `npm run timing` runs ffprobe and rejects stale hashes, missing cues, overlaps, invalid durations and out-of-bounds events.
5. Run `npm run check`, inspect Studio, render, then **listen to the exported video** and judge reveal timing against speech (~200ms target). Record listening approval separately. Passing the compiler does not certify synchronization.

One global `<Audio>` begins at frame zero. All visual Sequences use the compiled timeline. Endpoints use `Math.round(ms * fps / 1000)`; frame durations subtract rounded endpoints. The final scene holds until the rounded measured WAV duration plus `tailMs`. Demo duration is 78,000ms; tail is 0ms. There is no per-scene audio trimming, speech stretching or assumed TTS runtime.

Run `npm run timing` after every script, WAV, cue or storyboard edit, including while Studio is open. Render commands run preparation automatically. `src/timeline/generated.json` is generated; do not edit it. Changed WAVs are rejected until cue hashes are reviewed. This explicit command avoids silently certifying fresh audio during hot reload.

## QA and longer videos

`npm run check` validates timing, lint, strict TypeScript and focused runnable tests. `npm run stills` creates key/boundary previews and gallery pages. `python scripts/qa.py` verifies the encoded MP4 metadata, fully decodes every frame and produces contact sheets and machine-readable evidence. See `out/qa-report.md` for actual results and human-review limits.

For 10â€“15-minute episodes, reuse templates with one storyboard per episode and phrase-level cues. Keep character actions finite, hold readable numbers and cut between causal beats. Review an inexpensive dev render first, then approve narration and visuals before delivery rendering. Use selective stills after revisions; cache approved assets. Render whole episodes locally or split at clean scene boundaries with identical global timing if memory requires it. Do not add forced alignment or a production platform until manual timing becomes the measured bottleneck. Twice-weekly throughput has not been benchmarked.

See `SOURCES.md` for exact upstream revisions, licenses and reuse. Original project code remains private (`UNLICENSED`); that does not change bundled third-party licenses. Confirm Remotion's team-size license terms before commercial deployment.


## Ten-second bank example

`BankExample` uses the current hairless Sam/Alex SVG rigs in a separate silent scene. The original POC stays unchanged.

- 0–3 seconds: Sam walks toward the bank; Alex waits inside.
- 3–5 seconds: Sam grabs and opens the door with his free hand.
- 5–10 seconds: Sam approaches Alex, offers the cash, releases it, and Alex draws it back.

Run `npm run bank:stills` for keyframes or `npm run render:bank` for `out/bank-example.mp4` (1920×1080, 30 fps, exactly 300 frames). Select `BankExample` in Studio to scrub it. `src/scenes/bankModel.ts` owns frame-based choreography, planted-foot motion and grip targets; `BankExample.tsx` draws the original vector environment. Door contact and cash ownership are tested. Review evidence is saved under `out/bank-example/`.
