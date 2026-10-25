import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { FOCUS_RING, PostCard, SQUIRCLE } from "@/components/blog/PostCard";
import { BLOG_TOPICS, getAllPosts, getTopic, postUrl, topicBreadcrumbs, topicPath, topicUrl } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbSchema, topicCollectionSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

const NotFound = lazy(() => import("./NotFound"));

/*
 * One page per blog topic at /blog/topic/<id>: the hub every post in the
 * topic links to from its breadcrumb and byline. Breadcrumb, the topic's own
 * title and intro, every guide in it newest first, then the other topics.
 * Styled as the blog index it belongs to (handoff 15-blog cards, the same
 * 15% zoom from 760px). Each page is prerendered with its own canonical,
 * sitemap entry and social card; /blog?topic=<id> redirects here at the edge.
 */

const CONTAINER = "mx-auto max-w-[1152px]";
const GUTTER = "px-6 min-[760px]:px-12";
const GRID = "grid gap-5 min-[760px]:grid-cols-2 min-[760px]:gap-x-10 min-[760px]:gap-y-14 min-[1100px]:grid-cols-3";

const BlogTopic = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = getTopic(topicId);

  if (!topic) {
    return (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    );
  }

  const all = getAllPosts();
  const posts = all.filter((p) => p.topic === topic.id);
  const others = BLOG_TOPICS.filter((t) => t.id !== topic.id);
  const trail = topicBreadcrumbs(topic);
  const pageUrl = topicUrl(topic.id);
  const heading = `${topic.name} guides`;
  const ogImage = `${SITE_URL}/og/blog-topic-${topic.id}.png`;

  const breadcrumbLd = breadcrumbSchema(trail);
  const collectionLd = topicCollectionSchema(
    { name: topic.name, description: topic.metaDescription, url: pageUrl },
    posts.map((p) => ({ name: p.title, url: postUrl(p.slug), datePublished: p.date })),
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Helmet>
        <title>{topic.seoTitle}</title>
        <meta name="description" content={topic.metaDescription} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content={topic.seoTitle} />
        <meta property="og:description" content={topic.metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${heading} on the Zensus Blog`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={topic.seoTitle} />
        <meta name="twitter:description" content={topic.metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
      </Helmet>
      <Navbar />

      <main className="min-[760px]:[zoom:0.85]">
        <header className={cn(GUTTER, "pb-10 pt-[calc(4rem+48px)] min-[760px]:pb-16 min-[760px]:pt-[calc(4rem+112px)]")}>
          <div className={cn(CONTAINER, "flex flex-col gap-5")}>
            <Breadcrumbs trail={trail} />
            <h1 className="text-balance text-[44px] font-semibold leading-[1] tracking-[-0.045em] text-foreground min-[760px]:text-[64px] min-[1100px]:text-[76px]">
              {heading}
            </h1>
            <p className="max-w-[720px] text-pretty text-[17px] leading-[1.6] text-muted-foreground min-[760px]:text-[19px]">
              {topic.intro}
            </p>
            <p className="text-[14.5px] text-muted-foreground">
              {posts.length} {posts.length === 1 ? "guide" : "guides"}, newest first.
            </p>
          </div>
        </header>

        <section aria-label={heading} className={GUTTER}>
          <div className={cn(CONTAINER, GRID)}>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section aria-labelledby="more-topics-heading" className={cn(GUTTER, "pt-24 min-[760px]:pt-40")}>
          <div className={CONTAINER}>
            <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-border pb-5">
              <h2
                id="more-topics-heading"
                className="text-[30px] font-semibold tracking-[-0.035em] text-foreground min-[760px]:text-[44px]"
              >
                More topics
              </h2>
              <Link
                to="/blog"
                className={cn(
                  "inline-flex min-h-11 flex-none items-center whitespace-nowrap rounded-md px-0.5 text-[15px] text-muted-foreground transition-colors duration-200 hover:text-foreground",
                  FOCUS_RING,
                )}
              >
                All {all.length} guides →
              </Link>
            </div>
            <ul className="grid gap-3 min-[760px]:grid-cols-2">
              {others.map((t) => {
                const count = all.filter((p) => p.topic === t.id).length;
                return (
                  <li key={t.id}>
                    <Link
                      to={topicPath(t.id)}
                      className={cn(
                        "group flex h-full flex-col gap-1.5 rounded-[26px] border border-border bg-card px-6 py-5 transition-colors duration-200 hover:border-primary/55",
                        SQUIRCLE,
                        FOCUS_RING,
                      )}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-[18px] font-semibold tracking-[-0.015em] text-foreground transition-colors group-hover:text-sage-dark">
                          {t.name}
                        </span>
                        <span className="flex-none text-[13.5px] text-muted-foreground">
                          {count} {count === 1 ? "guide" : "guides"} →
                        </span>
                      </span>
                      <span className="text-[14.5px] leading-[1.5] text-muted-foreground">{t.description}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <div aria-hidden className="h-[120px] min-[760px]:h-[200px]" />
      </main>

      <Footer />
    </div>
  );
};

export default BlogTopic;
