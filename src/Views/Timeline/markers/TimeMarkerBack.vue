<script setup lang="ts">
import { useAppStore } from "@/App/appStore";
import { computed } from "vue";
import { dateScale } from "@/Views/Timeline/utilities/dateTimeUtilities";
import { useMarkersStore, Weight, type TimeMarker } from "@/Views/Timeline/Markers/markersStore";
import { useWeekdayCache } from "../utilities/weekdayCache";
import { useMediaQuery } from "@vueuse/core";

const props = defineProps<{
  timeMarker: TimeMarker;
}>();

const appStore = useAppStore();
const markersStore = useMarkersStore();
const { getWeekday } = useWeekdayCache();
const isDark = useMediaQuery("(prefers-color-scheme: dark)");

const alpha = computed(
  () => markersStore.weights[dateScale(props.timeMarker.dateTime)]
);

const hovering = computed(() => {
  const h = markersStore.hoveringMarker;
  if (!h) {
    return false;
  }
  return +props.timeMarker.dateTime === +h.dateTime;
});

const borderColor = computed(() => {
  const a = hovering.value ? 1 : (alpha.value - 0.3) * 2;
  return isDark.value
    ? `rgba(100, 100, 100, ${a})`
    : `rgba(200, 200, 200, ${a})`;
});

const backgroundColor = computed(() => {
  if (markersStore.weights[Weight.HOUR]) {
    const weekday = getWeekday(props.timeMarker.dateTime);
    const isDark = appStore.inferredDarkMode === "dark";
    const a = markersStore.weights[Weight.DAY] * 0.2;
    if (weekday === 6 || weekday === 7) {
      return isDark ? `rgba(30, 30, 30, ${a})` : `rgba(170, 170, 170, ${a})`;
    }
  }
  return "unset";
});

</script>

<template>
  <div
    class="h-full flex-shrink-0"
    :style="{
      backgroundColor: backgroundColor,
      width: `${timeMarker.size}px`,
      borderLeft: `1px ${hovering ? 'solid' : 'dashed'} ${borderColor}`,
    }"
  ></div>
</template>

<style scoped></style>
