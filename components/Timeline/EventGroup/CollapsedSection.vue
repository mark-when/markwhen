<template>
  <div
    class="
      dark:border-gray-600
      eventTitle
      transition
      bg-opacity-30
      hover:bg-opacity-40
      cursor-pointer
    "
    :class="collapsedGroupClass"
    :style="bgColorStyle"
    @click="$emit('expand')"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="flex">
      <div class="sticky left-4 px-1 mt-px">
        <span class="" v-if="eventGroup.title" v-html="titleHtml"></span>
        ({{ eventGroup.length }})
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventDescription } from "~/src/Types";

export default Vue.extend({
  props: ["eventGroup"],
  data() {
    return {
      hovering: false,
    };
  },
  computed: {
    rgb(): string {
      const tags = this.eventGroup.tags;
      if (tags && tags.length) {
        const tag = tags[0];
        return this.$store.getters.tags[tag] || "";
      }
      return "";
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
  },
});
</script>

<style>
</style>