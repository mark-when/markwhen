<script setup lang="ts">
import { useAppStore } from "@/App/appStore";
import { isEditable } from "@/injectionKeys";
import { useMediaQuery } from "@vueuse/core";
import { computed, provide } from "vue";
import Drawer from "../Drawer/Drawer.vue";

const appStore = useAppStore();
const currentView = appStore.currentView;

const dark = useMediaQuery("(prefers-color-scheme: dark)");
const globalClass = computed(() => (dark.value ? "dark" : "light"));

provide(isEditable, appStore.editable);
</script>

<template>
  <div
    :class="globalClass"
    class="h-full w-full"
    style="print-color-adjust: exact"
  >
    <div
      class="flex flex-col md:flex-row h-full !bg-vscode-editor-background dark:bg-gray-700 bg-slate-100 dark:text-white text-gray-900"
    >
      <component :is="currentView.component" />
    </div>
    <Drawer />
  </div>
</template>

<style scoped></style>
