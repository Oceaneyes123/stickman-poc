export type TypeTiming = {
  from: number;
  until: number;
  enter?: number;
  exit?: number;
};
export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
export function rollingDigit(value: number, power: number) {
  const absolute = Math.abs(value);
  return (
    (Math.floor(absolute / power) % 10) +
    clamp01((absolute % power) - (power - 1))
  );
}
export function typeProgress(frame: number, timing: TypeTiming) {
  if (
    ![frame, timing.from, timing.until].every(Number.isFinite) ||
    timing.until <= timing.from
  )
    throw new Error("Typography requires a finite, positive frame window");
  const enter = Math.min(timing.enter ?? 15, (timing.until - timing.from) / 2);
  const exit = Math.min(timing.exit ?? 10, (timing.until - timing.from) / 2);
  if (enter <= 0 || exit <= 0)
    throw new Error("Typography transitions must be positive");
  return {
    in: clamp01((frame - timing.from) / enter),
    out: clamp01((frame - (timing.until - exit)) / exit),
    visible: frame >= timing.from && frame < timing.until,
  };
}
export function numberAt(
  frame: number,
  from: number,
  duration: number,
  value: number,
  initial = 0,
) {
  if (
    ![frame, from, duration, value, initial].every(Number.isFinite) ||
    duration <= 0
  )
    throw new Error("Invalid animated number");
  const p = clamp01((frame - from) / duration);
  return initial + (value - initial) * (1 - (1 - p) ** 3);
}
