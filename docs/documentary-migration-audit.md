# Documentary migration — Phase 0 audit

**Inspected:** 2026-11-16. **Authorized scope:** repository audit and Phase 1 channel identity. Stop before Phase 2; subsequent phases await user confirmation.

**Current status — 2026-11-16:** The user subsequently authorized each continuation through Phases 7–9. Earlier sections record their inspection/stop-point state; missing-guide/conflict findings are not claims that those items remain unresolved. The final review below records the current documentation result and production limitations.

## Repository and inspection

- Workspace: `E:\Projects\Youtube\video-poc-codex`; branch `master`; working tree clean before edits. No worktree, checkout, commit or push.
- HEAD: `6614d39` (`video 2 - old story board`). Previous commits: `d0b640a` (`video 2 storyboard 2`), `67d1a47` (`video 2 storyboard`), `e0485a2` (`asset library`), `f8a9bcf` (`video 1 storyboard 5`).
- No `.codegraph/` directory; ordinary source inspection applies.
- Reviewed root instructions, README/source ledger, branding/script guide, decisions/current validation, research/playbooks, installed skills, episode 001/002 scripts/storyboards/plans, Remotion setup and relevant component/timeline source.
- Recursively inventoried `references/`, including ignored upstream copies. Text/source files were read programmatically and inspected through headings and targeted excerpts; both top-level image boards were visually inspected. Binary files were inventoried/read as files, not acoustically or creatively reviewed. The vendored ZIP was readable. No upstream installation or production script was executed.

This is a documentation/source audit, not render verification, an audio listening pass, legal clearance or exhaustive visual review of vendored media.

## Rules worth preserving

