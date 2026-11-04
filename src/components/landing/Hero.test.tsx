import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";
import Hero from "./Hero";
import { TALK_TO_US_URL, trialUrlFor } from "@/lib/constants";

const render = () =>
  renderToStaticMarkup(
    <HelmetProvider>
      <Hero />
    </HelmetProvider>,
  );

const text = (html: string) => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

describe("homepage hero (handoff 18-hero-v2)", () => {
  it("uses the handoff copy verbatim, with the category phrase in the subhead", () => {
    const markup = render();
    expect(markup).toContain(
      "Zensus is cash flow forecasting software that connects your bank, QuickBooks, and HubSpot to project the month your cash runs out.",
    );
    expect(text(markup)).toContain("14-day free trial, cancel anytime. No charge until it ends.");
    expect(text(markup)).toContain("90-day free trial or more available. Talk to us to arrange it.");
  });

  // Tag-stripping extractors once read a doubled headline (an aria-hidden
  // clone for a halo effect), so guard that the H1 text appears once.
  it("renders the H1 text exactly once, and only one H1", () => {
    const markup = render();
    expect(markup.match(/<h1[\s>]/g)).toHaveLength(1);
    const h1 = markup.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? "";
    expect(text(h1)).toBe("See every week of cash before it happens.");
    expect(markup.match(/See every week of cash before it happens\./g)).toHaveLength(1);
  });

  it("drops the kicker and has no video", () => {
    const markup = render();
    expect(markup).not.toContain("Cash flow forecasting for businesses with unpredictable revenue.");
    expect(markup).not.toContain("<video");
  });

  // The email field replaces the handoff's Start and Talk to us buttons
  // (restored 4 Nov 2026): it is how the homepage saves leads in Apollo.
  it("asks for an email, then shows the trial lines", () => {
    const markup = render();
    expect(markup).toMatch(/<input[^>]*type="email"/);
    expect(markup).toContain(">Email address</label>");
    // The button shows "See" at rest and opens on hover, but the whole label
    // is in the HTML, so its accessible name is the full sentence.
    const button = markup.match(/<button[^>]*type="submit"[\s\S]*?<\/button>/)?.[0] ?? "";
    expect(text(button)).toBe("See my projection");
    const h1 = markup.indexOf("<h1");
    const field = markup.indexOf('type="email"');
    const trial = markup.indexOf("14-day free trial");
    expect(h1).toBeGreaterThan(-1);
    expect(h1).toBeLessThan(field);
    expect(field).toBeLessThan(trial);
  });

  it("sends the trial line's Talk to us to the booking page", () => {
    const markup = render();
    const links = [...markup.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(?:(?!<\/a>)[\s\S])*Talk to us/g)].map((m) => m[1]);
    expect(links).toEqual([TALK_TO_US_URL]);
  });

  it("sends the address to the app login with the subscribe redirect", () => {
    const url = new URL(trialUrlFor("owner+cash@example.com"));
    expect(url.origin + url.pathname).toBe("https://app.zensus.app/login");
    expect(url.searchParams.get("email")).toBe("owner+cash@example.com");
    expect(url.searchParams.get("redirect")).toBe("/subscribe");
  });
});

describe("hero Cash flow card", () => {
  it("is one labelled image built from text and SVG, with no <img>", () => {
    const markup = render();
    const card = markup.match(/<div role="img"[\s\S]*$/)?.[0] ?? "";
    expect(markup).toMatch(/<div role="img" aria-label="Example weekly cash flow forecast[^"]+"/);
    expect(card).not.toContain("<img");
    expect(card).toContain("<svg");
    expect(text(card)).toContain("Halvorsen Logistics annual invoice");
    expect(text(card)).toContain("$371,300");
  });

  it("carries 26 weekly bars, 13 of them for phones", () => {
    const markup = render();
    const bars: string[] = markup.match(/class="hero-bar[^"]*"/g) ?? [];
    expect(bars).toHaveLength(26);
    expect(bars.filter((b) => b.includes("max-[759px]:hidden"))).toHaveLength(13);
  });
});
