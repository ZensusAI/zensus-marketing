import { escapeHtml } from "./sanitize.js";

// Branded acknowledgment email. Built as table-based, fully inline-styled HTML
// (the technique transactional senders like Stripe/Linear use) so it renders
// consistently across email clients, including Outlook. CSS classes and
// <style> blocks are stripped by many clients, and divs/flexbox are unreliable.
const LOGO_URL = "https://zensus.app/email-logo.png";
const SITE_URL = "https://zensus.app";
const BRAND_GREEN = "#22c55e";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const PREHEADER =
  "We've received your message and a member of our team will get back to you soon.";

export interface TemplateInput {
  intro: string;
  from: string;
}

export function emailText({ intro, from }: TemplateInput): string {
  return (
    `${intro}\n\n` +
    `A member of our team will get back to you, usually within one business day. ` +
    `If you need to add anything, just reply to this email or write to ${from}.\n\n` +
    `The Zensus team\n${SITE_URL}`
  );
}

export function emailHtml({ intro, from }: TemplateInput): string {
  const safeIntro = escapeHtml(intro);
  const safeFrom = escapeHtml(from);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Zensus</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${escapeHtml(PREHEADER)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6e8eb;">
          <tr>
            <td style="padding:24px 32px; border-bottom:1px solid #eef0f2;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;"><img src="${LOGO_URL}" width="36" height="36" alt="Zensus" style="display:block; border-radius:8px;"></td>
                  <td style="vertical-align:middle; padding-left:12px; font-family:${FONT}; font-size:20px; font-weight:700; color:#0f172a; letter-spacing:-0.01em;">Zensus</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height:3px; line-height:3px; font-size:0; background-color:${BRAND_GREEN};">&nbsp;</td></tr>
          <tr>
            <td style="padding:32px; font-family:${FONT}; font-size:16px; line-height:1.6; color:#334155;">
              <p style="margin:0 0 18px;">${safeIntro}</p>
              <p style="margin:0 0 18px;">A member of our team will get back to you, usually within one business day. If you need to add anything, just reply to this email or write to <a href="mailto:${safeFrom}" style="color:${BRAND_GREEN}; text-decoration:none; font-weight:600;">${safeFrom}</a>.</p>
              <p style="margin:24px 0 0; color:#0f172a; font-weight:600;">The Zensus team</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px; border-top:1px solid #eef0f2; font-family:${FONT}; font-size:13px; color:#94a3b8;">
              Zensus &middot; <a href="${SITE_URL}" style="color:#94a3b8; text-decoration:underline;">zensus.app</a>
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
          <tr>
            <td style="padding:16px 32px; font-family:${FONT}; font-size:12px; line-height:1.5; color:#b0b8c1; text-align:center;">
              You're receiving this because you contacted Zensus through our support page.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
