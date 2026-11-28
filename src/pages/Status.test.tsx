import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import Status, { StatusView, TRY_AGAIN_URL } from "./Status";
import { STATUS, type StatusState } from "@/config/status";
import { SUPPORT_EMAIL } from "@/lib/constants";

const UPDATED = "2026-11-27T15:30:00Z";
const render = (state: StatusState) =>
  renderToStaticMarkup(
    <HelmetProvider>
      <StatusView status={{ state, message: `msg-${state}`, updatedAt: UPDATED, healthUrl: "" }} />
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

  it("shows the real check time instead of 'Last updated' once health is proven", () => {
    const html = renderToStaticMarkup(
      <HelmetProvider>
        <StatusView
          status={{ state: "operational", message: "x", updatedAt: UPDATED, healthUrl: "" }}
          checkedAt={new Date("2026-11-27T16:00:00Z")}
        />
      </HelmetProvider>,
    );
    expect(html).toContain("Last checked:");
    expect(html).toContain("4:00 PM UTC");
    expect(html).toContain('dateTime="2026-11-27T16:00:00.000Z"');
    expect(html).not.toContain("just now");
    expect(html).not.toContain("Last updated:");
    expect(html).toContain(`href="${TRY_AGAIN_URL}"`);
  });

  it("allows the health API origin in the CSP connect-src", () => {
    const vercel = readFileSync(new URL("../../vercel.json", import.meta.url), "utf-8");
    const csp = vercel.match(/"Content-Security-Policy",\s*"value": "([^"]+)"/)?.[1] ?? "";
    const connect = csp.match(/connect-src ([^;]+)/)?.[1].split(" ") ?? [];
    expect(connect).toContain(new URL(STATUS.healthUrl).origin);
  });

  it("keeps the health URL in config, not in the component", () => {
    expect(STATUS.healthUrl).toBe("https://api.zensus.app/health");
    const page = readFileSync(new URL("./Status.tsx", import.meta.url), "utf-8");
    expect(page).not.toContain("api.zensus");
  });

  it("never auto-upgrades planned maintenance, and skips the check during prerender", () => {
    const hook = readFileSync(new URL("../hooks/use-status-health.ts", import.meta.url), "utf-8");
    expect(hook).toMatch(/state === "outage" \|\| status\.state === "degraded"/);
    expect(hook).not.toContain('"maintenance"');
    expect(hook).toContain("__PRERENDER__");
  });

  // The only network call is the optional health check in status-health.ts,
  // against the URL in config. Nothing else may reach a Zensus service.
  it("makes no network calls except the health check", () => {
    const src = ["../pages/Status.tsx", "../hooks/use-status-health.ts", "../config/status.ts"]
      .map((f) => readFileSync(new URL(f, import.meta.url), "utf-8"))
      .join("\n");
    expect(src).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|axios|supabase|useQuery/);
    const lib = readFileSync(new URL("../lib/status-health.ts", import.meta.url), "utf-8");
    expect(lib.match(/fetchImpl\(/g)).toHaveLength(1);
    expect(lib).not.toMatch(/supabase|axios|XMLHttpRequest/);
  });

  it("emits a robots noindex tag and is not linked from the /sitemap page", () => {
    const context: { helmet?: HelmetServerState } = {};
    renderToStaticMarkup(
      <HelmetProvider context={context}>
        <MemoryRouter>
          <Status />
        </MemoryRouter>
      </HelmetProvider>,
    );
    const robots = context.helmet?.meta.toString() ?? "";
    expect(robots).toContain('name="robots"');
    expect(robots).toContain('content="noindex"');
    const sitemapPage = readFileSync(new URL("./Sitemap.tsx", import.meta.url), "utf-8");
    expect(sitemapPage).not.toContain('"/status"');
  });
});
