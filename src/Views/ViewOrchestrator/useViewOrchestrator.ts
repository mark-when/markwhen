import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import { ref, watchEffect, type Ref, watch, toRaw, unref } from "vue";
import { useLpc } from "./useLpc";
import { useStateSerializer } from "./useStateSerializer";

export const useViewOrchestrator = (
  frame: Ref<HTMLIFrameElement | undefined>
) => {
  const stateSerializer = useStateSerializer();
  const eventDetailStore = useEventDetailStore();
  const editorOrchestrator = useEditorOrchestratorStore();

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
        editorOrchestrator.setHoveringEventPath(path);
      } else {
        editorOrchestrator.clearHoveringEvent();
      }
    },
  });

  return watchEffect(() => {
    // we're watching this so the view can request a state update
    trigger.value;
    lpc.postRequest("state", toRaw(stateSerializer.value));
  });
};
