/**
 * Colour script for video 002. One look per act, so the room the story happens
 * in changes as the pressure does. Backgrounds carry the colour; cards stay
 * light and readable, and art reads these values as CSS custom properties with
 * the shipped neutral palette as the fallback.
 */
import type { CSSProperties } from "react";

export type LookId = "shop" | "firstMonth" | "pressure" | "strain" | "cafe" | "resolve";

export type Look = {
  id: LookId;
  /** Wall gradient, top to horizon. */
  wall: readonly [string, string];
  /** Big graphic motif behind the action. */
  motif: "sun" | "arch" | "window" | "pendant" | "dawn";
  field: string;
  /** Warm light pool over the motif. */
  glow: string;
  floor: string;
  plinth: string;
  panel: string;
  /** Backing board behind card-heavy stages. */
  plate: string;
  card: string;
  line: string;
  quiet: string;
  wood: string;
  fabric: string;
};

const LOOKS: Record<LookId, Look> = {
  shop: {
    id: "shop",
    wall: ["#123F4A", "#2E8C87"],
    motif: "sun",
    field: "#4FB6AC",
    glow: "rgba(255,214,140,0.42)",
    floor: "#0C2C36",
    plinth: "#17454F",
    panel: "rgba(255,255,255,0.06)",
    plate: "#D9E3DE",
    card: "#FFFDF8",
    line: "#6E8C95",
    quiet: "#E4EAE7",
    wood: "#D59A5E",
    fabric: "#2F7C82",
  },
  firstMonth: {
    id: "firstMonth",
    wall: ["#E9AE6A", "#F7DDB4"],
    motif: "sun",
    field: "#F3BE58",
    glow: "rgba(255,246,214,0.55)",
    floor: "#B4794A",
    plinth: "#C99259",
    panel: "rgba(255,255,255,0.14)",
    plate: "#EADCC2",
    card: "#FFFDF6",
    line: "#A98A69",
    quiet: "#F0E4D2",
    wood: "#A9723F",
    fabric: "#D08A57",
  },
  pressure: {
    id: "pressure",
    wall: ["#B8434C", "#E87468"],
    motif: "arch",
    field: "#F49283",
    glow: "rgba(255,226,196,0.38)",
    floor: "#6B2532",
    plinth: "#85313E",
    panel: "rgba(255,255,255,0.08)",
    plate: "#EBD1CA",
    card: "#FFF8F4",
    line: "#9C5F5B",
    quiet: "#F2DCD6",
    wood: "#C9805A",
    fabric: "#A9505A",
  },
  strain: {
    id: "strain",
    wall: ["#26385C", "#4A628B"],
    motif: "window",
    field: "#4A6392",
    glow: "rgba(255,205,140,0.30)",
    floor: "#131D31",
    plinth: "#1D2942",
    panel: "rgba(255,255,255,0.05)",
    plate: "#CFDAE6",
    card: "#F6F9FC",
    line: "#6D7F9C",
    quiet: "#DDE5EF",
    wood: "#8A6A4E",
    fabric: "#3B4F72",
  },
  cafe: {
    id: "cafe",
    wall: ["#8E3F31", "#C4705A"],
    motif: "pendant",
    field: "#E0A05E",
    glow: "rgba(255,201,138,0.46)",
    floor: "#421E1C",
    plinth: "#562824",
    panel: "rgba(255,255,255,0.06)",
    plate: "#E9D4C7",
    card: "#FFFBF5",
    line: "#8A5B4C",
    quiet: "#EEDDD2",
    wood: "#8A4B33",
    fabric: "#2E6E6B",
  },
  resolve: {
    id: "resolve",
    wall: ["#3F7F6C", "#A8DCC0"],
    motif: "dawn",
    field: "#F3BE58",
    glow: "rgba(255,240,190,0.42)",
    floor: "#20514A",
    plinth: "#2F6A5C",
    panel: "rgba(255,255,255,0.10)",
    plate: "#F4FAF3",
    card: "#FFFEF9",
    line: "#7FA394",
    quiet: "#E3EDE6",
    wood: "#C08A55",
    fabric: "#3E8F7C",
  },
};

/**
 * Act windows read from the scene number: the film plan's ids are sequential
 * (S01..S68), so the colour script has one table and no per-scene data.
 */
export const lookForScene = (sceneId: string): Look => {
  const number = Number(sceneId.replace(/\D/g, ""));
  if (number <= 8) return LOOKS.shop;
  if (number <= 18) return LOOKS.firstMonth;
  if (number <= 30) return LOOKS.pressure;
  // S42 is the lunch counter: same room family as the cafe, so it opens the act.
  if (number <= 41) return LOOKS.strain;
  if (number <= 52) return LOOKS.cafe;
  return LOOKS.resolve;
};

/** Custom properties the prop art reads; anything else keeps its shipped colour. */
export const lookVars = (look: Look): CSSProperties =>
  ({
    "--bn-card": look.card,
    "--bn-line": look.line,
    "--bn-quiet": look.quiet,
    "--bn-wood": look.wood,
    "--bn-fabric": look.fabric,
    background: look.floor,
  }) as CSSProperties;
