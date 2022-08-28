import { sorts } from "@markwhen/parser";
import type { Sort } from "@markwhen/parser/lib/Sort";
import sortEvents from "@markwhen/parser/lib/Sort";
import {
  type Events,
  Event,
  type EventSubGroup,
} from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";
import { computed, watch } from "vue";
import { usePageEffect } from "./composables/usePageEffect";
import { usePageStore } from "./pageStore";

export type EventPath = number[];
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
  const transformedEvents = computed(() => {
    const includeUntagged = filterUntagged.value;

    const filterFunction = (e: Event | EventSubGroup): boolean => {
      const tags = e instanceof Event ? e.event.tags : e.tags;
      if (includeUntagged) {
        if (tags?.length === 0) {
          return true;
        }
        if (filter.value.length) {
          return tags?.some((tag) => filter.value.includes(tag)) || false;
        }
        return false;
      }
      if (!filter.value.length) {
        return true;
      }
      return tags?.some((tag) => filter.value.includes(tag)) || false;
    };

    let filtered = [];
    for (const eventOrEvents of events.value) {
      if (eventOrEvents instanceof Event) {
        if (filterFunction(eventOrEvents)) {
          filtered.push(eventOrEvents);
        }
      } else {
        const group = [...eventOrEvents] as EventSubGroup;
        group.range = eventOrEvents.range;
        group.tags = eventOrEvents.tags;
        group.title = eventOrEvents.title;
        group.startExpanded = eventOrEvents.startExpanded;
        group.style = eventOrEvents.style;
        group.rangeInText = eventOrEvents.rangeInText;
        if (filterFunction(group)) {
          filtered.push(group);
        } else {
          const filteredSubEvents: EventSubGroup = group.filter(filterFunction);
          if (filteredSubEvents.length) {
            filteredSubEvents.range = group.range;
            filteredSubEvents.tags = group.tags;
            filteredSubEvents.title = group.title;
            filteredSubEvents.startExpanded = group.startExpanded;
            filteredSubEvents.style = group.style;
            filteredSubEvents.rangeInText = group.rangeInText;
            filtered.push(filteredSubEvents);
          }
        }
      }
    }
    filtered = sortEvents(filtered, sort.value);
    return filtered;
  });

  // TODO: binary search this
  const findPath = computed(
    () =>
      (e: Event | EventSubGroup | undefined): EventPath => {
        if (!e) {
          return [];
        }
        return e instanceof Event ? findEventPath(e) : findEventSubGroupPath(e);
      }
  );

  const findEventPath = (e: Event): EventPath => {
    for (let i = 0; i < transformedEvents.value.length; i++) {
      const eventOrGroup = transformedEvents.value[i];
      if (eventOrGroup instanceof Event) {
        if (eventOrGroup.ranges.event.from === e.ranges.event.from) {
          return [i];
        }
      } else {
        const group = eventOrGroup as EventSubGroup;
        for (let j = 0; j < group.length; j++) {
          if (group[j].ranges.event.from === e.ranges.event.from) {
            return [i, j];
          }
        }
      }
    }
    return [];
  };

  const findEventSubGroupPath = (e: EventSubGroup): EventPath => {
    const groupIndex = transformedEvents.value.findIndex(
      (eventOrGroup) =>
        !(eventOrGroup instanceof Event) &&
        (eventOrGroup as EventSubGroup).rangeInText?.from ===
          e.rangeInText?.from
    );
    return groupIndex >= 0 ? [groupIndex] : [];
  };

  const eventOrGroupFromPath = computed(
    () =>
      (path: EventPath): Event | EventSubGroup | undefined => {
        if (path.length === 0) {
          return;
        }
        if (path.length === 1) {
          return transformedEvents.value[path[0]];
        }
        if (path.length === 2) {
          const subGroup = transformedEvents.value[path[0]] as EventSubGroup;
          if (subGroup && subGroup.length && path[1] < subGroup.length) {
            return subGroup[path[1]];
          }
        }
        return
      }
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
    findPath,
    eventOrGroupFromPath,
  };
});
