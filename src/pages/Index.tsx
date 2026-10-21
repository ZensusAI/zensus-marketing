import { SITE_URL } from "@/lib/constants";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import { HERO_MESH } from "@/components/landing/hero-mesh";
import HeroShowcase from "@/components/landing/HeroShowcase";
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
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        {/* The category term "cash flow forecasting" appears nowhere in the H1 by
            design (it would read like a directory listing), so the <title>
            carries it. The brand leads: with the keyword first, Google replaced
            this title with the H1 in results (seen 2026-10-19). Leading with the
            brand is the fix tried; check the result in Search Console before
            changing it again. The og:/twitter: titles
            below keep the benefit line, since social cards are a click surface
            rather than a ranking one. */}
        <title>Zensus · Cash flow forecasting for unpredictable revenue</title>
        <meta name="description" content="Zensus is cash flow forecasting software for businesses with unpredictable revenue. Connect your bank, QuickBooks and HubSpot to see the date cash runs out." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Zensus · Your cash flow, mapped as far ahead as you need" />
        <meta property="og:description" content="Get a live, always-current picture of your cash position. Built for businesses with unpredictable revenue." />
        <meta property="og:image" content={`${SITE_URL}/og/home.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus homepage social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zensus · Your cash flow, mapped as far ahead as you need" />
        <meta name="twitter:description" content="Get a live, always-current picture of your cash position. Built for businesses with unpredictable revenue." />
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
        {/* Homepage redesign order (handoff 00-overview). Each TODO names the
            handoff folder that replaces the current component. SecurityStrip
            and PricingPreview left the homepage; their content lives on
            /security and /pricing, both in the navbar, and the proof strip
            keeps the OAuth and AES-256-GCM claims in text. */}
        {/* 02-hero: redesigned. */}
        <Hero />
        {/* 03-proof-strip: redesigned. */}
        <TrustBar />
        {/* 04-product-showcase: redesigned (pinned). */}
        <HeroShowcase />
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
        {/* TODO(11-faq): keep the FAQPage JSON-LD. */}
        <FAQ />
        {/* Kept on purpose, against the handoff's removal list: this is the
            only in-content homepage link to the free tools and key guides
            (internal-links.test.ts). The payroll calendar holds about two
            thirds of search impressions and is mid-measurement until the
            25 Oct 2026 Search Console export. Remove it only once a
            redesigned section carries these links. */}
        <Resources />
        {/* TODO(12-final-cta) */}
        <FinalCTABand />
      </main>
      {/* TODO(13-footer) */}
      <Footer />
    </div>
  );
};

export default Index;
