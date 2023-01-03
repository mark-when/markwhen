import { eqPath } from "@/Markwhen/composables/useEventFinder";
import { useTransformStore } from "@/Markwhen/transformStore";
import { ranges } from "@/utilities/ranges";
import type { NodeArray, SomeNode, Node } from "@markwhen/parser/lib/Node";
import { eventValue, isEventNode, iterate } from "@markwhen/parser/lib/Noder";
import type { Path, Event, Block } from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";
import { computed, reactive, ref, watch, watchEffect } from "vue";
import { useTimelineStore } from "./timelineStore";

const prevSiblingPath = (path: Path) => {
  if (path[path.length - 1] === 0) {
    return path.slice(0, -1);
  }
  return [...path.slice(0, -1), path[path.length - 1] - 1];
};

export const nodeKey = (n: SomeNode) => {
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

export const walk = (
  node: SomeNode,
  path: Path,
  fn: (node: SomeNode, path: Path) => void
) => {
  fn(node, path);
  if (!isEventNode(node)) {
    const arr = node.value as NodeArray;
    for (let i = 0; i < arr.length; i++) {
      walk(arr[i], [...path, i], fn);
    }
  }
};

const toArray = (node: SomeNode | undefined) => {
  if (!node) {
    return [];
  }
  const array = [] as { path: Path; node: SomeNode }[];
  walk(node, [], (n, path) => {
    array.push({ path, node: n });
  });
  return array;
};

export type Style = {
  height?: string;
  top?: string;
};
export type PathAndNode = { path: Path; node: SomeNode };
export interface PathAndEventNode extends PathAndNode {
  node: Node<Event>;
}
export interface PathAndSectionNode extends PathAndNode {
  node: Node<NodeArray>;
}

export const useNodeStore = defineStore("nodes", () => {
  const transformStore = useTransformStore();
  const timelineStore = useTimelineStore();

  const nodes = computed(() => transformStore.transformedEvents);

  const nodeArray = computed(
    () => toArray(nodes.value) as { path: Path; node: SomeNode }[]
  );

  const _numChildren = (
    node: SomeNode,
    path: number[],
    childrenMap: Map<string, number>
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

  let eventNodeKey = 0;
  const eventNodeKeyMap = reactive(new Map<string, number>());
  const assignEventKeys = (
    nodes: PathAndEventNode[]
  ): (PathAndEventNode & { key: string })[] => {
    const visible = nodes.map((p) => p.path.join(","));
    const newlyAvailableKeys = [] as number[];

    // Go through paths that have keys already
    // If there are any that are not visible, remove them
    // and mark those keys as available.
    for (const hasKey of eventNodeKeyMap.keys()) {
      if (!visible.includes(hasKey)) {
        newlyAvailableKeys.push(eventNodeKeyMap.get(hasKey)!);
        eventNodeKeyMap.delete(hasKey);
      }
    }

    // Meanwhile, mark the nodes that don't have any keys
    // If there is a (newly recycled) key to assign to it,
    // do that, otherwise, get a new one
    for (const visibleNode of visible) {
      if (!eventNodeKeyMap.has(visibleNode)) {
        const recycledKey = newlyAvailableKeys.pop();
        if (typeof recycledKey !== "undefined") {
          eventNodeKeyMap.set(visibleNode, recycledKey);
        } else {
          eventNodeKeyMap.set(visibleNode, eventNodeKey++);
        }
      }
    }

    return nodes.map((n) => ({
      ...n,
      key: "" + eventNodeKeyMap.get(n.path.join(",")),
    }));
  };

  const visibleNodes = computed<
    [(PathAndEventNode & { key: string })[], PathAndSectionNode[]]
  >(() => {
    const visibleEvents: PathAndEventNode[] = [];
    const visibleSections: PathAndSectionNode[] = [];
    for (const { path, node } of nodeArray.value) {
      if (timelineStore.isCollapsedChild(path)) {
        continue;
      }
      const joinedPath = path.join(",");
      if (!isEventNode(node)) {
        if (path.length > 0) {
          const numAbove = predecessorMap.value.get(joinedPath) || 0;
          const children = childrenMap.value.get(joinedPath) || 0;
          const top = 100 + numAbove * 30;
          const height = 30 + children * 30;
          const vp = timelineStore.pageSettings.viewport;

          const bottomOfSection = top + height;
          const topOfSection = top;
          const topOfVp = vp.top - 100;
          const bottomOfVp = vp.top + vp.height + 100;

          if (topOfSection > bottomOfVp) {
            continue;
          } else if (bottomOfSection < topOfVp) {
            continue;
          } else {
            visibleSections.push({
              path: path,
              node: node as Node<NodeArray>,
            });
          }
        }
      } else {
        const pAndN = {
          node: node as Node<Event>,
          path: path,
        };
        if (
          timelineStore.scrollToPath &&
          eqPath(
            {
              type: "pageFiltered",
              path: path,
            },
            timelineStore.scrollToPath
          )
        ) {
          visibleEvents.push(pAndN);
        } else {
          const numAbove = predecessorMap.value.get(joinedPath) || 0;
          const top = 100 + numAbove * 30;
          const vp = timelineStore.pageSettings.viewport;
          if (top > vp.top - 100 && top < vp.top + vp.height + 100) {
            if (timelineStore.mode === "gantt") {
              visibleEvents.push(pAndN);
            } else {
              const range = ranges(pAndN.node)!;
              const left =
                timelineStore.pageScaleBy24 *
                timelineStore.scalelessDistanceFromBaselineLeftmostDate(
                  range.fromDateTime
                );
              const width =
                timelineStore.pageScaleBy24 *
                timelineStore.scalelessDistanceBetweenDates(
                  range.fromDateTime,
                  range.toDateTime
                );
              if (
                left < vp.left + vp.width + 50 ||
                vp.left < left + width + 50
              ) {
                visibleEvents.push(pAndN);
              }
            }
          }
        }
      }
    }
    return [assignEventKeys(visibleEvents), visibleSections];
  });

  const sectionNodeKeyMap = reactive(new Map<string, number>());
  const sectionKeys = computed(() => {
    const visible = visibleNodes.value[1].map((p) => p.path.join(","));
    const newlyAvailableKeys = [] as number[];

    // Go through paths that have keys already
    // If there are any that are not visible, remove them
    // and mark those keys as available.
    for (const hasKey of sectionNodeKeyMap.keys()) {
      if (!visible.includes(hasKey)) {
        newlyAvailableKeys.push(sectionNodeKeyMap.get(hasKey)!);
        sectionNodeKeyMap.delete(hasKey);
      }
    }

    // Meanwhile, mark the nodes that don't have any keys
    // If there is a (newly recycled) key to assign to it,
    // do that, otherwise, get a new one
    for (const visibleNode of visible) {
      if (!sectionNodeKeyMap.has(visibleNode)) {
        const recycledKey = newlyAvailableKeys.pop();
        if (typeof recycledKey !== "undefined") {
          sectionNodeKeyMap.set(visibleNode, recycledKey);
        } else {
          sectionNodeKeyMap.set(visibleNode, eventNodeKey++);
        }
      }
    }
    return sectionNodeKeyMap;
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

  const ancestorMap = computed(() => {
    const map = new Map<string, number>();
    for (const { path, node } of nodeArray.value) {
    }
    return map;
  });

  const numAncestors = (
    node: SomeNode,
    path: Path,
    map: Map<string, number>,
    childrenMap: Map<string, number>
  ) => {
    const pathJoined = path.join(",");
    const saved = map.get(pathJoined);
    if (saved) {
      return saved;
    }

    const cache = (ancestorCount: number) => {
      map.set(pathJoined, ancestorCount);
      return ancestorCount;
    };

    const children = childrenMap.get(pathJoined);

    // get all siblings children count
    // get parent's sibling
  };

  return {
    nodes,
    nodeArray,
    visibleNodes,
    childrenMap,
    predecessorMap,
    sectionKeys,
  };
});
