<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useViewStore } from "@/Views/viewStore";
import EventDetailPanel from "@/EventDetail/EventDetailPanel.vue";
import { PanelVisualization, usePanelStore } from "./panelStore";
import { useViewOrchestrator } from "@/Views/ViewOrchestrator/useViewOrchestrator";
import Timeline from "@/Views/Timeline/Timeline.vue";
import Dialogs from "@/Dialogs/Dialogs.vue";

const viewStore = useViewStore();
const panelStore = usePanelStore();
const currentView = computed(() => viewStore.currentView);
const detailVisible = computed(() => panelStore.detailPanelState.visible);
const currentViewComponent = computed(() => {
  if (viewStore.currentView.name === "Gantt") {
    return Timeline;
  }
  return viewStore.currentView.component();
});

const frames = ref<HTMLIFrameElement[]>();
const activeFrame = computed(() =>
  frames.value?.find((f) => f.id === `view_${currentView.value.name}`)
);

watchEffect(() => {
  viewStore.setActiveFrame(activeFrame.value)
})

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
      <iframe
        ref="frames"
        v-for="component in viewStore.framedViews"
        class="w-full h-full"
        v-show="currentViewComponent === component.component()"
        :src="component.component()"
        :id="`view_${component.name}`"
      ></iframe>
      <keep-alive>
        <component
          :is="currentViewComponent"
          :key="currentView.name === 'Gantt' ? 'Timeline' : currentView.name"
          v-if="typeof currentViewComponent !== 'string'"
        />
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
