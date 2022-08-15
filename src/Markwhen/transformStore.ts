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

export const useTransformStore = defineStore("transform", () => {
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

  const transformedEvents = computed(() => {
    const pageStore = usePageStore();
    const pageTimeline = pageStore.pageTimeline;
    const events = [...pageTimeline.events];
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
        return false
      }
      if (!filter.value.length) {
        return true;
      }
      return tags?.some((tag) => filter.value.includes(tag)) || false;
    };

    const filtered = [];
    for (const eventOrEvents of events) {
      if (eventOrEvents instanceof Event) {
        if (filterFunction(eventOrEvents)) {
          filtered.push(eventOrEvents);
        }
      } else {
        const group = eventOrEvents as EventSubGroup;
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
            filtered.push(filteredSubEvents);
          }
        }
      }
    }
    sortEvents(filtered, sort.value);
    return filtered;
  });

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