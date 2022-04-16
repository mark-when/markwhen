
<template>
  <div class="relative">
    <div :class="eventBarClass" :style="eventBarStyle"></div>
    <div
      class="
        absolute
        left-0
        top-0
        bottom-0
        bg-black
        rounded-full
        percentBar
        transition
      "
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
    percent(): number | undefined {
      return (this.event as Event).event.percent || 100;
    },
    percentBarColorClass(): string {
      let c = "";
      const tag = this.event.event.tags[0];
      if (!this.$store.getters.tags[tag]) {
        c += `dark:bg-gray-400 bg-slate-700`;
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
      const tag = this.event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        style += ` background-color: ${this.$store.getters.tags[tag]}`;
      }
      return style;
    },
    eventBarClass(): string {
      let c = "eventBar transition rounded-lg shadow ";
      const tag = this.event.event.tags[0];
      if (!this.$store.getters.tags[tag]) {
        c += `dark:bg-slate-400 bg-slate-700 `;
      }
      c += "opacity-30 ";

      return c;
    },
    barWidth(): number {
      return this.getWidthForRange(this.event.range);
    },
    barColorStyle(): string {
      let style = "";
      const tag = this.event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        style += ` background-color: ${this.$store.getters.tags[tag]}`;
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