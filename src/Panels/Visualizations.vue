<script setup lang="ts">
import { useVisualizationStore } from "@/Views/visualizationStore";
import { computed, ref, watchEffect } from "vue";

const visualizationStore = useVisualizationStore();

const currentView = computed(() => visualizationStore.currentView);

const currentViewComponent = computed(() => {
  return currentView.value.url;
});
const frames = ref<HTMLIFrameElement[]>();
const activeFrame = computed(() =>
  frames.value?.find(
    (f) => f.id === `view_${currentView.value.name}_${currentView.value.url}`
  )
);

watchEffect(() => {
  visualizationStore.setActiveFrame(activeFrame.value);
});
</script>

<template>
  <div class="w-full h-full">
    <iframe
      ref="frames"
      v-for="component in visualizationStore.activeViews"
      class="w-full h-full"
      v-show="currentViewComponent === component.url"
      allow="web-share; clipboard-read; clipboard-write; "
      :src="component.url"
      :id="`view_${component.name}_${component.url}`"
    ></iframe>
  </div>
</template>

<style scoped></style>
