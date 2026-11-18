import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { validateManifestFiles } from "../src/documentary/assets/nodeValidator.ts";
import {
  ASSET_VALIDATION_DISCLAIMER,
  createAssetRegistry,
  validateManifestStructure,
} from "../src/documentary/assets/registry.ts";
import type { AssetManifest } from "../src/documentary/assets/schema.ts";
import { validateContinuity } from "../src/documentary/core/continuity.ts";
import { sampleFocusCamera } from "../src/documentary/core/focus.ts";
import {
  LAYOUTS,
  region,
  transformRect,
  withinSideSafe,
} from "../src/documentary/core/geometry.ts";
import { chain, move, ramp, sample, validateTrack } from "../src/documentary/core/keyframes.ts";
import {
  checkTextFit,
  measureTextWidth,
  wrapText,
} from "../src/documentary/core/textMetrics.ts";
import { auditVisualVariety, runDocumentaryQa } from "../src/documentary/qa.ts";
import {
  compileDocumentaryTimeline,
  type DocumentaryStoryboard,
} from "../src/documentary/timeline.ts";
import {
  buildInstallmentSchedule,
  calculateLoanBreakdown,
  compareMinimumPayment,
  summarizeObligations,
} from "../src/finance/math.ts";
import type { CueFile } from "../src/timeline/types.ts";

const clone = <T>(v: T): T => structuredClone(v);

test("keyframe sampling is deterministic for forward and reverse seeks", () => {
  const track = chain(move(0, 120, 10, 20, "out"), move(120, 40, 40, 15, "inOut"));
  validateTrack(track);
  assert.equal(sample(track, 0), 0);
  assert.equal(sample(track, 30), 120);
  assert.equal(sample(track, 55), 40);
  const forward = Array.from({ length: 65 }, (_, f) => sample(track, f));
  for (let f = 64; f >= 0; f--) assert.equal(sample(track, f), forward[f]);
  assert.equal(ramp(15, 15, 10), 0);
  assert.equal(ramp(25, 15, 10), 1);
  assert.throws(() => validateTrack([{ at: 10, value: 0 }, { at: 5, value: 1 }]), /sorted/);
});

test("all named layout regions (except full bleed) stay inside 96px side safe margins", () => {
  for (const [layoutName, regions] of Object.entries(LAYOUTS)) {
    for (const [regionName, rect] of Object.entries(regions)) {
      if (regionName === "full") continue;
      assert.ok(
        withinSideSafe(rect),
        `${layoutName}.${regionName} crossed 96px safe margin`,
      );
    }
  }
  const scaled = transformRect(region("single", "hero"), {
    x: 20,
    y: 0,
    scale: 1,
    originX: 0.5,
    originY: 0.5,
  });
  assert.equal(scaled.x, 480);
});

test("Inter text metrics wrap deterministically and catch overflow or tiny fonts", () => {
  const width = measureTextWidth("Buy Now, Pay Later", 40, 700);
  assert.ok(width > 200 && width < 600);

  const lines = wrapText(
    "Four separate payments land across the same monthly calendar.",
    360,
    30,
    700,
  );
  assert.ok(lines.length >= 2);

  const ok = checkTextFit({
    id: "ok",
    text: "One clear price",
    box: { x: 96, y: 100, width: 600, height: 120 },
    fontSize: 42,
    fontWeight: 700,
  });
  assert.equal(ok.fits, true);
  assert.equal(ok.minPhoneFontSizeOk, true);

  const overflow = checkTextFit({
    id: "too-long",
    text: "This long explanatory sentence cannot fit on one line inside a narrow box",
    box: { x: 96, y: 100, width: 220, height: 50 },
    fontSize: 36,
    maxLines: 1,
  });
  assert.equal(overflow.fits, false);
  assert.equal(overflow.exceedsMaxLines, true);

  const tiny = checkTextFit({
    id: "tiny",
    text: "Too small",
    box: { x: 96, y: 100, width: 400, height: 60 },
    fontSize: 16,
    essential: true,
  });
  assert.equal(tiny.minPhoneFontSizeOk, false);
});

test("focus camera smoothly zooms in and returns to 1x", () => {
  const targets = [
    { id: "btn", rect: { x: 1100, y: 400, width: 400, height: 140 }, from: 20, until: 80, zoom: 1.3 },
  ];
  assert.equal(sampleFocusCamera(targets, 10).scale, 1);
  const mid = sampleFocusCamera(targets, 50);
  assert.ok(mid.scale > 1.25 && mid.dimOpacity > 0.3);
  assert.equal(sampleFocusCamera(targets, 85).scale, 1);
  const spotlightOnly = sampleFocusCamera(
    [{ id: "spot", rect: { x: 1200, y: 400, width: 500, height: 120 }, from: 0, until: 60, zoom: 1 }],
    30,
  );
  assert.equal(spotlightOnly.tx, 0);
  assert.equal(spotlightOnly.ty, 0);
});

