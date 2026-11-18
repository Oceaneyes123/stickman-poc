import type { Rect } from "./geometry.ts";

export type ContinuityKind =
  | "product"
  | "obligation"
  | "account"
  | "document"
  | "card"
  | "calendar";

export type ContinuityStatus =
  | "shown"
  | "pending"
  | "scheduled"
  | "completed"
  | "failed"
  | "overdue";

export type ContinuityToken = {
  id: string;
  kind: ContinuityKind;
  label: string;
  amount?: number;
  status?: ContinuityStatus;
  date?: string;
  sceneId: string;
  rect?: Rect;
  /** Set true when a scene intentionally starts a new hypothetical instance of an obligation. */
  explicitReset?: boolean;
};

export type ContinuityReport = {
  valid: boolean;
  issues: string[];
  tokenCount: number;
};

/**
 * Verifies cross-scene visual and financial state continuity:
 * 1. An obligation/payment marked `completed` must not silently revert to `pending`/`scheduled`/`overdue` later.
 * 2. Tokens sharing the same ID across scenes must not contradict each other's amount or date without `explicitReset`.
 */
export function validateContinuity(
  scenes: readonly { id: string; tokens?: readonly ContinuityToken[] }[],
): ContinuityReport {
  const issues: string[] = [];
  const seen = new Map<string, ContinuityToken>();
  let tokenCount = 0;

  for (const scene of scenes) {
    for (const token of scene.tokens ?? []) {
      tokenCount++;
      const prev = seen.get(token.id);
      if (prev && !token.explicitReset) {
        if (
          prev.status === "completed" &&
          (token.status === "pending" ||
            token.status === "scheduled" ||
            token.status === "overdue")
        ) {
          issues.push(
            `Continuity regression on "${token.id}" in ${scene.id}: status reverted from completed (${prev.sceneId}) to ${token.status}`,
          );
        }
        if (
          prev.amount !== undefined &&
          token.amount !== undefined &&
          prev.amount !== token.amount
        ) {
          issues.push(
            `Amount drift on "${token.id}" between ${prev.sceneId} (${prev.amount}) and ${scene.id} (${token.amount})`,
          );
        }
        if (
          prev.date !== undefined &&
          token.date !== undefined &&
          prev.date !== token.date
        ) {
          issues.push(
            `Date drift on "${token.id}" between ${prev.sceneId} (${prev.date}) and ${scene.id} (${token.date})`,
          );
        }
      }
      seen.set(token.id, token);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    tokenCount,
  };
}
