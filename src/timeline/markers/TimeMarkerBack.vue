<script setup lang="ts">
import { useAppStore } from '@/app/store';
import { computed, reactive } from 'vue';
import { dateScale } from '@/timeline/utilities/dateTimeUtilities';
import { useMarkersStore, Weight, type TimeMarker } from './markersStore';
import { useWeekdayCache } from '../utilities/weekdayCache';

const { timeMarker } = defineProps<{
  timeMarker: TimeMarker
}>()

const appStore = useAppStore()
const markersStore = useMarkersStore()
const { getWeekday } = useWeekdayCache()

const alpha = computed(() => markersStore.weights[dateScale(timeMarker.dateTime)])

const borderColor = computed(() => {
  const isDark = appStore.inferredDarkMode === 'dark'
  const a = (alpha.value - 0.3) * 2
  return isDark ? `rgba(100, 100, 100, ${a})` : `rgba(200, 200, 200, ${a})`;
})

const backgroundColor = computed(() => {
  if (markersStore.weights[Weight.HOUR]) {
    const weekday = getWeekday(timeMarker.dateTime);
    const isDark = appStore.inferredDarkMode === 'dark'
    const a = markersStore.weights[Weight.DAY] * 0.2;
    if (weekday === 6 || weekday === 7) {
      return isDark
        ? `rgba(30, 30, 30, ${a})`
        : `rgba(170, 170, 170, ${a})`;
    }
  }
  return 'unset'
})
</script>

<template>
  <div class="h-full flex-shrink-0" :style="{
    backgroundColor: backgroundColor, width: `${timeMarker.size}px`, borderLeft: `1px dashed ${borderColor}`
  }"></div>
</template>

<style scoped>
</style>