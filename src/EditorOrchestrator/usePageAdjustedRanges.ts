import {
  useEventFinder,
  type EventPath,
} from "@/Markwhen/composables/useEventFinder";
import { usePageStore } from "@/Markwhen/pageStore";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { Event } from "@markwhen/parser/lib/Types";
import { computed } from "vue";

export const usePageAdjustedRanges = () => {
  const pageStore = usePageStore();
  const eventFinder = useEventFinder();

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
  const isEventPath = (arg: any): arg is EventPath => {
    return !!arg.type && !!arg.path;
  };
  const rangeInTextWithOffset = computed(() => (e: SomeNode | EventPath) => {
    let node;
    if (isEventPath(e)) {
      node = eventFinder(e);
    } else {
      node = e;
    }

    if (!node) {
      return;
    }

    let from, to;
    if (node.isEventNode()) {
      from = node.eventValue().ranges.event.from;
      to = node.eventValue().ranges.event.to;
    } else {
      from = node.rangeInText!.from;

      const lastOfGroup = node.getLast().node;
      to = lastOfGroup.isEventNode()
        ? lastOfGroup.eventValue().ranges.event.to
        : lastOfGroup.rangeInText?.to;
      to = to ?? node.rangeInText!.to;
    }
    return {
      from: from - rangeOffset.value,
      to: to - rangeOffset.value,
    };
  });

  return { rangeOffset, adjustedRanges, rangeInTextWithOffset };
};
