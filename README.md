# FIRE Calculator MVP

A fast, transparent FIRE calculator that shows not just *when* you reach financial independence, but *why*.

## 1. MVP Feature List (Prioritized)

1.  **Core FIRE Calculation Engine:**
    *   Inputs: Age, Current Net Worth (Cash/Investments), Annual Income (Gross/Net), Annual Spending, Expected Real Return, Safe Withdrawal Rate (SWR).
    *   Outputs: FIRE Number, Years to FI, FIRE Age, Net Worth Growth Over Time.
2.  **Visualizations:**
    *   Net worth growth chart (Time vs. Assets).
    *   FIRE target line.
    *   "You are here" indicator.
3.  **Scenario & Sensitivity Analysis (MVP-Light):**
    *   Sliders for Spending, Return Rate, and Savings Rate.
    *   Instant feedback on FIRE age and years gained/lost.
4.  **Insight Layer:**
    *   Auto-generated, actionable insights.
    *   Examples: "Reducing spending by $5k moves FIRE forward 2.1 years."

## 2. Data Model & Formulas

### Data Model

*   `age`: number
*   `netWorth`: { `cash`: number, `investments`: number }
*   `income`: { `gross`: number, `net`: number }
*   `spending`: number
*   `expectedReturn`: number (real, after inflation)
*   `swr`: number (default: 0.04)

### Formulas

*   **FIRE Number**: `spending / swr`
*   **Years to FI**: Calculated iteratively year-by-year. In a given year, `newNetWorth = oldNetWorth * (1 + expectedReturn) + (income.net - spending)`. Repeat until `newNetWorth >= fireNumber`.

## 3. UI Wireframe Outline (Text-Based)

```
[Header: FIRE Calculator]

[Section: Your Numbers]
  [Input] Age: 30
  [Input] Net Worth (Cash): $10,000
  [Input] Net Worth (Investments): $90,000
  [Input] Annual Net Income: $80,000
  [Input] Annual Spending: $40,000

[Section: Assumptions]
  [Slider] Expected Real Return: 7%
  [Slider] Safe Withdrawal Rate: 4%

[Section: Your FIRE Journey]
  [Chart] Net worth growth over time, with FIRE line.
  [Key Metric] Your FIRE Number: $1,000,000
  [Key Metric] Years to FI: 15.4 years
  [Key Metric] FIRE Age: 45

[Section: Scenarios & Insights]
  [Slider] Adjust Spending: +$5,000 (moves FIRE back 2.1 years)
  [Insight] "Your savings rate is the biggest driver of your FIRE date."
```

## 4. Example Insights Text

*   "Your savings rate contributes ~60% of your FIRE speed."
*   "Reducing annual spending by $5k moves FIRE forward 2.1 years."
*   "You are on track to be Coast FIRE at age 38."
*   "If your investments returned just 1% less per year, your FIRE date would be delayed by 3.5 years."

## 5. Monetization Hooks

*   **[Subtle Link]** "Want to see how taxes in [Country] affect this? **Upgrade to Pro.**"
*   **[Button]** "Save and Compare Scenarios" (leads to signup/login).
*   **[Callout]** "Stress-test your plan against bad markets with Monte Carlo simulations. **Learn More.**"

## 6. Roadmap Beyond MVP

*   **V2:**
    *   Country-specific tax assumptions.
    *   Monte Carlo simulations.
    *   User accounts and saved scenarios.
*   **V3:**
    *   Coast / Barista FIRE modes.
    *   PDF/Notion-style plan export.
    *   Integrations with financial data aggregators.

---

This project adheres to the principles of clarity, correctness, and user empowerment. All calculations will be transparent, and the UX will be designed to be as frictionless as possible.
