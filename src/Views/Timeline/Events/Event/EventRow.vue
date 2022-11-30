<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from "vue";
import { useElementHover } from "@vueuse/core";
import type {
  Block,
  DateFormat,
  DateRange,
  Event,
} from "@markwhen/parser/lib/Types";
import type { Node } from "@markwhen/parser/lib/Node";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import EventBar from "@/Views/Timeline/Events/Event/EventBar.vue";
import TaskCompletion from "./TaskCompletion.vue";
import { useResize } from "@/Views/Timeline/Events/Event/Edit/composables/useResize";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { isEditable } from "@/injectionKeys";
import EventMeta from "./EventMeta.vue";
import {
  equivalentPaths,
  useEventDetailStore,
} from "@/EventDetail/eventDetailStore";
import { usePageStore } from "@/Markwhen/pageStore";
import { useMarkersStore } from "../../Markers/markersStore";
import MoveWidgets from "./Edit/MoveWidgets.vue";
import { eqPath, type EventPath } from "@/Markwhen/composables/useEventFinder";
import Spinner from "../../../../utilities/Spinner.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";

const props = defineProps<{ node: Node<Event>; path: EventPath }>();

const { scalelessDistanceFromBaselineLeftmostDate, scalelessDistanceBetweenDates } =
  useTimelineStore();
const editorOrchestratorStore = useEditorOrchestratorStore();
const eventDetailStore = useEventDetailStore();
const pageStore = usePageStore();
const markersStore = useMarkersStore();
const { editEventDateRange, setHoveringEvent, clearHoveringEvent } =
  editorOrchestratorStore;
const timelineStore = useTimelineStore();

const eventRow = ref();
const eventBar = ref();
const eventHeightPx = 10;
const showingMeta = ref(false);
const hasLocations = computed(
  () => props.node.eventValue().event.locations.length > 0
);
const hasImages = computed(
  () =>
    !!props.node.eventValue().event.supplemental.some((s) => s.type === "image")
);
const hasSupplemental = computed(
  () => !!props.node.eventValue().event.supplemental.length
);
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
    props.node
      .eventValue()
      .event.supplemental.filter(
        (block) => block.type === "checkbox" && (block as Block).value
      ).length
);
const taskDenominator = computed(
  () =>
    props.node
      .eventValue()
      .event.supplemental.filter((block) => block.type === "checkbox").length
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
    props.node.eventValue(),
    range.value,
    scale.value,
    preferredInterpolationFormat.value
  );

const {
  dragHandleListenerLeft,
  dragHandleListenerRight,
  moveHandleListener,
  tempFrom,
  tempTo,
} = useResize(props.node.eventValue(), moveEnded);
const elementHover = useElementHover(eventRow);
const hoveringWidgets = ref(false);
const isHovering = computed(
  () =>
    elementHover.value ||
    !!tempFrom.value ||
    !!tempTo.value ||
    hoveringWidgets.value
);
const editable = inject(isEditable);

const isHoveredInEditor = computed(
  () =>
    editable &&
    equivalentPaths(
      editorOrchestratorStore.hoveringEventPaths?.[props.path.type],
      props.path
    )
);

const isDetailEvent = computed(() =>
  eventDetailStore.isDetailEventPath(props.path)
);

watch(elementHover, (hovering) => {
  if (hovering) {
    setHoveringEvent(props.node.eventValue());
  } else {
    clearHoveringEvent();
  }
});

const range = computed(() => {
  if (!tempFrom.value && !tempTo.value) {
    return props.node.eventValue().ranges.date as DateRange;
  } else if (!tempFrom.value) {
    if (+tempTo.value! > +props.node.eventValue().ranges.date.fromDateTime) {
      return {
        fromDateTime: props.node.eventValue().ranges.date.fromDateTime,
        toDateTime: tempTo.value!,
      };
    } else {
      return {
        fromDateTime: tempTo.value!,
        toDateTime: props.node.eventValue().ranges.date.fromDateTime,
      };
    }
  } else if (!tempTo.value) {
    if (+tempFrom.value < +props.node.eventValue().ranges.date.toDateTime) {
      return {
        fromDateTime: tempFrom.value,
        toDateTime: props.node.eventValue().ranges.date.toDateTime,
      };
    } else {
      return {
        fromDateTime: props.node.eventValue().ranges.date.toDateTime,
        toDateTime: tempFrom.value,
      };
    }
  }
  return {
    fromDateTime:
      +tempFrom.value < +tempTo.value ? tempFrom.value : tempTo.value,
    toDateTime: +tempFrom.value < +tempTo.value ? tempTo.value : tempFrom.value,
  };
});

