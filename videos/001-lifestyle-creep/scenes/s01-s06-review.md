# S01–S06 visual study

Animated review: [S01–S06 with Jeremy narration](../../../out/001-lifestyle-creep/opening-animation-v2/s01-s06.mp4).
The 50.923-second audio excerpt ends before S07. Camera moves, pose changes,
calendar pages, keyboard taps, document entrances, and financial reveals now run
from frames and compiled cue anchors. Motion and audiovisual sync await user review.

Current packet: [contact sheet](../../../out/001-lifestyle-creep/s01-s06-stills-v5/contact-sheet.png).
Individual PNGs and `index.json` are in the same folder.

**Approval:** The user approved the storyboard on 2026-11-09. This v5 packet is
the current framing reference for S01–S06. Animated movement and audio sync remain
unreviewed.

These are sixteen 960×540 camera/layout studies using the existing character rigs.
Wide/close pairs show zoom choices before animation. Room perspective, foreground
objects, shadows, shoulder-level phone views, a passenger-side car interior, and
overhead tabletop views add depth and angle variety. They remain still images;
the animation above adds movement and narration to these approved framings.

| Scene | Frames                                                                  | Review focus                                                                   |
| ----- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| S01   | Raise wide/close; Month 3 context/reaction close                        | Excitement versus uncertainty; both hands stay inside the close reaction frame |
| S02   | Apartment wide/closer; rental interior; shoulder-level services view    | Space, comfort, and entertainment from distinct viewpoints                     |
| S03   | Shoulder-level comparison and close phone insert                        | Monthly transfer comparison without revealing the exact $380 yet               |
| S04   | Angled seated workspace; overhead commitments                           | Continued employment; one raise alongside recurring commitments                |
| S05   | `s05-equal-start`                                                       | Equal visual weight and identical raises for Sam and Alex                      |
| S06   | High shoulder-level income view; overhead remainder; close confirmation | $3,000 income, $2,600 expenses, $400 remaining then explicitly saved           |

Render a fresh, separate version from the current source:

```powershell
npm run opening:stills -- --out out/001-lifestyle-creep/s01-s06-stills-v6
```

The renderer preserves completed versions and rejects duplicate image outputs.
Review v5 above; earlier packets remain preserved. Each shot's `index.json`
entry records its camera framing and source cue. The rear shoulder is a partial
back-of-head/hoodie silhouette for staging, not a new articulated rear-facing rig.
No audio, timing data, existing character geometry, or S07–S67 content changed.
