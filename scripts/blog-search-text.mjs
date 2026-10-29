// Body words for the blog index search (src/lib/blog-search.ts), read from a
// post's MDX source. generate-blog-stats.mjs writes them to
// public/blog-search.json; blog-search.test.ts checks this file and the
// app's normalize() agree.

/** Lowercase, drop accents and punctuation, collapse spaces. Mirrors normalize() in src/lib/blog-search.ts. */
export function normalizeText(text) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Attribute values that are never reading text: classes, URLs, sizes, and
// BlogTable column indexes. A value is "...", '...', or {...} one level deep.
const NON_TEXT_ATTRS =
  /\b(?:className|href|src|id|width|height|numeric|nowrap|negativeRows|positiveRows|target|rel)=(?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^{}]*\})*\})/g;

/**
 * The distinct words a reader sees in a post: paragraphs, headings, lists,
 * table cells, captions and image alt text. Only markup is removed (tag
 * names, brackets, prop names and the attributes above), so text inside a
 * component's props, like a BlogTable row or a BlogFigure caption, stays.
 */
export function bodyWords(source) {
  const text = source
    .replace(/^import\s.*$/gm, " ")
    .replace(/export const meta = \{[\s\S]*?\n\};?/, " ")
    .replace(NON_TEXT_ATTRS, " ")
    .replace(/\]\([^)]*\)/g, " ")
    .replace(/<\/?[A-Za-z][\w.]*|\/?>|<\/?>/g, " ")
    .replace(/\b[A-Za-z][\w-]*=/g, " ");
  return [...new Set(normalizeText(text).split(" ").filter(Boolean))];
}
