import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PriceScenario from "@/components/pricing/PriceScenario";
import { FOCUS_RING, PRIMARY_BUTTON, SQUIRCLE, TEXT_LINK } from "@/components/pricing/styles";
import { SITE_URL, START_TRIAL_URL, TALK_TO_US_URL } from "@/lib/constants";
import { trackCtaClick } from "@/lib/analytics/events";
import { breadcrumbSchema, faqPageSchema, HOME_CRUMB } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/*
 * Pricing, from handoff 14-pricing (scroll section 27a, chosen 24 Oct 2026).
 * Order: first screen (headline, G2 proof, Pro card with the price above the
 * fold), the price as a scenario (PriceScenario), everything in Pro, the
 * Zensus Custom row, and the pricing FAQ. The "Still deciding?" links and the
 * site footer were kept at the user's request; the design ended at the FAQ.
 */

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Pricing", url: `${SITE_URL}/pricing` },
]);

const FEATURE_GROUPS = [
  {
    title: "Data and integrations",
    items: [
      "Live bank balances through Plaid",
      "QuickBooks synced automatically",
      "HubSpot deals and subscriptions in your forecast",
    ],
  },
  {
    title: "Cash flow intelligence",
    items: [
      "See your zero-cash date, updated in real time",
      "Ask what-if questions and keep the chat history",
      "Get a Slack alert when cash crosses your threshold",
      "Project subscription revenue, not just invoices",
    ],
  },
];

const CUSTOM_CHIPS = [
  "Tailored forecast setup",
  "Custom integrations",
  "Dedicated onboarding",
  "Priority support",
  "Team training",
];

const pricingFaqs = [
  {
    question: "Do you offer annual billing?",
    answer:
      "Not yet. We are working on it. Every plan is billed monthly right now with no long-term commitment.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts, no cancellation fees. You can cancel from your account settings any time and you will not be billed again.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. 14 days, no charge today. We collect your card up front so the subscription continues automatically if Zensus is working for you, and you can cancel anytime before the trial ends with no charge.",
  },
  {
    question: "How many users are included?",
    answer: "Zensus Pro includes one user.",
  },
  {
    question: "I advise several companies. How is that priced?",
    answer:
      "Through Zensus Custom. Talk to us and we will scope pricing around the companies you advise.",
  },
  {
    question: "Will you remind me before I am charged?",
    answer:
      "Yes. We email you before your first charge, so you can cancel before the trial ends if Zensus is not right for you.",
  },
];

// Every question above is on the page word for word (collapsed answers stay
// in the HTML), so all six can carry FAQPage markup.
const pricingFaqLd = faqPageSchema(pricingFaqs);

const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

