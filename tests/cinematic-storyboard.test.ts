import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  cinematicStillShots,
  stillDirection,
  compositionCategories,
  allocationParts,
  allocationRemainder,
  storyboardViews,
} from "../src/storyboard/cinematicStillPlan.ts";
import { validateCamera } from "../src/animation/direction.ts";
test("cinematic still plan covers all 99 panels in 67 scenes, including new reference-scene stills", () => {
  const ids = [
    ...new Set([...cinematicStillShots.map((shot) => shot.scene)]),
  ].sort();
  assert.deepEqual(
    ids,
    Array.from({ length: 67 }, (_, i) => `S${String(i + 1).padStart(2, "0")}`),
  );
  assert.equal(
    new Set(cinematicStillShots.map((shot) => shot.id)).size,
    cinematicStillShots.length,
  );
  assert.equal(cinematicStillShots.length, 99);
  for (const shot of cinematicStillShots) {
    const design = stillDirection(shot);
    assert(compositionCategories.includes(design.category));
    assert(
      design.camera && design.subject && design.action && design.propFocus,
    );
  }
  for (const view of Object.values(storyboardViews)) validateCamera(view);
});

test("shot direction uses the whole vocabulary without five consecutive phone, desk or paper subjects", () => {
  const categories = new Set(
    cinematicStillShots.map((shot) => stillDirection(shot).category),
  );
  assert.equal(categories.size, compositionCategories.length);
  let run = 0;
  for (const shot of cinematicStillShots) {
    const focus = stillDirection(shot).propFocus;
    run = ["phone", "desk", "document"].includes(focus) ? run + 1 : 0;
    assert(run < 5, `Repeated information-prop cluster ending ${shot.id}`);
  }
});
test("storyboard renderer is still-only and visible typography uses the currency formatter", () => {
  const renderer = readFileSync(
    "scripts/render/render-cinematic-storyboard.ts",
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
  assert(!/<text\b/.test(art));
  assert(art.includes('<g stroke="none">'));
});

test("the raise stays finite across apartment, rental and combined recurring-cost reveals", () => {
  assert.deepEqual(allocationParts(1), [300]);
  assert.deepEqual(allocationParts(2), [300, 220]);
  assert.deepEqual(allocationParts(3), [300, 220, 100]);
  assert.equal(allocationRemainder(1), 300);
  assert.equal(allocationRemainder(2), 80);
  assert.equal(allocationRemainder(3), -20);
});
