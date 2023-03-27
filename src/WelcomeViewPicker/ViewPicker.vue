<script setup lang="ts">
import VisualizationOption from "./VisualizationOption.vue";
import { useVisualizationStore } from "@/Views/visualizationStore";
import type { ViewProvider } from "@/viewProvider";
import { onMounted } from "vue";
import CustomViewOption from "./CustomViewOption.vue";

const visualizationStore = useVisualizationStore();

const toggleView = (v: ViewProvider) => {
  if (!v.active) {
    visualizationStore.selectedViewIndex = 0;
    v.active = true;
  } else if (visualizationStore.activeViews.length > 1) {
    visualizationStore.selectedViewIndex = 0;
    v.active = !v.active;
  }
};

const removeView = (v: ViewProvider) => {
  const index = visualizationStore.viewOptions.findIndex(
    (vo) => v.name === vo.name && v.url === vo.url
  );
  if (index >= 0) {
    visualizationStore.viewOptions.splice(index, 1);
  }
};

const select = (v: ViewProvider) => {
  v.active = true;
  const index = visualizationStore.activeViews.findIndex(
    (vo) => v.name === vo.name && v.url === vo.url
  );
  visualizationStore.selectedViewIndex = index;
  visualizationStore.showingWelcomeViewPicker = false
};
</script>

<template>
  <section class="pt-4">
    <h1 class="text-lg font-bold py-1 px-2">Views</h1>
    <div class="grid @lg:grid-cols-2 grid-rows-auto gap-4 grid-cols-1">
      <VisualizationOption
        v-for="view in visualizationStore.viewOptions"
        :vp="view"
        :is-active="!!view.active"
        @toggle="toggleView(view)"
        @remove="removeView(view)"
        @click="select(view)"
      ></VisualizationOption>
      <!-- <CustomViewOption></CustomViewOption> -->
    </div>
  </section>
</template>

<style scoped></style>
