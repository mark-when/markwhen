<script setup lang="ts">
import PageButtons from "./PageButtons/PageButtons.vue";
import { useViewStore } from "@/Views/viewStore";
import { computed } from "vue";

const viewStore = useViewStore();

const useTopBorder = computed(() => {
  const { uses } = viewStore.currentView;
  return uses?.drawerDescription || uses?.sort || uses?.tags;
});
</script>

<template>
  <div
    class="drawerHeader bg-slate-50 dark:bg-slate-800 border-t-slate-200 dark:border-t-slate-600 z-20 backdrop-filter backdrop-blur"
    :class="{ 'border-t': useTopBorder }"
  >
    <div class="flex flex-col">
      <!-- <div
        class="pointer-events-auto px-2 pt-1"
        v-if="viewStore.currentView.uses?.drawerDescription && description"
      >
        <h4 class="lg:text-lg font-medium text-gray-400 pl-1 timelineTitle">
          {{ description }}
        </h4>
      </div> -->
      <!-- <div
        class="flex flex-row items-center pointer-events-auto text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 hover:text-zinc-600"
        v-if="
          viewStore.currentView.uses?.tags ||
          viewStore.currentView.uses?.sort ||
          (viewStore.currentView.settings &&
            viewStore.currentView.settings.length)
        "
      >
        <div
          class="flex flex-row items-center md:flex-row md:backdrop-filter backdrop-blur overflow-auto pl-1 py-1"
          style="width: fit-content"
        >
          <Sort v-if="viewStore.currentView.uses?.sort" />
          <ViewSettings />
          <Tags v-if="viewStore.currentView.uses?.tags" />
        </div>
      </div> -->
      <div
        class="flex pointer-events-auto bg-white dark:bg-slate-700 safeBottomPadding"
      >
        <PageButtons v-if="viewStore.currentView.uses?.pages" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
