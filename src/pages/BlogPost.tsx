import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { ArrowLeft, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { blogMdxComponents } from "@/mdx-components";
import { BlogPostFaq } from "@/components/blog/BlogPostFaq";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { MobileToc } from "@/components/blog/MobileToc";
import { ReadMoreSection } from "@/components/blog/ReadMoreSection";
import { FlickeringGrid } from "@/components/blog/FlickeringGrid";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { formatPostDate, getPostBySlug, postUrl } from "@/lib/blog";
import { getAuthor } from "@/lib/authors";
import { blogStats } from "@/generated/blog-stats";
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
          <Link
            to="/blog"
            className="mt-4 inline-block text-primary hover:underline"
          >
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
  const author = getAuthor(meta.author);

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
    author,
    images: blogStats[meta.slug]?.images,
    wordCount: blogStats[meta.slug]?.wordCount,
    keywords: meta.tags,
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
        <meta property="og:image:alt" content={`${meta.title} | Zensus Blog`} />
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

      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 z-0 h-full w-full [mask-image:linear-gradient(to_top,transparent_15%,black_95%)]">
            <FlickeringGrid
              className="absolute inset-0 h-full w-full"
              squareSize={4}
              gridGap={6}
              color="#94A3B8"
              maxOpacity={0.2}
              flickerChance={0.05}
            />
          </div>

          <div className="section-container relative z-10 flex flex-col gap-6 py-12">
            <Link
              to="/blog"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {meta.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex h-6 items-center rounded-md border border-border bg-muted/40 px-2 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {meta.category}
              </span>
              <time dateTime={meta.date} className="font-medium">
                {formatPostDate(meta.date)}
              </time>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} aria-hidden />
                {meta.readTime}
              </span>
            </div>

            <h1
              id="blog-article-title"
              className="text-4xl font-medium tracking-tighter text-balance md:text-5xl lg:text-6xl"
            >
              {meta.title}
            </h1>

            <p className="max-w-3xl text-base text-muted-foreground md:text-lg md:text-balance">
              {meta.description}
            </p>

            <p className="text-sm text-muted-foreground">
              By{" "}
              <Link
                to={author.url ?? "/about"}
                rel="author"
                className="font-medium text-foreground hover:text-primary hover:underline"
              >
                {author.name}
              </Link>
              {author.position ? `, ${author.position}` : null}
            </p>
          </div>
        </section>

        <div className="section-container relative">
          <div className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
            <article className="min-w-0">
              <div className="blog-article-body prose prose-invert max-w-none prose-headings:scroll-mt-28 prose-headings:tracking-tight prose-headings:text-foreground prose-p:tracking-tight prose-p:text-foreground/85 prose-li:text-foreground/85 prose-a:text-primary prose-a:no-underline hover:prose-a:underline [&_figure>div]:overflow-hidden [&_figure>div]:rounded-2xl">
                <MDXProvider components={blogMdxComponents}>
                  <Content />
                </MDXProvider>
              </div>

              {meta.faqs?.length ? <BlogPostFaq items={meta.faqs} /> : null}

              <ReadMoreSection
                currentSlug={meta.slug}
                currentTags={meta.tags}
                className="mt-12"
              />
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <AuthorCard author={author} />
                <div className="rounded-lg border border-border bg-card/40 p-5">
                  <TableOfContents />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <MobileToc />
      <Footer />
    </div>
  );
};

export default BlogPost;
