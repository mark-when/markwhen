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
      @click="visualizationStore.showWelcomeViewPicker"
      class="flex flex-row px-3 py-1 items-center gap-2 hover:bg-indigo-600"
      :class="{
        'bg-indigo-600': visualizationStore.showingWelcomeViewPicker,
      }"
    >
      <!-- <div class="w-4 h-4"></div> -->
      <span class="text-sm">All views...</span>
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
      @click="selectView(i)"
    >
      <div class="w-4 h-4" v-html="view.iconSvg"></div>
      <span class="text-sm">{{ view.name }}</span>
    </button>
  </div>
</template>

<style scoped></style>
