import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import {
  CUTAWAY_VARIANTS,
  resolveCutawayBoardTone,
  validateCutawayHold,
} from "../src/cutaways/types.ts";
import { C } from "../src/design/tokens.ts";
import {
  computeComparisonBars,
  computeThresholdBars,
} from "../src/documentary/actors/barsMath.ts";
import { buildConnectorPath } from "../src/documentary/actors/connectorMath.ts";
import {
  collectCursorSfx,
  sampleCursorWaypoints,
  type CursorWaypoint,
} from "../src/documentary/actors/cursorMath.ts";
import {
  findMatchingBridges,
  sampleBridgeRect,
} from "../src/documentary/core/bridge.ts";
import {
  cameraLayerTransform,
  sampleCameraRig,
} from "../src/documentary/core/camera.ts";
import {
  LAYOUTS,
  getRegionEntryDirection,
  region,
  withinSideSafe,
} from "../src/documentary/core/geometry.ts";
import { LOOKS, LOOK_IDS, getLook, lookCssVars } from "../src/documentary/core/looks.ts";
import {
  MOTION_PROFILE_IDS,
  sampleMotionProfile,
  sampleSpring,
} from "../src/documentary/core/motionProfiles.ts";
import { resolveActiveStage } from "../src/documentary/core/stages.ts";
import { auditVisualVariety, runDocumentaryQa } from "../src/documentary/qa.ts";
import { compileDocumentarySfx } from "../src/documentary/sfxCompiler.ts";
import {
  compileDocumentaryTimeline,
  type DocumentaryStoryboard,
  type WordTiming,
} from "../src/documentary/timeline.ts";
import {
  calculateFreeShippingOrder,
  freeShippingExample,
} from "../src/finance/math.ts";
import type { CueFile } from "../src/timeline/types.ts";

// ---------------- Phase 1 ----------------

test("Phase 1: sampleSpring and all 5 motion profiles are deterministic and seek-symmetric", () => {
  for (const profileId of MOTION_PROFILE_IDS) {
    const forward = Array.from({ length: 80 }, (_, f) =>
      sampleMotionProfile(profileId, f, { from: 10, until: 70, direction: "left" }),
    );
    for (let f = 79; f >= 0; f--) {
      assert.deepEqual(
        sampleMotionProfile(profileId, f, { from: 10, until: 70, direction: "left" }),
        forward[f],
        `${profileId} seek mismatch at frame ${f}`,
      );
    }
    assert.equal(forward[5].visible, false);
    assert.equal(forward[10].visible, true);
    assert.equal(forward[70].visible, false);
    assert.ok(forward[40].progress > 0.9);
  }

  assert.equal(sampleSpring(0, { stiffness: 175, damping: 13 }), 0);
  const settled = sampleSpring(60, { stiffness: 175, damping: 13 });
  assert.ok(Math.abs(settled - 1) < 0.02);
});

