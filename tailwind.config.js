module.exports = {
  purge: {
    content: [
      './src/**/*.html',
      './src/**/*.vue'
    ],
    safelist: [/bg-/]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
