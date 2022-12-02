import type { SomeNode } from "@markwhen/parser/lib/Node";
import type { MaybeRef } from "@vueuse/core";
import { computed, ref, unref, watchEffect } from "vue";
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

export const useEventFinder = (
  path?: MaybeRef<EventPath | EventPaths | undefined>
) => {
  const transformStore = useTransformStore();
  const pageStore = usePageStore();
  const transformedEvents = computed(() => transformStore.transformedEvents);

  const isEventPath = (e: EventPath | EventPaths): e is EventPath => {
    return (e as EventPath).path && Array.isArray((e as EventPath).path);
  };

  const event = ref<SomeNode>();

  watchEffect(() => {
    if (!path) {
      event.value = undefined;
      return;
    }
    const eventPath = unref(path);
    if (!eventPath) {
      event.value = undefined;
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
        event.value = undefined;
        throw new Error("unimplemented");
      }
      event.value = node ? node.get(eventPath.path) : undefined;
      return;
    } else {
      const types: EventPath["type"][] = ["page", "pageFiltered", "whole"];
      for (const type of types) {
        if (!eventPath[type]) {
          event.value = undefined;
          continue;
        }
        let root: SomeNode | undefined;
        if (type === "pageFiltered") {
          root = transformedEvents.value;
        } else if (type === "page") {
          root = pageStore.pageTimeline.events;
        }
        if (root) {
          event.value = root.get(eventPath[type]!.path);
          return;
        }
      }
    }
    event.value = undefined;
  });

  return event;
};
