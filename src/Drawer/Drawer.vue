<script setup lang="ts">
import PageButtons from "./PageButtons/PageButtons.vue";
import { useViewStore } from "@/Views/viewStore";
import { computed } from "vue";
import Sort from "../Drawer/ViewSettings/Sort.vue";
import Filter from "./ViewSettings/Tags/Filter.vue";
import NewEvent from "@/NewEvent/NewEvent.vue";
import ToggleSidebarButton from "@/Sidebar/ToggleSidebarButton.vue";
import Jump from "@/Jump/JumpButton.vue";

const viewStore = useViewStore();

const useTopBorder = computed(() => {
  const { uses } = viewStore.currentView;
  return uses?.drawerDescription || uses?.sort || uses?.tags;
});
</script>

<template>
  <div
    class="bg-slate-50 dark:bg-slate-700 border-t-slate-200 dark:border-t-slate-600 text-gray-500 dark:text-gray-300 z-10 flex lg:flex-row flex-col pointer-events-auto bg-white dark:bg-slate-700 safeBottomPadding items-start lg:items-center"
    :class="{ 'border-t': useTopBorder }"
  >
    <div
      class="flex flex-row order-2 lg:order-1 overflow-hidden lg:overflow-visible w-full"
      style="min-width: 0"
    >
      <div class="dark:bg-slate-700 px-2 items-center justify-center flex">
        <ToggleSidebarButton />
      </div>
      <PageButtons v-if="viewStore.currentView.uses?.pages" />
    </div>
    <div
      class="flex flex-row items-center lg:overflow-visible overflow-auto order-1 lg:order-3 px-2 py-1 lg:py-0 lg:px-0 lg:w-auto w-full noScrollBar lg:justify-end"
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

<style scoped></style>
