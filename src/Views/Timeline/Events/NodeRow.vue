<script setup lang="ts">
import type { Node, NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import type { Path, Event } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import EventRow from "./Event/EventRow.vue";
import Section from "./Section/Section.vue";

const props = defineProps<{
  node: SomeNode;
  path: Path;
  canHaveSections: boolean;
}>();

const isEventRow = computed(() => props.node.isEventNode());
const type = "pageFiltered" as "pageFiltered";

const nodeKey = (n: SomeNode) => {
  if (n.isEventNode()) {
    const event = n.eventValue().event;
    return (
      event.eventDescription + event.supplemental.map((b) => b.raw).join(" ")
    );
  } else {
    return n.title;
  }
};

</script>

<template>
  <EventRow
    v-if="isEventRow"
    :node="node as Node<Event>"
    :path="{ type, path }"
  ></EventRow>
  <Section
    :node="node"
    :path="{ type, path }"
    :can-have-sections="node.style === 'section'"
    v-else
  >
    <NodeRow
      v-for="(node, i) in (props.node.value as NodeArray)"
      :path="[...path, i]"
      :node="node"
      :key="nodeKey(node)"
      :can-have-sections="props.node.style === 'section'"
    ></NodeRow>
  </Section>
</template>

<style scoped></style>
