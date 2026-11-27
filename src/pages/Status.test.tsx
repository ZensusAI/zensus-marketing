import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { StatusView, TRY_AGAIN_URL } from "./Status";
import { STATUS, type StatusState } from "@/config/status";
import { SUPPORT_EMAIL } from "@/lib/constants";

const UPDATED = "2026-11-27T15:30:00Z";
const render = (state: StatusState) =>
  renderToStaticMarkup(
    <HelmetProvider>
      <StatusView status={{ state, message: `msg-${state}`, updatedAt: UPDATED }} />
    </HelmetProvider>,
  );

const HEADINGS: Record<StatusState, string> = {
  outage: "We&#x27;re experiencing an issue",
  degraded: "Some things are running slowly",
  maintenance: "Scheduled maintenance",
  operational: "Everything is running normally",
};

describe("/status page", () => {
  for (const state of Object.keys(HEADINGS) as StatusState[]) {
    it(`renders the ${state} state`, () => {
      const html = render(state);
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
      expect(html).toContain(HEADINGS[state]);
      if (state === "operational") {
        expect(html).not.toContain(`msg-${state}`);
        expect(html).toContain("All Zensus services are running normally.");
      } else {
        expect(html).toContain(`msg-${state}`);
      }
      expect(html).toMatch(/<[^>]*role="status"/);
      expect(html).toContain("Last updated:");
      expect(html).toContain('dateTime="2026-11-27T15:30:00Z"');
      expect(html).toContain("November 27, 2026");
      expect(html).toContain(`href="mailto:${SUPPORT_EMAIL}"`);
      const link = html.match(/<a[^>]*href="([^"]*from=status[^"]*)"/)?.[1];
      expect(link).toBe(TRY_AGAIN_URL);
    });
  }

  it("points Try again at the app with from=status", () => {
    expect(TRY_AGAIN_URL).toBe("https://app.zensus.finance/?from=status");
    expect(render("outage")).toContain(">Try again<");
  });

  it("ships the calm default outage copy", () => {
    expect(STATUS.state).toBe("outage");
    expect(STATUS.message).toContain("Your data is safe");
    expect(STATUS.message).not.toMatch(/ETA|cause|because/i);
    expect(Number.isNaN(Date.parse(STATUS.updatedAt))).toBe(false);
  });

  it("makes no network calls to Zensus services", () => {
    const src = ["../pages/Status.tsx", "../config/status.ts"]
      .map((f) => readFileSync(new URL(f, import.meta.url), "utf-8"))
      .join("\n");
    expect(src).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|axios|supabase|useQuery|api\.zensus/);
  });
});
