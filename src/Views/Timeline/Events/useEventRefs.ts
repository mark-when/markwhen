import { usePageStore } from "@/Markwhen/pageStore";
import type { Event } from "@markwhen/parser/lib/Types";
import { watch, ref, watchEffect, type Ref } from "vue";
import {
  dateRangeIsoComparator,
  stringArrayComparator,
  supplementalComparator,
  matchedListItemsComparator,
} from "../utilities/eventComparator";
import { toInnerHtml } from "../utilities/innerHtml";

const cachedComputed = <T>(
  val: () => T,
  comparator: (a: T, b: T) => boolean,
  condition: () => boolean,
  defaultValue?: T
) => {
  // @ts-ignore
  const r = ref<T>(defaultValue);
  watchEffect(() => {
    if (!condition()) {
      return;
    }
    if (!r.value || !comparator(r.value, val())) {
      r.value = val();
    }
  });
  return r;
};

export const useEventRefs = (event: Ref<Event>, isEventRow: () => boolean) => {
  const pageStore = usePageStore();

  const cachedEventComputed = <T>(
    val: () => T,
    comparator: (a: T, b: T) => boolean,
    defaultValue?: T
  ) => cachedComputed(val, comparator, isEventRow, defaultValue);

  const eventRange = cachedEventComputed(
    () => event.value.dateRangeIso,
    dateRangeIsoComparator
  );

  const eventLocations = cachedEventComputed(
    () => event.value.eventDescription.locations,
    stringArrayComparator
  );

  const supplemental = cachedEventComputed(
    () => event.value.eventDescription.supplemental,
    supplementalComparator
  );

  const percent = cachedEventComputed(
    () => event.value.eventDescription.percent,
    (a, b) => a === b
  );

  const matchedListItems = cachedEventComputed(
    () => event.value.eventDescription.matchedListItems,
    matchedListItemsComparator
  );

  const tags = cachedEventComputed(
    () => event.value.eventDescription.tags,
    stringArrayComparator
  );

  const color = ref<string>();
  watchEffect(() => {
    if (!isEventRow()) {
      return;
    }
    const eventColor = tags.value.length
      ? pageStore.tags[tags.value[0]]
      : undefined;
    if (color.value !== eventColor) {
      color.value = eventColor;
    }
  });

  const dateText = cachedEventComputed(
    () => event.value.getDateHtml(),
    (a, b) => a === b
  );

  const titleHtml = cachedEventComputed(
    () => toInnerHtml(event.value.eventDescription.eventDescription),
    (a, b) => a === b
  );

  return {
    eventRange,
    eventLocations,
    supplemental,
    percent,
    matchedListItems,
    tags,
    color,
    dateText,
    titleHtml,
  };
};
