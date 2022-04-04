
<template>
  <div class="relative">
    <div :class="eventBarClass" :style="eventBarStyle"></div>
    <div
      v-if="hasPercent"
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
import { COLORS, EVENT_HEIGHT_PX } from "./EventRow.vue";

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
    hasPercent(): boolean {
      return typeof this.percent === "number";
    },
    percent(): number | undefined {
      return (this.event as Event).event.percent;
    },
    percentBarColorClass(): string {
      let c = "";
      const tag = this.event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        if (COLORS.includes(this.$store.getters.tags[tag])) {
          c += `bg-${this.$store.getters.tags[tag].toLowerCase()}-500 `;
        }
      } else {
        c += `bg-gray-400 `;
      }
      if (this.hovering) {
        c += "opacity-90 ";
      } else {
        c += "opacity-60 ";
      }
      return c;
    },
    percentBarColorStyle(): string {
      let style = "";
      const tag = this.event.event.tags[0];
      if (
        this.$store.getters.tags[tag] &&
        !COLORS.includes(this.$store.getters.tags[tag])
      ) {
        style += ` background-color: ${this.$store.getters.tags[tag]}`;
      }
      return style;
    },
    eventBarClass(): string {
      let c = "eventBar transition rounded-lg shadow ";
      const tag = this.event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        if (COLORS.includes(this.$store.getters.tags[tag])) {
          c += `bg-${this.$store.getters.tags[tag].toLowerCase()}-300 `;
        }
      } else {
        c += `bg-gray-200 `;
      }
      if (this.hasPercent) {
        c += "opacity-30 ";
      } else {
        c += "opacity-50 ";
      }
      if (this.hovering && !this.hasPercent) {
        c += `opacity-80 shadow-lg `;
      }
      return c;
    },
    barWidth(): number {
      return this.getWidthForRange(this.event.range);
    },
    barColorStyle(): string {
      let style = "";
      const tag = this.event.event.tags[0];
      if (
        this.$store.getters.tags[tag] &&
        !COLORS.includes(this.$store.getters.tags[tag])
      ) {
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