import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import { useNewEventStore } from "@/NewEvent/newEventStore";
import {
  toDateRange,
  toDateRangeIso,
  type DateRange,
  type DateRangeIso,
} from "@markwhen/parser/lib/Types";
import { ref, watchEffect, type Ref, watch, toRaw, unref } from "vue";
import { useLpc } from "./useLpc";
import { useStateSerializer, type EventPath } from "./useStateSerializer";

export const useViewOrchestrator = (
  frame: Ref<HTMLIFrameElement | undefined>
) => {
  const stateSerializer = useStateSerializer();
  const eventDetailStore = useEventDetailStore();
  const editorOrchestrator = useEditorOrchestratorStore();
  const newEventStore = useNewEventStore();

  const trigger = ref(false);
  const lpc = useLpc(frame, {
    state: () => {
      trigger.value = !trigger.value;
    },
    setDetailPath: (path) => {
      if (path) {
        eventDetailStore.setDetailEventPath(path);
      } else {
        eventDetailStore.clearDetailEventPath();
      }
    },
    setHoveringPath: (path) => {
      if (path) {
        if (
          path.path.join(",") !==
          editorOrchestrator.hoveringEventPaths?.pageFiltered?.path.join(",")
        )
          editorOrchestrator.setHoveringEventPath(path);
      } else {
        editorOrchestrator.clearHoveringEvent();
      }
    },
    showInEditor: (path) => {
      editorOrchestrator.showInEditor(path);
    },
    newEvent({ dateRangeIso, immediate, granularity }) {
      if (immediate) {
        editorOrchestrator.createEventFromRange(
          toDateRange(dateRangeIso),
          granularity
            ? granularity === "instant"
              ? "minute"
              : granularity
            : "day"
        );
      } else {
        newEventStore.prompt({
          range: dateRangeIso,
        });
      }
    },
    key(key: string) {},
  });

  watchEffect(() => {
    // we're watching this so the view can request a state update
    trigger.value;
    lpc.postRequest("state", toRaw(stateSerializer.value));
  });

  const jumpToRange = (range: DateRange | DateRangeIso) =>
    lpc.postRequest("jumpToRange", {
      dateRangeIso: "fromDateTimeIso" in range ? range : toDateRangeIso(range),
    });

  const jumpToPath = (path: EventPath) => {
    lpc.postRequest("jumpToPath", {
      path,
    });
  };

  return {
    jumpToRange,
    jumpToPath,
  };
};
