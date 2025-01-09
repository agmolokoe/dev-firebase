import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#000000", // TikTok Black
        foreground: "#FFFFFF", // TikTok White
        primary: {
          DEFAULT: "#FE2C55", // TikTok Red
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#25F4EE", // TikTok Blue
          foreground: "#000000",
        },
        success: {
          DEFAULT: "#00F076", // TikTok Green
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#FE2C55", // TikTok Red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1F1F1F", // Darker shade of black
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#25F4EE", // TikTok Blue
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#121212", // Slightly lighter black
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;