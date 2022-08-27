<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { useElementHover } from "@vueuse/core";
import type { DateFormat, DateRange, Event } from "@markwhen/parser/lib/Types";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import EventBar from "@/Views/Timeline/Events/Event/EventBar.vue";
import TaskCompletion from "./TaskCompletion.vue";
import { useResize } from "@/Views/Timeline/Events/Event/Edit/composables/useResize";
import {
  equivalentEvents,
  useEditorOrchestratorStore,
} from "@/EditorOrchestrator/editorOrchestratorStore";
import { isEditable } from "@/injectionKeys";
import EventMeta from "./EventMeta.vue";
import { useEventDetailStore } from "@/Sidebar/EventDetail/eventDetailStore";
import { usePageStore } from "@/Markwhen/pageStore";
import { useMarkersStore } from "../../Markers/markersStore";

const props = defineProps<{ event: Event }>();

const { distanceFromBaselineLeftmostDate, distanceBetweenDates } =
  useTimelineStore();
const editorOrchestratorStore = useEditorOrchestratorStore();
const eventDetailStore = useEventDetailStore();
const pageStore = usePageStore();
const markersStore = useMarkersStore();
const { editEventDateRange, setHoveringEvent } = editorOrchestratorStore;

const eventRow = ref();
const eventHeightPx = 10;
const showingMeta = ref(false);
const hasLocations = computed(() => props.event.event.locations.length > 0);
const hasImages = computed(() => !!props.event.event.googlePhotosLink);
const hasSupplemental = computed(() => !!props.event.event.supplemental.length);
const hasMeta = computed(
  () => hasLocations.value || hasImages.value || hasSupplemental.value
);

const toggleMeta = (e: MouseEvent) => {
  if (e.target instanceof HTMLAnchorElement) {
    return;
  }
  e.preventDefault();
  showingMeta.value = !showingMeta.value;
};
const taskNumerator = computed(
  () =>
    props.event.event.supplemental.filter(
      (block) => block.type === "checkbox" && block.value
    ).length
);
const taskDenominator = computed(
  () =>
    props.event.event.supplemental.filter((block) => block.type === "checkbox")
      .length
);
const imageStatus = ref<"not loaded" | "loaded" | "loading">("not loaded");
const images = ref([] as string[]);

const canShowMeta = computed(() => {
  if (images.value.length > 0) {
    return showingMeta.value && imageStatus.value === "loaded";
  }
  if (hasLocations.value || hasSupplemental.value) {
    return showingMeta.value;
  }
  return false;
});

const preferredInterpolationFormat = computed(
  () =>
    pageStore.pageTimelineMetadata.preferredInterpolationFormat as
      | DateFormat
      | undefined
);

const scale = computed(() => markersStore.scaleOfViewportDateInterval);

const moveEnded = () =>
  editEventDateRange(
    props.event,
    range.value,
    scale.value,
    preferredInterpolationFormat.value
  );

const { mouseDownTouchStartListener, tempDate, isFrom } = useResize(
  props.event,
  moveEnded
);
const elementHover = useElementHover(eventRow);
const isHovering = computed(() => elementHover.value || !!tempDate.value);
const editable = inject(isEditable);

const isHoveredInEditor = computed(
  () =>
    editable &&
    editorOrchestratorStore.hoveringEvent?.ranges.event.from ===
      props.event.ranges.event.from &&
    editorOrchestratorStore.hoveringEvent.ranges.event.to ===
      props.event.ranges.event.to
);

const isDetailEvent = computed(() =>
  eventDetailStore.isDetailEvent(props.event)
);

watch(elementHover, (hovering) => {
  setHoveringEvent(hovering ? props.event : null);
});

const range = computed(() => {
  if (!tempDate.value) {
    return props.event.ranges.date as DateRange;
  }
  if (isFrom.value) {
    if (+tempDate.value < +props.event.ranges.date.toDateTime) {
      return {
        fromDateTime: tempDate.value,
        toDateTime: props.event.ranges.date.toDateTime,
      };
    } else {
      return {
        fromDateTime: props.event.ranges.date.toDateTime,
        toDateTime: tempDate.value,
      };
    }
  } else {
    if (+tempDate.value > +props.event.ranges.date.fromDateTime) {
      return {
        fromDateTime: props.event.ranges.date.fromDateTime,
        toDateTime: tempDate.value,
      };
    } else {
      return {
        fromDateTime: tempDate.value,
        toDateTime: props.event.ranges.date.fromDateTime,
      };
    }
  }
});

