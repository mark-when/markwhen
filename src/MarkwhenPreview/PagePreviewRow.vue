<script setup lang="ts">
import { flat } from "@markwhen/parser/lib/Noder";
import type { DateRange, Timeline } from "@markwhen/parser/lib/Types";
import { computed } from "vue";

const props = defineProps<{ page: Timeline; range: DateRange }>();

const pageDuration = computed(
  () => +props.page.metadata.latestTime - +props.page.metadata.earliestTime
);

const wholeDuration = computed(
  () => +props.range.toDateTime - +props.range.fromDateTime
);

const width = computed(() => (pageDuration.value / wholeDuration.value) * 100);

const left = computed(() => {
  const diff = +props.page.metadata.earliestTime - +props.range.fromDateTime;
  return (diff / wholeDuration.value) * 100;
});

const flattenedEvents = computed(() => flat(props.page.events));

const pageDisplayTitle = computed(() => {
  const t = props.page.header.title;
  if (!t) {
    return "";
  }
  return t.substring(0, 24) + (t.length > 24 ? "..." : "");
});
</script>

<template>
  <tr
    class="odd:bg-gray-100 dark:odd:bg-slate-700 dark:text-gray-300 text-gray-800"
  >
    <td class="pr-2">
      {{ pageDisplayTitle }}
    </td>
    <td>
      <div
        v-if="flattenedEvents.length"
        class="rounded-full dark:bg-gray-500 bg-gray-600 flex flex-row items-center justify-center relative"
        :style="{
          height: '12px',
          width: `max(12px, ${width}%)`,
          marginLeft: `${left}%`,
        }"
      >
        <span
          v-if="width > 20"
          class="text-white font-mono text-xs dark:text-gray-200"
          >{{ flattenedEvents.length }}</span
        >
        <span
          v-else-if="left > 20"
          class="font-mono text-xs -left-1 absolute"
          style="transform: translateX(-100%)"
          >{{ flattenedEvents.length }}</span
        >
        <span
          v-else
          class="font-mono text-xs -right-1 absolute"
          style="transform: translateX(100%)"
          >{{ flattenedEvents.length }}</span
        >
      </div>
    </td>
  </tr>
</template>

<style scoped>
tr td {
  width: 99%;
}
tr td:first-child {
  width: unset;
  white-space: nowrap;
}
</style>
