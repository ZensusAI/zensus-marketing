import { Link } from "react-router-dom";
import { SITE_URL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FinalCTABand from "@/components/landing/FinalCTABand";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";
import { EVENTS, track } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import { ParallaxSection } from "@/components/about/AboutMotion";
import { Squircle } from "@/components/about/Squircle";
import {
  BARS,
  BELIEFS,
  FOUNDER_PATH,
  FOUNDER_STORY,
  HERO,
  MISSION,
  ORIGIN,
  SERVICE,
  TEAM,
  TEAM_HEADING,
  VISION,
} from "@/components/about/about-content";

const PAGE_URL = `${SITE_URL}/about`;
const TITLE = "About Zensus · Why We Built Cash Flow Forecasting";
const DESCRIPTION =
  "Zensus started at Capital Factory in Austin, where founder Ajin Sunny watched good startups run out of cash. Meet the team and what we believe.";

const breadcrumbs = breadcrumbSchema([HOME_CRUMB, { name: "About", url: PAGE_URL }]);

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
      jobTitle: m.title,
      [m.title.includes("Advisor") ? "memberOf" : "worksFor"]: { "@id": `${SITE_URL}/#organization` },
      url: `${PAGE_URL}#${m.id}`,
      sameAs: [m.linkedin],
    })),
  ],
};

/*
 * The About page, rebuilt from handoff 24 (17 Nov 2026). Eight sections:
 * hero, mission and vision (full-screen parallax statements), origin story,
 * the founder's story, Service as a Software, what we believe, our team.
 * Copy lives in about-content.ts, exactly as approved. The navbar, final CTA
 * and footer are the locked components.
 *
 * Layout: copy sits in a 1280px frame with 120px sides from 1100px wide, 40px
 * sides from 820px, and 20px on phones, where the two-column sections stack.
 * Every rounded rectangle is a squircle (components/about/Squircle).
 */

const SIDE = "px-5 min-[820px]:px-10 min-[1100px]:px-[120px]";
const FRAME = "mx-auto w-full max-w-[1280px]";
const LABEL = "text-sm font-semibold text-primary min-[820px]:text-[15px]";
const H2 =
  "text-balance text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground min-[820px]:text-[clamp(34px,3.6vw,46px)] min-[820px]:leading-[1.06] min-[820px]:tracking-[-0.035em]";
const BODY = "text-pretty text-[16.5px] leading-[1.65] text-foreground min-[820px]:text-[19px]";
const MUTED = "text-muted-foreground";
const RING = "#EBDCB8";
const LINK_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const R_PHOTO = { base: 16, wide: 20 } as const;
const R_FOUNDER = { base: 18, wide: 24 } as const;
const R_SERVICE_TABLE = 24;
const R_SERVICE_CARD = 20;
const R_LINKEDIN = 12;
const R_BAR = { base: [5, 5, 0, 0], wide: [8, 8, 0, 0] } as const;

function LinkedInGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.7 1.5c3.08 0 4.62 0 5.797 0.599a5.5 5.5 0 0 1 2.404 2.404c0.599 1.177 0.599 2.717 0.599 5.797L22.5 13.7c0 3.08 0 4.62 -0.599 5.797a5.5 5.5 0 0 1 -2.404 2.404c-1.177 0.599 -2.717 0.599 -5.797 0.599L10.3 22.5c-3.08 0 -4.62 0 -5.797 -0.599a5.5 5.5 0 0 1 -2.404 -2.404c-0.599 -1.177 -0.599 -2.717 -0.599 -5.797L1.5 10.3c0 -3.08 0 -4.62 0.599 -5.797a5.5 5.5 0 0 1 2.404 -2.404c1.177 -0.599 2.717 -0.599 5.797 -0.599Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect x="6" y="10" width="2.6" height="8" fill="currentColor" />
      <circle cx="7.3" cy="6.9" r="1.6" fill="currentColor" />
      <path d="M11 10h2.5v1.2c.5-.8 1.5-1.4 2.8-1.4 2.1 0 3 1.3 3 3.6V18h-2.6v-4.2c0-1.1-.4-1.8-1.4-1.8s-1.7.7-1.7 1.9V18H11z" fill="currentColor" />
    </svg>
  );
}

