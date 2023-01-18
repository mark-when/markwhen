<script setup lang="ts">
import type { ShowMarkers } from "@/Menu/Export/imageExportStore";
import type { DateTime } from "luxon";
import { computed } from "vue";
import { useTimelineStore } from "../Timeline/timelineStore";
import {
  floorDateTime,
  ceilDateTime,
} from "../Timeline/utilities/dateTimeUtilities";

const props = defineProps<{
  showMarkers?: ShowMarkers;
  earliestTime: DateTime;
  latestTime: DateTime;
  scale: number;
  totalWidth: number;
  heightUnit: number;
  startY: number;
  dark: boolean;
}>();

const timelineStore = useTimelineStore();
const dist = timelineStore.scalelessDistanceBetweenDates;
const x = (dt: DateTime) => dist(props.earliestTime, dt) * props.scale;

const mostGranular = computed(
  () =>
    props.showMarkers &&
    (["minute", "hour", "day", "month", "year"] as (keyof ShowMarkers)[]).find(
      (marker) =>
        !!props.showMarkers![marker] &&
        (props.showMarkers![marker]?.label ||
          props.showMarkers![marker]?.marker)
    )
);

const markers = computed(() => {
  if (!mostGranular.value) {
    return;
  }
  const earliestTime = floorDateTime(props.earliestTime, mostGranular.value);
  const latestTime = ceilDateTime(props.latestTime, mostGranular.value);
  let marker = earliestTime;
  let range = [marker] as DateTime[];
  while (+marker < +latestTime && range.length < 256) {
    marker = marker.plus({ [mostGranular.value]: 1 });
    range.push(marker);
  }
  return range;
});

const bottomY = computed(() => props.totalWidth + props.heightUnit * 4);
</script>

<template>
  <path
    v-for="marker in markers"
    :stroke="`rgba(${dark ? '200, 200, 200' : '100, 100, 100'}, 0.15)`"
    :stroke-dasharray="`${heightUnit / 5},${heightUnit / 10}`"
    :stroke-width="heightUnit / 10"
    :d="`M ${x(marker)} ${startY} L ${x(marker)} ${bottomY}`"
  ></path>
</template>

<style scoped></style>
