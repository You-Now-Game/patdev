import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#faf8f2",
          50: "#fdfcf9",
          100: "#faf8f2",
          200: "#f3efe3",
        },
        sage: {
          50: "#eef4e8",
          100: "#e3ecd8",
          200: "#cfe0ba",
        },
        brand: {
          DEFAULT: "#4f8a2e",
          light: "#5fa33a",
          dark: "#3d6b23",
        },
        ink: {
          DEFAULT: "#26291f",
          light: "#6b7060",
          muted: "#9aa08b",
        },
        border: "#e7e2d3",
        stage: {
          design: "#7c5fd1",
          rough: "#e0913f",
          technical: "#3f7fe0",
          working: "#2ea88f",
          finishing: "#3fae6a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
