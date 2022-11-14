<script setup lang="ts">
import { computed } from "vue";
import { useViewStore } from "@/Views/viewStore";
import EventDetailPanel from "@/EventDetail/EventDetailPanel.vue";
import { usePanelStore } from "./panelStore";
import Sort from "../Drawer/ViewSettings/Sort.vue";
import ViewSettings from "../Drawer/ViewSettings/ViewSettings.vue";
import Tags from "../Drawer/ViewSettings/Tags/Tags.vue";

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
</script>

<template>
  <div class="flex flex-row w-full h-full overflow-auto">
    <div class="w-full h-full overflow-auto" :style="visualizationStyle">
      <keep-alive>
        <component :is="currentView.component()" />
      </keep-alive>
      <div
        class="sticky bottom-0 left-0 right-0 flex flex-row items-center pointer-events-auto text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 hover:text-zinc-600"
        v-if="
          viewStore.currentView.uses?.tags ||
          viewStore.currentView.uses?.sort ||
          (viewStore.currentView.settings &&
            viewStore.currentView.settings.length)
        "
      >
        <div
          class="flex flex-row items-center md:flex-row md:backdrop-filter backdrop-blur overflow-auto pl-2 py-1 overflow-visible"
          style="width: fit-content"
        >
          <Sort v-if="viewStore.currentView.uses?.sort" />
          <ViewSettings />
          <Tags v-if="viewStore.currentView.uses?.tags" />
        </div>
      </div>
    </div>
    <EventDetailPanel v-if="detailVisible && !viewStore.isMobile" />
  </div>
</template>

<style scoped></style>
