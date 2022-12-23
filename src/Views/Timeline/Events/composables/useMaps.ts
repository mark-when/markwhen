import { eqPath } from "@/Markwhen/composables/useEventFinder";
import { useTransformStore } from "@/Markwhen/transformStore";
import type { NodeArray, SomeNode, Node } from "@markwhen/parser/lib/Node";
import { eventValue, isEventNode, iterate } from "@markwhen/parser/lib/Noder";
import type { Path, Event, Block } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import { useTimelineStore } from "../../timelineStore";

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
export const useMaps = () => {
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

  const visibleNodes = computed<[PathAndEventNode[], PathAndSectionNode[]]>(
    () => {
      const visibleEvents: PathAndEventNode[] = [];
      const visibleSections: PathAndSectionNode[] = [];
      for (const pathAndNode of nodeArray.value) {
        if (timelineStore.isCollapsedChild(pathAndNode.path)) {
          continue;
        }
        const joinedPath = pathAndNode.path.join(",");
        if (!isEventNode(pathAndNode.node)) {
          if (pathAndNode.path.length > 0) {
            const numAbove = predecessorMap.value.get(joinedPath) || 0;
            const children = childrenMap.value.get(joinedPath) || 0;
            const top = 100 + numAbove * 30;
            const height = 30 + children * 30;
            const vp = timelineStore.pageSettings.viewport;

            // if (top + height > vp.top + 200 && top - 200 < vp.top + vp.height) {
            visibleSections.push({
              path: pathAndNode.path,
              node: pathAndNode.node as Node<NodeArray>,
            });
            // }
          }
        } else {
          const pAndN = {
            node: pathAndNode.node as Node<Event>,
            path: pathAndNode.path,
          };
          if (
            timelineStore.scrollToPath &&
            eqPath(
              {
                type: "pageFiltered",
                path: pathAndNode.path,
              },
              timelineStore.scrollToPath
            )
          ) {
            visibleEvents.push(pAndN);
          } else {
            const numAbove = predecessorMap.value.get(joinedPath) || 0;
            const top = 100 + numAbove * 30;
            const vp = timelineStore.pageSettings.viewport;
            if (top > vp.top - 300 && top < vp.top + vp.height + 300) {
              visibleEvents.push(pAndN);
            }
          }
        }
      }
      return [visibleEvents, visibleSections];
    }
  );

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
    nodeArray,
    visibleNodes,
    childrenMap,
    predecessorMap,
  };
};
