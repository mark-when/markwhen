<script setup lang="ts">
const props = defineProps<{
  hovering: boolean;
  color: string | null | undefined;
}>();
</script>

<template>
  <div
    class="absolute h-full flex flex-row items-center dark:text-gray-400 transition ml-0 w-full"
    :class="{
      'dark:bg-opacity-30 bg-opacity-20': hovering,
      'dark:bg-opacity-20 bg-opacity-10': !hovering,
      'bg-gray-400 dark:bg-gray-800 border border-1 dark:border-gray-900/25 border-gray-400/25':
        !color,
    }"
    :style="
      color
        ? {
            backgroundColor: `rgba(${color}, ${hovering ? '0.09' : '0.05'}`,
            border: `1px solid rgba(${color}, 0.12)`,
          }
        : {}
    "
  ></div>
</template>

<style scoped></style>
