<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { computed } from "vue";
import EventRow from "./Event/EventRow.vue";
import Section from "./Section/Section.vue";
import { equivalentPaths } from "@/EventDetail/eventDetailStore";
import { useEventRefs } from "./useEventRefs";

const props = defineProps<{
  node: SomeNode;
  path: string;
}>();

const editorOrchestrator = useEditorOrchestratorStore();

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
    :hovering="equivalentPaths(hoveringPath?.pageFiltered, eventPath)"
  ></EventRow>
  <Section :node="node" :path="path" v-else> </Section>
</template>

<style scoped></style>
