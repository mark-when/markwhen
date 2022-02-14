<template>
  <div class="timeMarker flex-shrink-0 relative" :style="columnStyle">
    <h6 class="timeMarkerTitle text-sm text-white whitespace-nowrap">
      {{ text }}
    </h6>
  </div>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import Vue from "vue";
import { mapGetters } from "vuex";
import { DisplayScale } from "~/store";

function scaledDisplayText(time: DateTime, scale: DisplayScale): string {
  if (scale === "decade" || scale === "year") {
    return "" + time.year;
  }
  if (scale === "month") {
    const monthPadded = `${time.month < 10 ? "0" : ""}${time.month}`;
    return `${monthPadded}-${time.year}`;
  }
  if (scale === "day") {
    if (time.day === 1) {
      if (time.month === 1) {
      }
    }
  }
  return time[scale];
}

export default Vue.extend({
  props: ["timeMarker"],
  computed: {
    ...mapGetters(["scaleOfViewportDateInterval"]),
    columnStyle(): string {
      return "border-left: 1px dashed rgba(128, 128, 128, 0.8);";
    },
    text(): string {
      return scaledDisplayText(
        this.timeMarker.dateTime,
        this.scaleOfViewportDateInterval
      );
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