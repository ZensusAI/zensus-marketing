import type { ComponentType } from "react";

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogPostMeta {
  title: string;
  /** Document title for SERPs when meta.title is long; defaults to title + brand. */
  seoTitle?: string;
  description: string;
  date: string;
  dateModified?: string;
  category: string;
  readTime: string;
  slug: string;
  ogImage: string;
  /** Shorter headline for OG/Twitter cards when the page title is long. */
  ogTitle?: string;
  ogSubtitle?: string;
  /** Optional FAQ block for FAQPage JSON-LD (targets People Also Ask). */
  faqs?: BlogFaqItem[];
  /** Topic tags surfaced in the card and used by the index tag filter. */
  tags?: string[];
  /** When true, the post is highlighted as a featured/lead card. */
  featured?: boolean;
  /** Card and hero image path (public/ relative or absolute). */
  thumbnail?: string;
  /** Author key into the authors map; defaults to the site's default author. */
  author?: string;
}

export interface BlogPostModule {
  default: ComponentType;
  meta: BlogPostMeta;
}

const postModules = import.meta.glob<BlogPostModule>("../content/blog/*.mdx", {
  eager: true,
});

function moduleSlug(path: string): string {
  const match = path.match(/\/([^/]+)\.mdx$/);
  return match?.[1] ?? "";
}

export function getAllPosts(): BlogPostMeta[] {
  return Object.entries(postModules)
    .map(([, mod]) => mod.meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): {
  meta: BlogPostMeta;
  Content: ComponentType;
} | null {
  const entry = Object.entries(postModules).find(
    ([path]) => moduleSlug(path) === slug,
  );
  if (!entry) return null;
  const [, mod] = entry;
  return { meta: mod.meta, Content: mod.default };
}

export function getAllPostSlugs(): string[] {
  return Object.keys(postModules).map(moduleSlug);
}

export function formatPostDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function postUrl(slug: string): string {
  return `https://zensus.app/blog/${slug}`;
}
