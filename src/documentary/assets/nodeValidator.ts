import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { AssetManifest } from "./schema.ts";
import {
  validateManifestStructure,
  type ManifestIssue,
  type ManifestValidationOptions,
  type ManifestValidationReport,
} from "./registry.ts";

export function sha256File(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

/**
 * Node-only filesystem + hash verification on top of `validateManifestStructure`.
 * Verifies local file existence and sha256 match, never legal copyright clearance.
 */
export function validateManifestFiles(
  manifest: AssetManifest,
  options: ManifestValidationOptions = { mode: "delivery" },
  repoRoot = process.cwd(),
): ManifestValidationReport {
  const base = validateManifestStructure(manifest, options);
  const issues: ManifestIssue[] = [...base.issues];

  for (const asset of manifest.assets) {
    if (asset.local_path) {
      const abs = resolve(repoRoot, asset.local_path);
      if (!existsSync(abs)) {
        issues.push({
          assetId: asset.id,
          severity: options.mode === "delivery" ? "error" : "warning",
          message: `Missing local_path "${asset.local_path}"`,
        });
      } else if (asset.sha256) {
        const actual = sha256File(abs);
        if (actual !== asset.sha256) {
          issues.push({
            assetId: asset.id,
            severity: "error",
            message: `SHA-256 mismatch for "${asset.local_path}": expected ${asset.sha256.slice(0, 12)}..., got ${actual.slice(0, 12)}...`,
          });
        }
      }
    }

    if (asset.source_path && !asset.source_path.startsWith("code:")) {
      const abs = resolve(repoRoot, asset.source_path);
      if (!existsSync(abs)) {
        issues.push({
          assetId: asset.id,
          severity: options.mode === "delivery" ? "error" : "warning",
          message: `Missing source_path "${asset.source_path}"`,
        });
      }
    }

    for (const evPath of asset.evidence_paths) {
      const abs = resolve(repoRoot, evPath);
      if (!existsSync(abs)) {
        issues.push({
          assetId: asset.id,
          severity: options.mode === "delivery" ? "error" : "warning",
          message: `Missing evidence file "${evPath}"`,
        });
      }
    }
  }

  return {
    ...base,
    valid: !issues.some((i) => i.severity === "error"),
    issues,
  };
}
