import type { CueFile } from "../timeline/types.ts";
import {
  validateManifestStructure,
  type ManifestValidationReport,
} from "./assets/registry.ts";
import type { AssetManifest } from "./assets/schema.ts";
import { validateContinuity, type ContinuityReport } from "./core/continuity.ts";
import { withinSideSafe } from "./core/geometry.ts";
import { getLook } from "./core/looks.ts";
import { checkTextFit, type TextFitResult } from "./core/textMetrics.ts";
import {
  compileDocumentaryTimeline,
  type CompiledDocumentaryTimeline,
  type DocumentaryStoryboard,
  type TimingStatus,
} from "./timeline.ts";

export type LayoutIssue = {
  sceneId: string;
  layerId: string;
  message: string;
};

export type TextOverflowIssue = TextFitResult & {
  sceneId: string;
  message: string;
};

export type VarietyWarning = {
  sceneId: string;
  kind:
    | "repeated-layout"
    | "repeated-subject"
    | "low-medium-variety"
    | "repeated-polarity"
    | "repeated-container"
    | "hard-cut-run"
    | "static-long-scene";
  message: string;
};

export type VarietyAuditReport = {
  sceneCount: number;
  uniqueLayouts: string[];
  uniqueDominantObjects: string[];
  uniqueMediums: string[];
  uniqueLooks: string[];
  uniquePolarities: string[];
  uniqueContainers: string[];
  uniqueMotionProfiles: string[];
  hardCutRatio: number;
  warnings: VarietyWarning[];
  disclaimer: string;
};

export type DocumentaryQaReport = {
  passed: boolean;
  timingStatus: TimingStatus;
  timeline: {
    fps: number;
    durationMs: number;
    durationInFrames: number;
    sceneCount: number;
    beatCount: number;
  };
  manifest: ManifestValidationReport;
  missingAssets: { sceneId: string; assetId: string; reason: string }[];
  layoutIssues: LayoutIssue[];
  textIssues: TextOverflowIssue[];
  continuity: ContinuityReport;
  variety: VarietyAuditReport;
  approvals: {
    technicalQa: "passed" | "failed";
    visualCreativeApproval: "requires human review";
    audioListeningApproval: "pending" | "approved";
  };
};

export function auditVisualVariety(
  board: DocumentaryStoryboard,
  compiled?: CompiledDocumentaryTimeline,
): VarietyAuditReport {
  const warnings: VarietyWarning[] = [];
  const layouts = new Set<string>();
  const objects = new Set<string>();
  const mediums = new Set<string>();
  const looks = new Set<string>();
  const polarities = new Set<string>();
  const containers = new Set<string>();
  const motionProfiles = new Set<string>();

  let polarityRun = 0;
  let lastPolarity: string | null = null;
  let cardRun = 0;
  let hardCutRun = 0;
  let hardCutsAfterFirst = 0;

  for (let i = 0; i < board.scenes.length; i++) {
    const s = board.scenes[i];
    layouts.add(s.layout);
    if (s.dominantObject) objects.add(s.dominantObject);
    for (const m of s.mediums ?? []) mediums.add(m);
    if (s.motionProfile) motionProfiles.add(s.motionProfile);

    if (s.look) {
      looks.add(s.look);
      const pol = getLook(s.look).polarity;
      polarities.add(pol);
      if (pol === lastPolarity) {
        polarityRun++;
      } else {
        polarityRun = 1;
        lastPolarity = pol;
      }
      if (polarityRun === 4) {
        warnings.push({
          sceneId: s.id,
          kind: "repeated-polarity",
          message: `Scene ${s.id} extends a ${polarityRun}-scene "${pol}" surface-polarity run`,
        });
      }
    } else {
      polarityRun = 0;
      lastPolarity = null;
    }

    if (s.container) {
      containers.add(s.container);
      if (s.container === "card") {
        cardRun++;
        if (cardRun === 4) {
          warnings.push({
            sceneId: s.id,
            kind: "repeated-container",
            message: `Scene ${s.id} extends a ${cardRun}-scene boxed "card" container run`,
          });
        }
      } else {
        cardRun = 0;
      }
    } else {
      cardRun = 0;
    }

    if (s.transition === "hard-cut") {
      hardCutRun++;
      if (board.scenes.length >= 6 && hardCutRun === 5) {
        warnings.push({
          sceneId: s.id,
          kind: "hard-cut-run",
          message: `Scene ${s.id} extends a ${hardCutRun}-scene explicit "hard-cut" run`,
        });
      }
    } else {
      hardCutRun = 0;
    }

    if (i > 0) {
      if ((s.transition ?? "hard-cut") === "hard-cut") {
        hardCutsAfterFirst++;
      }
      const prev = board.scenes[i - 1];
      if (s.layout === prev.layout) {
        warnings.push({
          sceneId: s.id,
          kind: "repeated-layout",
          message: `Scene ${s.id} repeats layout "${s.layout}" from ${prev.id}`,
        });
      }
      if (
        s.dominantObject &&
        prev.dominantObject &&
        s.dominantObject === prev.dominantObject
      ) {
        warnings.push({
          sceneId: s.id,
          kind: "repeated-subject",
          message: `Scene ${s.id} repeats dominantObject "${s.dominantObject}" from ${prev.id}`,
        });
      }
    }
  }

  if (compiled) {
    for (const cs of compiled.scenes) {
      if (
        cs.durationInFrames > 450 &&
        (cs.stageCount ?? 0) < 2 &&
        cs.beats.length < 2
      ) {
        warnings.push({
          sceneId: cs.id,
          kind: "static-long-scene",
          message: `Long scene ${cs.id} (${cs.durationInFrames}f > 15s) has fewer than 2 sub-stages or beats`,
        });
      }
    }
  }

  if (board.scenes.length >= 4 && layouts.size < 3) {
    warnings.push({
      sceneId: board.scenes[0].id,
      kind: "low-medium-variety",
      message: `Storyboard uses only ${layouts.size} distinct layouts across ${board.scenes.length} scenes`,
    });
  }

  const hardCutRatio =
    board.scenes.length <= 1
      ? 0
      : Math.round((hardCutsAfterFirst / (board.scenes.length - 1)) * 100) / 100;

  return {
    sceneCount: board.scenes.length,
    uniqueLayouts: [...layouts],
    uniqueDominantObjects: [...objects],
    uniqueMediums: [...mediums],
    uniqueLooks: [...looks],
    uniquePolarities: [...polarities],
    uniqueContainers: [...containers],
    uniqueMotionProfiles: [...motionProfiles],
    hardCutRatio,
    warnings,
    disclaimer:
      "Heuristic visual-variety audit flags repeated layouts, polarities, containers, cut runs, or un-staged long scenes; it does not certify creative quality.",
  };
}

