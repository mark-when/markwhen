<template>
  <div
    class="flex flex-row"
    style="
      flex-wrap: nowrap;
      overflow-x: auto;
      --webkit-overflow-scrolling: touch;
    "
  >
    <button
      class="
        mr-2
        rounded
        bg-gray-800
        hover:bg-gray-700
        md:px-2
        md:py-0
        p-1
        flex flex-row
        items-center
      "
      @click="clearFilters"
      v-if="Object.keys(tags).length > 0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 md:mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
        /></svg
      ><span class="hidden md:block">Show all</span>
    </button>
    <tag v-for="tag in Object.keys(tags)" :key="tag" :tag="tag"></tag>
  </div>
</template>

<script lang="ts">
import { COLORS } from "../store";
import Vue from "vue";
import { mapGetters, mapState } from "vuex";
import Tag from "~/components/Tag.vue"

export default Vue.extend({
  components: { Tag },
  computed: {
    ...mapGetters(["tags"]),
  },
  methods: {
    clearFilters() {
      this.$store.commit("clearFilters");
    },
  },
});
</script>

<style>
</style>