- Channel name, tagline, audience, conversational voice and five brand colors.
- Natural narration, originality, claim ledgers, hypothetical labels, fair comparisons and anti-slop editing in [SCRIPT_GUIDE.md](../references/SCRIPT_GUIDE.md).
- Concept before calculation, already established by the script guide and [decision #11](decisions.md). Keep arithmetic correct behind the explanation.
- Local Remotion/React/strict TypeScript, matched versions, deterministic frames, bundled assets/fonts, output format and readable graphics with 96 px side margins.
- Measured WAV, reviewed cue anchors, hashes, shared timeline rounding and a single global audio track. Structural checks cannot certify phrase alignment or listening quality.
- Purposeful motion and sparse typography; technical checks, beat/boundary inspection, metadata and full decode, separate from human creative/listening approval.
- Existing episodes, rigs, galleries, render tools, research evidence, voice references and historical QA.

## Conflicts and later migration targets

| Owning document | Conflict | Later treatment; not changed in Phase 1 |
|---|---|---|
| [AGENTS.md](../AGENTS.md) | Global character rules, rig-first scaling and mandatory act-based rooms | Phase 7: make character/room rules legacy-specific; preserve technical requirements. |
| [SCRIPT_GUIDE.md](../references/SCRIPT_GUIDE.md) | Stickman format, character-led structure and §8 visual writing; strict amount quotas | Phase 3: preserve strong writing rules, select documentary treatments by the explanation. |
| [scriptwriting-playbook.md](../research/playbooks/scriptwriting-playbook.md) | Calls guide v2.0 rather than current v2.1; mandatory worked example, fixed beats, sentence/pronoun quotas and 165–190 wpm | Phase 6: distinguish observations from optional recommendations; measured natural narration wins. |
| [storyboard-playbook.md](../research/playbooks/storyboard-playbook.md) | Number-first shot selection, character default, blanket rejection of borrowed artifacts and mandatory early comparison | Phase 6: learning goal chooses medium; verify media and distinguish evidence from recreation. |
| [motion-graphics-library.md](../research/playbooks/motion-graphics-library.md) | Counter/comparison emphasis, blanket rejection of external charts, contracts that can read as implemented components | Phase 6: retain useful patterns; separate shipped functionality from proposals and require sourcing. |
| [cinematography-guide.md](../research/playbooks/cinematography-guide.md) | Only four framing presets and broad exclusions based on sparse still samples | Phase 6: preserve readability and restraint without treating unobserved techniques as forbidden. |
| [quality-checklist.md](../research/playbooks/quality-checklist.md) | Speech/text quotas, character gates, mandatory numerical reveal and every spoken number on screen | Phase 6: assess purpose, clarity, authenticity and sources; retain rig checks for legacy work. |
| [cross-channel-comparison.md](../research/channels/cross-channel-comparison.md) | Declares one rig-based combination the only supported identity and rejects mixed media | Preserve raw observations; later flag older recommendations as superseded. |
| [production-pipeline.md](../research/channels/production-pipeline.md) | Claims missing prop/diagram and sound libraries despite current episode art and galleries | Treat as dated assessment; verify owning source before proposing components. |
| [README.md](../README.md), [SOURCES.md](../SOURCES.md), [INSTRUCTIONS.md](../INSTRUCTIONS.md) | Character/toolkit framing, early narration status, broad provenance statements and episode-001-only workflow | Later global documentation pass: distinguish current workflow, dated statements and episode-specific history. |

[Decision #12](decisions.md) expanded color-scripted rooms after the earlier paper-only rule. Preserve that history, but mandatory rooms should not constrain documentary shots. A dated superseding decision belongs to Phase 8; earlier rows remain readable.

## Useful research and evidence limits

- [Research index](../research/README.md): 18 channels ranked, 26 retrievable text examples and six visually sampled videos; no retention, CTR or impression data. Preserve those limits.
- [Storyboard patterns](../research/channels/storyboard-patterns.md) and [typography analysis](../research/channels/typography-motion.md): object-led explanations, contextual artifacts, comparisons and text as annotation transfer well. They establish neither reuse permissions nor optimal motion timing.
- [Transcript analysis](transcript-longform-analysis.md): relatable contradictions, concrete roles/incentives and selective scale demonstrations are useful documentary techniques. Competitor transcripts are not financial authorities or proof of performance.
- [Pacing analysis](../research/channels/editing-pacing.md): scene-detection thresholds vary by art style. Cut counts and caption-derived speech rates are not universal targets.
- [Production analysis](../research/channels/production-pipeline.md) labels inferred workflows. Stills do not prove easing, camera choreography, continuous motion or listening quality. Do not rewrite historical evidence to fit the new direction.

## Current capabilities versus proposed work

| Confirmed in owning files | Limit or future work |
|---|---|
| [package.json](../package.json): all Remotion packages pinned to `4.0.541`; React `19.3.1`; strict TS/check tooling and local render scripts | No dependency/runtime change or fresh build/test pass in this task. |
| [Typography](../src/typography/README.md), [object motion](../src/objects/README.md), [transitions](../src/transitions/README.md): documented 35 text-motion styles, 20 object animations and 25 joins | Select by purpose; gallery availability does not make every effect appropriate. |
| [Timeline compiler](../src/timeline/compiler.ts), cue validation, local narration/timing tools and [BuyNowFilm](../src/storyboard/BuyNowFilm.tsx)'s single premixed Audio node | Structural validity does not prove listening-reviewed alignment. |
| Episode 002 checkout/bank/notification mockups, cards, calendars, object stages and episode-specific color script | Episode/rig-aware assets, not a general documentary compositor or authentic banking screenshots. |
| [Finance math](../src/finance/math.ts), original SVG art, SFX gallery, render/review scripts and contact-sheet workflow | Keep calculations correct; external facts/charts and third-party assets need separate provenance. No audited media-license manifest workflow was established here. |
| Existing character engine and separate `videos/sam-atm/` film | Preserve legacy work; the separate film's engine does not override the Remotion contract. |

General documentary shot schemas, reusable mock-interface components, media manifests and documentary-specific QA remain proposed work. Do not describe them as shipped functionality.

## Installed skills — provisional routing for Phase 6

- **Primary technical:** official `.agents/remotion-official/skills/`, within pinned-engine and local-tool rules.
- **Primary editorial candidates:** `.agents/skills/long-form-youtube/`, `storytelling-hooks/`, `titles-and-thumbnails/`. Their fixed timing/open-loop/packaging formulas remain optional techniques subject to channel evidence and narration standards.
- **Optional with actual analytics:** `channel-formula/`, `retention-audit/`. Public research cannot supply private retention/CTR data.
- **Optional for separate deliverables:** `carousel-narratives/`, `email-hooks/`, `wireframe-reviewer/`, `wireframe-writer/`.
- **Legacy:** installed `stickman/`. Vendored `references/stickman-video/` and `references/stickman-skill/` are upstream references, not the new default. Their alternate engines, ElevenLabs guidance and estimated-timing paths do not override local instructions.
- **Optional conceptual references:** `references/explainer-video-skills/` includes diagram, explainer, isometric, whiteboard and recap recipes. GSAP/CSS or alternate runtimes are not authorized production implementations.
- `.agents/skills/money-trap-animation/` is an empty directory with no `SKILL.md`; do not cite it as a usable installed skill. No skill or source was deleted or changed.

## Episode and validation drift

- Episode 001 has a 67-scene storyboard, 99-panel design history, opening JSON, cinematic directions and typography plan. Early script/QA “not produced” statuses predate later rendered work. Preserve the records; consult newer validation for delivery status.
- Episode 002 has a 68-scene `film-plan.json` with stages, characters, poses, expressions, camera, text and SFX fields. Episode 001 likewise has composition-specific plans. A future medium-oriented schema is not implemented.
- Episode 002's storyboard explicitly warns that `script.md` differs from recorded `narration.txt`; outline and script QA have different draft word counts. Paper-only art direction and earlier timing/audio status predate the film/reskin. Reconcile only in a separately authorized episode task.
- [Current validation](animation-validation.md), 2026-11-15, reports a technically checked color-v2 export and 18 inspected stills. All-cut inspection, encoded reskinned motion-gallery review, creative approval and audio listening remain unverified. This audit did not rerun those checks or certify that export.
- Episode 002's source ledger still has a pending layaway source. No external financial claims, policy pages or licenses were reverified here.

## Missing documentation and broken references

- README Markdown links to `docs/README.md` and `scripts/README.md` are broken; both files are absent.
- AGENTS names absent `src/storyboard/StageBackdrop.tsx`. Current episode code uses `BuyNowBackdrop.tsx` and `buyNowLook.ts`; do not claim a shared backdrop exists.
- `references/VISUAL_STYLE_GUIDE.md`, `TEACHING_STYLE_GUIDE.md` and `MEDIA_SOURCING.md` are absent planned Phase 2/4/5 deliverables. Do not add links implying they exist.
- `films/` is absent; episode material lives under `videos/`.
- Historical validation names some deleted review packets, as explicitly recorded in the [cleanup decision](decisions.md). Preserve them as historical references.
- `channel-design.png` uses alternate hex values; `character-reference.png` shows hair superseded by current rig rules. Both are legacy references, not new brand authority.

The local link check covered root instructions/README/source ledger, SCRIPT_GUIDE, decisions and playbook Markdown links. It was not a repository-wide external-link or historical-output existence check.

## Phase 1 result and stop point

Updated [CHANNEL-BRANDING.md](../references/CHANNEL-BRANDING.md) and added this audit only. Branding establishes Premium Editorial Finance Documentary; preserves name, tagline, audience, tone and palette; supplies logo/banner/thumbnail direction; makes Sam/Alex optional fictional examples; and identifies legacy artwork and future redesign without modifying assets.

At the Phase 1 stop point, Phase 2 onward was pending. Global instructions and other guides still contained the conflicts above; full migration consistency was not claimed. No implementation, episode material, image/audio asset, research evidence or historical QA record changed.

## Phase 2 continuation — 2026-11-16

The user authorized Phase 2 separately. Added [VISUAL_STYLE_GUIDE.md](../references/VISUAL_STYLE_GUIDE.md) as the primary creative authority for future visual production and linked it from channel branding. The missing visual guide recorded above describes the Phase 0 inspection, not its current availability.

The guide covers editorial motion graphics, mixed-media selection, composition, story-led pacing, visual anti-patterns with replacements, and a nine-field shot-selection framework with three BNPL examples. The 70% graphics / 30% footage direction is explicitly flexible. It distinguishes original graphics, verified third-party media, authentic evidence and labeled recreations, and preserves the current technical contract.

Existing Phase 1 changes were preserved. No implementation, episodes, assets, research evidence or historical QA changed. Phase 3 onward remains pending; global-instruction and playbook conflicts are still recorded for their assigned phases. This continuation is documentation work, not new creative, listening or render approval.

## Phase 3 continuation — 2026-11-16

The user authorized Phase 3 separately. Updated [SCRIPT_GUIDE.md](../references/SCRIPT_GUIDE.md) from v2.1 to v2.2 with targeted revisions, preserving its evidence, claim ledger, originality, anti-slop review, financial verification and local VoiceStudio/TTS workflow. The conflict table above records the original audit state; its script-guide migration is now addressed.

The guide now defines narrator-led financial documentaries and the seven writing principles: relatable first, concepts over calculations, ordinary consequences, simple explanations, meaningful progression, contextual anti-slop editing and natural local TTS. Removed fixed amount/sentence/speech-rate quotas and word allocations from the active scaffold. Numbers remain correct and traceable; hypothetical assumptions and factual claims stay distinct. Storyboard handoff uses the visual guide's nine fields without required character acting. The brief/outline/script/narration/sources/QA deliverables remain separate.

Updated branding and visual-guide navigation/status text. Existing episodes, code, assets, research evidence and historical QA are unchanged. No synthesis, listening review, external fact revalidation or render was performed. Stop before Phase 4; teaching, sourcing, playbooks and global instructions remain pending.

## Phases 4 and 5 continuation — 2026-11-16

The user authorized Phases 4 and 5 together. Added [TEACHING_STYLE_GUIDE.md](../references/TEACHING_STYLE_GUIDE.md): concept retention without remembered numbers, a flexible situation-to-understanding progression, eight teaching methods, six depth questions, and five worked editorial teaching plans with comprehension checks. Examples cover BNPL, lifestyle inflation, credit card minimum payments, failed bank transactions and financial scams. They retain assumptions, qualifications and respectful treatment of financial constraints; no existing episode was revised.

Added [MEDIA_SOURCING.md](../references/MEDIA_SOURCING.md): a minimal-budget sourcing order, manual rights verification, evidence retention, commercial-use/attribution requirements, trademarks/people/privacy, copyright and fair-use uncertainty, authentic versus recreated material, AI disclosure and YouTube originality considerations. Defined an episode-owned asset-manifest format with a deliberately pending JSON example. This is a documented manual convention, not a renderer schema or automatic license gate. No specific media asset was acquired or cleared.

Consulted and cited official YouTube, Creative Commons, Pexels, US Copyright Office and Library of Congress guidance for the sourcing rules, plus CFPB/FTC background for relevant teaching examples, on 2026-11-16. Policy review is not blanket legal clearance, monetization approval or a revalidation of historical episode claims. Updated branding, script and visual-guide links/status. Missing-guide statements above remain the historical Phase 0 findings; all four creative guides now exist.

Existing Phase 1–3 changes were preserved. No implementation, episode, media asset, raw research or historical QA changes; no synthesis, listening review or rendering. Stop before Phase 6. Playbook migration, global instructions, the superseding decision and repository-wide consistency review remain later phases.

## Phase 6 continuation — 2026-11-16

The user authorized Phase 6. Updated all six [research playbooks](../research/README.md): scriptwriting, storyboard, motion graphics, cinematography, quality checklist and animation patterns. Each now starts with current documentary guidance and retains its original text verbatim inside a labeled historical section. The original quotas, character defaults, media bans and success/feasibility claims are explicitly superseded recommendations rather than active requirements. Useful source references and observations remain readable.

Current recommendations choose visuals by the learning need, permit verified licensed footage/photos/evidence and labeled recreations, include editorial collage and mock interfaces, and keep variety purposeful. Numerical reveals, calculations, speech-rate/phrase quotas and fixed shot/framing formulas are no longer documentary acceptance gates. Future QA assesses authenticity, source integrity, visual purpose, narration clarity, comprehension and separate technical/creative/listening results.

Inspected all ten installed `.agents/skills/*/SKILL.md` entries and the separate Remotion/source references. Added [skill routing](../research/playbooks/skill-routing.md) documenting primary, optional and legacy roles, analytics prerequisites and the empty `money-trap-animation/` entry. No skill/source code was changed or deleted. Updated the research index to distinguish historical channel-analysis recommendations from the current guides without rewriting the underlying evidence, transcripts, generated metrics or observations.

Existing Phase 1–5 changes were preserved and guide navigation/status updated. No new financial claim or external policy revalidation, asset acquisition, synthesis, listening approval, implementation, episode regeneration or render. Stop before Phase 7: AGENTS/global instructions, the superseding production decision and full repository consistency review remain pending.

## Phases 7–9 — final documentation review, 2026-11-16

The user authorized the remaining phases together. Updated [AGENTS.md](../AGENTS.md) with mandatory guide reading, narration/learning-led visual selection, appropriate mixed media, component reuse, selective typography, concept-led teaching, local tooling, factual/asset provenance, measured synchronization, honest QA and no fabricated evidence or unverified licensing claims. Preserved the Remotion/React/strict-TypeScript contract, matched versions, deterministic frames, format, timeline rounding, hashes and distinct technical/creative/listening gates. Legacy identity/kinematic/room requirements are now explicitly scoped to legacy compositions.

Updated [README](../README.md), [INSTRUCTIONS](../INSTRUCTIONS.md) and [SOURCES](../SOURCES.md) to distinguish the future documentary direction from existing legacy commands and dated provenance. Fixed README's two missing-index links by pointing at existing workflow/directories and decision/validation records. Removed the active reference to nonexistent `StageBackdrop.tsx`; episode 002's actual backdrop remains legacy technical context. Added [decision #13](decisions.md#13-documentary-first-creative-direction--2026-11-16), dated 2026-11-16, without rewriting the earlier decision rows or cleanup history. Synchronized guide/index status text; earlier stop points above remain chronological records.

### Remaining character/stickman matches

The consistency search covered tracked/new project Markdown plus recursively inventoried vendored/installed reference Markdown: **319 files at the scan point**. Searches included `stickman`, `character`, character-first/led wording, rig references and Premium Flat Stickman. Remaining matches are classified by scope:

| Class | Locations and meaning |
|---|---|
| Active creative instructions with explicit legacy scope/exclusions | AGENTS, root entry points and the five maintained creative guides: optional fictional examples, prohibitions on character-first defaults and legacy asset/identity preservation. No active channel-wide stickman default remains. |
| Historical recommendations | Original text inside all six playbooks' labeled historical sections; earlier channel analyses and research-scope notes. Current sections and the research index explicitly supersede their quotas/media bans and distinguish observations from inference. |
| Historical episode/evidence records | `videos/001-*`, `videos/002-*`, research evidence/channel analyses, transcripts, earlier decisions, historical QA and episode design/variety audits. Their original creative directions and pending approvals remain intact. |
| Legacy technical references | `src/characters/` and component READMEs, motion/cinematic documentation, the separate sam-atm film, plugin documentation and character tooling. They describe existing functionality, not the default for future films. |
| Optional/legacy installed skills and upstream references | `.agents/skills/`, official reference material and vendored `references/` source. [Skill routing](../research/playbooks/skill-routing.md) defines current applicability; no installed skill/source was deleted or rewritten. |

Act-room requirements in earlier decisions/episode records remain historical. Current guides allow subject-appropriate settings and medium choices. Script rules require correct, traceable numbers but no formula lesson, calculation walkthrough or compulsory numerical reveal. Original graphics are distinct from third-party media, authentic evidence and labeled recreations throughout active guidance.

### Documentation verification and preserved scope

- Local Markdown target scan covered **105 tracked/new project Markdown files** at review time. Active maintained documentation has no missing local link targets. Ten remaining missing targets are deleted historical episode-001 review outputs, confined to `videos/001-lifestyle-creep/scenes/s01-s06-review.md` (2) and `s07-s67-review.md` (8). Their deletion is already documented in the cleanup history; these records were intentionally preserved, not relabeled as current artifacts.
- Checked maintained internal heading links, Markdown fence/details balance and the media-manifest JSON example. No automatic license validator or renderer schema is implied.
- Compared each archived original playbook with its HEAD version, the earlier decision rows/cleanup with HEAD, and the dated SOURCES snapshot with HEAD. Preserving history is separate from superseding its creative scope.
- Git scope checks confirm all migration changes are Markdown documentation. No production code, package/config/lockfile, tests, current episode files, character/gallery/finance/timeline/render tools, image/audio assets, installed skill sources, raw research, generated metrics, transcript evidence or earlier QA entries changed. Existing changes from the authorized earlier phases were retained. No repository rename, worktree, commit, push or publication.
- Documentation coverage/link/preservation checks and `git diff --check` are the applicable checks. Production tests/rendering are not required to validate prose changes and were not run. The current [validation entry](animation-validation.md) records this distinction.

**Final result:** All checks above passed: 105 project Markdown files scanned; all 21 changed/new documents have valid local targets and checked heading anchors with balanced fences/details; all six archived playbooks and earlier decision/provenance/validation records pass preservation comparisons; the manifest JSON parses; global-rule coverage and documentation-only/protected-file scope pass; `git diff --check` passes. The ten historical missing-output links are the documented exception, not active documentation failures.

### Completion and limitations

**The requested documentation/reference migration is complete through Phase 9.** Channel identity, scripting, visual production, teaching, sourcing, playbooks and global instructions agree on the documentary-first direction while legacy work remains intact.

The migration implements no new animation components, generic mixed-media compositor, storyboard schema, media downloader or automatic rights gate. Existing technical conventions needing later adaptation are recorded in decision #13. No existing episode script/audio drift, source gap or creative/listening approval was resolved as a side effect. No asset-specific rights clearance or monetization eligibility is certified. The external policy/license pages cited during Phase 5 were not exhaustively rechecked in Phases 7–9; future acquisition/publication must verify then-current terms. Historical-output links remain as noted above; no external-link availability or human media review is claimed.
