import type { Config } from "tailwindcss";

/**
 * Sistema de diseño "Núcleo Neuronal Kinético" v2.0
 * Interfaz oscura, glassmorphism y jerarquía por elevación + color.
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        elevated: "0 12px 32px rgba(0, 0, 0, 0.4)",
        glow: "0 0 15px rgba(59, 130, 246, 0.5)",
        "glow-rocket": "0 8px 24px rgba(255, 107, 53, 0.3)",
        "glow-assistant": "0 8px 24px rgba(139, 92, 246, 0.3)",
      },
      colors: {
        ink: {
          950: "#0B0F19",
          900: "#151B2E",
          800: "#1E2542",
        },
        accent: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        orange: {
          50: "#FFF3EE",
          100: "#FFE3D6",
          200: "#FFC4AC",
          300: "#FFA078",
          400: "#FF8454",
          500: "#FF6B35",
          600: "#E55525",
          700: "#C2421A",
          800: "#9E3614",
          900: "#7C2C10",
        },
        rocket: {
          400: "#FF8454",
          500: "#FF6B35",
          600: "#E55525",
        },
        assistant: {
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        teal: {
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "assistant-gradient": "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 300ms ease-out",
        "fade-in": "fade-in 300ms ease-out",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
