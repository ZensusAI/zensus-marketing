import { escapeHtml } from "./sanitize.js";

const LOGO_URL = "https://zensus.app/email-logo.png";
const SITE_URL = "https://zensus.app";
const SAGE = "#22C573";
const CREAM = "#FEF7E6";
const INK = "#0f172a";
const BODY_TEXT = "#3f4a5a";
const MUTED = "#9aa0aa";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export interface ToolEmailShellInput {
  preheader: string;
  title: string;
  bodyHtml: string;
  bodyText: string;
  from: string;
}

export function toolEmailText({
  title,
  bodyText,
  from,
}: ToolEmailShellInput): string {
  return (
    `${title}\n\n` +
    `${bodyText}\n\n` +
    `Questions? Reply to this email or write to ${from}.\n\n` +
    `Try Zensus free: ${SITE_URL}/pricing\n\n` +
    `The Zensus team\n${SITE_URL}`
  );
}

export function toolEmailHtml({
  preheader,
  title,
  bodyHtml,
  from,
}: ToolEmailShellInput): string {
  const safeTitle = escapeHtml(title);
  const safeFrom = escapeHtml(from);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${safeTitle}</title>
</head>
<body style="margin:0; padding:0; background-color:${CREAM}; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${escapeHtml(preheader)}</div>
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
              <h1 style="margin:0 0 24px; font-size:22px; line-height:1.3; color:${INK};">${safeTitle}</h1>
              ${bodyHtml}
              <p style="margin:32px 0 0; color:${INK}; font-weight:600;">The Zensus team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 32px; border-top:1px solid #f1f3f5; font-family:${FONT}; font-size:13px; color:${MUTED};">
              Zensus &middot; <a href="${SITE_URL}/pricing" style="color:${SAGE}; text-decoration:none; font-weight:600;">Start your free trial</a>
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
          <tr>
            <td align="center" style="padding:18px 32px; font-family:${FONT}; font-size:12px; line-height:1.5; color:${MUTED}; text-align:center;">
              You are receiving this because you requested a detailed breakdown from a Zensus calculator at <a href="${SITE_URL}" style="color:${MUTED}; text-decoration:underline;">zensus.app</a>. Questions? <a href="mailto:${safeFrom}" style="color:${MUTED}; text-decoration:underline;">${safeFrom}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
