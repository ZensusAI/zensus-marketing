import { Link } from "react-router-dom";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { formatPostDate, getAllPosts, postUrl } from "@/lib/blog";
import {
  blogIndexItemListSchema,
  breadcrumbSchema,
  HOME_CRUMB,
} from "@/lib/structured-data";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Blog", url: "https://zensus.app/blog" },
]);

const posts = getAllPosts();

const blogItemListLd = blogIndexItemListSchema(
  posts.map((post) => ({
    name: post.title,
    url: postUrl(post.slug),
    datePublished: post.date,
  })),
);

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Zensus Blog · Cash Flow Forecasting Guides for Founders</title>
        <meta
          name="description"
          content="Case studies and practical guides on cash flow forecasting, runway planning, and financial decision-making for founders with variable revenue."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zensus.app/blog" />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Zensus Blog · Cash Flow Forecasting Guides for Founders" />
        <meta
          property="og:description"
          content="Case studies and practical guides on cash flow forecasting for founders with variable revenue."
        />
        <meta property="og:image" content="https://zensus.app/og/blog.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Blog page social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zensus Blog · Cash Flow Forecasting Guides for Founders" />
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
      <main className="pt-24 pb-16">
        <div className="section-container">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <div className="mb-16 max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              The Zensus Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Practical guides on cash flow forecasting, runway planning, and
              financial decision-making for founders.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-muted-foreground">New posts are on the way.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {post.category}
                    </span>
                    <h2 className="mt-2 mb-3 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} aria-hidden />
                        {post.readTime}
                      </span>
                      <time dateTime={post.date}>
                        {formatPostDate(post.date)}
                      </time>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-primary opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
