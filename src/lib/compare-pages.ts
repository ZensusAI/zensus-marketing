import type { FaqItem } from "@/lib/structured-data";

export interface CompareTableRow {
  label: string;
  competitor: string;
  zensus: string;
}

export interface ComparePageConfig {
  slug: string;
  competitorName: string;
  competitorSite: string;
  competitorPricingUrl: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  ogSubtitle: string;
  lead: string;
  competitorBestFor: string;
  zensusBestFor: string;
  competitorStrengths: string[];
  zensusStrengths: string[];
  pricingSummary: {
    competitor: string;
    zensus: string;
  };
  tableRows: CompareTableRow[];
  faqs: FaqItem[];
}

const METHODOLOGY_DATE = "September 2026";

export const COMPARE_METHODOLOGY = `Based on publicly available vendor pages, ${METHODOLOGY_DATE}.`;

export const FLOAT_COMPARE: ComparePageConfig = {
  slug: "zensus-vs-float",
  competitorName: "Float",
  competitorSite: "https://floatapp.com",
  competitorPricingUrl: "https://floatapp.com/pricing",
  pageTitle: "Zensus vs Float",
  metaTitle: "Zensus vs Float: Cash Flow Forecasting Comparison (2026)",
  metaDescription:
    "Compare Zensus and Float for cash flow forecasting: pricing, bank feeds, scenario planning, integrations, and who each tool is actually for.",
  ogSubtitle:
    "Honest comparison of Zensus and Float on pricing, integrations, scenarios, and who each tool fits best.",
  lead:
    "Float and Zensus both help businesses forecast cash flow, but they solve different problems for different teams. Float is a mature accounting-connected forecasting platform built for finance teams, with plans tied to company revenue. Zensus is built for variable revenue, live bank data, and subscription-aware projections with a flat price.",
  competitorBestFor:
    "Float is a strong fit if you already run on Xero or QuickBooks Online and want an established forecasting product for a finance team: a 13-week rolling view, monthly forecasts out to 36 months on the Growth and Scale plans, unlimited users, and up to 8 scenarios. Its Essentials plan is $130 per month billed monthly ($105 billed annually), below Zensus's $199. The Scale plan consolidates up to 5 entities, which multi-entity finance teams need.",
  zensusBestFor:
    "Zensus is a stronger fit if your cash picture depends on when money actually hits the bank, not just accounting recognition. That includes annual and quarterly contracts synced from HubSpot, live Plaid bank feeds, plain-English scenario questions, and Slack alerts when a 30-day projection crosses a cash floor you set.",
  competitorStrengths: [
    "Lower entry price: Float Essentials is $130/mo billed monthly, or $105/mo billed annually, on Float's public USD pricing page",
    "13-week rolling view on every plan, and forecasts out to 36 months on Growth and Scale (12 months on Essentials)",
    "Unlimited users and up to 8 scenarios on every plan, including a dedicated new-hire modelling tool",
    "Multi-entity consolidation on the Scale plan (up to 5 entities, more at extra cost)",
    "14-day free trial with no credit card required",
  ],
  zensusStrengths: [
    "Live bank feed via Plaid, not only accounting data",
    "HubSpot subscription sync for annual and quarterly contract timing",
    "Built-in plain-English scenario agent (no external AI connector)",
    "Slack threshold alerts on your 30-day cash projection",
    "Flat $199/mo self-serve pricing with a 14-day trial",
  ],
  pricingSummary: {
    competitor:
      "Float publishes three plans on its USD pricing page, tied to company revenue. Essentials, for companies below £2m in revenue, is $130/mo billed monthly or $105/mo billed annually. Growth, for companies above that, is $265/mo or $215/mo. Scale, for multi-entity teams, is $389/mo or $315/mo and covers up to 5 entities. Essentials forecasts 12 months ahead; Growth and Scale forecast 36. 14-day free trial, no credit card required. Prices as of September 2026.",
    zensus:
      "Zensus Pro is $199 per month, billed monthly, cancel anytime. One public plan includes Plaid, QuickBooks, HubSpot, Slack, the scenario agent, and unlimited scenarios. 14-day free trial; your card is collected at signup and is not charged until the trial ends.",
  },
  tableRows: [
    {
      label: "Starting price (USD)",
      competitor: "$130/mo billed monthly, $105/mo billed annually (Essentials)",
      zensus: "$199/mo flat",
    },
    {
      label: "Free trial",
      competitor: "14 days, no credit card",
      zensus: "14 days; card collected at signup, not charged until the trial ends",
    },
    {
      label: "Primary data sources",
      competitor: "Xero, QuickBooks Online (accounting)",
      zensus: "Plaid bank, QuickBooks, HubSpot",
    },
    {
      label: "Live bank feed (Plaid)",
      competitor: "No direct bank connection; bank data arrives through Xero or QuickBooks, synced every 24 hours (Float product page)",
      zensus: "Yes",
    },
    {
      label: "CRM / subscription-aware forecasting",
      competitor: "Not on Float public pages",
      zensus: "HubSpot subscriptions",
    },
    {
      label: "Forecast views",
      competitor: "13-week rolling (weekly) and monthly; up to 36 months on Growth and Scale",
      zensus: "Monthly, weekly, daily drill-down",
    },
    {
      label: "Scenario planning",
      competitor: "Line toggles and what-if scenarios, including new hires (up to 8 scenarios)",
      zensus: "Plain-English agent scenarios",
    },
    {
      label: "Cash threshold alerts",
      competitor: "Risk visibility in the forecast; threshold alerts not found on Float public pages",
      zensus: "Slack alerts on 30-day projection",
    },
    {
      label: "Multi-company management",
      competitor: "Scale plan: up to 5 entities, with consolidation",
      zensus: "One company per Zensus account",
    },
    {
      label: "Self-serve signup",
      competitor: "Yes",
      zensus: "Yes",
    },
  ],
  faqs: [
    {
      question: "Is Zensus or Float better for cash flow forecasting?",
      answer:
        "Float is stronger if you want a proven accounting-connected forecast for a finance team, with unlimited users and multi-entity consolidation. Zensus is stronger if you need live bank data, HubSpot subscription timing, plain-English scenarios, and Slack alerts in one flat-priced plan.",
    },
    {
      question: "How does Float pricing compare to Zensus?",
      answer:
        "Float's public USD pricing starts at $130 per month billed monthly, or $105 per month billed annually, for Essentials, its plan for companies below £2m in revenue. Growth is $265 per month and Scale is $389 per month. Zensus is $199 per month flat with every integration included. Float Essentials costs less than Zensus; Zensus costs less than Float Growth and Scale.",
    },
    {
      question: "Does Float connect to Plaid or HubSpot?",
      answer:
        "Float's public pages describe connections to Xero and QuickBooks Online, and say Float does not connect directly to your bank: bank data arrives through the accounting platform. HubSpot CRM sync was not found on Float's public pages as of September 2026.",
    },
    {
      question: "What are good Float alternatives?",
      answer:
        "Alternatives depend on your stack. Zensus is one option if you want Plaid plus QuickBooks plus HubSpot with subscription-aware timing. Cash Flow Frog, Pulse, and spreadsheet-first tools are other paths founders compare.",
    },
    {
      question: "Can I try both before deciding?",
      answer:
        "Yes. Float offers a 14-day free trial with no credit card required. Zensus offers a 14-day free trial; your card is collected at signup and is not charged if you cancel before the trial ends.",
    },
  ],
};

