import { useDebounceFn, useThrottleFn } from "@vueuse/core";
import { onMounted, onUnmounted, watch, type Ref, ref } from "vue";
import { useMarkersStore } from "../Markers/markersStore";
import { useTimelineStore } from "../timelineStore";

export const useHoveringMarker = (el: Ref<HTMLElement | null>) => {
  const markersStore = useMarkersStore();
  const timelineStore = useTimelineStore();

  const x = ref(0);

  const mouseMove = (e: MouseEvent) => {
    x.value = e.clientX;
  };

  const findHovering = useThrottleFn((mouseX: number) => {
    const range = markersStore.rangeFromOffsetLeft(mouseX);
    const hovering = markersStore.markers.find(
      (m) => +range[0].dateTime === +m.dateTime
    );
    markersStore.setHoveringMarker(hovering);
    markersStore.setRange(range);
  }, 50);

  watch(x, findHovering);

  const trigger = () => findHovering(x.value);
  watch(() => timelineStore.pageScale, trigger);

  onMounted(() => el.value?.addEventListener("mousemove", mouseMove));
  onUnmounted(() => el.value?.removeEventListener("mousemove", mouseMove));

  return { trigger };
};
