# Sources, assumptions and calculation ledger

Checked 8 November 2026. All characters, pay amounts, expenses, contracts and events are fictional. No competitor transcript is treated as a financial authority. No population statistics, investment forecasts or actual provider terms are narrated.

## External claims

| ID | Narrow narrated claim | Primary source / date | Exact support | Status / limit |
|---|---|---|---|---|
| F01 | Subtract monthly spending from income; remaining money can be put into savings. | [Consumer.gov: Making a Budget](https://consumer.gov/your-money/making-budget), August 2024; accessed 2026-11-08 | “Subtract your monthly bills and expenses from how much money you make in a month.” / “You can put leftover money into savings every month” | Verified. The story separately assumes actual retained transfers; arithmetic alone does not prove savings. |
| F02 | Net worth equals assets minus liabilities; salary alone is not a complete net-worth statement. | [SEC Investor.gov: Figure Out Your Finances](https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/figure-out-your-finances), no page date shown; accessed 2026-11-08 | “Subtract your liabilities from your assets.” | Verified definition. Neither character's complete net worth is calculated. |
| F03 | An automatic deposit can implement a saving plan. | [SEC Investor.gov: Figure Out Your Finances](https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/figure-out-your-finances), no page date shown; accessed 2026-11-08 | “have your bank automatically deposit money from your paycheck into a savings or investment account.” | Verified mechanism, not a guarantee. Alex's timing and affordable amount are fictional assumptions; automation does not create available funds. |

## Assumptions

| ID | Assumption | Scope |
|---|---|---|
| A01 | Both start at $3,000 monthly take-home income, $2,600 illustrated expenses; each receives $600 additional monthly take-home income. | Reuse `example` from `src/finance/math.ts`. Raise is after deductions; no gross-to-net estimate. Expenses exclude savings transfers. Other baseline costs stay unchanged. Not a complete real household budget. |
| A02 | In each modeled month, all money remaining after illustrated expenses is transferred into savings and retained; no fees, withdrawals, interest or investment returns. | Added assumption required to substantiate the supplied hook. No opening savings balance specified. Irregular/unillustrated costs could reduce actual saving. |
| A03 | Sam's extra $300 rent starts in month one and continues. | Fictional incremental rent, not an average or market quote. Deposits, moving costs and cash used for them are excluded from this narrow recurring-cash-flow comparison. No net-worth inference. |
| A04 | Sam switches an existing long-term car rental to a newer rented vehicle; his transport budget increases $220 from month two. | Fictional incremental cost. No loan, APR, vehicle purchase, ownership or resale asset. No financing terms implied. One-time deposits/fees excluded. Baseline transport and other included costs are held unchanged. |
| A05 | Sam adds $100 in recurring services/memberships from month three. | Fictional combined amount; no provider prices claimed. |
| A06 | Three-month progression is cumulative: added costs $300, then $520, then $620. | Sam saves $700 + $480 + $380 = $1,560. Before-raise counterfactual is $400 × 3 = $1,200. Monthly saving falls by $20 in month three; cumulative saving over these three months is $360 above the old pace. |
| A07 | Alex adds $200 of monthly chosen spending from month one, keeps his baseline home/transport and transfers $800 a month. | $2,800 expenses; $2,400 saved in three months. Identical starting cash-flow inputs and savings rule, different chosen spending. Comforts forgone are shown. |
| A08 | Alex schedules a transfer after pay arrives, leaving enough for the included bills. | Fictional execution of a checked plan. No assumed overdraft immunity, bank feature, interest rate or universal appropriate transfer amount. |
| A09 | Sam's extra services are cancellable before the next full billing month, removing $100. Housing and transport remain unchanged. | Assumed contracts, not a claim about actual cancellation rules. Revised expenses $3,120; remaining and transferred $480. |
| A10 | Separate twelve-month illustration holds the month-three spending pattern unchanged for both, ignoring Sam's later cancellation. | $380 × 12 = $4,560; $800 × 12 = $9,600; gap $5,040. Not the first twelve months with ramp-up, not a forecast, not a net-worth comparison. |

## Derived ledger

Every amount is fictional monthly USD unless the row explicitly covers a longer period. Existing `calculateBudget(example)` supplies steady-state totals; use `sum`/`remaining` from the same module for the progression. Do not change the shared example or add a competing graphics calculation.

| Stage | Income | Added expenses | Total expenses | Remaining | Explicit savings transfer |
|---|---:|---:|---:|---:|---:|
| Both: before raise | 3,000 | 0 | 2,600 | 400 | 400 |
| Same expenses after raise, counterfactual | 3,600 | 0 | 2,600 | 1,000 | 1,000 if transferred |
| Sam: month 1 | 3,600 | 300 | 2,900 | 700 | 700 |
| Sam: month 2 | 3,600 | 520 | 3,120 | 480 | 480 |
| Sam: month 3 | 3,600 | 620 | 3,220 | 380 | 380 |
| Alex: each modeled month | 3,600 | 200 | 2,800 | 800 | 800 |
| Sam: next full month after cancellations | 3,600 | 520 | 3,120 | 480 | 480 |

Three-month contribution gap: $2,400 − $1,560 = $840. Month-three transfer gap: $800 − $380 = $420. Sam's current monthly transfer change from baseline: $380 − $400 = −$20. No claim that a $600 raise itself causes a loss.

## Production labels and limitations

- Opening label: “Fictional example · monthly take-home USD.” Keep assumptions accessible in the finished film/description.
- Show remaining and savings transfer as distinct steps. Animate money reaching an expense recipient or savings account, never disappearing without a destination.
- Twelve-month card: “Unchanged month-three pattern · no returns/withdrawals · illustration.” Give cancellation its separate result.
- Title is qualified by the ending: earning more can help; this example shows why it may fail to increase monthly saving when chosen recurring costs outgrow the raise.
- Personal cost pressures, health, dependents, inflation, debts, investment assets and future income are not modeled. Do not generalize the fictional choices to all households or claim saving alone defines wealth.
