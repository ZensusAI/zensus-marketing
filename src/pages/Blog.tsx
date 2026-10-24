import { SITE_URL } from "@/lib/constants";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { BLOG_TOPICS, getAllPosts, getTopic, postUrl, type BlogPostMeta } from "@/lib/blog";
import { FOCUS_RING, PostCard, SQUIRCLE } from "@/components/blog/PostCard";
import { FeaturedCarousel } from "@/components/blog/FeaturedCarousel";
import { BlogBanners } from "@/components/blog/BlogBanners";
import { blogIndexItemListSchema, breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/*
 * The blog index, from handoff 15-blog (31a). Home view: header with search
 * and Explore topics, the four newest guides in a carousel, then one section
 * per topic (up to three cards and "View all"), with the template and Ask AI
 * banners after the second. ?topic=<id> and ?q=<text> switch to a list of
 * that topic or of the search results, so both views are linkable. No scroll
 * animation: transitions only on hover, focus and the topics chevron.
 */

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Blog", url: `${SITE_URL}/blog` },
]);

const CONTAINER = "mx-auto max-w-[1152px]";
const GUTTER = "px-6 min-[760px]:px-12";

const SearchIcon = ({ size, stroke }: { size: number; stroke: string }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

/** 3 columns from 1100px, 2 from 760px, 1 below. */
const GRID = "grid gap-5 min-[760px]:grid-cols-2 min-[760px]:gap-x-10 min-[760px]:gap-y-14 min-[1100px]:grid-cols-3";

function Controls({
  posts,
  topicId,
  query,
  setQuery,
}: {
  posts: BlogPostMeta[];
  topicId: string | null;
  query: string;
  setQuery: (q: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(!!query);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const current = getTopic(topicId);

  useEffect(() => {
    if (query) setSearchOpen(true);
  }, [query]);

  // Close the topics menu on a click outside it or on Escape.
  useEffect(() => {
    if (!topicsOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setTopicsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTopicsOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [topicsOpen]);

  const menu = [
    { id: null, name: "All guides", description: "Every guide, newest first.", count: posts.length },
    ...BLOG_TOPICS.map((t) => ({ id: t.id, name: t.name, description: t.description, count: posts.filter((p) => p.topic === t.id).length })),
  ];

  return (
    <div ref={wrap} className="relative flex w-full gap-2.5 min-[760px]:w-auto">
      {searchOpen ? (
        <label
          className={cn(
            "flex h-[52px] flex-1 items-center gap-2.5 rounded-full border border-primary/70 bg-card pl-4 pr-2 shadow-[0_0_0_4px_rgba(34,197,115,.14)] min-[760px]:min-w-[420px]",
            SQUIRCLE,
          )}
        >
          <SearchIcon size={17} stroke="hsl(var(--muted-foreground))" />
          <span className="sr-only">Search guides</span>
          <input
            ref={input}
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("");
                setSearchOpen(false);
              }
            }}
            placeholder={`Search ${posts.length} guides`}
            className="min-w-0 flex-1 border-0 bg-transparent text-base text-foreground outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSearchOpen(false);
            }}
            className={cn("h-9 rounded-full px-3 text-[13.5px] text-muted-foreground hover:bg-border/50", FOCUS_RING)}
          >
            Close
          </button>
        </label>
      ) : (
        <>
          <button
            type="button"
            aria-label="Search"
            onClick={() => {
              setSearchOpen(true);
              setTopicsOpen(false);
            }}
            className={cn(
              "flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[18px] border border-border bg-card transition-colors duration-200 hover:border-foreground",
              SQUIRCLE,
              FOCUS_RING,
            )}
          >
            <SearchIcon size={19} stroke="hsl(var(--foreground))" />
          </button>
          <button
            type="button"
            aria-expanded={topicsOpen}
            aria-haspopup="true"
            onClick={() => setTopicsOpen((o) => !o)}
            className={cn(
              "flex h-[52px] flex-1 items-center justify-between gap-3 rounded-[18px] border bg-card px-5 text-[15px] font-medium text-foreground transition-colors duration-200 hover:border-foreground min-[760px]:flex-none",
              SQUIRCLE,
              FOCUS_RING,
              topicsOpen ? "border-foreground" : "border-border",
            )}
          >
            <span>{current ? current.name : "Explore topics"}</span>
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("transition-transform duration-200", topicsOpen && "rotate-180")}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </>
      )}

      {topicsOpen && !searchOpen ? (
        <nav
          aria-label="Blog topics"
          className={cn(
            "absolute right-0 top-[62px] z-30 flex w-full flex-col rounded-[26px] border border-border bg-card p-2 shadow-[0_24px_48px_-20px_rgba(15,28,22,.35)] min-[760px]:w-[380px]",
            SQUIRCLE,
          )}
        >
          {menu.map((t) => {
            const on = (t.id ?? null) === (current?.id ?? null);
            return (
              <Link
                key={t.name}
                to={t.id ? `/blog?topic=${t.id}` : "/blog"}
                onClick={() => setTopicsOpen(false)}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 rounded-[18px] px-3.5 py-3 hover:bg-border/40",
                  SQUIRCLE,
                  FOCUS_RING,
                  on && "bg-primary/10",
                )}
              >
                <span className={cn("text-[15px] font-semibold", on ? "text-sage-dark" : "text-foreground")}>{t.name}</span>
                <span className="text-[13px] text-muted-foreground">{t.count}</span>
                <span className="col-span-full text-[13px] leading-[1.4] text-muted-foreground">{t.description}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}

function TopicSection({ topic, posts }: { topic: (typeof BLOG_TOPICS)[number]; posts: BlogPostMeta[] }) {
  const shown = posts.slice(0, 3);
  return (
    <section aria-labelledby={`topic-${topic.id}`} className={cn(GUTTER, "pt-24 min-[760px]:pt-40")}>
      <div className={CONTAINER}>
        <div className="mb-11 flex items-baseline justify-between gap-4 border-b border-border pb-5">
          <h2 id={`topic-${topic.id}`} className="text-[30px] font-semibold tracking-[-0.035em] text-foreground min-[760px]:text-[44px]">
            {topic.name}
          </h2>
          <Link
            to={`/blog?topic=${topic.id}`}
            className={cn(
              "inline-flex min-h-11 flex-none items-center whitespace-nowrap rounded-md px-0.5 text-[15px] text-muted-foreground transition-colors duration-200 hover:text-foreground",
              FOCUS_RING,
            )}
          >
            View all {posts.length} →
          </Link>
        </div>
        {/* Phones: a swipe row of 82%-wide cards that bleeds to the screen
            edge. 760 to 1100px: two cards. From 1100px: three. */}
        <div
          className={cn(
            "max-[759px]:-mx-6 max-[759px]:flex max-[759px]:snap-x max-[759px]:snap-mandatory max-[759px]:gap-5 max-[759px]:overflow-x-auto max-[759px]:scroll-px-6 max-[759px]:px-6 max-[759px]:pb-1 max-[759px]:[scrollbar-width:none]",
            "min-[760px]:grid min-[760px]:grid-cols-2 min-[760px]:gap-x-10 min-[760px]:gap-y-14 min-[1100px]:grid-cols-3",
          )}
        >
          {shown.map((post, i) => (
            <PostCard
              key={post.slug}
              post={post}
              className={cn("max-[759px]:w-[82%] max-[759px]:flex-none max-[759px]:snap-start", i === 2 && "min-[760px]:max-[1099px]:hidden")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const Blog = () => {
  const posts = useMemo(() => getAllPosts(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic");
  const query = searchParams.get("q") ?? "";
  const topic = getTopic(topicParam);
  const needle = query.trim().toLowerCase();
  const mode = needle ? "search" : topic ? "topic" : "home";

  const setQuery = (q: string) => {
    setSearchParams(q ? { q } : {}, { replace: true });
  };

  // A new view starts at the top of the page.
  const view = mode === "topic" ? `topic:${topic?.id}` : mode;
  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
  }, [view]);

  const byTopic = (id: string) => posts.filter((p) => p.topic === id);
  const results = needle
    ? posts.filter((p) => `${p.title} ${p.description} ${getTopic(p.topic)?.name ?? ""}`.toLowerCase().includes(needle))
    : [];
  const listed = mode === "topic" && topic ? byTopic(topic.id) : results;

  const blogItemListLd = useMemo(
    () =>
      blogIndexItemListSchema(
        posts.map((post) => ({
          name: post.title,
          url: postUrl(post.slug),
          datePublished: post.date,
        })),
      ),
    [posts],
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Helmet>
        <title>Zensus Blog · Cash Flow Guides for Businesses</title>
        <meta
          name="description"
          content="Case studies and practical guides on cash flow forecasting and financial decision-making for businesses of any size."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Zensus Blog · Cash Flow Guides for Businesses" />
        <meta
          property="og:description"
          content="Case studies and practical guides on cash flow forecasting for businesses of any size."
        />
        <meta property="og:image" content={`${SITE_URL}/og/blog.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Blog page social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zensus Blog · Cash Flow Guides for Businesses" />
        <meta
          name="twitter:description"
          content="Case studies and practical guides on cash flow forecasting for businesses of any size."
        />
        <meta name="twitter:image" content={`${SITE_URL}/og/blog.png`} />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        {posts.length > 0 ? (
          <script type="application/ld+json">
            {JSON.stringify(blogItemListLd)}
          </script>
        ) : null}
      </Helmet>
      <Navbar />

      <main>
        <header className={cn(GUTTER, "relative z-20 pb-12 pt-[calc(4rem+56px)] min-[760px]:pb-[88px] min-[760px]:pt-[calc(4rem+128px)]")}>
          <div className={cn(CONTAINER, "flex flex-wrap items-end justify-between gap-x-8 gap-y-5")}>
            <div className="flex min-w-0 flex-col gap-3.5">
              <h1 className="text-[52px] font-semibold leading-[.95] tracking-[-0.05em] text-foreground min-[760px]:text-[76px] min-[1100px]:text-[96px]">
                The Zensus Blog
              </h1>
              <p className="max-w-[540px] text-pretty text-base leading-[1.5] text-muted-foreground min-[760px]:text-lg">
                Practical guides on cash flow forecasting and financial decision-making for business owners and finance teams.
              </p>
            </div>
            <Controls posts={posts} topicId={topic?.id ?? null} query={query} setQuery={setQuery} />
          </div>
        </header>

        {mode === "home" ? (
          <>
            <FeaturedCarousel posts={posts.slice(0, 4)} />
            {BLOG_TOPICS.map((t, i) => (
              <div key={t.id} className="contents">
                {i === 2 ? <BlogBanners /> : null}
                <TopicSection topic={t} posts={byTopic(t.id)} />
              </div>
            ))}
          </>
        ) : (
          <>
            <section className={cn(GUTTER, "pt-2")}>
              <div className={cn(CONTAINER, "flex flex-col gap-3")}>
                <Link
                  to="/blog"
                  className={cn("self-start rounded-md text-[14.5px] text-muted-foreground transition-colors duration-200 hover:text-foreground", FOCUS_RING)}
                >
                  ← All guides
                </Link>
                <h2 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground min-[760px]:text-[64px]">
                  {mode === "topic" && topic ? topic.name : `Results for "${query.trim()}"`}
                </h2>
                <p className="text-base text-muted-foreground">
                  {mode === "topic" && topic
                    ? `${topic.description} ${listed.length} guides.`
                    : `${listed.length} ${listed.length === 1 ? "guide" : "guides"} found.`}
                </p>
              </div>
            </section>
            {listed.length > 0 ? (
              <section className={cn(GUTTER, "pt-8")}>
                <div className={cn(CONTAINER, GRID)}>
                  {listed.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ) : (
              <section className={cn(GUTTER, "pt-10")}>
                <div className={cn(CONTAINER, "rounded-[30px] border border-dashed border-[#D9C79A] p-10 text-center", SQUIRCLE)}>
                  <p className="text-[17px] font-semibold text-foreground">No guides match that search.</p>
                  <p className="mt-2 text-[14.5px] text-muted-foreground">
                    Try a shorter word, or{" "}
                    <Link to="/blog" className={cn("rounded-sm font-semibold text-sage-dark hover:underline", FOCUS_RING)}>
                      browse all guides
                    </Link>
                    .
                  </p>
                </div>
              </section>
            )}
          </>
        )}
        <div aria-hidden className="h-[120px] min-[760px]:h-[200px]" />
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
