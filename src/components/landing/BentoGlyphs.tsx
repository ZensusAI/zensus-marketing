const GREEN = "#21C55C";
const RED = "#EF4444";
const MUTED_FG_55 = "rgba(247,245,242,0.55)";
const MUTED_FG_50 = "rgba(247,245,242,0.5)";
const MUTED_FG_45 = "rgba(247,245,242,0.45)";
const MUTED_FG_40 = "rgba(247,245,242,0.4)";
const MUTED_FG_25 = "rgba(247,245,242,0.25)";
const MUTED_FG_22 = "rgba(247,245,242,0.22)";
const MUTED_FG_12 = "rgba(247,245,242,0.12)";
const MUTED_FG_06 = "rgba(247,245,242,0.06)";
const BG = "#0A0A0B";

const svgProps = {
  width: "32",
  height: "32",
  viewBox: "0 0 32 32",
  "aria-hidden": true,
  focusable: false as const,
};

export const GlyphConnect = () => (
  <svg {...svgProps} strokeLinecap="round" strokeLinejoin="round">
    <rect
      x="4"
      y="12"
      width="8"
      height="8"
      rx="2"
      fill={MUTED_FG_06}
      stroke={MUTED_FG_50}
      strokeWidth="1.4"
    />
    <rect x="20" y="12" width="8" height="8" rx="2" fill={GREEN} stroke={BG} strokeWidth="0.8" />
    <line x1="12" y1="16" x2="20" y2="16" stroke={GREEN} strokeWidth="2.2" />
    <circle cx="16" cy="16" r="2" fill={GREEN} stroke={BG} strokeWidth="0.6" />
  </svg>
);

export const GlyphWebhookSync = () => (
  <svg {...svgProps} strokeLinecap="round" strokeLinejoin="round">
    <path
      d="M11 4 L6 16 L10 16 L8 24 L16 13 L12 13 L15 4 Z"
      fill={GREEN}
      stroke={BG}
      strokeWidth="0.8"
    />
    <path d="M18 16 L22 16" stroke={MUTED_FG_55} strokeWidth="1.8" />
    <path
      d="M21 13.5 L23.5 16 L21 18.5"
      stroke={MUTED_FG_55}
      strokeWidth="1.8"
      fill="none"
    />
    <circle cx="27" cy="16" r="5" fill="none" stroke={GREEN} strokeWidth="0.6" opacity="0.22" />
    <circle cx="27" cy="16" r="3.2" fill="none" stroke={GREEN} strokeWidth="0.8" opacity="0.5" />
    <circle cx="27" cy="16" r="1.8" fill={GREEN} stroke={BG} strokeWidth="0.7" />
  </svg>
);

export const GlyphZeroCashDate = () => (
  <svg {...svgProps} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="26" x2="29" y2="26" stroke={MUTED_FG_22} strokeWidth="0.8" />
    <line x1="3" y1="26" x2="3" y2="5" stroke={MUTED_FG_22} strokeWidth="0.8" />
    <line
      x1="3"
      y1="20"
      x2="29"
      y2="20"
      stroke={MUTED_FG_12}
      strokeDasharray="2 2"
      strokeWidth="0.6"
    />
    <path d="M4 7 L19 20" stroke={GREEN} strokeWidth="2.2" fill="none" />
    <path
      d="M19 20 L28 24"
      stroke={RED}
      strokeWidth="1.5"
      strokeDasharray="2 2"
      fill="none"
      opacity="0.6"
    />
    <line x1="19" y1="20" x2="19" y2="26" stroke={RED} strokeWidth="1.4" />
    <circle cx="19" cy="20" r="2.6" fill={RED} stroke={BG} strokeWidth="0.8" />
  </svg>
);

export const GlyphVendorNormalize = () => (
  <svg {...svgProps} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="26" x2="29" y2="26" stroke={MUTED_FG_22} strokeWidth="0.8" />
    <line x1="3" y1="26" x2="3" y2="5" stroke={MUTED_FG_22} strokeWidth="0.8" />
    <rect
      x="4"
      y="7"
      width="10"
      height="3"
      rx="1"
      fill={MUTED_FG_45}
      stroke={MUTED_FG_25}
      strokeWidth="0.5"
    />
    <rect
      x="5"
      y="12.5"
      width="9"
      height="3"
      rx="1"
      fill={MUTED_FG_50}
      stroke={MUTED_FG_25}
      strokeWidth="0.5"
    />
    <rect
      x="4"
      y="18"
      width="10"
      height="3"
      rx="1"
      fill={MUTED_FG_40}
      stroke={MUTED_FG_25}
      strokeWidth="0.5"
    />
    <path d="M16 14 L19 14" stroke={MUTED_FG_50} strokeWidth="1.5" />
    <path
      d="M18 12 L20 14 L18 16"
      stroke={MUTED_FG_50}
      strokeWidth="1.5"
      fill="none"
    />
    <rect
      x="22"
      y="12.5"
      width="7"
      height="3"
      rx="1"
      fill={GREEN}
      stroke={BG}
      strokeWidth="0.6"
    />
  </svg>
);
