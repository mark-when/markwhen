<script setup lang="ts">
import {
  ceilDateTime,
  floorDateTime,
} from "@/Markwhen/utilities/dateTimeUtilities";
import type { DateRange, Timelines } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import { computed } from "vue";
import PagePreviewRow from "./PagePreviewRow.vue";
import PreviewTableHeader from "./PreviewTableHeader.vue";
const props = withDefaults(
  defineProps<{ markwhen: Timelines; showPermissions: boolean }>(),
  {
    showPermissions: false,
  }
);
const range: DateRange = props.markwhen.timelines.reduce(
  (prev, curr) => {
    let min: DateTime, max: DateTime;
    const earliest = DateTime.fromISO(curr.metadata.earliestTime);
    if (earliest < prev.fromDateTime) {
      min = earliest;
    } else {
      min = prev.fromDateTime;
    }
    const latest = DateTime.fromISO(curr.metadata.latestTime);
    if (latest > prev.toDateTime) {
      max = latest;
    } else {
      max = prev.toDateTime;
    }
    return {
      fromDateTime: floorDateTime(min, "year"),
      toDateTime: ceilDateTime(max, "year"),
    };
  },
  { fromDateTime: DateTime.now(), toDateTime: DateTime.now() }
);

const viewersString = computed(() => {
  return "Public";
});
</script>

<template>
  <template v-if="!markwhen.timelines.length">(empty)</template>
  <template v-else>
    <table class="text-sm text-gray-500 w-full">
      <PreviewTableHeader :markwhen="markwhen" :range="range" />
      <tbody>
        <PagePreviewRow
          v-for="page in markwhen.timelines"
          :page="page"
          :range="range"
        ></PagePreviewRow>
      </tbody>
    </table>
    <div
      class="flex items-center justify-end text-sm text-gray-500 w-full my-px"
      v-if="showPermissions"
    >
      <span class="font-mono text-xs font-medium">{{ viewersString }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-3 h-3 ml-1"
      >
        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        <path
          fill-rule="evenodd"
          d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </template>
</template>

<style scoped></style>
