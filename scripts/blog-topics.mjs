// Blog topic pages for the build scripts (prerender, sitemap, OG cards).
// The app's source of truth is BLOG_TOPICS in src/lib/blog.ts, which the
// scripts cannot import; src/lib/blog-topics.test.ts fails if this list and
// that one disagree on ids, names or meta descriptions.

export const BLOG_TOPICS = [
  {
    id: "runway-and-burn",
    name: "Runway and burn",
    metaDescription:
      "Guides on cash runway, burn rate, burn multiple and the zero-cash date: how long your cash lasts, how to work it out weekly, and what investors check.",
  },
  {
    id: "payroll",
    name: "Payroll",
    metaDescription:
      "Guides on making payroll: how to know weeks ahead that a run will clear, which years have 27 biweekly pay periods, and what to do if you might miss one.",
  },
  {
    id: "13-week-forecasting",
    name: "13-week forecasting",
    metaDescription:
      "Guides on cash flow forecasting and the 13-week cash flow forecast: what it is, how to build one in Excel, and how to see a cash shortfall before it happens.",
  },
  {
    id: "working-capital",
    name: "Working capital",
    metaDescription:
      "Guides on working capital and cash timing: the cash conversion cycle, why ARR and cash differ, and how to forecast cash when clients pay late.",
  },
  {
    id: "tools-and-integrations",
    name: "Tools and integrations",
    metaDescription:
      "Guides on cash flow forecasting tools: what QuickBooks can and cannot forecast, turning HubSpot data into a cash forecast, and MCP vs CLI for finance teams.",
  },
];

export function getTopicRoutes() {
  return BLOG_TOPICS.map((t) => `/blog/topic/${t.id}`);
}
