<script setup lang="ts">
import ViewSwitcher from "@/Drawer/ViewSwitcher.vue";
import DarkModeButton from "./DarkModeButton.vue";
</script>

<template>
  <div
    class="flex h-full flex-col bg-slate-50 dark:bg-slate-800 text-zinc-600 dark:text-zinc-200 overflow-y-auto flex-shrink-0 border-slate-200 dark:border-slate-600 border-r z-30 px-[2px]"
    style="-webkit-transform: translate3d(0, 0, 0); overflow: visible"
  >
    <div class="mb-auto flex items-center justify-center pt-2"></div>
    <div class="flex flex-col">
      <div class="flex flex-col items-center justify-center">
        <ViewSwitcher />
      </div>
      <div class="h-10 flex flex-col items-center justify-center">
        <DarkModeButton />
      </div>
      <div class="safeBottomPadding"></div>
    </div>
  </div>
</template>

<style scoped></style>
