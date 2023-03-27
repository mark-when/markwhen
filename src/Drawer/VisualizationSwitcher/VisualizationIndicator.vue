<script setup lang="ts">
import SettingsButton from "@/Settings/SettingsButton.vue";
import HoverMenu from "../HoverMenu.vue";
import ViewSwitcherMenu from "./VisualizationSwitcherMenu.vue";
import { computed } from "vue";
import { useVisualizationStore } from "@/Views/visualizationStore";

const visualizationStore = useVisualizationStore();
const view = computed(() => visualizationStore.currentView);
const click = () => {
  visualizationStore.showingWelcomeViewPicker =
    !visualizationStore.showingWelcomeViewPicker;
};
</script>

<template>
  <SettingsButton
    class="p-1 w-full justify-center"
    :hover-hint-left="-1"
    @click="click"
  >
    <div
      class="flex flex-row items-center gap-1"
      v-if="!visualizationStore.showingWelcomeViewPicker"
    >
      <div class="w-4 h-4" v-html="view.iconSvg"></div>
      <span class="text-sm">{{ view.name }}</span>
    </div>
    <div class="flex flex-row items-center gap-1" v-else>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path
          d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
        ></path>
        <path
          d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
        ></path>
        <path
          d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
        ></path>
        <path d="M14 7l6 0"></path>
        <path d="M17 4l0 6"></path></svg
      ><span class="text-sm">Views</span>
    </div>
    <template #hover="slotProps">
      <HoverMenu :hovering="slotProps.hovering">
        <ViewSwitcherMenu></ViewSwitcherMenu>
      </HoverMenu>
    </template>
  </SettingsButton>
</template>

<style scoped></style>
