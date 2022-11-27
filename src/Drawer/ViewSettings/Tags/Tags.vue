<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import { computed } from "vue";
import Tag from "./Tag.vue";
import Filter from "./Filter.vue";

const transformStore = useTransformStore();
const pageStore = usePageStore();

const clearFilters = () => transformStore.clear();
const toggleFilterUntagged = () => transformStore.toggleFilterUntagged();
const isUntaggedFiltered = computed(() => transformStore.filterUntagged);

const filterTag = (tag: string) => transformStore.filterTag(tag);
const tags = computed(() => {
  return Object.keys(pageStore.tags);
});
</script>

<template>
  <Filter />
  <div class="flex flex-row noScrollBar pl-2 overflow-scroll">
    <div class="hidden md:block" style="height: 28px">
      <!-- Spacer for timelines that have no tags to ensure the drawer header is a consistent height -->
    </div>
    <button
      class="mr-2 text-sm lg:text-base rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 md:px-2 md:py-0 px-1 flex flex-row flex-shrink-0 items-center tagButton font-bold print-hidden"
      @click="clearFilters"
    >
      <span
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            fill-rule="evenodd"
            d="M5.965 4.904l9.131 9.131a6.5 6.5 0 00-9.131-9.131zm8.07 10.192L4.904 5.965a6.5 6.5 0 009.131 9.131zM4.343 4.343a8 8 0 1111.314 11.314A8 8 0 014.343 4.343z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <span class="ml-1">Clear filters</span>
    </button>
    <button
      :class="{
        'dark:border-zinc-100 border-gray-900': isUntaggedFiltered,
        'border-transparent': !isUntaggedFiltered,
      }"
      class="mr-2 text-sm lg:text-base rounded border bg-white hover:bg-zinc-100 transition dark:hover:bg-gray-900 dark:bg-gray-800 dark:hover:text-gray-100 md:px-2 md:py-0 px-1 flex flex-row flex-shrink-0 items-center tagButton font-bold print-hidden"
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
      v-for="tag in tags"
      :key="tag"
      :tag="tag"
      :muted="false"
      @click="filterTag(tag)"
      :selected="transformStore.filter.includes(tag)"
    ></tag>
  </div>
</template>

<style scoped></style>
