const GREEN = "#21C55C";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const MUTED = "rgba(247,245,242,0.4)";
const AXIS = "rgba(247,245,242,0.22)";
const GRID = "rgba(247,245,242,0.08)";
const BG = "#0A0A0B";

const svgProps = {
  width: "32",
  height: "32",
  viewBox: "0 0 32 32",
  "aria-hidden": true,
  focusable: false as const,
};

export const GlyphRunway = () => (
  <svg {...svgProps}>
    <line x1="3" y1="26" x2="29" y2="26" stroke={AXIS} strokeWidth="0.8" />
    <line x1="3" y1="26" x2="3" y2="5" stroke={AXIS} strokeWidth="0.8" />
    <line
      x1="3"
      y1="16"
      x2="29"
      y2="16"
      stroke={GRID}
      strokeDasharray="2 2"
      strokeWidth="0.6"
    />
    <rect x="5" y="10" width="2.8" height="16" rx="0.6" fill={GREEN} />
    <rect x="9" y="11" width="2.8" height="15" rx="0.6" fill={GREEN} />
    <rect x="13" y="13" width="2.8" height="13" rx="0.6" fill={AMBER} />
    <rect x="17" y="16" width="2.8" height="10" rx="0.6" fill={AMBER} opacity="0.85" />
    <rect x="21" y="20" width="2.8" height="6" rx="0.6" fill={RED} opacity="0.85" />
    <rect x="25" y="23" width="2.8" height="3" rx="0.6" fill={RED} />
  </svg>
);

export const GlyphFragmented = () => (
  <svg {...svgProps}>
    <line x1="3" y1="26" x2="29" y2="26" stroke={AXIS} strokeWidth="0.8" />
    <line x1="3" y1="26" x2="3" y2="5" stroke={AXIS} strokeWidth="0.8" />
    <line
      x1="3"
      y1="12"
      x2="29"
      y2="12"
      stroke={GRID}
      strokeDasharray="2 2"
      strokeWidth="0.6"
    />
    <line
      x1="3"
      y1="20"
      x2="29"
      y2="20"
      stroke={GRID}
      strokeDasharray="2 2"
      strokeWidth="0.6"
    />
    <line
      x1="8"
      y1="9.2"
      x2="13.6"
      y2="14"
      stroke="rgba(247,245,242,0.25)"
      strokeDasharray="2 2"
      strokeWidth="0.7"
    />
    <line
      x1="13.6"
      y1="14"
      x2="22"
      y2="11.2"
      stroke="rgba(247,245,242,0.2)"
      strokeDasharray="2 2"
      strokeWidth="0.7"
    />
    <circle cx="8" cy="9" r="2.1" fill={GREEN} stroke={BG} strokeWidth="0.8" />
    <circle cx="14" cy="14" r="2.1" fill={AMBER} stroke={BG} strokeWidth="0.8" opacity="0.9" />
    <circle cx="22" cy="11" r="2.1" fill={AMBER} stroke={BG} strokeWidth="0.8" opacity="0.7" />
    <circle cx="10" cy="22" r="2.1" fill={RED} stroke={BG} strokeWidth="0.8" opacity="0.85" />
    <circle cx="18" cy="23" r="2.1" fill={MUTED} stroke={BG} strokeWidth="0.8" />
    <circle cx="25" cy="20" r="2.1" fill={RED} stroke={BG} strokeWidth="0.8" />
  </svg>
);

export const GlyphFork = () => (
  <svg {...svgProps} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="26" x2="29" y2="26" stroke={AXIS} strokeWidth="0.8" />
    <line x1="3" y1="26" x2="3" y2="5" stroke={AXIS} strokeWidth="0.8" />
    <path d="M5 22 L15 16" stroke="rgba(247,245,242,0.55)" strokeWidth="2.4" fill="none" />
    <path d="M15 16 L25 7" stroke={GREEN} strokeWidth="2.6" fill="none" />
    <path d="M15 16 L25 25" stroke={RED} strokeWidth="2.6" fill="none" />
    <path d="M15 12.8 L18 16 L15 19.2 L12 16 Z" fill={AMBER} stroke={BG} strokeWidth="0.6" />
    <circle cx="25" cy="7" r="2.4" fill={GREEN} stroke={BG} strokeWidth="0.8" />
    <circle cx="25" cy="25" r="2.4" fill={RED} stroke={BG} strokeWidth="0.8" />
  </svg>
);

export const GlyphCliff = () => (
  <svg {...svgProps} strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="glyph-cliff-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={GREEN} stopOpacity="0.45" />
        <stop offset="55%" stopColor={AMBER} stopOpacity="0.35" />
        <stop offset="72%" stopColor={RED} stopOpacity="0.3" />
        <stop offset="100%" stopColor={RED} stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <line x1="3" y1="26" x2="29" y2="26" stroke={AXIS} strokeWidth="0.8" />
    <line x1="3" y1="26" x2="3" y2="5" stroke={AXIS} strokeWidth="0.8" />
    <line
      x1="3"
      y1="14"
      x2="29"
      y2="14"
      stroke={GRID}
      strokeDasharray="2 2"
      strokeWidth="0.6"
    />
    <path
      d="M4 12 L18 12 L21 23 L28 23 L28 26 L4 26 Z"
      fill="url(#glyph-cliff-grad)"
      stroke="none"
    />
    <path d="M4 12 L18 12" stroke={GREEN} strokeWidth="2.2" fill="none" />
    <path d="M18 12 L21 23" stroke={AMBER} strokeWidth="2.2" fill="none" />
    <path d="M21 23 L28 23" stroke={RED} strokeWidth="2.2" fill="none" />
    <circle cx="18" cy="12" r="2" fill={AMBER} stroke={BG} strokeWidth="0.6" />
    <circle cx="21" cy="23" r="2" fill={RED} stroke={BG} strokeWidth="0.6" />
  </svg>
);
