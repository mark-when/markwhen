import { isEditable } from "@/injectionKeys";
import {
  equivalentPaths,
  type EventPath,
  type EventPaths,
} from "@/Views/ViewOrchestrator/useStateSerializer";
import { computed, inject, ref, watchEffect } from "vue";
import { useTimelineStore } from "../timelineStore";

export const useIsHoveredInEditor = (p: EventPath | EventPaths) => {
  const timelineStore = useTimelineStore();
  const currentlyHovering = computed(
    () => timelineStore.hoveringEventPaths || undefined
  );
  const editable = inject(isEditable);
  const isHoveredInEditor = ref(false);

  watchEffect(() => {
    isHoveredInEditor.value =
      !!editable &&
      equivalentPaths(
        currentlyHovering.value?.pageFiltered,
        "type" in p ? p : p["pageFiltered"]
      );
  });

  return { isHoveredInEditor };
};
