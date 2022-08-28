import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { watchEffect } from "vue";
import { useMarkwhenStore } from "../markwhenStore";
import { usePageStore } from "../pageStore";

export const usePageEffects = () => {
  const editorOrchestrator = useEditorOrchestratorStore();
  const pageStore = usePageStore();
  const markwhenStore = useMarkwhenStore();

  editorOrchestrator.$onAction(({ name, store, args, after }) => {
    switch (name) {
      case "addPage":
        // it's either timelines.length or timelines.length + 1
        const newLength = markwhenStore.timelines.length;
        after(() => pageStore.setPageIndex(newLength));
        break;
      case "deletePage":
        const index = args[0];
        if (markwhenStore.timelines.length === 1) {
          break;
        }
        if (
          pageStore.pageIndex === index &&
          index === markwhenStore.timelines.length - 1
        ) {
          pageStore.setPageIndex(index - 1);
        } else if (index < pageStore.pageIndex) {
          pageStore.setPageIndex(index - 1);
        }
    }
  });

  watchEffect(() => {
    const numPages = markwhenStore.timelines.length;
    if (pageStore.pageIndex >= numPages) {
      pageStore.setPageIndex(pageStore.pageIndex - 1);
    }
  });
};
