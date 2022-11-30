<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { Node, SomeNode } from "@markwhen/parser/lib/Node";
import type { Event } from "@markwhen/parser/lib/Types";
import { computed, onRenderTriggered } from "vue";
import EventRow from "./Event/EventRow.vue";
import Section from "./Section/Section.vue";
import { equivalentPaths } from "@/EventDetail/eventDetailStore";

const props = defineProps<{
  node: SomeNode;
  path: string;
}>();

const editorOrchestrator = useEditorOrchestratorStore();

// We have to do this otherwise props will be 'changed', causing an unnecessary patch
const pathArray = computed(() => props.path.split(",").map((i) => parseInt(i)));
const isEventRow = computed(() => props.node.isEventNode());
const type = "pageFiltered" as "pageFiltered";

const eventPath = computed(() => ({ type, path: pathArray.value }));

const hoveringPath = computed(() => editorOrchestrator.hoveringEventPaths);
</script>

<template>
  <EventRow
    v-if="isEventRow"
    :node="node as Node<Event>"
    :path="eventPath"
    :hovering="equivalentPaths(hoveringPath?.pageFiltered, eventPath)"
  ></EventRow>
  <Section :node="node" :path="path" v-else> </Section>
</template>

<style scoped></style>
