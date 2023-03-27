<script setup lang="ts">
import SettingsButton from "@/Settings/SettingsButton.vue";
import HoverMenu from "../HoverMenu.vue";
import ViewSwitcherMenu from "./VisualizationSwitcherMenu.vue";
import { computed } from "vue";
import { useVisualizationStore } from "@/Views/visualizationStore";

const visualizationStore = useVisualizationStore();
const view = computed(() => visualizationStore.currentView);
</script>

<template>
  <SettingsButton class="p-1 w-full justify-center" :hover-hint-left="-1">
    <div class="flex flex-row items-center gap-1">
      <div class="w-4 h-4" v-html="view.iconSvg"></div>
      <span class="text-sm">{{ view.name }}</span>
    </div>
    <template #hover="slotProps">
      <HoverMenu :hovering="slotProps.hovering">
        <ViewSwitcherMenu></ViewSwitcherMenu>
      </HoverMenu>
    </template>
  </SettingsButton>
</template>

<style scoped></style>
