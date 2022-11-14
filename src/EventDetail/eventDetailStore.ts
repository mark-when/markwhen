import { ref, computed, watchEffect, watch } from "vue";
import { defineStore } from "pinia";
import { Event, type EventSubGroup } from "@markwhen/parser/lib/Types";
import { usePageEffect } from "@/Markwhen/composables/usePageEffect";
import {
  useEventFinder,
  type EventPath,
} from "@/Markwhen/composables/useEventFinder";
import { PanelDetail, usePanelStore } from "@/Panels/panelStore";

export const equivalentPaths = (p1?: EventPath, p2?: EventPath): boolean => {
  if (!p1 || !p2 || p1.type !== p2.type) {
    return false;
  }
  const path1 = p1.path;
  const path2 = p2.path;

  return (
    path1.length > 0 &&
    path2.length > 0 &&
    path1.length === path2.length &&
    path1.every((pathValue, index) => path2[index] === pathValue)
  );
};

export const useEventDetailStore = defineStore("eventDetail", () => {
  const eventFinder = useEventFinder();
  const panelStore = usePanelStore();

  const detailEventPath = usePageEffect(
    () => undefined as EventPath | undefined
  );
  const detailEvent = ref<Event | EventSubGroup>();
  const shouldOpenDetailWhenJumping = ref(false);

  const setShouldOpenDetailWhenJumping = (should: boolean) => {
    shouldOpenDetailWhenJumping.value = should;
  };
  watch(
    () => panelStore.detailPanelState.visible,
    (visible) => {
      if (!visible) {
        detailEventPath.value = undefined;
      }
    }
  );

  const toggle = () => {
    const show = !panelStore.detailPanelState.visible;
    panelStore.setVisibility(PanelDetail, show);
    if (!show) {
      detailEventPath.value = undefined;
    }
  };

  const setDetailEventPath = (path: EventPath) => {
    if (equivalentPaths(path, detailEventPath.value)) {
      detailEventPath.value = undefined;
    } else {
      detailEventPath.value = path;
      panelStore.setVisibility(PanelDetail, true);
    }
  };

  watchEffect(() => {
    const eventOrGroupFromPath = eventFinder(detailEventPath.value);
    if (eventOrGroupFromPath) {
      detailEvent.value = eventOrGroupFromPath;
    } else {
      detailEvent.value = undefined;
      detailEventPath.value = undefined;
    }
  });

  const isDetailEventPath = computed(
    () => (path: EventPath | undefined) =>
      !!path && equivalentPaths(path, detailEventPath.value)
  );

  const prev = computed<EventPath | undefined>(() => {
    if (!detailEventPath.value) {
      return;
    }
    const { path, type } = detailEventPath.value;
    if (path.length === 1 && path[0] > 0) {
      const prevPath: EventPath = {
        type,
        path: [path[0] - 1],
      };
      const possibleGroup = eventFinder(prevPath);
      if (!possibleGroup) {
        return;
      }
      if (possibleGroup instanceof Event || !possibleGroup.length) {
        return prevPath;
      } else {
        return {
          type,
          path: [prevPath.path[0], possibleGroup.length - 1],
        } as EventPath;
      }
    }
    if (path.length === 2) {
      if (path[1] === 0) {
        const prevPath: EventPath = { type, path: [path[0]] };
        const possibleGroup = eventFinder(prevPath);
        if (possibleGroup) {
          return prevPath;
        }
      } else {
        const prevPath: EventPath = { type, path: [path[0], path[1] - 1] };
        const possibleGroup = eventFinder(prevPath);
        if (possibleGroup) {
          return prevPath;
        }
      }
    }
  });

  const next = computed(() => {
    if (!detailEventPath.value) {
      return;
    }
    const { path, type } = detailEventPath.value;
    if (path.length === 1) {
      const subEvent: EventPath = { type, path: [path[0], 0] };
      if (eventFinder(subEvent)) {
        return subEvent;
      }
      const nextPath: EventPath = { type, path: [path[0] + 1] };
      if (eventFinder(nextPath)) {
        return nextPath;
      }
    } else {
      const nextInGroup: EventPath = { type, path: [path[0]!, path[1]! + 1] };
      if (eventFinder(nextInGroup)) {
        return nextInGroup;
      }
      const next: EventPath = { type, path: [path[0]! + 1] };
      if (eventFinder(next)) {
        return next;
      }
    }
  });

  return {
    // state
    detailEvent,
    detailEventPath,
    shouldOpenDetailWhenJumping,

    // actions
    setDetailEventPath,
    toggle,
    setShouldOpenDetailWhenJumping,

    // getters
    isDetailEventPath,
    prev,
    next,
  };
});
