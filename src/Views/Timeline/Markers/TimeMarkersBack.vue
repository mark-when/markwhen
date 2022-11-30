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

const appStore = useAppStore();
const markersStore = useMarkersStore();
const { getWeekday } = useWeekdayCache();
const dark = computed(() => appStore.inferredDarkMode);

const leftMargin = viewportLeftMarginPixels;

const backgroundColor = computed(() => (tm: TimeMarker) => {
  if (markersStore.weights[Weight.HOUR]) {
    const weekday = getWeekday(tm.dateTime);
    const a = markersStore.weights[Weight.DAY] * 0.2;
    if (weekday === 6 || weekday === 7) {
      return dark.value
        ? `rgba(30, 30, 30, ${a})`
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
  () => (tm: TimeMarker) => markersStore.weights[dateScale(tm.dateTime)]
);

const borderColor = computed(() => (tm: TimeMarker) => {
  const a = hovering.value(tm) ? 1 : (alpha.value(tm) - 0.3) * 2;
  return dark.value ? `rgba(100, 100, 100, ${a})` : `rgba(200, 200, 200, ${a})`;
});
</script>

<template>
  <div class="fixed inset-0">
    <div class="timeMarkerContainer h-full">
      <div
        class="flex flex-row h-full"
        :style="`margin-left: -${leftMargin}px`"
      >
        <div
          v-for="timeMarker in markersStore.markers"
          :key="timeMarker.ts"
          class="h-full flex-shrink-0"
          :style="{
            backgroundColor: backgroundColor(timeMarker),
            width: `calc(var(--timeline-scale-by-24) * ${timeMarker.size}px)`,
            borderLeft: `1px ${
              hovering(timeMarker) ? 'solid' : 'dashed'
            } ${borderColor(timeMarker)}`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style>
.timeMarkerContainer {
  position: sticky;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>