const Tick = () => (
  <span aria-hidden className="mt-0.5 flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-primary/[.14]">
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6.2 5 8.6l4.5-5" stroke="hsl(var(--sage-dark))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const trialClick = (section: string) => () => trackCtaClick("pricing_page", { destination: "trial", section });

const FirstScreen = () => (
  <section className="px-[18px] pb-14 pt-[calc(4rem+40px)] min-[760px]:px-10 min-[760px]:pb-[88px] min-[760px]:pt-[calc(4rem+72px)]">
    <div className="mx-auto grid max-w-[1120px] items-center gap-9 min-[760px]:grid-cols-[minmax(0,1fr)_minmax(0,400px)] min-[760px]:gap-10 min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,440px)] min-[1100px]:gap-[72px]">
      <div className="flex flex-col gap-5">
        <h1 className="text-balance text-[38px] font-semibold leading-[1.03] tracking-[-0.04em] text-foreground min-[760px]:text-[46px] min-[1100px]:text-[60px]">
          Your cash forecast, for less than <span className="text-sage-dark">one hour of a fractional CFO.</span>
        </h1>
        <p className="max-w-[500px] text-pretty text-base leading-[1.55] text-muted-foreground min-[760px]:text-[19px]">
          One flat monthly price with every integration included: Plaid, QuickBooks, HubSpot and Slack. Try it free for 14 days.
        </p>
        <div className="flex max-w-[500px] flex-col gap-2 border-t border-border pt-[18px]">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span role="img" aria-label="5 out of 5 stars" className="flex gap-0.5 text-primary">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d={STAR} />
                </svg>
              ))}
            </span>
            <span>5.0 on G2</span>
          </div>
          <p className="text-[14.5px] leading-[1.5] text-muted-foreground">
            <span className="italic text-foreground">"One of my favorite features of Zensus is the HubSpot integration."</span>{" "}
            Jameson Pitts
          </p>
        </div>
      </div>

      <div
        className={cn(
          "rounded-[38px] border border-primary/50 bg-card p-[22px] shadow-[0_0_0_5px_rgba(34,197,115,.08),0_30px_60px_-36px_rgba(15,28,22,.4)] min-[760px]:p-8",
          SQUIRCLE,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">Zensus Pro</h2>
          <span
            className={cn(
              "inline-flex h-7 items-center rounded-full border border-primary/35 bg-primary/[.12] px-3 text-[13px] font-semibold text-sage-dark",
              SQUIRCLE,
            )}
          >
            14-day free trial
          </span>
        </div>
        <div className="mt-3.5 flex items-baseline gap-1.5">
          <span className="text-[56px] font-semibold leading-none tracking-[-0.045em] text-foreground min-[760px]:text-[72px]">$199</span>
          <span className="text-lg text-muted-foreground">/month</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Billed monthly. 1 user. Cancel anytime.</p>
        <ul className="mt-[18px] border-t border-border pt-1.5">
          {FEATURE_GROUPS[1].items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 py-2 text-[15px] leading-[1.4] text-foreground">
              <Tick />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a
          href={START_TRIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trialClick("first_screen")}
          className={cn(PRIMARY_BUTTON, "mt-[18px] flex w-full")}
        >
          Start 14-day free trial
          <ArrowRight size={18} aria-hidden />
        </a>
        <div className="mt-3 flex flex-col items-center gap-1 text-center text-[13px] text-muted-foreground">
          <span>No charge today. We email you before your first charge.</span>
          <span>
            Prefer a walkthrough first?{" "}
            <a
              href={TALK_TO_US_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick("pricing_page", { destination: "talk_to_us", section: "first_screen" })}
              className={TEXT_LINK}
            >
              Talk to us
            </a>
            .
          </span>
        </div>
      </div>
    </div>
  </section>
);

const Included = () => (
  <section className="px-[18px] pt-14 min-[760px]:px-10 min-[760px]:pt-24">
    <div className="mx-auto max-w-[1080px]">
      <h2 className="mb-2 text-[26px] font-semibold tracking-[-0.03em] text-foreground min-[760px]:text-[34px]">
        Everything in Zensus Pro
      </h2>
      <p className="mb-7 text-[15px] text-muted-foreground">Zensus Pro, $199 a month after your 14-day free trial.</p>
      <div className="grid gap-4 min-[760px]:grid-cols-2">
        {FEATURE_GROUPS.map((g) => (
          <div key={g.title} className={cn("rounded-[29px] border border-border bg-card px-6 py-[22px]", SQUIRCLE)}>
            <h3 className="border-b border-border pb-2.5 text-[15px] font-semibold text-foreground">{g.title}</h3>
            <ul>
              {g.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 border-b border-border/60 py-2.5 text-[15px] leading-[1.4] text-foreground"
                >
                  <Tick />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CustomRow = () => (
  <section className="px-[18px] pt-5 min-[760px]:px-10">
    <div
      className={cn(
        "mx-auto grid max-w-[1080px] items-center gap-[18px] rounded-[29px] border border-border bg-border/[.22] p-5 min-[760px]:p-7 min-[1100px]:grid-cols-[minmax(0,240px)_minmax(0,1fr)_auto] min-[1100px]:gap-8",
        SQUIRCLE,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">Zensus Custom</h2>
        <p className="text-sm leading-[1.45] text-muted-foreground">
          Everything in Pro, shaped around your team. Advising several companies? We price that through Custom.
        </p>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Included in Zensus Custom">
        {CUSTOM_CHIPS.map((chip) => (
          <li
            key={chip}
            className={cn("inline-flex h-[30px] items-center rounded-full border border-border bg-card px-3 text-[13px] text-foreground", SQUIRCLE)}
          >
            {chip}
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-start gap-2 min-[1100px]:items-end">
        <a
          href={TALK_TO_US_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaClick("pricing_page", { destination: "talk_to_us", plan: "custom", section: "custom" })}
          className={cn(
            "inline-flex h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-foreground px-[26px] text-[15px] font-semibold text-foreground transition-colors duration-200 hover:bg-foreground hover:text-background",
            SQUIRCLE,
            FOCUS_RING,
            "rounded-full",
          )}
        >
          Talk to us
          <ArrowRight size={16} aria-hidden />
        </a>
        <span className="text-[12.5px] text-muted-foreground">A 30-minute call to scope what your team needs.</span>
      </div>
    </div>
  </section>
);

const PricingFaq = () => {
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <section className="px-[18px] pb-16 pt-14 min-[760px]:px-10 min-[760px]:pb-[120px] min-[760px]:pt-24">
      <div className="mx-auto max-w-[760px]">
        <h2 className="mb-7 text-center text-[26px] font-semibold tracking-[-0.03em] text-foreground min-[760px]:text-[34px]">
          Pricing questions
        </h2>
        <div className="flex flex-col gap-2.5">
          {pricingFaqs.map((f, i) => {
            const isOpen = i === open;
            const panel = `${base}-a${i}`;
            return (
              <div
                key={f.question}
                className={cn(
                  "rounded-[26px] border transition-[border-color,background-color] duration-200",
                  SQUIRCLE,
                  isOpen ? "border-primary/55 bg-primary/[.06]" : "border-border bg-card",
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 rounded-[26px] px-[22px] py-5 text-left text-base font-semibold text-foreground",
                      FOCUS_RING,
                      "rounded-[26px]",
                    )}
                  >
                    <span>{f.question}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-7 w-7 flex-none items-center justify-center rounded-full border text-lg font-normal text-sage-dark transition-transform duration-[250ms] motion-reduce:transition-none",
                        isOpen ? "rotate-45 border-primary/55" : "border-border",
                      )}
                    >
                      +
                    </span>
                  </button>
                </h3>
                {/* Collapsed answers stay in the HTML: the FAQPage markup quotes them. */}
                <div
                  id={panel}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden" aria-hidden={!isOpen}>
                    <p className="text-pretty px-[22px] pb-5 text-[15px] leading-[1.6] text-muted-foreground">{f.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kept from the previous page (not in the design): someone reading
            pricing is still deciding, so point them at what decides it. */}
        <p className="mx-auto mt-10 max-w-[640px] text-center text-sm leading-relaxed text-muted-foreground">
          Still deciding? See{" "}
          <Link to="/integrations" className={TEXT_LINK}>
            every integration included
          </Link>
          ,{" "}
          <Link to="/security" className={TEXT_LINK}>
            how Zensus handles your financial data
          </Link>
          , and{" "}
          <Link to="/use-cases" className={TEXT_LINK}>
            who uses Zensus
          </Link>
          . Comparing tools? Read{" "}
          <Link to="/compare/zensus-vs-float" className={TEXT_LINK}>
            Zensus vs Float
          </Link>
          ,{" "}
          <Link to="/compare/zensus-vs-pulse" className={TEXT_LINK}>
            Zensus vs Pulse
          </Link>
          ,{" "}
          <Link to="/compare/zensus-vs-cash-flow-frog" className={TEXT_LINK}>
            Zensus vs Cash Flow Frog
          </Link>
          , and the{" "}
          <Link to="/compare/float-alternatives" className={TEXT_LINK}>
            Float alternatives
          </Link>{" "}
          side by side, or run your own numbers in the free{" "}
          <Link to="/tools/runway-calculator" className={TEXT_LINK}>
            runway calculator
          </Link>
          .
        </p>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          More questions?{" "}
          <Link to="/#faq" className={TEXT_LINK}>
            Visit the homepage FAQ
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

const Pricing = () => (
  <div className="min-h-screen overflow-x-clip bg-background">
    <Helmet>
      <title>Zensus Pricing · $199/mo Cash Flow Forecasting Software</title>
      <meta
        name="description"
        content="Zensus Pro is $199/month after a 14-day free trial, with every integration, scenario modeling, and Slack alerts. Zensus Custom is quoted for complex setups."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/pricing`} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content="Zensus Pricing · $199/mo Cash Flow Forecasting for Businesses" />
      <meta
        property="og:description"
        content="Zensus Pro is $199/month after a 14-day free trial, with every integration, scenario modeling, and Slack alerts. Zensus Custom is quoted for complex setups."
      />
      <meta property="og:image" content={`${SITE_URL}/og/pricing.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Pricing page social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Zensus Pricing · $199/mo Cash Flow Forecasting for Businesses" />
      <meta
        name="twitter:description"
        content="Zensus Pro is $199/month after a 14-day free trial, with every integration, scenario modeling, and Slack alerts. Zensus Custom is quoted for complex setups."
      />
      <meta name="twitter:image" content={`${SITE_URL}/og/pricing.png`} />
      <link rel="canonical" href={`${SITE_URL}/pricing`} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(pricingFaqLd)}</script>
    </Helmet>
    <Navbar />
    <main>
      <FirstScreen />
      <PriceScenario />
      <Included />
      <CustomRow />
      <PricingFaq />
    </main>
    <Footer />
  </div>
);

export default Pricing;
