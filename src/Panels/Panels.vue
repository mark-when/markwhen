<script setup lang="ts">
import { computed } from "vue";
import { useViewStore } from "@/Views/viewStore";
import EventDetailPanel from "@/EventDetail/EventDetailPanel.vue";
import { usePanelStore } from "./panelStore";

const viewStore = useViewStore();
const panelStore = usePanelStore();
const currentView = computed(() => viewStore.currentView);
const detailVisible = computed(() => panelStore.detailPanelState.visible);

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

const currentComponent = computed(() => currentView.value.component());
const framedComponents = computed(() =>
  viewStore.views.filter((v) => typeof v.component() === "string")
);
</script>

<template>
  <div class="flex flex-row w-full h-full overflow-auto">
    <div class="w-full h-full overflow-auto" :style="visualizationStyle">
      <iframe
        v-for="component in framedComponents"
        class="w-full h-full"
        v-show="currentComponent === component.component()"
        :src="component.component()"
        :id="`view_${currentView.name}`"
      ></iframe>
      <keep-alive>
        <component
          :is="currentComponent"
          v-if="typeof currentComponent !== 'string'"
        />
      </keep-alive>
    </div>
    <EventDetailPanel v-if="detailVisible && !viewStore.isMobile" />
  </div>
</template>

<style scoped></style>
