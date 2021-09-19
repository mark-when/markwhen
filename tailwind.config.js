module.exports = {
  purge: {
    content: [
      './src/**/*.html',
      './src/**/*.vue'
    ],
    safelist: [/bg-/, "overflow-auto", "h-full"]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ["disabled"],
      textColor: ["disabled"],
      cursor: ["disabled"]
    },
  },
  plugins: [],
}
