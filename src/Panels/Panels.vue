<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMobileViewStore } from "@/Views/mobileViewStore";
import EventDetailPanel from "@/EventDetail/EventDetailPanel.vue";
import { PanelVisualization, usePanelStore } from "./panelStore";
import Dialogs from "@/Dialogs/Dialogs.vue";
import { useVisualizationStore } from "@/Views/visualizationStore";
import Visualizations from "./Visualizations.vue";
import WelcomeViewPicker from "@/WelcomeViewPicker/WelcomeViewPicker.vue";

const viewStore = useMobileViewStore();
const visualizationStore = useVisualizationStore();
const panelStore = usePanelStore();
const detailVisible = computed(() => panelStore.detailPanelState.visible);

const visualizationContainer = ref();

const translateX = computed(
  () => panelStore.visualizationPanelState.translation
);

const visualizationStyle = computed(() => {
  if (translateX.value !== 0) {
    return {
      transform: `translateX(${translateX.value}px)`,
      transition: `transform cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
    };
  }
  const givenTranslation = panelStore.visualizationPanelState.translation;
  if (givenTranslation) {
    return {
      transform: `translateX(${givenTranslation}px)`,
      transition: `transform cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
    };
  } else if (panelStore.isMoving) {
    return {
      transition: `transform cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
    };
  }
});

onMounted(() => {
  panelStore.setPanelElement(PanelVisualization, visualizationContainer.value);
});

const showVisualizations = computed(() => {
  if (viewStore.isMobile) {
    return !visualizationStore.showingWelcomeViewPicker;
  }
  return !visualizationStore.showingWelcomeViewPicker;
});

const showWelcomeViewPicker = computed(() => {
  if (viewStore.isMobile) {
    return visualizationStore.showingWelcomeViewPicker;
  }
  return visualizationStore.showingWelcomeViewPicker;
});
</script>

<template>
  <div class="flex flex-row w-full h-full overflow-auto">
    <div
      class="w-full h-full overflow-auto"
      :style="visualizationStyle"
      ref="visualizationContainer"
    >
      <Visualizations v-show="showVisualizations"></Visualizations>
      <WelcomeViewPicker v-show="showWelcomeViewPicker" />
      <div class="absolute inset-0 frameCover"></div>
    </div>
    <EventDetailPanel v-if="detailVisible && !viewStore.isMobile" />
    <Dialogs />
  </div>
</template>

<style scoped>
.frameCover {
  pointer-events: none;
}
.resizing .frameCover {
  pointer-events: auto;
}
</style>
