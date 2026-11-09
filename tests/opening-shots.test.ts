import assert from "node:assert/strict";
import { test } from "node:test";
import { referenceSkeleton } from "../src/characters/referenceModel.ts";
import {
  openingBaseShot,
  openingCameras,
  openingShots,
} from "../src/storyboard/openingShots.ts";

test("opening still packet covers only S01–S06 with unique shots and the correct audio paragraphs", () => {
  assert.equal(openingShots.length, 16);
  assert.equal(new Set(openingShots.map((shot) => shot.id)).size, 16);
  assert.deepEqual(
    [...new Set(openingShots.map((shot) => shot.scene))],
    ["S01", "S02", "S03", "S04", "S05", "S06"],
  );
  for (const shot of openingShots)
    assert(shot.cue.startsWith(shot.scene === "S06" ? "p002-" : "p001-"));
});

test("reaction close-up keeps both computed hands inside the frame", () => {
  const [x, y, width, height] = openingCameras["s01-b-reaction-close"].viewBox;
  const rig = referenceSkeleton({
    frame: 60,
    pose: "thinking",
    fromPose: "thinking",
    gesture: "holdWallet",
    blendFrames: 1,
  });
  const handRadius = 24 * 2.7;
  for (const arm of [rig.leftArm, rig.rightArm]) {
    const handX = 570 + arm.end.x * 2.7;
    const handY = 965 + arm.end.y * 2.7;
    assert(handX - handRadius >= x && handX + handRadius <= x + width);
    assert(handY - handRadius >= y && handY + handRadius <= y + height);
  }
});

test("camera studies preserve the source shot while providing valid wide, close and angle alternatives", () => {
  const ids = new Set(openingShots.map((shot) => shot.id));
  for (const shot of openingShots) {
    assert(ids.has(openingBaseShot(shot.id)));
    const camera = openingCameras[shot.id];
    const [x, y, width, height] = camera.viewBox;
    assert(x >= 0 && y >= 0 && width > 0 && height > 0);
    assert(x + width <= 1920 && y + height <= 1080);
    assert(Math.abs(width / height - 16 / 9) < 1e-9);
    assert(camera.angle.length > 0);
  }
  assert.equal(
    openingBaseShot("s01-b-reaction-close"),
    "s01-b-three-months-later",
  );
  assert(
    openingCameras["s01-a-raise-close"].viewBox[2] <
      openingCameras["s01-a-raise"].viewBox[2],
  );
  assert(
    openingCameras["s02-a-apartment-wide"].viewBox[2] >
      openingCameras["s02-a-apartment"].viewBox[2],
  );
});
