import { sorts } from "@markwhen/parser";
import type { Sort } from "@markwhen/parser/lib/Sort";
import type { Event, EventSubGroup } from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";
import { computed } from "vue";
import { usePageEffect } from "./composables/usePageEffect";
import { transform } from "./composables/useTransform";
import { usePageStore } from "./pageStore";

export const useTransformStore = defineStore("transform", () => {
  const pageStore = usePageStore();

  const sort = usePageEffect(() => "none" as Sort);
  const filter = usePageEffect(() => [] as string[]);
  const filterUntagged = usePageEffect(() => false);

  const setSort = (s: Sort) => (sort.value = s);
  const clear = () => {
    filterUntagged.value = false;
    while (filter.value.length) {
      filter.value.pop();
    }
  };
  const toggleSort = () =>
    (sort.value = sorts[(sorts.indexOf(sort.value) + 1) % sorts.length]);
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

  const events = computed(() => [...pageStore.pageTimeline.events]);

  // TODO: optimize/memoize this or something. It does not need
  // to be recomputed on page change, we should save it
  const transformedEvents = computed(() =>
    transform(events.value, sort.value, filter.value, filterUntagged.value)
  );

  return {
    // state
    sort,
    filter,
    filterUntagged,

    // actions
    setSort,
    clear,
    toggleSort,
    filterTag,
    toggleFilterUntagged,

    // getters
    transformedEvents,
  };
});
