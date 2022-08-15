<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import { computed } from "vue";
import { useTagColor } from "./composables/useTagColor";

const transformStore = useTransformStore();

const props = defineProps<{ tag: string }>();

const isThisTagInFilter = computed(() =>
  transformStore.filter.includes(props.tag)
);
const { color } = useTagColor(props.tag);

const filterTag = () => transformStore.filterTag(props.tag);
</script>

<template>
  <button
    role="button"
    :title="isThisTagInFilter ? `Filtering by ${tag}` : `Filter by ${tag}`"
    :class="isThisTagInFilter ? `` : `dark:border-gray-900`"
    :style="{ borderColor: isThisTagInFilter ? `rgba(${color})` : '' }"
    class="flex flex-row items-center mr-2 md:px-2 md:py-0 px-1 rounded bg-slate-50 hover:bg-zinc-100 transition dark:bg-gray-800 tagButton font-bold border-2 dark:hover:bg-gray-900"
    @click="filterTag"
  >
    <div
      class="h-4 w-4 rounded"
      :style="{ backgroundColor: `rgba(${color}, 1)` }"
    >
      <svg
        v-if="isThisTagInFilter"
        class="h-4 w-4"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid="TagIcon"
        fill="white"
      >
        <path
          d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z"
        ></path>
      </svg>
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg> -->
    </div>
    <span class="ml-2">{{ tag }}</span>
  </button>
</template>

<style scoped></style>
