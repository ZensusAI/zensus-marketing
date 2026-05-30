/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Google One Tap sign-in (ZEN-365). All optional: when absent the Supabase
  // client is null and One Tap renders nothing (build-first, wire config later).
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_APP_URL?: string;
}

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
