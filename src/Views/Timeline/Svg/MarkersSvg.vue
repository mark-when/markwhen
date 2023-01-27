<script setup lang="ts">
import type { DateTime } from "luxon";
import { computed } from "vue";
import { useTimelineStore } from "../timelineStore";
import { granularities } from "../utilities/DateTimeDisplay";
import {
  floorDateTime,
  ceilDateTime,
  dateScale,
} from "../utilities/dateTimeUtilities";

export type ShowMarkers = Partial<
  Record<
    "decade" | "year" | "month" | "day" | "hour" | "quarterhour" | "minute",
    { marker: boolean; label: boolean }
  >
>;

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
    (
      [
        "minute",
        "quarterhour",
        "hour",
        "day",
        "month",
        "year",
        "decade",
      ] as (keyof ShowMarkers)[]
    ).find(
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
    let amountToAdd = { [mostGranular.value]: 1 };
    if (mostGranular.value === "decade") {
      amountToAdd = { years: 10 };
    } else if (mostGranular.value === "quarterhour") {
      amountToAdd = { minutes: 15 };
    }
    marker = marker.plus(amountToAdd);
    range.push(marker);
  }
  return range;
});

const bottomY = computed(() => props.totalWidth + props.heightUnit * 4);

const granularityIndex = (showMarker: keyof ShowMarkers) =>
  ["minute", "quarterhour", "hour", "day", "month", "year", "decade"].indexOf(
    showMarker
  ) + 2;

const textForMarker = (dt: DateTime) =>
  granularities[granularityIndex(mostGranular.value!)][dateScale(dt)](dt);
</script>

<template>
  <template v-for="marker in markers">
    <path
      :stroke="`rgba(${dark ? '200, 200, 200' : '100, 100, 100'}, 0.15)`"
      :stroke-dasharray="`${heightUnit / 5},${heightUnit / 10}`"
      :stroke-width="heightUnit / 10"
      :d="`M ${x(marker)} ${startY} L ${x(marker)} ${bottomY}`"
    ></path>
    <text
      class="svgMarkerText"
      :x="x(marker) + heightUnit / 4"
      :y="startY * 1.5 + heightUnit / 4"
      >{{ textForMarker(marker) }}</text
    >
  </template>
</template>

<style scoped></style>
