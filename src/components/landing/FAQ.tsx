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
        answer: "No. You can connect your bank account directly via Plaid, connect QuickBooks, or use both together. You can also upload a spreadsheet to get started immediately — no integrations required.",
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
        question: "What's the difference between Runway and Forecast?",
        answer: "Runway connects to your bank and QuickBooks to give you a live, always-updated view of how long your cash will last — plus AI-powered what-if scenarios. Forecast lets you upload any cash flow spreadsheet for one-time analysis and projections. Most users start with Runway.",
      },
      {
        question: "What kind of questions can I ask?",
        answer: "Anything about your finances. Examples: \"When will I run out of cash?\", \"Can I afford to hire two engineers?\", \"What happens if I lose my biggest client?\", \"What's my burn rate trend over the last 6 months?\" You can type or speak — Zensus has a built-in voice assistant.",
      },
      {
        question: "How often does my data update?",
        answer: "Bank and QuickBooks data syncs automatically every day. Your runway calculation updates in real-time as new data comes in.",
      },
    ],
  },
  {
    category: "Trust & Security",
    items: [
      {
        question: "Is my financial data secure?",
        answer: "Yes. We use bank-level AES-256 encryption. Your QuickBooks and bank credentials are never stored — we use OAuth tokens managed by Plaid and Intuit. All data is processed on encrypted AWS infrastructure.",
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
        question: "Can I cancel anytime?",
        answer: "Yes. There are no contracts or cancellation fees. You can cancel anytime from your billing settings. If you cancel, you keep access through the end of your billing period.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Frequently asked <span className="text-gradient">questions</span>
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
