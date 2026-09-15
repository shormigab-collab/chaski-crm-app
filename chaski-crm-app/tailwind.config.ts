import type { Config } from "tailwindcss";

// Misma paleta de marca de usechaski.com, para que el CRM se sienta
// parte de la misma familia visual aunque viva en su propio proyecto.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#F2EFFF",
          100: "#CAC5E6",
          200: "#A59ED0",
          300: "#8178BA",
          400: "#5C52A3",
          500: "#3B2F8F",
          600: "#29206F",
          700: "#211A57",
          800: "#1C1647",
          900: "#17133A",
        },
        coral: {
          50: "#FFF3F2",
          100: "#FFE4E2",
          200: "#FFCAC5",
          300: "#FFAEA7",
          400: "#FF8C82",
          500: "#FF6B5F",
          600: "#D65649",
          700: "#B34335",
          800: "#9C3729",
          900: "#8A2E1F",
        },
        gold: {
          50: "#FEF6E7",
          100: "#FCE9C4",
          400: "#F7C05C",
          500: "#F5A524",
          600: "#D9860B",
        },
        cream: "#FFF9F4",
        ink: "#17133A",
        lavender: "#F2EFFF",
        border: "#E7E2EF",
      },
    },
  },
  plugins: [],
};
export default config;
