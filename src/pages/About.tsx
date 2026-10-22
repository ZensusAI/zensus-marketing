import { SITE_URL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { CornerMark } from "@/components/landing/Backdrop";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";
import { BeliefsStack, HeroParallax, StoryParagraphs, TeamGrid, type TeamMember } from "@/components/about/AboutMotion";

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
const TEAM: TeamMember[] = [
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

// What we believe: standalone statements, each a quotable line with one
// sentence of reasons. Not numbered, because they are not a sequence.
// The origin story, told through what it cost (22 Oct 2026). Facts only:
// Capital Factory, founders running out of money, investor numbers rounded
// up, and Ajin's own years in the US as a first-generation immigrant on his
// own. Four paragraphs, so the scroll spotlight (StoryParagraphs) rests on
// each beat in turn.
const STORY = [
  "Zensus began in the rooms at Capital Factory, Austin's startup hub. Event after event, our founder, Ajin Sunny, met people building things that mattered. Most of them did not run out of ideas, or nerve, or customers. They ran out of money, and too often they did not see it coming.",
  "It was hard to watch. Founders gave everything to the mission, and cash became the thing they would deal with later. When later came, the numbers in the investor update grew rounder and more hopeful, because there was no time to build an honest forecast and too much at stake to admit the gap. Good companies ended up surviving on a story instead of a plan.",
  "Ajin knew that feeling from the inside. He is a first-generation immigrant who spent more than 12 years studying and working in the United States on his own. There was no one to show him where his money was going or how long it would last. Every month was a careful guess, made alone.",
  "Zensus is what he needed then, and what he watched so many founders go without: an honest view of where the money is going, early enough to change course before it is gone.",
];

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
          same page. Phones are unchanged.
          Motion for all four sections lives in components/about. */}
      <HeroParallax glow="[background:radial-gradient(48rem_20rem_at_50%_40%,rgba(34,197,115,.10),transparent_70%)]">
        <div className="relative mx-auto max-w-6xl px-4 min-[820px]:px-6">
          <div className="relative border-x border-transparent px-1 pb-16 pt-32 text-center min-[820px]:border-border min-[820px]:px-10 min-[820px]:pb-24 min-[820px]:pt-40">
            <CornerMark className="-left-[6px] top-[4.5rem] hidden min-[820px]:block" />
            <CornerMark className="-right-[6px] top-[4.5rem] hidden min-[820px]:block" />
            <div data-parallax-copy className="will-change-transform">
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
        </div>
      </HeroParallax>

      {/* Origin story: where it started on the left (held in view beside the
          story from 820px), the story on the right. From 820px the section
          runs long (160px padding, 80px between paragraphs) so the spotlight
          rests on each paragraph in turn while the heading stays beside it. */}
      <section aria-labelledby="origin-heading" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 min-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[820px]:gap-16 min-[820px]:px-16 min-[820px]:py-40">
          <div className="min-[820px]:sticky min-[820px]:top-28 min-[820px]:self-start">
            <p className={eyebrow}>Where it started</p>
            <h2 id="origin-heading" className="mt-3 text-balance text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-foreground min-[820px]:text-[27px]">
              In a room full of founders who were running out of time.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground min-[820px]:text-[13px]">Capital Factory, Austin, Texas</p>
          </div>
          <StoryParagraphs
            paragraphs={STORY}
            className="max-w-[62ch] space-y-5 text-[17px] leading-[1.7] text-foreground/90 min-[820px]:space-y-20 min-[820px]:text-[15px]"
          />
        </div>
      </section>

      {/* The team, straight after the story so the people behind it come
          next: the title centred above an even 2 by 2 grid, held to 580px
          from 820px (photos about 262px) so they stay portrait sized rather
          than filling the page, with 56px gaps both ways (caption to the
          next photo, and photo to photo across); 20px across and 40px down
          on phones. Each card carries the person's anchor (see TEAM). */}
      <section aria-labelledby="team-heading" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 min-[820px]:px-16 min-[820px]:py-40">
          <h2 id="team-heading" className="text-center text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-foreground min-[820px]:text-[27px]">
            Our Team
          </h2>
          <TeamGrid
            team={TEAM}
            className="mx-auto mt-10 grid max-w-[680px] grid-cols-2 gap-x-5 gap-y-10 min-[820px]:mt-12 min-[820px]:max-w-[580px] min-[820px]:gap-x-14 min-[820px]:gap-y-14"
          />
        </div>
      </section>

      {/* What we believe: the manifesto on the forest panel, pinned from
          820px with the beliefs arriving one at a time (BeliefsStack). */}
      <BeliefsStack beliefs={BELIEFS} />

      <FinalCTABand compact />
    </main>
    <Footer />
  </div>
);

export default About;
