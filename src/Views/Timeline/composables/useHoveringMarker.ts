import { useMouse } from "@vueuse/core";
import { watch } from "vue";
import { useMarkersStore } from "../Markers/markersStore";
import { useTimelineStore } from "../timelineStore";

export const useHoveringMarker = () => {
  const { x } = useMouse();
  const markersStore = useMarkersStore();
  const timelineStore = useTimelineStore();

  const findHovering = (mouseX: number) => {
    const range = markersStore.rangeFromOffsetLeft(mouseX);
    const hovering = markersStore.markers.find(
      (m) => +range[0].dateTime === +m.dateTime
    );
    markersStore.setHoveringMarker(hovering);
    markersStore.setRange(range)
  };

  watch(x, findHovering);

  const trigger = () => findHovering(x.value);
  watch(() => timelineStore.pageScale, trigger);

  return { trigger };
};
