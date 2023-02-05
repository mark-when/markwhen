<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { Node, SomeNode } from "@markwhen/parser/lib/Node";
import { computed, onMounted } from "vue";
import EventRow from "./Event/EventRow.vue";
import { equivalentPaths } from "@/Views/ViewOrchestrator/useStateSerializer";
import { useEventRefs } from "./useEventRefs";
import type { DateFormat, DateRange, Event } from "@markwhen/parser/lib/Types";
import { usePageStore } from "@/Markwhen/pageStore";
import { eventValue, isEventNode } from "@markwhen/parser/lib/Noder";
import { useTimelineStore } from "../timelineStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";

const props = defineProps<{
  node: SomeNode;
  path: string;
  numAbove: number;
  numChildren?: number | undefined;
}>();

const editorOrchestrator = useEditorOrchestratorStore();
const timelineStore = useTimelineStore();
const pageStore = usePageStore();
const eventDetailStore = useEventDetailStore();
const { editEventDateRange } = editorOrchestrator;

// We have to do this otherwise props will be 'changed', causing an unnecessary patch
const pathArray = computed(() => props.path.split(",").map((i) => parseInt(i)));
const isEventRow = computed(() => isEventNode(props.node));
const type = "pageFiltered" as "pageFiltered";

const hoveringPath = computed(() => editorOrchestrator.hoveringEventPaths);

const event = computed(() => eventValue(props.node as Node<Event>));

const {
  eventRange,
  eventLocations,
  supplemental,
  percent,
  matchedListItems,
  tags,
  color,
  dateText,
  titleHtml,
  completed,
  recurrence,
} = useEventRefs(event, () => isEventRow.value);

const eventPath = computed(() => ({ type, path: pathArray.value }));
const scale = computed(() => timelineStore.scaleOfViewportDateInterval);

const preferredInterpolationFormat = computed(
  () =>
    pageStore.pageTimelineMetadata.preferredInterpolationFormat as
      | DateFormat
      | undefined
);
const editDateRange = (range: DateRange) =>
  editEventDateRange(
    event.value,
    range,
    scale.value,
    preferredInterpolationFormat.value
  );

const hover = (hovering: boolean) => {
  if (hovering) {
    editorOrchestrator.setHoveringEvent(event.value.dateRangeInText.from);
  } else {
    editorOrchestrator.clearHoveringEvent();
  }
};

const isDetailEvent = computed(() =>
  eventDetailStore.isDetailEventPath(eventPath.value)
);
</script>

<template>
  <EventRow
    :event-locations="eventLocations || []"
    :supplemental="supplemental || []"
    :matched-list-items="matchedListItems || []"
    :rangeFrom="eventRange!.fromDateTimeIso"
    :rangeTo="eventRange!.toDateTimeIso"
    :tags="tags || []"
    :color="color"
    :path="eventPath"
    :percent="percent"
    :dateText="dateText || ''"
    :titleHtml="titleHtml || ''"
    :completed="completed"
    :recurrence="recurrence"
    @edit-date-range="editDateRange"
    @hover="hover"
    :is-detail-event="isDetailEvent"
    :hovering="equivalentPaths(hoveringPath?.pageFiltered, eventPath)"
    :numAbove="numAbove"
  ></EventRow>
</template>

<style scoped></style>
