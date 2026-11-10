import { createContext, useContext } from "react";
import { clamp01 } from "./timing";
export type FinancialMotion = {
  frame: number;
  sceneFrom: number;
  sceneUntil: number;
  gates: { value: number; from: number }[];
  confirmationAt?: number;
};
export const FinancialMotionContext = createContext<FinancialMotion | null>(
  null,
);
export function useFinancialMotion(value: number) {
  const context = useContext(FinancialMotionContext);
  if (!context) return null;
  const from =
    context.gates.find((g) => g.value === value)?.from ??
    context.sceneFrom - 30;
  return { ...context, from, progress: clamp01((context.frame - from) / 18) };
}
