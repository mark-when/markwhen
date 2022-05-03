<template>
  <Main />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";
import { mapGetters } from "vuex";
import { NuxtCookies } from "cookie-universal-nuxt";

export default Vue.extend({
  head() {
    const meta = [
      {
        name: "viewport",
        content: "width=device-width, user-scalable=no",
      },
    ];
    if (this.metadata.description) {
      meta.push({
        name: "description",
        content: this.metadata.description,
      });
    }
    return {
      title: this.metadata.title
        ? `${this.metadata.title} - Cascade.page`
        : `Cascade.page`,
      meta,
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
    const hideNowLine = context.app.$cookies.get('hnl')
    if (hideNowLine) {
      context.store.commit('sidebar/setHideNowLine', hideNowLine)
    }
  },
  components: { Main },
  computed: mapGetters(["metadata"]),
});
</script>
