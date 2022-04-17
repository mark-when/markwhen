<template>
  <div
    :style="collapsedGroupStyle"
    :class="collapsedGroupClass"
    class="rounded-full eventTitle transition bg-opacity-10 hover:bg-opacity-30"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
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
  data() {
    return {
      hovering: false,
    };
  },
  computed: {
    ...mapGetters(["distanceBetweenDates"]),
    rgb(): string {
      const tags = this.eventGroup.tags;
      if (tags && tags.length) {
        const tag = tags[0];
        return this.$store.getters.tags[tag] || "";
      }
      return "";
    },
    collapsedGroupStyle(): string {
      const leftMargin = this.left;
      let style = `margin-left: ${leftMargin - 8}px; width: max(64px, ${
        this.fullWidth + 16
      }px);  ${this.bgColorStyle}; `;
      return style;
    },
    bgColorStyle(): string {
      return this.rgb
        ? `background-color: rgba(${this.rgb}, ${
            this.hovering ? "0.2" : "0.1"
          })`
        : "";
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