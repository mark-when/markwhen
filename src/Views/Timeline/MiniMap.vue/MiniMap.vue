<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import type { DateRange } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import { useTimelineStore } from "../timelineStore";
import { useEventColor } from "../Events/composables/useEventColor";
import { isEventNode, eventValue, iterate } from "@markwhen/parser/lib/Noder";
const transformStore = useTransformStore();
const timelineStore = useTimelineStore();
const pageStore = usePageStore();

const left = (range: DateRange) =>
  timelineStore.scalelessDistanceBetweenDates(
    DateTime.fromISO(pageStore.pageTimelineMetadata.earliestTime),
    range.fromDateTime
  );

const width = (range: DateRange) =>
  timelineStore.scalelessDistanceBetweenDates(
    range.fromDateTime,
    range.toDateTime
  );
</script>

<template>
  <div
    class="ml-1 sticky bottom-12 left-12 inline-block dark:bg-gray-700 bg-slate-100 border rounded"
  >
    <svg
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      :style="`width: 10rem; height: 10rem;`"
      :viewBox="`-4 0 200 200`"
      fill="currentColor"
    >
      <template
        v-for="({ path, node }, index) in iterate(
          transformStore.transformedEvents!
        )"
      >
        <path
          v-if="isEventNode(node)"
          fill-rule="evenodd"
          :key="path.join(',')"
          clip-rule="evenodd"
          :d="`M ${left(eventValue(node).dateRange()) / 1000} ${
            2 + index * 6
          } a 1 1 0 0 0 0 4 h ${
            width(eventValue(node).dateRange()) / 1000
          } a 1 1 0 1 0 0 -4 H 2 z`"
          :fill="`rgb(${useEventColor(node).color.value})`"
        />
      </template>
      <!-- <path
        :d="`m ${viewportLeft} 0 l 0 ${mapHeight} l ${viewportWidth} 0 l 0 -${mapHeight} l 0 0 z`"
        fill="rgba(0, 0, 0, 0.05)"
      /> -->
    </svg>
  </div>
</template>

<style scoped></style>
