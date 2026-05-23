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
  url: "https://zensus.app/",
};

const ORGANIZATION_ID = "https://zensus.app/#organization";
const FOUNDER_PERSON_ID = "https://zensus.app/about#ajin-sunny";

const BLOG_ID = "https://zensus.app/blog#blog";

export interface BlogPostingSchemaInput {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
  image: string;
  articleSection: string;
}

/** BlogPosting JSON-LD for /blog/<slug> — preferred over generic Article for blog URLs. */
export const blogPostingSchema = ({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image,
  articleSection,
}: BlogPostingSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `${url}#blogpost`,
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image: [image],
  articleSection,
  author: { "@id": FOUNDER_PERSON_ID },
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: "en-US",
  isPartOf: {
    "@type": "Blog",
    "@id": BLOG_ID,
    name: "Zensus Blog",
    url: "https://zensus.app/blog",
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
