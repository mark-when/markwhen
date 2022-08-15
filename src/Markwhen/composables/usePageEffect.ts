import {
  computed,
  reactive,
  ref,
  shallowRef,
  watchEffect,
  type Ref,
  type UnwrapRef,
} from "vue";
import { usePageStore } from "../pageStore";

export const usePageEffect = <T>(defaultPageState: () => T) => {
  const pageStore = usePageStore();

  const pageState = reactive({} as { [pageIndex: number]: T });

  watchEffect(() => {
    const pageIndex = pageStore.pageIndex;
    if (pageState[pageIndex] === undefined) {
      // If we do not have state for this page, give it the default
      pageState[pageIndex] = defaultPageState();
    }
  });

  pageStore.$onAction(({ name, store, args, after }) => {
    if (name === "setPageIndex") {
      const pageIndex = args[0];
      if (pageState[pageIndex] === undefined) {
        pageState[pageIndex] = defaultPageState();
      }
    }
  });

  return computed({
    get: () => pageState[pageStore.pageIndex],
    set(newVal: T) {
      pageState[pageStore.pageIndex] = newVal;
    },
  });
};
