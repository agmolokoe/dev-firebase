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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0047AB", // Royal Blue
          foreground: "#FFFFFF", // White
        },
        secondary: {
          DEFAULT: "#002366", // Darker Royal Blue
          foreground: "#FFFFFF", // White
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8F9FA", // Light Gray
          foreground: "#0047AB", // Royal Blue
        },
        accent: {
          DEFAULT: "#E9ECEF", // Light Gray
          foreground: "#0047AB", // Royal Blue
        },
        card: {
          DEFAULT: "#FFFFFF", // White
          foreground: "#000000", // Black
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