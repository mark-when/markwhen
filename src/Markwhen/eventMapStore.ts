import {
  Event,
  type Events,
  type EventSubGroup,
} from "@markwhen/parser/lib/Types";
import LRUCache from "lru-cache";
import { defineStore } from "pinia";
import { computed } from "vue";
import type { EventPath } from "./composables/useEventFinder";
import { usePageStore } from "./pageStore";
import { useTransformStore } from "./transformStore";

type EventPathMap = [number[], Map<number, EventPath>];
export type EventPaths = { [pathType in EventPath["type"]]?: EventPath };

const mapCache = new LRUCache({ max: 100 })

const buildMap = (events: Events, type: EventPath["type"]): EventPathMap => {
  const keys = [] as number[];
  const map = new Map<number, EventPath>();

  // TODO: this doesn't need to run as often, or make it more efficient/smarter
  for (let i = 0; i < events.length; i++) {
    const eventOrEvents = events[i];
    if (eventOrEvents instanceof Event) {
      const stringIndex = eventOrEvents.ranges.event.from;
      keys.push(stringIndex);
      map.set(stringIndex, { type, path: [i] });
    } else {
      const stringIndex = eventOrEvents.rangeInText?.from;
      if (stringIndex !== undefined) {
        keys.push(stringIndex);
        map.set(stringIndex, { type, path: [i] });
      }
      for (let j = 0; j < eventOrEvents.length; j++) {
        const event = eventOrEvents[j];
        const stringIndex = event.ranges.event.from;
        keys.push(stringIndex);
        map.set(stringIndex, { type, path: [i, j] });
      }
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

const indexFromEventOrIndex = (
  eventOrStartIndex: number | Event | EventSubGroup
): number => {
  if (typeof eventOrStartIndex === "number") {
    return eventOrStartIndex;
  } else if (eventOrStartIndex instanceof Event) {
    return eventOrStartIndex.ranges.event.from;
  } else {
    return eventOrStartIndex.rangeInText!.from;
  }
};

export const useEventMapStore = defineStore("eventMap", () => {
  const transformStore = useTransformStore();
  const pageStore = usePageStore();

  const pageEvents = computed(() => pageStore.pageTimeline.events);
  const transformedEvents = computed(() => transformStore.transformedEvents);

  const pageMap = computed(() => {
    console.log("building page map");
    const [keys, map] = buildMap(pageEvents.value, "page");
    return (eventOrStartIndex: number | Event | EventSubGroup) =>
      getter(indexFromEventOrIndex(eventOrStartIndex), keys, map);
  });

  const transformedMap = computed(() => {
    console.log("building transform map");
    const [keys, map] = buildMap(transformedEvents.value, "pageFiltered");
    return (eventOrStartIndex: number | Event | EventSubGroup) =>
      getter(indexFromEventOrIndex(eventOrStartIndex), keys, map);
  });

  const getAllPaths = computed(
    () =>
      (eventOrStartIndex: number | Event | EventSubGroup): EventPaths => ({
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
