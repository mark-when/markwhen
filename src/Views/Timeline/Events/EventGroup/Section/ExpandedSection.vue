<script setup lang="ts">
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { computed, onMounted } from "vue";
import { useEventColor } from "../../composables/useEventColor";
import EventRow from "../../Event/EventRow.vue";
import ExpandedSectionBackground from "./ExpandedSectionBackground.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import type { Node } from "@markwhen/parser/lib/Node";

const { distanceBetweenDates } = useTimelineStore();

const props = defineProps<{
  node: Node;
  hovering: boolean;
  left: number;
  path: EventPath;
  expanded: boolean;
}>();
const { color } = useEventColor(props.node);

const fullWidth = computed(() => {
  if (!props.node || !props.node.range) {
    return 100;
  }
  return distanceBetweenDates(
    props.node.range.fromDateTime,
    props.node.range.maxFrom
  );
});
const titleHtml = computed(() => toInnerHtml(props.node.title || ""));
</script>

<template>
  <div class="relative flex flex-col">
    <ExpandedSectionBackground
      :hovering="props.hovering"
      :color="color"
    />
    <div
      :style="{
        marginLeft: `${left}px`,
        width: `${fullWidth}px`,
      }"
      class="sticky top-8 cursor-pointer"
      @click="$emit('collapse')"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    ></div>
    <div class="" v-show="expanded">
      <slot></slot>
    </div>
    <div
      class="sticky cursor-pointer flex items-center"
      :style="{
        order: -9999,
        top: `${3 + path.path.slice(1).length * 1.2}rem`,
      }"
      @click="$emit('collapse')"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    >
      <div class="sticky flex items-center" :style="{ left: `1rem` }">
        <svg
          v-for="i in path.path.slice(1)"
          xmlns="http://www.w3.org/2000/svg"
          class="w-2 h-2 mr-1"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
        </svg>
        <button
          class="flex flex-row items-center px-1 mt-px dark:bg-opacity-60 bg-opacity-20"
          :class="{
            'bg-gray-500 dark:bg-gray-900': !color,
          }"
          :style="{
            backgroundColor: `rgba(${color}, 0.25)`,
          }"
        >
          <div class="flex flex-row flex-grow items-center justify-center">
            <span class="eventTitle" v-if="titleHtml" v-html="titleHtml">
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-auto"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
  font-weight: 600;
}
</style>
