<script setup lang="ts">
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { useTimelineStore } from "@/Timeline/timelineStore";
import type { EventSubGroup } from "@markwhen/parser/lib/Sort";
import { EventDescription } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import { useEventColor } from "../../composables/useEventColor";
import EventRow from "../../Event/EventRow.vue";

const markwhenStore = useMarkwhenStore();
const { distanceBetweenDates } = useTimelineStore();

const props = defineProps<{
  group: EventSubGroup;
  hovering: boolean;
  left: number;
}>();
const { color } = useEventColor(props.group);

const hasDefinedColor = computed(() => !!color.value);

const fullWidth = computed(() => {
  if (!props.group || !props.group.range) {
    return 100;
  }
  return distanceBetweenDates(props.group.range.min, props.group.range.latest);
});
const titleHtml = computed(() =>
  EventDescription.toInnerHtml(props.group.title || "")
);
</script>

<template>
  <div class="relative flex flex-col">
    <div
      class="absolute h-full flex flex-row items-center dark:text-gray-400 transition ml-0 w-full"
      :class="{
        'dark:bg-opacity-30 bg-opacity-20': props.hovering,
        'dark:bg-opacity-20 bg-opacity-10': !props.hovering,
        'bg-gray-400 dark:bg-gray-800': !hasDefinedColor,
      }"
      :style="
        hasDefinedColor
          ? {
              backgroundColor: `rgba(${color}, ${hovering ? '0.09' : '0.05'}`,
              outline: `1px solid rgba(${color}, 0.12)`,
            }
          : {}
      "
    ></div>
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
      v-for="event in group"
      :key="event.eventString.substring(0, 30)"
      :event="event"
    />
    <div
      class="sticky top-12 cursor-pointer z-[1]"
      :style="{
        order: -9999,
      }"
      @click="$emit('collapse')"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    >
      <button
        class="flex flex-row items-center sticky px-1 mt-px dark:bg-opacity-60 bg-opacity-20"
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
