<script setup lang="ts">
import { useAppStore } from './app/store';
import Timeline from './timeline/Timeline.vue';

const appStore = useAppStore()
const view = appStore.view
const darkMode = appStore.inferredDarkMode
const globalClass = darkMode
</script>

<template>
  <div :class="globalClass" class="h-full w-full" style="print-color-adjust: exact">
    <div class="
        flex flex-col
        md:flex-row
        h-full
        dark:bg-gray-700
        bg-slate-100
        dark:text-white
        text-gray-900
      ">
      <Timeline />
    </div>
  </div>
</template>

<style scoped>
</style>
