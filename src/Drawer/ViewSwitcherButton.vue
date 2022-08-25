<script setup lang="ts">
defineProps<{ selected: boolean }>();
</script>

<template>
  <button
    @click="$emit('click')"
    class="rounded p-1 border-2"
    :class="
      selected
        ? 'border-blue-300 bg-blue-50 dark:bg-slate-600 dark:border-slate-500 dark:text-gray-300'
        : 'border-transparent'
    "
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
