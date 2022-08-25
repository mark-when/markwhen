<script setup lang="ts">
import { isEditable } from "@/injectionKeys";
import { computed, provide } from "vue";
import Drawer from "../Drawer/Drawer.vue";
import { useViewStore } from "@/Views/viewStore";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useAppStore } from "./appStore";
import Sidebar from "../Sidebar/Sidebar.vue";
import { useSidebarStore } from "@/Sidebar/sidebarStore";

const appStore = useAppStore();
const viewStore = useViewStore();
const currentView = viewStore.currentView;
const editorOrchestrator = useEditorOrchestratorStore();
const sidebarStore = useSidebarStore();

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
      class="flex flex-row h-full !bg-vscode-editor-background dark:bg-gray-700 bg-slate-100 dark:text-white text-gray-900"
    >
      <Sidebar />
      <div
        class="flex flex-col w-full h-full overflow-auto"
        :class="{
          'order-1': !sidebarStore.isLeft,
          'order-2': sidebarStore.isLeft,
        }"
      >
        <component :is="currentView.component()" />
        <Drawer />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
