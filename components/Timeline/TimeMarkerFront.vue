<template>
  <div class="flex-shrink-0" :style="columnStyle">
    <h6
      class="
        timeMarkerTitle
        text-sm
        whitespace-nowrap
        dark:text-white
        text-black
      "
      :style="textStyle"
    >
      {{ text }}
    </h6>
  </div>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import Vue from "vue";
import { mapGetters } from "vuex";
import { clamp, timeMarkerWeightMinimum } from "~/store";
import { granularities } from "~/src/DateTimeDisplay";

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
      return `width: ${this.timeMarker.size}px`;
    },
    textStyle(): string {
      const alpha = clamp((this.borderAlpha - 0.3) * 5);
      return `opacity: ${alpha}`;
    },
    currentDateResolution(): number {
      const weights = this.timeMarkerWeights;
      for (let i = 0; i < weights.length; i++) {
        if (weights[i] > timeMarkerWeightMinimum) {
          return i;
        }
      }
      return 6;
    },
    text(): string | number {
      return granularities[this.currentDateResolution][this.scaleForThisDate](
        this.dateTime
      );
    },
  },
});
</script>

<style>
.timeMarkerTitle {
  margin: 0px 0px 0px -1px;
  padding: 8px;
  z-index: 5;
}
</style>