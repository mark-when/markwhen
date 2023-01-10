<script setup lang="ts">
import { useTimelineStore } from "../timelineStore";
import { computed, watch } from "vue";
import SvgView from "@/Views/Svg/SvgView.vue";

const timelineStore = useTimelineStore();

const styleLeftInset = computed(() => {
  let inset = timelineStore.pageSettings.viewport.offsetLeft;
  if (timelineStore.mode === "gantt") {
    return (
      inset +
      (timelineStore.ganttSidebarTempWidth
        ? timelineStore.ganttSidebarTempWidth
        : timelineStore.ganttSidebarWidth)
    );
  }
  return inset;
});
</script>

<template>
  <div
    class="absolute dark:bg-slate-800 bg-slate-100 shadow-lg rounded-lg overflow-scroll p-2"
    :style="`left: calc(${styleLeftInset}px + 1rem); bottom: calc(env(safe-area-inset-bottom) + 3rem)`"
  >
    <SvgView style="width: 8rem; height: 8rem" />
  </div>
</template>

<style scoped></style>
