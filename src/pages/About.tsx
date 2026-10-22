import { SITE_URL, LEGAL_NAME, SUPPORT_EMAIL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import { Linkedin } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { CornerMark } from "@/components/landing/Backdrop";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";

const PAGE_URL = `${SITE_URL}/about`;
const TITLE = "About Zensus · Why We Built Cash Flow Forecasting";
const DESCRIPTION =
  "Zensus started at Capital Factory in Austin, where founder Ajin Sunny watched good startups run out of cash. Meet the team and what we believe.";

const breadcrumbs = breadcrumbSchema([HOME_CRUMB, { name: "About", url: PAGE_URL }]);

/*
 * The team, in the order the page shows them. Each person's `id` is the
 * anchor of their card and the fragment of their schema.org Person @id
 * (`/about#<id>`), which blog bylines point at, so an id never changes once
 * published. Ajin's Person node ships sitewide in index.html; the others are
 * emitted below. `photo` is a square image under public/team/; until one is
 * added the card shows the person's initials. `title` and `linkedin` render
 * only when set.
 */
type Member = {
  id: string;
  name: string;
  title: string;
  photo?: string;
  linkedin?: string;
};

const TEAM: Member[] = [
  { id: "ajin-sunny", name: "Ajin Sunny", title: "Founder & CEO", linkedin: "https://www.linkedin.com/in/ajinsunny/" },
  { id: "john-george", name: "John George", title: "" },
  { id: "elsa-iris-reyes", name: "Elsa Iris Reyes", title: "" },
  { id: "joe-anglim", name: "Joe Anglim", title: "" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join("");

// What we believe: standalone statements, each a quotable line with one
// sentence of reasons. Not numbered, because they are not a sequence.
const BELIEFS = [
  {
    line: "Cash should never run out by surprise.",
    body: "A business can get through a hard month it sees coming. It rarely gets through one it does not.",
  },
  {
    line: "Honest numbers beat hopeful ones.",
    body: "No one should have to round a forecast up to keep going. A forecast built on real bank data and real billing dates is one you can show anyone.",
  },
  {
    line: "Clarity should not need a finance team.",
    body: "Businesses of any size deserve the cash visibility that large companies pay analysts for.",
  },
  {
    line: "Your data stays yours.",
    body: "Bank and accounting credentials live with Plaid and Intuit, never with us. Your data never trains an AI model, and every query is isolated by account.",
  },
  {
    line: "A public price, and no contract.",
    body: "Zensus Pro is $199 a month after a 14-day free trial. Cancel the same day if it is not a fit.",
  },
];

const FACTS: { term: string; detail: string }[] = [
  { term: "Company", detail: LEGAL_NAME },
  { term: "What it makes", detail: "Cash flow forecasting software for businesses of any size" },
  { term: "Founded", detail: "August 2025, by Ajin Sunny" },
  { term: "Where it started", detail: "Capital Factory, Austin, Texas" },
  { term: "Registered in", detail: "Newark, Delaware, and Houston, Texas" },
  { term: "Connects to", detail: "Plaid (banks), QuickBooks Online, HubSpot and Slack" },
  { term: "Contact", detail: SUPPORT_EMAIL },
];

const aboutPageLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about#aboutpage`,
  url: PAGE_URL,
  name: "About Zensus",
  about: { "@id": `${SITE_URL}/#organization` },
  mainEntity: { "@id": `${SITE_URL}/#organization` },
};

// Ajin's Person node is sitewide (index.html); this page adds the rest of the
// team. Ashwin Menon is kept as a node because his blog posts credit
// /about#ashwin-menon as their author.
const peopleLd = {
  "@context": "https://schema.org",
  "@graph": [
    ...TEAM.filter((m) => m.id !== "ajin-sunny").map((m) => ({
      "@type": "Person",
      "@id": `${SITE_URL}/about#${m.id}`,
      name: m.name,
      ...(m.title ? { jobTitle: m.title } : {}),
      worksFor: { "@id": `${SITE_URL}/#organization` },
      url: `${PAGE_URL}#${m.id}`,
      ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
    })),
    {
      "@type": "Person",
      "@id": `${SITE_URL}/about#ashwin-menon`,
      name: "Ashwin Menon",
      jobTitle: "Software Developer",
      worksFor: { "@id": `${SITE_URL}/#organization` },
      url: PAGE_URL,
      sameAs: ["https://www.linkedin.com/in/ashwinmenon502/"],
    },
  ],
};

const eyebrow = "font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground";

const About = () => (
  <div className="min-h-screen overflow-x-clip bg-background">
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:site_name" content="Zensus" />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={`${SITE_URL}/og/about.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="About Zensus social preview card" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={`${SITE_URL}/og/about.png`} />
      <link rel="canonical" href={PAGE_URL} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(aboutPageLd)}</script>
      <script type="application/ld+json">{JSON.stringify(peopleLd)}</script>
    </Helmet>
    <Navbar />

    <main>
      {/* Opening: the mission as one line, in the homepage hero's ruled
          column with its registration marks. */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 [background:radial-gradient(48rem_20rem_at_50%_40%,rgba(34,197,115,.10),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 min-[820px]:px-6">
          <div className="relative border-x border-transparent px-1 pb-16 pt-32 text-center min-[820px]:border-border min-[820px]:px-10 min-[820px]:pb-24 min-[820px]:pt-40">
            <CornerMark className="-left-[6px] top-[4.5rem] hidden min-[820px]:block" />
            <CornerMark className="-right-[6px] top-[4.5rem] hidden min-[820px]:block" />
            <p className={eyebrow}>About Zensus</p>
            <h1 className="mx-auto mt-5 max-w-[16ch] text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground min-[820px]:text-[56px]">
              No business should run out of cash by surprise.
            </h1>
            <p className="mx-auto mt-6 max-w-[600px] text-pretty text-[17px] leading-[1.6] text-muted-foreground">
              Zensus is cash flow forecasting software for businesses of any size. It connects your bank, QuickBooks,
              and HubSpot and shows, month by month, when cash gets tight, so a hard month arrives as a decision instead
              of a crisis.
            </p>
          </div>
        </div>
      </section>

      {/* Origin story: where it started on the left, the story on the right. */}
      <section aria-labelledby="origin-heading" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 min-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[820px]:gap-16 min-[820px]:px-16 min-[820px]:py-24">
          <div>
            <p className={eyebrow}>Where it started</p>
            <h2 id="origin-heading" className="mt-3 text-balance text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-foreground min-[820px]:text-[32px]">
              In a room full of founders who were running out of time.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">Capital Factory, Austin, Texas</p>
          </div>
          <div className="max-w-[62ch] space-y-5 text-[17px] leading-[1.7] text-foreground/90">
            <p>
              Zensus started at Capital Factory, Austin's startup hub. At one networking event after another, our
              founder, Ajin Sunny, met founders building things that mattered, and watched too many of them run out of
              money before the work was done.
            </p>
            <p>
              The pattern repeated. Teams were so focused on the mission that cash became an afterthought. When money
              got tight, the numbers in the investor update got rounder and more hopeful, because nobody had time to
              build an honest forecast. Survival came to depend on a story instead of a plan.
            </p>
            <p>
              Ajin knew that feeling from the inside. He is a first-generation immigrant who studied and worked in the
              United States for more than 12 years on his own, and clear visibility into his own cash was never
              something he had. Zensus is the tool he wanted then: one that shows where the money is going before it
              is gone.
            </p>
          </div>
        </div>
      </section>

      {/* What we believe: the manifesto, on the site's forest surface. */}
      <section aria-labelledby="beliefs-heading" className="px-3 min-[820px]:px-6">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-forest px-6 py-14 text-forest-foreground min-[820px]:px-16 min-[820px]:py-20">
          <h2 id="beliefs-heading" className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-forest-muted-strong">
            What we believe
          </h2>
          <ul className="mt-8 divide-y divide-forest-border">
            {BELIEFS.map((b) => (
              <li
                key={b.line}
                className="grid gap-2 py-6 first:pt-0 last:pb-0 min-[820px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[820px]:items-baseline min-[820px]:gap-12 min-[820px]:py-8"
              >
                <p className="text-balance text-[24px] font-bold leading-[1.2] tracking-[-0.01em] min-[820px]:text-[30px]">
                  {b.line}
                </p>
                <p className="text-[15.5px] leading-[1.6] text-forest-muted-strong">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The team. Each card carries the person's anchor (see TEAM). */}
      <section aria-labelledby="team-heading">
        <div className="mx-auto max-w-6xl px-5 py-16 min-[820px]:px-16 min-[820px]:py-24">
          <p className={eyebrow}>The team</p>
          <h2 id="team-heading" className="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-foreground min-[820px]:text-[32px]">
            The people building Zensus
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 min-[1024px]:grid-cols-4 min-[1024px]:gap-6">
            {TEAM.map((m) => (
              <li key={m.id} id={m.id} className="scroll-mt-24">
                <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-forest">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={`${m.name}${m.title ? `, ${m.title} at Zensus` : ", Zensus"}`}
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="flex h-full w-full items-center justify-center text-[clamp(2rem,7vw,3.5rem)] font-bold tracking-[-0.02em] text-forest-muted-strong [background:radial-gradient(circle_at_30%_25%,hsl(var(--forest-raised)),hsl(var(--forest))_70%)]"
                    >
                      {initials(m.name)}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold leading-tight text-foreground">{m.name}</h3>
                    {m.title ? <p className="mt-1 text-sm text-muted-foreground">{m.title}</p> : null}
                  </div>
                  {m.linkedin ? (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn (opens in a new tab)`}
                      className="mt-0.5 shrink-0 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Linkedin size={18} aria-hidden />
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Company facts: who, where, when, in one list engines can quote. */}
      <section aria-labelledby="facts-heading" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 min-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[820px]:gap-16 min-[820px]:px-16 min-[820px]:py-20">
          <div>
            <p className={eyebrow}>Company facts</p>
            <h2 id="facts-heading" className="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-foreground min-[820px]:text-[32px]">
              Zensus at a glance
            </h2>
          </div>
          <dl className="divide-y divide-border border-y border-border">
            {FACTS.map((f) => (
              <div key={f.term} className="grid gap-1 py-4 min-[560px]:grid-cols-[180px_minmax(0,1fr)] min-[560px]:gap-6">
                <dt className="text-sm font-medium text-muted-foreground">{f.term}</dt>
                <dd className="text-[15.5px] text-foreground">
                  {f.term === "Contact" ? (
                    <a href={`mailto:${f.detail}`} className="underline decoration-border underline-offset-4 hover:decoration-primary">
                      {f.detail}
                    </a>
                  ) : (
                    f.detail
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FinalCTABand />
    </main>
    <Footer />
  </div>
);

export default About;
