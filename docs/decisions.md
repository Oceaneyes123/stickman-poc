# Production decisions — episode 001

One page for the decisions that govern this episode. Each row points at the
document that explains or evidences it; this file records *what was decided*, not
the full reasoning.

| # | Decision | Source |
|---|---|---|
| 1 | Characters are hairless and earless; the blue-hoodie Sam / white-shirt Alex palette supersedes the older tie/stripe rules. The legacy rig still serves shared templates and the gallery. | `AGENTS.md`, `src/characters/README.md` |
| 2 | No room walls, windows, floor or doors. A fixed, seeded SVG paper grain is the backdrop; characters, furniture, props and financial graphics stay in the foreground. | `docs/cinematic-audit.md` |
| 3 | On-screen text started as currency-only; the typography plan qualified that rule — conceptual labels are allowed where the number alone is ambiguous. Narration never appears as a subtitle. | `docs/typography-audit.md`, `videos/001-lifestyle-creep/typography-plan.md` |
| 4 | Typography is selective and cue/word anchored, about two-thirds of cues carry no new text. Labels belong to their object and leave with it. | `docs/typography-audit.md` |
| 5 | Panel action finishes inside ~60% of the shot, then holds the settled pose, so no action completes on a cut. | `src/typography/plan.ts`, `docs/animation-validation.md` |
| 6 | Number rolls run 20 frames; cards that must be read hold at least 45 frames (75 when two numbers are compared). | `research/playbooks/motion-graphics-library.md` |
| 7 | Every grounded figure and piece of furniture carries a contact shadow. Props that share a frame share one floor line (S24 desk/car at y=640). | `src/scenes/cinematicEnvironment.tsx`, `src/storyboard/cinematicStillPlan.ts` |
| 8 | All financial values come from `src/finance/math.ts`; totals are derived, never typed into a graphic. | `AGENTS.md` |
| 9 | Narration is measured local WAV; draft ASR timing is structurally checked only and never certified as aligned or listening-approved. | `docs/narration.md`, `docs/animation-validation.md` |
| 10 | Final deliverable is one MP4: episode + 8 s `GeneralOutro`, H.264/yuv420p (TV range, bt709), 1920×1080, 30 fps, AAC 48 kHz stereo. Remotion's full-range `yuvj420p` is transcoded before delivery. | `docs/animation-validation.md` |
| 11 | Concept-driven storytelling: each video explains *why* something happens, not how to calculate it. No formula beats, worked arithmetic or income-and-expense recitals; two or three amounts serve as evidence at the reveal. Arithmetic stays correct against `src/finance/math.ts` — it just stays off-screen and out of the narration. | `references/SCRIPT_GUIDE.md` §"Concept before calculation" |

## Cleanup — 2026-11-10

Removed the superseded intermediate packets for episode 001 (opening stills v1–v5,
storyboard v1–v2, design v1–v5, cinematic references v1–v3, movement/typography
previews, typography-review v1–v6, the old full-storyboard and variety-audit
packets, gallery/character review renders and check logs). `out/` went from 3.8 GB
to 672 MB.

Kept: `typography-review-v7` (render source for the delivered video),
`storyboard-design-v6` (approved still baseline), `cinematic-references-v4`
(current reference sequences), `narration/` (master WAV + cue/word timing),
`final/Why You’re Still Broke After a Raise.mp4` and `out/general-outro.mp4`.

Historical entries in `docs/animation-validation.md` still name the deleted paths;
they are records of what was verified at the time, not current locations. The
one-off `scripts/audit-storyboard-variety.py` was deleted with its v3 baseline; its
output lives in `docs/visual-variety-audit.md` and the CSV.
