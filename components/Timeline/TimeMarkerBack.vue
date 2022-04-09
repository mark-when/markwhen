<template>
  <div
    class="h-full flex-shrink-0 dark:border-l border-l border-dashed border-gray-400 dark:border-slate-500"
    :style="columnStyle"
  ></div>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  props: ["timeMarker"],
  computed: {
    dateTime(): DateTime {
      return this.timeMarker.dateTime;
    },
    ...mapGetters(["timeMarkerWeights"]),
    scaleForThisDate(): number {
      const dateTime = this.timeMarker.dateTime as DateTime;
      if (dateTime.second === 0) {
        if (dateTime.minute === 0) {
          if (dateTime.hour === 0) {
            if (dateTime.day === 1) {
              if (dateTime.month === 1) {
                if (dateTime.year % 10 === 0) {
                  return 6;
                }
                return 5;
              }
              return 4;
            }
            return 3;
          }
          return 2;
        }
        return 1;
      }
      return 0;
    },
    borderAlpha(): number {
      return 0.8 * this.timeMarkerWeights[this.scaleForThisDate];
    },
    columnStyle(): string {
      return `opacity: ${this.borderAlpha}; width: ${this.timeMarker.size}px`;
    },
  },
});
</script>

<style>
</style>