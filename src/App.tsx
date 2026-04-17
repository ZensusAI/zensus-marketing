import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Forecast from "./pages/Forecast";
import Blog from "./pages/Blog";
import Changelog from "./pages/Changelog";
import NotFound from "./pages/NotFound";
import Security from "./pages/Security";
import Integrations from "./pages/Integrations";
import PlaidIntegration from "./pages/integrations/Plaid";
import QuickBooksIntegration from "./pages/integrations/QuickBooks";
import HubSpotIntegration from "./pages/integrations/HubSpot";
import SlackIntegration from "./pages/integrations/Slack";
import RedirectToApp from "./components/RedirectToApp";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<RedirectToApp />} />
            <Route path="/support" element={<RedirectToApp />} />
            <Route path="/features" element={<RedirectToApp />} />
            <Route path="/security" element={<Security />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/integrations/plaid" element={<PlaidIntegration />} />
            <Route path="/integrations/quickbooks" element={<QuickBooksIntegration />} />
            <Route path="/integrations/hubspot" element={<HubSpotIntegration />} />
            <Route path="/integrations/slack" element={<SlackIntegration />} />
            <Route path="/changelog" element={<Changelog />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
