<template>
  <button
    role="button"
    :title="isThisTagInFilter ? `Filtering by ${tag}` : `Filter by ${tag}`"
    class="
      flex flex-row
      items-center
      mr-2
      md:px-2 md:py-0
      p-1
      rounded
      bg-slate-100
      hover:bg-slate-300
      transition
      dark:bg-gray-800
      dark:text-gray-400
      dark:hover:text-gray-100
      dark:hover:bg-gray-600
      tagButton
    "
    @click="filterTag"
  >
    <div class="h-4 w-4 rounded" :class="buttonClass" :style="buttonStyle">
      <svg
        v-if="isThisTagInFilter"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-100"
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
    <span class="ml-2">{{ tag }}</span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapState } from "vuex";
import { COLORS } from "~/store/index";

export default Vue.extend({
  props: ["tag"],
  computed: {
    isThisTagInFilter(): boolean {
      return this.filter.includes(this.tag);
    },
    ...mapGetters(["tags"]),
    ...mapState(["filter"]),
    buttonClass(): string {
      const tagColor = this.tags[this.tag];
      if (COLORS.includes(tagColor)) {
        return `bg-${tagColor}-300`;
      }
      return "";
    },
    buttonStyle(): string {
      const tagColor = this.tags[this.tag];
      if (!COLORS.includes(tagColor)) {
        return `background-color: ${tagColor}`;
      }
      return "";
    },
  },
  methods: {
    filterTag() {
      this.$store.commit("filterTag", this.tag);
    },
  },
});
</script>

<style>
</style>