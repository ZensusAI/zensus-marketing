// Blog slugs derived from src/content/blog/*.mdx filenames.
// Shared by prerender, sitemap generation, and OG generation.

import { readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = join(__dirname, "..", "src", "content", "blog");

export async function getBlogSlugs() {
  const files = await readdir(blogDir);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

export async function getBlogRoutes() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => `/blog/${slug}`);
}
