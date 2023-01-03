<script setup lang="ts">
import { viewportLeftMarginPixels } from "../utilities/dateTimeUtilities";
import { useAppStore } from "@/App/appStore";
import { computed } from "vue";
import { dateScale } from "@/Views/Timeline/utilities/dateTimeUtilities";
import {
  useMarkersStore,
  Weight,
  type TimeMarker,
} from "@/Views/Timeline/Markers/markersStore";
import { useWeekdayCache } from "../utilities/weekdayCache";
import { useTimelineStore } from "../timelineStore";

const appStore = useAppStore();
const markersStore = useMarkersStore();
const timelineStore = useTimelineStore();
const { getWeekday } = useWeekdayCache();
const dark = computed(() => appStore.inferredDarkMode);

const leftMargin = viewportLeftMarginPixels;

const backgroundColor = computed(() => (tm: TimeMarker) => {
  if (timelineStore.weights[Weight.HOUR]) {
    const weekday = getWeekday(tm.dateTime);
    const a = timelineStore.weights[Weight.DAY] * 0.2;
    if (weekday === 6 || weekday === 7) {
      return dark.value
        ? `rgba(10, 10, 10, ${a})`
        : `rgba(170, 170, 170, ${a})`;
    }
  }
  return "unset";
});

const hovering = computed(() => (tm: TimeMarker) => {
  const h = markersStore.hoveringMarker;
  if (!h) {
    return false;
  }
  return +tm.dateTime === +h.dateTime;
});

const alpha = computed(
  () => (tm: TimeMarker) => timelineStore.weights[dateScale(tm.dateTime)]
);

const borderColor = computed(() => (tm: TimeMarker) => {
  const a = hovering.value(tm) ? 1 : (alpha.value(tm) - 0.3) * 2;
  return dark.value ? `rgba(71, 85, 105, ${a})` : `rgba(200, 200, 200, ${a})`;
});
</script>

<template>
  <div class="fixed inset-0">
    <div
      class="flex flex-row h-full relative"
      :style="`margin-left: -${leftMargin}px`"
    >
      <div
        v-for="timeMarker in markersStore.markers"
        :key="timeMarker.ts"
        class="h-full flex-shrink-0 absolute top-0 bottom-0"
        :style="{
          backgroundColor: backgroundColor(timeMarker),
          width: `${timelineStore.pageScaleBy24 * timeMarker.size}px`,
          left: `${
            timelineStore.pageScaleBy24 *
              (timeMarker.accumulated - timeMarker.size) +
            timelineStore.leftInsetWidth
          }px`,
          borderLeft: `1px ${
            hovering(timeMarker) ? 'solid' : 'dashed'
          } ${borderColor(timeMarker)}`,
        }"
      ></div>
    </div>
  </div>
</template>
