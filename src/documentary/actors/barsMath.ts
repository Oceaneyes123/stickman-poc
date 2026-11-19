import { remaining, sum } from "../../finance/math.ts";

export type ThresholdBarGeometry = {
  scaleMax: number;
  baseWidth: number;
  thresholdX: number;
  addedWidth: number;
  overhangWidth: number;
  overhangAmount: number;
  gapRemaining: number;
  qualifies: boolean;
  totalAmount: number;
};

export function computeThresholdBars(params: {
  baseAmount: number;
  threshold: number;
  addedAmount?: number;
  maxWidth: number;
}): ThresholdBarGeometry {
  const added = Math.max(0, params.addedAmount ?? 0);
  const totalAmount = sum([params.baseAmount, added]);
  const scaleMax = Math.max(params.threshold, totalAmount, 1) * 1.12;
  const px = params.maxWidth / scaleMax;
  const qualifies = totalAmount >= params.threshold;
  const overhangAmount = qualifies ? remaining(totalAmount, params.threshold) : 0;
  const gapRemaining = qualifies ? 0 : remaining(params.threshold, totalAmount);

  const baseWidth = params.baseAmount * px;
  const thresholdX = params.threshold * px;
  const totalWidth = totalAmount * px;
  const addedWidth = Math.max(0, totalWidth - baseWidth);
  const overhangWidth = Math.max(0, totalWidth - thresholdX);

  return {
    scaleMax,
    baseWidth,
    thresholdX,
    addedWidth,
    overhangWidth,
    overhangAmount,
    gapRemaining,
    qualifies,
    totalAmount,
  };
}

export type ComparisonBarItem = {
  id: string;
  label: string;
  amount: number;
  tone?: "money" | "cost" | "alternative" | "neutral";
};

export type ComputedComparisonBar = ComparisonBarItem & {
  width: number;
  ratio: number;
};

export function computeComparisonBars(
  items: readonly ComparisonBarItem[],
  maxWidth: number,
): { scaleMax: number; bars: ComputedComparisonBar[] } {
  const scaleMax = Math.max(1, ...items.map((item) => Math.abs(item.amount)));
  return {
    scaleMax,
    bars: items.map((item) => {
      const ratio = Math.abs(item.amount) / scaleMax;
      return {
        ...item,
        ratio,
        width: ratio * maxWidth,
      };
    }),
  };
}
