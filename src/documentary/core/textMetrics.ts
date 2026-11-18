import type { Rect } from "./geometry.ts";
import { INTER_WIDTHS } from "./interMetrics.ts";

export type InterWeight = 400 | 600 | 700 | 800;

/** Minimum font size (at 1920x1080) recommended for essential documentary labels on phone screens. */
export const MIN_ESSENTIAL_FONT_SIZE = 22;

export function measureTextWidth(
  text: string,
  fontSize: number,
  fontWeight: InterWeight = 400,
  letterSpacingPx = 0,
): number {
  const table = INTER_WIDTHS[fontWeight] ?? INTER_WIDTHS[400];
  const fallbackWidth = 0.56;
  const chars = Array.from(text);
  let width = 0;
  for (let i = 0; i < chars.length; i++) {
    const em = table[chars[i]] ?? fallbackWidth;
    width += em * fontSize;
    if (i > 0 && letterSpacingPx !== 0) width += letterSpacingPx;
  }
  return Math.round(width * 100) / 100;
}

export function wrapText(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontWeight: InterWeight = 400,
  letterSpacingPx = 0,
): string[] {
  if (!Number.isFinite(maxWidth) || maxWidth <= 0)
    throw new Error("wrapText requires a positive maxWidth");
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];
  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const candidate = `${current} ${words[i]}`;
      if (measureTextWidth(candidate, fontSize, fontWeight, letterSpacingPx) <= maxWidth) {
        current = candidate;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }
  return lines;
}

export type TextFitCheckInput = {
  id: string;
  text: string;
  box: Rect;
  fontSize: number;
  fontWeight?: InterWeight;
  maxLines?: number;
  lineHeight?: number;
  letterSpacingPx?: number;
  essential?: boolean;
};

export type TextFitResult = {
  id: string;
  fits: boolean;
  lines: string[];
  requiredWidth: number;
  requiredHeight: number;
  overflowX: number;
  overflowY: number;
  exceedsMaxLines: boolean;
  minPhoneFontSizeOk: boolean;
};

export function checkTextFit({
  id,
  text,
  box,
  fontSize,
  fontWeight = 400,
  maxLines,
  lineHeight = 1.25,
  letterSpacingPx = 0,
  essential = true,
}: TextFitCheckInput): TextFitResult {
  const lines = wrapText(text, Math.max(1, box.width), fontSize, fontWeight, letterSpacingPx);
  const widestLine = lines.reduce(
    (max, line) => Math.max(max, measureTextWidth(line, fontSize, fontWeight, letterSpacingPx)),
    0,
  );
  const requiredWidth = Math.ceil(widestLine);
  const requiredHeight = Math.ceil(lines.length * fontSize * lineHeight);
  const overflowX = Math.max(0, requiredWidth - box.width);
  const overflowY = Math.max(0, requiredHeight - box.height);
  const exceedsMaxLines = maxLines !== undefined && lines.length > maxLines;
  const minPhoneFontSizeOk = !essential || fontSize >= MIN_ESSENTIAL_FONT_SIZE;
  return {
    id,
    fits: overflowX === 0 && overflowY === 0 && !exceedsMaxLines,
    lines,
    requiredWidth,
    requiredHeight,
    overflowX,
    overflowY,
    exceedsMaxLines,
    minPhoneFontSizeOk,
  };
}
