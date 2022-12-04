import type { SomeNode } from "@markwhen/parser/lib/Node";
import { isEventNode, eventValue, iterate } from "@markwhen/parser/lib/Noder";
import type { Event } from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";
import { computed } from "vue";
import type { EventPath } from "./composables/useEventFinder";
import { usePageStore } from "./pageStore";
import { useTransformStore } from "./transformStore";

type EventPathMap = [number[], Map<number, EventPath>];
export type EventPaths = { [pathType in EventPath["type"]]?: EventPath };

const buildMap = (
  events: SomeNode | undefined,
  type: EventPath["type"]
): EventPathMap => {
  const keys = [] as number[];
  const map = new Map<number, EventPath>();

  if (!events) {
    return [keys, map];
  }

  // TODO: this doesn't need to run as often, or make it more efficient/smarter
  for (const { path, node } of iterate(events)) {
    const stringIndex = isEventNode(node)
      ? eventValue(node).rangeInText.from
      : node.rangeInText?.from;
    if (stringIndex !== undefined) {
      keys.push(stringIndex);
      map.set(stringIndex, { type, path });
    }
  }

  if (keys.length !== map.size) {
    throw new Error("Mismatched keys and map size");
  }
  return [keys, map];
};

const getter = (index: number, keys: number[], map: Map<number, EventPath>) => {
  let left = 0;
  let right = keys.length - 1;
  while (left <= right) {
    let mid = Math.floor((right + left) / 2);
    if (keys[mid] === index) {
      return map.get(keys[mid]);
    } else if (keys[mid] < index) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  if (keys[left] < keys[right]) {
    return map.get(keys[left]);
  }
  return map.get(keys[right]);
};

const indexFromEventOrIndex = (eventOrStartIndex: number | Event): number => {
  if (typeof eventOrStartIndex === "number") {
    return eventOrStartIndex;
  }
  return eventOrStartIndex.rangeInText.from;
};

export const useEventMapStore = defineStore("eventMap", () => {
  const transformStore = useTransformStore();
  const pageStore = usePageStore();

  const pageEvents = computed(() => pageStore.pageTimeline.events);
  const transformedEvents = computed(() => transformStore.transformedEvents);

  const pageMap = computed(() => {
    console.log("building page map");
    const [keys, map] = buildMap(pageEvents.value, "page");
    return (eventOrStartIndex: number | Event) =>
      getter(indexFromEventOrIndex(eventOrStartIndex), keys, map);
  });

  const transformedMap = computed(() => {
    console.log("building transform map");
    const [keys, map] = buildMap(transformedEvents.value, "pageFiltered");
    return (eventOrStartIndex: number | Event) =>
      getter(indexFromEventOrIndex(eventOrStartIndex), keys, map);
  });

  const getAllPaths = computed(
    () =>
      (eventOrStartIndex: number | Event): EventPaths => ({
        page: pageMap.value(eventOrStartIndex),
        pageFiltered: transformedMap.value(eventOrStartIndex),
      })
  );

  return {
    getPagePath: pageMap,
    getTransformedPath: transformedMap,
    getAllPaths,
  };
});
