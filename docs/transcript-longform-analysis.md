# Longform transcript analysis

Evidence-only analysis of the supplied local text. No outside channel knowledge, scriptwriting prescriptions, video viewing, financial fact-checking, or performance data used. Prepared 8 November 2026.

## Scope and measurement

The folder contains multiple channel groups, so “this channel” does not identify a single corpus. This report covers **all 12 unique `.txt` transcripts directly inside `*/longform/transcribed/`**, grouped by channel. `ALL.txt` duplicates, the `short` folder, the other two unclassified folders, and `_raw` media are excluded. A raw recording without a corresponding transcript is not a script sample. Nothing here establishes whether the other unclassified files are longform.

Every source declares: “SOURCE: local speech recognition (faster-whisper small, CPU/int8); may contain errors”. Titles come from each file’s `TITLE:` field. Quotes reproduce the supplied text, including errors, censorship, capitalization and missing punctuation.

**Words:** whitespace-separated tokens in the transcript body; metadata excluded; numerals and standalone punctuation tokens count if separated by spaces. **Runtime:** words ÷ 150; a hypothetical constant-rate reading, not measured video length. **Positions:** words before the exact quoted opening ÷ total body words. Thus percentage of text equals estimated percentage of runtime only under that constant-rate assumption. Sponsor text and inserted speech remain included.

**Sentence proxy:** split after `.`, `!` or `?` when followed by whitespace; protect U.S., U.K., Mr., Dr., Ms. and Mrs. Decimal points remain intact. Other abbreviations and recognition punctuation can still distort the result. Sentence counts are text-delimiter counts, not verified spoken sentences. **Sections:** manually coded major rhetorical units, with nested examples listed when they change the explanation; an interpretive map, not recovered production chapters. Positions use the first exact occurrence of each opening.

An interpretation such as “injustice” identifies what a line invokes, not a measured audience emotion. “Retention device” means a textual invitation to keep listening, not proof that viewers stayed. The supplied scripts’ financial assertions are analyzed as writing; this report does not endorse them.

## Analysis steps

Split out of this file on 2026-11-10; content is unchanged apart from the local
transcript links.

| Step | Contents | File |
|---|---|---|
| 1 | Per-video breakdown of all 12 transcripts: hook, sections, devices, close | [transcripts/per-video-breakdown.md](transcripts/per-video-breakdown.md) |
| 2 | Cross-video patterns: hook formulas, structure, pacing, retention devices | [transcripts/cross-video-patterns.md](transcripts/cross-video-patterns.md) |
| 3 | Provisional writing blueprint and hook variations | [transcripts/writing-blueprint.md](transcripts/writing-blueprint.md) |
| 4 | What the sample cannot support | [transcripts/limits.md](transcripts/limits.md) |
| — | Audit notes on how the numbers were checked | [transcripts/audit-notes.md](transcripts/audit-notes.md) |
