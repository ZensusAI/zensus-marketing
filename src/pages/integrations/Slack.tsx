import { IntegrationPage, IntegrationSection } from "@/components/integrations/IntegrationPage";
import slackLogo from "@/assets/integrations/slack.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads and writes",
    body: (
      <p>
        Zensus reads the list of channels you authorize so it can post cash
        alerts into them. Zensus writes interactive Block Kit messages with
        buttons to snooze the alert or adjust your threshold.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <p>
        Channel message contents, direct messages, user presence, or any
        other workspace data. Slack scopes are restricted to the minimum
        needed to post alerts.
      </p>
    ),
  },
  {
    heading: "How it works",
    body: (
      <p>
        You install the Zensus Slack app into your workspace through OAuth.
        Pick a channel for alerts and set a cash threshold. Zensus watches
        your 30-day projection and posts to that channel when the line is
        crossed. Re-alerts fire on material change (a week earlier or a 10%
        dip in minimum balance).
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Uninstall the Zensus app from your Slack workspace, or disconnect
        Slack from Settings, Integrations inside the Zensus app. Either path
        revokes the OAuth token and stops alerts immediately.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        OAuth tokens and signing secrets are encrypted at rest with
        AES-256-GCM. Slack credentials stay with Slack. Workspace
        administrators retain full control and can revoke at any time.
      </p>
    ),
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Zensus + Slack integration",
  serviceType: "Cash-alert delivery to Slack workspaces",
  description:
    "Post Zensus cash-crunch alerts into Slack with interactive Block Kit messages for snooze and threshold controls. OAuth-based, revocable anytime.",
  provider: { "@id": "https://zensus.app/#organization" },
  areaServed: "US",
  url: "https://zensus.app/integrations/slack",
  isRelatedTo: {
    "@type": "Organization",
    name: "Slack",
    url: "https://slack.com",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Founders and operators with variable revenue",
  },
};

const SlackIntegration = () => (
  <IntegrationPage
    slug="slack"
    displayName="Slack"
    tagline="Cash-crunch alerts with snooze and threshold controls, delivered where your team already works."
    logoSrc={slackLogo}
    metaTitle="Slack integration · Zensus"
    metaDescription="Post Zensus cash-crunch alerts into Slack. Interactive Block Kit messages with snooze and threshold controls, OAuth-based, revocable anytime."
    sections={sections}
    serviceSchema={serviceSchema}
  />
);

export default SlackIntegration;
