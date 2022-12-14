<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import { computed, ref } from "vue";
import { useTagColor } from "./composables/useTagColor";
import FilterDialog from "./FilterDialog.vue";

const transformStore = useTransformStore();

const hovering = ref(false);
const filtered = computed(() => transformStore.filter);

const colorForTag = (tag: string) => {
  return useTagColor(tag);
};

const clear = () => transformStore.clear();

const clearFilterTitle = computed(() => {
  if (transformStore.filterUntagged) {
    if (!filtered.value.length) {
      return "Untagged";
    }
    return "Untagged + " + filtered.value.length;
  }
  if (filtered.value.length === 1) {
    return filtered.value[0];
  }
  return `${filtered.value[0]} + ${filtered.value.length - 1}`;
});

const mouseover = () => {
  hovering.value = true;
};

const mouseleave = () => {
  hovering.value = false;
};

const showFilters = () => {
  transformStore.setFilterDialogShowing(true);
  hovering.value = false;
};

const displayTags = computed(() => {
  const tags = [];
  if (transformStore.filterUntagged) {
    tags.push({
      name: "Untagged",
      color: "black",
    });
  }
  const filters = [...transformStore.filter];
  while (tags.length < 3 && filters.length) {
    const f = filters.pop()!;
    tags.push({
      name: f,
      color: `rgb(${colorForTag(f).value})`,
    });
  }
  return tags;
});
</script>

<template>
  <button
    class="h-6 ml-1 text-sm lg:text-base rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 px-1 flex flex-row flex-shrink-0 items-center tagButton font-bold print-hidden"
    @click="clear"
    v-if="displayTags.length"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
  >
    <div class="relative">
      <div
        v-for="(tag, i) in displayTags"
        class="w-4 h-4 rounded absolute"
        :style="{
          backgroundColor: tag.color,
          left: `${5 * i}px`,
          zIndex: filtered.length - i,
        }"
      >
        <svg
          v-if="i === 0 && hovering"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4 mr-1"
          stroke="rgba(255, 255, 255, 0.5)"
          stroke-width="1"
        >
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      </div>
      <div
        class="w-4 h-4"
        :style="{
          marginRight: `${2 + filtered.slice(0, 3).length * 5}px`,
        }"
      ></div>
    </div>
    <span class="" :class="hovering ? 'line-through' : ''">{{
      clearFilterTitle
    }}</span>
  </button>
  <button
    class="h-6 mr-1 text-sm lg:text-base rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 px-1 flex flex-row flex-shrink-0 items-center tagButton font-bold print-hidden"
    @click="showFilters"
  >
    <span
      ><svg
        class="h-4 w-4"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61z"
        ></path>
      </svg>
    </span>
    <span class="ml-1">Filter</span>
  </button>
  <FilterDialog />
</template>

<style scoped></style>
