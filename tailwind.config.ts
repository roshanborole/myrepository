import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "obsidian": "#06080b",
        "charcoal": "#0c0e12",
        "cardBg": "#0f1117",
        "emeraldGlow": "#00E676",
        "emeraldAccent": "#00ff87",
        "borderSubtle": "rgba(255, 255, 255, 0.08)",
        "borderActive": "rgba(0, 230, 118, 0.35)",
        "surface-bright": "#37393e",
        "tertiary": "#cccfd1",
        "on-secondary": "#233144",
        "surface-container-low": "#1a1c20",
        "surface-container-lowest": "#06080b",
        "tertiary-fixed-dim": "#c4c7c9",
        "on-error-container": "#ffdad6",
        "primary-container": "#2ecc71",
        "surface-container-high": "#282a2e",
        "surface-tint": "#4ae183",
        "surface-dim": "#111318",
        "on-background": "#e2e2e8",
        "secondary-fixed": "#d5e3fd",
        "tertiary-container": "#b0b3b5",
        "on-tertiary": "#2d3133",
        "primary": "#2ecc71",
        "primary-glow": "#00ff87",
        "on-tertiary-container": "#424547",
        "background": "#080a0e",
        "on-secondary-container": "#abb9d2",
        "surface-container": "#14171d",
        "surface-variant": "#1c212a",
        "inverse-primary": "#006d37",
        "inverse-surface": "#e2e2e8",
        "on-tertiary-fixed-variant": "#444749",
        "on-error": "#690005",
        "on-primary": "#003919",
        "on-secondary-fixed": "#0d1c2f",
        "on-surface-variant": "#9aa4b2",
        "secondary-fixed-dim": "#b9c7e0",
        "secondary-container": "#3c4a5e",
        "error-container": "#93000a",
        "on-secondary-fixed-variant": "#3a485c",
        "outline-variant": "#1d252f",
        "on-surface": "#e2e2e8",
        "primary-fixed-dim": "#4ae183",
        "primary-fixed": "#6bfe9c",
        "inverse-on-surface": "#2f3035",
        "error": "#ffb4ab",
        "on-tertiary-fixed": "#191c1e",
        "on-primary-fixed": "#00210c",
        "surface": "#0c0e12",
        "secondary": "#b9c7e0",
        "outline": "#2b3542",
        "on-primary-container": "#005027",
        "on-primary-fixed-variant": "#005228",
        "surface-container-highest": "#222730",
        "tertiary-fixed": "#e0e3e5"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "unit": "8px",
        "stack-lg": "24px",
        "stack-md": "12px",
        "section-gap": "56px",
        "container-padding": "24px",
        "stack-sm": "4px",
        "gutter": "16px"
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        "headline-lg": ["var(--font-montserrat)", "sans-serif"],
        "display-lg": ["var(--font-montserrat)", "sans-serif"],
        "body-md": ["var(--font-inter)", "sans-serif"],
        "label-caps": ["var(--font-jetbrains-mono)", "monospace"],
        "headline-md": ["var(--font-montserrat)", "sans-serif"],
        "body-lg": ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        "neon-green": "0 0 20px -2px rgba(0, 230, 118, 0.45)",
        "subtle-green": "0 0 12px 0px rgba(0, 230, 118, 0.15)",
        "emerald-glow": "0 0 25px rgba(46, 204, 113, 0.25)",
        "emerald-lg": "0 0 45px rgba(0, 255, 135, 0.2)",
        "glass": "inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 8px 32px 0 rgba(0, 0, 0, 0.4)"
      }
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/forms'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/container-queries')
  ],
};

export default config;
