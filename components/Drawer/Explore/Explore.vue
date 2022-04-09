<template>
  <div
    class="
      dark:bg-gray-900
      bg-slate-200
      h-full
      w-full
      overflow-scroll
      pb-5
      dark:text-gray-300
      p-2
    "
  >
    <h3 class="text-xl font-bold ml-1 text-gray-500">Explore</h3>
    <div class="flex flex-row items-center justify-center" v-if="loading">
      <svg
        class="animate-spin h-3 w-3 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path></svg
      >Loading...
    </div>
    <cascades v-else :cascades="cascades" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Cascades from "./Cascades.vue";

export default Vue.extend({
  components: { Cascades },
  data() {
    return {
      cascades: [],
      loading: true,
    };
  },
  mounted() {
    this.getExplore();
  },
  methods: {
    async getExplore() {
      this.loading = true;
      this.cascades = (await this.$rpc.get("/api/explore")).data.cascades;
      this.loading = false;
    },
  },
});
</script>

<style>
</style>