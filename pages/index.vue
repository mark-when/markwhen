<template>
  <Main :edittable="true" />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";

export default Vue.extend({
  head() {
    const swinkApiKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFpbXMiOlsic3dpbms6Y3JlYXRlOmxpbms6aHR0cHM6Ly9jYXNjYWRlLnBhZ2UvIl0sImlhdCI6MTYzMTIwNTI5OSwiYXVkIjoiYXBpLnN3LmluayIsInN1YiI6IlEyUk5hSkswTHFmd2xITEtVZU1LMHJReHA2NTMiLCJqdGkiOiJpeDk3RUVRRksyTGwzVlBvSUxzTCJ9.p0RgNdjSmJFeQNZ5qawrQwMzmLnGLRNDuiFXKHPPOlY`
    const dotStyle = "Circle"
    const font = "rounded"
    const innerText = `Cascade: Eventful             Timelines           `
    return {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
        {
          property: "og:image",
          content: `https://api.sw.ink/v0/swink?key=${swinkApiKey}&dotStyle=${dotStyle}&font=${font}&innerText=${innerText}&url=https://cascade.page/`,
        },
      ],
    };
  },
  components: { Main },
});
</script>
