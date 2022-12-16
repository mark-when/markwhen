<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from "vue";
import {
  toDateRange,
  type Block,
  type DateRange,
  type DateTimeIso,
  type MarkdownBlock,
  type Range,
} from "@markwhen/parser/lib/Types";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import EventBar from "@/Views/Timeline/Events/Event/EventBar.vue";
import { useResize } from "@/Views/Timeline/Events/Event/Edit/composables/useResize";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import MoveWidgets from "./Edit/MoveWidgets.vue";
import { eqPath } from "@/Markwhen/composables/useEventFinder";
import EventTitle from "./EventTitle.vue";
import type { EventPath } from "@/Views/ViewOrchestrator/useStateSerializer";

const props = defineProps<{
  path: EventPath;
  eventLocations: string[];
  tags: string[];
  dateText: string;
  supplemental: MarkdownBlock[];
  matchedListItems: Range[];
  hovering: boolean;
  percent?: number;
  rangeFrom: DateTimeIso;
  rangeTo: DateTimeIso;
  titleHtml: string;
  color?: string;
  isDetailEvent: boolean;
  numAbove: number;
}>();

const emit = defineEmits<{
  (event: "editDateRange", range: DateRange): void;
  (event: "hover", hovering: boolean): void;
}>();

const editorOrchestratorStore = useEditorOrchestratorStore();
const eventDetailStore = useEventDetailStore();
const timelineStore = useTimelineStore();

const eventBar = ref();
const showingMeta = ref(false);
const hasLocations = computed(() => props.eventLocations.length > 0);
const hasMeta = computed(
  () => !!hasLocations.value || !!props.supplemental.length
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
    props.supplemental.filter(
      (block) => block.type === "checkbox" && (block as Block).value
    ).length
);
const taskDenominator = computed(
  () => props.supplemental.filter((block) => block.type === "checkbox").length
);
const canShowMeta = computed(() => {
  if (hasLocations.value || props.supplemental.length) {
    return showingMeta.value;
  }
  return false;
});

const {
  dragHandleListenerLeft,
  dragHandleListenerRight,
  moveHandleListener,
  tempFrom,
  tempTo,
} = useResize(
  computed(() => props.rangeFrom),
  computed(() => props.rangeTo),
  () => emit("editDateRange", range.value)
);

const hoveringWidgets = ref(false);
const elementHover = ref(false);

watch(elementHover, (hovering) => emit("hover", hovering));

const isHovering = computed(
  () =>
    elementHover.value ||
    !!tempFrom.value ||
    !!tempTo.value ||
    hoveringWidgets.value ||
    props.hovering
);

const range = computed(() => {
  const eventRange = toDateRange({
    fromDateTimeIso: props.rangeFrom,
    toDateTimeIso: props.rangeTo,
  });
  if (!tempFrom.value && !tempTo.value) {
    return eventRange;
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

const left = computed(() => {
  return timelineStore.pageScaleBy24 * realLeft.value;
});

const realLeft = ref();
watchEffect(() => {
  realLeft.value = timelineStore.scalelessDistanceFromBaselineLeftmostDate(
    range.value.fromDateTime
  );
});

// const left = computed(
//   () =>
//     timelineStore.pageScaleBy24 *
//     timelineStore.scalelessDistanceFromBaselineLeftmostDate(
//       range.value.fromDateTime
//     )
// );
const barWidth = computed(() => {
  const distance = timelineStore.scalelessDistanceBetweenDates(
    range.value.fromDateTime,
    range.value.toDateTime
  );
  return distance;
});

const barScaledWidth = computed(() =>
  Math.max(10, timelineStore.pageScaleBy24 * barWidth.value)
);

const close = () => {
  showingMeta.value = false;
};

const eventDetail = () => {
  eventDetailStore.setDetailEventPath(props.path);
};

const isScrollToPath = ref(false);

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
        isScrollToPath.value = true;
        nextTick(() =>
          (eventBar.value.$el as HTMLDivElement).scrollIntoView({
            block: "center",
            inline: "center",
            behavior: "smooth",
          })
        );
      } else {
        isScrollToPath.value = false;
      }
    } else {
      isScrollToPath.value = false;
    }
  }
);

const percent = computed(() => {
  const p = props.percent as number;
  if (!isNaN(p)) {
    return p;
  }
  if (!isNaN(taskNumerator.value) && taskDenominator.value > 0) {
    return (taskNumerator.value / taskDenominator.value) * 100;
  }
  return 100;
});

const top = computed(() => 100 + props.numAbove * 30);

const display = computed(() => {
  const vp = timelineStore.pageSettings.viewport;
  if (timelineStore.isCollapsedChild(props.path.path)) {
    return 'none'
  }
  if (isScrollToPath.value) {
    return "block";
  }
  if (top.value < vp.top - 200 || top.value > vp.top + vp.height + 200) {
    return "none";
  }
  if (
    left.value > vp.left + vp.width + 50 ||
    vp.left > left.value + barScaledWidth.value + 550
  ) {
    return "none";
  }
  return "block";
});
</script>

<template>
  <div
    class="eventRow absolute"
    :style="{
      left: `${left}px`,
      top: `${top}px`,
      display,
    }"
    @mouseenter.passive="elementHover = true"
    @mouseleave.passive="elementHover = false"
  >
    <template v-if="editorOrchestratorStore.editable">
      <move-widgets
        v-show="isHovering"
        :move="moveHandleListener"
        @mouseenter.passive="hoveringWidgets = true"
        @mouseleave.passive="hoveringWidgets = false"
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
          :tagColor="color"
          :percent="percent"
          :hovering="isHovering || hovering"
          :width="barScaledWidth"
          :taskNumerator="taskNumerator"
          :taskDenominator="taskDenominator"
          :drag-handle-listener-left="dragHandleListenerLeft"
          :drag-handle-listener-right="dragHandleListenerRight"
        />
        <p class="eventDate py-1">
          {{ dateText }}
        </p>
        <event-title
          :showing-meta="showingMeta"
          :is-hovering="isHovering"
          :has-meta="hasMeta"
          :has-supplemental="!!supplemental.length"
          :has-locations="hasLocations"
          :task-denominator="taskDenominator"
          :task-numerator="taskNumerator"
          :title-html="titleHtml"
          @toggle-meta="toggleMeta"
        ></event-title>
        <!-- <event-meta
          class="pointer-events-auto"
          v-if="canShowMeta"
          :locations="eventLocations"
          :supplemental="supplemental"
          :matchedListItems="matchedListItems"
          :left="barWidth"
          @close="close"
        /> -->
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