export function runDocumentaryQa(params: {
  cueFile: CueFile;
  storyboard: DocumentaryStoryboard;
  manifest: AssetManifest;
  mode?: "planning" | "delivery";
  audioDurationMs?: number;
}): {
  report: DocumentaryQaReport;
  compiled: CompiledDocumentaryTimeline;
} {
  const mode = params.mode ?? "planning";
  const compiled = compileDocumentaryTimeline(
    params.cueFile,
    params.storyboard,
    params.audioDurationMs,
  );
  const manifestReport = validateManifestStructure(params.manifest, { mode });
  const assetMap = new Map(params.manifest.assets.map((a) => [a.id, a]));

  const missingAssets: DocumentaryQaReport["missingAssets"] = [];
  const layoutIssues: LayoutIssue[] = [];
  const textIssues: TextOverflowIssue[] = [];

  for (const scene of params.storyboard.scenes) {
    for (const assetId of scene.assetIds ?? []) {
      const asset = assetMap.get(assetId);
      if (!asset) {
        missingAssets.push({
          sceneId: scene.id,
          assetId,
          reason: "Asset ID not found in manifest",
        });
      } else if (asset.status === "rejected") {
        missingAssets.push({
          sceneId: scene.id,
          assetId,
          reason: "Asset status is rejected",
        });
      } else if (mode === "delivery" && asset.status !== "verified") {
        missingAssets.push({
          sceneId: scene.id,
          assetId,
          reason: `Delivery requires verified asset (found ${asset.status})`,
        });
      }
    }

    for (const lb of scene.layerBounds ?? []) {
      if (lb.essential !== false && !withinSideSafe(lb.rect)) {
        layoutIssues.push({
          sceneId: scene.id,
          layerId: lb.id,
          message: `Essential layer "${lb.id}" crosses 96px side safe margin (x=${lb.rect.x}, width=${lb.rect.width})`,
        });
      }
    }

    for (const tb of scene.textBounds ?? []) {
      const res = checkTextFit(tb);
      if (!res.fits || !res.minPhoneFontSizeOk) {
        const reasons: string[] = [];
        if (res.overflowX > 0) reasons.push(`overflowX=${res.overflowX}px`);
        if (res.overflowY > 0) reasons.push(`overflowY=${res.overflowY}px`);
        if (res.exceedsMaxLines) reasons.push(`lines=${res.lines.length} > maxLines=${tb.maxLines}`);
        if (!res.minPhoneFontSizeOk) reasons.push(`fontSize=${tb.fontSize}px < 22px phone min`);
        textIssues.push({
          ...res,
          sceneId: scene.id,
          message: `Text "${tb.id}" failed fit check: ${reasons.join(", ")}`,
        });
      }
    }
  }

  const continuity = validateContinuity(
    params.storyboard.scenes.map((s) => ({
      id: s.id,
      tokens: s.continuityTokens,
    })),
  );
  const variety = auditVisualVariety(params.storyboard, compiled);

  const passed =
    manifestReport.valid &&
    missingAssets.length === 0 &&
    layoutIssues.length === 0 &&
    textIssues.length === 0 &&
    continuity.valid;

  const report: DocumentaryQaReport = {
    passed,
    timingStatus: compiled.timingStatus,
    timeline: {
      fps: compiled.fps,
      durationMs: compiled.durationMs,
      durationInFrames: compiled.durationInFrames,
      sceneCount: compiled.scenes.length,
      beatCount: compiled.beats.length,
    },
    manifest: manifestReport,
    missingAssets,
    layoutIssues,
    textIssues,
    continuity,
    variety,
    approvals: {
      technicalQa: passed ? "passed" : "failed",
      visualCreativeApproval: "requires human review",
      audioListeningApproval:
        compiled.timingStatus === "listening-approved" ? "approved" : "pending",
    },
  };

  return { report, compiled };
}
