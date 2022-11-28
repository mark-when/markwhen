<script setup lang="ts">
import { useTagColor } from "./composables/useTagColor";

const props = defineProps<{ tag: string; selected: boolean }>();
const emit = defineEmits<{ (event: "click"): void }>();

const color = useTagColor(props.tag);
</script>

<template>
  <button
    role="button"
    :title="selected ? `Filtering by ${tag}` : `Filter by ${tag}`"
    class="mx-2 mb-1 p-1 flex border flex-row items-center rounded bg-white transition dark:bg-gray-800 tagButton font-bold text-sm lg:text-base"
    @click="emit('click')"
    :class="{
      'border-transparent': !selected,
    }"
    :style="{
      backgroundColor: selected ? `rgba(${color}, 0.2)` : '',
      borderColor: selected ? `rgba(${color}, 1)` : '',
    }"
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

<style scoped>
button:hover {
  background-color: rgba(v-bind(color), 0.1);
}
</style>
