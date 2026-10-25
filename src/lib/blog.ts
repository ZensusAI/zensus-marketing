import { SITE_URL } from "@/lib/constants";
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
  /** Site-relative path, e.g. /og/blog/slug.png. Resolved against SITE_URL at render. */
  ogImage: string;
  /** Shorter headline for OG/Twitter cards when the page title is long. */
  ogTitle?: string;
  ogSubtitle?: string;
  /** Optional FAQ block for FAQPage JSON-LD (targets People Also Ask). */
  faqs?: BlogFaqItem[];
  /** The post's one topic on the blog index (BLOG_TOPICS below). */
  topic: BlogTopicId;
  /** Keywords: the post page shows them and emits them as BlogPosting keywords,
   *  and they feed BlogPosting keywords. The index and "Keep reading" use `topic`. */
  tags?: string[];
  /** When true, the post is highlighted as a featured/lead card. */
  featured?: boolean;
  /** Card and hero image path (public/ relative or absolute). */
  thumbnail?: string;
  /** Author key into the authors map; defaults to the site's default author. */
  author?: string;
}

/*
 * The blog index's five topics, in the order the index shows them (handoff
 * 15-blog). Each post sets exactly one in its meta. The id is what
 * /blog?topic= carries, so an id never changes once published.
 */
export const BLOG_TOPICS = [
  { id: "runway-and-burn", name: "Runway and burn", description: "How long the cash lasts, and the numbers investors check." },
  { id: "payroll", name: "Payroll", description: "Making every payroll run, including the years with 27." },
  { id: "13-week-forecasting", name: "13-week forecasting", description: "Building and running a weekly cash forecast." },
  { id: "working-capital", name: "Working capital", description: "Where cash waits between the invoice and the bank." },
  {
    id: "tools-and-integrations",
    name: "Tools and integrations",
    description: "What QuickBooks, HubSpot and AI tools can and can't forecast.",
  },
] as const;

export type BlogTopicId = (typeof BLOG_TOPICS)[number]["id"];
export type BlogTopic = (typeof BLOG_TOPICS)[number];

export function getTopic(id: string | null | undefined): BlogTopic | undefined {
  return BLOG_TOPICS.find((t) => t.id === id);
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
  return `${SITE_URL}/blog/${slug}`;
}

/**
 * A post's breadcrumb trail: Home, Blog, the post. The page shows it and
 * emits it as BreadcrumbList JSON-LD from this one list, so the visible
 * trail and the markup cannot drift apart. Every step is a canonical,
 * prerendered URL; the topic is not a step, because /blog?topic= is a filter
 * of /blog (it canonicalizes there), not a page of its own. The post is named
 * by its short ogTitle, the form a search result's breadcrumb line can show.
 */
export function postBreadcrumbs(meta: Pick<BlogPostMeta, "slug" | "title" | "ogTitle">) {
  return [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: meta.ogTitle ?? meta.title, url: postUrl(meta.slug) },
  ];
}
