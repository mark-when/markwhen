<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import { computed } from "vue";
import Dialog from "@/Dialog/Dialog.vue";
import TagRow from "./TagRow.vue";

const transformStore = useTransformStore();
const pageStore = usePageStore();

const dialogShowing = computed({
  get() {
    return transformStore.filterDialogShowing;
  },
  set(val: boolean) {
    transformStore.setFilterDialogShowing(val);
  },
});
const tags = computed(() => Object.keys(pageStore.tags));
const filterTag = (tag: string) => transformStore.filterTag(tag);
const filterUntagged = computed({
  get: () => transformStore.filterUntagged,
  set: transformStore.toggleFilterUntagged,
});
const clearFilters = () => {
  transformStore.clear();
  dialogShowing.value = false;
};
</script>

<template>
  <Dialog v-model="dialogShowing" overflow="scroll">
    <template #header>
      <div
        class="p-2 flex flex-row items-center dark:text-white text-gray-800 font-bold"
      >
        Filter tags
      </div></template
    >
    <div class="flex flex-col dark:text-white text-gray-800">
      <button
        class="mx-2 mb-1 p-1 text-sm lg:text-base rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 flex flex-row flex-shrink-0 items-center tagButton font-bold print-hidden"
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
        <span class="ml-2">Clear filters</span>
      </button>
      <button
        :class="{
          'dark:border-zinc-100 border-gray-900': filterUntagged,
          'border-transparent': !filterUntagged,
        }"
        class="mx-2 mb-1 p-1 text-sm lg:text-base rounded border bg-white hover:bg-zinc-100 transition dark:hover:bg-gray-900 dark:bg-gray-800 dark:hover:text-gray-100 flex flex-row flex-shrink-0 items-center tagButton font-bold print-hidden"
        @click="filterUntagged = !filterUntagged"
      >
        <div
          class="h-4 w-4 rounded border-2 border-dotted"
          :class="{
            'border-gray-900 dark:border-zinc-100': filterUntagged,
            'border-gray-400 dark:border-zinc-400': !filterUntagged,
          }"
        ></div>
        <span class="ml-2">Untagged</span>
      </button>
      <tag-row
        v-for="tag in tags"
        :key="tag"
        :tag="tag"
        :muted="false"
        @click="filterTag(tag)"
        :selected="transformStore.filter.includes(tag)"
      ></tag-row>
    </div>
  </Dialog>
</template>

<style scoped></style>
