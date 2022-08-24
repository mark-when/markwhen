<script setup lang="ts">
import { isEditable } from "@/injectionKeys";
import { useMediaQuery } from "@vueuse/core";
import { computed, provide } from "vue";
import Drawer from "../Drawer/Drawer.vue";
import { useViewStore } from "@/Views/viewStore";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useAppStore } from "./appStore";
import Sidebar from "../Sidebar/Sidebar.vue";

const appStore = useAppStore();
const viewStore = useViewStore();
const currentView = viewStore.currentView;
const editorOrchestrator = useEditorOrchestratorStore();

const dark = useMediaQuery("(prefers-color-scheme: dark)");
const globalClass = computed(
  () => `${dark.value ? "dark" : "light"} ${appStore.globalClass}`
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
      class="flex flex-col md:flex-row h-full !bg-vscode-editor-background dark:bg-gray-700 bg-slate-100 dark:text-white text-gray-900"
    >
      <Sidebar />
      <component :is="currentView.component()" />
    </div>
    <Drawer />
  </div>
</template>

<style scoped></style>
