import { C } from "../../design/tokens.ts";

export type LookId =
  | "editorial-paper"
  | "midnight-blueprint"
  | "split-contrast"
  | "evidence-desk"
  | "warm-studio"
  | "high-contrast-ink"
  | "mixed-media-scrim";

export type SurfacePolarity = "light" | "dark" | "split";

export type ContainerStyle = "borderless" | "card" | "sheet" | "full-bleed";

export type SurfacePattern =
  | "none"
  | "paper-grain"
  | "blueprint-grid"
  | "dot-matrix"
  | "diagonal-rules"
  | "split-pane";

export type LookTokens = {
  id: LookId;
  label: string;
  polarity: SurfacePolarity;
  containerDefault: ContainerStyle;
  bg: string;
  bgSecondary: string;
  surface: string;
  surfaceAlt: string;
  surfaceInk: string;
  surfaceInkMuted: string;
  ink: string;
  inkMuted: string;
  hairline: string;
  shadow: string;
  pattern: SurfacePattern;
  money: typeof C.yellow;
  cost: typeof C.red;
  alternative: typeof C.teal;
};

export const LOOKS: Record<LookId, LookTokens> = {
  "editorial-paper": {
    id: "editorial-paper",
    label: "Editorial Paper",
    polarity: "light",
    containerDefault: "borderless",
    bg: "#F4F2EB",
    bgSecondary: "#EAE6DA",
    surface: "#FFFDF8",
    surfaceAlt: "#E5E0D3",
    surfaceInk: C.navy,
    surfaceInkMuted: "#475569",
    ink: C.navy,
    inkMuted: "#475569",
    hairline: "rgba(20, 36, 58, 0.14)",
    shadow: "0 14px 34px rgba(20, 36, 58, 0.10)",
    pattern: "paper-grain",
    money: C.yellow,
    cost: C.red,
    alternative: C.teal,
  },
  "midnight-blueprint": {
    id: "midnight-blueprint",
    label: "Midnight Blueprint",
    polarity: "dark",
    containerDefault: "borderless",
    bg: C.navy,
    bgSecondary: "#1B304C",
    surface: "#1D3048",
    surfaceAlt: "#263E5C",
    surfaceInk: C.white,
    surfaceInkMuted: C.muted,
    ink: C.white,
    inkMuted: C.muted,
    hairline: "rgba(248, 250, 252, 0.12)",
    shadow: "0 20px 44px rgba(8, 16, 28, 0.34)",
    pattern: "blueprint-grid",
    money: C.yellow,
    cost: C.red,
    alternative: C.teal,
  },
  "split-contrast": {
    id: "split-contrast",
    label: "Split Contrast",
    polarity: "split",
    containerDefault: "borderless",
    bg: C.navy,
    bgSecondary: "#F4F2EB",
    surface: "#1D3048",
    surfaceAlt: "#FFFDF8",
    surfaceInk: C.white,
    surfaceInkMuted: C.muted,
    ink: C.white,
    inkMuted: C.muted,
    hairline: "rgba(148, 163, 184, 0.25)",
    shadow: "0 18px 40px rgba(8, 16, 28, 0.26)",
    pattern: "split-pane",
    money: C.yellow,
    cost: C.red,
    alternative: C.teal,
  },
  "evidence-desk": {
    id: "evidence-desk",
    label: "Evidence Desk",
    polarity: "dark",
    containerDefault: "sheet",
    bg: "#0E1A2B",
    bgSecondary: "#172942",
    surface: "#F8FAFC",
    surfaceAlt: "#E2E8F0",
    surfaceInk: C.navy,
    surfaceInkMuted: "#475569",
    ink: C.white,
    inkMuted: C.muted,
    hairline: "rgba(57, 184, 182, 0.16)",
    shadow: "0 22px 48px rgba(4, 10, 20, 0.42)",
    pattern: "dot-matrix",
    money: C.yellow,
    cost: C.red,
    alternative: C.teal,
  },
  "warm-studio": {
    id: "warm-studio",
    label: "Warm Studio",
    polarity: "light",
    containerDefault: "card",
    bg: "#F7F3EA",
    bgSecondary: "#EFE6D5",
    surface: "#FFFFFF",
    surfaceAlt: "#EAE4D7",
    surfaceInk: C.navy,
    surfaceInkMuted: "#526071",
    ink: C.navy,
    inkMuted: "#526071",
    hairline: "rgba(20, 36, 58, 0.12)",
    shadow: "0 16px 36px rgba(20, 36, 58, 0.12)",
    pattern: "diagonal-rules",
    money: C.yellow,
    cost: C.red,
    alternative: C.teal,
  },
  "high-contrast-ink": {
    id: "high-contrast-ink",
    label: "High Contrast Ink",
    polarity: "dark",
    containerDefault: "borderless",
    bg: "#0B1524",
    bgSecondary: "#14243A",
    surface: "#172B45",
    surfaceAlt: "#203959",
    surfaceInk: C.white,
    surfaceInkMuted: "#BAC7D6",
    ink: C.white,
    inkMuted: "#BAC7D6",
    hairline: "rgba(248, 250, 252, 0.15)",
    shadow: "0 24px 52px rgba(4, 9, 18, 0.48)",
    pattern: "none",
    money: C.yellow,
    cost: C.red,
    alternative: C.teal,
  },
  "mixed-media-scrim": {
    id: "mixed-media-scrim",
    label: "Mixed Media Scrim",
    polarity: "dark",
    containerDefault: "full-bleed",
    bg: "#101E31",
    bgSecondary: "#192D47",
    surface: "rgba(20, 36, 58, 0.88)",
    surfaceAlt: "#1D3048",
    surfaceInk: C.white,
    surfaceInkMuted: "#CBD5E1",
    ink: C.white,
    inkMuted: "#CBD5E1",
    hairline: "rgba(248, 250, 252, 0.18)",
    shadow: "0 20px 48px rgba(6, 12, 24, 0.45)",
    pattern: "none",
    money: C.yellow,
    cost: C.red,
    alternative: C.teal,
  },
};

export const LOOK_IDS = Object.keys(LOOKS) as LookId[];

export function getLook(id: LookId = "midnight-blueprint"): LookTokens {
  return LOOKS[id];
}

export function lookCssVars(look: LookTokens): Record<string, string> {
  return {
    "--doc-bg": look.bg,
    "--doc-bg-secondary": look.bgSecondary,
    "--doc-surface": look.surface,
    "--doc-surface-alt": look.surfaceAlt,
    "--doc-ink": look.ink,
    "--doc-muted": look.inkMuted,
    "--doc-hairline": look.hairline,
    "--doc-money": look.money,
    "--doc-cost": look.cost,
    "--doc-alt": look.alternative,
  };
}
