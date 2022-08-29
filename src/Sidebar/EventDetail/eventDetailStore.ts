import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { useSidebarStore } from "../sidebarStore";
import type { Event, EventSubGroup } from "@markwhen/parser/lib/Types";
import { usePageEffect } from "@/Markwhen/composables/usePageEffect";
import { useTransformStore, type EventPath } from "@/Markwhen/transformStore";

const equivalentPaths = (path1: EventPath, path2: EventPath): boolean =>
  path1.length > 0 &&
  path2.length > 0 &&
  path1.length === path2.length &&
  path1.every((pathValue, index) => path2[index] === pathValue);

export const useEventDetailStore = defineStore("eventDetail", () => {
  const sidebarStore = useSidebarStore();
  const transformStore = useTransformStore();

  const width = ref(450);
  const visible = ref(false);
  const detailEventPath = usePageEffect(() => [] as EventPath);
  const detailEvent = ref<Event | EventSubGroup>();

  const setWidth = (w: number) => {
    width.value = w;
  };

  const toggle = () => {
    visible.value = !visible.value;
  };

  const setDetailEventPath = (path: EventPath) => {
    if (equivalentPaths(path, detailEventPath.value)) {
      detailEventPath.value = [];
    } else {
      detailEventPath.value = path;
      visible.value = true;
    }
    if (!sidebarStore.visible) {
      sidebarStore.toggle();
    }
  };

  const isLeft = computed(() => !sidebarStore.isLeft);
  watchEffect(() => {
    const eventOrGroupFromPath = transformStore.eventOrGroupFromPath(
      detailEventPath.value
    );
    if (eventOrGroupFromPath) {
      detailEvent.value = eventOrGroupFromPath;
    } else {
      detailEvent.value = undefined;
      detailEventPath.value = [];
    }
  });

  const isDetailEventPath = computed(() => (path: EventPath) => {
    return (
      path.length > 0 &&
      path.length === detailEventPath.value.length &&
      path.every(
        (pathValue, index) => detailEventPath.value[index] === pathValue
      )
    );
  });

  const prev = computed(() => {
    
  })

  const next = computed(() => {
    if (!detailEventPath.value || !detailEventPath.value.length) {
      return;
    }
    if (detailEventPath.value.length === 1) {
      const nextPath = [detailEventPath.value[0] + 1];
      if (transformStore.eventOrGroupFromPath(nextPath)) {
        return nextPath;
      }
    } else {
      const nextInGroup = [
        detailEventPath.value[0],
        detailEventPath.value[1] + 1,
      ];
      if (transformStore.eventOrGroupFromPath(nextInGroup)) {
        return nextInGroup;
      }
      const next = [detailEventPath.value[0] + 1];
      if (transformStore.eventOrGroupFromPath(next)) {
        return next;
      }
    }
  });

  return {
    // state
    visible,
    width,
    detailEvent,
    detailEventPath,

    // actions
    setWidth,
    setDetailEventPath,
    toggle,

    // getters
    isLeft,
    isDetailEventPath,
    prev,
    next,
  };
});
