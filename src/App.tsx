import { lazy, Suspense, useLayoutEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { PostHogPageview } from "./lib/analytics/PostHogPageview";
import { ConsentBanner } from "@/components/ConsentBanner";
import Index from "./pages/Index";

// The homepage ships in the initial bundle (most visitors land there and
// the prerendered HTML hydrates fastest when React does not need to
// fetch a separate chunk). Every other route lazy-loads.
const Pricing = lazy(() => import("./pages/Pricing"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Changelog = lazy(() => import("./pages/Changelog"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Security = lazy(() => import("./pages/Security"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Subprocessors = lazy(() => import("./pages/Subprocessors"));
const Support = lazy(() => import("./pages/Support"));
const Integrations = lazy(() => import("./pages/Integrations"));
const UseCases = lazy(() => import("./pages/UseCases"));
const RunwayCalculator = lazy(() => import("./pages/tools/RunwayCalculator"));
const PayrollCalendar = lazy(() => import("./pages/tools/PayrollCalendar"));
const ZensusVsFloat = lazy(() => import("./pages/compare/ZensusVsFloat"));
const ZensusVsPulse = lazy(() => import("./pages/compare/ZensusVsPulse"));
const LlmInfo = lazy(() => import("./pages/LlmInfo"));
const PlaidIntegration = lazy(() => import("./pages/integrations/Plaid"));
const QuickBooksIntegration = lazy(
  () => import("./pages/integrations/QuickBooks"),
);
const HubSpotIntegration = lazy(() => import("./pages/integrations/HubSpot"));
const SlackIntegration = lazy(() => import("./pages/integrations/Slack"));

// Minimal suspense fallback: the prerendered HTML is already visible,
// so hydration gaps only matter if a visitor navigates client-side to
// a lazy route. A blank placeholder is fine.
const RouteFallback = () => <div className="min-h-screen bg-background" />;

// Routes that use the cream-first brand theme (tokens in index.css under
// :root.theme-cream). The class lives on <html> so portaled UI inherits it.
//
// This MUST be toggled per route here, not added/removed by the landing page
// component: prerender writes dist/index.html (with the class baked in) first
// and then serves that same shell for every other route, so a page that never
// mounts Index would otherwise inherit cream and never remove it. Driving the
// class from the current pathname keeps every route, prerendered or
// client-navigated, on its own theme.
const CREAM_ROUTES = new Set(["/"]);

const ThemeScope = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    document.documentElement.classList.toggle(
      "theme-cream",
      CREAM_ROUTES.has(pathname),
    );
  }, [pathname]);
  return null;
};

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConsentBanner />
      <BrowserRouter>
        <ThemeScope />
        <PostHogPageview />
        <Analytics />
        <SpeedInsights />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/security" element={<Security />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/subprocessors" element={<Subprocessors />} />
            <Route path="/support" element={<Support />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/integrations/plaid" element={<PlaidIntegration />} />
            <Route
              path="/integrations/quickbooks"
              element={<QuickBooksIntegration />}
            />
            <Route
              path="/integrations/hubspot"
              element={<HubSpotIntegration />}
            />
            <Route path="/integrations/slack" element={<SlackIntegration />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route
              path="/tools/runway-calculator"
              element={<RunwayCalculator />}
            />
            <Route
              path="/tools/payroll-calendar"
              element={<PayrollCalendar />}
            />
            <Route
              path="/compare/zensus-vs-float"
              element={<ZensusVsFloat />}
            />
            <Route
              path="/compare/zensus-vs-pulse"
              element={<ZensusVsPulse />}
            />
            <Route path="/llm-info" element={<LlmInfo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </HelmetProvider>
);

export default App;
