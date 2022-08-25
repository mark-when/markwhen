<script setup lang="ts">
const { taskNumerator, taskDenominator } = defineProps<{ taskNumerator: number, taskDenominator: number }>()

</script>

<template>
  <div class="text-xs font-mono font-bold flex flex-row items-center">
    <svg class="h-4 w-4 mr-[2px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path v-if="taskNumerator > 0 && taskNumerator === taskDenominator"
        d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z">
      </path>
      <path v-else-if="taskNumerator === 0"
        d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
      <path v-else d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z">
      </path>
    </svg><span class="pt-px">{{ taskNumerator }}/{{ taskDenominator }}</span>
  </div>
</template>

<style scoped>
</style>