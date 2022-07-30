<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Sort";
import EventRow from "@/Timeline/Events/Event/EventRow.vue";
import { EventDescription } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { useTimelineStore } from "@/Timeline/timelineStore";
const markwhenStore = useMarkwhenStore();
const { distanceFromBaselineLeftmostDate, distanceBetweenDates } =
  useTimelineStore();

const props = defineProps<{
  eventGroup: EventSubGroup;
  hovering: Boolean;
  canCalculateButton: boolean;
}>();

const titleHtml = computed(() =>
  EventDescription.toInnerHtml(props.eventGroup.title || "")
);
const rgb = computed(() => {
  const tags = props.eventGroup.tags;
  if (tags && tags.length) {
    const tag = tags[0];
    return markwhenStore.tags[tag] || "";
  }
  return "";
});

const hasDefinedColor = computed(() => !!rgb.value);
const bgColorStyle = computed(() => {
  return rgb.value
    ? {
        backgroundColor: `rgba(${rgb}, ${props.hovering ? "0.09" : "0.05"})`,
        outline: `1px solid rgba(${rgb}, 0.12)`,
      }
    : {};
});

const left = computed(() => {
  if (!props.eventGroup || !props.eventGroup.range) {
    return 10;
  }
  return distanceFromBaselineLeftmostDate(props.eventGroup.range.min);
});
const fullWidth = computed(() => {
  if (!props.eventGroup || !props.eventGroup.range) {
    return 100;
  }
  return distanceBetweenDates(
    props.eventGroup.range.min,
    props.eventGroup.range.latest
  );
});
</script>

<template>
  <div class="relative flex flex-col">
    <div
      class="absolute h-full flex flex-row items-center dark:text-gray-400 transition rounded-lg"
      :class="{
        'dark:bg-opacity-30 bg-opacity-20': props.hovering,
        'dark:bg-opacity-20 bg-opacity-10': !props.hovering,
        'bg-gray-400 dark:bg-gray-800': !hasDefinedColor,
      }"
      :style="{
        marginLeft: `${left - 8}px`,
        width: `max(64px, ${fullWidth + 16}px)`,
        ...(rgb
          ? {
              backgroundColor: `rgba(${rgb}, ${
                props.hovering ? '0.09' : '0.05'
              })`,
              outline: `1px solid rgba(${rgb}, 0.12)`,
            }
          : {}),
      }"
    ></div>
    <div
      :style="{ marginLeft: `${left}px`, width: `${fullWidth}px` }"
      class="sticky top-8 cursor-pointer"
      @click="$emit('collapse')"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    ></div>
    <event-row
      v-for="event in eventGroup"
      :key="event.eventString.substring(0, 30)"
      :event="event"
    ></event-row>
    <div
      :style="{
        marginLeft: `${left}px`,
        width: `${fullWidth}px`,
        order: -9999,
      }"
      class="sticky top-12 cursor-pointer z-[1]"
      @click="$emit('collapse')"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    >
      <button
        ref="button"
        class="flex flex-row items-center sticky px-1 mt-px dark:bg-opacity-60 bg-opacity-20"
        :class="buttonClass"
        :style="buttonStyle"
        @mouseover="$emit('hovering', true)"
        @mouseleave="$emit('hovering', false)"
        @click="$emit('collapse')"
      >
        <div class="flex flex-row flex-grow items-center justify-center">
          <span class="eventTitle" v-if="eventGroup.title" v-html="titleHtml">
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
</template>

<style scoped></style>
