import { usePageStore } from "@/Markwhen/pageStore";
import { COMPLETION_REGEX } from "@markwhen/parser/lib/regex";
import type { Event } from "@markwhen/parser/lib/Types";
import { ref, watchEffect, type Ref, watch } from "vue";
import {
  dateRangeIsoComparator,
  stringArrayComparator,
  supplementalComparator,
  matchedListItemsComparator,
  bothDefined,
} from "../utilities/eventComparator";
import { toInnerHtml } from "../utilities/innerHtml";

const cachedComputed = <T>(
  val: () => T | undefined,
  comparator: (a: T | undefined, b: T | undefined) => boolean,
  condition: () => boolean,
  defaultValue?: T
) => {
  // @ts-ignore
  const r: Ref<T | undefined> = ref(defaultValue ? defaultValue : undefined);
  watchEffect(() => {
    if (!condition()) {
      return;
    }
    const value = val();
    if (typeof value === "undefined") {
      r.value = undefined;
    } else if (!r.value || !comparator(r.value, value)) {
      r.value = value;
    }
  });
  return r;
};

export const useEventRefs = (
  event: Ref<Event | undefined>,
  isEventRow: () => boolean = () => true
) => {
  const pageStore = usePageStore();

  const cachedEventComputed = <T>(
    val: () => T | undefined,
    comparator: (a: T, b: T) => boolean = (a, b) => a === b,
    defaultValue?: T
  ) =>
    cachedComputed(
      val,
      (a, b) => bothDefined(a, b) && comparator(a!, b!),
      isEventRow,
      defaultValue
    );

  const eventRange = cachedEventComputed(
    () => event.value?.dateRangeIso,
    dateRangeIsoComparator
  );

  const eventLocations = cachedEventComputed(
    () => event.value?.eventDescription?.locations,
    stringArrayComparator
  );

  const completed = cachedEventComputed(
    () => event.value?.eventDescription.completed
  );

  const supplemental = cachedEventComputed(
    () => event.value?.eventDescription?.supplemental,
    supplementalComparator
  );

  const percent = cachedEventComputed(
    () => event.value?.eventDescription?.percent
  );

  const matchedListItems = cachedEventComputed(
    () => event.value?.eventDescription?.matchedListItems,
    matchedListItemsComparator
  );

  const tags = cachedEventComputed(
    () => event.value?.eventDescription?.tags,
    stringArrayComparator
  );

  const color = ref<string>();
  watchEffect(() => {
    if (!isEventRow()) {
      return;
    }
    const eventColor = tags.value?.length
      ? pageStore.tags[tags.value[0]]
      : undefined;
    if (color.value !== eventColor) {
      color.value = eventColor;
    }
  });

  const dateText = cachedEventComputed(() =>
    toInnerHtml(event.value?.dateText || "")
  );

  const titleHtml = cachedEventComputed(() => {
    const ed = event.value?.eventDescription?.eventDescription;
    if (!ed) {
      return undefined;
    }
    return toInnerHtml(
      ed.replace(COMPLETION_REGEX, (a, b) => a.substring(b.length))
    );
  });

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
    completed,
  };
};
