<template>
  <div class="timeMarker flex-shrink-0 relative" :style="columnStyle">
    <h6 class="timeMarkerTitle text-sm whitespace-nowrap" :style="textStyle">
      {{ text }}
    </h6>
  </div>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import Vue from "vue";
import { mapGetters } from "vuex";
import { clamp, scales } from "~/store";

export default Vue.extend({
  props: ["timeMarker"],
  computed: {
    ...mapGetters(["scaleOfViewportDateInterval", "timeMarkerWeights"]),
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
      return `border-left: 1px dashed rgba(128, 128, 128, ${this.borderAlpha}); width: ${this.timeMarker.size}px`;
    },
    textStyle(): string {
      const alpha = clamp((this.borderAlpha - 0.3) * 5);
      return `color: rgba(255, 255, 255, ${alpha})`;
    },
    text(): string {
      if (this.scaleForThisDate === 6) {
        return this.timeMarker.dateTime.year
      }
      return this.borderAlpha > 0.3
        ? this.timeMarker.dateTime[scales[this.scaleForThisDate]]
        : "";
    },
  },
});
</script>

<style>
.timeMarker {
  border-left: 1px dashed rgba(128, 128, 128, 0.678);
  height: 100%;
  font-family: system-ui;
}

.timeMarkerTitle {
  font-weight: 300;
  margin: 0px 0px 0px -1px;
  position: sticky;
  top: 0px;
  padding: 8px;
  z-index: 1;
}
</style>