test("Phase 1: cursor waypoints, connector paths, proportional bars, and cutaway helpers work deterministically", () => {
  const waypoints: CursorWaypoint[] = [
    { at: 10, x: 200, y: 300, action: "move" },
    { at: 40, x: 800, y: 500, action: "click" },
    { at: 65, x: 740, y: 540, action: "recoil" },
  ];
  assert.equal(sampleCursorWaypoints(waypoints, 10).x, 200);
  const clicked = sampleCursorWaypoints(waypoints, 44);
  assert.ok(clicked.press > 0 && clicked.ripple > 0);
  assert.equal(sampleCursorWaypoints(waypoints, 40).x, 800);

  const sfx = collectCursorSfx(waypoints, 100, 0.2);
  assert.deepEqual(sfx, [
    [140, "pop", 0.2],
    [165, "swish", 0.17],
  ]);

  for (const kind of ["straight", "curved", "elbow-h", "elbow-v", "bracket"] as const) {
    const geom = buildConnectorPath({ x: 100, y: 200 }, { x: 500, y: 400 }, kind);
    assert.ok(geom.d.startsWith("M 100 200"));
    assert.ok(Number.isFinite(geom.mid.x) && Number.isFinite(geom.endAngleDeg));
  }

  const order = calculateFreeShippingOrder();
  const thresh = computeThresholdBars({
    baseAmount: order.beforeSubtotal,
    threshold: freeShippingExample.threshold,
    addedAmount: freeShippingExample.addOn,
    maxWidth: 600,
  });
  assert.equal(thresh.qualifies, true);
  assert.equal(thresh.overhangAmount, 4);
  assert.equal(thresh.totalAmount, 54);
  assert.ok(thresh.overhangWidth > 0 && thresh.baseWidth < thresh.thresholdX);

  const comp = computeComparisonBars(
    [
      { id: "paid", label: "Paid", amount: order.before, tone: "alternative" },
      { id: "free", label: "Free", amount: order.after, tone: "cost" },
    ],
    500,
  );
  assert.equal(comp.scaleMax, 54);
  assert.equal(comp.bars[1].width, 500);
  assert.ok(Math.abs(comp.bars[0].width - (48 / 54) * 500) < 1e-6);

  assert.equal(CUTAWAY_VARIANTS.length, 15);
  assert.equal(new Set(CUTAWAY_VARIANTS).size, 15);
  assert.equal(resolveCutawayBoardTone({ variant: "elastic-tag" }), "dark");
  assert.equal(resolveCutawayBoardTone({ variant: "paper-tear" }), "light");
  assert.equal(resolveCutawayBoardTone({ variant: "elastic-tag", boardTone: "warm-paper" }), "warm-paper");
  assert.equal(validateCutawayHold({ text: "Short punchline" }, 66).valid, true);
  assert.equal(validateCutawayHold({ text: "Many words require enough frames to read cleanly on screen" }, 20).valid, false);

  const motionSrc = readFileSync("src/objects/motion.tsx", "utf8");
  assert.ok(motionSrc.includes("children?: ReactNode"));
  assert.ok(motionSrc.includes("props.children ??"));
});

// ---------------- Phase 2 ----------------

test("Phase 2: all 7 Looks preserve brand accents and all 16 Layouts respect 96px side safe margins", () => {
  assert.equal(LOOK_IDS.length, 7);
  for (const id of LOOK_IDS) {
    const lk = getLook(id);
    assert.equal(lk.money, C.yellow);
    assert.equal(lk.cost, C.red);
    assert.equal(lk.alternative, C.teal);
    const vars = lookCssVars(lk);
    assert.equal(vars["--doc-money"], C.yellow);
    assert.equal(LOOKS[id].id, id);
  }

  assert.equal(Object.keys(LAYOUTS).length, 16);
  for (const [layoutName, regions] of Object.entries(LAYOUTS)) {
    for (const [regionName, rect] of Object.entries(regions)) {
      if (regionName === "full") continue;
      assert.ok(
        withinSideSafe(rect),
        `${layoutName}.${regionName} crossed 96px side safe margin`,
      );
    }
  }

  assert.equal(getRegionEntryDirection(region("asymmetric-65-35", "rail")), "right");
  assert.equal(getRegionEntryDirection(region("asymmetric-35-65", "rail")), "left");
  assert.equal(getRegionEntryDirection(region("editorial-top-stage", "header")), "down");
});

