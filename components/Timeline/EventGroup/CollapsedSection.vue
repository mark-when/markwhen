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
    @click="$emit('expand')"
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
  computed: {
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
  },
});
</script>

<style>
</style>