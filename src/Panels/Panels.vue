<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useViewStore } from "@/Views/viewStore";
import EventDetailPanel from "@/EventDetail/EventDetailPanel.vue";
import { PanelVisualization, usePanelStore } from "./panelStore";
import Dialogs from "@/Dialogs/Dialogs.vue";
import { useVisualizationStore } from "@/Views/visualizationStore";
import Visualizations from "./Visualizations.vue";
import ViewPicker from "@/WelcomeViewPicker/ViewPicker.vue";

const viewStore = useViewStore();
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
</script>

<template>
  <div class="flex flex-row w-full h-full overflow-auto">
    <div
      class="w-full h-full overflow-auto"
      :style="visualizationStyle"
      ref="visualizationContainer"
    >
      <KeepAlive>
        <Visualizations
          v-show="!visualizationStore.showingWelcomeViewPicker"
        ></Visualizations>
      </KeepAlive>
      <keep-alive>
        <ViewPicker v-show="visualizationStore.showingWelcomeViewPicker" />
      </keep-alive>
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
