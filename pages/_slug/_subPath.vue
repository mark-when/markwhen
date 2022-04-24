<template>
  <Main :edittable="false" />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  computed: mapGetters(["metadata"]),
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
  components: { Main },
  middleware(context) {
    context.store.commit("setEdittable", false);
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
