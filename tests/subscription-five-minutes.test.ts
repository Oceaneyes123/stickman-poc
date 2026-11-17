import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("five-minute continuation assigns a graphic to every planned beat", () => {
  const timeline = readFileSync("src/scenes/subscriptionContinuationTimeline.ts", "utf8");
  const visuals = readFileSync("src/scenes/SubscriptionFiveMinutes.tsx", "utf8");
  const cueFile = JSON.parse(readFileSync("videos/003-subscription-cancellation/continuation-cues.demo.json", "utf8"));
  const beatBlock = timeline.split("const beats:")[1].split("const anchor")[0];
  const beats = [...beatBlock.matchAll(/\["([^"]+)",\s*"([^"]+)"/g)];
  const cueIds = new Set(cueFile.cues.map((cue: { id: string }) => cue.id));
  assert.ok(beats.length >= 35, "continuation needs a complete shot plan");
  assert.equal(new Set(beats.map((beat) => beat[1])).size, beats.length, "beat IDs must be unique");
  for (const [, id, cue] of beats) {
    assert.ok(cueIds.has(cue), `missing cue ${cue}`);
    assert.ok(visuals.includes(`"${id}"`), `no graphic selected for ${id}`);
  }
  assert.equal(cueFile.mode, "timing-demo");
});

test("cutaways hold long enough and return before the next opening action", () => {
  const opening = readFileSync("src/scenes/subscriptionOpeningTimeline.ts", "utf8");
  const continuation = readFileSync("src/scenes/subscriptionContinuationTimeline.ts", "utf8");
  const cutaways = opening.split("const cutaways:")[1].split("events.push")[0];
  const laterCutaways = continuation.split("const textBeats:")[1].split("const events:")[0];
  const openingRows = [...cutaways.matchAll(/\["([^"]+)",\s*\d+,\s*"([^"]+)",\s*(\d+),\s*(\d+),\s*"([^"]+)",\s*"([^"]+)"/g)];
  const laterRows = [...laterCutaways.matchAll(/\["([^"]+)",\s*"([^"]+)",\s*(\d+),\s*(\d+),\s*"([^"]+)",\s*"([^"]+)"/g)];
  assert.equal(openingRows.length, 3);
  assert.equal(laterRows.length, 8);
  for (const row of [...openingRows, ...laterRows]) {
    const wordCount = row[5].split(/\s+/).length;
    const revealFrames = 6 + (wordCount - 1) * 2;
    const readableSeconds = (Math.round(Number(row[4]) * 30 / 1000) - 7 - revealFrames) / 30;
    assert.ok(readableSeconds >= 1.3 && readableSeconds <= 2, `${row[1]} readable hold`);
    assert.ok(row[5].split(/\s+/).some((word) => word.includes(row[6])), `${row[1]} highlights a whole word`);
  }
  const actions = opening.split("const actions:")[1].split("const events:")[0];
  for (const [cutaway, nextAction] of [["getting-started", "start"], ["canceled-already", "uncertain"]]) {
    const row = openingRows.find((item) => item[1] === cutaway)!;
    const action = actions.match(new RegExp(`\\["${nextAction}",\\s*\\d+,\\s*"([^"]+)",\\s*(\\d+)`));
    assert.ok(action);
    assert.equal(action[1], row[2]);
    assert.ok(Number(action[2]) >= Number(row[3]) + Number(row[4]), `${nextAction} starts after its cutaway`);
  }
});
