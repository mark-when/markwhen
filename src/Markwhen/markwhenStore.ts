import { exampleTimeline } from "@/exampleTimeline";
import { parse } from "@markwhen/parser";
import sortEvents, { type EventSubGroup } from "@markwhen/parser/lib/Sort";
import {
  Event,
  type Events,
  type Tags,
  type Timeline,
  type TimelineMetadata,
} from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";

export type Sort = "none" | "down" | "up";

export const useMarkwhenStore = defineStore({
  id: "markwhen",
  state: () => ({
    rawTimelineString: exampleTimeline,
    pageIndex: 0,
    sort: "none" as Sort,
    filter: [] as String[],
  }),
  getters: {
    timelines(state): Timeline[] {
      return parse(state.rawTimelineString).timelines;
    },
    pageTimeline(state): Timeline {
      return this.timelines[this.pageIndex];
    },
    pageTimelineMetadata(state): TimelineMetadata {
      return this.pageTimeline.metadata;
    },
    pageTimelineString(state): string {
      const selectedTimelineMetadata = this.pageTimeline.metadata;
      return (
        this.rawTimelineString.slice(
          selectedTimelineMetadata.startStringIndex,
          selectedTimelineMetadata.endStringIndex
        ) || ""
      );
    },
    tags(state): Tags {
      return this.pageTimeline.tags;
    },
    filteredAndSortedEvents(state): Events {
      const events = this.pageTimeline.events;
      const filter = this.filter;
      if (filter.length === 0) {
        return sortEvents([...events], this.sort);
      }

      const filtered = [];
      for (const eventOrEvents of events) {
        if (eventOrEvents instanceof Event) {
          if (eventOrEvents.event.tags.some((tag) => filter.includes(tag))) {
            filtered.push(eventOrEvents);
          }
        } else {
          const group = eventOrEvents as EventSubGroup;
          if (group.tags?.some((tag) => filter.includes(tag))) {
            filtered.push(group);
          } else {
            const filteredSubEvents: EventSubGroup = group.filter(
              (event: Event) =>
                event.event.tags.some((tag) => filter.includes(tag))
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
      return sortEvents([...filtered], this.sort);
    },
  },
});
