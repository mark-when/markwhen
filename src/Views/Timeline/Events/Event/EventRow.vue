<script setup lang="ts">
import {
  computed,
  nextTick,
  onRenderTriggered,
  onUpdated,
  ref,
  watch,
} from "vue";
import { useElementHover } from "@vueuse/core";
import type {
  Block,
  DateFormat,
  DateRange,
  Event,
} from "@markwhen/parser/lib/Types";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import EventBar from "@/Views/Timeline/Events/Event/EventBar.vue";
import { useResize } from "@/Views/Timeline/Events/Event/Edit/composables/useResize";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { isEditable } from "@/injectionKeys";
import EventMeta from "./EventMeta.vue";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import { usePageStore } from "@/Markwhen/pageStore";
import { useMarkersStore } from "../../Markers/markersStore";
import MoveWidgets from "./Edit/MoveWidgets.vue";
import { eqPath, type EventPath } from "@/Markwhen/composables/useEventFinder";
import EventTitle from "./EventTitle.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import { useEventColor } from "../composables/useEventColor";

const props = defineProps<{
  event: Event;
  path: EventPath;
  hovering: boolean;
}>();

const {
  scalelessDistanceFromBaselineLeftmostDate,
  scalelessDistanceBetweenDates,
} = useTimelineStore();
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
const hasLocations = computed(() => props.event.eventDescription.locations.length > 0);
const hasImages = computed(
  () => !!props.event.eventDescription.supplemental.some((s) => s.type === "image")
);
const hasSupplemental = computed(() => !!props.event.eventDescription.supplemental.length);
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
    props.event.eventDescription.supplemental.filter(
      (block) => block.type === "checkbox" && (block as Block).value
    ).length
);
const taskDenominator = computed(
  () =>
    props.event.eventDescription.supplemental.filter((block) => block.type === "checkbox")
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

const {
  dragHandleListenerLeft,
  dragHandleListenerRight,
  moveHandleListener,
  tempFrom,
  tempTo,
} = useResize(props.event, moveEnded);

const isDetailEvent = computed(() =>
  eventDetailStore.isDetailEventPath(props.path)
);

const hoveringWidgets = ref(false);
const elementHover = useElementHover(eventRow);
watch(elementHover, (hovering) => {
  if (hovering) {
    setHoveringEvent(props.event);
  } else {
    clearHoveringEvent();
  }
});

const isHovering = computed(
  () =>
    elementHover.value ||
    !!tempFrom.value ||
    !!tempTo.value ||
    hoveringWidgets.value ||
    props.hovering
);

const range = computed(() => {
  console.log("computing range")
  const eventRange = props.event.dateRange()
  if (!tempFrom.value && !tempTo.value) {
    return eventRange
  } else if (!tempFrom.value) {
    if (+tempTo.value! > +eventRange.fromDateTime) {
      return {
        fromDateTime: eventRange.fromDateTime,
        toDateTime: tempTo.value!,
      };
    } else {
      return {
        fromDateTime: tempTo.value!,
        toDateTime: eventRange.fromDateTime,
      };
    }
  } else if (!tempTo.value) {
    if (+tempFrom.value < +eventRange.toDateTime) {
      return {
        fromDateTime: tempFrom.value,
        toDateTime: eventRange.toDateTime,
      };
    } else {
      return {
        fromDateTime: eventRange.toDateTime,
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
  console.log('computing bar width')
  const distance = scalelessDistanceBetweenDates(
    range.value.fromDateTime,
    range.value.toDateTime
  );
  return Math.max(eventHeightPx, distance);
});
const locations = computed(() =>
  props.event.eventDescription.locations.map(
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
const edit = () =>
  editorOrchestratorStore.showInEditor({ pageFiltered: props.path });

onUpdated(() => {
  console.log("update eventrow");
});

onRenderTriggered((h) => {
  console.log(h)
})

watch(
  () => props.path,
  () => {
    console.log("props path updated");
  }
);

const { color: tagColor } = useEventColor(props.event);

const percent = computed(() => {
  const p = props.event.eventDescription.percent as number;
  if (!isNaN(p)) {
    return p;
  }
  if (!isNaN(taskNumerator.value) && taskDenominator.value > 0) {
    return (taskNumerator.value / taskDenominator.value) * 100;
  }
  return 100;
});
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
            'ring-1 dark:ring-gray-100 ring-black': hovering && !isDetailEvent,
            'ring-1 dark:ring-indigo-600 ring-indigo-500': isDetailEvent,
          }"
          @click="eventDetail"
        ></div>
        <event-bar
          ref="eventBar"
          :tagColor="tagColor"
          :percent="percent"
          :event="event"
          :hovering="isHovering || hovering"
          :width="barWidth"
          :taskNumerator="taskNumerator"
          :taskDenominator="taskDenominator"
          :drag-handle-listener-left="dragHandleListenerLeft"
          :drag-handle-listener-right="dragHandleListenerRight"
        />
        <p class="eventDate py-1">
          {{ event.getDateHtml() }}
        </p>
        <event-title
          :showing-meta="showingMeta"
          :is-hovering="isHovering"
          :has-meta="hasMeta"
          :has-supplemental="hasSupplemental"
          :has-locations="hasLocations"
          :task-denominator="taskDenominator"
          :task-numerator="taskNumerator"
          :title-html="toInnerHtml(event.eventDescription.eventDescription)"
        ></event-title>
        <event-meta
          class="pointer-events-auto"
          v-if="canShowMeta"
          :locations="locations"
          :images="images"
          :supplemental="event.eventDescription.supplemental"
          :matchedListItems="event.eventDescription.matchedListItems"
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
