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

export type InstallmentStatus =
  | "paid-today"
  | "scheduled"
  | "completed"
  | "overdue";

export type InstallmentItem = {
  index: number;
  label: string;
  date: string;
  dayOfMonth?: number;
  amount: number;
  status: InstallmentStatus;
};

export const buildInstallmentSchedule = ({
  title,
  total,
  count = 4,
  dates,
  daysOfMonth,
  paidCount = 1,
}: {
  title: string;
  total: number;
  count?: number;
  dates: readonly string[];
  daysOfMonth?: readonly number[];
  paidCount?: number;
}) => {
  const split = payInFour(total, count);
  if (dates.length !== count)
    throw new Error(`Expected ${count} dates, received ${dates.length}`);
  if (daysOfMonth && daysOfMonth.length !== count)
    throw new Error(`Expected ${count} day-of-month entries`);
  if (!Number.isInteger(paidCount) || paidCount < 0 || paidCount > count)
    throw new Error("paidCount must be an integer between 0 and count");

  const items: InstallmentItem[] = dates.map((date, index) => ({
    index: index + 1,
    label: index === 0 ? "Due today" : `Payment ${index + 1} of ${count}`,
    date,
    dayOfMonth: daysOfMonth?.[index],
    amount: split.installment,
    status: index < paidCount ? (index === 0 ? "paid-today" : "completed") : "scheduled",
  }));

  const dueToday = sum(items.slice(0, paidCount).map((item) => item.amount));
  const futureCommitment = remaining(total, dueToday);

  return {
    title,
    total,
    count,
    installment: split.installment,
    dueToday,
    futureCommitment,
    items,
  };
};

export type ObligationCategory =
  | "bnpl"
  | "bill"
  | "subscription"
  | "repair"
  | "loan";

export type ObligationEntry = {
  id: string;
  label: string;
  category: ObligationCategory;
  amount: number;
  date: string;
  dayOfMonth: number;
};

export const summarizeObligations = (
  income: number,
  entries: readonly ObligationEntry[],
) => {
  if (!Number.isFinite(income) || income < 0)
    throw new Error("Income must be finite and nonnegative");
  for (const entry of entries) {
    if (!Number.isFinite(entry.amount) || entry.amount <= 0)
      throw new Error(`Obligation "${entry.id}" must have a positive amount`);
  }
  const bnplTotal = sum(
    entries.filter((e) => e.category === "bnpl").map((e) => e.amount),
  );
  const otherTotal = sum(
    entries.filter((e) => e.category !== "bnpl").map((e) => e.amount),
  );
  const totalCommitted = sum(entries.map((e) => e.amount));
  const uncommitted = remaining(income, totalCommitted);
  const byDay = new Map<number, ObligationEntry[]>();
  for (const entry of entries) {
    const list = byDay.get(entry.dayOfMonth) ?? [];
    list.push(entry);
    byDay.set(entry.dayOfMonth, list);
  }
  const collisions = Array.from(byDay.entries())
    .filter(([, list]) => list.length > 1)
    .map(([dayOfMonth, list]) => ({
      dayOfMonth,
      entries: list,
      total: sum(list.map((item) => item.amount)),
    }));

  return {
    income,
    bnplTotal,
    otherTotal,
    totalCommitted,
    uncommitted,
    collisions,
  };
};

export const calculateLoanBreakdown = ({
  principal,
  annualRate,
  months,
  monthlyPayment,
}: {
  principal: number;
  annualRate: number;
  months: number;
  monthlyPayment?: number;
}) => {
  if (
    ![principal, annualRate, months].every(Number.isFinite) ||
    principal <= 0 ||
    annualRate < 0 ||
    !Number.isInteger(months) ||
    months <= 0
  )
    throw new Error("Loan inputs must be positive principal/months and nonnegative rate");

  const r = annualRate / 12;
  const computedPayment =
    monthlyPayment ??
    (r === 0
      ? principal / months
      : (principal * r) / (1 - (1 + r) ** -months));
  if (!Number.isFinite(computedPayment) || computedPayment <= 0)
    throw new Error("Invalid monthly loan payment");

  const schedule: {
    month: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
  }[] = [];

  let balance = principal;
  let totalPaid = 0;
  let totalInterest = 0;
  for (let month = 1; month <= months && balance > 0.005; month++) {
    const interest = Math.round(balance * r * 100) / 100;
    const maxPay = Math.round((balance + interest) * 100) / 100;
    const payment = Math.min(Math.round(computedPayment * 100) / 100, maxPay);
    const principalPaid = Math.round((payment - interest) * 100) / 100;
    balance = Math.max(0, Math.round((balance - principalPaid) * 100) / 100);
    totalPaid = Math.round((totalPaid + payment) * 100) / 100;
    totalInterest = Math.round((totalInterest + interest) * 100) / 100;
    schedule.push({
      month,
      payment,
      interest,
      principal: principalPaid,
      balance,
    });
  }

  return {
    principal,
    monthlyPayment: Math.round(computedPayment * 100) / 100,
    totalPaid,
    totalInterest,
    principalShare: totalPaid > 0 ? Math.round((principal / totalPaid) * 1000) / 1000 : 1,
    interestShare: totalPaid > 0 ? Math.round((totalInterest / totalPaid) * 1000) / 1000 : 0,
    schedule,
  };
};

export const compareMinimumPayment = ({
  balance,
  annualRate,
  minimumRate = 0.02,
  minimumFloor = 25,
  fixedAlternative,
  maxMonths = 360,
}: {
  balance: number;
  annualRate: number;
  minimumRate?: number;
  minimumFloor?: number;
  fixedAlternative: number;
  maxMonths?: number;
}) => {
  if (
    ![balance, annualRate, minimumRate, minimumFloor, fixedAlternative].every(
      Number.isFinite,
    ) ||
    balance <= 0 ||
    annualRate < 0 ||
    minimumRate <= 0 ||
    minimumFloor <= 0 ||
    fixedAlternative <= 0
  )
    throw new Error("Credit card comparison inputs must be finite and positive");

  const simulate = (mode: "minimum" | "fixed") => {
    let b = balance;
    let months = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    const r = annualRate / 12;
    while (b > 0.005 && months < maxMonths) {
      months++;
      const interest = Math.round(b * r * 100) / 100;
      const due =
        mode === "minimum"
          ? Math.max(minimumFloor, Math.round((b * minimumRate + interest) * 100) / 100)
          : fixedAlternative;
      const pay = Math.min(due, Math.round((b + interest) * 100) / 100);
      b = Math.max(0, Math.round((b - (pay - interest)) * 100) / 100);
      totalInterest = Math.round((totalInterest + interest) * 100) / 100;
      totalPaid = Math.round((totalPaid + pay) * 100) / 100;
    }
    return { months, totalInterest, totalPaid, remainingBalance: b };
  };

  const minimum = simulate("minimum");
  const fixed = simulate("fixed");
  return {
    balance,
    annualRate,
    minimum,
    fixed,
    interestSaved: Math.round((minimum.totalInterest - fixed.totalInterest) * 100) / 100,
    monthsSaved: minimum.months - fixed.months,
  };
};
