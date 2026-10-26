# QuickBooks Online forecasting: Intuit source quotes, read 2026-10-19

Evidence file for the Intuit statements on `/quickbooks-cash-flow-forecasting`
(`src/pages/QuickBooksForecasting.tsx`). Every QuickBooks fact on that page is
quoted from or attributed to one of Intuit's own help pages, linked from the
page itself. This file records the exact wording and the "Updated" stamp each
Intuit page carried on the day it was read, so a later reader can tell whether
Intuit has reworded something since.

The Cash Flow Planner and QuickBooks Desktop quotes already on the page were
read in October 2026 for #128 and are unchanged. The two pages below were added
on 2026-10-19.

## Create and manage forecasts in QuickBooks Online Advanced

URL: https://quickbooks.intuit.com/learn-support/en-us/help-article/budget-forecast-reports/create-manage-forecasts-quickbooks-online/L7SlFsgsy_US_en_US
Intuit stamp on the page: "Updated 10/7/2026 13:21"

- Plan: "In QuickBooks Online Advanced, you can create forecasts to help you project your growth, spot trends, and create budgets."
- Data source: "You can view the automatic forecast we've created based on your profit and loss statement."
- What it forecasts: "... to build forecasts for your income, cost of sales, and expenses."
- Horizon: "You can make a forecast for the rest of the fiscal year, up to the end of next year, or up to three years."
- Accounting basis: "Currently, we only support Accrual based accounting."
- Budgets: "You can also turn the forecast into a budget."
- Reports: "You can run forecast reports that help you keep track of your business performance against the forecasted numbers." The two reports named are "Forecast Overview" and "Forecast vs. Actuals".

## Forecast your financial performance with Intuit Intelligence

URL: https://quickbooks.intuit.com/learn-support/en-us/help-article/tasks/forecast-financial-performance-intuit-intelligence/L7o5sk5t2_US_en_US
Intuit stamp on the page: "Updated 8/3/2026 05:29"

- What it does: "Intuit Intelligence reviews your historical QuickBooks data to project your income, expenses, and cash flow."
- Horizon: "Intuit Intelligence reviews your past business activity to project your performance and cash flow for the next 12 months."
- Data needed: "At least 2 years of transaction history in your books."
- Scenarios: "You can then chat with it to test business scenarios, like hiring a new employee, before you decide." and "Next, you can run a scenario analysis to test what-if questions about your business."
- Plan notes: "Converting a forecast to a budget is available in QuickBooks Online Advanced." and "Intelligence forecasting isn't available in Intuit Accountant Suite (IAS)."
- Intuit's own caveats: "Your forecast is only as accurate as the data in your books." and "Review any forecast or scenario before you make business decisions."

## Use the cash flow forecast grid in QuickBooks Online (added 2026-10-26)

URL: https://quickbooks.intuit.com/learn-support/en-us/help-article/forecasting/use-cash-flow-forecast-grid-quickbooks-online/L9SPec2UI_US_en_US
Intuit stamp on the page: none shown when read on 2026-10-26.

Added after the blog fact check (#159) found the page left this feature out.

- Plans: "The cash flow forecast grid is available in QuickBooks Online Simple Start, QuickBooks Online Essentials, QuickBooks Online Plus, and QuickBooks Online Advanced."
- Horizon: "It shows your cash flow by account group over 13 weeks."
- Basis: "The forecast uses your QuickBooks data and tracks when you receive or spend money, not when you create invoices or bills."
- Future rows: "Open invoices, recurring bills, and manual projections, including expected dates and source details." Also "AI predictions: Predicted dates or amounts based on past activity."
- Edits: "You can also update expected dates or exclude individual transactions from your forecast." and "These changes affect only your forecast. They don't change your original invoices or bills."

## How the page uses them

- The section "Forecasting in QuickBooks Online beyond the planner" opens with the forecast grid, quoting its plans, 13-week horizon, future rows and edit sentences; two FAQs name it as one of Intuit's options.
- The section "Forecasting in QuickBooks Online beyond the planner" quotes the plan, data source, horizon, accounting basis and 12-month and 2-year sentences above.
- The FAQ "Does QuickBooks do sales or demand forecasting?" relies on the "income, cost of sales, and expenses" and "income, expenses, and cash flow" sentences: neither Intuit feature is described as a demand, sales-pipeline or purchase-cycle forecast. Zensus does not forecast demand either, and the FAQ says so.
- Nothing on the page states a price for any Intuit plan.

## Zensus facts used alongside them

Checked against the app code on 2026-10-05 (see the comment block at the top of
the page component): QuickBooks syncs once a day; open invoices sit on their due
dates and overdue ones are moved forward; open bills sit on their due dates;
payroll is detected from recurring bank debits; HubSpot subscriptions are placed
on their next payment dates; the forecast uses one currency and converts
nothing; default horizon 36 months with monthly, weekly, daily and 13-week views.
Zensus does not need two years of history because it starts from the current
bank balance and the documents that are open today.
