import { SITE_URL } from "@/lib/constants";
import {
  IntegrationPage,
  IntegrationRelatedLink,
  IntegrationSection,
} from "@/components/integrations/IntegrationPage";
import slackLogo from "@/assets/integrations/slack.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads and writes",
    body: (
      <p>
        Zensus reads the list of public and private channels in your
        workspace, so you can pick where alerts go. It posts cash alerts into
        the channel you choose as interactive messages with three buttons:
        View in Zensus, Snooze 7 days, and Adjust threshold.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <>
        <p>
          The messages in your channels, or direct messages between people.
          Its permissions do cover messages sent directly to the Zensus app
          and messages that mention it.
        </p>
        <p>
          The permissions it requests are: post messages, list channels, slash
          commands, link previews, mentions of the app, and direct messages
          sent to the app.
        </p>
      </>
    ),
  },
  {
    heading: "How it works",
    body: (
      <>
        <p>
          Install the Zensus Slack app from Settings, Integrations. Pick a
          channel for alerts and set a cash floor. Zensus checks your 30-day
          projection after every data sync and once a day, and posts when the
          projection drops below the floor.
        </p>
        <p>
          It alerts again only on a material change: the breach moving at
          least 7 days earlier, or the projected low point falling by 10% or
          $1,000, whichever is larger.
        </p>
      </>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Disconnect Slack from Settings, Integrations inside the Zensus app, or
        uninstall the Zensus app from your Slack workspace. Either path
        revokes the token and stops alerts immediately.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        The Slack token is encrypted at rest with AES-256-GCM. Slack
        credentials stay with Slack. Workspace administrators keep full
        control and can remove the app at any time.
      </p>
    ),
  },
];

const faqs = [
  {
    question: "What triggers a Zensus alert in Slack?",
    answer:
      "You set a cash floor. Zensus checks your 30-day projection after every data sync and once a day, and posts to your chosen channel when the projection drops below that floor.",
  },
  {
    question: "Will Zensus keep posting the same alert?",
    answer:
      "No. After the first alert it posts again only on a material change: the breach moving at least 7 days earlier, or the projected low point falling by 10% or $1,000, whichever is larger.",
  },
  {
    question: "Can I snooze an alert or change the threshold from Slack?",
    answer:
      "Yes. Each alert has a Snooze 7 days button and an Adjust threshold button, plus a link to open the projection in Zensus.",
  },
  {
    question: "Can Zensus read my Slack messages?",
    answer:
      "Not the messages in your channels or between people. Its permissions cover only messages sent directly to the Zensus app and messages that mention it.",
  },
  {
    question: "Can I get cash alerts by email instead of Slack?",
    answer: "Not today. Slack is the only channel for cash alerts.",
  },
  {
    question: "Do I need Slack to use Zensus?",
    answer:
      "No. The forecast and scenarios work without Slack. Slack adds the alerts.",
  },
];

const related: IntegrationRelatedLink[] = [
  {
    to: "/blog/will-i-make-payroll",
    label: "Will I make payroll?",
    description:
      "How to check each payroll date against your projected cash and buffer, weeks ahead.",
  },
  {
    to: "/blog/what-happens-if-you-miss-payroll",
    label: "What happens if you miss payroll",
    description:
      "The consequences, and a 7-day plan, for the situation an early alert is meant to prevent.",
  },
  {
    to: "/blog/zero-cash-date-for-founders",
    label: "Zero cash date",
    description:
      "The date behind the alert: when projected cash reaches zero.",
  },
  {
    to: "/use-cases",
    label: "Who uses Zensus",
    description:
      "The kinds of lumpy cash flow where a threshold alert matters most.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Zensus + Slack integration",
  serviceType: "Cash-alert delivery to Slack workspaces",
  description:
    "Post Zensus cash-crunch alerts into Slack with interactive Block Kit messages for snooze and threshold controls. OAuth-based, revocable anytime.",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "US",
  url: `${SITE_URL}/integrations/slack`,
  isRelatedTo: {
    "@type": "Organization",
    name: "Slack",
    url: "https://slack.com",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Businesses of any size",
  },
};

const SlackIntegration = () => (
  <IntegrationPage
    slug="slack"
    displayName="Slack"
    tagline="Cash-crunch alerts with snooze and threshold controls, delivered where your team already works."
    logoSrc={slackLogo}
    metaTitle="Slack Integration · Cash-Crunch Alerts from Zensus"
    metaDescription="Post Zensus cash-crunch alerts into Slack. Interactive Block Kit messages with snooze and threshold controls, OAuth-based, revocable anytime."
    sections={sections}
    serviceSchema={serviceSchema}
    related={related}
    faqs={faqs}
  />
);

export default SlackIntegration;
