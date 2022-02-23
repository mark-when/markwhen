<template>
  <button
    class="
      flex flex-row
      items-center
      mr-2
      rounded
      bg-gray-800
      hover:bg-gray-600
      md:px-2 md:py-0
      p-1
      text-gray-400
      hover:text-gray-100
      tagButton
    "
    @click="filterTag"
  >
    <div class="h-4 w-4 rounded" :class="buttonClass" :style="buttonStyle">
      <svg
        v-if="filter.includes(tag)"
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