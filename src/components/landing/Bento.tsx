import { Link2, Zap, Target, Shuffle, LucideIcon } from "lucide-react";

interface Tile {
  icon: LucideIcon;
  title: string;
  body: string;
}

const TILES: Tile[] = [
  {
    icon: Link2,
    title: "Connect in 60s",
    body: "OAuth to Plaid, QuickBooks, HubSpot. No spreadsheets, no CSV uploads.",
  },
  {
    icon: Zap,
    title: "Real-time webhook sync",
    body: "The moment a transaction clears, your runway updates.",
  },
  {
    icon: Target,
    title: "Zero-cash date",
    body: "The exact day you run out, recalculated live.",
  },
  {
    icon: Shuffle,
    title: "Vendor normalization",
    body: "Stripe payouts, ACH transfers, and card purchases all reconcile cleanly.",
  },
];

const Bento = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {TILES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl p-6 bg-[hsl(var(--surface-raised))] border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Bento;
