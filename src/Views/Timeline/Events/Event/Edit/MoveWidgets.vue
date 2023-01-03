<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";

const props = defineProps<{
  move: (e: MouseEvent | TouchEvent) => void;
  left: number;
}>();
const emit = defineEmits<{ (event: "edit"): void }>();
</script>

<template>
  <div
    class="flex flex-row text-gray-500 dark:text-gray-400 absolute mr-8 moveWidgets top-0 bottom-0 items-center justify-center p-2"
    style="left: -3.6rem"
  >
    <div class="flex flex-row items-center justify-center">
      <button
        title="Edit event"
        class="mr-1 transition dark:hover:text-slate-100 hover:text-black rounded-sm p-px disabled:text-gray-300 disabled:dark:text-gray-600"
        @click="emit('edit')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
      </button>
    </div>
    <div
      title="Drag to move"
      class="handle flex items-center justify-center cursor-crosshair touch-none hover:text-black dark:hover:text-slate-100 transition"
      @touchstart="move"
      @mousedown.prevent.stop="move"
    >
      <svg
        class="w-4 h-4"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<style scoped></style>
