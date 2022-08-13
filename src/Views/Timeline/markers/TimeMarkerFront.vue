<script setup lang="ts">
import { DateTime } from "luxon";
import { computed } from "vue";
import { granularities } from "../utilities/DateTimeDisplay";
import { dateScale } from "../utilities/dateTimeUtilities";
import { clamp, TimeMarker, timeMarkerWeightMinimum, useMarkersStore, Weight } from "./markersStore";

const { timeMarker } = defineProps<{ timeMarker: TimeMarker }>()

const markerStore = useMarkersStore()

const currentDateResolution = computed(() => {
  for (let i = 0; i < markerStore.weights.length; i++) {
    if (markerStore.weights[i] > timeMarkerWeightMinimum) {
      return i
    }
  }
  return Weight.DECADE
})
const scaleForThisDate = computed(() => dateScale(timeMarker.dateTime))
const alpha = computed(() => 0.8 * markerStore.weights[scaleForThisDate.value])
const text = computed(() => granularities[currentDateResolution.value][scaleForThisDate.value](timeMarker.dateTime))
const opacity = computed(() => clamp((alpha.value - 0.3) * 5))
const isHovering = computed(() => markerStore.hoveringMarker && +markerStore.hoveringMarker?.dateTime === +timeMarker.dateTime)
const hoveringText = computed(() => {
  const dt = timeMarker.dateTime
  if (currentDateResolution.value > 5) {
    return dt.year;
  }
  if (currentDateResolution.value > 3) {
    return dt.toLocaleString(DateTime.DATE_HUGE);
  }
  return dt.toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS);
})
</script>

<template>
  <div class="flex-shrink-0" :style="{
    width: `${timeMarker.size}px`
  }">
    <h6 :class="{ 'font-bold': isHovering }" class="
        timeMarkerTitle
        text-sm
        whitespace-nowrap
        dark:text-white
        text-black
      " :style="{
        opacity: isHovering ? 1 : opacity
      }">
      {{ text }}
    </h6>
    <div v-if="isHovering && currentDateResolution <= 6" style="padding-left: 8px">
      <h6 class="whitespace-nowrap text-xs font-bold">
        {{ hoveringText }}
      </h6>
    </div>
  </div>
</template>

<style scoped>
.timeMarkerTitle {
  margin: 0px 0px 0px -1px;
  padding: 9px 8px 2px 8px;
  z-index: 5;
}
</style>