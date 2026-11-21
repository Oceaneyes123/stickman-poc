# Production decisions

**Scope update, 2026-11-16:** The earlier table and cleanup record remain historical. Decision #13 below defines the direction for future documentaries; existing episode treatments and technical requirements are preserved.

The table records earlier episode decisions. Each row points at the
document that explains or evidences it; this file records *what was decided*, not
the full reasoning.

| # | Decision | Source |
|---|---|---|
| 3 | On-screen text started as currency-only; the typography plan qualified that rule — conceptual labels are allowed where the number alone is ambiguous. Narration never appears as a subtitle. | `docs/typography-audit.md`, `videos/001-lifestyle-creep/typography-plan.md` |
| 4 | Typography is selective and cue/word anchored, about two-thirds of cues carry no new text. Labels belong to their object and leave with it. | `docs/typography-audit.md` |
| 5 | Panel action finishes inside ~60% of the shot, then holds the settled pose, so no action completes on a cut. | `src/typography/plan.ts`, `docs/animation-validation.md` |
| 6 | Number rolls run 20 frames; cards that must be read hold at least 45 frames (75 when two numbers are compared). | `research/playbooks/motion-graphics-library.md` |
| 8 | All financial values come from `src/finance/math.ts`; totals are derived, never typed into a graphic. | `AGENTS.md` |
| 9 | Narration is measured local WAV; draft ASR timing is structurally checked only and never certified as aligned or listening-approved. | `docs/narration.md`, `docs/animation-validation.md` |
| 10 | Final deliverable is one MP4: episode + 8 s `GeneralOutro`, H.264/yuv420p (TV range, bt709), 1920×1080, 30 fps, AAC 48 kHz stereo. Remotion's full-range `yuvj420p` is transcoded before delivery. | `docs/animation-validation.md` |
| 11 | Concept-driven storytelling: each video explains *why* something happens, not how to calculate it. No formula beats, worked arithmetic or income-and-expense recitals; two or three amounts serve as evidence at the reveal. Arithmetic stays correct against `src/finance/math.ts` — it just stays off-screen and out of the narration. | `references/SCRIPT_GUIDE.md` §"Concept before calculation" |

## 13. Documentary-first creative direction — 2026-11-16

**Decision:** The Money Trap's default is **Premium Editorial Finance Documentary**: natural conversational narration supported by original editorial motion graphics and appropriate verified footage, photography, mock interfaces and evidence. Narration and the learning goal determine each shot. Sam/Alex are optional fictional examples without required stickman appearances. Teach concepts through relatable situations and cause/effect, not mandatory formulas, calculations or numerical reveals. Typography is selective; do not display each spoken sentence.

Earlier timing/card proposals in #5/#6 are episode decisions, not universal documentary quotas; future pacing follows measured narration and comprehension. The financial-verification and synchronization principles in #8/#9 remain, with sourced documentary facts retaining their own evidence rather than a fictional-budget assumption.

Authorities: [branding](../references/CHANNEL-BRANDING.md), [scriptwriting](../references/SCRIPT_GUIDE.md), [visual style](../references/VISUAL_STYLE_GUIDE.md), [teaching](../references/TEACHING_STYLE_GUIDE.md), [media sourcing](../references/MEDIA_SOURCING.md), [production rules](../AGENTS.md) and [current research playbooks](../research/README.md). Track claim and asset sources separately; never fabricate evidence or assert unverified permissions. Technical QA does not replace human creative/listening approval.

**Preservation:** No deletion, renaming or regeneration of character code, galleries, finance components, timeline compiler, render/review scripts, episodes 001/002, research evidence/transcripts, character art, voice references or historical QA. Keep the existing repository name and local Remotion/React/strict-TypeScript engine, matched versions, frame-driven determinism, output contract, measured-audio cues and honest validation.

**Future implementation boundaries:** Existing `film-plan.json`/storyboard schemas, character-aware scene templates and episode-specific backdrop/art modules remain as implemented. A general documentary compositor, shared mock-interface library, mixed-media shot schema and automatic license gate are not delivered by these documents. The manifest is a manual convention. Any necessary code migration needs its own scope and validation; do not alter technical files to make these proposals appear implemented.

This records the user's phased migration direction and authorization through Phases 7–9. It is not approval of a new episode, media license, generated voice, render or publication.

## 14. Presenting fictional scenarios — 2026-11-16

Present invented people, scenes and generic offers naturally within the story;
do not add on-screen labels such as "fictional," "illustrative" or "demo."
Keep their invented status and assumptions in the production records. Generic
recreated offers are storytelling devices, not evidence of a named company's
actual terms or conduct; verify and preserve the provenance of real evidence.
This supersedes the earlier general recommendation to label generic fictional
scenarios on screen.

## 15. Minimal on-screen text — 2026-11-18

Use purposeful on-screen text — concise, high-impact labels, headlines, state
changes and required source credits that hold viewer attention and clarify each
visual action — while avoiding multi-sentence text walls or verbatim subtitles.
Pair every visual beat with purposeful motion (spring entrances, cursor
interactions, path-drawing connectors, object transfers and camera focus). When
using a large-head stickman presenter (`ReferenceCharacterRig`) talking along
with the narration beside harmonious graphics in the free space, target a 10–15%
A-roll and 85–90% infographic B-roll balance.

## 16. No added scene headings — 2026-11-21

Omit added on-screen headings in future video scenes, including openings,
section transitions, comparisons and payoffs. This supersedes the headline
guidance in decision #15. Let composition, object action, edits and narration
signal the change in idea.

Keep only text the viewer needs to interpret the scene or verify a claim,
such as a short status or comparison label, an amount with its units or date,
a relevant evidence excerpt, or a required source credit. Place that text near
what it describes. Episode titles and thumbnails are packaging.

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