export const PULSE_COMPARE: ComparePageConfig = {
  slug: "zensus-vs-pulse",
  competitorName: "Pulse",
  competitorSite: "https://pulseapp.com",
  competitorPricingUrl: "https://pulseapp.com/pricing",
  pageTitle: "Zensus vs Pulse",
  metaTitle: "Zensus vs Pulse: Cash Flow Forecasting Comparison (2026)",
  metaDescription:
    "Compare Zensus and Pulse for cash flow management: pricing, QuickBooks sync, scenarios, automation, and who each tool fits best.",
  ogSubtitle:
    "Honest comparison of Zensus and Pulse on price, data sources, automation, and founder use cases.",
  lead:
    "Pulse and Zensus both help business owners answer whether they can afford a hire or survive a slow month. Pulse is a focused, lower-cost cash flow workbook with QuickBooks Online sync. Zensus automates projections from bank, accounting, and CRM data with a plain-English scenario agent.",
  competitorBestFor:
    "Pulse is a strong fit if you want a simple, affordable cash flow tool (Basics is $29/mo on Pulse's pricing page; the $59/mo Small Business Plan adds QuickBooks Online sync), prefer to model income and expenses yourself, and want scenario toggles without a higher automation layer.",
  zensusBestFor:
    "Zensus is a stronger fit if you want projections that update from connected data, subscription contracts that land in lumps, live bank balances via Plaid, and plain-English what-if questions without rebuilding spreadsheets.",
  competitorStrengths: [
    "Lower price: Pulse Basics at $29/mo on Pulse's public pricing page",
    "Small Business Plan at $59/mo adds QuickBooks Online sync, multiple financial accounts, and invited users; Premium at $89/mo adds unlimited accounts and currency conversion",
    "30-day free trial on new accounts",
    "Simple scenario toggles to test income and expense changes quickly",
    "Works with any currency, with currency conversion on Premium",
  ],
  zensusStrengths: [
    "Live Plaid bank feed plus QuickBooks plus HubSpot in one forecast",
    "Automatic projection refresh as transactions and subscriptions change",
    "Plain-English scenario agent instead of manual entry only",
    "Slack alerts when cash projection crosses your floor",
    "Built for annual and quarterly contract timing, not flat monthly spreads",
  ],
  pricingSummary: {
    competitor:
      "Pulse Basics is $29 per month for core cash flow views. The Small Business Plan is $59 per month and adds QuickBooks Online sync, multiple financial accounts, and invited users. Premium (Extra Features) is $89 per month and adds unlimited financial accounts and currency conversion. New accounts get a 30-day free trial; Pulse charges the card used at signup when the trial ends. Prices as of September 2026.",
    zensus:
      "Zensus Pro is $199 per month, billed monthly, cancel anytime. Includes Plaid, QuickBooks, HubSpot, Slack, the scenario agent, and unlimited scenarios. 14-day free trial; your card is collected at signup and is not charged until the trial ends.",
  },
  tableRows: [
    {
      label: "Starting price (USD)",
      competitor: "$29/mo (Basics)",
      zensus: "$199/mo flat",
    },
    {
      label: "Higher tiers",
      competitor: "$59/mo (adds QuickBooks Online sync); $89/mo (unlimited accounts, currency conversion)",
      zensus: "One public plan; Custom is quoted",
    },
    {
      label: "Free trial",
      competitor: "30 days; card required at signup",
      zensus: "14 days; card collected at signup, not charged until the trial ends",
    },
    {
      label: "QuickBooks Online sync",
      competitor: "Yes, from the $59/mo Small Business Plan (Pulse pricing page)",
      zensus: "Yes",
    },
    {
      label: "Live bank feed (Plaid)",
      competitor: "Not on Pulse public pages",
      zensus: "Yes",
    },
    {
      label: "HubSpot / CRM subscriptions",
      competitor: "Not on Pulse public pages",
      zensus: "HubSpot subscriptions",
    },
    {
      label: "Forecast automation",
      competitor: "Manual entries with QBO sync",
      zensus: "Auto-refresh from connected sources",
    },
    {
      label: "Scenario planning",
      competitor: "Toggle entries on/off",
      zensus: "Plain-English agent scenarios",
    },
    {
      label: "Slack alerts",
      competitor: "Not on Pulse public pages",
      zensus: "Yes",
    },
    {
      label: "Multi-currency",
      competitor: "Any currency; conversion on Premium",
      zensus: "USD-focused forecasting",
    },
  ],
  faqs: [
    {
      question: "Is Zensus or Pulse better for cash flow?",
      answer:
        "Pulse is better if you want a low-cost, hands-on cash flow workbook with QuickBooks sync. Zensus is better if you want automated projections from bank and CRM data, subscription-aware timing, and a plain-English scenario agent.",
    },
    {
      question: "How much does Pulse cost compared to Zensus?",
      answer:
        "On Pulse's public pricing page, Basics is $29 per month, the Small Business Plan with QuickBooks Online sync is $59 per month, and Premium is $89 per month. Zensus is $199 per month flat with all integrations included.",
    },
    {
      question: "What are good Pulse app alternatives?",
      answer:
        "Founders comparing Pulse often look at Float, Cash Flow Frog, spreadsheet templates, and automation-first tools like Zensus when they outgrow manual entry.",
    },
    {
      question: "Does Pulse connect to Plaid or HubSpot?",
      answer:
        "Pulse's public site describes QuickBooks Online sync. Plaid bank feeds and HubSpot were not found on Pulse's public pages as of September 2026.",
    },
    {
      question: "Which tool is better for agencies and service businesses?",
      answer:
        "Pulse markets to agencies and service businesses that want simple cash flow habits. Zensus targets businesses with variable revenue, annual contracts, and payroll timing risk who need live data and alerts.",
    },
  ],
};

export const COMPARE_PAGES: Record<string, ComparePageConfig> = {
  "zensus-vs-float": FLOAT_COMPARE,
  "zensus-vs-pulse": PULSE_COMPARE,
};

export const COMPARE_SLUGS = Object.keys(COMPARE_PAGES);