const marginLeft = computed(() =>
  distanceFromBaselineLeftmostDate(range.value.fromDateTime)
);
const barWidth = computed(() => {
  const distance = distanceBetweenDates(
    range.value.fromDateTime,
    range.value.toDateTime
  );
  return Math.max(eventHeightPx, distance);
});
const locations = computed(() =>
  props.event.event.locations.map(
    (l) =>
      `https://www.google.com/maps/embed/v1/place?key=AIzaSyCWzyvdh_bxpqGgmNTjTZ833Dta4_XzKeU&q=${l}`
  )
);

const close = () => {
  showingMeta.value = false;
};

const eventDetail = () => {
  eventDetailStore.setDetailEvent(
    equivalentEvents(eventDetailStore.detailEvent, props.event)
      ? null
      : props.event
  );
};
</script>

<template>
  <div
    class="eventRow relative"
    :style="{
      marginLeft: `${marginLeft}px`,
    }"
    ref="eventRow"
  >
    <!-- <template v-if="$store.state.editable">
      <move-widgets v-show="hovering" @move="move" @moveUp="moveUp" @moveDown="moveDown" @mouseenter="hover = true"
        @mouseleave="hover = false" @edit="edit" />
    </template> -->
    <div class="flex flex-row eventContent items-center">
      <div class="eventItem pointer-events-none">
        <div
          class="flex flex-row rounded -mx-2 px-2 py-1 eventBarAndTitle pointer-events-auto cursor-pointer"
          :class="{
            'dark:bg-gray-800 bg-white shadow-lg': isHovering && hasMeta,
            'dark:bg-gray-900 bg-white shadow-lg':
              eventDetailStore.isDetailEvent(props.event),
            'ring-1 dark:ring-red-600 ring-red-500':
              isHoveredInEditor && !isDetailEvent,
            'ring-1 dark:ring-purple-600 ring-purple-500': isDetailEvent,
          }"
          @click="eventDetail"
        ></div>
        <event-bar
          :event="event"
          :hovering="isHovering"
          :width="barWidth"
          :taskNumerator="taskNumerator"
          :taskDenominator="taskDenominator"
          :drag-handle-listener="mouseDownTouchStartListener"
        />
        <p class="eventDate p-1">
          {{ event.getDateHtml() }}
        </p>
        <div class="eventTitle p-1 flex flex-row">
          <div
            class="supplementalIndicators flex flex-row dark:text-gray-300 text-gray-500 gap-1 items-center justify-center"
          >
            <button
              @click="toggleMeta"
              class="rounded px-px pointer-events-auto"
              v-if="hasMeta"
              :class="{
                'bg-white dark:bg-gray-900': showingMeta,
                shadow: isHovering || showingMeta,
                'dark:text-gray-300 dark:bg-gray-800 text-gray-500 bg-gray-300':
                  !showingMeta,
              }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M 17 14 l -5 -6 l -5 6 h 10"
                  :transform="`rotate(${showingMeta ? 0 : 180} 12 12)`"
                ></path>
              </svg>
            </button>
            <svg
              v-if="hasImages && imageStatus !== 'loading'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="hasImages && imageStatus === 'loading'"
              class="animate-spin h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-if="hasLocations"
              class="h-4 w-4"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              ></path>
            </svg>
            <task-completion
              v-if="taskDenominator"
              :taskNumerator="taskNumerator"
              :taskDenominator="taskDenominator"
            />
          </div>
          <p class="ml-2">
            <span
              v-html="event.getInnerHtml()"
              :class="{
                'pointer-events-auto': event
                  .getInnerHtml()
                  .includes('underline'),
              }"
            ></span>
            <span v-if="hasSupplemental">...</span>
          </p>
        </div>
        <event-meta
          class="pointer-events-auto"
          v-if="canShowMeta"
          :locations="locations"
          :images="images"
          :supplemental="event.event.supplemental"
          :matchedListItems="event.event.matchedListItems"
          :photosLink="event.event.googlePhotosLink"
          :left="barWidth"
          @close="close"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.photoBar {
  width: 10px;
}

.eventRow {
  padding-top: 2px;
  padding-bottom: 2px;
}

.eventDate {
  color: #93979a;
  font-family: system-ui;
  font-size: 80%;
  margin: 0px 0px 0px 8px;
  white-space: nowrap;
}

.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
  font-weight: 600;

  grid-row: 1;
  grid-column: 3;
}
.eventBarAndTitle {
  grid-row: 1;
  grid-column: 1 / 4;
}
.eventDate {
  grid-row: 1;
  grid-column: 2;
}
.eventMeta {
  grid-row: 2;
  grid-column: 3 / -1;
}

.eventItem {
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-template-rows: repeat(2, auto);
}
</style>
