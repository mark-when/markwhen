<script setup lang="ts">
import PageButtons from "./PageButtons/PageButtons.vue";
import { useViewStore } from "@/Views/viewStore";
import { computed } from "vue";
import Sort from "../Drawer/ViewSettings/Sort.vue";
import ViewSettings from "../Drawer/ViewSettings/ViewSettings.vue";
import VerticalSpacer from "./VerticalSpacer.vue";
import Filter from "./ViewSettings/Tags/Filter.vue";

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
    <div class="flex flex-col">
      <div
        class="flex pointer-events-auto bg-white dark:bg-slate-700 safeBottomPadding items-center"
      >
        <PageButtons v-if="viewStore.currentView.uses?.pages" />
        <VerticalSpacer />
        <div
          class="flex flex-row items-center overflow-auto overflow-visible justify-end"
          style="width: fit-content"
          v-if="
            viewStore.currentView.uses?.tags ||
            viewStore.currentView.uses?.sort ||
            (viewStore.currentView.settings &&
              viewStore.currentView.settings.length)
          "
        >
          <Sort v-if="viewStore.currentView.uses?.sort" />
          <ViewSettings />
          <Filter v-if="viewStore.currentView.uses?.tags" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
