import { escapeHtml } from "./sanitize.js";

// Branded acknowledgment email. Built as table-based, fully inline-styled HTML
// (the technique transactional senders like Stripe/Linear use) so it renders
// consistently across email clients, including Outlook. CSS classes and
// <style> blocks are stripped by many clients, and divs/flexbox are unreliable.
//
// Brand palette: Sage (primary) on a Cream canvas.
const LOGO_URL = "https://zensus.app/email-logo.png";
const SITE_URL = "https://zensus.app";
const SAGE = "#22C573"; // brand primary
const CREAM = "#FEF7E6"; // brand canvas
const INK = "#0f172a";
const BODY_TEXT = "#3f4a5a";
const MUTED = "#9aa0aa";
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
<body style="margin:0; padding:0; background-color:${CREAM}; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${escapeHtml(PREHEADER)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 6px 28px rgba(15,23,42,0.10); border:1px solid #f1ead8;">
          <tr>
            <td align="center" style="padding:32px 32px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;"><img src="${LOGO_URL}" width="38" height="38" alt="Zensus" style="display:block; border-radius:9px;"></td>
                  <td style="vertical-align:middle; padding-left:12px; font-family:${FONT}; font-size:22px; font-weight:700; color:${INK}; letter-spacing:-0.01em;">Zensus</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height:3px; line-height:3px; font-size:0; background-color:${SAGE};">&nbsp;</td></tr>
          <tr>
            <td style="padding:36px; font-family:${FONT}; font-size:16px; line-height:1.7; color:${BODY_TEXT};">
              <p style="margin:0 0 24px;">${safeIntro}</p>
              <p style="margin:0 0 24px;">A member of our team will get back to you, usually within one business day. If you need to add anything, just reply to this email or write to <a href="mailto:${safeFrom}" style="color:${SAGE}; text-decoration:none; font-weight:600;">${safeFrom}</a>.</p>
              <p style="margin:32px 0 0; color:${INK}; font-weight:600;">The Zensus team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 32px; border-top:1px solid #f1f3f5; font-family:${FONT}; font-size:13px; color:${MUTED};">
              Zensus &middot; <a href="${SITE_URL}" style="color:${MUTED}; text-decoration:underline;">zensus.app</a>
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
          <tr>
            <td align="center" style="padding:18px 32px; font-family:${FONT}; font-size:12px; line-height:1.5; color:${MUTED}; text-align:center;">
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
