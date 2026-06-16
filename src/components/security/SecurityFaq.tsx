import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqPageSchema, type FaqItem } from "@/lib/structured-data";

// Honest, People-Also-Ask shaped questions. These power both the in-page
// accordion and the FAQPage JSON-LD, so AI engines and Google can cite them.
const FAQS: FaqItem[] = [
  {
    question: "Is my financial data safe with Zensus?",
    answer:
      "Every integration token is encrypted at rest with AES-256-GCM, data moves over TLS, and your stored data sits on encrypted AWS infrastructure in a United States region. Every database query is scoped to your account, so cross-account access is not possible by design.",
  },
  {
    question: "Does Zensus store my bank password?",
    answer:
      "No. You connect through OAuth, and Plaid and Intuit hold those credentials. Zensus only ever receives scoped tokens, never your bank or QuickBooks password.",
  },
  {
    question: "Does Zensus use my data to train AI?",
    answer:
      "No. Your data never trains any model. When you run a scenario, your data is sent to Claude per request, analyzed, and returned to you. There is no training, no fine-tuning, and no memory across accounts.",
  },
  {
    question: "Where is my financial data stored?",
    answer:
      "Your stored data lives on AWS in a United States region. If your procurement process needs the specific region or a data-flow diagram, email support@zensus.app and we will share it.",
  },
  {
    question: "Is Zensus SOC 2 certified?",
    answer:
      "Not yet. Our data-protection and access-control practices are documented and reviewable on request, and we would rather tell you exactly where we stand than imply a certification we do not hold.",
  },
];

const SecurityFaq = () => (
  <>
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqPageSchema(FAQS))}</script>
    </Helmet>
    <Accordion type="single" collapsible className="w-full">
      {FAQS.map((faq, i) => (
        <AccordionItem key={faq.question} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-base font-medium text-foreground">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </>
);

export default SecurityFaq;
