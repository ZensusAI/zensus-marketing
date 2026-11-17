/*
 * The About page's copy, exactly as approved in handoff 24 (17 Nov 2026). The
 * hero, mission and vision were approved on 17 Nov; the origin story, the
 * beliefs and the team are live copy; the founder timeline and the Service as
 * a Software section are new in the handoff.
 *
 * Removed on purpose, per the handoff: "Good companies ended up surviving on a
 * story instead of a plan.", the closing "Zensus is what he needed then" paragraph,
 * and the beliefs "Your data stays yours." and "A public price, and no contract."
 *
 * Every claim in SERVICE.rows ("Done by Zensus") must match a shipped feature.
 * Zensus is software, never a financial services provider; fractional CFOs are
 * partners, never replaced.
 */

export const HERO = {
  label: "About Zensus",
  // One sentence per line; the last word of each is set in deep green.
  lines: [
    { lead: "Foresight you", word: "trace." },
    { lead: "Judgment you", word: "defend." },
    { lead: "Numbers you", word: "audit." },
  ],
  subhead:
    "Zensus reads your bank, QuickBooks, and HubSpot, rebuilds your cash forecast as things change, and shows the reasoning behind every number, so a hard month arrives as a decision you can explain.",
} as const;

export const MISSION = {
  label: "Our mission",
  statement: "Give every business foresight it can prove.",
  // Add ", every forecast checked against what actually happened." only once
  // forecast-vs-actual scoring ships in the product.
  line: "Every number traced to its source.",
} as const;

export const VISION = {
  label: "Our vision",
  statement: "A world where no cash decision is a guess.",
  line: "The judgment large companies pay analysts for, standard for everyone.",
} as const;

export const ORIGIN = {
  label: "Origin story",
  place: "Capital Factory, Austin, Texas",
  heading: "In a room full of founders who were running out of time.",
  paragraphs: [
    "Zensus began in the rooms at Capital Factory, Austin's startup hub. Event after event, our founder, Ajin Sunny, met people building things that mattered. Most of them did not run out of ideas, or nerve, or customers. They ran out of money, and too often they did not see it coming.",
    "It was hard to watch. Founders gave everything to the mission, and cash became the thing they would deal with later. When later came, the numbers in the investor update grew rounder and more hopeful, because there was no time to build an honest forecast and too much at stake to admit the gap.",
  ],
} as const;

export const FOUNDER_STORY = {
  label: "The founder's story",
  heading: "Ajin knew that feeling from the inside.",
  name: "Ajin Sunny",
  role: "Founder",
  photo: "/team/ajin-sunny.webp",
  paragraph:
    "He grew up in Kerala, India. He is a first-generation immigrant who spent more than 12 years studying and working in the United States on his own. There was no one to show him where his money was going or how long it would last. Every month was a careful guess, made alone.",
} as const;

export const FOUNDER_PATH = [
  { title: "Kerala, India", detail: "Where he grew up." },
  { title: "University of Kentucky", detail: "Bachelor's and master's degrees." },
  { title: "12+ years in the United States", detail: "Studying and working on his own, with every month a careful guess." },
  { title: "Capital Factory, Austin", detail: "Where Zensus began." },
] as const;

export const SERVICE = {
  label: "Service as a Software",
  heading: "Not another tool to run. The forecasting work, done.",
  intro:
    "Most businesses either rebuild a cash forecast by hand or skip it. Zensus does that work as software: it pulls the numbers, rebuilds the forecast and tells you when a month gets tight. You make the decisions.",
  caption: "The forecasting work, by hand and with Zensus",
  columns: ["The work", "By hand, in a spreadsheet", "Done by Zensus"],
  rows: [
    {
      title: "Pull the numbers",
      hand: "Export from the bank, QuickBooks and HubSpot, then paste it all into one sheet.",
      zensus: "Synced from your bank, QuickBooks and HubSpot. No uploads.",
    },
    {
      title: "Rebuild the forecast",
      hand: "Every Monday, and out of date by Wednesday.",
      zensus: "A 13-week projection that redraws itself as invoices post and payroll clears.",
    },
    {
      title: "Catch the tight month",
      hand: "Whenever someone remembers to look.",
      zensus: "Slack pings you the moment your projection crosses the line.",
    },
    {
      title: 'Answer "what if"',
      hand: "A new tab and a new set of formulas for every scenario.",
      zensus: "Ask in plain English and see the scenario against your baseline.",
    },
  ],
  cfo: {
    lead: "Working with a fractional CFO?",
    body: "They start from a forecast that is already built, and spend their hours on advice instead of data entry.",
  },
  link: "The work of a weekly forecast, $199 a month",
} as const;

export const BELIEFS = [
  {
    title: "Cash should never run out by surprise.",
    body: "A business can get through a hard month it sees coming. It rarely gets through one it does not.",
  },
  {
    title: "Honest numbers beat hopeful ones.",
    body: "No one should have to round a forecast up to keep going. A forecast built on real bank data and real billing dates is one you can show anyone.",
  },
  {
    title: "Clarity should not need a finance team.",
    body: "Businesses of any size deserve the cash visibility that large companies pay analysts for.",
  },
] as const;

export const TEAM_HEADING = "Our team";

/*
 * The team, in the order the page shows them. Each person's `id` is the anchor
 * of their card and the fragment of their schema.org Person @id
 * (`/about#<id>`), which blog bylines point at, so an id never changes once
 * published. Ajin's Person node ships sitewide in index.html; the others are
 * emitted by About.tsx. `photo` is a 512px square WebP under public/team/.
 */
export const TEAM = [
  { id: "ajin-sunny", name: "Ajin Sunny", title: "Founder", photo: "/team/ajin-sunny.webp", linkedin: "https://www.linkedin.com/in/ajinsunny/" },
  { id: "john-george", name: "John George", title: "Co-Founder", photo: "/team/john-george.webp", linkedin: "https://www.linkedin.com/in/johngeorge28/" },
  { id: "elsa-iris-reyes", name: "Elsa Iris Reyes", title: "Board Advisor", photo: "/team/elsa-iris-reyes.webp", linkedin: "https://www.linkedin.com/in/elsairisreyes/" },
  { id: "joe-anglim", name: "Joe Anglim", title: "Strategic Advisor", photo: "/team/joe-anglim.webp", linkedin: "https://www.linkedin.com/in/joe-anglim/" },
] as const;

/** Heights (percent) of the 13 faint weekly bars behind the mission; the 9th is brighter. */
export const BARS = [42, 38, 46, 40, 34, 44, 37, 30, 78, 72, 46, 41, 48] as const;
