import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { useEventListener } from "@vueuse/core";

// @ts-ignore
export const vscodeApi = acquireVsCodeApi();

export const useVsCode = () => {
  const markwhenStore = useMarkwhenStore();
  useEventListener("message", (event) => {
    const message = event.data;
    switch (message.type) {
      case "update":
        const text = message.text;
        markwhenStore.setRawTimelineString(text);
    }
  });
};
