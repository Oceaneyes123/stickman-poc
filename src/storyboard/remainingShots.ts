import { calculateBudget, example, remaining, sum } from "../finance/math.ts";

export const budget = calculateBudget(example);
export const rent = example.upgrades[0].amount;
export const transport = example.upgrades[1].amount;
export const services = example.upgrades[2].amount;
export const monthOneExpenses = example.expenses + rent;
export const monthTwoExpenses = monthOneExpenses + transport;
export const monthOne = remaining(budget.income, monthOneExpenses);
export const monthTwo = remaining(budget.income, monthTwoExpenses);
export const samThreeMonths = sum([monthOne, monthTwo, budget.sam]);
export const alexThreeMonths = budget.alex * 3;
export const baselineThreeMonths = budget.before * 3;
export const samAnnual = budget.sam * 12;
export const alexAnnual = budget.alex * 12;

export const remainingShots = [
  ["S07", "scope", "Wide baseline setup"],
  ["S08", "cramped", "Medium cramped workspace"],
  ["S09", "opportunity", "Overhead paycheck allocation"],
  ["S10", "choices", "Medium decision at the table"],
  ["S11", "equal", "Level two-shot"],
  ["S12", "apartment", "Wide apartment visit"],
  ["S13", "rent-tray", "Overhead rent allocation"],
  ["S14", "lease", "Medium lease signing"],
  ["S15", "month-one", "Shoulder-level transfer"],
  ["S16", "receipts", "Medium comfortable workspace"],
  ["S17", "exclusions", "Overhead monthly folder"],
  ["S18", "dinner-room", "Wide desk and dinner space"],
  ["S19", "rental", "Three-quarter rental handover"],
  ["S20", "car-interior", "Passenger-side interior"],
  ["S21", "car-crop", "Tight overhead, rent outside crop"],
  ["S22", "full-tray", "Overhead pullback destination"],
  ["S23", "month-two", "Shoulder-level transfer"],
  ["S24", "closed-folder", "Angled table and goal note"],
  ["S25", "services", "Over-shoulder phone and commitments"],
  ["S26", "password", "Over-shoulder evening service"],
  ["S27", "over-raise", "Overhead full allocation"],
  ["S28", "month-three", "Close transfer insert"],
  ["S29", "hook-receipts", "Opening phone-angle callback"],
  ["S30", "comfort-transfer", "Medium room and transfer receipt"],
  ["S31", "positive", "Close contribution folder"],
  ["S32", "three-months", "Overhead dated contributions"],
  ["S33", "pace-total", "Overhead monthly and period comparison"],
  ["S34", "pay-vs-keep", "Medium pay notice and commitments"],
  ["S35", "destination", "Over-shoulder banking action"],
  ["S36", "book", "Overhead reference book"],
  ["S37", "cash-only", "Medium book closed and receipts open"],
  ["S38", "combined", "Overhead commitments beside one paycheck"],
  ["S39", "one-time", "Medium dinner and dated receipt"],
  ["S40", "recurring", "Overhead three monthly pages"],
  ["S41", "reserved", "Overhead already-reserved raise"],
  ["S42", "tradeoff", "Full-list phone decision"],
  ["S43", "alex-enjoys", "Medium Alex and chosen activities"],
  ["S44", "alex-transfer", "Alex shoulder-level transfer"],
  ["S45", "alex-split", "Overhead transfer origin"],
  ["S46", "automation", "Alex shoulder-level checked schedule"],
  ["S47", "optional", "Alex considers an unpriced purchase"],
  ["S48", "different-rooms", "Equal split-screen workspaces"],
  ["S49", "limits", "Wide equal-start example frame"],
  ["S50", "period-gap", "Equal split dated contributions"],
  ["S51", "monthly-gap", "Equal Month 3 receipt comparison"],
  ["S52", "different-benefits", "Equal split comfort and contributions"],
  ["S53", "cancel-impulse", "Medium Sam reviewing the full list"],
  ["S54", "list-goal", "Overhead commitments and goal note"],
  ["S55", "choose-keep", "Medium Sam upright at the desk"],
  ["S56", "cancel-services", "Close cancellation and next-month boundary"],
  ["S57", "contracts-remain", "Overhead continuing agreements"],
  ["S58", "revised", "Shoulder-level next-payday transfer"],
  ["S59", "review-later", "Medium retained comforts and review folder"],
  ["S60", "hypothetical", "Wide current plan and separate hypothetical"],
  ["S61", "annual", "Separate twelve-month illustration"],
  ["S62", "annual-gap", "Overhead conditional annual totals"],
  ["S63", "return-current", "Medium current receipt after illustration"],
  ["S64", "chosen-tradeoff", "Equal split chosen commitments"],
  ["S65", "same-pay", "Overhead unchanged paycheck and revised plan"],
  ["S66", "earlier-current", "Medium familiar props and dated receipts"],
  ["S67", "closing", "Opening phone-angle callback"],
] as const;
export type RemainingSceneId = (typeof remainingShots)[number][0];
export type RemainingLayout = (typeof remainingShots)[number][1];
export const remainingInserts = [
  ["S08", "Usable older rental and weekend route"],
  ["S14", "Alex keeps the existing workspace"],
  ["S20", "Alex retains the older rental"],
  ["S26", "Alex pauses before adding a service"],
  ["S34", "Alex checks his chosen commitments"],
  ["S42", "Alex reviews the full list before deciding"],
  ["S43", "A hobby and meal within the chosen allowance"],
] as const;

export type BoardScene = {
  id: string;
  title: string;
  audioWindow: string;
  narration: string;
  composition: string;
  movement: string;
  camera: string;
  visualTransition: string;
  continuity: string;
  screenText: string;
  cueIds: string[];
};

export function parseStoryboard(markdown: string): BoardScene[] {
  return markdown
    .replace(/\r/g, "")
    .split(/(?=^### S\d+ — )/m)
    .slice(1)
    .map((block) => {
      const heading = /^### (S\d+) — (.+)$/m.exec(block)!;
      const field = (name: string) => {
        const value = new RegExp(`\\*\\*${name}:\\*\\* (.+)`).exec(block)?.[1];
        if (!value) throw new Error(`Missing ${name} in ${heading[1]}`);
        return value;
      };
      const narration = [...block.matchAll(/^> (.+)$/gm)]
        .map((match) => match[1])
        .join("\n");
      if (!narration) throw new Error(`Missing narration in ${heading[1]}`);
      const cueIds = [
        ...new Set(
          [...block.matchAll(/\*\*`(p\d+-s\d+)`/g)].map((match) => match[1]),
        ),
      ];
      if (!cueIds.length) throw new Error(`Missing cue beats in ${heading[1]}`);
      return {
        id: heading[1],
        title: heading[2],
        audioWindow: field("Audio window").split(" · ")[0],
        narration,
        composition: field("Shot composition"),
        movement: field("Character movement"),
        camera: field("Camera movement"),
        visualTransition: field("Visual transition"),
        continuity: field("State continuity"),
        screenText: field("On-screen text"),
        cueIds,
      };
    });
}
