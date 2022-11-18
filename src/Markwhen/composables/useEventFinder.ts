import type { Event, Events, EventSubGroup } from "@markwhen/parser/lib/Types";
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

export const useEventFinder = () => {
  const transformStore = useTransformStore();
  const pageStore = usePageStore();
  const transformedEvents = computed(() => transformStore.transformedEvents);

  const isEventPath = (e: EventPath | EventPaths): e is EventPath => {
    return (e as EventPath).path && Array.isArray((e as EventPath).path);
  };

  const eventOrGroupFromPath = (
    eventPath?: EventPath | EventPaths | null
  ): Event | EventSubGroup | undefined => {
    if (!eventPath) {
      return;
    }
    if (isEventPath(eventPath)) {
      const path = eventPath.path;
      let events: Events;
      if (eventPath.type === "pageFiltered") {
        events = transformedEvents.value;
      } else if (eventPath.type === "page") {
        events = pageStore.pageTimeline.events;
      } else {
        throw new Error("unimplemented");
      }

      if (path.length === 0) {
        return;
      }
      if (path.length === 1) {
        return events[path[0]];
      }
      if (path.length === 2) {
        const subGroup = events[path[0]] as EventSubGroup;
        if (subGroup && subGroup.length && path[1] < subGroup.length) {
          return subGroup[path[1]];
        }
      }
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

  return eventOrGroupFromPath;
};
