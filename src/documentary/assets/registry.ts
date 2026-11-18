import type { AssetKind, AssetManifest, AssetRecord } from "./schema.ts";

export const ASSET_VALIDATION_DISCLAIMER =
  "Manifest validation checks local record completeness and file hashes only; it does not verify copyright ownership or legal licensing rights.";

export type ManifestValidationOptions = {
  mode: "planning" | "delivery";
  expectedAspectRatio?: string;
  minWidth?: number;
  minHeight?: number;
};

export type ManifestIssue = {
  assetId: string;
  severity: "error" | "warning";
  message: string;
};

export type ManifestValidationReport = {
  valid: boolean;
  mode: "planning" | "delivery";
  assetCount: number;
  verifiedCount: number;
  pendingCount: number;
  rejectedCount: number;
  issues: ManifestIssue[];
  disclaimer: string;
};

export const isRemoteUrl = (path: string | null | undefined): boolean =>
  typeof path === "string" && /^https?:\/\//i.test(path.trim());

/**
 * Pure structural and metadata validation for an `AssetManifest`.
 * Does not touch the filesystem and never certifies legal copyright clearance.
 */
export function validateManifestStructure(
  manifest: AssetManifest,
  options: ManifestValidationOptions = { mode: "planning" },
): ManifestValidationReport {
  const issues: ManifestIssue[] = [];
  if (manifest.version !== 1) {
    issues.push({
      assetId: "__manifest__",
      severity: "error",
      message: `Unsupported manifest version ${String(manifest.version)}`,
    });
  }

  const seen = new Set<string>();
  const ids = new Set(manifest.assets.map((a) => a.id));

  for (const asset of manifest.assets) {
    if (!asset.id || !asset.id.trim()) {
      issues.push({
        assetId: "__manifest__",
        severity: "error",
        message: "Asset id must be non-empty",
      });
    } else if (seen.has(asset.id)) {
      issues.push({
        assetId: asset.id,
        severity: "error",
        message: `Duplicate asset id "${asset.id}"`,
      });
    }
    seen.add(asset.id);

    if (!["pending", "verified", "rejected"].includes(asset.status)) {
      issues.push({
        assetId: asset.id,
        severity: "error",
        message: `Invalid status "${String(asset.status)}"`,
      });
    }

    if (isRemoteUrl(asset.local_path) || isRemoteUrl(asset.source_path)) {
      issues.push({
        assetId: asset.id,
        severity: "error",
        message: "Offline rendering prohibits remote URLs in local_path or source_path",
      });
    }

    if (asset.parent_asset_id && !ids.has(asset.parent_asset_id)) {
      issues.push({
        assetId: asset.id,
        severity: "error",
        message: `Missing parent_asset_id "${asset.parent_asset_id}"`,
      });
    }

    if (asset.fallback_asset_id && !ids.has(asset.fallback_asset_id)) {
      issues.push({
        assetId: asset.id,
        severity: "error",
        message: `Missing fallback_asset_id "${asset.fallback_asset_id}"`,
      });
    }

    if (asset.width !== undefined && (!Number.isFinite(asset.width) || asset.width <= 0)) {
      issues.push({
        assetId: asset.id,
        severity: "error",
        message: `Invalid width ${asset.width}`,
      });
    }
    if (asset.height !== undefined && (!Number.isFinite(asset.height) || asset.height <= 0)) {
      issues.push({
        assetId: asset.id,
        severity: "error",
        message: `Invalid height ${asset.height}`,
      });
    }

    if (
      options.expectedAspectRatio &&
      asset.aspect_ratio &&
      asset.aspect_ratio !== options.expectedAspectRatio
    ) {
      issues.push({
        assetId: asset.id,
        severity: "warning",
        message: `Aspect ratio "${asset.aspect_ratio}" differs from expected "${options.expectedAspectRatio}"`,
      });
    }

    if (
      options.minWidth !== undefined &&
      asset.width !== undefined &&
      asset.width < options.minWidth
    ) {
      issues.push({
        assetId: asset.id,
        severity: "warning",
        message: `Width ${asset.width}px is below minimum ${options.minWidth}px`,
      });
    }

    if (
      options.minHeight !== undefined &&
      asset.height !== undefined &&
      asset.height < options.minHeight
    ) {
      issues.push({
        assetId: asset.id,
        severity: "warning",
        message: `Height ${asset.height}px is below minimum ${options.minHeight}px`,
      });
    }

    if (options.mode === "delivery") {
      if (asset.status !== "verified") {
        issues.push({
          assetId: asset.id,
          severity: "error",
          message: `Delivery requires status "verified" (found "${asset.status}")`,
        });
      }
      if (!asset.local_path && !asset.source_path) {
        issues.push({
          assetId: asset.id,
          severity: "error",
          message: "Delivery asset must specify local_path or source_path",
        });
      }
      if (asset.local_path && !asset.sha256) {
        issues.push({
          assetId: asset.id,
          severity: "error",
          message: "Delivery asset with local_path must record sha256",
        });
      }
      if (!asset.license && !asset.rights_basis) {
        issues.push({
          assetId: asset.id,
          severity: "error",
          message: "Delivery asset must record license or rights_basis",
        });
      }
      if (asset.attribution_text && !asset.attribution_placement) {
        issues.push({
          assetId: asset.id,
          severity: "error",
          message: "Attribution text requires attribution_placement",
        });
      }
      if (!asset.verified_on || !/^\d{4}-\d{2}-\d{2}$/.test(asset.verified_on)) {
        issues.push({
          assetId: asset.id,
          severity: "error",
          message: "Delivery asset requires verified_on in YYYY-MM-DD",
        });
      }
    }
  }

  const verifiedCount = manifest.assets.filter((a) => a.status === "verified").length;
  const pendingCount = manifest.assets.filter((a) => a.status === "pending").length;
  const rejectedCount = manifest.assets.filter((a) => a.status === "rejected").length;
  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    valid: !hasErrors,
    mode: options.mode,
    assetCount: manifest.assets.length,
    verifiedCount,
    pendingCount,
    rejectedCount,
    issues,
    disclaimer: ASSET_VALIDATION_DISCLAIMER,
  };
}

export type AssetRegistry = {
  manifest: AssetManifest;
  get: (id: string) => AssetRecord | undefined;
  listByKind: (kind: AssetKind) => AssetRecord[];
  listByBeat: (beatId: string) => AssetRecord[];
  resolveRenderPath: (
    id: string,
    options?: { allowPendingPlaceholder?: boolean },
  ) => string | null;
};

/**
 * Browser-safe typed registry for Remotion compositions and timeline specs.
 * Normalizes `public/` paths to relative `staticFile`-compatible paths.
 */
export function createAssetRegistry(manifest: AssetManifest): AssetRegistry {
  const byId = new Map(manifest.assets.map((a) => [a.id, a]));
  return {
    manifest,
    get: (id) => byId.get(id),
    listByKind: (kind) => manifest.assets.filter((a) => a.kind === kind),
    listByBeat: (beatId) =>
      manifest.assets.filter((a) => a.beat_ids.includes(beatId)),
    resolveRenderPath: (id, options) => {
      const record = byId.get(id);
      if (!record) return null;
      if (record.status === "rejected") return null;
      if (record.status === "pending" && !options?.allowPendingPlaceholder) {
        return null;
      }
      const raw = record.local_path ?? record.source_path;
      if (!raw || isRemoteUrl(raw)) return null;
      return raw.replace(/\\/g, "/").replace(/^public\//, "");
    },
  };
}
