import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useMarkersStore } from "@/Views/Timeline/Markers/markersStore";
import type { OffsetRange } from "@/Views/Timeline/utilities/dateTimeUtilities";
import { computed, ref } from "vue";

export const useCreateEvent = () => {
  const markersStore = useMarkersStore();
  const editorOrchestrator = useEditorOrchestratorStore();

  const startEventCreationRange = ref<OffsetRange>();
  const creatingEventRange = ref<OffsetRange>();

  const stopCreating = () => {
    startEventCreationRange.value = undefined;
    creatingEventRange.value = undefined;
    window.removeEventListener("mousemove", extendCreatingEvent);
    window.removeEventListener("mouseup", createEventFromRange);
    window.removeEventListener("keydown", stopCreatingKeyboardListener);
  };

  const stopCreatingKeyboardListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      stopCreating();
    }
  };

  const extendCreatingEvent = (e: MouseEvent | TouchEvent) => {
    const clientX =
      typeof TouchEvent !== "undefined" && e instanceof TouchEvent
        ? e.touches[0].clientX
        : (e as MouseEvent).clientX;
    const range = markersStore.rangeFromOffsetLeft(clientX) as OffsetRange;
    const tempCreatingEventRange = [];
    tempCreatingEventRange.push(
      range[0].left < startEventCreationRange.value![0].left
        ? range[0]
        : startEventCreationRange.value![0]
    );
    tempCreatingEventRange.push(
      range[1].left > startEventCreationRange.value![1].left
        ? range[1]
        : startEventCreationRange.value![1]
    );
    creatingEventRange.value = tempCreatingEventRange as OffsetRange;
  };

  const createEventFromRange = (e: MouseEvent | TouchEvent) => {
    const rangeToCreate = creatingEventRange.value
      ? creatingEventRange.value
      : startEventCreationRange.value;

    editorOrchestrator.createEventFromRange(
      rangeToCreate
        ? {
            fromDateTime: rangeToCreate[0].dateTime,
            toDateTime: rangeToCreate[1].dateTime,
          }
        : undefined
    );

    stopCreating();
  };

  const mouseDownTouchStartListener = (e: MouseEvent | TouchEvent) => {
    startEventCreationRange.value = markersStore.range;

    window.addEventListener("touchmove", extendCreatingEvent);
    window.addEventListener("touchend", createEventFromRange);
    window.addEventListener("mousemove", extendCreatingEvent);
    window.addEventListener("mouseup", createEventFromRange);
    window.addEventListener("keydown", stopCreatingKeyboardListener);
  };

  const newEventPosition = computed(() =>
    creatingEventRange.value ? creatingEventRange.value : markersStore.range
  );

  const creating = computed(() => !!startEventCreationRange.value);

  return { mouseDownTouchStartListener, newEventPosition, creating };
};
