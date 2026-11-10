# Production pipeline (inferred)

**Nothing here is confirmed.** No creator in the corpus published a workflow
document that this research read. The only hard evidence about how these videos are
made is:

- **Alan Becker's end card** (sampled at 445 s) credits eight people: *terkoiz –
  ActiveFrame, CoreAdro – Fox, Nathan Irvin – Doumaki, SorryH – ShadowGrow, Awez –
  JasonTheBoring, Shuriken255 – AJAnimations, Sounds by Egor*. That is a team
  animation pipeline with a dedicated sound credit, not a solo operation.
- **The Paint Explainer's about text** (as returned in channel metadata): "I explain
  interesting stuff… How I use AI: The voiceover i…" — the field exists but the full
  text was truncated in what was captured, so no claim is made about which tools.
- **Beanie Survives** publishes daily-to-weekly episodes with a trailer for season 2
  and an episode numbering scheme — a serialised production cadence.
- **Kurzgesagt** ships roughly 397 videos over 13 years with a studio credit in its
  branding; the per-shot bespoke art in the sampled video implies a large illustration
  team.

Everything below is a reasonable inference from the output, labelled as such.

## 1. Stages, with what the output implies

| Stage | Inferred for | Evidence in the output | Automation opportunity |
|---|---|---|---|
| Topic selection | All | Titles cluster into repeatable families (question, number, correction, serial) | **High** — a title-family checklist is free |
| Research / fact ledger | James Jani, HMW, Magnates | Named people, dates, quoted headlines, chart screenshots | Low — human judgement, sourcing |
| Script | All | Speech rate 146–240 wpm; 7–24 word sentences; no greetings | Medium — structure templates, not text generation |
| Voiceover | All | Consistent narrator per channel; 170–210 wpm in finance | High locally — VoiceStudio already does this |
| Storyboard | Paint, Beanie | One diagram per beat; a label system reused across sections | **High** — this is the stage this repo already has tooling for |
| Asset development | Kurzgesagt (bespoke), Beanie (one set) | Repeated sets vs new art per shot | Medium — prop library |
| Character animation | Alan Becker, Beanie | Face-free figures; choreography in Becker, near-static in Beanie | Medium — the rig exists; choreography does not |
| Motion graphics | James Jani, Paint | Dots, arrows, dashed lines, counters | **High** — code is the right tool |
| Camera / composition | All | Cuts between sizes; no measurable camera moves | High — presets |
| Editing | All | 7.5–16 detected changes/min for narrated videos | Medium — the compiler sets scene durations |
| Sound design | Alan Becker (credited), James Jani ([Music] markers) | Music present; effects implied by action | Low locally — no sound library in repo |
| QC | All | Credits, consistent branding, no burned-in captions | High — `npm run check` + QA script already exist |

## 2. The one confirmed structural fact

Alan Becker's credits prove that the highest-craft stickman channel in the corpus is
**not** a solo pipeline. Any plan that assumes one person can match its action
choreography is wrong. Conversely, Beanie Survives' output is consistent with a
very small team using one set, one character and a card system — which is the tier
this repo can actually reach.

## 3. Where this repo already sits on that pipeline

Confirmed by reading the repo, not inferred:

- Script → narration: `INSTRUCTIONS.md` steps 2–4, VoiceStudio + measured WAV.
- Narration → timing: `npm run narrate:timing`, faster-whisper word timings, cue
  review before animation.
- Storyboard: `npm run storyboard:design`, 99 stills for 67 scenes, reviewed as
  contact sheets.
- Compilation: `src/timeline/compiler.ts`, cue hashes, frame-accurate events.
- Render + QA: `npm run check`, `npm run render`, `scripts/review/qa.py` full-decode check.

Missing relative to the corpus: a **prop/diagram library** (the Paint Explainer
grammar), a **state-card component** (Beanie grammar), and a **section-label system**
that persists across scenes. All three are small, data-driven additions — not new
engines.

## 4. What not to automate

- Fact selection and the fact ledger (`references/SCRIPT_GUIDE.md` §2 already owns
  this).
- The hook. Every hook in the corpus is a human decision about which contradiction is
  worth 13 minutes.
- Pacing judgement at the beat level. The compiler can place cues; it cannot decide
  that a reveal needs two extra seconds of hold.

## 5. Failure modes visible in the corpus

| Failure | Evidence | Cause (inferred) |
|---|---|---|
| One hit, then collapse | theblurb 4.8M → 3.8K; Zenn 8.1M → 21K | Format copied from the hit, not the mechanism |
| Format exhaustion | The Infographics Show 4.9M → 37K on the same channel | Same template, thousands of times |
| Icon inconsistency | Beanie's "5,000 gal" drawn with nine jugs | Card built for one scale, reused at another |
| Borrowed authority without the asset | — | HMW needs licensed footage; a clone cannot |
| Animation effort in the wrong place | — | Rig fidelity that the reference formats never had |
