import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HeroShowcase from "@/components/landing/HeroShowcase";
import { TrustBar } from "@/components/landing/TrustBar";
import Problem from "@/components/landing/Problem";
import RunwayFeature from "@/components/landing/RunwayFeature";
import Bento from "@/components/landing/Bento";
import HowItWorks from "@/components/landing/HowItWorks";
import SecurityStrip from "@/components/landing/SecurityStrip";
import PricingPreview from "@/components/landing/PricingPreview";
import FAQ from "@/components/landing/FAQ";
import FinalCTABand from "@/components/landing/FinalCTABand";
import Footer from "@/components/landing/Footer";
import { GoogleOneTap } from "@/components/landing/GoogleOneTap";

const Index = () => {
  // Render the prerendered content immediately. (Previously this gated the
  // whole page behind a 300ms `isLoading` skeleton, which on hydration
  // unmounted the prerendered hero — including the LCP image — and remounted
  // it a beat later, delaying Largest Contentful Paint. There is no async
  // data here, so the loading state was pure cost.)
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
        <title>Zensus · Cash flow forecasting for founders with variable revenue</title>
        <meta name="description" content="Know exactly when your cash runs out and what to do about it. Connect your bank, QuickBooks, and HubSpot for runway projections that match the calendar." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zensus.app/" />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Zensus · Cash flow forecasting for founders" />
        <meta property="og:description" content="Runway that knows your annual contract hits March 14, not 'sometime in Q1.' Built for founders with variable revenue." />
        <meta property="og:image" content="https://zensus.app/og/home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus homepage social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zensus · Cash flow forecasting for founders" />
        <meta name="twitter:description" content="Runway that knows your annual contract hits March 14, not 'sometime in Q1.' Built for founders with variable revenue." />
        <meta name="twitter:image" content="https://zensus.app/og/home.png" />
        <link rel="canonical" href="https://zensus.app/" />
        {/* Preload the LCP hero image (AVIF) — one variant per breakpoint, exactly
            matching the <picture> in Hero.tsx so a single resource is fetched. With
            createRoot re-rendering the <img> at bundle time, this caches the bytes
            during HTML parse so the re-render paints instantly. Home-only.
            fetchpriority="high" mirrors the <img>'s own hint onto the preload so the
            hero image outranks the ~600KB of product screenshots and the JS bundle
            for bandwidth on constrained connections (Lighthouse lcp-discovery-insight
            flagged the missing hint). */}
        <link rel="preload" as="image" type="image/avif" href="/hero-aurora-800.avif" media="(max-width: 768px)" fetchPriority="high" />
        <link rel="preload" as="image" type="image/avif" href="/hero-aurora-1200.avif" media="(min-width: 769px) and (max-width: 1280px)" fetchPriority="high" />
        <link rel="preload" as="image" type="image/avif" href="/hero-aurora-1920.avif" media="(min-width: 1281px)" fetchPriority="high" />
      </Helmet>
      <Navbar />
      {/* Google One Tap (ZEN-365): self-gates on config + existing session,
          renders only its own top-right prompt. No-op until env is configured. */}
      <GoogleOneTap />
      <main>
        <Hero />
        <HeroShowcase />
        <TrustBar />
        <Problem />
        <RunwayFeature />
        <Bento />
        <HowItWorks />
        <SecurityStrip />
        <PricingPreview />
        <FAQ />
        <FinalCTABand />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
