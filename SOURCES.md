# Research, provenance and licensing

Inspected 2026-11-07. Reference repositories were downloaded read-only into the root `references/` folder; their installation scripts were not executed. Existing channel brand and script documents remain unchanged.

| Reference                                                                           | Exact revision                           | License                                | Use in this project                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [nispa/stickman-video](https://github.com/nispa/stickman-video)                     | c2ede0f707559bf9e3d207c3902d64bf3affe8ae | MIT, copyright 2026 nispa              | Conceptual inspiration: cue-anchored choreography and contact-sheet review. No engine, scripts, assets, music or source copied/adapted.                                                                                  |
| [michxlai/stickman-skill](https://github.com/michxlai/stickman-skill)               | 336608251fb16081b112e0742616baf46d0ca518 | MIT, copyright 2026 michxlai           | Conceptual inspiration: fixed world positions, silhouette and hand/prop checks. Its separate engine and scripts were not used. No source or assets copied/adapted.                                                       |
| [iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills) | 3e2d411b725d9a72939cf8e5eb81579e751373e7 | MIT, copyright 2026 iart.ai            | Conceptual inspiration: script-first storyboard and one causal financial mechanism. No source, scripts, captions or assets copied/adapted.                                                                               |
| [Official Remotion Agent Skills](https://github.com/remotion-dev/skills)            | a2824c67f8b4585c294a8101db9f9f0ad3c643f8 | Upstream files retain upstream notices | Read best-practices, create, markup, studio, render, docs and license, plus composition, multi-scene, layout, local font, audio and timing guides. Applied frame-driven rendering guidance. No paid voiceover path used. |

Scaffold: `npx create-video@4.0.541 --yes --blank --no-tailwind money-trap`. Template config and registration entrypoint retained; placeholder composition replaced. The scaffolder automatically initialized Git and created commit `796ef35` (“Create new Remotion video”). An attempted removal of this newly generated metadata was rejected by automatic approval policy; it remains intact. No manual commits or pushes were performed.

## Official API sources

- [Core frame-driven rendering](https://www.remotion.dev/docs/idea)
- [Composition registration](https://www.remotion.dev/docs/composition)
- [Sequence local frame windows](https://www.remotion.dev/docs/sequence)
- [Local fonts](https://www.remotion.dev/docs/fonts-api/load-font)
- [Audio component](https://www.remotion.dev/docs/media/audio)
- [Local renderer API](https://www.remotion.dev/docs/renderer/render-media)
- [Agent skills](https://www.remotion.dev/docs/ai/skills)
- [License terms and eligibility](https://www.remotion.dev/docs/license)

All Remotion packages are pinned to 4.0.541. Rendering and media measurement use the local renderer, Chromium and FFmpeg. No cloud rendering, paid TTS service, stock footage, paid API or music is used. Film narration is synthesized locally with VoiceStudio/VoxCPM2 on this machine (`npm run narrate`, see `docs/narration.md`); no remote voice provider is involved. Confirm Remotion's current license terms for your team before commercial deployment.

## Art and fonts

All stickman rigs, environments and financial SVGs are original code authored for this project. Palette and names come from the supplied brief and `references/CHANNEL-BRANDING.md`. The user-supplied `references/character-reference.png` is a channel-owned reference for identity and palette; it is not a third-party asset, and the rigs are redrawn as code from it rather than embedding the image.

Unmodified Inter is bundled at `public/fonts/Inter.ttf` with the full license at `public/fonts/OFL.txt`. Source: [Google Fonts Inter](https://github.com/google/fonts/tree/main/ofl/inter), copyright 2020 The Inter Project Authors. [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt) permits embedding and use subject to its terms. No other fonts or visual assets are bundled.

The story uses user-supplied fictional amounts and direct arithmetic. It does not rely on external typical-spending, investment-return or household-budget claims. The requested narration draft is preserved apart from adding “take-home” for clarity. The script guide's different numerical example is not reused.
