import { SITE_URL } from "@/lib/constants";
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
 * emitted below. `photo` is a 512px square WebP under public/team/ (a card
 * without one shows the person's initials). `title` and `linkedin` render
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
  {
    id: "ajin-sunny",
    name: "Ajin Sunny",
    title: "Founder",
    photo: "/team/ajin-sunny.webp",
    linkedin: "https://www.linkedin.com/in/ajinsunny/",
  },
  {
    id: "john-george",
    name: "John George",
    title: "Co-Founder",
    photo: "/team/john-george.webp",
    linkedin: "https://www.linkedin.com/in/johngeorge28/",
  },
  {
    id: "elsa-iris-reyes",
    name: "Elsa Iris Reyes",
    title: "Board Advisor",
    photo: "/team/elsa-iris-reyes.webp",
    linkedin: "https://www.linkedin.com/in/elsairisreyes/",
  },
  {
    id: "joe-anglim",
    name: "Joe Anglim",
    title: "Strategic Advisor",
    photo: "/team/joe-anglim.webp",
    linkedin: "https://www.linkedin.com/in/joe-anglim/",
  },
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
// team. Advisors are members, not employees, hence memberOf for them.
const peopleLd = {
  "@context": "https://schema.org",
  "@graph": [
    ...TEAM.filter((m) => m.id !== "ajin-sunny").map((m) => ({
      "@type": "Person",
      "@id": `${SITE_URL}/about#${m.id}`,
      name: m.name,
      ...(m.title ? { jobTitle: m.title } : {}),
      [m.title.includes("Advisor") ? "memberOf" : "worksFor"]: { "@id": `${SITE_URL}/#organization` },
      url: `${PAGE_URL}#${m.id}`,
      ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
    })),
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
          column with its registration marks.
          Scale: like the homepage hero (21 Oct 2026), from 820px every
          section's copy, photos and gaps are set about 15% smaller than the
          first cut (22 Oct 2026) while the frames, panels and section
          padding keep their size, so the content sits smaller inside the
          same page. Phones are unchanged. */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 [background:radial-gradient(48rem_20rem_at_50%_40%,rgba(34,197,115,.10),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 min-[820px]:px-6">
          <div className="relative border-x border-transparent px-1 pb-16 pt-32 text-center min-[820px]:border-border min-[820px]:px-10 min-[820px]:pb-24 min-[820px]:pt-40">
            <CornerMark className="-left-[6px] top-[4.5rem] hidden min-[820px]:block" />
            <CornerMark className="-right-[6px] top-[4.5rem] hidden min-[820px]:block" />
            <p className={eyebrow}>About Zensus</p>
            <h1 className="mx-auto mt-5 max-w-[16ch] text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground min-[820px]:text-[48px]">
              No business should run out of cash by surprise.
            </h1>
            <p className="mx-auto mt-6 max-w-[600px] text-pretty text-[17px] leading-[1.6] text-muted-foreground min-[820px]:mt-5 min-[820px]:max-w-[540px] min-[820px]:text-balance min-[820px]:text-[15px]">
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
            <h2 id="origin-heading" className="mt-3 text-balance text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-foreground min-[820px]:text-[27px]">
              In a room full of founders who were running out of time.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground min-[820px]:text-[13px]">Capital Factory, Austin, Texas</p>
          </div>
          <div className="max-w-[62ch] space-y-5 text-[17px] leading-[1.7] text-foreground/90 min-[820px]:space-y-4 min-[820px]:text-[15px]">
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

      {/* The team, straight after the story so the people behind it come
          next: the title centred above an even 2 by 2 grid, held to 580px
          from 820px (photos about 262px) so they stay portrait sized rather
          than filling the page, with 56px gaps both ways (caption to the
          next photo, and photo to photo across); 20px across and 40px down
          on phones. Each card carries the person's anchor (see TEAM). */}
      <section aria-labelledby="team-heading" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 min-[820px]:px-16 min-[820px]:py-24">
          <h2 id="team-heading" className="text-center text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-foreground min-[820px]:text-[27px]">
            Our Team
          </h2>
          <ul className="mx-auto mt-10 grid max-w-[680px] grid-cols-2 gap-x-5 gap-y-10 min-[820px]:mt-12 min-[820px]:max-w-[580px] min-[820px]:gap-x-14 min-[820px]:gap-y-14">
            {TEAM.map((m) => (
              <li key={m.id} id={m.id} className="group scroll-mt-24">
                <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-forest">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={`${m.name}${m.title ? `, ${m.title} at Zensus` : ", Zensus"}`}
                      width={512}
                      height={512}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-ui group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
                <div className="mt-4 flex items-start justify-between gap-2 min-[820px]:mt-3.5">
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold leading-tight text-foreground min-[820px]:text-[15px]">{m.name}</h3>
                    {m.title ? <p className="mt-1 text-sm text-muted-foreground min-[820px]:text-[13px]">{m.title}</p> : null}
                  </div>
                  {m.linkedin ? (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn (opens in a new tab)`}
                      className="mt-0.5 shrink-0 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Linkedin size={16} aria-hidden />
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we believe: the manifesto, on the site's forest surface. */}
      <section aria-labelledby="beliefs-heading" className="px-3 pb-16 min-[820px]:px-6 min-[820px]:pb-24">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-forest px-6 py-14 text-forest-foreground min-[820px]:px-16 min-[820px]:py-20">
          <h2 id="beliefs-heading" className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-forest-muted-strong">
            What we believe
          </h2>
          <ul className="mt-8 divide-y divide-forest-border min-[820px]:mt-7">
            {BELIEFS.map((b) => (
              <li
                key={b.line}
                className="grid gap-2 py-6 first:pt-0 last:pb-0 min-[820px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[820px]:items-baseline min-[820px]:gap-12 min-[820px]:py-7"
              >
                <p className="text-balance text-[24px] font-bold leading-[1.2] tracking-[-0.01em] min-[820px]:text-[26px]">
                  {b.line}
                </p>
                <p className="text-[15.5px] leading-[1.6] text-forest-muted-strong min-[820px]:text-[14px]">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTABand compact />
    </main>
    <Footer />
  </div>
);

export default About;
