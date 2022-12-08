<script setup lang="ts">
import { isEditable } from "@/injectionKeys";
import { computed, provide, watch } from "vue";
import Drawer from "../Drawer/Drawer.vue";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useAppStore } from "./appStore";
import { usePageEffects } from "@/Markwhen/composables/usePageEffects";
import Sidebar from "../Sidebar/Sidebar.vue";
import { useAppHead } from "./composables/useAppHead";
import Panels from "../Panels/Panels.vue";
import { useSidebarStore } from "@/Sidebar/sidebarStore";
import { useKeyboardStore } from "@/Keyboard/keyboardStore";
import { useVsCode } from "@/VSCode/composables/useVsCode";

const appStore = useAppStore();
const sidebarStore = useSidebarStore();
const editorOrchestrator = useEditorOrchestratorStore();

useVsCode()
usePageEffects();
useAppHead();
useKeyboardStore();

const globalClass = computed(
  () =>
    `${appStore.inferredDarkMode ? "dark" : "light"} ${appStore.globalClass}`
);

provide(isEditable, editorOrchestrator.editable);
</script>

<template>
  <div
    :class="globalClass"
    class="h-full w-full"
    style="print-color-adjust: exact"
  >
    <div
      class="flex flex-row h-full dark:bg-gray-700 bg-slate-100 dark:text-white text-gray-900 relative"
    >
      <Sidebar v-show="sidebarStore.visible" />
      <div class="flex flex-col overflow-auto w-full">
        <Panels />
        <Drawer />
      </div>
      <QuickEditor />
    </div>
  </div>
</template>

<style scoped></style>
