<template>
  <div class="flex flex-col justify-end ml-2 mb-3">
    <div class="flex flex-row">
      <button
        class="
          flex flex-row
          items-center
          mr-2
          rounded
          bg-gray-800
          hover:bg-gray-700
          px-2
        "
        v-for="tag in Object.keys($store.getters.tags)"
        :key="tag"
        @click="filterTag(tag)"
      >
        <div
          class="h-4 w-4 rounded mr-2"
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
        {{ tag }}
      </button>
    </div>
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
      this.$store.commit("filterTag", tag)
    }
  },
};
</script>

<style>
</style>