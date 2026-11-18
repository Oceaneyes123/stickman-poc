import type { CueFile } from "../timeline/types.ts";
import {
  validateManifestStructure,
  type ManifestValidationReport,
} from "./assets/registry.ts";
import type { AssetManifest } from "./assets/schema.ts";
import { validateContinuity, type ContinuityReport } from "./core/continuity.ts";
import { withinSideSafe } from "./core/geometry.ts";
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
  kind: "repeated-layout" | "repeated-subject" | "low-medium-variety";
  message: string;
};

export type VarietyAuditReport = {
  sceneCount: number;
  uniqueLayouts: string[];
  uniqueDominantObjects: string[];
  uniqueMediums: string[];
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
): VarietyAuditReport {
  const warnings: VarietyWarning[] = [];
  const layouts = new Set<string>();
  const objects = new Set<string>();
  const mediums = new Set<string>();

  for (let i = 0; i < board.scenes.length; i++) {
    const s = board.scenes[i];
    layouts.add(s.layout);
    if (s.dominantObject) objects.add(s.dominantObject);
    for (const m of s.mediums ?? []) mediums.add(m);

    if (i > 0) {
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

  if (board.scenes.length >= 4 && layouts.size < 3) {
    warnings.push({
      sceneId: board.scenes[0].id,
      kind: "low-medium-variety",
      message: `Storyboard uses only ${layouts.size} distinct layouts across ${board.scenes.length} scenes`,
    });
  }

  return {
    sceneCount: board.scenes.length,
    uniqueLayouts: [...layouts],
    uniqueDominantObjects: [...objects],
    uniqueMediums: [...mediums],
    warnings,
    disclaimer:
      "Heuristic visual-variety audit flags repeated layouts or subjects; it does not certify creative quality.",
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
  const variety = auditVisualVariety(params.storyboard);

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
