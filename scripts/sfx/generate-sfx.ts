/**
 * Builds the reusable sound-effect library in public/sfx.
 *
 * Every cue is synthesised from oscillators, noise, filters and envelopes with a
 * fixed seed: original audio, no samples, no licence, no network, no paid API.
 * The run is deterministic, so regenerating after a tweak produces the same WAV
 * for any cue you did not touch.
 *
 *   npm run sfx
 *
 * The catalogue (name, category, exact length, default level) lives in
 * src/audio/cues.ts; a recipe missing for a cue is a type error.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SFX_CUES, SFX_NAMES, type SfxName } from "../../src/audio/cues.ts";

const SR = 44100;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../../public/sfx");

type Sig = Float32Array;

const frames = (seconds: number) => Math.max(1, Math.round(seconds * SR));

/** mulberry32: same numbers every run, no Math.random anywhere. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const buffer = (seconds: number): Sig => new Float32Array(frames(seconds));

function noiseOf(seconds: number, rnd: () => number): Sig {
  const out = buffer(seconds);
  for (let i = 0; i < out.length; i++) out[i] = rnd() * 2 - 1;
  return out;
}

/** Sine whose frequency follows f(t): phase is integrated, so no drift. */
function tone(seconds: number, f: (t: number) => number): Sig {
  const out = buffer(seconds);
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    phase += (2 * Math.PI * Math.max(1, f(i / SR))) / SR;
    out[i] = Math.sin(phase);
  }
  return out;
}

const chirp = (seconds: number, f0: number, f1: number, exp = true) =>
  tone(seconds, (t) =>
    exp
      ? f0 * Math.pow(f1 / f0, Math.min(1, t / seconds))
      : f0 + ((f1 - f0) * Math.min(1, t / seconds)),
  );

/** Sawtooth stack with a rolloff, for brass and motor bodies. */
function reed(seconds: number, f: (t: number) => number, partials = 8): Sig {
  const out = buffer(seconds);
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    phase += (2 * Math.PI * Math.max(1, f(i / SR))) / SR;
    let v = 0;
    for (let h = 1; h <= partials; h++) v += Math.sin(phase * h) / h;
    out[i] = v * (2 / Math.PI);
  }
  return out;
}

/** Attack ramp then exponential decay; decay is the time to roughly -35 dB. */
function envExp(seconds: number, attack = 0.004, decay = seconds, curve = 4): Sig {
  const out = buffer(seconds);
  const atk = Math.max(1, Math.round(attack * SR));
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const a = i < atk ? i / atk : 1;
    out[i] = a * Math.exp((-curve * t) / Math.max(0.005, decay));
  }
  return out;
}

/** Symmetric swell used for sweeps: up to `peak` then back down. */
function envBell(seconds: number, peak = 0.6, power = 1.6): Sig {
  const out = buffer(seconds);
  for (let i = 0; i < out.length; i++) {
    const x = i / (out.length - 1 || 1);
    const v = x < peak ? x / peak : (1 - x) / (1 - peak);
    out[i] = Math.pow(Math.max(0, v), power);
  }
  return out;
}

function envFade(seconds: number, fadeIn: number, fadeOut: number, hold = 1): Sig {
  const out = buffer(seconds);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const up = fadeIn > 0 ? Math.min(1, t / fadeIn) : 1;
    const down = fadeOut > 0 ? Math.min(1, (seconds - t) / fadeOut) : 1;
    out[i] = hold * Math.max(0, Math.min(up, down));
  }
  return out;
}

type Biquad = "lp" | "hp" | "bp";

function biquad(x: Sig, type: Biquad, freq: number, q = 0.707): Sig {
  const w = (2 * Math.PI * Math.min(Math.max(freq, 20), SR * 0.45)) / SR;
  const cos = Math.cos(w);
  const alpha = Math.sin(w) / (2 * q);
  const a0 = 1 + alpha;
  const a1 = -2 * cos;
  const a2 = 1 - alpha;
  let b0: number, b1: number, b2: number;
  if (type === "lp") {
    b0 = (1 - cos) / 2;
    b1 = 1 - cos;
    b2 = (1 - cos) / 2;
  } else if (type === "hp") {
    b0 = (1 + cos) / 2;
    b1 = -(1 + cos);
    b2 = (1 + cos) / 2;
  } else {
    b0 = alpha;
    b1 = 0;
    b2 = -alpha;
  }
  const out = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const y = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1;
    x1 = x[i];
    y2 = y1;
    y1 = y;
    out[i] = y;
  }
  return out;
}

