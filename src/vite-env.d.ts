/// <reference types="vite/client" />

interface BlogFaqItem {
  question: string;
  answer: string;
}

interface BlogPostMeta {
  title: string;
  seoTitle?: string;
  description: string;
  date: string;
  dateModified?: string;
  category: string;
  readTime: string;
  slug: string;
  ogImage: string;
  ogTitle?: string;
  ogSubtitle?: string;
  faqs?: BlogFaqItem[];
}

declare module "*.mdx" {
  import type { FC } from "react";
  export const meta: BlogPostMeta;
  const MDXComponent: FC;
  export default MDXComponent;
}
