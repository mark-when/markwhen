<script setup lang="ts">
import { computed } from "vue";
import { useTimelineStore } from "../../timelineStore";
import { useNodeStore } from "../../useNodeStore";
import { useCreateEvent } from "./composables/useCreateEvent";
const { newEventPosition, mouseDownTouchStartListener, creating } =
  useCreateEvent();
const timelineStore = useTimelineStore();
const nodeStore = useNodeStore();

const isGantt = computed(() => timelineStore.mode === "gantt");
</script>

<template>
  <button
    v-if="newEventPosition"
    title="Click and drag to create new event"
    class="h-[10px] border flex items-center justify-center flex-shrink-0 absolute border-transparent hover:border-white hover:bg-white text-slate-600 hover:bg-white hover:shadow dark:text-slate-100 dark:hover:border-gray-600 dark:hover:bg-gray-600 font-bold"
    :class="
      creating
        ? 'dark:border-gray-600 dark:bg-gray-600 bg-white border-white shadow'
        : 'bg-transparent'
    "
    :style="`left: ${newEventPosition[0].left}px; width: ${
      newEventPosition[1].left - newEventPosition[0].left
    }px; top: ${nodeStore.height * 30 + 140}px; height: ${
      isGantt ? '15px' : '10px'
    }; border-radius: ${isGantt ? '0.25rem' : '99px'}`"
    @mousedown.prevent.stop="mouseDownTouchStartListener"
    @touchstart.prevent.stop="mouseDownTouchStartListener"
  >
    +
  </button>
</template>

<style scoped></style>