/** Time-varying two-pole lowpass: the workhorse for whooshes and sweeps. */
function lpSweep(x: Sig, at: (k: number) => number): Sig {
  const out = new Float32Array(x.length);
  let y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const f = Math.min(Math.max(at(i / Math.max(1, x.length - 1)), 20), SR * 0.45);
    const a = 1 - Math.exp((-2 * Math.PI * f) / SR);
    y1 += a * (x[i] - y1);
    y2 += a * (y1 - y2);
    out[i] = y2;
  }
  return out;
}

const lowpass = (x: Sig, f: number) => lpSweep(x, () => f);

function gain(x: Sig, g: number): Sig {
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) out[i] = x[i] * g;
  return out;
}

function mul(x: Sig, e: Sig): Sig {
  const out = new Float32Array(x.length);
  for (let i = 0; i < out.length; i++) out[i] = x[i] * (e[i] ?? 0);
  return out;
}

function add(...parts: Sig[]): Sig {
  const out = new Float32Array(Math.max(...parts.map((p) => p.length)));
  for (const part of parts) for (let i = 0; i < part.length; i++) out[i] += part[i];
  return out;
}

function place(into: Sig, x: Sig, at: number, g = 1): Sig {
  const start = Math.max(0, Math.round(at * SR));
  const n = Math.min(x.length, into.length - start);
  for (let i = 0; i < n; i++) into[start + i] += x[i] * g;
  return into;
}

function peakOf(x: Sig): number {
  let p = 0;
  for (let i = 0; i < x.length; i++) p = Math.max(p, Math.abs(x[i]));
  return p;
}

const normalize = (x: Sig, peak = 0.7): Sig => {
  const p = peakOf(x) || 1;
  return gain(x, peak / p);
};

/** Clip with a soft knee so booms gain weight without harsh digital clipping. */
function saturate(x: Sig, drive = 1.6): Sig {
  const out = new Float32Array(x.length);
  for (let i = 0; i < out.length; i++) out[i] = Math.tanh(x[i] * drive) / Math.tanh(drive);
  return out;
}

/** Metallic strike: inharmonic partials, higher ones dying faster. */
function bell(
  seconds: number,
  f: number,
  partials: readonly (readonly [number, number])[],
  decay = seconds,
): Sig {
  const out = buffer(seconds);
  for (const [ratio, amp] of partials) {
    let phase = 0;
    const tau = (decay / Math.sqrt(ratio)) * 0.32;
    for (let i = 0; i < out.length; i++) {
      phase += (2 * Math.PI * f * ratio) / SR;
      out[i] += amp * Math.sin(phase) * Math.exp(-(i / SR) / tau);
    }
  }
  return out;
}

const COIN = [
  [1, 1],
  [1.47, 0.5],
  [2.31, 0.26],
  [3.71, 0.12],
] as const;

const CHIME = [
  [1, 1],
  [2.76, 0.34],
  [5.4, 0.17],
  [8.93, 0.06],
] as const;

// ------------------------------------------------------------------ recipes
// Each recipe returns raw audio; save() trims or pads it to the declared length.

function coinClink(): Sig {
  const rnd = seeded(11);
  const body = bell(0.45, 2350, COIN, 0.35);
  const tap = mul(biquad(noiseOf(0.02, rnd), "bp", 4200, 1.4), envExp(0.02, 0.0005, 0.02, 6));
  return add(body, gain(tap, 0.35));
}

