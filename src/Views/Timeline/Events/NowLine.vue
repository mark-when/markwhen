<script setup lang="ts">
import { DateTime } from "luxon";
import { useTimelineStore } from "../timelineStore";

const timelineStore = useTimelineStore();
const now = DateTime.now();
</script>

<template>
  <div
    v-if="!timelineStore.hideNowLine"
    class="absolute dark:bg-slate-400 bg-blue-300"
    :style="`width: 1px; left: ${timelineStore.distanceFromBaselineLeftmostDate(
      now
    ) + timelineStore.leftInsetWidth}px; height: max(100vh, 100%);`"
  ></div>
</template>

<style scoped></style>
