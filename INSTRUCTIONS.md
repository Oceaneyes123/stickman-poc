# Narration and timing review

## 1. Open the project

```powershell
Set-Location E:\Projects\Youtube\video-poc-codex
```

Requires Node.js 24+, FFmpeg, and VoiceStudio with VoxCPM2 installed.
Timing extraction also requires Python 3.11+, faster-whisper, and cached Whisper small.
VoiceStudio starts automatically when needed. The default voice is **Jeremy**.

## 2. Prepare the script

Edit `videos/001-lifestyle-creep/narration.txt`. Use coherent paragraphs separated
by blank lines, each under 4096 characters.

## 3. Generate and listen to a preview

```powershell
npm run narrate -- --script videos/001-lifestyle-creep/narration.txt --out out/001-lifestyle-creep/narration --preview
Invoke-Item out/001-lifestyle-creep/narration/preview.wav
```

## 4. Generate and review the full narration

```powershell
npm run narrate -- --script videos/001-lifestyle-creep/narration.txt --out out/001-lifestyle-creep/narration
Invoke-Item out/001-lifestyle-creep/narration/narration.wav
```

Check pronunciation, missing words, and consistent delivery. Paragraph files are
named `audio-1.wav`, `audio-2.wav`, and so on. Completed takes are reused on reruns.

## 5. Extract draft timing

```powershell
npm run narrate:timing -- --script videos/001-lifestyle-creep/narration.txt --audio-dir out/001-lifestyle-creep/narration
```

Word timings, phrase cues, and a review report are saved in the `timing/` folder.

## 6. Create the two-file review video

```powershell
npm run narrate:review -- --audio-dir out/001-lifestyle-creep/narration
Invoke-Item out/001-lifestyle-creep/narration/timing-review-first-2.mp4
```

Only `audio-1.wav` and `audio-2.wav` are included, with white text on black.

## 7. Review before animation

Listen and correct `timing/cues.draft.json` against the audio. Rerender the review
video to check corrections. Approve phrase timing before creating aligned cues
for animation. Changing the audio requires new timing and review.

If a run reports a pending request or lock, check VoiceStudio before retrying.
See [detailed guidance](docs/narration.md) for troubleshooting and implementation details.

## 8. Render the S01–S06 animation

```powershell
npm run opening:render -- --out out/001-lifestyle-creep/opening-animation-v3
Invoke-Item out/001-lifestyle-creep/opening-animation-v3/s01-s06.mp4
```

Uses the existing Jeremy audio and cue timing. Choose a new output folder for each review.

## 9. Generate the remaining visual storyboard

```powershell
npm run storyboard:stills -- --out out/001-lifestyle-creep/s07-s67-storyboard-v3
Invoke-Item out/001-lifestyle-creep/s07-s67-storyboard-v3/index.html
```

Creates S07–S67 stills paired with narration. Contact sheets use the installed Python Pillow package.
