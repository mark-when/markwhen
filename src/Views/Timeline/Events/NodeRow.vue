<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { computed, watch } from "vue";
import EventRow from "./Event/EventRow.vue";
import Section from "./Section/Section.vue";
import { equivalentPaths } from "@/EventDetail/eventDetailStore";
import { useEventRefs } from "./useEventRefs";
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import type { DateFormat, DateRange } from "@markwhen/parser/lib/Types";
import { useMarkersStore } from "../Markers/markersStore";
import { usePageStore } from "@/Markwhen/pageStore";

const props = defineProps<{
  node: SomeNode;
  path: string;
}>();

const editorOrchestrator = useEditorOrchestratorStore();
const markersStore = useMarkersStore();
const pageStore = usePageStore();
const { editEventDateRange } = editorOrchestrator;
// We have to do this otherwise props will be 'changed', causing an unnecessary patch
const pathArray = computed(() => props.path.split(",").map((i) => parseInt(i)));
const isEventRow = computed(() => props.node.isEventNode());
const type = "pageFiltered" as "pageFiltered";

const hoveringPath = computed(() => editorOrchestrator.hoveringEventPaths);

const eventValue = computed(() => props.node.eventValue());

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
} = useEventRefs(eventValue, () => isEventRow.value);

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
    eventValue.value,
    range,
    scale.value,
    preferredInterpolationFormat.value
  );

const hover = (hovering: boolean) => {
  if (hovering) {
    editorOrchestrator.setHoveringEvent(eventValue.value.dateRangeInText.from);
  } else {
    editorOrchestrator.clearHoveringEvent();
  }
};
</script>

<template>
  <EventRow
    v-if="isEventRow"
    :event-locations="eventLocations"
    :supplemental="supplemental"
    :matched-list-items="matchedListItems"
    :rangeFrom="eventRange!.fromDateTimeIso"
    :rangeTo="eventRange!.toDateTimeIso"
    :tags="tags"
    :color="color"
    :path="eventPath"
    :percent="percent"
    :dateText="dateText"
    :titleHtml="titleHtml"
    @edit-date-range="editDateRange"
    @hover="hover"
    :hovering="equivalentPaths(hoveringPath?.pageFiltered, eventPath)"
  ></EventRow>
  <Section :node="node" :path="path" v-else> </Section>
</template>

<style scoped></style>
