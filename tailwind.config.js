/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const rem = (px) => {
  return px * 0.0625 + "rem";
};
module.exports = {
  darkMode: "class",
  rootFontSize: 10,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./helper/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      ...defaultTheme.screens,
      "max-sm": { max: "639px" },
      "max-md": { max: "767px" },
      "max-lg": { max: "1023px" },
      "max-xl": { max: "1279px" },
      "max-2xl": { max: "1535px" },
    },
    fontFamily: {
      sans: ["Poppins", "Helvetica Now Display", "sans-serif"],
      title: ["Axiforma"],
    },
    container: {
      center: true,
      padding: "1rem",
    },
    fontWeight: {
      100: 100,
      200: 200,
      300: 300,
      400: 400,
      500: 500,
      600: 600,
      700: 700,
      800: 800,
      900: 900,
    },
    fontSize: {
      10: rem(10),
      12: rem(12),
      14: rem(14),
      16: rem(16),
      18: rem(18),
      20: rem(20),
      22: rem(22),
      24: rem(24),
      32: rem(32),
      42: rem(42),
      68: rem(68),
      90: rem(90),
    },
    extend: {
      borderRadius: {
        "4xl": rem(32),
      },
      aspectRatio: {
        "4/3": "4/3",
        "2/3": "2/3",
      },
      colors: {
        red: {
          DEFAULT: "#F9727A",
          100: "#FFDDE0",
          200: "#E8807E",
        },
        primary: {
          DEFAULT: "#5858ED",
          100: "#B8B8FF",
        },
        gray: {
          100: "#CECECE",
          200: "#898989",
          300: "#585858",
          400: "#202020",
          500: "#181818",
          600: "#161616",
        },
      },
      boxShadow: {
        "glow-1": "-13px 23px 50px",
        "glow-2": "6px 7px 50px",
      },
    },
  },
  plugins: [],
};
