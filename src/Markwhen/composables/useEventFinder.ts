import type { SomeNode } from "@markwhen/parser/lib/Node";
import { computed } from "vue";
import type { EventPaths } from "../eventMapStore";
import { usePageStore } from "../pageStore";
import { useTransformStore } from "../transformStore";

export interface EventPath {
  type: "whole" | "page" | "pageFiltered";
  path: number[];
}

export const eqPath = (ep: EventPath, eps: EventPaths): boolean => {
  const path = eps[ep.type]?.path;
  if (path?.length !== ep.path.length) {
    return false;
  }
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== ep.path[i]) {
      return false;
    }
  }
  return true;
};

export type EventFinder = (
  eventPath?: EventPath | EventPaths | null
) => SomeNode | undefined;

export const useEventFinder = () => {
  const transformStore = useTransformStore();
  const pageStore = usePageStore();
  const transformedEvents = computed(() => transformStore.transformedEvents);

  const isEventPath = (e: EventPath | EventPaths): e is EventPath => {
    return (e as EventPath).path && Array.isArray((e as EventPath).path);
  };

  const eventOrGroupFromPath = (
    eventPath?: EventPath | EventPaths | null
  ): SomeNode | undefined => {
    if (!eventPath) {
      return;
    }
    if (isEventPath(eventPath)) {
      const path = eventPath.path;
      let node: SomeNode | undefined;
      if (eventPath.type === "pageFiltered") {
        node = transformedEvents.value;
      } else if (eventPath.type === "page") {
        node = pageStore.pageTimeline.events;
      } else {
        throw new Error("unimplemented");
      }
      return node ? node.get(path) : undefined;
    } else {
      const types: EventPath["type"][] = ["page", "pageFiltered", "whole"];
      for (const type of types) {
        const event = eventOrGroupFromPath(eventPath[type]);
        if (event) {
          return event;
        }
      }
    }
  };

  return eventOrGroupFromPath as EventFinder;
};
