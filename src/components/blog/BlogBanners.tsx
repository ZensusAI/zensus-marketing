import { Link } from "react-router-dom";
import { SITE_HOST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HERO_MESH } from "@/components/landing/hero-mesh";
import chatgptLogo from "@/assets/ai/chatgpt.svg";
import claudeLogo from "@/assets/ai/claude.svg";
import geminiLogo from "@/assets/ai/gemini.svg";
import grokLogo from "@/assets/ai/grok.png";
import perplexityLogo from "@/assets/ai/perplexity.svg";
import { FOCUS_RING, SQUIRCLE } from "./PostCard";

// "Not sure where to start?": each assistant opens with this prompt, which
// asks the reader about their situation and then picks a guide. Same pattern
// as the footer's Ask AI card. Gemini has no prefill URL, so it opens in
// Google AI Mode, which runs Gemini.
const PROMPT = encodeURIComponent(
  `I'm reading the Zensus blog at ${SITE_HOST}/blog. Ask me one question about my business and cash situation, then recommend which Zensus guide I should read first and why.`,
);
const ASSISTANTS = [
  { name: "ChatGPT", url: `https://chatgpt.com/?q=${PROMPT}`, logo: chatgptLogo },
  { name: "Claude", url: `https://claude.ai/new?q=${PROMPT}`, logo: claudeLogo },
  { name: "Perplexity", url: `https://www.perplexity.ai/search?q=${PROMPT}`, logo: perplexityLogo },
  { name: "Google AI Mode", url: `https://www.google.com/search?udm=50&q=${PROMPT}`, logo: geminiLogo },
  { name: "Grok", url: `https://grok.com/?q=${PROMPT}`, logo: grokLogo },
];

/** The two banners between the second and third topic sections. */
export function BlogBanners() {
  return (
    <section className="px-6 pt-24 min-[760px]:px-12 min-[760px]:pt-40">
      <div className="mx-auto grid max-w-[1152px] gap-6 min-[1100px]:grid-cols-2">
        <Link
          to="/tools/13-week-cash-flow-template"
          className={cn(
            "relative flex flex-col justify-between gap-10 overflow-hidden rounded-[36px] bg-forest p-7 text-forest-foreground min-[760px]:p-11",
            SQUIRCLE,
            FOCUS_RING,
          )}
        >
          <picture aria-hidden className="pointer-events-none absolute inset-0">
            <source media={`(min-width: ${HERO_MESH.switchPx}px)`} srcSet={HERO_MESH.wide} />
            <img src={HERO_MESH.narrow} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-[.22] invert" />
          </picture>
          <div className="relative flex flex-col gap-2">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Free 13-week cash flow template</h2>
            <p className="max-w-[420px] text-[15px] leading-[1.5] text-[#C9D6CF]">
              An XLSX file with the layout and formulas in place. Opens in Excel, Google Sheets and Numbers, and needs no email.
            </p>
          </div>
          <span
            className={cn(
              "relative inline-flex h-[46px] items-center gap-2 self-start rounded-full bg-primary px-[22px] text-[15px] font-semibold text-primary-foreground",
              SQUIRCLE,
            )}
          >
            Get the template →
          </span>
        </Link>

        <div className={cn("flex flex-col justify-between gap-10 rounded-[36px] bg-[#F6EBD0] p-7 min-[760px]:p-11", SQUIRCLE)}>
          <div className="flex flex-col gap-2">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">Not sure where to start?</h2>
            <p className="max-w-[420px] text-[15px] leading-[1.5] text-muted-foreground">
              Ask your AI assistant. It opens with a prompt that asks about your situation and points you to the right guide.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Ask an AI assistant">
            {ASSISTANTS.map((ai) => (
              <li key={ai.name}>
                <a
                  href={ai.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex h-[42px] items-center gap-2 rounded-full border border-border bg-card pl-3 pr-3.5 text-[13.5px] font-medium text-foreground transition-colors duration-200 hover:border-foreground",
                    SQUIRCLE,
                    FOCUS_RING,
                  )}
                >
                  <img src={ai.logo} alt="" width={15} height={15} className="h-[15px] w-[15px] object-contain" />
                  <span>{ai.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
