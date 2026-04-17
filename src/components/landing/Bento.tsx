import {
  GlyphConnect,
  GlyphWebhookSync,
  GlyphZeroCashDate,
  GlyphVendorNormalize,
} from "./BentoGlyphs";

interface Tile {
  Glyph: () => JSX.Element;
  title: string;
  body: string;
}

const TILES: Tile[] = [
  {
    Glyph: GlyphConnect,
    title: "Connect in 60s",
    body: "OAuth to Plaid, QuickBooks, HubSpot. No spreadsheets, no CSV uploads.",
  },
  {
    Glyph: GlyphWebhookSync,
    title: "Real-time webhook sync",
    body: "The moment a transaction clears, your runway updates.",
  },
  {
    Glyph: GlyphZeroCashDate,
    title: "Zero-cash date",
    body: "The exact day you run out, recalculated live.",
  },
  {
    Glyph: GlyphVendorNormalize,
    title: "Vendor normalization",
    body: "Stripe payouts, ACH transfers, and card purchases all reconcile cleanly.",
  },
];

const Bento = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {TILES.map(({ Glyph, title, body }) => (
          <div
            key={title}
            className="rounded-2xl p-6 bg-[hsl(var(--surface-raised))] border border-border"
          >
            <div className="glyph-frame mb-4">
              <Glyph />
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
