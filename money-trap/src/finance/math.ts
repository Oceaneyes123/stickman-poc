export const usd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export const sum = (amounts: readonly number[]) =>
  amounts.reduce((total, amount) => total + amount, 0);
export const remaining = (income: number, expenses: number) =>
  income - expenses;
export const debtTotal = (
  principal: number,
  annualRate: number,
  months: number,
) => {
  if (
    ![principal, annualRate, months].every(Number.isFinite) ||
    principal < 0 ||
    annualRate < 0 ||
    months < 0
  )
    throw new Error("Debt inputs must be finite and nonnegative");
  return Math.round(principal * (1 + annualRate / 12) ** months * 100) / 100;
};
export type BudgetExample = {
  income: number;
  expenses: number;
  raise: number;
  upgrades: { label: string; amount: number }[];
  alexAdded: number;
};
export const example: BudgetExample = {
  income: 3000,
  expenses: 2600,
  raise: 600,
  upgrades: [
    { label: "Rent", amount: 300 },
    { label: "Car", amount: 220 },
    { label: "Subscriptions", amount: 100 },
  ],
  alexAdded: 200,
};
export const calculateBudget = (data: BudgetExample) => {
  const amounts = [
    data.income,
    data.expenses,
    data.raise,
    data.alexAdded,
    ...data.upgrades.map((item) => item.amount),
  ];
  if (!amounts.every((n) => Number.isFinite(n) && n >= 0))
    throw new Error("Budget amounts must be finite and nonnegative");
  const added = sum(data.upgrades.map((item) => item.amount));
  const income = data.income + data.raise;
  return {
    added,
    income,
    before: remaining(data.income, data.expenses),
    samExpenses: data.expenses + added,
    sam: remaining(income, data.expenses + added),
    alexExpenses: data.expenses + data.alexAdded,
    alex: remaining(income, data.expenses + data.alexAdded),
  };
};
