import { computed, reactive, ref, watchEffect } from "vue";
import { useMarkwhenStore } from "../markwhenStore";

export const usePageEffect = <T>(defaultPageState: () => T) => {
  const markwhenStore = useMarkwhenStore();

  const pageState = reactive({} as { [pageIndex: number]: T });

  watchEffect(() => {
    const pageIndex = markwhenStore.pageIndex;
    if (!pageState[pageIndex]) {
      // If we do not have state for this page, give it the default
      pageState[pageIndex] = defaultPageState();
    }
  });

  markwhenStore.$onAction(({ name, store, args, after }) => {
    if (name === "setPageIndex") {
      const pageIndex = args[0];
      if (!pageState[pageIndex]) {
        pageState[pageIndex] = defaultPageState();
      }
    }
  });

  return computed(() => pageState[markwhenStore.pageIndex]);
};
