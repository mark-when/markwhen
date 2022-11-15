import {
  useEventFinder,
  type EventPath,
} from "@/Markwhen/composables/useEventFinder";
import { usePageStore } from "@/Markwhen/pageStore";
import { type EventSubGroup, Event } from "@markwhen/parser/lib/Types";
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
  const rangeInTextWithOffset = computed(
    () => (e: Event | EventSubGroup | EventPath) => {
      let event;
      if (isEventPath(e)) {
        event = eventFinder(e);
      } else {
        event = e;
      }

      if (!event) {
        return;
      }

      let from, to;
      if (event instanceof Event) {
        from = event.ranges.event.from;
        to = event.ranges.event.to;
      } else {
        from = event.rangeInText!.from;
        to = event[event.length - 1]
          ? event[event.length - 1].ranges.event.to
          : event.rangeInText!.to;
      }
      return {
        from: from - rangeOffset.value,
        to: to - rangeOffset.value,
      };
    }
  );

  return { rangeOffset, adjustedRanges, rangeInTextWithOffset };
};
