<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import { useMarkersStore } from "@/Views/Timeline/Markers/markersStore";
import {
  dateRangeToString,
  type DisplayScale,
} from "@/Views/Timeline/utilities/dateTimeUtilities";
import type { DateFormat, DateRangePart } from "@markwhen/parser/lib/Types";
import { computed } from "vue";

const props = defineProps<{
  range?: DateRangePart;
  scale?: DisplayScale;
  selected: boolean;
  last: boolean;
}>();
const markersStore = useMarkersStore();
const pageStore = usePageStore();

const dateRangeString = computed(
  () =>
    props.range &&
    dateRangeToString(
      props.range,
      props.scale || markersStore.scaleOfViewportDateInterval,
      pageStore.pageTimelineMetadata.dateFormat as DateFormat
    )
);
</script>

<template>
  <button
    class="px-2 font-bold py-1 flex flex-row font-mono items-start"
    :class="{
      'bg-indigo-700 text-white': selected,
      'text-gray-500 dark:text-gray-400': !selected,
      'rounded-b': last,
    }"
    v-if="range"
    style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden"
  >
    {{ dateRangeString }}
  </button>
</template>

<style scoped></style>
