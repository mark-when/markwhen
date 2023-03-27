import { ranges } from "@/utilities/ranges";
import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useMarkwhenStore } from "./markwhenStore";

export const recurrenceLimit = 100;

export const usePageStore = defineStore("page", () => {
  const pageIndex = ref<number>(0);
  const markwhenStore = useMarkwhenStore();

  const setPageIndex = (index: number) => {
    pageIndex.value = index;
  };

  const pageTimeline = computed(() => markwhenStore.timelines[pageIndex.value]);
  const pageRange = computed(
    () =>
      ranges(pageTimeline.value.events, recurrenceLimit) || {
        fromDateTime: DateTime.now().minus({ years: 5 }),
        toDateTime: DateTime.now().plus({ years: 5 }),
      }
  );
  const pageRangeFrom = computed(() => pageRange.value.fromDateTime.toISO());
  const pageRangeTo = computed(() => pageRange.value.toDateTime.toISO());
  const pageTimelineMetadata = computed(() => pageTimeline.value.metadata);
  const header = computed(() => pageTimeline.value.header)
  const tags = computed(() => pageTimeline.value.tags);

  const pageTimelineString = computed(() =>
    markwhenStore.rawTimelineString.slice(
      pageTimelineMetadata.value.startStringIndex,
      pageTimelineMetadata.value.endStringIndex
    )
  );

  return {
    // state
    pageIndex,

    // actions
    setPageIndex,

    // getters
    pageTimeline,
    pageTimelineMetadata,
    pageTimelineString,
    header,
    tags,
    pageRange,
    pageRangeFrom,
    pageRangeTo,
  };
});
