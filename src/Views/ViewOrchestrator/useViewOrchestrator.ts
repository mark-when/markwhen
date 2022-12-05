import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import { ref, watchEffect, type Ref, watch, toRaw } from "vue";
import { useLpc } from "./useLpc";
import { useStateSerializer } from "./useStateSerializer";

export const useViewOrchestrator = (frame: Ref<HTMLIFrameElement>) => {
  const stateSerializer = useStateSerializer();
  const eventDetailStore = useEventDetailStore();
  const editorOrchestrator = useEditorOrchestratorStore();

  const frameLoaded = ref(false);
  const lpc = useLpc(frame, {
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

  watchEffect(() => {
    if (!frame.value) {
      return;
    }
    if (!frameLoaded.value) {
      frame.value.onload = () => {
        frameLoaded.value = true;
      };
    } else {
      lpc.postRequest("state", toRaw(stateSerializer.value));
    }
  });
};
