# Current animation validation

The accepted character direction is the hairless reference rig: blue-hoodie Sam
and white-shirt Alex with glasses. Walking arms use character-local depth,
mirrored once, and both elbows bend backward. Contact retargeting preserves the
solved elbow plane.

Before cleanup, all 50 tests, lint and strict TypeScript passed. Encoded walking
frames 40, 80 and 120 were inspected. The retained walking clip is 300 frames /
10 seconds; the retained movement review is 600 frames / 20 seconds. Both were
verified as 1920x1080, 30 fps, H.264/yuv420p, BT.709, silent, and fully decoded.

Retained exports: `out/walking-arm-correction.mp4` and
`out/movement-review-arm-correction.mp4`. Generated previews and earlier revisions
were removed during cleanup; regenerate them with the documented npm commands.
Human creative approval is separate from technical checks. No audio alignment
was assessed.

## Cleanup verification

After cleanup, ESLint, strict TypeScript and all 50 tests pass. The Remotion
bundle builds. Character sheets, relocated face/hand inspection tools and
component-gallery keyframes regenerate successfully. The reusable video QA
script verifies and fully decodes the retained 600-frame movement review;
an incorrect expected frame count is rejected.

The POC assembly, narration/story folder, generated timeline, POC preparation
and render scripts, obsolete implementation plan, build output and superseded
previews were removed. Cue and storyboard data survive only as compiler test
fixtures. Current animation code, review compositions, fonts/licenses, research,
references, transcript tools and the separate sam-atm film remain intact.
Two Studio log files remain locked by the active Studio process. No running
process was stopped to delete them. No new full-length video was rendered;
character and gallery frames were regenerated, and the existing review decoded.

## History

Detailed entries were split out of this file on 2026-11-10. Each one is a
verbatim record of what was checked on that date, and still names the paths and
versions that existed then.

| Date | Entries | File |
|---|---|---|
| 2026-11-08 | head silhouette, narration runner, VoiceStudio startup, progress display, sequential narration files, Jeremy reference voice | [validation/2026-11-08.md](validation/2026-11-08.md) |
| 2026-11-09 | narration context grouping, audio-derived timing, two-file timing review, storyboard passes and approval, cinematic references, S01–S67 review, visual-variety overhaul, general outro | [validation/2026-11-09.md](validation/2026-11-09.md) |
| 2026-11-10 | episode movement and typography, settle pass, full render with outro, typography motion gallery | [validation/2026-11-10.md](validation/2026-11-10.md) |
