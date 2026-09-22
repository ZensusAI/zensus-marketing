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
        "It depends on why you are leaving Float. Cash Flow Frog and Zensus add a direct bank feed through Plaid, Pulse is the lowest-cost option at $29 a month, Futrli adds daily and 3-way forecasting, and Helm prices per connected business. The Float alternatives page on this site compares all five on price, trial, bank feed, and CRM, from each vendor's own pages.",
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

/** One row of the Float alternatives page. Every competitor fact is sourced in
 * docs/comparison-substantiation-2026-09-21.md; re-verify with the quarterly
 * review. "Not found" means not on the vendor's public pages, never a claim
 * that the capability does not exist. */
export interface AlternativeEntry {
  id: string;
  name: string;
  site: string;
  sourceUrl: string;
  isZensus?: boolean;
  isReference?: boolean;
  price: string;
  trial: string;
  accounting: string;
  bankFeed: string;
  crm: string;
  bestFor: string;
  summary: string;
  differs: string[];
  tradeoffs: string[];
}

export interface AlternativesPageConfig {
  slug: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  disclosure: string;
  whyIntro: string;
  whyLeave: string[];
  stayIntro: string;
  whenStay: string[];
  tableIntro: string;
  /** The table's reference row; not one of the alternatives. */
  float: AlternativeEntry;
  entries: AlternativeEntry[];
  howToChoose: { situation: string; pick: string }[];
  faqs: FaqItem[];
}

