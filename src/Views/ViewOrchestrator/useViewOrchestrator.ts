import { ref, watchEffect, type Ref, watch, toRaw } from "vue";
import { useLpc } from "./useLpc";
import { useStateSerializer } from "./useStateSerializer";

export const useViewOrchestrator = (frame: Ref<HTMLIFrameElement>) => {
  const stateSerializer = useStateSerializer();

  const frameLoaded = ref(false);
  const lpc = useLpc(frame);

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
