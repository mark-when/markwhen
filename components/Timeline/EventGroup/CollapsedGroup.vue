<template>
  <div
    :style="collapsedGroupStyle"
    :class="collapsedGroupClass"
    class="
      border border-gray-400
      dark:border-gray-600
      rounded-full
      eventTitle
      transition
      bg-opacity-10
      hover:bg-opacity-30
    "
  >
    <button class="w-full" @click="$emit('expand')">
      <span v-if="eventGroup.title" v-html="titleHtml"></span>
      ({{ eventGroup.length }})
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventDescription } from "~/src/Types";
import { mapGetters } from "vuex";

export default Vue.extend({
  props: ["eventGroup", "left"],
  computed: {
    ...mapGetters(["distanceBetweenDates"]),
    collapsedGroupStyle(): string {
      const leftMargin = this.left;
      let style = `margin-left: ${leftMargin - 8}px; width: max(64px, ${
        this.fullWidth + 16
      }px);  ${this.bgColorStyle}; `;
      return style;
    },
    bgColorStyle(): string {
      const tags = this.eventGroup.tags;
      if (tags && tags.length) {
        const tag = tags[0];
        if (this.$store.getters.tags[tag]) {
          return `background-color: rgba(${this.$store.getters.tags[tag]}, 0.4`;
        }
      }
      return "";
    },
    bgColorClass(): string {
      if (!this.bgColorStyle) {
        return `bg-gray-400 dark:bg-gray-800`;
      }
      return "";
    },
    collapsedGroupClass(): string {
      return this.bgColorClass;
    },
    titleHtml(): string {
      return EventDescription.toInnerHtml(this.eventGroup.title);
    },
    fullWidth(): number {
      if (!this.eventGroup || !this.eventGroup.range) {
        return 100;
      }
      return this.distanceBetweenDates(
        this.eventGroup.range.min,
        this.eventGroup.range.latest
      );
    },
  },
});
</script>

<style>
</style>