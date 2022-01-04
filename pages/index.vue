<template>
  <Main :edittable="true" />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";
import { mapState } from "vuex";

export default Vue.extend({
  head() {
    const swinkApiKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFpbXMiOlsic3dpbms6Y3JlYXRlOmxpbms6aHR0cHM6Ly9jYXNjYWRlLnBhZ2UvIl0sImlhdCI6MTYzMTIwNTI5OSwiYXVkIjoiYXBpLnN3LmluayIsInN1YiI6IlEyUk5hSkswTHFmd2xITEtVZU1LMHJReHA2NTMiLCJqdGkiOiJpeDk3RUVRRksyTGwzVlBvSUxzTCJ9.p0RgNdjSmJFeQNZ5qawrQwMzmLnGLRNDuiFXKHPPOlY`;
    const dotStyle = "Circle";
    const font = "rounded";
    const innerText = `Cascade: Eventful             Timelines           `;
    return {
      meta: [
        // {
        //   name: "viewport",
        //   content: "width=device-width, user-scalable=no",
        // },
        {
          property: "og:image",
          content: `https://api.sw.ink/v0/swink?key=${swinkApiKey}&dotStyle=${dotStyle}&font=${font}&innerText=${innerText}&url=https://cascade.page/`,
        },
      ],
    };
  },
  components: { Main },
  computed: mapState(["dirtyEditor"]),
  watch: {
    dirtyEditor(val) {
      if (val) {
        window.onbeforeunload = function (e: any) {
          return "Exit this page? Unsaved changes will be lost.";
        };
      } else {
        window.onbeforeunload = null;
      }
    },
  },
});
</script>
