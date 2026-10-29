import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getAllPosts, type BlogPostMeta } from "@/lib/blog";
import { normalize, queryTerms, searchPosts, type BlogBodyIndex } from "@/lib/blog-search";
import { bodyWords, normalizeText } from "../../scripts/blog-search-text.mjs";

const posts = getAllPosts();
const bodyIndex: BlogBodyIndex = JSON.parse(
  readFileSync(join(__dirname, "..", "..", "public", "blog-search.json"), "utf-8"),
);
const top = (q: string, body?: BlogBodyIndex) => searchPosts(posts, q, body)[0]?.slug;

const fake = (slug: string, title: string, date = "2026-01-01"): BlogPostMeta => ({
  title,
  description: "",
  date,
  category: "Guide",
  readTime: "1 min read",
  slug,
  ogImage: "",
  topic: "payroll",
});

describe("blog search matching", () => {
  it("normalizes punctuation, case and hyphens", () => {
    expect(normalize("ARR vs. Cash: 13-Week")).toBe("arr vs cash 13 week");
  });

  it("normalizes the same way as the body index builder", () => {
    for (const s of ["ARR vs. Cash: 13-Week", "Café P&L – $120K…", "  Payroll\ttaxes (biweekly) "]) {
      expect(normalizeText(s)).toBe(normalize(s));
    }
  });

  it("drops joining words unless nothing else is left", () => {
    expect(queryTerms("ARR vs Cash for Founders")).toEqual(["arr", "cash", "founders"]);
    expect(queryTerms("how to")).toEqual(["how", "to"]);
  });

  it("needs every term, matching the start of a word", () => {
    const a = fake("a", "Payroll for founders");
    const b = fake("b", "Payroll calendar");
    expect(searchPosts([a, b], "founder payroll").map((p) => p.slug)).toEqual(["a"]);
    expect(searchPosts([a, b], "ounder")).toEqual([]);
  });

  it("matches one- and two-letter words only whole", () => {
    const whole = fake("whole", "AP aging explained");
    const prefix = fake("prefix", "A new approach to aging");
    expect(searchPosts([whole, prefix], "AP aging").map((p) => p.slug)).toEqual(["whole"]);
  });

  it("ranks a title match above a body-only match, then newer first", () => {
    const titled = fake("titled", "Runway basics", "2026-01-01");
    const bodyOld = fake("body-old", "Cash notes", "2026-02-01");
    const bodyNew = fake("body-new", "More cash notes", "2026-03-01");
    const body = { "body-old": "runway", "body-new": "runway" };
    expect(searchPosts([bodyOld, titled, bodyNew], "runway", body).map((p) => p.slug)).toEqual([
      "titled",
      "body-new",
      "body-old",
    ]);
  });
});

describe("blog search on the published guides", () => {
  it("finds a post by words from its title in any order", () => {
    expect(top("ARR vs Cash for Founders")).toBe("arr-vs-cash-for-founders");
    expect(top("cash arr")).toBe("arr-vs-cash-for-founders");
    expect(top("13-week excel")).toBe("how-to-build-a-13-week-cash-flow-forecast-in-excel");
  });

  // Captions and alt text are covered by the builder fixture below, which
  // does not break when a post's images change.
  it("finds words that appear only in the article", () => {
    expect(searchPosts(posts, "aging", bodyIndex).map((p) => p.slug)).toContain(
      "how-to-build-a-13-week-cash-flow-forecast-in-excel",
    );
  });

  it("returns nothing when a word appears nowhere", () => {
    expect(searchPosts(posts, "arr zzqx", bodyIndex)).toEqual([]);
  });

  it("indexes every post's body", () => {
    expect(Object.keys(bodyIndex).sort()).toEqual(posts.map((p) => p.slug).sort());
  });
});

describe("body index builder", () => {
  const source = `export const meta = {
  title: 'Meta only title',
};

import { BlogTable } from '@/components/blog/BlogTable';

<p className="text-lg leading-relaxed">Opening line about payroll.</p>

<BlogFigure
  src="/blog/x/chart.webp"
  width={1600}
  height={900}
  alt="Chart of a $120K prepay"
  caption="Cash lands in January."
/>

<BlogTable
  caption="Weekly closing cash."
  columns={['Week', 'Closing']}
  rows={[
    ['7', <strong>$23,500</strong>],
    ['Payroll', <>See the <a href="/tools/payroll-calendar">calendar</a></>],
  ]}
  numeric={[1]}
  negativeRows={[0]}
/>

Read [the guide](https://example.com/guide-url) today.`;
  const words = bodyWords(source);

  it("keeps paragraphs, captions, alt text and table cells", () => {
    for (const w of ["opening", "payroll", "120k", "prepay", "january", "weekly", "closing", "23", "500", "calendar", "guide", "today"]) {
      expect(words).toContain(w);
    }
  });

  it("drops markup, attribute values, imports and the meta block", () => {
    for (const w of ["classname", "leading", "relaxed", "webp", "1600", "blogfigure", "blogtable", "strong", "href", "tools", "numeric", "negativerows", "https", "example", "meta", "import"]) {
      expect(words).not.toContain(w);
    }
  });
});

describe("loadBodyIndex", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("retries after a failed request and then caches the result", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ a: "payroll" }) });
    vi.stubGlobal("fetch", fetchMock);
    const { loadBodyIndex } = await import("@/lib/blog-search");
    expect(await loadBodyIndex()).toBeUndefined();
    expect(await loadBodyIndex()).toEqual({ a: "payroll" });
    expect(await loadBodyIndex()).toEqual({ a: "payroll" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