function coinShower(): Sig {
  const rnd = seeded(23);
  const out = buffer(1.8);
  // density front-loaded: the pour hits, then settles
  for (let i = 0; i < 54; i++) {
    const t = Math.pow(rnd(), 1.35) * 1.55;
    const pitch = 1750 + rnd() * 2100;
    const level = 0.35 + rnd() * 0.65;
    place(out, bell(0.4, pitch, COIN, 0.28 + rnd() * 0.1), t, level * 0.5);
  }
  const fall = mul(
    lowpass(noiseOf(1.8, rnd), 5200),
    envExp(1.8, 0.08, 1.7, 3),
  );
  return add(out, gain(biquad(fall, "hp", 900), 0.18));
}

function cashRegister(): Sig {
  const rnd = seeded(31);
  // "ka": drawer mechanism
  const ka = add(
    gain(mul(biquad(noiseOf(0.06, rnd), "bp", 1800, 1.1), envExp(0.06, 0.001, 0.055, 9)), 0.5),
    gain(mul(chirp(0.06, 900, 620), envExp(0.06, 0.001, 0.05, 9)), 0.45),
  );
  const ching = add(
    bell(0.95, 1568, CHIME, 0.9),
    gain(bell(0.95, 2093, CHIME, 0.7), 0.4),
  );
  const out = add(place(buffer(1.1), ka, 0), place(buffer(1.1), ching, 0.1));
  return out;
}

function billFlutter(): Sig {
  const rnd = seeded(41);
  const body = biquad(noiseOf(0.8, rnd), "bp", 3400, 0.8);
  const out = buffer(0.8);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const rate = 17 + 16 * (t / 0.8);
    const flutter =
      0.45 + 0.3 * Math.sin(2 * Math.PI * rate * t) + 0.2 * Math.sin(2 * Math.PI * rate * 2.1 * t);
    out[i] = body[i] * Math.max(0.05, flutter);
  }
  return mul(out, envBell(0.8, 0.45, 1.3));
}

function printerWhir(): Sig {
  const rnd = seeded(53);
  const motor = mul(lowpass(reed(2, () => 96, 6), 720), envFade(2, 0.18, 0.3));
  const out = add(motor, mul(motor, gain(tone(2, () => 26), 0.25)));
  // paper-feed pulses, then the printed line that follows each one
  for (let i = 0; i < 9; i++) {
    const t = 0.12 + i * 0.21;
    const feed = mul(biquad(noiseOf(0.05, rnd), "bp", 2600, 1.2), envExp(0.05, 0.001, 0.045, 8));
    const line = mul(chirp(0.03, 1400, 1100), envExp(0.03, 0.001, 0.028, 9));
    place(out, feed, t, 0.3);
    place(out, line, t + 0.09, 0.12);
  }
  return normalize(out, 0.7);
}

function walletZip(): Sig {
  const rnd = seeded(61);
  const body = biquad(noiseOf(0.5, rnd), "hp", 2600);
  const out = buffer(0.5);
  for (let i = 0; i < out.length; i++) {
    const k = i / out.length;
    const t = i / SR;
    const teeth = 42 + 130 * k; // the zip speeds up as it closes
    const zip = Math.pow(Math.abs(Math.sin(Math.PI * teeth * t)), 3);
    out[i] = body[i] * (0.25 + 0.75 * zip);
  }
  const shaped = lowpass(out, 6500);
  return mul(shaped, envFade(0.5, 0.012, 0.06));
}

function stampThud(): Sig {
  const rnd = seeded(71);
  const thump = mul(chirp(0.4, 155, 52), envExp(0.4, 0.002, 0.16, 6));
  const slap = mul(biquad(noiseOf(0.03, rnd), "bp", 1100, 0.9), envExp(0.03, 0.001, 0.028, 8));
  const paper = mul(biquad(noiseOf(0.12, rnd), "hp", 5200), envExp(0.12, 0.001, 0.06, 7));
  return add(thump, gain(slap, 0.7), gain(paper, 0.16));
}

function calculatorTaps(): Sig {
  const rnd = seeded(83);
  const out = buffer(0.9);
  const spots = [0, 0.14, 0.27, 0.42, 0.55, 0.71, 0.82];
  for (const [i, t] of spots.entries()) {
    const jitter = (rnd() - 0.5) * 0.012;
    const click = add(
      gain(mul(biquad(noiseOf(0.03, rnd), "bp", 3200, 1.3), envExp(0.03, 0.0005, 0.022, 9)), 0.55),
      gain(mul(chirp(0.025, 1900, 1500), envExp(0.025, 0.0005, 0.02, 10)), 0.3),
    );
    place(out, click, t + jitter, i === spots.length - 1 ? 0.9 : 1);
  }
  return out;
}

