<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import type { NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import {
  isEventNode,
  eventValue,
  iterate,
  get,
} from "@markwhen/parser/lib/Noder";
import type { Path, Block } from "@markwhen/parser/lib/Types";
import { computed, watchEffect, type Ref } from "vue";
import { useTimelineStore } from "../timelineStore";
import NodeRow from "./NodeRow.vue";

const transformStore = useTransformStore();
const timelineStore = useTimelineStore();

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
  const pathJoined = path.join(",");
  const saved = childrenMap.get(pathJoined);
  if (saved) {
    return saved;
  }

  const cache = (childCount: number) => {
    childrenMap.set(pathJoined, childCount);
    return childCount;
  };

  if (timelineStore.isCollapsed(pathJoined) || isEventNode(node)) {
    return cache(0);
  }

  const arr = node.value as NodeArray;
  const children = arr.reduce((prev, curr, i) => {
    return prev + 1 + _numChildren(curr, [...path, i], childrenMap);
  }, 0);
  return cache(children);
};

// top level is always an array
const nodes = computed(() => transformStore.transformedEvents);

const nodeArray = computed(
  () => toArray(nodes.value) as { path: Path; node: SomeNode }[]
);

const visibleNodes = computed(() => {
  const visible = [];
  for (const pathAndNode of nodeArray.value) {
    if (!timelineStore.isCollapsedChild(pathAndNode.path)) {
      if (!isEventNode(pathAndNode.node)) {
        visible.push(pathAndNode);
      } else if (
        timelineStore.scrollToPath &&
        eqPath(
          {
            type: "pageFiltered",
            path: pathAndNode.path,
          },
          timelineStore.scrollToPath
        )
      ) {
        visible.push(pathAndNode);
      } else {
        const numAbove =
          predecessorMap.value.get(pathAndNode.path.join(",")) || 0;
        const top = 100 + numAbove * 30;
        const vp = timelineStore.pageSettings.viewport;
        if (top > vp.top - 300 && top < vp.top + vp.height + 300) {
          visible.push(pathAndNode);
        }
      }
    }
  }
  return visible;
});

const childrenMap = computed(() => {
  const map = new Map<string, number>();
  for (const { path, node } of nodeArray.value) {
    _numChildren(node, path, map);
  }
  return map;
});

const numPredecessors = (
  node: SomeNode,
  path: Path,
  map: Map<string, number>,
  childrenMap: Map<string, number>
) => {
  const ourPathJoined = path.join(",");

  const cache = (numPreds: number) => {
    map.set(ourPathJoined, numPreds);
    return numPreds;
  };

  if (!path.length) {
    return cache(0);
  }

  const prev = map.get(ourPathJoined);
  if (typeof prev !== "undefined") {
    return prev;
  }

  const prevPath = prevSiblingPath(path).join(",");
  let pred = 1 + map.get(prevPath)!;
  if (
    prevPath.length &&
    ourPathJoined.length &&
    prevPath.split(",").length === ourPathJoined.split(",").length
  ) {
    pred += childrenMap.get(prevPath) || 0;
  }
  return cache(pred);
};

const predecessorMap = computed(() => {
  const map = new Map<string, number>();
  for (const { path, node } of nodeArray.value) {
    numPredecessors(node, path, map, childrenMap.value);
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

const styleForItem = (i: number) => {
  const visibleNode = visibleNodes.value[i];
  const style = { position: "absolute" } as any;
  if (visibleNode) {
    const joinedPath = visibleNode.path.join(",");
    const numAbove = predecessorMap.value.get(joinedPath);
    const top = 100 + 30 * (numAbove || 0);
    style.top = `${top}px`;
    if (!isEventNode(visibleNode.node)) {
      const numChildren = childrenMap.value.get(joinedPath);
      style.height = `${30 + 30 * (numChildren || 0)}px`;
    } else {
      style.height = "30px";
    }
    return style;
  } else {
    style.display = "none";
    return style;
  }
};
</script>

<template>
  <div
    v-for="(_, i) of 5"
    :key="(visibleNodes[i] && nodeKey(visibleNodes[i].node)) || i"
    :style="styleForItem(i)"
    class="bg-gray-100/10 w-full"
  >
    <EventRow v-bind="refsForEvent(visibleNodes[i].node.value)"></EventRow>
    <!-- <NodeRow
      :key="(visibleNodes[i] && nodeKey(visibleNodes[i].node)) || i"
      :node="visibleNodes[i].node"
      :path="visibleNodes[i].path.join(',')"
      :numChildren="childrenMap.get(visibleNodes[i].path.join(','))"
      :numAbove="predecessorMap.get(visibleNodes[i].path.join(',')) || 0"
    ></NodeRow> -->
  </div>
</template>
