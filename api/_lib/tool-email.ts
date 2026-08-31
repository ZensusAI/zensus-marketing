import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export interface ToolEmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

function isTransient(err: unknown): boolean {
  const name = (err as { name?: string })?.name ?? "";
  const status =
    (err as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode ?? 0;
  return /Throttl|Timeout|ServiceUnavailable|Internal/i.test(name) || status >= 500;
}

interface SendOpts {
  client: SESClient;
  from: string;
  dryRun: boolean;
}

export async function sendToolEmail(
  message: ToolEmailMessage,
  opts: SendOpts,
): Promise<{ sent: boolean; dryRun: boolean }> {
  if (opts.dryRun) return { sent: false, dryRun: true };

  const command = new SendEmailCommand({
    Source: opts.from,
    ReplyToAddresses: [opts.from],
    Destination: { ToAddresses: [message.to] },
    Message: {
      Subject: { Data: message.subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: message.text, Charset: "UTF-8" },
        Html: { Data: message.html, Charset: "UTF-8" },
      },
    },
  });

  try {
    await opts.client.send(command);
  } catch (err) {
    if (!isTransient(err)) throw err;
    await new Promise((r) => setTimeout(r, 300));
    await opts.client.send(command);
  }

  return { sent: true, dryRun: false };
}