function whooshRise(): Sig {
  const rnd = seeded(97);
  const air = lpSweep(noiseOf(0.8, rnd), (k) => 260 * Math.pow(18, k));
  const lift = gain(chirp(0.8, 220, 880), 0.12);
  return mul(add(biquad(air, "hp", 140), lift), envBell(0.8, 0.72, 1.5));
}

function slideDown(): Sig {
  const rnd = seeded(101);
  const d = 1;
  const glide = (t: number) => 1900 * Math.pow(380 / 1900, Math.min(1, t / d));
  const body = tone(d, (t) => glide(t) * (1 + 0.035 * Math.sin(2 * Math.PI * 6.5 * t) * (t / d)));
  return mul(
    add(
      gain(body, 0.85),
      gain(tone(d, (t) => glide(t) * 2), 0.12),
      gain(biquad(noiseOf(d, rnd), "bp", 2600, 1.6), 0.05),
    ),
    envExp(d, 0.03, 1.05, 3),
  );
}

function counterRoll(): Sig {
  const rnd = seeded(113);
  const out = buffer(0.8);
  const count = 36;
  for (let i = 0; i < count; i++) {
    const k = i / count;
    const t = 0.8 * Math.pow(k, 0.92);
    const pitch = 1250 + 420 * k;
    const tick = add(
      gain(mul(biquad(noiseOf(0.012, rnd), "bp", pitch * 2.2, 1.5), envExp(0.012, 0.0004, 0.01, 10)), 0.5),
      gain(mul(chirp(0.012, pitch, pitch * 0.9), envExp(0.012, 0.0004, 0.01, 10)), 0.4),
    );
    place(out, tick, t, 0.45 + 0.55 * k);
  }
  return mul(out, envFade(0.8, 0.005, 0.05));
}

function barThump(): Sig {
  const rnd = seeded(127);
  const thump = mul(chirp(0.3, 128, 58), envExp(0.3, 0.003, 0.13, 6));
  const click = mul(lowpass(noiseOf(0.02, rnd), 1600), envExp(0.02, 0.001, 0.018, 8));
  return add(thump, gain(click, 0.25));
}

function markerSqueak(): Sig {
  const rnd = seeded(131);
  const body = biquad(noiseOf(0.6, rnd), "bp", 3200, 1.8);
  const out = buffer(0.6);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const k = t / 0.6;
    const wobble = 0.35 + 0.65 * Math.abs(Math.sin(2 * Math.PI * (24 - 10 * k) * t));
    out[i] = body[i] * wobble;
  }
  const squeal = gain(mul(chirp(0.6, 980, 1550), envBell(0.6, 0.35, 1.8)), 0.18);
  return add(out, squeal);
}

function ding(): Sig {
  const rnd = seeded(137);
  const hit = mul(biquad(noiseOf(0.01, rnd), "hp", 4000), envExp(0.01, 0.0005, 0.008, 9));
  return add(bell(1.2, 1318, CHIME, 1.1), gain(hit, 0.3));
}

function boing(): Sig {
  const d = 0.7;
  const body = tone(d, (t) => {
    const k = Math.min(1, t / d);
    const spring = 430 * Math.pow(0.42, k);
    return spring * (1 + 0.22 * Math.sin(2 * Math.PI * 11 * t) * (1 - k));
  });
  return mul(add(body, gain(tone(d, (t) => 2 * 430 * Math.pow(0.42, Math.min(1, t / d))), 0.15)), envExp(d, 0.004, 0.55, 4.5));
}

function pop(): Sig {
  const rnd = seeded(149);
  const blip = mul(chirp(0.09, 720, 170), envExp(0.09, 0.001, 0.07, 9));
  const click = mul(biquad(noiseOf(0.006, rnd), "hp", 3000), envExp(0.006, 0.0003, 0.005, 8));
  const out = buffer(0.25);
  return place(out, add(blip, gain(click, 0.4)), 0);
}

