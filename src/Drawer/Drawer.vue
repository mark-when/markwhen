<script setup lang="ts">
import PageButtons from "./PageButtons/PageButtons.vue";
import { useViewStore } from "@/Views/viewStore";
import { computed } from "vue";
import Sort from "../Drawer/ViewSettings/Sort.vue";
import Filter from "./ViewSettings/Tags/Filter.vue";
import NewEvent from "@/NewEvent/NewEvent.vue";
import ToggleSidebarButton from "@/Sidebar/ToggleSidebarButton.vue";
import Jump from "@/Jump/JumpButton.vue";
import ViewIndicator from "./ViewSwitcher/ViewIndicator.vue";

const viewStore = useViewStore();

const useTopBorder = computed(() => {
  const { uses } = viewStore.currentView;
  return uses?.drawerDescription || uses?.sort || uses?.tags;
});
</script>

<template>
  <div
    class="bg-slate-50 dark:bg-slate-700 border-t-slate-200 dark:border-t-slate-600 text-gray-500 dark:text-gray-300 z-10 pointer-events-auto bg-white dark:bg-slate-700 safeBottomPadding drawer grid"
    :class="{ 'border-t': useTopBorder }"
  >
    <div class="viewSwitcher items-center justify-center flex pl-2 pr-3">
      <ViewIndicator></ViewIndicator>
    </div>
    <div class="flex flex-row items-center px-1 saveState">
      <ToggleSidebarButton />
    </div>
    <PageButtons v-if="viewStore.currentView.uses?.pages" />
    <div
      class="viewSettings flex flex-row items-center lg:overflow-visible overflow-auto order-1 lg:order-3 px-2 py-1 lg:py-0 lg:px-0 lg:w-auto w-full noScrollBar lg:justify-end"
      v-if="
        viewStore.currentView.uses?.tags ||
        viewStore.currentView.uses?.sort ||
        (viewStore.currentView.settings &&
          viewStore.currentView.settings.length)
      "
    >
      <NewEvent></NewEvent>
      <Sort v-if="viewStore.currentView.uses?.sort" />
      <Jump v-if="viewStore.currentView.uses?.jump" />
      <!-- <ViewSettings /> -->
      <Filter v-if="viewStore.currentView.uses?.tags" />
    </div>
  </div>
</template>

<style scoped>
.drawer {
  grid-template-areas:
    "viewSwitcher viewSettings"
    "saveState pageButtons";

  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr 1fr;
}

@media (min-width: 1024px) {
  .drawer {
    grid-template-areas: "saveState viewSwitcher pageButtons viewSettings";
    grid-template-rows: 1fr;
    grid-template-columns: auto auto 1fr auto;
  }
}

.saveState {
  grid-area: saveState;
}
.viewSwitcher {
  grid-area: viewSwitcher;
}
.viewSettings {
  grid-area: viewSettings;
}
.pageButtons {
  grid-area: pageButtons;
}
</style>
