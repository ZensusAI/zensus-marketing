import { Link } from "react-router-dom";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const posts = [
  {
    title: "Catching a cash crunch two weeks before it hits",
    description:
      "How one founder used Slack alerts to spot a projected shortfall in time to renegotiate payroll timing, without panic or a board call.",
    category: "Case Study",
    readTime: "6 min read",
    date: "Coming Soon",
  },
  {
    title: "Replacing a fractional CFO with scenario chat",
    description:
      "A founder walks through the four scenarios she ran before her next round (hiring, churn, pricing, and an acquisition offer) in under an hour.",
    category: "Case Study",
    readTime: "8 min read",
    date: "Coming Soon",
  },
  {
    title: "When your runway forecast is lying about annual contracts",
    description:
      "Why flat MRR math breaks for agencies, consultancies, and SaaS with mixed contract terms, and how subscription-aware projections change the answer.",
    category: "Case Study",
    readTime: "5 min read",
    date: "Coming Soon",
  },
  {
    title: "From spreadsheet to dashboard: one founder's migration",
    description:
      "What changed after connecting QuickBooks and HubSpot: fewer tabs, faster decisions, and a runway number that actually matches the bank.",
    category: "Case Study",
    readTime: "4 min read",
    date: "Coming Soon",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog · Zensus</title>
        <meta name="description" content="Case studies and practical guides on cash flow forecasting, runway planning, and financial decision-making for founders with variable revenue." />
        <meta property="og:title" content="Blog · Zensus" />
        <meta property="og:description" content="Case studies on cash flow forecasting for founders with variable revenue." />
      </Helmet>
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
              The Zensus Blog
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
