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

const METHODOLOGY_DATE = "June 2026";

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
    "Float and Zensus both help businesses forecast cash flow, but they solve different problems for different teams. Float is a mature accounting-connected forecasting platform with revenue-tiered pricing. Zensus is built for variable revenue, live bank data, and subscription-aware projections with a flat price.",
  competitorBestFor:
    "Float is a strong fit if you already run on Xero or QuickBooks, want an established cash flow forecasting product with 13-week and up to 36-month views, and prefer revenue-tiered pricing that can start below $199 per month. Float also supports multiple companies from one dashboard, which accountants and fractional CFOs often need.",
  zensusBestFor:
    "Zensus is a stronger fit if your cash picture depends on when money actually hits the bank, not just accounting recognition. That includes annual and quarterly contracts synced from HubSpot, live Plaid bank feeds, plain-English scenario questions, and Slack alerts when a 30-day projection crosses a cash floor you set.",
  competitorStrengths: [
    "Lower entry price on Float's public USD pricing page (from $31/mo billed monthly, scaling with company revenue)",
    "Up to 36-month forecasts plus 13-week rolling views on Float's features page",
    "Unlimited users on all Float plans per Float pricing",
    "Multi-company dashboard for accountants and agencies",
    "Mature scenario toggles (up to 8 scenarios) with cash-threshold early warnings",
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
      "Float prices by company revenue on its public pricing page. In USD, monthly billing starts from $31/mo for the lowest revenue band and rises through tiers (for example $105/mo and $154/mo at higher bands as of June 2026). Annual billing starts from $25/mo equivalent. All plans include Float's full feature set. 14-day free trial, no credit card required.",
    zensus:
      "Zensus Pro is $199 per month, billed monthly, cancel anytime. One public plan includes Plaid, QuickBooks, HubSpot, Slack, the scenario agent, and unlimited scenarios. 14-day free trial.",
  },
  tableRows: [
    {
      label: "Starting price (USD)",
      competitor: "From $31/mo (revenue-tiered)",
      zensus: "$199/mo flat",
    },
    {
      label: "Free trial",
      competitor: "14 days, no credit card",
      zensus: "14 days",
    },
    {
      label: "Primary data sources",
      competitor: "Xero, QuickBooks, FreeAgent (accounting)",
      zensus: "Plaid bank, QuickBooks, HubSpot",
    },
    {
      label: "Live bank feed (Plaid)",
      competitor: "Not on Float public pages",
      zensus: "Yes",
    },
    {
      label: "CRM / subscription-aware forecasting",
      competitor: "Not on Float public pages",
      zensus: "HubSpot subscriptions",
    },
    {
      label: "Forecast views",
      competitor: "Daily, weekly, monthly; 13-week and up to 36 months",
      zensus: "Monthly, weekly, daily drill-down",
    },
    {
      label: "Scenario planning",
      competitor: "Form-based toggles (up to 8 scenarios)",
      zensus: "Plain-English agent scenarios",
    },
    {
      label: "Cash threshold alerts",
      competitor: "Early warnings on cash runway date",
      zensus: "Slack alerts on 30-day projection",
    },
    {
      label: "Multi-company management",
      competitor: "Yes (company dashboard)",
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
        "Float is stronger if you want a proven accounting-connected forecast with multi-company support and revenue-tiered pricing. Zensus is stronger if you need live bank data, HubSpot subscription timing, plain-English scenarios, and Slack alerts in one flat-priced plan.",
    },
    {
      question: "How does Float pricing compare to Zensus?",
      answer:
        "Float's public USD pricing starts from $31 per month billed monthly and increases with company revenue. Zensus is $199 per month flat with every integration included. Float can cost less at early revenue bands; Zensus stays predictable as you scale.",
    },
    {
      question: "Does Float connect to Plaid or HubSpot?",
      answer:
        "Float's public feature and pricing pages describe connections to Xero, QuickBooks, and FreeAgent. Plaid bank feeds and HubSpot CRM sync were not found on Float's public pages as of June 2026.",
    },
    {
      question: "What are good Float alternatives?",
      answer:
        "Alternatives depend on your stack. Zensus is one option if you want Plaid plus QuickBooks plus HubSpot with subscription-aware timing. Cash Flow Frog, Pulse, and spreadsheet-first tools are other paths founders compare.",
    },
    {
      question: "Can I try both before deciding?",
      answer:
        "Yes. Float offers a 14-day free trial with no credit card. Zensus offers a 14-day trial on the same terms.",
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
    "Pulse and Zensus both help business owners answer whether they can afford a hire or survive a slow month. Pulse is a focused, lower-cost cash flow workbook with QuickBooks Online sync. Zensus automates projections from bank, accounting, and CRM data with an AI scenario agent.",
  competitorBestFor:
    "Pulse is a strong fit if you want a simple, affordable cash flow tool ($29/mo Basics on Pulse's pricing page), prefer to model income and expenses yourself, and mainly need QuickBooks Online sync plus scenario toggles without a higher automation layer.",
  zensusBestFor:
    "Zensus is a stronger fit if you want projections that update from connected data, subscription contracts that land in lumps, live bank balances via Plaid, and plain-English what-if questions without rebuilding spreadsheets.",
  competitorStrengths: [
    "Lower price: Pulse Basics at $29/mo on Pulse's public pricing page",
    "Premium tier at $89/mo for unlimited financial accounts and currency conversion",
    "30-day free trial on new accounts",
    "Simple scenario toggles to test income and expense changes quickly",
    "Multi-currency support on Premium",
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
      "Pulse Basics is $29 per month for core cash flow views, recurring entries, and reports. Pulse Premium (Extra Features) is $89 per month and adds unlimited financial accounts, currency conversion, and document attachments. New accounts get a 30-day free trial per Pulse pricing.",
    zensus:
      "Zensus Pro is $199 per month, billed monthly, cancel anytime. Includes Plaid, QuickBooks, HubSpot, Slack, the scenario agent, and unlimited scenarios. 14-day free trial.",
  },
  tableRows: [
    {
      label: "Starting price (USD)",
      competitor: "$29/mo (Basics)",
      zensus: "$199/mo flat",
    },
    {
      label: "Premium tier",
      competitor: "$89/mo (unlimited accounts, multi-currency)",
      zensus: "N/A (one plan)",
    },
    {
      label: "Free trial",
      competitor: "30 days (new accounts)",
      zensus: "14 days",
    },
    {
      label: "QuickBooks Online sync",
      competitor: "Yes (Pulse homepage)",
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
      competitor: "Yes (Premium)",
      zensus: "USD-focused forecasting",
    },
  ],
  faqs: [
    {
      question: "Is Zensus or Pulse better for cash flow?",
      answer:
        "Pulse is better if you want a low-cost, hands-on cash flow workbook with QuickBooks sync. Zensus is better if you want automated projections from bank and CRM data, subscription-aware timing, and an AI agent for scenarios.",
    },
    {
      question: "How much does Pulse cost compared to Zensus?",
      answer:
        "Pulse Basics is $29 per month and Premium is $89 per month on Pulse's public pricing page. Zensus is $199 per month flat with all integrations included.",
    },
    {
      question: "What are good Pulse app alternatives?",
      answer:
        "Founders comparing Pulse often look at Float, Cash Flow Frog, spreadsheet templates, and automation-first tools like Zensus when they outgrow manual entry.",
    },
    {
      question: "Does Pulse connect to Plaid or HubSpot?",
      answer:
        "Pulse's public site describes QuickBooks Online sync. Plaid bank feeds and HubSpot were not found on Pulse's public pages as of June 2026.",
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
