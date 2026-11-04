import { SITE_URL } from "@/lib/constants";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import { HERO_MESH } from "@/components/landing/hero-mesh";
import CustomerStory from "@/components/landing/CustomerStory";
import { TrustBar } from "@/components/landing/TrustBar";
import Problem from "@/components/landing/Problem";
import RunwayFeature from "@/components/landing/RunwayFeature";
import Bento from "@/components/landing/Bento";
import Comparison from "@/components/landing/Comparison";
import HowItWorks from "@/components/landing/HowItWorks";
import FAQ from "@/components/landing/FAQ";
import Resources from "@/components/landing/Resources";
import FinalCTABand from "@/components/landing/FinalCTABand";
import Footer from "@/components/landing/Footer";

const Index = () => {
  // Render the prerendered content immediately. (Previously this gated the
  // whole page behind a 300ms `isLoading` skeleton, which on hydration
  // unmounted the prerendered hero (including the LCP image) and remounted
  // it a beat later, delaying Largest Contentful Paint. There is no async
  // data here, so the loading state was pure cost.)
  // The cream brand theme is applied by ThemeScope in App.tsx (per-route
  // class on <html>), not here. See the comment there for the prerender
  // ordering constraint that forced the move.

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setTimeout(() => el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" }), 50);
      }
    }
  }, []);

  return (
    // overflow-x-clip, not hidden: clip trims anything that bleeds off the
    // edge without making a scroll container, so the pinned sections' sticky
    // stages keep working.
    <div className="min-h-screen overflow-x-clip bg-background">
      <Helmet>
        {/* Title and description from handoff 18-hero-v2 (SEO, 4 Nov 2026),
            chosen with the user over the brand-first title that replaced a
            keyword-first one after Google swapped it for the H1 (19 Oct
            2026). The H1 now differs from the title, which should make that
            swap less likely; check Search Console before changing it again.
            "Software" is dropped from the handoff's title to fit Google's 60
            characters (search-snippets.test.ts); the phrase "cash flow
            forecasting software" stays in the subhead. og:/twitter: titles
            stay in step with the title. */}
        <title>Cash Flow Forecasting for QuickBooks &amp; HubSpot | Zensus</title>
        <meta name="description" content="Connect your bank, QuickBooks, and HubSpot to see every week of cash and the month it runs out. 14-day free trial." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Cash Flow Forecasting for QuickBooks &amp; HubSpot | Zensus" />
        <meta property="og:description" content="Connect your bank, QuickBooks, and HubSpot to see every week of cash and the month it runs out. 14-day free trial." />
        <meta property="og:image" content={`${SITE_URL}/og/home.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus homepage social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cash Flow Forecasting for QuickBooks &amp; HubSpot | Zensus" />
        <meta name="twitter:description" content="Connect your bank, QuickBooks, and HubSpot to see every week of cash and the month it runs out. 14-day free trial." />
        <meta name="twitter:image" content={`${SITE_URL}/og/home.png`} />
        <link rel="canonical" href={`${SITE_URL}/`} />
        {/* The hero's mesh-wave background is the largest thing in the first
            screen, so it is likely the LCP element: preload exactly the file
            the CSS will pick at each width. */}
        <link rel="preload" as="image" type="image/webp" href={HERO_MESH.narrow} media={`(max-width: ${HERO_MESH.switchPx - 1}px)`} fetchPriority="high" />
        <link rel="preload" as="image" type="image/webp" href={HERO_MESH.wide} media={`(min-width: ${HERO_MESH.switchPx}px)`} fetchPriority="high" />
      </Helmet>
      {/* 01-navbar: redesigned (shared by every route). */}
      <Navbar />
      <main>
        {/* Homepage redesign order (handoff 00-overview). SecurityStrip and
            PricingPreview left the homepage; their content lives on /security
            and /pricing. The proof strip keeps the encryption claims as
            visible text, and the final CTA band carries the price with an
            in-content /pricing link. */}
        {/* 18-hero-v2: replaces 02-hero. The Cash flow card ends at the
            800px fold on a 1280x800 screen. */}
        <Hero />
        {/* 18-hero-v2 proof strip (replaces 03-proof-strip), just below the
            fold. */}
        <TrustBar />
        {/* 05-customer-story: redesigned. */}
        <CustomerStory />
        {/* 06-problem: redesigned. */}
        <Problem />
        {/* 07-runway-feature: redesigned (pinned). */}
        <RunwayFeature />
        {/* 08-sync: redesigned (pinned). */}
        <Bento />
        {/* 09-comparison: redesigned (pinned). */}
        <Comparison />
        {/* 10-how-it-works: redesigned (pinned). */}
        <HowItWorks />
        {/* 11-faq: redesigned (search-first; keeps the FAQPage JSON-LD). */}
        <FAQ />
        {/* Kept on purpose, against the handoff's removal list: this is the
            only in-content homepage link to the free tools and key guides
            (internal-links.test.ts). The payroll calendar holds about two
            thirds of search impressions and is mid-measurement until the
            25 Oct 2026 Search Console export. Remove it only once a
            redesigned section carries these links. */}
        <Resources />
        {/* 12-final-cta: redesigned (rounded bottom onto the footer). */}
        <FinalCTABand />
      </main>
      {/* 13-footer: redesigned (sitewide). */}
      <Footer />
    </div>
  );
};

export default Index;
