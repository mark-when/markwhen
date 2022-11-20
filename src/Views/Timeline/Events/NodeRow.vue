<script setup lang="ts">
import type { Node } from "@markwhen/parser/lib/Node";
import type { Path } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import EventRow from "./Event/EventRow.vue";
import Section from "./EventGroup/Section/Section.vue";

const props = defineProps<{
  node: Node;
  path: Path;
  canHaveSections: boolean;
}>();

const isEventRow = computed(() => props.node.isEventNode());
const type = "pageFiltered" as "pageFiltered";
</script>

<template>
  <EventRow
    v-if="isEventRow"
    :event="node.eventValue()"
    :path="{ type, path }"
  ></EventRow>
  <Section
    :node="node"
    :path="{ type, path }"
    :can-have-sections="node.style === 'section'"
    v-else
  >
    <NodeRow
      v-for="(node, i) in (props.node.value as Array<Node>)"
      :path="[...path, i]"
      :node="node"
      :can-have-sections="props.node.style === 'section'"
    ></NodeRow>
  </Section>
</template>

<style scoped></style>