test("Phase 2: depth-parallax camera rig, sub-stages, and continuity bridges are deterministic", () => {
  const rig = {
    keyframes: [
      { at: 0, x: 0, y: 0, zoom: 1 },
      { at: 60, x: 100, y: -50, zoom: 1.2, easing: "linear" as const },
    ],
  };
  const mid = sampleCameraRig(rig, 30);
  assert.ok(Math.abs(mid.x - 50) < 1e-3);
  assert.ok(Math.abs(mid.zoom - 1.1) < 1e-3);

  const bgT = cameraLayerTransform(mid, "background");
  const fgT = cameraLayerTransform(mid, "foreground");
  assert.ok(bgT.tx < fgT.tx && bgT.scale < fgT.scale);

  // Reverse seek consistency
  for (let f = 60; f >= 0; f--) {
    assert.deepEqual(sampleCameraRig(rig, f), sampleCameraRig(rig, f));
  }

  const stageRes = resolveActiveStage(
    [
      { id: "s1", from: 0, state: { step: 1, label: "initial" } },
      { id: "s2", from: 40, state: { step: 2 } },
    ],
    55,
  );
  assert.equal(stageRes.activeStage?.id, "s2");
  assert.equal(stageRes.stageIndex, 1);
  assert.equal(stageRes.stageFrame, 15);
  assert.deepEqual(stageRes.mergedState, { step: 2, label: "initial" });

  const matches = findMatchingBridges(
    [{ id: "card", rect: { x: 100, y: 200, width: 300, height: 150 } }],
    [{ id: "card", rect: { x: 500, y: 400, width: 500, height: 250 } }],
  );
  assert.equal(matches.length, 1);
  const halfway = sampleBridgeRect(matches[0].fromRect, matches[0].toRect, 0.5, "linear");
  assert.deepEqual(halfway, { x: 300, y: 300, width: 400, height: 200 });
});

// ---------------- Phase 3 ----------------

test("Phase 3: documentary timeline supports wordId anchoring and rejects invalid word anchors", () => {
  const cueFile: CueFile = {
    mode: "aligned",
    scriptHash: "s1",
    audioHash: "a1",
    cues: [
      { id: "c1", startMs: 0, endMs: 2000, text: "One price appears today" },
      { id: "c2", startMs: 2000, endMs: 4000, text: "Then fees add up" },
    ],
  };
  const words: WordTiming[] = [
    { id: "w1", startMs: 500, endMs: 900, text: "appears" },
    { id: "w2", startMs: 2600, endMs: 3000, text: "fees" },
  ];
  const board: DocumentaryStoryboard = {
    fps: 30,
    demoDurationMs: 4000,
    tailMs: 0,
    timingStatus: "listening-approved",
    scenes: [
      {
        id: "S01",
        title: "One",
        start: { cueId: "c1", edge: "start" },
        end: { cueId: "c1", edge: "end" },
        layout: "asymmetric-35-65",
        look: "editorial-paper",
        transition: "hard-cut",
      },
      {
        id: "S02",
        title: "Two",
        start: { cueId: "c2", edge: "start" },
        end: { cueId: "c2", edge: "end" },
        layout: "feature-right",
        look: "midnight-blueprint",
        transition: "wipe",
      },
    ],
    beats: [
      {
        id: "b1",
        sceneId: "S01",
        cueId: "c1",
        wordId: "w1",
        wordEdge: "end",
        durationMs: 600,
        sfx: { name: "pop", volume: 0.25 },
      },
    ],
  };

  const compiled = compileDocumentaryTimeline(cueFile, board, 4000, words);
  assert.equal(compiled.beats[0].from, 27); // 900ms * 30 / 1000 = 27
  assert.equal(compiled.scenes[0].look, "editorial-paper");

  const sfx = compileDocumentarySfx({
    timeline: compiled,
    cursorTracks: [{ sceneFrom: 60, waypoints: [{ at: 10, x: 400, y: 300, action: "click" }] }],
    maxVolume: 0.3,
  });
  assert.ok(sfx.some(([f, name]) => f === 27 && name === "pop"));
  assert.ok(sfx.some(([f, name]) => f === 60 && name === "whoosh_short"));
  assert.ok(sfx.some(([f, name]) => f === 70 && name === "pop"));
  for (const [, , vol] of sfx) {
    assert.ok((vol ?? 0) <= 0.3);
  }

  // Reject missing wordId
  const missingWordBoard = structuredClone(board);
  missingWordBoard.beats[0].wordId = "does-not-exist";
  assert.throws(() => compileDocumentaryTimeline(cueFile, missingWordBoard, 4000, words), /Missing wordId/);

  // Reject out-of-cue wordId
  const wrongCueBoard = structuredClone(board);
  wrongCueBoard.beats[0].wordId = "w2";
  assert.throws(() => compileDocumentaryTimeline(cueFile, wrongCueBoard, 4000, words), /outside cue/);

  // Stage exports exist
  assert.ok(existsSync("src/documentary/stages/index.ts"));
  const stagesIndex = readFileSync("src/documentary/stages/index.ts", "utf8");
  for (const file of [
    "ComparisonStage",
    "EvidenceHighlightStage",
    "PolicyMatrixStage",
    "MechanismFlowStage",
    "InteractiveUiStage",
    "PresenterSplitStage",
    "CutawayStage",
  ]) {
    assert.ok(stagesIndex.includes(file));
  }
});

