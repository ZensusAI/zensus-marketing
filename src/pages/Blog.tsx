import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { formatPostDate, getAllPosts, postUrl } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { TagFilter } from "@/components/blog/TagFilter";
import { FlickeringGrid } from "@/components/blog/FlickeringGrid";
import {
  blogIndexItemListSchema,
  breadcrumbSchema,
  HOME_CRUMB,
} from "@/lib/structured-data";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Blog", url: "https://zensus.app/blog" },
]);

const Blog = () => {
  const posts = useMemo(() => getAllPosts(), []);
  const [searchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag") ?? "All";

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((post) => post.tags?.forEach((tag) => set.add(tag)));
    return ["All", ...Array.from(set).sort()];
  }, [posts]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    allTags.forEach((tag) => {
      if (tag === "All") return;
      counts[tag] = posts.filter((post) => post.tags?.includes(tag)).length;
    });
    return counts;
  }, [posts, allTags]);

  const filteredPosts = useMemo(() => {
    if (selectedTag === "All") return posts;
    return posts.filter((post) => post.tags?.includes(selectedTag));
  }, [posts, selectedTag]);

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
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Zensus Blog · Cash Flow Guides for Founders</title>
        <meta
          name="description"
          content="Case studies and practical guides on cash flow forecasting and financial decision-making for founders with variable revenue."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zensus.app/blog" />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Zensus Blog · Cash Flow Guides for Founders" />
        <meta
          property="og:description"
          content="Case studies and practical guides on cash flow forecasting for founders with variable revenue."
        />
        <meta property="og:image" content="https://zensus.app/og/blog.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Blog page social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zensus Blog · Cash Flow Guides for Founders" />
        <meta
          name="twitter:description"
          content="Case studies and practical guides on cash flow forecasting for founders with variable revenue."
        />
        <meta name="twitter:image" content="https://zensus.app/og/blog.png" />
        <link rel="canonical" href="https://zensus.app/blog" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        {posts.length > 0 ? (
          <script type="application/ld+json">
            {JSON.stringify(blogItemListLd)}
          </script>
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
              maxOpacity={0.25}
              flickerChance={0.06}
            />
          </div>

          <div className="section-container relative z-10 flex min-h-[280px] flex-col justify-center gap-6 py-12">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>

            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-medium tracking-tighter sm:text-5xl md:text-6xl">
                The Zensus Blog
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                Practical guides on cash flow forecasting and financial
                decision-making for founders and finance teams.
              </p>
            </div>

            {allTags.length > 1 ? (
              <div className="mt-2 w-full">
                <TagFilter
                  tags={allTags}
                  selectedTag={selectedTag}
                  tagCounts={tagCounts}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="section-container pb-20">
          {filteredPosts.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              No posts in this category yet.
            </p>
          ) : (
            <div
              className={
                "grid grid-cols-1 overflow-hidden border-x border-border md:grid-cols-2 lg:grid-cols-3 " +
                (filteredPosts.length < 4 ? "border-b" : "")
              }
            >
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  date={formatPostDate(post.date)}
                  readTime={post.readTime}
                  tags={post.tags}
                  thumbnail={post.thumbnail}
                  showRightBorder={
                    (index + 1) % 3 !== 0 && index !== filteredPosts.length - 1
                  }
                  featured={false}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
