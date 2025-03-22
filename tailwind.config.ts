import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
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
        // Game specific colors
        "game-bg": {
          start: "hsl(var(--game-bg-start))",
          end: "hsl(var(--game-bg-end))",
        },
        tile: {
          safe: "hsl(var(--tile-safe))",
          mine: "hsl(var(--tile-mine))",
          hover: "hsl(var(--tile-hover))",
        },
        glow: {
          primary: "hsl(var(--glow-primary))",
          secondary: "hsl(var(--glow-secondary))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        shake: {
          "0%, 100%": { transform: "rotate(0)" },
          "25%": { transform: "rotate(5deg)" },
          "50%": { transform: "rotate(0)" },
          "75%": { transform: "rotate(-5deg)" },
        },
        glow: {
          "0%, 100%": {
            boxShadow:
              "0 0 5px hsl(var(--glow-primary)), 0 0 10px hsl(var(--glow-primary)), 0 0 15px hsl(var(--glow-primary) / 0.8)",
          },
          "50%": {
            boxShadow:
              "0 0 10px hsl(var(--glow-primary)), 0 0 20px hsl(var(--glow-primary)), 0 0 30px hsl(var(--glow-primary) / 0.8)",
          },
        },
        "glow-pink": {
          "0%, 100%": {
            boxShadow:
              "0 0 5px hsl(var(--glow-secondary)), 0 0 10px hsl(var(--glow-secondary)), 0 0 15px hsl(var(--glow-secondary) / 0.8)",
          },
          "50%": {
            boxShadow:
              "0 0 10px hsl(var(--glow-secondary)), 0 0 20px hsl(var(--glow-secondary)), 0 0 30px hsl(var(--glow-secondary) / 0.8)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
        glow: "glow 2s infinite",
        "glow-pink": "glow-pink 2s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

