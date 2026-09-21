import { Link } from "react-router-dom";

/**
 * Guides and free tools (homepage).
 *
 * The homepage is where outside links land, and before this section its
 * content linked to two pages only (/pricing and /security). Everything else
 * was reachable from the navbar and footer alone, which every page shares, so
 * the guides and tools got no in-content link from the strongest page on the
 * site. Keep this list short and hand-picked: it is a way in, not an index.
 * The full list lives at /blog.
 */

interface ResourceLink {
  to: string;
  label: string;
  description: string;
}

const TOOLS: ResourceLink[] = [
  {
    to: "/tools/runway-calculator",
    label: "Startup runway calculator",
    description: "Your zero-cash date, and what a hire does to it.",
  },
  {
    to: "/tools/payroll-calendar",
    label: "Payroll calendar calculator",
    description: "Pay periods for 2026 and 2027, including three-paycheck months.",
  },
  {
    to: "/blog/what-is-a-13-week-cash-flow-forecast",
    label: "13-week cash flow forecast template",
    description: "The guide, with a free Excel template to start from.",
  },
];

const GUIDES: ResourceLink[] = [
  {
    to: "/blog/what-is-cash-flow-forecasting",
    label: "What is cash flow forecasting?",
    description: "The methods, and where forecasts usually go wrong.",
  },
  {
    to: "/blog/will-i-make-payroll",
    label: "Will I make payroll?",
    description: "How to know weeks in advance, one pay date at a time.",
  },
  {
    to: "/blog/zero-cash-date-for-founders",
    label: "Zero cash date",
    description: "Why a weekly forecast finds it and a monthly average hides it.",
  },
  {
    to: "/blog/can-quickbooks-forecast-cash-flow",
    label: "Can QuickBooks forecast cash flow?",
    description: "What Cash Flow Planner does, and where it stops.",
  },
  {
    to: "/blog/hubspot-pipeline-to-cash-forecast",
    label: "Forecast cash from your sales pipeline",
    description: "From HubSpot deals to the day the money lands.",
  },
];

const linkCls = "font-medium text-foreground underline-offset-4 hover:text-primary hover:underline";

const ResourceList = ({ title, items }: { title: string; items: ResourceLink[] }) => (
  <div>
    <h3 className="mb-5 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground">
      {title}
    </h3>
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.to}>
          <Link to={item.to} className={linkCls}>
            {item.label}
          </Link>
          <span className="block text-sm text-muted-foreground">{item.description}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Resources = () => (
  <section id="resources" className="section-padding scroll-mt-28 bg-background">
    <div className="section-container">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Guides and free tools.
        </h2>
        <p className="text-lg text-muted-foreground">
          Work it out yourself first. No signup needed.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
        <ResourceList title="Free tools" items={TOOLS} />
        <ResourceList title="Guides" items={GUIDES} />
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        <Link
          to="/blog"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Read all the guides
        </Link>
      </p>
    </div>
  </section>
);

export default Resources;