const marginLeft = computed(() =>
  scalelessDistanceFromBaselineLeftmostDate(range.value.fromDateTime)
);
const barWidth = computed(() => {
  const distance = scalelessDistanceBetweenDates(
    range.value.fromDateTime,
    range.value.toDateTime
  );
  return Math.max(eventHeightPx, distance);
});
const locations = computed(() =>
  props.node
    .eventValue()
    .event.locations.map(
      (l) =>
        `https://www.google.com/maps/embed/v1/place?key=AIzaSyCWzyvdh_bxpqGgmNTjTZ833Dta4_XzKeU&q=${l}`
    )
);

const close = () => {
  showingMeta.value = false;
};

const eventDetail = () => {
  eventDetailStore.setDetailEventPath(props.path);
};

watch(
  () => timelineStore.scrollToPath,
  (path) => {
    if (path) {
      if (
        eqPath(props.path, path) ||
        // We are going to use this event (the first of the group) as a proxy for scrolling to the group
        (props.path.path[1] === 0 &&
          eqPath({ type: props.path.type, path: [props.path.path[0]!] }, path))
      ) {
        nextTick(() =>
          (eventBar.value.$el as HTMLDivElement).scrollIntoView({
            block: "center",
            inline: "center",
            behavior: "smooth",
          })
        );
      }
    }
  }
);
</script>

<template>
  <div
    class="eventRow relative"
    :style="{
      marginLeft: `calc(var(--timeline-scale-by-24) * ${marginLeft}px)`,
    }"
    ref="eventRow"
  >
    <template v-if="editorOrchestratorStore.editable">
      <move-widgets
        v-show="isHovering"
        :move="moveHandleListener"
        @mouseenter="hoveringWidgets = true"
        @mouseleave="hoveringWidgets = false"
      />
    </template>
    <div class="flex flex-row eventContent items-center">
      <div class="eventItem pointer-events-none">
        <div
          class="flex flex-row rounded -mx-2 px-2 py-1 eventBarAndTitle pointer-events-auto cursor-pointer"
          :class="{
            'dark:bg-gray-800 bg-white shadow-lg': isHovering && hasMeta,
            'dark:bg-gray-900 bg-white shadow-lg': isDetailEvent,
            'ring-1 dark:ring-gray-100 ring-black':
              isHoveredInEditor && !isDetailEvent,
            'ring-1 dark:ring-indigo-600 ring-indigo-500': isDetailEvent,
          }"
          @click="eventDetail"
        ></div>
        <event-bar
          ref="eventBar"
          :event="node.eventValue()"
          :hovering="isHovering"
          :width="barWidth"
          :taskNumerator="taskNumerator"
          :taskDenominator="taskDenominator"
          :drag-handle-listener-left="dragHandleListenerLeft"
          :drag-handle-listener-right="dragHandleListenerRight"
        />
        <p class="eventDate py-1">
          {{ node.eventValue().getDateHtml() }}
        </p>
        <div class="eventTitle py-1 flex flex-row">
          <div
            class="supplementalIndicators flex flex-row dark:text-gray-300 text-gray-500 gap-1 items-center justify-center pl-2"
          >
            <button
              @click="toggleMeta"
              class="rounded px-px pointer-events-auto border"
              v-if="hasMeta"
              :class="{
                'bg-white dark:bg-gray-900 border-indigo-500/75': showingMeta,
                shadow: isHovering || showingMeta,
                'dark:text-gray-300 dark:bg-gray-800 text-gray-500 bg-gray-300 border-transparent':
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
            <spinner
              v-else-if="hasImages && imageStatus === 'loading'"
              class="h-3 w-3"
            />
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
              v-html="toInnerHtml(node.eventValue().event.eventDescription)"
              :class="{
                'pointer-events-auto': node
                  .eventValue()
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
          :supplemental="node.eventValue().event.supplemental"
          :matchedListItems="node.eventValue().event.matchedListItems"
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

/* .eventDescription {
  grid-row: 1 / -1;
  grid-column: 3 / -1;
} */

.eventBarAndTitle {
  grid-row: 1;
  /* grid-column: 1 / -1; */
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
