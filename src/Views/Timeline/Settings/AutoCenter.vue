<script setup lang="ts">
import { useTimelineStore } from "../timelineStore";

const { autoCenter } = useTimelineStore();
</script>

<template>
  <button
    @click="autoCenter"
    class="h-6 flex flex-row items-center rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 px-1 text-sm lg:text-base font-bold relative"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1"
    >
      <path
        d="m 3 5 v 3 c 0 0.55 0.45 1 1 1 s 1 -0.45 1 -1 v -2 c 0 -0.55 0.45 -1 1 -1 h 2 c 0.55 0 1 -0.45 1 -1 s -0.45 -1 -1 -1 h -3 c -1.1 0 -2 0.9 -2 2 z m 1 10 c -0.55 0 -1 0.45 -1 1 v 3 c 0 1.1 0.9 2 2 2 h 3 c 0.55 0 1 -0.45 1 -1 s -0.45 -1 -1 -1 h -2 c -0.55 0 -1 -0.45 -1 -1 v -2 c 0 -0.55 -0.45 -1 -1 -1 z m 15 3 c 0 0.55 -0.45 1 -1 1 h -2 c -0.55 0 -1 0.45 -1 1 s 0.45 1 1 1 h 3 c 1.1 0 2 -0.9 2 -2 v -3 c 0 -0.55 -0.45 -1 -1 -1 s -1 0.45 -1 1 v 2 z m 0 -15 h -3 c -0.55 0 -1 0.45 -1 1 s 0.45 1 1 1 h 2 c 0.55 0 1 0.45 1 1 v 2 c 0 0.55 0.45 1 1 1 s 1 -0.45 1 -1 v -3 c 0 -1.1 -0.9 -2 -2 -2 z"
      ></path>
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"></rect>
    </svg>
  </button>
</template>

<style scoped></style>