function squashThud(): Sig {
  const rnd = seeded(151);
  const thump = mul(chirp(0.4, 190, 46), envExp(0.4, 0.002, 0.15, 6));
  const squelch = mul(
    lpSweep(noiseOf(0.22, rnd), (k) => 1500 - 1050 * k),
    envExp(0.22, 0.004, 0.16, 5),
  );
  const splat = mul(biquad(noiseOf(0.04, rnd), "bp", 2400, 1.2), envExp(0.04, 0.001, 0.03, 8));
  return add(thump, gain(squelch, 0.55), gain(splat, 0.2));
}

function slideUp(): Sig {
  const rnd = seeded(157);
  const d = 0.9;
  const body = tone(d, (t) => {
    const k = Math.min(1, t / d);
    const slide = 380 * Math.pow(1900 / 380, k);
    return slide * (1 + 0.03 * Math.sin(2 * Math.PI * 7 * t) * k);
  });
  return mul(
    add(body, gain(biquad(noiseOf(d, rnd), "bp", 2800, 1.6), 0.05)),
    envExp(d, 0.03, 0.95, 2.2),
  );
}

function gulp(): Sig {
  const rnd = seeded(163);
  const glug = (d: number) =>
    add(
      mul(chirp(d, 360, 148), envExp(d, 0.004, 0.13, 6)),
      gain(mul(lowpass(noiseOf(d, rnd), 700), envExp(d, 0.003, 0.06, 7)), 0.3),
    );
  const out = buffer(0.6);
  place(out, glug(0.2), 0.02, 1);
  place(out, glug(0.16), 0.26, 0.7);
  return out;
}

function sadTrombone(): Sig {
  const d = 2;
  const out = buffer(d);
  const notes: [number, number, number][] = [
    // start, length, midi-ish frequency
    [0, 0.3, 233.08],
    [0.33, 0.3, 220],
    [0.66, 0.32, 207.65],
    [1, 0.95, 196],
  ];
  for (const [at, len, f] of notes) {
    const last = at > 0.9;
    const wobble = (t: number) =>
      last
        ? f * (1 + 0.03 * Math.sin(2 * Math.PI * 5.4 * t))
        : f * (1 + 0.006 * Math.sin(2 * Math.PI * 5 * t));
    const note = mul(reed(len, wobble, 7), envFade(len, 0.035, len * 0.35, 1));
    // the "wah": the lowpass opens and closes over each note
    place(out, lowpass(note, 900 + 500 * (f / 233)), at, 0.55);
  }
  return normalize(out, 0.7);
}

function recordScratch(): Sig {
  const rnd = seeded(167);
  const out = buffer(1);
  for (let i = 0; i < 3; i++) {
    const len = 0.16 + i * 0.05;
    const burst = lpSweep(noiseOf(len, rnd), (k) => 900 + 5200 * Math.sin(Math.PI * k));
    const body = mul(burnt(burst), envFade(len, 0.004, len * 0.5));
    place(out, body, i * 0.19, 1 - i * 0.18);
  }
  const thump = mul(chirp(0.3, 120, 48), envExp(0.3, 0.003, 0.12, 6));
  return add(out, gain(thump, 0.45));
}

function burnt(x: Sig): Sig {
  // sample-and-hold stutter: the grit in a scratch
  const out = new Float32Array(x.length);
  const hold = 26;
  let held = 0;
  for (let i = 0; i < x.length; i++) {
    if (i % hold === 0) held = x[i];
    out[i] = held;
  }
  return out;
}

function facepalmSlap(): Sig {
  const rnd = seeded(173);
  const skin = mul(biquad(noiseOf(0.09, rnd), "bp", 1800, 0.9), envExp(0.09, 0.0015, 0.07, 8));
  const meat = mul(chirp(0.18, 190, 70), envExp(0.18, 0.002, 0.09, 6));
  const air = mul(biquad(noiseOf(0.05, rnd), "hp", 4500), envExp(0.05, 0.001, 0.04, 8));
  return add(skin, gain(meat, 0.55), gain(air, 0.18));
}

