import { Link } from "react-router-dom";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const posts = [
  {
    title: "How to Calculate Startup Runway",
    description:
      "Learn the exact formula founders use to calculate runway, plus common mistakes that lead to inaccurate projections.",
    category: "Guides",
    readTime: "6 min read",
    date: "Coming Soon",
  },
  {
    title: "Cash Flow Forecasting for Variable Revenue Businesses",
    description:
      "Why traditional forecasting fails for businesses with annual contracts, seasonal revenue, or usage-based pricing — and what to do instead.",
    category: "Insights",
    readTime: "8 min read",
    date: "Coming Soon",
  },
  {
    title: "When Should You Hire? A Data-Driven Framework",
    description:
      "Use your cash flow forecast to determine the exact month you can afford a new hire without shortening your runway below safety thresholds.",
    category: "Frameworks",
    readTime: "5 min read",
    date: "Coming Soon",
  },
  {
    title: "QuickBooks vs. Bank Feeds: Which Data Source Is More Accurate?",
    description:
      "We compared runway projections from QuickBooks data vs. direct bank feeds. Here's what we found and when each source works best.",
    category: "Product",
    readTime: "4 min read",
    date: "Coming Soon",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              The Zensus <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Practical guides on cash flow forecasting, runway planning, and
              financial decision-making for founders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.title}
                className="group border border-border rounded-2xl bg-card p-6 flex flex-col justify-between hover:border-primary/30 transition-colors"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {post.category}
                  </span>
                  <h2 className="text-xl font-semibold mt-2 mb-3 text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
