<script setup lang="ts">
import { ref } from "vue";
import type { Timeline } from "@markwhen/parser/lib/Types";
import { computed } from "@vue/reactivity";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { useAppStore } from "@/App/appStore";

const appStore = useAppStore();
const markwhenStore = useMarkwhenStore();

const props = defineProps<{
  timeline: Timeline;
  pageIndex: number;
  shadowed: boolean;
  translate: number | null;
}>();

const hovering = ref(false);
const startX = ref<number | undefined>(undefined);
const translateX = ref(0);
const pageTitle = markwhenStore.pageTimelineMetadata.title;

const computedStyle = computed(() => {
  if (translateX.value !== 0) {
    return { transform: `translateX(${translateX.value}px)`, zIndex: 20 };
  }
  if (props.translate) {
    return { transform: `translateX(${props.translate}}px)` };
  }
  return { transform: `translateX(0px)` };
});

const click = () => {
  markwhenStore.setPageIndex(props.pageIndex)
}
</script>

<template>
  <button
    class="h-6 rounded-full border-2 mr-2 flex items-center justify-center flex-shrink-0 relative"
    :style="computedStyle"
    @mouseover="startHover"
    @mouseleave="endHover"
    @mousedown.stop="startMoving"
    @touchdown.stop="startMoving"
    @click="click"
    :class="{
      'border-blue-300 bg-blue-50 dark:bg-slate-600 dark:border-slate-500':
        pageIndex === markwhenStore.pageIndex,
      'border-white bg-white hover:bg-blue-50 border-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600':
        pageIndex !== markwhenStore.pageIndex,
      'w-6': !pageTitle,
      'shadow-sm': shadowed,
    }"
  >
    <button
      class="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 text-slate-300 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 rounded-full dark:bg-slate-700 bg-slate-100"
      @click.prevent.stop="del"
      v-if="appStore.editable && markwhenStore.timelines.length > 1 && hovering"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <h3
      v-if="pageTitle"
      class="px-2 font-bold text-gray-500 dark:text-gray-300"
    >
      {{ pageTitle }}
    </h3>
  </button>
</template>

<style scoped></style>
