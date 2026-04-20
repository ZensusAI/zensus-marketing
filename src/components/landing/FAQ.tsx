import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqGroups = [
  {
    category: "Getting Started",
    items: [
      {
        question: "Do I need QuickBooks to use Zensus?",
        answer: "No. You can connect your bank account directly via Plaid, connect QuickBooks, sync your HubSpot subscriptions, or use any combination. No single integration is required to get started.",
      },
      {
        question: "Can I connect my HubSpot account?",
        answer: "Yes. Zensus syncs your HubSpot subscriptions (including annual and quarterly contracts) so your runway projections reflect when revenue actually hits your bank, not just flat monthly estimates.",
      },
      {
        question: "How long does setup take?",
        answer: "Under 2 minutes. Connect your bank or QuickBooks with one click, and your runway is calculated instantly. No manual data entry.",
      },
    ],
  },
  {
    category: "Product",
    items: [
      {
        question: "What kind of questions can I ask?",
        answer: "Anything about your finances. Examples: \"When will I run out of cash?\", \"Can I afford to hire two engineers?\", \"What if we lose our largest annual contract?\", \"What happens with 5% monthly churn?\", \"What if we switch a client from monthly to annual billing?\"",
      },
      {
        question: "Can I get notified when I'm running low on cash?",
        answer: "Yes. Zensus watches your 30-day projection and fires a Slack alert the moment it drops below a threshold you set. It re-alerts on material change (if the breach moves earlier or your minimum balance drops 10%) and you can snooze or adjust your threshold directly from Slack.",
      },
      {
        question: "How often does my data update?",
        answer: "Your data syncs in real time via webhooks. The moment a transaction clears in Plaid, an invoice changes in QuickBooks, or a subscription updates in HubSpot, your runway recalculates. You can also trigger a manual sync from any source at any time.",
      },
    ],
  },
  {
    category: "Trust & Security",
    items: [
      {
        question: "Is my financial data secure?",
        answer: "Yes. All integration tokens are encrypted at rest with AES-256-GCM. Your bank and QuickBooks credentials are never stored on our servers; we rely on OAuth managed by Plaid and Intuit. Every query is isolated by account at the database level, and data sits on encrypted AWS infrastructure.",
      },
      {
        question: "Who can see my data?",
        answer: "Only you. Your financial data is never shared, sold, or used to train AI models. Each account is completely isolated.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        question: "How does pricing work?",
        answer: "Zensus pricing is tailored to your business size and data volume. We will walk you through what it looks like for you on the call.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups
    .flatMap((g) => g.items)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
};

const FAQ = () => {
  return (
    <section id="faq" className="section-padding bg-secondary/30">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Zensus
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-10">
          {faqGroups.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {group.category}
              </p>
              <Accordion type="single" collapsible className="space-y-4">
                {group.items.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${group.category}-${index}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
