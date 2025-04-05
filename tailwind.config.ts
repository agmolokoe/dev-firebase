
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
        background: "#000000", // Black
        foreground: "#FFFFFF", // White
        primary: {
          DEFAULT: "#2DD4BF", // Teal
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#3B82F6", // Royal Blue
          foreground: "#000000",
        },
        success: {
          DEFAULT: "#00F076", // Green
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#EF4444", // Red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1F1F1F", // Darker shade of black
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#2DD4BF", // Teal
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#121212", // Slightly lighter black
          foreground: "#FFFFFF",
        },
        teal: {
          400: "#2DD4BF",
          500: "#14B8A6",
        },
        blue: {
          500: "#3B82F6",
          600: "#2563EB",
        }
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "0 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(45, 212, 191, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(45, 212, 191, 0.8)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce": "bounce 1s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "glow": "glow 2s infinite ease-in-out",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.1)',
        'glow-teal': '0 0 15px rgba(45, 212, 191, 0.5)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
