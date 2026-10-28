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
  /** What the cover shows, for its alt text; defaults to the title. Name the
      entities in it, since alt is what AI engines index for the image. */
  thumbnailAlt?: string;
  /** Author key into the authors map; defaults to the site's default author. */
  author?: string;
}

/*
 * The blog's five topics, in the order the index shows them (handoff
 * 15-blog). Each post sets exactly one in its meta, and each topic has its
 * own page at /blog/topic/<id> (topicPath below), so an id never changes
 * once published. `description` is the one line the index menu and cards
 * use; `seoTitle`, `metaDescription` and `intro` belong to the topic page.
 * scripts/blog-topics.mjs repeats the ids and names for the build scripts,
 * and blog-topics.test.ts keeps the two in step.
 */
export const BLOG_TOPICS = [
  {
    id: "runway-and-burn",
    name: "Runway and burn",
    description: "How long the cash lasts, and the numbers investors check.",
    seoTitle: "Runway and Burn Rate Guides | Zensus",
    metaDescription:
      "Guides on cash runway, burn rate, burn multiple and the zero-cash date: how long your cash lasts, how to work it out weekly, and what investors check.",
    intro:
      "Runway is how long your cash lasts at the current burn rate. These guides cover how to calculate runway and net burn, why a weekly zero-cash date is more reliable than a count of months, how burn multiple and default alive are worked out, and how to forecast costs that grow with usage, such as AI compute.",
  },
  {
    id: "payroll",
    name: "Payroll",
    description: "Making every payroll run, including the years with 27.",
    seoTitle: "Payroll Cash Planning Guides | Zensus",
    metaDescription:
      "Guides on making payroll: how to know weeks ahead that a run will clear, which years have 27 biweekly pay periods, and what to do if you might miss one.",
    intro:
      "Payroll is usually the largest payment a business makes, and the one that cannot be late. These guides show how to project cash to each payroll date, which years have 27 biweekly pay periods instead of 26, and what happens, legally and practically, when a payroll run is missed.",
  },
  {
    id: "13-week-forecasting",
    name: "13-week forecasting",
    description: "Building and running a weekly cash forecast.",
    seoTitle: "13-Week Cash Flow Forecasting Guides | Zensus",
    metaDescription:
      "Guides on cash flow forecasting and the 13-week cash flow forecast: what it is, how to build one in Excel, and how to see a cash shortfall before it happens.",
    intro:
      "A 13-week cash flow forecast projects cash in and cash out week by week for the quarter ahead. These guides explain cash flow forecasting from the basics, walk through building a 13-week forecast in Excel with a free template, and show how dating each payment by when it really arrives reveals a shortfall weeks in advance.",
  },
  {
    id: "working-capital",
    name: "Working capital",
    description: "Where cash waits between the invoice and the bank.",
    seoTitle: "Working Capital and Cash Timing Guides | Zensus",
    metaDescription:
      "Guides on working capital and cash timing: the cash conversion cycle, why ARR and cash differ, and how to forecast cash when clients pay late.",
    intro:
      "Working capital is the cash tied up between doing the work and getting paid for it. These guides explain the cash conversion cycle (DSO, DIO and DPO), why annual recurring revenue and the bank balance tell different stories, and how agencies and service businesses forecast cash when clients pay on 30 to 60 day terms.",
  },
  {
    id: "tools-and-integrations",
    name: "Tools and integrations",
    description: "What QuickBooks, HubSpot and AI tools can and can't forecast.",
    seoTitle: "Cash Flow Tools and Integrations Guides | Zensus",
    metaDescription:
      "Guides on cash flow forecasting tools: what QuickBooks can and cannot forecast, turning HubSpot data into a cash forecast, and MCP vs CLI for finance teams.",
    intro:
      "Most of the data a cash flow forecast needs already sits in a bank account, an accounting system and a CRM. These guides cover what the QuickBooks Online Cash Flow Planner does and where it stops, how to turn HubSpot invoices and subscriptions into a cash forecast, and how finance teams connect AI assistants to their data through MCP servers or command-line tools.",
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

/** Site-relative path of a topic's page, for links. */
export function topicPath(id: BlogTopicId): string {
  return `/blog/topic/${id}`;
}

/** Absolute URL of a topic's page, for canonical and structured data. */
export function topicUrl(id: BlogTopicId): string {
  return `${SITE_URL}${topicPath(id)}`;
}

export interface Crumb {
  name: string;
  url: string;
}

const BLOG_TRAIL: Crumb[] = [
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Blog", url: `${SITE_URL}/blog` },
];

/** A topic page's breadcrumb trail: Home, Blog, the topic. */
export function topicBreadcrumbs(topic: BlogTopic): Crumb[] {
  return [...BLOG_TRAIL, { name: topic.name, url: topicUrl(topic.id) }];
}

/**
 * A post's breadcrumb trail: Home, Blog, its topic, the post. The page shows
 * it and emits it as BreadcrumbList JSON-LD from this one list, so the
 * visible trail and the markup cannot drift apart. Every step is a canonical,
 * prerendered page; Google asks for "a typical user path to a page", and
 * readers reach a post through its topic. The post is named by its short
 * ogTitle, the form a search result's breadcrumb line can show.
 */
export function postBreadcrumbs(meta: Pick<BlogPostMeta, "slug" | "title" | "ogTitle" | "topic">): Crumb[] {
  const topic = getTopic(meta.topic);
  return [...(topic ? topicBreadcrumbs(topic) : BLOG_TRAIL), { name: meta.ogTitle ?? meta.title, url: postUrl(meta.slug) }];
}
