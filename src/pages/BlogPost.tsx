import { SITE_URL } from "@/lib/constants";
import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { Helmet } from "react-helmet-async";
import { blogMdxComponents } from "@/mdx-components";
import { BlogPostFaq } from "@/components/blog/BlogPostFaq";
import { ReadingLine, TocBar, TocRail, useArticleSections } from "@/components/blog/ArticleToc";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { KeepReading } from "@/components/blog/KeepReading";
import { FOCUS_RING, HIGH_PRIORITY, SQUIRCLE } from "@/components/blog/PostCard";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { formatPostDate, getPostBySlug, getTopic, postBreadcrumbs, postUrl, topicPath } from "@/lib/blog";
import { getAuthor, type Author } from "@/lib/authors";
import { blogStats } from "@/generated/blog-stats";
import { cn } from "@/lib/utils";
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqPageSchema,
} from "@/lib/structured-data";

/*
 * The article page, from handoff 16-blog-post-template. A reading line under
 * the navbar, and below 1100px an "On this page" bar. The header sits on the
 * reading column (Home / Blog / topic / post breadcrumb, H1, description, byline
 * with the topic and Copy link), a 16:9
 * hero from meta.thumbnail spans the container, then a 200px sticky contents
 * rail beside the 680px column: body, FAQ, and "Keep reading" in the topic.
 */

/** Header and body share one grid so the header lines up with the reading column. */
const GRID = "min-[1100px]:grid min-[1100px]:grid-cols-[200px_minmax(0,1fr)] min-[1100px]:gap-x-20";
/** Below 1100px the reading column is centred; from 1100px it is the grid's second track. */
const COLUMN = "mx-auto w-full max-w-[680px] min-[1100px]:col-start-2 min-[1100px]:mx-0";

function AuthorLink({ author, className, children }: { author: Author; className?: string; children: ReactNode }) {
  return author.url?.startsWith("http") ? (
    <a href={author.url} rel="author noopener noreferrer" target="_blank" className={className}>
      {children}
    </a>
  ) : (
    <Link to={author.url ?? "/about"} rel="author" className={className}>
      {children}
    </Link>
  );
}

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked; the address bar still has the URL.
        }
      }}
      className={cn(
        "inline-flex h-10 flex-none items-center rounded-[14px] border border-border bg-card px-3.5 text-[13.5px] font-medium text-foreground transition-colors duration-200 hover:border-primary/55",
        SQUIRCLE,
        FOCUS_RING,
      )}
    >
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;
  const toc = useArticleSections(slug);

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
  const topic = getTopic(meta.topic);
  const cover = blogStats[meta.slug]?.thumbnail;

  // One list drives the visible trail and the BreadcrumbList, so they match.
  const trail = postBreadcrumbs(meta);
  const breadcrumbs = breadcrumbSchema(trail);

  const documentTitle = meta.seoTitle ?? `${meta.title} | Zensus`;
  // meta.ogImage is stored site-relative so posts carry no domain.
  // Open Graph requires an absolute URL, so resolve it here.
  const ogImageUrl = `${SITE_URL}${meta.ogImage}`;

  const blogPostingLd = blogPostingSchema({
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: published,
    url: pageUrl,
    image: ogImageUrl,
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
        <meta property="og:image" content={ogImageUrl} />
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
        <meta name="twitter:image" content={ogImageUrl} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        <script type="application/ld+json">{JSON.stringify(blogPostingLd)}</script>
        {faqLd ? (
          <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
        ) : null}
      </Helmet>
      <Navbar />
      <ReadingLine />

      <main className="pt-[calc(4rem+3px+env(safe-area-inset-top))]">
        <TocBar {...toc} />

        <div className="mx-auto max-w-[1280px] px-6 min-[760px]:px-12">
          <header className={cn(GRID, "pt-12 min-[760px]:pt-[104px]")}>
            <div className={cn(COLUMN, "flex flex-col gap-5")}>
              <Breadcrumbs trail={trail} />

              <h1
                id="blog-article-title"
                className="text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground min-[760px]:text-[52px] min-[1100px]:text-[64px]"
              >
                {meta.title}
              </h1>

              <p className="max-w-[680px] text-pretty text-[18px] leading-[1.5] text-muted-foreground min-[760px]:text-[21px]">
                {meta.description}
              </p>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
                  <AuthorLink author={author} className={cn("group flex items-center gap-3 rounded-[14px]", FOCUS_RING)}>
                    <img
                      src={author.avatar}
                      alt=""
                      width={42}
                      height={42}
                      className="h-[42px] w-[42px] rounded-full border border-border object-cover"
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-semibold text-foreground transition-colors group-hover:text-sage-dark">
                        {author.name}
                      </span>
                      <span className="text-[12.5px] text-muted-foreground">{author.position}</span>
                    </span>
                  </AuthorLink>
                  <p className="text-[13.5px] text-muted-foreground">
                    <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
                    {/* Render the revision date only when it differs from the publish
                        date. BlogPosting.dateModified is emitted either way, and a
                        freshness claim in structured data with nothing corroborating
                        it on the page is the pattern engines discount. */}
                    {meta.dateModified && meta.dateModified !== meta.date ? (
                      <>
                        {" · "}Updated <time dateTime={meta.dateModified}>{formatPostDate(meta.dateModified)}</time>
                      </>
                    ) : null}
                    {" · "}
                    {meta.readTime}
                    {topic ? (
                      <>
                        {" · "}
                        <Link
                          to={topicPath(topic.id)}
                          className={cn("rounded-sm text-sage-dark transition-colors hover:text-foreground", FOCUS_RING)}
                        >
                          {topic.name}
                        </Link>
                      </>
                    ) : null}
                  </p>
                </div>
                <CopyLink url={pageUrl} />
              </div>
            </div>
          </header>

          {meta.thumbnail ? (
            <div className="pt-10 min-[760px]:pt-16">
              {/* The frame takes the cover's own shape (size read at build by
                  generate-blog-stats), so nothing is cropped or letterboxed;
                  16:9 is only the fallback for a cover with no recorded size. */}
              <div
                className={cn(
                  "overflow-hidden rounded-[24px] border border-border bg-card min-[760px]:rounded-[36px]",
                  !cover && "aspect-video",
                  SQUIRCLE,
                )}
                style={cover ? { aspectRatio: `${cover.width} / ${cover.height}` } : undefined}
              >
                <img
                  src={meta.thumbnail}
                  alt={meta.thumbnailAlt ?? meta.title}
                  width={cover?.width}
                  height={cover?.height}
                  loading="eager"
                  decoding="async"
                  className="block h-full w-full object-cover"
                  {...HIGH_PRIORITY}
                />
              </div>
            </div>
          ) : null}

          <div className={cn(GRID, "pt-12 min-[760px]:pt-20")}>
            <aside className="hidden min-[1100px]:block">
              <TocRail {...toc} />
            </aside>
            <article data-article className={cn(COLUMN, "min-w-0")}>
              <div className="blog-article-body">
                <MDXProvider components={blogMdxComponents}>
                  <Content />
                </MDXProvider>
              </div>

              {meta.faqs?.length ? <BlogPostFaq items={meta.faqs} /> : null}
            </article>
          </div>

          <div className="pb-[120px] min-[760px]:pb-[200px]">
            <KeepReading post={meta} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
