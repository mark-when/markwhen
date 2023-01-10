<script setup lang="ts">
import { useTimelineStore } from "../timelineStore";

const timelineStore = useTimelineStore();

const toggle = () => timelineStore.toggleMiniMap();
</script>

<template>
  <button
    @click="toggle"
    class="h-6 flex flex-row items-center rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 px-1 text-sm lg:text-base font-bold relative"
  >
    <svg
      style="transform: rotate(180deg)"
      focusable="false"
      aria-hidden="true"
      viewBox="1 -1 20 21"
      class="w-5 h-5"
      fill="currentColor"
    >
      <path
        d="M 16 5 H 10 V 10 H 16 V 5 Z M 18 1 H 4 C 3 1 2 2 2 3 V 16 C 2 17 3 18 4 18 H 18 C 19 18 20 17 20 16 V 3 C 20 1.9 19.1 1 18 1 Z M 18 16 H 4 V 3 H 18 V 16 Z"
      ></path>
    </svg>
  </button>
</template>

<style scoped></style>
