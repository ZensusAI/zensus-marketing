import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { escapeHtml } from "./sanitize.js";

export interface EmailParams {
  to: string;
  name: string;
  intro: string;
}

const SUBJECT = "Thanks for contacting Zensus";

export function composeEmail(p: EmailParams, from: string) {
  const text =
    `${p.intro}\n\n` +
    `A member of our team will get back to you, usually within one business day. ` +
    `If you need to add anything, just reply to this email or write to ${from}.\n\n` +
    `The Zensus team\nhttps://zensus.app`;

  const html =
    `<p>${escapeHtml(p.intro)}</p>` +
    `<p>A member of our team will get back to you, usually within one business day. ` +
    `If you need to add anything, just reply to this email or write to ` +
    `<a href="mailto:${from}">${from}</a>.</p>` +
    `<p>The Zensus team<br><a href="https://zensus.app">zensus.app</a></p>`;

  return { subject: SUBJECT, text, html };
}

function isTransient(err: unknown): boolean {
  const name = (err as { name?: string })?.name ?? "";
  const status = (err as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode ?? 0;
  return /Throttl|Timeout|ServiceUnavailable|Internal/i.test(name) || status >= 500;
}

interface SendOpts {
  client: SESClient;
  from: string;
  dryRun: boolean;
}

export async function sendAck(
  p: EmailParams,
  opts: SendOpts,
): Promise<{ sent: boolean; dryRun: boolean }> {
  if (opts.dryRun) return { sent: false, dryRun: true };

  const m = composeEmail(p, opts.from);
  const command = new SendEmailCommand({
    Source: opts.from,
    ReplyToAddresses: [opts.from],
    Destination: { ToAddresses: [p.to] },
    Message: {
      Subject: { Data: m.subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: m.text, Charset: "UTF-8" },
        Html: { Data: m.html, Charset: "UTF-8" },
      },
    },
  });

  try {
    await opts.client.send(command);
  } catch (err) {
    if (!isTransient(err)) throw err;
    await new Promise((r) => setTimeout(r, 300));
    await opts.client.send(command); // one retry; throws on second failure
  }
  return { sent: true, dryRun: false };
}
