import { PAGE_BREAK, PAGE_BREAK_REGEX } from "@markwhen/parser/lib/regex";
import { defineStore } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import { useMarkwhenStore } from "./markwhenStore";

const pageIndicesFromString = (s: string) => {
  const lines = s.split("\n");
  const lengths = [] as number[];
  const indices = [0] as number[];
  for (let i = 0; i < lines.length - 1; i++) {
    lengths.push(lines[i].length + (lengths[i - 1] || 0) + (i === 0 ? 0 : 1));
    if (lines[i].match(PAGE_BREAK_REGEX)) {
      indices.push(lengths[i - 1]);
    }
  }
  indices.push(s.length);
  return indices;
};

export const usePageStore = defineStore("page", () => {
  const pageIndex = ref<number>(0);
  const markwhenStore = useMarkwhenStore();

  const setPageIndex = (index: number) => (pageIndex.value = index);

  // const pageIndices = computed(() =>
  //   pageIndicesFromString(markwhenStore.rawTimelineString)
  // );
  const pageTimeline = computed(() => markwhenStore.timelines[pageIndex.value]);
  const pageTimelineMetadata = computed(() => pageTimeline.value.metadata);
  const tags = computed(() => pageTimeline.value.tags);

  // const currentPageIndices = computed(() => {
  //   const index = pageIndex.value;
  //   if (index === 0) {
  //     return [
  //       pageIndices.value[pageIndex.value],
  //       pageIndices.value[pageIndex.value + 1],
  //     ];
  //   } else {
  //     return [
  //       pageIndices.value[pageIndex.value] + PAGE_BREAK.length,
  //       pageIndices.value[pageIndex.value + 1],
  //     ];
  //   }
  // });

  const pageTimelineString = computed(() =>
    markwhenStore.rawTimelineString.slice(
      pageTimelineMetadata.value.startStringIndex,
      pageTimelineMetadata.value.endStringIndex
    )
  );

  // watchEffect(() => {
  //   console.log(
  //     currentPageIndices.value,
  //     pageTimelineMetadata.value.startStringIndex,
  //     pageTimelineMetadata.value.endStringIndex
  //   );
  // });

  return {
    // state
    pageIndex,

    // actions
    setPageIndex,

    // getters
    pageTimeline,
    pageTimelineMetadata,
    // startStringIndex: computed(() => currentPageIndices.value[0]),
    // endStringIndex: computed(() => currentPageIndices.value[1]),
    pageTimelineString,
    tags,
  };
});
