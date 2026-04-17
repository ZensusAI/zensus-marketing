import { Link } from "react-router-dom";
import { Lock, Shield, KeyRound, LucideIcon } from "lucide-react";

interface Column {
  icon: LucideIcon;
  title: string;
  body: string;
}

const COLUMNS: Column[] = [
  {
    icon: Lock,
    title: "Encryption",
    body: "AES-256-GCM at rest. TLS in transit across every data path.",
  },
  {
    icon: Shield,
    title: "Isolation",
    body: "Every database query is filtered by account. No cross-account access, ever.",
  },
  {
    icon: KeyRound,
    title: "Never stored",
    body: "Bank and QuickBooks credentials live in Plaid and Intuit OAuth. Zensus holds tokens, not passwords.",
  },
];

const SecurityStrip = () => (
  <section className="section-padding bg-background border-t border-border">
    <div className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
        {COLUMNS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link to="/security" className="text-sm text-primary hover:underline">
          See our full security posture
        </Link>
      </div>
    </div>
  </section>
);

export default SecurityStrip;
