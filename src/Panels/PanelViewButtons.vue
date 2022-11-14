<script setup lang="ts">
import { computed } from "vue";
import { usePanelStore } from "./panelStore";

const props = defineProps<{
  moveListener: (e: MouseEvent | TouchEvent) => void;
  left: boolean;
  fill: boolean;
}>();
const emit = defineEmits<{ (event: "close"): void }>();

const panelStore = usePanelStore();
const isMoving = computed(() => panelStore.isMoving);
</script>

<template>
  <div
    class="flex flex-row items-center justify-center absolute top-0 right-0 left-0 pointer-events-none"
    :class="{
      'dark:bg-slate-800 bg-slate-50': fill,
    }"
  >
    <div
      :class="{
        'order-1': left,
        'order-2 mr-auto': !left,
      }"
    >
      <slot></slot>
    </div>
    <div
      class="flex flex-row items-center justify-center dark:bg-slate-800 bg-slate-50 pointer-events-auto"
      :class="{
        'ml-auto order-2': left,
        'order-1': !left,
      }"
    >
      <div
        class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
        :class="{
          'order-1': left,
          'order-2': !left,
          'cursor-grab': !isMoving,
          'cursor-grabbing': isMoving,
        }"
        @mousedown="moveListener"
        @touchstart="moveListener"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <circle cx="5" cy="5" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="19" cy="5" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="19" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
          <circle cx="19" cy="19" r="1"></circle>
        </svg>
      </div>
      <button
        role="button"
        title="Close/collapse sidebar"
        @click="emit('close')"
        class="transition p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
        :class="{ 'order-1': !left, 'order-2': left }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
