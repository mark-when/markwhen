<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Types";
import EventRow from "@/Views/Timeline/Events/Event/EventRow.vue";
import { computed, ref } from "vue";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { useEventColor } from "../../composables/useEventColor";
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";

const timelineStore = useTimelineStore();
const eventDetailStore = useEventDetailStore();
const { distanceFromBaselineLeftmostDate, distanceBetweenDates } =
  timelineStore;

const props = defineProps<{
  eventGroup: EventSubGroup;
  hovering: Boolean;
  canCalculateButton: boolean;
  path: EventPath;
}>();

const button = ref<HTMLButtonElement | null>(null);

const titleHtml = computed(() =>
  toInnerHtml(props.eventGroup.title || "")
);
const { color } = useEventColor(props.eventGroup);

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

const buttonWidth = computed(() => {
  const title = props.eventGroup.title;
  if (props.canCalculateButton) {
    return button.value?.clientWidth;
  }
  return 0;
});
const isDetail = computed(() => eventDetailStore.isDetailEventPath(props.path));
</script>

<template>
  <div class="relative flex flex-col">
    <div
      class="absolute h-full flex flex-row items-center dark:text-gray-400 transition rounded-[12px]"
      :class="{
        'dark:bg-opacity-30 bg-opacity-20': props.hovering,
        'dark:bg-opacity-20 bg-opacity-10': !props.hovering,
        'bg-gray-400 dark:bg-gray-800 border border-1 dark:border-gray-900/25 border-gray-400/25':
          !isDetail && !color,
        'dark:bg-gray-900 bg-white bg-opacity-50 ring-1 dark:ring-blue-600 ring-blue-500 shadow-lg':
          isDetail,
      }"
      :style="{
        marginLeft: `${left - 8}px`,
        width: `max(64px, ${fullWidth + 16}px)`,
        ...(!isDetail && color
          ? {
              backgroundColor:
                color && `rgba(${color}, ${props.hovering ? '0.09' : '0.05'})`,
              border: `1px solid rgba(${color}, 0.12)`,
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
      :path="{ type: path.type, path: [props.path.path[0]!, i] }"
      v-for="(event, i) in eventGroup"
      :key="event.eventString"
      :event="event"
    ></event-row>
    <div
      :style="{
        marginLeft: `${left}px`,
        width: `${fullWidth}px`,
        order: -9999,
      }"
      class="sticky top-12 cursor-pointer"
      @click="$emit('collapse', $event)"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    >
      <button
        ref="button"
        class="flex flex-row items-center sticky px-2 py-px mt-px dark:bg-opacity-60 bg-opacity-20 rounded-full"
        :class="{
          'bg-gray-400 dark:bg-gray-800': !color,
        }"
        :style="{
          left: `calc(50% - ${buttonWidth! / 2}px)`,
          backgroundColor: color && `rgba(${color}, 0.25)` || '',
        }"
        @mouseover="$emit('hovering', true)"
        @mouseleave="$emit('hovering', false)"
        @click="$emit('collapse', $event)"
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

<style scoped>
.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
  font-weight: 600;
}
</style>
