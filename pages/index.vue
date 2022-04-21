<template>
  <Main />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";
import { mapState } from "vuex";
import { NuxtCookies } from "cookie-universal-nuxt";

export default Vue.extend({
  head() {
    return {
      meta: [
        // {
        //   name: "viewport",
        //   content: "width=device-width, user-scalable=no",
        // },
        // {
        //   property: "og:image",
        //   content: `https://api.sw.ink/v0/swink?key=${swinkApiKey}&dotStyle=${dotStyle}&font=${font}&innerText=${innerText}&url=https://cascade.page/`,
        // },
      ],
    };
  },
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
  components: { Main },
  computed: mapState(["dirtyEditor"]),
  watch: {
    dirtyEditor(val) {
      if (val && !process.env.DEV) {
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
