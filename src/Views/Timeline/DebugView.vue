<script setup lang="ts">
import { useTimelineStore } from "./timelineStore";
import { useNodeStore } from "./useNodeStore";

const timelineStore = useTimelineStore();
const nodeStore = useNodeStore();
</script>

<template>
  <div
    class="font-mono text-sm fixed right-8 top-8 dark:bg-red-700 bg-red-200 flex flex-col"
  >
    <span
      >{{ Math.round(timelineStore.pageScale * 100) / 100 }}
      {{ timelineStore.baselineLeftmostDate }}</span
    >
    <span>{{ timelineStore.scaleOfViewportDateInterval }}</span>
    <span>sections: {{ nodeStore.visibleNodes[1].length }}</span>
    <span>events: {{ nodeStore.visibleNodes[0].length }}</span>
  </div>
</template>

<style scoped></style>
