<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { Node, SomeNode } from "@markwhen/parser/lib/Node";
import { computed, watch } from "vue";
import EventRow from "./Event/EventRow.vue";
import Section from "./Section/Section.vue";
import {
  equivalentPaths,
  useEventDetailStore,
} from "@/EventDetail/eventDetailStore";
import { useEventRefs } from "./useEventRefs";
import type { DateFormat, DateRange, Event } from "@markwhen/parser/lib/Types";
import { useMarkersStore } from "../Markers/markersStore";
import { usePageStore } from "@/Markwhen/pageStore";
import { eventValue, isEventNode } from "@markwhen/parser/lib/Noder";

const props = defineProps<{
  node: SomeNode;
  path: string;
}>();

const editorOrchestrator = useEditorOrchestratorStore();
const markersStore = useMarkersStore();
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
} = useEventRefs(event, () => isEventRow.value);

const eventPath = computed(() => ({ type, path: pathArray.value }));
const scale = computed(() => markersStore.scaleOfViewportDateInterval);

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
    v-if="isEventRow"
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
    @edit-date-range="editDateRange"
    @hover="hover"
    :is-detail-event="isDetailEvent"
    :hovering="equivalentPaths(hoveringPath?.pageFiltered, eventPath)"
  ></EventRow>
  <Section :node="node" :path="path" v-else> </Section>
</template>

<style scoped></style>
