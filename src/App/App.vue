<script setup lang="ts">
import { isEditable } from "@/injectionKeys";
import { computed, provide } from "vue";
import Drawer from "../Drawer/Drawer.vue";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useAppStore } from "./appStore";
import { usePageEffects } from "@/Markwhen/composables/usePageEffects";
import Sidebar from "../Sidebar/Sidebar.vue";
import { useAppHead } from "./composables/useAppHead";
import Panels from "../Panels/Panels.vue";
import { useSidebarStore } from "@/Sidebar/sidebarStore";
import { useKeyboardStore } from "@/Keyboard/keyboardStore";
import { useQuerySetter } from "@/router/useQuerySetter";
import { useAppSettingsStore } from "@/AppSettings/appSettingsStore";
import QuickEditor from "@/QuickEditor/QuickEditor.vue";

const appSettingsStore = useAppSettingsStore();
const appStore = useAppStore();
const sidebarStore = useSidebarStore();
const editorOrchestrator = useEditorOrchestratorStore();

usePageEffects();
useAppHead();
useKeyboardStore();
useQuerySetter();

const globalClass = computed(
  () =>
    `${appSettingsStore.inferredDarkMode ? "dark" : "light"} ${
      appStore.globalClass
    }`
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
      class="flex flex-row h-full !bg-vscode-editor-background dark:bg-slate-700 bg-slate-50 dark:text-white text-gray-900 relative w-full"
    >
      <Sidebar v-show="sidebarStore.visible" />
      <div class="flex flex-col overflow-auto w-full">
        <Panels />
        <Drawer />
      </div>
      <!-- Uncomment the QuickEditor to have some editing functionality -->
      <!-- <QuickEditor /> -->
    </div>
  </div>
</template>
<style scoped></style>
