import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  cinematicStillShots,
  referenceScenes,
  storyboardViews,
} from "../src/storyboard/cinematicStillPlan.ts";
import { validateCamera } from "../src/animation/direction.ts";
test("cinematic still plan upgrades every scene and preserves the six existing references", () => {
  const ids = [
    ...new Set([
      ...cinematicStillShots.map((shot) => shot.scene),
      ...referenceScenes,
    ]),
  ].sort();
  assert.deepEqual(
    ids,
    Array.from({ length: 67 }, (_, i) => `S${String(i + 1).padStart(2, "0")}`),
  );
  assert.equal(
    new Set(cinematicStillShots.map((shot) => shot.id)).size,
    cinematicStillShots.length,
  );
  for (const shot of cinematicStillShots)
    assert(
      !referenceScenes.includes(shot.scene as (typeof referenceScenes)[number]),
    );
  for (const view of Object.values(storyboardViews)) validateCamera(view);
});
test("storyboard renderer is still-only and visible typography uses the currency formatter", () => {
  const renderer = readFileSync(
    "scripts/render-cinematic-storyboard.ts",
    "utf8",
  );
  assert(!renderer.includes("renderMedia"));
  assert(!renderer.includes("Audio src"));
  const art = readFileSync(
    "src/storyboard/CinematicStoryboardStudy.tsx",
    "utf8",
  );
  assert.equal((art.match(/<SceneText\b/g) ?? []).length, 1);
  assert(art.includes("usd(value)"));
});
