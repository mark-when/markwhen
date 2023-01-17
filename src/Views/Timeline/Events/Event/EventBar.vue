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
  editable: boolean;
  expandedRecurrence: number[];
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

const recurrenceBarStyleObj = (left: number) => {
  const isGantt = timelineStore.mode === "gantt";
  return {
    left: `${left}px`,
    width: `${props.width}px`,
    backgroundColor: color.value ? `rgba(${color.value}, 0.3)` : "",
    border: color.value ? `1px solid rgba(${color.value}, 0.3)` : "",
    height: isGantt ? `15px` : `10px`,
    borderRadius: isGantt ? `0.25rem` : `5px`,
    flexShrink: 0,
  };
};

const barHeight = computed(() => (isGantt.value ? 15 : 10));

const recurrencePercentBarStyleObj = (left: number) => {
  const isGantt = timelineStore.mode === "gantt";
  const obj = {
    minWidth: `10px`,
    // maxWidth: `100%`,
    ...(color.value ? { backgroundColor: `rgba(${color.value}, 0.8)` } : {}),
  } as any;
  obj.width = `${(props.percent * props.width) / 100}px`;
  obj.borderRadius = `5px`;
  obj.left = `${left}px`;
  // obj.height = `${barHeight.value}px`;
  return obj;
};

const recurrenceTotalWidth = computed(
  () =>
    props.expandedRecurrence[props.expandedRecurrence.length - 1] + props.width
);
</script>

<template>
  <div
    class="flex flex-row items-center eventBar"
    :style="`width: ${recurrenceTotalWidth}px`"
  >
    <template v-for="instance of expandedRecurrence">
      <div class="relative items-center" :style="`height: ${barHeight}px`">
        <div
          :class="{
            'eventBar transition shadow top-0 absolute': true,
            'dark:bg-slate-400 bg-slate-700 opacity-30': !color,
          }"
          :style="recurrenceBarStyleObj(instance)"
        ></div>
        <div
          class="absolute top-0 bottom-0 percentBar transition"
          :class="{
            'dark:bg-gray-400 bg-slate-700 border border-gray-800 dark:border-gray-300':
              !color,
            'opacity-100 shadow-lg': hovering,
            'opacity-60': !hovering,
          }"
          :style="recurrencePercentBarStyleObj(instance)"
        ></div>
        <!-- <div
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
      ></div> -->
        <!-- <drag-handle
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
        /> -->
      </div>
    </template>
  </div>
</template>

<style scoped>
.eventBar {
  grid-row: 1;
  grid-column: 1;
}
</style>
