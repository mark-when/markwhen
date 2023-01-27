<script setup lang="ts">
import { computed, inject, nextTick, ref, watch, watchEffect } from "vue";
import {
  toDateRange,
  type Block,
  type DateRange,
  type DateTimeIso,
  type MarkdownBlock,
  type Range,
} from "@markwhen/parser/lib/Types";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { useNodeStore } from "@/Views/Timeline/useNodeStore";
import EventBar from "@/Views/Timeline/Events/Event/EventBar.vue";
import { useResize } from "@/Views/Timeline/Events/Event/Edit/composables/useResize";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import MoveWidgets from "./Edit/MoveWidgets.vue";
import { eqPath } from "@/Markwhen/composables/useEventFinder";
import EventTitle from "./EventTitle.vue";
import type { EventPath } from "@/Views/ViewOrchestrator/useStateSerializer";
import { isEditable } from "@/injectionKeys";
import Fade from "@/Transitions/Fade.vue";
import type { Recurrence } from "@markwhen/parser/lib/dateRange/checkRecurrence";
import { expand } from "@markwhen/parser/lib/utilities/recurrence";
import { recurrenceLimit } from "@/Markwhen/pageStore";
import { useCollapseStore } from "../../collapseStore";

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
  completed?: boolean;
  recurrence?: Recurrence;
}>();

const emit = defineEmits<{
  (event: "editDateRange", range: DateRange): void;
  (event: "hover", hovering: boolean): void;
}>();

const editorOrchestratorStore = useEditorOrchestratorStore();
const eventDetailStore = useEventDetailStore();
const timelineStore = useTimelineStore();
const collapseStore = useCollapseStore();
const nodeStore = useNodeStore();

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

const expandedRecurrence = computed(() =>
  (props.recurrence
    ? expand(range.value, props.recurrence, recurrenceLimit)
    : [range.value]
  ).map((dr) =>
    timelineStore.distanceBetweenDates(
      range.value.fromDateTime,
      dr.fromDateTime
    )
  )
);

const left = computed(() => {
  return (
    timelineStore.pageScaleBy24 * realLeft.value + timelineStore.leftInsetWidth
  );
});

const realLeft = ref();
watchEffect(() => {
  realLeft.value = timelineStore.scalelessDistanceFromBaselineLeftmostDate(
    range.value.fromDateTime
  );
});

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

const clickStart = ref<{ x: number; y: number }>();
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

const collapsedParent = computed(() =>
  collapseStore.isCollapsedChildOf(props.path.path)
);

const isCollapsed = computed(() => !!collapsedParent.value);

const top = computed(() => {
  const numAbove = nodeStore.predecessorMap.get(
    collapsedParent.value
      ? collapsedParent.value.join(",")
      : props.path.path.join(",")
  )!;

  return 100 + numAbove * 30;
});
const isGantt = computed(() => timelineStore.mode === "gantt");

const styleObj = computed(() => {
  let obj = {
    top: `${top.value}px`,
    height: `30px`,
    transition: `top 200ms cubic-bezier(0.4, 0, 0.2, 1)`,
  } as any;
  obj.left = isGantt.value ? "0px" : `${left.value}px`;
  if (isGantt.value) {
    obj.right = "0px";
  }
  return obj;
});

const classObj = computed(() => {
  return isGantt.value
    ? {
        border: true,
        "dark:bg-gray-900 bg-white": props.isDetailEvent,
        "dark:border-gray-400 border-black":
          props.hovering && !props.isDetailEvent,
        "dark:border-indigo-600 border-indigo-500": props.isDetailEvent,
        "border-transparent": !props.hovering && !props.isDetailEvent,
      }
    : {
        "pointer-events-none": isCollapsed.value,
      };
});

const barAndTitleClass = computed(() => {
  return isGantt.value
    ? {}
    : {
        "dark:bg-gray-800 bg-white shadow-lg":
          isHovering.value && hasMeta.value,
        "dark:bg-gray-900 bg-white shadow-lg": props.isDetailEvent,
        "ring-1 dark:ring-gray-400 ring-black":
          props.hovering && !props.isDetailEvent,
        "ring-1 dark:ring-indigo-600 ring-indigo-500": props.isDetailEvent,
        "pointer-events-auto cursor-pointer": !isCollapsed.value,
      };
});