test("continuity validator rejects completed-to-pending regressions and amount drift", () => {
  const valid = validateContinuity([
    { id: "S01", tokens: [{ id: "p1", kind: "obligation", label: "Jacket 1", amount: 60, status: "pending", sceneId: "S01" }] },
    { id: "S02", tokens: [{ id: "p1", kind: "obligation", label: "Jacket 1", amount: 60, status: "completed", sceneId: "S02" }] },
  ]);
  assert.equal(valid.valid, true);

  const invalid = validateContinuity([
    { id: "S01", tokens: [{ id: "p1", kind: "obligation", label: "Jacket 1", amount: 60, status: "completed", sceneId: "S01" }] },
    { id: "S02", tokens: [{ id: "p1", kind: "obligation", label: "Jacket 1", amount: 80, status: "pending", sceneId: "S02" }] },
  ]);
  assert.equal(invalid.valid, false);
  assert.equal(invalid.issues.length, 2);
});

test("extended finance math derives schedules, obligation collisions, loan splits, and min-payment comparisons", () => {
  const sched = buildInstallmentSchedule({
    title: "Jacket",
    total: 240,
    dates: ["Oct 1", "Oct 15", "Oct 29", "Nov 12"],
    paidCount: 1,
  });
  assert.equal(sched.installment, 60);
  assert.equal(sched.dueToday, 60);
  assert.equal(sched.futureCommitment, 180);

  const summary = summarizeObligations(3000, [
    { id: "rent", label: "Rent", category: "bill", amount: 1350, date: "Oct 1", dayOfMonth: 1 },
    { id: "j2", label: "Jacket 2", category: "bnpl", amount: 60, date: "Oct 15", dayOfMonth: 15 },
    { id: "rep", label: "Repair", category: "repair", amount: 380, date: "Oct 15", dayOfMonth: 15 },
  ]);
  assert.equal(summary.bnplTotal, 60);
  assert.equal(summary.totalCommitted, 1790);
  assert.equal(summary.uncommitted, 1210);
  assert.equal(summary.collisions.length, 1);
  assert.equal(summary.collisions[0].total, 440);

  const loan = calculateLoanBreakdown({ principal: 6000, annualRate: 0.09, months: 36 });
  assert.ok(loan.totalInterest > 800 && loan.schedule.length === 36);
  assert.equal(loan.schedule[35].balance, 0);

  const cc = compareMinimumPayment({ balance: 2400, annualRate: 0.22, fixedAlternative: 160 });
  assert.ok(cc.minimum.months > cc.fixed.months);
  assert.ok(cc.interestSaved > 0);
});

test("asset manifest validation supports episode 004 planning records and enforces delivery gates", () => {
  const ep4Manifest = JSON.parse(
    readFileSync("videos/004-free-shipping/asset-manifest.json", "utf8"),
  ) as AssetManifest;
  const ep4Planning = validateManifestStructure(ep4Manifest, { mode: "planning" });
  assert.equal(ep4Planning.valid, true);
  assert.ok(ep4Planning.pendingCount > 0);
  assert.match(ep4Planning.disclaimer, /does not verify copyright/i);

  const ep4Delivery = validateManifestStructure(ep4Manifest, { mode: "delivery" });
  assert.equal(ep4Delivery.valid, false);
  assert.equal(ASSET_VALIDATION_DISCLAIMER.includes("does not verify"), true);

  const badRemote: AssetManifest = {
    version: 1,
    assets: [
      {
        ...ep4Manifest.assets[0],
        id: "REMOTE",
        local_path: "https://example.com/clip.mp4",
        status: "verified",
      },
    ],
  };
  const remoteRes = validateManifestStructure(badRemote, { mode: "delivery" });
  assert.equal(remoteRes.valid, false);
  const reg = createAssetRegistry(badRemote);
  assert.equal(reg.resolveRenderPath("REMOTE"), null);
});

