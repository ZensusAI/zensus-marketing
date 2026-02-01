import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does QuickBooks integration work?",
    answer: "Connect with one click using OAuth. We securely pull your financial data and keep it synced automatically. Your credentials are never stored.",
  },
  {
    question: "What's the difference between Forecast and Runway?",
    answer: "Forecast lets you upload any cash flow statement for scenario planning. Runway connects directly to QuickBooks for automatic, real-time financial tracking and Q&A.",
  },
  {
    question: "What questions can I ask about my runway?",
    answer: "Ask anything like 'When will I run out of cash?', 'Can I afford to hire in 3 months?', or 'What if I lose my biggest client?'",
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes. We use bank-level encryption, never store your QuickBooks credentials, and all data is processed in your isolated environment.",
  },
  {
    question: "What file formats does Forecast support?",
    answer: "We support Excel (.xlsx, .xls) and CSV files. Our AI automatically extracts and structures your cash flow data.",
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

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
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
      </div>
    </section>
  );
};

export default FAQ;