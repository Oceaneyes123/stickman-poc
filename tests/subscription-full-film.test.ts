import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compileTimeline, msToFrames } from "../src/timeline/compiler.ts";
import type { CueFile, Storyboard, StoryEvent } from "../src/timeline/types.ts";

test("ending covers the remaining narration and preserves the measured film endpoint", () => {
  const raw = JSON.parse(readFileSync("videos/003-subscription-cancellation/ending-cues.demo.json", "utf8"));
  const closing = JSON.parse(readFileSync("videos/003-subscription-cancellation/closing-cue.demo.json", "utf8"));
  const source = readFileSync("src/scenes/subscriptionEndingTimeline.ts", "utf8");
  const visuals = readFileSync("src/scenes/SubscriptionFullFilm.tsx", "utf8");
  const beats = [...source.split("const beats:")[1].split("const texts:")[0].matchAll(/\["([^"]+)",\s*"([^"]+)"\]/g)];
  const textRows = [...source.split("const texts:")[1].split("const events:")[0].matchAll(/\["([^"]+)",\s*"([^"]+)",\s*(\d+),\s*"([^"]+)",\s*"([^"]+)"\]/g)];
  assert.equal(raw.mode, "timing-demo");
  assert.equal(beats.length, 25);
  assert.equal(textRows.length, 4);
  for (const [, id] of beats) assert.ok(visuals.includes(`"${id}"`), `missing ending graphic ${id}`);
  const events: StoryEvent[] = textRows.map(([, sceneId, cueId, offset, text, highlight]) => ({
    id: `text-${sceneId}`, sceneId, cueId, offsetMs: Number(offset), durationMs: 2200,
    reason: "Draft phrase timing", kind: "payoff", track: "cutaway", payload: { text, highlight },
  }));
  const lastCue = closing.cue;
  events.push({id:"end-card",sceneId:"call-to-action",cueId:lastCue.id,
    offsetMs:closing.audioDurationMs-299200-lastCue.startMs,durationMs:2000,
    reason:"Measured audio end",kind:"payoff",track:"end-card",payload:{}});
  const board: Storyboard = {fps:30,demoDurationMs:closing.audioDurationMs-299200,tailMs:2000,events,
    scenes:beats.map(([,id,cueId],i)=>({id,title:id,template:"story",start:{cueId},
      end:i+1<beats.length?{cueId:beats[i+1][2]}:{cueId:"closing-cta",edge:"end"}}))};
  const timeline=compileTimeline({...raw,cues:[...raw.cues,closing.cue]} as CueFile,board);
  assert.equal(msToFrames(299200,30)+timeline.durationInFrames,msToFrames(closing.audioDurationMs+2000,30));
  const end=timeline.events.find(event=>event.id==="end-card")!;
  assert.equal(end.from,msToFrames(closing.audioDurationMs-299200,30));
  assert.ok(closing.cue.startMs >= raw.audioDurationMs-299200);
  assert.equal(closing.cue.endMs, closing.audioDurationMs-299200);
  for (const row of textRows) {
    const readableFrames=66-7-(6+(row[4].split(/\s+/).length-1)*2);
    assert.ok(readableFrames/30>=1.3, `${row[1]} needs a readable hold`);
    assert.ok(row[4].split(/\s+/).some(word=>word.includes(row[5])), `${row[1]} has a highlighted word`);
  }
  const film=visuals.split("export const SubscriptionFullFilm:")[1];
  assert.equal((film.match(/<Audio\b/g)??[]).length,1);
});
