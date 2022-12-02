import { usePageStore } from "@/Markwhen/pageStore";
import { computed } from "vue";

export const usePageAdjustedRanges = () => {
  const pageStore = usePageStore();

  const rangeOffset = computed(
    () => pageStore.pageTimelineMetadata.startStringIndex
  );
  const adjustedRanges = computed(() =>
    pageStore.pageTimeline.ranges.map(({ from, to, type, content }) => ({
      type,
      content,
      from: from - rangeOffset.value,
      to: to - rangeOffset.value,
    }))
  );

  return { rangeOffset, adjustedRanges };
};
