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
      v-if="Object.keys($store.getters.tags).length > 0"
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
      ><span class="hidden md:block">Show all tags</span>
    </button>
    <button
      class="
        flex flex-row
        items-center
        mr-2
        rounded
        bg-gray-800
        hover:bg-gray-700
        md:px-2
        md:py-0
        p-1
      "
      v-for="tag in Object.keys($store.getters.tags)"
      :key="tag"
      @click="filterTag(tag)"
    >
      <div
        class="h-4 w-4 rounded"
        :class="buttonClass(tag)"
        :style="buttonStyle(tag)"
      >
        <svg
          v-if="$store.state.filter.has(tag)"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <span class="hidden md:block md:ml-2">{{ tag }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { COLORS } from "../store";
export default {
  methods: {
    buttonClass(tag: string): string {
      const tagColor = this.$store.getters.tags[tag];
      if (COLORS.includes(tagColor)) {
        return `bg-${tagColor}-300`;
      }
      return "";
    },
    buttonStyle(tag: string): string {
      const tagColor = this.$store.getters.tags[tag];
      if (!COLORS.includes(tagColor)) {
        return `background-color: ${tagColor}`;
      }
      return "";
    },
    filterTag(tag: string) {
      this.$store.commit("filterTag", tag);
    },
    clearFilters() {
      this.$store.commit("clearFilters");
    },
  },
};
</script>

<style>
</style>