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
        background: "#F1F1F1", // level 0 canvas background
        foreground: "#1A1C1C", // on-surface text
        primary: {
          DEFAULT: "#0A1422", // deep navy anchor
          container: "#1F2937", // primary container
        },
        secondary: {
          DEFAULT: "#006B56",
          container: "#65F7D0",
        },
        success: {
          DEFAULT: "#00AD80", // success teal
        },
        focus: {
          teal: "#30CFAA", // vibrant teal focus/action color
        },
        surface: {
          DEFAULT: "#F9F9F9",
          white: "#FFFFFF", // Level 1 surface card background
          dim: "#DADADA",
          container: "#EEEEEE",
          high: "#E8E8E8",
        },
        border: {
          light: "#E5E7EB", // Level 1 surface border
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        worksans: ["Work Sans", "sans-serif"],
      },
      borderRadius: {
        sm: "0.125rem", // 2px soft radius
        DEFAULT: "0.25rem", // 4px soft radius
        md: "0.375rem",
        lg: "0.5rem", // 8px large containers
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        base: "8px",
        gutter: "24px",
        "margin-mobile": "16px",
        "section-gap": "64px",
        "container-max": "1280px",
      },
    },
  },
  plugins: [],
};
export default config;

