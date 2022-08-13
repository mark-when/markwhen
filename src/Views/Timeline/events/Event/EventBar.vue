<script setup lang="ts">
import type { Event } from "@markwhen/parser/lib/Types";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { computed } from "@vue/runtime-core";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";

const { tags } = useMarkwhenStore()
const { distanceFromBaselineLeftmostDate } = useTimelineStore()

const { event, hovering, width, taskNumerator, taskDenominator } = defineProps<{ event: Event, hovering: boolean, width: number, taskNumerator: number, taskDenominator: number }>()

const tagColor = computed(() => event.event.tags[0] ? tags[event.event.tags[0]] : undefined)
const percent = computed(() => {
  const p = event.event.percent as number
  if (!isNaN(p)) {
    return p
  }
  if (!isNaN(taskNumerator) && taskDenominator > 0) {
    return taskNumerator / taskDenominator * 100
  }
  return 100
})
</script>

<template>
  <div class="relative">
    <div :class="{
      'eventBar transition rounded-lg shadow': true,
      'dark:bg-slate-400 bg-slate-700 opacity-30 border border-solid border-black dark:border-white': !tagColor
    }" :style="{
  width: `${width}px`,
  backgroundColor: tagColor && `rgba(${tagColor}, 0.3)`,
  border: tagColor && `1px solid rgba(${tagColor}, 0.3)`,
  height: `10px`,
  borderRadius: `5px`,
  flexShrink: 0
}"></div>
    <div class="absolute left-0 top-0 bottom-0 rounded-full percentBar transition" :class="{
      'dark:bg-gray-400 bg-slate-700': !tagColor,
      'opacity-100 shadow-lg': hovering,
      'opacity-60': !hovering
    }" :style="{
  minWidth: `10px`,
  maxWidth: `100%`,
  backgroundColor: `rgba(${tagColor}, 0.8)`,
  width: `${percent}%`
}"></div>
    <!-- <drag-handle v-if="$store.state.editable && hovering" @startResize="startResizeLeft" :isLeft="true" />
    <drag-handle v-if="$store.state.editable && hovering" @startResize="startResizeRight" :isLeft="false" /> -->
  </div>
</template>

<style scoped>
</style>