test("BNPL documentary demo passes timeline compilation, local file manifest, continuity, layout, text, and variety QA", () => {
  const cues = JSON.parse(
    readFileSync("videos/demo-bnpl-feels-cheaper/cues.json", "utf8"),
  ) as CueFile;
  const storyboard = JSON.parse(
    readFileSync("videos/demo-bnpl-feels-cheaper/storyboard.json", "utf8"),
  ) as DocumentaryStoryboard;
  const manifest = JSON.parse(
    readFileSync("videos/demo-bnpl-feels-cheaper/asset-manifest.json", "utf8"),
  ) as AssetManifest;

  const { report, compiled } = runDocumentaryQa({
    cueFile: cues,
    storyboard,
    manifest,
    mode: "delivery",
  });
  const filesReport = validateManifestFiles(manifest, { mode: "delivery" });

  assert.equal(report.passed, true, JSON.stringify(report, null, 2));
  assert.equal(filesReport.valid, true, JSON.stringify(filesReport, null, 2));
  assert.equal(compiled.durationInFrames, 1560);
  assert.equal(compiled.timingStatus, "provisional-cue-fixture");
  assert.equal(report.variety.warnings.length, 0);

  // Provisional timing-demo cues cannot falsely claim listening-approved status.
  const badBoard = clone(storyboard);
  badBoard.timingStatus = "listening-approved";
  assert.throws(() => compileDocumentaryTimeline(cues, badBoard), /listening-approved/);

  // QA catches out-of-bounds layers, text overflow, and repeated-layout variety warnings.
  const brokenBoard = clone(storyboard);
  brokenBoard.scenes[0].layerBounds![0].rect.x = 12;
  brokenBoard.scenes[0].textBounds![0].maxLines = 1;
  brokenBoard.scenes[0].textBounds![0].box.width = 140;
  brokenBoard.scenes[1].layout = brokenBoard.scenes[0].layout;
  const brokenQa = runDocumentaryQa({
    cueFile: cues,
    storyboard: brokenBoard,
    manifest,
    mode: "delivery",
  });
  assert.equal(brokenQa.report.passed, false);
  assert.ok(brokenQa.report.layoutIssues.length > 0);
  assert.ok(brokenQa.report.textIssues.length > 0);
  assert.ok(auditVisualVariety(brokenBoard).warnings.some((w) => w.kind === "repeated-layout"));
});

test("all P0 component modules and Root compositions exist with expected exports", () => {
  const requiredExports: [string, string[]][] = [
    ["src/documentary/composer/index.ts", ["DocumentaryScene", "LayerComposer", "MediaLayer", "SceneLayout", "SceneTimeline"]],
    ["src/documentary/ui/index.ts", ["BankingAppScreen", "AccountOverview", "TransactionHistory", "PaymentStatusModal", "CheckoutInterface", "BnplOfferCard", "SubscriptionDashboard", "CreditCardStatement", "LoanPaymentBreakdown", "MobileNotificationStack"]],
    ["src/documentary/evidence/index.ts", ["DocumentViewer", "ReceiptViewer", "StatementViewer", "EvidenceHighlight", "DocumentComparison", "SourceCitation"]],
    ["src/documentary/diagrams/index.ts", ["MoneyFlow", "ProcessDiagram", "DebtCycle", "FinancialRelationship", "CauseEffectSequence"]],
    ["src/documentary/objects/index.tsx", ["ProductCardObject", "InstallmentCardStack", "DocumentaryCalendar", "BillAndReceiptObject", "CurrencyTokenGroup", "BankCardObject", "PhoneDeviceObject"]],
    ["src/documentary/typography/index.tsx", ["DocumentarySectionHeading", "FinancialLabelCard", "ExplanatoryCallout", "ContextualAnnotation", "SelectiveEmphasisText"]],
    ["src/documentary/Gallery.tsx", ["DocumentaryGallery", "DOCUMENTARY_GALLERY_DURATION"]],
    ["src/documentary/demo/BnplFeelsCheaperDemo.tsx", ["BnplFeelsCheaperDemo", "DocumentaryMixedMediaShowcase", "BNPL_DEMO_DURATION"]],
  ];
  for (const [file, symbols] of requiredExports) {
    assert.ok(existsSync(file), `Missing ${file}`);
    // Read barrel or re-exported files
    const dir = file.slice(0, file.lastIndexOf("/"));
    const bundleContent = file.endsWith("index.ts")
      ? readFileSync(file, "utf8")
          .split("\n")
          .filter((l) => l.includes("export * from"))
          .map((l) => {
            const rel = l.match(/"(.+)"/)?.[1];
            const tsx = `${dir}/${rel}.tsx`;
            const ts = `${dir}/${rel}.ts`;
            return existsSync(tsx) ? readFileSync(tsx, "utf8") : readFileSync(ts, "utf8");
          })
          .join("\n")
      : readFileSync(file, "utf8");
    for (const sym of symbols) {
      assert.ok(
        bundleContent.includes(`export function ${sym}`) ||
          bundleContent.includes(`export const ${sym}`) ||
          bundleContent.includes(`export {`) && bundleContent.includes(sym),
        `Missing export ${sym} in ${file}`,
      );
    }
  }
  const root = readFileSync("src/Root.tsx", "utf8");
  for (const id of [
    "BnplFeelsCheaperDemo",
    "DocumentaryGallery",
    "DocumentaryMixedMediaShowcase",
  ]) {
    assert.ok(root.includes(`id="${id}"`), `Root.tsx missing composition ${id}`);
  }
});
