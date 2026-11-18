export const usd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export const sum = (amounts: readonly number[]) =>
  amounts.reduce((total, amount) => total + amount, 0);
export const remaining = (income: number, expenses: number) => income - expenses;
/** Split one price into equal instalments. The only arithmetic this story uses. */
export const payInFour = (total: number, count = 4) => {
  if (
    ![total, count].every(Number.isFinite) ||
    total <= 0 ||
    !Number.isInteger(count) ||
    count <= 0 ||
    total % count !== 0
  )
    throw new Error("Pay-in-four inputs must be positive and divide evenly");
  return { total, count, installment: total / count };
};
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
export type FreeShippingExample = {
  cart: number;
  shipping: number;
  threshold: number;
  addOn: number;
};
export const freeShippingExample: FreeShippingExample = {
  cart: 42,
  shipping: 6,
  threshold: 50,
  addOn: 12,
};
export const calculateFreeShippingOrder = (
  data: FreeShippingExample = freeShippingExample,
) => {
  const amounts = [data.cart, data.shipping, data.threshold, data.addOn];
  if (
    !amounts.every((n) => Number.isFinite(n)) ||
    data.cart <= 0 ||
    data.shipping < 0 ||
    data.threshold <= 0 ||
    data.addOn <= 0
  )
    throw new Error(
      "Free-shipping order inputs must be finite and positive (shipping nonnegative)",
    );
  const beforeSubtotal = data.cart;
  const beforeQualifies = beforeSubtotal >= data.threshold;
  const beforeShipping = beforeQualifies ? 0 : data.shipping;
  const before = sum([beforeSubtotal, beforeShipping]);
  const gap = Math.max(0, remaining(data.threshold, beforeSubtotal));
  const subtotal = sum([data.cart, data.addOn]);
  const qualifies = subtotal >= data.threshold;
  const afterShipping = qualifies ? 0 : data.shipping;
  const after = sum([subtotal, afterShipping]);
  const overshoot = Math.max(0, remaining(subtotal, data.threshold));
  const increase = remaining(after, before);
  return {
    beforeSubtotal,
    beforeQualifies,
    beforeShipping,
    before,
    gap,
    subtotal,
    qualifies,
    afterShipping,
    after,
    overshoot,
    increase,
  };
};
