<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import { computed } from "vue";
import Tag from "./Tag.vue";

const transformStore = useTransformStore();
const pageStore = usePageStore();

const clearFilters = () => transformStore.clear();
const toggleFilterUntagged = () => transformStore.toggleFilterUntagged();
const isUntaggedFiltered = computed(() => transformStore.filterUntagged);

const filterTag = (tag: string) => transformStore.filterTag(tag);
</script>

<template>
  <div class="flex flex-row noScrollBar pl-2 overflow-scroll">
    <div class="hidden md:block" style="height: 28px">
      <!-- Spacer for timelines that have no tags to ensure the drawer header is a consistent height -->
    </div>
    <button
      class="mr-2 text-sm lg:text-base rounded bg-white hover:bg-zinc-100 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:bg-gray-800 dark:hover:text-gray-100 md:px-2 md:py-0 px-1 flex flex-row flex-shrink-0 items-center tagButton font-bold border-2 print-hidden"
      @click="clearFilters"
    >
      <span>Show all</span>
    </button>
    <button
      :class="{
        'dark:border-zinc-100 border-gray-900': isUntaggedFiltered,
      }"
      class="mr-2 text-sm lg:text-base rounded bg-white hover:bg-zinc-100 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:bg-gray-800 dark:hover:text-gray-100 md:px-2 md:py-0 px-1 flex flex-row flex-shrink-0 items-center tagButton font-bold border-2 print-hidden"
      @click="toggleFilterUntagged"
    >
      <div
        class="h-4 w-4 rounded border-2 border-dotted"
        :class="{
          'border-gray-900 dark:border-zinc-100': isUntaggedFiltered,
          'border-gray-400 dark:border-zinc-400': !isUntaggedFiltered,
        }"
      ></div>
      <span class="ml-2">Untagged</span>
    </button>
    <tag
      v-for="tag in Object.keys(pageStore.tags)"
      :key="tag"
      :tag="tag"
      :muted="false"
      @click="filterTag(tag)"
      :selected="transformStore.filter.includes(tag)"
    ></tag>
  </div>
</template>

<style scoped></style>
