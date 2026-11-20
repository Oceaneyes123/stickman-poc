import assert from "node:assert/strict";
import { test } from "node:test";
import {
  numberAt,
  rollingDigit,
  typeProgress,
} from "../src/typography/timing.ts";
test("rolling digits settle on the exact financial value and only carry at rollover", () => {
  for (const value of [480, 380, 3600, 1560, 2400, 5040, -100]) {
    for (let power = 1; power <= Math.abs(value); power *= 10)
      assert.equal(
        rollingDigit(value, power),
        Math.floor(Math.abs(value) / power) % 10,
      );
  }
  assert.equal(rollingDigit(479, 100), 4);
  assert.equal(rollingDigit(479.5, 10), 7.5);
  assert.equal(rollingDigit(499.5, 100), 4.5);
});
test("frame seeking is bounded, repeatable and numbers settle exactly for either direction", () => {
  const timing = { from: 20, until: 120 };
  assert.equal(typeProgress(19, timing).visible, false);
  assert.equal(typeProgress(120, timing).visible, false);
  assert.equal(typeProgress(50, timing).in, 1);
  for (const value of [380, 800, -100, 0]) {
    assert.equal(numberAt(19, 20, 18, value), 0);
    assert.equal(numberAt(38, 20, 18, value), value);
    const forward = Array.from({ length: 60 }, (_, f) =>
      numberAt(f, 20, 18, value),
    );
    for (let f = 59; f >= 0; f--)
      assert.equal(numberAt(f, 20, 18, value), forward[f]);
  }
  assert.throws(() => numberAt(0, 0, 0, 1), /Invalid/);
  assert.throws(() => typeProgress(0, { from: 10, until: 10 }), /positive/);
});
