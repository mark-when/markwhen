<script setup lang="ts">
import { PanelEditor } from "@/Panels/panelStore";
import { usePanelResize } from "@/Sidebar/composables/usePanelResize";
import { computed, watchEffect } from "vue";
import { useTimelineStore } from "../timelineStore";

const timelineStore = useTimelineStore();
const width = computed(() => timelineStore.ganttSidebarWidth);

const { tempWidth, resizeMouseDown } = usePanelResize(true, width, (w) =>
  timelineStore.setGanttSidebarWidth(w)
);
watchEffect(() => {
  timelineStore.setGanttSidebarTempWidth(tempWidth.value);
});
const currentWidth = computed(() => {
  if (tempWidth.value) {
    return tempWidth.value;
  }
  return width.value;
});
</script>

<template>
  <div
    class="absolute left-0 right-0 h-full pointer-events-none z-[2]"
    v-show="timelineStore.mode === 'gantt'"
  >
    <div class="flex w-full h-full">
      <div
        class="sticky dark:bg-slate-700 left-0 relative flex flex-col"
        :style="`width: calc(${currentWidth}px)`"
      >
        <div class="h-full w-full">
          <div
            class="pointer-events-auto sticky right-0 inline-flex items-center justify-center transition hover:bg-gray-200 dark:hover:bg-gray-600 top-0 bottom-0 z-[5]"
            style="cursor: ew-resize"
            :style="`height: ${
              timelineStore.pageSettings.viewport.height
            }px; left: ${currentWidth}px`"
            @mousedown.prevent="resizeMouseDown"
            @touchstart.prevent="resizeMouseDown"
          >
            <svg
              class="w-3 h-3"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              style="margin-left: -2px; margin-right: -2px"
            >
              <path
                d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
