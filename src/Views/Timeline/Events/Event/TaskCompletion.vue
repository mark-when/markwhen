<script setup lang="ts">
const { taskNumerator, taskDenominator, completed } = defineProps<{
  taskNumerator: number;
  taskDenominator: number;
  completed?: boolean;
}>();
</script>

<template>
  <div class="text-xs font-mono font-bold flex flex-row items-center">
    <svg
      class="h-4 w-4 mr-[2px]"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        v-if="
          completed || (taskNumerator > 0 && taskNumerator === taskDenominator)
        "
        stroke-width="2"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 16.17 5.53 12.7a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L9 16.17z"
      ></path>
      <path
        v-else-if="
          taskNumerator === 0 ||
          (!taskDenominator && typeof completed !== 'undefined')
        "
        d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
      ></path>
      <path
        v-else
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"
      ></path></svg
    ><span class="pt-px mr-1" v-if="taskDenominator"
      >{{ taskNumerator }}/{{ taskDenominator }}</span
    >
  </div>
</template>

<style scoped></style>
