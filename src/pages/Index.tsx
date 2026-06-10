import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HeroShowcase from "@/components/landing/HeroShowcase";
import { TrustBar } from "@/components/landing/TrustBar";
import Problem from "@/components/landing/Problem";
import RunwayFeature from "@/components/landing/RunwayFeature";
import Bento from "@/components/landing/Bento";
import Comparison from "@/components/landing/Comparison";
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
        <title>Zensus · Cash flow forecasting for founders with variable revenue</title>
        <meta name="description" content="Know exactly when your cash runs out and what to do about it. Connect your bank, QuickBooks, and HubSpot for cash flow projections that match the calendar." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zensus.app/" />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Zensus · Cash flow forecasting for founders" />
        <meta property="og:description" content="A cash flow forecast that knows your annual contract hits March 14, not 'sometime in Q1.' Built for founders with variable revenue." />
        <meta property="og:image" content="https://zensus.app/og/home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus homepage social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zensus · Cash flow forecasting for founders" />
        <meta name="twitter:description" content="A cash flow forecast that knows your annual contract hits March 14, not 'sometime in Q1.' Built for founders with variable revenue." />
        <meta name="twitter:image" content="https://zensus.app/og/home.png" />
        <link rel="canonical" href="https://zensus.app/" />
        {/* The aurora hero image is gone (cream brand canvas replaced it), so
            its LCP preloads went with it. The aurora asset files stay in
            public/ because SignupModal still uses /hero-aurora-1200.webp. */}
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
        <Comparison />
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
