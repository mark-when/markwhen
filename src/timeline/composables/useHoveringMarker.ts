import { useMouse } from "@vueuse/core";
import { computed, watch } from "vue";
import { useMarkersStore } from "../markers/markersStore";

export const useHoveringMarker = () => {
  const { x } = useMouse();
  watch(x, (val) => {
    const markersStore = useMarkersStore();

    const range = computed(() => markersStore.rangeFromOffsetLeft(x.value));

    const hovering = markersStore.markers.find(
      (m) => +range.value[0].dateTime === +m.dateTime
    );
    markersStore.setHoveringMarker(hovering);
  });
};
