<script setup lang="ts">
import { isEditable } from "@/injectionKeys";
import type { Event } from "@markwhen/parser/lib/Types";
import { computed, inject } from "vue";
import { useEventColor } from "../composables/useEventColor";
import DragHandle from "@/Views/Timeline/Events/Event/Edit/DragHandle.vue";

const props = defineProps<{
  event: Event;
  hovering: boolean;
  width: number;
  taskNumerator: number;
  taskDenominator: number;
  dragHandleListenerLeft: (e: MouseEvent | TouchEvent) => void;
  dragHandleListenerRight: (e: MouseEvent | TouchEvent) => void;
}>();

const editable = inject(isEditable);

const { color: tagColor } = useEventColor(props.event);

const percent = computed(() => {
  const p = props.event.eventDescription.percent as number;
  if (!isNaN(p)) {
    return p;
  }
  if (!isNaN(props.taskNumerator) && props.taskDenominator > 0) {
    return (props.taskNumerator / props.taskDenominator) * 100;
  }
  return 100;
});
</script>

<template>
  <div class="flex flex-row items-center eventBar">
    <div class="relative">
      <div
        :class="{
          'eventBar transition rounded-lg shadow': true,
          'dark:bg-slate-400 bg-slate-700 opacity-30 border border-solid border-black dark:border-white':
            !tagColor,
        }"
        :style="{
          width: `max(10px, calc(var(--timeline-scale-by-24) * ${width}px))`,
          backgroundColor: tagColor ? `rgba(${tagColor}, 0.3)` : '',
          border: tagColor ? `1px solid rgba(${tagColor}, 0.3)` : '',
          height: `10px`,
          borderRadius: `5px`,
          flexShrink: 0,
        }"
      ></div>
      <div
        class="absolute left-0 top-0 bottom-0 rounded-full percentBar transition"
        :class="{
          'dark:bg-gray-400 bg-slate-700': !tagColor,
          'opacity-100 shadow-lg': hovering,
          'opacity-60': !hovering,
        }"
        :style="{
          minWidth: `10px`,
          maxWidth: `100%`,
          backgroundColor: `rgba(${tagColor}, 0.8)`,
          width: `${percent}%`,
        }"
      ></div>
      <drag-handle
        class="pointer-events-auto"
        v-if="editable && hovering"
        :is-left="true"
        :mouse-down-touch-start-listener="dragHandleListenerLeft"
      />
      <drag-handle
        class="pointer-events-auto"
        v-if="editable && hovering"
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
