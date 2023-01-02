<script setup lang="ts">
const props = defineProps<{
  resizeMouseDown: (e: MouseEvent | TouchEvent) => void;
  isLeft: boolean;
}>();
</script>

<template>
  <div
    class="flex items-center justify-center transition hover:bg-gray-200 dark:hover:bg-gray-600"
    @mousedown.prevent="resizeMouseDown"
    @touchstart.prevent="resizeMouseDown"
    :style="`cursor: ew-resize; order: ${isLeft ? '1' : '-1'}`"
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
    <div
      v-if="false"
      class="absolute w-[2px] top-0 bottom-0 left-[2px] bg-red-500"
      style="z-index: -1; transform: translateX(50%)"
    ></div>
  </div>
</template>

<style scoped></style>
