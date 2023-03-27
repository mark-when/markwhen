<script setup lang="ts">
import {
  useAppSettingsStore,
  defaultViewOptions,
  themeOptions,
} from "@/AppSettings/appSettingsStore";
import { useVisualizationStore } from "@/Views/visualizationStore";

const settingsStore = useAppSettingsStore();
const visualizationStore = useVisualizationStore();
</script>

<template>
  <div class="gap-2 flex flex-col overflow-scroll">
    <div class="flex flex-col px-2 gap-2">
      <!-- <div class="ml-2 flex">
        <label for="defaultView" class="mr-auto">Default view</label>
        <select
          v-model="settingsStore.defaultView"
          id="defaultView"
          class="dark:bg-gray-800 bg-slate-50"
        >
          <option v-for="view in defaultViewOptions">{{ view }}</option>
        </select>
      </div> -->
      <div class="ml-2 flex">
        <label for="theme" class="mr-auto">Theme</label>
        <select
          v-model="settingsStore.theme"
          id="theme"
          class="dark:bg-gray-800 bg-slate-50"
        >
          <option v-for="themeOption in themeOptions">{{ themeOption }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
