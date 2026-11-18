# Documentary Production Toolkit (`src/documentary/`)

Reusable local Remotion + React + strict TypeScript modules for **Premium Editorial Finance Documentary** production. Every module works offline with deterministic frame-driven motion (`useCurrentFrame()` / explicit `frame` prop) and `1920×1080` at `30 fps`.

## Module Map & Discovery

| Subdirectory | Purpose | Key Exports |
|---|---|---|
| `core/` | Pure frame-driven math, safe margins, focus zoom, continuity, Inter glyph metrics | `LAYOUTS`, `region`, `SAFE_RECT`, `withinSideSafe`, `sample`, `move`, `chain`, `ramp`, `measureTextWidth`, `wrapText`, `checkTextFit`, `sampleFocusCamera`, `validateContinuity` |
| `assets/` | Local asset manifest schema, offline registry & SHA-256 verification | `createAssetRegistry`, `validateManifestStructure`, `validateManifestFiles`, `ASSET_VALIDATION_DISCLAIMER` |
| `timeline.ts` | Documentary storyboard compilation over `src/timeline/compiler.ts` | `compileDocumentaryTimeline` |
| `composer/` | Layered mixed-media scene composition & scene-to-scene joins | `DocumentaryScene`, `LayerComposer`, `MediaLayer`, `SceneLayout`, `SceneBackdrop`, `SceneTimeline`, `SceneJoin` |
| `ui/` | 10 fictional-branded financial UI components | `BankingAppScreen`, `AccountOverview`, `TransactionHistory`, `PaymentStatusModal`, `CheckoutInterface`, `BnplOfferCard`, `SubscriptionDashboard`, `CreditCardStatement`, `LoanPaymentBreakdown`, `MobileNotificationStack` |
| `evidence/` | Document, receipt, statement & comparison viewers with citations and redactions | `DocumentViewer`, `ReceiptViewer`, `StatementViewer`, `EvidenceHighlight`, `DocumentComparison`, `SourceCitation` |
| `diagrams/` | Financial mechanism and cause-effect diagrams | `MoneyFlow`, `ProcessDiagram`, `DebtCycle`, `FinancialRelationship`, `CauseEffectSequence` |
| `objects/` | Choreography wrappers over `src/objects/motion.tsx`, `src/finance/components.tsx`, and `BuyNowArt.tsx` | `ProductCardObject`, `ProductIllustration`, `InstallmentCardStack`, `DocumentaryCalendar`, `BillAndReceiptObject`, `CurrencyTokenGroup`, `BankCardObject`, `PhoneDeviceObject` |
| `typography/` | Selective editorial headings, numeric cards, callouts, annotations | `DocumentarySectionHeading`, `FinancialLabelCard`, `ExplanatoryCallout`, `ContextualAnnotation`, `SelectiveEmphasisText`, `DocumentaryComparisonNumbers` |
| `presets/` | Reusable multi-layer scene factories | `createProductFramingScene`, `createCheckoutSplitScene`, `createCalendarConvergenceScene`, `createCommitmentComparisonScene` |
| `qa.ts` | Layout safe-margin, text overflow, asset, continuity, and heuristic visual-variety QA | `runDocumentaryQa`, `auditVisualVariety` |
| `Gallery.tsx` | 16-panel component gallery (`DocumentaryGallery`, 1440 frames) | `DocumentaryGallery`, `DOCUMENTARY_GALLERY_DURATION` |
| `demo/` | Working BNPL demonstration (`BnplFeelsCheaperDemo`, 1560f / 52s) & mixed-media acceptance scene (`DocumentaryMixedMediaShowcase`, 180f) | `BnplFeelsCheaperDemo`, `DocumentaryMixedMediaShowcase` |

## How to Combine Components in a New Episode

1. **Prepare narrative & cues**: Write `videos/<episode>/narration.txt`, generate measured WAV via VoiceStudio (`npm run narrate`), extract/review timing (`npm run narrate:timing`), and maintain `videos/<episode>/asset-manifest.json` per [MEDIA_SOURCING.md](../../references/MEDIA_SOURCING.md).
2. **Author `storyboard.json`**: Define `DocumentaryStoryboard` scenes with cue `Anchor`s, `layout` names from `LAYOUTS`, `layerBounds`, `textBounds`, `continuityTokens`, and `assetIds`.
3. **Compile & validate**: Call `compileDocumentaryTimeline(cueFile, storyboard, audioDurationMs)` or run `runDocumentaryQa` (`npm run documentary:qa`) before rendering. Never mark provisional `timing-demo` fixtures as `listening-approved`.
4. **Build scenes**: Pass `DocumentarySceneDefinition` objects (combining `video`, `image`, `svg`, `ui`, `diagram`, `document`, `object`, and `text` layers across `"background"`, `"midground"`, and `"foreground"` depths) into `<SceneTimeline />`.
5. **Financial math**: Derive every schedule, balance, loan split, and comparison using `src/finance/math.ts` (`payInFour`, `buildInstallmentSchedule`, `summarizeObligations`, `calculateLoanBreakdown`, `compareMinimumPayment`).
6. **Disclosure & provenance**: Keep `disclosureMode="hidden"` for generic fictional scenarios (Decision #14), use `disclosureMode="badge"` when a recreation could be mistaken for a real record, and attach `<SourceCitation />` to authentic excerpts or sourced data.
7. **Audio contract**: Video layers inside `MediaLayer` are always `muted`; keep a single premixed global `<Audio>` node in the film wrapper.

## Commands

```powershell
# Validate demo storyboard, layout margins, text fit, continuity, assets, and variety
npm run documentary:qa

# Render stills, contact sheets, and MP4s (demo + gallery + mixed-media showcase) + QA decode
npm run documentary:render
```
