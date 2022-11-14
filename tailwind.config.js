/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
        height: "height"
      },
    },
  },
  safelist: ["underline"],
  plugins: [],
  darkMode: "class",
};
