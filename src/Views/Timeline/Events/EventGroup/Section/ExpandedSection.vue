<script setup lang="ts">
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import type { EventSubGroup } from "@markwhen/parser/lib/Types";
import { computed, onMounted } from "vue";
import { useEventColor } from "../../composables/useEventColor";
import EventRow from "../../Event/EventRow.vue";
import ExpandedSectionBackground from "./ExpandedSectionBackground.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";

const { distanceBetweenDates } = useTimelineStore();

const props = defineProps<{
  group: EventSubGroup;
  hovering: boolean;
  left: number;
  path: EventPath;
}>();
const { color } = useEventColor(props.group);

const fullWidth = computed(() => {
  if (!props.group || !props.group.range) {
    return 100;
  }
  return distanceBetweenDates(props.group.range.min, props.group.range.latest);
});
const titleHtml = computed(() => toInnerHtml(props.group.title || ""));
</script>

<template>
  <div class="relative flex flex-col">
    <ExpandedSectionBackground
      :hovering="props.hovering"
      :color="color || null"
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
    <EventRow
      v-for="(event, i) in group"
      :path="{ type: props.path.type, path: [props.path.path[0]!, i] }"
      :key="
        event.eventString +
        event.event.supplemental.reduce((prev, curr) => prev + curr.raw, '')
      "
      :event="event"
    />
    <div
      class="sticky top-12 cursor-pointer"
      :style="{
        order: -9999,
      }"
      @click="$emit('collapse')"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    >
      <button
        class="flex flex-row items-center sticky px-1 mt-px dark:bg-opacity-60 bg-opacity-20"
        :class="{
          'bg-gray-500 dark:bg-gray-900': !color,
        }"
        :style="{
          backgroundColor: `rgba(${color}, 0.25)`,
          left: `1rem`,
        }"
        @mouseover="$emit('hovering', true)"
        @mouseleave="$emit('hovering', false)"
        @click="$emit('collapse')"
      >
        <div class="flex flex-row flex-grow items-center justify-center">
          <span class="eventTitle" v-if="titleHtml" v-html="titleHtml"> </span>
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
</template>

<style scoped>
.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
  font-weight: 600;
}
</style>
