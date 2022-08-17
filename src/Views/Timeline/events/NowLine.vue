<script setup lang="ts">
import { DateTime } from 'luxon';
import { useTimelineStore } from '../timelineStore';

const timelineStore = useTimelineStore()
const now = DateTime.now()
</script>

<template>
  <div
    v-if="!timelineStore.hideNowLine"
    class="absolute h-full dark:bg-slate-400 bg-blue-300"
    :style="`width: 1px; left: ${timelineStore.distanceFromBaselineLeftmostDate(
      now
    )}px`"
  ></div>
</template>

<style scoped></style>
