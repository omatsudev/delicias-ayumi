import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "oklch(var(--c-primary) / <alpha-value>)",
        "primary-soft": "oklch(var(--c-primary-soft) / <alpha-value>)",
        accent: "oklch(var(--c-accent) / <alpha-value>)",
        "accent-soft": "oklch(var(--c-accent-soft) / <alpha-value>)",
        bg: "oklch(var(--c-bg) / <alpha-value>)",
        surface: "oklch(var(--c-surface) / <alpha-value>)",
        "surface-2": "oklch(var(--c-surface-2) / <alpha-value>)",
        line: "oklch(var(--c-line) / <alpha-value>)",
        "line-soft": "oklch(var(--c-line-soft) / <alpha-value>)",
        fg: "oklch(var(--c-fg) / <alpha-value>)",
        "fg-soft": "oklch(var(--c-fg-soft) / <alpha-value>)",
        "fg-muted": "oklch(var(--c-fg-muted) / <alpha-value>)",
        danger: "oklch(var(--c-danger) / <alpha-value>)",
        warn: "oklch(var(--c-warn) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        script: ["Caveat", "Sacramento", "cursive"],
        sans: ["Work Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "18px",
        xl: "28px",
        "2xl": "40px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(40,30,30,0.06)",
        md: "0 6px 16px -6px rgba(40,30,30,0.12)",
        lg: "0 24px 48px -16px rgba(40,30,30,0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
