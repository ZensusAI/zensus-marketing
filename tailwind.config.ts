import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        display: ["Geist", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Playfair Display", "Georgia", "serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Fluid sizes for the homepage hero and section headings. They scale
      // with the viewport instead of stepping at breakpoints, so a 768px
      // tablet and a 1920px monitor each get a size that fits, not the
      // nearest breakpoint's. Measured 16 Oct 2026: the stepped scale gave a
      // 1920px screen the same 60px H1 as a 1024px one, and a 768px tablet a
      // 48px H1 that wrapped to three lines.
      //   hero:        36px at 390, 41px at 768, 49px at 1024, 57px at 1280,
      //                62px from 1440 up. The cap keeps the long second line
      //                of the H1 on one line inside the 1024px hero column
      //                (at 64px it wrapped to three lines on a 1920px screen).
      //   hero-sub:    16px on phones, 18px at 1024, 20px from 1280 up.
      //   hero-kicker: 14px on phones, 16px from 1024 up.
      //   section:     24px on phones, 34px at 1440, 36px from 1600 up.
      fontSize: {
        hero: [
          "clamp(2.25rem, 1rem + 3.2vw, 3.875rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "hero-sub": ["clamp(1rem, 0.85rem + 0.5vw, 1.25rem)", { lineHeight: "1.55" }],
        "hero-kicker": ["clamp(0.875rem, 0.8rem + 0.3vw, 1rem)", { lineHeight: "1.5" }],
        section: [
          "clamp(1.5rem, 1.15rem + 1.1vw, 2.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Homepage redesign tokens (handoff 00-overview). Cream, card, rule,
        // ink, muted text and primary already exist above as background,
        // card, border, foreground, muted-foreground and primary.
        rule: {
          DEFAULT: "hsl(var(--border))",
          soft: "hsl(var(--rule-soft))",
        },
        faint: "hsl(var(--ink-faint))",
        sage: {
          light: "hsl(var(--sage-light))",
          deep: "hsl(var(--sage-deep))",
          dark: "hsl(var(--sage-dark))",
        },
        forest: {
          DEFAULT: "hsl(var(--forest))",
          raised: "hsl(var(--forest-raised))",
          border: "hsl(var(--forest-border))",
          "border-soft": "hsl(var(--forest-border-soft))",
          foreground: "hsl(var(--forest-foreground))",
          "muted-strong": "hsl(var(--forest-muted-strong))",
          muted: "hsl(var(--forest-muted))",
          "muted-faint": "hsl(var(--forest-muted-faint))",
        },
        scenario: "hsl(var(--scenario))",
        alert: "hsl(var(--alert))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        "in-out-cubic": "cubic-bezier(0.65, 0, 0.35, 1)",
        // Homepage redesign UI transitions (handoff 00-overview).
        ui: "cubic-bezier(.2,.8,.2,1)",
      },
      keyframes: {
        // Navbar panels and the mobile sheet (handoff 01-navbar "nvIn").
        // Hero mesh waves: a very slow sideways drift (handoff 02-hero).
        "mesh-drift": {
          from: { transform: "translate3d(-2%, 0.5%, 0)" },
          to: { transform: "translate3d(2%, -0.5%, 0)" },
        },
        // Product showcase zoom marker (handoff 04-product-showcase "ssPing").
        "ring-ping": {
          "0%": { boxShadow: "0 0 0 0 rgba(72,216,138,.7)" },
          "100%": { boxShadow: "0 0 0 14px rgba(72,216,138,0)" },
        },
        "nav-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "none" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(142 71% 45% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(142 71% 45% / 0.5)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-60px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(60px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shine: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "nav-in": "nav-in 0.2s ease-out",
        "mesh-drift": "mesh-drift 40s ease-in-out infinite alternate",
        "ring-ping": "ring-ping 1.4s ease-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.7s ease-out forwards",
        "slide-in-right": "slide-in-right 0.7s ease-out forwards",
        shine: "shine var(--duration, 14s) linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;