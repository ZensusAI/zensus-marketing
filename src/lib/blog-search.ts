import { getTopic, type BlogPostMeta } from "@/lib/blog";

/*
 * Blog index search. A query matches a post when every meaningful word in it
 * appears somewhere in the post: the title, slug, tags, topic, description,
 * FAQs, or the article body. Words match on their start, so "founder" finds
 * "founders" and "13-week" finds "13 week"; a word of one or two letters
 * ("AP", "13") has to match whole, or it would match the start of hundreds of
 * words. Results rank by where the words matched, title first.
 *
 * The body text is not in the app bundle. scripts/generate-blog-stats.mjs
 * writes each post's distinct body words to public/blog-search.json, and the
 * index fetches it on the first search. Until it arrives, matching runs on
 * the metadata alone.
 */

export type BlogBodyIndex = Record<string, string>;

export const BODY_INDEX_PATH = "/blog-search.json";

// Joining words that rarely decide a match. "ARR vs Cash for Founders" should
// find the ARR post whether or not the title says "for" or "vs".
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "can", "do", "does", "for", "how", "i", "in", "is", "it", "my", "of",
  "on", "or", "the", "to", "versus", "vs", "what", "when", "why", "with", "you", "your",
]);

/** Lowercase, drop accents and punctuation, collapse spaces. */
export function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** The words a post must contain. Stop words drop out unless nothing else is left. */
export function queryTerms(query: string): string[] {
  const words = [...new Set(normalize(query).split(" ").filter(Boolean))];
  const meaningful = words.filter((w) => !STOP_WORDS.has(w));
  return meaningful.length ? meaningful : words;
}

interface Field {
  text: string;
  weight: number;
}

function fields(post: BlogPostMeta, body: string | undefined): Field[] {
  const pad = (s: string) => ` ${normalize(s)} `;
  return [
    { text: pad([post.title, post.ogTitle, post.seoTitle].filter(Boolean).join(" ")), weight: 10 },
    { text: pad(post.slug), weight: 6 },
    { text: pad([...(post.tags ?? []), getTopic(post.topic)?.name ?? ""].join(" ")), weight: 5 },
    { text: pad(post.description), weight: 4 },
    { text: pad((post.faqs ?? []).map((f) => `${f.question} ${f.answer}`).join(" ")), weight: 2 },
    ...(body ? [{ text: ` ${body} `, weight: 1 }] : []),
  ];
}

/** Score one post, or 0 when some term is missing from all of its fields. */
export function scorePost(post: BlogPostMeta, terms: string[], phrase: string, body?: string): number {
  if (!terms.length) return 0;
  const fs = fields(post, body);
  let score = 0;
  for (const term of terms) {
    const needle = term.length <= 2 ? ` ${term} ` : ` ${term}`;
    const best = Math.max(0, ...fs.filter((f) => f.text.includes(needle)).map((f) => f.weight));
    if (!best) return 0;
    score += best;
  }
  // The whole query as typed, inside the title, outranks scattered words.
  if (phrase && fs[0].text.includes(` ${phrase} `)) score += 20;
  return score;
}

/** Posts matching every term, best match first, newest first on a tie. */
export function searchPosts(posts: BlogPostMeta[], query: string, bodyIndex?: BlogBodyIndex): BlogPostMeta[] {
  const terms = queryTerms(query);
  const phrase = normalize(query);
  return posts
    .map((post) => ({ post, score: scorePost(post, terms, phrase, bodyIndex?.[post.slug]) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .map((r) => r.post);
}

let bodyIndexRequest: Promise<BlogBodyIndex | undefined> | undefined;

/** Fetch the body index once per page load; resolves undefined if it fails. */
export function loadBodyIndex(): Promise<BlogBodyIndex | undefined> {
  bodyIndexRequest ??= fetch(BODY_INDEX_PATH)
    .then((res) => (res.ok ? (res.json() as Promise<BlogBodyIndex>) : undefined))
    .catch(() => undefined);
  return bodyIndexRequest;
}
