# Documentary Production Toolkit (`src/documentary/`)

Reusable local Remotion + React + strict TypeScript modules for **Premium Editorial Finance Documentary** production. Every module works offline with deterministic frame-driven motion (`useCurrentFrame()` / explicit `frame` prop) and `1920×1080` at `30 fps`.

## Module Map & Discovery

| Subdirectory | Purpose | Key Exports |
|---|---|---|
| `core/` | Pure frame-driven math, safe margins, focus zoom, continuity, looks, motion profiles, depth camera, sub-stages, bridges, Inter metrics | `LAYOUTS`, `LOOKS`, `MOTION_PROFILES`, `region`, `getRegionEntryDirection`, `sampleSpring`, `sampleMotionProfile`, `sampleCameraRig`, `cameraLayerTransform`, `resolveActiveStage`, `findMatchingBridges`, `sampleBridgeRect`, `SAFE_RECT`, `withinSideSafe`, `sample`, `move`, `chain`, `ramp`, `measureTextWidth`, `wrapText`, `checkTextFit`, `sampleFocusCamera`, `validateContinuity` |
| `assets/` | Local asset manifest schema, offline registry & SHA-256 verification | `createAssetRegistry`, `validateManifestStructure`, `validateManifestFiles`, `ASSET_VALIDATION_DISCLAIMER` |
| `timeline.ts` | Documentary storyboard compilation over `src/timeline/compiler.ts` (including `wordId` anchoring & look/profile metadata) | `compileDocumentaryTimeline` |
| `sfxCompiler.ts` | Motion-coupled SFX compiler for transitions, beats, cursor waypoints, and cutaways | `compileDocumentarySfx` |
| `composer/` | Layered mixed-media scene composition, depth parallax, live overlaps, match-move bridges & `MotionBox` | `DocumentaryScene`, `LayerComposer`, `MediaLayer`, `SceneLayout`, `SceneBackdrop`, `SceneTimeline`, `SceneJoin`, `MotionBox`, `MotionGroup`, `StaggerGroup` |
| `actors/` | Reusable interactive motion actors, proportional bars, presenter framing & end card | `CursorActor`, `SvgCursorActor`, `DrawConnector`, `ThresholdMeter`, `ProportionalBarComparison`, `PresenterStage`, `DocumentaryEndCard` |
| `stages/` | 7 composable anti-template stage builders with `extraLayers` escape hatches | `createComparisonStage`, `createEvidenceHighlightStage`, `createPolicyMatrixStage`, `createMechanismFlowStage`, `createInteractiveUiStage`, `createPresenterSplitStage`, `createCutawayStage` |
| `../cutaways/` | 15 parameterized kinetic cutaway treatments & gallery (`CutawayGallery`, 990f) | `KineticCutaway`, `CutawayGallery`, `CUTAWAY_VARIANTS`, `CUTAWAY_GALLERY_DURATION` |
| `ui/` | 10 fictional-branded financial UI components | `BankingAppScreen`, `AccountOverview`, `TransactionHistory`, `PaymentStatusModal`, `CheckoutInterface`, `BnplOfferCard`, `SubscriptionDashboard`, `CreditCardStatement`, `LoanPaymentBreakdown`, `MobileNotificationStack` |
| `evidence/` | Document, receipt, statement & comparison viewers with citations and redactions | `DocumentViewer`, `ReceiptViewer`, `StatementViewer`, `EvidenceHighlight`, `DocumentComparison`, `SourceCitation` |
| `diagrams/` | Financial mechanism and cause-effect diagrams | `MoneyFlow`, `ProcessDiagram`, `DebtCycle`, `FinancialRelationship`, `CauseEffectSequence` |
| `objects/` | Choreography wrappers over `src/objects/motion.tsx`, `src/finance/components.tsx`, and `BuyNowArt.tsx` | `ProductCardObject`, `ProductIllustration`, `InstallmentCardStack`, `DocumentaryCalendar`, `BillAndReceiptObject`, `CurrencyTokenGroup`, `BankCardObject`, `PhoneDeviceObject` |
| `typography/` | Selective editorial headings, numeric cards, callouts, annotations | `DocumentarySectionHeading`, `FinancialLabelCard`, `ExplanatoryCallout`, `ContextualAnnotation`, `SelectiveEmphasisText`, `DocumentaryComparisonNumbers` |
| `presets/` | Legacy multi-layer scene factories (kept for backwards compatibility) | `createProductFramingScene`, `createCheckoutSplitScene`, `createCalendarConvergenceScene`, `createCommitmentComparisonScene` |
| `qa.ts` | Layout safe-margin, text overflow, asset, continuity, and multi-axis visual-variety QA | `runDocumentaryQa`, `auditVisualVariety` |
| `Gallery.tsx` & `DynamicMotionGallery.tsx` | Reusable component galleries | `DocumentaryGallery`, `DynamicMotionGallery` |

## How to Combine Components in a New Episode

1. **Prepare narrative & cues**: Write `videos/<episode>/narration.txt`, generate measured WAV via VoiceStudio (`npm run narrate`), extract/review timing (`npm run narrate:timing`), and maintain `videos/<episode>/asset-manifest.json` per [MEDIA_SOURCING.md](../../references/MEDIA_SOURCING.md).
2. **Author `storyboard.json`**: Define `DocumentaryStoryboard` scenes with cue `Anchor`s, `layout` names from `LAYOUTS`, `layerBounds`, `textBounds`, `continuityTokens`, and `assetIds`.
3. **Compile & validate**: Call `compileDocumentaryTimeline(cueFile, storyboard, audioDurationMs)` or run `npm run documentary:qa -- --dir <episode-directory>` before rendering. Never mark provisional `timing-demo` fixtures as `listening-approved`.
4. **Build scenes**: Pass `DocumentarySceneDefinition` objects (combining `video`, `image`, `svg`, `ui`, `diagram`, `document`, `object`, and `text` layers across `"background"`, `"midground"`, and `"foreground"` depths) into `<SceneTimeline />`.
5. **Financial math**: Derive every schedule, balance, loan split, and comparison using `src/finance/math.ts` (`payInFour`, `buildInstallmentSchedule`, `summarizeObligations`, `calculateLoanBreakdown`, `compareMinimumPayment`).
6. **Disclosure & provenance**: Keep `disclosureMode="hidden"` for generic fictional scenarios (Decision #14), use `disclosureMode="badge"` when a recreation could be mistaken for a real record, and attach `<SourceCitation />` to authentic excerpts or sourced data.
7. **Audio contract**: Video layers inside `MediaLayer` are always `muted`; keep a single premixed global `<Audio>` node in the film wrapper.

## Commands

```powershell
# Validate an episode's storyboard, layout margins, text fit, continuity, assets, and variety
npm run documentary:qa -- --dir videos/your-episode --mode planning
```