// ---------------- Phase 4 ----------------

test("Phase 4: upgraded auditVisualVariety catches anti-patterns while demo storyboard keeps 0 warnings", () => {
  const cues = JSON.parse(readFileSync("videos/demo-bnpl-feels-cheaper/cues.json", "utf8")) as CueFile;
  const demoBoard = JSON.parse(readFileSync("videos/demo-bnpl-feels-cheaper/storyboard.json", "utf8")) as DocumentaryStoryboard;
  const compiledDemo = compileDocumentaryTimeline(cues, demoBoard);
  assert.equal(auditVisualVariety(demoBoard, compiledDemo).warnings.length, 0);

  // Build synthetic repetitive 6-scene storyboard with 18s un-staged scene
  const repCues: CueFile = {
    mode: "timing-demo",
    scriptHash: "rep",
    cues: [
      { id: "c1", startMs: 0, endMs: 18000, text: "Long static block" },
      { id: "c2", startMs: 18000, endMs: 20000, text: "Two" },
      { id: "c3", startMs: 20000, endMs: 22000, text: "Three" },
      { id: "c4", startMs: 22000, endMs: 24000, text: "Four" },
      { id: "c5", startMs: 24000, endMs: 26000, text: "Five" },
      { id: "c6", startMs: 26000, endMs: 28000, text: "Six" },
    ],
  };
  const repBoard: DocumentaryStoryboard = {
    fps: 30,
    demoDurationMs: 28000,
    tailMs: 0,
    timingStatus: "provisional-cue-fixture",
    scenes: [
      { id: "S1", title: "1", start: { cueId: "c1" }, end: { cueId: "c1", edge: "end" }, layout: "split", look: "midnight-blueprint", container: "card", transition: "hard-cut" },
      { id: "S2", title: "2", start: { cueId: "c2" }, end: { cueId: "c2", edge: "end" }, layout: "single", look: "midnight-blueprint", container: "card", transition: "hard-cut" },
      { id: "S3", title: "3", start: { cueId: "c3" }, end: { cueId: "c3", edge: "end" }, layout: "stack", look: "high-contrast-ink", container: "card", transition: "hard-cut" },
      { id: "S4", title: "4", start: { cueId: "c4" }, end: { cueId: "c4", edge: "end" }, layout: "triptych", look: "evidence-desk", container: "card", transition: "hard-cut" },
      { id: "S5", title: "5", start: { cueId: "c5" }, end: { cueId: "c5", edge: "end" }, layout: "inset", look: "midnight-blueprint", container: "card", transition: "hard-cut" },
      { id: "S6", title: "6", start: { cueId: "c6" }, end: { cueId: "c6", edge: "end" }, layout: "single", look: "midnight-blueprint", container: "card", transition: "wipe" },
    ],
    beats: [],
  };
  const manifest = JSON.parse(readFileSync("videos/demo-bnpl-feels-cheaper/asset-manifest.json", "utf8"));
  const { report } = runDocumentaryQa({ cueFile: repCues, storyboard: repBoard, manifest, mode: "planning" });
  const kinds = new Set(report.variety.warnings.map((w) => w.kind));
  assert.ok(kinds.has("repeated-polarity"));
  assert.ok(kinds.has("repeated-container"));
  assert.ok(kinds.has("hard-cut-run"));
  assert.ok(kinds.has("static-long-scene"));
  assert.equal(report.variety.hardCutRatio, 0.8);

  const root = readFileSync("src/Root.tsx", "utf8");
  for (const id of ["CutawayGallery", "DynamicMotionGallery", "DynamicShowcasePilot"]) {
    assert.ok(root.includes(`id="${id}"`), `Missing ${id} in Root.tsx`);
  }
});
