import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  alexAnnual,
  alexThreeMonths,
  baselineThreeMonths,
  budget,
  monthOne,
  monthTwo,
  parseStoryboard,
  remainingShots,
  samAnnual,
  samThreeMonths,
} from "../src/storyboard/remainingShots.ts";
const markdown = readFileSync(
  "videos/001-lifestyle-creep/storyboard.md",
  "utf8",
);
test("remaining storyboard covers every S07–S67 scene with exact source narration and cue beats", () => {
  const board = parseStoryboard(markdown);
  assert.equal(board.length, 67);
  assert.equal(remainingShots.length, 61);
  assert.deepEqual(
    remainingShots.map((s) => s[0]),
    Array.from({ length: 61 }, (_, i) => `S${String(i + 7).padStart(2, "0")}`),
  );
  const narration = readFileSync(
    "videos/001-lifestyle-creep/narration.txt",
    "utf8",
  ).replace(/\s+/g, " ");
  for (const [id] of remainingShots) {
    const scene = board.find((s) => s.id === id)!;
    assert(scene);
    assert(narration.includes(scene.narration.replace(/\s+/g, " ")), id);
    assert(scene.cueIds.length > 0);
  }
});
test("storyboard keeps monthly, cumulative, revised, and separate annual results distinct", () => {
  assert.equal(monthOne, 700);
  assert.equal(monthTwo, 480);
  assert.equal(budget.sam, 380);
  assert.equal(samThreeMonths, 1560);
  assert.equal(baselineThreeMonths, 1200);
  assert.equal(alexThreeMonths, 2400);
  assert.equal(alexThreeMonths - samThreeMonths, 840);
  assert.equal(budget.alex - budget.sam, 420);
  assert.equal(samAnnual, 4560);
  assert.equal(alexAnnual, 9600);
  assert.equal(alexAnnual - samAnnual, 5040);
});
test("storyboard parser rejects missing direction or narration instead of silently dropping content", () => {
  assert.throws(
    () =>
      parseStoryboard(markdown.replace("**Camera movement:**", "**Missing:**")),
    /Missing Camera movement/,
  );
  assert.throws(
    () => parseStoryboard(markdown.replace(/^> .+$/m, "")),
    /Missing narration/,
  );
});
