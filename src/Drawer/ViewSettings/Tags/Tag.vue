<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import { computed } from "vue";
import { useTagColor } from "./composables/useTagColor";

const transformStore = useTransformStore();

const props = defineProps<{ tag: string; selected: boolean; muted: boolean }>();
const emit = defineEmits<{ (event: "click"): void }>();

const { color } = useTagColor(props.tag);
</script>

<template>
  <button
    role="button"
    :title="selected ? `Filtering by ${tag}` : `Filter by ${tag}`"
    :class="{ 'dark:border-gray-900': !selected, 'border-2': !muted }"
    :style="{ borderColor: selected && !muted ? `rgba(${color})` : '' }"
    class="flex flex-row items-center mr-2 md:px-2 md:py-0 px-1 rounded bg-slate-50 hover:bg-zinc-100 transition dark:bg-gray-800 tagButton font-bold text-sm lg:text-base dark:hover:bg-gray-900"
    @click="emit('click')"
  >
    <div
      class="h-4 w-4 rounded"
      :style="{ backgroundColor: `rgba(${color}, 1)` }"
    >
      <svg
        v-if="selected"
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
    </div>
    <span class="ml-2">{{ tag }}</span>
  </button>
</template>

<style scoped></style>
