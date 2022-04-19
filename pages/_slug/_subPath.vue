<template>
  <Main :edittable="false" />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";

export default Vue.extend({
  head() {
    const swinkApiKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFpbXMiOlsic3dpbms6Y3JlYXRlOmxpbms6aHR0cHM6Ly9jYXNjYWRlLnBhZ2UvIl0sImlhdCI6MTYzMTIwNTI5OSwiYXVkIjoiYXBpLnN3LmluayIsInN1YiI6IlEyUk5hSkswTHFmd2xITEtVZU1LMHJReHA2NTMiLCJqdGkiOiJpeDk3RUVRRksyTGwzVlBvSUxzTCJ9.p0RgNdjSmJFeQNZ5qawrQwMzmLnGLRNDuiFXKHPPOlY`;
    const dotStyle = "Circle";
    const font = "rounded";
    const emoji = ["🌐", "🎟", "🧊", "🏷", "🧩", "🧭"][
      Math.floor(Math.random() * 5)
    ];
    let timelineName = "";
    let url = "";
    if (process.server) {
      timelineName = this.$ssrContext.req.timelinePath;
      url = this.$ssrContext.url;
    } else {
      timelineName = this.$store.state.timelineName;
      url = this.$route.path;
    }
    url = `https://cascade.page${url}`;
    const innerText = `Cascade: ${emoji}${timelineName}`;
    return {
      title: `@${this.$store.state.timelinePath} - Cascade`,
      meta: [
        {
          property: "og:image",
          content: `https://api.sw.ink/v0/swink?key=${swinkApiKey}&dotStyle=${dotStyle}&font=${font}&innerText=${innerText}&url=${url}`,
        },
        {
          name: "viewport",
          content: "width=device-width, user-scalable=no",
        },
      ],
    };
  },
  components: { Main },
  middleware(context) {
    const theme = context.app.$cookies.get("theme");
    if (theme) {
      context.store.commit("sidebar/setDarkMode", theme);
    }
    const sidebarSide = context.app.$cookies.get("sbs");
    if (sidebarSide) {
      context.store.commit("sidebar/setPosition", sidebarSide);
    }
    const width = context.app.$cookies.get("sbw");
    if (width) {
      context.store.commit("sidebar/setWidth", parseInt(width));
    }
  },
});
</script>
