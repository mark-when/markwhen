export default {
  loading: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Cascade.page",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no",
      },
      {
        hid: "description",
        name: "description",
        content: "Create a timeline of meaningful events",
      },
      { name: "format-detection", content: "telephone=no" },
      {
        property: "description",
        content: "Create a timeline of meaningful events",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
  },

  server: {
    host: "0.0.0.0",
    port: process.env.PORT || "3001",
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: "~/plugins/rpc", mode: "client" }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
  ],

  serverMiddleware: {
    "/": "~/server-middleware/index",
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "cookie-universal-nuxt",
    "@nuxt/content"
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    browserBaseUrl: "/",
    proxyHeaders: false,
    credentials: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // transpile: ["nuxt-hammer"]
  },

  publicRuntimeConfig: {
    dev: process.env.DEV,
  },
};
