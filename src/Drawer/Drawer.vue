<script setup lang="ts">
import PageButtons from "./PageButtons/PageButtons.vue";
import { useViewStore } from "@/Views/viewStore";
import { computed } from "vue";
import Sort from "../Drawer/ViewSettings/Sort.vue";
import ViewSettings from "../Drawer/ViewSettings/ViewSettings.vue";
import Filter from "./ViewSettings/Tags/Filter.vue";
import NewEvent from "@/NewEvent/NewEvent.vue";
import ToggleSidebarButton from "@/Sidebar/ToggleSidebarButton.vue";

const viewStore = useViewStore();

const useTopBorder = computed(() => {
  const { uses } = viewStore.currentView;
  return uses?.drawerDescription || uses?.sort || uses?.tags;
});
</script>

<template>
  <div
    class="drawerHeader bg-slate-50 dark:bg-slate-800 border-t-slate-200 dark:border-t-slate-600 text-gray-500 dark:text-gray-300 z-10"
    :class="{ 'border-t': useTopBorder }"
  >
    <div
      class="flex lg:flex-row flex-col pointer-events-auto bg-white dark:bg-slate-700 safeBottomPadding items-start lg:items-center"
    >
      <div class="flex flex-row order-2 lg:order-1" style="min-width: 0">
        <div class="dark:bg-slate-700 px-2 items-center justify-center flex">
          <ToggleSidebarButton />
        </div>
        <PageButtons v-if="viewStore.currentView.uses?.pages" />
      </div>
      <div
        class="rounded bg-gray-300 dark:bg-slate-600 h-4 w-[2px] mr-1 ml-auto lg:block hidden order-2"
      ></div>
      <div
        class="flex flex-row items-center overflow-auto overflow-visible justify-end order-1 lg:order-3 px-2 py-1 lg:py-0 lg:px-0"
        style="width: fit-content"
        v-if="
          viewStore.currentView.uses?.tags ||
          viewStore.currentView.uses?.sort ||
          (viewStore.currentView.settings &&
            viewStore.currentView.settings.length)
        "
      >
        <NewEvent></NewEvent>
        <Sort v-if="viewStore.currentView.uses?.sort" />
        <ViewSettings />
        <Filter v-if="viewStore.currentView.uses?.tags" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
