/**
 * The sound-effect catalogue. One table, imported by both the generator
 * (scripts/sfx/generate-sfx.ts) and the playback layer, so the WAV lengths and
 * the component defaults can never drift apart.
 *
 * `seconds` is the exact rendered length: the generator pads or trims to it,
 * so a cue placed on a frame can be trusted with its tail.
 * `volume` is the default mix level; override it per placement when a cut needs it.
 */
export type SfxCategory =
  | "money"
  | "charts"
  | "character"
  | "transitions"
  | "ambience";

export type SfxCueMeta = {
  category: SfxCategory;
  seconds: number;
  volume: number;
  /** what the cue is for, shown in SfxGallery */
  use: string;
};

export const SFX_GROUPS: { id: SfxCategory; label: string }[] = [
  { id: "money", label: "Money and finance" },
  { id: "charts", label: "Charts and data" },
  { id: "character", label: "Character and comedy" },
  { id: "transitions", label: "Transitions and emphasis" },
  { id: "ambience", label: "Ambience and ending" },
];

export const SFX_CUES = {
  // ---------------------------------------------------------------- money
  coin_clink: {
    category: "money",
    seconds: 0.45,
    volume: 0.85,
    use: "Single coin landing or tapped: small gains",
  },
  coin_shower: {
    category: "money",
    seconds: 1.8,
    volume: 0.8,
    use: "Coins pouring: big wins and windfalls",
  },
  cash_register: {
    category: "money",
    seconds: 1.1,
    volume: 0.9,
    use: "Ka-ching: profit or sale confirmed",
  },
  bill_flutter: {
    category: "money",
    seconds: 0.8,
    volume: 0.7,
    use: "Paper money fanned or counted",
  },
  printer_whir: {
    category: "money",
    seconds: 2,
    volume: 0.6,
    use: "Money printer: inflation, central banks",
  },
  wallet_zip: {
    category: "money",
    seconds: 0.5,
    volume: 0.75,
    use: "Wallet or coin purse zipped shut",
  },
  stamp_thud: {
    category: "money",
    seconds: 0.4,
    volume: 0.85,
    use: "Approved, denied or debt stamped",
  },
  calculator_taps: {
    category: "money",
    seconds: 0.9,
    volume: 0.7,
    use: "Quick number crunching",
  },

  // --------------------------------------------------------------- charts
  whoosh_rise: {
    category: "charts",
    seconds: 0.8,
    volume: 0.65,
    use: "Upward sweep under a line going up",
  },
  slide_whistle_down: {
    category: "charts",
    seconds: 1,
    volume: 0.7,
    use: "Falling sweep: crash, drop, bad trade",
  },
  counter_roll: {
    category: "charts",
    seconds: 0.8,
    volume: 0.6,
    use: "Rapid ticking as a number counts up",
  },
  bar_thump: {
    category: "charts",
    seconds: 0.3,
    volume: 0.6,
    use: "Soft thud as a chart bar lands",
  },
  marker_squeak: {
    category: "charts",
    seconds: 0.6,
    volume: 0.55,
    use: "Marker drawing lines and arrows",
  },
  ding: {
    category: "charts",
    seconds: 1.2,
    volume: 0.75,
    use: "Notification chime on a key stat",
  },

  // ------------------------------------------------------------ character
  boing: {
    category: "character",
    seconds: 0.7,
    volume: 0.75,
    use: "Bouncy hops and spring reactions",
  },
  pop: {
    category: "character",
    seconds: 0.25,
    volume: 0.8,
    use: "Objects or text appearing",
  },
  squash_thud: {
    category: "character",
    seconds: 0.4,
    volume: 0.8,
    use: "Stickman flattened or landing hard",
  },
  slide_whistle_up: {
    category: "character",
    seconds: 0.9,
    volume: 0.7,
    use: "Cartoon surprise: whistle rising",
  },
  gulp: {
    category: "character",
    seconds: 0.6,
    volume: 0.7,
    use: "Nervous swallow before a risk",
  },
  sad_trombone: {
    category: "character",
    seconds: 2,
    volume: 0.7,
    use: "Wah-wah: failure or a loss punchline",
  },
  record_scratch: {
    category: "character",
    seconds: 1,
    volume: 0.8,
    use: "Freeze-frame: wait, what?",
  },
  facepalm_slap: {
    category: "character",
    seconds: 0.3,
    volume: 0.85,
    use: "Quick skin slap for a mistake",
  },

  // ---------------------------------------------------------- transitions
  whoosh_short: {
    category: "transitions",
    seconds: 0.4,
    volume: 0.7,
    use: "Standard scene cut or object slide",
  },
  whoosh_long: {
    category: "transitions",
    seconds: 1.4,
    volume: 0.7,
    use: "Bigger transitions, camera moves",
  },
  swish: {
    category: "transitions",
    seconds: 0.3,
    volume: 0.65,
    use: "Quick wipe or text slide",
  },
  impact_boom: {
    category: "transitions",
    seconds: 1.6,
    volume: 0.9,
    use: "Heavy emphasis on a hook or number",
  },
  riser: {
    category: "transitions",
    seconds: 1.6,
    volume: 0.7,
    use: "Tension rising before a reveal",
  },
  glitch_zap: {
    category: "transitions",
    seconds: 0.6,
    volume: 0.7,
    use: "Chaos, scams, hacked accounts",
  },

  // ------------------------------------------------------------- ambience
  clock_tick: {
    category: "ambience",
    seconds: 6,
    volume: 0.4,
    use: "Soft ticking clock: pressure, deadlines",
  },
  sparkle_chime: {
    category: "ambience",
    seconds: 1.5,
    volume: 0.8,
    use: "Bright resolve at the end of a win",
  },
} as const satisfies Record<string, SfxCueMeta>;

export type SfxName = keyof typeof SFX_CUES;

export const SFX_NAMES = Object.keys(SFX_CUES) as SfxName[];

export const sfxCuesIn = (category: SfxCategory): SfxName[] =>
  SFX_NAMES.filter((name) => SFX_CUES[name].category === category);
