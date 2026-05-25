import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--background)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--primary)",
        },
        muted: "var(--muted)",
        border: "var(--border)",
        success: "var(--success)",
        error: "var(--error)",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(26, 26, 46, 0.04), 0 2px 8px -1px rgba(26, 26, 46, 0.02)",
        cardHover: "0 12px 30px -4px rgba(26, 26, 46, 0.08), 0 4px 12px -2px rgba(26, 26, 46, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