function whooshShort(): Sig {
  const rnd = seeded(179);
  const air = lpSweep(noiseOf(0.4, rnd), (k) => {
    const up = 500 * Math.pow(7.6, Math.min(1, k / 0.45));
    const down = 3800 * Math.pow(0.24, Math.max(0, (k - 0.45) / 0.55));
    return k < 0.45 ? up : down;
  });
  return mul(biquad(air, "hp", 180), envBell(0.4, 0.55, 1.4));
}

function whooshLong(): Sig {
  const rnd = seeded(181);
  const air = lpSweep(noiseOf(1.4, rnd), (k) => 240 * Math.pow(24, Math.min(1, k / 0.5)));
  const tail = mul(biquad(noiseOf(1.4, rnd), "hp", 2200), envExp(1.4, 0.35, 1.2, 3));
  return add(
    mul(air, envBell(1.4, 0.5, 1.5)),
    gain(mul(tail, envFade(1.4, 0.5, 0.2)), 0.22),
  );
}

function swish(): Sig {
  const rnd = seeded(191);
  const body = lpSweep(noiseOf(0.3, rnd), (k) => 1400 * Math.pow(5, k));
  return mul(biquad(body, "bp", 3000, 0.6), envBell(0.3, 0.4, 1.8));
}

function impactBoom(): Sig {
  const rnd = seeded(193);
  const sub = mul(chirp(1.6, 78, 30), envExp(1.6, 0.006, 0.9, 4));
  const crack = mul(biquad(noiseOf(0.04, rnd), "hp", 1100), envExp(0.04, 0.0005, 0.03, 8));
  const rumble = mul(lowpass(noiseOf(1.6, rnd), 260), envExp(1.6, 0.01, 1.2, 3.4));
  return saturate(add(saturate(sub, 2.4), gain(crack, 0.6), gain(rumble, 0.7)), 1.3);
}

function riser(): Sig {
  const rnd = seeded(197);
  const air = lpSweep(noiseOf(1.6, rnd), (k) => 300 * Math.pow(24, k));
  const stack = add(
    gain(tone(1.6, (t) => 180 * Math.pow(7.8, t / 1.6)), 0.35),
    gain(tone(1.6, (t) => 270 * Math.pow(7.8, t / 1.6)), 0.18),
  );
  const out = buffer(1.6);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const k = t / 1.6;
    const tremolo = 0.55 + 0.45 * Math.sin(2 * Math.PI * (4 + 16 * k) * t);
    out[i] = (air[i] + stack[i] * (0.4 + 0.6 * k)) * tremolo * Math.pow(k, 0.7);
  }
  return mul(out, envFade(1.6, 0.02, 0.06));
}

function glitchZap(): Sig {
  const rnd = seeded(199);
  const out = buffer(0.6);
  const scale = [220, 330, 495, 660, 990, 1320];
  let at = 0;
  while (at < 0.5) {
    const len = 0.012 + rnd() * 0.03;
    const f = scale[Math.floor(rnd() * scale.length)];
    const blip = gain(
      mul(burnt(chirp(len, f, f * (0.6 + rnd()), false)), envFade(len, 0.001, 0.003)),
      0.5,
    );
    place(out, blip, at, 0.6 + rnd() * 0.4);
    at += len + rnd() * 0.03;
  }
  const staticBed = mul(biquad(noiseOf(0.6, rnd), "hp", 3000), envFade(0.6, 0.01, 0.08));
  return add(out, gain(staticBed, 0.28));
}

function clockTick(): Sig {
  const rnd = seeded(211);
  const out = buffer(6);
  // a soft mechanical tick: short noise edge with a wooden ring after it
  const tick = (f: number) =>
    add(
      gain(mul(biquad(noiseOf(0.06, rnd), "bp", f, 2.2), envExp(0.06, 0.0006, 0.045, 7)), 0.45),
      gain(mul(chirp(0.06, f * 0.58, f * 0.5), envExp(0.06, 0.0006, 0.05, 6)), 0.35),
    );
  for (let i = 0; i < 6; i++) place(out, tick(i % 2 === 0 ? 1650 : 1180), i + 0.02, 1);
  return mul(out, envFade(6, 0.02, 0.05, 0.55));
}

