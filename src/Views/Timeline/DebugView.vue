<script setup lang="ts">
import { useMarkersStore } from "./Markers/markersStore";
import { useTimelineStore } from "./timelineStore";

const timelineStore = useTimelineStore();
</script>

<template>
  <div
    class="font-mono text-sm fixed right-8 top-8 dark:bg-red-700 bg-red-200 flex flex-col"
  >
    <span
      >{{ timelineStore.pageScale }}
      {{ timelineStore.baselineLeftmostDate }}</span
    >
    <span>{{ timelineStore.scaleOfViewportDateInterval }}</span>
  </div>
</template>

<style scoped></style>
