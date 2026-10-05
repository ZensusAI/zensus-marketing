import { SITE_URL } from "@/lib/constants";
// Helpers for building JSON-LD structured-data blocks.
// Keep these compact and typed so page components can drop a single
// <script type="application/ld+json"> into their Helmet block.

export interface BreadcrumbCrumb {
  name: string;
  url: string;
}

export const breadcrumbSchema = (crumbs: BreadcrumbCrumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

export const HOME_CRUMB: BreadcrumbCrumb = {
  name: "Home",
  url: `${SITE_URL}/`,
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const BLOG_ID = `${SITE_URL}/blog#blog`;

/** Subset of an Author (src/lib/authors.ts) needed to emit a Person node. */
export interface SchemaAuthor {
  personId: string;
  name: string;
  jobTitle: string;
  sameAs: string[];
}

export interface BlogPostingSchemaInput {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
  image: string;
  articleSection: string;
  author: SchemaAuthor;
  /** In-article figure URLs appended to the OG image in the image array. */
  images?: string[];
  wordCount?: number;
  keywords?: string[];
}

/** BlogPosting JSON-LD for /blog/<slug>; preferred over generic Article for blog URLs. */
export const blogPostingSchema = ({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image,
  articleSection,
  author,
  images,
  wordCount,
  keywords,
}: BlogPostingSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `${url}#blogpost`,
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image: [image, ...(images ?? []).filter((href) => href !== image)],
  articleSection,
  ...(wordCount ? { wordCount } : {}),
  ...(keywords?.length ? { keywords } : {}),
  author: {
    "@type": "Person",
    "@id": author.personId,
    name: author.name,
    jobTitle: author.jobTitle,
    worksFor: { "@id": ORGANIZATION_ID },
    url: `${SITE_URL}/about`,
    sameAs: author.sameAs,
  },
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: "en-US",
  isPartOf: {
    "@type": "Blog",
    "@id": BLOG_ID,
    name: "Zensus Blog",
    url: `${SITE_URL}/blog`,
    publisher: { "@id": ORGANIZATION_ID },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": url,
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#blog-article-title", "#blog-article-lead"],
  },
});

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqPageSchema = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

export interface WebPageSchemaInput {
  url: string;
  name: string;
  description: string;
  image: string;
  /** ISO date the page's facts were last checked against their sources. */
  lastReviewed?: string;
}

/**
 * WebPage JSON-LD for a page about the product. The site-wide @graph in
 * index.html declares the Organization, WebSite and SoftwareApplication on
 * every route; this ties one page to them, so an engine reading the page knows
 * which site it belongs to and that its subject is Zensus.
 */
export const webPageSchema = ({
  url,
  name,
  description,
  image,
  lastReviewed,
}: WebPageSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${url}#webpage`,
  url,
  name,
  description,
  inLanguage: "en-US",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#software` },
  publisher: { "@id": ORGANIZATION_ID },
  primaryImageOfPage: image,
  ...(lastReviewed ? { lastReviewed } : {}),
});

export interface BlogIndexPost {
  name: string;
  url: string;
  datePublished: string;
}

/** ItemList on /blog so crawlers see published posts in structured form. */
export const blogIndexItemListSchema = (posts: BlogIndexPost[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Zensus Blog",
  itemListElement: posts.map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: post.name,
    url: post.url,
  })),
});
