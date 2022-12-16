<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import type { NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import { isEventNode, eventValue, iterate } from "@markwhen/parser/lib/Noder";
import type { Path, Block } from "@markwhen/parser/lib/Types";
import { computed, watchEffect, type Ref } from "vue";
import NodeRow from "./NodeRow.vue";

const transformStore = useTransformStore();

const prevSiblingPath = (path: Path) => {
  if (path[path.length - 1] === 0) {
    return path.slice(0, -1);
  }
  return [...path.slice(0, -1), path[path.length - 1] - 1];
};

const toArray = (node: SomeNode | undefined) => {
  if (!node) {
    return [];
  }
  const array = [] as { path: Path; node: SomeNode; numChildren?: number }[];
  for (const pathAndNode of iterate(node)) {
    array.push(pathAndNode);
  }
  return array;
};

const _numChildren = (
  node: SomeNode,
  path: number[],
  childrenMap: Map<String, number>
): number => {
  if (isEventNode(node)) {
    return 0;
  }

  const saved = childrenMap.get(path.join(","));
  if (saved) {
    return saved;
  }

  const arr = node.value as NodeArray;
  const children = arr.reduce((prev, curr) => {
    return prev + 1 + _numChildren(curr, path, childrenMap);
  }, 0);
  childrenMap.set(path.join(","), children);

  return children;
};

// top level is always an array
const nodes = computed(() => transformStore.transformedEvents);

const nodeArray = computed(
  () => toArray(nodes.value) as { path: Path; node: SomeNode }[]
);

const childrenMap = computed(() => {
  const map = new Map<string, number>();
  for (const { path, node } of nodeArray.value) {
    _numChildren(node, path, map);
  }
  return map;
});

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
    v-for="({ path, node }, i) of nodeArray"
    :key="nodeKey(node)"
    :node="node"
    :path="path.join(',')"
    :numChildren="childrenMap.get(path.join(','))"
    :numAbove="i"
  ></NodeRow>
</template>

<style scoped></style>