export const FLOAT_ALTERNATIVES: AlternativesPageConfig = {
  slug: "float-alternatives",
  pageTitle: "Float alternatives for cash flow forecasting",
  metaTitle: "Float Alternatives for Cash Flow Forecasting (2026)",
  metaDescription:
    "Float alternatives compared from vendor pages: Cash Flow Frog, Pulse, Helm, Futrli, and Zensus on price, free trial, bank feed, and CRM sync.",
  lead:
    "The right Float alternative depends on why you are leaving Float: the price, the missing direct bank feed, revenue that starts in a CRM, or wanting a simpler tool.",
  disclosure:
    "Zensus publishes this page and is one of the tools on it. Every fact about another product comes from that vendor's own public pages as of September 2026, with a link to the source, and each tool's trade-offs sit next to its strengths, including ours.",
  whyIntro:
    "Float is an established, accounting-connected forecasting product. The usual reasons to look elsewhere come straight from Float's own pages:",
  whyLeave: [
    "No direct bank feed. Float says it \"doesn't connect directly to your bank\"; bank data arrives through Xero or QuickBooks Online, which Float syncs every 24 hours.",
    "Two accounting platforms. \"Currently, Float integrates with Xero and QuickBooks Online.\"",
    "Plans tied to revenue. Essentials ($130/mo, or $105/mo billed annually) is for companies below £2m in revenue; above that, Growth is $265/mo, or $215/mo billed annually.",
    "Forecast length by plan. Essentials forecasts 12 months ahead; 36-month forecasts need Growth or Scale.",
    "No CRM connection on Float's public pages, so HubSpot deals and subscriptions are not a listed data source.",
    "Built for finance teams. Float describes itself as \"cash visibility for scaling finance teams\", with typical US customers at $5M to $10M in revenue.",
  ],
  stayIntro:
    "Float is still the better fit in several cases, and at the entry level it costs less than Zensus:",
  whenStay: [
    "You run on Xero. Zensus does not connect to Xero; Float does.",
    "You want unlimited users and up to 8 scenarios, including a dedicated new-hire modelling tool, on every plan.",
    "You need multi-entity consolidation: Float's Scale plan covers up to 5 entities.",
    "You want a trial with no credit card: Float's is 14 days, no card required.",
    "Price: Float Essentials at $130/mo ($105/mo billed annually) costs less than Zensus Pro at $199/mo.",
  ],
  tableIntro:
    "Listed by the starting price each vendor shows, lowest first, with Float at the top for reference. Billing periods are stated because some vendors quote an annual plan as a monthly price. \"Not found\" means it was not on the vendor's public pages, not that the product lacks it.",
  float: {
    id: "float",
    name: "Float",
    site: "https://floatapp.com",
    sourceUrl: "https://floatapp.com/pricing",
    isReference: true,
    price: "$130/mo, or $105/mo billed annually (Essentials)",
    trial: "14 days, no card",
    accounting: "Xero, QuickBooks Online",
    bankFeed: "No; bank data comes through the accounting platform",
    crm: "Not found",
    bestFor: "",
    summary: "",
    differs: [],
    tradeoffs: [],
  },
  entries: [
    {
      id: "pulse",
      name: "Pulse",
      site: "https://pulseapp.com",
      sourceUrl: "https://pulseapp.com/pricing",
      price: "$29/mo (Basics); QuickBooks sync from $59/mo",
      trial: "30 days; card charged when it ends",
      accounting: "QuickBooks Online, from the $59 plan",
      bankFeed: "Not found",
      crm: "Not found",
      bestFor: "small businesses that want a simple, low-cost cash flow workbook and are happy to enter projections by hand.",
      summary:
        "Pulse is a focused cash flow tool that Pulse says is \"specifically designed for small businesses\". Basics is $29 a month. The $59 Small Business Plan adds QuickBooks Online sync, multiple financial accounts, and invited users, and the $89 plan adds unlimited accounts and currency conversion.",
      differs: [
        "Much lower price: $29/mo to start, against $130/mo for Float Essentials",
        "Daily, weekly, monthly, or yearly views; Float's views are weekly and monthly",
        "Works with any currency, with conversion on the $89 plan",
        "Scenario toggles: switch entries and accounts on and off to test a change",
      ],
      tradeoffs: [
        "QuickBooks Online is the only accounting sync, and it starts on the $59 plan",
        "Projections are largely entered by hand",
        "The 30-day trial charges the card used at signup when it ends",
        "Bank feed, CRM, and alerts not found on Pulse's pages",
      ],
    },
    {
      id: "cash-flow-frog",
      name: "Cash Flow Frog",
      site: "https://cashflowfrog.com",
      sourceUrl: "https://cashflowfrog.com/pricing/",
      price: "From $33/mo billed yearly (early-bird rate), set by revenue",
      trial: "14 days, no card; 30-day money-back guarantee",
      accounting: "QuickBooks Online and Desktop, Xero, Sage Intacct, Odoo, Zoho Books, FreshBooks",
      bankFeed: "Yes, via Plaid",
      crm: "No; vendor says no CRM connection",
      bestFor: "small and mid-sized businesses, and the accountants and bookkeepers who advise them, that want a direct bank feed and a low entry price.",
      summary:
        "Cash Flow Frog is a cash flow forecasting tool with one Pro plan whose price \"is set automatically based on your annual revenue\", from $33 a month billed yearly at its early-bird rate. It connects to more accounting platforms than any other tool here and reads bank deposits and withdrawals directly through Plaid.",
      differs: [
        "Direct bank feed through Plaid, which Float does not have",
        "Seven accounting platforms, including QuickBooks Desktop, against Float's two",
        "Daily, weekly, monthly, and quarterly views, up to 36 months rolling",
        "An MCP server connects the forecast to Claude, ChatGPT, Copilot, Gemini, and other assistants",
      ],
      tradeoffs: [
        "Price rises with your revenue band",
        "No CRM connection; HubSpot appears only as a Zapier pairing",
        "Scenario questions go through an external AI assistant, not a built-in one",
        "Slack or email cash alerts not found on its pages",
      ],
    },
    {
      id: "futrli",
      name: "Futrli",
      site: "https://www.futrli.com",
      sourceUrl: "https://www.futrli.com/pricing",
      price: "$40/mo excl. VAT (Single plan, 1 to 5 licenses)",
      trial: "14 days, no card",
      accounting: "Xero, QuickBooks Online, Sage; Excel",
      bankFeed: "Not found",
      crm: "Not found",
      bestFor: "sole traders, small businesses, and accounting practices that want daily forecasts and 3-way forecasting.",
      summary:
        "Futrli is a forecasting tool with plans for businesses and for accountants, priced by the number of licenses. The Single plan, for 1 to 5 licenses and aimed at sole traders, is $40 a month excluding VAT. Every plan includes unlimited users, daily cash flow forecasting, budgets and scenario modelling, and 3-way forecasting.",
      differs: [
        "Daily cash flow forecasting; Float's views are weekly and monthly",
        "3-way forecasting: profit and loss, balance sheet, and cash flow together",
        "Sage and Excel alongside Xero and QuickBooks Online",
        "Plans for accounting practices, priced by license count",
      ],
      tradeoffs: [
        "Prices are set by region; the page shows each visitor a local price",
        "The next plan up is $250/mo for 6 to 18 licenses, sized for practices",
        "Direct bank feed, CRM, and cash alerts not found on its pages",
      ],
    },
    {
      id: "helm",
      name: "Helm",
      site: "https://takethehelm.app",
      sourceUrl: "https://takethehelm.app/pricing/",
      price: "$50/mo for the first connected business (currency not stated)",
      trial: "14 days; card terms not stated",
      accounting: "Xero, QuickBooks Online, Sage Accounting",
      bankFeed: "Not found",
      crm: "Not found",
      bestFor: "small businesses and the advisors who manage cash for several clients, priced per connected business.",
      summary:
        "Helm is a cash flow forecasting tool priced per connected business: the first connection costs $50 a month, and the pricing page does not state the currency. It syncs with Xero, QuickBooks Online, and Sage Accounting, and builds 12-month forecasts with unlimited scenarios and unlimited users.",
      differs: [
        "Sage Accounting sync, alongside Xero and QuickBooks Online",
        "Unlimited scenarios, against Float's 8",
        "Priced per connected business, for advisors managing several clients",
      ],
      tradeoffs: [
        "12-month forecasts, against up to 36 months on Float Growth and Scale",
        "The pricing page does not state a currency",
        "Direct bank feed, CRM, and cash alerts not found on its pages",
      ],
    },
    {
      id: "zensus",
      name: "Zensus",
      site: "",
      sourceUrl: "/pricing",
      isZensus: true,
      price: "$199/mo, billed monthly (Zensus Pro)",
      trial: "14 days; card collected at signup, not charged until the trial ends",
      accounting: "QuickBooks",
      bankFeed: "Yes, via Plaid",
      crm: "HubSpot subscriptions",
      bestFor: "businesses with variable revenue, such as annual and quarterly contracts or late-paying clients, that run on QuickBooks and HubSpot and want a live bank feed.",
      summary:
        "Zensus connects bank accounts through Plaid, QuickBooks, and HubSpot, and projects cash from when money actually lands, including annual and quarterly contracts synced from HubSpot. You ask scenario questions in plain English, and Slack alerts fire when the 30-day projection crosses a cash floor you set. Zensus Pro is $199 a month with every integration included.",
      differs: [
        "Live bank feed through Plaid, not only accounting data",
        "HubSpot subscription sync, so contract renewals land in the month the cash arrives",
        "Plain-English scenario questions built in",
        "Slack alerts when the 30-day projection crosses your cash floor",
        "One flat price that does not rise with your revenue",
      ],
      tradeoffs: [
        "Costs more than Float Essentials ($130/mo), though less than Float Growth ($265/mo)",
        "No Xero connection",
        "One company per account, with no multi-entity consolidation",
        "The trial collects a card at signup",
      ],
    },
  ],
  howToChoose: [
    {
      situation: "The lowest price",
      pick: "Pulse at $29/mo, or Cash Flow Frog from $33/mo billed yearly.",
    },
    {
      situation: "A direct bank feed",
      pick: "Cash Flow Frog or Zensus, which both connect banks through Plaid.",
    },
    {
      situation: "Revenue that starts in HubSpot",
      pick: "Zensus, which syncs HubSpot subscriptions natively.",
    },
    {
      situation: "Xero",
      pick: "Cash Flow Frog, Futrli, or Helm, or stay on Float. Zensus does not connect to Xero.",
    },
    {
      situation: "Daily forecasts",
      pick: "Pulse, Cash Flow Frog, and Futrli all show daily views, and Zensus has a daily drill-down. Float's views are weekly and monthly.",
    },
    {
      situation: "An accountant managing several clients",
      pick: "Futrli's practice plans, Helm's per-business pricing, or Cash Flow Frog, which is built for accountants and bookkeepers as well as businesses.",
    },
    {
      situation: "Several entities",
      pick: "Float's Scale plan, which consolidates up to 5 entities.",
    },
    {
      situation: "Cash alerts in Slack",
      pick: "Zensus, which sends a Slack alert when the 30-day projection crosses a cash floor you set.",
    },
  ],
  faqs: [
    {
      question: "What is the best alternative to Float?",
      answer:
        "It depends on why you are leaving. Cash Flow Frog and Zensus add a direct bank feed through Plaid, which Float does not have. Pulse is the lowest-cost option at $29 a month. Futrli adds daily and 3-way forecasting, and Helm prices per connected business for advisors. Zensus is built around HubSpot contract timing and Slack alerts. If you need multi-entity consolidation, Float's Scale plan may still fit best.",
    },
    {
      question: "Is there a cheaper alternative to Float?",
      answer:
        "Yes. Pulse starts at $29 a month, Cash Flow Frog from $33 a month billed yearly at its early-bird rate, Futrli at $40 a month excluding VAT, and Helm at $50 a month for the first connected business, in a currency its page does not state. All four start below Float Essentials at $130 a month. Zensus does not: Zensus Pro is $199 a month, more than Float Essentials but less than Float Growth at $265.",
    },
    {
      question: "Which Float alternatives connect directly to a bank?",
      answer:
        "Cash Flow Frog and Zensus both connect bank accounts through Plaid. Float says it does not connect directly to your bank; it takes bank data from Xero or QuickBooks Online and syncs every 24 hours.",
    },
    {
      question: "Which Float alternatives work with HubSpot?",
      answer:
        "Zensus syncs HubSpot subscriptions natively, so contract renewals land in the month the cash arrives. Cash Flow Frog says it has no CRM connection and lists HubSpot only as a Zapier pairing. A HubSpot connection was not found on the public pages of Float, Pulse, Futrli, or Helm as of September 2026.",
    },
    {
      question: "Do Float alternatives have free trials?",
      answer:
        "Yes, all of them. Float, Cash Flow Frog, and Futrli offer 14 days with no credit card, and Cash Flow Frog adds a 30-day money-back guarantee. Helm offers 14 days; its page does not say whether a card is needed. Pulse offers 30 days and charges the card used at signup when the trial ends. Zensus offers 14 days; the card is collected at signup and not charged until the trial ends.",
    },
  ],
};

/** Every comparison page, for the "More comparisons" links on each one. */
export const COMPARE_LINKS: { to: string; label: string }[] = [
  { to: "/compare/zensus-vs-float", label: "Zensus vs Float" },
  { to: "/compare/zensus-vs-pulse", label: "Zensus vs Pulse" },
  { to: "/compare/float-alternatives", label: "Float alternatives" },
];

export const COMPARE_PAGES: Record<string, ComparePageConfig> = {
  "zensus-vs-float": FLOAT_COMPARE,
  "zensus-vs-pulse": PULSE_COMPARE,
};

export const COMPARE_SLUGS = Object.keys(COMPARE_PAGES);