const mousedown = (e: MouseEvent | TouchEvent) => {
  const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  clickStart.value = { x, y };
};

const mouseup = (e: MouseEvent | TouchEvent) => {
  const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  if (clickStart.value?.x === x && clickStart.value.y === y) {
    eventDetail();
  }
};

const ganttTitleStyle = computed(() => {
  const styleObj = {} as any;
  if (props.color) {
    styleObj.backgroundColor = `rgba(${props.color}, 0.5)`;
  }
  styleObj.width = `calc(${
    timelineStore.ganttSidebarTempWidth
      ? timelineStore.ganttSidebarTempWidth
      : timelineStore.ganttSidebarWidth
  }px - 0.5rem)`;
  return styleObj;
});

const editable = inject(isEditable);
const showInEditor = () => {
  editorOrchestratorStore.showInEditor(props.path);
};
</script>

<template>
  <div
    class="eventRow absolute"
    :class="classObj"
    :style="styleObj"
    @mouseenter.passive="!isCollapsed && (elementHover = true)"
    @mouseleave.passive="elementHover = false"
  >
    <template v-if="editable && !isCollapsed">
      <move-widgets
        v-show="isHovering"
        :move="moveHandleListener"
        :left="left"
        @edit="showInEditor"
        @mouseenter.passive="hoveringWidgets = true"
        @mouseleave.passive="hoveringWidgets = false"
      />
    </template>
    <div
      class="flex flex-row eventContent items-center h-full"
      :style="isGantt ? `margin-left: ${left}px` : ''"
    >
      <div class="eventItem pointer-events-none">
        <div
          class="flex flex-row rounded -mx-2 px-2 eventBarAndTitle"
          :class="barAndTitleClass"
          v-on="isCollapsed ? {} : { mousedown, mouseup }"
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
          :editable="!!editable && !isCollapsed"
          :expandedRecurrence="expandedRecurrence"
        />
        <Fade>
          <p
            class="eventDate py-1"
            v-show="!isCollapsed"
            :class="
              recurrence
                ? 'dark:text-orange-300 text-orange-500'
                : 'text-gray-400'
            "
          >
            {{ dateText }}
          </p>
        </Fade>
        <Fade>
          <event-title
            v-if="timelineStore.mode === 'timeline'"
            v-show="!isCollapsed"
            :showing-meta="showingMeta"
            :is-hovering="isHovering"
            :has-meta="hasMeta"
            :has-supplemental="!!supplemental.length"
            :has-locations="hasLocations"
            :task-denominator="taskDenominator"
            :task-numerator="taskNumerator"
            :completed="completed"
            :title-html="titleHtml"
            @toggle-meta="toggleMeta"
          ></event-title>
        </Fade>
      </div>
    </div>
  </div>
  <div
    class="absolute left-0 right-0 h-[30px]"
    :style="{ top: `${top}px` }"
    v-if="timelineStore.mode === 'gantt' && !isCollapsed"
    @mouseenter.passive="elementHover = true"
    @mouseleave.passive="elementHover = false"
  >
    <div class="flex h-full">
      <div class="sticky left-0 bg-slate-50 dark:bg-slate-700 z-10 h-full">
        <div
          class="h-full border"
          :class="{
            'dark:border-gray-400 border-black': hovering,
            'border-transparent': !hovering && !isDetailEvent,
            'dark:border-indigo-600 border-indigo-600': isDetailEvent,
          }"
          style="
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            cursor: pointer;
          "
          :style="ganttTitleStyle"
          @mousedown.passive="mousedown"
          @mouseup.passive="mouseup"
        >
          <event-title
            class="px-2 h-full"
            :showing-meta="showingMeta"
            :is-hovering="isHovering"
            :has-meta="hasMeta"
            :has-supplemental="!!supplemental.length"
            :has-locations="hasLocations"
            :task-denominator="taskDenominator"
            :task-numerator="taskNumerator"
            :completed="completed"
            :title-html="titleHtml"
            @toggle-meta="toggleMeta"
          ></event-title>
        </div>
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
  font-family: system-ui;
  margin: 0px 0px 0px 8px;
  white-space: nowrap;
}

.eventTitle {
  font-family: system-ui;
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
