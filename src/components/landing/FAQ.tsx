import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Zensus generate forecasts?",
    answer: "Zensus uses AI to analyze your uploaded financial data (Excel or CSV) and generates 8-week cash flow projections across three scenarios: optimistic, expected, and pessimistic.",
  },
  {
    question: "What file formats do you support?",
    answer: "We currently support Excel (.xlsx, .xls) and CSV files. Our AI automatically extracts and structures your financial data from these formats.",
  },
  {
    question: "How often are forecasts updated?",
    answer: "Forecasts update automatically when you upload new data. You can also manually trigger updates at any time to see the latest projections.",
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