import { usePageStore } from "@/Markwhen/pageStore";
import { COMPLETION_REGEX } from "@markwhen/parser/lib/regex";
import type { Event } from "@markwhen/parser/lib/Types";
import type { MaybeRef } from "@vueuse/core";
import { ref, watchEffect, type Ref, watch, unref } from "vue";
import {
  dateRangeIsoComparator,
  stringArrayComparator,
  supplementalComparator,
  matchedListItemsComparator,
  bothDefined,
  recurrenceComparator,
} from "@/Markwhen/utilities/eventComparator";
import { toInnerHtml } from "@/Markwhen/utilities/innerHtml";

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
  event: MaybeRef<Event | undefined>,
  isEventRow: () => boolean = () => true
) => {
  const pageStore = usePageStore();

  const cachedEventComputed = <T>(
    val: () => T,
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
    () => unref(event)!.dateRangeIso,
    dateRangeIsoComparator
  );

  const eventLocations = cachedEventComputed(
    () => unref(event)?.eventDescription?.locations || [],
    stringArrayComparator
  );

  const completed = cachedEventComputed(
    () => unref(event)?.eventDescription.completed
  );

  const supplemental = cachedEventComputed(
    () => unref(event)?.eventDescription?.supplemental || [],
    supplementalComparator
  );

  const percent = cachedEventComputed(
    () => unref(event)?.eventDescription?.percent
  );

  const matchedListItems = cachedEventComputed(
    () => unref(event)?.eventDescription?.matchedListItems || [],
    matchedListItemsComparator
  );

  const tags = cachedEventComputed(
    () => unref(event)?.eventDescription?.tags || [],
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

  const dateText = cachedEventComputed(() => {
    const e = unref(event);
    if (e?.recurrenceRangeInText?.content) {
      return e.recurrenceRangeInText.content;
    }
    return toInnerHtml(e?.dateText || "");
  });

  const titleHtml = cachedEventComputed(() => {
    const ed = unref(event)?.eventDescription?.eventDescription;
    if (!ed) {
      return "";
    }
    return toInnerHtml(
      ed.replace(COMPLETION_REGEX, (a, b) => a.substring(b.length))
    );
  });

  const recurrence = cachedEventComputed(
    () => unref(event)?.recurrence,
    recurrenceComparator
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
    completed,
    recurrence,
  };
};
