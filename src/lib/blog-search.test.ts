import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getAllPosts } from "@/lib/blog";
import { normalize, queryTerms, searchPosts, type BlogBodyIndex } from "@/lib/blog-search";

const posts = getAllPosts();
const bodyIndex: BlogBodyIndex = JSON.parse(
  readFileSync(join(__dirname, "..", "..", "public", "blog-search.json"), "utf-8"),
);
const top = (q: string, body?: BlogBodyIndex) => searchPosts(posts, q, body)[0]?.slug;

describe("blog search", () => {
  it("normalizes punctuation, case and hyphens", () => {
    expect(normalize("ARR vs. Cash: 13-Week")).toBe("arr vs cash 13 week");
  });

  it("drops joining words unless nothing else is left", () => {
    expect(queryTerms("ARR vs Cash for Founders")).toEqual(["arr", "cash", "founders"]);
    expect(queryTerms("how to")).toEqual(["how", "to"]);
  });

  it("finds a post by words from its title in any order", () => {
    expect(top("ARR vs Cash for Founders")).toBe("arr-vs-cash-for-founders");
    expect(top("cash arr")).toBe("arr-vs-cash-for-founders");
    expect(top("13-week excel")).toBe("how-to-build-a-13-week-cash-flow-forecast-in-excel");
  });

  it("matches the start of a word", () => {
    expect(searchPosts(posts, "founder").map((p) => p.slug)).toContain("arr-vs-cash-for-founders");
  });

  it("finds words that appear only in the article body once the index loads", () => {
    const word = "aging";
    const metaOnly = searchPosts(posts, word).map((p) => p.slug);
    const withBody = searchPosts(posts, word, bodyIndex).map((p) => p.slug);
    expect(withBody).toContain("how-to-build-a-13-week-cash-flow-forecast-in-excel");
    expect(withBody.length).toBeGreaterThan(metaOnly.length);
  });

  it("ranks a title match above a body-only match", () => {
    const results = searchPosts(posts, "payroll", bodyIndex);
    const firstBodyOnly = results.findIndex((p) => !normalize(p.title).includes("payroll"));
    const lastTitled = results.map((p) => normalize(p.title).includes("payroll")).lastIndexOf(true);
    expect(lastTitled).toBeGreaterThanOrEqual(0);
    expect(firstBodyOnly === -1 || lastTitled < firstBodyOnly).toBe(true);
  });

  it("matches one- and two-letter words only as whole words", () => {
    const ap = searchPosts(posts, "AP aging", bodyIndex).map((p) => p.slug);
    expect(ap).toContain("how-to-build-a-13-week-cash-flow-forecast-in-excel");
    expect(ap.every((slug) => ` ${bodyIndex[slug]} `.includes(" ap "))).toBe(true);
  });

  it("returns nothing when a word appears nowhere", () => {
    expect(searchPosts(posts, "arr zzqx", bodyIndex)).toEqual([]);
  });

  it("indexes every post's body", () => {
    expect(Object.keys(bodyIndex).sort()).toEqual(posts.map((p) => p.slug).sort());
  });
});
