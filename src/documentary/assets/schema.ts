export type AssetKind =
  | "original-svg"
  | "footage"
  | "photo"
  | "screenshot"
  | "document"
  | "chart"
  | "audio"
  | "generated";

export type AssetStatus = "pending" | "verified" | "rejected";

export type AssetCategory =
  | "context-footage"
  | "product-illustration"
  | "interface-mockup"
  | "financial-document"
  | "chart-evidence"
  | "audio-narration"
  | "audio-sfx"
  | "background-plate";

export type AssetRecord = {
  id: string;
  kind: AssetKind;
  title: string;
  creator: string | null;
  source_url: string | null;
  source_path: string | null;
  local_path: string | null;
  sha256: string | null;
  license: string | null;
  license_url: string | null;
  rights_basis: string | null;
  permitted_uses: string[];
  restrictions: string[];
  intended_use: string;
  beat_ids: string[];
  shot_ids?: string[];
  claim_ids: string[];
  attribution_text: string | null;
  attribution_placement: string | null;
  evidence_paths: string[];
  verified_on: string | null;
  verified_by: string | null;
  status: AssetStatus;
  parent_asset_id: string | null;
  modifications: string[];
  authenticity: string;
  disclosure: string;
  fallback_asset_id?: string | null;
  /** Optional technical metadata for asset checks */
  category?: AssetCategory;
  width?: number;
  height?: number;
  aspect_ratio?: string;
  duration_ms?: number;
};

export type AssetManifest = {
  version: 1;
  episode?: string;
  planning_only?: boolean;
  note?: string;
  assets: AssetRecord[];
};
