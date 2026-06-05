import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 24px 70px -32px rgba(15, 23, 42, 0.45)",
      },
      colors: {
        ink: {
          950: "#0b1120",
        },
        ember: {
          400: "#fb923c",
          500: "#f97316",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;