<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { isEventNode, eventValue, toArray } from "@markwhen/parser/lib/Noder";
import type { Path, Block } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import NodeRow from "./NodeRow.vue";

const transformStore = useTransformStore();

// top level is always an array
const nodes = computed(() => transformStore.transformedEvents);

const nodeArray = computed(
  () => toArray(nodes.value) as { path: Path; node: SomeNode }[]
);

const nodeKey = (n: SomeNode) => {
  if (isEventNode(n)) {
    const event = eventValue(n).eventDescription;
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
</script>

<template>
  <NodeRow
    v-for="{ path, node } in nodeArray"
    :key="nodeKey(node)"
    :node="node"
    :path="path.join(',')"
  ></NodeRow>
</template>

<style scoped></style>
