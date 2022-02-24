module.exports = {
  purge: {
    content: [
      './src/**/*.html',
      './src/**/*.vue'
    ],
    safelist: [/bg-/, "overflow-auto", "h-full", 'underline']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxHeight: {
        '0': '0',
        '1/5': "20%",
        '1/4': '25%',
        '2/5': "40%",
        '1/2': '50%',
        '3/5': '60%',
        '3/4': '75%',
        '4/5': '80%',
        'full': '100%',
        'screen': "100vh"
      },
      maxWidth: {
        '0': '0',
        '1/5': "20%",
        '1/4': '25%',
        '2/5': "40%",
        '1/2': '50%',
        '3/5': '60%',
        '3/4': '75%',
        '4/5': '80%',
        'full': '100%',
        'screen': "100vh"
      },
      margin: {
        '-screen': '-90vh'
      }
    },
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
