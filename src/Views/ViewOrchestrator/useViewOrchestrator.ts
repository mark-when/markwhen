import { useAppStore } from "@/App/appStore";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import { ref, watchEffect, type Ref, watch } from "vue";
import { useLpc } from "./useLpc";

export const useViewOrchestrator = (frame: Ref<HTMLIFrameElement>) => {
  const appStore = useAppStore();
  const markwhenStore = useMarkwhenStore();
  const transformStore = useTransformStore();

  const frameLoaded = ref(false);
  const lpc = useLpc(frame);

  watch(frameLoaded, (loaded) => {
    if (loaded) {
      lpc.postRequest("init", {
        isDark: appStore.inferredDarkMode,
        markwhen: transformStore.transformedEvents,
        rawText: markwhenStore.rawTimelineString,
      });
    }
  });

  watchEffect(() => {
    if (!frameLoaded.value) {
      return;
    }
    lpc.postRequest("theme", { isDark: appStore.inferredDarkMode });
  });

  watchEffect(() => {
    if (!frameLoaded.value) {
      return;
    }
    lpc.postRequest("update", {
      text: markwhenStore.rawTimelineString,
      parsed: transformStore.transformedEvents,
    });
  });

  watchEffect(() => {
    if (!frame.value) {
      return;
    }

    frame.value.onload = () => {
      frameLoaded.value = true;
    };
  });
};
