import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BlogFaqItem } from "@/lib/blog";

interface BlogPostFaqProps {
  items: BlogFaqItem[];
}

export function BlogPostFaq({ items }: BlogPostFaqProps) {
  return (
    <section
      id="faq"
      aria-labelledby="blog-faq-heading"
      className="mt-16 border-t border-border pt-12"
    >
      <h2
        id="blog-faq-heading"
        className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="mt-6 space-y-3">
        {items.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`faq-${index}`}
            className="rounded-xl border border-border bg-card/50 px-5 data-[state=open]:border-primary/30"
          >
            <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-4">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
