import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteTracker } from "@/lib/analytics";
import Index from "./pages/Index";

// The homepage ships in the initial bundle (most visitors land there and
// the prerendered HTML hydrates fastest when React does not need to
// fetch a separate chunk). Every other route lazy-loads.
const Pricing = lazy(() => import("./pages/Pricing"));
const Blog = lazy(() => import("./pages/Blog"));
const Changelog = lazy(() => import("./pages/Changelog"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Security = lazy(() => import("./pages/Security"));
const About = lazy(() => import("./pages/About"));
const Integrations = lazy(() => import("./pages/Integrations"));
const PlaidIntegration = lazy(() => import("./pages/integrations/Plaid"));
const QuickBooksIntegration = lazy(
  () => import("./pages/integrations/QuickBooks"),
);
const HubSpotIntegration = lazy(() => import("./pages/integrations/HubSpot"));
const SlackIntegration = lazy(() => import("./pages/integrations/Slack"));

const queryClient = new QueryClient();

// Minimal suspense fallback: the prerendered HTML is already visible,
// so hydration gaps only matter if a visitor navigates client-side to
// a lazy route. A blank placeholder is fine.
const RouteFallback = () => <div className="min-h-screen bg-background" />;

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteTracker />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/security" element={<Security />} />
              <Route path="/about" element={<About />} />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