function Check() {
  return (
    <span aria-hidden="true" className="mt-0.5 hidden h-5 w-5 flex-none items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground min-[820px]:inline-flex">
      ✓
    </span>
  );
}

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
      {/* 1. Hero: the page's only H1, one sentence per line, the last word of
          each in deep green. "can" and the green word never split. The spaces
          after the first two lines keep the accessible text readable. The
          navbar is fixed and takes no space, so the top padding is its 65px
          plus the handoff's own 56px (phones) or 104px (desktop). */}
      <section
        aria-labelledby="about-heading"
        className={cn(
          SIDE,
          "flex flex-col bg-[radial-gradient(ellipse_90%_60%_at_50%_40%,rgba(34,197,115,.09),rgba(34,197,115,0)_70%)] pb-10 pt-[120px] min-[820px]:min-h-[100svh] min-[820px]:items-center min-[820px]:justify-center min-[820px]:bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,rgba(34,197,115,.09),rgba(34,197,115,0)_70%)] min-[820px]:pb-[104px] min-[820px]:pt-[168px] min-[820px]:text-center",
        )}
      >
        <p className={LABEL}>{HERO.label}</p>
        <h1 id="about-heading" className="mt-3.5 flex flex-col text-[38px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground min-[820px]:mt-5 min-[820px]:text-[clamp(44px,5.2vw,66px)] min-[820px]:leading-[1.06] min-[820px]:tracking-[-0.04em]">
          {HERO.lines.map((line, i) => (
            <span key={line.lead} className="block">
              {line.lead}{" "}
              <span className="whitespace-nowrap">
                can <span className="text-primary">{line.word}</span>
              </span>
              {i < HERO.lines.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className={cn("mt-[18px] max-w-[700px] text-pretty text-[16.5px] leading-[1.55] min-[820px]:mt-7 min-[820px]:text-[19px]", MUTED)}>{HERO.subhead}</p>
      </section>

      {/* 2. Mission: full screen, forest, a faint bar chart behind the statement. */}
      <ParallaxSection
        labelledBy="mission-heading"
        className="bg-forest text-forest-foreground"
        contentClassName={cn(FRAME, "px-[22px] min-[820px]:px-10 min-[1100px]:px-[120px]")}
        layers={[
          {
            travel: 260,
            className: "inset-x-0 -bottom-20 h-[420px] min-[820px]:-bottom-[120px] min-[820px]:h-[520px] flex justify-center",
            node: (
              <div className="flex h-full w-full max-w-[1280px] items-end gap-1.5 px-4 min-[820px]:gap-3.5 min-[820px]:px-20">
                {BARS.map((h, i) => (
                  <Squircle
                    key={i}
                    radius={R_BAR}
                    as="span"
                    className="block flex-1"
                    style={{ height: `${h}%`, background: i === 8 ? "rgba(72,216,138,.38)" : "rgba(72,216,138,.14)" }}
                  />
                ))}
              </div>
            ),
          },
          {
            travel: 0,
            className: "inset-0 bg-[linear-gradient(180deg,#0F1C16_0%,rgba(15,28,22,.92)_42%,rgba(15,28,22,.55)_100%)]",
            node: null,
          },
        ]}
      >
        <p className="text-sm font-semibold text-[#48D88A] min-[820px]:text-base">{MISSION.label}</p>
        <h2
          id="mission-heading"
          className="mt-4 max-w-[1000px] text-balance text-[46px] font-bold leading-[1.02] tracking-[-0.04em] min-[820px]:mt-6 min-[820px]:text-[clamp(56px,7.2vw,92px)] min-[820px]:leading-none min-[820px]:tracking-[-0.05em]"
        >
          {MISSION.statement}
        </h2>
        <p className="mt-5 text-[15.5px] leading-[1.55] text-forest-muted-strong min-[820px]:mt-8 min-[820px]:text-[19px]">{MISSION.line}</p>
      </ParallaxSection>

      {/* 3. Vision: full screen, cream, a green glow and a projected line. */}
      <ParallaxSection
        labelledBy="vision-heading"
        contentClassName={cn(FRAME, "items-center px-[22px] text-center min-[820px]:px-10 min-[1100px]:px-[120px]")}
        layers={[
          {
            travel: 260,
            className: "left-1/2 top-1/2 -ml-80 -mt-80 h-[640px] w-[640px] min-[820px]:-ml-[550px] min-[820px]:-mt-[550px] min-[820px]:h-[1100px] min-[820px]:w-[1100px]",
            node: <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,197,115,.22)_0%,rgba(34,197,115,.07)_38%,rgba(34,197,115,0)_64%)] min-[820px]:bg-[radial-gradient(circle,rgba(34,197,115,.20)_0%,rgba(34,197,115,.07)_38%,rgba(34,197,115,0)_64%)]" />,
          },
          {
            travel: 140,
            className: "inset-0",
            node: (
              <>
                <svg className="h-full w-full min-[820px]:hidden" viewBox="0 0 390 844" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M-10 700 C 80 680, 140 720, 200 660 S 320 560, 400 500" fill="none" stroke="#22C573" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path d="M-10 750 C 90 735, 160 770, 230 715 S 340 640, 400 600" fill="none" stroke="#D7E9DC" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
                <svg className="hidden h-full w-full min-[820px]:block" viewBox="0 0 1280 800" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M-20 760 C 240 740, 380 780, 560 720 S 900 670, 1300 590" fill="none" stroke="#22C573" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path d="M-20 800 C 260 790, 420 810, 640 770 S 1000 720, 1300 660" fill="none" stroke="#D7E9DC" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
              </>
            ),
          },
        ]}
      >
        <p className={LABEL}>{VISION.label}</p>
        <h2
          id="vision-heading"
          className="mt-4 max-w-[980px] text-balance text-[46px] font-bold leading-[1.02] tracking-[-0.04em] text-foreground min-[820px]:mt-6 min-[820px]:text-[clamp(56px,7.2vw,92px)] min-[820px]:leading-none min-[820px]:tracking-[-0.05em]"
        >
          {VISION.statement}
        </h2>
        <p className={cn("mt-5 text-pretty text-[15.5px] leading-[1.55] min-[820px]:mt-8 min-[820px]:text-[19px]", MUTED)}>{VISION.line}</p>
      </ParallaxSection>

      {/* 4. Origin story. On phones the pieces stack in reading order (label,
          heading, place, story); from 820px the label and place sit in a
          column that stays in view beside the heading and story. */}
      <section aria-labelledby="origin-heading" className="border-t border-border">
        <div className={cn(FRAME, SIDE, "flex flex-col py-12 min-[820px]:grid min-[820px]:grid-cols-[220px_minmax(0,1fr)] min-[820px]:items-start min-[820px]:gap-x-12 min-[820px]:py-[104px] min-[1100px]:grid-cols-[320px_minmax(0,1fr)] min-[1100px]:gap-x-24 min-[1100px]:pb-28")}>
          <div className="contents min-[820px]:sticky min-[820px]:top-28 min-[820px]:flex min-[820px]:flex-col min-[820px]:gap-2.5 min-[820px]:self-start">
            <p className={cn(LABEL, "order-1 min-[820px]:order-none")}>{ORIGIN.label}</p>
            <p className={cn("order-3 mt-2.5 text-sm min-[820px]:order-none min-[820px]:mt-0 min-[820px]:text-[15px]", MUTED)}>{ORIGIN.place}</p>
          </div>
          <div className="contents min-[820px]:flex min-[820px]:max-w-[660px] min-[820px]:flex-col">
            <h2 id="origin-heading" className={cn(H2, "order-2 mt-2.5 min-[820px]:order-none min-[820px]:mt-0")}>{ORIGIN.heading}</h2>
            {ORIGIN.paragraphs.map((text, i) => (
              <p key={i} className={cn(BODY, "order-4 min-[820px]:order-none", i === 0 ? "mt-5 min-[820px]:mt-8" : "mt-[18px] min-[820px]:mt-6")}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The founder's story: his photo and name beside it (above the
          story on phones), the story, and the timeline as an ordered list. */}
      <section aria-labelledby="founder-heading" className="border-t border-border">
        <div className={cn(FRAME, SIDE, "flex flex-col py-12 min-[820px]:grid min-[820px]:grid-cols-[220px_minmax(0,1fr)] min-[820px]:items-start min-[820px]:gap-x-12 min-[820px]:py-[104px] min-[1100px]:grid-cols-[320px_minmax(0,1fr)] min-[1100px]:gap-x-24 min-[1100px]:pb-28")}>
          <div className="order-3 mt-5 flex items-center gap-3.5 min-[820px]:sticky min-[820px]:top-28 min-[820px]:order-none min-[820px]:mt-0 min-[820px]:flex-col min-[820px]:items-start min-[820px]:gap-4 min-[820px]:self-start">
            <Squircle radius={R_FOUNDER} ring={RING} className="block h-[72px] w-[72px] flex-none overflow-hidden min-[820px]:h-auto min-[820px]:w-full min-[820px]:max-w-[320px] min-[820px]:aspect-square">
              <img src={FOUNDER_STORY.photo} alt={FOUNDER_STORY.name} width={512} height={512} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
            </Squircle>
            <div className="flex flex-col gap-0.5 min-[820px]:gap-1">
              <p className="text-[15.5px] font-semibold text-foreground min-[820px]:text-[17px]">{FOUNDER_STORY.name}</p>
              <p className={cn("text-sm min-[820px]:text-[15px]", MUTED)}>{FOUNDER_STORY.role}</p>
            </div>
          </div>
          <div className="contents min-[820px]:flex min-[820px]:max-w-[660px] min-[820px]:flex-col">
            <p className={cn(LABEL, "order-1 min-[820px]:order-none")}>{FOUNDER_STORY.label}</p>
            <h2 id="founder-heading" className={cn(H2, "order-2 mt-2.5 min-[820px]:order-none min-[820px]:mt-3")}>{FOUNDER_STORY.heading}</h2>
            <p className={cn(BODY, "order-4 mt-5 min-[820px]:order-none min-[820px]:mt-8")}>{FOUNDER_STORY.paragraph}</p>
            <ol className="order-5 mt-7 flex list-none flex-col p-0 min-[820px]:order-none min-[820px]:mt-10">
              {FOUNDER_PATH.map((step, i) => {
                const last = i === FOUNDER_PATH.length - 1;
                return (
                  <li key={step.title} className="grid grid-cols-[20px_minmax(0,1fr)] gap-3.5 min-[820px]:grid-cols-[24px_minmax(0,1fr)] min-[820px]:gap-5">
                    <span aria-hidden="true" className="flex flex-col items-center">
                      <span className={cn("mt-[5px] h-[11px] w-[11px] flex-none rounded-full border-2 border-primary min-[820px]:mt-1.5 min-[820px]:h-3 min-[820px]:w-3", last ? "bg-primary" : "bg-background")} />
                      <span className={cn("mt-1 w-0.5 flex-1", last ? "bg-transparent" : "bg-[#D7E9DC]")} />
                    </span>
                    <span className="flex flex-col gap-0.5 pb-5 min-[820px]:gap-1 min-[820px]:pb-7">
                      <span className="text-base font-semibold text-foreground min-[820px]:text-lg">{step.title}</span>
                      <span className={cn("text-[14.5px] leading-[1.5] min-[820px]:text-base", MUTED)}>{step.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* 6. Service as a Software. A real table from 820px; on phones each row
          is its own card, from the same data. */}
      <section aria-labelledby="service-heading" className="border-t border-border bg-[#F8EFD8]">
        <div className={cn(FRAME, SIDE, "py-12 min-[820px]:py-[104px] min-[1100px]:pb-28")}>
          <div className="flex flex-col gap-3.5 min-[820px]:grid min-[820px]:grid-cols-2 min-[820px]:items-end min-[820px]:gap-16">
            <div>
              <p className={LABEL}>{SERVICE.label}</p>
              <h2 id="service-heading" className={cn(H2, "mt-2.5 min-[820px]:mt-3")}>{SERVICE.heading}</h2>
            </div>
            <p className={cn("text-pretty text-[16.5px] leading-[1.55] min-[820px]:text-[19px] min-[820px]:leading-[1.6]", MUTED)}>{SERVICE.intro}</p>
          </div>

          <Squircle radius={R_SERVICE_TABLE} ring={RING} className="mt-12 hidden overflow-hidden bg-card min-[820px]:block">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">{SERVICE.caption}</caption>
              <colgroup>
                <col className="w-[28%]" />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr className="border-b border-border">
                  {SERVICE.columns.map((c, i) => (
                    <th key={c} scope="col" className={cn("px-7 py-[18px] text-sm font-semibold", i === 2 ? "bg-forest text-forest-foreground" : MUTED)}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICE.rows.map((row, i) => (
                  <tr key={row.title} className={cn("transition-colors duration-200 hover:bg-background", i < SERVICE.rows.length - 1 && "border-b border-border")}>
                    <th scope="row" className="px-7 py-6 align-top text-lg font-semibold text-foreground">{row.title}</th>
                    <td className={cn("px-7 py-6 align-top text-[16.5px] leading-[1.5]", MUTED)}>{row.hand}</td>
                    <td className="bg-[#EEF7EC] px-7 py-6 align-top text-[16.5px] leading-[1.5] text-foreground">
                      <div className="flex gap-3">
                        <Check />
                        <span>{row.zensus}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Squircle>

          <ul className="mt-6 flex list-none flex-col gap-3 p-0 min-[820px]:hidden">
            {SERVICE.rows.map((row) => (
              <li key={row.title}>
                <Squircle radius={R_SERVICE_CARD} ring={RING} className="overflow-hidden bg-card">
                  <p className="px-[18px] pt-4 text-[16.5px] font-semibold text-foreground">{row.title}</p>
                  <p className={cn("mt-1.5 px-[18px] pb-3.5 text-[14.5px] leading-[1.5]", MUTED)}>
                    <span className="font-semibold">By hand:</span> {row.hand}
                  </p>
                  <p className="border-t border-[#D7E9DC] bg-[#EEF7EC] px-[18px] pb-3.5 pt-3 text-[14.5px] leading-[1.5] text-foreground">
                    <span className="font-semibold text-primary">Zensus:</span> {row.zensus}
                  </p>
                </Squircle>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-1.5 min-[820px]:mt-7 min-[820px]:flex-row min-[820px]:items-center min-[820px]:justify-between min-[820px]:gap-8">
            <p className="max-w-[640px] text-pretty text-[15.5px] leading-[1.55] text-foreground min-[820px]:text-[16.5px]">
              <span className="font-semibold">{SERVICE.cfo.lead}</span> {SERVICE.cfo.body}
            </p>
            <Link
              to="/pricing"
              onClick={() => track(EVENTS.ABOUT_PRICING_CLICK)}
              className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-sm py-2.5 text-[15.5px] font-semibold text-primary transition-colors hover:text-forest min-[820px]:py-0 min-[820px]:text-base", LINK_FOCUS)}
            >
              {SERVICE.link} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. What we believe: the heading stays in view beside the list from 820px. */}
      <section aria-labelledby="beliefs-heading" className="border-y border-border">
        <div className={cn(FRAME, SIDE, "py-12 min-[820px]:grid min-[820px]:grid-cols-[220px_minmax(0,1fr)] min-[820px]:items-start min-[820px]:gap-x-12 min-[820px]:py-[104px] min-[1100px]:grid-cols-[320px_minmax(0,1fr)] min-[1100px]:gap-x-24 min-[1100px]:pb-28")}>
          <h2 id="beliefs-heading" className={cn(H2, "min-[820px]:sticky min-[820px]:top-28 min-[820px]:self-start")}>What we believe</h2>
          <ol className="mt-6 flex list-none flex-col border-t border-border p-0 min-[820px]:mt-0">
            {BELIEFS.map((b, i) => (
              <li key={b.title} className="flex flex-col gap-2 border-b border-border py-5 transition-colors duration-200 hover:bg-card min-[820px]:grid min-[820px]:grid-cols-[48px_minmax(0,1fr)] min-[820px]:gap-4 min-[820px]:px-6 min-[820px]:py-7">
                <span className="font-mono text-[13px] font-semibold text-primary min-[820px]:pt-[9px] min-[820px]:text-sm">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[21px] font-bold leading-[1.2] tracking-[-0.015em] text-foreground min-[820px]:text-[28px] min-[820px]:leading-[1.15] min-[820px]:tracking-[-0.02em]">{b.title}</h3>
                  <p className={cn("mt-2 max-w-[560px] text-pretty text-base leading-[1.55] min-[820px]:mt-2.5 min-[820px]:text-lg", MUTED)}>{b.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Our team. Each card keeps its id (the anchor of the person's
          schema.org @id, which blog bylines point at). */}
      <section aria-labelledby="team-heading">
        <div className={cn(FRAME, SIDE, "py-12 min-[820px]:py-[104px] min-[1100px]:pb-[120px]")}>
          <h2 id="team-heading" className={H2}>{TEAM_HEADING}</h2>
          <ul className="mt-6 grid list-none grid-cols-2 gap-x-3.5 gap-y-6 p-0 min-[820px]:mt-12 min-[820px]:grid-cols-3 min-[820px]:gap-6">
            {TEAM.map((m) => (
              <li key={m.id} id={m.id} className="flex scroll-mt-24 flex-col">
                <Squircle radius={R_PHOTO} ring={RING} className="block aspect-square w-full overflow-hidden bg-[#F1E6CB]">
                  <img src={m.photo} alt={m.name} width={512} height={512} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
                </Squircle>
                <div className="mt-2.5 flex items-start justify-between gap-1 min-[820px]:mt-3.5 min-[820px]:gap-2">
                  <div className="flex min-w-0 flex-col gap-0.5 pt-1 min-[820px]:gap-[3px]">
                    <p className="text-[15px] font-semibold text-foreground min-[820px]:text-[17px]">{m.name}</p>
                    <p className={cn("text-[13.5px] min-[820px]:text-[15px]", MUTED)}>{m.title}</p>
                  </div>
                  <Squircle
                    as="a"
                    radius={R_LINKEDIN}
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    onClick={() => track(EVENTS.ABOUT_LINKEDIN_CLICK, { name: m.name })}
                    className="-mr-2.5 inline-flex h-11 w-11 flex-none items-center justify-center text-foreground transition-colors hover:bg-[#F1E6CB] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring min-[820px]:mr-0"
                  >
                    <LinkedInGlyph size={18} />
                  </Squircle>
                </div>
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
