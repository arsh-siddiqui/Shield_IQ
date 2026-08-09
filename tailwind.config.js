/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF4FF",
          100: "#DBE6FE",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        secondary: {
          DEFAULT: "#14B8A6",
          50: "#F0FDFA",
          100: "#CCFBF1",
          500: "#14B8A6",
          600: "#0D9488",
        },
        accent: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
        },
        surface: "#F8FAFC",
        ink: {
          DEFAULT: "#1E293B",
          light: "#64748B",
          faint: "#94A3B8",
        },
        danger: {
          DEFAULT: "#EF4444",
          50: "#FEF2F2",
          500: "#EF4444",
        },
        success: {
          DEFAULT: "#22C55E",
          50: "#F0FDF4",
          500: "#22C55E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(30, 41, 59, 0.04), 0 8px 24px rgba(30, 41, 59, 0.06)",
        softer: "0 1px 3px rgba(30, 41, 59, 0.04)",
        lift: "0 12px 32px rgba(37, 99, 235, 0.14)",
        glow: "0 0 0 4px rgba(37, 99, 235, 0.10)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
