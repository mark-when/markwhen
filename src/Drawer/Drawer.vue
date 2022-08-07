<script setup lang="ts">
import { useAppStore } from "@/App/appStore";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import PageButtons from "./PageButtons/PageButtons.vue";

const markwhenStore = useMarkwhenStore();
const { currentView } = useAppStore();

const description = markwhenStore.pageTimelineMetadata.description;
</script>

<template>
  <div
    class="flex flex-col sticky bottom-2 md:bottom-6 left-2 right-0 ml-2 md:left-4 md:ml-4 z-20 pointer-events-none drawerHeader"
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
  </div>
</template>

<style scoped></style>