function sparkleChime(): Sig {
  const rnd = seeded(223);
  const out = buffer(1.5);
  const notes = [1318.5, 1975.5, 2637, 3951];
  for (const [i, f] of notes.entries()) {
    place(out, bell(1.4 - i * 0.12, f, CHIME, 0.9), i * 0.085, 0.55 - i * 0.07);
  }
  const air = mul(biquad(noiseOf(1.5, rnd), "hp", 5200), envBell(1.5, 0.28, 2));
  return add(out, gain(air, 0.12));
}

const RECIPES: Record<SfxName, () => Sig> = {
  coin_clink: coinClink,
  coin_shower: coinShower,
  cash_register: cashRegister,
  bill_flutter: billFlutter,
  printer_whir: printerWhir,
  wallet_zip: walletZip,
  stamp_thud: stampThud,
  calculator_taps: calculatorTaps,
  whoosh_rise: whooshRise,
  slide_whistle_down: slideDown,
  counter_roll: counterRoll,
  bar_thump: barThump,
  marker_squeak: markerSqueak,
  ding,
  boing,
  pop,
  squash_thud: squashThud,
  slide_whistle_up: slideUp,
  gulp,
  sad_trombone: sadTrombone,
  record_scratch: recordScratch,
  facepalm_slap: facepalmSlap,
  whoosh_short: whooshShort,
  whoosh_long: whooshLong,
  swish,
  impact_boom: impactBoom,
  riser,
  glitch_zap: glitchZap,
  clock_tick: clockTick,
  sparkle_chime: sparkleChime,
};

// ------------------------------------------------------------------- writing
/** 16-bit mono PCM. Remotion/ffmpeg read it as-is, no decoder surprises. */
function wav(samples: Sig): Buffer {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  }
  const head = Buffer.alloc(44);
  head.write("RIFF", 0);
  head.writeUInt32LE(36 + data.length, 4);
  head.write("WAVE", 8);
  head.write("fmt ", 12);
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20); // PCM
  head.writeUInt16LE(1, 22); // mono
  head.writeUInt32LE(SR, 24);
  head.writeUInt32LE(SR * 2, 28);
  head.writeUInt16LE(2, 32);
  head.writeUInt16LE(16, 34);
  head.write("data", 36);
  head.writeUInt32LE(data.length, 40);
  return Buffer.concat([head, data]);
}

function finish(name: SfxName): Sig {
  const { seconds } = SFX_CUES[name];
  const raw = RECIPES[name]();
  const out = new Float32Array(frames(seconds));
  out.set(raw.subarray(0, Math.min(raw.length, out.length)));
  const level = normalize(out, 0.7);
  // short ramps only: 1.5 ms in keeps a strike's attack, 6 ms out kills the tail pop
  const inEdge = Math.min(Math.round(0.0015 * SR), Math.floor(level.length / 4));
  const outEdge = Math.min(Math.round(0.006 * SR), Math.floor(level.length / 4));
  for (let i = 0; i < inEdge; i++) level[i] *= i / inEdge;
  for (let i = 0; i < outEdge; i++) level[level.length - 1 - i] *= i / outEdge;
  return level;
}

function rms(x: Sig): number {
  let sum = 0;
  for (let i = 0; i < x.length; i++) sum += x[i] * x[i];
  return Math.sqrt(sum / x.length);
}

mkdirSync(OUT, { recursive: true });
let bytes = 0;
for (const name of SFX_NAMES) {
  const samples = finish(name);
  const file = resolve(OUT, `${name}.wav`);
  const data = wav(samples);
  writeFileSync(file, data);
  bytes += data.length;
  const meta = SFX_CUES[name];
  console.log(
    `${name.padEnd(20)} ${meta.category.padEnd(12)} ${(samples.length / SR).toFixed(2)}s  ` +
      `peak ${peakOf(samples).toFixed(2)}  rms ${rms(samples).toFixed(3)}`,
  );
}
console.log(`\n${SFX_NAMES.length} cues -> ${OUT} (${(bytes / 1048576).toFixed(1)} MB)`);
