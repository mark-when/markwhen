<script setup lang="ts">
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import PageButtons from "./PageButtons/PageButtons.vue";
import ViewSwitcher from "./ViewSwitcher.vue";
import Sort from "./ViewSettings/Sort.vue";
import ViewSettings from "./ViewSettings/ViewSettings.vue";
import { useViewStore } from "@/Views/viewStore";

const markwhenStore = useMarkwhenStore();
const { currentView } = useViewStore();

const description = markwhenStore.pageTimelineMetadata.description;
</script>

<template>
  <div
    class="flex flex-col absolute bottom-2 md:bottom-6 left-2 right-0 ml-2 z-20 pointer-events-none drawerHeader"
  >
    <div
      class="pointer-events-auto"
      v-if="currentView.uses?.drawerDescription && description"
    >
      <h4 class="text-lg font-medium text-gray-400 pl-1 timelineTitle">
        {{ description }}
      </h4>
    </div>
    <div class="ml-1 py-1 flex pointer-events-auto">
      <PageButtons />
    </div>
    <div
      class="flex flex-row items-center pointer-events-auto text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 hover:text-zinc-600"
      style="width: fit-content"
    >
      <ViewSwitcher />
      <div
        class="flex flex-col items-center md:flex-row md:backdrop-filter backdrop-blur overflow-x-scroll px-1 md:py-2 py-1"
        style="width: fit-content"
      >
        <Sort v-if="currentView.uses?.sort" />
        <ViewSettings />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
