const baseShots = [
  {
    id: "s01-a-raise",
    scene: "S01",
    cue: "p001-s001",
    description: "Sam receives the raise at work.",
  },
  {
    id: "s01-b-three-months-later",
    scene: "S01",
    cue: "p001-s002",
    description: "The matched home shot changes excitement to uncertainty.",
  },
  {
    id: "s02-a-apartment",
    scene: "S02",
    cue: "p001-s003",
    description: "A permanent desk makes the apartment improvement tangible.",
  },
  {
    id: "s02-b-rental",
    scene: "S02",
    cue: "p001-s004",
    description: "Sam tries the more comfortable rented car.",
  },
  {
    id: "s02-c-services",
    scene: "S02",
    cue: "p001-s005",
    description: "Sam chooses among unbranded entertainment services.",
  },
  {
    id: "s03-transfer-comparison",
    scene: "S03",
    cue: "p001-s008",
    description:
      "Sam compares monthly transfers; exact amounts remain withheld.",
  },
  {
    id: "s04-a-still-working",
    scene: "S04",
    cue: "p001-s009",
    description: "Sam remains employed; no lost-job explanation is implied.",
  },
  {
    id: "s04-b-commitments",
    scene: "S04",
    cue: "p001-s012",
    description: "One pay packet sits beside the recurring commitments.",
  },
  {
    id: "s05-equal-start",
    scene: "S05",
    cue: "p001-s013",
    description: "Sam and Alex receive equal visual weight and equal raises.",
  },
  {
    id: "s06-a-income",
    scene: "S06",
    cue: "p002-s001",
    description: "Before the raise: monthly take-home pay is $3,000.",
  },
  {
    id: "s06-b-remainder",
    scene: "S06",
    cue: "p002-s002",
    description: "Illustrated spending leaves $400, not yet transferred.",
  },
  {
    id: "s06-c-transfer",
    scene: "S06",
    cue: "p002-s003",
    description: "The explicit $400 savings transfer completes the baseline.",
  },
] as const;

export const openingShots = [
  baseShots[0],
  {
    ...baseShots[0],
    id: "s01-a-raise-close",
    description: "Closer character framing of the same raise moment.",
  },
  baseShots[1],
  {
    ...baseShots[1],
    id: "s01-b-reaction-close",
    description: "Close reaction shot with the phone below Sam’s face.",
  },
  {
    ...baseShots[2],
    id: "s02-a-apartment-wide",
    description: "Wide room view before the closer apartment framing.",
  },
  baseShots[2],
  baseShots[3],
  baseShots[4],
  baseShots[5],
  {
    ...baseShots[5],
    id: "s03-transfer-comparison-insert",
    description: "Close phone insert from the same shoulder-level setup.",
  },
  ...baseShots.slice(6),
] as const;

export type OpeningShotId = (typeof openingShots)[number]["id"];

export const openingBaseShot = (shot: OpeningShotId) => {
  if (shot === "s01-b-reaction-close") return "s01-b-three-months-later";
  return shot.replace(
    /-(close|wide|insert)$/,
    "",
  ) as (typeof baseShots)[number]["id"];
};

type CameraStudy = {
  viewBox: readonly [number, number, number, number];
  angle: string;
};
export const openingCameras: Record<OpeningShotId, CameraStudy> = {
  "s01-a-raise": {
    viewBox: [0, 0, 1920, 1080],
    angle: "Eye-level full-body view with room depth",
  },
  "s01-a-raise-close": {
    viewBox: [250, 110, 1050, 590.625],
    angle: "Waist-up character and raise-notice close-up",
  },
  "s01-b-three-months-later": {
    viewBox: [0, 0, 1920, 1080],
    angle: "Medium reaction and transfer context",
  },
  "s01-b-reaction-close": {
    viewBox: [180, 150, 1120, 630],
    angle: "Close reaction, framing the face and lowered phone",
  },
  "s02-a-apartment-wide": {
    viewBox: [0, 0, 1920, 1080],
    angle: "Wide three-quarter room establishing view",
  },
  "s02-a-apartment": {
    viewBox: [350, 160, 1450, 815.625],
    angle: "Closer three-quarter room and character view",
  },
  "s02-b-rental": {
    viewBox: [0, 0, 1920, 1080],
    angle: "Passenger-side interior with near dashboard and distant windshield",
  },
  "s02-c-services": {
    viewBox: [0, 0, 1920, 1080],
    angle: "Over-shoulder view of the phone on the table",
  },
  "s03-transfer-comparison": {
    viewBox: [0, 0, 1920, 1080],
    angle: "Over-shoulder comparison with foreground character and near phone",
  },
  "s03-transfer-comparison-insert": {
    viewBox: [960, 480, 900, 506.25],
    angle: "Close phone-screen insert from the same setup",
  },
  "s04-a-still-working": {
    viewBox: [120, 130, 1660, 933.75],
    angle: "Angled workstation view with laptop in foreground",
  },
  "s04-b-commitments": {
    viewBox: [120, 70, 1680, 945],
    angle: "Overhead tabletop with layered physical documents",
  },
  "s05-equal-start": {
    viewBox: [0, 0, 1920, 1080],
    angle: "Balanced wide two-shot, equal subject size and depth",
  },
  "s06-a-income": {
    viewBox: [0, 0, 1920, 1080],
    angle: "High shoulder-level view at the original table",
  },
  "s06-b-remainder": {
    viewBox: [0, 0, 1920, 1080],
    angle: "Overhead view of the pay packet, bills, and phone",
  },
  "s06-c-transfer": {
    viewBox: [960, 420, 900, 506.25],
    angle: "Close transfer-confirmation insert",
  },
};
