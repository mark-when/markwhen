<script setup lang="ts">
import type { ViewProvider } from "@/viewProvider";
import { useVisualizationStore } from "@/Views/visualizationStore";
import { computed } from "vue";
import Spacer from "../Spacer.vue";

const visualizationStore = useVisualizationStore();

const activeViews = computed(() => visualizationStore.activeViews);

const selectView = (i: number) => {
  visualizationStore.showingWelcomeViewPicker = false;
  visualizationStore.selectedViewIndex = i;
};
</script>

<template>
  <div class="flex flex-col">
    <button
      @click.stop="visualizationStore.showWelcomeViewPicker"
      class="flex flex-row px-3 py-1 items-center gap-2 hover:bg-indigo-600"
      :class="{
        'bg-indigo-600': visualizationStore.showingWelcomeViewPicker,
      }"
    >
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
      ><span class="text-sm">Views...</span>
    </button>
    <hr class="border-slate-700 my-[2px]" />
    <button
      v-for="(view, i) in activeViews"
      :class="{
        'bg-indigo-600':
          !visualizationStore.showingWelcomeViewPicker &&
          visualizationStore.currentView.name === view.name,
      }"
      class="flex flex-row px-3 py-1 items-center gap-2 hover:bg-indigo-600"
      @click.stop="selectView(i)"
    >
      <div class="w-4 h-4" v-html="view.iconSvg"></div>
      <span class="text-sm">{{ view.name }}</span>
    </button>
  </div>
</template>

<style scoped></style>
