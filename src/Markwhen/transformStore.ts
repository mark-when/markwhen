import { sorts } from "@markwhen/parser";
import type { Sort } from "@markwhen/parser/lib/Sort";
import sortEvents from "@markwhen/parser/lib/Sort";
import {
  type Events,
  Event,
  type EventSubGroup,
} from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";
import { usePageEffect } from "./composables/usePageEffect";
import { usePageStore } from "./pageStore";

export const useTransformStore = defineStore("transform", {
  state: () => ({
    sort: usePageEffect(() => "none" as Sort),
    filter: usePageEffect(() => [] as string[]),
    filterUntagged: usePageEffect(() => false),
  }),
  actions: {
    setSort(sort: Sort) {
      this.sort = sort;
    },
    clear() {
      this.filterUntagged = false;
      while (this.filter.length) {
        this.filter.pop();
      }
    },
    toggleSort() {
      this.sort = sorts[(sorts.indexOf(this.sort) + 1) % sorts.length];
    },
    filterTag(tag: string) {
      const index = this.filter.indexOf(tag);
      if (index >= 0) {
        this.filter.splice(index, 1);
      } else {
        this.filter.push(tag);
      }
    },
    toggleFilterUntagged() {
      this.filterUntagged = !this.filterUntagged
    },
  },
  getters: {
    transformedEvents(): Events {
      const pageStore = usePageStore();
      const pageTimeline = pageStore.pageTimeline;
      const events = [...pageTimeline.events];
      if (!this.filter.length) {
        return sortEvents(events, this.sort);
      }
      const includeUntagged = this.filterUntagged
      const filtered = [];
      for (const eventOrEvents of events) {
        if (eventOrEvents instanceof Event) {
          const eventTags = eventOrEvents.event.tags;
          if (
            eventTags.some((tag) => this.filter.includes(tag)) ||
            (includeUntagged && eventTags.length === 0)
          ) {
            filtered.push(eventOrEvents);
          }
        } else {
          const group = eventOrEvents as EventSubGroup;
          if (
            group.tags?.some((tag) => this.filter.includes(tag)) ||
            (includeUntagged && group.tags?.length === 0)
          ) {
            filtered.push(group);
          } else {
            const filteredSubEvents: EventSubGroup = group.filter(
              (event: Event) =>
                event.event.tags.some((tag) => this.filter.includes(tag)) ||
                (includeUntagged && event.event.tags.length === 0)
            );
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
      sortEvents(filtered, this.sort);
      return filtered;
    },
  },
});
