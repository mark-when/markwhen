<script setup lang="ts">
import HoverHint from "@/Drawer/HoverHint.vue";
import { ref } from "vue";
import { useIsTouchscreen } from "../composables/useIsTouchscreen";
import { useTimelineStore } from "../timelineStore";
const timelineStore = useTimelineStore();

const jumpToRange = () => {
  timelineStore.setShowingJumpToRange(true);
};

const hovering = ref(false);
const { canHover } = useIsTouchscreen();

const events = canHover.value
  ? {
      mouseover: () => {
        hovering.value = true;
      },
      mouseleave: () => {
        hovering.value = false;
      },
    }
  : {};
</script>

<template>
   <button
    @click="jumpToRange"
    class="h-6 flex flex-row items-center rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 px-1 text-sm lg:text-base font-bold relative"
    v-on="events"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      stroke-width="3"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="12" cy="12" r=".5" fill="currentColor"></circle>
      <circle cx="12" cy="12" r="9"></circle>
    </svg>
    <HoverHint
      :hover-position="'top'"
      :hovering="hovering"
      title="Jump"
      shortcut="j"
    />
  </button>
</template>

<style scoped></style>
