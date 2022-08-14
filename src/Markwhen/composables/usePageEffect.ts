import { computed, reactive, watchEffect } from "vue";
import { usePageStore } from "../pageStore";

export const usePageEffect = <T>(defaultPageState: () => T) => {
  const pageStore = usePageStore();

  const pageState = reactive({} as { [pageIndex: number]: T });

  watchEffect(() => {
    const pageIndex = pageStore.pageIndex;
    if (!pageState[pageIndex]) {
      // If we do not have state for this page, give it the default
      pageState[pageIndex] = defaultPageState();
    }
  });

  pageStore.$onAction(({ name, store, args, after }) => {
    if (name === "setPageIndex") {
      const pageIndex = args[0];
      if (!pageState[pageIndex]) {
        pageState[pageIndex] = defaultPageState();
      }
    }
  });

  return computed(() => pageState[pageStore.pageIndex]);
};
