import { useId, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { faqPageSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import { FAQS, REVIEWER_GROUPS, type ReviewerGroup } from "./security-content";

interface RowProps {
  title: string;
  /** Mono count beside a reviewer row's title. */
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/**
 * Built here, not on ui/accordion: Radix unmounts closed content, and search
 * and AI engines must find every answer in the HTML. A closed row collapses
 * with CSS and stays in the DOM.
 */
const Row = ({ title, count, open, onToggle, children }: RowProps) => {
  const id = useId();
  return (
    <>
      <h3 className="m-0">
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex min-h-[58px] w-full cursor-pointer items-center justify-between gap-4 rounded-md py-[15px] text-left text-[17px] font-semibold leading-[1.4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-sage-deep"
        >
          <span>{title}</span>
          <span className="flex shrink-0 items-center gap-3">
            {count === undefined ? null : (
              <span className="font-mono text-[12.5px] font-normal text-muted-foreground">{count}</span>
            )}
            <Plus
              className={cn(
                "h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
                open && "rotate-45",
              )}
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </>
  );
};

const ReviewerRows = ({ group }: { group: ReviewerGroup }) => (
  <>
    {group.intro ? (
      <p className="mb-2 text-[15px] leading-[1.6] text-muted-foreground">{group.intro}</p>
    ) : null}
    <dl className="mb-4">
      {group.rows.map(([term, detail]) => (
        <div
          key={term}
          className="grid grid-cols-1 gap-x-5 gap-y-1 border-t border-rule-soft py-[11px] min-[760px]:grid-cols-[190px_minmax(0,1fr)]"
        >
          <dt className="text-[14.5px] font-semibold">{term}</dt>
          <dd
            className={cn(
              "min-w-0 leading-[1.55] text-muted-foreground [overflow-wrap:anywhere]",
              group.mono ? "font-mono text-[13.5px]" : "text-[15px]",
            )}
          >
            {detail}
          </dd>
        </div>
      ))}
    </dl>
  </>
);

/** Questions first, then the reviewer detail in the same list on a lighter fill. */
const SecurityFaq = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openGroup, setOpenGroup] = useState<number | null>(null);

  return (
    <div className="w-full border-t border-foreground">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqPageSchema(FAQS))}</script>
      </Helmet>
      {FAQS.map((faq, i) => (
        <div key={faq.question} className="border-b border-border">
          <Row title={faq.question} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)}>
            <p className="pb-5 pr-9 text-[16px] leading-[1.65] text-muted-foreground">{faq.answer}</p>
          </Row>
        </div>
      ))}
      {REVIEWER_GROUPS.map((group, i) => (
        <div key={group.title} className="-mx-4 border-b border-border bg-card px-4">
          <Row
            title={group.title}
            count={group.rows.length}
            open={openGroup === i}
            onToggle={() => setOpenGroup(openGroup === i ? null : i)}
          >
            <ReviewerRows group={group} />
          </Row>
        </div>
      ))}
    </div>
  );
};

export default SecurityFaq;
