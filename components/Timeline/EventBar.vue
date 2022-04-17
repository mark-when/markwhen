
<template>
  <div class="relative">
    <div :class="eventBarClass" :style="eventBarStyle"></div>
    <div
      class="absolute left-0 top-0 bottom-0 rounded-full percentBar transition"
      :class="percentBarColorClass"
      :style="`min-width: 10px; max-width: 100%; ${percentBarColorStyle}; width: ${percent}%;`"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { DateRange, Event } from "~/src/Types";
import { EVENT_HEIGHT_PX } from "./EventRow.vue";

export default Vue.extend({
  props: ["event", "hovering"],
  methods: {
    getWidthForRange(range: DateRange): number {
      const distance = this.$store.getters.distanceBetweenDates(
        range.fromDateTime,
        range.toDateTime
      );
      const newWidth = Math.max(EVENT_HEIGHT_PX, distance);
      return newWidth;
    },
  },
  computed: {
    tagColor(): string | undefined {
      if (this.event.event.tags[0]) {
        return this.$store.getters.tags[this.event.event.tags[0]];
      }
      return undefined;
    },
    percent(): number | undefined {
      return (this.event as Event).event.percent || 100;
    },
    percentBarColorClass(): string {
      let c = "";
      if (!this.tagColor) {
        c += `dark:bg-gray-400 bg-slate-700 `;
      }
      if (this.hovering) {
        c += "opacity-100 shadow-lg ";
      } else {
        c += "opacity-60 ";
      }
      return c;
    },
    percentBarColorStyle(): string {
      let style = "";
      if (this.tagColor) {
        style += ` background-color: rgba(${this.tagColor}, 0.6)`;
      }
      return style;
    },
    eventBarClass(): string {
      let c = "eventBar transition rounded-lg shadow ";
      if (!this.tagColor) {
        c += `dark:bg-slate-400 bg-slate-700 opacity-30 `;
      }
      return c;
    },
    barWidth(): number {
      return this.getWidthForRange(this.event.range);
    },
    barColorStyle(): string {
      let style = "";
      if (this.tagColor) {
        style += ` background-color: rgba(${this.tagColor}, 0.6)`;
      }
      return style;
    },
    eventBarStyle(): string {
      return `width: ${this.barWidth}px; ${this.barColorStyle}`;
    },
  },
});
</script>

<style>
</style>