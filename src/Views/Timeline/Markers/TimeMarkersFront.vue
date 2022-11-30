<script setup lang="ts">
import { viewportLeftMarginPixels } from "../utilities/dateTimeUtilities";
import { useAppStore } from "@/App/appStore";
import { DateTime } from "luxon";
import { computed } from "vue";
import { granularities } from "../utilities/DateTimeDisplay";
import { dateScale } from "../utilities/dateTimeUtilities";
import {
  clamp,
  timeMarkerWeightMinimum,
  useMarkersStore,
  Weight,
  type TimeMarker,
} from "./markersStore";

const appStore = useAppStore();

const dark = computed(() => appStore.inferredDarkMode);

const markerStore = useMarkersStore();

const leftMargin = viewportLeftMarginPixels;

const currentDateResolution = computed(() => {
  for (let i = 0; i < markerStore.weights.length; i++) {
    if (markerStore.weights[i] > timeMarkerWeightMinimum) {
      return i;
    }
  }
  return Weight.DECADE;
});
const scaleForThisDate = computed(
  () => (timeMarker: TimeMarker) => dateScale(timeMarker.dateTime)
);
const alpha = computed(
  () => (timeMarker: TimeMarker) =>
    0.8 * markerStore.weights[scaleForThisDate.value(timeMarker)]
);
const text = computed(
  () => (timeMarker: TimeMarker) =>
    granularities[currentDateResolution.value][
      scaleForThisDate.value(timeMarker)
    ](timeMarker.dateTime)
);
const opacity = computed(
  () => (timeMarker: TimeMarker) => clamp((alpha.value(timeMarker) - 0.3) * 5)
);
const isHovering = computed(
  () => (timeMarker: TimeMarker) =>
    markerStore.hoveringMarker &&
    +markerStore.hoveringMarker?.dateTime === +timeMarker.dateTime
);
const hoveringText = computed(() => (timeMarker: TimeMarker) => {
  const dt = timeMarker.dateTime;
  if (currentDateResolution.value > 5) {
    return dt.year;
  }
  if (currentDateResolution.value > 3) {
    return dt.toLocaleString(DateTime.DATE_HUGE);
  }
  return dt.toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS);
});
</script>

<template>
  <div class="fixed inset-0 pointer-events-none">
    <div class="timeMarkerContainer h-full">
      <div class="flex h-full" :style="`margin-left: -${leftMargin}px`">
        <div
          class="timeMarkerShader w-full h-12 fixed top-0"
          :style="{
            marginLeft: `${leftMargin}px`,
            background: `linear-gradient(${
              dark
                ? 'to bottom, #374151, 65%, #38404700'
                : 'to bottom, rgb(241 245 249), 65%, #ffffff00'
            })`,
          }"
        ></div>
        <!-- <SquashBars /> -->
        <div
          v-for="timeMarker in markerStore.markers"
          :key="timeMarker.ts"
          class="flex-shrink-0"
          :style="{
            width: `calc(var(--timeline-scale-by-24) * ${timeMarker.size}px)`,
          }"
        >
          <h6
            :class="{ 'font-bold': isHovering(timeMarker) }"
            class="timeMarkerTitle text-sm whitespace-nowrap dark:text-white text-black"
            :style="{
              opacity: isHovering(timeMarker) ? 1 : opacity(timeMarker),
            }"
          >
            {{ text(timeMarker) }}
          </h6>
          <div
            v-if="isHovering(timeMarker) && currentDateResolution <= 6"
            style="padding-left: 8px"
          >
            <h6 class="whitespace-nowrap text-xs font-bold">
              {{ hoveringText(timeMarker) }}
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeMarkerShader {
  z-index: -1;
}
.timeMarkerTitle {
  margin: 0px 0px 0px -1px;
  padding: 9px 8px 2px 8px;
  z-index: 5;
}
</style>
