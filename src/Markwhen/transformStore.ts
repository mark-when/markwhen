import { sorts } from "@markwhen/parser";
import type { Sort } from "@markwhen/parser/lib/Sort";
import sortEvents from "@markwhen/parser/lib/Sort";
import {
  type Events,
  Event,
  type EventSubGroup,
} from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";
import { useMarkwhenStore } from "./markwhenStore";

export const useTransformStore = defineStore("transform", {
  state: () => ({
    sort: "none" as Sort,
    filter: [] as string[],
  }),
  actions: {
    setSort(sort: Sort) {
      this.sort = sort;
    },
    setFilter(filter: string[]) {
      this.filter = filter;
    },
    toggleSort() {
      this.sort = sorts[(sorts.indexOf(this.sort) + 1) % sorts.length]
    }
  },
  getters: {
    transformedEvents(): Events {
      const { pageTimeline } = useMarkwhenStore();
      const events = [...pageTimeline.events]
      if (!this.filter.length) {
        return sortEvents(events, this.sort);
      }
      const filtered = [];
      for (const eventOrEvents of events) {
        if (eventOrEvents instanceof Event) {
          if (
            eventOrEvents.event.tags.some((tag) => this.filter.includes(tag))
          ) {
            filtered.push(eventOrEvents);
          }
        } else {
          const group = eventOrEvents as EventSubGroup;
          if (group.tags?.some((tag) => this.filter.includes(tag))) {
            filtered.push(group);
          } else {
            const filteredSubEvents: EventSubGroup = group.filter(
              (event: Event) =>
                event.event.tags.some((tag) => this.filter.includes(tag))
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
