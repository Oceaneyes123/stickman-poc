export const C = {
  navy: "#14243A",
  white: "#F8FAFC",
  yellow: "#F3BE58",
  red: "#FF6B6B",
  teal: "#39B8B6",
  muted: "#A6B4C6",
  panel: "#1D3048",
  line: "#38506B",
};
export const font = "Inter, sans-serif";

export const cinema = {
  environment: {
    wall: "#F2F1EB",
    oldWall: "#E9EEF1",
    floor: "#D8E0E5",
    glass: "#DBE9EF",
    daylight: "#FFF1CF",
  },
  material: {
    wood: "#C8BAA2",
    desk: "#C4CFD9",
    fabric: "#A6B4C6",
    paper: "#F8FAFC",
    foreground: "#24374C",
  },
  outline: { environment: 4, furniture: 6, detail: 2.5 },
  shadow: { color: "#14243A", opacity: 0.13, blur: 10 },
  text: { amount: 64, label: 32, detail: 26 },
  framing: { safe: 96, floor: 940, actorScale: 2.15 },
} as const;
