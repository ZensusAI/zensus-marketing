import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { ArrowLeft, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { blogMdxComponents } from "@/mdx-components";
import { BlogPostFaq } from "@/components/blog/BlogPostFaq";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  formatPostDate,
  getPostBySlug,
  postUrl,
} from "@/lib/blog";
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqPageSchema,
  HOME_CRUMB,
} from "@/lib/structured-data";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="section-container py-32 text-center">
          <h1 className="text-2xl font-semibold">Post not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
            Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const { meta, Content } = post;
  const pageUrl = postUrl(meta.slug);
  const published = meta.dateModified ?? meta.date;

  const breadcrumbs = breadcrumbSchema([
    HOME_CRUMB,
    { name: "Blog", url: "https://zensus.app/blog" },
    { name: meta.title, url: pageUrl },
  ]);

  const documentTitle = meta.seoTitle ?? `${meta.title} | Zensus`;

  const blogPostingLd = blogPostingSchema({
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: published,
    url: pageUrl,
    image: meta.ogImage,
    articleSection: meta.category,
  });

  const faqLd = meta.faqs?.length ? faqPageSchema(meta.faqs) : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{documentTitle}</title>
        <meta name="description" content={meta.description} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content={meta.ogTitle ?? meta.title} />
        <meta
          property="og:description"
          content={meta.ogSubtitle ?? meta.description}
        />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${meta.title} — Zensus Blog`} />
        <meta property="article:published_time" content={meta.date} />
        <meta property="article:modified_time" content={published} />
        <meta property="article:section" content={meta.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.ogTitle ?? meta.title} />
        <meta
          name="twitter:description"
          content={meta.ogSubtitle ?? meta.description}
        />
        <meta name="twitter:image" content={meta.ogImage} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        <script type="application/ld+json">{JSON.stringify(blogPostingLd)}</script>
        {faqLd ? (
          <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
        ) : null}
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="section-container max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          <header className="mt-8 border-b border-border pb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {meta.category}
            </span>
            <h1
              id="blog-article-title"
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {meta.title}
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {meta.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
              <span className="flex items-center gap-1">
                <Clock size={14} aria-hidden />
                {meta.readTime}
              </span>
            </div>
          </header>

          <div className="blog-article-body prose prose-invert mt-10 max-w-none prose-headings:text-foreground prose-p:text-foreground/85 prose-li:text-foreground/85 prose-a:text-primary [&_figure>div]:overflow-hidden [&_figure>div]:rounded-2xl">
            <MDXProvider components={blogMdxComponents}>
              <Content />
            </MDXProvider>
          </div>

          {meta.faqs?.length ? <BlogPostFaq items={meta.faqs} /> : null}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
