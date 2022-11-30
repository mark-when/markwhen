<script setup lang="ts">
import type { Node, NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import type { Event, Block } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import EventRow from "./Event/EventRow.vue";
import Section from "./Section/Section.vue";

const props = defineProps<{
  node: SomeNode;
  path: string;
  canHaveSections: boolean;
}>();

// We have to do this otherwise props will be 'changed', causing an unnecessary patch
const pathArray = computed(() => props.path.split(",").map((i) => parseInt(i)));
const isEventRow = computed(() => props.node.isEventNode());
const type = "pageFiltered" as "pageFiltered";

const nodeKey = (n: SomeNode) => {
  if (n.isEventNode()) {
    const event = n.eventValue().eventDescription;
    return (
      event.eventDescription +
      event.supplemental
        .filter((b) => b.type !== "image")
        .map((b) => (b as Block).raw)
        .join(" ")
    );
  } else {
    return n.title;
  }
};

const eventPath = computed(() => ({ type, path: pathArray.value }));
</script>

<template>
  <EventRow
    v-if="isEventRow"
    :node="node as Node<Event>"
    :path="eventPath"
  ></EventRow>
  <Section
    :node="node"
    :path="eventPath"
    :can-have-sections="node.style === 'section'"
    v-else
  >
    <NodeRow
      v-for="(node, i) in (props.node.value as NodeArray)"
      :path="[...pathArray, i].join(',')"
      :node="node"
      :key="nodeKey(node)"
      :can-have-sections="props.node.style === 'section'"
    ></NodeRow>
  </Section>
</template>

<style scoped></style>
