<script setup lang="ts">
import { useCreateEvent } from "./composables/useCreateEvent";
const { newEventPosition, mouseDownTouchStartListener, creating } =
  useCreateEvent();
</script>

<template>
  <div class="w-full relative mt-2">
    <button
      v-if="newEventPosition"
      title="Click and drag to create new event"
      class="h-3 rounded-full border flex items-center justify-center flex-shrink-0 relative border-transparent hover:border-white hover:bg-white text-slate-600 hover:bg-white hover:shadow dark:text-slate-100 dark:hover:border-gray-600 dark:hover:bg-gray-600 transition font-bold"
      :class="
        creating
          ? 'dark:border-gray-600 dark:bg-gray-600 bg-white border-white shadow'
          : 'bg-transparent'
      "
      :style="`left: ${newEventPosition[0].left}px; width: ${
        newEventPosition[1].left - newEventPosition[0].left
      }px;`"
      @mousedown.prevent.stop="mouseDownTouchStartListener"
      @touchstart.prevent.stop="mouseDownTouchStartListener"
    >
      +
    </button>
  </div>
</template>

<style scoped></style>
