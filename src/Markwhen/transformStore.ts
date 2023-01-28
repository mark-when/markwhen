import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { usePageEffect } from "./composables/usePageEffect";
import { transformRoot } from "./composables/useTransform";
import { usePageStore } from "./pageStore";

export const sorts = ["none", "down", "up"] as Sort[];
export type Sort = "none" | "down" | "up";

export const useTransformStore = defineStore("transform", () => {
  const pageStore = usePageStore();

  const sort = usePageEffect(() => "none" as Sort);
  const filter = usePageEffect(() => [] as string[]);
  const filterUntagged = usePageEffect(() => false);
  const filterDialogShowing = ref(false);

  const setSort = (s: Sort) => (sort.value = s);
  const clear = () => {
    filterUntagged.value = false;
    filter.value = [];
  };
  const toggleSort = () =>
    (sort.value = sorts[(sorts.indexOf(sort.value) + 1) % sorts.length]);

  const addFilterTag = (tag: string) => {
    if (!pageStore.pageTimeline.tags[tag]) {
      return
    }
    const index = filter.value.indexOf(tag);
    if (index >= 0) {
      return;
    }
    filter.value.push(tag);
  };

  const filterTag = (tag: string) => {
    const index = filter.value.indexOf(tag);
    if (index >= 0) {
      filter.value.splice(index, 1);
    } else {
      filter.value.push(tag);
    }
  };
  const toggleFilterUntagged = () =>
    (filterUntagged.value = !filterUntagged.value);

  const setFilterDialogShowing = (showing: boolean) => {
    filterDialogShowing.value = showing;
  };

  // const events = computed(() => [...pageStore.pageTimeline.events]);

  // TODO: optimize/memoize this or something. It does not need
  // to be recomputed on page change, we should save it
  const transformedEvents = computed(() =>
    transformRoot(
      pageStore.pageTimeline.events,
      filter.value,
      filterUntagged.value,
      sort.value
    )
  );

  return {
    // state
    sort,
    filter,
    filterUntagged,
    filterDialogShowing,

    // actions
    setSort,
    clear,
    toggleSort,
    filterTag,
    toggleFilterUntagged,
    setFilterDialogShowing,
    addFilterTag,

    // getters
    transformedEvents,
  };
});
