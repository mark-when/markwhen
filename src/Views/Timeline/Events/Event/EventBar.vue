<script setup lang="ts">
import { isEditable } from "@/injectionKeys";
import { computed, inject, watch } from "vue";
import DragHandle from "@/Views/Timeline/Events/Event/Edit/DragHandle.vue";
import { useTimelineStore } from "../../timelineStore";

const timelineStore = useTimelineStore();

const props = defineProps<{
  percent: number;
  tagColor?: string;
  hovering: boolean;
  width: number;
  taskNumerator: number;
  taskDenominator: number;
  dragHandleListenerLeft: (e: MouseEvent | TouchEvent) => void;
  dragHandleListenerRight: (e: MouseEvent | TouchEvent) => void;
  editable: boolean
}>();


const barStyleObj = computed(() => {
  const isGantt = timelineStore.mode === "gantt";
  return {
    marginLeft: 0,
    width: `${props.width}px`,
    backgroundColor: color.value ? `rgba(${color.value}, 0.3)` : "",
    border: color.value ? `1px solid rgba(${color.value}, 0.3)` : "",
    height: isGantt ? `15px` : `10px`,
    borderRadius: isGantt ? `0.25rem` : `5px`,
    flexShrink: 0,
  };
});

const isGantt = computed(() => timelineStore.mode === "gantt");

const percentBarStyleObj = computed(() => {
  const obj = {
    minWidth: `10px`,
    maxWidth: `100%`,
    ...(color.value ? { backgroundColor: `rgba(${color.value}, 0.8)` } : {}),
  } as any;
  obj.width = `${props.percent}%`;
  obj.borderRadius = `5px`;
  return obj;
});

const color = computed(() => {
  return props.tagColor || null;
});
</script>

<template>
  <div class="flex flex-row items-center eventBar">
    <div class="relative">
      <div
        :class="{
          'eventBar transition shadow': true,
          'dark:bg-slate-400 bg-slate-700 opacity-30': !color,
        }"
        :style="barStyleObj"
      ></div>
      <div
        class="absolute top-0 bottom-0 percentBar transition"
        :class="{
          'dark:bg-gray-400 bg-slate-700 border border-gray-800 dark:border-gray-300':
            !color,
          'opacity-100 shadow-lg': hovering,
          'opacity-60': !hovering,
        }"
        :style="percentBarStyleObj"
      ></div>
      <drag-handle
        class="pointer-events-auto"
        v-show="editable && hovering"
        :is-left="true"
        :mouse-down-touch-start-listener="dragHandleListenerLeft"
      />
      <drag-handle
        class="pointer-events-auto"
        v-show="editable && hovering"
        :is-left="false"
        :mouse-down-touch-start-listener="dragHandleListenerRight"
      />
    </div>
  </div>
</template>

<style scoped>
.eventBar {
  grid-row: 1;
  grid-column: 1;
}
</style>
